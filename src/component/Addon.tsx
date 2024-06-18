import { useAppSelector } from "@/store/hooks";
import { appDataSelector } from "@/store/slices/appSlice";
import { Box, Checkbox, FormControlLabel, Radio } from "@mui/material";
import { AddonCategory, Addon as CurrentAddon } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import { shallowEqual } from "react-redux";

interface Props {
  currentAddonCategory: AddonCategory;
  selectedAddons: CurrentAddon[];
  setSelectedAddons: Dispatch<SetStateAction<CurrentAddon[]>>;
}

const Addon = ({
  currentAddonCategory,
  selectedAddons,
  setSelectedAddons,
}: Props) => {
  const { addons } = useAppSelector(appDataSelector, shallowEqual);

  const currentAddons = addons.filter(
    (item) => item.addonCategoryId === currentAddonCategory.id
  );
  return (
    <Box>
      {currentAddons.map((addon: CurrentAddon) => {
        return (
          <Box
            key={addon.id}
            sx={{ mx: 3, display: "flex", justifyContent: "space-between" }}
          >
            <Box>
              <FormControlLabel
                control={
                  currentAddonCategory.isRequired ? (
                    <Radio
                      color="success"
                      checked={
                        selectedAddons.find((item) => item.id === addon.id)
                          ? true
                          : false
                      }
                      onChange={() => {
                        const addonIds = currentAddons.map((item) => item.id);
                        const another = selectedAddons.filter(
                          (item) => !addonIds.includes(item.id)
                        );
                        setSelectedAddons([...another, addon]);
                      }}
                    />
                  ) : (
                    <Checkbox
                      color="success"
                      checked={
                        selectedAddons.find((item) => item.id === addon.id)
                          ? true
                          : false
                      }
                      onChange={(_, value) => {
                        if (value) {
                          setSelectedAddons([...selectedAddons, addon]);
                        } else {
                          const selected = selectedAddons.filter(
                            (item) => item.id !== addon.id
                          );
                          setSelectedAddons(selected);
                        }
                      }}
                    />
                  )
                }
                label={addon.name}
              />
            </Box>
            <Box sx={{ fontStyle: "initial" }}>{addon.price} $</Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default Addon;
