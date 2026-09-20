const API_BASE = '/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

class ApiService {
  private isOnlineState: boolean = navigator.onLine;
  private offlineQueue: Array<{ url: string; options: RequestInit }> = [];

  constructor() {
    window.addEventListener('online', () => {
      this.isOnlineState = true;
      this.syncOfflineQueue();
    });
    window.addEventListener('offline', () => {
      this.isOnlineState = false;
    });
  }

  isOnline() {
    return this.isOnlineState;
  }

  async syncOfflineQueue() {
    if (this.offlineQueue.length === 0) return;
    console.log(`Syncing ${this.offlineQueue.length} queued offline actions...`);
    const queue = [...this.offlineQueue];
    this.offlineQueue = [];
    for (const item of queue) {
      try {
        await fetch(item.url, item.options);
      } catch (err) {
        console.warn('Sync retry failed for item, re-queuing:', err);
        this.offlineQueue.push(item);
      }
    }
  }

  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      console.warn(`API request to ${endpoint} failed:`, err);
      if (options.method && options.method !== 'GET') {
        this.offlineQueue.push({ url, options });
      }
      throw err;
    }
  }

  // Auth
  login(email: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  switchRole(role: string) {
    return this.request('/auth/switch-role', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
  }

  // Patients
  getPatients() {
    return this.request('/patients');
  }

  getPatient(id: string) {
    return this.request(`/patients/${id}`);
  }

  identifyPatient(payload: any) {
    return this.request('/patients/identify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  recordConsent(patientId: string, granted: boolean, audioListened: boolean) {
    return this.request(`/patients/${patientId}/consent`, {
      method: 'POST',
      body: JSON.stringify({ granted, audioListened }),
    });
  }

  // Intake
  submitChiefComplaint(encounterId: string, patientId: string, rawInput: string, language: string) {
    return this.request('/intake/chief-complaint', {
      method: 'POST',
      body: JSON.stringify({ encounterId, patientId, rawInput, language }),
    });
  }

  answerQuestion(payload: any) {
    return this.request('/intake/question/answer', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Documents & OCR
  uploadAndOcrDocument(payload: any) {
    return this.request('/documents/upload-and-ocr', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  actionExtraction(docId: string, payload: any) {
    return this.request(`/documents/${docId}/extraction-action`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Timeline
  getTimeline(patientId: string, type?: string) {
    const query = type ? `?type=${type}` : '';
    return this.request(`/timeline/${patientId}${query}`);
  }

  // Physician
  getPhysicianQueue() {
    return this.request('/physician/queue');
  }

  get30SecSummary(encounterId: string) {
    return this.request(`/physician/summary/${encounterId}`);
  }

  confirmClinicalFact(encounterId: string, payload: any) {
    return this.request(`/physician/history/${encounterId}/confirm-item`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  resolvePhysicianItem(encounterId: string, payload: any) {
    return this.request(`/physician/history/${encounterId}/resolve-item`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  finalizeEncounter(encounterId: string, physicianNote: string) {
    return this.request(`/physician/encounter/${encounterId}/finalize`, {
      method: 'POST',
      body: JSON.stringify({ physicianNote }),
    });
  }

  getFhirBundle(encounterId: string) {
    return this.request(`/physician/encounter/${encounterId}/fhir-bundle`);
  }

  // Triage
  getTriageAlerts() {
    return this.request('/triage/alerts');
  }

  actionTriageAlert(alertId: string, payload: any) {
    return this.request(`/triage/alerts/${alertId}/action`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // AYUSH
  getAyushAssessment(patientId: string) {
    return this.request(`/ayush/assessment/${patientId}`);
  }

  submitAyushAssessment(payload: any) {
    return this.request('/ayush/assessment', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Admin & OPD Command Center
  getOpdCommandCenterMetrics() {
    return this.request('/admin/opd-command-center');
  }

  getAuditLogs() {
    return this.request('/admin/audit-logs');
  }

  // Privacy
  getPrivacyLogs(patientId: string) {
    return this.request(`/privacy/logs/${patientId}`);
  }

  withdrawConsent(patientId: string) {
    return this.request(`/privacy/withdraw-consent/${patientId}`, {
      method: 'POST',
    });
  }

  exportData(patientId: string) {
    return this.request(`/privacy/export-data/${patientId}`);
  }
}

export const api = new ApiService();
