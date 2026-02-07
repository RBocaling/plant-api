"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupportConcernById = exports.getAllSupportConcerns = exports.replyToSupport = exports.createSupportConcern = void 0;
const support_chat_services_1 = require("../services/support_chat.services");
const createSupportConcern = async (req, res) => {
    try {
        const { concern_msg, image } = req.body;
        const customer_id = Number(req.user?.id);
        if (!concern_msg || !image) {
            return res.status(400).json({ error: 'concern_msg and image are required.' });
        }
        const support = await (0, support_chat_services_1.submitSupportConcern)({ concern_msg, image, customer_id });
        return res.status(201).json({ message: 'Support concern submitted.', data: support });
    }
    catch (error) {
        console.error('Controller Error:', error);
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
        const updated = await (0, support_chat_services_1.updateResponse)(Number(id), response);
        return res.status(200).json({
            message: 'Response sent to customer and saved.',
            data: updated,
        });
    }
    catch (error) {
        console.error('Controller Error - replyToSupport:', error);
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
        console.error('Controller Error:', error);
        return res.status(500).json({ error: 'Failed to fetch support concerns.' });
    }
};
exports.getAllSupportConcerns = getAllSupportConcerns;
const getSupportConcernById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const concern = await (0, support_chat_services_1.getSupportConcernByIdAdmin)(id);
        if (!concern) {
            return res.status(404).json({ error: 'Support concern not found.' });
        }
        return res.status(200).json({ message: 'Support concern retrieved.', data: concern });
    }
    catch (error) {
        console.error('Controller Error:', error);
        return res.status(500).json({ error: 'Failed to fetch support concern.' });
    }
};
exports.getSupportConcernById = getSupportConcernById;
