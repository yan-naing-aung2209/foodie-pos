import { config } from "@/config";
import { CompanyState, UpdateCompanyPayload } from "@/types/company";
import { Company } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

const initialState: CompanyState = {
  company: null,
  isLoading: false,
  error: null,
};

export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async (payload: UpdateCompanyPayload, thunkAPI) => {
    const { onSuccess, ...comapnyData } = payload;

    const { id, name, street, township, city } = comapnyData;

    const valid = id && name && street && township && city;
    if (!valid) {
      return alert("request fields are not complete.");
    }

    const response = await fetch(`${config.backofficeApiBaseUrl}/company`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(comapnyData),
    });
    const { company } = await response.json();

    thunkAPI.dispatch(replaceCompany(company));
    onSuccess && onSuccess();
  }
);

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompany: (state, action: PayloadAction<Company>) => {
      state.company = action.payload;
    },
    replaceCompany: (state, action: PayloadAction<Company>) => {
      state.company = action.payload;
    },
  },
});

export const selectCompany = (state: RootState) => state.company.company;

export const { setCompany, replaceCompany } = companySlice.actions;
export default companySlice.reducer;
