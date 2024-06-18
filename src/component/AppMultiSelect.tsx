import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { Menu, MenuCategory } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

//mui style
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface Props {
  title: string;
  items: MenuCategory[] | Menu[];
  selected: number[];
  setSelected: Dispatch<SetStateAction<number[]>>;
}

const AppMultiSelect = ({ title, items, selected, setSelected }: Props) => {
  return (
    <FormControl sx={{ width: "100%", mb: 2 }}>
      <InputLabel>{title}</InputLabel>
      <Select
        MenuProps={MenuProps}
        multiple
        value={selected}
        onChange={(evt) => {
          const selectedValue = evt.target.value as number[];
          setSelected(selectedValue);
        }}
        input={<OutlinedInput label={title} />}
        renderValue={() => {
          const selectedMenuCategories = selected.map((selectedId) => {
            return items.find((item: MenuCategory) => item.id === selectedId);
          });

          return (
            selectedMenuCategories &&
            selectedMenuCategories.map((item) => item.name).join(", ")
          );
        }}
      >
        {items.map((item: any) => {
          return (
            <MenuItem key={item.id} value={item.id}>
              <Checkbox checked={selected.includes(item.id)} />
              <ListItemText primary={item.name} />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default AppMultiSelect;
