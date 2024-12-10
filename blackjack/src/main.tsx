import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import { lazy, Suspense } from 'react'

const Welcome = lazy(() => import('./pages/welcome'));
const NotFound = lazy(() => import('./pages/error/not-found'));
const Loading = lazy(() => import('./components/loading'));
const Rooms = lazy(() => import('./pages/rooms'));
const RoomPage = lazy(() => import('./pages/rooms/[id]'));

createRoot(document.getElementById('root')!).render(
  <Suspense fallback={<Loading />}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:id" element={<RoomPage />} />
        <Route path="/demo" element={<Loading />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </Suspense>
)
