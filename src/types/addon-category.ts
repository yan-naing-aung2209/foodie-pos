import { AddonCategory } from "@prisma/client";
import { BaseOption } from "./user";

interface BaseAddonCategory {
  name: string;
  isRequired: boolean;
}

//Create type
export interface CreateAddonCategoryPayload
  extends BaseAddonCategory,
    BaseOption {
  menuIds: number[];
}

//Update type
export interface UpdateAddonCategoryPayload extends AddonCategory, BaseOption {
  menuIds?: number[];
}

//Delete type
export interface DeleteAddonCategoryPayload extends BaseOption {
  addonCategoryId: number;
}
