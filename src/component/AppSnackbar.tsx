import { Alert, Snackbar } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { hideSnackbar } from "../store/slices/appSnackbarSlice";

const AppSnackBar = () => {
  const { type, open, message } = useAppSelector((state) => state.appSnackbar);
  const dispatch = useAppDispatch();
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={() => dispatch(hideSnackbar())}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <Alert
        onClose={() => dispatch(hideSnackbar())}
        severity={type}
        variant="filled"
        sx={{
          width: "100%",
          bgcolor: type === "success" ? "#87A922" : "#FF8080",
          color: "#FFF6E9",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AppSnackBar;
