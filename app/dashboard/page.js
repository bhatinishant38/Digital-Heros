import { Suspense } from "react";
import { auth } from "@/app/api/auth/[...nextauth]/auth";


import React from "react";
import { Target, Ticket, Heart } from "lucide-react";
import Header from "../../components/ForUser/Header";
import StatCard from "../../components/ForUser/StatCard";
import LatestScores from "../../components/ForUser/LatestScores";
import NextDraw from "../../components/ForUser/NextDraw";

import CharityBanner from "../../components/ForUser/CharityBanner";



const mockData = {
  user: { name: "User", image: "" },
  stats: { totalScores: 5, drawEntries: 3, charityContribution: 25 },
  
  nextDraw: { date: "01 Oct 2026", prize: "$1,25,000" },
  charity: { name: "Clean Water For All", percent: 10, image: "" },
};

const Dashboard = () => {
  const data = mockData;
const scores =[]

  const { user, stats,  nextDraw, charity } = data;
  
  return (
    <main className="flex-1 space-y-6 p-8">
      <Header user={user} />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={Target}
          label="Total Scores"
          value={scores.length}
          note="(All Scores entries)"
        />
        <StatCard
          icon={Ticket}
          label="Draw Entries"
          value={stats.drawEntries}
          note="This month"
        />
        <StatCard
          icon={Heart}
          label="Charity Contribution"
          value={`$${stats.charityContribution}`}
          note="This month"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LatestScores  />
        </div>
        <NextDraw date={nextDraw.date} prize={nextDraw.prize} />
      </div>

      <CharityBanner
        name={charity.name}
        percent={charity.percent}
        image={charity.image}
      />
    </main>
  );
};

export default Dashboard;
