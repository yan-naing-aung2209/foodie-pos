import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createNewAddon } from "@/store/slices/addonSlice";
import { showSnackbar } from "@/store/slices/appSnackbarSlice";
import { CreateAddonPayload } from "@/types/addon";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import AppSingleSelect from "./AppSingleSelect";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newAddon: CreateAddonPayload;
  setNewAddon: React.Dispatch<React.SetStateAction<CreateAddonPayload>>;
}

export default function NewAddonDialog({
  setNewAddon,
  newAddon,
  open,
  setOpen,
}: Props) {
  const dispatch = useAppDispatch();
  const { addonCategories } = useAppSelector((state) => state.addonCategory);
  const [selected, setSelected] = useState<number>();

  useEffect(() => {
    if (selected) {
      setNewAddon({ ...newAddon, addonCategoryId: selected });
    }
  }, [selected]);
  const handleCreateAddon = () => {
    const { name, price, addonCategoryId } = newAddon;
    const valid = name && price !== undefined && addonCategoryId !== undefined;

    if (!valid) {
      dispatch(
        showSnackbar({ type: "error", message: "some field are required!" })
      );
      setOpen(false);
      return;
    }

    dispatch(
      createNewAddon({
        ...newAddon,
        onSuccess: () => {
          dispatch(
            showSnackbar({
              type: "success",
              message: "addon successfully updated!",
            })
          );
          setOpen(false);
        },
        onError: () => {
          dispatch(
            showSnackbar({ type: "error", message: "an error occured!" })
          );
        },
      })
    );
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setNewAddon({
          name: "",
          price: 0,
          addonCategoryId: undefined,
        });
      }}
    >
      <DialogTitle>create new addon</DialogTitle>
      <DialogContent sx={{ width: 300 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            sx={{ mb: 2, width: "100%" }}
            placeholder="name"
            onChange={(evt) =>
              setNewAddon({ ...newAddon, name: evt.target.value })
            }
          />
          <TextField
            defaultValue={0}
            placeholder="price"
            onChange={(evt) =>
              setNewAddon({ ...newAddon, price: Number(evt.target.value) })
            }
            type="number"
            sx={{ width: "100%", mb: 2 }}
          />
          <Box sx={{ width: "100%" }}>
            <AppSingleSelect
              title="addon category"
              selected={selected}
              setSelected={setSelected}
              items={addonCategories}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ mx: 2, mb: 2 }}>
        <Button sx={{ color: "grey" }} onClick={() => setOpen(false)}>
          cancel
        </Button>
        <Button
          //disabled={!newAddon.name && newAddon.price !== undefined}
          variant="contained"
          sx={{
            width: 80,
            height: 35,
            bgcolor: "#607274",
            "&:hover": {
              backgroundColor: "#507274",
            },
          }}
          onClick={handleCreateAddon}
        >
          create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
