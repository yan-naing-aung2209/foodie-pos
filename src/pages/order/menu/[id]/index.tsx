import AddonCategory from "@/component/AddonCategory";
import ItemCard from "@/component/ItemCard";
import QuantitySelector from "@/component/QuantitySelector";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appDataSelector } from "@/store/slices/appSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { CartItem } from "@/types/cart";
import { Box, Button, Typography } from "@mui/material";
import { Addon } from "@prisma/client";
import { nanoid } from "nanoid";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";

const OrderMenuDetail = () => {
  const { query, isReady, ...router } = useRouter();

  const menuId = Number(query.id);
  const tableId = Number(query.tableId);
  const cartItemId = query.cartItemId;

  const { menus, addonCategories, menuAddonCategory } = useAppSelector(
    appDataSelector,
    shallowEqual
  );
  const { cartItems } = useAppSelector((state) => state.cart);

  const cartItem = cartItems.find((item) => item.id === cartItemId);

  const dispatch = useAppDispatch();

  const [quantity, setQuantity] = useState<number>(1);

  //for menu name
  const currentMenu = menus.find((menu) => menu.id === menuId);

  //for addonCategory name
  const currentAddonCategoryIds = menuAddonCategory
    .filter((item) => item.menuId === currentMenu.id)
    .map((item) => item.addonCategoryId);

  const currentAddonCategories = addonCategories.filter((addonCategory) =>
    currentAddonCategoryIds.includes(addonCategory.id)
  );

  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);

  useEffect(() => {
    if (cartItem) {
      const { quantity, addons } = cartItem;
      setSelectedAddons(addons);
      setQuantity(quantity);
    }
  }, [cartItem]);

  useEffect(() => {
    const currentRequiredAddonCategories = currentAddonCategories.filter(
      (item) => item.isRequired === true
    ).length; //2

    const selectedAddonCategoryIds = selectedAddons.map(
      (item) => item.addonCategoryId
    );
    const selectedRequiredAddonCategories = addonCategories.filter(
      (item) => item.isRequired && selectedAddonCategoryIds.includes(item.id)
    ).length; //2

    const disabled =
      currentRequiredAddonCategories !== selectedRequiredAddonCategories;
    setIsDisabled(disabled);
  }, [selectedAddons]);

  const handleQuantityDecrease = () => {
    const newValue: number = quantity - 1 === 0 ? 1 : quantity - 1;
    setQuantity(newValue);
  };
  const handleQuantityIncrease = () => {
    const newValue: number = quantity + 1;
    setQuantity(newValue);
  };

  const handleAddToCart = () => {
    const newCartItem: CartItem = {
      id: cartItem ? cartItem.id : nanoid(7), //<--
      menu: currentMenu,
      addons: selectedAddons,
      quantity,
    };

    dispatch(addToCart(newCartItem));

    const pathname = ItemCard ? "/order/cart" : "/order";
    router.push({ pathname, query });
  };

  if (!currentMenu && !isReady) {
    return <Typography>menu not found</Typography>;
  }

  return (
    <Box
      sx={{
        position: "relative",
        px: 2,
        top: { xs: 10, md: -170, lg: -250, xl: -400 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Image
          src={currentMenu?.assetUrl || "/default-food-img.jpg"}
          alt="menu-image"
          width={150}
          height={150}
          style={{
            borderRadius: "50%",
            margin: "0 auto",
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: { xs: "100%", sm: 350 },
          mt: 5,
          boxSizing: "border-box",
        }}
      >
        <AddonCategory
          currentAddonCategories={currentAddonCategories}
          selectedAddons={selectedAddons}
          setSelectedAddons={setSelectedAddons}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            my: 2,
          }}
        >
          <QuantitySelector
            value={quantity}
            onIncrement={handleQuantityIncrease}
            onDecrement={handleQuantityDecrease}
          />
          <Button
            variant="contained"
            disabled={isDisabled}
            onClick={handleAddToCart}
          >
            {cartItem ? "update cart" : "Add to cart"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderMenuDetail;
