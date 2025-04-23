import React, { useState } from 'react';
import Botones from './Botones';
import StudentTable from './StudentTable';

const Dashboard = () => {
  const [selectedView, setSelectedView] = useState('');

  const handleNavigation = (view) => {
    setSelectedView(view);
  };

  return (
    <div>
      <Botones onNavigate={handleNavigation} />

      {selectedView === 'editar' && <StudentTable />}
    </div>
  );
};

export default Dashboard;
