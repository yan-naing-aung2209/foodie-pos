import { Menu } from "@prisma/client";
import { BaseOption } from "./user";

//slice types
export interface MenuState {
  menus: Menu[];
  isLoading: boolean;
  error: string | null;
}

interface BaseMenu {
  name: string;
  price: number;
}

//Create type
export interface CreateMenuPayload extends BaseMenu, BaseOption {
  menuCategoryIds: number[];
  assetUrl?: string;
}

//Update type
export interface UpdateMenuPayload extends Menu, BaseOption {
  menuCategoryIds?: number[];
  locationId?: number;
  isAvailable: boolean;
  file?: File;
}

//Delete type
export interface DeleteMenuPayload extends BaseOption {
  menuId: number;
}

/* export interface NewMenu {
  name: string;
  price: number;
} */
