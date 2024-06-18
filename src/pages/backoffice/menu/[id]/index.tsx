import AppMultiSelect from "@/component/AppMultiSelect";
import AppSnackBar from "@/component/AppSnackbar";
import DeleteDialog from "@/component/DeleteDialog";
import FileDropZone from "@/component/FileDropZone";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appDataSelector, uploadAsset } from "@/store/slices/appSlice";
import { showSnackbar } from "@/store/slices/appSnackbarSlice";
import { deleteMenu, updateMenu } from "@/store/slices/menuSlice";
import { UpdateMenuPayload } from "@/types/menu";
import {
  Box,
  Button,
  Checkbox,
  Chip,
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
  //hooks---
  //for selected menuCategory
  const [selected, setSelected] = useState<number[]>([]);
  const { menuCategories } = useAppSelector((state) => state.menuCategory);

  //for default and to update data
  const [updateData, setUpdateData] = useState<UpdateMenuPayload>();

  //for dialog
  const [open, setOpen] = useState<boolean>(false);

  //for router
  const router = useRouter();

  //for to show Read(CRUD)
  const { menus, app, disabledLocationMenu, menuCategoryMenu } = useAppSelector(
    appDataSelector,
    shallowEqual
  );

  const { selectedLocation } = app;

  const dispatch = useAppDispatch();

  //for image
  const [menuImage, setMenuImage] = useState<File>();
  const [menuImageName, setMenuImageName] = useState<string>();

  //validation
  const menuId = Number(router.query.id);
  const menu = menus.find((item) => item.id === menuId);

  const selectedMenuCategoryIds = menuCategoryMenu
    .filter((item) => item.menuId === menuId)
    .map((item) =>
      menuCategories.find(
        (menuCategory) => menuCategory.id === item.menuCategoryId
      )
    )
    .map((item) => item.id);

  const isAvailable = disabledLocationMenu.find(
    (item) => item.menuId === menuId && item.locationId === selectedLocation.id
  )
    ? false
    : true;

  useEffect(() => {
    if (menu) {
      setUpdateData({
        ...menu,
        isAvailable,
        locationId: selectedLocation.id,
        menuCategoryIds: selectedMenuCategoryIds,
      });
      setMenuImageName(menu.assetUrl);
      setSelected(selectedMenuCategoryIds);
    }
  }, [menu]);
  useEffect(() => {
    if (menu) {
      setUpdateData({
        ...menu,
        isAvailable: isAvailable,
        locationId: selectedLocation.id,
        menuCategoryIds: selected,
      });
    }
    if (menuImage) {
      setMenuImageName(menuImage.name);
    }
  }, [selected, menuImage]);

  useEffect(() => {
    if (menuImage) {
      setUpdateData({ ...updateData, file: menuImage });
    }
  }, [menuImage]);

  if (!updateData) {
    return (
      <Box>
        <Typography>{`didn't found this route...`}</Typography>
      </Box>
    );
  }
  const handleUpdateData = () => {
    if (menuImage) {
      dispatch(
        uploadAsset({
          file: menuImage,
          onSuccess: (assetUrl) => {
            dataUpdate(assetUrl);
            return;
          },
        })
      );
    } else {
      const shouldUpdateData =
        updateData.name !== menu.name ||
        updateData.price !== menu.price ||
        updateData.isAvailable !== isAvailable ||
        updateData.menuCategoryIds.join(",") !==
          selectedMenuCategoryIds.join(",");

      if (!shouldUpdateData) {
        dispatch(showSnackbar({ type: "success", message: "nothing changes" }));
        return router.push("/backoffice/menu");
      }
      if (!updateData.menuCategoryIds.length) {
        return dispatch(
          showSnackbar({
            type: "error",
            message: "please choose at least one menu category.",
          })
        );
      }
      dataUpdate();
    }
  };

  const dataUpdate = (assetUrl?: string) => {
    updateData.assetUrl = assetUrl;

    dispatch(
      updateMenu({
        ...updateData,
        onSuccess: () => {
          dispatch(
            showSnackbar({
              type: "success",
              message: "update menu successfully",
            })
          );
          router.push("/backoffice/menu");
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
          title="Delete menu"
          content="Are you sure want to delete this menu"
          handleDelete={() => {
            dispatch(
              deleteMenu({
                menuId,
                onSuccess: () =>
                  dispatch(
                    showSnackbar({
                      type: "success",
                      message: "delete menu successfully.",
                    })
                  ),
              })
            );
            setOpen(false);
            router.push("/backoffice/menu");
          }}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", maxWidth: 400 }}>
        <TextField
          defaultValue={updateData.name}
          sx={{ mb: 2, width: "100%" }}
          placeholder="name"
          onChange={(evt) =>
            setUpdateData({ ...updateData, name: evt.target.value })
          }
        />
        <TextField
          defaultValue={updateData.price}
          sx={{ mb: 2, width: "100%" }}
          placeholder="price"
          type="number"
          onChange={(evt) =>
            setUpdateData({ ...updateData, price: Number(evt.target.value) })
          }
        />
        <AppMultiSelect
          title="menu category"
          items={menuCategories}
          selected={selected}
          setSelected={setSelected}
        />
        <Box>
          <FileDropZone onDropFile={(file) => setMenuImage(file[0])} />
          {menuImageName && (
            <Chip
              sx={{ my: 1 }}
              label={menuImageName}
              onDelete={() => setMenuImageName(undefined)}
            />
          )}
        </Box>
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
      <Box>
        <AppSnackBar />
      </Box>
    </Box>
  );
};

export default MenuDetail;
