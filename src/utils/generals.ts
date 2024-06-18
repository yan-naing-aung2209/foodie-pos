import { CartItem } from "@/types/cart";
import { OrderAddon, OrderItem } from "@/types/order";
import { Addon, Menu, Order, Table } from "@prisma/client";

export const getCartTotalPrice = (cartItems: CartItem[]) => {
  const totalPrice = cartItems.reduce((accu, item) => {
    const menuPrice = item.menu.price;
    const addonsPrice = item.addons.reduce((addonPrice, addon) => {
      return (addonPrice += addon.price);
    }, 0);

    accu += (menuPrice + addonsPrice) * item.quantity;
    return accu;
  }, 0);
  return totalPrice;
};

export const formatOrders = (
  orders: Order[],
  addons: Addon[],
  tables: Table[],
  menus: Menu[]
): OrderItem[] => {
  const orderItemIds: string[] = [];
  orders.forEach((item) => {
    const itemId = item.itemId;
    const exist = orderItemIds.find((orderItemId) => orderItemId === itemId);
    if (!exist) {
      orderItemIds.push(itemId);
    }
  });
  const orderItems: OrderItem[] = orderItemIds.map((orderItemId) => {
    const currentOrders = orders.filter(
      (order) => order.itemId === orderItemId
    );
    const orderAddonIds = currentOrders.map(
      (currentOrder) => currentOrder.addonId
    );
    let orderAddons: OrderAddon[] = [];

    if (orderAddonIds.length) {
      orderAddonIds.forEach((orderAddonId) => {
        const addon = addons.find((item) => item.id === orderAddonId);
        if (!addon) return;

        const exist = orderAddons.find(
          (orderAddon) => orderAddon.addonCategoryId === addon.addonCategoryId
        );
        if (exist) {
          orderAddons = orderAddons.map((orderAddon) => {
            const sameParent =
              orderAddon.addonCategoryId === addon.addonCategoryId;
            if (sameParent) {
              return {
                addonCategoryId: addon.addonCategoryId,
                addons: [...orderAddon.addons, addon].sort((a, b) =>
                  a.name.localeCompare(b.name)
                ),
              };
            } else {
              return orderAddon;
            }
          });
        } else {
          orderAddons = [
            ...orderAddons,
            {
              addonCategoryId: addon.addonCategoryId,
              addons: [addon].sort((a, b) => a.name.localeCompare(b.name)),
            },
          ];
        }
      });
    }

    return {
      itemId: orderItemId,
      status: currentOrders[0].status,
      orderAddons: orderAddonIds.length ? orderAddons : [],
      menu: menus.find((menu) => currentOrders[0].menuId === menu.id),
      table: tables.find((table) => currentOrders[0].tableId === table.id),
    };
  });
  return orderItems.sort((a, b) => a.itemId.localeCompare(b.itemId));
};
