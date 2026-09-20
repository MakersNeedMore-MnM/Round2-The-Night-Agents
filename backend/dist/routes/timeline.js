"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timelineRouter = void 0;
const express_1 = require("express");
const database_1 = require("../models/database");
exports.timelineRouter = (0, express_1.Router)();
exports.timelineRouter.get('/:patientId', (req, res) => {
    const { type } = req.query;
    let events = database_1.db.timelineEvents.filter((e) => e.patientId === req.params.patientId);
    if (type && type !== 'ALL') {
        events = events.filter((e) => e.type === type.toUpperCase());
    }
    // Sort by date descending
    events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json({
        success: true,
        patientId: req.params.patientId,
        timeline: events,
    });
});
