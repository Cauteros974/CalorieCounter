import { Colors, useUserStore } from '../store/useUserStore';

export default function PlanScreen() {
    const {theme} = useUserStore();
    const currentColors = Colors[theme];

    const routines = [
        { id: '1', time: '08:30', title: 'Breakfast', desc: 'Oatmeal with berries + coffee', cals: '400 kcal' },
        { id: '2', time: '11:00', title: 'Snack', desc: 'A handful of almonds or an apple', cals: '150 kcal' },
        { id: '3', time: '13:30', title: 'Dinner', desc: 'Chicken breast with rice', cals: '650 kcal' },
        { id: '4', time: '19:00', title: 'Dinner', desc: 'Tuna salad', cals: '400 kcal' },
    ];
}