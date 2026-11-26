import { DonationModel } from "@/models/donationModel";

export async function includeDonationTotals(charities) {
  if (charities.length === 0) {
    return [];
  }

  const donationTotals = await DonationModel.aggregate([
    {
      $match: {
        charity: { $in: charities.map((charity) => charity._id) },
        contributesToRaised: true,
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
    donationTotals.map(({ _id, amount, members }) => [
      _id.toString(),
      { amount, members },
    ]),
  );

  return charities.map((charity) => {
    const charityId = charity._id.toString();
    const donationTotals = totalsByCharity.get(charityId);
    return {
      ...charity,
      _id: charityId,
      raised:
        Number(charity.raised || 0) + (donationTotals?.amount || 0),
      members:
        Number(charity.members || 0) + (donationTotals?.members || 0),
    };
  });
}
