"use client";

import axios from "axios";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";

const initialCharities = [
  {
    _id: "charity-001",
    name: "Clean Water For All",
    category: "Environment",
    description: "Bringing reliable clean water to communities in need.",
    raised: 185000,
    members: 420,
    image: "",
  },
  {
    _id: "charity-002",
    name: "Education for Every Child",
    category: "Education",
    description: "Helping children access learning resources and support.",
    raised: 132500,
    members: 315,
    image: "",
  },
  {
    _id: "charity-003",
    name: "Community Health Fund",
    category: "Healthcare",
    description: "Supporting essential healthcare in local communities.",
    raised: 68100,
    members: 208,
    image: "",
  },
];

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

export function AdminContextProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [charities, setCharities] = useState(initialCharities);

  const getAllUsers = useCallback(async () => {
    setLoading(true);
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
      setLoading(false);
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
          setLoading(false);
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
    loading,
    usersError,
    charities,
    setCharities,
    categories: initialCategories,
    charityNames,
    fetchAllUsers
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}