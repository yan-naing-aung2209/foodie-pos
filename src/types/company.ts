import { Company } from "@prisma/client";
import { BaseOption } from "./user";

export interface CompanyState {
  company: Company | null;
  isLoading: boolean;
  error: Error | null;
}

export interface UpdateCompanyPayload extends BaseOption, Company {}
