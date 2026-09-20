"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const database_1 = require("../models/database");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post('/login', (req, res) => {
    const { email } = req.body;
    const user = database_1.db.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase()) || database_1.db.users[0];
    res.json({
        success: true,
        user,
        token: `jwt_token_${user.id}_${Date.now()}`,
        message: `Logged in as ${user.name} (${user.role})`,
    });
});
exports.authRouter.get('/me', (req, res) => {
    const role = req.query.role || 'DOCTOR';
    const user = database_1.db.users.find((u) => u.role === role.toUpperCase()) || database_1.db.users[0];
    res.json({ success: true, user });
});
exports.authRouter.post('/switch-role', (req, res) => {
    const { role } = req.body;
    const user = database_1.db.users.find((u) => u.role === role) || database_1.db.users[0];
    database_1.db.auditLogs.unshift({
        id: `aud_switch_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        action: 'ROLE_SWITCH_DEMO',
        resource: 'Application Session',
        details: `Demo session switched to role ${user.role} (${user.name})`,
        ipAddress: '127.0.0.1',
    });
    res.json({ success: true, user });
});
