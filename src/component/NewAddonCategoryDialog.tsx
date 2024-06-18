import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createAddonCategory } from "@/store/slices/addonCategorySlice";
import { showSnackbar } from "@/store/slices/appSnackbarSlice";
import { CreateAddonCategoryPayload } from "@/types/addon-category";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import AppMultiSelect from "./AppMultiSelect";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newAddonCategory: CreateAddonCategoryPayload;
  setnewAddonCategory: React.Dispatch<
    React.SetStateAction<CreateAddonCategoryPayload>
  >;
}

export default function NewAddonCategoryDialog({
  newAddonCategory,
  setnewAddonCategory,
  open,
  setOpen,
}: Props) {
  //hooks
  const { menus } = useAppSelector((state) => state.menu);
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    if (newAddonCategory) {
      setnewAddonCategory({ ...newAddonCategory, menuIds: selected });
    }
  }, [selected]);

  //function
  const createNewAddonCategory = () => {
    //validation
    const { name, isRequired, menuIds } = newAddonCategory;
    const valid = name && isRequired !== undefined && menuIds.length > 0;

    if (!valid) {
      return dispatch(
        showSnackbar({ type: "error", message: "some field are required!" })
      );
    }
    //bug
    dispatch(
      createAddonCategory({
        ...newAddonCategory,
        onSuccess: () => {
          dispatch(
            showSnackbar({
              type: "success",
              message: "addon category successfully updated!",
            })
          );
          setTimeout(() => {
            setOpen(false);
          }, 500);
        },
      })
    );
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setSelected([]);
        setnewAddonCategory({
          name: "",
          isRequired: true,
          menuIds: [],
        });
      }}
    >
      <DialogTitle>create new addon category</DialogTitle>
      <DialogContent sx={{ width: 400 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            sx={{ mb: 2, width: "100%" }}
            placeholder="name"
            onChange={(evt) =>
              setnewAddonCategory({
                ...newAddonCategory,
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
          <FormControlLabel
            control={
              <Checkbox
                checked={newAddonCategory.isRequired}
                onChange={(_, value) => {
                  setnewAddonCategory({
                    ...newAddonCategory,
                    isRequired: value,
                  });
                }}
              />
            }
            label="required"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ mx: 2, mb: 2 }}>
        <Button sx={{ color: "grey" }} onClick={() => setOpen(false)}>
          cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            width: 80,
            height: 35,
            bgcolor: "#607274",
            "&:hover": {
              backgroundColor: "#507274",
            },
          }}
          onClick={createNewAddonCategory}
        >
          create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
