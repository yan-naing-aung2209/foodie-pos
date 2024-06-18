import AppSnackBar from "@/component/AppSnackbar";
import ItenCard from "@/component/ItemCard";
import NewAddonCategoryDialog from "@/component/NewAddonCategoryDialog";
import { useAppSelector } from "@/store/hooks";
import { CreateAddonCategoryPayload } from "@/types/addon-category";
import ClassIcon from "@mui/icons-material/Class";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const AddonCategory = () => {
  //redux store data
  const { addonCategories } = useAppSelector((state) => state.addonCategory);

  //dialog (open & close)
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  //default data and store the new values for to create
  const [newAddonCategory, setNewAddonCategory] =
    useState<CreateAddonCategoryPayload>({
      name: "",
      isRequired: true,
      menuIds: [],
    });
  return (
    <Box>
      {/* CRUD --> Create */}
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
          new addon category
        </Button>
        <Box>
          <NewAddonCategoryDialog
            open={openDialog}
            setOpen={setOpenDialog}
            newAddonCategory={newAddonCategory}
            setnewAddonCategory={setNewAddonCategory}
          />
        </Box>
      </Box>
      {/* CRUD --> Read */}
      <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap" }}>
        {addonCategories.map((item) => {
          return (
            <Box key={item.id}>
              <ItenCard
                icon={<ClassIcon />}
                href={`/backoffice/addon-category/${item.id}`}
                title={item.name}
              />
            </Box>
          );
        })}
      </Box>
      {/* Snackbar show */}
      <Box>
        <AppSnackBar />
      </Box>
    </Box>
  );
};

export default AddonCategory;
