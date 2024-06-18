import { config } from "@/config";
import {
  CreateTablePayload,
  DeleteTablePayload,
  UpdateTablePayload,
} from "@/types/table";
import { Table } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import { showSnackbar } from "./appSnackbarSlice";

interface TableState {
  tables: Table[];
  isLoading: boolean;
  error: Error | null;
}

const initialState: TableState = {
  tables: [],
  isLoading: false,
  error: null,
};

export const createTable = createAsyncThunk(
  "table/createTable",
  async (paylaod: CreateTablePayload, thunkAPI) => {
    //validation
    const { onSuccess, ...tableData } = paylaod;
    const { name, locationId } = tableData;
    const valid = name && locationId !== undefined;
    if (!valid) {
      thunkAPI.dispatch(
        showSnackbar({ type: "error", message: "some fields are required." })
      );
    }
    //fetch to server
    const response = await fetch(`${config.backofficeApiBaseUrl}/table`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(tableData),
    });
    //dispatch to store
    const { table } = await response.json();

    thunkAPI.dispatch(addTable(table));

    onSuccess && onSuccess();
  }
);
export const updateTable = createAsyncThunk(
  "table/updateTable",
  async (paylaod: UpdateTablePayload, thunkAPI) => {
    //validation
    const { onSuccess, ...tableData } = paylaod;
    const { id, name, locationId } = tableData;

    const valid = id && name && locationId !== undefined;

    if (!valid) {
      thunkAPI.dispatch(
        showSnackbar({ type: "error", message: "some fields are required." })
      );
    }
    //fetch to server
    const response = await fetch(`${config.backofficeApiBaseUrl}/table`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(tableData),
    });

    //dispatch to store
    const { table } = await response.json();

    thunkAPI.dispatch(replaceTable(table));
    onSuccess && onSuccess();
  }
);
export const deleteTable = createAsyncThunk(
  "table/deleteTable",
  async (payload: DeleteTablePayload, thunkAPI) => {
    const { onSuccess, tableId } = payload;

    if (!tableId) {
      return alert("incorrect route.");
    }

    await fetch(`${config.backofficeApiBaseUrl}/table?id=${tableId}`, {
      method: "DELETE",
    });
    thunkAPI.dispatch(removeTable(tableId));
    onSuccess && onSuccess();
  }
);

const TableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setTable: (state, action: PayloadAction<Table[]>) => {
      state.tables = action.payload;
    },
    addTable: (state, action: PayloadAction<Table>) => {
      state.tables = [...state.tables, action.payload];
    },
    replaceTable: (state, action: PayloadAction<Table>) => {
      state.tables = state.tables.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeTable: (state, action: PayloadAction<number>) => {
      state.tables = state.tables.filter((item) => item.id !== action.payload);
    },
  },
});

export const selectTable = (state: RootState) => state.table.tables;

export const { setTable, addTable, removeTable, replaceTable } =
  TableSlice.actions;
export default TableSlice.reducer;
