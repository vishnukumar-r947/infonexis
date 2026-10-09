import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import I18nProvider from "./i18n/index";

import SplashScreen from "./pages/SplashScreen";
import LoginPage from "./pages/LoginPage";
import OTPPage from "./pages/OTPPage";
import IntroPage from "./pages/IntroPage";

import MainLayout from "./layouts/MainLayout";
import OverviewPage from "./pages/OverviewPage";
import InformationPage from "./pages/InformationPage";
import IntelligencePage from "./pages/IntelligencePage";
import ActionsPage from "./pages/ActionsPage";
import SourcesPage from "./pages/SourcesPage";
import SettingsPage from "./pages/SettingsPage";
import AIAssistantPage from "./pages/AIAssistantPage";

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Flow */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/otp" element={<OTPPage />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/welcome" element={<IntroPage />} />

          {/* Authenticated Application with Primary Navigation Layout */}
          <Route path="/app" element={<MainLayout />}>
            <Route index element={<Navigate to="/app/overview" replace />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="information" element={<InformationPage />} />
            <Route path="intelligence" element={<IntelligencePage />} />
            <Route path="actions" element={<ActionsPage />} />
            <Route path="sources" element={<SourcesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="assistant" element={<AIAssistantPage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  );
}
