import React, { useState } from 'react';
import { BookOpen, TrendingUp, AlertTriangle, Printer, Download, X, FileText, Calendar } from 'lucide-react';
import { User, StudentRecord } from '../types';
import { STUDENT_SCHEDULE, STUDENT_NOTIFICATIONS, STUDENT_COURSES, WEEKLY_SCHEDULE_MOCK, MOCK_KARDEX, ALL_STUDENTS_MOCK } from '../constants';
import { StatCard, ScheduleListItem, NotificationListItem, SectionHeader } from './DashboardComponents';

interface Props {
  user: User;
  onLogout: () => void;
}

type ModalType = 'none' | 'schedule' | 'notifications' | 'kardex' | 'enrollment' | 'load_report';

// --- EXTRACTED HELPER COMPONENTS ---

interface DocumentModalWrapperProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    student: StudentRecord;
}

const DocumentModalWrapper: React.FC<DocumentModalWrapperProps> = ({ title, children, onClose, student }) => {
    const handlePrint = () => {
      window.print();
    };

    return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center overflow-y-auto pt-10 pb-10 print:p-0 print:block print:relative print:bg-white print:inset-auto">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col relative mb-10 print:shadow-none print:w-full print:max-w-none print:mb-0">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl print:hidden sticky top-0 z-10 shadow-sm">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <FileText className="text-blue-600" size={20}/> {title}
                </h3>
                <div className="flex gap-2">
                    <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        <Download size={16} /> Descargar PDF
                    </button>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>
            </div>
            
            <div className="p-8 bg-gray-200 flex justify-center print:p-0 print:bg-white">
                {/* A4 Paper Simulation */}
                <div className="bg-white w-full max-w-[210mm] min-h-[297mm] p-[15mm] shadow-lg print:shadow-none print:w-full print:max-w-none print:p-0">
                    {/* Official Header */}
                    <div className="flex justify-between items-start border-b-2 border-emerald-600 pb-4 mb-8">
                        <div>
                             <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">Universidad Politécnica</h1>
                             <h2 className="text-lg font-semibold text-gray-600">de Pénjamo</h2>
                             <p className="text-sm text-gray-500 mt-1">Organismo Público Descentralizado</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-400 font-mono mb-1">FOLIO: {Math.floor(Math.random() * 1000000)}</div>
                            <div className="text-sm font-medium text-gray-800">Fecha de Emisión</div>
                            <div className="text-sm text-gray-600">{new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        </div>
                    </div>

                    {/* Student Info Header */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8 grid grid-cols-2 gap-4 text-sm print:bg-white print:border-gray-300">
                        <div>
                            <span className="block text-gray-500 text-xs uppercase font-bold print:text-gray-500">Alumno</span>
                            <span className="font-bold text-gray-900 text-base">{student.name}</span>
                        </div>
                         <div>
                            <span className="block text-gray-500 text-xs uppercase font-bold print:text-gray-500">Matrícula</span>
                            <span className="font-mono text-gray-900 text-base">{student.enrollmentId}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500 text-xs uppercase font-bold print:text-gray-500">Programa Educativo</span>
                            <span className="text-gray-900">{student.programName}</span>
                        </div>
                        <div>
                             <span className="block text-gray-500 text-xs uppercase font-bold print:text-gray-500">Periodo</span>
                             <span className="text-gray-900">Septiembre - Diciembre 2025</span>
                        </div>
                    </div>

                    {children}

                    {/* Footer */}
                    <div className="mt-16 pt-8 border-t border-gray-300 text-center print:mt-auto">
                        <p className="text-xs text-gray-500 mb-2">Este documento es de carácter informativo y no tiene validez oficial sin sello y firma de Control Escolar.</p>
                        <p className="text-[10px] text-gray-400">Generado digitalmente por la Plataforma Integral de Gestión (SIGU) - UPP</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

const WeeklyScheduleGrid = () => {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const hours = ['07:00', '07:50', '08:40', '09:30', '10:20', '11:10', '12:00', '12:50'];

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center uppercase border-b border-gray-200 pb-2">Horario de Clases</h2>
            <div className="border border-gray-300">
                <div className="grid grid-cols-6 bg-gray-100 border-b border-gray-300 print:bg-gray-50">
                    <div className="p-2 text-center text-xs font-bold text-gray-600 border-r border-gray-300">Hora</div>
                    {days.map(d => <div key={d} className="p-2 text-center text-xs font-bold text-gray-600 border-r border-gray-300 last:border-0">{d}</div>)}
                </div>
                {hours.map((time, i) => {
                    if (i === hours.length - 1) return null; // Don't render last row start
                    const endTime = hours[i+1];
                    const label = `${time} - ${endTime}`;
                    
                    return (
                        <div key={time} className="grid grid-cols-6 border-b border-gray-200 last:border-0">
                            <div className="p-2 text-center text-xs font-bold text-gray-500 border-r border-gray-200 flex items-center justify-center bg-gray-50">
                                {label}
                            </div>
                            {days.map((_, dayIdx) => {
                                const dayNum = dayIdx + 1;
                                const item = WEEKLY_SCHEDULE_MOCK.find(s => s.day === dayNum && s.startTime === time);
                                return (
                                    <div key={dayIdx} className="p-1 border-r border-gray-200 last:border-0 min-h-[50px] relative">
                                        {item && (
                                            <div className={`w-full h-full p-1 rounded text-[10px] flex flex-col justify-center items-center text-center
                                                ${item.type === 'break' ? 'bg-amber-100 text-amber-800 print:bg-gray-100 print:text-black' : 'bg-blue-50 text-blue-900 font-medium print:bg-white print:border print:border-gray-400 print:text-black'}`}>
                                                <span>{item.subject}</span>
                                                {item.type !== 'break' && <span className="text-blue-500 text-[9px] print:text-gray-600">{item.details}</span>}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

const KardexTable = ({ average }: { average: number }) => (
    <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center uppercase border-b border-gray-200 pb-2">Historial Académico (Kardex)</h2>
        <table className="w-full text-left border-collapse text-sm">
            <thead>
                <tr className="border-b-2 border-gray-800">
                    <th className="py-2 px-2">Clave</th>
                    <th className="py-2 px-2">Materia</th>
                    <th className="py-2 px-2 text-center">Cuatrimestre</th>
                    <th className="py-2 px-2 text-center">Tipo</th>
                    <th className="py-2 px-2 text-center">Calificación</th>
                    <th className="py-2 px-2 text-center">Créditos</th>
                </tr>
            </thead>
            <tbody>
                {MOCK_KARDEX.map((grade) => (
                    <tr key={grade.id} className="border-b border-gray-200">
                        <td className="py-2 px-2 font-mono text-gray-500">SUB-{grade.id}</td>
                        <td className="py-2 px-2 font-medium">{grade.subjectName}</td>
                        <td className="py-2 px-2 text-center">{grade.term}</td>
                        <td className="py-2 px-2 text-center text-xs">{grade.type}</td>
                        <td className="py-2 px-2 text-center font-bold">{grade.score}</td>
                        <td className="py-2 px-2 text-center">{grade.credits}</td>
                    </tr>
                ))}
                <tr className="bg-gray-50 font-bold border-t-2 border-gray-400 print:bg-white">
                    <td colSpan={4} className="py-2 px-2 text-right">Promedio General:</td>
                    <td className="py-2 px-2 text-center text-emerald-600 print:text-black">{average}</td>
                    <td className="py-2 px-2 text-center">{MOCK_KARDEX.reduce((acc, curr) => acc + curr.credits, 0)}</td>
                </tr>
            </tbody>
        </table>
    </div>
);

const EnrollmentReport = () => (
    <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center uppercase border-b border-gray-200 pb-2">Carga Académica Inscrita</h2>
            <table className="w-full text-left border-collapse text-sm">
            <thead>
                <tr className="border-b-2 border-gray-800">
                    <th className="py-2 px-2">Materia</th>
                    <th className="py-2 px-2">Docente</th>
                    <th className="py-2 px-2 text-center">Grupo</th>
                    <th className="py-2 px-2 text-center">Aula</th>
                    <th className="py-2 px-2 text-center">Créditos</th>
                </tr>
            </thead>
            <tbody>
                {STUDENT_COURSES.map((course) => (
                    <tr key={course.id} className="border-b border-gray-200">
                        <td className="py-3 px-2 font-medium">{course.name}</td>
                        <td className="py-3 px-2 text-gray-600 italic">{course.professorName}</td>
                        <td className="py-3 px-2 text-center">{course.group}</td>
                        <td className="py-3 px-2 text-center">{course.classroom}</td>
                        <td className="py-3 px-2 text-center">{course.credits}</td>
                    </tr>
                ))}
                <tr className="bg-gray-50 font-bold border-t-2 border-gray-400 print:bg-white">
                    <td colSpan={4} className="py-2 px-2 text-right">Total de Créditos del Periodo:</td>
                    <td className="py-2 px-2 text-center">{STUDENT_COURSES.reduce((acc, c) => acc + c.credits, 0)}</td>
                </tr>
            </tbody>
        </table>
    </div>
);

// --- MAIN COMPONENT ---

const StudentDashboard: React.FC<Props> = ({ user, onLogout }) => {
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  
  // Hydrate full student data
  const fullStudentData = ALL_STUDENTS_MOCK.find(s => s.id === user.id) || ALL_STUDENTS_MOCK[0];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <header className="bg-white rounded-2xl shadow-sm p-6 mb-6 flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Plataforma Académica Integral <span className="text-blue-600">(IAP)</span></h1>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <span className="text-gray-500 font-medium">Estudiante</span>
          <button onClick={onLogout} className="text-sm text-red-500 hover:underline">Salir</button>
        </div>
      </header>

      {/* Welcome */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Hola de nuevo, {user.name}</h2>
        <p className="text-gray-500">Bienvenida a tu panel de control académico.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <StatCard
            icon={BookOpen}
            title="Créditos Cursados"
            value={`${MOCK_KARDEX.reduce((acc, curr) => acc + curr.credits, 0)} / 180`}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            icon={TrendingUp}
            title="Promedio General"
            value={fullStudentData.average}
            iconBgColor="bg-indigo-100"
            iconColor="text-indigo-600"
          />
          <StatCard
            icon={AlertTriangle}
            title="Estatus"
            value={fullStudentData.status === 'regular' ? 'Regular' : 'Irregular'}
            iconBgColor={fullStudentData.status === 'regular' ? 'bg-green-100' : 'bg-amber-100'}
            iconColor={fullStudentData.status === 'regular' ? 'text-green-600' : 'text-amber-600'}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Schedule */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <SectionHeader 
            title="Tu Horario de Hoy" 
            actionText="Ver completo" 
            onAction={() => setActiveModal('schedule')}
          />
          <div className="space-y-4">
            {STUDENT_SCHEDULE.map((item) => (
              <ScheduleListItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <SectionHeader 
            title="Notificaciones Importantes" 
            actionText="Ver completo" 
            onAction={() => setActiveModal('notifications')}
          />
          <div className="space-y-2">
            {STUDENT_NOTIFICATIONS.slice(0, 3).map((item) => (
              <NotificationListItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Academic Load Table */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Mi Carga Académica (Semestre 2025-2)</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-2 font-medium text-gray-500">Materia</th>
                <th className="py-3 px-2 font-medium text-gray-500">Profesor</th>
                <th className="py-3 px-2 font-medium text-gray-500 text-center">Grupo</th>
                <th className="py-3 px-2 font-medium text-gray-500 text-center">Creditos</th>
                <th className="py-3 px-2 font-medium text-gray-500 text-center">Aula</th>
              </tr>
            </thead>
            <tbody>
              {STUDENT_COURSES.map((course) => (
                <tr key={course.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="py-4 px-2 font-medium text-gray-900">{course.name}</td>
                  <td className="py-4 px-2 text-gray-600">{course.professorName}</td>
                  <td className="py-4 px-2 text-gray-600 text-center">{course.group}</td>
                  <td className="py-4 px-2 text-gray-600 text-center">{course.credits}</td>
                  <td className="py-4 px-2 text-gray-600 text-center">{course.classroom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button 
            onClick={() => setActiveModal('enrollment')}
            className="px-8 py-2.5 bg-blue-600 text-white font-medium rounded-full shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Printer size={16} /> Reporte de Carga
          </button>
          <button 
            onClick={() => setActiveModal('kardex')}
            className="px-8 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen size={16} /> Ver Kardex
          </button>
          <button 
            onClick={() => setActiveModal('schedule')}
            className="px-8 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <Calendar size={16} /> Descargar Horario
          </button>
        </div>
      </div>

      {/* --- MODALS RENDER --- */}
      
      {/* Schedule Modal */}
      {activeModal === 'schedule' && (
          <DocumentModalWrapper title="Horario de Clases" onClose={() => setActiveModal('none')} student={fullStudentData}>
              <WeeklyScheduleGrid />
          </DocumentModalWrapper>
      )}

      {/* Kardex Modal */}
      {activeModal === 'kardex' && (
          <DocumentModalWrapper title="Kardex Oficial" onClose={() => setActiveModal('none')} student={fullStudentData}>
              <KardexTable average={fullStudentData.average} />
          </DocumentModalWrapper>
      )}

      {/* Enrollment/Load Report Modal */}
      {(activeModal === 'enrollment' || activeModal === 'load_report') && (
          <DocumentModalWrapper title="Reporte de Carga Académica" onClose={() => setActiveModal('none')} student={fullStudentData}>
              <EnrollmentReport />
          </DocumentModalWrapper>
      )}

      {/* Notifications Modal (Simpler, not Document Style) */}
      {activeModal === 'notifications' && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
             <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-800">Centro de Notificaciones</h3>
                    <button onClick={() => setActiveModal('none')} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
                <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
                    {STUDENT_NOTIFICATIONS.map(n => (
                        <div key={n.id} className="border-b border-gray-100 last:border-0 pb-2">
                            <NotificationListItem item={n} />
                            <p className="text-[10px] text-gray-400 text-right mt-1 px-2">{n.date}</p>
                        </div>
                    ))}
                </div>
             </div>
          </div>
      )}

    </div>
  );
};

export default StudentDashboard;