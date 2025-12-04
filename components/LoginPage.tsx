import React, { useState } from 'react';
import { UserRole } from '../types';
import { Bird, ShieldCheck } from 'lucide-react';
import { DEMO_CREDENTIALS } from '../constants';

interface Props {
  onLogin: (role: UserRole, email: string) => void;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Initialize with student credentials
  React.useEffect(() => {
    handleRoleChange(UserRole.STUDENT);
  }, []);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === UserRole.STUDENT) {
      setEmail(DEMO_CREDENTIALS.student.email);
      setPassword('student123');
    } else if (newRole === UserRole.PROFESSOR) {
      setEmail(DEMO_CREDENTIALS.professor.email);
      setPassword('prof123');
    } else {
      // Default Admin Credentials
      setEmail('admin@uppenjamo.edu.mx');
      setPassword('admin123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(role, email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white border-[16px] border-black box-border p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        
        {/* Logo Section */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-50 rounded-lg flex flex-col items-center justify-center mb-2 shadow-sm relative group">
             {role === UserRole.ADMIN ? (
                 <ShieldCheck className="w-12 h-12 text-emerald-600 mb-1 animate-pulse" />
             ) : (
                 <Bird className="w-12 h-12 text-indigo-600 mb-1" />
             )}
             <span className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 tracking-widest">UPP</span>
             <span className="text-[10px] text-gray-400 font-semibold tracking-wider">
                 {role === UserRole.ADMIN ? 'ADMIN SYSTEM' : 'PÉNJAMO'}
             </span>
          </div>
        </div>

        {/* 3-Way Toggle Switch */}
        <div className="bg-gray-100 p-1 rounded-xl flex w-full mb-8 shadow-inner relative">
          <button
            onClick={() => handleRoleChange(UserRole.STUDENT)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-300 z-10 ${
              role === UserRole.STUDENT ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Estudiante
          </button>
          <button
            onClick={() => handleRoleChange(UserRole.PROFESSOR)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-300 z-10 ${
              role === UserRole.PROFESSOR ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Profesor
          </button>
          <button
            onClick={() => handleRoleChange(UserRole.ADMIN)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-300 z-10 ${
              role === UserRole.ADMIN ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-gray-500 text-sm block font-medium">
              {role === UserRole.ADMIN ? 'Cuenta Administrativa' : 'Correo Institucional'}
            </label>
            <input
              type={role === UserRole.STUDENT || role === UserRole.ADMIN ? "email" : "text"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@uppenjamo.edu.mx"
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                  role === UserRole.ADMIN 
                  ? 'border-emerald-200 focus:ring-emerald-500 focus:border-transparent bg-emerald-50/30' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
              }`}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-500 text-sm block font-medium">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                  role === UserRole.ADMIN 
                  ? 'border-emerald-200 focus:ring-emerald-500 focus:border-transparent bg-emerald-50/30' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
              }`}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full font-semibold py-3.5 rounded-xl shadow-lg active:scale-95 transition-all mt-4 ${
                role === UserRole.ADMIN 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
            }`}
          >
            {role === UserRole.ADMIN ? 'Entrar al Sistema' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-12 text-xs text-gray-400 text-center">
          © 2024 Universidad Politécnica de Pénjamo<br/>Plataforma Integral de Gestión v2.0
        </div>
      </div>
    </div>
  );
};

export default LoginPage;