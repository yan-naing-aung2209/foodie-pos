import { Addon, Menu, ORDERSTATUS, Order, Table } from "@prisma/client";
import { CartItem } from "./cart";
import { BaseOption } from "./user";

export interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: Error | null;
}

export interface CreateOrderOptions extends BaseOption {
  tableId: number;
  cartItems: CartItem[];
}
export interface RefreshOrderOptions extends BaseOption {
  orderSeq: string | string[];
}
export interface UpdateOrderOptions extends BaseOption {
  itemId: string;
  status: ORDERSTATUS;
}

export interface OrderItem {
  itemId: string;
  status: ORDERSTATUS;
  orderAddons: OrderAddon[];
  menu: Menu;
  table: Table;
}

export interface OrderAddon {
  addonCategoryId: number;
  addons: Addon[];
}
