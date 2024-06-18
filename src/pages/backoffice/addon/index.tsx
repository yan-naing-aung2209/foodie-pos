import AppSnackBar from "@/component/AppSnackbar";
import ItemCard from "@/component/ItemCard";
import NewAddonDialog from "@/component/NewAddonDialog";
import { useAppSelector } from "@/store/hooks";
import { CreateAddonPayload } from "@/types/addon";
import EggIcon from "@mui/icons-material/Egg";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const Addon = () => {
  const { addons } = useAppSelector((state) => state.addon);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [newAddon, setNewAddon] = useState<CreateAddonPayload>({
    name: "",
    price: 0,
    addonCategoryId: undefined,
  });
  return (
    <Box>
      {/*CRUD --> Create*/}
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            setOpenDialog(true);
          }}
        >
          new addon
        </Button>
        <Box>
          <NewAddonDialog
            open={openDialog}
            setOpen={setOpenDialog}
            newAddon={newAddon}
            setNewAddon={setNewAddon}
          />
        </Box>
      </Box>
      {/*CRUD --> Read*/}
      <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap" }}>
        {addons.map((item) => {
          return (
            <Box sx={{ width: 280, m: 1 }} key={item.id}>
              <ItemCard
                icon={<EggIcon />}
                title={item.name}
                href={`/backoffice/addon/${item.id}`}
              />
            </Box>
          );
        })}
      </Box>
      <Box>
        <AppSnackBar />
      </Box>
    </Box>
  );
};

export default Addon;
