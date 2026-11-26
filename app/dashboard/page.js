
import { Suspense } from "react";
import { connection } from "next/server";
import { Target, Ticket, Heart } from "lucide-react";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import { scoreModel } from "@/models/scoreModel";
import UserModel from "@/models/userModel";
import { CharityModel } from "@/models/charityModel";
import { normalizeCharityIds } from "@/lib/normalizeCharityIds";
import Header from "@/components/ForUser/Header";
import StatCard from "@/components/ForUser/StatCard";
import LatestScores from "@/components/ForUser/LatestScores";
import NextDraw from "@/components/ForUser/NextDraw";
import CharityBanner from "@/components/ForUser/CharityBanner";
import { DonationModel } from "@/models/donationModel";

const DashboardContent = async () => {
  await connection();
  const session = await auth();
  const userId = session?.user?.id;
  

  if (!userId ) {
    return <p className="text-gray-700">Please log in to view your dashboard.</p>;
  }
  

  await dbConnect();
  const [profile, scoreCount] = await Promise.all([
    UserModel.findById(userId).select("username image charity"),
    scoreModel.countDocuments({ user: userId }),
  ]);


  if (!profile) {
    return <p className="text-gray-700">Please log in to view your dashboard.</p>;
  }

  const user = {
    name: profile.username,
    image: profile.image ?? "",
  };

  const supportedCharities = normalizeCharityIds(profile.charity);
  const lastSupportedCharity = supportedCharities.at(-1);
  const [donationTotals, supportedCharity] = await Promise.all([
    DonationModel.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          contributesToRaised: true,
        },
      },
      {
        $group: {
          _id: null,
          amount: { $sum: "$amount" },
        },
      },
    ]),
    lastSupportedCharity
      ? CharityModel.findOne(
          mongoose.isValidObjectId(lastSupportedCharity)
            ? { _id: lastSupportedCharity }
            : { name: lastSupportedCharity },
        )
          .select("name image")
          .lean()
      : null,
  ]);
  const charityContribution = donationTotals[0]?.amount || 0;
  const stats = { drawEntries: 3 };
  const nextDraw = { date: "01 Jan 2027", prize: "$1,25,000" };

  return (
    <main className="space-y-6">
      <Header user={user} />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={Target}
          label="Total Scores"
          value={scoreCount}
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
          value={`₹${charityContribution.toLocaleString("en-IN")}`}
          note="Overall donations"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LatestScores  />
        </div>
        <NextDraw date={nextDraw.date} prize={nextDraw.prize} />
      </div>

      <CharityBanner
        name={supportedCharity?.name || ""}
        image={supportedCharity?.image || ""}
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
