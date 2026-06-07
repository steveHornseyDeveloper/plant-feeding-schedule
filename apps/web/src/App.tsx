import { Route, Routes } from 'react-router-dom';
import { AppShell } from './layout/AppShell';
import { Today } from './pages/Today';
import { Calendar } from './pages/Calendar';
import { PlantsList } from './pages/PlantsList';
import { PlantDetail } from './pages/PlantDetail';

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Today />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/plants" element={<PlantsList />} />
        <Route path="/plants/:id" element={<PlantDetail />} />
      </Routes>
    </AppShell>
  );
}
