import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const originalState = {
  username: "",
  authenticated: false,
  userId: "",
  loading: false,
  errors: {},
};

let timeout = undefined;

axios.defaults.baseURL = process.env.REACT_APP_BACKENDURL;

export const userSlice = createSlice({
  name: "user",
  initialState: originalState,
  reducers: {
    clearErrors: (state) => {
      state.errors = {};
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    loadingStart: (state) => {
      state.loading = true;
    },
    loadingStop: (state) => {
      state.loading = false;
    },
    setUser: (state, action) => {
      state.username = action.payload.username;
      state.authenticated = true;
      state.userId = action.payload.userId;
      localStorage.setItem("token", state.userId);
    },
    logoutUser: (state) => {
      localStorage.removeItem("token");
      state.authenticated = false;
      state.username = "";
      state.userId = "";
      state.loading = false;
      state.errors = {};
    },
  },
});

// all async actions
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (payload, { dispatch }) => {
    dispatch(loadingStart());
    clearTimeout(timeout);
    try {
      const res = await axios.post("/api/auth/login", payload);
      dispatch(
        setUser({ username: res.data.username, userId: res.data.userId })
      );
      // do something after login
    } catch (err) {
      let errObj = {};
      err.response.data.forEach((val) => {
        errObj[val.param] = val.msg;
      });
      dispatch(setErrors(errObj));
      timeout = setTimeout(() => dispatch(clearErrors()), 4000);
    }
    dispatch(loadingStop());
  }
);

export const signupUser = createAsyncThunk(
  "user/signupUser",
  async (payload, { dispatch }) => {
    dispatch(loadingStart());
    clearTimeout(timeout);
    try {
      const res = await axios.post("/api/auth/signup", payload);
      dispatch(
        setUser({ username: res.data.username, userId: res.data.userId })
      );
      // do something after signup
    } catch (err) {
      let errObj = {};
      err.response.data.forEach((val) => {
        errObj[val.param] = val.msg;
      });
      dispatch(setErrors(errObj));
      timeout = setTimeout(() => dispatch(clearErrors()), 4000);
    }
    dispatch(loadingStop());
  }
);

export const getUser = createAsyncThunk(
  "user/getUser",
  async (payload, { dispatch }) => {
    dispatch(loadingStart());
    clearTimeout(timeout);
    try {
      const res = await axios.get(`/api/user?userId=${payload}`);
      dispatch(
        setUser({ username: res.data.username, userId: res.data.userId })
      );
      // do something after login
    } catch (err) {
      dispatch(logoutUser());
      dispatch(loadingStop());
    }
  }
);

export const {
  logoutUser,
  clearErrors,
  setErrors,
  loadingStart,
  loadingStop,
  setUser,
} = userSlice.actions;

export default userSlice.reducer;
