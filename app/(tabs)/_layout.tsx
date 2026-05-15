import { Colors, useUserStore } from '@/store/useUserStore';
import { Tabs } from 'expo-router';
import { Home, User } from 'lucide-react-native';
import React from 'react';

export default function TabsLayout() {
  const { theme } = useUserStore();
  const currentColors = Colors[theme || 'light'];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: currentColors.primary,
        tabBarStyle: {
          height: 90,
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
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
     
    </Tabs>
  );
}