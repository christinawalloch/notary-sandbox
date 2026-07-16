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
  };
}

export interface ConnectedAccount extends Account {
  sharedEvidence: SharedEvidence[];
  verified?: boolean;
}

export interface Alert {
  id: string;
  accountId: string;
  created: string;
  typology?: string;
  executionLabel?: string;
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
  tokenShort: string;
  token: string;
  added: string;
  isUnlinked?: boolean;
  isDenylisted?: boolean;
  maskedId?: string;
  fideliusToken?: string;
  denylistReason?: string;
  hasExternalLink?: boolean;
  hasInfoIcon?: boolean;
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
  revokeReason?: string;
}

export interface DenylistInfo {
  reason: string;
  reasonCode: string;
  deniedDate: string;
  countryCode: string;
  appealDate: string;
  appealStatus: string;
}

export interface AIInsightItem {
  id: string;
  label: string;
  badge?: 'flagged' | 'clear' | 'info';
  badgeLabel?: string;
  finding: string;
  evidenceDetail?: string;
}

export interface AIInsightGroup {
  id: string;
  title: 'Needs Review' | 'Adverse Signals' | 'Mitigating Signals';
  count: number;
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
  primarySubject?: Account;
  connectedSubjects?: ConnectedAccount[];
  alerts?: Alert[];
  denylistInfo?: DenylistInfo;
  aiInsights?: AIInsightGroup[];
  assets?: AssetIdentifier[];
  adversityHistory?: AdversityRecord[];
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
    queueName: 'Denylist Appeals: Scam',
    queueSlug: 'global_appeals_demo',
    caseId: 'NTRY_CASE_x4Rm8qWpzA',
    createdAt: 'Sep 29, 2025',
    createdRelative: '9 months ago',
    dueAt: 'Oct 9, 2025',
    dueRelative: '9 months ago',
    dueOverdue: true,
    createdBy: 'system',
    linkedAssignments: 1,
    tags: [],
    denylistInfo: {
      reason: 'Scam-related activity',
      reasonCode: 'SCAM_DENYLIST_L1',
      deniedDate: 'Aug 14, 2025',
      countryCode: 'US',
      appealDate: 'Sep 29, 2025',
      appealStatus: 'Under Review',
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
        verified: true,
      },
      {
        id: 'C_5kw3bj9xp',
        displayName: 'Jing Fang',
        legalName: 'Jing Fang',
        status: 'active',
        avatarColor: '#f59e0b',
        sharedEvidence: [
          { type: 'Device', token: 'dev-3F90A1C2...' },
          { type: 'Phone', token: 'ph-4155550189...' },
        ],
        verified: false,
      },
      {
        id: 'C_9mq4zv7wr',
        displayName: 'Rui Zhang',
        legalName: 'Rui Zhang',
        status: 'active',
        avatarColor: '#8b5cf6',
        sharedEvidence: [
          { type: 'SSN', token: 'fid-1-a8c4f2e1b3...' },
          { type: 'IDV', token: 'idv-7B2D9E4F...' },
        ],
        verified: true,
      },
      {
        id: 'C_2nj8wk1dv',
        displayName: 'Xiao Liu',
        legalName: 'Xiao Liu',
        status: 'denylisted',
        avatarColor: '#0ea5e9',
        sharedEvidence: [
          { type: 'SSN', token: 'fid-a3f2c8d1...' },
          { type: 'Device', token: 'dev-3F90A1C2...' },
        ],
        verified: false,
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
        },
      },
    ],
    alerts: [
      { id: '4821073', accountId: 'C_r4xw8mhkq', created: 'Aug 14, 2025', executionLabel: 'Execution Details' },
    ],
    assets: [
      {
        id: 'asset-1',
        type: 'Device ID',
        tokenShort: '...d80afcf8',
        token: 'ff710c288e500fe3631dc0b9ebe4d654d80afcf8',
        added: 'Jan 11, 2024 at 8:43:44 PM',
        history: [
          { date: 'Jan 11, 2024 at 8:43:44 PM', action: 'Added', actor: 'system', note: 'Device fingerprint captured on account creation.' },
          { date: 'Mar 4, 2024 at 10:12:08 AM', action: 'Seen on login', actor: 'system', note: 'Device recognized on successful authentication.' },
          { date: 'Jun 18, 2024 at 3:55:22 PM', action: 'Seen on login', actor: 'system' },
          { date: 'Aug 14, 2025 at 2:30:59 PM', action: 'Flagged', actor: 'alert-broker', note: 'Associated with Scam-related activity detection rule RT-4821.' },
        ],
      },
      {
        id: 'asset-2',
        type: 'Email',
        tokenShort: 'mei.chen',
        token: 'mei.chen.ca@example.com',
        added: 'Jan 11, 2024 at 8:46:33 PM',
        hasExternalLink: true,
        hasInfoIcon: true,
        history: [
          { date: 'Jan 11, 2024 at 8:46:33 PM', action: 'Added', actor: 'system', note: 'Email collected at account registration.' },
          { date: 'Jan 11, 2024 at 9:02:14 PM', action: 'Verified', actor: 'system', note: 'Verification link clicked.' },
          { date: 'Feb 27, 2025 at 11:34:00 AM', action: 'Updated', actor: 'Mei Chen', note: 'Email address re-confirmed after 2FA reset.' },
        ],
      },
      {
        id: 'asset-3',
        type: 'Cashtag',
        tokenShort: '$meichen01',
        token: '$meichen01',
        added: 'Jan 11, 2024 at 8:47:19 PM',
        history: [
          { date: 'Jan 11, 2024 at 8:47:19 PM', action: 'Added', actor: 'system', note: 'Cashtag selected at account setup.' },
          { date: 'Apr 3, 2024 at 2:18:45 PM', action: 'Seen in transaction', actor: 'system', note: 'Used as recipient in P2P transfer.' },
          { date: 'Aug 14, 2025 at 2:31:02 PM', action: 'Flagged', actor: 'alert-broker', note: 'Cashtag included in scam-related activity case cluster.' },
        ],
      },
      {
        id: 'asset-4',
        type: 'Identity',
        tokenShort: '...6892',
        token: '',
        added: 'Aug 14, 2025 at 2:31:07 PM',
        isDenylisted: true,
        maskedId: '****-**-6892',
        fideliusToken: '....a3f2c8d1',
        denylistReason: '(Scam-related activity)',
        history: [
          { date: 'Jan 11, 2024 at 8:44:02 PM', action: 'Added', actor: 'system', note: 'SSN token created via Fidelius at identity verification.' },
          { date: 'Jan 11, 2024 at 8:44:05 PM', action: 'IDV passed', actor: 'Persona', note: 'Identity document verified successfully.' },
          { date: 'Aug 14, 2025 at 2:31:07 PM', action: 'Denylisted', actor: 'Risk Ops — Automated', note: 'SSN matched to scam-related activity network. Reason: SCAM_DENYLIST_L1.' },
        ],
      },
      {
        id: 'asset-5',
        type: 'Device ID',
        tokenShort: '...c111f162',
        token: 'b51b6f87466def71227aa7f10b2df9acc111f162',
        added: 'Apr 7, 2024 at 11:07:20 PM',
        isUnlinked: true,
        history: [
          { date: 'Apr 7, 2024 at 11:07:20 PM', action: 'Added', actor: 'system', note: 'Device observed on a separate account during login.' },
          { date: 'Aug 15, 2025 at 9:14:33 AM', action: 'Unlinked', actor: 'system', note: 'Device moved to unlinked pool after account denylist.' },
        ],
      },
      {
        id: 'asset-6',
        type: 'Device ID',
        tokenShort: '...5fb1385a',
        token: '42b8f07b83d8d4848eeecf6a4da8bb7a5fb1385a',
        added: 'Apr 17, 2024 at 11:13:59 PM',
        isUnlinked: true,
        history: [
          { date: 'Apr 17, 2024 at 11:13:59 PM', action: 'Added', actor: 'system', note: 'New device fingerprint captured on login.' },
          { date: 'Aug 15, 2025 at 9:14:33 AM', action: 'Unlinked', actor: 'system', note: 'Device moved to unlinked pool after account denylist.' },
        ],
      },
      {
        id: 'asset-7',
        type: 'Device ID',
        tokenShort: '...c34bfa34',
        token: '0cba7b2ec5949c87862826223827ce70c34bfa34',
        added: 'Apr 30, 2024 at 10:07:00 PM',
        isUnlinked: true,
        history: [
          { date: 'Apr 30, 2024 at 10:07:00 PM', action: 'Added', actor: 'system', note: 'Device fingerprint captured on mobile app login.' },
          { date: 'May 14, 2024 at 6:22:17 PM', action: 'Seen on login', actor: 'system' },
          { date: 'Aug 15, 2025 at 9:14:34 AM', action: 'Unlinked', actor: 'system', note: 'Device moved to unlinked pool after account denylist.' },
        ],
      },
      {
        id: 'asset-8',
        type: 'Device ID',
        tokenShort: '...3be369d2',
        token: '18a34dbe5ca1f1ec19d96acb7af1c1053be369d2',
        added: 'Dec 4, 2025 at 8:08:48 PM',
        isUnlinked: true,
        history: [
          { date: 'Dec 4, 2025 at 8:08:48 PM', action: 'Added', actor: 'system', note: 'New device detected post-denylist — flagged for review.' },
          { date: 'Dec 4, 2025 at 8:09:01 PM', action: 'Flagged', actor: 'alert-broker', note: 'Login attempt from unknown device on denylisted account.' },
        ],
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
      },
      {
        id: 'adv-2',
        issuedBy: 'Risk Ops',
        issuedAt: 'Aug 14, 2025  2:31 pm',
        type: 'DENYLIST',
        organization: 'AUTOMATED',
        reasons: ['Scam-related activity — identity / SSN ending 6892'],
        reasonCodes: ['SCAM_DENYLIST_L1'],
      },
    ],
  },

  'scams-l1': {
    id: 'scams-l1',
    numericId: '2987193',
    status: 'pending',
    queueName: 'Scams L1',
    queueSlug: 'scams_l1_demo',
    caseId: 'NTRY_CASE_hALTmhmieY',
    createdAt: 'Jan 28, 2026',
    createdRelative: '5 months ago',
    dueAt: 'Feb 3, 2026',
    dueRelative: '5 months ago',
    dueOverdue: true,
    createdBy: 'alert-broker',
    customer: {
      id: 'C_7xm9kp3nw',
      accountToken: 'AH_9kp3nwm7x',
      displayName: 'Diego Martinez',
      legalName: 'Diego Martinez',
      status: 'active',
      verified: true,
      email: 'diegom.sf@example.com',
      phone: '(415) 555-0173',
      joined: '2 years ago (Mar 5, 2023)',
      address: '1234 Mission St, San Francisco, CA 94103, US',
      avatarColor: '#12B76A',
      complianceTags: ['PERSONAL', 'SSN', 'MARK', 'SAN FRANCISCO', 'CRYPTO', 'CHIME', 'LINKED CUSTOMERS'],
    },
    primarySubject: {
      id: 'C_7xm9kp3nw',
      displayName: 'Diego Martinez',
      status: 'active',
      avatarColor: '#12B76A',
    },
    alerts: [
      { id: '3597942', accountId: 'L9VDAFPK32RBS', created: 'Jun 4, 2025', executionLabel: 'Execution Details' },
    ],
    aiInsights: [
      {
        id: 'needs-review',
        title: 'Needs Review',
        count: 3,
        items: [
          {
            id: 'buyers-remorse',
            label: "Buyer's Remorse",
            badge: 'flagged',
            badgeLabel: 'FLAGGED',
            finding: "Reporter received item but disputes quality. Seller provided tracking confirming delivery. Transaction history shows consistent amounts ($250–$350) occurring at regular intervals over a 3-month period.",
            evidenceDetail: 'Transaction list includes visual payment confirmations and message logs.',
          },
          {
            id: 'effort-assessment',
            label: 'Effort Assessment',
            badge: 'flagged',
            badgeLabel: 'HIGH',
            finding: 'High. Payment process clearly notifies the Chime Users bank, successfully demonstrates social proof among item and donation reports.',
            evidenceDetail: 'Review payment flow screenshots and bank notification records.',
          },
          {
            id: 'scam-methodology',
            label: 'Scam Methodology',
            badge: 'flagged',
            badgeLabel: 'HIGH',
            finding: 'High. Subjects sent us successfully showing messages, acting like AI-assisted behavior, and systematically targeting vulnerable users.',
            evidenceDetail: 'Message logs and behavioral pattern analysis.',
          },
        ],
      },
      {
        id: 'adverse',
        title: 'Adverse Signals',
        count: 5,
        items: [
          {
            id: 'economy-language',
            label: 'Economy Language',
            badge: 'flagged',
            badgeLabel: 'YES',
            finding: 'Evidence shows intentions describe using or more specifically long and unconscionable exchanges with pressure tactics.',
          },
          {
            id: 'no-prior-relationship',
            label: 'No Prior Relationship',
            badge: 'flagged',
            badgeLabel: 'CLAIMED: YES',
            finding: 'Only about "first time used, insufficient proof of pre-existing relationship." No verifiable history between parties.',
          },
          {
            id: 'fraudulent-customer',
            label: 'Fraudulent Customer',
            badge: 'flagged',
            badgeLabel: 'YES',
            finding: '11 day delay considered dispositive for receiving scam receipt. Timeline inconsistencies noted.',
          },
          {
            id: 'in-person',
            label: 'In Person',
            badge: 'clear',
            badgeLabel: 'NO',
            finding: 'No in-person meeting interaction was not transparent and/or USPS verified.',
          },
          {
            id: 'uncontrolled-report',
            label: 'Uncontrolled Report',
            badge: 'clear',
            badgeLabel: 'NO',
            finding: "Reporter's narrative was inaccurate with counterbalance evidence found in transaction records.",
          },
        ],
      },
      {
        id: 'mitigating',
        title: 'Mitigating Signals',
        count: 4,
        items: [
          {
            id: 'sellers-remorse',
            label: "Seller's Remorse",
            badge: 'clear',
            badgeLabel: 'NO',
            finding: 'Sales did not deviate to provide or refund, receiving evidence supports legitimate transaction.',
          },
          {
            id: 'economy-language-2',
            label: 'Economy Language',
            badge: 'clear',
            badgeLabel: 'NO',
            finding: 'Account attended scamming and cash claiming, violent terms after receiving payment — does not support scam claim.',
          },
          {
            id: 'tc-violation',
            label: 'T&C',
            badge: 'clear',
            badgeLabel: 'NO',
            finding: 'All communication resulted in a simple belief-switch complaint, gambling involved — below threshold.',
          },
          {
            id: 'misallocated',
            label: 'Misallocated Payment',
            badge: 'clear',
            badgeLabel: 'NO',
            finding: 'Payment was not misallocated — asset purchase is documented and traceable.',
          },
        ],
      },
    ],
  },

  'scams-l2': {
    id: 'scams-l2',
    numericId: '2841059',
    status: 'claimed',
    queueName: 'Scams L2',
    queueSlug: 'scams_l2_demo',
    caseId: 'NTRY_CASE_pT9mXrBk4L',
    createdAt: 'Mar 2, 2026',
    createdRelative: '4 months ago',
    dueAt: 'Mar 7, 2026',
    dueRelative: '4 months ago',
    dueOverdue: true,
    createdBy: 'escalation-broker',
    claimedBy: 'cwalloch',
    customer: {
      id: 'C_4vr2pn8mj',
      accountToken: 'AH_4vr2pn8mj',
      displayName: 'Priya Patel',
      legalName: 'Priya R. Patel',
      status: 'active',
      email: 'priya.patel@example.com',
      phone: '(650) 555-0218',
      joined: '4 years ago (Feb 14, 2021)',
      address: '2200 Sand Hill Rd, Menlo Park, CA 94025, US',
      avatarColor: '#8b5cf6',
      complianceTags: ['PERSONAL', 'SSN', 'HIGH RISK', 'LINKED CUSTOMERS'],
    },
    primarySubject: { id: 'C_4vr2pn8mj', displayName: 'Priya Patel', status: 'active', avatarColor: '#8b5cf6' },
    alerts: [
      { id: '5102938', accountId: 'C_4vr2pn8mj', created: 'Mar 2, 2026', executionLabel: 'Execution Details' },
    ],
    aiInsights: [
      {
        id: 'needs-review',
        title: 'Needs Review',
        count: 2,
        items: [
          {
            id: 'impersonation-pattern',
            label: 'Impersonation Pattern',
            badge: 'flagged',
            badgeLabel: 'HIGH',
            finding: 'Account activity shows coordinated identity signals consistent with impersonation fraud typology. Three distinct device fingerprints observed within 6-hour window.',
            evidenceDetail: 'Device records and login history included in evidence package.',
          },
          {
            id: 'transaction-velocity',
            label: 'Transaction Velocity',
            badge: 'flagged',
            badgeLabel: 'ELEVATED',
            finding: 'Volume spike of 340% above baseline in 48 hours preceding report. Multiple transfers to previously unseen counterparties.',
            evidenceDetail: '47 transactions flagged in financial activity review.',
          },
        ],
      },
      {
        id: 'adverse',
        title: 'Adverse Signals',
        count: 6,
        items: [
          { id: 'adv-1', label: 'Social Engineering Indicators', badge: 'flagged', badgeLabel: 'YES', finding: 'Message content analysis shows pressure language and urgency framing across 12 interactions.' },
          { id: 'adv-2', label: 'Counterparty Risk', badge: 'flagged', badgeLabel: 'HIGH', finding: 'Recipient account has prior adverse action history. Two linked accounts are currently denylisted.' },
          { id: 'adv-3', label: 'No Prior Relationship', badge: 'flagged', badgeLabel: 'YES', finding: 'No verifiable relationship between reporter and payee prior to incident date.' },
          { id: 'adv-4', label: 'Round Dollar Amounts', badge: 'flagged', badgeLabel: 'YES', finding: 'All transactions are exact round amounts: $500, $1000, $250. Pattern consistent with scripted fraud.' },
          { id: 'adv-5', label: 'Account Age Mismatch', badge: 'flagged', badgeLabel: 'YES', finding: 'Payee account created 3 days before first transaction. Low account age relative to transaction size.' },
          { id: 'adv-6', label: 'Device Anomaly', badge: 'flagged', badgeLabel: 'HIGH', finding: 'Payment initiated from unrecognized device with no prior account history. No MFA challenge recorded.' },
        ],
      },
      {
        id: 'mitigating',
        title: 'Mitigating Signals',
        count: 2,
        items: [
          { id: 'mit-1', label: 'Verified Identity', badge: 'clear', badgeLabel: 'VERIFIED', finding: 'Reporter identity verified via IDV. KYC status is current and in good standing.' },
          { id: 'mit-2', label: 'Transaction Authorization', badge: 'clear', badgeLabel: 'CONFIRMED', finding: 'All transactions were PIN-authenticated at initiation. No disputed authorization record found.' },
        ],
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
    createdAt: 'Apr 15, 2026',
    createdRelative: '3 months ago',
    dueAt: 'May 15, 2026',
    dueRelative: '2 months ago',
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
    numericId: '3041882',
    status: 'pending',
    queueName: 'NPID BAU / Multi-account Decisioning',
    queueSlug: 'npid_bau_demo',
    caseId: 'NTRY_CASE_nJ7xKpM2wQ',
    createdAt: 'Jun 10, 2026',
    createdRelative: '1 month ago',
    dueAt: 'Jun 13, 2026',
    dueRelative: '1 month ago',
    dueOverdue: true,
    createdBy: 'alert-broker',
    customer: {
      id: 'C_6tp4mj9bk',
      accountToken: 'AH_6tp4mj9bk',
      displayName: 'Alex Reyes',
      legalName: 'Alex M. Reyes',
      status: 'active',
      email: 'alex.reyes@example.com',
      phone: '(213) 555-0094',
      joined: '3 years ago (Sep 22, 2022)',
      address: '5900 Wilshire Blvd, Los Angeles, CA 90036, US',
      avatarColor: '#0ea5e9',
      complianceTags: ['PERSONAL', 'SSN', 'LINKED CUSTOMERS'],
    },
    primarySubject: { id: 'C_6tp4mj9bk', displayName: 'Alex Reyes', status: 'active', avatarColor: '#0ea5e9' },
    connectedSubjects: [
      { id: 'C_3nr8wp2kx', displayName: 'A. Reyes Business', status: 'active', avatarColor: '#f59e0b', sharedEvidence: [{ type: 'SSN', token: 'fid-1-d4a8c3b1...' }] },
      { id: 'C_8mq5vj3pb', displayName: 'Taylor Reyes', status: 'active', avatarColor: '#8b5cf6', sharedEvidence: [{ type: 'Device', token: 'dev-C2E4A9F7...' }, { type: 'SSN', token: 'fid-1-d4a8c3b1...' }] },
      { id: 'C_1nw4xt8kp', displayName: 'Reyes Holdings', status: 'denylisted', avatarColor: '#ef4444', sharedEvidence: [{ type: 'Bank Account', token: 'ba-018472...' }] },
    ],
    alerts: [
      { id: '7402915', accountId: 'C_6tp4mj9bk', created: 'Jun 10, 2026', typology: 'TM Alert', executionLabel: 'Execution Details' },
    ],
  },

  'npid-verification': {
    id: 'npid-verification',
    numericId: '3108247',
    status: 'pending',
    queueName: 'NPID Cluster Verification',
    queueSlug: 'npid_verification_demo',
    caseId: 'NTRY_CASE_cV5bNxP8qR',
    createdAt: 'Jul 1, 2026',
    createdRelative: '2 weeks ago',
    dueAt: 'Jul 6, 2026',
    dueRelative: '8 days ago',
    dueOverdue: true,
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
