import React, { useState } from 'react';
import { FieldAgentHome } from './FieldAgentHome';
import { FieldAgentCaseDetail } from './FieldAgentCaseDetail';
import { NewCustomerFlow } from './NewCustomerFlow';
import { RegistrationApplication } from '../../types';

export const FieldAgentView: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'HOME' | 'NEW_CUSTOMER' | 'DETAIL'>('HOME');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  return (
    <div className="bg-slate-200/60 min-h-screen">
      {currentScreen === 'HOME' && (
        <FieldAgentHome
          onNewCustomer={() => setCurrentScreen('NEW_CUSTOMER')}
          onSelectApplication={(id) => {
            setSelectedCaseId(id);
            setCurrentScreen('DETAIL');
          }}
        />
      )}

      {currentScreen === 'NEW_CUSTOMER' && (
        <NewCustomerFlow
          onCancel={() => setCurrentScreen('HOME')}
          onComplete={(app: RegistrationApplication) => {
            setSelectedCaseId(app.id);
            setCurrentScreen('DETAIL');
          }}
        />
      )}

      {currentScreen === 'DETAIL' && selectedCaseId && (
        <FieldAgentCaseDetail
          applicationId={selectedCaseId}
          onBack={() => {
            setSelectedCaseId(null);
            setCurrentScreen('HOME');
          }}
        />
      )}
    </div>
  );
};
