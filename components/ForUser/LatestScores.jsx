'use client'
import React,{ useContext } from 'react'
import { AppContext } from "../../context/AppContext";
import { formatDate } from "./formatDate";
import Link from 'next/link';

const LatestScores = () => {

  const {scores} = useContext(AppContext)

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="font-semibold text-gray-900">Latest Scores</h2>
      <Link
        href="/dashboard/MyScores"
        className="text-sm font-medium text-[#0B5D3B] hover:underline"
      >
        View All
      </Link>
    </div>

    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-gray-100 text-gray-500">
          <th className="pb-2 font-medium">Date</th>
          <th className="pb-2 font-medium">Score (Stableford)</th>
          <th className="pb-2 font-medium">Position</th>
        </tr>
      </thead>
      <tbody>
        {scores.length === 0 ? (
          <tr>
            <td colSpan={3} className="py-6 text-center text-gray-400">
              No scores yet. Add your first score to get started.
            </td>
          </tr>
        ) : (
          scores.slice(0,5).map((s, i) => (
            <tr key={i} className="border-b border-gray-50 last:border-0">
              <td className="py-2.5 text-gray-700">{formatDate(s.date)}</td>
              <td className="py-2.5 font-medium text-gray-900">{s.score}</td>
              <td className="py-2.5 text-gray-400">{s.position || "-"}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </section>
  )
}

export default LatestScores