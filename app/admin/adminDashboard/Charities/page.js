"use client";

import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import CharityList from "@/components/ForAdmin/CharityList";
import AddCharity from "@/components/ForAdmin/AddCharity";
import { AdminContext } from "@/context/AdminContext";

// Main Admin Page - composes the 2 components
const Charities = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCharity, setEditingCharity] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const {
    charities,
    createCharity,
    getAllCharities,
    charitiesLoading,
    charitiesError,
    deleteCharity,
    updateCharity
  } = useContext(AdminContext);

  const handleAddClick = () => {
    setEditingCharity(null);
    setIsModalOpen(true);
  };

  const handleEdit = (charity) => {
    setEditingCharity(charity);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    const name = String(formData.get("name") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const imageFile = formData.get("image");

    if (!name || !category || !description) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!editingCharity && !(imageFile instanceof File)) {
      toast.error("Please select an image file");
      return;
    }

    setSaving(true);
    try {
      if (editingCharity) {
        const result = await updateCharity(editingCharity._id, formData);
        toast.success(result.message || "Charity updated successfully.");
      } else {
        const result = await createCharity(formData);
        toast.success(result.message || "Charity added successfully.");
      }
      setIsModalOpen(false);
      setEditingCharity(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this charity? This cannot be undone.")) return;

    setDeletingId(id);
    try {
      const result = await deleteCharity(id);
      toast.success(result.message || "Charity deleted.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete charity.",
      );
    } finally {
      setDeletingId("");
    }
  };

  const totalRaised = charities.reduce((s, c) => s + (Number(c.raised) || 0), 0);
  const totalMembers = charities.reduce((s, c) => s + (Number(c.members) || 0), 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 bg-[#f6f8f6] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold text-[#0B5D3B]">Support a Cause</h1>
            <span className="bg-emerald-50 text-[#0B5D3B] text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-emerald-100">
              ADMIN • {charities.length} CHARITIES
            </span>
          </div>
          <p className="mt-1 text-[13px] text-gray-500">
            Choose a charity and make a difference. • ₹{totalRaised.toLocaleString()} raised • {totalMembers.toLocaleString()} members
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="bg-[#0B5D3B] text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold flex items-center gap-2 hover:bg-[#094d31] transition shrink-0 shadow-sm"
        >
          <Plus size={16} />
          Add Charity
        </button>
      </div>

      <div className="mt-6">
        {charitiesLoading ? (
          <p className="mt-10 text-center text-sm text-gray-500">
            Loading charities...
          </p>
        ) : charitiesError ? (
          <div className="mt-10 text-center">
            <p className="text-sm text-red-600">{charitiesError}</p>
            <button
              type="button"
              onClick={() =>
                getAllCharities().catch((error) =>
                  toast.error(error.message || "Unable to fetch charities."),
                )
              }
              className="mt-3 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Try again
            </button>
          </div>
        ) : (
          <CharityList
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        )}
      </div>

      <AddCharity
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCharity(null);
        }}
        onSubmit={handleSubmit}
        editingCharity={editingCharity}
        saving={saving}
      />
    </div>
  );
};

export default Charities;
