"use client";

import { createContext, useCallback, useEffect, useState } from "react";

export const AppContext = createContext();

async function fetchProfileData() {
  const response = await fetch("/api/profile/getProfile", { cache: "no-store" });
  const result = await response.json();

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(result.message || "Unable to load your profile.");
  }

  return result.user;
}

export const AppContextProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(null);

  const getProfileData = useCallback(async () => {
    const profile = await fetchProfileData();
    setProfileData(profile);
    return profile;
  }, []);

  const updateProfile = useCallback(async (formData) => {
    const response = await fetch("/api/profile/editProfile", {
      method: "PUT",
      body: formData,
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Unable to update your profile.");
    }

    setProfileData(result.user);
    return true;
  }, []);

  useEffect(() => {
    let active = true;

    fetchProfileData()
      .then((profile) => {
        if (active) {
          setProfileData(profile);
        }
      })
      .catch((error) => {
        console.error("Unable to load profile data:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  const value = {
    scores: [],
    profileData,
    setProfileData,
    getProfileData,
    updateProfile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
