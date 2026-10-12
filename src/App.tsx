/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { HeaderSwitcher } from './components/common/HeaderSwitcher';
import { FieldAgentView } from './components/field/FieldAgentView';
import { ExecutiveDashboard } from './components/executive/ExecutiveDashboard';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans antialiased selection:bg-amber-400 selection:text-slate-950">
          {/* Universal Header Switcher */}
          <HeaderSwitcher />

          {/* Route Content */}
          <div className="flex-1">
            <Routes>
              <Route path="/field-agent-view" element={<FieldAgentView />} />
              <Route path="/executive-agent-view" element={<ExecutiveDashboard />} />
              <Route path="/" element={<Navigate to="/field-agent-view" replace />} />
              <Route path="*" element={<Navigate to="/field-agent-view" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
