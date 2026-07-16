import { useState } from 'react'
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

  return (
    <AppShell
      navItems={config.navItems}
      activeNavItem={activeNavItem}
      onNavSelect={setActiveNavItem}
    >
      <div className="flex flex-1 overflow-hidden">
        {/* Main column */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Breadcrumb */}
          <div className="px-6 py-2 text-xs flex items-center gap-1.5 shrink-0">
            <Link to="/queues" className="text-zinc-500 hover:text-zinc-800 transition-colors">Home</Link>
            <span className="text-zinc-400">›</span>
            <span className="text-zinc-600 hover:text-zinc-800 transition-colors cursor-pointer" onClick={() => window.history.back()}>
              {assignment.queueName.includes(':') ? assignment.queueName.split(':')[1].trim() : assignment.queueName}
            </span>
            <span className="text-zinc-400">›</span>
            <span className="text-zinc-800 font-medium">#{assignment.numericId}</span>
          </div>

          <AssignmentHeader
            assignment={assignment}
            ctaLabel={claimed ? 'Decide' : 'Claim'}
            onCTA={handleCTA}
            claimed={claimed}
          />

          {config.showDenylistInfo && assignment.denylistInfo && (
            <div className="px-6 pt-3 pb-2 shrink-0">
              <DenylistInfo info={assignment.denylistInfo} />
            </div>
          )}

          {workflowId !== 'npid-verification' && (
            <WorkflowTabs
              tabs={config.tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
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
        {decisionPanelOpen && workflowId === 'global-appeals' && (
          <AppealsDecisionPanel
            assignmentId={assignment.numericId}
            onClose={() => setDecisionPanelOpen(false)}
            previewStep={previewStep}
          />
        )}
        {decisionPanelOpen && workflowId !== 'npid-verification' && workflowId !== 'global-appeals' && (
          <DecisionPanel
            assignmentId={assignment.numericId}
            accountToken={assignment.primarySubject?.id ?? assignment.customer?.id ?? ''}
            onClose={() => setDecisionPanelOpen(false)}
          />
        )}
      </div>
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
    return (
      <div className="p-6 space-y-6">
        {assignment.customer && (
          <CustomerCard customer={assignment.customer} />
        )}

        {config.showAccountSelector && assignment.primarySubject && (
          <div className="bg-white rounded-xl border border-zinc-200 px-5 py-4">
            <AccountSelector
              primarySubject={assignment.primarySubject}
              connectedSubjects={assignment.connectedSubjects}
              selectedId={selectedSubjectId}
              onSelect={onSelectSubject}
            />
            {selectedAccount && (
              <AccountDetails
                account={selectedAccount}
                defaultExpanded={!!(assignment.assets?.length || assignment.adversityHistory?.length)}
                expandedContent={
                  <>
                    {assignment.assets && assignment.assets.length > 0 && (
                      <AssetsIdentifiers assets={assignment.assets} />
                    )}
                    {assignment.adversityHistory && assignment.adversityHistory.length > 0 && (
                      <AdversityHistory records={assignment.adversityHistory} />
                    )}
                  </>
                }
              />
            )}
          </div>
        )}

        {config.showAlerts && assignment.alerts && (
          <AlertsTable alerts={assignment.alerts} />
        )}
      </div>
    )
  }

  // Account tab
  if (activeTab === 'account') {
    return (
      <div className="p-6">
        {assignment.primarySubject && (
          <div className="bg-white rounded-xl border border-zinc-200 px-5 py-4">
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
          <div className="bg-white rounded-xl border border-zinc-200 px-5 py-4">
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

  // Fallback placeholder
  return (
    <div className="flex items-center justify-center h-64 text-zinc-400 text-sm">
      {config.tabs.find(t => t.id === activeTab)?.label ?? activeTab} — coming soon
    </div>
  )
}
