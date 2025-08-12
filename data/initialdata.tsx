// export const initialNodes = [
//   {
//     id: "1",
//     position: { x: 0, y: 0 },
//     type: "databaseSchema",
//     data: {
//       label: "Patients",
//       schema: [
//         { id: "patients-id", title: "id", key: "PK", type: "uuid" },
//         { id: "patients-name", title: "name", type: "varchar" },
//         { id: "patients-dob", title: "dob", type: "date" },
//         { id: "patients-gender", title: "gender", type: "varchar" },
//         { id: "patients-phone", title: "phone", type: "varchar" },
//         { id: "patients-address", title: "address", type: "varchar" },
//         { id: "patients-email", title: "email", type: "varchar" },
//         { id: "patients-emergency_contact", title: "emergency_contact", type: "varchar" },
//         { id: "patients-blood_type", title: "blood_type", type: "varchar" },
//       ],
//     },
//   },
//   {
//     id: "2",
//     position: { x: 350, y: 0 },
//     type: "databaseSchema",
//     data: {
//       label: "Doctors",
//       schema: [
//         { id: "doctors-id", title: "id", key: "PK", type: "uuid" },
//         { id: "doctors-name", title: "name", type: "varchar" },
//         { id: "doctors-specialization", title: "specialization", type: "varchar" },
//         { id: "doctors-department_id", title: "department_id", key: "FK", type: "uuid" },
//         { id: "doctors-phone", title: "phone", type: "varchar" },
//         { id: "doctors-email", title: "email", type: "varchar" },
//       ],
//     },
//   },
//   {
//     id: "3",
//     position: { x: 700, y: 0 },
//     type: "databaseSchema",
//     data: {
//       label: "Departments",
//       schema: [
//         { id: "departments-id", title: "id", key: "PK", type: "uuid" },
//         { id: "departments-name", title: "name", type: "varchar" },
//         { id: "departments-location", title: "location", type: "varchar" },
//       ],
//     },
//   },
//   {
//     id: "4",
//     position: { x: 0, y: 250 },
//     type: "databaseSchema",
//     data: {
//       label: "Appointments",
//       schema: [
//         { id: "appointments-id", title: "id", key: "PK", type: "uuid" },
//         { id: "appointments-patient_id", title: "patient_id", key: "FK", type: "uuid" },
//         { id: "appointments-doctor_id", title: "doctor_id", key: "FK", type: "uuid" },
//         { id: "appointments-date", title: "date", type: "date" },
//         { id: "appointments-time", title: "time", type: "time" },
//         { id: "appointments-status", title: "status", type: "varchar" },
//       ],
//     },
//   },
//   {
//     id: "5",
//     position: { x: 350, y: 250 },
//     type: "databaseSchema",
//     data: {
//       label: "MedicalRecords",
//       schema: [
//         { id: "medicalrecords-id", title: "id", key: "PK", type: "uuid" },
//         { id: "medicalrecords-patient_id", title: "patient_id", key: "FK", type: "uuid" },
//         { id: "medicalrecords-diagnosis", title: "diagnosis", type: "text" },
//         { id: "medicalrecords-treatment", title: "treatment", type: "text" },
//         { id: "medicalrecords-doctor_notes", title: "doctor_notes", type: "text" },
//         { id: "medicalrecords-created_at", title: "created_at", type: "timestamp" },
//       ],
//     },
//   },
//   {
//     id: "6",
//     position: { x: 700, y: 250 },
//     type: "databaseSchema",
//     data: {
//       label: "Billing",
//       schema: [
//         { id: "billing-id", title: "id", key: "PK", type: "uuid" },
//         { id: "billing-patient_id", title: "patient_id", key: "FK", type: "uuid" },
//         { id: "billing-amount", title: "amount", type: "decimal" },
//         { id: "billing-status", title: "status", type: "varchar" },
//         { id: "billing-due_date", title: "due_date", type: "date" },
//       ],
//     },
//   },
//   {
//     id: "7",
//     position: { x: 1050, y: 0 },
//     type: "databaseSchema",
//     data: {
//       label: "Medications",
//       schema: [
//         { id: "medications-id", title: "id", key: "PK", type: "uuid" },
//         { id: "medications-name", title: "name", type: "varchar" },
//         { id: "medications-description", title: "description", type: "text" },
//         { id: "medications-dosage", title: "dosage", type: "varchar" },
//       ],
//     },
//   },
//   {
//     id: "8",
//     position: { x: 1050, y: 250 },
//     type: "databaseSchema",
//     data: {
//       label: "Prescriptions",
//       schema: [
//         { id: "prescriptions-id", title: "id", key: "PK", type: "uuid" },
//         { id: "prescriptions-patient_id", title: "patient_id", key: "FK", type: "uuid" },
//         { id: "prescriptions-doctor_id", title: "doctor_id", key: "FK", type: "uuid" },
//         { id: "prescriptions-medication_id", title: "medication_id", key: "FK", type: "uuid" },
//         { id: "prescriptions-dosage", title: "dosage", type: "varchar" },
//         { id: "prescriptions-duration", title: "duration", type: "varchar" },
//       ],
//     },
//   },
// ];

// export const initialEdges = [
//   {data: {}, id: "e2-4", source: "2", sourceHandle: "doctors-id-right", target: "4", targetHandle: "appointments-doctor_id-left", type: "superCurvyEdge", markerStart: "one-start", markerEnd: "many-end" },
//   {data: {}, id: "e1-4", source: "1", sourceHandle: "patients-id-right", target: "4", targetHandle: "appointments-patient_id-left", type: "superCurvyEdge", markerStart: "one-start", markerEnd: "many-end" },
//   {data: {}, id: "e2-3", source: "2", sourceHandle: "doctors-department_id-right", target: "3", targetHandle: "departments-id-left", type: "superCurvyEdge", markerStart: "one-start", markerEnd: "one-end" },
//   {data: {}, id: "e1-5", source: "1", sourceHandle: "patients-id-right", target: "5", targetHandle: "medicalrecords-patient_id-left", type: "superCurvyEdge", markerStart: "one-start", markerEnd: "many-end" },
//   {data: {}, id: "e1-6", source: "1", sourceHandle: "patients-id-right", target: "6", targetHandle: "billing-patient_id-left", type: "superCurvyEdge", markerStart: "one-start", markerEnd: "many-end" },
//   {data: {}, id: "e1-8", source: "1", sourceHandle: "patients-id-right", target: "8", targetHandle: "prescriptions-patient_id-left", type: "superCurvyEdge", markerStart: "one-start", markerEnd: "many-end" },
//   {data: {}, id: "e2-8", source: "2", sourceHandle: "doctors-id-right", target: "8", targetHandle: "prescriptions-doctor_id-left", type: "superCurvyEdge", markerStart: "one-start", markerEnd: "many-end" },
//   {data: {}, id: "e7-8", source: "7", sourceHandle: "medications-id-right", target: "8", targetHandle: "prescriptions-medication_id-left", type: "superCurvyEdge", markerStart: "one-start", markerEnd: "one-end" },
// ];

export const initialNodes = [
  {
    id: "patient-schema",
    position: {
      x: 0,
      y: 0,
    },
    type: "databaseSchema",
    data: {
      label: "Patients",
      schema: [
        {
          id: "patient-id",
          title: "id",
          type: "UUID",
          key: "PK",
        },
        {
          id: "patient-name",
          title: "name",
          type: "VARCHAR(255)",
        },
        {
          id: "patient-dob",
          title: "date_of_birth",
          type: "DATE",
        },
        {
          id: "patient-gender",
          title: "gender",
          type: "VARCHAR(50)",
        },
        {
          id: "patient-phone",
          title: "phone",
          type: "VARCHAR(20)",
        },
        {
          id: "patient-address",
          title: "address",
          type: "VARCHAR(255)",
        },
      ],
    },
  },
  {
    id: "ward-schema",
    position: {
      x: 300,
      y: 0,
    },
    type: "databaseSchema",
    data: {
      label: "Wards",
      schema: [
        {
          id: "ward-id",
          title: "id",
          type: "UUID",
          key: "PK",
        },
        {
          id: "ward-number",
          title: "ward_number",
          type: "INT",
        },
        {
          id: "ward-capacity",
          title: "capacity",
          type: "INT",
        },
        {
          id: "ward-type",
          title: "type",
          type: "VARCHAR(100)",
        },
      ],
    },
  },
  {
    id: "admission-schema",
    position: {
      x: 600,
      y: 0,
    },
    type: "databaseSchema",
    data: {
      label: "Admissions",
      schema: [
        {
          id: "admission-id",
          title: "id",
          type: "UUID",
          key: "PK",
        },
        {
          id: "admission-patient-id",
          title: "patient_id",
          type: "UUID",
          key: "FK",
        },
        {
          id: "admission-ward-id",
          title: "ward_id",
          type: "UUID",
          key: "FK",
        },
        {
          id: "admission-date",
          title: "admission_date",
          type: "DATE",
        },
        {
          id: "admission-discharge-date",
          title: "discharge_date",
          type: "DATE",
        },
        {
          id: "admission-reason",
          title: "reason",
          type: "TEXT",
        },
      ],
    },
  },
  {
    id: "doctor-schema",
    position: {
      x: 0,
      y: 300,
    },
    type: "databaseSchema",
    data: {
      label: "Doctors",
      schema: [
        {
          id: "doctor-id",
          title: "id",
          type: "UUID",
          key: "PK",
        },
        {
          id: "doctor-name",
          title: "name",
          type: "VARCHAR(255)",
        },
        {
          id: "doctor-specialization",
          title: "specialization",
          type: "VARCHAR(255)",
        },
        {
          id: "doctor-phone",
          title: "phone",
          type: "VARCHAR(20)",
        },
      ],
    },
  },
  {
    id: "appointment-schema",
    position: {
      x: 300,
      y: 300,
    },
    type: "databaseSchema",
    data: {
      label: "Appointments",
      schema: [
        {
          id: "appointment-id",
          title: "id",
          type: "UUID",
          key: "PK",
        },
        {
          id: "appointment-patient-id",
          title: "patient_id",
          type: "UUID",
          key: "FK",
        },
        {
          id: "appointment-doctor-id",
          title: "doctor_id",
          type: "UUID",
          key: "FK",
        },
        {
          id: "appointment-date",
          title: "appointment_date",
          type: "DATETIME",
        },
        {
          id: "appointment-reason",
          title: "reason",
          type: "TEXT",
        },
      ],
    },
  },
  {
    id: "prescription-schema",
    position: {
      x: 600,
      y: 300,
    },
    type: "databaseSchema",
    data: {
      label: "Prescriptions",
      schema: [
        {
          id: "prescription-id",
          title: "id",
          type: "UUID",
          key: "PK",
        },
        {
          id: "prescription-patient-id",
          title: "patient_id",
          type: "UUID",
          key: "FK",
        },
        {
          id: "prescription-doctor-id",
          title: "doctor_id",
          type: "UUID",
          key: "FK",
        },
        {
          id: "prescription-medication",
          title: "medication",
          type: "VARCHAR(255)",
        },
        {
          id: "prescription-dosage",
          title: "dosage",
          type: "VARCHAR(100)",
        },
        {
          id: "prescription-date",
          title: "prescription_date",
          type: "DATE",
        },
      ],
    },
  },
  {
    id: "billing-schema",
    position: {
      x: 300,
      y: 600,
    },
    type: "databaseSchema",
    data: {
      label: "Billing",
      schema: [
        {
          id: "billing-id",
          title: "id",
          type: "UUID",
          key: "PK",
        },
        {
          id: "billing-patient-id",
          title: "patient_id",
          type: "UUID",
          key: "FK",
        },
        {
          id: "billing-admission-id",
          title: "admission_id",
          type: "UUID",
          key: "FK",
        },
        {
          id: "billing-amount",
          title: "amount",
          type: "DECIMAL(10,2)",
        },
        {
          id: "billing-date",
          title: "billing_date",
          type: "DATE",
        },
        {
          id: "billing-status",
          title: "status",
          type: "VARCHAR(50)",
        },
      ],
    },
  },
];
export const initialEdges = [
  {
    id: "patient-admission",
    source: "patient-schema",
    target: "admission-schema",
    sourceHandle: "patient-id-right",
    targetHandle: "admission-patient-id-left",
    type: "superCurvyEdge",
    markerStart: "relation-start",
    markerEnd: "relation-end",
    data: {
      meta: "1:N",
    },
  },
  {
    id: "ward-admission",
    source: "ward-schema",
    target: "admission-schema",
    sourceHandle: "ward-id-right",
    targetHandle: "admission-ward-id-left",
    type: "superCurvyEdge",
    markerStart: "relation-start",
    markerEnd: "relation-end",
    data: {
      meta: "1:N",
    },
  },
  {
    id: "patient-appointment",
    source: "patient-schema",
    target: "appointment-schema",
    sourceHandle: "patient-id-right",
    targetHandle: "appointment-patient-id-left",
    type: "superCurvyEdge",
    markerStart: "relation-start",
    markerEnd: "relation-end",
    data: {
      meta: "1:N",
    },
  },
  {
    id: "doctor-appointment",
    source: "doctor-schema",
    target: "appointment-schema",
    sourceHandle: "doctor-id-right",
    targetHandle: "appointment-doctor-id-left",
    type: "superCurvyEdge",
    markerStart: "relation-start",
    markerEnd: "relation-end",
    data: {
      meta: "1:N",
    },
  },
  {
    id: "patient-prescription",
    source: "patient-schema",
    target: "prescription-schema",
    sourceHandle: "patient-id-right",
    targetHandle: "prescription-patient-id-left",
    type: "superCurvyEdge",
    markerStart: "relation-start",
    markerEnd: "relation-end",
    data: {
      meta: "1:N",
    },
  },
  {
    id: "doctor-prescription",
    source: "doctor-schema",
    target: "prescription-schema",
    sourceHandle: "doctor-id-right",
    targetHandle: "prescription-doctor-id-left",
    type: "superCurvyEdge",
    markerStart: "one-start",
    markerEnd: "zero-to-many-end",
    data: {
      meta: "1:N",
    },
  },
  {
    id: "patient-billing",
    source: "patient-schema",
    target: "billing-schema",
    sourceHandle: "patient-id-right",
    targetHandle: "billing-patient-id-left",
    type: "superCurvyEdge",
    markerStart: "relation-start",
    markerEnd: "relation-end",
    data: {
      meta: "1:N",
    },
  },
  {
    id: "admission-billing",
    source: "admission-schema",
    target: "billing-schema",
    sourceHandle: "admission-id-left",
    targetHandle: "billing-admission-id-right",
    type: "superCurvyEdge",
    markerStart: "relation-start",
    markerEnd: "relation-end",
    data: {
      meta: "1:1",
    },
  },
];
