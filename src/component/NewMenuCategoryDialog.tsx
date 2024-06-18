import { useAppDispatch } from "@/store/hooks";
import { showSnackbar } from "@/store/slices/appSnackbarSlice";
import { createMenuCategory } from "@/store/slices/menuCategorySlice";
import { CreateMenuCategoryPayload } from "@/types/menu-category";
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

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newMenuCategory: CreateMenuCategoryPayload;
  setnewMenuCategory: React.Dispatch<
    React.SetStateAction<CreateMenuCategoryPayload>
  >;
}

export default function NewMenuCategoryDialog({
  newMenuCategory,
  setnewMenuCategory,
  open,
  setOpen,
}: Props) {
  const dispatch = useAppDispatch();

  const createNewMenuCategory = async () => {
    dispatch(
      createMenuCategory({
        ...newMenuCategory,
        onSuccess: () => {
          dispatch(
            showSnackbar({
              type: "success",
              message: "menu-category successfully created!",
            })
          );
        },
      })
    );
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setnewMenuCategory({
          name: "",
          isAvailable: true,
          companyId: undefined,
        });
      }}
    >
      <DialogTitle>create new menu category</DialogTitle>
      <DialogContent sx={{ width: 300 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            sx={{ mb: 2, width: "100%" }}
            placeholder="name"
            onChange={(evt) => {
              setnewMenuCategory({
                ...newMenuCategory,
                name: evt.target.value,
              });
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newMenuCategory ? newMenuCategory.isAvailable : true}
                onChange={(evt, value) => {
                  setnewMenuCategory({
                    ...newMenuCategory,
                    isAvailable: value,
                  });
                }}
              />
            }
            label="Available"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ mx: 2, mb: 2 }}>
        <Button sx={{ color: "grey" }} onClick={() => setOpen(false)}>
          cancel
        </Button>
        <Button
          disabled={newMenuCategory && !newMenuCategory.name}
          variant="contained"
          sx={{
            width: 80,
            height: 35,
            bgcolor: "#607274",
            "&:hover": {
              backgroundColor: "#507274",
            },
          }}
          onClick={createNewMenuCategory}
        >
          create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
