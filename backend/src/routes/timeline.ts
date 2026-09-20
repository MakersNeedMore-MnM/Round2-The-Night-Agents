import { Router } from 'express';
import { db } from '../models/database';

export const timelineRouter = Router();

timelineRouter.get('/:patientId', (req, res) => {
  const { type } = req.query;
  let events = db.timelineEvents.filter((e) => e.patientId === req.params.patientId);

  if (type && type !== 'ALL') {
    events = events.filter((e) => e.type === (type as string).toUpperCase());
  }

  // Sort by date descending
  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  res.json({
    success: true,
    patientId: req.params.patientId,
    timeline: events,
  });
});
