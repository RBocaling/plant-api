"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupportConcernById = exports.getAllSupportConcerns = exports.replyToSupport = exports.createSupportConcern = void 0;
const support_chat_services_1 = require("../services/support_chat.services");
const supportValidation_1 = require("../utils/supportValidation");
const createSupportConcern = async (req, res) => {
    try {
        const { image, urgency, generateInitialAiReply } = req.body;
        const customer_id = req.user?.id;
        if (!image) {
            return res.status(400).json({ error: 'image is required.' });
        }
        const concern_msg = (0, supportValidation_1.validateSupportMessage)(req.body?.concern_msg);
        const validatedUrgency = (0, supportValidation_1.validateUrgency)(urgency);
        if (!concern_msg) {
            return res.status(400).json({ error: 'concern_msg and image are required.' });
        }
        const support = await (0, support_chat_services_1.submitSupportConcern)({
            concern_msg,
            image,
            customer_id,
            urgency: validatedUrgency,
            generateInitialAiReply: Boolean(generateInitialAiReply),
        });
        return res.status(201).json({ message: 'Support concern submitted.', data: support });
    }
    catch (error) {
        if (error?.message?.includes("Support message") ||
            error?.message?.includes("Urgency must be") ||
            error?.message?.includes("Customer ID is required")) {
            return res.status(400).json({ error: error.message });
        }
        console.error("Support concern creation failed.");
        return res.status(500).json({ error: 'Failed to submit concern.' });
    }
};
exports.createSupportConcern = createSupportConcern;
const replyToSupport = async (req, res) => {
    try {
        const { id, response } = req.body;
        if (!id || !response) {
            return res.status(400).json({ error: 'ID and response are required.' });
        }
        const updated = await (0, support_chat_services_1.updateResponse)(id, response);
        return res.status(200).json({
            message: 'Response sent to customer and saved.',
            data: updated,
        });
    }
    catch (error) {
        console.error("Support reply failed.");
        return res.status(500).json({ error: error.message || 'Failed to respond.' });
    }
};
exports.replyToSupport = replyToSupport;
const getAllSupportConcerns = async (req, res) => {
    try {
        const concerns = await (0, support_chat_services_1.fetchAllSupportConcerns)();
        return res.status(200).json({ message: 'All support concerns retrieved.', data: concerns });
    }
    catch (error) {
        console.error("Fetching support concerns failed.");
        return res.status(500).json({ error: 'Failed to fetch support concerns.' });
    }
};
exports.getAllSupportConcerns = getAllSupportConcerns;
const getSupportConcernById = async (req, res) => {
    try {
        const id = req.params.id;
        const concern = await (0, support_chat_services_1.getSupportConcernByIdAdmin)(id);
        if (!concern) {
            return res.status(404).json({ error: 'Support concern not found.' });
        }
        return res.status(200).json({ message: 'Support concern retrieved.', data: concern });
    }
    catch (error) {
        console.error("Fetching support concern by ID failed.");
        return res.status(500).json({ error: 'Failed to fetch support concern.' });
    }
};
exports.getSupportConcernById = getSupportConcernById;
