import { createContext } from "react";
import type { ProfileContextType } from "./profile-types";
import { initialState } from "./profile-types";

export const ProfileContext = createContext<ProfileContextType>(initialState);