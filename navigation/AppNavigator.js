import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UploadScreen from '../screens/UploadScreen';
import MessagesScreen from '../screens/MessagesScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DashboardScreen from '../screens/DashboardScreen';
import { Ionicons } from '@expo/vector-icons';
import QuazarIcon from '../assets/quazarLogo.svg'

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === 'QUAZAR') {
            return (
              <View
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: '#133B7B',
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: -16,
                }}
              >
         <QuazarIcon
  width={50}
  height={50}
  style={{
    transform: [{ translateY: 2 }, { translateX: 3 }],
  }}
/>

              </View>
            );
          }

          let iconName;

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Messages') {
            iconName = 'chatbubble-outline';
          } else if (route.name === 'Notifications') {
            iconName = 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen
        name="QUAZAR"
        component={UploadScreen}
        options={{
          tabBarLabel: () => null, // Hide label under logo
        }}
      />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
