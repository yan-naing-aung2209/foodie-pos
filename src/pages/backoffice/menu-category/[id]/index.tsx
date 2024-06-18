import AppSnackBar from "@/component/AppSnackbar";
import DeleteDialog from "@/component/DeleteDialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appDataSelector } from "@/store/slices/appSlice";
import { showSnackbar } from "@/store/slices/appSnackbarSlice";
import {
  deleteMenuCategory,
  updateMenuCategory,
} from "@/store/slices/menuCategorySlice";
import { UpdateMenuCategoryPayload } from "@/types/menu-category";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import {
  WhiteCheckboxColor,
  WhiteLabelFormControlLabel,
} from "../../addon-category/[id]";

const MenuCategoryDetail = () => {
  //hooks
  const [updateData, setUpdateData] = useState<UpdateMenuCategoryPayload>();
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const { menuCategories, app, disabledLocationMenuCategories } =
    useAppSelector(appDataSelector, shallowEqual);

  const { selectedLocation } = app;

  const dispatch = useAppDispatch();

  //validation
  const menuCategoryId = Number(router.query.id);
  const menuCategory = menuCategories.find(
    (item) => item.id === menuCategoryId
  );

  const isAvailable = disabledLocationMenuCategories.find(
    (item) =>
      item.menuCategoryId === menuCategoryId &&
      item.locationId === selectedLocation.id
  )
    ? false
    : true;

  //set the default data to the update data
  useEffect(() => {
    if (menuCategory) {
      setUpdateData({
        ...menuCategory,
        isAvailable,
        locationId: selectedLocation.id,
      });
    }
  }, [menuCategory]);

  const handleUpdateData = () => {
    const shouldUpdateData =
      updateData.name !== menuCategory.name ||
      updateData.isAvailable !== isAvailable;

    if (!shouldUpdateData) {
      dispatch(showSnackbar({ type: "success", message: "nothing changes" }));
      return router.push("/backoffice/menu-category");
    }
    dispatch(
      updateMenuCategory({
        ...updateData,
        onSuccess: () => {
          dispatch(
            showSnackbar({
              type: "success",
              message: "update menu category successfully",
            })
          );
          router.push("/backoffice/menu-category");
        },
      })
    );
  };

  const handleDeleteData = () => {
    dispatch(
      deleteMenuCategory({
        menuCategoryId,
        onSuccess: () => {
          dispatch(
            showSnackbar({
              type: "success",
              message: "deleted menu category successfully.",
            })
          );
        },
      })
    );
    setOpen(false);
    router.push("/backoffice/menu-category");
  };

  if (!updateData) {
    return (
      <Box>
        <Typography>{`didn't found this route...`}</Typography>
      </Box>
    );
  }

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
          title="Delete menu category"
          content={`Are you sure want to delete this menu category`}
          handleDelete={handleDeleteData}
        />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", maxWidth: 300 }}>
        <TextField
          defaultValue={updateData.name}
          sx={{ mb: 2, width: "100%" }}
          placeholder="name"
          onChange={(evt) =>
            setUpdateData({ ...updateData, name: evt.target.value })
          }
        />
        {app.theme === "light" ? (
          <FormControlLabel
            control={
              <Checkbox
                checked={updateData.isAvailable}
                sx={{ mb: 2 }}
                onChange={(_, value) => {
                  setUpdateData({
                    ...updateData,
                    isAvailable: value,
                  });
                }}
              />
            }
            label="Available"
          />
        ) : (
          <WhiteLabelFormControlLabel
            sx={{ mb: 2 }}
            control={
              <WhiteCheckboxColor
                checked={updateData.isAvailable}
                onChange={(_, value) => {
                  setUpdateData({
                    ...updateData,
                    isAvailable: value,
                  });
                }}
              />
            }
            label="Available"
          />
        )}

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
      <AppSnackBar />
    </Box>
  );
};

export default MenuCategoryDetail;
