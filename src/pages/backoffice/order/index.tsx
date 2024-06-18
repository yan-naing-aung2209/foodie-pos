import OrderCard from "@/component/OrderCart";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appDataSelector } from "@/store/slices/appSlice";
import { updateOrder } from "@/store/slices/orderSlice";
import { OrderItem } from "@/types/order";
import { formatOrders } from "@/utils/generals";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ORDERSTATUS } from "@prisma/client";
import { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";

const OrdersPage = () => {
  const { orders, addons, menus, tables } = useAppSelector(
    appDataSelector,
    shallowEqual
  );
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const dispatch = useAppDispatch();
  const [value, setValue] = useState<ORDERSTATUS>(ORDERSTATUS.PENDING);
  const [filteredOrders, setFilteredOrders] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (orders.length) {
      const filteredOrder = formatOrders(orders, addons, tables, menus).filter(
        (orderItem) => orderItem.status === value
      );
      setFilteredOrders(filteredOrder);
    }
  }, [orders, value]);

  const handleOrderStatuUpdate = (itemId: string, status: ORDERSTATUS) => {
    dispatch(updateOrder({ itemId, status }));
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <ToggleButtonGroup
          color="primary"
          value={value}
          exclusive
          onChange={(evt, value) => setValue(value)}
        >
          <ToggleButton value={ORDERSTATUS.PENDING}>
            {ORDERSTATUS.PENDING}
          </ToggleButton>
          <ToggleButton value={ORDERSTATUS.COOKING}>
            {ORDERSTATUS.COOKING}
          </ToggleButton>
          <ToggleButton value={ORDERSTATUS.COMPLETE}>
            {ORDERSTATUS.COMPLETE}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        {filteredOrders.map((orderItem) => {
          return (
            <OrderCard
              key={orderItem.itemId}
              orderItem={orderItem}
              isAdmin
              handleOrderStatuUpdate={handleOrderStatuUpdate}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default OrdersPage;
/* function updateOrder(arg0: {
  itemId: string;
  status: import(".prisma/client").$Enums.ORDERSTATUS;
}): any {
  throw new Error("Function not implemented.");
} */
