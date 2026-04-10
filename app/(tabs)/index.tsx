import HomeScreen from '@/screens/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Home } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export default  function App() {
  return(
    <NavigationContainer>
      <Tab.Navigator screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 90, paddingTop: 10 },
        tabBarActiveTintColor: '#4CAF50'
      }}>
        <Tab.Screen 
          name='Home'
          component={HomeScreen}
          options={{ tabBarIcon: ({ color }) => <Home color={color} size={24} /> }}
        >
          
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  )
}