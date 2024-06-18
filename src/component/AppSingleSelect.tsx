import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { AddonCategory, Location } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

interface Props {
  title: string;
  items: AddonCategory[] | Location[];
  selected: number | undefined;
  setSelected: Dispatch<SetStateAction<number | undefined>>;
}

const AppSingleSelect = ({ title, selected, setSelected, items }: Props) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{title}</InputLabel>
      <Select
        value={selected === undefined ? "" : selected.toString()}
        label={title}
        onChange={(evt) => setSelected(Number(evt.target.value))}
      >
        {items.map((item: AddonCategory | Location) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AppSingleSelect;
