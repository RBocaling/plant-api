import { PrismaClient, Status, Type } from "@prisma/client";

const prisma = new PrismaClient();


export const submitPlantAdvisory = async (
  plant_name: string,
  request_type: Type,
  status: Status,
  priority: Status,
  customer_id: number,
) => {
  try {
    const advisory = await prisma.plantAdvisory.create({
      data: {
        plant_name,
        request_type,
        status,
        priority,
        userId: customer_id,
      },
    });

    return advisory;
  } catch (error) {
    console.error('Service Error - submitPlantAdvisory:', error);
    throw new Error('Error creating plant advisory');
  }
};

export const makeResponse = async (id: number, response: string) => {
  const feedback = await prisma.feedback.findUnique({
    where: { id },
  });

  if (!feedback) {
    throw new Error(`Advisory with ID ${id} not found`);
  }

  try {
    const updated = await prisma.plantAdvisory.update({
      where: { id },
      data: { response, status: 'RESOLVED', },
    });

    return updated;
  } catch (error) {
    console.error('Service Error - makeResponse:', error);
    throw new Error('Failed to to make advisory');
  }
};

export const fetchAllPlantAdvisories = async () => {
  try {
    return await prisma.plantAdvisory.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Service Error - fetchAllPlantAdvisories:', error);
    throw new Error('Failed to retrieve plant advisories');
  }
};

export const getPlantAdvisoryById = async (id: number) => {
  try {
    return await prisma.plantAdvisory.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Service Error - getPlantAdvisoryById:', error);
    throw new Error('Failed to retrieve plant advisory by ID');
  }
};

export const updatePlantAdvisoryStatus = async (id: number, status: Status) => {
  const advisory = await prisma.plantAdvisory.findUnique({
    where: { id },
  });

  if (!advisory) {
    throw new Error(`Plant advisory with ID ${id} not found`);
  }

  try {
    return await prisma.plantAdvisory.update({
      where: { id },
      data: { status },
    });
  } catch (error) {
    console.error('Service Error - updatePlantAdvisoryStatus:', error);
    throw new Error('Failed to update status');
  }
};


export const updatePlantAdvisoryPriority = async (id: number, priority: Status) => {
  const advisory = await prisma.plantAdvisory.findUnique({
    where: { id },
  });

  if (!advisory) {
    throw new Error(`Plant advisory with ID ${id} not found`);
  }

  try {
    const data = await prisma.plantAdvisory.update({
      where: { id },
      data: { priority },
    });
    return data;
  } catch (error) {
    console.error('Service Error - updatePlantAdvisoryPriority:', error);
    throw new Error('Failed to update priority');
  }
};
