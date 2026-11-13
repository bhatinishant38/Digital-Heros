import { Pencil, Trash2 } from "lucide-react";
import { formatDate } from "./formatDate";

const ScoreTable = ({ scores, onEdit, onDelete }) => (
  <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
    <table className="w-full text-left text-sm">
      <thead className="border-b border-gray-100 text-gray-500">
        <tr>
          <th className="px-5 py-3 font-medium">Date</th>
          <th className="px-5 py-3 font-medium">Score</th>
          <th className="px-5 py-3 text-right font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {scores.length === 0 ? (
          <tr>
            <td colSpan={3} className="px-5 py-8 text-center text-gray-400">
              No scores yet.
            </td>
          </tr>
        ) : (
          scores.map((score) => (
            <tr
              key={score._id}
              className="border-b border-gray-50 last:border-0"
            >
              <td className="px-5 py-3 text-gray-700">
                {formatDate(score.date)}
              </td>
              <td className="px-5 py-3 font-medium text-gray-900">
                {score.score}
              </td>
              <td className="px-5 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(score)}
                    aria-label="Edit score"
                    className="text-gray-500 hover:text-[#0B5D3B]"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(score)}
                    aria-label="Delete score"
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default ScoreTable;
