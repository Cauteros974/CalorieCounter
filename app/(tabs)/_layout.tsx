import AchievementPopup from '@/components/AchievementPopu';
import { requestPermissions } from '@/services/notificationService';
import { Colors, useUserStore } from '@/store/useUserStore';
import { Tabs, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BarChart3, Home, LayoutGrid, Trophy, User, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TabsLayout() {
  const { theme } = useUserStore();
  const currentColors = Colors[theme || 'light'];
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS !== 'web') {
      requestPermissions();
    }
  }, []);

  // Компонент модального меню
  const QuickMenu = () => (
    <Modal visible={menuVisible} transparent animationType="slide">
      <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
        <View style={[styles.menuContainer, { backgroundColor: currentColors.card }]}>
          <Text style={[styles.menuTitle, { color: currentColors.text }]}>Progress & Insights</Text>
          
          <View style={styles.menuRow}>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => { setMenuVisible(false); router.push('/achievements'); }}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#FFF8E1' }]}>
                <Trophy color="#FFC107" size={30} />
              </View>
              <Text style={[styles.menuLabel, { color: currentColors.text }]}>Awards</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={() => setMenuVisible(false)}>
            <X color="#FFF" size={24} />
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <>
      <AchievementPopup />
      <QuickMenu />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: currentColors.primary,
          tabBarInactiveTintColor: currentColors.subText,
          tabBarStyle: {
            height: 90,
            backgroundColor: currentColors.card,
            borderTopColor: currentColors.border,
            paddingBottom: 20,
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

        {/* Новая вкладка План (может называться plan или album) */}
        <Tabs.Screen
          name="plan" 
          options={{
            title: 'Plan',
            tabBarIcon: ({ color }) => <LayoutGrid color={color} size={24} />,
          }}
        />

        {/* Центральная кнопка - Прогресс */}
        <Tabs.Screen
          name="progress-modal"
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setMenuVisible(true);
            },
          }}
          options={{
            title: '',
            tabBarIcon: () => (
              <View style={styles.bigButton}>
                <BarChart3 color="#FFF" size={28} />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <User color={color} size={24} />,
          }}
        />

        {/* Скрываем старые вкладки из нижнего бара, но оставляем их в роутинге */}
        <Tabs.Screen name="statistics" options={{ href: null }} />
        <Tabs.Screen name="achievements" options={{ href: null }} />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  bigButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10, // Чтобы кнопка чуть выступала вверх
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'flex-end' 
  },
  menuContainer: { 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 30, 
    alignItems: 'center',
    paddingBottom: 50
  },
  menuTitle: { fontSize: 20, fontWeight: '800', marginBottom: 25 },
  menuRow: { flexDirection: 'row', gap: 40, marginBottom: 30 },
  menuItem: { alignItems: 'center' },
  iconCircle: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  menuLabel: { fontWeight: '700' },
  closeBtn: { 
    backgroundColor: '#1A1A1A', 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }
});