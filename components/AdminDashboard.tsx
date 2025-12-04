import React, { useState, useMemo } from 'react';
import { User, Course, StudentRecord, Professor, Career, CurriculumSubject } from '../types';
import { ALL_COURSES_MOCK, ALL_STUDENTS_MOCK, CAREERS_MOCK, PROFESSORS_MOCK, CURRICULUM_MOCK } from '../constants';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  GraduationCap, 
  LogOut, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  MoreHorizontal,
  Save,
  X,
  Briefcase,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronRight,
  ArrowLeft,
  Calendar,
  FileText,
  Printer,
  Download
} from 'lucide-react';

interface Props {
  user: User;
  onLogout: () => void;
}

type Tab = 'overview' | 'careers' | 'courses' | 'students' | 'professors';
type CareerSubView = 'list' | 'groups' | 'group_detail' | 'study_plan';
type DocumentType = 'none' | 'study_plan' | 'student_list' | 'professor_list' | 'course_list';

interface StudyPlanCardProps {
    subject: CurriculumSubject;
    onEdit: () => void;
    onDelete: () => void;
}

// --- HELPER COMPONENTS ---

interface AdminDocumentWrapperProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}

const AdminDocumentWrapper: React.FC<AdminDocumentWrapperProps> = ({ title, children, onClose }) => {
    const handlePrint = () => {
      window.print();
    };

    return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center overflow-y-auto pt-10 pb-10 print:p-0 print:block print:relative print:bg-white print:inset-auto">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl flex flex-col relative mb-10 print:shadow-none print:w-full print:max-w-none print:mb-0">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl print:hidden sticky top-0 z-10 shadow-sm">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <FileText className="text-emerald-600" size={20}/> {title}
                </h3>
                <div className="flex gap-2">
                    <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                        <Printer size={16} /> Imprimir / PDF
                    </button>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>
            </div>
            
            <div className="p-8 bg-gray-200 flex justify-center print:p-0 print:bg-white">
                {/* A4 Landscape Paper Simulation */}
                <div className="bg-white w-full max-w-[297mm] min-h-[210mm] p-[15mm] shadow-lg print:shadow-none print:w-full print:max-w-none print:p-0">
                    {/* Official Header */}
                    <div className="flex justify-between items-start border-b-2 border-emerald-600 pb-4 mb-6">
                        <div className="flex items-center gap-4">
                             {/* Optional Logo Placeholder */}
                             <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-gray-300">
                                 <span className="font-bold text-xs">UPP</span>
                             </div>
                             <div>
                                 <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">Universidad Politécnica</h1>
                                 <h2 className="text-lg font-semibold text-gray-600">de Pénjamo</h2>
                             </div>
                        </div>
                        <div className="text-right">
                             <div className="text-sm font-medium text-gray-800">Dirección de Administración Escolar</div>
                             <div className="text-sm text-gray-600">{new Date().toLocaleDateString('es-MX', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</div>
                        </div>
                    </div>

                    <div className="mb-6">
                         <h3 className="text-center text-xl font-bold text-gray-800 uppercase underline decoration-emerald-500 decoration-2 underline-offset-4">{title}</h3>
                    </div>

                    {children}

                    {/* Footer */}
                    <div className="mt-12 pt-8 border-t border-gray-300 flex justify-between items-end print:mt-auto">
                        <div className="text-center w-1/3">
                            <div className="border-t border-gray-400 w-full mb-2"></div>
                            <p className="text-xs text-gray-500">Sello de Control Escolar</p>
                        </div>
                         <div className="text-right">
                            <p className="text-[10px] text-gray-400">Documento generado por SIGU v2.0</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

const StudyPlanCard: React.FC<StudyPlanCardProps> = ({subject, onEdit, onDelete}) => (
  <div 
      onClick={onEdit}
      className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-emerald-300 transition-all group relative"
  >
      <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] font-bold text-gray-400">{subject.code}</span>
          <button 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
          >
              <X size={14} />
          </button>
      </div>
      <p className="text-sm font-semibold text-gray-800 leading-tight mb-2">{subject.name}</p>
      <div className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded w-fit">
          <span>{subject.credits} Créditos</span>
      </div>
  </div>
);

// --- PRINTABLE VIEWS ---

const PrintableStudyPlan = ({ career, curriculum }: { career: Career, curriculum: CurriculumSubject[] }) => {
    const terms = Array.from({length: 10}, (_, i) => i + 1);
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-50 p-4 border border-gray-200 rounded print:border-gray-300">
                <div>
                    <span className="text-xs font-bold text-gray-500 uppercase">Programa Educativo</span>
                    <p className="font-bold text-lg">{career.name}</p>
                </div>
                <div>
                     <span className="text-xs font-bold text-gray-500 uppercase">Nivel</span>
                    <p className="font-medium">{career.level}</p>
                </div>
                 <div>
                     <span className="text-xs font-bold text-gray-500 uppercase">Coordinador</span>
                    <p className="font-medium">{career.coordinator}</p>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
                {terms.map(term => (
                    <div key={term} className="border border-gray-300 rounded overflow-hidden">
                        <div className="bg-gray-100 text-center py-1 border-b border-gray-300 font-bold text-sm">
                            Cuatrimestre {term}
                        </div>
                        <div className="p-2 space-y-2">
                             {curriculum.filter(s => s.term === term).map(subject => (
                                 <div key={subject.id} className="border border-gray-200 p-2 rounded text-xs bg-white">
                                     <div className="font-bold text-gray-800 mb-1">{subject.name}</div>
                                     <div className="flex justify-between text-[10px] text-gray-500">
                                         <span>{subject.code}</span>
                                         <span>{subject.credits} CR</span>
                                     </div>
                                 </div>
                             ))}
                             {curriculum.filter(s => s.term === term).length === 0 && (
                                 <div className="text-center text-[10px] text-gray-400 py-2">-</div>
                             )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

const PrintableStudentList = ({ students }: { students: StudentRecord[] }) => (
    <table className="w-full text-left border-collapse text-xs">
        <thead>
            <tr className="bg-gray-100 border-b border-gray-400">
                <th className="py-2 px-2 border-r border-gray-300 text-center w-10">#</th>
                <th className="py-2 px-2 border-r border-gray-300">Matrícula</th>
                <th className="py-2 px-2 border-r border-gray-300 w-1/3">Nombre Completo</th>
                <th className="py-2 px-2 border-r border-gray-300">Programa</th>
                <th className="py-2 px-2 border-r border-gray-300 text-center">Grado/Gpo</th>
                <th className="py-2 px-2 border-r border-gray-300 text-center">Promedio</th>
                <th className="py-2 px-2 text-center">Estatus</th>
            </tr>
        </thead>
        <tbody>
            {students.map((s, idx) => (
                <tr key={s.id} className="border-b border-gray-200">
                    <td className="py-2 px-2 text-center text-gray-500">{idx + 1}</td>
                    <td className="py-2 px-2 font-mono text-gray-600">{s.enrollmentId}</td>
                    <td className="py-2 px-2 font-semibold text-gray-900 uppercase">{s.name}</td>
                    <td className="py-2 px-2 text-gray-600">{s.programName}</td>
                    <td className="py-2 px-2 text-center">{s.term}º {s.group}</td>
                    <td className="py-2 px-2 text-center font-bold">{s.average}</td>
                    <td className="py-2 px-2 text-center uppercase text-[10px]">{s.status}</td>
                </tr>
            ))}
        </tbody>
    </table>
);

const PrintableProfessorList = ({ professors }: { professors: Professor[] }) => (
    <table className="w-full text-left border-collapse text-xs">
        <thead>
            <tr className="bg-gray-100 border-b border-gray-400">
                <th className="py-2 px-2 border-r border-gray-300 text-center w-10">#</th>
                <th className="py-2 px-2 border-r border-gray-300">ID Empleado</th>
                <th className="py-2 px-2 border-r border-gray-300 w-1/3">Nombre del Docente</th>
                <th className="py-2 px-2 border-r border-gray-300">Departamento</th>
                <th className="py-2 px-2 border-r border-gray-300 text-center">Contrato</th>
                <th className="py-2 px-2 text-center">Estatus</th>
            </tr>
        </thead>
        <tbody>
            {professors.map((p, idx) => (
                <tr key={p.id} className="border-b border-gray-200">
                    <td className="py-2 px-2 text-center text-gray-500">{idx + 1}</td>
                    <td className="py-2 px-2 font-mono text-gray-600">{p.employeeId}</td>
                    <td className="py-2 px-2 font-semibold text-gray-900 uppercase">{p.name}</td>
                    <td className="py-2 px-2 text-gray-600">{p.department}</td>
                    <td className="py-2 px-2 text-center">{p.contractType}</td>
                    <td className="py-2 px-2 text-center uppercase text-[10px]">{p.status}</td>
                </tr>
            ))}
        </tbody>
    </table>
);

const PrintableCourseList = ({ courses, careers }: { courses: Course[], careers: Career[] }) => (
     <table className="w-full text-left border-collapse text-xs">
        <thead>
            <tr className="bg-gray-100 border-b border-gray-400">
                <th className="py-2 px-2 border-r border-gray-300 text-center w-10">#</th>
                <th className="py-2 px-2 border-r border-gray-300">Materia</th>
                <th className="py-2 px-2 border-r border-gray-300">Programa</th>
                <th className="py-2 px-2 border-r border-gray-300 w-1/4">Docente Asignado</th>
                <th className="py-2 px-2 border-r border-gray-300 text-center">Gpo/Aula</th>
                <th className="py-2 px-2 text-center">Alumnos</th>
            </tr>
        </thead>
        <tbody>
            {courses.map((c, idx) => {
                 const career = careers.find(car => car.id === c.careerId);
                 return (
                    <tr key={c.id} className="border-b border-gray-200">
                        <td className="py-2 px-2 text-center text-gray-500">{idx + 1}</td>
                        <td className="py-2 px-2 font-semibold text-gray-900">{c.name}</td>
                        <td className="py-2 px-2 text-gray-600">{career?.code}</td>
                        <td className="py-2 px-2 text-gray-800">{c.professorName || 'VACANTE'}</td>
                        <td className="py-2 px-2 text-center">{c.term}º{c.group} - {c.classroom}</td>
                        <td className="py-2 px-2 text-center">{c.studentsCount || 0}</td>
                    </tr>
                );
            })}
        </tbody>
    </table>
);


// --- MAIN COMPONENT ---

const AdminDashboard: React.FC<Props> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  // States for granular navigation within Careers
  const [careerViewMode, setCareerViewMode] = useState<CareerSubView>('list');
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  
  // State for Group Detail View
  const [selectedGroup, setSelectedGroup] = useState<{term: number, group: string} | null>(null);
  const [groupDetailTab, setGroupDetailTab] = useState<'subjects' | 'students'>('subjects');

  // Local state to simulate database
  const [courses, setCourses] = useState<Course[]>(ALL_COURSES_MOCK);
  const [students, setStudents] = useState<StudentRecord[]>(ALL_STUDENTS_MOCK);
  const [professors, setProfessors] = useState<Professor[]>(PROFESSORS_MOCK);
  const [careers] = useState<Career[]>(CAREERS_MOCK);
  const [curriculum, setCurriculum] = useState<CurriculumSubject[]>(CURRICULUM_MOCK);
  
  // Filters state
  const [selectedCareerIdFilter, setSelectedCareerIdFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  const [editingSubject, setEditingSubject] = useState<Partial<CurriculumSubject> | null>(null);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  const [editingStudent, setEditingStudent] = useState<Partial<StudentRecord> | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  // Document Printing State
  const [activeDocument, setActiveDocument] = useState<DocumentType>('none');

  // --- Helpers ---
  const handleCareerAction = (career: Career, action: 'groups' | 'plan') => {
      setSelectedCareer(career);
      setCareerViewMode(action === 'groups' ? 'groups' : 'study_plan');
      setActiveTab('careers');
  };

  const handleGroupClick = (term: number, group: string) => {
      setSelectedGroup({ term, group });
      setCareerViewMode('group_detail');
  };

  const resetCareerNavigation = () => {
      setCareerViewMode('list');
      setSelectedCareer(null);
      setSelectedGroup(null);
  };

  // --- CRUD Handlers ---

  // Courses (Active Classes)
  const handleEditCourse = (course: Course) => {
    setEditingCourse({ ...course });
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = () => {
    if (editingCourse && editingCourse.id) {
      setCourses(prev => prev.map(c => c.id === editingCourse.id ? (editingCourse as Course) : c));
      setIsCourseModalOpen(false);
      setEditingCourse(null);
    }
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este curso?')) {
      setCourses(prev => prev.filter(c => c.id !== id));
    }
  };

  // Students
  const handleAddStudent = () => {
      setEditingStudent({
          status: 'regular',
          term: 1,
          group: 'A',
          enrollmentId: '',
          email: '',
          careerId: careers[0].id
      });
      setIsStudentModalOpen(true);
  }

  const handleEditStudent = (student: StudentRecord) => {
      setEditingStudent({...student});
      setIsStudentModalOpen(true);
  }

  const handleSaveStudent = () => {
      if(!editingStudent) return;
      
      const studentToSave = editingStudent as StudentRecord;
      
      // Auto generate email if empty or enrollment changed
      if (!studentToSave.email && studentToSave.enrollmentId) {
          studentToSave.email = `${studentToSave.enrollmentId}@uppenjamo.edu.mx`;
      }

      if (studentToSave.id) {
          // Edit
          setStudents(prev => prev.map(s => s.id === studentToSave.id ? studentToSave : s));
      } else {
          // New
          const newId = `s-${Date.now()}`;
          const programName = careers.find(c => c.id === studentToSave.careerId)?.name || '';
          setStudents(prev => [...prev, { ...studentToSave, id: newId, programName, average: studentToSave.average || 0 }]);
      }
      setIsStudentModalOpen(false);
      setEditingStudent(null);
  }

  const handleDeleteStudent = (id: string) => {
      if (confirm('¿Dar de baja al alumno?')) {
          setStudents(prev => prev.map(s => s.id === id ? {...s, status: 'baja'} : s));
      }
  }

  // Professors
  const handleDeleteProfessor = (id: string) => {
      if(confirm('¿Desactivar docente del sistema?')) {
          setProfessors(prev => prev.map(p => p.id === id ? {...p, status: 'inactive'} : p));
      }
  }

  // Study Plan (Curriculum)
  const handleAddSubject = (term: number) => {
      setEditingSubject({
          term,
          careerId: selectedCareer?.id,
          credits: 6,
          name: '',
          code: ''
      });
      setIsSubjectModalOpen(true);
  };

  const handleEditSubject = (subject: CurriculumSubject) => {
      setEditingSubject({...subject});
      setIsSubjectModalOpen(true);
  };

  const handleSaveSubject = () => {
      if (!editingSubject || !editingSubject.name) return;

      if (editingSubject.id) {
          // Edit
          setCurriculum(prev => prev.map(s => s.id === editingSubject.id ? (editingSubject as CurriculumSubject) : s));
      } else {
          // Add New
          const newSubject: CurriculumSubject = {
              ...(editingSubject as CurriculumSubject),
              id: `SUB-${Date.now()}`,
          };
          setCurriculum(prev => [...prev, newSubject]);
      }
      setIsSubjectModalOpen(false);
      setEditingSubject(null);
  };

  const handleDeleteSubject = (id: string) => {
      if(confirm('¿Eliminar esta materia del plan de estudios?')) {
          setCurriculum(prev => prev.filter(s => s.id !== id));
      }
  }

  // --- Components ---

  const Sidebar = () => (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex-shrink-0 flex flex-col hidden md:flex sticky top-0 h-screen">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold tracking-tight text-white">UPP <span className="text-emerald-500">Pénjamo</span></h2>
        <p className="text-xs text-slate-400 mt-1">Gestión Cuatrimestral</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <SidebarItem icon={LayoutDashboard} label="Panel General" tab="overview" />
        <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Académico</p>
        </div>
        <SidebarItem icon={Briefcase} label="Carreras / Programas" tab="careers" />
        <SidebarItem icon={BookOpen} label="Materias y Cursos" tab="courses" />
        
        <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Comunidad</p>
        </div>
        <SidebarItem icon={Users} label="Docentes" tab="professors" />
        <SidebarItem icon={GraduationCap} label="Alumnos" tab="students" />
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white transition-colors w-full" onClick={onLogout}>
          <LogOut size={18} />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );

  const SidebarItem = ({ icon: Icon, label, tab }: { icon: any, label: string, tab: Tab }) => (
    <button
      onClick={() => {
          setActiveTab(tab);
          if (tab === 'careers') resetCareerNavigation();
      }}
      className={`flex items-center space-x-3 px-4 py-3 w-full rounded-lg transition-all mb-1 ${
        activeTab === tab 
        ? 'bg-emerald-600 text-white shadow-md' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={18} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  const StatCard = ({ title, value, subtitle, colorClass }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-full">
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`mt-4 text-xs font-medium px-2 py-1 rounded-lg w-fit ${colorClass}`}>
        {subtitle}
      </div>
    </div>
  );

  // --- Views ---

  // 1. OVERVIEW
  const Overview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
            title="Matrícula Total" 
            value={students.filter(s => s.status === 'regular').length} 
            subtitle="Ciclo 2025-2" 
            colorClass="bg-blue-50 text-blue-700" 
        />
        <StatCard 
            title="Docentes Activos" 
            value={professors.filter(p => p.status === 'active').length} 
            subtitle="92% Asistencia" 
            colorClass="bg-emerald-50 text-emerald-700" 
        />
        <StatCard 
            title="Grupos Abiertos" 
            value={new Set(courses.map(c => c.id.split('-').slice(0, 3).join('-'))).size} 
            subtitle="Promedio 25 alumnos" 
            colorClass="bg-purple-50 text-purple-700" 
        />
        <StatCard 
            title="Programas" 
            value={careers.length} 
            subtitle="Ingenierías y Lic." 
            colorClass="bg-orange-50 text-orange-700" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Estatus del Cuatrimestre</h3>
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center font-bold text-xl text-emerald-600">
                    45%
                </div>
                <div>
                    <p className="font-semibold text-gray-900">Semana 7 de 15</p>
                    <p className="text-sm text-gray-500">Próximo evento: 2do Parcial (12 de Octubre)</p>
                </div>
            </div>
            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Carga Académica</span>
                    <span className="font-medium text-green-600">Completada</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-full"></div>
                </div>
                
                <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">Captura de Calificaciones P1</span>
                    <span className="font-medium text-green-600">98%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-[98%]"></div>
                </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
             <h3 className="text-lg font-bold text-gray-800 mb-4">Avisos Administrativos</h3>
             <div className="space-y-4">
                 <div className="flex gap-3 items-start">
                     <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1"><Clock size={16}/></div>
                     <div>
                         <p className="text-sm font-semibold text-gray-900">Cierre de Reinscripciones Tardías</p>
                         <p className="text-xs text-gray-500">Vence este viernes a las 14:00 hrs para cuatrimestres avanzados.</p>
                     </div>
                 </div>
                 <div className="flex gap-3 items-start">
                     <div className="bg-orange-100 p-2 rounded-lg text-orange-600 mt-1"><AlertCircle size={16}/></div>
                     <div>
                         <p className="text-sm font-semibold text-gray-900">Auditoría de Grupos Pequeños</p>
                         <p className="text-xs text-gray-500">Revisar grupos con menos de 10 alumnos en Ing. Mecatrónica.</p>
                     </div>
                 </div>
             </div>
          </div>
      </div>
    </div>
  );

  // 2. CAREERS VIEW SYSTEM
  const CareersRoot = () => {
    if (careerViewMode === 'list') return <CareersList />;
    if (careerViewMode === 'groups') return <CareerGroupsView />;
    if (careerViewMode === 'group_detail') return <GroupDetailView />;
    if (careerViewMode === 'study_plan') return <StudyPlanView />;
    return <CareersList />;
  }

  const CareersList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {careers.map(career => (
            <div key={career.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className={`h-2 ${career.color}`}></div>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">{career.level}</span>
                            <h3 className="text-xl font-bold text-gray-900 mt-1">{career.name}</h3>
                        </div>
                        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">{career.code}</span>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm text-gray-600 gap-2">
                            <Users size={16} />
                            <span>{career.totalStudents} Alumnos activos</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 gap-2">
                            <BookOpen size={16} />
                            <span>{career.totalGroups} Grupos abiertos</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 gap-2">
                            <Briefcase size={16} />
                            <span>Coord: {career.coordinator}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleCareerAction(career, 'plan')}
                            className="flex-1 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                            Ver Plan de Estudios
                        </button>
                        <button 
                            onClick={() => handleCareerAction(career, 'groups')}
                            className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Ver Grupos
                        </button>
                    </div>
                </div>
            </div>
        ))}
    </div>
  );

  const CareerGroupsView = () => {
      // Logic to get unique groups for this career based on COURSES
      const groups = useMemo(() => {
          if (!selectedCareer) return [];
          const careerCourses = courses.filter(c => c.careerId === selectedCareer.id);
          const uniqueGroups = new Set<string>();
          const result: {term: number, group: string, id: string, studentsCount: number}[] = [];
          
          careerCourses.forEach(c => {
              const key = `${c.term}-${c.group}`;
              if (!uniqueGroups.has(key)) {
                  uniqueGroups.add(key);
                  // Approximate count by filtering students
                  const count = students.filter(s => s.careerId === selectedCareer.id && s.term === c.term && s.group === c.group).length;
                  result.push({ term: c.term, group: c.group, id: key, studentsCount: count });
              }
          });
          return result.sort((a,b) => (a.term - b.term) || a.group.localeCompare(b.group));
      }, [selectedCareer, courses, students]);

      return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-6 flex items-center gap-2">
                  <button onClick={() => setCareerViewMode('list')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                      <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-xl font-bold text-gray-900">Grupos de {selectedCareer?.name}</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {groups.map(g => (
                      <button 
                        key={g.id}
                        onClick={() => handleGroupClick(g.term, g.group)}
                        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all text-left group"
                      >
                          <div className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                              {g.term}º{g.group}
                          </div>
                          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                              Cuatrimestre {g.term}
                          </div>
                          <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
                              <span>{g.studentsCount} Alumnos</span>
                              <ChevronRight size={16} />
                          </div>
                      </button>
                  ))}
                  {groups.length === 0 && (
                      <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                          No hay grupos activos registrados para esta carrera.
                      </div>
                  )}
              </div>
          </div>
      )
  };

  const GroupDetailView = () => {
    // Filter data for this group
    const groupCourses = courses.filter(c => 
        c.careerId === selectedCareer?.id && 
        c.term === selectedGroup?.term && 
        c.group === selectedGroup?.group
    );

    const groupStudents = students.filter(s => 
        s.careerId === selectedCareer?.id && 
        s.term === selectedGroup?.term && 
        s.group === selectedGroup?.group
    );

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col h-full">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={() => setCareerViewMode('groups')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedGroup?.term}º{selectedGroup?.group} - {selectedCareer?.code}</h2>
                        <p className="text-sm text-gray-500">Detalle del Grupo</p>
                    </div>
                </div>
                
                {/* Tabs for Group View */}
                <div className="bg-gray-100 p-1 rounded-lg flex">
                    <button 
                        onClick={() => setGroupDetailTab('subjects')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${groupDetailTab === 'subjects' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Carga Académica
                    </button>
                    <button 
                         onClick={() => setGroupDetailTab('students')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${groupDetailTab === 'students' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Lista de Alumnos ({groupStudents.length})
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
                {groupDetailTab === 'subjects' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Materia</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Docente</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Créditos</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Aula</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {groupCourses.map(c => (
                                    <tr key={c.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                                        <td className="px-6 py-4 text-gray-600 text-sm">{c.professorName || 'Sin asignar'}</td>
                                        <td className="px-6 py-4 text-center text-gray-600 text-sm">{c.credits}</td>
                                        <td className="px-6 py-4 text-center text-gray-600 text-sm">{c.classroom}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleEditCourse(c)} className="text-blue-600 hover:underline text-xs font-medium">Editar</button>
                                        </td>
                                    </tr>
                                ))}
                                {groupCourses.length === 0 && (
                                    <tr><td colSpan={5} className="p-8 text-center text-gray-400">No hay materias asignadas a este grupo.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {groupDetailTab === 'students' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Matrícula</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Nombre Completo</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Correo Institucional</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Promedio</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Estatus</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {groupStudents.map(s => (
                                    <tr key={s.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono text-sm text-gray-500">{s.enrollmentId}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{s.name}</td>
                                        <td className="px-6 py-4 text-sm text-blue-600 underline cursor-pointer">{s.email}</td>
                                        <td className={`px-6 py-4 text-center font-bold text-sm ${s.average < 8 ? 'text-amber-600' : 'text-green-600'}`}>{s.average}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.status === 'regular' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                {s.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {groupStudents.length === 0 && (
                                    <tr><td colSpan={5} className="p-8 text-center text-gray-400">No hay alumnos inscritos en este grupo.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
  };

  const StudyPlanView = () => {
      // Logic for study plan layout (Cuatrimestres 1-10)
      const maxTerms = 10;
      const terms = Array.from({length: maxTerms}, (_, i) => i + 1);
      
      // Filter curriculum for this career
      const careerCurriculum = curriculum.filter(s => s.careerId === selectedCareer?.id);

      return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={() => setCareerViewMode('list')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Plan de Estudios: {selectedCareer?.name}</h2>
                        <p className="text-sm text-gray-500">Mapa Curricular por Cuatrimestre</p>
                    </div>
                </div>
                <button 
                    onClick={() => setActiveDocument('study_plan')}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                    <Download size={16} /> Descargar Mapa
                </button>
            </div>

            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-max h-full">
                    {terms.map(term => (
                        <div key={term} className="w-72 flex flex-col h-full">
                            <div className="bg-slate-800 text-white py-2 px-4 rounded-t-xl text-center font-bold text-sm sticky top-0">
                                {term}º Cuatrimestre
                            </div>
                            <div className="bg-gray-100 flex-1 rounded-b-xl p-3 space-y-3 border border-gray-200 overflow-y-auto min-h-[400px]">
                                {/* Subjects per term */}
                                {careerCurriculum.filter(s => s.term === term).map(subject => (
                                    <StudyPlanCard 
                                        key={subject.id} 
                                        subject={subject} 
                                        onEdit={() => handleEditSubject(subject)}
                                        onDelete={() => handleDeleteSubject(subject.id)}
                                    />
                                ))}
                                
                                <button 
                                    onClick={() => handleAddSubject(term)}
                                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 text-xs font-semibold hover:border-emerald-400 hover:text-emerald-500 transition-colors flex items-center justify-center gap-1"
                                >
                                    <Plus size={14} /> Añadir Materia
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      );
  }

  // 3. COURSES VIEW (Standard)
  const CoursesView = () => {
    const filteredCourses = useMemo(() => {
        return courses.filter(c => {
            const matchesCareer = selectedCareerIdFilter === 'ALL' || c.careerId === selectedCareerIdFilter;
            const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  c.professorName?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCareer && matchesSearch;
        });
    }, [courses, selectedCareerIdFilter, searchTerm]);

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
        <div className="p-6 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Oferta Académica General</h3>
            <p className="text-sm text-gray-500">Listado completo de materias activas</p>
          </div>
          <div className="flex flex-wrap gap-3 w-full xl:w-auto">
              <button 
                onClick={() => setActiveDocument('course_list')}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                  <Download size={16} /> Descargar Oferta
              </button>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                  <Filter size={16} className="text-gray-400" />
                  <select 
                    value={selectedCareerIdFilter} 
                    onChange={(e) => setSelectedCareerIdFilter(e.target.value)}
                    className="bg-transparent text-sm font-medium text-gray-700 outline-none min-w-[150px]"
                  >
                      <option value="ALL">Todas las Carreras</option>
                      {careers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
              </div>

              <div className="relative flex-grow xl:flex-grow-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Buscar materia..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full" 
                  />
              </div>
          </div>
        </div>
        
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Materia / Grupo</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Programa</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Docente</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Cuatrimestre</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Cupo</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCourses.map((course) => {
                  const career = careers.find(c => c.id === course.careerId);
                  return (
                    <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-900">{course.name}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                                <span className="bg-gray-100 px-1.5 rounded">Gpo {course.group}</span>
                                <span className="text-gray-400">|</span>
                                <span>{course.classroom}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${career?.color.replace('bg-', 'bg-opacity-80 bg-') || 'bg-gray-400'}`}>
                                {career?.code || course.careerId}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{course.professorName || 'Sin asignar'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 text-center font-mono">{course.term}º</td>
                        <td className="px-6 py-4 text-sm text-gray-600 text-center">
                            {course.capacity} <span className="text-xs text-gray-400">max</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                            <button onClick={() => handleEditCourse(course)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDeleteCourse(course.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 size={16} />
                            </button>
                        </div>
                        </td>
                    </tr>
                  );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 4. PROFESSORS VIEW
  const ProfessorsView = () => (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                  <h3 className="text-lg font-bold text-gray-900">Plantilla Docente</h3>
                  <p className="text-sm text-gray-500">Gestión de PTCs y Profesores de Asignatura</p>
              </div>
              <div className="flex gap-2">
                 <button 
                    onClick={() => setActiveDocument('professor_list')}
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
                >
                    <Download size={16} /> Descargar Plantilla
                </button>
                <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
                    <Plus size={16} /> Nuevo Docente
                </button>
              </div>
          </div>

          <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50/50 sticky top-0 z-10">
                      <tr>
                          <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Docente</th>
                          <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Departamento</th>
                          <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Contrato</th>
                          <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Cursos Activos</th>
                          <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Estatus</th>
                          <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Acciones</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {professors.map(prof => (
                          <tr key={prof.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                                          {prof.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                                      </div>
                                      <div>
                                          <div className="text-sm font-semibold text-gray-900">{prof.name}</div>
                                          <div className="text-xs text-blue-600 underline cursor-pointer">{prof.email}</div>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">{prof.department}</td>
                              <td className="px-6 py-4 text-center">
                                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                                      {prof.contractType}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-center text-sm font-medium">{prof.coursesCount}</td>
                              <td className="px-6 py-4 text-center">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                                    ${prof.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 
                                      prof.status === 'sabbatical' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                                      'bg-red-50 text-red-700 border-red-200'}`}>
                                    {prof.status === 'active' ? 'Activo' : prof.status === 'sabbatical' ? 'Sabático' : 'Inactivo'}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                  <button onClick={() => handleDeleteProfessor(prof.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                                      <MoreHorizontal size={20} />
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  );

  // 5. STUDENTS VIEW (Updated for Cuatrimestral)
  const StudentsView = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Directorio de Alumnos</h3>
          <p className="text-sm text-gray-500">Control escolar y estatus académico</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setActiveDocument('student_list')}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
            >
                <Download size={16} /> Descargar Lista
            </button>
            <input type="text" placeholder="Buscar por matrícula..." className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <button 
                onClick={handleAddStudent}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700"
            >
                <Plus size={16} /> Inscribir Alumno
            </button>
        </div>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Matrícula / Correo</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Nombre</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Programa</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Cuatrimestre</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Promedio</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Estatus</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {students.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50 group">
                        <td className="px-6 py-4 text-sm font-mono text-gray-500">
                            <div className="font-bold text-gray-700">{student.enrollmentId}</div>
                            <div className="text-xs text-blue-500 underline">{student.email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                            {student.programName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 text-center">{student.term}º {student.group}</td>
                        <td className={`px-6 py-4 text-sm font-bold text-center ${student.average >= 9 ? 'text-green-600' : student.average < 7 ? 'text-red-600' : 'text-gray-700'}`}>
                            {student.average}
                        </td>
                        <td className="px-6 py-4 text-center">
                            <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium border
                                ${student.status === 'regular' ? 'bg-green-50 text-green-700 border-green-200' : 
                                  student.status === 'irregular' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                                  'bg-red-50 text-red-700 border-red-200'}`}>
                                {student.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                             <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button onClick={() => handleEditStudent(student)} className="p-1 hover:bg-gray-100 rounded text-blue-600">
                                     <Edit2 size={16} />
                                 </button>
                                 <button onClick={() => handleDeleteStudent(student.id)} className="p-1 hover:bg-gray-100 rounded text-red-600">
                                     <Trash2 size={16} />
                                 </button>
                             </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 flex-shrink-0 md:hidden z-10">
             <h2 className="text-lg font-bold text-gray-800">Admin Panel</h2>
             <button onClick={onLogout}><LogOut size={20} /></button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50">
           <div className="max-w-7xl mx-auto h-full flex flex-col pb-6">
             {/* Header Section - Only show on main views, hide on sub-views for cleaner look */}
             {careerViewMode === 'list' && activeTab !== 'overview' && (
                 <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 capitalize">
                            {activeTab === 'overview' ? 'Panel de Control' : 
                            activeTab === 'careers' ? 'Programas Educativos' :
                            activeTab === 'courses' ? 'Gestión de Cargas' :
                            activeTab === 'students' ? 'Alumnos' : 'Cuerpo Docente'}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Sistema Integral de Gestión Universitaria (SIGU) v2.5 - UPP Pénjamo
                        </p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm text-sm font-medium text-gray-600 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        Ciclo: Sep-Dic 2025
                    </div>
                 </div>
             )}

             {activeTab === 'overview' && <Overview />}
             {activeTab === 'careers' && <CareersRoot />}
             {activeTab === 'courses' && <CoursesView />}
             {activeTab === 'professors' && <ProfessorsView />}
             {activeTab === 'students' && <StudentsView />}
           </div>
        </main>
      </div>

      {/* --- DOCUMENTS MODALS --- */}
      
      {activeDocument === 'study_plan' && selectedCareer && (
          <AdminDocumentWrapper title="Plan de Estudios Oficial" onClose={() => setActiveDocument('none')}>
              <PrintableStudyPlan career={selectedCareer} curriculum={curriculum.filter(c => c.careerId === selectedCareer.id)} />
          </AdminDocumentWrapper>
      )}

      {activeDocument === 'student_list' && (
          <AdminDocumentWrapper title="Directorio de Estudiantes" onClose={() => setActiveDocument('none')}>
              <PrintableStudentList students={students} />
          </AdminDocumentWrapper>
      )}

      {activeDocument === 'professor_list' && (
          <AdminDocumentWrapper title="Plantilla Docente" onClose={() => setActiveDocument('none')}>
              <PrintableProfessorList professors={professors} />
          </AdminDocumentWrapper>
      )}

      {activeDocument === 'course_list' && (
          <AdminDocumentWrapper title="Oferta Académica" onClose={() => setActiveDocument('none')}>
              <PrintableCourseList courses={courses} careers={careers} />
          </AdminDocumentWrapper>
      )}


      {/* Edit Course Modal (Existing) */}
      {isCourseModalOpen && editingCourse && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">Editar Clase Activa</h3>
              <button onClick={() => setIsCourseModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Materia</label>
                <input 
                  type="text" 
                  value={editingCourse.name} 
                  onChange={(e) => setEditingCourse({...editingCourse, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Programa</label>
                    <select 
                       value={editingCourse.careerId}
                       onChange={(e) => setEditingCourse({...editingCourse, careerId: e.target.value})}
                       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                    >
                        {careers.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cuatrimestre</label>
                    <input 
                    type="number" 
                    value={editingCourse.term} 
                    onChange={(e) => setEditingCourse({...editingCourse, term: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profesor Asignado</label>
                <select 
                   value={editingCourse.professorName || ''}
                   onChange={(e) => setEditingCourse({...editingCourse, professorName: e.target.value})}
                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                >
                    <option value="">Sin Asignar</option>
                    {professors.filter(p => p.status === 'active').map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
                      <input 
                      type="text" 
                      value={editingCourse.group} 
                      onChange={(e) => setEditingCourse({...editingCourse, group: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad</label>
                      <input 
                      type="number" 
                      value={editingCourse.capacity} 
                      onChange={(e) => setEditingCourse({...editingCourse, capacity: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                  </div>
              </div>

            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsCourseModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">Cancelar</button>
              <button onClick={handleSaveCourse} className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
                <Save size={18} /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subject Modal (Curriculum) */}
      {isSubjectModalOpen && editingSubject && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-800">{editingSubject.id ? 'Editar Materia' : 'Nueva Materia'}</h3>
                    <button onClick={() => setIsSubjectModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Materia</label>
                        <input type="text" value={editingSubject.name} onChange={e => setEditingSubject({...editingSubject, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ej. Cálculo Diferencial" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Clave</label>
                            <input type="text" value={editingSubject.code} onChange={e => setEditingSubject({...editingSubject, code: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="CB-001" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Créditos</label>
                            <input type="number" value={editingSubject.credits} onChange={e => setEditingSubject({...editingSubject, credits: parseInt(e.target.value)})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                    <button onClick={() => setIsSubjectModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg">Cancelar</button>
                    <button onClick={handleSaveSubject} className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700">Guardar</button>
                </div>
            </div>
          </div>
      )}

      {/* Student Modal */}
      {isStudentModalOpen && editingStudent && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-800">{editingStudent.id ? 'Editar Alumno' : 'Inscribir Alumno'}</h3>
                    <button onClick={() => setIsStudentModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula</label>
                            <input type="text" value={editingStudent.enrollmentId} onChange={e => setEditingStudent({...editingStudent, enrollmentId: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="1903..." />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Correo Institucional</label>
                             <input type="text" value={editingStudent.enrollmentId ? `${editingStudent.enrollmentId}@uppenjamo.edu.mx` : ''} disabled className="w-full border bg-gray-100 rounded-lg px-3 py-2 text-gray-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                        <input type="text" value={editingStudent.name} onChange={e => setEditingStudent({...editingStudent, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Programa Educativo</label>
                        <select 
                            value={editingStudent.careerId} 
                            onChange={e => setEditingStudent({...editingStudent, careerId: e.target.value})} 
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                        >
                            {careers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Cuatri</label>
                             <input type="number" value={editingStudent.term} onChange={e => setEditingStudent({...editingStudent, term: parseInt(e.target.value)})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
                             <input type="text" value={editingStudent.group} onChange={e => setEditingStudent({...editingStudent, group: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Estatus</label>
                             <select value={editingStudent.status} onChange={e => setEditingStudent({...editingStudent, status: e.target.value as any})} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                                 <option value="regular">Regular</option>
                                 <option value="irregular">Irregular</option>
                                 <option value="baja">Baja</option>
                             </select>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                    <button onClick={() => setIsStudentModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg">Cancelar</button>
                    <button onClick={handleSaveStudent} className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700">Guardar Alumno</button>
                </div>
            </div>
          </div>
      )}

    </div>
  );
};

export default AdminDashboard;