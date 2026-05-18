import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Upload from './pages/Upload.jsx';
import ExpenseDetail from './pages/ExpenseDetail.jsx';
import EditExpense from './pages/EditExpense.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="upload" element={<Upload />} />
        <Route path="expenses/:id" element={<ExpenseDetail />} />
        <Route path="expenses/:id/edit" element={<EditExpense />} />
      </Route>
    </Routes>
  );
}
