import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { APP_URL } from "../../config/config"; 



// Initial State
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  status: "idle",
  error: null,
  isAuthenticated: !!localStorage.getItem("user"),
};

// Helper to save/remove user data from localStorage
const saveUserToLocalStorage = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData.user));
  // console.log(userData.user)
  localStorage.setItem("token", userData.token);
  // console.log("token", userData.token);
};

const clearLocalStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

// Signup with email
export const signupWithEmail = createAsyncThunk(
  "auth/signup",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${APP_URL}/signup`, {
        name,
        email,
        password,
      });

      saveUserToLocalStorage(response.data);
      // console.log(response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Signup failed");
    }
  }
);

// Login with email
export const loginWithEmail = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${APP_URL}/login`, { email, password });
      // console.log("what is posting",response.data);
      if (response.data.user && response.data.token) {
        saveUserToLocalStorage(response.data);
      } else {
        throw new Error("Invalid login response");
      }

      saveUserToLocalStorage(response.data);
      // console.log("what is posted",response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// Google Authentication
// export const signupWithGoogle = createAsyncThunk(
//   "auth/googleAuth",
//   async (token, { rejectWithValue }) => {
//     try{
//       localStorage.setItem('token' , token);
//       return {token};
//     }catch(error){
//       rejectWithValue('Google login failed')
//     }
//   }
// );

// Logout
export const logout = createAsyncThunk("auth/logout", async () => {
  clearLocalStorage();
  return {};
});

// export const checkAuthState = createAsyncThunk("auth/checkAuthState", async () => {
//   const token = localStorage.getItem("token");
//   if (!token) throw new Error("No token found");

//   const response = await axios.get("/api/auth/check", {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return response.data;
// });

export const checkAuthState = createAsyncThunk("auth/checkAuthState", async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");
  console.log("token is this in checkauthsatare", token);
  // Decode token to get user details (Install jwt-decode: `npm install jwt-decode`)
  const jwtDecode = require("jwt-decode");
  const decoded = jwtDecode(token);

  return { user: { id: decoded.userId, email: decoded.email } };
});


// Auth Slice
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
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(signupWithEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loginWithEmail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // .addCase(signupWithGoogle.pending, (state) => {
      //   state.status = "loading";
      // })
      // .addCase(signupWithGoogle.fulfilled, (state, action) => {
      //   state.status = "succeeded";
      //   state.user = action.payload.user;
      //   state.isAuthenticated = true;
      // })
      // .addCase(signupWithGoogle.rejected, (state, action) => {
      //   state.status = "failed";
      //   state.error = action.payload;
      // })
      .addCase(logout.fulfilled, (state) => {
        state.status = "succeeded";
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuthState.pending, (state) => {
        console.log("token is loadinge");
        state.status = "loading";
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        console.log("token is succeddede");
        state.status = "succeeded";
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthState.rejected, (state) => {
        console.log("token is rejected");
        state.status = "failed";
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;
