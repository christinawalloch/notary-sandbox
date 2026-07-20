// ─── Types ────────────────────────────────────────────────────────────────────

export type AccountStatus = 'active' | 'denylisted' | 'closed' | 'restricted';

export interface SharedEvidence {
  type: 'Device' | 'SSN' | 'IDV' | 'Phone' | 'Bank Account' | 'Debit' | 'EIN';
  token: string;
}

export interface Account {
  id: string;          // C_xxxxxxxx
  accountToken?: string; // AH_xxxxxxxx
  displayName: string;
  legalName?: string;
  status: AccountStatus;
  verified?: boolean;
  avatarColor?: string;
  email?: string;
  phone?: string;
  address?: string;
  joined?: string;
  complianceTags?: string[];
  regulator?: string;
  denylistDetails?: {
    deniedDate: string;
    reason: string;
    reasonCode: string;
    denylistedBy: string;
    appealStatus?: string;
    appealDate?: string;
    priorEvents: number;
    riskTier: string;
    caseId?: string;
    scope?: string;
    issuedBy?: string;
  };
}

export interface ConnectedAccount extends Account {
  sharedEvidence?: SharedEvidence[];
  verified?: boolean;
  l30Activity?: string;
}

export interface AlertDetail {
  label: string;
  value: string;
}

export interface Alert {
  id: string;
  accountId: string;
  created: string;
  typology?: string;
  executionLabel?: string;
  ruleId?: string;
  ruleName?: string;
  riskScore?: number;
  shortLabel?: string;
  triggerSummary?: string;
  details?: AlertDetail[];
  queueReason?: string;
}

export interface AssetHistoryEvent {
  date: string;
  action: string;
  actor?: string;
  note?: string;
}

export interface AssetIdentifier {
  id: string;
  type: string;
  tokenShort?: string;
  token: string;
  added: string;
  isUnlinked?: boolean;
  isDenylisted?: boolean;
  maskedId?: string;
  fideliusToken?: string;
  denylistReason?: string;
  hasExternalLink?: boolean;
  hasInfoIcon?: boolean;
  connectedCount?: number;
  processorLabel?: string;
  unlinkedAt?: string;
  unlinkReason?: string;
  history?: AssetHistoryEvent[];
}

export interface AdversityRecord {
  id: string;
  issuedBy: string;
  issuedAt: string;
  type: string;
  organization: string;
  reasons?: string[];
  reasonCodes?: string[];
  revokedBy?: string;
  revokedAt?: string;
  revokeReason?: string;
}

export interface IDVAttempt {
  id: string;
  created: string;
  decision: 'VERIFIED' | 'FAILED' | 'MANUAL REVIEW';
  name: string;
  birthDate: string;
  source: string;
  last4SSN: string;
  documents: string[];
}

export interface Transaction {
  id: string;
  date: string;
  type: string;
  amount: string;
  direction: 'IN' | 'OUT';
  counterparty: string;
  counterpartyToken?: string;
  status: string;
  note?: string;
}

export interface DenylistInfo {
  appealSource: string;
  routingReason: string;
  appealedAction: string;
  appliedBy: string;
  deniedDate: string;
  appealDate: string;
  activeScope: string;
  reasonCode: string;
}

export interface TimelineEvent {
  id: string;
  actorLabel: string;
  actorInitial: string;
  actorColor: string;
  action: string;
  field: string;
  timestamp: string;
  detail?: string;
}

export interface AIInsightItem {
  id: string;
  label: string;
  badge?: 'flagged' | 'clear' | 'info';
  badgeLabel?: string;
  finding: string;
  evidenceDetail?: string;
  detailText?: string;
  detailBullets?: string[];
}

export interface AIInsightGroup {
  id: string;
  title: string;
  count: number;
  defaultOpen?: boolean;
  items: AIInsightItem[];
}

export interface Assignment {
  id: string;
  numericId: string;
  status: 'pending' | 'claimed' | 'standby' | 'completed' | 'overdue';
  queueName: string;
  queueSlug: string;
  caseId: string;
  createdAt: string;
  createdRelative: string;
  dueAt: string;
  dueRelative: string;
  dueOverdue?: boolean;
  createdBy: string;
  claimedBy?: string;
  linkedAssignments?: number;
  tags?: string[];
  customer?: Account;
  primarySubject?: ConnectedAccount;
  connectedSubjects?: ConnectedAccount[];
  alerts?: Alert[];
  denylistInfo?: DenylistInfo;
  aiInsights?: AIInsightGroup[];
  assets?: AssetIdentifier[];
  adversityHistory?: AdversityRecord[];
  adversityHistoryByAccount?: Record<string, AdversityRecord[]>;
  idvAttempts?: Record<string, IDVAttempt[]>;
  transactions?: Record<string, Transaction[]>;
  timelineEvents?: TimelineEvent[];
}

export interface QueueStat {
  available: number;
  pending: number;
  claimed: number;
  overdue: number;
  standby?: number;
  awaitingApproval?: number;
  completed?: number;
  total: number;
}

export interface Queue {
  id: string;
  name: string;
  description: string;
  slug: string;
  route: string;
  stats: QueueStat;
  priority: 'High' | 'Medium' | 'Default';
  slaLabel: string;
  indicatorColor: string;
}

// ─── Queues ───────────────────────────────────────────────────────────────────

export const QUEUES: Queue[] = [
  {
    id: 'global-appeals',
    name: 'Global Appeals',
    description: 'Review customer restrictions for revocation or restoration across denylist categories.',
    slug: 'global_appeals_demo',
    route: '/assignments/global-appeals',
    stats: { available: 12, pending: 8, claimed: 3, overdue: 1, standby: 0, total: 24 },
    priority: 'High',
    slaLabel: '10-day SLA',
    indicatorColor: '#f59e0b',
  },
  {
    id: 'global-appeals-scam-v0',
    name: 'Global Appeals Scam V0',
    description: 'Scam-focused appeals review without denylist context — streamlined evidence view.',
    slug: 'global_appeals_scam_v0_demo',
    route: '/assignments/global-appeals-scam-v0',
    stats: { available: 9, pending: 6, claimed: 2, overdue: 0, standby: 0, total: 17 },
    priority: 'High',
    slaLabel: '10-day SLA',
    indicatorColor: '#f59e0b',
  },
  {
    id: 'scams-l1',
    name: 'Scams L1',
    description: 'High-volume scam report triage assisted by structured AI findings.',
    slug: 'scams_l1_demo',
    route: '/assignments/scams-l1',
    stats: { available: 47, pending: 41, claimed: 5, overdue: 3, total: 96 },
    priority: 'Default',
    slaLabel: '48h SLA',
    indicatorColor: '#12B76A',
  },
  {
    id: 'scams-l2',
    name: 'Scams L2',
    description: 'Escalated scam investigations requiring deeper evidence review and complex decisioning.',
    slug: 'scams_l2_demo',
    route: '/assignments/scams-l2',
    stats: { available: 8, pending: 6, claimed: 2, overdue: 0, total: 16 },
    priority: 'High',
    slaLabel: '5-day SLA',
    indicatorColor: '#6366f1',
  },
  {
    id: 'sar-ai',
    name: 'SAR with AI Insights',
    description: 'Structured investigation across subjects and accounts with AI-assisted narrative support.',
    slug: 'sar_ai_demo',
    route: '/assignments/sar-ai',
    stats: { available: 4, pending: 3, claimed: 1, overdue: 0, total: 8 },
    priority: 'High',
    slaLabel: '30-day SLA',
    indicatorColor: '#8b5cf6',
  },
  {
    id: 'npid-bau',
    name: 'NPID BAU / Multi-account Decisioning',
    description: 'Risk investigation with explicit multi-account scope declaration before adverse action.',
    slug: 'npid_bau_demo',
    route: '/assignments/npid-bau',
    stats: { available: 19, pending: 14, claimed: 4, overdue: 2, total: 39 },
    priority: 'Default',
    slaLabel: '72h SLA',
    indicatorColor: '#0ea5e9',
  },
  {
    id: 'npid-verification',
    name: 'NPID Cluster Verification',
    description: 'Specialist review of model-generated identity clusters to confirm or correct membership.',
    slug: 'npid_verification_demo',
    route: '/assignments/npid-verification',
    stats: { available: 6, pending: 5, claimed: 1, overdue: 0, awaitingApproval: 2, total: 14 },
    priority: 'Default',
    slaLabel: '5-day SLA',
    indicatorColor: '#64748b',
  },
];

// ─── Mock assignments ──────────────────────────────────────────────────────────

export const ASSIGNMENTS: Record<string, Assignment> = {

  'global-appeals': {
    id: 'global-appeals',
    numericId: '2305171',
    status: 'pending',
    queueName: 'Global Appeals: Scam',
    queueSlug: 'global_appeals_demo',
    caseId: 'NTRY_CASE_x4Rm8qWpzA',
    createdAt: 'Jul 10, 2026',
    createdRelative: '7 days ago',
    dueAt: 'Jul 24, 2026',
    dueRelative: 'in 7 days',
    dueOverdue: false,
    createdBy: 'system',
    linkedAssignments: 1,
    tags: [],
    denylistInfo: {
      appealSource: 'Customer appeal · CF1 case #843921',
      routingReason: 'Scam-related activity',
      appealedAction: 'Account denylist',
      appliedBy: 'Automated Risk controls',
      deniedDate: 'Aug 14, 2025',
      appealDate: 'Sep 29, 2025',
      activeScope: '1 account · 1 identity asset',
      reasonCode: 'SCAM_DENYLIST_L1',
    },
    customer: {
      id: 'C_r4xw8mhkq',
      accountToken: 'AH_m3xw8rkhq',
      displayName: 'Mei Chen',
      legalName: 'Mei Chen',
      status: 'denylisted',
      verified: true,
      email: 'mei.chen.ca@example.com',
      phone: '(415) 555-0142',
      joined: '3 years ago (Oct 12, 2022)',
      address: '847 Clement St, San Francisco, CA 94118, US',
      regulator: 'FinCEN',
      avatarColor: '#6366f1',
      complianceTags: ['PERSONAL', 'SSN', 'GOLD', 'VERIFIED'],
    },
    primarySubject: {
      id: 'C_r4xw8mhkq',
      displayName: 'Mei Chen',
      legalName: 'Mei Chen',
      status: 'denylisted',
      avatarColor: '#6366f1',
      denylistDetails: {
        deniedDate: 'Aug 14, 2025',
        reason: 'Scam-related activity',
        reasonCode: 'SCAM_DENYLIST_L1',
        denylistedBy: 'Risk Ops — Automated (alert-broker)',
        appealStatus: 'Under Review',
        appealDate: 'Sep 29, 2025',
        priorEvents: 0,
        riskTier: 'High',
        caseId: 'NTRY_CASE_x4Rm8qWpzA',
        scope: 'Account-level adversity',
        issuedBy: 'Risk Operations',
      },
    },
    connectedSubjects: [
      {
        id: 'C_8ph2tn5yq',
        displayName: 'Liang Wei',
        legalName: 'Liang Wei',
        status: 'active',
        avatarColor: '#12B76A',
        sharedEvidence: [
          { type: 'SSN', token: 'fid-1-a8c4f2e1b3...' },
          { type: 'Device', token: 'dev-3F90A1C2...' },
        ],
        l30Activity: 'L30 active',
      },
      {
        id: 'C_5kw3bj9xp',
        displayName: 'Sam Park',
        legalName: 'Sam Park',
        status: 'active',
        avatarColor: '#f59e0b',
        sharedEvidence: [
          { type: 'Device', token: 'dev-3F90A1C2...' },
          { type: 'Phone', token: 'ph-4155550189...' },
        ],
        verified: false,
        l30Activity: 'L30 active',
      },
      {
        id: 'C_2nj8wk1dv',
        displayName: 'Xiao Liu',
        legalName: 'Xiao Liu',
        status: 'denylisted',
        avatarColor: '#0ea5e9',
        sharedEvidence: [
          { type: 'Device', token: 'dev-3F90A1C2...' },
        ],
        verified: false,
        l30Activity: 'No L30 activity',
        denylistDetails: {
          deniedDate: 'Mar 3, 2025',
          reason: 'Money Mule — Coordinated Network',
          reasonCode: 'MONEY_MULE_COORD_L2',
          denylistedBy: 'Financial Crimes Unit — Manual Review',
          appealStatus: undefined,
          appealDate: undefined,
          priorEvents: 2,
          riskTier: 'Critical',
          caseId: 'NTRY_CASE_mL9pXrBk2T',
          scope: 'Account-level adversity',
          issuedBy: 'Financial Crimes Unit',
        },
      },
      {
        id: 'C_9mq4zv7wr',
        displayName: 'Alex Morgan',
        legalName: 'Alex Morgan',
        status: 'active',
        avatarColor: '#8b5cf6',
        sharedEvidence: [
          { type: 'Phone', token: 'ph-4155550189...' },
        ],
        l30Activity: 'L30 active',
      },
    ],
    alerts: [
      { id: '4821073', accountId: 'C_r4xw8mhkq', created: 'Aug 14, 2025', executionLabel: 'Execution Details' },
    ],
    assets: [
      {
        id: 'asset-email',
        type: 'Email',
        tokenShort: 'mei.chen.ca',
        token: 'mei.chen.ca@example.com',
        added: 'Jan 11, 2024 at 8:46 PM',
        history: [
          { date: 'Jan 11, 2024 at 8:46 PM', action: 'Added', actor: 'system', note: 'Email collected at account registration.' },
          { date: 'Jan 11, 2024 at 9:02 PM', action: 'Verified', actor: 'system', note: 'Verification link clicked.' },
          { date: 'Feb 27, 2025 at 11:34 AM', action: 'Updated', actor: 'Mei Chen', note: 'Email re-confirmed after 2FA reset.' },
        ],
      },
      {
        id: 'asset-phone',
        type: 'Phone',
        tokenShort: '...0142',
        token: '(415) 555-0142',
        added: 'Jan 11, 2024 at 8:47 PM',
        history: [
          { date: 'Jan 11, 2024 at 8:47 PM', action: 'Added', actor: 'system', note: 'Phone number collected at registration.' },
          { date: 'Aug 5, 2025 at 2:15 PM', action: 'Updated', actor: 'Mei Chen', note: 'Phone updated after device replacement.' },
        ],
      },
      {
        id: 'asset-device',
        type: 'Device ID',
        tokenShort: '...d80afcf8',
        token: 'ff710c288e500fe3631dc0b9ebe4d654d80afcf8',
        added: 'Aug 5, 2025 at 2:18 PM',
        history: [
          { date: 'Aug 5, 2025 at 2:18 PM', action: 'Added', actor: 'system', note: 'New device fingerprint captured after account recovery.' },
          { date: 'Aug 14, 2025 at 2:30 PM', action: 'Flagged', actor: 'alert-broker', note: 'Associated with scam-related activity detection rule RT-4821.' },
        ],
      },
      {
        id: 'asset-ssn',
        type: 'SSN (Last 4)',
        tokenShort: '...6892',
        token: '',
        maskedId: '***-**-6892',
        fideliusToken: '....a3f2c8d1',
        added: 'Jan 11, 2024 at 8:44 PM',
        connectedCount: 2,
        history: [
          { date: 'Jan 11, 2024 at 8:44 PM', action: 'Added', actor: 'system', note: 'SSN token created via Fidelius at identity verification.' },
          { date: 'Jan 11, 2024 at 8:44 PM', action: 'IDV passed', actor: 'Persona', note: 'Identity document verified successfully.' },
          { date: 'Aug 14, 2025 at 2:31 PM', action: 'Flagged', actor: 'alert-broker', note: 'SSN matched to scam-related activity network. Reason: SCAM_DENYLIST_L1.' },
        ],
      },
      {
        id: 'asset-bank',
        type: 'Chase (Checking)',
        tokenShort: '...4821',
        token: 'Account ending in 4821',
        added: 'Jan 11, 2024 at 8:50 PM',
        isDenylisted: true,
        denylistReason: 'Account restricted following scam-related activity detection. All money movement suspended pending review.',
        history: [
          { date: 'Jan 11, 2024 at 8:50 PM', action: 'Added', actor: 'system', note: 'Bank account linked at account setup.' },
          { date: 'Aug 14, 2025 at 2:31 PM', action: 'Denylisted', actor: 'Risk Ops — Automated', note: 'Bank account restricted as part of scam denylist action.' },
        ],
      },
      {
        id: 'asset-card',
        type: 'Cash Card',
        tokenShort: '...4821',
        token: 'ending in 4821',
        added: 'Jan 11, 2024 at 8:51 PM',
        isUnlinked: true,
        unlinkedAt: 'Aug 14, 2025 at 2:31 PM',
        unlinkReason: 'Card deactivated following scam-related denylist action',
        processorLabel: 'Marqeta',
        connectedCount: 1,
        history: [
          { date: 'Jan 11, 2024 at 8:51 PM', action: 'Added', actor: 'system', note: 'Cash Card issued at account setup.' },
          { date: 'Aug 14, 2025 at 2:31 PM', action: 'Unlinked', actor: 'Risk Ops — Automated', note: 'Cash Card deactivated as part of scam denylist action.' },
        ],
      },
      {
        id: 'asset-email-old',
        type: 'Previous Email',
        tokenShort: 'mei.chen',
        token: 'mei.chen@gmail.com',
        added: 'Oct 12, 2022 at 9:15 AM',
        isUnlinked: true,
        unlinkedAt: 'Jan 10, 2024 at 3:40 PM',
        unlinkReason: 'Customer requested change',
      },
      {
        id: 'asset-device-stolen',
        type: 'Previous Device ID',
        tokenShort: '...c111f162',
        token: 'b51b6f87466def71227aa7f10b2df9acc111f162',
        added: 'Apr 7, 2024 at 11:07 PM',
        isUnlinked: true,
        unlinkedAt: 'Jul 18, 2025 at 10:22 AM',
        unlinkReason: 'Device reported stolen',
      },
    ],
    adversityHistory: [
      {
        id: 'adv-1',
        issuedBy: 'Risk Ops',
        issuedAt: 'Aug 14, 2025  2:31 pm',
        type: 'DENYLIST',
        organization: 'AUTOMATED',
        reasons: ['Scam-related activity — account-level sweep'],
        reasonCodes: ['SCAM_DENYLIST_L1'],
        revokedBy: 'L2 Review — Compliance',
        revokeReason: 'Successful appeal — identity verified',
      },
      {
        id: 'adv-2',
        issuedBy: 'Risk Ops',
        issuedAt: 'Aug 14, 2025  2:31 pm',
        type: 'DENYLIST',
        organization: 'AUTOMATED',
        reasons: ['Scam-related activity — identity / SSN ending 6892'],
        reasonCodes: ['SCAM_DENYLIST_L1'],
        revokedBy: '—',
        revokeReason: 'Shared identity — remains active',
      },
    ],
    adversityHistoryByAccount: {
      'C_r4xw8mhkq': [
        {
          id: 'adv-1',
          issuedBy: 'Risk Ops',
          issuedAt: 'Aug 14, 2025',
          type: 'DENYLIST',
          organization: 'AUTOMATED',
          reasons: ['Scam-related activity — account-level sweep'],
          reasonCodes: ['SCAM_DENYLIST_L1'],
          revokedBy: 'L2 Review — Compliance',
          revokedAt: '—',
          revokeReason: 'Successful appeal — identity verified',
        },
        {
          id: 'adv-2',
          issuedBy: 'Risk Ops',
          issuedAt: 'Aug 14, 2025',
          type: 'DENYLIST',
          organization: 'AUTOMATED',
          reasons: ['Scam-related activity — identity / SSN ending 6892'],
          reasonCodes: ['SCAM_DENYLIST_L1'],
          revokedBy: '—',
          revokedAt: '—',
          revokeReason: 'Shared identity — remains active',
        },
      ],
      'C_2nj8wk1dv': [
        {
          id: 'adv-x1',
          issuedBy: 'Financial Crimes',
          issuedAt: 'Mar 3, 2025',
          type: 'DENYLIST',
          organization: 'MANUAL',
          reasons: ['Money Mule — Coordinated Network'],
          reasonCodes: ['MONEY_MULE_COORD_L2'],
          revokedBy: undefined,
          revokedAt: undefined,
          revokeReason: undefined,
        },
        {
          id: 'adv-x2',
          issuedBy: 'Risk Ops',
          issuedAt: 'Oct 12, 2024',
          type: 'STRIKE',
          organization: 'AUTOMATED',
          reasons: ['Suspicious transfer activity'],
          reasonCodes: ['SUSPICIOUS_ACTIVITY_L1'],
          revokedBy: 'Risk Ops',
          revokedAt: 'Nov 5, 2024',
          revokeReason: 'False positive — cleared on review',
        },
      ],
    },
    idvAttempts: {
      'C_r4xw8mhkq': [
        {
          id: 'idv-m1',
          created: 'Jan 11, 2024',
          decision: 'VERIFIED',
          name: 'Mei Chen',
          birthDate: 'Mar 14, 1990',
          source: 'Persona',
          last4SSN: '6892',
          documents: ['CA Driver License'],
        },
        {
          id: 'idv-m2',
          created: 'Aug 14, 2025',
          decision: 'FAILED',
          name: 'Mei Chen',
          birthDate: 'Mar 14, 1990',
          source: 'Persona',
          last4SSN: '6892',
          documents: ['CA Driver License'],
        },
      ],
      'C_2nj8wk1dv': [
        {
          id: 'idv-x1',
          created: 'Feb 28, 2025',
          decision: 'MANUAL REVIEW',
          name: 'Xiao Liu',
          birthDate: 'Nov 22, 1987',
          source: 'Persona',
          last4SSN: '4417',
          documents: ['Passport'],
        },
      ],
    },
    transactions: {
      'C_r4xw8mhkq': [
        { id: 'txn-m1', date: 'Jun 15, 2025', type: 'P2P Transfer', amount: '$50.00', direction: 'OUT', counterparty: '@jess.w', counterpartyToken: 'C_9w2jk8px', status: 'Completed' },
        { id: 'txn-m2', date: 'Jun 12, 2025', type: 'P2P Transfer', amount: '$200.00', direction: 'IN', counterparty: '@david.k', counterpartyToken: 'C_4nm3qf7r', status: 'Completed' },
        { id: 'txn-m3', date: 'Jun 10, 2025', type: 'Cash Out', amount: '$100.00', direction: 'OUT', counterparty: 'Chase ****4821', status: 'Completed' },
        { id: 'txn-m4', date: 'May 28, 2025', type: 'P2P Transfer', amount: '$25.00', direction: 'OUT', counterparty: '@sarah.t', counterpartyToken: 'C_7xp4wr2k', status: 'Completed' },
        { id: 'txn-m5', date: 'May 20, 2025', type: 'P2P Transfer', amount: '$150.00', direction: 'IN', counterparty: '@tony.m', counterpartyToken: 'C_2bq8nf1v', status: 'Completed' },
        { id: 'txn-m6', date: 'May 15, 2025', type: 'Cash In', amount: '$500.00', direction: 'IN', counterparty: 'Employer Direct Deposit', status: 'Completed' },
        { id: 'txn-m7', date: 'Apr 30, 2025', type: 'P2P Transfer', amount: '$35.00', direction: 'OUT', counterparty: '@mike.r', counterpartyToken: 'C_6wr3nk0q', status: 'Completed' },
        { id: 'txn-m8', date: 'Apr 22, 2025', type: 'P2P Transfer', amount: '$80.00', direction: 'IN', counterparty: '@lisa.h', counterpartyToken: 'C_1pt9qw5j', status: 'Completed' },
        { id: 'txn-m9', date: 'Apr 10, 2025', type: 'Cash Out', amount: '$200.00', direction: 'OUT', counterparty: 'Chase ****4821', status: 'Completed' },
        { id: 'txn-m10', date: 'Mar 25, 2025', type: 'P2P Transfer', amount: '$15.00', direction: 'OUT', counterparty: '@grace.l', counterpartyToken: 'C_8fw2mk4n', status: 'Completed' },
        { id: 'txn-m11', date: 'Mar 18, 2025', type: 'P2P Transfer', amount: '$300.00', direction: 'IN', counterparty: '@wei.chen', counterpartyToken: 'C_3nq7vk9x', status: 'Completed' },
        { id: 'txn-m12', date: 'Mar 5, 2025', type: 'Cash In', amount: '$500.00', direction: 'IN', counterparty: 'Employer Direct Deposit', status: 'Completed' },
      ],
      'C_2nj8wk1dv': [
        { id: 'txn-x1', date: 'Mar 3, 2025  11:42 AM', type: 'P2P Transfer', amount: '$950.00', direction: 'OUT', counterparty: '$meic_temp', status: 'Completed', note: 'Rapid transfer' },
        { id: 'txn-x2', date: 'Mar 3, 2025  11:38 AM', type: 'P2P Transfer', amount: '$950.00', direction: 'IN', counterparty: '$qfund_82', status: 'Completed', note: 'Pass-through detected' },
        { id: 'txn-x3', date: 'Mar 3, 2025  9:15 AM', type: 'P2P Transfer', amount: '$1,000.00', direction: 'OUT', counterparty: '$paylink9', status: 'Completed' },
        { id: 'txn-x4', date: 'Mar 2, 2025  8:55 PM', type: 'P2P Transfer', amount: '$1,000.00', direction: 'IN', counterparty: '$send_r41', status: 'Completed', note: 'Pass-through detected' },
        { id: 'txn-x5', date: 'Mar 2, 2025  4:22 PM', type: 'P2P Transfer', amount: '$800.00', direction: 'OUT', counterparty: '$xfer_acc', status: 'Completed' },
        { id: 'txn-x6', date: 'Mar 2, 2025  9:10 AM', type: 'P2P Transfer', amount: '$800.00', direction: 'IN', counterparty: '$src_ql29', status: 'Completed', note: 'Pass-through detected' },
        { id: 'txn-x7', date: 'Mar 1, 2025  11:58 PM', type: 'P2P Transfer', amount: '$500.00', direction: 'OUT', counterparty: '$msend_01', status: 'Completed' },
        { id: 'txn-x8', date: 'Mar 1, 2025  11:48 PM', type: 'P2P Transfer', amount: '$500.00', direction: 'IN', counterparty: '$inflow88', status: 'Completed', note: 'Pass-through detected' },
        { id: 'txn-x9', date: 'Feb 28, 2025  6:04 PM', type: 'P2P Transfer', amount: '$1,200.00', direction: 'OUT', counterparty: '$chain_99', status: 'Completed' },
        { id: 'txn-x10', date: 'Feb 28, 2025  5:55 PM', type: 'P2P Transfer', amount: '$1,200.00', direction: 'IN', counterparty: '$rapid_tt', status: 'Completed', note: 'Pass-through detected' },
        { id: 'txn-x11', date: 'Feb 27, 2025  2:31 PM', type: 'Cash In', amount: '$2,500.00', direction: 'IN', counterparty: 'ACH (Unknown originator)', status: 'Completed' },
        { id: 'txn-x12', date: 'Feb 26, 2025', type: 'P2P Transfer', amount: '$2,400.00', direction: 'OUT', counterparty: '$payout_2', status: 'Completed' },
      ],
    },
  },

  'global-appeals-scam-v0': {
    id: 'global-appeals-scam-v0',
    numericId: '2305172',
    status: 'pending',
    queueName: 'Global Appeals Scam V0',
    queueSlug: 'global_appeals_scam_v0_demo',
    caseId: 'NTRY_CASE_x4Rm8qWpzB',
    createdAt: 'Jul 13, 2026',
    createdRelative: '4 days ago',
    dueAt: 'Jul 22, 2026',
    dueRelative: 'in 5 days',
    dueOverdue: false,
    createdBy: 'system',
    linkedAssignments: 1,
    tags: [],
    customer: {
      id: 'C_r4xw8mhkq',
      accountToken: 'AH_m3xw8rkhq',
      displayName: 'Mei Chen',
      legalName: 'Mei Chen',
      status: 'denylisted',
      verified: true,
      email: 'mei.chen.ca@example.com',
      phone: '(415) 555-0142',
      joined: '3 years ago (Oct 12, 2022)',
      address: '847 Clement St, San Francisco, CA 94118, US',
      regulator: 'FinCEN',
      avatarColor: '#6366f1',
      complianceTags: ['PERSONAL', 'SSN', 'GOLD', 'VERIFIED'],
    },
    primarySubject: {
      id: 'C_r4xw8mhkq',
      displayName: 'Mei Chen',
      legalName: 'Mei Chen',
      status: 'denylisted',
      avatarColor: '#6366f1',
      denylistDetails: {
        deniedDate: 'Aug 14, 2025',
        reason: 'Scam-related activity',
        reasonCode: 'SCAM_DENYLIST_L1',
        denylistedBy: 'Risk Ops — Automated (alert-broker)',
        appealStatus: 'Under Review',
        appealDate: 'Sep 29, 2025',
        priorEvents: 0,
        riskTier: 'High',
        caseId: 'NTRY_CASE_x4Rm8qWpzB',
        scope: 'Account-level adversity',
        issuedBy: 'Risk Operations',
      },
    },
    connectedSubjects: [
      {
        id: 'C_8ph2tn5yq',
        displayName: 'Liang Wei',
        legalName: 'Liang Wei',
        status: 'active',
        avatarColor: '#12B76A',
        sharedEvidence: [
          { type: 'SSN', token: 'fid-1-a8c4f2e1b3...' },
          { type: 'Device', token: 'dev-3F90A1C2...' },
        ],
        l30Activity: 'L30 active',
      },
      {
        id: 'C_5kw3bj9xp',
        displayName: 'Sam Park',
        legalName: 'Sam Park',
        status: 'active',
        avatarColor: '#f59e0b',
        sharedEvidence: [
          { type: 'Device', token: 'dev-3F90A1C2...' },
          { type: 'Phone', token: 'ph-4155550189...' },
        ],
        verified: false,
        l30Activity: 'L30 active',
      },
      {
        id: 'C_2nj8wk1dv',
        displayName: 'Xiao Liu',
        legalName: 'Xiao Liu',
        status: 'denylisted',
        avatarColor: '#0ea5e9',
        sharedEvidence: [
          { type: 'Device', token: 'dev-3F90A1C2...' },
        ],
        verified: false,
        l30Activity: 'No L30 activity',
        denylistDetails: {
          deniedDate: 'Mar 3, 2025',
          reason: 'Money Mule — Coordinated Network',
          reasonCode: 'MONEY_MULE_COORD_L2',
          denylistedBy: 'Financial Crimes Unit — Manual Review',
          appealStatus: undefined,
          appealDate: undefined,
          priorEvents: 2,
          riskTier: 'Critical',
          caseId: 'NTRY_CASE_mL9pXrBk2T',
          scope: 'Account-level adversity',
          issuedBy: 'Financial Crimes Unit',
        },
      },
      {
        id: 'C_9mq4zv7wr',
        displayName: 'Alex Morgan',
        legalName: 'Alex Morgan',
        status: 'active',
        avatarColor: '#8b5cf6',
        sharedEvidence: [
          { type: 'Phone', token: 'ph-4155550189...' },
        ],
        l30Activity: 'L30 active',
      },
    ],
    alerts: [
      { id: '4821074', accountId: 'C_r4xw8mhkq', created: 'Aug 14, 2025', executionLabel: 'Execution Details' },
    ],
    adversityHistoryByAccount: {
      'C_r4xw8mhkq': [
        {
          id: 'adv-1',
          issuedBy: 'Risk Ops',
          issuedAt: 'Aug 14, 2025',
          type: 'DENYLIST',
          organization: 'AUTOMATED',
          reasons: ['Scam-related activity — account-level sweep'],
          reasonCodes: ['SCAM_DENYLIST_L1'],
          revokedBy: 'L2 Review — Compliance',
          revokedAt: '—',
          revokeReason: 'Successful appeal — identity verified',
        },
        {
          id: 'adv-2',
          issuedBy: 'Risk Ops',
          issuedAt: 'Aug 14, 2025',
          type: 'DENYLIST',
          organization: 'AUTOMATED',
          reasons: ['Scam-related activity — identity / SSN ending 6892'],
          reasonCodes: ['SCAM_DENYLIST_L1'],
          revokedBy: '—',
          revokedAt: '—',
          revokeReason: 'Shared identity — remains active',
        },
      ],
      'C_2nj8wk1dv': [
        {
          id: 'adv-x1',
          issuedBy: 'Financial Crimes',
          issuedAt: 'Mar 3, 2025',
          type: 'DENYLIST',
          organization: 'MANUAL',
          reasons: ['Money Mule — Coordinated Network'],
          reasonCodes: ['MONEY_MULE_COORD_L2'],
          revokedBy: undefined,
          revokedAt: undefined,
          revokeReason: undefined,
        },
        {
          id: 'adv-x2',
          issuedBy: 'Risk Ops',
          issuedAt: 'Oct 12, 2024',
          type: 'STRIKE',
          organization: 'AUTOMATED',
          reasons: ['Suspicious transfer activity'],
          reasonCodes: ['SUSPICIOUS_ACTIVITY_L1'],
          revokedBy: 'Risk Ops',
          revokedAt: 'Nov 5, 2024',
          revokeReason: 'False positive — cleared on review',
        },
      ],
    },
    idvAttempts: {
      'C_r4xw8mhkq': [
        {
          id: 'idv-m1',
          created: 'Jan 11, 2024',
          decision: 'VERIFIED',
          name: 'Mei Chen',
          birthDate: 'Mar 14, 1990',
          source: 'Persona',
          last4SSN: '6892',
          documents: ['CA Driver License'],
        },
        {
          id: 'idv-m2',
          created: 'Aug 14, 2025',
          decision: 'FAILED',
          name: 'Mei Chen',
          birthDate: 'Mar 14, 1990',
          source: 'Persona',
          last4SSN: '6892',
          documents: ['CA Driver License'],
        },
      ],
      'C_2nj8wk1dv': [
        {
          id: 'idv-x1',
          created: 'Feb 28, 2025',
          decision: 'MANUAL REVIEW',
          name: 'Xiao Liu',
          birthDate: 'Nov 22, 1987',
          source: 'Persona',
          last4SSN: '4417',
          documents: ['Passport'],
        },
      ],
    },
    transactions: {
      'C_r4xw8mhkq': [
        { id: 'txn-m1', date: 'Jun 15, 2025', type: 'P2P Transfer', amount: '$50.00', direction: 'OUT', counterparty: '@jess.w', counterpartyToken: 'C_9w2jk8px', status: 'Completed' },
        { id: 'txn-m2', date: 'Jun 12, 2025', type: 'P2P Transfer', amount: '$200.00', direction: 'IN', counterparty: '@david.k', counterpartyToken: 'C_4nm3qf7r', status: 'Completed' },
        { id: 'txn-m3', date: 'Jun 10, 2025', type: 'Cash Out', amount: '$100.00', direction: 'OUT', counterparty: 'Chase ****4821', status: 'Completed' },
        { id: 'txn-m4', date: 'May 28, 2025', type: 'P2P Transfer', amount: '$25.00', direction: 'OUT', counterparty: '@sarah.t', counterpartyToken: 'C_7xp4wr2k', status: 'Completed' },
        { id: 'txn-m5', date: 'May 20, 2025', type: 'P2P Transfer', amount: '$150.00', direction: 'IN', counterparty: '@tony.m', counterpartyToken: 'C_2bq8nf1v', status: 'Completed' },
        { id: 'txn-m6', date: 'May 15, 2025', type: 'Cash In', amount: '$500.00', direction: 'IN', counterparty: 'Employer Direct Deposit', status: 'Completed' },
        { id: 'txn-m7', date: 'Apr 30, 2025', type: 'P2P Transfer', amount: '$35.00', direction: 'OUT', counterparty: '@mike.r', counterpartyToken: 'C_6wr3nk0q', status: 'Completed' },
        { id: 'txn-m8', date: 'Apr 22, 2025', type: 'P2P Transfer', amount: '$80.00', direction: 'IN', counterparty: '@lisa.h', counterpartyToken: 'C_1pt9qw5j', status: 'Completed' },
        { id: 'txn-m9', date: 'Apr 10, 2025', type: 'Cash Out', amount: '$200.00', direction: 'OUT', counterparty: 'Chase ****4821', status: 'Completed' },
        { id: 'txn-m10', date: 'Mar 25, 2025', type: 'P2P Transfer', amount: '$15.00', direction: 'OUT', counterparty: '@grace.l', counterpartyToken: 'C_8fw2mk4n', status: 'Completed' },
        { id: 'txn-m11', date: 'Mar 18, 2025', type: 'P2P Transfer', amount: '$300.00', direction: 'IN', counterparty: '@wei.chen', counterpartyToken: 'C_3nq7vk9x', status: 'Completed' },
        { id: 'txn-m12', date: 'Mar 5, 2025', type: 'Cash In', amount: '$500.00', direction: 'IN', counterparty: 'Employer Direct Deposit', status: 'Completed' },
      ],
      'C_2nj8wk1dv': [
        { id: 'txn-x1', date: 'Mar 3, 2025  11:42 AM', type: 'P2P Transfer', amount: '$950.00', direction: 'OUT', counterparty: '$meic_temp', status: 'Completed', note: 'Rapid transfer' },
        { id: 'txn-x2', date: 'Mar 3, 2025  11:38 AM', type: 'P2P Transfer', amount: '$950.00', direction: 'IN', counterparty: '$qfund_82', status: 'Completed', note: 'Pass-through detected' },
        { id: 'txn-x3', date: 'Mar 3, 2025  9:15 AM', type: 'P2P Transfer', amount: '$1,000.00', direction: 'OUT', counterparty: '$paylink9', status: 'Completed' },
        { id: 'txn-x4', date: 'Mar 2, 2025  8:55 PM', type: 'P2P Transfer', amount: '$1,000.00', direction: 'IN', counterparty: '$send_r41', status: 'Completed', note: 'Pass-through detected' },
        { id: 'txn-x5', date: 'Mar 2, 2025  4:22 PM', type: 'P2P Transfer', amount: '$800.00', direction: 'OUT', counterparty: '$xfer_acc', status: 'Completed' },
        { id: 'txn-x6', date: 'Mar 2, 2025  9:10 AM', type: 'P2P Transfer', amount: '$800.00', direction: 'IN', counterparty: '$src_ql29', status: 'Completed', note: 'Pass-through detected' },
        { id: 'txn-x7', date: 'Mar 1, 2025  11:58 PM', type: 'P2P Transfer', amount: '$500.00', direction: 'OUT', counterparty: '$msend_01', status: 'Completed' },
        { id: 'txn-x8', date: 'Mar 1, 2025  11:48 PM', type: 'P2P Transfer', amount: '$500.00', direction: 'IN', counterparty: '$inflow88', status: 'Completed', note: 'Pass-through detected' },
        { id: 'txn-x9', date: 'Feb 28, 2025  6:04 PM', type: 'P2P Transfer', amount: '$1,200.00', direction: 'OUT', counterparty: '$chain_99', status: 'Completed' },
        { id: 'txn-x10', date: 'Feb 28, 2025  5:55 PM', type: 'P2P Transfer', amount: '$1,200.00', direction: 'IN', counterparty: '$rapid_tt', status: 'Completed', note: 'Pass-through detected' },
        { id: 'txn-x11', date: 'Feb 27, 2025  2:31 PM', type: 'Cash In', amount: '$2,500.00', direction: 'IN', counterparty: 'ACH (Unknown originator)', status: 'Completed' },
        { id: 'txn-x12', date: 'Feb 26, 2025', type: 'P2P Transfer', amount: '$2,400.00', direction: 'OUT', counterparty: '$payout_2', status: 'Completed' },
      ],
    },
  },

  'scams-l1': {
    id: 'scams-l1',
    numericId: '2987193',
    status: 'pending',
    queueName: 'Scams L1',
    queueSlug: 'scams_l1_demo',
    caseId: 'NTRY_CASE_hALTmhmieY',
    createdAt: 'Jul 11, 2026',
    createdRelative: '6 days ago',
    dueAt: 'Jul 21, 2026',
    dueRelative: 'in 4 days',
    dueOverdue: false,
    createdBy: 'alert-broker',
    linkedAssignments: 1,
    customer: {
      id: 'C_2nj8wk1dv',
      accountToken: 'C_2nj8wk1dv',
      displayName: 'Xiao Liu',
      legalName: 'Xiao Liu',
      status: 'active',
      verified: false,
      email: 'xiao.liu.sf@example.com',
      phone: '(415) 555-0194',
      joined: '5 months ago (Sep 14, 2025)',
      address: '88 Waverly Pl, San Francisco, CA 94108, US',
      avatarColor: '#0ea5e9',
      complianceTags: ['PERSONAL', 'MANUAL REVIEW', 'UNDER REVIEW', 'LINKED CUSTOMERS'],
    },
    primarySubject: {
      id: 'C_2nj8wk1dv',
      displayName: 'Xiao Liu',
      legalName: 'Xiao Liu',
      status: 'active',
      avatarColor: '#0ea5e9',
      verified: false,
      sharedEvidence: [
        { type: 'SSN', token: '***-**-6892' },
        { type: 'Device', token: 'dev-3F90A1C2...' },
      ],
    },
    connectedSubjects: [
      {
        id: 'C_r4xw8mhkq',
        displayName: 'Mei Chen',
        legalName: 'Mei Chen',
        status: 'active',
        avatarColor: '#12B76A',
        sharedEvidence: [
          { type: 'SSN', token: '***-**-6892' },
          { type: 'Device', token: 'dev-3F90A1C2...' },
        ],
        l30Activity: 'L30 active',
      },
    ],
    alerts: [
      {
        id: '3597942',
        accountId: 'C_2nj8wk1dv',
        created: 'Jul 11, 2026',
        executionLabel: 'RT-4821 · Disputed Goods — High-Value P2P',
        shortLabel: 'Disputed Goods, High-Value P2P',
        typology: 'Authorized Push Payment Scam',
        ruleId: 'RT-4821',
        ruleName: 'High-Value P2P with Post-Transaction Dispute and Counterparty Block',
        riskScore: 87,
        triggerSummary: '$475.00 outbound instant transfer on Jul 11, 2026 followed by a goods-not-as-described dispute and the counterparty blocking the account holder within 4 days. No recall path exists for instant transfers — funds are unrecoverable without intervention.',
        details: [
          { label: 'Trigger amount', value: '$475.00 (outbound, instant)' },
          { label: 'Dispute filed', value: 'Jul 14, 2026 — "Wrong item received"' },
          { label: 'Counterparty action', value: 'Blocked C_2nj8wk1dv after dispute filed' },
          { label: 'Reversal window', value: 'Expired — instant transfer, no recall path' },
          { label: 'Rule threshold', value: 'P2P > $400 + dispute + counterparty block within 7d' },
          { label: 'Prior alerts (90d)', value: '0 on this account' },
        ],
        queueReason: 'Risk score 87 ≥ 75 threshold · Routed to Scams L1 for manual review',
      },
    ],
    assets: [
      {
        id: 'xiao-email',
        type: 'Email',
        token: 'xiao.liu.sf@example.com',
        added: 'Sep 14, 2025 at 11:22 AM',
        history: [
          { date: 'Sep 14, 2025 at 11:22 AM', action: 'Added', actor: 'system', note: 'Email collected at account registration.' },
        ],
      },
      {
        id: 'xiao-phone',
        type: 'Phone',
        token: '(415) 555-0194',
        added: 'Sep 14, 2025 at 11:23 AM',
        history: [
          { date: 'Sep 14, 2025 at 11:23 AM', action: 'Added', actor: 'system' },
        ],
      },
      {
        id: 'xiao-device',
        type: 'Device ID',
        tokenShort: '...3F90A1C2',
        token: 'dev-3F90A1C2...',
        added: 'Sep 14, 2025 at 11:24 AM',
        history: [
          { date: 'Sep 14, 2025 at 11:24 AM', action: 'Added', actor: 'system', note: 'Device fingerprint captured at registration.' },
          { date: 'Mar 3, 2025 at 9:14 AM', action: 'Flagged', actor: 'alert-broker', note: 'Device associated with coordinated money mule activity.' },
        ],
      },
      {
        id: 'xiao-ssn',
        type: 'SSN (Last 4)',
        tokenShort: '...6892',
        token: '',
        maskedId: '***-**-6892',
        fideliusToken: '....a3f2c8d1',
        added: 'Feb 28, 2025 at 3:41 PM',
        connectedCount: 2,
        history: [
          { date: 'Feb 28, 2025 at 3:41 PM', action: 'Added', actor: 'system' },
          { date: 'Feb 28, 2025 at 3:45 PM', action: 'Flagged', actor: 'Persona', note: 'SSN matches another active identity on the platform. Routed for manual review.' },
        ],
      },
      {
        id: 'xiao-card',
        type: 'Cash Card',
        tokenShort: '...3317',
        token: 'ending in 3317',
        added: 'Oct 7, 2025 at 2:05 PM',
        processorLabel: 'Marqeta',
        history: [
          { date: 'Oct 7, 2025 at 2:05 PM', action: 'Added', actor: 'system', note: 'Cash Card issued shortly after account setup.' },
        ],
      },
    ],
    adversityHistory: [
      {
        id: 'adv-x2',
        issuedBy: 'Risk Ops',
        issuedAt: 'Oct 12, 2024',
        type: 'STRIKE',
        organization: 'AUTOMATED',
        reasons: ['Suspicious transfer activity'],
        reasonCodes: ['SUSPICIOUS_ACTIVITY_L1'],
        revokedBy: 'Risk Ops',
        revokedAt: 'Nov 5, 2024',
        revokeReason: 'False positive — cleared on review',
      },
    ],
    idvAttempts: {
      'C_2nj8wk1dv': [
        {
          id: 'idv-x1',
          created: 'Feb 28, 2025',
          decision: 'MANUAL REVIEW',
          name: 'Xiao Liu',
          birthDate: 'Nov 22, 1987',
          source: 'Persona',
          last4SSN: '4417',
          documents: ['Passport'],
        },
      ],
    },
    transactions: {
      'C_2nj8wk1dv': [
        { id: 'txn-s1', date: 'Jan 18, 2026', type: 'P2P Transfer', amount: '$475.00', direction: 'IN', counterparty: '@reporter_user', counterpartyToken: 'C_9bq7fn2k', status: 'Completed', note: 'Payment for jeans listing' },
        { id: 'txn-s2', date: 'Jan 18, 2026', type: 'P2P Transfer', amount: '$460.00', direction: 'OUT', counterparty: '$xfer_acct', status: 'Completed', note: 'Rapid outflow — same day' },
        { id: 'txn-s3', date: 'Jan 14, 2026', type: 'P2P Transfer', amount: '$320.00', direction: 'IN', counterparty: '@buyer_02', counterpartyToken: 'C_4kw2pq9x', status: 'Completed' },
        { id: 'txn-s4', date: 'Jan 14, 2026', type: 'P2P Transfer', amount: '$310.00', direction: 'OUT', counterparty: '$offload88', status: 'Completed', note: 'Rapid outflow — same day' },
        { id: 'txn-s5', date: 'Jan 9, 2026', type: 'P2P Transfer', amount: '$290.00', direction: 'IN', counterparty: '@buyer_03', counterpartyToken: 'C_7mr4qw1j', status: 'Completed' },
        { id: 'txn-s6', date: 'Jan 9, 2026', type: 'Cash Out', amount: '$280.00', direction: 'OUT', counterparty: 'ATM Withdrawal', status: 'Completed' },
        { id: 'txn-s7', date: 'Dec 28, 2025', type: 'P2P Transfer', amount: '$415.00', direction: 'IN', counterparty: '@buyer_04', counterpartyToken: 'C_2nk5bw8p', status: 'Completed' },
        { id: 'txn-s8', date: 'Dec 28, 2025', type: 'P2P Transfer', amount: '$400.00', direction: 'OUT', counterparty: '$relay_21', status: 'Completed', note: 'Rapid outflow — same day' },
        { id: 'txn-s9', date: 'Dec 15, 2025', type: 'P2P Transfer', amount: '$350.00', direction: 'IN', counterparty: '@buyer_05', counterpartyToken: 'C_8vw3kt6m', status: 'Completed' },
        { id: 'txn-s10', date: 'Dec 15, 2025', type: 'Cash Out', amount: '$340.00', direction: 'OUT', counterparty: 'ATM Withdrawal', status: 'Completed' },
        { id: 'txn-s11', date: 'Nov 22, 2025', type: 'P2P Transfer', amount: '$250.00', direction: 'IN', counterparty: '@buyer_06', counterpartyToken: 'C_5pq9bw2x', status: 'Completed' },
        { id: 'txn-s12', date: 'Nov 22, 2025', type: 'P2P Transfer', amount: '$240.00', direction: 'OUT', counterparty: '$cashout77', status: 'Completed', note: 'Rapid outflow — same day' },
      ],
    },
    aiInsights: [
      {
        id: 'checks',
        title: 'Checks',
        count: 14,
        items: [
          {
            id: 'scam-methodology',
            label: 'Scam Methodology',
            badge: 'flagged',
            badgeLabel: 'FLAGGED',
            finding: 'Yes. The recipient accepted payment, sent an unrelated item, refused a refund, and blocked the reporter after multiple contact attempts.',
            detailText: 'Evidence review — reporter submitted payment confirmation showing $475 transferred on Jan 18, 2026. Six chat screenshots document the exchange: initial listing inquiry, payment confirmation, shipment notification, and three follow-up messages in which the recipient refused to issue a refund and subsequently blocked the reporter.',
            detailBullets: [
              'Payment confirmed: $475 on Jan 18, 2026',
              'Item shipped: Jan 22, 2026 (photograph provided — item does not match listing)',
              'Reporter blocked: Jan 29, 2026, following three refund requests',
            ],
          },
          {
            id: 'scammy-language',
            label: 'Scammy Language',
            badge: 'flagged',
            badgeLabel: 'FLAGGED',
            finding: 'Yes. Messages include mocking language and an explicit statement that the listed item would not be sent.',
            detailText: 'Chat log analysis identified three messages consistent with intentional post-payment deception. The sender made no attempt to resolve the dispute or acknowledge the incorrect item.',
            detailBullets: [
              '"lol good luck getting anything back" — Jul 14, 2026 at 2:18 PM',
              '"I already sold the real ones, you got what you paid for" — Jul 14, 2026 at 2:21 PM',
              'Laughing emoji in response to final refund request — Jul 15, 2026 at 9:07 AM',
            ],
          },
          {
            id: 'effort-assessment',
            label: 'Effort Assessment',
            finding: 'High. The report includes payment confirmation, six chat screenshots, and a photograph of the item received.',
            detailText: 'Reporter provided 8 pieces of corroborating evidence. Submission quality scored in the 91st percentile for this queue.',
            detailBullets: [
              'Payment confirmation screenshot — Jul 11, 2026',
              'Six chat screenshots covering listing inquiry, payment confirmation, shipment notice, and three refund requests',
              'Photograph of item received — does not match listing description or advertised photos',
            ],
          },
          {
            id: 'no-prior-cash-app',
            label: 'No Prior Relationship (Cash App)',
            finding: 'Yes. No prior Cash App transaction history was identified between the reporter and the subject.',
            detailText: 'Transaction history spanning 24 months was reviewed. No payments of any amount between C_2nj8wk1dv and the reporter were identified prior to Jul 11, 2026. The $475 transfer is the first and only interaction between these two accounts on the platform.',
          },
          {
            id: 'no-prior-external',
            label: 'No Prior Relationship (External)',
            finding: 'Yes. The parties connected through an online marketplace listing and had no prior established relationship.',
            detailText: 'Reporter indicated initial contact occurred through a third-party online marketplace listing for designer jeans. No evidence of a prior relationship — mutual contacts, shared platform activity, or previous exchanges — was identified through available signals.',
          },
          {
            id: 'sellers-remorse',
            label: "Seller's Remorse",
            finding: 'No. The recipient did not attempt to resolve the dispute or issue a refund at any point.',
            detailText: 'All available post-payment communication was reviewed. The subject made no offer to refund, exchange, or otherwise resolve the dispute at any stage. The two messages sent by the subject after payment were both dismissive, and the reporter was subsequently blocked. No indicators of regret or genuine willingness to resolve were detected.',
          },
          {
            id: 'impatient-customer',
            label: 'Impatient Customer',
            finding: 'No. The reporter waited approximately 4 days before filing, which is within a reasonable range given the subject blocked them.',
            detailText: 'The reporter filed on Jul 15, 2026 — 4 days after payment and 1 day after being blocked by the subject. This timeline is consistent with a genuine dispute rather than premature escalation. Industry baseline for this claim type is 3–14 days from the triggering event.',
          },
          {
            id: 'in-person',
            label: 'In Person',
            finding: 'No. The interaction occurred online through a marketplace listing; the item was shipped by mail.',
            detailText: 'Transaction context was reviewed for indicators of in-person exchange — references to a meetup location, cash originally exchanged, or location-based cues in chat. None were identified. The item was advertised for shipment and tracking information was provided by the subject after payment.',
          },
          {
            id: 'inconsistent-report',
            label: 'Inconsistent Report',
            finding: "No. The reporter's narrative is consistent with the uploaded payment confirmation and chat evidence.",
            detailText: "The reporter's written narrative, payment confirmation, chat screenshots, and photograph of the received item were cross-referenced. No material inconsistencies were found. Dates, payment amounts, and described events align across all submitted documents.",
          },
          {
            id: 'account-age',
            label: 'Account Age',
            finding: 'Signal. Subject account is approximately 10 months old with limited transaction history prior to the reported incident.',
            detailText: 'Subject account C_2nj8wk1dv was created Sep 14, 2025 — approximately 10 months before this review. Accounts under 12 months old with limited inbound transaction history and an incomplete IDV profile carry elevated signal weight in this model.',
            detailBullets: [
              'Account opened: Sep 14, 2025',
              'Transactions prior to Jul 11, 2026: 12 (all outbound-heavy cycles with rapid withdrawal pattern)',
              'IDV status: Manual Review — not cleared',
            ],
          },
          {
            id: 'identity-verification',
            label: 'Identity Verification',
            finding: 'MANUAL REVIEW. Identity verification for this account was not completed. Submitted documents were routed for additional screening.',
            detailText: 'C_2nj8wk1dv submitted a passport for identity verification on Feb 28, 2026. Persona routed the submission to manual review after detecting a document quality flag. Verification has not been completed as of this assignment.',
            detailBullets: [
              'Document submitted: Passport — Feb 28, 2026',
              'Provider decision: Manual Review (document quality flag)',
              'Current status: Incomplete — no cleared IDV on file',
            ],
          },
          {
            id: 'tosv',
            label: 'Terms of Service Violation',
            finding: 'No. No prohibited category (e.g., drugs, adult content, gambling) was identified in the transaction.',
            detailText: 'The transaction was evaluated against Cash App Terms of Service restricted categories including gambling, adult content, controlled substances, firearms, and sanctioned entities. The listed item (designer jeans) and the nature of the transaction do not fall within any restricted category.',
          },
          {
            id: 'misdirected-payment',
            label: 'Misdirected Payment',
            finding: 'No. The payment was intentionally sent in exchange for the advertised item.',
            detailText: 'Payment context was reviewed to determine whether the transfer may have been sent to the wrong recipient in error. Chat evidence confirms the reporter contacted the subject specifically about the listing, negotiated a price of $475, and intentionally completed the transfer. No indicators of an accidental or mistaken payment were identified.',
          },
          {
            id: 'refunded',
            label: 'Refunded',
            finding: 'No. No refund was identified in the transaction record.',
            detailText: 'A full transaction review was conducted across both C_2nj8wk1dv and the reporter\'s account through Jul 17, 2026. No return transfer of $475 or any partial refund amount was found on either side. The transaction remains unresolved.',
          },
        ],
      },
    ],
    timelineEvents: [
      {
        id: 'evt-1',
        actorLabel: 'alert-broker',
        actorInitial: 'A',
        actorColor: '#6366f1',
        action: 'created',
        field: 'Assignment',
        timestamp: 'Feb 5, 2026, 8:14:22 AM',
        detail: 'Assignment #2987193 created from scam report detection rule RT-6209.',
      },
      {
        id: 'evt-2',
        actorLabel: 'System',
        actorInitial: 'S',
        actorColor: '#94a3b8',
        action: 'updated',
        field: 'Queue',
        timestamp: 'Feb 5, 2026, 8:14:23 AM',
        detail: 'Unassigned → Scams L1',
      },
      {
        id: 'evt-3',
        actorLabel: 'System',
        actorInitial: 'S',
        actorColor: '#94a3b8',
        action: 'updated',
        field: 'Status',
        timestamp: 'Feb 5, 2026, 8:14:23 AM',
        detail: 'Created → Pending Review',
      },
    ],
  },

  'scams-l2': {
    id: 'scams-l2',
    numericId: '2841059',
    status: 'pending',
    queueName: 'Scams L2',
    queueSlug: 'scams_l2_demo',
    caseId: 'NTRY_CASE_hALTmhmieY',
    createdAt: 'Jul 12, 2026',
    createdRelative: '5 days ago',
    dueAt: 'Jul 22, 2026',
    dueRelative: 'in 5 days',
    dueOverdue: false,
    createdBy: 'escalation-broker',
    linkedAssignments: 1,
    customer: {
      id: 'C_2nj8wk1dv',
      accountToken: 'C_2nj8wk1dv',
      displayName: 'Xiao Liu',
      legalName: 'Xiao Liu',
      status: 'active',
      verified: false,
      email: 'xiao.liu.sf@example.com',
      phone: '(415) 555-0194',
      joined: '5 months ago (Sep 14, 2025)',
      address: '88 Waverly Pl, San Francisco, CA 94108, US',
      avatarColor: '#0ea5e9',
      complianceTags: ['PERSONAL', 'MANUAL REVIEW', 'UNDER REVIEW', 'LINKED CUSTOMERS'],
    },
    primarySubject: {
      id: 'C_2nj8wk1dv',
      displayName: 'Xiao Liu',
      legalName: 'Xiao Liu',
      status: 'active',
      avatarColor: '#0ea5e9',
      verified: false,
      sharedEvidence: [
        { type: 'SSN', token: '***-**-6892' },
        { type: 'Device', token: 'dev-3F90A1C2...' },
      ],
    },
    connectedSubjects: [
      {
        id: 'C_r4xw8mhkq',
        displayName: 'Mei Chen',
        legalName: 'Mei Chen',
        status: 'active',
        avatarColor: '#12B76A',
        sharedEvidence: [
          { type: 'SSN', token: '***-**-6892' },
          { type: 'Device', token: 'dev-3F90A1C2...' },
        ],
        l30Activity: 'L30 active',
      },
    ],
    alerts: [
      {
        id: '3597942',
        accountId: 'C_2nj8wk1dv',
        created: 'Jul 11, 2026',
        executionLabel: 'RT-4821 · Disputed Goods — High-Value P2P',
        shortLabel: 'Disputed Goods, High-Value P2P',
        typology: 'Authorized Push Payment Scam',
        ruleId: 'RT-4821',
        ruleName: 'High-Value P2P with Post-Transaction Dispute and Counterparty Block',
        riskScore: 87,
        triggerSummary: '$475.00 outbound instant transfer on Jul 11, 2026 followed by a goods-not-as-described dispute and the counterparty blocking the account holder within 4 days. No recall path exists for instant transfers — funds are unrecoverable without intervention.',
        details: [
          { label: 'Trigger amount', value: '$475.00 (outbound, instant)' },
          { label: 'Dispute filed', value: 'Jul 14, 2026 — "Wrong item received"' },
          { label: 'Counterparty action', value: 'Blocked C_2nj8wk1dv after dispute filed' },
          { label: 'Reversal window', value: 'Expired — instant transfer, no recall path' },
          { label: 'Rule threshold', value: 'P2P > $400 + dispute + counterparty block within 7d' },
          { label: 'Prior alerts (90d)', value: '0 on this account' },
        ],
        queueReason: 'Risk score 87 ≥ 75 threshold · Escalated to Scams L2 for senior review',
      },
    ],
    assets: [
      {
        id: 'xiao-email',
        type: 'Email',
        token: 'xiao.liu.sf@example.com',
        added: 'Sep 14, 2025 at 11:22 AM',
        history: [
          { date: 'Sep 14, 2025 at 11:22 AM', action: 'Added', actor: 'system', note: 'Email collected at account registration.' },
        ],
      },
      {
        id: 'xiao-phone',
        type: 'Phone',
        token: '(415) 555-0194',
        added: 'Sep 14, 2025 at 11:23 AM',
        history: [
          { date: 'Sep 14, 2025 at 11:23 AM', action: 'Added', actor: 'system' },
        ],
      },
      {
        id: 'xiao-device',
        type: 'Device ID',
        tokenShort: '...3F90A1C2',
        token: 'dev-3F90A1C2...',
        added: 'Sep 14, 2025 at 11:24 AM',
        history: [
          { date: 'Sep 14, 2025 at 11:24 AM', action: 'Added', actor: 'system', note: 'Device fingerprint captured at registration.' },
          { date: 'Mar 3, 2025 at 9:14 AM', action: 'Flagged', actor: 'alert-broker', note: 'Device associated with coordinated money mule activity.' },
        ],
      },
      {
        id: 'xiao-ssn',
        type: 'SSN (Last 4)',
        tokenShort: '...6892',
        token: '',
        maskedId: '***-**-6892',
        fideliusToken: '....a3f2c8d1',
        added: 'Feb 28, 2025 at 3:41 PM',
        connectedCount: 2,
        history: [
          { date: 'Feb 28, 2025 at 3:41 PM', action: 'Added', actor: 'system' },
          { date: 'Feb 28, 2025 at 3:45 PM', action: 'Flagged', actor: 'Persona', note: 'SSN matches another active identity on the platform. Routed for manual review.' },
        ],
      },
      {
        id: 'xiao-card',
        type: 'Cash Card',
        tokenShort: '...3317',
        token: 'ending in 3317',
        added: 'Oct 7, 2025 at 2:05 PM',
        processorLabel: 'Marqeta',
        history: [
          { date: 'Oct 7, 2025 at 2:05 PM', action: 'Added', actor: 'system', note: 'Cash Card issued shortly after account setup.' },
        ],
      },
    ],
    adversityHistory: [
      {
        id: 'adv-x2',
        issuedBy: 'Risk Ops',
        issuedAt: 'Oct 12, 2024',
        type: 'STRIKE',
        organization: 'AUTOMATED',
        reasons: ['Suspicious transfer activity'],
        reasonCodes: ['SUSPICIOUS_ACTIVITY_L1'],
        revokedBy: 'Risk Ops',
        revokedAt: 'Nov 5, 2024',
        revokeReason: 'False positive — cleared on review',
      },
    ],
    idvAttempts: {
      'C_2nj8wk1dv': [
        {
          id: 'idv-x1',
          created: 'Feb 28, 2025',
          decision: 'MANUAL REVIEW',
          name: 'Xiao Liu',
          birthDate: 'Nov 22, 1987',
          source: 'Persona',
          last4SSN: '4417',
          documents: ['Passport'],
        },
      ],
    },
    transactions: {
      'C_2nj8wk1dv': [
        { id: 'txn-s1', date: 'Jan 18, 2026', type: 'P2P Transfer', amount: '$475.00', direction: 'IN', counterparty: '@reporter_user', counterpartyToken: 'C_9bq7fn2k', status: 'Completed', note: 'Payment for jeans listing' },
        { id: 'txn-s2', date: 'Jan 18, 2026', type: 'P2P Transfer', amount: '$460.00', direction: 'OUT', counterparty: '$xfer_acct', status: 'Completed', note: 'Rapid outflow — same day' },
        { id: 'txn-s3', date: 'Jan 14, 2026', type: 'P2P Transfer', amount: '$320.00', direction: 'IN', counterparty: '@buyer_02', counterpartyToken: 'C_4kw2pq9x', status: 'Completed' },
        { id: 'txn-s4', date: 'Jan 14, 2026', type: 'P2P Transfer', amount: '$310.00', direction: 'OUT', counterparty: '$offload88', status: 'Completed', note: 'Rapid outflow — same day' },
        { id: 'txn-s5', date: 'Jan 9, 2026', type: 'P2P Transfer', amount: '$290.00', direction: 'IN', counterparty: '@buyer_03', counterpartyToken: 'C_7mr4qw1j', status: 'Completed' },
        { id: 'txn-s6', date: 'Jan 9, 2026', type: 'Cash Out', amount: '$280.00', direction: 'OUT', counterparty: 'ATM Withdrawal', status: 'Completed' },
        { id: 'txn-s7', date: 'Dec 28, 2025', type: 'P2P Transfer', amount: '$415.00', direction: 'IN', counterparty: '@buyer_04', counterpartyToken: 'C_2nk5bw8p', status: 'Completed' },
        { id: 'txn-s8', date: 'Dec 28, 2025', type: 'P2P Transfer', amount: '$400.00', direction: 'OUT', counterparty: '$relay_21', status: 'Completed', note: 'Rapid outflow — same day' },
        { id: 'txn-s9', date: 'Dec 15, 2025', type: 'P2P Transfer', amount: '$350.00', direction: 'IN', counterparty: '@buyer_05', counterpartyToken: 'C_8vw3kt6m', status: 'Completed' },
        { id: 'txn-s10', date: 'Dec 15, 2025', type: 'Cash Out', amount: '$340.00', direction: 'OUT', counterparty: 'ATM Withdrawal', status: 'Completed' },
        { id: 'txn-s11', date: 'Nov 22, 2025', type: 'P2P Transfer', amount: '$250.00', direction: 'IN', counterparty: '@buyer_06', counterpartyToken: 'C_5pq9bw2x', status: 'Completed' },
        { id: 'txn-s12', date: 'Nov 22, 2025', type: 'P2P Transfer', amount: '$240.00', direction: 'OUT', counterparty: '$cashout77', status: 'Completed', note: 'Rapid outflow — same day' },
      ],
    },
    aiInsights: [
      {
        id: 'needs-review',
        title: 'Needs Review',
        count: 4,
        defaultOpen: true,
        items: [
          {
            id: 'l2-item-discrepancy',
            label: 'Item discrepancy',
            finding: 'The reporter received an item different from the listing. Determine whether this reflects intentional substitution or a fulfillment dispute.',
            detailText: 'The reporter submitted a photograph of the item received alongside the original marketplace listing. The listing described designer jeans (brand and size specified). The received item does not match the listing description or photographs. L2 review should determine whether the subject shipped the wrong item by mistake or deliberately substituted a lower-value item post-payment.',
            detailBullets: [
              'Item listed: designer jeans, size 30x32, retail value ~$280',
              'Item received: unbranded gray sweatpants — photograph submitted by reporter',
              'Distinction: deliberate substitution vs. fulfillment error has material bearing on outcome',
            ],
          },
          {
            id: 'l2-account-control',
            label: 'Account control at time of transaction',
            finding: 'The reported activity is associated with device ending 90A1. Confirm who controlled the account and device when the payment and messages occurred.',
            detailText: 'Session data shows all activity on Jul 11–15, 2026 — including the $475 receipt, post-payment messages, and reporter block — was initiated from a single mobile device (device token ending 90A1). This device has been associated with C_2nj8wk1dv since account creation. No concurrent sessions or anomalous access events were detected during this period.',
            detailBullets: [
              'Device ending 90A1: primary device on account since Sep 14, 2025',
              'All relevant activity on Jul 11–15, 2026 from this device only',
              'No shared sessions, VPN, or atypical geo indicators detected',
            ],
          },
          {
            id: 'l2-external-relationship',
            label: 'External relationship',
            finding: 'The parties connected through an external marketplace. Available evidence does not establish whether they had any relationship before this transaction.',
            detailText: 'The reporter stated they found the listing on a third-party online marketplace and initiated contact through that platform. No mutual contacts, shared platform activity, or prior Cash App interactions were identified. However, external relationship history (social media, messaging apps, in-person) cannot be verified through available signals and is not confirmed.',
          },
          {
            id: 'l2-fulfillment-evidence',
            label: 'Fulfillment evidence',
            finding: 'A package was delivered, but the available evidence does not confirm whether the shipment was a legitimate fulfillment attempt.',
            detailText: 'USPS tracking records confirm a package was shipped on Jul 13, 2026 and delivered on Jul 15, 2026. The subject provided the tracking number in chat. However, no packing slip, order record, or pre-shipment listing confirmation has been submitted. The item delivered does not match the advertised product, leaving open whether the subject shipped in good faith or used shipment as a delay tactic.',
            detailBullets: [
              'Carrier: USPS — tracking number provided by subject in chat',
              'Shipped: Jul 13, 2026 · Delivered: Jul 15, 2026',
              'Contents not confirmed by carrier — item mismatch identified by reporter photograph',
            ],
          },
        ],
      },
      {
        id: 'adverse-signals',
        title: 'Adverse Signals',
        count: 6,
        defaultOpen: false,
        items: [
          {
            id: 'l2-deception-pattern',
            label: 'Intentional deception pattern',
            finding: 'The recipient accepted a $475 payment, sent an unrelated item, refused a refund, and blocked the reporter.',
            detailText: 'The end-to-end sequence — accepting payment, providing a tracking number for a non-matching item, dismissing refund requests, and blocking the reporter — is consistent with a deliberate post-payment deception strategy. Each step follows a pattern commonly observed in marketplace fraud where the subject uses shipment of a low-value item to create the appearance of fulfillment while retaining the payment.',
            detailBullets: [
              'Payment accepted: Jul 11, 2026',
              'Non-matching item shipped and delivered: Jul 13–15, 2026',
              'All three refund requests refused — reporter blocked Jul 15, 2026',
            ],
          },
          {
            id: 'l2-mocking-language',
            label: 'Deceptive or mocking language',
            finding: 'Messages include mocking language and statements indicating that the advertised item would not be delivered.',
            detailText: 'Three messages sent by the subject after payment are directly inconsistent with a good-faith fulfillment attempt. The language reflects awareness that the correct item was not shipped and a deliberate refusal to remedy the situation.',
            detailBullets: [
              '"lol good luck getting anything back" — Jul 14, 2026 at 2:18 PM',
              '"I already sold the real ones, you got what you paid for" — Jul 14, 2026 at 2:21 PM',
              'Laughing emoji in response to final refund request — Jul 15, 2026 at 9:07 AM',
            ],
          },
          {
            id: 'l2-strong-evidence',
            label: 'Strong supporting evidence',
            finding: 'The report includes payment confirmation, six message screenshots, and a photo of the item received.',
            detailText: 'The reporter submitted 8 pieces of corroborating evidence. Submission quality and completeness scored in the 91st percentile for this queue. The evidence set covers the full transaction lifecycle: initiation, payment, shipment, delivery, and post-delivery communication.',
            detailBullets: [
              'Payment confirmation screenshot — Jul 11, 2026',
              'Six chat screenshots covering listing inquiry, payment, tracking number, and three refund requests',
              'Photograph of item received — does not match listing description or advertised photos',
            ],
          },
          {
            id: 'l2-no-relationship',
            label: 'No established relationship',
            finding: 'No prior Cash App activity or established external relationship was identified between the parties.',
            detailText: 'Transaction history spanning 24 months was reviewed for both accounts. No payments of any amount between C_2nj8wk1dv and the reporter were identified prior to Jul 11, 2026. The reporter confirmed they discovered the listing through a third-party marketplace and had no prior contact with the subject. The $475 transfer is the only interaction between these two accounts on the platform.',
          },
          {
            id: 'l2-consistent-report',
            label: 'Report is internally consistent',
            finding: "The reporter's narrative is consistent with the payment record, message history, and uploaded images.",
            detailText: "The reporter's written narrative, payment confirmation, chat screenshots, and photograph of the received item were cross-referenced. No material inconsistencies were identified. Dates, payment amounts, tracking details, and described events align across all submitted documents. The reported sequence of events is fully supported by the available evidence.",
          },
          {
            id: 'l2-intentional-payment',
            label: 'Intentional payment with no refund',
            finding: 'The payment was intentionally sent for the advertised item, and no refund was identified.',
            detailText: 'Chat evidence confirms the reporter contacted the subject specifically about the listing, negotiated a price of $475, and intentionally completed the transfer. A full transaction review was conducted across both accounts through Jul 17, 2026. No return transfer of $475 or any partial refund amount was found. The transaction remains unresolved.',
          },
        ],
      },
      {
        id: 'mitigating-signals',
        title: 'Mitigating Signals',
        count: 2,
        defaultOpen: false,
        items: [
          {
            id: 'l2-partial-fulfillment',
            label: 'Partial fulfillment occurred',
            finding: 'A package was shipped and delivered, which may indicate some attempt to fulfill the transaction.',
            detailText: 'The subject did take action to ship a physical item and provided a valid tracking number. Delivery was confirmed by USPS on Jul 15, 2026. While the item delivered does not match the listing, the act of shipment is a mitigating factor when distinguishing between non-delivery fraud and item-not-as-described disputes. This does not resolve the item discrepancy, but it is relevant context for outcome determination.',
          },
          {
            id: 'l2-no-prohibited-activity',
            label: 'No unrelated prohibited activity',
            finding: 'The report does not involve prohibited goods or another unrelated Terms of Service category.',
            detailText: 'The transaction was evaluated against Cash App Terms of Service restricted categories including gambling, adult content, controlled substances, firearms, and sanctioned entities. The listed item (designer jeans) and the nature of the transaction do not fall within any restricted category. The dispute is limited to item misrepresentation and does not implicate additional compliance concerns.',
          },
        ],
      },
    ],
    timelineEvents: [
      {
        id: 'l2-evt-1',
        actorLabel: 'escalation-broker',
        actorInitial: 'E',
        actorColor: '#f59e0b',
        action: 'escalated',
        field: 'Assignment',
        timestamp: 'Jul 12, 2026, 9:02:11 AM',
        detail: 'Assignment #2841059 created from L1 escalation of #2987193. L1 reviewer flagged Scam Methodology and Scammy Language.',
      },
      {
        id: 'l2-evt-2',
        actorLabel: 'System',
        actorInitial: 'S',
        actorColor: '#94a3b8',
        action: 'updated',
        field: 'Queue',
        timestamp: 'Jul 12, 2026, 9:02:12 AM',
        detail: 'Scams L1 → Scams L2',
      },
      {
        id: 'l2-evt-3',
        actorLabel: 'System',
        actorInitial: 'S',
        actorColor: '#94a3b8',
        action: 'updated',
        field: 'Status',
        timestamp: 'Jul 12, 2026, 9:02:12 AM',
        detail: 'Escalated → Pending L2 Review',
      },
    ],
  },

  'sar-ai': {
    id: 'sar-ai',
    numericId: '1824037',
    status: 'claimed',
    queueName: 'SAR with AI Insights',
    queueSlug: 'sar_ai_demo',
    caseId: 'NTRY_CASE_wM3kBxRp9T',
    createdAt: 'Jul 12, 2026',
    createdRelative: '5 days ago',
    dueAt: 'Jul 19, 2026',
    dueRelative: 'in 2 days',
    dueOverdue: false,
    createdBy: 'sar-broker',
    claimedBy: 'cwalloch',
    customer: {
      id: 'C_9wk3mb4xr',
      accountToken: 'AH_9wk3mb4xr',
      displayName: 'Marcus Webb',
      legalName: 'Marcus T. Webb',
      status: 'active',
      email: 'marcus.webb@example.com',
      phone: '(212) 555-0307',
      joined: '5 years ago (Jan 8, 2020)',
      address: '350 Fifth Ave, New York, NY 10118, US',
      avatarColor: '#0ea5e9',
      complianceTags: ['PERSONAL', 'SSN', 'BUSINESS', 'HIGH RISK'],
    },
    primarySubject: { id: 'C_9wk3mb4xr', displayName: 'Marcus Webb', status: 'active', avatarColor: '#0ea5e9' },
    connectedSubjects: [
      { id: 'C_3xp8nk5wq', displayName: 'Webb Consulting LLC', status: 'active', avatarColor: '#f59e0b', sharedEvidence: [{ type: 'EIN', token: 'ein-82-4471039...' }, { type: 'Bank Account', token: 'ba-009281...' }] },
      { id: 'C_7jm2vk9np', displayName: 'Sandra Webb', status: 'active', avatarColor: '#8b5cf6', sharedEvidence: [{ type: 'SSN', token: 'fid-1-c2e9a7f4...' }, { type: 'Device', token: 'dev-A1F3B8C0...' }] },
    ],
    alerts: [
      { id: '6203847', accountId: 'C_9wk3mb4xr', created: 'Apr 15, 2026', typology: 'Layering', executionLabel: 'Execution Details' },
    ],
    aiInsights: [
      {
        id: 'needs-review',
        title: 'Needs Review',
        count: 3,
        items: [
          { id: 'layering', label: 'Layering Pattern', badge: 'flagged', badgeLabel: 'HIGH', finding: 'Funds moved through 4 intermediary accounts within 72 hours before consolidating to external wallet. Pattern consistent with layering typology.', evidenceDetail: 'Transaction graph shows 14-hop movement across 6 entities.' },
          { id: 'structuring', label: 'Structuring Indicators', badge: 'flagged', badgeLabel: 'FLAGGED', finding: 'Multiple transactions at $9,800–$9,950 range across 9-day period. Volume and timing pattern warrants SAR consideration.', evidenceDetail: '23 transactions flagged by structuring model.' },
          { id: 'business-mismatch', label: 'Business Profile Mismatch', badge: 'flagged', badgeLabel: 'YES', finding: 'Transaction volume ($340K, 90 days) is 8× stated business revenue. Business type is listed as consulting with no corresponding vendor payments.', evidenceDetail: 'Business profile and stated revenue documentation.' },
        ],
      },
      {
        id: 'adverse',
        title: 'Adverse Signals',
        count: 4,
        items: [
          { id: 'adv-1', label: 'High-Risk Jurisdiction', badge: 'flagged', badgeLabel: 'YES', finding: 'Counterparty institutions in 3 FATF-monitored jurisdictions. Wire transfers totaling $82,000 in Q1.' },
          { id: 'adv-2', label: 'Cash Intensive', badge: 'flagged', badgeLabel: 'HIGH', finding: 'Cash deposit frequency elevated (18 deposits, $1,200 avg) inconsistent with stated business model.' },
          { id: 'adv-3', label: 'Rapid Movement', badge: 'flagged', badgeLabel: 'YES', finding: 'Average time between inbound and outbound transfer: 6 hours. No apparent business purpose for speed.' },
          { id: 'adv-4', label: 'Unverified Counterparties', badge: 'flagged', badgeLabel: '4 parties', finding: 'Four distinct counterparties with no verifiable relationship to stated business operations.' },
        ],
      },
      {
        id: 'mitigating',
        title: 'Mitigating Signals',
        count: 2,
        items: [
          { id: 'mit-1', label: 'Verified Business', badge: 'clear', badgeLabel: 'VERIFIED', finding: 'EIN verified, business license on file, Dunn & Bradstreet record active. No prior SAR history.' },
          { id: 'mit-2', label: 'Customer Explanation', badge: 'info', badgeLabel: 'ON FILE', finding: 'Customer provided written explanation for transaction volume citing seasonal contract work. Review underway.' },
        ],
      },
    ],
  },

  'npid-bau': {
    id: 'npid-bau',
    numericId: '2969822',
    status: 'pending',
    queueName: 'Compliance Cash TM – Demo Queue',
    queueSlug: 'npid_bau_demo',
    caseId: 'NTRY_CASE_hUSyoAGVUt',
    createdAt: 'Jan 16, 2026',
    createdRelative: '6 months ago',
    dueAt: 'Feb 15, 2026',
    dueRelative: 'overdue',
    dueOverdue: true,
    createdBy: 'alert-broker',
    customer: {
      id: 'C_0ew44lyr8',
      accountToken: 'AH_8ry144we0',
      displayName: 'Jordan Mercer',
      legalName: 'Jordan Mercer',
      status: 'active',
      email: 'j.mercer.wa@protonmail.com',
      phone: '+1 (206) 555-0174',
      joined: '2 years ago (Mar 4, 2024)',
      address: '412 3rd Ave W, Seattle, WA 98119, US',
      avatarColor: '#0ea5e9',
      complianceTags: ['PERSONAL', 'SSN', 'LINKED CUSTOMERS'],
    },
    primarySubject: { id: 'C_0ew44lyr8', displayName: 'Jordan Mercer', status: 'active', avatarColor: '#0ea5e9' },
    alerts: [],
  },

  'npid-verification': {
    id: 'npid-verification',
    numericId: '3108247',
    status: 'pending',
    queueName: 'NPID Cluster Verification',
    queueSlug: 'npid_verification_demo',
    caseId: 'NTRY_CASE_cV5bNxP8qR',
    createdAt: 'Jul 15, 2026',
    createdRelative: '2 days ago',
    dueAt: 'Jul 20, 2026',
    dueRelative: 'in 3 days',
    dueOverdue: false,
    createdBy: 'npid-broker',
    customer: {
      id: 'C_5xm8pk3nw',
      accountToken: 'AH_5xm8pk3nw',
      displayName: 'Jordan Lee',
      legalName: 'Jordan K. Lee',
      status: 'active',
      email: 'jordan.lee@example.com',
      phone: '(503) 555-0167',
      joined: '1 year ago (Jun 15, 2025)',
      address: '1 SW Columbia St, Portland, OR 97201, US',
      avatarColor: '#64748b',
      complianceTags: ['PERSONAL', 'SSN'],
    },
    primarySubject: { id: 'C_5xm8pk3nw', displayName: 'Jordan Lee', status: 'active', avatarColor: '#64748b' },
    connectedSubjects: [
      { id: 'C_2kp9wm7bq', displayName: 'J. Lee', status: 'active', avatarColor: '#0ea5e9', sharedEvidence: [{ type: 'SSN', token: 'fid-1-e7b3c2a9...' }, { type: 'Device', token: 'dev-F8A2C1E0...' }] },
      { id: 'C_8wn3jt5xp', displayName: 'Jordan L.', status: 'active', avatarColor: '#8b5cf6', sharedEvidence: [{ type: 'SSN', token: 'fid-1-e7b3c2a9...' }, { type: 'Phone', token: 'ph-6505550284...' }] },
      { id: 'C_4mb7rk2nq', displayName: 'Lee Jordan', status: 'active', avatarColor: '#f59e0b', sharedEvidence: [{ type: 'IDV', token: 'idv-3D1F8C5A...' }] },
    ],
    alerts: [],
  },

};
