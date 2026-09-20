"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./routes/auth");
const patients_1 = require("./routes/patients");
const intake_1 = require("./routes/intake");
const documents_1 = require("./routes/documents");
const timeline_1 = require("./routes/timeline");
const physician_1 = require("./routes/physician");
const triage_1 = require("./routes/triage");
const ayush_1 = require("./routes/ayush");
const admin_1 = require("./routes/admin");
const privacy_1 = require("./routes/privacy");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
// Request Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});
// API Routes
app.use('/api/auth', auth_1.authRouter);
app.use('/api/patients', patients_1.patientsRouter);
app.use('/api/intake', intake_1.intakeRouter);
app.use('/api/documents', documents_1.documentsRouter);
app.use('/api/timeline', timeline_1.timelineRouter);
app.use('/api/physician', physician_1.physicianRouter);
app.use('/api/triage', triage_1.triageRouter);
app.use('/api/ayush', ayush_1.ayushRouter);
app.use('/api/admin', admin_1.adminRouter);
app.use('/api/privacy', privacy_1.privacyRouter);
// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'HEALTHY',
        service: 'CHIKITSABODHA Clinical Backend API',
        tagline: 'From Patient Voice to Clinical Understanding',
        architecture: 'ABDM / FHIR-ready',
        timestamp: new Date().toISOString(),
        demoMode: true,
    });
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error in clinical intelligence engine',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  CHIKITSABODHA API Server running on port ${PORT}`);
    console.log(`  "From Patient Voice to Clinical Understanding"`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
});
