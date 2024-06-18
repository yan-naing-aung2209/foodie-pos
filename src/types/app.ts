import { Location } from "@prisma/client";
import { BaseOption } from "./user";

export type Theme = "light" | "dark";

export interface AppState {
  init: boolean;
  selectedLocation: Location | null;
  theme: Theme;
  isLoading: boolean;
  error: Error | null;
}
export interface UploadAssetPayload extends BaseOption {
  file: File;
}
export interface GetAppDataOptions extends BaseOption {
  tableId?: string;
  orderSeq?: string | string[];
}
