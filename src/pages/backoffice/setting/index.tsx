import AppSnackBar from "@/component/AppSnackbar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appDataSelector, setTheme } from "@/store/slices/appSlice";
import { showSnackbar } from "@/store/slices/appSnackbarSlice";
import { selectCompany, updateCompany } from "@/store/slices/companySlice";
import { Theme } from "@/types/app";
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Company } from "@prisma/client";
import { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";

const MenuDetail = () => {
  //hooks
  const [updateData, setUpdateData] = useState<Company>();
  const company = useAppSelector(selectCompany);
  const { app } = useAppSelector(appDataSelector, shallowEqual);
  const dispatch = useAppDispatch();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (company) {
      setUpdateData({ ...company });
    }
  }, [company]);

  if (!updateData) {
    return (
      <Box>
        <Typography>company not found</Typography>
      </Box>
    );
  }

  const handleUpdateData = () => {
    const shouldUpdateData =
      updateData.name !== company.name ||
      updateData.street !== company.street ||
      updateData.township !== company.township ||
      updateData.city !== company.city;

    if (!shouldUpdateData) {
      dispatch(showSnackbar({ type: "success", message: "nothing changes" }));
    }
    dispatch(
      updateCompany({
        ...updateData,
        onSuccess: () => {
          dispatch(
            showSnackbar({
              type: "success",
              message: "update company successfully",
            })
          );
        },
      })
    );
  };
  //expand
  /* const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: "#fff",
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            "#fff"
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor:
            theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
      width: 32,
      height: 32,
      "&::before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      borderRadius: 20 / 2,
    },
  })); */

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        {/* <FormControlLabel
          control={<MaterialUISwitch sx={{ m: 1 }} />}
          label={`use dark mode`}
        /> */}
        <FormControlLabel
          sx={{
            color: app.theme === "light" ? "primary.main" : "secondary.main",
          }}
          control={
            <Switch
              color={app.theme === "light" ? "primary" : "secondary"}
              checked={app.theme === "dark"}
              onChange={(evt, value) => {
                const theme: Theme = value ? "dark" : "light";
                dispatch(setTheme(theme));
                localStorage.setItem("theme", theme);
              }}
            />
          }
          label="use dark mode"
        />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", maxWidth: 300 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            placeholder="name"
            sx={{ mb: 2, width: "100%" }}
            defaultValue={updateData.name}
            onChange={(evt) =>
              setUpdateData({ ...updateData, name: evt.target.value })
            }
          />
          <TextField
            placeholder="street"
            defaultValue={updateData.street}
            onChange={(evt) =>
              setUpdateData({ ...updateData, street: evt.target.value })
            }
            sx={{ width: "100%", mb: 2 }}
          />
          <TextField
            placeholder="township"
            defaultValue={updateData.township}
            onChange={(evt) =>
              setUpdateData({ ...updateData, township: evt.target.value })
            }
            sx={{ width: "100%", mb: 2 }}
          />
          <TextField
            placeholder="city"
            defaultValue={updateData.city}
            onChange={(evt) =>
              setUpdateData({ ...updateData, city: evt.target.value })
            }
            sx={{ width: "100%", mb: 2 }}
          />
        </Box>
        <Button
          /*    disabled={
            updateData?.name === menuCategory.name &&
            updateData.isAvailable === menuCategory.isAvailable
          } */
          variant="contained"
          sx={{ width: "fit-content" }}
          onClick={handleUpdateData}
        >
          Update
        </Button>
      </Box>
      <Box>
        <AppSnackBar />
      </Box>
    </Box>
  );
};

export default MenuDetail;
