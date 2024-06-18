import { uploadAsset } from "@/store/slices/appSlice";
import { createMenu } from "@/store/slices/menuSlice";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { showSnackbar } from "../store/slices/appSnackbarSlice";
import { CreateMenuPayload } from "../types/menu";
import AppMultiSelect from "./AppMultiSelect";
import FileDropZone from "./FileDropZone";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newMenu: CreateMenuPayload;
  setNewMenu: Dispatch<SetStateAction<CreateMenuPayload>>;
}

export function NewMenuDialog({ open, setOpen, newMenu, setNewMenu }: Props) {
  const dispatch = useAppDispatch();
  const { menuCategories } = useAppSelector((state) => state.menuCategory);
  const { isLoading } = useAppSelector((state) => state.menu);
  const [selected, setSelected] = useState<number[]>([]);
  //for image
  const [menuImage, setMenuImage] = useState<File>();

  useEffect(() => {
    if (newMenu) {
      setNewMenu({ ...newMenu, menuCategoryIds: selected });
    }
  }, [selected]);

  const handleCreateMenu = () => {
    if (menuImage) {
      dispatch(
        uploadAsset({
          file: menuImage,
          onSuccess: (assetUrl) => {
            createNewMenu(assetUrl);
            return;
          },
        })
      );
    } else {
      //validation
      const { name, price, menuCategoryIds } = newMenu;
      const valid = name && price !== undefined && menuCategoryIds.length > 0;

      if (!valid) {
        return dispatch(
          showSnackbar({ type: "error", message: "some field are required!" })
        );
      }
      createNewMenu();
    }
  };

  const createNewMenu = (assetUrl?: string) => {
    newMenu.assetUrl = assetUrl;
    dispatch(
      createMenu({
        ...newMenu,
        onSuccess: () => {
          dispatch(
            showSnackbar({
              type: "success",
              message: "menu successfully updated!",
            })
          );
          setSelected([]);
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
        setMenuImage(undefined);
        setNewMenu({ name: "", price: 0, menuCategoryIds: [] });
      }}
    >
      <DialogTitle>create new menu</DialogTitle>
      <DialogContent sx={{ width: 400 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            sx={{ mb: 2, width: "100%" }}
            placeholder="name"
            onChange={(evt) =>
              setNewMenu({ ...newMenu, name: evt.target.value })
            }
          />
          <TextField
            defaultValue={0}
            placeholder="price"
            onChange={(evt) =>
              setNewMenu({ ...newMenu, price: Number(evt.target.value) })
            }
            type="number"
            sx={{ width: "100%", mb: 2 }}
          />
          <AppMultiSelect
            title="menu category"
            items={menuCategories}
            selected={selected}
            setSelected={setSelected}
          />
          <Box>
            <FileDropZone onDropFile={(file) => setMenuImage(file[0])} />

            {menuImage && (
              <Chip
                sx={{ my: 1 }}
                label={menuImage.name}
                onDelete={() => setMenuImage(undefined)}
              />
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ mx: 2, mb: 2 }}>
        <Button sx={{ color: "grey" }} onClick={() => setOpen(false)}>
          cancel
        </Button>
        <Button
          //disabled={newMenu.name === "" || newMenu.menuCategoryIds.length === 0}
          variant="contained"
          sx={{
            width: 80,
            height: 35,
            bgcolor: "#607274",
            "&:hover": {
              backgroundColor: "#507274",
            },
          }}
          onClick={handleCreateMenu}
        >
          {isLoading ? (
            <CircularProgress size={20} sx={{ color: "#FEFBF6" }} />
          ) : (
            "create"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
