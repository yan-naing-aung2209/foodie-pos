import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  BaseUser,
  LoginUserParam,
  RegisterUserParam,
  UserState,
} from "../../types/user";

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (registerUserParam: RegisterUserParam, ThunkApi) => {
    const { email, password } = registerUserParam;

    if (!email || !password) {
      return alert("email & password field required");
    }
    const response = await fetch("http://localhost:5000/register", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    registerUserParam.onSuccess && registerUserParam.onSuccess();
  }
);
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (loginUserParam: LoginUserParam, ThunkApi) => {
    const { email, password } = loginUserParam;

    if (!email || !password) {
      return alert("email & password field required");
    }
    const response = await fetch("http://localhost:5000/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const { token } = await response.json();

    if (!token) alert("invalid email and password!");

    loginUserParam.onSuccess && loginUserParam.onSuccess();
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<BaseUser>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
