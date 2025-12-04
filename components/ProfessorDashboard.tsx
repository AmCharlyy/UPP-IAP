import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Calendar, CheckSquare, ClipboardList, FileText, Download, X, Printer, Save } from 'lucide-react';
import { User, Course, StudentRecord, ScheduleItem } from '../types';
import { PROFESSOR_SCHEDULE, PROFESSOR_NOTIFICATIONS, ALL_COURSES_MOCK, ALL_STUDENTS_MOCK, WEEKLY_SCHEDULE_MOCK } from '../constants';
import { StatCard, ScheduleListItem, NotificationListItem, SectionHeader } from './DashboardComponents';

interface Props {
  user: User;
  onLogout: () => void;
}

type ModalType = 'none' | 'schedule' | 'notifications' | 'attendance' | 'grades' | 'group_list';

// --- HELPER COMPONENTS ---

interface ProfessorDocumentWrapperProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    profName: string;
    course?: Course;
}

const ProfessorDocumentWrapper: React.FC<ProfessorDocumentWrapperProps> = ({ title, children, onClose, profName, course }) => {
    const handlePrint = () => {
      window.print();
    };

    return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center overflow-y-auto pt-10 pb-10 print:p-0 print:block print:relative print:bg-white print:inset-auto">
        {/* Removed max-h constraint to allow full document scrolling */}
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col relative mb-10 print:shadow-none print:w-full print:max-w-none print:mb-0">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl print:hidden sticky top-0 z-10 shadow-sm">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <Briefcase className="text-blue-600" size={20}/> {title}
                </h3>
                <div className="flex gap-2">
                    <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        <Printer size={16} /> Imprimir / PDF
                    </button>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>
            </div>
            
            <div className="p-8 bg-gray-200 flex justify-center print:p-0 print:bg-white">
                {/* A4 Paper Simulation - min-height ensures it looks like paper */}
                <div className="bg-white w-full max-w-[210mm] min-h-[297mm] p-[15mm] shadow-lg print:shadow-none print:w-full print:max-w-none print:p-0">
                    {/* Official Header */}
                    <div className="flex justify-between items-start border-b-2 border-indigo-600 pb-4 mb-6">
                        <div>
                             <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">Universidad Politécnica</h1>
                             <h2 className="text-lg font-semibold text-gray-600">de Pénjamo</h2>
                             <p className="text-sm text-gray-500 mt-1">Secretaría Académica</p>
                        </div>
                        <div className="text-right">
                             <div className="text-sm font-medium text-gray-800">Ciclo Escolar</div>
                             <div className="text-sm text-gray-600">Septiembre - Diciembre 2025</div>
                             <div className="text-xs text-gray-400 mt-2">Docente: {profName}</div>
                        </div>
                    </div>

                    {course && (
                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-6 flex justify-between items-center print:bg-white print:border-gray-300">
                            <div>
                                <span className="block text-indigo-400 text-xs uppercase font-bold print:text-gray-500">Materia</span>
                                <span className="font-bold text-gray-900 text-lg">{course.name}</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-indigo-400 text-xs uppercase font-bold print:text-gray-500">Grupo</span>
                                <span className="font-mono text-gray-900 text-lg">{course.term}º{course.group}</span>
                            </div>
                        </div>
                    )}

                    {children}

                    {/* Footer */}
                    <div className="mt-12 pt-8 border-t border-gray-300 flex justify-between items-end print:mt-auto">
                        <div className="text-center w-1/3">
                            <div className="border-t border-gray-400 w-full mb-2"></div>
                            <p className="text-xs text-gray-500">Firma del Docente</p>
                        </div>
                         <div className="text-right">
                            <p className="text-[10px] text-gray-400">Generado el {new Date().toLocaleDateString()} via Plataforma Integral UPP</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

const ProfessorScheduleGrid = () => {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const hours = ['07:00', '07:50', '08:40', '09:30', '10:20', '11:10', '12:00', '12:50', '12:50', '13:40', '14:30'];

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center uppercase border-b border-gray-200 pb-2">Horario Docente</h2>
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
                                                ${item.type === 'break' ? 'bg-amber-100 text-amber-800 print:bg-gray-100 print:text-black' : 'bg-indigo-50 text-indigo-900 font-medium print:bg-white print:border print:border-gray-400 print:text-black'}`}>
                                                <span>{item.subject}</span>
                                                {item.type !== 'break' && <span className="text-indigo-500 text-[9px] print:text-gray-600">{item.details}</span>}
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

const AttendanceSheet = ({ students }: { students: StudentRecord[] }) => (
    <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center uppercase border-b border-gray-200 pb-2">Lista de Asistencia</h2>
        <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-gray-100 border-b-2 border-gray-300 print:bg-gray-50">
                <tr>
                    <th className="py-2 px-2 w-10 text-center">#</th>
                    <th className="py-2 px-2">Matrícula</th>
                    <th className="py-2 px-2">Nombre del Alumno</th>
                    <th className="py-2 px-2 text-center w-12">L</th>
                    <th className="py-2 px-2 text-center w-12">M</th>
                    <th className="py-2 px-2 text-center w-12">M</th>
                    <th className="py-2 px-2 text-center w-12">J</th>
                    <th className="py-2 px-2 text-center w-12">V</th>
                    <th className="py-2 px-2 text-center">Observaciones</th>
                </tr>
            </thead>
            <tbody>
                {students.map((student, idx) => (
                    <tr key={student.id} className="border-b border-gray-200">
                        <td className="py-3 px-2 text-center text-gray-500">{idx + 1}</td>
                        <td className="py-3 px-2 font-mono text-gray-600">{student.enrollmentId}</td>
                        <td className="py-3 px-2 font-medium text-gray-900">{student.name}</td>
                        <td className="py-3 px-2 text-center"><div className="w-5 h-5 border border-gray-400 rounded-sm mx-auto"></div></td>
                        <td className="py-3 px-2 text-center"><div className="w-5 h-5 border border-gray-400 rounded-sm mx-auto"></div></td>
                        <td className="py-3 px-2 text-center"><div className="w-5 h-5 border border-gray-400 rounded-sm mx-auto"></div></td>
                        <td className="py-3 px-2 text-center"><div className="w-5 h-5 border border-gray-400 rounded-sm mx-auto"></div></td>
                        <td className="py-3 px-2 text-center"><div className="w-5 h-5 border border-gray-400 rounded-sm mx-auto"></div></td>
                        <td className="py-3 px-2 border-l border-dashed border-gray-300"></td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className="mt-4 text-xs text-gray-500">
            <p><strong>Nomenclatura:</strong> (/) Asistencia, (.) Retardo, (X) Falta, (J) Justificante.</p>
        </div>
    </div>
);

// --- INTERACTIVE GRADEBOOK ---
interface GradeEntry {
    saber: string;
    hacer: string;
    ser: string;
}

const Gradebook = ({ students, onClose }: { students: StudentRecord[], onClose: () => void }) => {
    const [grades, setGrades] = useState<Record<string, GradeEntry>>({});

    // Initialize grades state
    useEffect(() => {
        const initialGrades: Record<string, GradeEntry> = {};
        students.forEach(s => {
            // Generate some random initial data for demo purposes, or empty
            const hasData = Math.random() > 0.5;
            initialGrades[s.id] = {
                saber: hasData ? (Math.random() * 3 + 7).toFixed(1) : '',
                hacer: hasData ? (Math.random() * 3 + 7).toFixed(1) : '',
                ser: hasData ? (Math.random() * 3 + 7).toFixed(1) : ''
            };
        });
        setGrades(initialGrades);
    }, [students]);

    const handleChange = (id: string, field: keyof GradeEntry, value: string) => {
        // Only allow numbers and decimal point
        if (!/^\d*\.?\d*$/.test(value)) return;
        // Limit max value roughly (validation can be stricter)
        if (parseFloat(value) > 10) return;

        setGrades(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    const calculateFinal = (entry: GradeEntry) => {
        const s = parseFloat(entry?.saber || '0');
        const h = parseFloat(entry?.hacer || '0');
        const e = parseFloat(entry?.ser || '0');
        
        // Weights: Saber 30%, Hacer 60%, Ser 10%
        const final = (s * 0.3) + (h * 0.6) + (e * 0.1);
        return final > 0 ? final.toFixed(1) : '-';
    };

    const handleSave = () => {
        alert("Acta de calificaciones guardada correctamente en el sistema.");
        onClose();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
                <h2 className="text-xl font-bold text-gray-800 uppercase">Acta de Calificaciones Parcial 1</h2>
                <button 
                    onClick={handleSave} 
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-700 transition-colors print:hidden"
                >
                    <Save size={16} /> Guardar Acta
                </button>
            </div>
            
            <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-gray-100 border-b-2 border-gray-300 print:bg-gray-50">
                    <tr>
                        <th className="py-2 px-2 w-8 text-center">#</th>
                        <th className="py-2 px-2">Matrícula</th>
                        <th className="py-2 px-2 w-1/3">Nombre del Alumno</th>
                        <th className="py-2 px-2 text-center w-20 bg-blue-50 text-blue-900 border-l border-blue-100">Saber (30%)</th>
                        <th className="py-2 px-2 text-center w-20 bg-indigo-50 text-indigo-900 border-l border-indigo-100">Hacer (60%)</th>
                        <th className="py-2 px-2 text-center w-20 bg-purple-50 text-purple-900 border-l border-purple-100">Ser (10%)</th>
                        <th className="py-2 px-2 text-center w-24 font-bold bg-gray-200 border-l border-gray-300">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, idx) => {
                        const entry = grades[student.id] || { saber: '', hacer: '', ser: '' };
                        const final = calculateFinal(entry);
                        const isPassing = final !== '-' && parseFloat(final) >= 7.0;

                        return (
                            <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-2 px-2 text-center text-gray-500">{idx + 1}</td>
                                <td className="py-2 px-2 font-mono text-gray-600 text-xs">{student.enrollmentId}</td>
                                <td className="py-2 px-2 font-medium text-gray-900">{student.name}</td>
                                <td className="py-2 px-2 text-center border-l border-gray-200 bg-blue-50/30">
                                    <input 
                                        type="text" 
                                        value={entry.saber} 
                                        onChange={(e) => handleChange(student.id, 'saber', e.target.value)}
                                        className="w-full text-center bg-transparent border-b border-blue-200 focus:border-blue-500 outline-none p-1 font-mono text-gray-700"
                                        placeholder="0"
                                    />
                                </td>
                                <td className="py-2 px-2 text-center border-l border-gray-200 bg-indigo-50/30">
                                    <input 
                                        type="text" 
                                        value={entry.hacer} 
                                        onChange={(e) => handleChange(student.id, 'hacer', e.target.value)}
                                        className="w-full text-center bg-transparent border-b border-indigo-200 focus:border-indigo-500 outline-none p-1 font-mono text-gray-700"
                                        placeholder="0"
                                    />
                                </td>
                                <td className="py-2 px-2 text-center border-l border-gray-200 bg-purple-50/30">
                                    <input 
                                        type="text" 
                                        value={entry.ser} 
                                        onChange={(e) => handleChange(student.id, 'ser', e.target.value)}
                                        className="w-full text-center bg-transparent border-b border-purple-200 focus:border-purple-500 outline-none p-1 font-mono text-gray-700"
                                        placeholder="0"
                                    />
                                </td>
                                <td className={`py-2 px-2 text-center font-bold border-l border-gray-300 bg-gray-100 ${isPassing ? 'text-gray-900' : final !== '-' ? 'text-red-600' : 'text-gray-400'}`}>
                                    {final}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded text-amber-800 text-xs flex items-start gap-2 print:hidden">
                <div className="font-bold mt-0.5">NOTA:</div>
                <p>Asegúrese de guardar los cambios antes de salir. Las calificaciones reprobatorias (menores a 7.0) se resaltarán en rojo automáticamente.</p>
            </div>
        </div>
    );
};

const StudentRoster = ({ students }: { students: StudentRecord[] }) => (
    <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center uppercase border-b border-gray-200 pb-2">Lista General de Grupo</h2>
        <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-gray-100 border-b-2 border-gray-300 print:bg-gray-50">
                <tr>
                    <th className="py-2 px-2 w-10 text-center">#</th>
                    <th className="py-2 px-2">Matrícula</th>
                    <th className="py-2 px-2">Nombre del Alumno</th>
                    <th className="py-2 px-2">Correo Institucional</th>
                    <th className="py-2 px-2 text-center">Estatus</th>
                </tr>
            </thead>
            <tbody>
                {students.map((student, idx) => (
                    <tr key={student.id} className="border-b border-gray-200">
                        <td className="py-3 px-2 text-center text-gray-500">{idx + 1}</td>
                        <td className="py-3 px-2 font-mono text-gray-600">{student.enrollmentId}</td>
                        <td className="py-3 px-2 font-medium text-gray-900">{student.name}</td>
                        <td className="py-3 px-2 text-blue-600 underline print:no-underline print:text-gray-600">{student.email}</td>
                        <td className="py-3 px-2 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${student.status === 'regular' ? 'bg-green-100 text-green-700 print:bg-transparent print:text-black print:border print:border-black' : 'bg-red-100 text-red-700 print:bg-transparent print:text-black print:border print:border-black'}`}>
                                {student.status.toUpperCase()}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// --- MAIN COMPONENT ---

const ProfessorDashboard: React.FC<Props> = ({ user, onLogout }) => {
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Filter courses for this professor
  const myCourses = ALL_COURSES_MOCK.filter(c => c.professorId === user.id);
  
  // Calculate stats
  const totalStudents = myCourses.reduce((acc, curr) => acc + (curr.studentsCount || 0), 0);
  const totalGroups = new Set(myCourses.map(c => `${c.term}-${c.group}`)).size;

  const handleOpenCourseAction = (course: Course, type: ModalType) => {
      setSelectedCourse(course);
      setActiveModal(type);
  };

  const getStudentsForSelectedCourse = () => {
      if (!selectedCourse) return [];
      // Filter students that match career, term, and group of the selected course
      return ALL_STUDENTS_MOCK.filter(s => 
          s.careerId === selectedCourse.careerId && 
          s.term === selectedCourse.term && 
          s.group === selectedCourse.group
      ).sort((a,b) => a.name.localeCompare(b.name));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <header className="bg-white rounded-2xl shadow-sm p-6 mb-6 flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Plataforma Académica Integral <span className="text-blue-600">(IAP)</span></h1>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <span className="text-gray-500 font-medium">Panel Docente</span>
          <button onClick={onLogout} className="text-sm text-red-500 hover:underline">Salir</button>
        </div>
      </header>

      {/* Welcome */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Bienvenido, {user.name}</h2>
        <p className="text-gray-500">Gestión académica y control de grupos.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-2xl">
          <StatCard
            icon={Briefcase}
            title="Grupos Asignados"
            value={totalGroups}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            icon={Users}
            title="Total Estudiantes Atendidos"
            value={totalStudents}
            iconBgColor="bg-indigo-100"
            iconColor="text-indigo-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Schedule */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <SectionHeader 
            title="Tu Horario de Hoy" 
            actionText="Ver completo / Descargar" 
            onAction={() => setActiveModal('schedule')}
          />
          <div className="space-y-4">
            {PROFESSOR_SCHEDULE.map((item) => (
              <ScheduleListItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <SectionHeader 
            title="Avisos Institucionales" 
            actionText="Ver todas" 
            onAction={() => setActiveModal('notifications')}
          />
          <div className="space-y-2">
            {PROFESSOR_NOTIFICATIONS.map((item) => (
              <NotificationListItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Teaching Load Cards */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Users size={24} className="text-blue-600" /> Mi Carga Docente
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCourses.map((course) => (
            <div key={course.id} className="border border-gray-200 rounded-2xl p-6 flex flex-col hover:shadow-md transition-shadow bg-white">
              <div className="flex justify-between items-start mb-2">
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase">{course.careerId}</span>
                  <span className="text-xs text-gray-400 font-mono">ID: {course.id.split('-').pop()}</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{course.name}</h4>
              <p className="text-sm text-gray-500 mb-4 border-b border-gray-100 pb-4">
                {course.term}º{course.group} | {course.studentsCount} Alumnos | {course.classroom}
              </p>
              
              <div className="space-y-2 mt-auto">
                <button 
                    onClick={() => handleOpenCourseAction(course, 'attendance')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <CheckSquare size={16} /> Pasar Lista
                </button>
                <div className="flex gap-2">
                    <button 
                        onClick={() => handleOpenCourseAction(course, 'grades')}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <FileText size={14} /> Subir Calif.
                    </button>
                    <button 
                        onClick={() => handleOpenCourseAction(course, 'group_list')}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <ClipboardList size={14} /> Lista
                    </button>
                </div>
              </div>
            </div>
          ))}
          {myCourses.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400">
                  No hay cursos asignados actualmente.
              </div>
          )}
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Schedule Modal */}
      {activeModal === 'schedule' && (
          <ProfessorDocumentWrapper title="Horario de Clases" onClose={() => setActiveModal('none')} profName={user.name}>
              <ProfessorScheduleGrid />
          </ProfessorDocumentWrapper>
      )}

      {/* Attendance Modal */}
      {activeModal === 'attendance' && selectedCourse && (
          <ProfessorDocumentWrapper title="Toma de Asistencia" onClose={() => setActiveModal('none')} profName={user.name} course={selectedCourse}>
              <AttendanceSheet students={getStudentsForSelectedCourse()} />
          </ProfessorDocumentWrapper>
      )}

      {/* Grades Modal */}
      {activeModal === 'grades' && selectedCourse && (
          <ProfessorDocumentWrapper title="Captura de Calificaciones" onClose={() => setActiveModal('none')} profName={user.name} course={selectedCourse}>
              <Gradebook students={getStudentsForSelectedCourse()} onClose={() => setActiveModal('none')} />
          </ProfessorDocumentWrapper>
      )}

      {/* Group List Modal */}
      {activeModal === 'group_list' && selectedCourse && (
          <ProfessorDocumentWrapper title="Lista de Grupo" onClose={() => setActiveModal('none')} profName={user.name} course={selectedCourse}>
              <StudentRoster students={getStudentsForSelectedCourse()} />
          </ProfessorDocumentWrapper>
      )}

      {/* Notifications Modal */}
      {activeModal === 'notifications' && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
             <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-800">Avisos Administrativos</h3>
                    <button onClick={() => setActiveModal('none')} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
                <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
                    {PROFESSOR_NOTIFICATIONS.map(n => (
                        <div key={n.id} className="border-b border-gray-100 last:border-0 pb-2">
                            <NotificationListItem item={n} />
                        </div>
                    ))}
                </div>
             </div>
          </div>
      )}

    </div>
  );
};

export default ProfessorDashboard;