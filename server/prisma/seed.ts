import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Capacity Connect database...');

  // 1. Departments
  const deptGov = await prisma.department.upsert({
    where: { code: 'DPI-GOV' },
    update: {},
    create: {
      name: 'Digital Governance & Public Operations',
      code: 'DPI-GOV',
      description: 'Public service delivery systems, India Stack integrations, and administrative digital architecture.',
    },
  });

  const deptSec = await prisma.department.upsert({
    where: { code: 'SEC-OPS' },
    update: {},
    create: {
      name: 'Information Systems & Security Division',
      code: 'SEC-OPS',
      description: 'National cybersecurity compliance, CERT-In alignment, zero trust architecture, and threat mitigation.',
    },
  });

  const deptTraining = await prisma.department.upsert({
    where: { code: 'HR-CAP' },
    update: {},
    create: {
      name: 'Talent & Capacity Building Cell',
      code: 'HR-CAP',
      description: 'Mission Karmayogi alignment, competency mapping, executive leadership, and continuous upskilling.',
    },
  });

  // 2. Demo Users with securely hashed passwords
  const salt = await bcrypt.genSalt(10);
  const learnerHash = await bcrypt.hash('Learner@123', salt);
  const trainerHash = await bcrypt.hash('Trainer@123', salt);
  const adminHash = await bcrypt.hash('Admin@123', salt);
  const managerHash = await bcrypt.hash('Manager@123', salt);

  const learner = await prisma.user.upsert({
    where: { email: 'rahul.sharma@gov.in' },
    update: {},
    create: {
      id: 'user-learner-1',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@gov.in',
      passwordHash: learnerHash,
      role: 'LEARNER',
      jobRole: 'Senior Operations Analyst',
      departmentId: deptGov.id,
      bio: 'Focused on digital service delivery transformation, public data pipelines, and cyber hygiene compliance.',
      learningGoals: 'Master Cloud Native Architecture and Citizen-Centric Service Delivery frameworks.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  const trainer = await prisma.user.upsert({
    where: { email: 'priya.nair@trainer.in' },
    update: {},
    create: {
      id: 'user-trainer-1',
      name: 'Priya Nair',
      email: 'priya.nair@trainer.in',
      passwordHash: trainerHash,
      role: 'TRAINER',
      jobRole: 'Lead Enterprise Capability Instructor',
      departmentId: deptTraining.id,
      bio: '12+ years experience conducting enterprise leadership, digital security, and technical workshops across central ministries.',
      learningGoals: 'Advanced Gamification & Virtual Reality simulation in workforce upskilling.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@capacityconnect.in' },
    update: {},
    create: {
      id: 'user-admin-1',
      name: 'Vikram Malhotra',
      email: 'admin@capacityconnect.in',
      passwordHash: adminHash,
      role: 'ADMIN',
      jobRole: 'Principal Platform Administrator',
      departmentId: deptSec.id,
      bio: 'Maintains system health, role-based governance policies, audit compliance, and system-wide curriculum workflows.',
      learningGoals: 'Zero-trust architecture and automated regulatory compliance pipelines.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'anita.deshmukh@dept.in' },
    update: {},
    create: {
      id: 'user-manager-1',
      name: 'Anita Deshmukh',
      email: 'anita.deshmukh@dept.in',
      passwordHash: managerHash,
      role: 'MANAGER',
      jobRole: 'Director of Strategic Initiatives',
      departmentId: deptGov.id,
      bio: 'Oversees organizational capability benchmarking, performance metrics, and departmental cross-functional teams.',
      learningGoals: 'Competency-based talent redeployment and predictive workforce analytics.',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    },
  });

  // 3. Skills
  const skillsData = [
    {
      name: 'CERT-In Cyber Hygiene & Incident Response',
      category: 'Security',
      description: 'Knowledge of government cyber directives, endpoint security, phishing mitigation, and mandatory breach reporting protocols.',
    },
    {
      name: 'Digital Public Infrastructure (DPI) & India Stack',
      category: 'Governance',
      description: 'Architecture and integration patterns for Aadhaar, UPI, DigiLocker, and Account Aggregator APIs.',
    },
    {
      name: 'Data-Driven Policy Analytics',
      category: 'Technical',
      description: 'Synthesizing field telemetry, administrative surveys, and relational data pipelines into actionable executive dashboards.',
    },
    {
      name: 'Agile Public Program Management',
      category: 'Leadership',
      description: 'Sprint planning, stakeholder roadmapping, barrier escalation, and citizen feedback loop implementation.',
    },
    {
      name: 'Cloud Security & Compliance (MeitY Guidelines)',
      category: 'Technical',
      description: 'Government community cloud tenancy, sovereign data storage, encryption at rest, and audit trail retention.',
    },
    {
      name: 'Ethical AI & Algorithmic Accountability',
      category: 'Innovation',
      description: 'Evaluating bias, transparency, and data privacy in public sector decision-support machine learning models.',
    },
  ];

  const createdSkills: Record<string, string> = {};
  for (const s of skillsData) {
    const record = await prisma.skill.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    });
    createdSkills[s.name] = record.id;
  }

  // 4. User Skills for Rahul Sharma
  if (createdSkills['CERT-In Cyber Hygiene & Incident Response']) {
    await prisma.userSkill.upsert({
      where: {
        userId_skillId: {
          userId: learner.id,
          skillId: createdSkills['CERT-In Cyber Hygiene & Incident Response'],
        },
      },
      update: {},
      create: {
        userId: learner.id,
        skillId: createdSkills['CERT-In Cyber Hygiene & Incident Response'],
        selfProficiency: 3,
        verifiedProficiency: 3,
        verifiedBy: 'Anita Deshmukh (Manager)',
        verifiedAt: new Date('2026-02-10T14:30:00Z'),
        targetProficiency: 4,
        notes: 'Completed baseline cybersecurity module; scheduled for advanced threat mitigation.',
      },
    });
  }

  if (createdSkills['Digital Public Infrastructure (DPI) & India Stack']) {
    await prisma.userSkill.upsert({
      where: {
        userId_skillId: {
          userId: learner.id,
          skillId: createdSkills['Digital Public Infrastructure (DPI) & India Stack'],
        },
      },
      update: {},
      create: {
        userId: learner.id,
        skillId: createdSkills['Digital Public Infrastructure (DPI) & India Stack'],
        selfProficiency: 4,
        verifiedProficiency: 4,
        verifiedBy: 'Priya Nair (Lead Trainer)',
        verifiedAt: new Date('2026-02-01T11:00:00Z'),
        targetProficiency: 5,
        notes: 'Demonstrated high competence in DigiLocker integration architectures.',
      },
    });
  }

  if (createdSkills['Data-Driven Policy Analytics']) {
    await prisma.userSkill.upsert({
      where: {
        userId_skillId: {
          userId: learner.id,
          skillId: createdSkills['Data-Driven Policy Analytics'],
        },
      },
      update: {},
      create: {
        userId: learner.id,
        skillId: createdSkills['Data-Driven Policy Analytics'],
        selfProficiency: 2,
        verifiedProficiency: 2,
        verifiedBy: 'Anita Deshmukh (Manager)',
        verifiedAt: new Date('2026-01-20T16:00:00Z'),
        targetProficiency: 4,
        notes: 'Identified critical competency gap in automated SQL aggregation and interactive BI tooling.',
      },
    });
  }

  // 5. Courses & Modules
  const course1 = await prisma.course.upsert({
    where: { code: 'DPI-101' },
    update: {},
    create: {
      id: 'course-1',
      title: 'Foundations of Digital Public Infrastructure & India Stack',
      code: 'DPI-101',
      description: 'A comprehensive operational guide to designing, deploying, and scaling public-interest technology systems using India Stack principles: open APIs, digital identity, interoperable payments, and consent-driven data sharing.',
      category: 'Governance & Tech',
      level: 'BEGINNER',
      durationMinutes: 90,
      instructorId: trainer.id,
      departmentId: deptGov.id,
      learningObjectives: JSON.stringify([
        'Understand the 4 core pillars of Digital Public Infrastructure: Identity, Payments, Data, and Trust.',
        'Analyze real-world implementations: Aadhaar eKYC, UPI switchboards, and DigiLocker credentials.',
        'Evaluate architectural principles: Open standards, vendor neutrality, privacy by design, and resilience.',
        'Design citizen-centric workflows minimizing friction and compliance overhead.'
      ]),
      prerequisites: 'Basic familiarity with web services and organizational administrative procedures.',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
      assessmentCriteria: 'Minimum 75% on the comprehensive final assessment to qualify for verifiable credential.',
    },
  });

  await prisma.courseModule.deleteMany({ where: { courseId: course1.id } });
  await prisma.courseModule.create({
    data: {
      id: 'mod-1-1',
      courseId: course1.id,
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
  });

  await prisma.courseModule.create({
    data: {
      id: 'mod-1-2',
      courseId: course1.id,
      title: 'Module 2: Identity Architecture & Foundation of Population-Scale DPI',
      orderIndex: 2,
      durationMinutes: 35,
      contentType: 'VIDEO',
      videoUrl: 'https://www.youtube.com/embed/miaLbP8VRFo',
      content: `### 1.2 Identity as a Foundational Building Block for Digital Inclusion
In this keynote architectural masterclass, Dr. Pramod Varma (Chief Architect of India Stack and Aadhaar) explains the underlying principles of population-scale digital identification.

#### Key Takeaways:
- **Zero-Knowledge Authentication:** How demographic and biometric matching works without exposing private credentials.
- **Unbundled Primitives:** Separating identity verification from entitlement and benefit disbursement.
- **High-Throughput Distributed Microservices:** Designing fault-tolerant APIs processing hundreds of millions of requests daily.`,
    },
  });

  await prisma.courseModule.create({
    data: {
      id: 'mod-1-3',
      courseId: course1.id,
      title: 'Module 3: Architectural Deep-Dive into DigiLocker & Verifiable Credentials',
      orderIndex: 3,
      durationMinutes: 30,
      contentType: 'VIDEO',
      videoUrl: 'https://www.youtube.com/embed/R7pIczXeDr0',
      content: `### 1.3 Verifiable Credentials & Paperless Governance
DigiLocker is a flagship initiative under the Digital India program aimed at digital empowerment of citizens by providing access to authentic digital documents to citizen's digital document wallet.

#### Core Concepts:
- **Issuer:** Authorities that create and digitally sign verifiable documents (e.g., CBSE, State Transport Authorities, Universities).
- **Repository:** Secure cloud store maintaining the cryptographically signed schema.
- **Requester:** Authorized agencies seeking verification with explicit time-bound citizen consent.

#### The Elimination of Physical Notarization:
By leveraging digital signatures adhering to the Information Technology Act (2000), digitally verified records carry legal parity with physical originals under Rule 9A of the IT Rules.`,
      resourceUrl: 'https://capacityconnect.gov.in/resources/digilocker-technical-spec.pdf',
    },
  });

  await prisma.courseModule.create({
    data: {
      id: 'mod-1-4',
      courseId: course1.id,
      title: 'Module 4: Security & Consent-Artefact Governance',
      orderIndex: 4,
      durationMinutes: 35,
      contentType: 'TEXT',
      content: `### 1.4 Consent Management & Auditability
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
  });

  // Course 1 Assessment
  await prisma.assessment.deleteMany({ where: { courseId: course1.id } });
  const assess1 = await prisma.assessment.create({
    data: {
      id: 'assess-1',
      courseId: course1.id,
      title: 'DPI & India Stack Certification Examination',
      description: 'Demonstrate your mastery of DPI architectural tenets, DigiLocker security protocols, and consent-driven workflows.',
      passPercentage: 75,
      timeLimitMinutes: 20,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        assessmentId: assess1.id,
        questionText: 'What is the primary philosophical difference between Digital Public Infrastructure (DPI) and monolithic proprietary enterprise software?',
        orderIndex: 1,
        options: JSON.stringify([
          'DPI is always completely free of hosting infrastructure costs',
          'DPI provides open, modular, interoperable protocols ("rails") that prevent proprietary vendor lock-in',
          'DPI requires proprietary hardware dongles to access any government portal',
          'DPI replaces the need for any private sector innovation or applications',
        ]),
        correctOptionIndex: 1,
        explanation: 'DPI is designed as open, interoperable foundational digital rails upon which public and private innovators can build services without proprietary vendor lock-in.',
      },
      {
        assessmentId: assess1.id,
        questionText: 'Under Rule 9A of the Information Technology Rules, what is the legal validity of documents in DigiLocker?',
        orderIndex: 2,
        options: JSON.stringify([
          'They are advisory only and must be accompanied by physical paper stamped by a Gazetted Officer',
          'They carry equal legal validity and parity with original physical documents',
          'They are only valid inside university examinations',
          'They are valid only for 30 calendar days from the date of issuance',
        ]),
        correctOptionIndex: 1,
        explanation: 'Rule 9A legally equates issued documents in DigiLocker with original physical documents issued by the official authority.',
      },
      {
        assessmentId: assess1.id,
        questionText: 'In the Data Empowerment and Protection Architecture (DEPA), what is the function of a Consent Artefact?',
        orderIndex: 3,
        options: JSON.stringify([
          'A cryptographic hardware token plugged into a USB port',
          'A machine-readable signed cryptographic object defining granular data scope, purpose, and time-bound validity',
          'A physical notarized affidavit signed in front of a magistrate',
          'A proprietary watermark stamped on PDF document headers',
        ]),
        correctOptionIndex: 1,
        explanation: 'A Consent Artefact is a tamper-evident, cryptographically signed electronic permission specifying exactly what data can be accessed, by whom, for what purpose, and for how long.',
      },
      {
        assessmentId: assess1.id,
        questionText: 'Which security layer is recommended for all inter-service mesh communication across public infrastructure APIs?',
        orderIndex: 4,
        options: JSON.stringify([
          'Standard HTTP without TLS',
          'Unencrypted internal broadcast sockets',
          'Mutual TLS (mTLS) with cryptographically validated client and server certificates',
          'Basic authentication with static plaintext passwords',
        ]),
        correctOptionIndex: 2,
        explanation: 'mTLS guarantees zero-trust identity verification in transit by validating cryptographic x509 certificates on both client and server ends.',
      },
    ],
  });

  // Course 2: Cyber Incident Management
  const course2 = await prisma.course.upsert({
    where: { code: 'SEC-202' },
    update: {},
    create: {
      id: 'course-2',
      title: 'CERT-In Cyber Incident Management & Enterprise Defense',
      code: 'SEC-202',
      description: 'Master organizational cyber hygiene, threat intelligence containment, ransomware response, and mandatory CERT-In reporting timelines under national security guidelines.',
      category: 'Cybersecurity',
      level: 'INTERMEDIATE',
      durationMinutes: 120,
      instructorId: admin.id,
      departmentId: deptSec.id,
      learningObjectives: JSON.stringify([
        'Analyze CERT-In compliance directives and strict 6-hour incident disclosure windows.',
        'Implement multi-factor authentication (MFA) and least-privilege role boundaries.',
        'Detect and quarantine credential harvesting and advanced persistent threats (APT).',
        'Execute tabletop incident recovery drills and log retention audits.'
      ]),
      prerequisites: 'Basic knowledge of TCP/IP, operating systems, and organizational security policies.',
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
      assessmentCriteria: 'Achieve 80% or higher on scenario-based threat classification assessment.',
    },
  });

  await prisma.courseModule.deleteMany({ where: { courseId: course2.id } });
  await prisma.courseModule.create({
    data: {
      id: 'mod-2-1',
      courseId: course2.id,
      title: 'Module 1: The CERT-In Regulatory Framework & 6-Hour Rule',
      orderIndex: 1,
      durationMinutes: 30,
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
      resourceUrl: 'https://capacityconnect.gov.in/resources/cert-in-guidelines-2026.pdf',
    },
  });

  await prisma.courseModule.create({
    data: {
      id: 'mod-2-2',
      courseId: course2.id,
      title: 'Module 2: Security Incident Handling & NIST IR Lifecycle',
      orderIndex: 2,
      durationMinutes: 40,
      contentType: 'VIDEO',
      videoUrl: 'https://www.youtube.com/embed/IRSQEO0koYY',
      content: `### 2.2 NIST SP 800-61 Incident Handling Process
This technical lecture breaks down the formal Incident Response (IR) life cycle used by Security Operations Centers (SOC) worldwide:
1. **Preparation:** Establishing incident response tools, jump boxes, out-of-band communication, and forensic baseline snapshots.
2. **Detection & Analysis:** Triaging Indicators of Compromise (IoCs), SIEM alert correlation, and determining the blast radius.
3. **Containment & Eradication:** Quarantining infected VLANs, revoking compromised API keys and session tokens, and disabling backdoors.
4. **Post-Incident Recovery:** System hardening, restoring from trusted clean backups, and submitting forensic root-cause analysis.`,
    },
  });

  await prisma.courseModule.create({
    data: {
      id: 'mod-2-3',
      courseId: course2.id,
      title: 'Module 3: Ransomware Containment & Enterprise Recovery',
      orderIndex: 3,
      durationMinutes: 35,
      contentType: 'VIDEO',
      videoUrl: 'https://www.youtube.com/embed/0M55onu7mVI',
      content: `### 2.3 Ransomware Response & Forensic Preservation
Presented by SANS Digital Forensics & Incident Response experts, this module examines real-world defense tactics against enterprise ransomware strains:
- **Triage Checklist:** Immediate physical and logical isolation of affected subnets without powering off RAM (preserving volatile memory).
- **Lateral Movement Mitigation:** Severing compromised Active Directory trust relationships and isolating privileged access workstations.
- **Root-Cause Reconstruction:** Tracing initial access vectors (RDP brute force, drive-by phishing payloads, unpatched perimeter vulnerabilities).`,
    },
  });

  await prisma.courseModule.create({
    data: {
      id: 'mod-2-4',
      courseId: course2.id,
      title: 'Module 4: Log Archival, NTP Synchronization & Forensic Readiness',
      orderIndex: 4,
      durationMinutes: 35,
      contentType: 'TEXT',
      content: `### 2.4 System Time Synchronization & 180-Day Log Mandate
A critical vector in cross-jurisdictional cyber forensics is immutable clock drift synchronization.

#### Key Directives:
1. **NTP Server Connection:** Connect all ICT infrastructure exclusively to designated National Informatics Centre (NIC) or National Physical Laboratory (NPL) Network Time Protocol servers.
2. **Log Retention Requirement:** Securely retain system logs across all servers, edge proxies, firewalls, and VPN gateways for a rolling minimum of **180 calendar days** within Indian jurisdiction.`,
    },
  });

  // Course 2 Assessment
  await prisma.assessment.deleteMany({ where: { courseId: course2.id } });
  const assess2 = await prisma.assessment.create({
    data: {
      id: 'assess-2',
      courseId: course2.id,
      title: 'CERT-In Incident Response Competency Test',
      description: 'Evaluate compliance protocols, reporting deadlines, and log forensic retention standards.',
      passPercentage: 80,
      timeLimitMinutes: 15,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        assessmentId: assess2.id,
        questionText: 'What is the mandatory reporting timeframe to notify CERT-In upon noticing or being alerted to a covered cybersecurity incident?',
        orderIndex: 1,
        options: JSON.stringify([
          'Within 72 hours of complete forensic diagnosis',
          'Within 6 hours of noticing or being brought to notice of the incident',
          'Within 30 calendar days at the end of the fiscal quarter',
          'Only if the financial damages exceed ₹1 Crore',
        ]),
        correctOptionIndex: 1,
        explanation: 'Under CERT-In directives issued pursuant to Section 70B of the IT Act 2000, cybersecurity incidents must be formally reported within 6 hours.',
      },
      {
        assessmentId: assess2.id,
        questionText: 'For how long must system logs across servers, firewalls, and VPN gateways be securely archived within the Indian jurisdiction?',
        orderIndex: 2,
        options: JSON.stringify([
          '30 days',
          '90 days',
          'A rolling minimum of 180 calendar days',
          'Logs may be purged daily to save disk storage',
        ]),
        correctOptionIndex: 2,
        explanation: 'CERT-In mandates maintaining rolling system and audit logs for a minimum of 180 days to support cyber forensic investigation.',
      },
      {
        assessmentId: assess2.id,
        questionText: 'During a live ransomware containment incident, what is the best practice regarding infected machine memory (RAM)?',
        orderIndex: 3,
        options: JSON.stringify([
          'Immediately pull the power plug to crash the CPU',
          'Format the primary operating system hard drive immediately',
          'Isolate network access while keeping system powered on to preserve volatile RAM memory for forensics',
          'Pay the threat actor the ransom immediately using credit cards',
        ]),
        correctOptionIndex: 2,
        explanation: 'Preserving volatile memory allows digital forensics analysts to extract encryption keys, injected processes, and network sockets.',
      },
    ],
  });

  // Course 3: Data-Driven Governance
  const course3 = await prisma.course.upsert({
    where: { code: 'DAT-301' },
    update: {},
    create: {
      id: 'course-3',
      title: 'Data-Driven Governance: Analytics & Policy Dashboards',
      code: 'DAT-301',
      description: 'Transform transactional administrative records into actionable executive insight. Learn SQL aggregation, data hygiene, KPI visualization, and telemetry monitoring for public welfare schemes.',
      category: 'Analytics & Tech',
      level: 'INTERMEDIATE',
      durationMinutes: 105,
      instructorId: trainer.id,
      departmentId: deptGov.id,
      learningObjectives: JSON.stringify([
        'Extract, clean, and validate public sector datasets from disparate departmental silos.',
        'Synthesize operational telemetry into real-time key performance indicators.',
        'Design accessible, cognitive-friendly dashboards that drive executive decision making.',
        'Detect operational bottlenecks in fund disbursement and public service turnaround times.'
      ]),
      prerequisites: 'Foundational spreadsheet skills and basic data literacy.',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
      assessmentCriteria: 'Successful completion of data hygiene assessment and dashboard interpretation quiz.',
    },
  });

  await prisma.courseModule.deleteMany({ where: { courseId: course3.id } });
  await prisma.courseModule.create({
    data: {
      id: 'mod-3-1',
      courseId: course3.id,
      title: 'Module 1: The Administrative Data Lifecycle & Public Telemetry',
      orderIndex: 1,
      durationMinutes: 25,
      contentType: 'TEXT',
      content: `### 3.1 Unlocking Public Value Through Administrative Data
Public governance generates vast transactional logs—from district land records to ration distribution telemetry. Historically trapped in siloed relational databases, modern analytics frameworks allow programmatic aggregation to evaluate welfare impact in real-time.

#### Core Pillars:
1. **Raw Telemetry Acquisition:** Automated event logging from digital citizen interfaces.
2. **Data Cleansing & Deduplication:** Standardizing postal codes, demographic names, and temporal timestamps.
3. **Executive KPI Synthesis:** Transforming row-level logs into average wait times, SLA compliance percentages, and capacity bottleneck alerts.`,
      resourceUrl: 'https://capacityconnect.gov.in/resources/gov-data-lifecycle-guide.pdf',
    },
  });

  await prisma.courseModule.create({
    data: {
      id: 'mod-3-2',
      courseId: course3.id,
      title: 'Module 2: SQL Aggregation Functions & Analytical Grouping',
      orderIndex: 2,
      durationMinutes: 40,
      contentType: 'VIDEO',
      videoUrl: 'https://www.youtube.com/embed/Yr4pHPZCshA',
      content: `### 3.2 SQL Aggregate Functions in Public Administration
In this comprehensive lecture from Gate Smashers, master the foundational relational database aggregate functions essential for public analytics:
- **COUNT & COUNT(DISTINCT):** Tallying unique beneficiaries across welfare delivery schemes.
- **SUM & AVG:** Computing total fiscal disbursement and average administrative turnaround days.
- **MIN & MAX:** Identifying peak processing latency and fastest SLA response nodes.
- **GROUP BY & HAVING:** Segmenting data by administrative district, sub-division, and department.`,
    },
  });

  await prisma.courseModule.create({
    data: {
      id: 'mod-3-3',
      courseId: course3.id,
      title: 'Module 3: Advanced SQL Aggregation & Telemetry Pipelines',
      orderIndex: 3,
      durationMinutes: 35,
      contentType: 'VIDEO',
      videoUrl: 'https://www.youtube.com/embed/5Ighj_2PGV0',
      content: `### 3.3 Advanced Data Aggregations & Analytical Queries
This lecture demonstrates advanced SQL transformations for high-volume datasets:
- **Window Functions (RANK, DENSE_RANK, ROW_NUMBER):** Ranking departmental performance across regional districts.
- **Conditional Aggregation (CASE WHEN inside SUM):** Generating pivot summaries of active vs pending public grievances.
- **Rolling Averages:** Smoothing 7-day and 30-day service application volumes for capacity planning.`,
    },
  });

  await prisma.courseModule.create({
    data: {
      id: 'mod-3-4',
      courseId: course3.id,
      title: 'Module 4: Designing Decision-Support Dashboards for Governance',
      orderIndex: 4,
      durationMinutes: 30,
      contentType: 'TEXT',
      content: `### 3.4 Cognitive Visualization & Dashboard UX
Effective public dashboards avoid chart junk and focus on operational clarity:
1. **Lead with Actionable KPIs:** Place core health metrics (turnaround time, backlog count) at top left.
2. **Visual Hierarchy:** Use neutral base tones and reserve alert colors (red/amber) for genuine SLA breaches.
3. **Drill-Down Capability:** Empower administrators to transition from state-level aggregate down to block-level granular metrics.`,
    },
  });

  // Course 3 Assessment
  await prisma.assessment.deleteMany({ where: { courseId: course3.id } });
  const assess3 = await prisma.assessment.create({
    data: {
      id: 'assess-3',
      courseId: course3.id,
      title: 'Data-Driven Policy Analytics Certification Exam',
      description: 'Test your proficiency in SQL aggregation, data hygiene, and dashboard interpretation.',
      passPercentage: 75,
      timeLimitMinutes: 20,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        assessmentId: assess3.id,
        questionText: 'In SQL, which clause is used to filter aggregated grouped records (e.g. groups where average turnaround time > 5 days)?',
        orderIndex: 1,
        options: JSON.stringify([
          'WHERE',
          'HAVING',
          'ORDER BY',
          'LIMIT',
        ]),
        correctOptionIndex: 1,
        explanation: 'HAVING filters aggregated groups resulting from GROUP BY, whereas WHERE filters row-level records before aggregation occurs.',
      },
      {
        assessmentId: assess3.id,
        questionText: 'What is the primary benefit of window functions (like ROW_NUMBER() or RANK()) compared to traditional GROUP BY aggregations?',
        orderIndex: 2,
        options: JSON.stringify([
          'They compress all records into a single row',
          'They perform calculations across rows while preserving individual row identity without collapsing the result set',
          'They delete duplicate rows permanently from the physical disk',
          'They require zero RAM or database indexes',
        ]),
        correctOptionIndex: 1,
        explanation: 'Window functions compute rolling or ranked aggregations across partitions while retaining each individual record in the output.',
      },
    ],
  });

  // Course 4: Ethical AI & Algorithmic Accountability
  const course4 = await prisma.course.upsert({
    where: { code: 'AI-401' },
    update: {},
    create: {
      id: 'course-4',
      title: 'Ethical AI & Algorithmic Accountability in Public Services',
      code: 'AI-401',
      description: 'Examine fairness, explainability, safety, and bias prevention when deploying machine learning and automated decision systems in public welfare distribution.',
      category: 'Innovation',
      level: 'ADVANCED',
      durationMinutes: 75,
      instructorId: manager.id,
      departmentId: deptGov.id,
      learningObjectives: JSON.stringify([
        'Identify demographic and historical biases embedded in administrative training data.',
        'Implement algorithmic fairness metrics (demographic parity, equal opportunity).',
        'Establish human-in-the-loop review mechanisms for high-stakes citizen evaluations.',
        'Draft AI impact assessments aligning with national NITI Aayog AI ethics principles.'
      ]),
      prerequisites: 'Understanding of predictive models and public administrative laws.',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      assessmentCriteria: 'Comprehensive case analysis and 75% score on final ethics assessment.',
    },
  });

  await prisma.courseModule.deleteMany({ where: { courseId: course4.id } });
  await prisma.courseModule.create({
    data: {
      id: 'mod-4-1',
      courseId: course4.id,
      title: 'Module 1: NITI Aayog #AIforAll Strategy & Constitutional Mandates',
      orderIndex: 1,
      durationMinutes: 25,
      contentType: 'TEXT',
      content: `### 4.1 Responsible AI: Principles for Public Sector Adoption
As predictive models assist in targeting scholarships, identifying agricultural crop vulnerabilities, and routing municipal services, public institutions bear constitutional duties of non-arbitrariness and equal protection under Article 14 of the Constitution.

#### The 7 Core National AI Principles:
1. **Safety and Reliability:** Systems must operate within defined functional parameters without erratic failures.
2. **Equality and Non-Discrimination:** Automated recommendations must not penalize historically disadvantaged communities.
3. **Inclusivity and Accessibility:** Multilingual support and citizen-facing usability across diverse literacy levels.
4. **Data Privacy and Protection:** Full compliance with the Digital Personal Data Protection (DPDP) Act.
5. **Transparency & Explainability:** Providing human-understandable rationale for all algorithmic evaluations.
6. **Accountability:** Definite institutional ownership for errors or biased outputs.
7. **Protection of Human Values:** Human discretion retains primacy over high-stakes citizen welfare outcomes.`,
      resourceUrl: 'https://capacityconnect.gov.in/resources/niti-aayog-ai-ethics.pdf',
    },
  });

  await prisma.courseModule.create({
    data: {
      id: 'mod-4-2',
      courseId: course4.id,
      title: 'Module 2: The Ethics of AI & Machine Learning in Decision Systems',
      orderIndex: 2,
      durationMinutes: 45,
      contentType: 'VIDEO',
      videoUrl: 'https://www.youtube.com/embed/qpp1G0iEL_c',
      content: `### 4.2 Foundations of Ethical Artificial Intelligence
This comprehensive curriculum from freeCodeCamp explores the social and ethical dimensions of machine learning:
- **Autonomous Decision Making:** The ethical boundary between assistive decision support and autonomous enforcement.
- **Feedback Loops in Public Data:** How predictive models trained on past administrative outcomes can amplify societal disparities.
- **Value Alignment:** Architecting objective functions that incorporate equity, fairness constraints, and citizen welfare rather than pure accuracy metrics.`,
    },
  });

  await prisma.courseModule.create({
    data: {
      id: 'mod-4-3',
      courseId: course4.id,
      title: 'Module 3: Detecting & Mitigating Algorithmic Bias in Public Data',
      orderIndex: 3,
      durationMinutes: 30,
      contentType: 'VIDEO',
      videoUrl: 'https://www.youtube.com/embed/RfuQ5B1sjfM',
      content: `### 4.3 Algorithmic Bias & Fairness Engineering
This lecture examines the mathematical definitions and practical detection techniques for machine learning bias:
- **Proxy Variables:** How non-protected fields (such as postal PIN codes or device models) can unintentionally function as racial or socioeconomic proxies.
- **Fairness Metrics:** Comparing Demographic Parity, Equalized Odds, and Predictive Rate Parity.
- **Pre-processing & Post-processing Mitigation:** Reweighting sample sets, adversarial debiasing, and threshold calibration for public service eligibility.`,
    },
  });

  await prisma.courseModule.create({
    data: {
      id: 'mod-4-4',
      courseId: course4.id,
      title: 'Module 4: Model Explainability (XAI) & Human-in-the-Loop Safeguards',
      orderIndex: 4,
      durationMinutes: 25,
      contentType: 'TEXT',
      content: `### 4.4 Explainable AI (XAI) & Procedural Due Process
Black-box neural networks present acute legal hazards when applied to public welfare denial.

#### Implementation Architecture:
1. **Local Interpretable Model-agnostic Explanations (LIME):** Perturbing inputs to establish local linear decision boundaries.
2. **SHAP (SHapley Additive exPlanations):** Game-theoretic feature attribution calculating each citizen attribute's marginal contribution to the algorithmic score.
3. **Human-in-the-Loop Safeguards:** Mandatory human adjudication for any automated rejection of public welfare entitlements.`,
    },
  });

  // Course 5: Python Programming Basics
  const course5 = await prisma.course.upsert({
    where: { code: 'PY-101' },
    update: {},
    create: {
      id: 'course-5',
      title: 'Python Programming Basics',
      code: 'PY-101',
      description: 'Master core Python syntax, variables, data types, conditional branching, iteration, functions, built-in collections, and practical automation scripts.',
      category: 'Programming',
      level: 'BEGINNER',
      durationMinutes: 180,
      instructorId: trainer.id,
      departmentId: deptGov.id,
      learningObjectives: JSON.stringify([
        'Install and configure Python development environments, interactive REPLs, and virtual environments.',
        'Understand fundamental variable types: integers, floats, strings, booleans, and casting.',
        'Write robust branching logic with if-elif-else statements and relational/logical operators.',
        'Implement while loops and for loops with range, break, continue, and enumerate.',
        'Construct reusable functions with positional arguments, keyword arguments, and return values.',
        'Manipulate Python collections: lists, tuples, sets, and key-value dictionaries.',
      ]),
      prerequisites: 'Basic computer literacy and curiosity to learn programming logic.',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80',
      assessmentCriteria: 'Minimum 75% on syntax and algorithm logic assessment.',
    },
  });

  await prisma.courseModule.deleteMany({ where: { courseId: course5.id } });
  await prisma.courseModule.createMany({
    data: [
      {
        id: 'mod-5-1',
        courseId: course5.id,
        title: 'Module 1: Introduction to Python & Environment Setup',
        orderIndex: 1,
        durationMinutes: 25,
        contentType: 'TEXT',
        content: `### 1.1 Welcome to Python Programming
Python is a high-level, interpreted, general-purpose programming language renowned for its readable syntax and vast standard library.

#### Core Python Tenets (The Zen of Python):
- Beautiful is better than ugly.
- Explicit is better than implicit.
- Simple is better than complex.
- Readability counts.

#### Setup Guide:
1. **Interpreter Installation:** Verify Python 3 via \`python3 --version\`.
2. **Virtual Environments:** Create isolated project spaces with \`python3 -m venv .venv\`.
3. **Execution Model:** Python compiles source code (\`.py\`) into bytecode (\`.pyc\`) executed by the Python Virtual Machine (PVM).`,
        resourceUrl: 'https://capacityconnect.gov.in/resources/python-setup-cheat-sheet.pdf',
      },
      {
        id: 'mod-5-2',
        courseId: course5.id,
        title: 'Module 2: Variables, Data Types & Operators',
        orderIndex: 2,
        durationMinutes: 35,
        contentType: 'VIDEO',
        videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
        content: `### 1.2 Python Variables and Fundamental Data Types
In this educational lecture from freeCodeCamp, learn how values are stored, typed dynamically, and manipulated:
- **Primitive Types:** \`int\` (e.g. 42), \`float\` (3.1415), \`str\` ("Capacity Connect"), and \`bool\` (True/False).
- **Type Inspection:** Using \`type()\` and type coercion (\`str()\`, \`int()\`, \`float()\`).
- **Operators:** Arithmetic (\`+\`, \`-\`, \`*\`, \`/\`, \`//\`, \`%\`, \`**\`), Assignment (\`+=\`, \`-=\`), and Logical (\`and\`, \`or\`, \`not\`).`,
      },
      {
        id: 'mod-5-3',
        courseId: course5.id,
        title: 'Module 3: Conditional Branching & Loop Structures',
        orderIndex: 3,
        durationMinutes: 30,
        contentType: 'VIDEO',
        videoUrl: 'https://www.youtube.com/embed/4UuMrebbwIo',
        content: `### 1.3 Control Flow & Loops in Python
Master conditional execution and iteration patterns:
- **Decision Making:** \`if\`, \`elif\`, and \`else\` blocks with clean 4-space indentation.
- **For Loops:** Iterating over ranges, sequences, and formatted strings.
- **While Loops:** Event-driven condition loops with sentinel controls.
- **Loop Controls:** \`break\` to terminate, \`continue\` to skip to the next iteration, and \`pass\` for placeholder definitions.`,
      },
      {
        id: 'mod-5-4',
        courseId: course5.id,
        title: 'Module 4: Functions & Modular Programming',
        orderIndex: 4,
        durationMinutes: 30,
        contentType: 'TEXT',
        content: `### 1.4 Functions & Scope in Python
Functions encapsulate reusable blocks of logic, reducing duplication and improving testability.

#### Anatomy of a Python Function:
\`\`\`python
def calculate_turnaround_time(received_date, resolved_date):
    """Calculates operational SLA turnaround duration in hours."""
    delta = resolved_date - received_date
    return delta.total_seconds() / 3600
\`\`\`

#### Key Concepts:
- **Parameters vs Arguments:** Positional arguments, default parameters, and keyword arguments (\`*args\` and \`**kwargs\`).
- **Variable Scope:** Local vs Global namespaces and the LEGB rule (Local, Enclosing, Global, Built-in).`,
      },
      {
        id: 'mod-5-5',
        courseId: course5.id,
        title: 'Module 5: Built-in Collections: Lists, Tuples & Dictionaries',
        orderIndex: 5,
        durationMinutes: 35,
        contentType: 'VIDEO',
        videoUrl: 'https://www.youtube.com/embed/eWRfhZUzrAc',
        content: `### 1.5 Managing Structured Data Collections
This lecture explores Python's primary compound data structures:
- **Lists (\`[ ]\`):** Ordered, mutable sequences supporting indexing, slicing, \`append()\`, and \`pop()\`.
- **Tuples (\`( )\`) :** Ordered, immutable records suitable for fixed coordinate or database tuples.
- **Dictionaries (\`{ }\`):** High-performance hash maps mapping unique keys to values with O(1) average lookup time.`,
      },
      {
        id: 'mod-5-6',
        courseId: course5.id,
        title: 'Module 6: Hands-on Project: Automated Data File Processor',
        orderIndex: 6,
        durationMinutes: 25,
        contentType: 'TEXT',
        content: `### 1.6 Capstone Project: CSV Cleaning Script
Build a working script that reads administrative attendance records, cleans malformed timestamps, and generates summary metrics.

#### Project Milestones:
1. Read input CSV lines using Python's standard library \`csv\` module.
2. Filter records where attendance percentage falls below required thresholds.
3. Output aggregated department summary dictionaries to JSON.`,
      },
    ],
  });

  // Course 5 Assessment
  await prisma.assessment.deleteMany({ where: { courseId: course5.id } });
  const assess5 = await prisma.assessment.create({
    data: {
      id: 'assess-5',
      courseId: course5.id,
      title: 'Python Programming Basics Certification Exam',
      description: 'Test your grasp of Python syntax, functions, collections, and control flow.',
      passPercentage: 75,
      timeLimitMinutes: 20,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        assessmentId: assess5.id,
        questionText: 'Which of the following data types in Python is immutable (cannot be altered after creation)?',
        orderIndex: 1,
        options: JSON.stringify([
          'List',
          'Dictionary',
          'Tuple',
          'Set',
        ]),
        correctOptionIndex: 2,
        explanation: 'Tuples are immutable sequences; once instantiated, their elements cannot be added, removed, or reassigned.',
      },
      {
        assessmentId: assess5.id,
        questionText: 'What is the output of the expression: 7 // 2 in Python 3?',
        orderIndex: 2,
        options: JSON.stringify([
          '3.5',
          '3',
          '4',
          '3.0',
        ]),
        correctOptionIndex: 1,
        explanation: 'The double slash // operator performs floor division, truncating fractional remainders to produce integer 3.',
      },
    ],
  });

  // Course 6: HTML & CSS Fundamentals
  const course6 = await prisma.course.upsert({
    where: { code: 'WEB-101' },
    update: {},
    create: {
      id: 'course-6',
      title: 'HTML & CSS Fundamentals',
      code: 'WEB-101',
      description: 'Build modern, accessible, responsive websites from scratch using semantic HTML5 tags, CSS3 styling, Flexbox, CSS Grid, and mobile-first media queries.',
      category: 'Web',
      level: 'BEGINNER',
      durationMinutes: 180,
      instructorId: trainer.id,
      departmentId: deptGov.id,
      learningObjectives: JSON.stringify([
        'Author valid HTML5 semantic structures with proper accessibility (a11y) landmarks.',
        'Construct interactive forms with validation, labels, inputs, selects, and submit handlers.',
        'Master the CSS box model: content, padding, border, and margin.',
        'Build complex multi-column responsive layouts with Flexbox and CSS Grid.',
        'Implement media queries for seamless desktop, tablet, and mobile viewing.',
      ]),
      prerequisites: 'Familiarity with web browsers and text editors.',
      thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
      assessmentCriteria: 'Score 75% on responsive markup and CSS layout examination.',
    },
  });

  await prisma.courseModule.deleteMany({ where: { courseId: course6.id } });
  await prisma.courseModule.createMany({
    data: [
      {
        id: 'mod-6-1',
        courseId: course6.id,
        title: 'Module 1: Introduction to Web Development & HTML Document Structure',
        orderIndex: 1,
        durationMinutes: 25,
        contentType: 'TEXT',
        content: `### 2.1 The Architecture of the Web
Web applications are delivered across standard HTTP protocols where browsers render HTML structures styled with CSS.

#### Essential HTML5 Document Skeleton:
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Capacity Connect</title>
</head>
<body>
  <header><nav>...</nav></header>
  <main><article>...</article></main>
  <footer>...</footer>
</body>
</html>
\`\`\`

#### Semantic Importance:
Using \`<header>\`, \`<main>\`, \`<section>\`, \`<article>\`, and \`<nav>\` enables screen readers and assistive technology to parse page semantics properly.`,
        resourceUrl: 'https://capacityconnect.gov.in/resources/html5-semantic-reference.pdf',
      },
      {
        id: 'mod-6-2',
        courseId: course6.id,
        title: 'Module 2: HTML Elements, Semantic Tags, Forms & Tables',
        orderIndex: 2,
        durationMinutes: 35,
        contentType: 'VIDEO',
        videoUrl: 'https://www.youtube.com/embed/kUMe1FH4CHE',
        content: `### 2.2 Deep Dive into HTML Elements & Forms
This lecture walks through building accessible UI components in pure HTML:
- **Text & Headings:** Hierarchy from \`<h1>\` to \`<h6>\`, paragraphs, links (\`<a>\`), and images (\`<img>\`).
- **Interactive Forms:** \`<form>\`, \`<input type="text|email|password">\`, radio buttons, checkboxes, and \`<button type="submit">\`.
- **Accessible Tables:** \`<table>\`, \`<thead>\`, \`<tbody>\`, \`<th>\`, and \`<td>\` for data display.`,
      },
      {
        id: 'mod-6-3',
        courseId: course6.id,
        title: 'Module 3: Introduction to CSS, Selectors & The Box Model',
        orderIndex: 3,
        durationMinutes: 30,
        contentType: 'VIDEO',
        videoUrl: 'https://www.youtube.com/embed/1PnVor36_40',
        content: `### 2.3 CSS Basics and the Box Model
Learn how styling rules cascade and apply across document elements:
- **Selectors:** Element (\`p\`), Class (\`.btn\`), ID (\`#main\`), and Attribute (\`[type="text"]\`) selectors.
- **The Box Model:** Calculating real element dimensions from content + padding + border + margin.
- **Box Sizing:** Why setting \`box-sizing: border-box\` standardizes element width calculations.`,
      },
      {
        id: 'mod-6-4',
        courseId: course6.id,
        title: 'Module 4: Modern Layouts: Flexbox & CSS Grid Mastery',
        orderIndex: 4,
        durationMinutes: 35,
        contentType: 'VIDEO',
        videoUrl: 'https://www.youtube.com/embed/u044iM9xsWU',
        content: `### 2.4 Mastering CSS Flexbox & CSS Grid
Modern CSS eliminates legacy floats and inline-block hacks:
- **Flexbox (1D Layouts):** \`display: flex\`, \`flex-direction\`, \`justify-content\`, \`align-items\`, and flexible element wrapping.
- **CSS Grid (2D Layouts):** \`display: grid\`, \`grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))\`, and gap controls for responsive card galleries.`,
      },
      {
        id: 'mod-6-5',
        courseId: course6.id,
        title: 'Module 5: Responsive Web Design & Media Queries',
        orderIndex: 5,
        durationMinutes: 30,
        contentType: 'VIDEO',
        videoUrl: 'https://www.youtube.com/embed/pQN-pnXPaVg',
        content: `### 2.5 Responsive Design & Breakpoints
Ensure your application renders beautifully across phone screens, tablets, and 4K displays:
- **Viewport Meta Tag:** Controlling initial zoom and device-width scaling.
- **Mobile-First CSS:** Writing default mobile styles and overriding via \`@media (min-width: 768px)\`.
- **Relative Units:** Utilizing \`rem\`, \`em\`, \`%\`, \`vw\`, and \`vh\` over fixed physical pixels.`,
      },
      {
        id: 'mod-6-6',
        courseId: course6.id,
        title: 'Module 6: Mini Website Project: Responsive Portal Landing Page',
        orderIndex: 6,
        durationMinutes: 25,
        contentType: 'TEXT',
        content: `### 2.6 Capstone Project: Public Services Landing Page
Synthesize everything you have learned by building a responsive institutional landing page complete with hero section, feature cards, and contact form.`,
      },
    ],
  });

  // Course 6 Assessment
  await prisma.assessment.deleteMany({ where: { courseId: course6.id } });
  const assess6 = await prisma.assessment.create({
    data: {
      id: 'assess-6',
      courseId: course6.id,
      title: 'HTML & CSS Fundamentals Certification Exam',
      description: 'Demonstrate proficiency in semantic markup, modern CSS layouts, and responsive styling.',
      passPercentage: 75,
      timeLimitMinutes: 20,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        assessmentId: assess6.id,
        questionText: 'Which CSS property specifies how elements are distributed along the main axis in a Flexbox container?',
        orderIndex: 1,
        options: JSON.stringify([
          'align-items',
          'justify-content',
          'flex-direction',
          'grid-template-areas',
        ]),
        correctOptionIndex: 1,
        explanation: 'justify-content aligns flex items along the container main axis (e.g., flex-start, center, space-between).',
      },
      {
        assessmentId: assess6.id,
        questionText: 'What is the purpose of setting "box-sizing: border-box" in CSS?',
        orderIndex: 2,
        options: JSON.stringify([
          'It adds a red border around every element automatically',
          'It includes padding and border within the specified element width and height',
          'It removes all margins from the document body',
          'It prevents links from showing underlines',
        ]),
        correctOptionIndex: 1,
        explanation: 'With border-box, the declared width and height apply to the entire element box including padding and border.',
      },
    ],
  });

  // Course 7: Database Fundamentals (SQL)
  const course7 = await prisma.course.upsert({
    where: { code: 'SQL-201' },
    update: {},
    create: {
      id: 'course-7',
      title: 'Database Fundamentals (SQL)',
      code: 'SQL-201',
      description: 'Master relational database architecture, schema design, primary/foreign key constraints, query filtering, table joins, transactions, and aggregate analytics.',
      category: 'Data',
      level: 'INTERMEDIATE',
      durationMinutes: 180,
      instructorId: admin.id,
      departmentId: deptSec.id,
      learningObjectives: JSON.stringify([
        'Differentiate between DBMS, RDBMS, and NoSQL data storage architectures.',
        'Design normalized relational schemas with Primary Key and Foreign Key constraints.',
        'Execute complex SELECT queries using WHERE, ORDER BY, GROUP BY, and HAVING.',
        'Perform multi-table relational joins (INNER, LEFT, RIGHT, FULL OUTER).',
        'Maintain ACID consistency during INSERT, UPDATE, and DELETE data operations.',
      ]),
      prerequisites: 'Basic understanding of tabular data and spreadsheets.',
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
      assessmentCriteria: 'Achieve 80% on schema normalization and multi-table SQL query exam.',
    },
  });

  await prisma.courseModule.deleteMany({ where: { courseId: course7.id } });
  await prisma.courseModule.createMany({
    data: [
      {
        id: 'mod-7-1',
        courseId: course7.id,
        title: 'Module 1: Introduction to Databases, DBMS vs RDBMS & Relational Theory',
        orderIndex: 1,
        durationMinutes: 25,
        contentType: 'TEXT',
        content: `### 3.1 Foundations of Relational Database Systems
A Relational Database Management System (RDBMS) organizes information into mathematical relations (tables) composed of rows (tuples) and columns (attributes).

#### Key ACID Guarantees:
- **Atomicity:** All statements in a transaction succeed or all rollback.
- **Consistency:** Transactions transition the database from one valid state to another satisfying all schema constraints.
- **Isolation:** Concurrent transactions execute without mutual interference.
- **Durability:** Committed transactions persist even in the event of hardware power failure.`,
        resourceUrl: 'https://capacityconnect.gov.in/resources/rdbms-acid-principles.pdf',
      },
      {
        id: 'mod-7-2',
        courseId: course7.id,
        title: 'Module 2: Database Schema Design, Tables, Data Types & Keys (PK/FK)',
        orderIndex: 2,
        durationMinutes: 35,
        contentType: 'VIDEO',
        videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY',
        content: `### 3.2 Schema Architecture & Relational Constraints
This comprehensive video lecture from freeCodeCamp covers foundational database creation:
- **Data Definition Language (DDL):** \`CREATE TABLE\`, \`ALTER TABLE\`, and \`DROP TABLE\`.
- **Integrity Constraints:** \`PRIMARY KEY\`, \`FOREIGN KEY REFERENCES\`, \`NOT NULL\`, and \`UNIQUE\`.
- **Data Types:** Numerical (\`INT\`, \`DECIMAL\`), Character (\`VARCHAR\`, \`TEXT\`), and Temporal (\`TIMESTAMP\`).`,
      },
      {
        id: 'mod-7-3',
        courseId: course7.id,
        title: 'Module 3: Querying Data with SQL SELECT, Filtering & Sorting',
        orderIndex: 3,
        durationMinutes: 30,
        contentType: 'TEXT',
        content: `### 3.3 Data Retrieval Syntax
Learn the standard SQL querying pipeline:
- **Projection:** Selecting specific column subsets (\`SELECT name, email FROM users\`).
- **Filtering:** Filtering row sets with \`WHERE\` predicates (\`WHERE department = 'SEC' AND active = TRUE\`).
- **Pattern Matching:** Using \`LIKE\` with wildcard characters (\`%\` and \`_\`).
- **Ordering & Limits:** Sorting records via \`ORDER BY created_at DESC LIMIT 20\`.`,
      },
      {
        id: 'mod-7-4',
        courseId: course7.id,
        title: 'Module 4: Aggregate Functions & Grouping (GROUP BY, HAVING)',
        orderIndex: 4,
        durationMinutes: 35,
        contentType: 'VIDEO',
        videoUrl: 'https://www.youtube.com/embed/Yr4pHPZCshA',
        content: `### 3.4 Summary Aggregation in SQL
Gate Smashers' university lecture on multi-row aggregations:
- **Scalar Aggregates:** \`COUNT(*)\`, \`SUM(amount)\`, \`AVG(score)\`, \`MIN(duration)\`, \`MAX(duration)\`.
- **GROUP BY:** Grouping records across categorical dimensions (e.g. by department or course).
- **HAVING vs WHERE:** Filtering post-aggregation groupings vs pre-aggregation rows.`,
      },
      {
        id: 'mod-7-5',
        courseId: course7.id,
        title: 'Module 5: Relational Joins (INNER, LEFT, RIGHT, FULL OUTER)',
        orderIndex: 5,
        durationMinutes: 30,
        contentType: 'VIDEO',
        videoUrl: 'https://www.youtube.com/embed/zYH-e6tUYbw',
        content: `### 3.5 Combining Relational Datasets
Understand relational algebra and join conditions:
- **INNER JOIN:** Returns records with matching keys in both tables.
- **LEFT (OUTER) JOIN:** Retains all records from the left table and populates unmatched right columns with NULL.
- **Self Joins:** Joining a table to itself to model organizational hierarchy (e.g. employee to manager).`,
      },
      {
        id: 'mod-7-6',
        courseId: course7.id,
        title: 'Module 6: Data Modification (INSERT, UPDATE, DELETE) & Project',
        orderIndex: 6,
        durationMinutes: 25,
        contentType: 'TEXT',
        content: `### 3.6 Data Manipulation Language (DML) & Capstone
Execute safe state modifications:
- \`INSERT INTO ... VALUES\`: Adding new records.
- \`UPDATE ... SET ... WHERE\`: Guarding against accidental table-wide updates.
- \`DELETE FROM ... WHERE\`: Soft deletes vs hard cascade removals.`,
      },
    ],
  });

  // Course 7 Assessment
  await prisma.assessment.deleteMany({ where: { courseId: course7.id } });
  const assess7 = await prisma.assessment.create({
    data: {
      id: 'assess-7',
      courseId: course7.id,
      title: 'Database Fundamentals (SQL) Certification Exam',
      description: 'Test your understanding of relational algebra, query optimization, and join semantics.',
      passPercentage: 80,
      timeLimitMinutes: 20,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        assessmentId: assess7.id,
        questionText: 'What type of join returns all rows from the left table, and matching rows from the right table (with NULL for non-matching right rows)?',
        orderIndex: 1,
        options: JSON.stringify([
          'INNER JOIN',
          'LEFT JOIN',
          'CROSS JOIN',
          'NATURAL JOIN',
        ]),
        correctOptionIndex: 1,
        explanation: 'LEFT JOIN preserves every record from the left relation, filling right columns with NULL when the join predicate fails.',
      },
      {
        assessmentId: assess7.id,
        questionText: 'Which SQL keyword is used to enforce entity integrity ensuring a column uniquely identifies each row and cannot be NULL?',
        orderIndex: 2,
        options: JSON.stringify([
          'FOREIGN KEY',
          'PRIMARY KEY',
          'CHECK',
          'DEFAULT',
        ]),
        correctOptionIndex: 1,
        explanation: 'A PRIMARY KEY constraint enforces uniqueness and non-nullability for identifying table rows.',
      },
    ],
  });

  // Course 8: Data Structures Essentials
  const course8 = await prisma.course.upsert({
    where: { code: 'DSA-201' },
    update: {},
    create: {
      id: 'course-8',
      title: 'Data Structures Essentials',
      code: 'DSA-201',
      description: 'Master core computational data structures: arrays, linked lists, stacks, queues, hash tables, binary trees, sorting algorithms, and asymptotic complexity analysis.',
      category: 'Programming',
      level: 'INTERMEDIATE',
      durationMinutes: 210,
      instructorId: admin.id,
      departmentId: deptSec.id,
      learningObjectives: JSON.stringify([
        'Analyze algorithms using Big-O notation for worst-case, average-case, and space complexity.',
        'Implement singly and doubly linked lists with dynamic memory pointers.',
        'Design Stack (LIFO) and Queue (FIFO) structures for job scheduling and syntax parsing.',
        'Compare efficiency of sorting algorithms: Quick Sort, Merge Sort, and Insertion Sort.',
        'Traverse hierarchical Binary Search Trees and understand balanced tree structures.',
      ]),
      prerequisites: 'Basic programming knowledge in Python, C++, or Java.',
      thumbnail: 'https://images.unsplash.com/photo-1516116211227-bbc04ebfcfe5?w=600&auto=format&fit=crop&q=80',
      assessmentCriteria: 'Achieve 80% on algorithmic time complexity and data structure traversal quiz.',
    },
  });

  await prisma.courseModule.deleteMany({ where: { courseId: course8.id } });
  await prisma.courseModule.createMany({
    data: [
      {
        id: 'mod-8-1',
        courseId: course8.id,
        title: 'Module 1: Introduction to Data Structures, Memory & Big-O Complexity',
        orderIndex: 1,
        durationMinutes: 30,
        contentType: 'TEXT',
        content: `### 4.1 Foundations of Algorithmic Complexity
Data structures are standardized formats for organizing, processing, and storing data efficiently.

#### Asymptotic Complexity Classes:
- **O(1) Constant Time:** Hash table lookups, stack push/pop.
- **O(log n) Logarithmic Time:** Binary search across sorted arrays.
- **O(n) Linear Time:** Single pass traversal through an unsorted list.
- **O(n log n) Linearithmic Time:** Optimal comparison sorts (Merge Sort, Heap Sort).
- **O(n²) Quadratic Time:** Nested loop algorithms (Bubble Sort, Selection Sort).`,
        resourceUrl: 'https://capacityconnect.gov.in/resources/big-o-complexity-cheat-sheet.pdf',
      },
      {
        id: 'mod-8-2',
        courseId: course8.id,
        title: 'Module 2: Linear Data Structures: Arrays & Linked Lists Implementation',
        orderIndex: 2,
        durationMinutes: 40,
        contentType: 'VIDEO',
        videoUrl: 'https://www.youtube.com/embed/8hly31xKli0',
        content: `### 4.2 Arrays vs Linked Lists
In this lecture from freeCodeCamp, examine linear memory representations:
- **Contiguous Arrays:** Fast O(1) random indexing, but expensive O(n) middle insertions and resizing costs.
- **Linked Lists:** Dynamic nodes connected by pointers; efficient O(1) head insertion without memory reallocation.
- **Singly vs Doubly Linked Lists:** Forward-only vs bidirectional pointer navigation.`,
      },
      {
        id: 'mod-8-3',
        courseId: course8.id,
        title: 'Module 3: LIFO & FIFO: Stacks, Queues & Practical Applications',
        orderIndex: 3,
        durationMinutes: 30,
        contentType: 'TEXT',
        content: `### 4.3 Stacks and Queues
Fundamental abstract data types for controlled sequencing:
- **Stack (Last-In, First-Out):** Call stack execution, undo/redo mechanisms, and parentheses matching.
- **Queue (First-In, First-Out):** Operating system printer queues, message brokers, and breadth-first search.`,
      },
      {
        id: 'mod-8-4',
        courseId: course8.id,
        title: 'Module 4: Searching & Sorting Algorithms',
        orderIndex: 4,
        durationMinutes: 40,
        contentType: 'VIDEO',
        videoUrl: 'https://www.youtube.com/embed/RpLnQnurpLY',
        content: `### 4.4 Sorting and Searching Visualized
This crash course demonstrates how algorithms partition and order elements:
- **Binary Search:** O(log n) divide-and-conquer search on sorted sequences.
- **Merge Sort:** Guaranteed O(n log n) stable sorting using divide-and-conquer recursion.
- **Quick Sort:** High-speed in-place partitioning around a chosen pivot element.`,
      },
      {
        id: 'mod-8-5',
        courseId: course8.id,
        title: 'Module 5: Hierarchical Structures: Binary Trees & Binary Search Trees (BST)',
        orderIndex: 5,
        durationMinutes: 35,
        contentType: 'VIDEO',
        videoUrl: 'https://www.youtube.com/embed/I_JuQ5ayPmc',
        content: `### 4.5 Binary Search Trees & Traversals
Gate Smashers' university lecture on hierarchical data representations:
- **BST Invariant:** Every node in the left subtree has a value smaller than the root; every right node has a greater value.
- **Traversals:** Inorder (yields sorted sequence), Preorder (tree copying), and Postorder (tree deletion).`,
      },
      {
        id: 'mod-8-6',
        courseId: course8.id,
        title: 'Module 6: Graph Representations, Traversals & Real-World Use Cases',
        orderIndex: 6,
        durationMinutes: 35,
        contentType: 'TEXT',
        content: `### 4.6 Graph Theory Fundamentals
Graphs model networks of entities:
- **Representations:** Adjacency Matrix (dense graphs) vs Adjacency List (sparse graphs).
- **Traversals:** Breadth-First Search (BFS) using queues vs Depth-First Search (DFS) using recursion.`,
      },
    ],
  });

  // Course 8 Assessment
  await prisma.assessment.deleteMany({ where: { courseId: course8.id } });
  const assess8 = await prisma.assessment.create({
    data: {
      id: 'assess-8',
      courseId: course8.id,
      title: 'Data Structures Essentials Certification Exam',
      description: 'Evaluate mastery of asymptotic complexity, linked structures, and binary trees.',
      passPercentage: 80,
      timeLimitMinutes: 20,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        assessmentId: assess8.id,
        questionText: 'What is the worst-case time complexity of Binary Search on a sorted array of size n?',
        orderIndex: 1,
        options: JSON.stringify([
          'O(1)',
          'O(log n)',
          'O(n)',
          'O(n log n)',
        ]),
        correctOptionIndex: 1,
        explanation: 'Binary Search halves the search interval at each step, yielding logarithmic O(log n) worst-case time complexity.',
      },
      {
        assessmentId: assess8.id,
        questionText: 'Which data structure follows the Last-In, First-Out (LIFO) access principle?',
        orderIndex: 2,
        options: JSON.stringify([
          'Queue',
          'Stack',
          'Binary Heap',
          'Hash Table',
        ]),
        correctOptionIndex: 1,
        explanation: 'A Stack strictly enforces LIFO ordering, where the most recently pushed element is the first popped.',
      },
    ],
  });

  // Course 9: Communication Skills
  const course9 = await prisma.course.upsert({
    where: { code: 'COMM-101' },
    update: {},
    create: {
      id: 'course-9',
      title: 'Communication Skills',
      code: 'COMM-101',
      description: 'Develop high-impact verbal, non-verbal, active listening, presentation, cross-functional collaboration, and written executive communication capabilities.',
      category: 'Soft Skills',
      level: 'BEGINNER',
      durationMinutes: 150,
      instructorId: trainer.id,
      departmentId: deptTraining.id,
      learningObjectives: JSON.stringify([
        'Apply the 7 C’s of effective communication (Clear, Concise, Concrete, Correct, Coherent, Complete, Courteous).',
        'Master vocal delivery, pacing, inflection, and open body language posture.',
        'Practice active listening and empathetic questioning during high-stakes dialogues.',
        'Deliver compelling technical and executive presentations.',
        'Compose crisp, professional emails, meeting summaries, and structured reports.',
      ]),
      prerequisites: 'Openness to interactive speaking exercises and self-reflection.',
      thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
      assessmentCriteria: 'Score 75% on workplace communication scenarios and conflict resolution exam.',
    },
  });

  await prisma.courseModule.deleteMany({ where: { courseId: course9.id } });
  await prisma.courseModule.createMany({
    data: [
      {
        id: 'mod-9-1',
        courseId: course9.id,
        title: 'Module 1: Foundations of Effective Workplace Communication & Core Principles',
        orderIndex: 1,
        durationMinutes: 25,
        contentType: 'TEXT',
        content: `### 5.1 Communication as a Strategic Capability
In enterprise and public governance, communication is not merely transmitting data—it is creating shared alignment and driving purposeful action.

#### The 7 C’s Framework:
1. **Clear:** Purpose and message are immediately apparent.
2. **Concise:** Respecting the audience's time by eliminating superfluous filler.
3. **Concrete:** Supported by precise facts, data points, and explicit deliverables.
4. **Correct:** Accurate grammar, numbers, and technical terminology.
5. **Coherent:** Logical narrative progression connecting background to recommendations.
6. **Complete:** Providing all necessary context for informed decision-making.
7. **Courteous:** Respectful, constructive, and culturally sensitive tone.`,
        resourceUrl: 'https://capacityconnect.gov.in/resources/7-cs-communication-guide.pdf',
      },
      {
        id: 'mod-9-2',
        courseId: course9.id,
        title: 'Module 2: Verbal & Non-Verbal Communication: Tone, Body Language & Presence',
        orderIndex: 2,
        durationMinutes: 30,
        contentType: 'VIDEO',
        videoUrl: 'https://www.youtube.com/embed/HAnw168huqA',
        content: `### 5.2 Spontaneous Speaking & Body Language
Presented by the Stanford Graduate School of Business, this acclaimed masterclass explores:
- **Managing Anxiety:** Reframing high-pressure speaking from a performance to a conversation.
- **Physical Demeanor:** Eye contact, grounded posture, and purposeful hand gestures.
- **Vocal Variety:** Modulation of pitch, pace, volume, and intentional pauses to command attention.`,
      },
      {
        id: 'mod-9-3',
        courseId: course9.id,
        title: 'Module 3: Active Listening, Empathy & Collaborative Dialogue',
        orderIndex: 3,
        durationMinutes: 25,
        contentType: 'VIDEO',
        videoUrl: 'https://www.youtube.com/embed/cSohjlYQI2A',
        content: `### 5.3 5 Ways to Listen Better
TED speaker Julian Treasure breaks down why conscious listening is essential:
- **Silence:** Resetting sensory input to calibrate attention.
- **The Mixer:** Discerning individual audio channels in noisy organizational environments.
- **Savoring:** Appreciating mundane communicative nuances.
- **Listening Positions:** Adapting listening postures (critical vs empathetic).
- **RASA:** Receive, Appreciate, Summarize, Ask.`,
      },
      {
        id: 'mod-9-4',
        courseId: course9.id,
        title: 'Module 4: Professional Speaking, Vocal Delivery & Presentation Skills',
        orderIndex: 4,
        durationMinutes: 25,
        contentType: 'VIDEO',
        videoUrl: 'https://www.youtube.com/embed/eIho2S0ZahI',
        content: `### 5.4 How to Speak So That People Want to Listen
Julian Treasure explores the four cornerstones of powerful human speech:
- **HAIL:**
  - **Honesty:** Be clear and straight.
  - **Authenticity:** Stand in your own truth.
  - **Integrity:** Be your word.
  - **Love:** Wish people well.
- **Vocal Tool Box:** Register, timbre, prosody, pace, pitch, and volume.`,
      },
      {
        id: 'mod-9-5',
        courseId: course9.id,
        title: 'Module 5: Group Discussions, Job Interviews & Confident Q&A',
        orderIndex: 5,
        durationMinutes: 25,
        contentType: 'TEXT',
        content: `### 5.5 High-Stakes Interpersonal Scenarios
Structuring responses under pressure:
- **The STAR Method:** Situation, Task, Action, Result for behavioral interview questions.
- **Constructive Disagreement:** Separating ideas from identity to de-escalate workplace tension.
- **Facilitation:** Keeping group meetings focused on outcomes rather than grievances.`,
      },
      {
        id: 'mod-9-6',
        courseId: course9.id,
        title: 'Module 6: Written Communication: Executive Emails, Reports & Resumes',
        orderIndex: 6,
        durationMinutes: 20,
        contentType: 'TEXT',
        content: `### 5.6 Executive Written Formats
Crafting impactful asynchronous documents:
- **BLUF (Bottom Line Up Front):** Lead emails with the request or core decision required.
- **Scannable Bulleting:** Replacing dense walls of text with prioritized key takeaways.
- **Proofreading Checklist:** Verification of names, dates, links, and action deadlines.`,
      },
    ],
  });

  // Course 9 Assessment
  await prisma.assessment.deleteMany({ where: { courseId: course9.id } });
  const assess9 = await prisma.assessment.create({
    data: {
      id: 'assess-9',
      courseId: course9.id,
      title: 'Professional Communication Skills Certification Exam',
      description: 'Evaluate active listening techniques, RASA framework, and executive presentation principles.',
      passPercentage: 75,
      timeLimitMinutes: 20,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        assessmentId: assess9.id,
        questionText: 'In Julian Treasure’s RASA active listening framework, what does the letter "S" stand for?',
        orderIndex: 1,
        options: JSON.stringify([
          'Speak',
          'Summarize',
          'Silence',
          'Sympathize',
        ]),
        correctOptionIndex: 1,
        explanation: 'RASA stands for Receive, Appreciate, Summarize, Ask. Summarizing confirms mutual understanding before moving forward.',
      },
      {
        assessmentId: assess9.id,
        questionText: 'What does the "BLUF" executive writing principle advocate?',
        orderIndex: 2,
        options: JSON.stringify([
          'Burying key takeaways at the very end of a 10-page report',
          'Bottom Line Up Front: placing the core decision or conclusion right at the beginning',
          'Using informal acronyms without explanation',
          'Writing entirely in bold capital letters',
        ]),
        correctOptionIndex: 1,
        explanation: 'Bottom Line Up Front (BLUF) states the recommendation or core conclusion in the opening lines so busy stakeholders can act quickly.',
      },
    ],
  });

  // 6. Certificate for Rahul Sharma
  await prisma.certificate.upsert({
    where: {
      userId_courseId: {
        userId: learner.id,
        courseId: course1.id,
      },
    },
    update: {},
    create: {
      certificateNumber: 'CC-2026-DPI-00891',
      userId: learner.id,
      courseId: course1.id,
      issueDate: new Date('2026-02-20T16:45:00Z'),
      grade: 'Passed with Distinction (92%)',
      verificationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
  });

  // 7. Training Sessions
  await prisma.trainingSession.upsert({
    where: { id: 'session-1' },
    update: {},
    create: {
      id: 'session-1',
      title: 'Executive Workshop: Zero Trust Architecture for Public Portals',
      description: 'Interactive deep dive into identity micro-segmentation, token rotation, and threat modeling for mission-critical portals.',
      instructorId: admin.id,
      modality: 'ONLINE',
      locationOrUrl: 'https://meet.capacityconnect.in/session-zt-2026',
      startTime: new Date('2026-11-05T10:00:00Z'),
      endTime: new Date('2026-11-05T12:30:00Z'),
      capacity: 40,
    },
  });

  // 8. Knowledge Articles
  await prisma.knowledgeArticle.upsert({
    where: { slug: 'sop-cert-in-incident-reporting' },
    update: {},
    create: {
      title: 'Standard Operating Procedure (SOP): Mandatory 6-Hour Incident Notification to CERT-In',
      slug: 'sop-cert-in-incident-reporting',
      summary: 'Step-by-step checklist for system administrators when suspecting, detecting, or confirming an unauthorized intrusion or ransomware event.',
      content: `## Objective & Purpose\nThis Standard Operating Procedure establishes immediate containment actions, forensic preservation protocols, and chain-of-custody documentation required to comply with national CERT-In reporting rules.\n\n### Action Checklist:\n1. Immediate Isolation\n2. Internal Escalation\n3. External CERT-In Dispatch within 6 hours.`,
      category: 'Security & Compliance',
      tags: 'CERT-In, SOP, Incident Response, Cyber Hygiene',
      authorId: admin.id,
      viewsCount: 342,
    },
  });

  // 9. Announcements
  await prisma.announcement.create({
    data: {
      title: 'National Digital Capability Drive 2026: Mandatory Cyber Training',
      content: 'All departmental employees are required to complete CERT-In Cyber Incident Management (SEC-202) before the Q1 audit deadline.',
      priority: 'HIGH',
      authorId: admin.id,
      departmentId: deptGov.id,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
