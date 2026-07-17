import { Upload, Info } from 'lucide-react'

interface AssignmentAttachmentsProps {
  assignmentId: string
}

export function AssignmentAttachments({ assignmentId }: AssignmentAttachmentsProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-900">Attachments</h3>
      <p className="text-xs text-zinc-500 mt-0.5">Files of any type (up to 1 GB in size) attached to this Assignment</p>

      <div className="mt-3 border border-dashed border-zinc-300 rounded-lg py-4 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
        <Upload size={12} className="text-zinc-400" />
        Drag and drop here or{' '}
        <button className="text-brand hover:text-brand-600 underline transition-colors">upload files</button>
      </div>

      <div className="mt-3">
        <span className="text-xs font-semibold text-zinc-700">Files</span>
        <div className="mt-2 border border-zinc-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr] text-2xs font-semibold text-zinc-500 uppercase tracking-widest px-4 py-2 bg-zinc-50 border-b border-zinc-100">
            <span>File Name</span>
            <span>Description</span>
            <span>Uploaded By</span>
            <span>Date</span>
            <span>Size</span>
          </div>
          <div className="flex flex-col items-center justify-center py-8 text-center bg-zinc-50/40">
            <Info size={18} className="text-zinc-400 mb-2" />
            <p className="text-sm font-medium text-zinc-600">No Attachments</p>
            <p className="text-xs text-zinc-400 mt-0.5">
              No files have been attached to Assignment #{assignmentId} yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
