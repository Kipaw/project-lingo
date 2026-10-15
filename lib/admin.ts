import { auth } from "@clerk/nextjs/server";

const adminIds = ["user_3KP1J5VO2LmkEOfepbZD6b2E1CC"];

export const isAdmin = async () => {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  return adminIds.includes(userId);
};
