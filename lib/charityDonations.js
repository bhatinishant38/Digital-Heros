import { DonationModel } from "@/models/donationModel";

export async function includeDonationTotals(charities) {
  if (charities.length === 0) {
    return [];
  }

  const donationStats = await DonationModel.aggregate([
    {
      $match: {
        charity: { $in: charities.map((charity) => charity._id) },
        contributesToRaised: true,
        statsApplied: { $ne: true },
      },
    },
    {
      $group: {
        _id: { charity: "$charity", user: "$user" },
        amount: { $sum: "$amount" },
      },
    },
    {
      $group: {
        _id: "$_id.charity",
        amount: { $sum: "$amount" },
        members: { $sum: 1 },
      },
    },
  ]);
  const totalsByCharity = new Map(
    donationStats.map(({ _id, amount, members }) => [
      _id.toString(),
      { amount, members },
    ]),
  );

  return charities.map((charity) => {
    const charityId = charity._id.toString();
    const stats = totalsByCharity.get(charityId);
    return {
      ...charity,
      _id: charityId,
      raised: Number(charity.raised || 0) + (stats?.amount || 0),
      members: Number(charity.members || 0) + (stats?.members || 0),
    };
  });
}
