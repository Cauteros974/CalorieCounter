import { Colors, useUserStore } from '../store/useUserStore';

export default function PlanScreen() {
    const {theme} = useUserStore();
    const currentColors = Colors[theme];
}