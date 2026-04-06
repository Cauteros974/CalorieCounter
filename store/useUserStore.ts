import {create} from 'zustand';
interface UserState{
    fullName: string;
    weight: number;
    height: number;
    dailyCalories: number;
    dailyWeight: number;   
    dailyWater: number;
    etProfile: (data: { fullName: string; weight: number; height: number }) => void;
}

export const useUserStore = create () => {

}