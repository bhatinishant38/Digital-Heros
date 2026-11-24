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
        _id: "$charity",
        amount: { $sum: "$amount" },
      },
    },
  ]);
  const totalsByCharity = new Map(
    donationTotals.map(({ _id, amount }) => [_id.toString(), amount]),
  );

  return charities.map((charity) => {
    const charityId = charity._id.toString();
    return {
      ...charity,
      _id: charityId,
      raised:
        Number(charity.raised || 0) + (totalsByCharity.get(charityId) || 0),
    };
  });
}
