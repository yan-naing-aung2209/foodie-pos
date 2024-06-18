export interface BaseOption {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}

export interface BaseUser {
  email: string;
  password: string;
}

//for userSlice
export interface RegisterUserParam extends BaseUser, BaseOption {}
export interface LoginUserParam extends BaseUser, BaseOption {}

export interface UserState {
  user: BaseUser | null;
  isLoading: boolean;
  error: Error | null;
}
