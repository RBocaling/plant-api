import { Request, Response } from 'express';
import { fetchAllSupportConcerns, getSupportConcernByIdAdmin, submitSupportConcern, updateResponse } from '../services/support_chat.services';


export const createSupportConcern = async (req: Request, res: Response) => {
  try {
    const { concern_msg, image } = req.body;
    const customer_id = Number(req.user?.id); 

    if (!concern_msg || !image) {
      return res.status(400).json({ error: 'concern_msg and image are required.' });
    }

    const support = await submitSupportConcern({ concern_msg, image, customer_id });

    return res.status(201).json({ message: 'Support concern submitted.', data: support });
  } catch (error) {
    console.error('Controller Error:', error);
    return res.status(500).json({ error: 'Failed to submit concern.' });
  }
};

export const replyToSupport = async (req: Request, res: Response) => {
  try {
    const { id, response } = req.body;

    if (!id || !response) {
      return res.status(400).json({ error: 'ID and response are required.' });
    }

    const updated = await updateResponse(Number(id), response);

    return res.status(200).json({
      message: 'Response sent to customer and saved.',
      data: updated,
    });
  } catch (error: any) {
    console.error('Controller Error - replyToSupport:', error);
    return res.status(500).json({ error: error.message || 'Failed to respond.' });
  }
};


export const getAllSupportConcerns = async (req: Request, res: Response) => {
  try {
    const concerns = await fetchAllSupportConcerns();
    return res.status(200).json({ message: 'All support concerns retrieved.', data: concerns });
  } catch (error) {
    console.error('Controller Error:', error);
    return res.status(500).json({ error: 'Failed to fetch support concerns.' });
  }
};


export const getSupportConcernById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const concern = await getSupportConcernByIdAdmin(id);

    if (!concern) {
      return res.status(404).json({ error: 'Support concern not found.' });
    }

    return res.status(200).json({ message: 'Support concern retrieved.', data: concern });
  } catch (error) {
    console.error('Controller Error:', error);
    return res.status(500).json({ error: 'Failed to fetch support concern.' });
  }
};