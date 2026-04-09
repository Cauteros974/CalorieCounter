import { useUserStore } from "@/store/useUserStore";

export default function HomeScreen() {
    const { fullName, dailyCalories, consumedCalories, dailyWater, consumedWater, addWater } = useUserStore();
    
    const calProgress = Math.min(consumedCalories / dailyCalories, 1) || 0;
    const waterProgress = Math.min(consumedWater / dailyWater, 1) || 0;
}