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
}

export interface WorkflowConfig {
  id: string;
  title: string;
  showAIInsights: boolean;
  aiInsightsDepth: AIDepth;
  showAccountSelector: boolean;
  accountMode: AccountMode;
  showDenylistInfo: boolean;
  showAlerts: boolean;
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
    showAlerts: true,
    decisionVariant: 'appeals',
    tabs: [
      { id: 'overview', label: 'Overview' },
      { id: 'conversation', label: 'Conversation' },
    ],
    navItems: [
      { id: 'assignment', label: 'Assignment' },
      { id: 'denylist', label: 'Denylist Info' },
      { id: 'account', label: 'Account' },
      { id: 'alerts', label: 'Alerts' },
      { id: 'timeline', label: 'Timeline' },
    ],
  },

  'scams-l1': {
    id: 'scams-l1',
    title: 'Scams L1',
    showAIInsights: true,
    aiInsightsDepth: 'l1',
    showAccountSelector: false,
    accountMode: 'single',
    showDenylistInfo: false,
    showAlerts: true,
    decisionVariant: 'scams-l1',
    tabs: [
      { id: 'ai-insights', label: 'AI Insights' },
      { id: 'account', label: 'Customer' },
      { id: 'alerts', label: 'Alerts' },
    ],
    navItems: [
      { id: 'assignment', label: 'Assignment' },
      { id: 'ai-insights', label: 'AI Insights' },
      { id: 'customer', label: 'Customer' },
      { id: 'alerts', label: 'Alerts' },
      { id: 'timeline', label: 'Timeline' },
    ],
  },

  'scams-l2': {
    id: 'scams-l2',
    title: 'Scams L2',
    showAIInsights: true,
    aiInsightsDepth: 'l2',
    showAccountSelector: true,
    accountMode: 'single',
    showDenylistInfo: false,
    showAlerts: true,
    decisionVariant: 'scams-l2',
    tabs: [
      { id: 'ai-insights', label: 'AI Insights' },
      { id: 'account', label: 'Account' },
      { id: 'transactions', label: 'Transactions' },
      { id: 'alerts', label: 'Alerts' },
    ],
    navItems: [
      { id: 'assignment', label: 'Assignment' },
      { id: 'ai-insights', label: 'AI Insights' },
      { id: 'customer', label: 'Customer' },
      { id: 'transactions', label: 'Transactions' },
      { id: 'alerts', label: 'Alerts' },
      { id: 'timeline', label: 'Timeline' },
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
    showAccountSelector: true,
    accountMode: 'multi',
    showDenylistInfo: false,
    showAlerts: true,
    decisionVariant: 'npid-bau',
    tabs: [
      { id: 'review', label: 'Review' },
      { id: 'account', label: 'Account' },
      { id: 'transactions', label: 'Transactions' },
      { id: 'alerts', label: 'Alerts' },
    ],
    navItems: [
      { id: 'assignment', label: 'Assignment' },
      { id: 'cluster', label: 'NPID Cluster' },
      { id: 'account', label: 'Account' },
      { id: 'transactions', label: 'Transactions' },
      { id: 'alerts', label: 'Alerts' },
      { id: 'timeline', label: 'Timeline' },
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
      { id: 'account', label: 'Selected Account' },
      { id: 'graph', label: 'Relationship Graph' },
      { id: 'activity', label: 'Financial Activity' },
    ],
    navItems: [
      { id: 'assignment', label: 'Assignment' },
      { id: 'cluster', label: 'Cluster Summary' },
      { id: 'graph', label: 'Relationship Graph' },
      { id: 'account', label: 'Account Detail' },
      { id: 'activity', label: 'Financial Activity' },
      { id: 'lineage', label: 'NPID Lineage' },
    ],
  },
};
