import AppSnackBar from "@/component/AppSnackbar";
import ItemCard from "@/component/ItemCard";
import NewLocationDialog from "@/component/NewLocationDialog";
import { useAppSelector } from "@/store/hooks";
import { appDataSelector } from "@/store/slices/appSlice";
import { CreateLocationPayload } from "@/types/location";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";

const Location = () => {
  const { locations, app, company } = useAppSelector(
    appDataSelector,
    shallowEqual
  );
  const { selectedLocation } = app;

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [newLocation, setNewLocation] = useState<CreateLocationPayload>();

  useEffect(() => {
    if (company && locations) {
      setNewLocation({
        name: "",
        street: "",
        township: "",
        city: "",
        companyId: company.id,
      });
    }
  }, [company]);

  return (
    <Box>
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
          new location
        </Button>
        <Box>
          <NewLocationDialog
            open={openDialog}
            setOpen={setOpenDialog}
            newLocation={newLocation}
            setnewLocation={setNewLocation}
          />
        </Box>
      </Box>
      <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap" }}>
        {locations.map((item) => {
          return (
            <Box sx={{ width: 280, m: 1 }} key={item.id}>
              <ItemCard
                icon={<LocationOnIcon />}
                title={item.name}
                href={`/backoffice/location/${item.id}`}
                isAvailable={item.id === selectedLocation.id}
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

export default Location;
