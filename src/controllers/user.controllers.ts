import { Request, Response } from "express";
import { getUserCount } from "../services/user.services";


export const getUserCountController = async (req: Request, res: Response) => {
  try {
    const count = await getUserCount();
    return res.status(200).json({
      message: "Users retrieved successfully",
      detail: count,
    });
  } catch (error) {
    console.error("Error in getUserCountController:", error);
    return res.status(500).json({ message: "Failed to get user count" });
  }
};

