import { create } from 'zustand';
interface UserState{
    fullName: string;
    weight: number;
    height: number;
    dailyCalories: number;
    dailyWeight: number;   
    dailyWater: number;
    setProfile: (data: { fullName: string; weight: number; height: number }) => void;
    consumedCalories: number;
    consumedWater: number;
    addCalories: (amount: number) => void;
    addWater: (amount: number) => void;
}

export const useUserStore = create<UserState> ((set) => ({
    fullName: '',
    weight: 0,
    height: 0,
    dailyCalories: 0,
    dailyWater: 0,
    dailyWeight: 0,
    setProfile: (data) => {
        //We are using Mifflin-St. Geor Formula.
        //Calories: (10 * weight) + (6,25 * height) - (5 * age) + S.
        const calories = Math.round(10 * data.weight + 6.25 * data.height - 125);
        const water = parseFloat((data.weight * 0.035).toFixed(1));
        
        set({
            ...data,
            dailyCalories: calories,
            dailyWater: water,
        })
    },
    consumedCalories: 0,
    consumedWater: 0,
}));