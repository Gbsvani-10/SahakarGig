/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { DemoBanner } from './components/common/DemoBanner';
import { ToastContainer } from './components/common/ToastContainer';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { CustomerLayout } from './layouts/CustomerLayout';
import { WorkerLayout } from './layouts/WorkerLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { ServicesCatalogPage } from './pages/public/ServicesCatalogPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { ContactPage } from './pages/public/ContactPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Customer Portal Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { CustomerServices } from './pages/customer/CustomerServices';
import { CustomerWorkers } from './pages/customer/CustomerWorkers';
import { CustomerBookingFlow } from './pages/customer/CustomerBookingFlow';
import { CustomerBookings } from './pages/customer/CustomerBookings';
import { CustomerEmergency } from './pages/customer/CustomerEmergency';
import { CustomerPayments } from './pages/customer/CustomerPayments';
import { CustomerInvoices } from './pages/customer/CustomerInvoices';
import { CustomerRatings } from './pages/customer/CustomerRatings';
import { CustomerProfile } from './pages/customer/CustomerProfile';
import { CustomerSettings } from './pages/customer/CustomerSettings';

// Worker Portal Pages
import { WorkerDashboard } from './pages/worker/WorkerDashboard';
import { WorkerActiveJob } from './pages/worker/WorkerActiveJob';
import { WorkerJobs } from './pages/worker/WorkerJobs';
import { WorkerAvailability } from './pages/worker/WorkerAvailability';
import { WorkerSkills } from './pages/worker/WorkerSkills';
import { WorkerCertifications } from './pages/worker/WorkerCertifications';
import { WorkerEarnings } from './pages/worker/WorkerEarnings';
import { WorkerWelfare } from './pages/worker/WorkerWelfare';
import { WorkerRatings } from './pages/worker/WorkerRatings';
import { WorkerProfile } from './pages/worker/WorkerProfile';
import { WorkerNotifications } from './pages/worker/WorkerNotifications';
import { WorkerSettings } from './pages/worker/WorkerSettings';

// Admin Portal Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminCooperatives } from './pages/admin/AdminCooperatives';
import { AdminWorkers } from './pages/admin/AdminWorkers';
import { AdminBookings } from './pages/admin/AdminBookings';
import { AdminEmergency } from './pages/admin/AdminEmergency';
import { AdminWelfare } from './pages/admin/AdminWelfare';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminSettings } from './pages/admin/AdminSettings';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppProvider>
            <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">
              {/* Sticky Demo Quick Switcher Banner */}
              <DemoBanner />

              {/* Application Main Router */}
              <div className="flex-1 flex flex-col">
                <Routes>
                  {/* Public Pages */}
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/services" element={<ServicesCatalogPage />} />
                    <Route path="/how-it-works" element={<HowItWorksPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  </Route>

                  {/* Customer Portal */}
                  <Route path="/customer" element={<CustomerLayout />}>
                    <Route index element={<CustomerDashboard />} />
                    <Route path="dashboard" element={<CustomerDashboard />} />
                    <Route path="services" element={<CustomerServices />} />
                    <Route path="workers" element={<CustomerWorkers />} />
                    <Route path="book" element={<CustomerBookingFlow />} />
                    <Route path="bookings" element={<CustomerBookings />} />
                    <Route path="emergency" element={<CustomerEmergency />} />
                    <Route path="payments" element={<CustomerPayments />} />
                    <Route path="invoices" element={<CustomerInvoices />} />
                    <Route path="ratings" element={<CustomerRatings />} />
                    <Route path="profile" element={<CustomerProfile />} />
                    <Route path="settings" element={<CustomerSettings />} />
                  </Route>

                  {/* Worker Portal */}
                  <Route path="/worker" element={<WorkerLayout />}>
                    <Route index element={<WorkerDashboard />} />
                    <Route path="dashboard" element={<WorkerDashboard />} />
                    <Route path="active-job" element={<WorkerActiveJob />} />
                    <Route path="jobs" element={<WorkerJobs />} />
                    <Route path="availability" element={<WorkerAvailability />} />
                    <Route path="skills" element={<WorkerSkills />} />
                    <Route path="certifications" element={<WorkerCertifications />} />
                    <Route path="earnings" element={<WorkerEarnings />} />
                    <Route path="welfare" element={<WorkerWelfare />} />
                    <Route path="ratings" element={<WorkerRatings />} />
                    <Route path="profile" element={<WorkerProfile />} />
                    <Route path="notifications" element={<WorkerNotifications />} />
                    <Route path="settings" element={<WorkerSettings />} />
                  </Route>

                  {/* Admin Portal */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="cooperatives" element={<AdminCooperatives />} />
                    <Route path="workers" element={<AdminWorkers />} />
                    <Route path="bookings" element={<AdminBookings />} />
                    <Route path="emergency" element={<AdminEmergency />} />
                    <Route path="welfare" element={<AdminWelfare />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>

                  {/* Catch-all redirect to Landing */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>

              {/* Global Floating Toast Notifications */}
              <ToastContainer />
            </div>
          </AppProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

