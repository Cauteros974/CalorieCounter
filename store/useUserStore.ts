import { create } from 'zustand';

type ThemeMode = 'light' | 'dark';

interface UserState {
  fullName: string;
  weight: number;
  height: number;
  dailyCalories: number;
  dailyWater: number;
  consumedCalories: number;
  consumedWater: number;

  setProfile: (data: { fullName: string; weight: number; height: number }) => void;
  addCalories: (amount: number) => void;
  addWater: (amount: number) => void;

  theme: ThemeMode;
  toggleTheme: () => void;

  xp: string;
  level: number;
  streak: number;
  lastActiveDate: string | null;
  achievements: Achievement[];

  addXP: (amount: number) => void;
  updateStreak: () => void;
  unlockAchievement: (id: string) => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
}

export const Colors = {
    light: {
      background: '#F8F9FA',
      card: '#FFFFFF',
      text: '#1A1A1A',
      subText: '#888888',
      primary: '#4CAF50',
      accent: '#2196F3',
      border: '#EFEFEF',
    },
    dark: {
      background: '#121212',
      card: '#1E1E1E',
      text: '#FFFFFF',
      subText: '#AAAAAA',
      primary: '#81C784',
      accent: '#64B5F6',
      border: '#333333',
    }
};

//Initial list of achievements
const initialAchievements: Achievement[] = [
  { id: '1', title: 'Water Mage', description: 'Drink your water intake for 3 days in a row', icon: 'droplet', isUnlocked: false },
  {id: '2', title: 'Calorie Sniper', description: 'Hit the calorie target (+/- 50 kcal)', icon: 'target', isUnlocked: false},
  { id: '3', title: 'Paparazzi', description: 'Photograph 10 dishes using AI', icon: 'camera', isUnlocked: false },
]

export const useUserStore = create<UserState>((set) => ({
  fullName: '',
  weight: 0,
  height: 0,
  dailyCalories: 0,
  dailyWater: 0,
  consumedCalories: 0,
  consumedWater: 0,
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: null,
  achievements: initialAchievements,

  setProfile: (data) => {
    const calories = Math.round(10 * data.weight + 6.25 * data.height - 125);
    const water = parseFloat((data.weight * 0.035).toFixed(1));

    set({
      ...data,
      dailyCalories: calories,
      dailyWater: water,
    });
  },

  addCalories: (amount) =>
    set((state) => ({ consumedCalories: state.consumedCalories + amount })),

  addWater: (amount) =>
    set((state) => ({ consumedWater: state.consumedWater + amount })),

  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

  addXP: (amount) => set((state) => {
    const newXP = state.xp + amount;
    const nextLevelXP = state.level + 1000; //Level every 1000 XP
    if (newXP >= nextLevelXP) {
      return {xp: newXP - nextLevelXP, level: state.level + 1};
    }
    return {xp: newXP};
  }),
  
  updateStreak: () => set((state) => {
    const today = new Date().toDateString();
    if (state.lastActiveDate === today) return false; //If already visited today

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
  })
}));