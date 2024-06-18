export type SnackbarType = "success" | "error";

export interface AppSnackbarState {
  type: SnackbarType;
  open: boolean;
  message: string;
}
