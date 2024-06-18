import { config } from "@/config";
import {
  CreateLocationPayload,
  DeleteLocationPayload,
  UpdateLocationPayload,
} from "@/types/location";
import { Location } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setSelectedLocation } from "./appSlice";

interface LocationState {
  locations: Location[];
  isLoading: boolean;
  error: Error | null;
}
const initialState: LocationState = {
  locations: [],
  isLoading: false,
  error: null,
};

export const createLocation = createAsyncThunk(
  "location/createLocation",
  async (payload: CreateLocationPayload, thunkAPI) => {
    const { onSuccess, ...locationData } = payload;

    const { name, street, township, city } = locationData;
    const valid = name && street && township && city;

    if (!valid) {
      return alert("some fields are required!");
    }

    const response = await fetch(`${config.backofficeApiBaseUrl}/location`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(payload),
    });
    const responseData = await response.json();

    const { location } = responseData;

    thunkAPI.dispatch(addLocation(location));

    onSuccess && onSuccess();
  }
);

export const updateLocation = createAsyncThunk(
  "location/updateLocation",
  async (payload: UpdateLocationPayload, thunkAPI) => {
    const { onSuccess, ...data } = payload;

    const { id, name, street, township, city } = data;

    const valid = id && name && street && township && city;
    if (!valid) {
      return alert("request fields not complete.");
    }

    const response = await fetch(`${config.backofficeApiBaseUrl}/location`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(data),
    });
    const { updateLocation } = await response.json();

    thunkAPI.dispatch(replaceLocation(updateLocation));
    thunkAPI.dispatch(setSelectedLocation(updateLocation));

    onSuccess && onSuccess();
  }
);

export const deleteLocation = createAsyncThunk(
  "location/deleteLocation",
  async (payload: DeleteLocationPayload, thunkAPI) => {
    const { onSuccess, locationId } = payload;

    if (!location) {
      return alert("not the correct route.");
    }

    await fetch(`${config.backofficeApiBaseUrl}/location?id=${locationId}`, {
      method: "DELETE",
    });
    thunkAPI.dispatch(removeLocation(locationId));
    onSuccess && onSuccess();

    //return menu; -->extra reducer
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<Location[]>) => {
      state.locations = action.payload;
    },
    addLocation: (state, action: PayloadAction<Location>) => {
      state.locations = [...state.locations, action.payload];
    },
    removeLocation: (state, action: PayloadAction<number>) => {
      state.locations = state.locations.filter((item) =>
        item.id === action.payload ? false : true
      );
    },
    replaceLocation: (state, action: PayloadAction<Location>) => {
      state.locations = state.locations.map((item) => {
        return item.id === action.payload.id ? action.payload : item;
      });
    },
  },
});

export const { setLocation, addLocation, removeLocation, replaceLocation } =
  locationSlice.actions;
export default locationSlice.reducer;
