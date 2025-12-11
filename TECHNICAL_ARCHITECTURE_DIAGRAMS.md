# Technical Architecture & Integration Diagrams

## 1. High-Level Microservices Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY (Kong/Nginx)                             │
│                    Authentication & Rate Limiting                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │
        ┌─────────────────────────────┴──────────────────────────────┐
        │                                                              │
        │                    SERVICE MESH / MESSAGE BUS                │
        │                  (RabbitMQ / Apache Kafka)                   │
        │                                                              │
        └────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┘
             │    │    │    │    │    │    │    │    │    │    │
┌────────────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼──────────────┐
│            │    │    │    │    │    │    │    │    │    │    │              │
│  ┌─────────▼──┐ │    │    │    │    │    │    │    │    │    │              │
│  │ Student    │ │    │    │    │    │    │    │    │    │    │              │
│  │ Service    │ │    │    │    │    │    │    │    │    │    │              │
│  └────────────┘ │    │    │    │    │    │    │    │    │    │              │
│                 │    │    │    │    │    │    │    │    │    │              │
│     ┌───────────▼──┐ │    │    │    │    │    │    │    │    │              │
│     │ Academic     │ │    │    │    │    │    │    │    │    │              │
│     │ Service      │ │    │    │    │    │    │    │    │    │              │
│     └──────────────┘ │    │    │    │    │    │    │    │    │              │
│                      │    │    │    │    │    │    │    │    │              │
│         ┌────────────▼──┐ │    │    │    │    │    │    │    │              │
│         │ Assessment &  │ │    │    │    │    │    │    │    │              │
│         │ Exam Service  │ │    │    │    │    │    │    │    │              │
│         └───────────────┘ │    │    │    │    │    │    │    │              │
│                           │    │    │    │    │    │    │    │              │
│             ┌─────────────▼──┐ │    │    │    │    │    │    │              │
│             │ Teacher        │ │    │    │    │    │    │    │              │
│             │ Service        │ │    │    │    │    │    │    │              │
│             └────────────────┘ │    │    │    │    │    │    │              │
│                                │    │    │    │    │    │    │              │
│                 ┌──────────────▼──┐ │    │    │    │    │    │              │
│                 │ Finance &       │ │    │    │    │    │    │              │
│                 │ Fee Service     │ │    │    │    │    │    │              │
│                 └─────────────────┘ │    │    │    │    │    │              │
│                                     │    │    │    │    │    │              │
│                     ┌───────────────▼──┐ │    │    │    │    │              │
│                     │ Attendance       │ │    │    │    │    │              │
│                     │ Service          │ │    │    │    │    │              │
│                     └──────────────────┘ │    │    │    │    │              │
│                                          │    │    │    │    │              │
│                         ┌────────────────▼──┐ │    │    │    │              │
│                         │ Communication &   │ │    │    │    │              │
│                         │ Notification      │ │    │    │    │              │
│                         └───────────────────┘ │    │    │    │              │
│                                               │    │    │    │              │
│                             ┌─────────────────▼──┐ │    │    │              │
│                             │ HR Management      │ │    │    │              │
│                             │ Service            │ │    │    │              │
│                             └────────────────────┘ │    │    │              │
│                                                    │    │    │              │
│                                 ┌──────────────────▼──┐ │    │              │
│                                 │ Health & Wellness   │ │    │              │
│                                 │ Service             │ │    │              │
│                                 └─────────────────────┘ │    │              │
│                                                         │    │              │
│                                     ┌───────────────────▼──┐ │              │
│                                     │ Reporting &          │ │              │
│                                     │ Analytics Service    │ │              │
│                                     └──────────────────────┘ │              │
│                                                              │              │
│                                         ┌────────────────────▼─┐            │
│                                         │ Government           │            │
│                                         │ Integration Service  │            │
│                                         └──────────────────────┘            │
│                                                                              │
│                                  [Additional Services...]                   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │
        ┌─────────────────────────────┴──────────────────────────────┐
        │                                                              │
┌───────▼──────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────▼──────┐
│ PostgreSQL   │  │ MongoDB  │  │  Redis   │  │  Elastic │  │  File        │
│ Database     │  │          │  │  Cache   │  │  Search  │  │  Storage     │
└──────────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────────┘
```

---

## 2. Client Applications Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER                                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Web App    │  │  Mobile App  │  │  Mobile App  │  │    USSD      │
│   (React/    │  │  (Student)   │  │  (Teacher)   │  │   Gateway    │
│    Vue.js)   │  │   Android/   │  │   Android/   │  │  (Feature    │
│              │  │     iOS      │  │     iOS      │  │   Phones)    │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │                 │
       │                 │                 │                 │
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Mobile App  │  │   Admin      │  │   SMS        │  │  WhatsApp    │
│  (Parent)    │  │   Dashboard  │  │   Gateway    │  │   Business   │
│   Android/   │  │   (Desktop)  │  │              │  │     API      │
│     iOS      │  │              │  │              │  │              │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │                 │
       └─────────────────┴─────────────────┴─────────────────┘
                               │
                               │
                    ┌──────────▼──────────┐
                    │    API GATEWAY      │
                    │   (Load Balancer)   │
                    └─────────────────────┘
```

---

## 3. Data Flow Diagram - Student Admission Process

```
┌─────────────┐
│   Parent/   │
│  Guardian   │
└──────┬──────┘
       │
       │ 1. Online Application
       │    with payment
       ▼
┌─────────────────┐
│  Parent Portal  │
│    Service      │
└──────┬──────────┘
       │
       │ 2. Submit application
       ▼
┌─────────────────┐        ┌──────────────────┐
│   Student       │──────▶ │  Payment Service │
│   Service       │◀────── │  (Mobile Money)  │
└──────┬──────────┘        └──────────────────┘
       │                    3. Payment verification
       │
       │ 4. Create admission record
       ▼
┌─────────────────┐
│  Notification   │
│    Service      │─────▶ Parent (SMS/Email)
└──────┬──────────┘
       │
       │ 5. Notify admin
       ▼
┌─────────────────┐
│ Admin Dashboard │
└──────┬──────────┘
       │
       │ 6. Counselor reviews
       │    & assigns to batch
       ▼
┌─────────────────┐
│   Academic      │
│   Service       │
└──────┬──────────┘
       │
       │ 7. Generate student ID
       ▼
┌─────────────────┐
│   Document      │
│   Service       │─────▶ Generate admission letter
└─────────────────┘
```

---

## 4. Data Flow Diagram - Fee Payment (Mobile Money)

```
┌─────────────┐
│   Parent    │
│  (Mobile)   │
└──────┬──────┘
       │
       │ 1. View fee balance
       ▼
┌─────────────────┐
│  Parent Portal  │
│    Service      │
└──────┬──────────┘
       │
       │ 2. Initiate payment
       ▼
┌─────────────────┐        ┌──────────────────┐
│   Finance       │──────▶ │   Mobile Money   │
│   Service       │   3.   │   Provider API   │
│                 │        │  (MTN/Airtel)    │
│                 │◀────── │                  │
└──────┬──────────┘   4.   └──────────────────┘
       │              Payment callback
       │
       │ 5. Update payment record
       ▼
┌─────────────────┐
│   Database      │
│  (PostgreSQL)   │
└──────┬──────────┘
       │
       │ 6. Generate receipt
       ▼
┌─────────────────┐
│   Document      │
│   Service       │
└──────┬──────────┘
       │
       │ 7. Send receipt
       ▼
┌─────────────────┐
│  Notification   │
│    Service      │─────▶ Parent (SMS/Email/WhatsApp)
└──────┬──────────┘
       │
       │ 8. Update dashboards
       ▼
┌─────────────────┐
│   Reporting     │
│   Service       │
└─────────────────┘
```

---

## 5. Data Flow Diagram - Attendance Marking

```
┌─────────────┐
│   Teacher   │
│  (Mobile)   │
└──────┬──────┘
       │
       │ 1. Open attendance module
       ▼
┌─────────────────┐
│  Teacher App    │
└──────┬──────────┘
       │
       │ 2. Select class & date
       ▼
┌─────────────────┐
│  Attendance     │◀────── Academic Service
│    Service      │        (Get class list)
└──────┬──────────┘
       │
       │ 3. Mark attendance
       │    (Present/Absent/Late)
       ▼
┌─────────────────┐
│   Database      │
│  (PostgreSQL)   │
└──────┬──────────┘
       │
       │ 4. Check for absences
       ▼
┌─────────────────┐
│  Business       │
│  Rules Engine   │
└──────┬──────────┘
       │
       │ 5. Trigger alert
       │    (if 3+ consecutive days)
       ▼
┌─────────────────┐
│  Notification   │
│    Service      │─────▶ Parent (SMS)
└──────┬──────────┘
       │
       │ 6. Log activity
       ▼
┌─────────────────┐
│   Audit         │
│   Service       │
└─────────────────┘
```

---

## 6. Integration Architecture - Government Services

```
┌──────────────────────────────────────────────────────────────┐
│                 School Management System                      │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        │
┌───────────────────────▼──────────────────────────────────────┐
│            Government Integration Service                     │
│                  (Middleware/Adapter)                         │
└───────┬────────┬────────┬────────┬───────────────────────────┘
        │        │        │        │
        │        │        │        │
┌───────▼──┐ ┌──▼────┐ ┌─▼─────┐ ┌▼──────────┐
│  EMIS    │ │ UNEB  │ │ MoES  │ │   NSSF    │
│  Portal  │ │ API   │ │ Portal│ │   Portal  │
└──────────┘ └───────┘ └───────┘ └───────────┘

Data Flow:

1. EMIS (Education Management Information System)
   ─────────────────────────────────────────────
   School → EMIS Integration → CSV/XML Export → EMIS Portal
   
   Data Sent:
   • Student enrollment (by class, gender)
   • Teacher data (qualified/unqualified)
   • Infrastructure (classrooms, toilets, water)
   • Performance data (UNEB results)
   
   Frequency: Termly (3 times per year)

2. UNEB (Uganda National Examinations Board)
   ───────────────────────────────────────────
   School → UNEB Integration → API Call → UNEB System
   
   Data Sent:
   • Candidate registration (PLE/UCE/UACE)
   • Center details
   • Subject entries
   
   Data Received:
   • Registration confirmation
   • Examination results
   
   Frequency: Annually (before exams)

3. MoES (Ministry of Education & Sports)
   ───────────────────────────────────────
   School → MoES Integration → Report Generation → MoES Portal
   
   Data Sent:
   • Annual School Census
   • Inspection compliance reports
   • Capitation grant utilization
   
   Frequency: Annually

4. NSSF (National Social Security Fund)
   ───────────────────────────────────────
   School → NSSF Integration → Bulk Upload → NSSF Portal
   
   Data Sent:
   • Employee contributions (5%)
   • Employer contributions (10%)
   
   Frequency: Monthly
```

---

## 7. Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        SECURITY LAYERS                           │
└─────────────────────────────────────────────────────────────────┘

Layer 1: Network Security
─────────────────────────
┌──────────────────────────────────────────────────────────┐
│  • Firewall (AWS Security Groups / Azure NSG)            │
│  • DDoS Protection (Cloudflare / AWS Shield)             │
│  • VPN for admin access                                  │
│  • IP Whitelisting                                       │
└──────────────────────────────────────────────────────────┘
                        │
                        ▼
Layer 2: Application Security
──────────────────────────────
┌──────────────────────────────────────────────────────────┐
│  • SSL/TLS Encryption (HTTPS)                            │
│  • API Gateway with rate limiting                        │
│  • OAuth2 / JWT Authentication                           │
│  • Role-Based Access Control (RBAC)                      │
│  • Multi-Factor Authentication (MFA)                     │
└──────────────────────────────────────────────────────────┘
                        │
                        ▼
Layer 3: Data Security
──────────────────────
┌──────────────────────────────────────────────────────────┐
│  • Data Encryption at Rest (AES-256)                     │
│  • Data Encryption in Transit (TLS 1.3)                  │
│  • Database Access Control                               │
│  • Backup Encryption                                     │
│  • PII (Personally Identifiable Information) masking     │
└──────────────────────────────────────────────────────────┘
                        │
                        ▼
Layer 4: Monitoring & Audit
───────────────────────────
┌──────────────────────────────────────────────────────────┐
│  • Activity Logging (All user actions)                   │
│  • Audit Trails (Compliance requirements)                │
│  • Intrusion Detection System (IDS)                      │
│  • Security Information & Event Management (SIEM)        │
│  • Regular security audits & penetration testing         │
└──────────────────────────────────────────────────────────┘
```

---

## 8. Deployment Architecture (Cloud)

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCTION ENVIRONMENT                        │
│                     (AWS / Azure / GCP)                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Load Balancer (Application Load Balancer)               │
│  • SSL Termination                                       │
│  • Health Checks                                         │
│  • Auto-scaling triggers                                 │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼────────┐        ┌───────▼────────┐
│  Web Server    │        │  Web Server    │
│  (EC2/VM)      │        │  (EC2/VM)      │
│  Region: East  │        │  Region: West  │
└────────┬───────┘        └────────┬───────┘
         │                         │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │                         │
┌────────▼────────┐       ┌────────▼────────┐
│  Kubernetes     │       │  Docker Swarm   │
│  Cluster        │       │  Cluster        │
│  (Services)     │       │  (Services)     │
└────────┬────────┘       └────────┬────────┘
         │                         │
         └────────────┬────────────┘
                      │
┌─────────────────────▼──────────────────────┐
│            DATA LAYER                       │
├─────────────────────────────────────────────┤
│  • PostgreSQL (RDS) - Multi-AZ              │
│  • MongoDB (DocumentDB) - Replica Set       │
│  • Redis (ElastiCache) - Cluster Mode       │
│  • S3 (File Storage) - Multiple Regions     │
│  • Elasticsearch (AWS OpenSearch)           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│         MONITORING & LOGGING                 │
├─────────────────────────────────────────────┤
│  • CloudWatch / Azure Monitor               │
│  • Prometheus + Grafana                     │
│  • ELK Stack (Logging)                      │
│  • Sentry (Error Tracking)                  │
└─────────────────────────────────────────────┘
```

---

## 9. Database Schema Relationships (Core Entities)

```
┌─────────────────┐
│    School       │
│ ─────────────── │
│  id (PK)        │
│  name           │
│  code           │
│  type           │
│  address        │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐      ┌─────────────────┐
│  Department     │      │   AcademicYear  │
│ ─────────────── │      │ ─────────────── │
│  id (PK)        │      │  id (PK)        │
│  school_id (FK) │      │  year           │
│  name           │      │  start_date     │
│  code           │      │  end_date       │
└────────┬────────┘      └────────┬────────┘
         │                        │
         │ 1:N                    │ 1:N
         │                        │
┌────────▼────────┐      ┌────────▼────────┐
│     Batch       │      │      Term       │
│ ─────────────── │      │ ─────────────── │
│  id (PK)        │      │  id (PK)        │
│  dept_id (FK)   │      │  year_id (FK)   │
│  year_id (FK)   │      │  term_number    │
│  number         │      │  start_date     │
└────────┬────────┘      │  end_date       │
         │               └─────────────────┘
         │ 1:N
         │
┌────────▼────────┐      ┌─────────────────┐
│    Student      │◀─────│  AdmissionData  │
│ ─────────────── │ 1:1  │ ─────────────── │
│  id (PK)        │      │  id (PK)        │
│  admission_id   │      │  name           │
│  batch_id (FK)  │      │  dob            │
│  roll_number    │      │  email          │
│  reg_number     │      │  phone          │
└────────┬────────┘      └─────────────────┘
         │
         │ 1:N
         │
┌────────▼────────┐      ┌─────────────────┐
│   Attendance    │      │     Result      │
│ ─────────────── │      │ ─────────────── │
│  id (PK)        │      │  id (PK)        │
│  student_id(FK) │      │  student_id(FK) │
│  date           │      │  subject_id(FK) │
│  status         │      │  exam_id (FK)   │
│  marked_by(FK)  │      │  marks          │
└─────────────────┘      └─────────────────┘
```

---

## 10. Mobile Money Integration Flow (MTN & Airtel)

```
┌─────────────────────────────────────────────────────────────────┐
│              MTN Mobile Money API Integration                    │
└─────────────────────────────────────────────────────────────────┘

Step 1: Request to Pay
──────────────────────
School System                          MTN MoMo API
     │                                      │
     │  POST /collection/v1_0/requesttopay  │
     │  {                                   │
     │    "amount": "50000",                │
     │    "currency": "UGX",                │
     │    "phone": "256700000000",          │
     │    "payerMessage": "School Fees",    │
     │    "payeeNote": "Term 1 2025"        │
     │  }                                   │
     ├─────────────────────────────────────▶│
     │                                      │
     │  Response: 202 Accepted              │
     │  X-Reference-Id: {uuid}              │
     │◀─────────────────────────────────────┤
     │                                      │

Step 2: Check Transaction Status
─────────────────────────────────
     │                                      │
     │  GET /collection/v1_0/requesttopay/  │
     │      {referenceId}                   │
     ├─────────────────────────────────────▶│
     │                                      │
     │  Response: 200 OK                    │
     │  {                                   │
     │    "status": "SUCCESSFUL",           │
     │    "financialTransactionId": "123",  │
     │    "amount": "50000"                 │
     │  }                                   │
     │◀─────────────────────────────────────┤
     │                                      │

Step 3: Update Payment Record
──────────────────────────────
     │
     ├───▶ Update Database
     │     Mark payment as successful
     │     Generate receipt
     │     Send SMS notification
     │
```

```
┌─────────────────────────────────────────────────────────────────┐
│              Airtel Money API Integration                        │
└─────────────────────────────────────────────────────────────────┘

Step 1: Initiate Payment
─────────────────────────
School System                          Airtel Money API
     │                                      │
     │  POST /merchant/v1/payments/         │
     │  {                                   │
     │    "reference": "INV-12345",         │
     │    "subscriber": {                   │
     │      "country": "UG",                │
     │      "currency": "UGX",              │
     │      "msisdn": "256750000000"        │
     │    },                                │
     │    "transaction": {                  │
     │      "amount": 50000,                │
     │      "id": "TXN-12345"               │
     │    }                                 │
     │  }                                   │
     ├─────────────────────────────────────▶│
     │                                      │
     │  Response: 200 OK                    │
     │  {                                   │
     │    "status": {                       │
     │      "code": "200",                  │
     │      "message": "SUCCESS",           │
     │      "result_code": "ESB000010",     │
     │      "success": true                 │
     │    },                                │
     │    "data": {                         │
     │      "transaction": {                │
     │        "id": "TXN-12345",            │
     │        "status": "PENDING"           │
     │      }                               │
     │    }                                 │
     │  }                                   │
     │◀─────────────────────────────────────┤
     │                                      │

Step 2: Callback/Webhook (Asynchronous)
────────────────────────────────────────
                                    │
     Airtel Money API               │  School System (Webhook)
                                    │
     POST /webhook/airtel-callback  │
     {                              │
       "transaction": {             │
         "id": "TXN-12345",         │
         "status": "SUCCESS",       │
         "message": "Successful"    │
       }                            │
     }                              │
     ──────────────────────────────▶│
                                    │
                           Update Payment Status
                           Generate Receipt
                           Send Notification
```

---

## 11. Offline-First Mobile App Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Mobile App (Teacher)                          │
│                     Offline-First Design                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                    UI Layer (React Native)                │
└────────────────────────┬─────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────┐
│                  State Management (Redux)                 │
└────────────────────────┬─────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────┐
│               Offline Storage (SQLite)                    │
│  • Student lists                                          │
│  • Attendance records (pending sync)                      │
│  • Results (pending sync)                                 │
│  • Cached data (last sync)                                │
└────────────────────────┬─────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────┐
│             Sync Manager (Background Service)             │
│  • Detects network availability                           │
│  • Queues local changes                                   │
│  • Syncs with backend when online                         │
│  • Conflict resolution                                    │
└────────────────────────┬─────────────────────────────────┘
                         │
                         │ (When Online)
                         │
┌────────────────────────▼─────────────────────────────────┐
│                   API Gateway                             │
└───────────────────────────────────────────────────────────┘

Workflow:

1. OFFLINE MODE:
   ─────────────
   Teacher marks attendance → Saves to SQLite
   → Marks as "pending sync" → Shows offline indicator

2. ONLINE MODE (Sync):
   ───────────────────
   Network detected → Sync Manager activates
   → Uploads pending attendance → Receives confirmation
   → Updates local database → Downloads latest data
   → Marks as "synced" → Shows success notification

3. CONFLICT RESOLUTION:
   ────────────────────
   Local: Student A - Present (marked at 10:00 AM)
   Server: Student A - Absent (marked at 9:00 AM)
   
   Resolution Strategy:
   • Latest timestamp wins
   • OR Manual conflict resolution
   • OR Teacher override option
```

---

## 12. USSD Menu Structure (Feature Phones)

```
┌─────────────────────────────────────────────────────────────────┐
│              USSD Application Flow (*123*456#)                   │
└─────────────────────────────────────────────────────────────────┘

Main Menu:
──────────
*123*456#
│
└─▶ Welcome to [School Name]
    1. Check Fees Balance
    2. Student Attendance
    3. Latest Results
    4. School Notices
    5. Contact School

─────────────────────────────────────────────────────────────

Option 1: Check Fees Balance
─────────────────────────────
Enter Student ID: [____]
│
└─▶ Student: John Doe (P5-Blue)
    Term 3, 2025
    ────────────────────
    Total Fees:    500,000 UGX
    Paid:          300,000 UGX
    Balance:       200,000 UGX
    ────────────────────
    1. Pay Now (Mobile Money)
    2. Payment History
    0. Back

    ↓ (Select 1: Pay Now)
    
    Enter Amount: [____]
    │
    └─▶ You will receive MTN MoMo
        prompt to pay 200,000 UGX
        to [School Name]
        
        Complete payment on your phone.

─────────────────────────────────────────────────────────────

Option 2: Student Attendance
─────────────────────────────
Enter Student ID: [____]
│
└─▶ Student: Jane Doe (S2-Red)
    Attendance This Week:
    ────────────────────
    Mon: Present
    Tue: Present
    Wed: Absent
    Thu: Present
    Fri: (Today)
    ────────────────────
    This Term: 92%
    
    1. View Full Report
    0. Back

─────────────────────────────────────────────────────────────

Option 3: Latest Results
────────────────────────
Enter Student ID: [____]
│
└─▶ Student: Peter Ssali (S4)
    Mock Exams - Term 2, 2025
    ────────────────────
    English:   75/100 (C)
    Math:      82/100 (D)
    Science:   68/100 (C)
    SST:       70/100 (C)
    ────────────────────
    Aggregate: 18 points
    Division: II
    
    1. Full Report (SMS)
    0. Back

─────────────────────────────────────────────────────────────

Option 4: School Notices
────────────────────────
1. [Latest] Parents Meeting - 15th Jan
2. Mid-term Break - 20-25 Jan
3. School Fees Reminder
0. Back

    ↓ (Select 1)
    
    PARENTS MEETING
    Date: 15th Jan 2025
    Time: 2:00 PM
    Venue: School Hall
    
    All parents invited.
    Discuss term 2 performance.
    
    0. Back

─────────────────────────────────────────────────────────────

Option 5: Contact School
────────────────────────
[School Name]
───────────────────
Phone: 0414-123456
Head: 0700-111222
Email: info@school.ug
Address: P.O. Box 123
         Kampala, Uganda
───────────────────
0. Back
```

---

## 13. Disaster Recovery & Business Continuity

```
┌─────────────────────────────────────────────────────────────────┐
│           Disaster Recovery Plan (RPO/RTO Targets)               │
└─────────────────────────────────────────────────────────────────┘

RPO (Recovery Point Objective): 1 hour
RTO (Recovery Time Objective): 4 hours

┌──────────────────────────────────────────────────────────┐
│                  Backup Strategy                          │
├──────────────────────────────────────────────────────────┤
│  Level 1: Real-time Replication                          │
│  • Database: Multi-AZ deployment (AWS RDS)               │
│  • Automatic failover (< 2 minutes)                      │
│  • Read replicas in different regions                    │
├──────────────────────────────────────────────────────────┤
│  Level 2: Incremental Backups                            │
│  • Frequency: Every 6 hours                              │
│  • Retention: 7 days                                     │
│  • Storage: S3 with versioning                           │
├──────────────────────────────────────────────────────────┤
│  Level 3: Full Backups                                   │
│  • Frequency: Daily (midnight)                           │
│  • Retention: 30 days                                    │
│  • Storage: S3 Glacier (cold storage)                    │
├──────────────────────────────────────────────────────────┤
│  Level 4: Archival                                       │
│  • Frequency: Monthly                                    │
│  • Retention: 7 years (compliance)                       │
│  • Storage: S3 Deep Archive                              │
└──────────────────────────────────────────────────────────┘

Disaster Scenarios & Recovery Procedures:
─────────────────────────────────────────

1. Database Failure:
   • Auto-failover to standby replica
   • Estimated downtime: < 5 minutes
   • Data loss: Zero (synchronous replication)

2. Application Server Failure:
   • Load balancer redirects traffic
   • Auto-scaling launches new instances
   • Estimated downtime: < 2 minutes

3. Region-wide Outage:
   • DNS failover to secondary region
   • Activate disaster recovery site
   • Estimated downtime: 2-4 hours
   • Data loss: < 1 hour (last backup)

4. Ransomware Attack:
   • Isolate affected systems
   • Restore from clean backups
   • Estimated downtime: 4-8 hours
   • Data loss: < 6 hours

5. Data Corruption:
   • Point-in-time recovery
   • Restore specific tables/data
   • Estimated downtime: 1-2 hours
   • Data loss: Minimal (incremental backups)
```

---

## 14. Performance Optimization Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│              Performance Optimization Techniques                 │
└─────────────────────────────────────────────────────────────────┘

1. Caching Strategy:
   ─────────────────
   ┌──────────────────────────────────────────────────────┐
   │  Layer 1: Browser Cache (Static assets)              │
   │  • JS/CSS files: 1 year                              │
   │  • Images: 6 months                                  │
   │  • HTML: No cache                                    │
   └──────────────────────────────────────────────────────┘
                       │
   ┌──────────────────▼───────────────────────────────────┐
   │  Layer 2: CDN Cache (CloudFront/CloudFlare)          │
   │  • Static content distribution                       │
   │  • Edge locations (global)                           │
   │  • TTL: 24 hours                                     │
   └──────────────────────────────────────────────────────┘
                       │
   ┌──────────────────▼───────────────────────────────────┐
   │  Layer 3: Application Cache (Redis)                  │
   │  • Session data: 30 minutes                          │
   │  • API responses: 5 minutes                          │
   │  • Student lists: 1 hour                             │
   │  • Fee structures: 24 hours                          │
   └──────────────────────────────────────────────────────┘
                       │
   ┌──────────────────▼───────────────────────────────────┐
   │  Layer 4: Database Query Cache                       │
   │  • Frequently accessed data                          │
   │  • Complex queries                                   │
   │  • TTL: Variable (1-60 minutes)                      │
   └──────────────────────────────────────────────────────┘

2. Database Optimization:
   ──────────────────────
   • Indexing strategy (B-tree indexes on foreign keys)
   • Query optimization (EXPLAIN ANALYZE)
   • Connection pooling (PgBouncer)
   • Read replicas for reporting queries
   • Partitioning large tables (by academic year)
   • Materialized views for complex reports

3. API Optimization:
   ─────────────────
   • Pagination (max 50 records per page)
   • Field filtering (only requested fields)
   • Compression (gzip/brotli)
   • HTTP/2 support
   • GraphQL for flexible queries
   • Rate limiting (per user/IP)

4. Frontend Optimization:
   ──────────────────────
   • Code splitting (lazy loading)
   • Image optimization (WebP format)
   • Minification (JS/CSS)
   • Tree shaking (remove unused code)
   • Service Workers (offline support)
   • Critical CSS inline

5. Mobile App Optimization:
   ────────────────────────
   • Lightweight UI components
   • Efficient rendering (VirtualizedList)
   • Image caching
   • Data prefetching
   • Background sync
   • APK size optimization (< 20MB)

Performance Targets:
───────────────────
• Page Load Time: < 3 seconds (3G network)
• API Response Time: < 200ms (p95)
• Mobile App Launch: < 2 seconds
• Database Query Time: < 50ms (p95)
• Concurrent Users: 10,000+
• Throughput: 1000 requests/second
```

---

## 15. Cost Estimation (AWS Infrastructure)

```
┌─────────────────────────────────────────────────────────────────┐
│         Monthly Cost Estimation (Medium-Sized School)            │
│                    (500-1000 students)                           │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  COMPUTE RESOURCES                                        │
├──────────────────────────────────────────────────────────┤
│  • EC2 Instances (2x t3.medium)           $60            │
│  • ECS/EKS (Container orchestration)      $75            │
│  • Lambda (Serverless functions)          $20            │
├──────────────────────────────────────────────────────────┤
│  SUBTOTAL:                                $155            │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  DATABASE & STORAGE                                       │
├──────────────────────────────────────────────────────────┤
│  • RDS PostgreSQL (db.t3.medium)          $90            │
│  • DocumentDB (MongoDB)                   $60            │
│  • ElastiCache Redis (cache.t3.micro)    $15            │
│  • S3 Storage (100GB)                     $2             │
│  • S3 Glacier (backups - 500GB)           $2             │
│  • Database backups                       $10            │
├──────────────────────────────────────────────────────────┤
│  SUBTOTAL:                                $179            │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  NETWORKING & CONTENT DELIVERY                            │
├──────────────────────────────────────────────────────────┤
│  • Application Load Balancer              $20            │
│  • CloudFront CDN (50GB transfer)         $10            │
│  • Data Transfer Out (100GB)              $9             │
│  • Route 53 (DNS)                         $1             │
├──────────────────────────────────────────────────────────┤
│  SUBTOTAL:                                $40             │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  MONITORING & SECURITY                                    │
├──────────────────────────────────────────────────────────┤
│  • CloudWatch (Monitoring)                $15            │
│  • AWS WAF (Web Application Firewall)     $10            │
│  • Secrets Manager                        $5             │
│  • Certificate Manager (SSL)              $0 (free)      │
├──────────────────────────────────────────────────────────┤
│  SUBTOTAL:                                $30             │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  THIRD-PARTY SERVICES                                     │
├──────────────────────────────────────────────────────────┤
│  • SMS Gateway (5,000 SMS/month)          $50            │
│  • Mobile Money API fees                  $30            │
│  • Email Service (SES - 10,000 emails)    $1             │
│  • WhatsApp Business API                  $40            │
├──────────────────────────────────────────────────────────┤
│  SUBTOTAL:                                $121            │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  TOTAL MONTHLY COST:                      $525 (~2M UGX) │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  ANNUAL COST:                             $6,300 (24M UGX)│
└──────────────────────────────────────────────────────────┘

Cost Scaling:
─────────────
• Small School (< 300 students):    $300/month (~1.2M UGX)
• Medium School (500-1000 students): $525/month (~2M UGX)
• Large School (1000-2000 students): $900/month (~3.5M UGX)
• Very Large (2000+ students):       $1500/month (~6M UGX)

Note: Costs can be reduced by 40-60% with:
- Reserved Instances (1-year commitment)
- Spot Instances for non-critical workloads
- Local hosting (on-premise servers)
- Serverless architecture (pay-per-use)
```

---

**Document Version**: 1.0  
**Last Updated**: December 11, 2025  
**Next Review**: March 11, 2026
