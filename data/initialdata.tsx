export const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    type: "databaseSchema",
    data: {
      label: "Patients",
      schema: [
        { id: "patients-id", title: "id", key: "PK", type: "uuid" },
        { id: "patients-name", title: "name", type: "varchar" },
        { id: "patients-dob", title: "dob", type: "date" },
        { id: "patients-gender", title: "gender", type: "varchar" },
        { id: "patients-phone", title: "phone", type: "varchar" },
        { id: "patients-address", title: "address", type: "varchar" },
        { id: "patients-email", title: "email", type: "varchar" },
        { id: "patients-emergency_contact", title: "emergency_contact", type: "varchar" },
        { id: "patients-blood_type", title: "blood_type", type: "varchar" },
      ],
    },
  },
  {
    id: "2",
    position: { x: 350, y: 0 },
    type: "databaseSchema",
    data: {
      label: "Doctors",
      schema: [
        { id: "doctors-id", title: "id", key: "PK", type: "uuid" },
        { id: "doctors-name", title: "name", type: "varchar" },
        { id: "doctors-specialization", title: "specialization", type: "varchar" },
        { id: "doctors-department_id", title: "department_id", key: "FK", type: "uuid" },
        { id: "doctors-phone", title: "phone", type: "varchar" },
        { id: "doctors-email", title: "email", type: "varchar" },
      ],
    },
  },
  {
    id: "3",
    position: { x: 700, y: 0 },
    type: "databaseSchema",
    data: {
      label: "Departments",
      schema: [
        { id: "departments-id", title: "id", key: "PK", type: "uuid" },
        { id: "departments-name", title: "name", type: "varchar" },
        { id: "departments-location", title: "location", type: "varchar" },
      ],
    },
  },
  {
    id: "4",
    position: { x: 0, y: 250 },
    type: "databaseSchema",
    data: {
      label: "Appointments",
      schema: [
        { id: "appointments-id", title: "id", key: "PK", type: "uuid" },
        { id: "appointments-patient_id", title: "patient_id", key: "FK", type: "uuid" },
        { id: "appointments-doctor_id", title: "doctor_id", key: "FK", type: "uuid" },
        { id: "appointments-date", title: "date", type: "date" },
        { id: "appointments-time", title: "time", type: "time" },
        { id: "appointments-status", title: "status", type: "varchar" },
      ],
    },
  },
  {
    id: "5",
    position: { x: 350, y: 250 },
    type: "databaseSchema",
    data: {
      label: "MedicalRecords",
      schema: [
        { id: "medicalrecords-id", title: "id", key: "PK", type: "uuid" },
        { id: "medicalrecords-patient_id", title: "patient_id", key: "FK", type: "uuid" },
        { id: "medicalrecords-diagnosis", title: "diagnosis", type: "text" },
        { id: "medicalrecords-treatment", title: "treatment", type: "text" },
        { id: "medicalrecords-doctor_notes", title: "doctor_notes", type: "text" },
        { id: "medicalrecords-created_at", title: "created_at", type: "timestamp" },
      ],
    },
  },
  {
    id: "6",
    position: { x: 700, y: 250 },
    type: "databaseSchema",
    data: {
      label: "Billing",
      schema: [
        { id: "billing-id", title: "id", key: "PK", type: "uuid" },
        { id: "billing-patient_id", title: "patient_id", key: "FK", type: "uuid" },
        { id: "billing-amount", title: "amount", type: "decimal" },
        { id: "billing-status", title: "status", type: "varchar" },
        { id: "billing-due_date", title: "due_date", type: "date" },
      ],
    },
  },
  {
    id: "7",
    position: { x: 1050, y: 0 },
    type: "databaseSchema",
    data: {
      label: "Medications",
      schema: [
        { id: "medications-id", title: "id", key: "PK", type: "uuid" },
        { id: "medications-name", title: "name", type: "varchar" },
        { id: "medications-description", title: "description", type: "text" },
        { id: "medications-dosage", title: "dosage", type: "varchar" },
      ],
    },
  },
  {
    id: "8",
    position: { x: 1050, y: 250 },
    type: "databaseSchema",
    data: {
      label: "Prescriptions",
      schema: [
        { id: "prescriptions-id", title: "id", key: "PK", type: "uuid" },
        { id: "prescriptions-patient_id", title: "patient_id", key: "FK", type: "uuid" },
        { id: "prescriptions-doctor_id", title: "doctor_id", key: "FK", type: "uuid" },
        { id: "prescriptions-medication_id", title: "medication_id", key: "FK", type: "uuid" },
        { id: "prescriptions-dosage", title: "dosage", type: "varchar" },
        { id: "prescriptions-duration", title: "duration", type: "varchar" },
      ],
    },
  },
];

export const initialEdges = [
  {data: {}, id: "e2-4", source: "2", sourceHandle: "doctors-id-right", target: "4", targetHandle: "appointments-doctor_id-left", type: "superCurvyEdge", markerStart: "one-start", markerEnd: "many-end" },
  {data: {}, id: "e1-4", source: "1", sourceHandle: "patients-id-right", target: "4", targetHandle: "appointments-patient_id-left", type: "superCurvyEdge", markerStart: "one-start", markerEnd: "many-end" },
  {data: {}, id: "e2-3", source: "2", sourceHandle: "doctors-department_id-right", target: "3", targetHandle: "departments-id-left", type: "superCurvyEdge", markerStart: "one-start", markerEnd: "one-end" },
  {data: {}, id: "e1-5", source: "1", sourceHandle: "patients-id-right", target: "5", targetHandle: "medicalrecords-patient_id-left", type: "superCurvyEdge", markerStart: "one-start", markerEnd: "many-end" },
  {data: {}, id: "e1-6", source: "1", sourceHandle: "patients-id-right", target: "6", targetHandle: "billing-patient_id-left", type: "superCurvyEdge", markerStart: "one-start", markerEnd: "many-end" },
  {data: {}, id: "e1-8", source: "1", sourceHandle: "patients-id-right", target: "8", targetHandle: "prescriptions-patient_id-left", type: "superCurvyEdge", markerStart: "one-start", markerEnd: "many-end" },
  {data: {}, id: "e2-8", source: "2", sourceHandle: "doctors-id-right", target: "8", targetHandle: "prescriptions-doctor_id-left", type: "superCurvyEdge", markerStart: "one-start", markerEnd: "many-end" },
  {data: {}, id: "e7-8", source: "7", sourceHandle: "medications-id-right", target: "8", targetHandle: "prescriptions-medication_id-left", type: "superCurvyEdge", markerStart: "one-start", markerEnd: "one-end" },
];
