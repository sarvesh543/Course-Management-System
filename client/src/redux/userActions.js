import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const originalState = {
  user: false,
  authenticated: false,
  registration: true,
  loading: false,
  courses: [],
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
    setRegistration: (state) => {
      state.registration = false;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.authenticated = true;
      state.registration = true;
      localStorage.setItem("token", state.user._id);
    },
    setCoursesAvailable: (state, action) => {
      state.courses = action.payload.courses;
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
let timeout4 = 0;
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (payload, { dispatch }) => {
    dispatch(loadingStart());
    clearTimeout(timeout4);
    try {
      const res = await axios.post("/api/auth/login", payload);
      dispatch(setUser({ user: res.data }));
      // do something after login
    } catch (err) {
      let errObj = {};
      err.response.data.forEach((val) => {
        errObj[val.param] = val.msg;
      });
      dispatch(setErrors(errObj));
      timeout4 = setTimeout(() => dispatch(clearErrors()), 4000);
    }
    dispatch(loadingStop());
  }
);
let timeout0 = 0;
export const signupUser = createAsyncThunk(
  "user/signupUser",
  async (payload, { dispatch }) => {
    dispatch(loadingStart());
    clearTimeout(timeout0);
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
      timeout0 = setTimeout(() => dispatch(clearErrors()), 4000);
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
    }
    dispatch(loadingStop());
  }
);
let timeout1 = 0;
export const getAvailableCourses = createAsyncThunk(
  "user/getAvailableCourses",
  async (payload, { dispatch }) => {
    dispatch(loadingStart());
    clearTimeout(timeout1);
    try {
      const res = await axios.get(
        `/api/user/courseAvailable?userId=${payload}`
      );
      dispatch(setCoursesAvailable({ courses: res.data }));
      // do something after login
    } catch (err) {
      let errObj = {};
      err.response.data.forEach((val) => {
        if (val.param === "registration") dispatch(setRegistration());
        if (val.param === "_id") dispatch(logoutUser());

        errObj[val.param] = val.msg;
      });
      dispatch(setErrors(errObj));
      timeout1 = setTimeout(() => dispatch(clearErrors()), 4000);
    }
    dispatch(loadingStop());
  }
);
let timeout2 = 0;
export const dropCourses = createAsyncThunk(
  "user/dropCourses",
  async (payload, { dispatch, getState }) => {
    dispatch(loadingStart());
    clearTimeout(timeout2);
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
      let errObj = {};
      err.response.data.forEach((val) => {
        if (val.param === "registration") dispatch(setRegistration());
        if (val.param === "_id") dispatch(logoutUser());

        errObj[val.param] = val.msg;
      });
      dispatch(setErrors(errObj));
      timeout2 = setTimeout(() => dispatch(clearErrors()), 4000);
    }
    dispatch(loadingStop());
  }
);
let timeout3 = 0;
export const addCourses = createAsyncThunk(
  "user/addCourses",
  async (payload, { dispatch, getState }) => {
    dispatch(loadingStart());
    clearTimeout(timeout3);
    const { user } = getState().user;
    try {
      const staged = payload.map((course) => course.courseCode);
      const res = await axios.post(`/api/user/addCourses`, {
        _id: user._id,
        toadd: staged,
      });
      dispatch(setUser({ user: res.data }));
      // do something after delete
    } catch (err) {
      let errObj = {};
      err.response.data.forEach((val) => {
        if (val.param === "registration") dispatch(setRegistration());
        if (val.param === "_id") dispatch(logoutUser());

        errObj[val.param] = val.msg;
      });
      dispatch(setErrors(errObj));
      timeout3 = setTimeout(() => dispatch(clearErrors()), 4000);

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
  setCoursesAvailable,
  setRegistration,
} = userSlice.actions;

export default userSlice.reducer;
