import { Router } from 'express';
import { db } from '../models/database';

export const authRouter = Router();

authRouter.post('/login', (req, res) => {
  const { email } = req.body;
  const user = db.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase()) || db.users[0];

  res.json({
    success: true,
    user,
    token: `jwt_token_${user.id}_${Date.now()}`,
    message: `Logged in as ${user.name} (${user.role})`,
  });
});

authRouter.get('/me', (req, res) => {
  const role = (req.query.role as string) || 'DOCTOR';
  const user = db.users.find((u) => u.role === role.toUpperCase()) || db.users[0];
  res.json({ success: true, user });
});

authRouter.post('/switch-role', (req, res) => {
  const { role } = req.body;
  const user = db.users.find((u) => u.role === role) || db.users[0];
  
  db.auditLogs.unshift({
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
