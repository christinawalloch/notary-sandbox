import { ExternalLink, Info } from 'lucide-react'
import { DataField } from '../evidence/DenylistInfo'

export function NPIDSummaryCards() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900 mb-1">NPID_123456</h2>
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <span>
            <span className="font-medium text-zinc-900">Review type</span>{' '}
            Cluster Verification
          </span>
          <span>
            <span className="font-medium text-zinc-900">Purpose</span>{' '}
            Verify cluster accuracy
            <span
              title="Verify whether the accounts in this NPID cluster are operated by one natural person. This workflow only captures cluster accuracy — risk decisions remain in BAU workflows."
              className="ml-1 inline-flex align-middle text-zinc-400 hover:text-zinc-600 cursor-help"
            >
              <Info size={11} />
            </span>
          </span>
        </div>
      </div>

      {/* Cluster Verification trigger — why does this assignment exist? */}
      <div id="cluster-trigger">
        <h3 className="text-base font-semibold text-zinc-900 mb-1">Cluster Verification trigger</h3>
        <div className="grid grid-cols-4 gap-x-8 gap-y-1 mb-2">
          <DataField label="Trigger type" value="BAU workflow" />
          <DataField label="Triggered" value="May 27, 2026" />
          <DataField label="Source assignment">
            <span className="inline-flex items-center gap-0.5 text-xs text-brand">
              <span className="cursor-pointer hover:underline">#2969822</span>
              <ExternalLink size={10} />
            </span>
          </DataField>
          <DataField label="Source workflow" value="Cash TM" />
        </div>
        <p className="text-xs">
          <span className="font-medium text-zinc-700">Analyst cluster doubt</span>{' '}
          <span className="text-zinc-500">Conflicting verified identity data detected in cluster</span>
        </p>
      </div>

      {/* NPID cluster summary — what is the current state of the cluster? */}
      <div id="cluster-summary" className="pt-2">
        <h3 className="text-base font-semibold text-zinc-900 mb-1">NPID cluster summary</h3>
        <div className="grid grid-cols-4 gap-x-8 gap-y-1">
          <DataField label="Accounts in cluster" value="4" />
          <DataField label="Account states present" value="Active, Suspended" />
          <DataField label="Highest account CRR" value="Medium" />
          <DataField label="PEP matches" value="No match" />
          <DataField label="Adverse media hits" value="No hits" />
          <DataField label="Changed since assignment" value="No" />
        </div>
      </div>
    </div>
  )
}
