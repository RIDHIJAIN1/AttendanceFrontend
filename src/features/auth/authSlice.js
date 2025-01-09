import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import axios from "axios";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  status: "idle",
  error: null,
  isAuthenticated: !!localStorage.getItem("user"),
};

// Helper to save/remove user data from localStorage
const saveUserToLocalStorage = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
  localStorage.setItem("firebaseId", userData.firebaseId);
};

const clearLocalStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("firebaseId");
};

// Async Thunks
export const checkAuthState = createAsyncThunk("auth/checkAuthState", async () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        const userData = {
          name: user.displayName || "User",
          email: user.email,
          firebaseId: token,
        };
        saveUserToLocalStorage(userData);
        resolve(userData);
      } else {
        clearLocalStorage();
        reject("User is not logged in");
      }
    });
  });
});

export const signupWithEmail = createAsyncThunk("auth/signup", async ({ email, password, name }) => {
  const response = await createUserWithEmailAndPassword(auth, email, password);
  const user = response.user;
  await updateProfile(user, { displayName: name });

  const token = await user.getIdToken();
  const userData = {
    name: user.displayName || "User",
    email: user.email,
    firebaseId: token,
  };

  await axios.post("http://localhost:3002/signup", userData);
  saveUserToLocalStorage(userData);
  return userData;
});

export const signupWithGoogle = createAsyncThunk("auth/signupOrLoginWithGoogle", async () => {
  const provider = new GoogleAuthProvider();
  const response = await signInWithPopup(auth, provider);
  const user = response.user;
  const token = await user.getIdToken();

  const userData = {
    name: user.displayName,
    email: user.email,
    firebaseId: token,
  };

  await axios.post("http://localhost:3002/login", { idToken: token });
  saveUserToLocalStorage(userData);
  return userData;
});

export const loginWithFirebase = createAsyncThunk("auth/login", async ({ email, password }) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();

  const response = await axios.post("http://localhost:3002/login", { idToken: token });
  const userData = {
    ...response.data,
    firebaseId: token,
  };

  saveUserToLocalStorage(userData);
  return userData;
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await signOut(auth);
  clearLocalStorage();
  return {};
});

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle checkAuthState
      .addCase(checkAuthState.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthState.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.error.message;
      })
      // Handle signupWithEmail
      .addCase(signupWithEmail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signupWithEmail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signupWithEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Handle signupWithGoogle
      .addCase(signupWithGoogle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signupWithGoogle.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signupWithGoogle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Handle loginWithFirebase
      .addCase(loginWithFirebase.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginWithFirebase.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginWithFirebase.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Handle logout
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "succeeded";
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default authSlice.reducer;
