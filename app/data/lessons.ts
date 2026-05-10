export type Lesson = {
  id: string
  content: string
}

export const lessons: Record<string, string> = {
  'cloud-concepts': `
# Cloud Concepts

## What is Cloud Computing?

Cloud computing delivers computing services — servers, storage, databases, networking, software — over the internet ("the cloud") on a **pay-as-you-go** basis. You rent capacity instead of owning hardware.

**Real-world analogy:** Electricity. You don't build a power plant to get electricity — you plug in and pay for what you use. Cloud is the same for compute.

---

## Cloud Models

| Model | Who owns infra | Who uses it | Example |
|-------|---------------|-------------|---------|
| **Public** | Cloud provider (Microsoft) | Anyone | Azure, AWS, GCP |
| **Private** | Your org | Your org only | On-prem datacenter |
| **Hybrid** | Both | Your org | On-prem + Azure via VPN |
| **Multi-cloud** | Multiple providers | Your org | Azure + AWS together |

> **Exam tip:** Hybrid = on-prem + cloud connected. Multi-cloud = multiple cloud providers.

---

## Service Models (IaaS / PaaS / SaaS)

Think of it as a pizza analogy — how much do you want to manage yourself?

| | IaaS | PaaS | SaaS |
|-|------|------|------|
| **You manage** | OS, middleware, runtime, app, data | App and data only | Nothing (just use it) |
| **Provider manages** | Physical, network, virtualization | Everything + OS + runtime | Everything |
| **Azure example** | Virtual Machines | App Service, Azure SQL | Microsoft 365, Teams |
| **Analogy** | Rent a kitchen | Rent a restaurant | Order delivery |

---

## Shared Responsibility Model

Who is responsible for what depends on the service model:

| Responsibility | On-prem | IaaS | PaaS | SaaS |
|---------------|---------|------|------|------|
| Physical datacenter | ✅ You | ☁️ Azure | ☁️ Azure | ☁️ Azure |
| Networking | ✅ You | ☁️ Azure | ☁️ Azure | ☁️ Azure |
| Operating system | ✅ You | ✅ You | ☁️ Azure | ☁️ Azure |
| Application | ✅ You | ✅ You | ✅ You | ☁️ Azure |
| Data | ✅ You | ✅ You | ✅ You | ✅ You |
| Identity | ✅ You | ✅ You | ✅ You | ✅ You |

> **Key insight:** You are ALWAYS responsible for your data and identity, regardless of model.

---

## Key Cloud Benefits

| Benefit | What it means |
|---------|--------------|
| **High Availability** | System stays up despite failures — guaranteed by SLAs |
| **Scalability** | Grow capacity: scale up (bigger VM) or scale out (more VMs) |
| **Elasticity** | Auto-scale up AND down based on demand |
| **Reliability** | Distributed design — no single point of failure |
| **Agility** | Deploy new resources in minutes, not months |
| **Geo-distribution** | Deploy close to your users worldwide |
| **Disaster Recovery** | Replicate to another region, recover fast |

---

## CapEx vs OpEx

| | CapEx (Capital Expenditure) | OpEx (Operational Expenditure) |
|-|----------------------------|-------------------------------|
| **What** | Upfront purchase of physical hardware | Pay-as-you-go, ongoing costs |
| **Example** | Buy servers, build datacenter | Monthly Azure bill |
| **Cloud model** | On-premises | Public cloud |
| **Risk** | High — over/under-buy | Low — scale as needed |
| **Tax** | Depreciated over time | Deducted in same year |

> **Cloud = OpEx.** This is one of the biggest benefits — no upfront hardware investment.

---

## Consumption-Based Model

You only pay for what you use:
- No upfront cost for resources
- No wasted capacity
- Scale down when demand drops
- Predictable pricing per unit

---

## HA vs Fault Tolerance vs DR

| Concept | Definition | Example |
|---------|-----------|---------|
| **High Availability** | Minimize downtime through redundancy | 2 VMs behind load balancer |
| **Fault Tolerance** | Continue operating THROUGH failures, zero downtime | Active-active with auto-failover |
| **Disaster Recovery** | Recover after a major failure event | Cross-region backup and restore |

> **Exam tip:** HA = minimize downtime. FT = zero downtime. DR = recover after catastrophe.
`,

  'azure-infrastructure': `
# Azure Global Infrastructure

## Why Geography Matters

Azure has 60+ regions worldwide. Choosing the right region affects:
- **Latency** — deploy close to your users
- **Data residency** — data stays in region by default (important for GDPR, HIPAA)
- **Service availability** — not all services in all regions
- **Pricing** — prices vary by region

---

## The Hierarchy

\`\`\`
Geographies (e.g., "United States", "Europe")
  └── Regions (e.g., "East US", "West Europe")
        └── Region Pairs (always paired with another region)
        └── Availability Zones (1, 2, 3 — physical datacenters)
              └── Datacenters (multiple per AZ)
\`\`\`

---

## Regions

A **region** is a geographic area containing one or more datacenters connected with a low-latency network.

- You choose a region when deploying most resources
- Resources in same region communicate with low latency
- Example regions: East US, UK South, Southeast Asia, Australia East

---

## Region Pairs

Every Azure region is paired with another region in the **same geography**, at least 300 miles apart.

| Pair | Region 1 | Region 2 |
|------|----------|----------|
| US | East US | West US |
| UK | UK South | UK West |
| Europe | North Europe | West Europe |
| Australia | Australia East | Australia Southeast |

**Why pairs matter:**
- Azure replicates data to the pair region for GRS storage
- During outage, Azure prioritizes restoring ONE region in each pair
- Azure rolls out updates sequentially — not both at once
- Used for geo-redundant services and DR

---

## Availability Zones (AZ)

A **physically separate datacenter** within a region with independent:
- Power supply
- Cooling
- Networking

Each AZ-enabled region has **at least 3 zones**.

\`\`\`
Region: East US
  ├── Zone 1  (Datacenter A — own power, cooling, network)
  ├── Zone 2  (Datacenter B — own power, cooling, network)
  └── Zone 3  (Datacenter C — own power, cooling, network)
\`\`\`

**Use AZs for:** Zone-redundant VMs (99.99% SLA), zone-redundant storage, zone-redundant services

> **Exam tip:** Not all regions have AZs. Check before designing HA solutions.

---

## Availability Sets (Legacy — for VMs only)

Logical grouping within a SINGLE datacenter. Protects against rack-level failures.

| Concept | What it is | Max |
|---------|-----------|-----|
| **Fault Domain (FD)** | Separate physical rack + power + switch | 3 FDs |
| **Update Domain (UD)** | VMs rebooted together during maintenance | 20 UDs |

> **AZ vs Availability Set:**
> - AZ = protection across different datacenters (better)
> - Availability Set = protection within one datacenter (older, still tested)

---

## Special Regions

| Region Type | Purpose | Notes |
|-------------|---------|-------|
| **Azure Government** | US government compliance | FedRAMP High, DoD IL2-IL5 |
| **Azure China** | China market | Operated by 21Vianet, separate cloud |
| **Sovereign** | Country-specific compliance | Germany, UAE |

---

## Key Exam Points

1. Region pair = same geography, 300+ miles apart, used for DR
2. Availability Zone = separate physical datacenter within region = 99.99% SLA
3. Availability Set = separate racks within ONE datacenter = 99.95% SLA
4. Data stays in your chosen region unless YOU replicate it elsewhere
5. Not all regions support all services — check before designing
`,

  'core-services': `
# Core Azure Services

## Compute Services

### Azure Virtual Machines (VMs) — IaaS
Full control over OS, software, and configuration. You manage everything above the hardware.
- Use when: you need specific OS versions, custom software, or full control
- Billed when running (deallocate to stop billing)

### Azure App Service — PaaS
Deploy web apps, APIs, and mobile backends without managing servers.
- Supports: .NET, Node.js, Python, Java, PHP, Ruby
- Built-in: auto-scaling, CI/CD, SSL, custom domains
- Use when: you just want to deploy code

### Azure Functions — Serverless
Event-driven, short-running code. Pay per execution (not per hour).
- Triggers: HTTP, timer, queue message, blob upload, etc.
- Use when: intermittent workloads, event processing, microservices

### Azure Container Instances (ACI)
Run containers without managing orchestration. Fastest way to run a container.
- Use when: simple, short-lived containerized tasks

### Azure Kubernetes Service (AKS)
Managed Kubernetes cluster. Azure handles the control plane.
- Use when: production container workloads at scale

### Azure Virtual Desktop
Cloud-hosted Windows desktop. Users access via browser or client.
- Use when: remote work, BYOD, VDI modernization

---

## Storage Services

| Service | Type | Use Case |
|---------|------|----------|
| **Blob Storage** | Object storage (files, images, videos) | Unstructured data, backups, static websites |
| **Azure Files** | Managed SMB/NFS file shares | Lift-and-shift file servers, shared configs |
| **Queue Storage** | Message queue | Decouple app components, async processing |
| **Table Storage** | NoSQL key-value | Structured schemaless data (cheaper than Cosmos) |
| **Azure Disk Storage** | Managed disks | VM OS disks and data disks |

### Blob Access Tiers
| Tier | Use | Min Days | Cost |
|------|-----|----------|------|
| **Hot** | Frequent access | None | Higher storage, lower access |
| **Cool** | Infrequent (1x/month) | 30 days | Lower storage, higher access |
| **Cold** | Rare (1x/quarter) | 90 days | Lower still |
| **Archive** | Almost never | 180 days | Cheapest, offline — must rehydrate first |

---

## Networking Services

| Service | Layer | Purpose |
|---------|-------|---------|
| **Virtual Network (VNet)** | L3 | Private IP space in Azure — isolate resources |
| **VPN Gateway** | L3 | Encrypted tunnel to on-premises |
| **ExpressRoute** | L1/L2 | Private dedicated connection (NOT internet) |
| **Azure Load Balancer** | L4 | Distribute TCP/UDP traffic to VMs |
| **Application Gateway** | L7 | HTTP/HTTPS routing, WAF, SSL termination |
| **Azure Front Door** | L7 global | Global HTTP routing + CDN + WAF |
| **Traffic Manager** | DNS | Route users to nearest/healthiest endpoint |
| **Azure CDN** | Edge | Cache static content close to users |
| **Azure DNS** | DNS | Host DNS zones in Azure |
| **DDoS Protection** | L3/L4 | Protect public endpoints from DDoS |

---

## Database Services

| Service | Type | When to Use |
|---------|------|-------------|
| **Azure SQL Database** | Managed relational (SQL Server) | Cloud-native SQL workloads |
| **Azure SQL Managed Instance** | Near 100% SQL Server compat | Lift-and-shift SQL Server to cloud |
| **Azure Database for MySQL** | Managed MySQL | MySQL workloads |
| **Azure Database for PostgreSQL** | Managed PostgreSQL | PostgreSQL workloads |
| **Azure Cosmos DB** | Globally distributed NoSQL | Multi-region, low-latency, multi-model |
| **Azure Cache for Redis** | In-memory cache | Session state, caching, pub/sub |
| **Azure Synapse Analytics** | Data warehouse + analytics | Big data, enterprise analytics |

---

## Key Decision Framework

> **"Which service should I use for X?"**

- Need full OS control → **VM**
- Deploy web app, no infra management → **App Service**
- Short event-driven code → **Functions**
- Run containers simply → **ACI** (simple) or **AKS** (orchestrated)
- Store files/images/videos → **Blob Storage**
- Need shared file drive → **Azure Files**
- Relational database → **Azure SQL Database**
- Global NoSQL, multi-region → **Cosmos DB**
- On-prem to Azure private connection → **ExpressRoute**
- On-prem to Azure over internet (encrypted) → **VPN Gateway**
`,

  'identity-security': `
# Azure Identity & Security

## Microsoft Entra ID (formerly Azure AD)

**Not** the same as Windows Active Directory (AD DS). Entra ID is a **cloud-based identity provider**.

| Feature | Entra ID (Cloud) | AD DS (On-prem) |
|---------|-----------------|-----------------|
| Protocol | OAuth, OIDC, SAML | Kerberos, NTLM, LDAP |
| Structure | Flat (no OUs) | Hierarchical (OUs, GPOs) |
| Device join | Azure AD Join | Domain Join |
| Use | Cloud apps, SaaS | On-prem apps, traditional IT |

### What Entra ID does:
- **SSO** — one login for all connected apps (Microsoft 365, Salesforce, your apps)
- **MFA** — require second factor (Authenticator app, SMS, hardware key)
- **Conditional Access** — policy-based: "Block if not compliant device", "Require MFA if sign-in from new country"
- **B2B** — invite external partners as guest users
- **B2C** — customer identity for public-facing apps

### Entra ID Tiers
| Tier | Key Features |
|------|-------------|
| **Free** | Basic user/group management, SSO for 10 apps |
| **P1** | Conditional Access, dynamic groups, SSPR, hybrid identity |
| **P2** | Identity Protection (risk-based), Privileged Identity Management (PIM) |

---

## Authentication vs Authorization

| | Authentication (AuthN) | Authorization (AuthZ) |
|-|-----------------------|----------------------|
| **Question** | Who are you? | What can you do? |
| **How** | Username + password + MFA | RBAC roles + permissions |
| **Azure tool** | Entra ID | RBAC, Azure Policy |

---

## RBAC (Role-Based Access Control)

Assign **roles** to **security principals** at a **scope**.

\`\`\`
Security Principal: User / Group / Service Principal / Managed Identity
        ↓
Role: Owner / Contributor / Reader / (custom)
        ↓
Scope: Management Group → Subscription → Resource Group → Resource
\`\`\`

**Built-in roles:**
| Role | Can do |
|------|--------|
| **Owner** | Everything + manage access |
| **Contributor** | Create/manage resources, can't manage access |
| **Reader** | View only |
| **User Access Administrator** | Manage access only |

> **Key rule:** RBAC is additive. No explicit deny (use Azure Policy for deny).
> **Principle of least privilege:** Give only the minimum permissions needed.

---

## Zero Trust Model

**Never trust, always verify.** Assume every request could be from an attacker.

Three principles:
1. **Verify explicitly** — always authenticate and authorize based on all available data
2. **Use least privilege** — limit access with just-in-time and just-enough-access
3. **Assume breach** — minimize blast radius, segment access, end-to-end encryption

---

## Defense in Depth

Security in layers — if one layer fails, others still protect:

\`\`\`
Physical security      (Azure datacenter)
     ↓
Identity & access      (MFA, RBAC, Conditional Access)
     ↓
Perimeter              (DDoS Protection, Firewall)
     ↓
Network                (NSGs, VNet segmentation)
     ↓
Compute                (VM patching, antimalware, disk encryption)
     ↓
Application            (Secure code, no hardcoded secrets)
     ↓
Data                   (Encryption at rest + in transit, Key Vault)
\`\`\`

---

## Key Security Services

| Service | Purpose |
|---------|---------|
| **Azure Key Vault** | Store secrets, keys, certificates — never hardcode in app |
| **Microsoft Defender for Cloud** | Security posture score + threat protection + recommendations |
| **Microsoft Sentinel** | Cloud-native SIEM — collect logs, detect threats, respond |
| **Azure Firewall** | Managed stateful firewall for VNet traffic |
| **Azure DDoS Protection** | Layer 3/4 DDoS attack mitigation |
| **NSG** | Network Security Group — inbound/outbound rules for VNet |

---

## Exam Tips

- Entra ID ≠ AD DS — they're different products (AD DS = on-prem, Entra ID = cloud)
- MFA should be enforced via Conditional Access (not legacy per-user MFA)
- Key Vault = where secrets go, NEVER in app config or code
- RBAC = role + scope, inherits downward, additive (no deny)
- Zero Trust = never trust, always verify, least privilege
`,

  'governance': `
# Azure Governance & Compliance

## The Management Hierarchy

Everything in Azure sits within a hierarchy. Policies and RBAC assigned at higher levels **inherit downward**.

\`\`\`
Tenant (your Azure organization)
  └── Management Groups (organize subscriptions)
        └── Subscriptions (billing + access boundary)
              └── Resource Groups (logical container)
                    └── Resources (VMs, storage, etc.)
\`\`\`

**Key rules:**
- A resource lives in exactly ONE resource group
- A resource group can span multiple regions
- Management groups can be nested (up to 6 levels deep)
- Root management group = all subscriptions in tenant

---

## Azure Policy

Enforce rules across your Azure resources. Examples:
- "All VMs must use approved sizes"
- "Storage accounts must require HTTPS"
- "Resources must have a 'CostCenter' tag"
- "VMs must be deployed only in specific regions"

**Policy effects** (in order of strictness):
| Effect | What happens |
|--------|-------------|
| **Deny** | Blocks the resource from being created |
| **Audit** | Allows creation but logs non-compliance |
| **Append** | Adds settings to the resource |
| **DeployIfNotExists** | Deploys a related resource if missing |
| **Modify** | Adds/modifies tags or properties |

**Policy Initiatives:** A package of multiple related policies.
Example: "ISO 27001 Initiative" groups 100+ individual policies.

> **Exam tip:** Azure Policy ≠ RBAC. Policy controls WHAT can be created. RBAC controls WHO can do it.

---

## Resource Locks

Prevent accidental deletion or modification by ANY user, including Owners.

| Lock Type | Read | Modify | Delete |
|-----------|------|--------|--------|
| **ReadOnly** | ✅ | ❌ | ❌ |
| **CanNotDelete** | ✅ | ✅ | ❌ |

Applied at: Resource, Resource Group, or Subscription level.
Inherit downward: lock on resource group protects all resources within.

> **Real scenario:** Apply CanNotDelete to production resource groups to prevent accidents.

---

## Tags

Key-value metadata you attach to resources.

\`\`\`
Environment: Production
CostCenter: Marketing-123
Owner: apoorv@company.com
Project: AzureStudy
\`\`\`

**Uses:** Cost tracking, automation triggers, ownership, environment classification

**Key limits:**
- Max 50 tags per resource
- Tags do NOT inherit by default (use Azure Policy to enforce tagging)
- Resource Groups and Resources have separate tags
- Not all resource types support tags

---

## Azure Advisor

Free, personalized recommendations across 5 categories:

| Category | Example Recommendation |
|----------|----------------------|
| **Reliability** | Enable VM backup, add redundancy |
| **Security** | Enable MFA, patch vulnerabilities |
| **Performance** | Right-size slow VMs, use CDN |
| **Cost** | Shut down idle VMs, use reservations |
| **Operational Excellence** | Apply tags, use ARM templates |

Advisor checks your actual usage and configuration — not generic advice.

---

## Compliance Tools

| Tool | Purpose |
|------|---------|
| **Microsoft Trust Center** | Microsoft's security, privacy, and compliance practices |
| **Service Trust Portal** | Download audit reports, pen test results, compliance docs |
| **Compliance Manager** | Assess your compliance posture against standards |
| **Azure Policy** | Enforce and audit compliance at resource level |
| **Microsoft Purview** | Data governance — discover, classify, protect data |

**Common compliance standards tested:**
- **ISO 27001** — information security management
- **SOC 1/2/3** — service organization controls
- **GDPR** — EU data protection regulation
- **HIPAA** — US healthcare data
- **FedRAMP** — US federal government cloud

---

## Azure Blueprints (being deprecated)

Package of RBAC + policies + ARM templates + resource groups — deploy compliant environments repeatedly.
Being replaced by: Azure Policy + ARM templates / Bicep directly.

---

## Exam Key Points

1. Hierarchy: Management Group > Subscription > Resource Group > Resource
2. Policy = enforce WHAT; RBAC = control WHO
3. Resource Lock blocks even Owners from deleting
4. Tags don't inherit — use Policy to enforce them
5. Advisor = free, 5 categories (Reliability, Security, Performance, Cost, Ops)
6. Compliance Manager = your posture; Service Trust Portal = Microsoft's evidence
`,

  'cost-sla': `
# Azure Cost Management & SLAs

## What Affects Your Azure Bill

| Factor | Impact |
|--------|--------|
| **Resource type** | VM costs more than a storage account |
| **VM size** | 16-core VM costs more than 2-core |
| **Region** | East US is cheaper than UK South |
| **Consumption** | How much compute/storage/bandwidth you use |
| **Outbound bandwidth** | Inbound is free; outbound is charged |
| **Reservations** | Commit to 1-3 years for big discounts |
| **License type** | Azure Hybrid Benefit = use existing licenses |

---

## Pricing Tools

| Tool | Purpose | When to use |
|------|---------|-------------|
| **Azure Pricing Calculator** | Estimate cost BEFORE deploying | Planning new architecture |
| **TCO Calculator** | Compare on-prem vs Azure total cost | Justifying cloud migration to management |
| **Cost Management + Billing** | Monitor and analyze actual spend | After deployment, ongoing optimization |
| **Azure Advisor** | Recommendations to reduce waste | Ongoing cost optimization |

> **Exam trap:** Pricing Calculator ≠ TCO Calculator. Pricing = estimate Azure cost. TCO = compare on-prem vs cloud cost.

---

## Cost Saving Options

| Option | Savings | Commitment | Risk |
|--------|---------|-----------|------|
| **Reserved Instances** | Up to 72% | 1 or 3 years | Pay even if unused |
| **Azure Hybrid Benefit** | Up to 40% | None | Must own licenses (Windows/SQL) |
| **Spot VMs** | Up to 90% | None | Evicted anytime with 30s notice |
| **Dev/Test Pricing** | Varies | None | Non-production only |
| **Right-sizing** | Varies | None | Ongoing monitoring needed |

### Reserved Instances (RIs)
- Pay for 1 or 3 years upfront (or monthly)
- Best for: predictable workloads that run 24/7
- Applies to: VMs, SQL Database, Cosmos DB, App Service, and more
- **All upfront** = max discount; **Monthly** = slightly less discount

### Azure Hybrid Benefit
Use your existing Windows Server or SQL Server licenses in Azure.
- Requires: Software Assurance coverage
- Combine with Reserved Instances for maximum savings

### Spot VMs
Azure sells unused capacity at massive discount. Can be evicted anytime.
- Good for: batch jobs, dev/test, fault-tolerant workloads
- NOT for: production databases, anything requiring consistent uptime

---

## SLAs (Service Level Agreements)

Microsoft's **uptime guarantee** for each service. Expressed as monthly uptime %.

| Uptime % | Max Downtime / Month |
|----------|---------------------|
| 99% | ~7.3 hours |
| 99.9% | ~43.8 minutes |
| 99.95% | ~21.9 minutes |
| 99.99% | ~4.4 minutes |
| 99.999% | ~26 seconds |

If Azure fails to meet the SLA → you get a **service credit** (10–25% of monthly bill).

### VM SLAs — Key Numbers to Memorize
| VM Setup | SLA |
|----------|-----|
| Single VM + Premium SSD | 99.9% |
| Availability Set (2+ VMs) | 99.95% |
| Availability Zones (2+ VMs, 2+ zones) | 99.99% |

### Composite SLA
When your app depends on multiple services, **multiply** their SLAs:

\`\`\`
App Service (99.95%) × Azure SQL (99.99%) = 99.94%
\`\`\`

> The composite SLA is LOWER than any individual SLA. More dependencies = lower overall SLA.

### How to INCREASE SLA
- Use Availability Zones (99.99% SLA)
- Use redundant deployments (2+ instances)
- Design for failover (active-active or active-passive)

---

## Service Lifecycle

| Stage | SLA | Support |
|-------|-----|---------|
| **Preview** (public/private) | None | Community only |
| **GA (Generally Available)** | Full SLA | Full Microsoft support |

> **Exam trap:** Preview services have NO SLA guarantee. Never use preview in production if SLA matters.

---

## Free Services

These are always free in Azure:
- Resource Groups
- Management Groups
- Azure AD (basic tier)
- Inbound data transfer
- Azure Policy (basic)
- Tags

---

## Exam Key Points

1. Pricing Calculator = estimate Azure cost; TCO = compare to on-prem
2. Reserved = 1-3 year commit, up to 72% off
3. Spot = cheapest but evictable, NOT for production
4. Composite SLA = multiply individual SLAs (always lower)
5. Availability Zones = 99.99% SLA (highest for VMs)
6. Preview = no SLA
7. Outbound bandwidth costs; inbound is free
`,

  'azure-ad-admin': `
# Azure AD (Entra ID) Administration — AZ-104

## User Accounts

**Types of users:**
| Type | Who | Created how |
|------|-----|------------|
| **Member users** | Internal employees | Admin creates or syncs from AD |
| **Guest users** | External partners/vendors | Invite via email (B2B) |
| **Service principals** | Applications | App registration or managed identity |
| **Managed identities** | Azure resources | System-assigned or user-assigned |

### CLI Commands
\`\`\`bash
# Create user
az ad user create \\
  --display-name "Apoorv Kumar" \\
  --user-principal-name apoorv@contoso.com \\
  --password "P@ssw0rd123" \\
  --force-change-password-next-sign-in true

# List users
az ad user list --output table

# Delete user
az ad user delete --id apoorv@contoso.com
\`\`\`

---

## Groups

| Group Type | Membership | Use for |
|-----------|-----------|---------|
| **Security group** | Manual or dynamic | RBAC, app access, policy |
| **Microsoft 365 group** | Manual or dynamic | Teams, SharePoint, collaboration |
| **Assigned** | Admin manually adds members | Stable, known membership |
| **Dynamic** | Rules auto-assign members | "All users in department=Sales" |

### Dynamic Group Rule Example
\`\`\`
user.department -eq "Sales"
user.jobTitle -contains "Manager"
user.usageLocation -eq "IN"
\`\`\`

---

## Managed Identities

Let Azure resources authenticate to other services WITHOUT storing credentials.

| Type | Created when | Lifecycle | Use when |
|------|-------------|-----------|---------|
| **System-assigned** | Auto when enabled on resource | Tied to resource, deleted with it | One resource needs access |
| **User-assigned** | Created separately | Independent lifecycle | Multiple resources share same identity |

> **Exam scenario:** A VM needs to read from Azure Key Vault. Use a managed identity on the VM — no passwords needed.

---

## MFA & Conditional Access

**Conditional Access** = IF [condition] THEN [action]

Conditions:
- User/group
- Sign-in risk level (P2 required)
- Device compliance
- Location (IP range, country)
- Application being accessed

Actions:
- Require MFA
- Block access
- Require compliant device
- Require password change

\`\`\`
Example policy:
IF:  User is in "Admins" group
AND: Sign-in from outside corporate network
THEN: Require MFA
\`\`\`

---

## Self-Service Password Reset (SSPR)

Let users reset their own passwords — reduces helpdesk tickets.

**Requirements:**
- Requires Entra ID P1 or P2
- User must register recovery methods first

**Auth methods available:**
- Microsoft Authenticator app
- SMS
- Email
- Security questions (weakest — not recommended alone)
- Office phone

---

## Administrative Units (AUs)

Scope admin permissions to a **subset** of users/groups.

Example:
- HR Admin can manage only HR users (not IT users)
- Regional admin manages only users in their location

Without AUs, a User Admin can manage ALL users in the tenant.

---

## Privileged Identity Management (PIM) — Entra ID P2

Just-in-time privileged access:
- Admins don't have permanent admin roles
- They **activate** the role for a limited time (e.g., 1 hour) when needed
- Requires approval + justification
- All activations are logged

> **Principle of least privilege in action.** PIM = JIT (Just-In-Time) access.

---

## Exam Key Tasks

1. Create users (portal and CLI)
2. Create dynamic group with membership rule
3. Assign RBAC roles at subscription/resource group scope
4. Configure Conditional Access policy requiring MFA
5. Enable SSPR with multiple auth methods
6. Enable system-assigned managed identity on VM
7. Invite guest user via B2B
8. Create Administrative Unit and assign scoped admin
`,

  'storage-admin': `
# Azure Storage Administration — AZ-104

## Storage Account Fundamentals

Every storage account has:
- **Unique name** (globally unique, 3-24 lowercase letters/numbers)
- **Region** — data stays here unless you replicate
- **Redundancy** — how many copies, where
- **Access tier** — hot/cool for blobs

### Storage Account Types

| Type | Services | Best for |
|------|---------|---------|
| **Standard GPv2** | Blob, File, Queue, Table | Default — most workloads |
| **Premium Block Blobs** | Blob only | High-transaction, low-latency blob |
| **Premium File Shares** | File only | High-performance SMB shares |
| **Premium Page Blobs** | Page blobs | VHDs, random I/O |

---

## Redundancy Options

| Option | Copies | Where | Protection against |
|--------|--------|-------|--------------------|
| **LRS** (Locally Redundant) | 3 | Same datacenter | Drive/rack failure |
| **ZRS** (Zone Redundant) | 3 | 3 AZs in one region | Datacenter failure |
| **GRS** (Geo Redundant) | 6 (3+3) | Primary + paired region | Region failure |
| **GZRS** (Geo-Zone Redundant) | 6 (ZRS+LRS) | ZRS primary + paired region | Zone AND region failure |
| **RA-GRS** | 6 + read | GRS + read from secondary | Region failure + read access |

> **Exam tip:** RA = Read Access. RA-GRS lets you READ from the secondary region (normally read-only until failover).

---

## Authorization Methods

| Method | Access level | When to use |
|--------|-------------|-------------|
| **Account Key** | Full account access | Admin operations, not for apps |
| **SAS Token** | Scoped + time-limited | Grant specific access to specific resource |
| **Azure AD / RBAC** | Role-based | Preferred for identity-based access |
| **Anonymous** | Public read | Static websites, public blobs |

### SAS (Shared Access Signature) Types
| Type | Scope | Backed by |
|------|-------|-----------|
| **Account SAS** | Whole account | Account key |
| **Service SAS** | One service (blob/file/queue/table) | Account key |
| **User Delegation SAS** | Blob/Data Lake | Entra ID (preferred — most secure) |

\`\`\`bash
# Generate SAS token via CLI
az storage blob generate-sas \\
  --account-name mystorageaccount \\
  --container-name mycontainer \\
  --name myblob.txt \\
  --permissions r \\
  --expiry 2026-06-01T00:00:00Z
\`\`\`

---

## Lifecycle Management

Automatically move blobs between tiers (or delete) based on age:

\`\`\`json
{
  "rules": [{
    "name": "tiering-rule",
    "type": "Lifecycle",
    "definition": {
      "actions": {
        "baseBlob": {
          "tierToCool": { "daysAfterModificationGreaterThan": 30 },
          "tierToArchive": { "daysAfterModificationGreaterThan": 90 },
          "delete": { "daysAfterModificationGreaterThan": 365 }
        }
      }
    }
  }]
}
\`\`\`

---

## Azure Files

Managed cloud file shares accessible via SMB 2.1/3.x and NFS.

\`\`\`
Mount on Windows:
net use Z: \\\\mystorageaccount.file.core.windows.net\\myshare /u:AZURE\\mystorageaccount <key>

Mount on Linux:
mount -t cifs //mystorageaccount.file.core.windows.net/myshare /mnt/share
\`\`\`

**Azure File Sync:** Sync on-prem Windows Server file shares with Azure Files.
- Cloud tiering: cold files stay in Azure, hot files cached on-prem
- Multisite sync: multiple offices share same file content

---

## Data Transfer Tools

| Tool | Best for |
|------|---------|
| **AzCopy** | CLI bulk copy, resumable, high-performance |
| **Azure Storage Explorer** | GUI for managing storage |
| **Azure Data Factory** | Orchestrated pipelines |
| **Azure Data Box** | Physical device for offline transfer (40TB+) |
| **Data Box Heavy** | 1PB offline transfer |

\`\`\`bash
# AzCopy example — upload entire folder
azcopy copy "C:\\localfolder" "https://account.blob.core.windows.net/container?SAS" --recursive
\`\`\`

---

## Exam Key Tasks

1. Create storage account with specific redundancy type
2. Configure lifecycle management policy (portal + JSON)
3. Generate SAS token with specific permissions and expiry
4. Set up Azure AD auth for blob storage (assign Storage Blob Data Contributor)
5. Create Azure file share and mount to VM
6. Configure Azure File Sync
7. Use AzCopy to migrate data
8. Rehydrate archived blob (priority: Standard=hours, High=<1 hour)
`,

  'compute-admin': `
# Azure Compute Administration — AZ-104

## Virtual Machines Deep Dive

### VM Creation Checklist
1. **Image** — OS + optional pre-installed software
2. **Size** — determines vCPUs, RAM, disk count, NIC count
3. **Disks** — OS disk (required) + data disks (optional)
4. **Networking** — VNet, subnet, public IP, NSG
5. **Management** — auto-shutdown, extensions, diagnostics
6. **Auth** — SSH keys (Linux) or password (Windows)

### VM Size Families
| Series | Optimized for |
|--------|--------------|
| **B** | Burstable — dev/test, bursty workloads |
| **D** | General purpose — balanced CPU/memory |
| **E** | Memory — high RAM:CPU ratio |
| **F** | Compute — high CPU:memory ratio |
| **M** | Very large memory (up to 12TB RAM) |
| **N** | GPU — AI/ML, rendering, visualization |
| **L** | Storage — high disk throughput/IOPS |

### VM Disk Types
| Type | Max IOPS | Use case |
|------|---------|---------|
| **Standard HDD** | 500 | Dev/test, non-critical |
| **Standard SSD** | 6,000 | Web servers, light workloads |
| **Premium SSD** | 20,000 | Production, databases |
| **Premium SSD v2** | 80,000 | I/O intensive, databases |
| **Ultra Disk** | 160,000 | Mission-critical databases |

---

## Stop vs Deallocate (CRITICAL EXAM TOPIC)

| Action | VM State | Compute Billed? | IP kept? |
|--------|----------|-----------------|---------|
| **Stop** (OS shutdown) | Stopped | ✅ YES | ✅ Yes |
| **Deallocate** (portal Stop) | Deallocated | ❌ NO | ❌ Released |

> **Always deallocate to save money.** Just "stopping" the OS still charges you for the VM.

---

## Availability Options

| Option | SLA | How |
|--------|-----|-----|
| Single VM + Premium SSD | 99.9% | — |
| **Availability Set** | 99.95% | FDs + UDs in one datacenter |
| **Availability Zones** | 99.99% | Across 3 AZs in region |
| **VMSS across AZs** | 99.99% | Auto-scale + zone distribution |

### Availability Set internals
- **Fault Domain (FD):** separate power + rack + switch (max 3)
- **Update Domain (UD):** separate maintenance window (max 20)
- VMs in same AS spread across FDs and UDs automatically

---

## VM Scale Sets (VMSS)

Deploy and manage a group of **identical** VMs that auto-scale:

\`\`\`bash
# Create VMSS
az vmss create \\
  --resource-group myRG \\
  --name myScaleSet \\
  --image UbuntuLTS \\
  --upgrade-policy-mode automatic \\
  --admin-username azureuser \\
  --generate-ssh-keys

# Configure autoscale
az monitor autoscale create \\
  --resource-group myRG \\
  --resource myScaleSet \\
  --resource-type Microsoft.Compute/virtualMachineScaleSets \\
  --name autoscale \\
  --min-count 2 --max-count 10 --count 2
\`\`\`

**Autoscale rules:** based on CPU %, memory, custom metrics, schedule

---

## Azure App Service

PaaS platform for web apps, APIs, and mobile backends.

### App Service Plan
The underlying compute. VM running your apps.

| Plan | Use | Features |
|------|-----|---------|
| **Free/Shared** | Dev/test | No SLA, shared infra |
| **Basic** | Dev/test | Dedicated VMs, manual scale |
| **Standard** | Production | Auto-scale, staging slots, custom domains |
| **Premium** | High traffic | More scale, VNet integration |
| **Isolated** | Compliance | Private VNet, dedicated hardware |

### Deployment Slots
Run multiple versions of your app:
- **Production** slot (live)
- **Staging** slot (test new version)
- **Swap** — swap staging to production (zero downtime deploy)

---

## Azure Container Instances vs AKS

| | ACI | AKS |
|-|-----|-----|
| **Orchestration** | None | Kubernetes |
| **Use case** | Simple, short-lived tasks | Production, complex orchestration |
| **Setup** | Seconds | Minutes |
| **Cost** | Per second | Per node (VM) |
| **Scaling** | Manual | Auto (HPA, Cluster Autoscaler) |

---

## Common CLI Operations

\`\`\`bash
# Create VM
az vm create -g myRG -n myVM --image UbuntuLTS --admin-username azureuser --generate-ssh-keys

# Start / Stop / Deallocate
az vm start -g myRG -n myVM
az vm stop -g myRG -n myVM          # OS stop — still billed!
az vm deallocate -g myRG -n myVM    # Stop + release — not billed

# Resize VM
az vm resize -g myRG -n myVM --size Standard_D4s_v3

# Add data disk
az vm disk attach -g myRG --vm-name myVM --name myDisk --size-gb 128 --sku Premium_LRS --new

# Run extension
az vm extension set -g myRG --vm-name myVM --name customScript \\
  --publisher Microsoft.Azure.Extensions \\
  --settings '{"fileUris":["https://...script.sh"],"commandToExecute":"./script.sh"}'
\`\`\`

---

## Exam Key Tasks

1. Deploy VM with specific size + disk type + availability zone
2. Deallocate VM (not just stop) to avoid billing
3. Create Availability Set + deploy 2 VMs into it
4. Set up VMSS with autoscale rule (scale out when CPU > 75%)
5. Create App Service plan + deploy web app
6. Create deployment slot + perform slot swap
7. Enable VM extension (custom script)
8. Take snapshot of VM disk
`,

  'networking-admin': `
# Azure Networking Administration — AZ-104

## Virtual Networks (VNet)

A private IP address space in Azure. Resources in the same VNet can communicate by default.

\`\`\`bash
# Create VNet
az network vnet create \\
  --resource-group myRG \\
  --name myVNet \\
  --address-prefix 10.0.0.0/16 \\
  --location eastus

# Create subnet
az network vnet subnet create \\
  --resource-group myRG \\
  --vnet-name myVNet \\
  --name WebSubnet \\
  --address-prefix 10.0.1.0/24
\`\`\`

**Subnet reserved addresses (always blocked):**
- x.x.x.0 — Network address
- x.x.x.1 — Default gateway
- x.x.x.2, x.x.x.3 — DNS
- x.x.x.255 — Broadcast

> In a /24 subnet (256 addresses), you get 251 usable IPs.

---

## Network Security Groups (NSG)

Stateful firewall rules. Applied to **subnet** or **NIC**.

| Property | Details |
|----------|---------|
| **Rules** | Priority 100–4096, lower = higher priority |
| **Direction** | Inbound or Outbound |
| **Protocol** | TCP, UDP, ICMP, Any |
| **Source/Dest** | IP, CIDR, Service Tag, ASG |
| **Stateful** | If inbound allowed, return traffic automatically allowed |

**Default rules (always present, can't delete):**
- Allow VNet inbound (priority 65000)
- Allow Azure Load Balancer inbound (65001)
- Deny all inbound (65500)
- Allow all VNet outbound (65000)
- Allow internet outbound (65001)
- Deny all outbound (65500)

**Service Tags** (built-in IP groups):
- \`Internet\` — all internet IPs
- \`VirtualNetwork\` — all VNet + peered + on-prem IPs
- \`AzureLoadBalancer\` — Azure infra health probes
- \`Storage\` — Azure Storage IPs

---

## Application Security Groups (ASG)

Group VMs by role, use in NSG rules instead of IPs:

\`\`\`
NSG Rule: Allow TCP 443 from ASG-WebServers to ASG-AppServers
\`\`\`

No need to update rules when VMs are added/removed — just add VM to ASG.

---

## VNet Peering

Connect two VNets directly over Microsoft backbone (not internet).

**Key rules:**
- Must configure peering in **BOTH directions**
- Peering is **NOT transitive** — A↔B, B↔C does NOT mean A↔C
- Cross-region peering (Global VNet Peering) is supported
- No bandwidth limits, no gateway needed

\`\`\`bash
# Peer VNet-A → VNet-B (do this in both directions)
az network vnet peering create \\
  --resource-group myRG \\
  --name AtoB \\
  --vnet-name VNet-A \\
  --remote-vnet VNet-B \\
  --allow-vnet-access
\`\`\`

---

## VPN Gateway

Encrypted IPSec/IKE tunnel between Azure VNet and external network.

| Type | Use |
|------|-----|
| **Site-to-Site (S2S)** | On-prem network ↔ Azure VNet |
| **Point-to-Site (P2S)** | Individual client ↔ Azure VNet |
| **VNet-to-VNet** | Azure VNet ↔ Azure VNet (cross-region) |

**Requires:** GatewaySubnet in your VNet (must be named exactly "GatewaySubnet")

**SKUs:** Basic → VpnGw1 → VpnGw5 (higher throughput, more connections)

**Active-Active mode:** Two gateways for higher availability (99.99% SLA)

---

## ExpressRoute vs VPN

| | VPN Gateway | ExpressRoute |
|-|-------------|-------------|
| **Path** | Over internet (encrypted) | Private dedicated link |
| **Bandwidth** | Up to 10 Gbps | Up to 100 Gbps |
| **Latency** | Variable | Consistent, low |
| **SLA** | 99.9% | 99.95% |
| **Cost** | Lower | Higher |
| **Setup time** | Hours | Weeks (needs provider) |
| **Use when** | Cost matters, internet OK | Compliance, high bandwidth, consistent latency |

---

## Load Balancing — Which Service?

| Service | Layer | Scope | Use case |
|---------|-------|-------|---------|
| **Azure Load Balancer** | L4 TCP/UDP | Regional | Distribute VM traffic, internal or external |
| **Application Gateway** | L7 HTTP/HTTPS | Regional | Web apps, URL routing, WAF, SSL termination |
| **Azure Front Door** | L7 HTTP/HTTPS | Global | Multi-region web apps, CDN, global WAF |
| **Traffic Manager** | DNS | Global | Route by geography, performance, priority, weighted |

> **Decision tree:** HTTP traffic? → App Gateway (regional) or Front Door (global). TCP/UDP? → Load Balancer. DNS-based routing? → Traffic Manager.

---

## Azure DNS

- Host public DNS zones: your domain's records in Azure
- Private DNS zones: name resolution within VNets (without public DNS)
- Alias records: point to Azure resources (IP auto-updates)

---

## Exam Key Tasks

1. Create VNet with multiple subnets
2. Create NSG with custom allow/deny rules and attach to subnet
3. Configure VNet peering (both directions!)
4. Create and configure VPN Gateway (S2S)
5. Set up internal Load Balancer with backend pool + health probe
6. Configure Application Gateway with path-based routing
7. Create private DNS zone + link to VNet
8. Use Network Watcher to troubleshoot connectivity
`,

  'monitor-backup': `
# Azure Monitor & Backup — AZ-104

## Azure Monitor Architecture

\`\`\`
Azure Resources
      │
      ▼
  Diagnostics Settings ──────────────────────────────────────┐
      │                                                       │
      ▼                                                       ▼
  Metrics                                                   Logs
(numeric, auto-collected,                    (structured text, sent to
 stored 93 days)                              Log Analytics Workspace)
      │                                                       │
      ▼                                                       ▼
  Metrics Explorer                                        KQL Queries
  Dashboards                                              Workbooks
  Alerts                                                  Alerts
\`\`\`

---

## Metrics vs Logs

| | Metrics | Logs |
|-|---------|------|
| **Type** | Numeric values | Structured text records |
| **Examples** | CPU %, requests/sec, disk IOPS | Event logs, app logs, audit logs |
| **Collection** | Automatic for most resources | Requires diagnostic settings |
| **Storage** | Azure Monitor (93 days) | Log Analytics Workspace |
| **Query** | Metrics Explorer | KQL |

---

## Log Analytics Workspace + KQL

Central repository for all logs. Query with **KQL (Kusto Query Language)**.

\`\`\`kql
// Find VMs with CPU > 80% in last hour
Perf
| where ObjectName == "Processor" and CounterName == "% Processor Time"
| where TimeGenerated > ago(1h)
| summarize avg(CounterValue) by Computer
| where avg_CounterValue > 80
| order by avg_CounterValue desc

// Count errors by type in last 24 hours
AppExceptions
| where TimeGenerated > ago(24h)
| summarize count() by ExceptionType
| order by count_ desc
\`\`\`

**KQL basics:**
- \`where\` — filter rows
- \`summarize\` — aggregate (count, avg, sum, max)
- \`project\` — select columns
- \`order by\` — sort
- \`ago()\` — time ago (ago(1h), ago(7d))
- \`extend\` — add calculated column

---

## Alerts

**Three components:**
1. **Signal** — what to monitor (metric threshold, log query result, activity log event)
2. **Condition** — when to fire (CPU > 80% for 5 minutes)
3. **Action Group** — what to do when fired

**Action Group options:**
- Email / SMS / Voice call
- Azure app push notification
- Webhook
- Logic App
- Azure Function
- ITSM (ServiceNow, etc.)
- Automation Runbook

**Alert severity:** 0 (Critical) → 1 (Error) → 2 (Warning) → 3 (Informational) → 4 (Verbose)

---

## Azure Monitor Agent (AMA)

Collects data FROM virtual machines. Replaces older MMA/OMS agents.

Collects:
- Performance counters (CPU, memory, disk, network)
- Windows Event Log
- Linux Syslog
- Custom text log files

Configure via **Data Collection Rules (DCR)** — define what to collect and where to send.

---

## Application Insights

APM (Application Performance Monitoring) for web apps and services.

Tracks automatically (with SDK):
- HTTP requests (count, duration, failures)
- Exceptions and stack traces
- Dependencies (SQL, HTTP calls)
- Page views and user sessions
- Custom events and metrics

**Live Metrics:** real-time view of requests, failures, server load.

---

## Azure Backup

Centralized backup with a **Recovery Services Vault** as the container.

**What can be backed up:**
| Source | Method |
|--------|--------|
| Azure VMs | Azure Backup extension |
| SQL Server in Azure VM | Workload-aware backup |
| Azure Files | Snapshot-based |
| On-prem servers | MARS agent |
| On-prem VMs (VMware/Hyper-V) | MABS / DPM |

**Backup policy:**
- Frequency: daily/weekly
- Retention: daily/weekly/monthly/yearly points
- Instant restore tier: keep snapshots locally (fast restore, higher cost)

\`\`\`bash
# Enable VM backup
az backup protection enable-for-vm \\
  --resource-group myRG \\
  --vault-name myVault \\
  --vm myVM \\
  --policy-name DefaultPolicy
\`\`\`

---

## Azure Site Recovery (ASR)

Disaster recovery — replicate VMs to another region. Failover if primary region fails.

| Term | Meaning |
|------|---------|
| **RPO** | Recovery Point Objective — max data loss (30 sec for Azure→Azure) |
| **RTO** | Recovery Time Objective — max downtime to recover |
| **Failover** | Switch to secondary region (production) |
| **Failback** | Switch back to primary after recovery |
| **Test failover** | Simulate DR without affecting production |

**Azure→Azure replication:**
- RPO: 30 seconds
- Near-continuous replication
- Test failover uses isolated VNet — doesn't impact prod

---

## Exam Key Tasks

1. Create Log Analytics Workspace + configure diagnostic settings to send logs there
2. Write basic KQL queries (filter, summarize, order)
3. Create metric alert: fire when CPU > 80%, action = email
4. Create log alert: fire when error count > 5 in 5 minutes
5. Enable backup on VM with custom policy
6. Restore VM from recovery point
7. Set up Azure Site Recovery (replicate VM to another region)
8. Run test failover to validate DR plan
`,

  'management-tools': `
# Azure Management Tools

## The Azure Management Landscape

Azure gives you multiple ways to manage resources — choose the right tool for each job.

---

## Azure Portal

The web-based UI at **portal.azure.com**.

- Visual, point-and-click interface
- Dashboard customization, resource graphs, monitoring
- Best for: exploration, one-off tasks, learning
- NOT good for: automation, repeatable deployments

**Key portal features:**
- **Resource Groups** — logical containers for resources
- **All Resources** — search/filter across your subscription
- **Cost Management** — spending analysis and budgets
- **Azure Advisor** — personalized recommendations

> **Exam tip:** Portal is great for humans. For automation, use CLI, PowerShell, or ARM templates.

---

## Azure Cloud Shell

Browser-based shell in the portal (the \`>_\` icon).

- Available as **Bash** or **PowerShell**
- Pre-authenticated — no login needed
- Persists files in Azure Storage (5GB free)
- Has Azure CLI, Azure PowerShell, kubectl, terraform, and more pre-installed
- Access at shell.azure.com

> **Exam tip:** Cloud Shell runs in Azure — you don't install anything locally.

---

## Azure CLI

Cross-platform command-line tool.

\`\`\`bash
# Install on Windows/Mac/Linux
# Then login:
az login

# Create a resource group:
az group create --name MyRG --location eastus

# Create a VM:
az vm create --resource-group MyRG --name MyVM --image Win2019Datacenter

# List all VMs:
az vm list --output table
\`\`\`

- Commands follow pattern: \`az [resource] [action]\`
- Supports JSON output, table output, YAML
- Ideal for Bash scripts and DevOps pipelines

---

## Azure PowerShell

PowerShell module for Azure management.

\`\`\`powershell
# Install the module:
Install-Module -Name Az

# Login:
Connect-AzAccount

# Create a VM:
New-AzVM -ResourceGroupName MyRG -Name MyVM -Location EastUS

# Get all VMs:
Get-AzVM
\`\`\`

- Commands follow PowerShell verb-noun pattern: \`Get-Az*\`, \`New-Az*\`, \`Remove-Az*\`
- Better for Windows admins who know PowerShell
- Same capabilities as Azure CLI — choose based on preference

---

## ARM Templates (Azure Resource Manager)

**Infrastructure as Code** using JSON files.

\`\`\`json
{
  "$schema": "...",
  "contentVersion": "1.0.0.0",
  "parameters": { ... },
  "variables": { ... },
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachines",
      "name": "[parameters('vmName')]",
      ...
    }
  ],
  "outputs": { ... }
}
\`\`\`

**ARM template key sections:**
| Section | Purpose |
|---------|---------|
| **parameters** | Values you pass in at deploy time |
| **variables** | Reusable values within the template |
| **resources** | The actual Azure resources to deploy |
| **outputs** | Values returned after deployment |

**Deployment modes:**
| Mode | Behavior |
|------|---------|
| **Incremental** | Adds/updates resources — doesn't delete extras |
| **Complete** | Template is the desired state — deletes resources NOT in template |

---

## Bicep

Bicep is a simplified, declarative DSL that compiles to ARM JSON.

\`\`\`bicep
param location string = resourceGroup().location
param vmName string = 'myVM'

resource vm 'Microsoft.Compute/virtualMachines@2023-03-01' = {
  name: vmName
  location: location
  properties: {
    ...
  }
}
\`\`\`

**Bicep vs ARM JSON:**
| | Bicep | ARM JSON |
|-|-------|----------|
| **Syntax** | Clean, concise | Verbose JSON |
| **Output** | Compiles to ARM | Is the ARM |
| **Type checking** | Yes | Limited |
| **Modules** | Easy | Linked templates |

> **Exam tip:** Bicep = better developer experience, same power as ARM templates.

**Deploy Bicep:**
\`\`\`bash
az deployment group create --resource-group MyRG --template-file main.bicep
\`\`\`

---

## Azure Arc

Extends Azure management to resources **outside Azure**.

**What Arc manages:**
- On-premises servers (Windows/Linux)
- Other cloud VMs (AWS EC2, GCP instances)
- Kubernetes clusters anywhere
- SQL Server instances anywhere

**Azure Arc capabilities:**
- Apply Azure Policy to on-prem servers
- Use Azure Monitor for on-prem servers
- Deploy Azure services (Arc-enabled data services)
- Consistent management plane across hybrid environments

> **Use case:** Large enterprise with on-prem + cloud wants single pane of glass for all resources.

---

## Azure Advisor

Free, personalized **recommendation service**.

**Five recommendation categories:**
| Category | Example Recommendations |
|----------|------------------------|
| **Reliability** | Add VMs to availability sets, enable backups |
| **Security** | Enable MFA, apply security patches |
| **Performance** | Resize underperforming VMs, use Premium SSD |
| **Cost** | Shut down idle VMs, use Reserved Instances |
| **Operational Excellence** | Use ARM templates, set up alerts |

- Recommendations are free and updated regularly
- Can snooze or dismiss recommendations
- Integrates with Azure Cost Management

---

## Azure Service Health

Tells you about Azure service issues affecting YOUR resources.

**Three components:**
| Service | What it shows |
|---------|--------------|
| **Azure Status** | Global Azure outages (status.azure.com) |
| **Service Health** | Outages affecting YOUR subscriptions/regions |
| **Resource Health** | Health of specific individual resources |

**Service Health alerts:**
- Set alerts for service issues in your regions
- Get notified about planned maintenance
- Access post-incident reports

---

## Azure Monitor

Central monitoring platform for all Azure resources.

**Data sources → Azure Monitor → Destinations:**

\`\`\`
Apps, VMs, Storage, Network
        ↓
   Azure Monitor
   ├── Metrics (numbers: CPU%, requests/sec)
   └── Logs (text: events, errors)
        ↓
Log Analytics Workspace → KQL queries
Alerts → Action Groups (email, SMS, webhook)
Dashboards → Visualizations
Workbooks → Rich reports
\`\`\`

**Key Azure Monitor tools:**
| Tool | Purpose |
|------|---------|
| **Log Analytics** | Query logs with KQL |
| **Application Insights** | APM for web apps |
| **VM Insights** | VM performance + map |
| **Container Insights** | AKS monitoring |
| **Network Watcher** | Network diagnostics |

---

## Azure Marketplace

Online store for Azure-compatible software and services.

- Pre-configured images (WordPress, SAP, SQL Server)
- Solutions from Microsoft and third-party vendors
- Deploy directly into your subscription
- Pay through Azure billing (consolidated invoice)

---

## Exam Summary: Tool Selection

| Scenario | Best Tool |
|----------|-----------|
| One-time resource creation | Portal or CLI |
| Repeatable, consistent deployments | ARM/Bicep |
| Script-based automation | Azure CLI (Bash) or PowerShell |
| Manage on-prem + cloud together | Azure Arc |
| Get cost/security recommendations | Azure Advisor |
| Monitor resource health | Azure Monitor + Service Health |
| Buy third-party solutions | Azure Marketplace |
`,

  'azure-ai-iot': `
# AI, IoT & Integration Services

## Azure AI Services

Azure AI (formerly Cognitive Services) provides pre-built AI capabilities as APIs — no ML expertise required.

---

## Azure Machine Learning

Full ML platform for data scientists and MLOps.

**Components:**
| Component | Purpose |
|-----------|---------|
| **Azure ML Studio** | Web UI for experiments |
| **Compute clusters** | Scalable training infrastructure |
| **Datasets** | Versioned, registered data |
| **Pipelines** | Automated ML workflows |
| **Model registry** | Version and deploy models |
| **Endpoints** | Real-time or batch inference |

**Key concepts:**
- **AutoML** — automatically tries different algorithms to find best model
- **Designer** — drag-and-drop ML pipeline builder
- **MLflow** — open-source ML tracking integration

---

## Azure AI Services (Cognitive Services)

Pre-built AI APIs — call an API, get AI results. No training needed.

| Category | Services | What it does |
|----------|----------|--------------|
| **Vision** | Computer Vision, Custom Vision, Face | Analyze/classify images, detect faces |
| **Speech** | Speech-to-Text, Text-to-Speech, Translator | Voice recognition and synthesis |
| **Language** | Text Analytics, Translator, Language Understanding (LUIS) | Sentiment, key phrases, translation |
| **Decision** | Anomaly Detector, Content Moderator, Personalizer | Detect anomalies, filter content |
| **Search** | Bing Search APIs | Web search in your apps |

> **Exam tip:** Cognitive Services = pre-built AI for common tasks. Azure ML = custom model training.

---

## Azure OpenAI Service

Enterprise access to OpenAI models (GPT-4, DALL-E, Whisper, Embeddings) through Azure.

**Key differences from openai.com:**
- Data stays in your Azure region (compliance)
- Private network access (no public internet)
- Azure RBAC for access control
- Integrated with Azure Monitor and logging
- Content filtering built in

**Use cases:** Chatbots, code generation, document summarization, semantic search

---

## Azure Bot Service

Platform for building, hosting, and managing intelligent bots.

- Framework for multi-channel bots (Teams, Slack, Web, SMS)
- Integrates with Language Understanding (LUIS) for NLP
- QnA Maker / Azure AI Language for FAQ bots
- Channels: Teams, Web Chat, Email, Facebook, Slack

---

## Azure AI Search (formerly Cognitive Search)

Cloud search service with **AI enrichment**.

- Full-text search over your data
- AI enrichment: extract text from images, translate, identify entities
- Vector search for semantic/similarity search
- Integrates with Azure OpenAI for RAG (Retrieval Augmented Generation)

---

## Azure IoT Services

Connect, monitor, and manage IoT devices at scale.

---

## Azure IoT Hub

**Central message hub** for IoT device communication.

| Feature | Detail |
|---------|--------|
| **Device-to-Cloud** | Devices send telemetry to IoT Hub |
| **Cloud-to-Device** | Send commands down to devices |
| **Device twins** | JSON documents storing device state |
| **Direct methods** | Invoke functions on devices |
| **Scale** | Millions of devices |

**Protocols supported:** MQTT, AMQP, HTTPS

> **Exam tip:** IoT Hub = bi-directional communication, full control, large scale.

---

## Azure IoT Central

**SaaS** IoT platform — fully managed, no infrastructure needed.

- Pre-built dashboards for device monitoring
- Device templates (describe your device type)
- Rules-based alerts
- Good for: smaller deployments, quick start

**IoT Hub vs IoT Central:**
| | IoT Hub | IoT Central |
|-|---------|-------------|
| **Type** | PaaS | SaaS |
| **Customization** | High | Low |
| **Setup** | Complex | Simple |
| **Use case** | Custom solutions | Quick deployments |

---

## Azure Sphere

End-to-end **security for IoT hardware**.

Three components:
1. **Azure Sphere microcontroller** (custom secure hardware)
2. **Azure Sphere OS** (custom Linux-based secure OS)
3. **Azure Sphere Security Service** (cloud security management)

> **Use case:** Embedding security into IoT devices like industrial equipment, appliances.

---

## Azure Integration Services

Connecting apps, data, and services together.

---

## Azure Event Grid

**Event routing** service — reacts to events across Azure.

- **Push** model: events are pushed to subscribers
- **Event sources:** Azure Blob Storage, Resource Groups, Custom topics, IoT Hub, etc.
- **Event handlers:** Functions, Logic Apps, Event Hubs, Webhooks
- **Fan-out:** One event → multiple subscribers
- Near real-time, very low latency

> **Use case:** Blob uploaded → trigger Function to process it. Resource created → notify Slack.

---

## Azure Event Hubs

**Big data streaming** platform — ingest millions of events per second.

| Feature | Detail |
|---------|--------|
| **Throughput** | Millions of events/second |
| **Retention** | 1-7 days (or more with dedicated tier) |
| **Protocol** | AMQP, HTTPS, Kafka-compatible |
| **Consumers** | Multiple consumer groups read independently |
| **Capture** | Auto-save to Blob Storage or ADLS |

> **Use case:** Telemetry from apps, clickstreams, IoT data at massive scale.

**Event Grid vs Event Hubs:**
| | Event Grid | Event Hubs |
|-|-----------|------------|
| **Pattern** | Event-driven (react to events) | Streaming (process data streams) |
| **Volume** | Low-moderate events | Millions per second |
| **Retention** | No (fire and forget) | Days |

---

## Azure Service Bus

**Enterprise messaging** — reliable message queuing.

| Feature | Detail |
|---------|--------|
| **Queues** | Point-to-point, FIFO, guaranteed delivery |
| **Topics/Subscriptions** | Publish-subscribe pattern, multiple subscribers |
| **Sessions** | Ordered processing of related messages |
| **Dead-letter queue** | Failed messages go here for investigation |
| **Transactions** | Atomic operations across messages |

> **Use case:** Order processing system — place order → queue → process payment → queue → ship.

**Service Bus vs Event Hubs vs Event Grid:**
| | Service Bus | Event Hubs | Event Grid |
|-|------------|------------|------------|
| **Pattern** | Messaging | Streaming | Events |
| **Ordering** | Yes (sessions) | Per partition | No |
| **Delivery** | Guaranteed | At-least-once | At-least-once |
| **Use case** | App integration | Telemetry ingestion | Reactive events |

---

## Azure Logic Apps

**Low-code workflow automation** — connect apps and services visually.

- 400+ built-in connectors (Office 365, Salesforce, ServiceNow, SAP...)
- Trigger + Actions model
- No code required for simple workflows
- Complex workflows with conditions, loops, error handling
- Consumption (pay per execution) or Standard (dedicated) plans

> **Use case:** When email arrives → save attachment to SharePoint → post notification to Teams.

---

## Azure Functions (Integration Context)

**Serverless** code execution triggered by events.

- HTTP triggers, timer triggers, blob triggers, queue triggers, Event Grid triggers
- Consumption plan = truly serverless (scale to zero, pay per execution)
- Integrate with Event Grid, Service Bus, IoT Hub

> **Exam tip:** Functions = custom code. Logic Apps = no/low code. Both are serverless event-driven.

---

## Exam Summary

| Service | Category | Key Fact |
|---------|----------|----------|
| Azure ML | AI | Full ML lifecycle, AutoML |
| AI Services | AI | Pre-built AI APIs, no training needed |
| Azure OpenAI | AI | Enterprise GPT/DALL-E, data stays in Azure |
| IoT Hub | IoT | Bi-directional device communication, PaaS |
| IoT Central | IoT | SaaS IoT, easy setup |
| Azure Sphere | IoT | Secure IoT hardware platform |
| Event Grid | Integration | Event routing, reactive, push |
| Event Hubs | Integration | Big data streaming, millions/sec |
| Service Bus | Integration | Enterprise messaging, guaranteed delivery |
| Logic Apps | Integration | Low-code workflow automation |
`,

  'arm-automation': `
# ARM Templates & Automation

## Infrastructure as Code (IaC)

Instead of clicking in the portal, you define your infrastructure in code files. Benefits:
- **Repeatable** — deploy the same environment every time
- **Version controlled** — track changes in Git
- **Auditable** — know who changed what, when
- **Automated** — part of CI/CD pipelines

---

## ARM Templates Deep Dive

ARM (Azure Resource Manager) templates are **JSON files** describing your desired Azure infrastructure.

### Full ARM Template Structure

\`\`\`json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "type": "string",
      "defaultValue": "myVM",
      "metadata": { "description": "Name of the VM" }
    },
    "vmSize": {
      "type": "string",
      "defaultValue": "Standard_D2s_v3",
      "allowedValues": ["Standard_D2s_v3", "Standard_D4s_v3"]
    }
  },
  "variables": {
    "nicName": "[concat(parameters('vmName'), '-nic')]"
  },
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachines",
      "apiVersion": "2023-03-01",
      "name": "[parameters('vmName')]",
      "location": "[resourceGroup().location]",
      "properties": { ... }
    }
  ],
  "outputs": {
    "vmId": {
      "type": "string",
      "value": "[resourceId('Microsoft.Compute/virtualMachines', parameters('vmName'))]"
    }
  }
}
\`\`\`

### ARM Template Functions

| Function | Example | Result |
|----------|---------|--------|
| \`concat()\` | \`concat('vm-', parameters('name'))\` | \`vm-myname\` |
| \`resourceGroup().location\` | Automatic | Current RG location |
| \`parameters('name')\` | Get parameter | Parameter value |
| \`variables('nicName')\` | Get variable | Variable value |
| \`uniqueString()\` | \`uniqueString(resourceGroup().id)\` | Unique hash |

### Deployment Modes

| Mode | Behavior | Risk |
|------|---------|------|
| **Incremental** (default) | Only creates/updates resources in template | Safe — won't delete |
| **Complete** | Template = desired state, deletes everything else | Dangerous if forgetting resources |

\`\`\`bash
# Deploy with complete mode:
az deployment group create \\
  --resource-group MyRG \\
  --template-file main.json \\
  --mode Complete
\`\`\`

### Linked & Nested Templates

**Nested templates:** Template inside a template (inline).

**Linked templates:** Template references another template file by URI.

\`\`\`json
{
  "type": "Microsoft.Resources/deployments",
  "name": "networkDeploy",
  "properties": {
    "mode": "Incremental",
    "templateLink": {
      "uri": "https://storage.blob.core.windows.net/templates/network.json"
    }
  }
}
\`\`\`

> **Use case:** Break large deployments into reusable modules.

---

## Bicep Deep Dive

Bicep is a **domain-specific language** for ARM templates — cleaner syntax, same capabilities.

\`\`\`bicep
// Parameters
param location string = resourceGroup().location
param vmName string = 'myVM'
param adminPassword string  // no default — required

// Variables
var nicName = '\${vmName}-nic'

// Resources
resource nic 'Microsoft.Network/networkInterfaces@2023-04-01' = {
  name: nicName
  location: location
  properties: {
    ipConfigurations: [...]
  }
}

resource vm 'Microsoft.Compute/virtualMachines@2023-03-01' = {
  name: vmName
  location: location
  dependsOn: [nic]  // explicit dependency
  properties: {
    ...
  }
}

// Outputs
output vmId string = vm.id
\`\`\`

### Bicep Modules

Like linked templates — reuse components:

\`\`\`bicep
// main.bicep
module network './modules/network.bicep' = {
  name: 'networkDeploy'
  params: {
    vnetName: 'myVNet'
    location: location
  }
}
\`\`\`

### Deploy Bicep

\`\`\`bash
# Compile Bicep to ARM JSON (optional, for review):
az bicep build --file main.bicep

# Deploy directly:
az deployment group create \\
  --resource-group MyRG \\
  --template-file main.bicep \\
  --parameters vmName=prod-vm
\`\`\`

---

## Azure Automation

Automate repetitive operational tasks.

### Runbooks

Scripts that automate Azure tasks — written in PowerShell or Python.

**Runbook types:**
| Type | Language | Use case |
|------|----------|---------|
| **PowerShell** | PowerShell | Windows/Azure tasks |
| **Python** | Python 2/3 | Cross-platform |
| **Graphical** | Visual | Simple, no-code workflows |

**Execution options:**
- Manual (on-demand)
- Scheduled (like cron jobs)
- Triggered by webhooks
- Started by Azure Alerts

### Desired State Configuration (DSC)

Ensure VMs stay in a desired configuration — if config drifts, it's corrected automatically.

\`\`\`powershell
Configuration WebServerConfig {
  Node "WebServer01" {
    WindowsFeature IIS {
      Ensure = "Present"
      Name = "Web-Server"
    }
  }
}
\`\`\`

> **Use case:** Ensure IIS is always installed on web servers. If someone uninstalls it, DSC reinstalls it.

### Azure Automation Update Management

- Assess which VMs are missing updates
- Schedule update deployments
- View compliance reports
- Supports Windows and Linux VMs (on-prem too via Azure Arc)

---

## Azure Policy Automation

### Policy Remediation Tasks

When a non-compliant resource is found:
- **DeployIfNotExists** — automatically deploy a resource (e.g., add a missing tag)
- **Modify** — automatically change a property
- **Remediation task** — fix existing non-compliant resources

\`\`\`bash
# Create a remediation task:
az policy remediation create \\
  --name myRemediation \\
  --policy-assignment /subscriptions/.../policyAssignments/... \\
  --resource-discovery-mode ExistingNonCompliant
\`\`\`

### Policy Initiative (Policy Set)

Group multiple policies into a single assignment. Example: "PCI-DSS Compliance Initiative" = 50+ policies.

---

## What-If Analysis

Before deploying, preview what WILL change:

\`\`\`bash
az deployment group what-if \\
  --resource-group MyRG \\
  --template-file main.bicep
\`\`\`

Output shows:
- **Create** — new resources
- **Modify** — changes to existing resources
- **Delete** — resources that will be removed (Complete mode)
- **No change** — resources unchanged

---

## Exam Key Facts

| Topic | Key Fact |
|-------|---------|
| ARM template sections | schema, contentVersion, parameters, variables, resources, outputs |
| Deployment modes | Incremental (safe), Complete (deletes extras) |
| Bicep | Simplified ARM syntax, compiles to JSON |
| Linked templates | Reference other template files by URI |
| Runbooks | PowerShell/Python scripts in Azure Automation |
| DSC | Enforce and maintain desired VM configuration |
| What-if | Preview changes before deploying |
| Policy remediation | Auto-fix non-compliant resources |
`,

  'advanced-networking': `
# Advanced Networking

## Service Endpoints vs Private Endpoints

These both control how Azure services are accessed — but they work differently.

### Service Endpoints

Extend your VNet's identity to Azure services over the Azure backbone network.

\`\`\`
VNet → Azure backbone → Azure Storage (still public IP, but from VNet)
\`\`\`

**How it works:**
1. Enable Service Endpoint on a subnet (e.g., Microsoft.Storage)
2. Configure Azure Storage firewall to allow traffic from that VNet/subnet
3. Traffic from that subnet to Storage goes over Azure backbone (not internet)

**Limitations:**
- Service still has a public IP
- Doesn't work for on-premises connectivity
- No private DNS record

### Private Endpoints

A **private IP address** in your VNet mapped to an Azure service.

\`\`\`
VNet (10.0.0.5 = Private IP) → Azure Storage (truly private)
\`\`\`

**How it works:**
1. Create Private Endpoint in your VNet
2. Azure assigns a private IP to the service in your VNet
3. Configure Private DNS Zone to resolve service name to private IP
4. Disable public access on the service

**Benefits:**
- Service gets a private IP in your VNet
- Works from on-premises (via VPN/ExpressRoute)
- Public access can be completely disabled

| | Service Endpoint | Private Endpoint |
|-|-----------------|-----------------|
| **IP** | Service keeps public IP | Service gets private IP in VNet |
| **On-prem access** | No | Yes (via VPN/ER) |
| **Cost** | Free | Per hour + data |
| **DNS** | Not needed | Private DNS Zone needed |
| **Security** | Good | Better |

> **Exam tip:** Private Endpoint = private IP in your VNet. More secure, works from on-prem.

---

## Azure Bastion

Secure RDP/SSH to VMs **without a public IP** on the VM.

**Problem it solves:** You need to RDP/SSH to a VM, but you don't want to expose RDP (3389) or SSH (22) to the internet.

**How Bastion works:**
1. Deploy Azure Bastion in a subnet called \`AzureBastionSubnet\` (/26 minimum)
2. Connect to VM via Azure Portal (HTML5 browser-based)
3. Traffic goes from your browser → Azure Bastion → VM over private network

**Benefits:**
- No public IP needed on VM
- No NSG rule needed for RDP/SSH from internet
- Session recorded (Premium SKU)
- No VPN client needed

| SKU | Features |
|-----|---------|
| **Basic** | RDP/SSH via portal, shared infrastructure |
| **Standard** | Scales automatically, more concurrent sessions |
| **Premium** | Session recording, private-only deployment |

> **Exam tip:** Bastion = managed jump server. Deploy to AzureBastionSubnet.

---

## Azure Firewall

Managed, cloud-native **stateful firewall** service.

**Features:**
| Feature | Detail |
|---------|--------|
| **FQDN filtering** | Allow/deny by domain name (e.g., allow *.microsoft.com) |
| **Network rules** | Layer 3/4 — IP, port, protocol |
| **Application rules** | Layer 7 — FQDN + HTTP/HTTPS |
| **NAT rules** | DNAT — translate inbound traffic |
| **Threat intelligence** | Block known malicious IPs/domains |
| **DNS proxy** | Act as DNS server for VNet |

**Azure Firewall vs NSG:**
| | NSG | Azure Firewall |
|-|-----|----------------|
| **Type** | Distributed (per NIC/subnet) | Centralized hub |
| **Layer** | L3/L4 only | L3-L7 |
| **FQDN rules** | No | Yes |
| **Cost** | Free | ~$900-1500/month |
| **Use case** | Basic subnet filtering | Hub-spoke, advanced filtering |

### Hub-Spoke with Azure Firewall

\`\`\`
Hub VNet (Firewall) ← peered → Spoke VNet 1 (workload)
                   ← peered → Spoke VNet 2 (workload)

All traffic from spokes routes through Hub Firewall
\`\`\`

UDR (User Defined Route) in each spoke subnet:
- Next hop = Azure Firewall private IP
- Forces all internet-bound traffic through firewall

---

## User-Defined Routes (UDR)

Override Azure's default routing with custom routes.

**Azure default routes (system routes):**
- Traffic within VNet → routes automatically
- Traffic to internet → routes via Azure internet gateway
- Traffic between subnets → routes automatically

**UDR allows you to:**
- Force internet traffic through a firewall/NVA
- Block internet access from a subnet
- Route specific traffic to a VPN gateway

\`\`\`
Route Table attached to subnet:
  0.0.0.0/0 → Next hop: Virtual Appliance (Firewall IP)
\`\`\`

**Next hop types:**
| Type | When to use |
|------|------------|
| **Virtual appliance** | Route through NVA/Firewall |
| **VNet gateway** | Route through VPN/ER gateway |
| **Internet** | Force internet routing |
| **None** | Drop traffic (blackhole) |

---

## Network Watcher

Azure tool for **network diagnostics**.

| Tool | Purpose |
|------|---------|
| **IP Flow Verify** | Does an NSG allow/deny this traffic? (5-tuple test) |
| **Next Hop** | What is the routing next hop for this traffic? |
| **Connection Troubleshoot** | Test connectivity between two endpoints |
| **Packet Capture** | Capture network packets from a VM |
| **NSG Flow Logs** | Log all network traffic through an NSG |
| **VPN Diagnostics** | Diagnose VPN gateway issues |
| **Topology** | Visual map of your network |

> **Exam scenario:** VM can't reach internet → use IP Flow Verify to check if NSG is blocking, then Next Hop to check routing.

---

## Azure Private DNS

Manage DNS for private Azure resources.

### Azure-Provided DNS

By default, Azure provides DNS: \`10.0.0.4 → myvm.eastus.cloudapp.azure.com\`

### Private DNS Zones

Create your own DNS zone for internal resolution:

\`\`\`
Zone: internal.contoso.com
  myvm.internal.contoso.com → 10.0.0.4
  db.internal.contoso.com → 10.0.1.5
\`\`\`

**Key features:**
- Link to VNets (auto-registration or manual)
- Auto-registration: VMs automatically get DNS records
- Split-horizon DNS: same name resolves differently inside/outside VNet

### Private DNS Resolver

Enables **on-premises to Azure** DNS resolution and vice versa.

- Inbound endpoint: on-prem DNS forwards to this IP
- Outbound endpoint: Azure DNS forwards to on-prem DNS
- Replaces custom DNS server VMs

---

## BGP with VPN Gateway

BGP (Border Gateway Protocol) enables **dynamic routing** for VPN connections.

**When to use BGP:**
- Multiple VPN connections (active-active)
- Route propagation without manual configuration
- Site-to-site connections where routes change

**BGP vs Static routing:**
| | Static | BGP |
|-|--------|-----|
| **Routes** | Manually configured | Dynamically exchanged |
| **Failover** | Manual | Automatic |
| **Complexity** | Simple | Complex |
| **Use case** | Single site | Multiple sites |

**BGP requirements:**
- VPN Gateway SKU: VpnGw1 or higher
- Site-to-Site connection with BGP enabled
- On-premises device must support BGP

---

## Network Security: Complete Picture

\`\`\`
Internet
    ↓
Azure DDoS Protection (L3/L4 volumetric attacks)
    ↓
Azure Firewall (L7, FQDN, App rules) — Hub VNet
    ↓
NSG on Subnet (L3/L4, allow/deny by IP/port)
    ↓
NSG on NIC (L3/L4, last line of defense)
    ↓
VM
\`\`\`

| Layer | Tool | What it does |
|-------|------|-------------|
| Edge | DDoS Protection | Absorbs volumetric attacks |
| Perimeter | Azure Firewall | Advanced filtering, FQDN, threat intel |
| Network | NSG on Subnet | Basic IP/port filtering |
| Host | NSG on NIC | Per-VM filtering |
| Application | App Gateway + WAF | L7, SQL injection, XSS |

---

## Exam Key Scenarios

| Scenario | Solution |
|----------|----------|
| RDP to VM without public IP | Azure Bastion |
| Force all traffic through firewall | UDR with next hop = firewall |
| Azure service accessible only from VNet | Private Endpoint |
| Test if NSG is blocking traffic | Network Watcher: IP Flow Verify |
| On-prem to Azure DNS resolution | Private DNS Resolver |
| Dynamic routing between sites | BGP-enabled VPN Gateway |
| Block known malicious IPs automatically | Azure Firewall with Threat Intelligence |
`,
}
