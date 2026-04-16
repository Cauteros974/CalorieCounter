import { Colors, useUserStore } from "@/store/useUserStore";

export default function AchievementsScreen() {
    const {achievements, level, xp, streak, theme} = useUserStore();
    const currentColors = Colors[theme];
}