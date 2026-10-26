import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { BrowseItems } from './pages/BrowseItems';
import { LostItems } from './pages/LostItems';
import { FoundItems } from './pages/FoundItems';
import { ItemDetails } from './pages/ItemDetails';
import { ReportLost } from './pages/ReportLost';
import { ReportFound } from './pages/ReportFound';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { EditItem } from './pages/EditItem';
import { Profile } from './pages/Profile';
import { ContactRequests } from './pages/ContactRequests';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="items" element={<BrowseItems />} />
            <Route path="items/lost" element={<LostItems />} />
            <Route path="items/found" element={<FoundItems />} />
            <Route path="items/:id" element={<ItemDetails />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="report/lost"
              element={
                <ProtectedRoute>
                  <ReportLost />
                </ProtectedRoute>
              }
            />
            <Route
              path="report/found"
              element={
                <ProtectedRoute>
                  <ReportFound />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="items/:id/edit"
              element={
                <ProtectedRoute>
                  <EditItem />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="requests"
              element={
                <ProtectedRoute>
                  <ContactRequests />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
