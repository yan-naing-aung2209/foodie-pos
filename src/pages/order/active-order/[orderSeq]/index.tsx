import OrderCart from "@/component/OrderCart";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appDataSelector } from "@/store/slices/appSlice";
import { refreshOrder } from "@/store/slices/orderSlice";
import { formatOrders } from "@/utils/generals";
import { Box, Typography } from "@mui/material";
import { Order } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";

const ActiveOrder = () => {
  const { query, isReady, ...router } = useRouter();
  const { tableId } = query;
  const orderSeq = query.orderSeq;

  const { orders, tables, addons, menus } = useAppSelector(
    appDataSelector,
    shallowEqual
  );
  const dispatch = useAppDispatch();
  const [order, setOrder] = useState<Order>();

  const orderItems = formatOrders(orders, addons, tables, menus);
  const table = tables.find((item) => item.id === Number(tableId));

  let intervalId: number;

  useEffect(() => {
    if (orders) {
      setOrder(orders[0]);
    }
  }, [orders.length > 0]);

  useEffect(() => {
    if (orderSeq) {
      intervalId = window.setInterval(handleRefreshOrder, 10000);
    }

    return () => {
      window.clearInterval(intervalId);
    };
  }, [orderSeq]);
  const handleRefreshOrder = () => {
    dispatch(refreshOrder({ orderSeq }));
  };

  if (!orders.length) return <Box>Order not found</Box>;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 3,
          borderRadius: 15,
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          top: { xs: 0, md: -220, lg: -280 },
        }}
      >
        <Typography
          sx={{
            color: { xs: "success.main", md: "info.main" },
            fontSize: { xs: 20, md: 25 },
          }}
        >
          Table: {table?.name}
        </Typography>
        <Typography
          sx={{
            color: { xs: "success.main", md: "info.main" },
            fontSize: { xs: 20, md: 25 },
          }}
        >
          Total price: {order?.totalPrice}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          position: "relative",
          top: { md: -200 },
        }}
      >
        {orderItems.map((orderItem) => {
          return (
            <OrderCart
              key={orderItem.itemId}
              orderItem={orderItem}
              isAdmin={false}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default ActiveOrder;
