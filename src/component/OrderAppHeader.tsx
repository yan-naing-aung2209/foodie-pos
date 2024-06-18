import { useAppSelector } from "@/store/hooks";
import { appDataSelector } from "@/store/slices/appSlice";
import Home from "@mui/icons-material/Home";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { shallowEqual } from "react-redux";

const OrderAppHeader = () => {
  const router = useRouter();
  const isHome = router.pathname === "/order";
  const isCart = router.pathname === "/order/cart";
  const isActiveOrder = router.pathname.includes("/order/active-order");
  const isCartOrActiveOrderPage = isCart || isActiveOrder;
  const company = useAppSelector((state) => state.company.company);
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const { app } = useAppSelector(appDataSelector, shallowEqual);
  const showCompanyInfo = isHome && company;

  return (
    <Box sx={{ position: "relative" }}>
      {/* for mobile */}
      <Box
        sx={{
          bgcolor: "#1B9C85",
          height: 60,
          px: 2,
          display: { xs: "flex", md: "none" },
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
          }}
        >
          {company?.name}
        </Typography>
        <Box sx={{ position: "relative" }}>
          {isCartOrActiveOrderPage ? (
            <Home
              onClick={() =>
                router.push({
                  pathname: "/order",
                  query: { tableId: router.query.tableId },
                })
              }
              sx={{
                fontSize: "40px",
                color: "#FFE194",
              }}
            />
          ) : (
            <>
              <ShoppingCartCheckoutIcon
                onClick={() =>
                  router.push({ pathname: "/order/cart", query: router.query })
                }
                sx={{
                  fontSize: "40px",
                  color: "#FFE194",
                }}
              />
              {cartItems.length > 0 && (
                <Typography
                  sx={{
                    textAlign: "right",
                    color: "#E8F6EF",
                    position: "absolute",
                    top: -10,
                    right: -10,
                  }}
                >
                  {cartItems.length}
                </Typography>
              )}
            </>
          )}
        </Box>
      </Box>
      {/* for pc */}
      <Box
        sx={{
          width: "100vw",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            position: "fixed",
            top: 15,
            right: { xs: 40, md: 80, lg: 200 },
            cursor: "pointer",
          }}
        >
          {isCartOrActiveOrderPage ? (
            <Home
              onClick={() =>
                router.push({
                  pathname: "/order",
                  query: { tableId: router.query.tableId },
                })
              }
              sx={{
                fontSize: "40px",
                color: "#FFE194",
              }}
            />
          ) : (
            <>
              <ShoppingCartCheckoutIcon
                onClick={() =>
                  router.push({ pathname: "/order/cart", query: router.query })
                }
                sx={{
                  fontSize: "40px",
                  color: "#FFE194",
                }}
              />
              {cartItems.length > 0 && (
                <Typography
                  variant="h5"
                  sx={{
                    textAlign: "right",
                    color: "#E8F6EF",
                    position: "absolute",
                    top: -10,
                    right: -10,
                  }}
                >
                  {cartItems.length}
                </Typography>
              )}
            </>
          )}
        </Box>
        <Image
          src={
            app.theme === "light"
              ? "/order-app-header.svg"
              : "/dark-order-app-header.svg"
          }
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          alt="header-image"
        />
        {showCompanyInfo && (
          <Box sx={{ position: "absolute" }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontWeight: "bold",

                  mt: { xs: 1, md: 2, lg: 4, xl: 10 },
                  fontSize: { sm: 25, md: 30, lg: 40 },
                }}
              >
                {company?.name}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontStyle: "italic",
                  lineHeight: 1.2,
                  opacity: 0.7,
                }}
              >
                {company?.street}
                <br /> {company?.township}, {company?.city}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default OrderAppHeader;
