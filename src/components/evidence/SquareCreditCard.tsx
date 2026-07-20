import { useState } from 'react'
import { CreditCard, DollarSign, Calendar, ChevronDown, User } from 'lucide-react'
import clsx from 'clsx'

const CARD = {
  name: 'Credit Card 54157',
  status: 'ALLOCATED',
  id: 'P-1VN0OZ',
  creditLimit: '$15,000.00',
  paymentDueDate: '6/4/2025',
  autopayStatus: 'Enabled — STATEMENT_AMOUNT',
  // Card Details
  cardReferenceId: '394000138039',
  customerReferenceId: '3940000000000001380',
  apr: '12%',
  holdRate: '10%',
  financial: {
    minPayPercentage: '13%',
    outstandingBalance: '$0.00',
    rewardType: 'MULTIPLIERS',
    rewardBankBalance: '$577,457.19',
    rewardsRedeemed: '$0.00',
    autopayAmount: '$0.00',
  },
  cardTimeline: {
    createdAt: '2/8/22, 4:16:34 PM EST',
    closedAt: '—',
    cardState: 'ALLOCATED',
    paymentDueDate: '6/4/2025',
  },
  // Overview
  summary: {
    createdAt: '2/8/22, 4:16:34 PM EST',
    closedAt: '—',
    totalBalanceOutstanding: '$0.00',
    outstandingPrincipal: '$0.00',
    pastDueAmount: '$0.00',
    daysPastDue: '0',
  },
  address: {
    shipping: '111 Ashburn Ct, Chicago, IL, 60176',
    billing: '111 Ashburn Ct, Chicago, IL, 60176',
  },
  appInfo: {
    applicationState: 'ONBOARDED',
    name: 'Sue Williams',
    businessEntityType: 'SOLE PROPRIETORSHIP',
    ownershipPercentage: '—',
    managementRoleTitle: '—',
    nonManagementRoleTitle: '—',
  },
  appTimeline: {
    submittedAt: '2/8/22, 4:15:24 PM EST',
    completedAt: '2/8/22, 4:16:37 PM EST',
  },
  // Application
  application: {
    token: 'A-CC-3W6F35N4NK7ZHS',
    state: 'ONBOARDED',
    name: 'Sue Williams',
    businessName: 'QA CoffeevoJbtlEN',
  },
  business: {
    businessType: 'SOLE PROPRIETORSHIP',
    tinStatus: 'VERIFIED',
    ownershipPercentage: '—',
    managementRoleTitle: '—',
    nonManagementRoleTitle: '—',
  },
}

const TABS = ['Overview', 'Card Details', 'Application'] as const
type Tab = typeof TABS[number]

export function SquareCreditCard() {
  const [activeTab, setActiveTab] = useState<Tab>('Card Details')
  const [financialOpen, setFinancialOpen] = useState(false)
  const [cardTimelineOpen, setCardTimelineOpen] = useState(false)
  const [businessOpen, setBusinessOpen] = useState(false)
  const [appTimelineOpen, setAppTimelineOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-5 border-b border-zinc-100">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <CreditCard size={16} className="text-zinc-700 shrink-0" />
            <span className="text-sm font-bold text-zinc-900">{CARD.name}</span>
            <span className="px-2 py-0.5 text-2xs font-bold tracking-widest uppercase border border-zinc-300 rounded text-zinc-600">
              {CARD.status}
            </span>
          </div>
          <span className="text-xs text-zinc-400 font-mono shrink-0">ID: {CARD.id}</span>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-zinc-500 mb-1">Credit Limit</p>
            <p className="text-xl font-bold text-zinc-900">{CARD.creditLimit}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Payment Due Date</p>
            <p className="text-xl font-bold text-zinc-900">{CARD.paymentDueDate}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Autopay Status</p>
            <p className="text-sm font-semibold text-zinc-900 mt-0.5">{CARD.autopayStatus}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 px-4">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'px-3 py-3 text-sm font-medium border-b-2 transition-colors -mb-px',
              activeTab === tab
                ? 'border-zinc-900 text-zinc-900'
                : 'border-transparent text-zinc-400 hover:text-zinc-600'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'Overview' && (
        <div className="p-6 grid grid-cols-2 gap-x-12 gap-y-8">
          {/* Left: Card Summary */}
          <div>
            <h3 className="text-sm font-bold text-zinc-900 mb-4">Card Summary</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <DataField label="Created At" value={CARD.summary.createdAt} />
              <DataField label="Closed At" value={CARD.summary.closedAt} />
              <DataField label="Total Balance Outstanding" value={CARD.summary.totalBalanceOutstanding} />
              <DataField label="Outstanding Principal" value={CARD.summary.outstandingPrincipal} />
              <DataField label="Past Due Amount" value={CARD.summary.pastDueAmount} />
              <DataField label="Days Past Due" value={CARD.summary.daysPastDue} />
            </div>
          </div>

          {/* Right: Application Info */}
          <div>
            <h3 className="text-sm font-bold text-zinc-900 mb-4">Application Info</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <DataField label="Application State" value={CARD.appInfo.applicationState} />
              <DataField label="Name" value={CARD.appInfo.name} />
              <DataField label="Business Entity Type" value={CARD.appInfo.businessEntityType} />
              <DataField label="Ownership Percentage" value={CARD.appInfo.ownershipPercentage} />
              <DataField label="Management Role Title" value={CARD.appInfo.managementRoleTitle} />
              <DataField label="Non Management Role Title" value={CARD.appInfo.nonManagementRoleTitle} />
            </div>
          </div>

          {/* Left: Address Information */}
          <div>
            <h3 className="text-sm font-bold text-zinc-900 mb-4">Address Information</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <DataField label="Shipping Address" value={CARD.address.shipping} />
              <DataField label="Billing Address" value={CARD.address.billing} />
            </div>
          </div>

          {/* Right: Application Timeline */}
          <div>
            <h3 className="text-sm font-bold text-zinc-900 mb-4">Application Timeline</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <DataField label="Submitted At" value={CARD.appTimeline.submittedAt} />
              <DataField label="Completed At" value={CARD.appTimeline.completedAt} />
            </div>
          </div>
        </div>
      )}

      {/* Card Details */}
      {activeTab === 'Card Details' && (
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-x-16 gap-y-5">
            <DataField label="Card Reference ID" value={CARD.cardReferenceId} />
            <DataField label="Customer Reference ID" value={CARD.customerReferenceId} />
            <DataField label="APR" value={CARD.apr} />
            <DataField label="Hold Rate" value={CARD.holdRate} />
          </div>

          <Accordion
            icon={<DollarSign size={13} />}
            title="Financial Details"
            open={financialOpen}
            onToggle={() => setFinancialOpen(v => !v)}
          >
            <div className="grid grid-cols-2 gap-x-16 gap-y-5 px-4 pb-5 pt-4">
              <DataField label="Min Pay Percentage" value={CARD.financial.minPayPercentage} />
              <DataField label="Outstanding Balance" value={CARD.financial.outstandingBalance} />
              <DataField label="Reward Type" value={CARD.financial.rewardType} />
              <DataField label="Reward Bank Balance" value={CARD.financial.rewardBankBalance} />
              <DataField label="Rewards Redeemed" value={CARD.financial.rewardsRedeemed} />
              <DataField label="Autopay Amount" value={CARD.financial.autopayAmount} />
            </div>
          </Accordion>

          <Accordion
            icon={<Calendar size={13} />}
            title="Timeline & Status"
            open={cardTimelineOpen}
            onToggle={() => setCardTimelineOpen(v => !v)}
          >
            <div className="grid grid-cols-2 gap-x-16 gap-y-5 px-4 pb-5 pt-4">
              <DataField label="Created At" value={CARD.cardTimeline.createdAt} />
              <DataField label="Closed At" value={CARD.cardTimeline.closedAt} />
              <DataField label="Card State" value={CARD.cardTimeline.cardState} />
              <DataField label="Payment Due Date" value={CARD.cardTimeline.paymentDueDate} />
            </div>
          </Accordion>
        </div>
      )}

      {/* Application */}
      {activeTab === 'Application' && (
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-x-16 gap-y-5">
            <DataField label="Token" value={CARD.application.token} />
            <DataField label="State" value={CARD.application.state} />
            <DataField label="Name" value={CARD.application.name} />
            <DataField label="Business Name" value={CARD.application.businessName} />
          </div>

          <Accordion
            icon={<User size={13} />}
            title="Business Details"
            open={businessOpen}
            onToggle={() => setBusinessOpen(v => !v)}
          >
            <div className="grid grid-cols-2 gap-x-16 gap-y-5 px-4 pb-5 pt-4">
              <DataField label="Business Type" value={CARD.business.businessType} />
              <DataField label="TIN Status" value={CARD.business.tinStatus} />
              <DataField label="Ownership Percentage" value={CARD.business.ownershipPercentage} />
              <DataField label="Management Role Title" value={CARD.business.managementRoleTitle} />
              <DataField label="Non Management Role Title" value={CARD.business.nonManagementRoleTitle} />
            </div>
          </Accordion>

          <Accordion
            icon={<Calendar size={13} />}
            title="Application Timeline & Address"
            open={appTimelineOpen}
            onToggle={() => setAppTimelineOpen(v => !v)}
            highlighted
          >
            <div className="grid grid-cols-2 gap-x-16 gap-y-5 px-4 pb-5 pt-4">
              <DataField label="Submitted At" value={CARD.appTimeline.submittedAt} />
              <DataField label="Completed At" value={CARD.appTimeline.completedAt} />
              <DataField label="Shipping Address" value={CARD.address.shipping} />
            </div>
          </Accordion>
        </div>
      )}
    </div>
  )
}

function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-zinc-900">{label}</p>
      <p className="text-xs text-zinc-500">{value}</p>
    </div>
  )
}

function Accordion({
  icon, title, open, onToggle, highlighted = false, children,
}: {
  icon: React.ReactNode
  title: string
  open: boolean
  onToggle: () => void
  highlighted?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={clsx(
      'border rounded-xl overflow-hidden',
      highlighted ? 'border-brand/40' : 'border-zinc-200'
    )}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50 transition-colors"
      >
        <div className="flex items-center gap-2 text-zinc-700">
          {icon}
          <span className="text-sm font-semibold text-zinc-900">{title}</span>
        </div>
        <ChevronDown
          size={15}
          className={clsx('text-zinc-400 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      {open && <div className="border-t border-zinc-100">{children}</div>}
    </div>
  )
}
