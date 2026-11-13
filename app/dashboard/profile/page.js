'use client'
import { useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Camera } from "lucide-react";
import { AppContext } from "@/context/AppContext";


// ---- Helpers ----

const genderOptions = ["Not selected", "Male", "Female", "Other"];

// The date input needs "yyyy-mm-dd". The backend sends a full date, so cut it down.
// (Old values like "Not Selected" don't match, so they become empty.)
const toDateInput = (dob) =>
  /^\d{4}-\d{2}-\d{2}/.test(dob || "") ? dob.slice(0, 10) : "";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0B5D3B] focus:ring-2 focus:ring-emerald-100";

// A label with a value (or an input) under it
const Field = ({ label, children }) => (
  <div>
    <p className="mb-1 text-sm text-gray-500">{label}</p>
    {children}
  </div>
);

// ---- Page ----

const MyProfile = () => {
  // Everything shared comes from the context

  const { getProfileData,setProfileData ,profileData} = useContext(AppContext)


  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null); // new photo the user picked
  const [preview, setPreview] = useState(""); // preview of that photo
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Change one field of profileData while editing
  const updateField = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChosen = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      toast.error("Please choose a PNG, JPG or WebP image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image is too large. The limit is 2 MB.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    // Quick checks before sending
    if (!profileData.name.trim()) {
      toast.error("Name can't be empty.");
      return;
    }
    if (profileData.phone && !/^\+?[0-9]{7,15}$/.test(profileData.phone)) {
      toast.error("Enter a valid phone number (digits only, 7 to 15 numbers).");
      return;
    }
    if (profileData.dob && new Date(profileData.dob) > new Date()) {
      toast.error("Date of birth can't be in the future.");
      return;
    }

    const formData = new FormData();
    formData.append("name", profileData.name.trim());
    formData.append("phone", profileData.phone || "");
    formData.append("dob", toDateInput(profileData.dob));
    formData.append("gender", profileData.gender);
    if (image) formData.append("image", image);

    setSaving(true);
    const success = await updateProfile(formData); // the API call lives in the context
    setSaving(false);

    if (success) {
      setImage(null);
      setPreview("");
      setIsEdit(false);
    }
  };

  // Throw away edits: reload the saved data and leave edit mode
  const handleCancel = async () => {
    setImage(null);
    setPreview("");
    setIsEdit(false);
    await getUserProfile();
  };

  if (!profileData) {
    return (
      <p className="py-10 text-center text-sm text-gray-400">
        Loading your profile...
      </p>
    );
  }

  const photo = preview || profileData.image;
  const isExpired =
    profileData.subscriptionEnd &&
    new Date(profileData.subscriptionEnd) < new Date();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0B5D3B]">My Profile</h1>
          <p className="text-sm text-gray-500">
            {isEdit ? "Update your details, then save." : "Your personal details."}
          </p>
        </div>

        {/* Edit / Save / Cancel buttons */}
        {isEdit ? (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-[#0B5D3B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#094d31] disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="rounded-lg bg-[#0B5D3B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#094d31]"
          >
            Edit profile
          </button>
        )}
      </div>

      {/* Personal details */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        {/* Photo and name */}
        <div className="mb-6 flex items-center gap-5">
          <div className="relative shrink-0">
            {photo ? (
              <img
                src={photo}
                alt={profileData.name}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#0B5D3B] text-3xl font-semibold text-white">
                {profileData.name?.[0]?.toUpperCase()}
              </div>
            )}

            {/* Camera button only shows while editing */}
            {isEdit && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  aria-label="Change photo"
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#0B5D3B] text-white hover:bg-[#094d31]"
                >
                  <Camera size={14} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp"
                  onChange={handleImageChosen}
                  className="hidden"
                />
              </>
            )}
          </div>

          <div className="min-w-0 flex-1">
            {isEdit ? (
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={`${inputClass} max-w-xs text-lg font-semibold`}
              />
            ) : (
              <p className="text-2xl font-bold text-gray-900">{profileData.name}</p>
            )}
            <p className="mt-1 truncate text-sm text-gray-500">{profileData.email}</p>
            {isEdit && (
              <p className="mt-1 text-xs text-gray-400">
                Photo: PNG, JPG or WebP, up to 2 MB
              </p>
            )}
          </div>
        </div>

        <hr className="mb-6 border-gray-100" />

        {/* Details */}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Phone">
            {isEdit ? (
              <input
                type="tel"
                value={profileData.phone || ""}
                placeholder="e.g. 9876543210"
                onChange={(e) => updateField("phone", e.target.value)}
                className={inputClass}
              />
            ) : (
              <p className="font-medium text-gray-900">
                {profileData.phone || "Not added"}
              </p>
            )}
          </Field>

          <Field label="Gender">
            {isEdit ? (
              <select
                value={profileData.gender}
                onChange={(e) => updateField("gender", e.target.value)}
                className={inputClass}
              >
                {genderOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            ) : (
              <p className="font-medium text-gray-900">{profileData.gender}</p>
            )}
          </Field>

          <Field label="Date of birth">
            {isEdit ? (
              <input
                type="date"
                value={toDateInput(profileData.dob)}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => updateField("dob", e.target.value)}
                className={inputClass}
              />
            ) : (
              <p className="font-medium text-gray-900">
                {toDateInput(profileData.dob) ? formatDate(profileData.dob) : "Not added"}
              </p>
            )}
          </Field>

          <Field label="Email">
            <p className="font-medium text-gray-900">{profileData.email}</p>
          </Field>
        </div>
      </div>

      {/* Subscription and charity (view only) */}
      <div className="mt-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-gray-900">Subscription & charity</h2>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Plan">
            <p className="font-semibold capitalize text-gray-900">
              {profileData.subscriptionPlan}
            </p>
          </Field>

          <Field label="Plan ends on">
            <p className="font-semibold text-gray-900">
              {profileData.subscriptionEnd ? formatDate(profileData.subscriptionEnd) : "-"}
              {isExpired && (
                <span className="ml-2 text-xs font-medium text-red-600">Expired</span>
              )}
            </p>
          </Field>

          <Field label="Supporting">
            <p className="font-semibold text-gray-900">
              { profileData.charity ? profileData.charity :'-'}
            </p>
          </Field>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
