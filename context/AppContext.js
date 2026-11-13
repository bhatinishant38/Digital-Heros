"use client";

import axios from "axios";
import { createContext, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

async function fetchProfileData() {
  try {
    const { data } = await axios.get("/api/profile/getProfile");
    return data.user;
  } catch (error) {
    if (error.response?.status === 401) {
      return null;
    }
    throw new Error(getErrorMessage(error, "Unable to load your profile."));
  }
}

async function fetchUserScores() {
  try {
    const { data } = await axios.get("/api/score/getScore");
    if (!data.success || !Array.isArray(data.scores)) {
      throw new Error(data.message || "Unable to fetch your scores.");
    }

    return data.scores;
  } catch (error) {
    if (error.response?.status === 401) {
      return [];
    }

    throw new Error(getErrorMessage(error, "Unable to fetch your scores."));
  }
}

export const AppContextProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(null);
  const [scores, setScores] = useState([]);
  const [scoresLoading, setScoresLoading] = useState(true);

  const getProfileData = useCallback(async () => {
    const profile = await fetchProfileData();
    setProfileData(profile);
    return profile;
  }, []);

  const updateProfile = useCallback(async (formData) => {
    try {
      const { data } = await axios.put("/api/profile/editProfile", formData);
      setProfileData(data.user);
      return true;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to update your profile."));
    }
  }, []);

  const getUserScores = useCallback(async () => {
    setScoresLoading(true);
    try {
      const userScores = await fetchUserScores();
      setScores(userScores);
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to fetch your scores."));
      return false;
    } finally {
      setScoresLoading(false);
    }
  }, []);

  const addScore = useCallback(
    async ({ date, score }) => {
      try {
        const { data } = await axios.post("/api/score/addScore", {
          date,
          score,
        });
        await getUserScores();
        toast.success(data.message || "Score added.");
        return true;
      } catch (error) {
        toast.error(getErrorMessage(error, "Error adding score."));
        return false;
      }
    },
    [getUserScores],
  );

  const updateScore = useCallback(
    async (scoreId, { date, score }) => {
      try {
        const { data } = await axios.put("/api/score/updateScore", {
          scoreId,
          date,
          score,
        });
        await getUserScores();
        toast.success(data.message || "Score updated.");
        return true;
      } catch (error) {
        toast.error(getErrorMessage(error, "Error updating score."));
        return false;
      }
    },
    [getUserScores],
  );

  const deleteScore = useCallback(
    async (scoreId) => {
      try {
        const { data } = await axios.delete(
          `/api/score/deleteScore/${encodeURIComponent(scoreId)}`,
        );
        await getUserScores();
        toast.success(data.message || "Score deleted.");
        return true;
      } catch (error) {
        toast.error(getErrorMessage(error, "Error deleting score."));
        return false;
      }
    },
    [getUserScores],
  );

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

  useEffect(() => {
    let active = true;

    fetchUserScores()
      .then((userScores) => {
        if (active) {
          setScores(userScores);
        }
      })
      .catch((error) => {
        if (active) {
          toast.error(getErrorMessage(error, "Unable to fetch your scores."));
        }
      })
      .finally(() => {
        if (active) {
          setScoresLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const value = {
    scores,
    scoresLoading,
    profileData,
    setProfileData,
    getProfileData,
    updateProfile,
    addScore,
    updateScore,
    deleteScore,
    getUserScores,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
