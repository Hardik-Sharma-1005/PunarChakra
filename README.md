# PunarChakra ♻️

**PunarChakra** is a role-based marketplace for coordinating the recovery and reuse of construction and demolition (C&D) waste.

The platform connects **waste generators, collectors, and processors** through a structured recovery workflow, while an **admin** role controls account approval. The current MVP is focused on the **Ghaziabad–Noida** region and is designed as a hackathon-ready demonstration of a circular recovery network.

> **Core idea:** turn construction waste from a disposal problem into a recoverable resource.

## What problem are we solving?

Construction and demolition activity produces large quantities of material that can still have value after use. In practice, recovery is difficult because:

- Generators may not know who can collect or process a particular material.
- Collectors need a clear way to discover and accept suitable recovery opportunities.
- Processors need visibility into incoming material and control over what they reserve.
- Recovery progress is difficult to track across multiple participants.
- Unstructured coordination can lead to usable material being dumped, burned, or lost.

PunarChakra provides a shared workflow for moving material from **generation → collection → processing → recovery completion**.

## How PunarChakra works

### 1. Generator lists material
A generator creates a waste listing with details such as:

- Material category
- Condition
- Quantity and unit
- Pickup location
- Address and city/state
- Optional coordinates
- Readiness information
- Description

### 2. Collector discovers and accepts recovery jobs
Collectors can set up their profile and discover suitable listings through matching based on the available recovery information.

The collector lifecycle is:

`Assigned → Pickup in Progress → Collected → In Transit`

### 3. Processor takes over the recovery
Processors can create their processing profile and discover compatible recoveries based on factors such as:

- Accepted material
- Quantity requirements
- Processing capacity
- Facility location / city

A processor can reserve an eligible recovery using the existing transaction model.

> **Important:** processor reservation is represented through `processor_id`; `reserved` is **not** a transaction status.

### 4. Recovery is completed
After processor takeover, the recovery progresses through:

`Collected → In Transit → Received → Completed`

Once completed:

- The recovery leaves active recovery views.
- The generator can see that recovery has been completed.
- Payment remains explicitly marked as **Pending** in the current MVP; PunarChakra does not implement real payment processing.

### 5. Admin approves accounts
New role registrations can be reviewed through the admin approval workflow before approved users access their role-specific dashboard.

---

## Current MVP capabilities

### Authentication & roles
- Supabase authentication
- Role-based registration
- Approved-role checks
- Generator, Collector, Processor and Admin roles
- Admin account approval workflow

### Generator
- Create C&D waste listings
- Track listing history
- View recovery status
- View transaction information
- See recovery completion

### Collector
- Collector profile setup
- Recovery discovery
- Matching and suitability tiers
- Accept recovery jobs
- Track active recovery lifecycle

### Processor
- Processor profile setup
- Processor discovery and matching
- Reserve eligible recoveries
- Track active recoveries
- Advance recoveries through receipt and completion

### Recovery lifecycle
The current transaction model uses:

`assigned` → `pickup_in_progress` → `collected` → `in_transit` → `received` → `completed`

with `cancelled` available as a terminal status.

Processor reservation is handled separately through the processor assignment field and is not represented as a status.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 |
| Language | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS 4 |
| Authentication | Supabase Auth |
| Database | Supabase / PostgreSQL |
| Server integration | Supabase SSR |
| Deployment target | Vercel |

---

## Project structure

```text
PunarChakra/
├── app/
│   ├── dashboard/       # Role-based dashboard and workflow UI
│   ├── login/           # Authentication
│   ├── pending/         # Pending approval flow
│   ├── register/        # Role-based registration
│   └── page.tsx         # Application landing page
├── lib/
│   ├── auth/            # Authentication and role/approval helpers
│   ├── collector/       # Collector discovery, matching and transactions
│   ├── listings/        # Generator waste-listing actions
│   ├── processor/       # Processor discovery, matching and transactions
│   └── supabase/        # Supabase client/server configuration
├── types/
│   └── domain.ts        # Shared domain types
├── public/              # Static assets
└── package.json
```

## Getting started

### Prerequisites

- Node.js
- npm
- A configured Supabase project with the application's required database/auth configuration

### 1. Clone the repository

```bash
git clone https://github.com/Hardik-Sharma-1005/PunarChakra.git
cd PunarChakra
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Do **not** commit `.env.local` or expose private/server-only Supabase credentials.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Useful commands

Run the linter:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Run the production server after building:

```bash
npm start
```

---

## Demo workflow

For a hackathon demonstration, the platform can be presented as a complete recovery journey:

```text
Generator
   │
   ├── Creates waste listing
   ▼
Collector
   │
   ├── Discovers matching recovery
   ├── Accepts job
   ├── Pickup in progress
   ├── Collected
   └── In transit
   ▼
Processor
   │
   ├── Discovers compatible recovery
   ├── Reserves recovery
   ├── Receives material
   └── Completes recovery
   ▼
Generator
   │
   └── Sees "Recovery completed"
```

Admin approval sits alongside this workflow to control access to approved platform roles.

---

## Product scope

The current MVP focuses on demonstrating the **coordination layer** of C&D waste recovery rather than attempting to solve every part of the physical recycling ecosystem.

The platform does **not** currently implement real payment processing. Features shown as part of the broader product vision or landing-page messaging should not be interpreted as guarantees that every such capability is implemented in the current MVP.

---

## Deployment

PunarChakra is designed to be deployed on **Vercel** with the required Supabase environment variables configured in the deployment environment.

For production deployments, keep all Supabase credentials and other secrets in the platform's environment-variable settings rather than committing them to the repository.

---

## Project status

PunarChakra is an active hackathon MVP.

The repository currently contains the core role-based recovery workflow for:

**Generator → Collector → Processor → Recovery Completed**

with admin-controlled account approval and Supabase-backed authentication/data access.

