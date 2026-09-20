import { Patient, Encounter, StructuredHistory } from '../types';

export function exportToAbdmFhirBundle(
  patient: Patient,
  encounter: Encounter,
  history: StructuredHistory
) {
  const timestamp = new Date().toISOString();

  return {
    resourceType: 'Bundle',
    id: `chikitsabodha-bundle-${encounter.id}`,
    meta: {
      versionId: '1.0',
      lastUpdated: timestamp,
      profile: [
        'https://nrces.in/ndhm/fhir/r4/StructureDefinition/ClinicalArtifactBundle'
      ],
      tag: [
        {
          system: 'https://chikitsabodha.health/standards',
          code: 'abdm-fhir-ready-v1',
          display: 'ChikitsaBodha Pre-Consultation Clinical Intake'
        }
      ]
    },
    identifier: {
      system: 'https://chikitsabodha.health/encounters',
      value: encounter.id
    },
    type: 'document',
    timestamp: timestamp,
    entry: [
      // 1. Patient Resource
      {
        fullUrl: `urn:uuid:patient-${patient.id}`,
        resource: {
          resourceType: 'Patient',
          id: patient.id,
          identifier: [
            {
              system: 'https://healthid.ndhm.gov.in',
              value: patient.abhaId,
              type: { coding: [{ code: 'ABHA', display: 'Ayushman Bharat Health Account' }] }
            },
            {
              system: 'https://hospital.chikitsabodha.health/uhid',
              value: patient.uhid,
              type: { coding: [{ code: 'MR', display: 'Medical Record Number' }] }
            }
          ],
          name: [{ text: patient.name }],
          gender: patient.gender.toLowerCase(),
          telecom: [{ system: 'phone', value: patient.phone }]
        }
      },
      // 2. Encounter Resource
      {
        fullUrl: `urn:uuid:encounter-${encounter.id}`,
        resource: {
          resourceType: 'Encounter',
          id: encounter.id,
          status: 'in-progress',
          class: {
            system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
            code: 'AMB',
            display: 'ambulatory outpatient'
          },
          subject: { reference: `urn:uuid:patient-${patient.id}` },
          serviceType: { text: encounter.department }
        }
      },
      // 3. Condition (Chief Complaint)
      {
        fullUrl: `urn:uuid:condition-cc`,
        resource: {
          resourceType: 'Condition',
          clinicalStatus: {
            coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }]
          },
          category: [{ coding: [{ code: 'problem-list-item', display: 'Problem List Item' }] }],
          code: { text: history.chiefComplaint.value },
          subject: { reference: `urn:uuid:patient-${patient.id}` }
        }
      },
      // 4. Provenance Resource (Highlighting trace to patient voice & document OCR)
      {
        fullUrl: `urn:uuid:provenance-intake`,
        resource: {
          resourceType: 'Provenance',
          target: [
            { reference: `urn:uuid:condition-cc` }
          ],
          recorded: timestamp,
          reason: [{ text: 'Pre-consultation clinical intake structured via ChikitsaBodha engine' }],
          agent: [
            {
              type: {
                coding: [{ system: 'http://terminology.hl7.org/CodeSystem/provenance-participant-type', code: 'author' }]
              },
              who: { display: 'ChikitsaBodha Clinical AI & Patient Kiosk' }
            },
            {
              type: {
                coding: [{ system: 'http://terminology.hl7.org/CodeSystem/provenance-participant-type', code: 'verifier' }]
              },
              who: { display: history.confirmedBy || 'Physician Verification Pending' }
            }
          ]
        }
      }
    ]
  };
}
