import { create } from 'zustand';

type ThemeMode = 'light' | 'dark';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
}

interface UserState {
  fullName: string;
  weight: number;
  height: number;
  dailyCalories: number;
  dailyWater: number;
  consumedCalories: number;
  consumedWater: number;

  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string | null;
  achievements: Achievement[];

  setProfile: (data: { fullName: string; weight: number; height: number }) => void;
  addCalories: (amount: number) => void;
  addWater: (amount: number) => void;

  theme: ThemeMode;
  toggleTheme: () => void;

  addXP: (amount: number) => void;
  updateStreak: () => void;
  unlockAchievement: (id: string) => void;

  newlyUnlockedAchievement: Achievement | null;

  closeCongratulation: () => void;

  consumed: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  targets: {
    calories: number;
    protein: number; // ~1.6g per kg of body weight
    fat: number; // ~1g per kg of body weight
    carbs: number; // remainder
  };
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
  { id: '1', title: 'Water Mage', description: 'Drink water 3 days in a row', icon: 'droplet', isUnlocked: false },
  { id: '2', title: 'Calorie Sniper', description: 'Hit calorie target', icon: 'target', isUnlocked: false },
  { id: '3', title: 'Paparazzi', description: 'Scan 10 meals', icon: 'camera', isUnlocked: false },
];

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
    const protein = Math.round(data.weight * 1.6);
    const fat = Math.round(data.weight * 1.0);
    const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);

    set({
      ...data,
      dailyCalories: calories,
      dailyWater: water,
    });
  },

  addCalories: (amount) =>
    set((state) => ({
      consumedCalories: state.consumedCalories + amount
    })),

  addWater: (amount) =>
    set((state) => ({
      consumedWater: state.consumedWater + amount,
      consumed: {
        ...state.consumed,
        calories: state.consumed.calories + amount,
      }
    })),

  theme: 'light',
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light'
    })),

  addXP: (amount) =>
    set((state) => {
      const newXP = state.xp + amount;
      const levelUpXP = 1000;//Level every 1000 XP

      if (newXP >= levelUpXP) {
        return {
          xp: newXP - levelUpXP,
          level: state.level + 1
        };
      }

      return { xp: newXP };
    }),

  updateStreak: () =>
    set((state) => {
      const today = new Date().toDateString();

      if (state.lastActiveDate === today) {
        return {};  //If already visited today
      }

      //If logged in yesterday, we increase the streak; if not, we reset it.
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const isConsecutive =
        state.lastActiveDate === yesterday.toDateString();

      return {
        streak: isConsecutive ? state.streak + 1 : 1,
        lastActiveDate: today
      };
    }),

  unlockAchievement: (id) =>
    set((state) => ({
      achievements: state.achievements.map(a =>
        a.id === id ? { ...a, isUnlocked: true } : a
      )
    })),

  newlyUnlockedAchievement: null,

  closeCongratulation: () =>
    set(() => ({
      newlyUnlockedAchievement: null
    })),

  consumed: { calories: 0, protein: 0, fat: 0, carbs: 0 },
  targets: { calories: 2200, protein: 140, fat: 75, carbs: 240 },
}));