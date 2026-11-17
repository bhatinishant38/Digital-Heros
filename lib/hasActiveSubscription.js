import UserModel from "@/models/userModel";

export async function hasActiveSubscription(userId) {
  const activeSubscription = await UserModel.exists({
    _id: userId,
    isSubscribed: true,
    subscriptionEnd: { $gt: new Date() },
  });

  return Boolean(activeSubscription);
}
