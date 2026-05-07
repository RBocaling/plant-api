import { Request, Response } from 'express';
import { fetchAllSupportConcerns, getSupportConcernByIdAdmin, submitSupportConcern, updateResponse } from '../services/support_chat.services';
import { validateSupportMessage, validateUrgency } from "../utils/supportValidation";


export const createSupportConcern = async (req: Request, res: Response) => {
  try {
    const { image, urgency, generateInitialAiReply } = req.body;
    const customer_id = req.user?.id; 

    if (!image) {
      return res.status(400).json({ error: 'image is required.' });
    }

    const concern_msg = validateSupportMessage(req.body?.concern_msg);
    const validatedUrgency = validateUrgency(urgency);

    if (!concern_msg) {
      return res.status(400).json({ error: 'concern_msg and image are required.' });
    }

    const support = await submitSupportConcern({
      concern_msg,
      image,
      customer_id,
      urgency: validatedUrgency,
      generateInitialAiReply: Boolean(generateInitialAiReply),
    });

    return res.status(201).json({ message: 'Support concern submitted.', data: support });
  } catch (error: any) {
    if (
      error?.message?.includes("Support message") ||
      error?.message?.includes("Urgency must be") ||
      error?.message?.includes("Customer ID is required")
    ) {
      return res.status(400).json({ error: error.message });
    }

    console.error("Support concern creation failed.");
    return res.status(500).json({ error: 'Failed to submit concern.' });
  }
};

export const replyToSupport = async (req: Request, res: Response) => {
  try {
    const { id, response } = req.body;

    if (!id || !response) {
      return res.status(400).json({ error: 'ID and response are required.' });
    }

    const updated = await updateResponse(id, response);

    return res.status(200).json({
      message: 'Response sent to customer and saved.',
      data: updated,
    });
  } catch (error: any) {
    console.error("Support reply failed.");
    return res.status(500).json({ error: error.message || 'Failed to respond.' });
  }
};


export const getAllSupportConcerns = async (req: Request, res: Response) => {
  try {
    const concerns = await fetchAllSupportConcerns();
    return res.status(200).json({ message: 'All support concerns retrieved.', data: concerns });
  } catch (error) {
    console.error("Fetching support concerns failed.");
    return res.status(500).json({ error: 'Failed to fetch support concerns.' });
  }
};


export const getSupportConcernById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const concern = await getSupportConcernByIdAdmin(id);

    if (!concern) {
      return res.status(404).json({ error: 'Support concern not found.' });
    }

    return res.status(200).json({ message: 'Support concern retrieved.', data: concern });
  } catch (error) {
    console.error("Fetching support concern by ID failed.");
    return res.status(500).json({ error: 'Failed to fetch support concern.' });
  }
};