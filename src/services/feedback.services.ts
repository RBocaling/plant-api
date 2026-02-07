import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

export const submitFeedback = async (
  rating: number,
  userId: number,
  description?: string,
) => {
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  try {
    const feedback = await prisma.feedback.create({
      data: {
        rating,
        status: Status.OPEN,
        userId,
        response: '',
        description
      },
    });

    return feedback;
  } catch (error) {
    console.error('Service Error - submitFeedback:', error);
    throw new Error('Error creating feedback');
  }
};

export const makeResponse = async (id: number, response: string) => {
  const feedback = await prisma.feedback.findUnique({
    where: { id },
  });

  if (!feedback) {
    throw new Error(`Feedback with ID ${id} not found`);
  }

  try {
    const updated = await prisma.feedback.update({
      where: { id },
      data: { response },
    });

    return updated;
  } catch (error) {
    console.error('Service Error - makeResponse:', error);
    throw new Error('Failed to update feedback response');
  }
};

export const updateStatus = async (id: number, status: Status) => {
    const update = await prisma.feedback.findUnique({
      where: { id },
    });

     if (!update) {
    throw new Error(`Status with ID ${id} not found`);
  }

  try {
    const updated = await prisma.feedback.update({
      where: { id },
      data: { status },
    });

    return updated;
  } catch (error) {
    console.error('Service Error - updateStatus:', error);
    throw new Error('Failed to update feedback status');
  }
}

export const fetchAllFeedbacks = async () => {
  try {
    return await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email:true,
            createdAt: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Service Error - fetchAllFeedbacks:', error);
    throw new Error('Failed to retrieve feedbacks');
  }
};

export const getFeedbackById = async (id: number) => {
  try {
    return await prisma.feedback.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Service Error - getFeedbackById:', error);
    throw new Error('Failed to retrieve feedback by ID');
  }
};


export const getUserFeedback = async (userId: number) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }, 
    });
    return feedbacks;
  } catch (error) {
    console.error('Service Error - getUserFeedback:', error);
    throw new Error('Error fetching feedback for user');
  }
};
