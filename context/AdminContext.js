"use client";

import axios from "axios";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";


const initialCategories = [
  "All",
  "Education",
  "Healthcare",
  "Environment",
  "Food & Hunger",
  "Animal Welfare",
  "Disaster Relief",
];

export const AdminContext = createContext(null);

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

const fetchAllUsers = async()=>{
  try {
    const {data}= await axios.get(`/api/adminApi/fetchAllUsers`)

    if (!data.success || !Array.isArray(data.users)) {
      throw new Error(data.message || "Unable to fetch all users.");
    }

    return data.users
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to fetch all users."));
  }
}

const fetchAllCharities = async () => {
  try {
    const { data } = await axios.get("/api/adminApi/Charity/getCharities");

    if (!data.success || !Array.isArray(data.charities)) {
      throw new Error(data.message || "Unable to fetch all charities.");
    }

    return data.charities;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to fetch all charities."));
  }
};

export function AdminContextProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [charities, setCharities] = useState([]);
  const [charitiesLoading, setCharitiesLoading] = useState(true);
  const [charitiesError, setCharitiesError] = useState("");

  const getAllUsers = useCallback(async () => {
    setUserLoading(true);
    setUsersError("");

    try {
      const allUsers = await fetchAllUsers();
      setUsers(allUsers);
      return allUsers;
    } catch (error) {
      const message = getErrorMessage(error, "Unable to fetch all users.");
      setUsersError(message);
      throw error;
    } finally {
      setUserLoading(false);
    }
  }, []);

  const getAllCharities = useCallback(async () => {
    setCharitiesLoading(true);
    setCharitiesError("");

    try {
      const allCharities = await fetchAllCharities();
      setCharities(allCharities);
      return allCharities;
    } catch (error) {
      const message = getErrorMessage(error, "Unable to fetch all charities.");
      setCharitiesError(message);
      throw error;
    } finally {
      setCharitiesLoading(false);
    }
  }, []);

  const createCharity = useCallback(async (formData) => {
    try {
      const { data } = await axios.post(
        "/api/adminApi/Charity/addCharity",
        formData,
      );

      if (!data.success || !data.charity) {
        throw new Error(data.message || "Unable to add charity.");
      }

      setCharities((current) => [data.charity, ...current]);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to add charity."));
    }
  }, []);

  const updateCharity = useCallback(async (id, formData) => {
    try {
      const { data } = await axios.put(
        `/api/adminApi/Charity/editCharity/${encodeURIComponent(id)}`,
        formData,
      );

      if (!data?.success || !data.charity) {
        throw new Error(data?.message || "Unable to update charity.");
      }

      setCharities((current) =>
        current.map((charity) =>
          charity._id === id ? data.charity : charity,
        ),
      );
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to update charity."));
    }
  }, []);

  const deleteCharity = useCallback(async (id) => {
    try {
      const { data } = await axios.delete(
        `/api/adminApi/Charity/deleteCharity/${encodeURIComponent(id)}`,
      );
      if (!data?.success) {
        throw new Error(data?.message || "Unable to delete charity.");
      }

      setCharities((current) =>
        current.filter((charity) => charity._id !== id),
      );
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to delete charity."));
    }
  }, []);

  useEffect(() => {
    let active = true;

    fetchAllUsers()
      .then((allUsers) => {
        if (active) {
          setUsers(allUsers);
        }
      })
      .catch((error) => {
        if (active) {
          setUsersError(getErrorMessage(error, "Unable to fetch all users."));
          console.error("Unable to load admin users:", error);
        }
      })
      .finally(() => {
        if (active) {
          setUserLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    fetchAllCharities()
      .then((allCharities) => {
        if (active) {
          setCharities(allCharities);
          setCharitiesError("");
        }
      })
      .catch((error) => {
        if (active) {
          setCharitiesError(
            getErrorMessage(error, "Unable to fetch all charities."),
          );
          console.error("Unable to load charities:", error);
        }
      })
      .finally(() => {
        if (active) {
          setCharitiesLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const charityNames = useMemo(
    () =>
      Object.fromEntries(
        charities.map((charity) => [charity._id, charity.name]),
      ),
    [charities],
  );

  const value = {
    users,
    getAllUsers,
    userLoading,
    usersError,
    charities,
    setCharities,
    getAllCharities,
    createCharity,
    charitiesLoading,
    charitiesError,
    categories: initialCategories,
    charityNames,
    fetchAllUsers,
    deleteCharity,
    updateCharity,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}