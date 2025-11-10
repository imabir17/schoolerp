import { MOCK_SCHOOLS } from '../data/mockData';
import { generateMockSchoolData, getEmptySchoolData } from '../data/mockDataGenerator';
import { School } from '../types';

// --- DATABASE SIMULATION ---
// This simulates a persistent database using the browser's localStorage.

const DATABASE_KEY = 'school_erp_database';
const SUPER_ADMIN_SESSION_KEY = 'super_admin_session';

const initializeDatabase = () => {
  try {
    const dbString = localStorage.getItem(DATABASE_KEY);
    if (dbString) {
      const data = JSON.parse(dbString);
      // Basic validation to ensure it's a usable object
      if (data && typeof data.schools !== 'undefined') {
        return data;
      }
    }
  } catch (error) {
    console.error("Corrupted data in localStorage, resetting database.", error);
    // If parsing fails, remove the corrupted key to allow re-initialization
    localStorage.removeItem(DATABASE_KEY);
  }

  // First time setup or reset: seed with initial mock data
  const initialDb = {
    superAdmin: {
        username: 'superadmin',
        password: 'admin123', // Default password
    },
    schools: MOCK_SCHOOLS,
    schoolData: {
      '1': generateMockSchoolData({ name: MOCK_SCHOOLS[0].name, address: MOCK_SCHOOLS[0].address }),
      '2': generateMockSchoolData({ name: MOCK_SCHOOLS[1].name, address: MOCK_SCHOOLS[1].address }),
      '3': generateMockSchoolData({ name: MOCK_SCHOOLS[2].name, address: MOCK_SCHOOLS[2].address }),
    },
    activeSchoolId: null,
  };
  localStorage.setItem(DATABASE_KEY, JSON.stringify(initialDb));
  return initialDb;
};

let DB = initializeDatabase();

const saveDatabase = () => {
  localStorage.setItem(DATABASE_KEY, JSON.stringify(DB));
};

// --- API STUB ---
// These async functions mimic real API calls. The timeout simulates network latency.

const FAKE_LATENCY = 200;

const api = {
  // --- SCHOOL AUTH ---
  login: async (schoolId: string, password?: string): Promise<School | null> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const school = DB.schools.find((s: School) => s.schoolId === schoolId && s.password === password);
        if (school) {
          DB.activeSchoolId = school.id;
          saveDatabase();
          resolve(school);
        } else {
          resolve(null);
        }
      }, FAKE_LATENCY);
    });
  },

  logout: async (): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        DB.activeSchoolId = null;
        saveDatabase();
        resolve();
      }, FAKE_LATENCY);
    });
  },
  
  getActiveSchoolData: async (): Promise<any> => {
     return new Promise(resolve => {
        setTimeout(() => {
            if (DB.activeSchoolId && DB.schoolData[DB.activeSchoolId]) {
                resolve(DB.schoolData[DB.activeSchoolId]);
            } else {
                resolve(getEmptySchoolData());
            }
        }, FAKE_LATENCY / 2); // Faster load
     });
  },

  // --- SUPER ADMIN AUTH ---
  superAdminLogin: async (username: string, password?: string): Promise<boolean> => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (username === DB.superAdmin.username && password === DB.superAdmin.password) {
                sessionStorage.setItem(SUPER_ADMIN_SESSION_KEY, 'true');
                resolve(true);
            } else {
                resolve(false);
            }
        }, FAKE_LATENCY);
    });
  },

  superAdminLogout: async (): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            sessionStorage.removeItem(SUPER_ADMIN_SESSION_KEY);
            resolve();
        }, FAKE_LATENCY / 2);
    });
  },
  
  isSuperAdminLoggedIn: async (): Promise<boolean> => {
    return Promise.resolve(sessionStorage.getItem(SUPER_ADMIN_SESSION_KEY) === 'true');
  },

  changeSuperAdminPassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (currentPassword !== DB.superAdmin.password) {
                resolve({ success: false, message: 'Incorrect current password.' });
                return;
            }
            DB.superAdmin.password = newPassword;
            saveDatabase();
            resolve({ success: true });
        }, FAKE_LATENCY);
    });
  },
  
  // --- DATA ACCESS (for the logged-in school) ---
  
  getData: async (key: string): Promise<any[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (!DB.activeSchoolId || !DB.schoolData[DB.activeSchoolId]) return resolve([]);
            resolve(DB.schoolData[DB.activeSchoolId]?.[key] || []);
        }, FAKE_LATENCY);
    });
  },
  
  setData: async (key: string, data: any[]): Promise<void> => {
      return new Promise(resolve => {
        setTimeout(() => {
            if (!DB.activeSchoolId || !DB.schoolData[DB.activeSchoolId]) return resolve();
            DB.schoolData[DB.activeSchoolId][key] = data;
            saveDatabase();
            resolve();
        }, FAKE_LATENCY);
      });
  },
  
  saveSchoolProfile: async (profile: any): Promise<void> => {
      return new Promise(resolve => {
        setTimeout(() => {
            if (!DB.activeSchoolId || !DB.schoolData[DB.activeSchoolId]) return resolve();
            DB.schoolData[DB.activeSchoolId].schoolProfile = profile;
            saveDatabase();
            resolve();
        }, FAKE_LATENCY);
      });
  },

  // --- SUPER ADMIN SCHOOL MANAGEMENT ---
  getSchools: async (): Promise<School[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(DB.schools);
      }, FAKE_LATENCY);
    });
  },

  createSchool: async (schoolData: Omit<School, 'id'>): Promise<School> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const newId = DB.schools.length > 0 ? Math.max(...DB.schools.map((s: School) => s.id)) + 1 : 1;
        const newSchool = { id: newId, ...schoolData };
        DB.schools.push(newSchool);
        DB.schoolData[newId] = getEmptySchoolData({ name: newSchool.name, address: newSchool.address });
        saveDatabase();
        resolve(newSchool);
      }, FAKE_LATENCY);
    });
  },

  updateSchool: async (updatedSchool: School): Promise<School> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const index = DB.schools.findIndex((s: School) => s.id === updatedSchool.id);
        if (index !== -1) {
          DB.schools[index] = { ...DB.schools[index], ...updatedSchool };
          // Sync profile name and address
          if (DB.schoolData[updatedSchool.id]) {
            DB.schoolData[updatedSchool.id].schoolProfile.name = updatedSchool.name;
            DB.schoolData[updatedSchool.id].schoolProfile.address = updatedSchool.address;
          }
          saveDatabase();
        }
        resolve(DB.schools[index]);
      }, FAKE_LATENCY);
    });
  },

  deleteSchool: async (schoolId: number): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        DB.schools = DB.schools.filter((s: School) => s.id !== schoolId);
        delete DB.schoolData[schoolId];
        if (DB.activeSchoolId === schoolId) {
            DB.activeSchoolId = null;
        }
        saveDatabase();
        resolve();
      }, FAKE_LATENCY);
    });
  },
};

export default api;
