import HomeScreen from '@/screens/HomeScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export default  function App() {
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
      </Tab.Navigator>
  )
}