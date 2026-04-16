import AchievementsScreen from '@/screens/AchievementsScreen';
import HomeScreen from '@/screens/HomeScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import StatisticsScreen from '@/screens/StatisticsScreen';
import { requestPermissions } from '@/services/notificationService';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ChartColumn, Home, Trophy, User } from 'lucide-react-native';
import { useEffect } from 'react';

const Tab = createBottomTabNavigator();

export default  function App() {

  useEffect(() => {
    requestPermissions();
  }, []);


  return(
      <Tab.Navigator screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 90, paddingTop: 10 },
        tabBarActiveTintColor: '#4CAF50'
      }}>
        <Tab.Screen 
          name='Home'
          component={HomeScreen}
          options={{ tabBarIcon: ({ color }) => <Home color={color} size={24} /> }}
        />
        
        <Tab.Screen 
          name='Profile'
          component={ProfileScreen}
          options={{ tabBarIcon: ({ color }) => <User color={color} size={24} /> }}
        />

        <Tab.Screen
          name='Graph'
          component={StatisticsScreen}
          options={{ tabBarIcon: ({ color }) => <ChartColumn color={color} size={24} /> }}
        />

        <Tab.Screen
          name='Achive'
          component={AchievementsScreen}
          options={{ tabBarIcon: ({ color }) => <Trophy color={color} size={24} /> }}
        />
      </Tab.Navigator>
  )
}