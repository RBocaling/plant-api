import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createHistory = async (
  userId: any,
  plant_id: string,
  plant_name: string,
  img_url:string
) => {
return null;
};

export const getHistoryByUser = async (userId: any) => {
  return await prisma.history.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};
