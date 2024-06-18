import AppSnackBar from "@/component/AppSnackbar";
import MenuCard from "@/component/MenuCard";
import { NewMenuDialog } from "@/component/NewMenuDialog";
import { useAppSelector } from "@/store/hooks";
import { appDataSelector } from "@/store/slices/appSlice";
import { CreateMenuPayload } from "@/types/menu";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import { shallowEqual } from "react-redux";
const Menu = () => {
  const { app, menus, disabledLocationMenu } = useAppSelector(
    appDataSelector,
    shallowEqual
  );

  const { selectedLocation } = app;
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [newMenu, setNewMenu] = useState<CreateMenuPayload>({
    name: "",
    price: 0,
    menuCategoryIds: [],
  });

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
          new menu
        </Button>
        <Box>
          <NewMenuDialog
            open={openDialog}
            setOpen={setOpenDialog}
            newMenu={newMenu}
            setNewMenu={setNewMenu}
          />
        </Box>
      </Box>
      {/**CRUD -->Read */}
      <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap" }}>
        {
          //get disableLocationMenu data
          menus.map((menu) => {
            const isAvailable = disabledLocationMenu.find(
              (item) =>
                item.menuId === menu.id &&
                item.locationId === selectedLocation.id
            )
              ? false
              : true;

            return (
              <Box sx={{ width: 280, m: 1 }} key={menu.id}>
                <MenuCard
                  menu={menu}
                  href={`/backoffice/menu/${menu.id}`}
                  isAvailable={isAvailable}
                />
              </Box>
            );
          })
        }
      </Box>
      <Box>
        <AppSnackBar />
      </Box>
    </Box>
  );
};

export default Menu;
