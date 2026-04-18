import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform } from 'react-native'; // Добавляем проверку платформы

import AchievementPopup from '@/components/AchievementPopu';
import AchievementsScreen from '@/screens/AchievementsScreen';
import HomeScreen from '@/screens/HomeScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import StatisticsScreen from '@/screens/StatisticsScreen';

import { requestPermissions } from '@/services/notificationService';
import { Colors, useUserStore } from '@/store/useUserStore';
import { ChartColumn, Home, Trophy, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export default function App() {
  const { theme } = useUserStore();
  const currentColors = Colors[theme];

  useEffect(() => {
    if (Platform.OS !== 'web') {
      requestPermissions();
    }
  }, []);

  return (
    <>
      <AchievementPopup />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

      <Tab.Navigator screenOptions={{
        headerShown: false,
        tabBarStyle: { 
          height: 90, 
          paddingTop: 10,
          backgroundColor: currentColors.card,
          borderTopColor: currentColors.border 
        },
        tabBarActiveTintColor: currentColors.primary,
        tabBarInactiveTintColor: currentColors.subText,
      }}>
        <Tab.Screen 
          name='Home'
          component={HomeScreen}
          options={{ 
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => <Home color={color} size={24} /> 
          }}
        />
        <Tab.Screen
          name='Graph'
          component={StatisticsScreen}
          options={{ 
            tabBarLabel: 'Statistics',
            tabBarIcon: ({ color }) => <ChartColumn color={color} size={24} /> 
          }}
        />
        <Tab.Screen
          name='Achive'
          component={AchievementsScreen}
          options={{ 
            tabBarLabel: 'Awards',
            tabBarIcon: ({ color }) => <Trophy color={color} size={24} /> 
          }}
        />
        <Tab.Screen 
          name='Profile'
          component={ProfileScreen}
          options={{ 
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color }) => <User color={color} size={24} /> 
          }}
        />
      </Tab.Navigator>
    </>
  );
}