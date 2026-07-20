export type DecisionVariant =
  | 'appeals'
  | 'scams-l1'
  | 'scams-l2'
  | 'sar'
  | 'npid-bau'
  | 'npid-verification';

export type AccountMode = 'single' | 'multi' | 'cluster';
export type AIDepth = 'l1' | 'l2' | 'sar' | 'none';

export interface TabConfig {
  id: string;
  label: string;
}

export interface NavItem {
  id: string;
  label: string;
  isSection?: boolean;
  children?: NavItem[];
}

export interface WorkflowConfig {
  id: string;
  title: string;
  showAIInsights: boolean;
  aiInsightsDepth: AIDepth;
  aiInsightsPosition?: 'tab' | 'inline';
  showAccountSelector: boolean;
  accountMode: AccountMode;
  showDenylistInfo: boolean;
  showDenylistBadge?: boolean;
  showAssets?: boolean;
  showAlerts: boolean;
  showTransactionsInline?: boolean;
  showAlertsAtTop?: boolean;
  showAssignmentActivity?: boolean;
  collapseAccountByDefault?: boolean;
  decisionVariant: DecisionVariant;
  tabs: TabConfig[];
  navItems: NavItem[];
}

export const WORKFLOW_CONFIGS: Record<string, WorkflowConfig> = {
  'global-appeals': {
    id: 'global-appeals',
    title: 'Global Appeals',
    showAIInsights: false,
    aiInsightsDepth: 'none',
    showAccountSelector: true,
    accountMode: 'single',
    showDenylistInfo: true,
    showDenylistBadge: true,
    showAssets: true,
    showAlerts: false,
    decisionVariant: 'appeals',
    tabs: [
      { id: 'overview', label: 'Overview' },
      { id: 'money', label: 'Money' },
      { id: 'conversation', label: 'Conversation' },
    ],
    navItems: [
      { id: 'assignment', label: 'Assignment' },
      { id: 'appeal-context', label: 'Appeal Context' },
      { id: 'customer-info', label: 'Customer Info' },
      {
        id: 'account', label: 'Account',
        children: [
          { id: 'account-details', label: 'Account Details' },
          { id: 'assets', label: 'Assets & Identifiers' },
          { id: 'adversity-history', label: 'Adversity History' },
          { id: 'idv-attempts', label: 'IDV Attempts' },
          { id: 'government-id', label: 'Government ID' },
        ],
      },
      {
        id: 'money', label: 'Money',
        children: [
          { id: 'transaction-search', label: 'Transaction Search' },
        ],
      },
      {
        id: 'conversation', label: 'Conversation',
        children: [
          { id: 'email-history', label: 'Email History' },
        ],
      },
    ],
  },

  'global-appeals-scam-v0': {
    id: 'global-appeals-scam-v0',
    title: 'Global Appeals Scam V0',
    showAIInsights: false,
    aiInsightsDepth: 'none',
    showAccountSelector: true,
    accountMode: 'single',
    showDenylistInfo: false,
    showDenylistBadge: false,
    showAssets: false,
    showAlerts: false,
    decisionVariant: 'appeals',
    tabs: [
      { id: 'overview', label: 'Overview' },
      { id: 'money', label: 'Money' },
      { id: 'conversation', label: 'Conversation' },
    ],
    navItems: [
      { id: 'assignment', label: 'Assignment' },
      { id: 'customer-info', label: 'Customer Info' },
      {
        id: 'account', label: 'Account',
        children: [
          { id: 'account-details', label: 'Account Details' },
          { id: 'adversity-history', label: 'Adversity History' },
          { id: 'idv-attempts', label: 'IDV Attempts' },
          { id: 'government-id', label: 'Government ID' },
        ],
      },
      {
        id: 'money', label: 'Money',
        children: [
          { id: 'transaction-search', label: 'Transaction Search' },
        ],
      },
      {
        id: 'conversation', label: 'Conversation',
        children: [
          { id: 'email-history', label: 'Email History' },
        ],
      },
    ],
  },

  'scams-l1': {
    id: 'scams-l1',
    title: 'Scams L1',
    showAIInsights: true,
    aiInsightsDepth: 'l1',
    aiInsightsPosition: 'inline',
    showAccountSelector: true,
    accountMode: 'single',
    showDenylistInfo: false,
    showDenylistBadge: false,
    showAssets: true,
    showAlerts: true,
    showAlertsAtTop: true,
    showTransactionsInline: true,
    showAssignmentActivity: true,
    collapseAccountByDefault: true,
    decisionVariant: 'scams-l1',
    tabs: [
      { id: 'overview', label: 'Overview' },
    ],
    navItems: [
      { id: 'ai-insights', label: 'AI Insights' },
      { id: 'customer-info', label: 'Customer' },
      {
        id: 'account', label: 'Account',
        children: [
          { id: 'account-details', label: 'Account Details' },
          { id: 'assets', label: 'Assets & Identifiers' },
          { id: 'adversity-history', label: 'Adversity History' },
          { id: 'idv-attempts', label: 'IDV Attempts' },
          { id: 'government-id', label: 'Government ID' },
        ],
      },
      { id: 'transaction-search', label: 'Transactions' },
      { id: 'alerts', label: 'Alerts' },
    ],
  },

  'scams-l2': {
    id: 'scams-l2',
    title: 'Scams L2',
    showAIInsights: true,
    aiInsightsDepth: 'l2',
    aiInsightsPosition: 'inline',
    showAccountSelector: true,
    accountMode: 'single',
    showDenylistInfo: false,
    showDenylistBadge: false,
    showAssets: true,
    showAlerts: true,
    showAlertsAtTop: true,
    showTransactionsInline: true,
    showAssignmentActivity: true,
    collapseAccountByDefault: true,
    decisionVariant: 'scams-l2',
    tabs: [
      { id: 'overview', label: 'Overview' },
    ],
    navItems: [
      { id: 'ai-insights', label: 'AI Insights' },
      { id: 'customer-info', label: 'Customer' },
      {
        id: 'account', label: 'Account',
        children: [
          { id: 'account-details', label: 'Account Details' },
          { id: 'assets', label: 'Assets & Identifiers' },
          { id: 'adversity-history', label: 'Adversity History' },
          { id: 'idv-attempts', label: 'IDV Attempts' },
          { id: 'government-id', label: 'Government ID' },
        ],
      },
      { id: 'transaction-search', label: 'Transactions' },
      { id: 'alerts', label: 'Alerts' },
    ],
  },

  'sar-ai': {
    id: 'sar-ai',
    title: 'SAR with AI Insights',
    showAIInsights: true,
    aiInsightsDepth: 'sar',
    showAccountSelector: true,
    accountMode: 'multi',
    showDenylistInfo: false,
    showAlerts: true,
    decisionVariant: 'sar',
    tabs: [
      { id: 'ai-insights', label: 'AI Insights' },
      { id: 'subjects', label: 'Subjects' },
      { id: 'transactions', label: 'Transaction Search' },
      { id: 'narrative', label: 'Narrative' },
    ],
    navItems: [
      { id: 'assignment', label: 'Assignment' },
      { id: 'ai-insights', label: 'AI Insights' },
      { id: 'subjects', label: 'Key Parties' },
      { id: 'transactions', label: 'Transaction Search' },
      { id: 'narrative', label: 'Narrative Support' },
      { id: 'timeline', label: 'Timeline' },
    ],
  },

  'npid-bau': {
    id: 'npid-bau',
    title: 'NPID BAU / Multi-account',
    showAIInsights: false,
    aiInsightsDepth: 'none',
    showAccountSelector: false,
    accountMode: 'multi',
    showDenylistInfo: false,
    showAlerts: false,
    decisionVariant: 'npid-bau',
    tabs: [
      { id: 'cluster', label: 'Cluster' },
    ],
    navItems: [
      { id: 'assignment-section', label: 'Assignment', isSection: true, children: [
        { id: 'assignment-overview', label: 'Overview' },
      ]},
      { id: 'customer-section', label: 'Customer', isSection: true, children: [
        { id: 'customer', label: 'Jordan Mercer' },
      ]},
      { id: 'npid-context-section', label: 'NPID Context', isSection: true, children: [
        { id: 'alert-context', label: 'Alert Context' },
        { id: 'accounts-in-scope', label: 'Accounts in Scope' },
      ]},
      { id: 'transaction-search-section', label: 'Transaction Search', isSection: true, children: [
        { id: 'bau-transactions', label: 'Transactions' },
      ]},
    ],
  },

  'npid-verification': {
    id: 'npid-verification',
    title: 'NPID Cluster Verification',
    showAIInsights: false,
    aiInsightsDepth: 'none',
    showAccountSelector: true,
    accountMode: 'cluster',
    showDenylistInfo: false,
    showAlerts: false,
    decisionVariant: 'npid-verification',
    tabs: [
      { id: 'cluster', label: 'Cluster' },
    ],
    navItems: [
      { id: 'cluster-trigger', label: 'Cluster trigger' },
      { id: 'cluster-summary', label: 'Cluster summary' },
      { id: 'cluster-graph', label: 'Cluster graph' },
      { id: 'account-detail', label: 'Account detail' },
      { id: 'transactions', label: 'Transactions' },
    ],
  },
};
