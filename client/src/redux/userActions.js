import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const originalState = {
  user: false,
  authenticated: false,
  loading: false,
  errors: {},
};

let timeout = undefined;

// TODO: change to actual backend url from env file
axios.defaults.baseURL = window.origin;

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
      state.user = action.payload.user;
      state.authenticated = true;
      localStorage.setItem("token", state.user._id);
    },
    logoutUser: (state) => {
      localStorage.removeItem("token");
      state.authenticated = false;
      state.user = false;
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
      console.log(axios.defaults.baseURL)
      const res = await axios.post("/api/auth/login", payload);
      dispatch(setUser({ user: res.data }));
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
      dispatch(setUser({ user: res.data }));
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
      dispatch(setUser({ user: res.data }));
      // do something after login
    } catch (err) {
      dispatch(logoutUser());
      dispatch(loadingStop());
    }
  }
);

export const dropCourses = createAsyncThunk(
  "user/dropCourses",
  async (payload, { dispatch, getState }) => {
    dispatch(loadingStart());
    clearTimeout(timeout);
    const { user } = getState().user;
    try {
      const dropStaged = payload.map((course) => course.courseCode);
      const res = await axios.post(`/api/user/dropCourses`, {
        _id: user._id,
        todrop: dropStaged,
      });
      dispatch(setUser({ user: res.data }));
      // do something after delete
    } catch (err) {
      if (err.response.status === 404) dispatch(logoutUser());
      else {
        let errObj = {};
        err.response.data.forEach((val) => {
          errObj[val.param] = val.msg;
        });
        dispatch(setErrors(errObj));
        timeout = setTimeout(() => dispatch(clearErrors()), 4000);
      }
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
