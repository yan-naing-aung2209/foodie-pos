import AppSnackBar from "@/component/AppSnackbar";
import ItenCard from "@/component/ItemCard";
import NewMenuCategoryDialog from "@/component/NewMenuCategoryDialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appDataSelector } from "@/store/slices/appSlice";
import { CreateMenuCategoryPayload } from "@/types/menu-category";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";

const MenuCategory = () => {
  const dispatch = useAppDispatch();
  const { menuCategories, app, disabledLocationMenuCategories, company } =
    useAppSelector(appDataSelector, shallowEqual);

  const { selectedLocation } = app;

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [newMenuCategory, setNewMenuCategory] =
    useState<CreateMenuCategoryPayload>();

  useEffect(() => {
    if (company && menuCategories) {
      setNewMenuCategory({
        name: "",
        isAvailable: true,
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
          new menu category
        </Button>
        <Box>
          <NewMenuCategoryDialog
            open={openDialog}
            setOpen={setOpenDialog}
            newMenuCategory={newMenuCategory}
            setnewMenuCategory={setNewMenuCategory}
          />
        </Box>
      </Box>
      <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap" }}>
        {menuCategories.map((menuCategory) => {
          const isAvailable = disabledLocationMenuCategories.find(
            (item) =>
              item.menuCategoryId === menuCategory.id &&
              item.locationId === selectedLocation.id
          )
            ? false
            : true;

          return (
            <Box key={menuCategory.id} sx={{ width: 280, m: 1 }}>
              <ItenCard
                icon={<MenuBookIcon />}
                href={`/backoffice/menu-category/${menuCategory.id}`}
                title={menuCategory.name}
                isAvailable={isAvailable}
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

export default MenuCategory;
