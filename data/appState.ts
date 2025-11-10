import { getEmptySchoolData } from './mockDataGenerator';
import api from '../services/api';

// This mutable object represents the IN-MEMORY state for the currently logged-in school.
// It is populated on login and cleared on logout.
// The source of truth and persistence is now handled by `services/api.ts`.
export const appState = {
  // Initialize with an empty structure to prevent errors on initial load.
  ...getEmptySchoolData(),
  
  // --- Session Management ---
  isLoggedIn: false,

  // Populates the in-memory state from the persistent backend/stub.
  loadSession: async (): Promise<boolean> => {
    const data = await api.getActiveSchoolData();
    if (data && data.schoolProfile.name !== 'School ERP') { // A cheap way to check if data is loaded
      Object.assign(appState, data);
      appState.isLoggedIn = true;
      return true;
    }
    appState.isLoggedIn = false;
    return false;
  },

  login: async (schoolId: string, password?: string): Promise<boolean> => {
    const school = await api.login(schoolId, password);
    if (school) {
        await appState.loadSession();
        return true;
    }
    return false;
  },

  logout: async () => {
    await api.logout();
    // Clear all data from the in-memory state
    Object.assign(appState, getEmptySchoolData());
    appState.isLoggedIn = false;
  },
};
