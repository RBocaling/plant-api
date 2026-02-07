import prisma from "../config/prisma";

export const getUserCount = async () => {
  try {
    const count = await prisma.user.count();
    return count;
  } catch (error) {
    throw new Error("Error getting user count");
  }
};


