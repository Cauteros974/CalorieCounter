import AchievementPopup from '@/components/AchievementPopu';
import { requestPermissions } from '@/services/notificationService';
import { Colors, useUserStore } from '@/store/useUserStore';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChartColumn, Home, Trophy, User } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';

export default function TabsLayout() {
  const { theme } = useUserStore();
  const currentColors = Colors[theme || 'light'];

  useEffect(() => {
    if (Platform.OS !== 'web') {
      requestPermissions();
    }
  }, []);

  return (
    <>
      <AchievementPopup />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: currentColors.primary,
          tabBarInactiveTintColor: currentColors.subText,
          tabBarStyle: {
            height: 90,
            paddingTop: 10,
            backgroundColor: currentColors.card,
            borderTopColor: currentColors.border,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Home color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="statistics"
          options={{
            title: 'Statistics',
            tabBarIcon: ({ color }) => <ChartColumn color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="achievements"
          options={{
            title: 'Awards',
            tabBarIcon: ({ color }) => <Trophy color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <User color={color} size={24} />,
          }}
        />
      </Tabs>
    </>
  );
}
