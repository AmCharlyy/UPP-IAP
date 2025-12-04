import { UserRole, ScheduleItem, NotificationItem, Course, StudentRecord, Career, Professor, CurriculumSubject, HistoryGrade } from './types';

// --- HELPERS FOR DATA GENERATION ---

const NAMES = ["Ana", "Luis", "Maria", "Carlos", "Sofia", "Jorge", "Fernanda", "Pedro", "Lucia", "Miguel", "Elena", "Roberto", "Patricia", "David", "Carmen", "Juan", "Isabel", "Jose", "Paula", "Alejandro", "Ricardo", "Gabriela", "Daniel", "Veronica", "Hector", "Beatriz", "Francisco", "Teresa", "Manuel"];
const LAST_NAMES = ["Garcia", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Perez", "Sanchez", "Ramirez", "Torres", "Flores", "Rivera", "Gomez", "Diaz", "Reyes", "Morales", "Ortiz", "Castillo", "Chavez", "Vasquez", "Jimenez", "Moreno", "Alvarez", "Romero"];

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// --- STATIC CAREER DATA ---

export const CAREERS_MOCK: Career[] = [
  { id: 'ISO', name: 'Ingeniería en Software', code: 'ISO', level: 'Ingeniería', coordinator: 'M.C. Juan Pérez', totalStudents: 0, totalGroups: 0, color: 'bg-blue-600' },
  { id: 'IM', name: 'Ingeniería Mecatrónica', code: 'IM', level: 'Ingeniería', coordinator: 'Dr. Roberto Gomez', totalStudents: 0, totalGroups: 0, color: 'bg-orange-500' },
  { id: 'LTF', name: 'Licenciatura en Terapia Física', code: 'LTF', level: 'Licenciatura', coordinator: 'Lic. Ana Suarez', totalStudents: 0, totalGroups: 0, color: 'bg-emerald-500' },
  { id: 'IBT', name: 'Ingeniería en Biotecnología', code: 'IBT', level: 'Ingeniería', coordinator: 'Dra. Carmen Lopez', totalStudents: 0, totalGroups: 0, color: 'bg-purple-500' },
];

// --- GENERATING PROFESSORS ---

const DEPARTMENTS = ['Ciencias Exactas', 'Sistemas Computacionales', 'Mecatrónica', 'Salud y Terapia', 'Idiomas', 'Biotecnología', 'Desarrollo Humano'];

const generateProfessors = (count: number): Professor[] => {
  return Array.from({ length: count }).map((_, i) => {
    const name = `${getRandomItem(NAMES)} ${getRandomItem(LAST_NAMES)} ${getRandomItem(LAST_NAMES)}`;
    const firstName = name.split(' ')[0].toLowerCase();
    const lastName = name.split(' ')[1].toLowerCase();
    const email = `${firstName}.${lastName}@uppenjamo.edu.mx`;
    
    return {
      id: `P-${100 + i}`,
      employeeId: `DOC-${100 + i}`,
      name: `Mtro/a. ${name}`,
      email,
      department: getRandomItem(DEPARTMENTS),
      status: Math.random() > 0.9 ? 'sabbatical' : 'active',
      contractType: Math.random() > 0.6 ? 'PTC' : 'PA', // 40% PA, 60% PTC
      coursesCount: 0
    };
  });
};

// Generate 40 professors to cover all classes
export const PROFESSORS_MOCK: Professor[] = generateProfessors(40);

// --- COMPLETE CURRICULUM GENERATION (Terms 1-9 for all) ---

const RAW_CURRICULUM = [
  // --- ISO: Ingeniería en Software ---
  { t: 1, name: "Fundamentos de Programación", c: 6, id: 'ISO' }, { t: 1, name: "Álgebra Lineal", c: 6, id: 'ISO' }, { t: 1, name: "Inglés I", c: 4, id: 'ISO' }, { t: 1, name: "Desarrollo Humano", c: 4, id: 'ISO' },
  { t: 2, name: "Prog. Orientada a Objetos", c: 8, id: 'ISO' }, { t: 2, name: "Cálculo Diferencial", c: 6, id: 'ISO' }, { t: 2, name: "Inglés II", c: 4, id: 'ISO' }, { t: 2, name: "Química Básica", c: 4, id: 'ISO' },
  { t: 3, name: "Estructura de Datos", c: 8, id: 'ISO' }, { t: 3, name: "Cálculo Integral", c: 6, id: 'ISO' }, { t: 3, name: "Inglés III", c: 4, id: 'ISO' }, { t: 3, name: "Física para Ingeniería", c: 6, id: 'ISO' },
  { t: 4, name: "Bases de Datos", c: 8, id: 'ISO' }, { t: 4, name: "Cálculo Vectorial", c: 6, id: 'ISO' }, { t: 4, name: "Inglés IV", c: 4, id: 'ISO' }, { t: 4, name: "Sistemas Operativos", c: 6, id: 'ISO' },
  { t: 5, name: "Programación Web", c: 8, id: 'ISO' }, { t: 5, name: "Ecuaciones Diferenciales", c: 6, id: 'ISO' }, { t: 5, name: "Inglés V", c: 4, id: 'ISO' }, { t: 5, name: "Redes de Computadoras", c: 8, id: 'ISO' },
  { t: 6, name: "Ingeniería de Software", c: 8, id: 'ISO' }, { t: 6, name: "Probabilidad y Estadística", c: 6, id: 'ISO' }, { t: 6, name: "Inglés VI", c: 4, id: 'ISO' }, { t: 6, name: "Interacción Humano-Comp", c: 6, id: 'ISO' },
  { t: 7, name: "Desarrollo Móvil", c: 8, id: 'ISO' }, { t: 7, name: "Calidad de Software", c: 6, id: 'ISO' }, { t: 7, name: "Inglés VII", c: 4, id: 'ISO' }, { t: 7, name: "Gestión de Proyectos", c: 6, id: 'ISO' },
  { t: 8, name: "Seguridad Informática", c: 8, id: 'ISO' }, { t: 8, name: "Inteligencia Artificial", c: 8, id: 'ISO' }, { t: 8, name: "Inglés VIII", c: 4, id: 'ISO' }, { t: 8, name: "Minería de Datos", c: 6, id: 'ISO' },
  { t: 9, name: "Estadía Profesional", c: 20, id: 'ISO' }, { t: 9, name: "Ética Profesional", c: 4, id: 'ISO' },
  
  // --- IM: Ingeniería Mecatrónica ---
  { t: 1, name: "Intro. a la Mecatrónica", c: 4, id: 'IM' }, { t: 1, name: "Álgebra Superior", c: 6, id: 'IM' }, { t: 1, name: "Química de Materiales", c: 6, id: 'IM' }, { t: 1, name: "Inglés I", c: 4, id: 'IM' },
  { t: 2, name: "Cálculo Diferencial", c: 6, id: 'IM' }, { t: 2, name: "Metrología", c: 4, id: 'IM' }, { t: 2, name: "Dibujo Asistido (CAD)", c: 6, id: 'IM' }, { t: 2, name: "Inglés II", c: 4, id: 'IM' },
  { t: 3, name: "Cálculo Integral", c: 6, id: 'IM' }, { t: 3, name: "Física Clásica", c: 6, id: 'IM' }, { t: 3, name: "Estática", c: 6, id: 'IM' }, { t: 3, name: "Inglés III", c: 4, id: 'IM' },
  { t: 4, name: "Cálculo Vectorial", c: 6, id: 'IM' }, { t: 4, name: "Electricidad y Mag.", c: 6, id: 'IM' }, { t: 4, name: "Dinámica", c: 6, id: 'IM' }, { t: 4, name: "Inglés IV", c: 4, id: 'IM' },
  { t: 5, name: "Ecuaciones Diferenciales", c: 6, id: 'IM' }, { t: 5, name: "Circuitos Eléctricos", c: 8, id: 'IM' }, { t: 5, name: "Termodinámica", c: 6, id: 'IM' }, { t: 5, name: "Inglés V", c: 4, id: 'IM' },
  { t: 6, name: "Electrónica Analógica", c: 8, id: 'IM' }, { t: 6, name: "Mecánica de Materiales", c: 6, id: 'IM' }, { t: 6, name: "Programación C++", c: 6, id: 'IM' }, { t: 6, name: "Inglés VI", c: 4, id: 'IM' },
  { t: 7, name: "Electrónica Digital", c: 8, id: 'IM' }, { t: 7, name: "Máquinas Eléctricas", c: 6, id: 'IM' }, { t: 7, name: "Instrumentación", c: 6, id: 'IM' }, { t: 7, name: "Inglés VII", c: 4, id: 'IM' },
  { t: 8, name: "Control Automático", c: 8, id: 'IM' }, { t: 8, name: "Robótica Industrial", c: 8, id: 'IM' }, { t: 8, name: "PLC y Automatización", c: 8, id: 'IM' }, { t: 8, name: "Inglés VIII", c: 4, id: 'IM' },
  { t: 9, name: "Estadía Profesional", c: 20, id: 'IM' }, { t: 9, name: "Diseño Mecatrónico", c: 6, id: 'IM' },
  
  // --- LTF: Licenciatura en Terapia Física ---
  { t: 1, name: "Anatomía Humana I", c: 8, id: 'LTF' }, { t: 1, name: "Biología Celular", c: 6, id: 'LTF' }, { t: 1, name: "Historia de la FT", c: 4, id: 'LTF' }, { t: 1, name: "Inglés I", c: 4, id: 'LTF' },
  { t: 2, name: "Anatomía Humana II", c: 8, id: 'LTF' }, { t: 2, name: "Fisiología I", c: 8, id: 'LTF' }, { t: 2, name: "Bioquímica", c: 6, id: 'LTF' }, { t: 2, name: "Inglés II", c: 4, id: 'LTF' },
  { t: 3, name: "Fisiología del Ejercicio", c: 8, id: 'LTF' }, { t: 3, name: "Biomecánica I", c: 6, id: 'LTF' }, { t: 3, name: "Patología General", c: 6, id: 'LTF' }, { t: 3, name: "Inglés III", c: 4, id: 'LTF' },
  { t: 4, name: "Biomecánica II", c: 6, id: 'LTF' }, { t: 4, name: "Kinesiología", c: 8, id: 'LTF' }, { t: 4, name: "Agentes Físicos I", c: 6, id: 'LTF' }, { t: 4, name: "Inglés IV", c: 4, id: 'LTF' },
  { t: 5, name: "Agentes Físicos II", c: 6, id: 'LTF' }, { t: 5, name: "Valoración Muscular", c: 8, id: 'LTF' }, { t: 5, name: "Hidroterapia", c: 4, id: 'LTF' }, { t: 5, name: "Inglés V", c: 4, id: 'LTF' },
  { t: 6, name: "Rehab. Neurológica", c: 8, id: 'LTF' }, { t: 6, name: "Rehab. Ortopédica", c: 8, id: 'LTF' }, { t: 6, name: "Masoterapia", c: 4, id: 'LTF' }, { t: 6, name: "Inglés VI", c: 4, id: 'LTF' },
  { t: 7, name: "Rehab. Pediátrica", c: 8, id: 'LTF' }, { t: 7, name: "Rehab. Geriátrica", c: 8, id: 'LTF' }, { t: 7, name: "Farmacología", c: 4, id: 'LTF' }, { t: 7, name: "Inglés VII", c: 4, id: 'LTF' },
  { t: 8, name: "Práctica Clínica I", c: 12, id: 'LTF' }, { t: 8, name: "Rehab. Deportiva", c: 6, id: 'LTF' }, { t: 8, name: "Ética y Salud", c: 4, id: 'LTF' }, { t: 8, name: "Inglés VIII", c: 4, id: 'LTF' },
  { t: 9, name: "Estadía Profesional", c: 20, id: 'LTF' }, { t: 9, name: "Gestión en Salud", c: 4, id: 'LTF' },

  // --- IBT: Ingeniería en Biotecnología ---
  { t: 1, name: "Biología", c: 6, id: 'IBT' }, { t: 1, name: "Química Inorgánica", c: 6, id: 'IBT' }, { t: 1, name: "Álgebra Lineal", c: 6, id: 'IBT' }, { t: 1, name: "Inglés I", c: 4, id: 'IBT' },
  { t: 2, name: "Química Orgánica I", c: 8, id: 'IBT' }, { t: 2, name: "Cálculo Diferencial", c: 6, id: 'IBT' }, { t: 2, name: "Mecánica Clásica", c: 6, id: 'IBT' }, { t: 2, name: "Inglés II", c: 4, id: 'IBT' },
  { t: 3, name: "Química Orgánica II", c: 8, id: 'IBT' }, { t: 3, name: "Cálculo Integral", c: 6, id: 'IBT' }, { t: 3, name: "Termodinámica", c: 6, id: 'IBT' }, { t: 3, name: "Inglés III", c: 4, id: 'IBT' },
  { t: 4, name: "Microbiología", c: 8, id: 'IBT' }, { t: 4, name: "Bioquímica I", c: 8, id: 'IBT' }, { t: 4, name: "Probabilidad y Est.", c: 6, id: 'IBT' }, { t: 4, name: "Inglés IV", c: 4, id: 'IBT' },
  { t: 5, name: "Bioquímica II", c: 8, id: 'IBT' }, { t: 5, name: "Biología Molecular", c: 8, id: 'IBT' }, { t: 5, name: "Balance de Materia", c: 6, id: 'IBT' }, { t: 5, name: "Inglés V", c: 4, id: 'IBT' },
  { t: 6, name: "Ingeniería Genética", c: 8, id: 'IBT' }, { t: 6, name: "Fenómenos de Transp.", c: 6, id: 'IBT' }, { t: 6, name: "Instrumentación", c: 6, id: 'IBT' }, { t: 6, name: "Inglés VI", c: 4, id: 'IBT' },
  { t: 7, name: "Operaciones Unitarias", c: 8, id: 'IBT' }, { t: 7, name: "Biotecnología Alim.", c: 8, id: 'IBT' }, { t: 7, name: "Bioética", c: 4, id: 'IBT' }, { t: 7, name: "Inglés VII", c: 4, id: 'IBT' },
  { t: 8, name: "Bioreactores", c: 8, id: 'IBT' }, { t: 8, name: "Biotecnología Amb.", c: 8, id: 'IBT' }, { t: 8, name: "Formulación Proyectos", c: 6, id: 'IBT' }, { t: 8, name: "Inglés VIII", c: 4, id: 'IBT' },
  { t: 9, name: "Estadía Profesional", c: 20, id: 'IBT' }, { t: 9, name: "Control de Calidad", c: 4, id: 'IBT' },
];

export const CURRICULUM_MOCK: CurriculumSubject[] = RAW_CURRICULUM.map((sub, idx) => ({
  id: `SUB-${sub.id}-${idx}`,
  name: sub.name,
  code: `${sub.id}-${sub.t}0${idx % 10}`,
  credits: sub.c,
  term: sub.t,
  careerId: sub.id
}));

const generateStudentsForGroup = (careerId: string, term: number, group: string, count: number, startId: number): StudentRecord[] => {
  return Array.from({ length: count }).map((_, i) => {
    const idNum = startId + i;
    const year = 25 - Math.floor(term / 3); // Calculate enrollment year based on term
    const enrollmentId = `${year}00${idNum.toString().padStart(4, '0')}`;
    const name = `${getRandomItem(NAMES)} ${getRandomItem(LAST_NAMES)} ${getRandomItem(LAST_NAMES)}`;
    const career = CAREERS_MOCK.find(c => c.id === careerId);
    
    return {
      id: `s-${enrollmentId}`,
      enrollmentId,
      name,
      email: `${enrollmentId}@uppenjamo.edu.mx`,
      careerId,
      programName: career?.name || '',
      term,
      group,
      average: Number((7 + Math.random() * 2.5).toFixed(1)), // Grades between 7.0 and 9.5
      status: Math.random() > 0.9 ? 'irregular' : 'regular'
    };
  });
};

// --- GENERATING COURSES & STUDENTS ---

let ALL_COURSES_GENERATED: Course[] = [];
let ALL_STUDENTS_GENERATED: StudentRecord[] = [];
let studentIdCounter = 1000;

// Active terms for current semester (e.g., Sep-Dec)
const ACTIVE_TERMS = [1, 4, 7]; 
// Ensure 2 groups per active term
const GROUPS = ['A', 'B'];

CAREERS_MOCK.forEach(career => {
  let careerStudentsCount = 0;
  let careerGroupsCount = 0;

  ACTIVE_TERMS.forEach(term => {
    // Get subjects for this career and term
    const termSubjects = CURRICULUM_MOCK.filter(s => s.careerId === career.id && s.term === term);
    
    if (termSubjects.length > 0) {
      GROUPS.forEach(group => {
        careerGroupsCount++;
        
        // 1. Create 25 Students for this Group
        const groupStudents = generateStudentsForGroup(career.id, term, group, 25, studentIdCounter);
        studentIdCounter += 25;
        ALL_STUDENTS_GENERATED.push(...groupStudents);
        careerStudentsCount += 25;

        // 2. Create Courses for this Group (based on Curriculum)
        termSubjects.forEach(subject => {
          // Assign a random professor from the Active pool (filtering lightly for realism or just random)
          const prof = getRandomItem(PROFESSORS_MOCK);
          
          ALL_COURSES_GENERATED.push({
            id: `C-${career.id}-${term}${group}-${subject.id}`,
            name: subject.name,
            careerId: career.id,
            professorId: prof.id,
            professorName: prof.name,
            group: group,
            credits: subject.credits,
            classroom: `Aula ${Math.floor(Math.random() * 20 + 100)}`,
            term: term,
            capacity: 35,
            status: 'active',
            studentsCount: 25 // Matches the students generated
          });
        });
      });
    }
  });

  career.totalStudents = careerStudentsCount;
  career.totalGroups = careerGroupsCount;
});

// Update professors mock counts based on generated courses
PROFESSORS_MOCK.forEach(p => {
    p.coursesCount = ALL_COURSES_GENERATED.filter(c => c.professorId === p.id).length;
});

export const ALL_COURSES_MOCK = ALL_COURSES_GENERATED;
export const ALL_STUDENTS_MOCK = ALL_STUDENTS_GENERATED;

// --- EXPORT SPECIFIC CREDENTIALS FOR LOGIN PAGE ---
export const DEMO_CREDENTIALS = {
  student: ALL_STUDENTS_MOCK[0] || { email: 'student@upp.edu.mx' },
  professor: PROFESSORS_MOCK[0] || { email: 'prof@upp.edu.mx' }
};

// --- INDIVIDUAL VIEWS ---

// Fallback if no courses generated (e.g. error in logic), though logic guarantees data.
const sampleCourse = ALL_COURSES_MOCK[0] || { name: 'Materia Ejemplo', professorName: 'Profesor', classroom: '101', group: 'A' };
const sampleCourse2 = ALL_COURSES_MOCK[1] || { name: 'Materia Ejemplo 2', professorName: 'Profesor', classroom: '102', group: 'A' };

// Updated Schedule to reflect 50 minute classes
export const STUDENT_SCHEDULE: ScheduleItem[] = [
  { id: '1', startTime: '07:00', endTime: '07:50', subject: sampleCourse.name, details: `${sampleCourse.professorName} | ${sampleCourse.classroom}`, type: 'class', day: 3 },
  { id: '2', startTime: '07:50', endTime: '08:40', subject: sampleCourse.name, details: `${sampleCourse.professorName} | ${sampleCourse.classroom}`, type: 'class', day: 3 },
  { id: '3', startTime: '08:40', endTime: '09:30', subject: 'Receso', details: 'Cafetería', type: 'break', day: 3 },
  { id: '4', startTime: '09:30', endTime: '10:20', subject: sampleCourse2.name, details: `${sampleCourse2.professorName} | ${sampleCourse2.classroom}`, type: 'class', day: 3 },
];

export const PROFESSOR_SCHEDULE: ScheduleItem[] = [
  { id: '1', startTime: '07:00', endTime: '07:50', subject: sampleCourse.name, details: `Gpo ${sampleCourse.group} | ${sampleCourse.classroom}`, type: 'class' },
  { id: '2', startTime: '07:50', endTime: '08:40', subject: sampleCourse.name, details: `Gpo ${sampleCourse.group} | ${sampleCourse.classroom}`, type: 'class' },
  { id: '3', startTime: '11:00', endTime: '12:00', subject: 'Asesorías', details: 'Cubículo 4B', type: 'office' },
];

export const STUDENT_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', type: 'danger', title: 'Adeudo de Biblioteca', message: "Tienes un libro con retraso de entrega de 3 días.", date: 'Hace 2 horas' },
  { id: '2', type: 'info', title: 'Reinscripciones', message: "El proceso inicia el próximo lunes para regulares.", date: 'Ayer' },
  { id: '3', type: 'success', title: 'Pago Registrado', message: "Tu pago de colegiatura de Septiembre ha sido procesado.", date: 'Hace 3 días' },
  { id: '4', type: 'warning', title: 'Evaluación Docente', message: "Recuerda evaluar a tus profesores antes del viernes.", date: 'Hace 4 días' },
];

export const PROFESSOR_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', type: 'warning', title: 'Cierre de Actas', message: "Faltan 2 días para el cierre del Parcial 1." },
  { id: '2', type: 'success', title: 'Evaluación Docente', message: "Has recibido una calificación de 4.8/5.0." },
];

export const STUDENT_COURSES: Course[] = ALL_COURSES_MOCK.slice(0, 6);
export const PROFESSOR_COURSES: Course[] = ALL_COURSES_MOCK.filter(c => c.professorId === PROFESSORS_MOCK[0].id).slice(0, 4);

// --- MOCK KARDEX / HISTORY ---
const generatePastGrades = (): HistoryGrade[] => {
    const grades: HistoryGrade[] = [];
    const subjects = CURRICULUM_MOCK.slice(0, 15); // First 15 subjects (Terms 1-3 approx)
    
    subjects.forEach((sub, i) => {
        grades.push({
            id: `h-${i}`,
            subjectName: sub.name,
            term: sub.term,
            score: Math.floor(Math.random() * (10 - 7 + 1) + 7), // 7 to 10
            type: Math.random() > 0.9 ? 'Extraordinario' : 'Ordinario',
            credits: sub.credits
        });
    });
    return grades.sort((a,b) => a.term - b.term);
}

export const MOCK_KARDEX: HistoryGrade[] = generatePastGrades();

// --- WEEKLY SCHEDULE GENERATOR ---
const generateWeeklySchedule = (): ScheduleItem[] => {
    const items: ScheduleItem[] = [];
    const days = [1, 2, 3, 4, 5]; // Mon-Fri
    const times = [
        { start: '07:00', end: '07:50' },
        { start: '07:50', end: '08:40' },
        { start: '08:40', end: '09:30', type: 'break' },
        { start: '09:30', end: '10:20' },
        { start: '10:20', end: '11:10' },
        { start: '11:10', end: '12:00' },
        { start: '12:00', end: '12:50' },
        { start: '12:50', end: '13:40' },
        { start: '13:40', end: '14:30' },
    ];

    days.forEach(day => {
        times.forEach((slot, index) => {
            if (slot.type === 'break') {
                 items.push({
                    id: `break-${day}-${index}`,
                    startTime: slot.start,
                    endTime: slot.end,
                    subject: 'Receso',
                    details: 'Cafetería',
                    type: 'break',
                    day: day
                });
            } else {
                // Randomly assign a course to this slot, or leave empty
                if (Math.random() > 0.3) {
                     const course = STUDENT_COURSES[index % STUDENT_COURSES.length];
                     items.push({
                        id: `sch-${day}-${index}`,
                        startTime: slot.start,
                        endTime: slot.end,
                        subject: course.name,
                        details: `${course.classroom}`,
                        type: 'class',
                        day: day
                    });
                }
            }
        });
    });
    return items;
};

export const WEEKLY_SCHEDULE_MOCK = generateWeeklySchedule();