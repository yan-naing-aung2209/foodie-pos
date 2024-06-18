import { useAppDispatch } from "@/store/hooks";
import { showSnackbar } from "@/store/slices/appSnackbarSlice";
import { createLocation } from "@/store/slices/locationSlice";
import { CreateLocationPayload } from "@/types/location";
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
  newLocation: CreateLocationPayload;
  setnewLocation: React.Dispatch<React.SetStateAction<CreateLocationPayload>>;
}

export default function NewLocationDialog({
  newLocation,
  setnewLocation,
  open,
  setOpen,
}: Props) {
  const dispatch = useAppDispatch();

  const createNewMenu = () => {
    //validation
    const { name, street, township, city } = newLocation;
    const valid = name && street && township && city;

    if (!valid) {
      return dispatch(
        showSnackbar({ type: "error", message: "some field are required!" })
      );
    }
    //bug
    dispatch(
      createLocation({
        ...newLocation,
        onSuccess: () => {
          dispatch(
            showSnackbar({
              type: "success",
              message: "location successfully updated!",
            })
          );
        },
      })
    );

    setTimeout(() => {
      setOpen(false);
    }, 500);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setnewLocation({
          name: "",
          street: "",
          township: "",
          city: "",
          companyId: undefined,
        });
      }}
    >
      <DialogTitle>create new location</DialogTitle>
      <DialogContent sx={{ width: 400 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            sx={{ mb: 2, width: "100%" }}
            placeholder="location name"
            onChange={(evt) =>
              setnewLocation({ ...newLocation, name: evt.target.value })
            }
          />
          <TextField
            placeholder="street"
            onChange={(evt) =>
              setnewLocation({ ...newLocation, street: evt.target.value })
            }
            sx={{ width: "100%", mb: 2 }}
          />
          <TextField
            placeholder="township"
            onChange={(evt) =>
              setnewLocation({ ...newLocation, township: evt.target.value })
            }
            sx={{ width: "100%", mb: 2 }}
          />
          <TextField
            placeholder="city"
            onChange={(evt) =>
              setnewLocation({ ...newLocation, city: evt.target.value })
            }
            sx={{ width: "100%", mb: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ mx: 2, mb: 2 }}>
        <Button sx={{ color: "grey" }} onClick={() => setOpen(false)}>
          cancel
        </Button>
        <Button
          /* disabled={
            newLocation.name === "" ||
            newLocation.street === "" ||
            newLocation.township === "" ||
            newLocation.city === ""
          } */
          variant="contained"
          sx={{
            width: 80,
            height: 35,
            bgcolor: "#607274",
            "&:hover": {
              backgroundColor: "#507274",
            },
          }}
          onClick={createNewMenu}
        >
          create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
