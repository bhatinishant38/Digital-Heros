import { useState, useRef, useContext } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { AdminContext } from "@/context/AdminContext";

const emptyForm = {
  name: "",
  category: "",
  description: "",
  raised: 0,
  members: 0,
};

const AddCharity = (props) => {
  if (!props.isOpen) return null;

  return (
    <CharityForm
      key={props.editingCharity?._id || "new"}
      {...props}
    />
  );
};

function CharityForm({ onClose, onSubmit, editingCharity, saving }) {
  const [form, setForm] = useState(() =>
    editingCharity
      ? {
          name: editingCharity.name || "",
          category: editingCharity.category || "",
          description: editingCharity.description || "",
          raised: editingCharity.raised || 0,
          members: editingCharity.members || 0,
        }
      : emptyForm,
  );
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(editingCharity?.image || "");
  const fileInputRef = useRef(null);
  const { categories } = useContext(AdminContext);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) return;
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("description", form.description);
    formData.append("raised", String(form.raised || 0));
    formData.append("members", String(form.members || 0));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    await onSubmit(formData);
  };

  const clearImage = () => {
    setImageFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-gray-700">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-140 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#0B5D3B] text-[15px]">{editingCharity ? "Edit Charity" : "Add Charity"}</h3>
            <p className="text-[11px] text-gray-400">Upload image file • name, category, description, raised, members</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 grid place-items-center transition">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Charity Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Education for Every Child"
              className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-[#0B5D3B] focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Category *</label>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              list="catList"
              placeholder="Education"
              className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-[#0B5D3B] focus:ring-2 focus:ring-emerald-100"
              required
            />
            <datalist id="catList">
              {categories.filter((c) => c !== "All").map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          {/* Image File Upload with Preview */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Charity Image * (File Upload)</label>
            
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`mt-1.5 relative rounded-xl border-2 border-dashed p-4 cursor-pointer transition group ${
                previewUrl ? "border-[#0B5D3B]/30 bg-emerald-50/30" : "border-gray-200 hover:border-[#0B5D3B]/40 hover:bg-emerald-50/20"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {previewUrl ? (
                <div className="relative">
                  <img src={previewUrl} alt="Preview" className="w-full h-45 object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition rounded-lg flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white px-3 py-1.5 rounded-full text-[12px] font-semibold shadow-sm transition">
                      Click to change
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearImage();
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow-md grid place-items-center hover:bg-red-50 hover:text-red-600 transition"
                  >
                    <X size={14} />
                  </button>
                  {imageFile && (
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded-full">
                      {imageFile.name} • {(imageFile.size / 1024).toFixed(0)}KB
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-[#0B5D3B]/10 grid place-items-center mb-3">
                    <Upload size={20} className="text-[#0B5D3B]" />
                  </div>
                  <p className="text-[13px] font-semibold text-gray-700">Click to upload or drag & drop</p>
                  <p className="text-[11px] text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                </div>
              )}
            </div>
            {editingCharity && !imageFile && previewUrl && (
              <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1">
                <ImageIcon size={12} /> Keeping existing image. Upload new file to replace.
              </p>
            )}
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="What mission does this charity serve?"
              className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-[#0B5D3B] focus:ring-2 focus:ring-emerald-100 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Raised ($) — Number</label>
              <input
                type="number"
                min="0"
                value={form.raised}
                onChange={(e) => setForm({ ...form, raised: Number(e.target.value) })}
                placeholder="0"
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-[#0B5D3B] focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Members — Number</label>
              <input
                type="number"
                min="0"
                value={form.members}
                onChange={(e) => setForm({ ...form, members: Number(e.target.value) })}
                placeholder="0"
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-[#0B5D3B] focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-200 bg-white py-2.5 text-[13px] font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-[1.4] rounded-lg bg-[#0B5D3B] text-white py-2.5 text-[13px] font-semibold hover:bg-[#094d31] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? "Saving..." : editingCharity ? "Update Charity" : "Create Charity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCharity;