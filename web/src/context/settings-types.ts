// FILE: web/src/context/settings-types.ts
import type { SystemSettings } from "../services/settings.service";

export interface SettingsContextType {
  settings: SystemSettings | null;
  loading: boolean;
  error: string | null;
  updateSettings: (data: Partial<SystemSettings>) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

export const initialState: SettingsContextType = {
  settings: null,
  loading: false,
  error: null,
  updateSettings: async () => {},
  refreshSettings: async () => {},
};
