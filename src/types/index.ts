export interface Student {
  id: string;
  username: string;
  nama: string;
  kelas: string;
  level: string;
}

export interface ExamSession {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  startTime: Date;
  endTime: Date;
}

export interface AppState {
  isLoggedIn: boolean;
  student: Student | null;
  currentExam: ExamSession | null;
  isInExamMode: boolean;
}
