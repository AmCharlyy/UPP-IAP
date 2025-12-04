import React, { useState } from 'react';
import { User, UserRole } from './types';
import LoginPage from './components/LoginPage';
import StudentDashboard from './components/StudentDashboard';
import ProfessorDashboard from './components/ProfessorDashboard';
import AdminDashboard from './components/AdminDashboard';
import { ALL_STUDENTS_MOCK, PROFESSORS_MOCK } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (role: UserRole, email: string) => {
    // Find the actual user from our generated data
    if (role === UserRole.STUDENT) {
      const student = ALL_STUDENTS_MOCK.find(s => s.email === email) || ALL_STUDENTS_MOCK[0];
      setUser({
        id: student.id,
        name: student.name,
        email: student.email,
        role: UserRole.STUDENT
      });
    } else if (role === UserRole.PROFESSOR) {
      const professor = PROFESSORS_MOCK.find(p => p.email === email) || PROFESSORS_MOCK[0];
      setUser({
        id: professor.id,
        name: professor.name,
        email: professor.email,
        role: UserRole.PROFESSOR
      });
    } else {
        setUser({
            id: 'admin1',
            name: 'Administrador Principal',
            email: 'admin@upp.edu.mx',
            role: UserRole.ADMIN
        });
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      {user.role === UserRole.STUDENT ? (
        <StudentDashboard user={user} onLogout={handleLogout} />
      ) : user.role === UserRole.PROFESSOR ? (
        <ProfessorDashboard user={user} onLogout={handleLogout} />
      ) : (
        <AdminDashboard user={user} onLogout={handleLogout} />
      )}
    </>
  );
};

export default App;