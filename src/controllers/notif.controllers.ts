import { Request, Response } from 'express';
import * as notifServices from '../services/notif.services';

export const createNotification = async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.user?.id);
  const { title, description } = req.body;

  if (!userId || !title || !description) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const notif = await notifServices.createNotification(userId, title, description);
    res.status(201).json(notif);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getUserNotifications = async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.user?.id);

  if (!userId) {
    res.status(400).json({ error: 'Missing user ID' });
    return;
  }

  try {
    const notifications = await notifServices.getNotificationsByUser(userId);

    if (!notifications || notifications.length === 0) {
      res.status(404).json({ error: 'No notifications found' });
      return;
    }

    res.status(200).json({ data: notifications });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
