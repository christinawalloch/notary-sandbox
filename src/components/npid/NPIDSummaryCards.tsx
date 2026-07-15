import { ExternalLink } from 'lucide-react'
import { DataField } from '../evidence/DenylistInfo'

export function NPIDSummaryCards() {
  return (
    <div className="space-y-4">
      {/* NPID ID header */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900 mb-1">NPID_123456</h2>
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <span>
            <span className="font-medium text-zinc-700">Cluster Verification</span>
            <span className="mx-2 text-zinc-300">·</span>
            Conflicting verified identity data detected in cluster
          </span>
          <span>
            <span className="font-medium text-zinc-900">Alert date</span>{' '}
            May 27, 2026
          </span>
          <span>
            <span className="font-medium text-zinc-900">4</span>{' '}
            accounts in official scope
          </span>
        </div>
        <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
          Verify whether the accounts in this NPID cluster are operated by one natural person. This workflow only captures cluster accuracy — risk decisions remain in BAU workflows.
        </p>
      </div>

      {/* Cluster Verification trigger */}
      <div>
        <h3 className="text-base font-semibold text-zinc-900 mb-1">Cluster Verification trigger</h3>
        <div className="grid grid-cols-4 gap-x-8 gap-y-4 mb-4">
          <DataField label="Trigger Type" value="BAU workflow" />
          <DataField label="NPID Under Review" value="NPID_123456" mono />
          <DataField label="Latest Clustering Run" value="May 27, 2026 at 4:12 pm" />
          <DataField label="Accounts in Cluster" value="4" />
          <DataField label="Source Assignment">
            <div className="flex items-center gap-0.5 text-sm font-medium">
              <span className="text-brand cursor-pointer hover:underline">#2969822</span>
              <ExternalLink size={10} className="text-brand" />
            </div>
          </DataField>
          <DataField label="Source Workflow" value="Cash TM" />
          <DataField wide label="Analyst Cluster Doubt" value="Conflicting CIP signal and suspended account may indicate over-clustering" />
        </div>
      </div>

      {/* NPID cluster summary */}
      <div className="pt-2">
        <h3 className="text-base font-semibold text-zinc-900 mb-1">NPID cluster summary</h3>
        <div className="grid grid-cols-4 gap-x-8 gap-y-4">
          <DataField label="NPID" value="NPID_123456" mono />
          <DataField label="Highest Account CRR" value="Medium" />
          <DataField label="PEP Matches" value="No match" />
          <DataField label="Adverse Media Hits" value="No hits" />
          <DataField label="Total Accounts" value="4" />
          <DataField label="Account States Present" value="Active, Suspended" />
          <DataField label="Latest Clustering Run" value="May 27, 2026 at 4:12 pm" />
          <DataField label="Scope Changed Since Assignment" value="No" />
        </div>
      </div>
    </div>
  )
}
