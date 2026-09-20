"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triageRouter = void 0;
const express_1 = require("express");
const database_1 = require("../models/database");
exports.triageRouter = (0, express_1.Router)();
exports.triageRouter.get('/alerts', (req, res) => {
    const alerts = database_1.db.triageAlerts;
    const redAlerts = alerts.filter((a) => a.priority === 'RED' && a.status === 'ACTIVE');
    const orangeAlerts = alerts.filter((a) => a.priority === 'ORANGE' && a.status === 'ACTIVE');
    const yellowAlerts = alerts.filter((a) => a.priority === 'YELLOW' && a.status === 'ACTIVE');
    res.json({
        success: true,
        stats: {
            redCount: redAlerts.length,
            orangeCount: orangeAlerts.length,
            yellowCount: yellowAlerts.length,
            totalActive: alerts.filter((a) => a.status !== 'RESOLVED').length,
        },
        alerts,
    });
});
exports.triageRouter.post('/alerts/:id/action', (req, res) => {
    const { id } = req.params;
    const { action, staffName, notes } = req.body;
    const alert = database_1.db.triageAlerts.find((a) => a.id === id);
    if (!alert) {
        return res.status(404).json({ success: false, message: 'Triage alert not found' });
    }
    if (action === 'ACKNOWLEDGE') {
        alert.status = 'ACKNOWLEDGED';
        alert.assignedStaff = staffName || 'Nurse Deepa Verma';
    }
    else if (action === 'ASSIGN') {
        alert.status = 'ASSIGNED';
        alert.assignedStaff = staffName || 'Dr. Arvind Sharma (Senior Consultant)';
    }
    else if (action === 'ESCALATE') {
        alert.priority = 'RED';
        alert.notes = (alert.notes ? alert.notes + ' | ' : '') + `Escalated: ${notes || 'Immediate triage priority'}`;
    }
    else if (action === 'RESOLVE') {
        alert.status = 'RESOLVED';
        alert.notes = (alert.notes ? alert.notes + ' | ' : '') + `Resolved: ${notes || 'Patient clinically stabilized'}`;
    }
    // Audit Log
    database_1.db.auditLogs.unshift({
        id: `aud_triage_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorId: 'usr_nur_1',
        actorName: staffName || 'Sister Deepa Verma',
        actorRole: 'NURSE',
        action: `TRIAGE_ALERT_${action}`,
        resource: `Alert ${alert.id} (${alert.patientName})`,
        details: `Triage action: ${action}. Reason: ${alert.reason}`,
        ipAddress: '192.168.1.150 (Triage Desk)',
    });
    res.json({
        success: true,
        alert,
        message: `Alert updated to ${alert.status}`,
    });
});
