import { useAppSelector } from "@/store/hooks";
import { appDataSelector } from "@/store/slices/appSlice";
import ClassIcon from "@mui/icons-material/Class";
import EggIcon from "@mui/icons-material/Egg";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import SettingsIcon from "@mui/icons-material/Settings";
import TableBarIcon from "@mui/icons-material/TableBar";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import { shallowEqual } from "react-redux";

const sideBarItems = [
  {
    id: 1,
    name: "order",
    to: "/backoffice/order",
    icon: <LocalMallIcon />,
  },
  {
    id: 2,
    name: "menuCategory",
    to: "/backoffice/menu-category",
    icon: <MenuBookIcon />,
  },
  { id: 3, name: "menu", to: "/backoffice/menu", icon: <RestaurantMenuIcon /> },
  {
    id: 4,
    name: "addonCategory",
    to: "/backoffice/addon-category",
    icon: <ClassIcon />,
  },
  { id: 5, name: "addon", to: "/backoffice/addon", icon: <EggIcon /> },
  { id: 6, name: "table", to: "/backoffice/table", icon: <TableBarIcon /> },
  {
    id: 7,
    name: "location",
    to: "/backoffice/location",
    icon: <LocationOnIcon />,
  },
];

const SideBar = () => {
  const { app } = useAppSelector(appDataSelector, shallowEqual);
  const { theme } = app;

  return (
    <Box
      sx={{
        height: "viewport",
        bgcolor: theme === "light" ? "success.main" : "primary.main",
      }}
    >
      <List>
        {sideBarItems.map((item) => (
          <Box
            sx={{ color: theme === "light" ? "info.main" : "secondary.main" }}
            key={item.id}
          >
            <Link
              href={item.to}
              style={{
                textDecoration: "none",
              }}
            >
              <ListItem key={item.name} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            </Link>
          </Box>
        ))}
      </List>
      <Divider sx={{ bgcolor: "info.main" }} />
      <Box sx={{ color: theme === "light" ? "info.main" : "secondary.main" }}>
        <List>
          <Link href={"/backoffice/setting"} style={{ textDecoration: "none" }}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary={"setting"} />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
      </Box>
    </Box>
  );
};

export default SideBar;
