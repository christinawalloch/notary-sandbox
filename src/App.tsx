import { Routes, Route, Navigate } from 'react-router-dom'
import QueueListPage from './pages/QueueListPage'
import AssignmentPage from './pages/AssignmentPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/queues" replace />} />
      <Route path="/queues" element={<QueueListPage />} />
      <Route path="/assignments/:workflowId" element={<AssignmentPage />} />
    </Routes>
  )
}
