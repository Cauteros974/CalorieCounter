import { create } from 'zustand';
interface UserState{
    fullName: string;
    weight: number;
    height: number;
    dailyCalories: number;
    dailyWeight: number;   
    dailyWater: number;
    setProfile: (data: { fullName: string; weight: number; height: number }) => void;
}

export const useUserStore = create<UserState> ((state) => ({
    fullName: '',
    weight: 0,
    height: 0,
    dailyCalories: 0,
    dailyWater: 0,
}))