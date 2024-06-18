import { BaseOption } from "./user";

interface BaseAddon {
  name: string;
  price: number;
  addonCategoryId?: number;
}

export interface Addon extends BaseAddon {
  id: number;
}

export interface CreateAddonPayload extends BaseAddon, BaseOption {}

export interface UpdateAddonPayload extends Addon, BaseOption {}

export interface DeleteAddonPayload extends BaseOption {
  addonId: number;
}
