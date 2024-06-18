import { useAppDispatch } from "@/store/hooks";
import { showSnackbar } from "@/store/slices/appSnackbarSlice";
import { createTable } from "@/store/slices/tableSlice";
import { CreateTablePayload } from "@/types/table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newTable: CreateTablePayload | undefined;
  setnewTable: React.Dispatch<
    React.SetStateAction<CreateTablePayload | undefined>
  >;
}

export default function NewTableDialog({
  open,
  setOpen,
  newTable,
  setnewTable,
}: Props) {
  const dispatch = useAppDispatch();

  const handleCreateTable = () => {
    const { name, locationId } = newTable;
    const valid = name && locationId !== undefined;

    if (!valid) {
      dispatch(
        showSnackbar({ type: "error", message: "some field are required!" })
      );
      setOpen(false);
      return;
    }

    dispatch(
      createTable({
        ...newTable,
        onSuccess: () => {
          dispatch(
            showSnackbar({
              type: "success",
              message: "table successfully updated!",
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
        setnewTable({
          name: "",
          locationId: undefined,
        });
      }}
    >
      <DialogTitle>create new table</DialogTitle>
      <DialogContent sx={{ width: 300 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            sx={{ mb: 2, width: "100%" }}
            placeholder="name"
            onChange={(evt) =>
              setnewTable({ ...newTable, name: evt.target.value })
            }
          />
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
          onClick={handleCreateTable}
        >
          create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
