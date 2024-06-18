import { DisabledLocationMenu } from "@prisma/client";

export interface DisabledLocationMenuState {
  disabledLocationMenu: DisabledLocationMenu[];
  isLoading: boolean;
  error: Error | null;
}
