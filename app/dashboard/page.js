import { Suspense } from "react";
import { Target, Ticket, Heart } from "lucide-react";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";
import Header from "@/components/ForUser/Header";
import StatCard from "@/components/ForUser/StatCard";
import LatestScores from "@/components/ForUser/LatestScores";
import NextDraw from "@/components/ForUser/NextDraw";
import CharityBanner from "@/components/ForUser/CharityBanner";

const DashboardContent = async () => {
  const session = await auth();
  const sessionUser = session?.user;

  if (!sessionUser) {
    return <p className="text-gray-700">Please log in to view your dashboard.</p>;
  }

  await dbConnect();
  const profile = await UserModel.findById(sessionUser.id).select(
    "username image",
  );

  if (!profile) {
    return <p className="text-gray-700">Please log in to view your dashboard.</p>;
  }

  const user = {
    name: profile.username,
    image: profile.image ?? "",
  };
  const stats = { drawEntries: 3, charityContribution: 25 };
  const nextDraw = { date: "01 Jan 2027", prize: "$1,25,000" };
  const charity = { name: "Clean Water For All", percent: 10, image: "" };

  return (
    <main className="space-y-6">
      <Header user={user} />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={Target}
          label="Total Scores"
          value={0}
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

export default function Dashboard() {
  return (
    <Suspense fallback={<p className="text-gray-500">Loading dashboard...</p>}>
      <DashboardContent />
    </Suspense>
  );
}
