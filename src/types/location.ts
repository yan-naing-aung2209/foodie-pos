import { BaseOption } from "./user";

interface BaseLocation {
  name: string;
  street: string;
  township: string;
  city: string;
}

export interface CreateLocationPayload extends BaseLocation, BaseOption {
  companyId?: number;
}
export interface UpdateLocationPayload extends BaseOption, BaseLocation {
  id: number;
}
export interface DeleteLocationPayload extends BaseOption {
  locationId: number;
}
