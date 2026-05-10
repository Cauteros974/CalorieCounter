import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(DEFAULT_REMINDERS.map((r) => [r.id, true])),
  );

  const togle = (id: string) =>
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  const allOn = Object.values(enabled).every(Boolean);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft color="#1A1A1A" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Reminders</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8FA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
});
