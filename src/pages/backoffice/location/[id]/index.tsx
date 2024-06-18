import DeleteDialog from "@/component/DeleteDialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appDataSelector, setSelectedLocation } from "@/store/slices/appSlice";
import { showSnackbar } from "@/store/slices/appSnackbarSlice";
import { deleteLocation, updateLocation } from "@/store/slices/locationSlice";
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Location } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import { WhiteLabelFormControlLabel } from "../../addon-category/[id]";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const MenuDetail = () => {
  //hooks
  const [updateData, setUpdateData] = useState<Location>();
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const { locations, app } = useAppSelector(appDataSelector, shallowEqual);

  const { selectedLocation, isLoading } = app;

  const dispatch = useAppDispatch();
  //validation
  const locationId = Number(router.query.id);
  const location = locations.find((item) => item.id === locationId);

  useEffect(() => {
    if (location) {
      setUpdateData(location);
    }
  }, [location]);

  if (isLoading) {
    return (
      <Box>
        <></>
      </Box>
    );
  }
  if (!updateData) {
    return (
      <Box>
        <Typography>{`didn't found this route...`}</Typography>
      </Box>
    );
  }

  const handleUpdateLocation = () => {
    const shouldUpdateData = updateData.name !== location.name;

    if (!shouldUpdateData) {
      if (selectedLocation.id === updateData.id) {
        dispatch(
          showSnackbar({
            type: "success",
            message: `Changed location to ${selectedLocation.name}`,
          })
        );
      } else {
        dispatch(showSnackbar({ type: "success", message: "nothing changes" }));
      }

      return router.push("/backoffice/location");
    }
    dispatch(
      updateLocation({
        ...updateData,
        onSuccess: () => {
          dispatch(
            showSnackbar({
              type: "success",
              message: "update location successfully",
            })
          );
          router.push("/backoffice/location");
        },
      })
    );
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Button
          variant="outlined"
          sx={{ width: "fit-content", mb: 2 }}
          color="error"
          onClick={() => setOpen(true)}
        >
          Delete
        </Button>
      </Box>
      <Box>
        <DeleteDialog
          open={open}
          setOpen={setOpen}
          title="Delete location"
          content="Are you sure want to delete this location"
          handleDelete={() => {
            dispatch(
              deleteLocation({
                locationId,
                onSuccess: () =>
                  showSnackbar({
                    type: "success",
                    message: "delete location successfully.",
                  }),
              })
            );
            setOpen(false);
            router.push("/backoffice/location");
          }}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", maxWidth: 300 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            sx={{ mb: 2, width: "100%" }}
            defaultValue={updateData.name}
            onChange={(evt) =>
              setUpdateData({ ...updateData, name: evt.target.value })
            }
          />
          {app.theme === "light" ? (
            <WhiteLabelFormControlLabel
              control={
                <Switch
                  checked={selectedLocation?.id === locationId}
                  color={app.theme === "light" ? "primary" : "secondary"}
                  onChange={() => {
                    if (location) {
                      localStorage.setItem(
                        "selectedLocationId",
                        String(location.id)
                      );
                      dispatch(setSelectedLocation(location));
                    }
                  }}
                />
              }
              label="current location"
            />
          ) : (
            <FormControlLabel
              control={
                <Switch
                  checked={selectedLocation?.id === locationId}
                  onChange={() => {
                    if (location) {
                      localStorage.setItem(
                        "selectedLocationId",
                        String(location.id)
                      );
                      dispatch(setSelectedLocation(location));
                    }
                  }}
                />
              }
              label="current location"
            />
          )}

          {/* <TextField
            defaultValue={updateData.street}
            onChange={(evt) =>
              setUpdateData({ ...updateData, street: evt.target.value })
            }
            sx={{ width: "100%", mb: 2 }}
          />
          <TextField
            defaultValue={updateData.township}
            onChange={(evt) =>
              setUpdateData({ ...updateData, township: evt.target.value })
            }
            sx={{ width: "100%", mb: 2 }}
          />
          <TextField
            defaultValue={updateData.city}
            onChange={(evt) =>
              setUpdateData({ ...updateData, city: evt.target.value })
            }
            sx={{ width: "100%", mb: 2 }}
          /> */}
        </Box>
        <Button
          /*    disabled={
            updateData?.name === menuCategory.name &&
            updateData.isAvailable === menuCategory.isAvailable
          } */
          variant="contained"
          sx={{ width: "fit-content" }}
          onClick={handleUpdateLocation}
        >
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default MenuDetail;
