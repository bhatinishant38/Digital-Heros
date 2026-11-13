'use client'
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import ScoreTable from "@/components/ForUser/ScoreTable";
import ScoreModal from "@/components/ForUser/ScoreModal";
import { formatDate } from "@/components/ForUser/formatDate";
import { AppContext } from "@/context/AppContext";


const Scores = () => {
  const {
    scores,
    scoresLoading,
    addScore,
    updateScore,
    deleteScore,
  } = useContext(AppContext);

  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // the score being edited, or null when adding

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (score) => {
    setEditing(score);
    setModalOpen(true);
  };

  const handleSave = async ({ date, score }) => {
    const duplicate = scores.some(
      (entry) =>
        new Date(entry.date).toISOString().slice(0, 10) === date &&
        entry._id !== editing?._id,
    );
    if (duplicate) {
      toast.error("You already have a score for this date. Edit that entry instead.");
      return;
    }

    setSaving(true);
    try {
      const saved = editing
        ? await updateScore(editing._id, { date, score })
        : await addScore({ date, score });

      if (saved) {
        setModalOpen(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (score) => {
    const sure = window.confirm(
      `Delete your score of ${score.score} from ${formatDate(score.date)}?`,
    );
    if (!sure) return;

    await deleteScore(score._id);
  };

  return (
    <main className="flex-1 space-y-6 p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0B5D3B]">My Golf Scores</h1>
            <p className="mt-1 text-sm text-gray-500">
              Your last 5 Stableford scores (newest first).
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-lg bg-[#0B5D3B] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#094d31]"
          >
            <Plus size={16} />
            Add Score
          </button>
        </div>

        {scoresLoading ? (
          <p className="py-10 text-center text-sm text-gray-400">Loading scores...</p>
        ) : (
          <ScoreTable scores={scores} onEdit={openEdit} onDelete={handleDelete} />
        )}

        <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-gray-600">
          <span className="font-semibold text-[#0B5D3B]">Note:</span> Only one
          score entry is permitted per date. Duplicate scores for the same date
          are not allowed. An existing entry may only be edited or deleted.
        </div>
      </div>

      <ScoreModal
        key={`${editing?._id || "new"}-${modalOpen}`}
        open={modalOpen}
        initial={editing}
        saving={saving}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </main>
  );
};

export default Scores;
