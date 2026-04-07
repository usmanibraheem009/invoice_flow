import { getCities, getCountries, getState } from "@/src/apis/locationApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchCountries = createAsyncThunk(
    "location/fetchCountries",
    async() => {
        return await getCountries();
    }
);

export const fetchStates = createAsyncThunk(
    'locations/fetchStates',
    async(country: string) => {
        return await getState(country);
    }
);

export const fetchCities = createAsyncThunk(
    'location/fetchCities',
    async({country, state}: {country: string, state: string}) => {
        const cities = await getCities( country, state);
        return cities;
    }
);

const locationSlice = createSlice({
    name: 'locationSlice',
    initialState: {
        countries: [],
        states: [],
        cities: [] as {label: string, value: string} [],

        loading: false,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder

        .addCase(fetchCountries.pending, (state) => {
            state.loading = true;
        })

        .addCase(fetchCountries.fulfilled, (state, action) =>{
            state.countries = action.payload
        })

        .addCase(fetchStates.fulfilled, (state, action) => {
            state.states = action.payload
        })

        .addCase(fetchCities.fulfilled, (state, action) => {
            state.cities = action.payload
        })
    }
});

export default locationSlice.reducer;