import { router } from "expo-router";
import { ArrowLeft, Bell, BellOff } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            const newState = Object.fromEntries(
              DEFAULT_REMINDERS.map((r) => [r.id, !allOn]),
            );
            setEnabled(newState);
          }}
        >
          {allOn ? <BellOff color="#888" size={20} /> : <Bell color="#4CAF50" size={20} />}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: 50 }}
      >
        <Text style={styles.hint}>
          {Object.values(enabled).filter(Boolean).length} of {DEFAULT_REMINDERS.length} reminders active
        </Text>

         <View style={styles.listCard}>
          {DEFAULT_REMINDERS.map((reminder, i) => (
            <View
              key={reminder.id}
              style={[
                styles.row,
                i === DEFAULT_REMINDERS.length - 1 && {borderBottomWidth: 0}
              ]}
            >
              <View style={styles.emojiWrap}>
                <Text style={{ fontSize: 22 }}>{reminder.emoji}</Text>
              </View>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={[styles.reminderTitle, !enabled[reminder.id] && { color: '#BBB' }]}>
                    {reminder.title}
                  </Text>
                </View>
              </View>
            </View>
          ))}
         </View>
      </ScrollView>
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
  title: { fontSize: 18, fontWeight: "800", color: "#1A1A1A", },
  hint: { textAlign: 'center', fontSize: 13, color: '#888', marginBottom: 20 },
  listCard: {
    marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 24, overflow: 'hidden',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8,
  },
  row: {
    flexDirection:'row', alignItems: 'center', padding: 16, gap: 12,
    borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
  },
  emojiWrap: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8F8FA',
    alignItems: 'center', justifyContent: 'center'
  }
});
