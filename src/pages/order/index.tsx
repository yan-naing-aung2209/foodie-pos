import MenuCard from "@/component/MenuCard";
import { useAppSelector } from "@/store/hooks";
import { appDataSelector } from "@/store/slices/appSlice";
import { Box, Tab, Tabs } from "@mui/material";
import { MenuCategory } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";

const OrderApp = () => {
  const { menuCategories, menuCategoryMenu, menus } = useAppSelector(
    appDataSelector,
    shallowEqual
  );

  //get ready and tableId<--param
  const { isReady, ...router } = useRouter();

  const query = router.query;
  const { tableId } = query;

  const [selectedMenuCategory, setSelectedMenuCategory] =
    useState<MenuCategory>();
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    if (menuCategories) {
      setSelectedMenuCategory(menuCategories[0]);
    }
  }, [menuCategories]);
  useEffect(() => {
    if (isReady && !tableId) {
      router.push("/");
    }
  }, [isReady]);

  const renderMenu = () => {
    const validMenuIds = menuCategoryMenu
      .filter((item) => item.menuCategoryId === selectedMenuCategory?.id)
      .map((item) => item.menuId);
    const validMenus = menus.filter((menu) => validMenuIds.includes(menu.id));

    return validMenus.map((item) => {
      const href = { pathname: `/order/menu/${item.id}`, query };
      return <MenuCard key={item.id} menu={item} href={href} />;
    });
  };

  return (
    <Box
      sx={{
        position: "relative",
        maxWidth: 900,
        m: "0 auto",
        top: { md: -50, lg: -70, xl: -130 },
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
        }}
      >
        <Tabs
          value={value}
          onChange={(evt, value) => {
            setValue(value);
          }}
          TabIndicatorProps={{
            style: { background: "#1B9C85" },
          }}
          variant="scrollable"
          scrollButtons={false}
          sx={{
            pb: 1,
            ".Mui-selected": {
              color: "#1B9C85",
              fontWeight: "bold",
            },
          }}
        >
          {menuCategories.map((item) => (
            <Tab
              key={item.id}
              label={item.name}
              onClick={() => setSelectedMenuCategory(item)}
              sx={{ color: "#4C4C6D" }}
            />
          ))}
        </Tabs>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            px: 2,
          }}
        >
          {renderMenu()}
        </Box>
      </Box>
    </Box>
  );
};

export default OrderApp;
