import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export default  function App() {
  return(
    <NavigationContainer>
      <Tab.Navigator screenOptions={{
        headerShown: false,
      }}>

      </Tab.Navigator>
    </NavigationContainer>
  )
}