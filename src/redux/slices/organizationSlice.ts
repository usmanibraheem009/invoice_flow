import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ---------------- TYPES ---------------- */

export interface Organization {
  id: string;
  legalName: string;
  taxId?: string;
  homeCurrency: string;
}

interface OrganizationState {
  data: Organization | null;
}

/* ---------------- INITIAL STATE ---------------- */

const initialState: OrganizationState = {
  data: null,
};

/* ---------------- SLICE ---------------- */

const organizationSlice = createSlice({
  name: "organization",
  initialState,

  reducers: {

    // Save organization
    setOrganization: (
      state,
      action: PayloadAction<Organization>
    ) => {
      state.data = action.payload;
    },

    // Update partial fields
    updateOrganization: (
      state,
      action: PayloadAction<Partial<Organization>>
    ) => {
      if (state.data) {
        state.data = {
          ...state.data,
          ...action.payload,
        };
      }
    },

    // Clear organization
    clearOrganization: (state) => {
      state.data = null;
    },

  },
});

/* ---------------- EXPORTS ---------------- */

export const {
  setOrganization,
  updateOrganization,
  clearOrganization,
} = organizationSlice.actions;

export default organizationSlice.reducer;