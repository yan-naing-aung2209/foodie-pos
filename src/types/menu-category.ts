import { MenuCategory } from "@prisma/client";
import { BaseOption } from "./user";

interface BaseMenuCategory {
  name: string;
  isAvailable: boolean;
}

export interface MenuCategoryState {
  menuCategories: MenuCategory[];
  isLoading: boolean;
  error: Error | null;
}

export interface CreateMenuCategoryPayload
  extends BaseMenuCategory,
    BaseOption {
  companyId?: number;
}
export interface UpdateMenuCategoryPayload extends MenuCategory, BaseOption {
  isAvailable: boolean;
  locationId?: number;
}
export interface DeleteMenuCategoryPayload extends BaseOption {
  menuCategoryId: number;
}
