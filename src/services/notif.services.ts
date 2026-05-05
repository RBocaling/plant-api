import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createNotification = async (
  userId: any,
  title: string,
  description: string
) => {
  return await prisma.notif.create({
    data: {
      title,
      description,
      user: {
        connect: { id: userId }
      }
    }
  });
};

export const getNotificationsByUser = async (userId: any) => {
  return await prisma.notif.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};
