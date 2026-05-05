import { Request, Response } from 'express';
import {
  submitFeedback,
  fetchAllFeedbacks,
  getFeedbackById,
  makeResponse,
  updateStatus,
  getUserFeedback,
} from '../services/feedback.services';
import { Status } from '@prisma/client';
import { logActivity } from '../utils/logs';
import { createNotification } from "../services/notif.services";

export const createFeedback = async (req: Request, res: Response) => {
  console.log("BODY:", req.body);
  try {
    const userId = req.user?.id;
    const { rating, description } = req.body;

    if (!userId ) {
      return res.status(401).json({ error: "Unauthorized: Invalid user ID." });
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    const feedback = await submitFeedback(rating, userId, description);

    await createNotification(
      userId,
      `Thanks for your feedback, ${req.user?.firstName ?? ""}! ⭐`,
      "Your rating has been submitted successfully. We appreciate your support in helping improve Thryve."
    );

    await logActivity({
      userId,
      activity: `Submitted feedback with rating ${rating}`,
    });

    return res
      .status(201)
      .json({ message: "Feedback submitted.", data: feedback });
  } catch (error: any) {
    console.error("Controller Error - createFeedback:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to submit feedback." });
  }
};


export const respondToFeedback = async (req: Request, res: Response) => {
  try {
    const { id, response: reply } = req.body;
    const userId = req.user?.id;

    if (!id) {
      return res.status(400).json({ error: 'Invalid feedback ID.' });
    }

    if (!reply || typeof reply !== 'string') {
      return res.status(400).json({ error: 'Response message is required.' });
    }

    const updated = await makeResponse(id, reply);

    await logActivity({
      userId,
      activity: `Responded to feedback ID ${id}`,
    });

    return res.status(200).json({
      message: `Response added to feedback ID ${id}.`,
      data: updated,
    });
  } catch (error: any) {
    console.error('Controller Error - respondToFeedback:', error);
    return res.status(500).json({ error: error.message || 'Failed to respond to feedback.' });
  }
};

export const updateFeedbackStatus = async (req: Request, res: Response) => {
  try {
    const { id, status } = req.body;
    const userId = req.user?.id;

    if (!id) {
      return res.status(400).json({ error: 'Invalid feedback ID.' });
    }

    if (!status || typeof status !== 'string') {
      return res.status(400).json({ error: 'Status must be a string.' });
    }

    if (!Object.values(Status).includes(status as Status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${Object.values(Status).join(', ')}`,
      });
    }

    const updated = await updateStatus(id, status as Status);

     await logActivity({
      userId,
      activity: `Updated feedback ID ${id} status to "${status}"`,
    });

    return res.status(200).json({
      message: `Status updated for feedback ID ${id}.`,
      data: updated,
    });
  } catch (error: any) {
    console.error('Controller Error - updateFeedbackStatus:', error);
    return res.status(500).json({ error: error.message || 'Failed to update status.' });
  }
};


export const getAllFeedbacks = async (_req: Request, res: Response) => {
  try {
    const feedbacks = await fetchAllFeedbacks();
    return res.status(200).json({ message: 'All feedbacks retrieved.', data: feedbacks });
  } catch (error) {
    console.error('Controller Error - getAllFeedbacks:', error);
    return res.status(500).json({ error: 'Failed to fetch feedbacks.' });
  }
};

export const getFeedbackByIdController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id;
    if (!id) {
      return res.status(400).json({ error: 'Invalid feedback ID.' });
    }

    const feedback = await getFeedbackById(id);

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found.' });
    }

    await logActivity({
      userId,
      activity: `Viewed feedback ID ${id}`,
    });

    return res.status(200).json({ message: 'Feedback retrieved.', data: feedback });
  } catch (error) {
    console.error('Controller Error - getFeedbackByIdController:', error);
    return res.status(500).json({ error: 'Failed to fetch feedback.' });
  }
};


export const getFeedbackForUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid user ID.' });
    }

    const feedbacks = await getUserFeedback(userId);

    await logActivity({
      userId,
      activity: 'Viewed their own feedback list',
    });
    return res.status(200).json({ message: 'User feedback retrieved.', data: feedbacks });
  } catch (error: any) {
    console.error('Controller Error - getFeedbackForUser:', error);
    return res.status(500).json({ error: error.message || 'Failed to retrieve feedback.' });
  }
};
