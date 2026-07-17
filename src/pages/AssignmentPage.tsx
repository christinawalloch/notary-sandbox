import { useState } from 'react'
import { CheckCircle, Plus, Minus } from 'lucide-react'
import { useParams, Navigate, Link, useSearchParams } from 'react-router-dom'
import { AppShell } from '../components/shell/AppShell'
import { AssignmentHeader } from '../components/assignment/AssignmentHeader'
import { WorkflowTabs } from '../components/assignment/WorkflowTabs'
import { AccountSelector } from '../components/account/AccountSelector'
import { AccountDetails } from '../components/account/AccountDetails'
import { AIInsightsPanel } from '../components/ai-insights/AIInsightsPanel'
import { AlertsTable } from '../components/evidence/AlertsTable'
import { DenylistInfo } from '../components/evidence/DenylistInfo'
import { AssetsIdentifiers } from '../components/evidence/AssetsIdentifiers'
import { AdversityHistory } from '../components/evidence/AdversityHistory'
import { IDVAttempts } from '../components/evidence/IDVAttempts'
import { GovernmentIDImages } from '../components/evidence/GovernmentIDImages'
import { TransactionSearch } from '../components/evidence/TransactionSearch'
import { ConversationHistory } from '../components/evidence/ConversationHistory'
import { AssignmentTimeline } from '../components/assignment/AssignmentTimeline'
import { AssignmentAttachments } from '../components/assignment/AssignmentAttachments'
import { DecisionPanel } from '../components/decision/DecisionPanel'
import { AppealsDecisionPanel } from '../components/decision/AppealsDecisionPanel'
import { CustomerCard } from '../components/customer/CustomerCard'
import { NPIDSummaryCards } from '../components/npid/NPIDSummaryCards'
import { NPIDClusterGraph } from '../components/npid/NPIDClusterGraph'
import { NPIDDecisionPanel } from '../components/npid/NPIDDecisionPanel'
import { NPIDAccountView } from '../components/npid/NPIDAccountView'
import { WORKFLOW_CONFIGS, type WorkflowConfig } from '../config/workflows'
import { ASSIGNMENTS, type Assignment, type Account } from '../data/mock'

export default function AssignmentPage() {
  const { workflowId = '' } = useParams<{ workflowId: string }>()
  const [searchParams] = useSearchParams()
  const previewStep = searchParams.get('preview')

  const config = WORKFLOW_CONFIGS[workflowId]
  const assignment = ASSIGNMENTS[workflowId]

  if (!config || !assignment) return <Navigate to="/queues" replace />

  const [activeTab, setActiveTab] = useState(config.tabs[0].id)
  const [activeNavItem, setActiveNavItem] = useState(config.navItems[0]?.id)
  const [claimed, setClaimed] = useState(false)
  const [decisionPanelOpen, setDecisionPanelOpen] = useState(false)
  const [completionType, setCompletionType] = useState<'completed' | 'l2-review' | null>(null)
  const [toastShowing, setToastShowing] = useState(false)

  const handleComplete = (isL2: boolean) => {
    const type = isL2 ? 'l2-review' : 'completed'
    setCompletionType(type)
    setToastShowing(true)
    setTimeout(() => setToastShowing(false), 3000)
  }
  const [markedIds, setMarkedIds] = useState<Set<string>>(new Set())
  const [markReasons, setMarkReasons] = useState<Record<string, string>>({})
  const [selectedSubjectId, setSelectedSubjectId] = useState(
    assignment.primarySubject?.id ?? assignment.customer?.id ?? ''
  )

  const selectedAccount =
    selectedSubjectId === assignment.primarySubject?.id
      ? (assignment.customer ?? assignment.primarySubject)
      : assignment.connectedSubjects?.find(s => s.id === selectedSubjectId)

  const handleCTA = () => {
    if (!claimed) {
      setClaimed(true)
    } else {
      setDecisionPanelOpen(v => !v)
    }
  }

  const NAV_TO_TAB: Record<string, string> = {
    'customer-info': 'overview', 'account': 'overview', 'account-details': 'overview',
    'assets': 'overview', 'adversity-history': 'overview', 'idv-attempts': 'overview', 'government-id': 'overview',
    'ai-insights': 'ai-insights',
    'money': 'money', 'transaction-search': 'money',
    'conversation': 'conversation', 'email-history': 'conversation',
    'alerts': 'overview',
  }

  const handleNavSelect = (id: string) => {
    setActiveNavItem(id)
    const targetTab = NAV_TO_TAB[id]
    if (targetTab && config.tabs.some(t => t.id === targetTab)) setActiveTab(targetTab)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })
  }

  return (
    <AppShell
      navItems={config.navItems}
      activeNavItem={activeNavItem}
      onNavSelect={handleNavSelect}
    >
      <div className="flex flex-1 overflow-hidden">
        {/* Main column */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-scroll">
            {/* Breadcrumb */}
            <div className="px-6 pt-2 pb-1 text-xs flex items-center gap-1.5">
              <Link to="/queues" className="text-zinc-500 hover:text-zinc-800 transition-colors">Home</Link>
              <span className="text-zinc-400">›</span>
              <span className="text-zinc-600 hover:text-zinc-800 transition-colors cursor-pointer" onClick={() => window.history.back()}>
                {assignment.queueName}
              </span>
              <span className="text-zinc-400">›</span>
              <span className="text-zinc-800 font-medium">#{assignment.numericId}</span>
            </div>

            <AssignmentHeader
              assignment={assignment}
              ctaLabel={claimed ? 'Decide' : 'Claim'}
              onCTA={handleCTA}
              claimed={claimed}
              completed={!!completionType}
            />

            {config.showDenylistInfo && assignment.denylistInfo && (
              <div id="appeal-context" className="px-6 pt-0 pb-2">
                <DenylistInfo info={assignment.denylistInfo} />
              </div>
            )}

            {workflowId !== 'npid-verification' && config.tabs.length > 1 && (
              <div>
                <WorkflowTabs
                  tabs={config.tabs}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </div>
            )}

            {workflowId === 'npid-verification' ? (
              <NPIDContent
                markedIds={markedIds}
                markReasons={markReasons}
                onMark={(id, reason) => {
                  setMarkedIds(prev => new Set([...prev, id]))
                  setMarkReasons(prev => ({ ...prev, [id]: reason }))
                }}
              />
            ) : (
              <TabContent
                activeTab={activeTab}
                config={config}
                assignment={assignment}
                selectedSubjectId={selectedSubjectId}
                onSelectSubject={setSelectedSubjectId}
                selectedAccount={selectedAccount}
              />
            )}
          </div>
        </div>

        {/* Push decision panel */}
        {decisionPanelOpen && workflowId === 'npid-verification' && (
          <NPIDDecisionPanel
            onClose={() => setDecisionPanelOpen(false)}
            markedIds={markedIds}
            markReasons={markReasons}
          />
        )}
        {decisionPanelOpen && config.decisionVariant === 'appeals' && (
          <AppealsDecisionPanel
            assignmentId={assignment.numericId}
            onClose={() => setDecisionPanelOpen(false)}
            onComplete={handleComplete}
            previewStep={previewStep}
          />
        )}
        {decisionPanelOpen && workflowId !== 'npid-verification' && config.decisionVariant !== 'appeals' && (
          <DecisionPanel
            assignmentId={assignment.numericId}
            accountToken={assignment.primarySubject?.id ?? assignment.customer?.id ?? ''}
            onClose={() => setDecisionPanelOpen(false)}
          />
        )}
      </div>
      {completionType && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${toastShowing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}`}>
          <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-600 rounded-xl shadow-xl">
            <CheckCircle size={16} className="text-white shrink-0" />
            <span className="text-sm font-medium text-white">
              {completionType === 'l2-review'
                ? 'Assignment complete and sent for L2 approval'
                : 'Assignment completed'}
            </span>
          </div>
        </div>
      )}
    </AppShell>
  )
}

// ─── NPID Verification layout ─────────────────────────────────────────────────

function NPIDContent({
  markedIds,
  markReasons: _markReasons,
  onMark,
}: {
  markedIds: Set<string>
  markReasons: Record<string, string>
  onMark: (id: string, reason: string) => void
}) {
  const [selectedId, setSelectedId] = useState('john-doe')

  return (
    <div className="px-6 pb-6 pt-2 space-y-6">
      <NPIDSummaryCards />
      <NPIDClusterGraph
        markedIds={markedIds}
        onMark={onMark}
        selectedId={selectedId}
        onSelectId={setSelectedId}
      />
      <NPIDAccountView selectedId={selectedId} onSelectId={setSelectedId} />
    </div>
  )
}

function TabContent({
  activeTab,
  config,
  assignment,
  selectedSubjectId,
  onSelectSubject,
  selectedAccount,
}: {
  activeTab: string
  config: WorkflowConfig
  assignment: Assignment
  selectedSubjectId: string
  onSelectSubject: (id: string) => void
  selectedAccount: Account | undefined
}) {
  const [activityOpen, setActivityOpen] = useState(false)

  // AI Insights tab (scams, sar)
  if (activeTab === 'ai-insights' && assignment.aiInsights) {
    return (
      <div className="p-6">
        <AIInsightsPanel
          groups={assignment.aiInsights}
          depth={config.aiInsightsDepth === 'none' ? 'l1' : config.aiInsightsDepth}
        />
        {assignment.customer && (
          <div className="mt-4">
            <CustomerCard customer={assignment.customer} />
          </div>
        )}
      </div>
    )
  }

  // Overview tab (global-appeals default)
  if (activeTab === 'overview' || activeTab === 'review') {
    const accountId = selectedAccount?.id ?? assignment.customer?.id ?? assignment.primarySubject?.id ?? ''
    return (
      <div className="px-6 pt-0 pb-6 space-y-2">
        {config.showAlertsAtTop && assignment.alerts && (
          <div id="alerts">
            <AlertsTable alerts={assignment.alerts} />
          </div>
        )}

        {config.showAssignmentActivity && (
          <>
            <div className="flex justify-end mb-1 pr-1">
              <button
                onClick={() => setActivityOpen(v => !v)}
                className="flex items-center gap-1 text-xs font-medium text-brand hover:opacity-80 transition-opacity shrink-0 whitespace-nowrap"
              >
                {activityOpen ? <Minus size={12} /> : <Plus size={12} />}
                {activityOpen ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
            {activityOpen && (
              <div className="space-y-6 pt-1">
                <AssignmentAttachments assignmentId={assignment.numericId} />
                <div className="pb-5">
                  <AssignmentTimeline
                    assignmentId={assignment.numericId}
                    events={assignment.timelineEvents ?? []}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {config.aiInsightsPosition === 'inline' && assignment.aiInsights && (
          <div id="ai-insights">
            <AIInsightsPanel
              groups={assignment.aiInsights}
              depth={config.aiInsightsDepth === 'none' ? 'l1' : config.aiInsightsDepth}
            />
          </div>
        )}

        {assignment.customer && (
          <div id="customer-info">
            <CustomerCard customer={assignment.customer} />
          </div>
        )}

        {config.showAccountSelector && assignment.primarySubject && (
          <div id="account" className="bg-white rounded-xl border border-zinc-200 px-4 pt-3 pb-4">
            <AccountSelector
              primarySubject={assignment.primarySubject}
              connectedSubjects={assignment.connectedSubjects}
              selectedId={selectedSubjectId}
              onSelect={onSelectSubject}
              hideDenylistBadge={!(config.showDenylistBadge ?? true)}
            />
            {selectedAccount && (
              <div id="account-details">
                <AccountDetails
                  account={selectedAccount}
                  defaultExpanded={!config.collapseAccountByDefault && !!(assignment.assets?.length || assignment.adversityHistory?.length || assignment.adversityHistoryByAccount)}
                  expandedContent={
                    <>
                      {(config.showAssets ?? true) && assignment.assets && assignment.assets.length > 0 && (
                        <div id="assets" className="scroll-mt-4">
                          <AssetsIdentifiers assets={assignment.assets} />
                        </div>
                      )}
                      {assignment.adversityHistoryByAccount ? (
                        <div id="adversity-history" className="scroll-mt-4">
                          <AdversityHistory records={assignment.adversityHistoryByAccount[selectedAccount.id] ?? []} />
                        </div>
                      ) : (
                        assignment.adversityHistory && assignment.adversityHistory.length > 0 && (
                          <div id="adversity-history" className="scroll-mt-4">
                            <AdversityHistory records={assignment.adversityHistory} />
                          </div>
                        )
                      )}
                      {assignment.idvAttempts && (
                        <div id="idv-attempts" className="scroll-mt-4">
                          <IDVAttempts attempts={assignment.idvAttempts[selectedAccount.id] ?? []} />
                        </div>
                      )}
                      {assignment.idvAttempts && (
                        <div id="government-id" className="scroll-mt-4">
                          <GovernmentIDImages accountId={selectedAccount.id} />
                        </div>
                      )}
                    </>
                  }
                />
              </div>
            )}
          </div>
        )}

        {config.showTransactionsInline && (
          <div id="transaction-search">
            <TransactionSearch
              transactions={assignment.transactions?.[accountId] ?? []}
              accountId={accountId}
            />
          </div>
        )}

        {!config.showAlertsAtTop && config.showAlerts && assignment.alerts && (
          <div id="alerts">
            <AlertsTable alerts={assignment.alerts} />
          </div>
        )}
      </div>
    )
  }

  // Account tab
  if (activeTab === 'account') {
    return (
      <div className="p-6">
        {assignment.primarySubject && (
          <div className="bg-white rounded-xl border border-zinc-200 px-4 pt-3 pb-4">
            <AccountSelector
              primarySubject={assignment.primarySubject}
              connectedSubjects={assignment.connectedSubjects}
              selectedId={selectedSubjectId}
              onSelect={onSelectSubject}
            />
            {selectedAccount && <AccountDetails account={selectedAccount} />}
          </div>
        )}
      </div>
    )
  }

  // Alerts tab
  if (activeTab === 'alerts') {
    return (
      <div className="p-6">
        <AlertsTable alerts={assignment.alerts ?? []} />
      </div>
    )
  }

  // Subjects tab (SAR)
  if (activeTab === 'subjects') {
    return (
      <div className="p-6">
        {assignment.primarySubject && (
          <div className="bg-white rounded-xl border border-zinc-200 px-4 pt-3 pb-4">
            <AccountSelector
              primarySubject={assignment.primarySubject}
              connectedSubjects={assignment.connectedSubjects}
              selectedId={selectedSubjectId}
              onSelect={onSelectSubject}
            />
            {selectedAccount && <AccountDetails account={selectedAccount} />}
          </div>
        )}
      </div>
    )
  }

  // Money tab
  if (activeTab === 'money') {
    const accountId = selectedAccount?.id ?? assignment.customer?.id ?? assignment.primarySubject?.id ?? ''
    return (
      <div id="money" className="px-6 pt-3 pb-6">
        <div id="transaction-search">
          <TransactionSearch
            transactions={assignment.transactions?.[accountId] ?? []}
            accountId={accountId}
          />
        </div>
      </div>
    )
  }

  // Conversation tab
  if (activeTab === 'conversation') {
    return (
      <div id="conversation" className="px-6 pt-3 pb-6">
        <div id="email-history">
          <ConversationHistory />
        </div>
      </div>
    )
  }

  // Fallback placeholder
  return (
    <div className="flex items-center justify-center h-64 text-zinc-400 text-sm">
      {config.tabs.find(t => t.id === activeTab)?.label ?? activeTab} — coming soon
    </div>
  )
}
