import AppSingleSelect from "@/component/AppSingleSelect";
import AppSnackBar from "@/component/AppSnackbar";
import DeleteDialog from "@/component/DeleteDialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteAddon, updateAddon } from "@/store/slices/addonSlice";
import { appDataSelector } from "@/store/slices/appSlice";
import { showSnackbar } from "@/store/slices/appSnackbarSlice";
import { UpdateAddonPayload } from "@/types/addon";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";

const AddonDetail = () => {
  //for selected addonCategoru

  const [selected, setSelected] = useState<number>();
  //for default and to update data
  const [updateData, setUpdateData] = useState<UpdateAddonPayload>();

  const [open, setOpen] = useState<boolean>(false);

  const { addonCategories, addons } = useAppSelector(
    appDataSelector,
    shallowEqual
  );

  const router = useRouter();
  const addonId = Number(router.query.id);

  const dispatch = useAppDispatch();

  const addon = addons.find((item) => item.id === addonId);

  useEffect(() => {
    if (addon) {
      setUpdateData({
        ...addon,
        addonCategoryId: addon.addonCategoryId,
      });

      setSelected(addon.addonCategoryId);
    }
  }, [addon]);
  useEffect(() => {
    if (addon) {
      setUpdateData({
        ...addon,
        addonCategoryId: selected,
      });
    }
  }, [selected]);

  if (!updateData) {
    return (
      <Box>
        <Typography>addon not found</Typography>
      </Box>
    );
  }

  const handleUpdateData = () => {
    const shouldUpdateData =
      updateData.name !== addon.name ||
      updateData.price !== addon.price ||
      updateData.addonCategoryId !== addon.addonCategoryId;

    if (!shouldUpdateData) {
      dispatch(showSnackbar({ type: "success", message: "nothing changes" }));
      return router.push("/backoffice/addon");
    }
    dispatch(
      updateAddon({
        ...updateData,
        onSuccess: () => {
          dispatch(
            showSnackbar({
              type: "success",
              message: "update addon successfully",
            })
          );
          router.push("/backoffice/addon");
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
          title="Delete addon"
          content="Are you sure want to delete this addon"
          handleDelete={() => {
            dispatch(
              deleteAddon({
                addonId,
                onSuccess: () =>
                  dispatch(
                    showSnackbar({
                      type: "success",
                      message: "delete addon successfully.",
                    })
                  ),
              })
            );
            setOpen(false);
            router.push("/backoffice/addon");
          }}
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
        <TextField
          defaultValue={updateData.price}
          sx={{ mb: 2, width: "100%" }}
          placeholder="price"
          type="number"
          onChange={(evt) =>
            setUpdateData({ ...updateData, price: Number(evt.target.value) })
          }
        />
        <Box sx={{ width: "100%", mb: 2 }}>
          <AppSingleSelect
            title="addon category"
            selected={selected}
            setSelected={setSelected}
            items={addonCategories}
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

export default AddonDetail;
