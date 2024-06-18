import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";

interface Props {
  title: string;
  content: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleDelete: () => void;
}

const DeleteDialog = ({
  handleDelete,
  open,
  setOpen,
  title,
  content,
}: Props) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogContent>
        <Typography variant="h5">{title}</Typography>
      </DialogContent>
      <DialogContent>{content}</DialogContent>
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
          onClick={handleDelete}
        >
          delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
