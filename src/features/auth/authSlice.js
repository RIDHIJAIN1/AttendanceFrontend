import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import axios from "axios";

const initialState = {
  user: null,
  status: "idle",
  error: null,
};

export const signupWithEmail = createAsyncThunk(
  "auth/signup",
  async ({ email, password, name }) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = response.user;

      // Update the user's displayName
      await updateProfile(user, { displayName: name });

      console.log(`This is my User data`, user);

      // Prepare user data to send to MongoDB
      const userData = {
        name: user.displayName || "User", // Use the updated displayName
        email: user.email,
        firebaseId: user.uid, // Firebase UID
      };

      console.log("Request data", userData);

      await registerUserToMongo(
        userData.name,
        userData.email,
        userData.firebaseId
      );

      return userData; // Optionally return user data for further use
    } catch (error) {
      console.error("Error during signup:", error);
      throw error; // Rethrow the error for handling in the calling function
    }
  }
);

export const registerUserToMongo = async (name, email, firebaseId) => {
  try {
    const response = await axios.post("http://localhost:3002/signup", {
      name,
      email,
      firebaseId,
    });
    console.log("MongoDB Response:", response.data);
  } catch (error) {
    console.error("Error registering user to MongoDB:", error);
    throw error; // Rethrow for higher-level handling
  }
};

export const signupWithGoogle = createAsyncThunk(
  "auth/signupOrLoginWithGoogle",
  async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Sign in or sign up with Google
      const response = await signInWithPopup(auth, provider);
      console.log("Google response:", response.user);

      const user = response.user;
      const token = await user.getIdToken();

      // Prepare user data
      const userData = {
        name: user.displayName,
        email: user.email,
        firebaseId: user.uid,
      };

      console.log("User data from Google:", userData);

      // Check if the user already exists in your backend
      const serverResponse = await axios.post("http://localhost:3002/login", {
        idToken: token,
      });

      if (serverResponse.data.success) {
        // User exists, treat this as a login
        console.log(
          "User exists. Logged in successfully:",
          serverResponse.data
        );
        return { ...userData, ...serverResponse.data }; // Include backend response if needed
      } else {
        // User does not exist, register them
        console.log("User does not exist. Registering...");
        await axios.post("http://localhost:3002/signup", userData);

        return userData; // Return the registered user data
      }
    } catch (error) {
      console.error("Error during Google sign-in or registration:", error);
      throw error;
    }
  }
);

export const loginWithFirebase = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken();
      console.log(`id token  is `, idToken);
      // Optionally send to your backend
      const response = await axios.post("http://localhost:3002/login", {
        idToken,
      });
      console.log(`This is response`, response);
      return response.data; // Return the server's response
    } catch (error) {
      throw error; // This will propagate to Redux Toolkit's `rejected` handler
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await signOut(auth);
    console.log("User logged out successfully");
    return {};
  } catch (error) {
    console.log("Error during logout", error);
    throw error;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signupWithEmail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signupWithEmail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(signupWithEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(signupWithGoogle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signupWithGoogle.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(signupWithGoogle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(loginWithFirebase.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginWithFirebase.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(loginWithFirebase.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default authSlice.reducer;
