# Capacity Connect — Architecture & System Design Document
**SIH Problem Statement ID: SIH26075**

## 1. Domain Problem Context
Government departments and enterprise organizations face fragmented knowledge systems and misalignment between employee competencies and national administrative priorities. 

Capacity Connect addresses SIH26075 by offering:
- **Centralized competency taxonomy** mapped to Mission Karmayogi standards.
- **Dual assessment workflow** separating self-evaluations from supervisor-verified ratings.
- **Synchronous workshop registration** with capacity caps to manage limited seat cohorts.
- **Deterministic AI-ready learning assistant** providing instant answers from vetted compliance guidelines.
- **Verifiable credential engine** creating tamper-evident digital certificates with cryptographic SHA-256 digests.

## 2. Relational Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    DEPARTMENT ||--o{ USER : employs
    DEPARTMENT ||--o{ COURSE : sponsors
    USER ||--o{ ENROLLMENT : enrolls
    COURSE ||--o{ ENROLLMENT : registers
    COURSE ||--o{ COURSE_MODULE : contains
    ENROLLMENT ||--o{ MODULE_PROGRESS : tracks
    COURSE_MODULE ||--o{ MODULE_PROGRESS : records
    COURSE ||--o{ ASSESSMENT : evaluates
    ASSESSMENT ||--o{ QUESTION : contains
    ASSESSMENT ||--o{ ASSESSMENT_ATTEMPT : attempts
    USER ||--o{ ASSESSMENT_ATTEMPT : takes
    USER ||--o{ USER_SKILL : possesses
    SKILL ||--o{ USER_SKILL : defines
    USER ||--o{ SESSION_REGISTRATION : registers
    TRAINING_SESSION ||--o{ SESSION_REGISTRATION : hosts
    USER ||--o{ CERTIFICATE : receives
    COURSE ||--o{ CERTIFICATE : accredits
    USER ||--o{ NOTIFICATION : receives
    USER ||--o{ KNOWLEDGE_ARTICLE : authors
```

## 3. Security Model & RBAC

| Module | Learner | Trainer | Org Manager | Admin |
| :--- | :---: | :---: | :---: | :---: |
| Course Enrollment & Progress | Read/Write (Self) | Read | Read (Team) | Read/Write (All) |
| Quizzes & Certification | Read/Write (Self) | Read | Read (Team) | Full Access |
| Competency Self-Rating | Write (Self) | Write (Self) | Write (Self) | Full Access |
| Competency Supervisor Verification | No | Yes | Yes | Yes |
| Workshop Scheduling | View & Register | Create & Manage | Create & Manage | Full Access |
| SOP Knowledge Authoring | View & Comment | Create & Edit | Create & Edit | Full Access |
| Course Assignment Engine | No | No | Yes | Yes |
| Audit Export (CSV) | No | No | Yes | Yes |

## 4. Verification & Cryptographic Standards
Certificates issued by Capacity Connect feature a SHA-256 verification digest:
$$\text{verificationHash} = \text{SHA256}(\text{CertificateID} \mathbin{\Vert} \text{UserID} \mathbin{\Vert} \text{Timestamp})$$
The public lookup endpoint (`/api/certificates/verify/:certNumber`) verifies against this hash to prevent unauthorized credential tampering.
