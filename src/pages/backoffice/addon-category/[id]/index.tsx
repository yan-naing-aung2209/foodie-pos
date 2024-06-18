import AppMultiSelect from "@/component/AppMultiSelect";
import AppSnackBar from "@/component/AppSnackbar";
import DeleteDialog from "@/component/DeleteDialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteAddonCategory,
  updateAddonCategory,
} from "@/store/slices/addonCategorySlice";
import { appDataSelector } from "@/store/slices/appSlice";
import { showSnackbar } from "@/store/slices/appSnackbarSlice";
import { UpdateAddonCategoryPayload } from "@/types/addon-category";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
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

export const WhiteLabelFormControlLabel = styled(FormControlLabel)({
  "& .MuiFormControlLabel-label": {
    color: "#EEEEEE",
  },
});
export const WhiteCheckboxColor = styled(Checkbox)({
  "&.Mui-checked": { color: "#FFFFFF" },
});
export const WhiteRadioColor = styled(Checkbox)({
  "&.Mui-checked": { color: "#FFFFFF" },
});

const AddonCategoryDetail = () => {
  //hooks---
  //get data from store
  const { addonCategories, menuAddonCategory, menus, app } = useAppSelector(
    appDataSelector,
    shallowEqual
  );

  const dispatch = useAppDispatch();
  //for default and to update data
  const [updateData, setUpdateData] = useState<UpdateAddonCategoryPayload>();
  //for selected menu
  const [selected, setSelected] = useState<number[]>([]);
  //for dialog
  const [open, setOpen] = useState<boolean>(false);
  //for router, get id from router
  const router = useRouter();
  const addonCategoryId = Number(router.query.id);

  //find data with the current id
  const addonCategory = addonCategories.find(
    (item) => item.id === addonCategoryId
  );

  //menuIds <-- menu <-- menuAddonCategory
  const selectedMenuIds = menuAddonCategory
    .filter((item) => item.addonCategoryId === addonCategoryId)
    .map((item) => menus.find((menu) => menu.id === item.menuId))
    .map((item) => item.id);

  useEffect(() => {
    if (addonCategory) {
      //set default data
      setUpdateData({
        ...addonCategory,
        menuIds: selectedMenuIds,
      });

      setSelected(selectedMenuIds);
    }
  }, [addonCategory]);

  useEffect(() => {
    if (addonCategory) {
      setUpdateData({
        ...addonCategory,
        menuIds: selected,
      });
    }
  }, [selected]);

  //check validation
  if (!updateData) {
    return (
      <Box>
        <Typography>addon category not found</Typography>
      </Box>
    );
  }

  const handleUpdateData = () => {
    const shouldUpdateData =
      updateData.name !== addonCategory.name ||
      updateData.isRequired !== addonCategory.isRequired ||
      updateData.menuIds.join(",") !== selectedMenuIds.join(",");

    if (!shouldUpdateData) {
      dispatch(showSnackbar({ type: "success", message: "nothing changes" }));
      return router.push("/backoffice/addon-category");
    }
    if (!updateData.menuIds.length) {
      return dispatch(
        showSnackbar({
          type: "error",
          message: "please choose at least one menu.",
        })
      );
    }
    dispatch(
      updateAddonCategory({
        ...updateData,
        onSuccess: () => {
          dispatch(
            showSnackbar({
              type: "success",
              message: "update menu successfully",
            })
          );
          router.push("/backoffice/addon-category");
        },
      })
    );
  };

  //show view
  return (
    <Box>
      {/*CRUD --> Delete */}
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
          title="Delete addon category"
          content="Are you sure want to delete this addon category"
          handleDelete={() => {
            dispatch(
              deleteAddonCategory({
                addonCategoryId,
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
            router.push("/backoffice/addon-category");
          }}
        />
      </Box>
      {/*CRUD --> Update */}
      <Box sx={{ display: "flex", flexDirection: "column", maxWidth: 300 }}>
        <TextField
          defaultValue={updateData.name}
          sx={{ mb: 2, width: "100%" }}
          placeholder="name"
          onChange={(evt) =>
            setUpdateData({
              ...updateData,
              name: evt.target.value,
            })
          }
        />
        <AppMultiSelect
          title="menu"
          items={menus}
          selected={selected}
          setSelected={setSelected}
        />
        {app.theme === "light" ? (
          <FormControlLabel
            control={
              <Checkbox
                checked={updateData.isRequired}
                sx={{ mb: 2 }}
                onChange={(_, value) => {
                  setUpdateData({
                    ...updateData,
                    isRequired: value,
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
                checked={updateData.isRequired}
                onChange={(_, value) => {
                  setUpdateData({
                    ...updateData,
                    isRequired: value,
                  });
                }}
              />
            }
            label="Available"
          />
        )}
        {/* <FormControlLabel
          control={
            <Checkbox
              checked={updateData.isRequired}
              onChange={(_, value) => {
                setUpdateData({
                  ...updateData,
                  isRequired: value,
                });
              }}
            />
          }
          label="required"
        /> */}
        <Button
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

export default AddonCategoryDetail;
