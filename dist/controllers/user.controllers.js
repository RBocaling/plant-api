"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCountController = void 0;
const user_services_1 = require("../services/user.services");
const getUserCountController = async (req, res) => {
    try {
        const count = await (0, user_services_1.getUserCount)();
        return res.status(200).json({
            message: "Users retrieved successfully",
            detail: count,
        });
    }
    catch (error) {
        console.error("Error in getUserCountController:", error);
        return res.status(500).json({ message: "Failed to get user count" });
    }
};
exports.getUserCountController = getUserCountController;
