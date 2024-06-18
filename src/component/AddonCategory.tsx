import { Box, Chip, Typography } from "@mui/material";
import {
  Addon as CurrentAddon,
  AddonCategory as CurrentAddonCategory,
} from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import Addon from "./Addon";

interface Props {
  currentAddonCategories: CurrentAddonCategory[];
  selectedAddons: CurrentAddon[];
  setSelectedAddons: Dispatch<SetStateAction<CurrentAddon[]>>;
}

const AddonCategory = ({
  currentAddonCategories,
  selectedAddons,
  setSelectedAddons,
}: Props) => {
  return (
    <Box>
      {currentAddonCategories.map((addonCategory) => (
        <Box key={addonCategory.id}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              my: 1,
            }}
            key={addonCategory.id}
          >
            <Typography variant="h6">{addonCategory.name}</Typography>
            <Chip label={addonCategory.isRequired ? "required" : "optional"} />
          </Box>
          {
            <Addon
              currentAddonCategory={addonCategory}
              selectedAddons={selectedAddons}
              setSelectedAddons={setSelectedAddons}
            />
          }
        </Box>
      ))}
    </Box>
  );
};

export default AddonCategory;
