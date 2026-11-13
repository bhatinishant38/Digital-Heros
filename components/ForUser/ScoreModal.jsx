import { useState } from "react";

const ScoreModal = ({ open, initial, saving, onClose, onSave }) => {
  const [date, setDate] = useState(
    initial?.date ? initial.date.slice(0, 10) : "",
  );
  const [score, setScore] = useState(initial?.score ?? "");

  if (!open) return null;

  const submit = (event) => {
    event.preventDefault();
    onSave({ date, score: Number(score) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <h2 className="text-lg font-semibold text-gray-900">
          {initial ? "Edit score" : "Add score"}
        </h2>
        <label className="mt-5 block text-sm font-medium text-gray-700">
          Date
          <input
            required
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2"
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-gray-700">
          Score
          <input
            required
            min="1"
            type="number"
            value={score}
            onChange={(event) => setScore(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2"
          />
        </label>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            disabled={saving}
            type="submit"
            className="rounded-lg bg-[#0B5D3B] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScoreModal;
