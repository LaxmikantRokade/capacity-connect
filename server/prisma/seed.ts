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
  const mod1 = await prisma.courseModule.create({
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

  const mod2 = await prisma.courseModule.create({
    data: {
      id: 'mod-1-2',
      courseId: course1.id,
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
  });

  const mod3 = await prisma.courseModule.create({
    data: {
      id: 'mod-1-3',
      courseId: course1.id,
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
