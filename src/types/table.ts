import { Table } from "@prisma/client";
import { BaseOption } from "./user";

interface BaseTable {
  name: string;
  locationId: number | undefined;
}

export interface CreateTablePayload extends BaseTable, BaseOption {}
export interface UpdateTablePayload extends Table, BaseOption {}
export interface DeleteTablePayload extends BaseOption {
  tableId: number;
}
