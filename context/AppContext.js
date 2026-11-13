"use client";

import { createContext, useCallback, useEffect, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(null);

  const getProfileData = useCallback(async () => {
    const response = await fetch("/api/profile", { cache: "no-store" });
    const result = await response.json();

    if (response.status === 401) {
      setProfileData(null);
      return null;
    }

    if (!response.ok) {
      throw new Error(result.message || "Unable to load your profile.");
    }

    setProfileData(result.user);
    return result.user;
  }, []);

  useEffect(() => {
    getProfileData().catch((error) => {
      console.error("Unable to load profile data:", error);
    });
  }, [getProfileData]);

  const value = {
    scores: [],
    profileData,
    setProfileData,
    getProfileData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
