import { MenuAddonCategory } from "@prisma/client";

export interface MenuAddonCategoryState {
  menuAddonCategory: MenuAddonCategory[];
  isLoading: boolean;
  error: Error | null;
}
