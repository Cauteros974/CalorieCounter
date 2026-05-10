import { useState } from "react";

const DEFAULT_REMINDERS = [
  {
    id: "1",
    title: "Morning water",
    desc: "Drink a glass of water after waking up",
    time: "8:00 AM",
    emoji: "💧",
  },
  {
    id: "2",
    title: "Breakfast",
    desc: "Dont skip the most important meal",
    time: "9:00 AM",
    emoji: "🍳",
  },
  {
    id: "3",
    title: "Lunch",
    desc: "Time to refuel",
    time: "1:00 PM",
    emoji: "🥗",
  },
  {
    id: "4",
    title: "Afternoon water",
    desc: "Stay hydrated",
    time: "3:00 PM",
    emoji: "💧",
  },
  {
    id: "5",
    title: "Dinner",
    desc: "Light dinner for better sleep",
    time: "7:00 PM",
    emoji: "🍽️",
  },
  {
    id: "6",
    title: "Daily summary",
    desc: "Check your progress for today",
    time: "9:00 PM",
    emoji: "📊",
  },
];

export default function RemindersScreen() {
  const [enanbled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(DEFAULT_REMINDERS.map((r) => [r.id, true])),
  );

  const togle = (id: string) => setEnabled(prev => ({...prev,[id]: !prev,[id]}));
}
