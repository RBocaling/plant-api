"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeedbackForUser = exports.getFeedbackByIdController = exports.getAllFeedbacks = exports.updateFeedbackStatus = exports.respondToFeedback = exports.createFeedback = void 0;
const feedback_services_1 = require("../services/feedback.services");
const logs_1 = require("../utils/logs");
const notif_services_1 = require("../services/notif.services");
const createFeedback = async (req, res) => {
    console.log("BODY:", req.body);
    try {
        const userId = req.user?.id;
        const { rating, description } = req.body;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: Invalid user ID." });
        }
        if (typeof rating !== "number" || rating < 1 || rating > 5) {
            return res.status(400).json({ error: "Rating must be between 1 and 5." });
        }
        const feedback = await (0, feedback_services_1.submitFeedback)(rating, userId, description);
        await (0, notif_services_1.createNotification)(userId, `Thanks for your feedback, ${req.user?.firstName ?? ""}! ⭐`, "Your rating has been submitted successfully. We appreciate your support in helping improve Thryve.");
        await (0, logs_1.logActivity)({
            userId,
            activity: `Submitted feedback with rating ${rating}`,
        });
        return res
            .status(201)
            .json({ message: "Feedback submitted.", data: feedback });
    }
    catch (error) {
        console.error("Controller Error - createFeedback:", error);
        return res
            .status(500)
            .json({ error: error.message || "Failed to submit feedback." });
    }
};
exports.createFeedback = createFeedback;
const respondToFeedback = async (req, res) => {
    try {
        const { id, response: reply } = req.body;
        const userId = req.user?.id;
        if (!id) {
            return res.status(400).json({ error: 'Invalid feedback ID.' });
        }
        if (!reply || typeof reply !== 'string') {
            return res.status(400).json({ error: 'Response message is required.' });
        }
        const updated = await (0, feedback_services_1.makeResponse)(id, reply);
        await (0, logs_1.logActivity)({
            userId,
            activity: `Responded to feedback ID ${id}`,
        });
        return res.status(200).json({
            message: `Response added to feedback ID ${id}.`,
            data: updated,
        });
    }
    catch (error) {
        console.error('Controller Error - respondToFeedback:', error);
        return res.status(500).json({ error: error.message || 'Failed to respond to feedback.' });
    }
};
exports.respondToFeedback = respondToFeedback;
const updateFeedbackStatus = async (req, res) => {
    try {
        const { id, status } = req.body;
        const userId = req.user?.id;
        if (!id) {
            return res.status(400).json({ error: 'Invalid feedback ID.' });
        }
        if (!status || typeof status !== 'string') {
            return res.status(400).json({ error: 'Status must be a string.' });
        }
        const updated = await (0, feedback_services_1.updateStatus)(id, status);
        await (0, logs_1.logActivity)({
            userId,
            activity: `Updated feedback ID ${id} status to "${status}"`,
        });
        return res.status(200).json({
            message: `Status updated for feedback ID ${id}.`,
            data: updated,
        });
    }
    catch (error) {
        console.error('Controller Error - updateFeedbackStatus:', error);
        return res.status(500).json({ error: error.message || 'Failed to update status.' });
    }
};
exports.updateFeedbackStatus = updateFeedbackStatus;
const getAllFeedbacks = async (_req, res) => {
    try {
        const feedbacks = await (0, feedback_services_1.fetchAllFeedbacks)();
        return res.status(200).json({ message: 'All feedbacks retrieved.', data: feedbacks });
    }
    catch (error) {
        console.error('Controller Error - getAllFeedbacks:', error);
        return res.status(500).json({ error: 'Failed to fetch feedbacks.' });
    }
};
exports.getAllFeedbacks = getAllFeedbacks;
const getFeedbackByIdController = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user?.id;
        if (!id) {
            return res.status(400).json({ error: 'Invalid feedback ID.' });
        }
        const feedback = await (0, feedback_services_1.getFeedbackById)(id);
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found.' });
        }
        await (0, logs_1.logActivity)({
            userId,
            activity: `Viewed feedback ID ${id}`,
        });
        return res.status(200).json({ message: 'Feedback retrieved.', data: feedback });
    }
    catch (error) {
        console.error('Controller Error - getFeedbackByIdController:', error);
        return res.status(500).json({ error: 'Failed to fetch feedback.' });
    }
};
exports.getFeedbackByIdController = getFeedbackByIdController;
const getFeedbackForUser = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: Invalid user ID.' });
        }
        const feedbacks = await (0, feedback_services_1.getUserFeedback)(userId);
        await (0, logs_1.logActivity)({
            userId,
            activity: 'Viewed their own feedback list',
        });
        return res.status(200).json({ message: 'User feedback retrieved.', data: feedbacks });
    }
    catch (error) {
        console.error('Controller Error - getFeedbackForUser:', error);
        return res.status(500).json({ error: error.message || 'Failed to retrieve feedback.' });
    }
};
exports.getFeedbackForUser = getFeedbackForUser;
