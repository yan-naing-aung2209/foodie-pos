import { DisabledLocationMenuCategory } from "@prisma/client";

export interface DisabledLocationMenuCategoryState {
  disabledLocationMenuCategories: DisabledLocationMenuCategory[];
  isLoading: boolean;
  error: Error | null;
}
