import { Request, Response } from 'express';
import {
  submitPlantAdvisory,
  fetchAllPlantAdvisories,
  getPlantAdvisoryById,
  updatePlantAdvisoryStatus,
  updatePlantAdvisoryPriority,
  makeResponse,
  fetchCustomerPlantAdvisories,
} from '../services/plant_advisory.services';
import { logActivity } from '../utils/logs';

export const createPlantAdvisory = async (req: Request, res: Response) => {
  try {
    const customer_id = req.user?.id;
    const { plant_name, request_type, status, priority } = req.body;

    console.log("req.body",req.body);
    
    if (!customer_id) {
      return res.status(401).json({ error: 'Unauthorized: Invalid customer ID.' });
    }

    if (!plant_name || !request_type || !status || !priority) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // if (!Object.values(Type).includes(request_type)) {
    //   return res.status(400).json({ error: 'Invalid request_type value' });
    // }

    // if (!Object.values(Status).includes(status) || !Object.values(Status).includes(priority)) {
    //   return res.status(400).json({ error: 'Invalid status or priority value' });
    // }

    const advisory = await submitPlantAdvisory(
      plant_name,
      request_type,
      status,
      priority,
      customer_id
    );
     await logActivity({
        userId: customer_id,
        activity: `Submitted plant advisory for "${plant_name}"`,
      });
    return res.status(201).json({ message: 'Plant advisory submitted.', data: advisory });
  } catch (error) {
    console.error('Controller Error - createPlantAdvisory:', error);
    return res.status(500).json({ error: 'Failed to submit plant advisory.' });
  }
};

export const respondToAdvisory = async (req: Request, res: Response) => {
  try {
    const { id, response: reply } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Invalid advisory ID.' });
    }

    if (!reply || typeof reply !== 'string') {
      return res.status(400).json({ error: 'Response message is required.' });
    }

    const updated = await makeResponse(id, reply);

    return res.status(200).json({
      message: `Response added to advisory ID ${id}.`,
      data: updated,
    });
  } catch (error: any) {
    console.error('Controller Error - respondAdvisory:', error);
    if (error?.message?.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message || 'Failed to respond to advisory.' });
  }
};

export const getMyPlantAdvisories = async (req: Request, res: Response) => {
  try {
    const customerId = req.user?.id;

    if (!customerId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const advisories = await fetchCustomerPlantAdvisories(String(customerId));
    return res.status(200).json({
      message: "Your plant advisories retrieved.",
      data: advisories,
    });
  } catch (error) {
    console.error("Controller Error - getMyPlantAdvisories:", error);
    return res.status(500).json({ error: "Failed to fetch your advisories." });
  }
};

export const getAllPlantAdvisories = async (_req: Request, res: Response) => {
  try {
    const advisories = await fetchAllPlantAdvisories();
    return res.status(200).json({ message: 'All plant advisories retrieved.', data: advisories });
  } catch (error) {
    console.error('Controller Error - getAllPlantAdvisories:', error);
    return res.status(500).json({ error: 'Failed to fetch plant advisories.' });
  }
};

export const getPlantAdvisoryByIdController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id;
    if (!id) {
      return res.status(400).json({ error: 'Invalid advisory ID.' });
    }

    const advisory = await getPlantAdvisoryById(id);

    if (!advisory) {
      return res.status(404).json({ error: 'Plant advisory not found.' });
    }

    await logActivity({
      userId,
      activity: `Viewed plant advisory ID ${id}`,
    });

    return res.status(200).json({ message: 'Plant advisory retrieved.', data: advisory });
  } catch (error) {
    console.error('Controller Error - getPlantAdvisoryByIdController:', error);
    return res.status(500).json({ error: 'Failed to fetch plant advisory.' });
  }
};

export const updateAdvisoryStatus = async (req: Request, res: Response) => {
  try {
    const { id, status } = req.body;
    const userId = req.user?.id;

    if (!id) {
      return res.status(400).json({ error: 'Invalid advisory ID.' });
    }

  

    const updated = await updatePlantAdvisoryStatus(id, status);

    await logActivity({
      userId,
      activity: `Updated status of advisory ID ${id} to "${status}"`,
    });


    return res.status(200).json({
      message: `Status updated for advisory ID ${id}.`,
      data: updated,
    });
  } catch (error: any) {
    console.error('Controller Error - updateAdvisoryStatus:', error);
    return res.status(500).json({ error: error.message || 'Failed to update status.' });
  }
};

export const updateAdvisoryPriority = async (req: Request, res: Response) => {
  try {
    const { id, priority } = req.body;
    const userId = req.user?.id;
    
    if (!id) {
      return res.status(400).json({ error: 'Invalid advisory ID.' });
    }

    const updated = await updatePlantAdvisoryPriority(id, priority);

    await logActivity({
      userId,
      activity: `Updated priority of advisory ID ${id} to "${priority}"`,
    });
    return res.status(200).json({
      message: `Priority updated for advisory ID ${id}.`,
      data: updated,
    });
  } catch (error: any) {
    console.error('Controller Error - updateAdvisoryPriority:', error);
    return res.status(500).json({ error: error.message || 'Failed to update priority.' });
  }
};
