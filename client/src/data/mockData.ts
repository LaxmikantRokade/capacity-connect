import { User, Course, Skill, UserSkill, TrainingSession, KnowledgeArticle, Certificate, Notification, Announcement, Assessment } from '../types';

export const DEMO_USERS: (User & { passwordText: string })[] = [
  {
    id: 'user-learner-1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gov.in',
    passwordText: 'Learner@123',
    role: 'LEARNER',
    jobRole: 'Senior Operations Analyst',
    departmentId: 'dept-gov-ops',
    departmentName: 'Digital Governance & Public Operations',
    bio: 'Focused on digital service delivery transformation, public data pipelines, and cyber hygiene compliance.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    learningGoals: 'Master Cloud Native Architecture and Citizen-Centric Service Delivery frameworks.',
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'user-trainer-1',
    name: 'Priya Nair',
    email: 'priya.nair@trainer.in',
    passwordText: 'Trainer@123',
    role: 'TRAINER',
    jobRole: 'Lead Enterprise Capability Instructor',
    departmentId: 'dept-hr-training',
    departmentName: 'Talent & Capacity Building Cell',
    bio: '12+ years experience conducting enterprise leadership, digital security, and technical workshops across central ministries.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    learningGoals: 'Advanced Gamification & Virtual Reality simulation in workforce upskilling.',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'user-manager-1',
    name: 'Anita Deshmukh',
    email: 'anita.deshmukh@dept.in',
    passwordText: 'Manager@123',
    role: 'MANAGER',
    jobRole: 'Director of Strategic Initiatives',
    departmentId: 'dept-gov-ops',
    departmentName: 'Digital Governance & Public Operations',
    bio: 'Oversees organizational capability benchmarking, performance metrics, and departmental cross-functional teams.',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    learningGoals: 'Competency-based talent redeployment and predictive workforce analytics.',
    createdAt: '2026-01-05T08:30:00Z',
  },
  {
    id: 'user-admin-1',
    name: 'Vikram Malhotra',
    email: 'admin@capacityconnect.in',
    passwordText: 'Admin@123',
    role: 'ADMIN',
    jobRole: 'Principal Platform Administrator',
    departmentId: 'dept-it-systems',
    departmentName: 'Information Systems & Security Division',
    bio: 'Maintains system health, role-based governance policies, audit compliance, and system-wide curriculum workflows.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    learningGoals: 'Zero-trust architecture and automated regulatory compliance pipelines.',
    createdAt: '2026-01-01T00:00:00Z',
  },
];

export const INITIAL_SKILLS: Skill[] = [
  {
    id: 'skill-1',
    name: 'CERT-In Cyber Hygiene & Incident Response',
    category: 'Security',
    description: 'Knowledge of government cyber directives, endpoint security, phishing mitigation, and mandatory breach reporting protocols.',
  },
  {
    id: 'skill-2',
    name: 'Digital Public Infrastructure (DPI) & India Stack',
    category: 'Governance',
    description: 'Architecture and integration patterns for Aadhaar, UPI, DigiLocker, and Account Aggregator APIs.',
  },
  {
    id: 'skill-3',
    name: 'Data-Driven Policy Analytics',
    category: 'Technical',
    description: 'Synthesizing field telemetry, administrative surveys, and relational data pipelines into actionable executive dashboards.',
  },
  {
    id: 'skill-4',
    name: 'Agile Public Program Management',
    category: 'Leadership',
    description: 'Sprint planning, stakeholder roadmapping, barrier escalation, and citizen feedback loop implementation.',
  },
  {
    id: 'skill-5',
    name: 'Cloud Security & Compliance (MeitY Guidelines)',
    category: 'Technical',
    description: 'Government community cloud tenancy, sovereign data storage, encryption at rest, and audit trail retention.',
  },
  {
    id: 'skill-6',
    name: 'Ethical AI & Algorithmic Accountability',
    category: 'Innovation',
    description: 'Evaluating bias, transparency, and data privacy in public sector decision-support machine learning models.',
  },
];

export const INITIAL_USER_SKILLS: UserSkill[] = [
  {
    id: 'usk-1',
    userId: 'user-learner-1',
    skillId: 'skill-1',
    skillName: 'CERT-In Cyber Hygiene & Incident Response',
    category: 'Security',
    selfProficiency: 3,
    verifiedProficiency: 3,
    verifiedBy: 'Anita Deshmukh (Manager)',
    verifiedAt: '2026-02-10T14:30:00Z',
    targetProficiency: 4,
    notes: 'Completed baseline cybersecurity module; scheduled for advanced threat mitigation.',
    updatedAt: '2026-02-10T14:30:00Z',
  },
  {
    id: 'usk-2',
    userId: 'user-learner-1',
    skillId: 'skill-2',
    skillName: 'Digital Public Infrastructure (DPI) & India Stack',
    category: 'Governance',
    selfProficiency: 4,
    verifiedProficiency: 4,
    verifiedBy: 'Priya Nair (Lead Trainer)',
    verifiedAt: '2026-02-01T11:00:00Z',
    targetProficiency: 5,
    notes: 'Demonstrated high competence in DigiLocker integration architectures.',
    updatedAt: '2026-02-01T11:00:00Z',
  },
  {
    id: 'usk-3',
    userId: 'user-learner-1',
    skillId: 'skill-3',
    skillName: 'Data-Driven Policy Analytics',
    category: 'Technical',
    selfProficiency: 2,
    verifiedProficiency: 2,
    verifiedBy: 'Anita Deshmukh (Manager)',
    verifiedAt: '2026-01-20T16:00:00Z',
    targetProficiency: 4,
    notes: 'Identified critical competency gap in automated SQL aggregation and interactive BI tooling.',
    updatedAt: '2026-01-20T16:00:00Z',
  },
  {
    id: 'usk-4',
    userId: 'user-learner-1',
    skillId: 'skill-5',
    skillName: 'Cloud Security & Compliance (MeitY Guidelines)',
    category: 'Technical',
    selfProficiency: 2,
    verifiedProficiency: null, // Unverified self-assessment
    targetProficiency: 4,
    notes: 'Self-reported interest in cloud migration standards.',
    updatedAt: '2026-02-15T09:00:00Z',
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Foundations of Digital Public Infrastructure & India Stack',
    code: 'DPI-101',
    description: 'A comprehensive operational guide to designing, deploying, and scaling public-interest technology systems using India Stack principles: open APIs, digital identity, interoperable payments, and consent-driven data sharing.',
    category: 'Governance & Tech',
    level: 'BEGINNER',
    durationMinutes: 90,
    instructorId: 'user-trainer-1',
    instructorName: 'Priya Nair',
    departmentId: 'dept-gov-ops',
    departmentName: 'Digital Governance & Public Operations',
    learningObjectives: [
      'Understand the 4 core pillars of Digital Public Infrastructure: Identity, Payments, Data, and Trust.',
      'Analyze real-world implementations: Aadhaar eKYC, UPI switchboards, and DigiLocker credentials.',
      'Evaluate architectural principles: Open standards, vendor neutrality, privacy by design, and resilience.',
      'Design citizen-centric workflows minimizing friction and compliance overhead.'
    ],
    prerequisites: 'Basic familiarity with web services and organizational administrative procedures.',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    assessmentCriteria: 'Minimum 75% on the comprehensive final assessment to qualify for verifiable credential.',
    enrollmentCount: 142,
    modules: [
      {
        id: 'mod-1-1',
        courseId: 'course-1',
        title: 'Module 1: The DPI Paradigm vs Monolithic Systems',
        orderIndex: 1,
        durationMinutes: 20,
        contentType: 'TEXT',
        content: `### 1.1 The Shift Towards Digital Public Infrastructure
Digital Public Infrastructure (DPI) refers to digital systems that enable the provision of essential societal services to citizens at population scale. Unlike monolithic proprietary software, DPI is characterized by open interoperable specifications, modularity, and governance frameworks that promote innovation while preventing lock-in.

#### The Three Core Layers:
1. **Identity Layer (Aadhaar / e-Sign):** Provides unique, verifiable digital identification to empower every citizen.
2. **Payments Layer (Unified Payments Interface - UPI):** Enables real-time, zero-fee inter-bank settlement with open protocols.
3. **Data Empowerment Architecture (DigiLocker / DEPA):** Restores data autonomy to the citizen, enabling consented credential exchanges without physical paper.

#### Key Architectural Tenet:
"Build rails, not walled gardens." DPI provides the minimal foundational digital highways upon which governments, startups, and public bodies can deliver customized value.`,
        resourceUrl: 'https://capacityconnect.gov.in/resources/dpi-whitepaper.pdf',
      },
      {
        id: 'mod-1-2',
        courseId: 'course-1',
        title: 'Module 2: Architectural Deep-Dive into DigiLocker & Verifiable Credentials',
        orderIndex: 2,
        durationMinutes: 35,
        contentType: 'VIDEO',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: `### 1.2 Verifiable Credentials & Paperless Governance
DigiLocker is a flagship initiative under the Digital India program aimed at digital empowerment of citizens by providing access to authentic digital documents to citizen's digital document wallet.

#### Core Concepts:
- **Issuer:** Authorities that create and digitally sign verifiable documents (e.g., CBSE, State Transport Authorities, Universities).
- **Repository:** Secure cloud store maintaining the cryptographically signed schema.
- **Requester:** Authorized agencies seeking verification with explicit time-bound citizen consent.

#### The Elimination of Physical Notarization:
By leveraging digital signatures adhering to the Information Technology Act (2000), digitally verified records carry legal parity with physical originals under Rule 9A of the IT Rules.`,
      },
      {
        id: 'mod-1-3',
        courseId: 'course-1',
        title: 'Module 3: Security & Consent-Artefact Governance',
        orderIndex: 3,
        durationMinutes: 35,
        contentType: 'TEXT',
        content: `### 1.3 Consent Management & Auditability
Data Empowerment and Protection Architecture (DEPA) introduces the electronic **Consent Artefact**—a machine-readable cryptographic envelope signed by the user specifying:
- Exact data attributes requested (granular scope)
- Valid usage purpose
- Data retention duration
- Revocation endpoint

#### Security Checklist for System Integrators:
1. Implement mutual TLS (mTLS) for all inter-service mesh calls.
2. Ensure Zero-Knowledge verification where identity validation does not require storing raw biometric or PII credentials.
3. Maintain immutable, append-only transaction audit logs.`,
      },
    ],
  },
  {
    id: 'course-2',
    title: 'CERT-In Cyber Incident Management & Enterprise Defense',
    code: 'SEC-202',
    description: 'Master organizational cyber hygiene, threat intelligence containment, ransomware response, and mandatory CERT-In reporting timelines under national security guidelines.',
    category: 'Cybersecurity',
    level: 'INTERMEDIATE',
    durationMinutes: 120,
    instructorId: 'user-admin-1',
    instructorName: 'Vikram Malhotra',
    departmentId: 'dept-it-systems',
    departmentName: 'Information Systems & Security Division',
    learningObjectives: [
      'Analyze CERT-In compliance directives and strict 6-hour incident disclosure windows.',
      'Implement multi-factor authentication (MFA) and least-privilege role boundaries.',
      'Detect and quarantine credential harvesting and advanced persistent threats (APT).',
      'Execute tabletop incident recovery drills and log retention audits.'
    ],
    prerequisites: 'Basic knowledge of TCP/IP, operating systems, and organizational security policies.',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    assessmentCriteria: 'Achieve 80% or higher on scenario-based threat classification assessment.',
    enrollmentCount: 98,
    modules: [
      {
        id: 'mod-2-1',
        courseId: 'course-2',
        title: 'Module 1: The CERT-In Regulatory Framework & 6-Hour Rule',
        orderIndex: 1,
        durationMinutes: 40,
        contentType: 'TEXT',
        content: `### 2.1 Mandatory CERT-In Cybersecurity Directives
In accordance with provisions of sub-section (6) of section 70B of the Information Technology Act, 2000, all government organizations, service providers, intermediaries, and corporate entities must report specified cyber incidents to CERT-In within **six (6) hours** of noticing or being brought to notice of such incidents.

#### Covered Incidents:
- Targeted scanning/probing of critical networks
- Compromise of critical systems/information
- Unauthorized access of IT systems/data
- Defacement of website or intrusion into a website
- Malicious code attacks (ransomware, worms, spyware)
- Attacks on servers such as Database, Mail and DNS
- Identity theft, spoofing and phishing attacks`,
      },
      {
        id: 'mod-2-2',
        courseId: 'course-2',
        title: 'Module 2: Log Archival, NTP Synchronization & Forensic Readiness',
        orderIndex: 2,
        durationMinutes: 45,
        contentType: 'TEXT',
        content: `### 2.2 System Time Synchronization & 180-Day Log Mandate
A critical vector in cross-jurisdictional cyber forensics is immutable clock drift synchronization.

#### Key Directives:
1. **NTP Server Connection:** Connect all ICT infrastructure exclusively to the designated National Informatics Centre (NIC) or National Physical Laboratory (NPL) Network Time Protocol servers.
2. **Log Retention Requirement:** Securely retain system logs across all servers, edge proxies, firewalls, and VPN gateways for a rolling minimum of **180 calendar days** within the Indian jurisdiction.`,
      },
    ],
  },
  {
    id: 'course-3',
    title: 'Data-Driven Governance: Analytics & Policy Dashboards',
    code: 'DAT-301',
    description: 'Transform transactional administrative records into actionable executive insight. Learn SQL aggregation, data hygiene, KPI visualization, and telemetry monitoring for public welfare schemes.',
    category: 'Analytics & Tech',
    level: 'INTERMEDIATE',
    durationMinutes: 105,
    instructorId: 'user-trainer-1',
    instructorName: 'Priya Nair',
    departmentId: 'dept-gov-ops',
    departmentName: 'Digital Governance & Public Operations',
    learningObjectives: [
      'Extract, clean, and validate public sector datasets from disparate departmental silos.',
      'Synthesize operational telemetry into real-time key performance indicators.',
      'Design accessible, cognitive-friendly dashboards that drive executive decision making.',
      'Detect operational bottlenecks in fund disbursement and public service turnaround times.'
    ],
    prerequisites: 'Foundational spreadsheet skills and basic data literacy.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    assessmentCriteria: 'Successful completion of data hygiene assessment and dashboard interpretation quiz.',
    enrollmentCount: 84,
    modules: [
      {
        id: 'mod-3-1',
        courseId: 'course-3',
        title: 'Module 1: The Administrative Data Lifecycle',
        orderIndex: 1,
        durationMinutes: 30,
        contentType: 'TEXT',
        content: `### 3.1 Unlocking Public Value Through Administrative Data
Public governance generates vast transactional logs—from district land records to ration distribution telemetry. Historically trapped in siloed relational databases, modern analytics frameworks allow programmatic aggregation to evaluate welfare impact in real-time.`,
      },
    ],
  },
  {
    id: 'course-4',
    title: 'Ethical AI & Algorithmic Accountability in Public Services',
    code: 'AI-401',
    description: 'Examine fairness, explainability, safety, and bias prevention when deploying machine learning and automated decision systems in public welfare distribution.',
    category: 'Innovation',
    level: 'ADVANCED',
    durationMinutes: 75,
    instructorId: 'user-manager-1',
    instructorName: 'Anita Deshmukh',
    departmentId: 'dept-gov-ops',
    departmentName: 'Digital Governance & Public Operations',
    learningObjectives: [
      'Identify demographic and historical biases embedded in administrative training data.',
      'Implement algorithmic fairness metrics (demographic parity, equal opportunity).',
      'Establish human-in-the-loop review mechanisms for high-stakes citizen evaluations.',
      'Draft AI impact assessments aligning with national NITI Aayog AI ethics principles.'
    ],
    prerequisites: 'Understanding of predictive models and public administrative laws.',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    assessmentCriteria: 'Comprehensive case analysis and 75% score on final ethics assessment.',
    enrollmentCount: 65,
    modules: [
      {
        id: 'mod-4-1',
        courseId: 'course-4',
        title: 'Module 1: NITI Aayog #AIforAll Principles',
        orderIndex: 1,
        durationMinutes: 35,
        contentType: 'TEXT',
        content: `### 4.1 Responsible AI: Principles for Public Sector Adoption
As predictive models assist in targeting scholarships, identifying agricultural crop vulnerabilities, and routing municipal services, public institutions bear constitutional duties of non-arbitrariness and equal protection.`,
      },
    ],
  },
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'assess-1',
    courseId: 'course-1',
    courseTitle: 'Foundations of Digital Public Infrastructure & India Stack',
    title: 'DPI & India Stack Certification Examination',
    description: 'Demonstrate your mastery of DPI architectural tenets, DigiLocker security protocols, and consent-driven workflows.',
    passPercentage: 75,
    timeLimitMinutes: 20,
    questions: [
      {
        id: 'q-1-1',
        assessmentId: 'assess-1',
        questionText: 'What is the primary philosophical difference between Digital Public Infrastructure (DPI) and monolithic proprietary enterprise software?',
        orderIndex: 1,
        options: [
          'DPI is always completely free of hosting infrastructure costs',
          'DPI provides open, modular, interoperable protocols ("rails") that prevent proprietary vendor lock-in',
          'DPI requires proprietary hardware dongles to access any government portal',
          'DPI replaces the need for any private sector innovation or applications'
        ],
        correctOptionIndex: 1,
        explanation: 'DPI is designed as open, interoperable foundational digital rails upon which public and private innovators can build services without predatory vendor lock-in.',
      },
      {
        id: 'q-1-2',
        assessmentId: 'assess-1',
        questionText: 'Under Rule 9A of the Information Technology (Preservation and Retention of Information by Intermediaries Providing Digital Locker Facilities) Rules, what is the legal validity of documents in DigiLocker?',
        orderIndex: 2,
        options: [
          'They are advisory only and must be accompanied by physical paper stamped by a Gazetted Officer',
          'They carry equal legal validity and parity with original physical documents',
          'They are only valid inside university examinations',
          'They are valid only for 30 calendar days from the date of issuance'
        ],
        correctOptionIndex: 1,
        explanation: 'Rule 9A legally equates issued documents in DigiLocker with original physical documents issued by the official authority.',
      },
      {
        id: 'q-1-3',
        assessmentId: 'assess-1',
        questionText: 'In the Data Empowerment and Protection Architecture (DEPA), what is the function of a Consent Artefact?',
        orderIndex: 3,
        options: [
          'A cryptographic hardware token plugged into a USB port',
          'A machine-readable signed cryptographic object defining granular data scope, purpose, and time-bound validity',
          'A physical notarized affidavit signed in front of a magistrate',
          'A proprietary watermark stamped on PDF document headers'
        ],
        correctOptionIndex: 1,
        explanation: 'A Consent Artefact is a tamper-evident, cryptographically signed electronic permission specifying exactly what data can be accessed, by whom, for what purpose, and for how long.',
      },
      {
        id: 'q-1-4',
        assessmentId: 'assess-1',
        questionText: 'Which security layer is recommended for all inter-service mesh communication across public infrastructure APIs?',
        orderIndex: 4,
        options: [
          'Standard HTTP without TLS',
          'Unencrypted internal broadcast sockets',
          'Mutual TLS (mTLS) with cryptographically validated client and server certificates',
          'Basic authentication with static plaintext passwords'
        ],
        correctOptionIndex: 2,
        explanation: 'mTLS guarantees zero-trust identity verification in transit by validating cryptographic x509 certificates on both client and server ends.',
      },
    ],
  },
  {
    id: 'assess-2',
    courseId: 'course-2',
    courseTitle: 'CERT-In Cyber Incident Management & Enterprise Defense',
    title: 'CERT-In Incident Response Competency Test',
    description: 'Evaluate compliance protocols, reporting deadlines, and log forensic retention standards.',
    passPercentage: 80,
    timeLimitMinutes: 15,
    questions: [
      {
        id: 'q-2-1',
        assessmentId: 'assess-2',
        questionText: 'What is the mandatory reporting timeframe to notify CERT-In upon noticing or being alerted to a covered cybersecurity incident?',
        orderIndex: 1,
        options: [
          'Within 72 hours of complete forensic diagnosis',
          'Within 6 hours of noticing or being brought to notice of the incident',
          'Within 30 calendar days at the end of the fiscal quarter',
          'Only if the financial damages exceed ₹1 Crore'
        ],
        correctOptionIndex: 1,
        explanation: 'Under CERT-In directives issued pursuant to Section 70B of the IT Act 2000, cybersecurity incidents must be formally reported within 6 hours.',
      },
      {
        id: 'q-2-2',
        assessmentId: 'assess-2',
        questionText: 'For how long must system logs across servers, firewalls, and VPN gateways be securely archived within the Indian jurisdiction?',
        orderIndex: 2,
        options: [
          '30 days',
          '90 days',
          'A rolling minimum of 180 calendar days',
          'Logs may be purged daily to save disk storage'
        ],
        correctOptionIndex: 2,
        explanation: 'CERT-In mandates maintaining rolling system and audit logs for a minimum of 180 days to support cyber forensic investigation.',
      },
    ],
  },
];

export const INITIAL_TRAINING_SESSIONS: TrainingSession[] = [
  {
    id: 'session-1',
    title: 'Executive Workshop: Zero Trust Architecture for Public Portals',
    description: 'Interactive deep dive into identity micro-segmentation, token rotation, and threat modeling for mission-critical portals.',
    instructorId: 'user-admin-1',
    instructorName: 'Vikram Malhotra',
    modality: 'ONLINE',
    locationOrUrl: 'https://meet.capacityconnect.in/session-zt-2026',
    startTime: '2026-11-05T10:00:00Z',
    endTime: '2026-11-05T12:30:00Z',
    capacity: 40,
    enrolledCount: 28,
    isRegistered: true,
    status: 'SCHEDULED',
  },
  {
    id: 'session-2',
    title: 'Hands-on Lab: Real-Time BI & Telemetry with Apache Superset',
    description: 'Practical data pipeline workshop connecting departmental PostgreSQL schemas to real-time executive dashboard widgets.',
    instructorId: 'user-trainer-1',
    instructorName: 'Priya Nair',
    modality: 'HYBRID',
    locationOrUrl: 'Room 402, Administrative Staff College & Web Stream',
    startTime: '2026-11-12T14:00:00Z',
    endTime: '2026-11-12T17:00:00Z',
    capacity: 25,
    enrolledCount: 22,
    isRegistered: false,
    status: 'SCHEDULED',
  },
  {
    id: 'session-3',
    title: 'Roundtable: Competency-Based Civil Service Re-skilling (Mission Karmayogi Alignments)',
    description: 'Strategic leadership forum aligning organizational skills inventory with national competency taxonomies.',
    instructorId: 'user-manager-1',
    instructorName: 'Anita Deshmukh',
    modality: 'IN_PERSON',
    locationOrUrl: 'Vigyan Bhawan, Conference Hall B, New Delhi',
    startTime: '2026-11-18T09:30:00Z',
    endTime: '2026-11-18T13:00:00Z',
    capacity: 50,
    enrolledCount: 45,
    isRegistered: false,
    status: 'SCHEDULED',
  },
];

export const INITIAL_KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'art-1',
    title: 'Standard Operating Procedure (SOP): Mandatory 6-Hour Incident Notification to CERT-In',
    slug: 'sop-cert-in-incident-reporting',
    summary: 'Step-by-step checklist for system administrators when suspecting, detecting, or confirming an unauthorized intrusion or ransomware event.',
    content: `## Objective & Purpose
This Standard Operating Procedure establishes immediate containment actions, forensic preservation protocols, and chain-of-custody documentation required to comply with national CERT-In reporting rules.

### Action Checklist:
1. **Immediate Isolation (T+0m to T+15m):**
   - Disconnect compromised virtual subnets or host machines from the internal gateway. Do NOT power off or reboot (preserves volatile RAM artifacts).
   - Snapshot virtual machine disks and capture memory dumps via sanitized hypervisor tools.

2. **Internal Escalation (T+15m to T+45m):**
   - Alert the Departmental Chief Information Security Officer (CISO) and Principal Administrator.
   - Initiate incident ticket in Capacity Connect Security Tracking Portal.

3. **External CERT-In Dispatch (Within 6 Hours):**
   - Transmit standardized Incident Reporting Format to \`incident@cert-in.org.in\` and designated helpline.
   - Include timestamp in IST, affected IP ranges, system hostnames, observed Indicators of Compromise (IoCs), and current containment status.`,
    category: 'Security & Compliance',
    tags: ['CERT-In', 'SOP', 'Incident Response', 'Cyber Hygiene'],
    authorId: 'user-admin-1',
    authorName: 'Vikram Malhotra',
    viewsCount: 342,
    isBookmarked: true,
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-02-10T11:20:00Z',
  },
  {
    id: 'art-2',
    title: 'Implementation Blueprint: DigiLocker API Integration with Node.js & React',
    slug: 'digilocker-api-integration-blueprint',
    summary: 'A reference architecture for verifying digitally issued degree certificates and driving licenses without manual paperwork.',
    content: `## Architecture Overview
Integrating DigiLocker allows an organization to request citizen consent to pull cryptographically verified XML/PDF credential streams directly from the national repository.

### Key API Flow:
1. **Initiate OAuth 2.0 Auth Code Grant:**
   - Redirect citizen to DigiLocker SSO with specific \`scope\` matching required URI schemas (e.g., \`in.gov.transport.dl\`).
2. **Exchange Code for Access Token:**
   - Server-side HTTPS POST with client secret and SHA-256 HMAC signature.
3. **Fetch Cryptographic XML Payload:**
   - Validate XML Digital Signature (XML-DSig) against the issuer public x509 cert chain.`,
    category: 'Technical Blueprints',
    tags: ['DigiLocker', 'DPI', 'Node.js', 'OAuth', 'API'],
    authorId: 'user-trainer-1',
    authorName: 'Priya Nair',
    viewsCount: 512,
    isBookmarked: false,
    createdAt: '2026-02-05T12:00:00Z',
    updatedAt: '2026-02-12T15:00:00Z',
  },
  {
    id: 'art-3',
    title: 'Organizational Capability Framework: Mapping Skills to National Career Pathways',
    slug: 'organizational-capability-framework',
    summary: 'How to benchmark departmental competencies, calculate team skill gaps, and route automated learning interventions.',
    content: `## Competency Matrix Design
A modern enterprise capability portal needs to bridge the gap between static job descriptions and dynamic project demands.

### The 5-Point Proficiency Scale:
- **Level 1 (Beginner):** Conceptual awareness; requires direct supervision.
- **Level 2 (Elementary):** Can execute standard tasks using defined documentation.
- **Level 3 (Intermediate):** Autonomous execution of standard and semi-complex workflows.
- **Level 4 (Advanced):** Troubleshoots edge cases; mentors other team members.
- **Level 5 (Expert):** Defines enterprise policies, authors architectural blueprints, and drives organizational innovation.`,
    category: 'Human Resources & Policy',
    tags: ['Competency', 'Skills Matrix', 'Workforce', 'Karmayogi'],
    authorId: 'user-manager-1',
    authorName: 'Anita Deshmukh',
    viewsCount: 289,
    isBookmarked: false,
    createdAt: '2026-02-14T09:30:00Z',
    updatedAt: '2026-02-14T09:30:00Z',
  },
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-1',
    certificateNumber: 'CC-2026-DPI-00891',
    userId: 'user-learner-1',
    userName: 'Rahul Sharma',
    courseId: 'course-1',
    courseTitle: 'Foundations of Digital Public Infrastructure & India Stack',
    issueDate: '2026-02-20T16:45:00Z',
    grade: 'Passed with Distinction (92%)',
    verificationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-learner-1',
    title: 'Course Enrolled Successfully',
    message: 'You have been enrolled in "Foundations of Digital Public Infrastructure & India Stack". Start Module 1 now!',
    type: 'SUCCESS',
    link: '/learning/course-1',
    isRead: true,
    createdAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'notif-2',
    userId: 'user-learner-1',
    title: 'Upcoming Training Workshop Alert',
    message: 'Your registered workshop "Zero Trust Architecture for Public Portals" starts on Nov 5, 2026 at 10:00 AM IST.',
    type: 'INFO',
    link: '/training',
    isRead: false,
    createdAt: '2026-02-22T08:30:00Z',
  },
  {
    id: 'notif-3',
    userId: 'user-learner-1',
    title: 'Skill Gap Identified by Manager',
    message: 'Anita Deshmukh reviewed your profile and recommended "Data-Driven Governance: Analytics & Policy Dashboards".',
    type: 'WARNING',
    link: '/courses/course-3',
    isRead: false,
    createdAt: '2026-02-23T14:15:00Z',
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'National Digital Capability Drive 2026: Mandatory Cyber Training',
    content: 'All departmental employees are required to complete CERT-In Cyber Incident Management (SEC-202) before the Q1 audit deadline.',
    priority: 'HIGH',
    authorName: 'Vikram Malhotra (Principal Administrator)',
    createdAt: '2026-02-20T09:00:00Z',
  },
  {
    id: 'ann-2',
    title: 'New AI & Ethics Learning Track Launched',
    content: 'Explore algorithmic accountability principles and NITI Aayog AI guidelines in our newly accredited AI-401 course.',
    priority: 'MEDIUM',
    authorName: 'Priya Nair (Lead Trainer)',
    createdAt: '2026-02-22T11:00:00Z',
  },
];
