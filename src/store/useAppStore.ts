
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Student, ExamSession } from '../types';
import { authenticateUser } from '../services/authService';

interface AppStore extends AppState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  startExam: (exam: ExamSession) => void;
  endExam: () => void;
  validateAdminPassword: (password: string) => boolean;
  setExamUrl: (url: string) => void;
  examUrl: string;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      student: null,
      currentExam: null,
      isInExamMode: false,
      examUrl: 'https://smknbojonggambir.github.io/psat/',

      login: async (username: string, password: string) => {
        try {
          const result = await authenticateUser(username, password);
          
          if (result.success && result.data) {
            const student: Student = {
              id: Date.now().toString(),
              username: result.data.username,
              nama: result.data.nama,
              kelas: result.data.kelas,
              level: result.data.level
            };
            
            set({ isLoggedIn: true, student });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },

      logout: () => {
        set({ 
          isLoggedIn: false, 
          student: null, 
          currentExam: null, 
          isInExamMode: false 
        });
      },

      startExam: (exam: ExamSession) => {
        set({ currentExam: exam, isInExamMode: true });
      },

      endExam: () => {
        set({ currentExam: null, isInExamMode: false });
      },

      validateAdminPassword: (password: string) => {
        return password === 'admin123';
      },

      setExamUrl: (url: string) => {
        set({ examUrl: url });
      },
    }),
    {
      name: 'exam-browser-storage',
    }
  )
);
