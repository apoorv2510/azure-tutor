export type Resource = {
  label: string
  url: string
  type: 'learn' | 'docs' | 'practice' | 'video'
}

export type Topic = {
  id: string
  title: string
  domain: string
  exam: 'AZ-900' | 'AZ-104'
  weight: string
  keyPoints: string[]
  resources: Resource[]
}

export type Exam = {
  id: string
  title: string
  level: string
  topics: Topic[]
}

export const curriculum: Exam[] = [
  {
    id: 'az900',
    title: 'AZ-900',
    level: 'Azure Fundamentals',
    topics: [
      {
        id: 'cloud-concepts',
        title: 'Cloud Concepts',
        domain: 'Cloud Concepts',
        exam: 'AZ-900',
        weight: '25-30%',
        keyPoints: [
          'IaaS vs PaaS vs SaaS',
          'Public vs Private vs Hybrid cloud',
          'CapEx vs OpEx',
          'Shared responsibility model',
          'High availability, scalability, elasticity',
          'Consumption-based pricing',
        ],
        resources: [
          { label: 'MS Learn: Cloud Concepts', url: 'https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/', type: 'learn' },
          { label: 'AZ-900 Study Guide', url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900', type: 'docs' },
          { label: 'Shared Responsibility Model', url: 'https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility', type: 'docs' },
          { label: 'AZ-900 Practice Assessment', url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/practice/assessment?assessment-type=practice&assessmentId=23', type: 'practice' },
        ],
      },
      {
        id: 'azure-infrastructure',
        title: 'Azure Global Infrastructure',
        domain: 'Azure Architecture & Services',
        exam: 'AZ-900',
        weight: '35-40%',
        keyPoints: [
          'Regions and region pairs',
          'Availability Zones vs Availability Sets',
          'Geographies and data residency',
          'Sovereign regions (Government, China)',
        ],
        resources: [
          { label: 'MS Learn: Azure Architecture', url: 'https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/', type: 'learn' },
          { label: 'Azure Global Infrastructure', url: 'https://infrastructuremap.microsoft.com/', type: 'docs' },
          { label: 'Azure Regions List', url: 'https://azure.microsoft.com/en-us/explore/global-infrastructure/geographies/', type: 'docs' },
          { label: 'Availability Zones Docs', url: 'https://learn.microsoft.com/en-us/azure/reliability/availability-zones-overview', type: 'docs' },
        ],
      },
      {
        id: 'core-services',
        title: 'Core Azure Services',
        domain: 'Azure Architecture & Services',
        exam: 'AZ-900',
        weight: '35-40%',
        keyPoints: [
          'Compute: VMs, App Service, Functions, AKS, ACI',
          'Storage: Blob, Files, Queue, Table, Disk',
          'Networking: VNet, VPN, ExpressRoute, Load Balancer',
          'Databases: SQL, Cosmos DB, MySQL, PostgreSQL',
        ],
        resources: [
          { label: 'MS Learn: Azure Services', url: 'https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/', type: 'learn' },
          { label: 'Azure Products A-Z', url: 'https://azure.microsoft.com/en-us/products/', type: 'docs' },
          { label: 'Azure Storage Overview', url: 'https://learn.microsoft.com/en-us/azure/storage/common/storage-introduction', type: 'docs' },
          { label: 'Azure Compute Overview', url: 'https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/compute-decision-tree', type: 'docs' },
        ],
      },
      {
        id: 'identity-security',
        title: 'Azure Identity & Security',
        domain: 'Management & Governance',
        exam: 'AZ-900',
        weight: '30-35%',
        keyPoints: [
          'Microsoft Entra ID (Azure AD)',
          'MFA and Conditional Access',
          'Zero Trust model',
          'Defense in depth layers',
          'RBAC and least privilege',
          'Key Vault, Defender for Cloud, Sentinel',
        ],
        resources: [
          { label: 'MS Learn: Security & Identity', url: 'https://learn.microsoft.com/en-us/training/paths/describe-azure-management-governance/', type: 'learn' },
          { label: 'Microsoft Entra ID Docs', url: 'https://learn.microsoft.com/en-us/entra/identity/', type: 'docs' },
          { label: 'Zero Trust Overview', url: 'https://learn.microsoft.com/en-us/security/zero-trust/zero-trust-overview', type: 'docs' },
          { label: 'Defender for Cloud', url: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-cloud-introduction', type: 'docs' },
        ],
      },
      {
        id: 'governance',
        title: 'Governance & Compliance',
        domain: 'Management & Governance',
        exam: 'AZ-900',
        weight: '30-35%',
        keyPoints: [
          'Management Groups > Subscriptions > Resource Groups > Resources',
          'Azure Policy — enforce rules',
          'Resource Locks — prevent accidental changes',
          'Tags — cost tracking and organization',
          'Azure Advisor — free recommendations',
          'Compliance: ISO, SOC, GDPR, HIPAA',
        ],
        resources: [
          { label: 'MS Learn: Management & Governance', url: 'https://learn.microsoft.com/en-us/training/paths/describe-azure-management-governance/', type: 'learn' },
          { label: 'Azure Policy Docs', url: 'https://learn.microsoft.com/en-us/azure/governance/policy/overview', type: 'docs' },
          { label: 'Microsoft Trust Center', url: 'https://www.microsoft.com/en-us/trust-center', type: 'docs' },
          { label: 'Azure Compliance Offerings', url: 'https://learn.microsoft.com/en-us/azure/compliance/', type: 'docs' },
        ],
      },
      {
        id: 'cost-sla',
        title: 'Cost Management & SLAs',
        domain: 'Management & Governance',
        exam: 'AZ-900',
        weight: '30-35%',
        keyPoints: [
          'Pricing Calculator vs TCO Calculator',
          'Reserved Instances — up to 72% savings',
          'Spot VMs — up to 90% savings, evictable',
          'Azure Hybrid Benefit',
          'SLA math: composite SLA = multiply SLAs',
          'Availability Zones = 99.99% SLA',
        ],
        resources: [
          { label: 'Azure Pricing Calculator', url: 'https://azure.microsoft.com/en-us/pricing/calculator/', type: 'practice' },
          { label: 'Azure TCO Calculator', url: 'https://azure.microsoft.com/en-us/pricing/tco/calculator/', type: 'practice' },
          { label: 'Azure SLA Summary', url: 'https://azure.microsoft.com/en-us/support/legal/sla/summary/', type: 'docs' },
          { label: 'Azure Cost Management Docs', url: 'https://learn.microsoft.com/en-us/azure/cost-management-billing/', type: 'docs' },
        ],
      },
      {
        id: 'management-tools',
        title: 'Azure Management Tools',
        domain: 'Azure Management & Governance',
        exam: 'AZ-900',
        weight: '30-35%',
        keyPoints: [
          'Azure portal, Cloud Shell, CLI, PowerShell',
          'ARM templates and Bicep — infrastructure as code',
          'Azure Arc — manage resources outside Azure',
          'Azure Advisor, Service Health, Azure Monitor',
          'Azure Marketplace',
        ],
        resources: [
          { label: 'Azure CLI Docs', url: 'https://learn.microsoft.com/en-us/cli/azure/', type: 'docs' },
          { label: 'Azure PowerShell Docs', url: 'https://learn.microsoft.com/en-us/powershell/azure/', type: 'docs' },
          { label: 'ARM Templates Overview', url: 'https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/overview', type: 'docs' },
          { label: 'Bicep Documentation', url: 'https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview', type: 'docs' },
          { label: 'Azure Arc Overview', url: 'https://learn.microsoft.com/en-us/azure/azure-arc/overview', type: 'docs' },
        ],
      },
      {
        id: 'azure-ai-iot',
        title: 'AI, IoT & Integration Services',
        domain: 'Azure Architecture & Services',
        exam: 'AZ-900',
        weight: '35-40%',
        keyPoints: [
          'Azure Machine Learning, Cognitive Services, Azure OpenAI',
          'Azure Bot Service, Azure AI Search',
          'Azure IoT Hub, IoT Central, Azure Sphere',
          'Azure Event Grid, Event Hubs, Service Bus',
          'Azure Logic Apps, Azure Functions integration',
        ],
        resources: [
          { label: 'Azure AI Services Docs', url: 'https://learn.microsoft.com/en-us/azure/ai-services/', type: 'docs' },
          { label: 'Azure IoT Hub Docs', url: 'https://learn.microsoft.com/en-us/azure/iot-hub/', type: 'docs' },
          { label: 'Azure Integration Services', url: 'https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messaging-overview', type: 'docs' },
          { label: 'MS Learn: AI Fundamentals (AI-900)', url: 'https://learn.microsoft.com/en-us/training/paths/get-started-with-artificial-intelligence-on-azure/', type: 'learn' },
        ],
      },
    ],
  },
  {
    id: 'az104',
    title: 'AZ-104',
    level: 'Azure Administrator',
    topics: [
      {
        id: 'azure-ad-admin',
        title: 'Identity & Governance',
        domain: 'Manage Azure identities and governance',
        exam: 'AZ-104',
        weight: '15-20%',
        keyPoints: [
          'Users, groups, service principals, managed identities',
          'Dynamic groups, bulk operations',
          'MFA via Conditional Access policies',
          'SSPR — Self-Service Password Reset',
          'Administrative Units',
          'Entra ID tiers: Free, P1, P2',
        ],
        resources: [
          { label: 'MS Learn: AZ-104 Identity', url: 'https://learn.microsoft.com/en-us/training/paths/az-104-manage-identities-governance/', type: 'learn' },
          { label: 'AZ-104 Study Guide', url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-104', type: 'docs' },
          { label: 'Entra ID Documentation', url: 'https://learn.microsoft.com/en-us/entra/identity/', type: 'docs' },
          { label: 'AZ-104 Practice Assessment', url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/practice/assessment?assessment-type=practice&assessmentId=21', type: 'practice' },
        ],
      },
      {
        id: 'storage-admin',
        title: 'Storage',
        domain: 'Implement and manage storage',
        exam: 'AZ-104',
        weight: '15-20%',
        keyPoints: [
          'Storage account types and tiers (Hot/Cool/Cold/Archive)',
          'Redundancy: LRS, ZRS, GRS, GZRS',
          'SAS tokens — scoped, time-limited access',
          'Lifecycle management policies',
          'Azure Files + File Sync',
          'AzCopy, Storage Explorer, Data Box',
        ],
        resources: [
          { label: 'MS Learn: AZ-104 Storage', url: 'https://learn.microsoft.com/en-us/training/paths/az-104-manage-storage/', type: 'learn' },
          { label: 'Azure Storage Docs', url: 'https://learn.microsoft.com/en-us/azure/storage/', type: 'docs' },
          { label: 'Storage Redundancy Options', url: 'https://learn.microsoft.com/en-us/azure/storage/common/storage-redundancy', type: 'docs' },
          { label: 'Azure Storage Explorer (Free Tool)', url: 'https://azure.microsoft.com/en-us/products/storage/storage-explorer/', type: 'practice' },
        ],
      },
      {
        id: 'compute-admin',
        title: 'Compute',
        domain: 'Deploy and manage Azure compute resources',
        exam: 'AZ-104',
        weight: '20-25%',
        keyPoints: [
          'VM sizes, disk types (Standard HDD/SSD, Premium SSD, Ultra)',
          'Availability Sets vs Availability Zones vs VMSS',
          'VM Scale Sets with autoscale rules',
          'VM extensions (Custom Script, DSC)',
          'Deallocate vs Stop (billing difference)',
          'App Service plans, deployment slots',
        ],
        resources: [
          { label: 'MS Learn: AZ-104 Compute', url: 'https://learn.microsoft.com/en-us/training/paths/az-104-manage-compute-resources/', type: 'learn' },
          { label: 'VM Sizes Documentation', url: 'https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/overview', type: 'docs' },
          { label: 'Azure App Service Docs', url: 'https://learn.microsoft.com/en-us/azure/app-service/', type: 'docs' },
          { label: 'VM Scale Sets Docs', url: 'https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/overview', type: 'docs' },
        ],
      },
      {
        id: 'networking-admin',
        title: 'Networking',
        domain: 'Implement and manage virtual networking',
        exam: 'AZ-104',
        weight: '20-25%',
        keyPoints: [
          'VNet, subnets, CIDR notation',
          'NSGs and ASGs — inbound/outbound rules',
          'VNet Peering — not transitive',
          'VPN Gateway: S2S, P2S, VNet-to-VNet',
          'ExpressRoute — private dedicated link',
          'Load Balancer (L4) vs Application Gateway (L7)',
        ],
        resources: [
          { label: 'MS Learn: AZ-104 Networking', url: 'https://learn.microsoft.com/en-us/training/paths/az-104-manage-virtual-networks/', type: 'learn' },
          { label: 'Azure VNet Docs', url: 'https://learn.microsoft.com/en-us/azure/virtual-network/', type: 'docs' },
          { label: 'NSG Documentation', url: 'https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview', type: 'docs' },
          { label: 'VPN Gateway Docs', url: 'https://learn.microsoft.com/en-us/azure/vpn-gateway/', type: 'docs' },
        ],
      },
      {
        id: 'monitor-backup',
        title: 'Monitor & Backup',
        domain: 'Monitor and maintain Azure resources',
        exam: 'AZ-104',
        weight: '10-15%',
        keyPoints: [
          'Azure Monitor: metrics vs logs',
          'Log Analytics + KQL queries',
          'Alerts with Action Groups',
          'Azure Monitor Agent (replaces MMA)',
          'Recovery Services Vault + backup policies',
          'Azure Site Recovery — RPO/RTO',
        ],
        resources: [
          { label: 'MS Learn: AZ-104 Monitor', url: 'https://learn.microsoft.com/en-us/training/paths/az-104-monitor-backup-resources/', type: 'learn' },
          { label: 'Azure Monitor Docs', url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/', type: 'docs' },
          { label: 'KQL Quick Reference', url: 'https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/kql-quick-reference', type: 'docs' },
          { label: 'Azure Backup Docs', url: 'https://learn.microsoft.com/en-us/azure/backup/', type: 'docs' },
          { label: 'Azure Site Recovery Docs', url: 'https://learn.microsoft.com/en-us/azure/site-recovery/', type: 'docs' },
        ],
      },
      {
        id: 'arm-automation',
        title: 'ARM Templates & Automation',
        domain: 'Deploy and manage Azure compute resources',
        exam: 'AZ-104',
        weight: '20-25%',
        keyPoints: [
          'ARM template structure: schema, contentVersion, parameters, variables, resources, outputs',
          'Bicep: simplified ARM syntax, az deployment group create',
          'Azure Automation: runbooks, DSC, update management',
          'Azure Policy remediation tasks',
          'Deployment modes: incremental vs complete',
          'Linked and nested templates',
        ],
        resources: [
          { label: 'MS Learn: AZ-104 Compute & IaC', url: 'https://learn.microsoft.com/en-us/training/paths/az-104-manage-compute-resources/', type: 'learn' },
          { label: 'Bicep Playground (browser)', url: 'https://aka.ms/bicepdemo', type: 'practice' },
          { label: 'ARM Template Docs', url: 'https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/', type: 'docs' },
          { label: 'Azure Automation Docs', url: 'https://learn.microsoft.com/en-us/azure/automation/', type: 'docs' },
          { label: 'Bicep Documentation', url: 'https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/', type: 'docs' },
        ],
      },
      {
        id: 'advanced-networking',
        title: 'Advanced Networking',
        domain: 'Implement and manage virtual networking',
        exam: 'AZ-104',
        weight: '20-25%',
        keyPoints: [
          'Service Endpoints vs Private Endpoints',
          'Azure Bastion — RDP/SSH without public IP',
          'Azure Firewall — managed stateful firewall',
          'User-Defined Routes (UDR) and route tables',
          'Network Watcher: IP flow verify, connection troubleshoot, packet capture',
          'Azure Private DNS resolver',
          'BGP with VPN Gateway',
        ],
        resources: [
          { label: 'MS Learn: AZ-104 Advanced Networking', url: 'https://learn.microsoft.com/en-us/training/paths/az-104-manage-virtual-networks/', type: 'learn' },
          { label: 'Azure Bastion Docs', url: 'https://learn.microsoft.com/en-us/azure/bastion/', type: 'docs' },
          { label: 'Azure Firewall Docs', url: 'https://learn.microsoft.com/en-us/azure/firewall/', type: 'docs' },
          { label: 'Private Endpoint Docs', url: 'https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview', type: 'docs' },
          { label: 'Network Watcher Docs', url: 'https://learn.microsoft.com/en-us/azure/network-watcher/', type: 'docs' },
        ],
      },
    ],
  },
]

export function getTopicById(topicId: string): Topic | undefined {
  for (const exam of curriculum) {
    const topic = exam.topics.find((t) => t.id === topicId)
    if (topic) return topic
  }
}
