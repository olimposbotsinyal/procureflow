import { createContext } from "react";
import type { SettingsContextType } from "./settings-types";
import { initialState } from "./settings-types";

export const SettingsContext = createContext<SettingsContextType>(initialState);