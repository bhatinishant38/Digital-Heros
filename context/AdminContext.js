"use client";

import { createContext, useMemo, useState } from "react";

const initialUsers = [
  {
    _id: "user-001",
    name: "Rohit Sharma",
    email: "rohit@example.com",
    phone: "+919876543210",
    subscriptionPlan: "yearly",
    subscriptionEnd: "2027-10-12T00:00:00.000Z",
    isSubscribed: true,
    charity: "Clean Water For All",
    createdAt: "2026-10-12T10:00:00.000Z",
    image: "",
  },
  {
    _id: "user-002",
    name: "Neha Singh",
    email: "neha@example.com",
    phone: "+919876543211",
    subscriptionPlan: "monthly",
    subscriptionEnd: "2026-10-31T00:00:00.000Z",
    isSubscribed: false,
    charity: "Green Earth Initiative",
    createdAt: "2026-09-04T10:00:00.000Z",
    image: "",
  },
  {
    _id: "user-003",
    name: "Aman Verma",
    email: "aman@example.com",
    phone: "",
    subscriptionPlan: "monthly",
    subscriptionEnd: "2026-12-05T00:00:00.000Z",
    isSubscribed: true,
    charity: "Education for Every Child",
    createdAt: "2026-11-02T10:00:00.000Z",
    image: "",
  },
];

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

export function AdminContextProvider({ children }) {
  const [users] = useState(initialUsers);
  const [charities, setCharities] = useState(initialCharities);

  const charityNames = useMemo(
    () =>
      Object.fromEntries(
        charities.map((charity) => [charity._id, charity.name]),
      ),
    [charities],
  );

  const value = {
    users,
    loading: false,
    charities,
    setCharities,
    categories: initialCategories,
    charityNames,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}