import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router"; // Import router
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Define an array of habits with all necessary information
const HEALTH_HABITS = [
  {
    id: 1,
    emoji: '💊',
    title: 'Take Vitamins',
    subtitle: 'Fuel your body with essentials',
    backgroundColor: '#FEF3C7'
  },
  {
    id: 2,
    emoji: '🦷',
    title: 'Floss Teeth',
    subtitle: 'Keep your smile shining',
    backgroundColor: '#DBEAFE'
  },
  {
    id: 3,
    emoji: '😴',
    title: '7h Sleep',
    subtitle: 'Rest and recharge fully',
    backgroundColor: '#EDE9FE'
  },
  {
    id: 4,
    emoji: '💧',
    title: 'Morning Water',
    subtitle: 'Hydrate to kickstart your day',
    backgroundColor: '#DEF7EC'
  },
  {
    id: 5,
    emoji: '🥗',
    title: 'Balanced Meals',
    subtitle: 'Nourish your body mindfully',
    backgroundColor: '#FEE2E2'
  },
  {
    id: 6,
    emoji: '✨',
    title: 'Skin Care',
    subtitle: 'Glow inside and out',
    backgroundColor: '#FEF3C7'
  }
];

// Define the type for a habit
type Habit = {
  id: number;
  emoji: string;
  title: string;
  subtitle: string;
  backgroundColor: string;
};

const HealthHabitItem = ({ habit, onPress }: { habit: Habit; onPress: () => void }) => (
  <TouchableOpacity 
    style={styles.habitItem}
    onPress={onPress}
  >
    <View style={[styles.habitIconContainer, { backgroundColor: habit.backgroundColor }]}>
      <Text style={styles.habitEmoji}>{habit.emoji}</Text>
    </View>
    <View style={styles.habitTextContainer}>
      <Text style={styles.habitTitle}>{habit.title}</Text>
      <Text style={styles.habitSubtitle}>{habit.subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={24} color="gray" />
  </TouchableOpacity>
);

export default function HealthScreen() { 
const router = useRouter(); // Initialize router

  const handleCreateCustomHabit = () => {
    // Implement custom habit creation logic
    console.log('Create custom habit pressed');
  };

  return (
    <SafeAreaProvider >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Health</Text>
          <Text style={styles.headerSubtitle}>Take care of your body with these core habits</Text>
        </View>

        {HEALTH_HABITS.map((habit) => (
          <HealthHabitItem 
            key={habit.id}
            habit={habit}
            onPress={() => console.log(`Pressed ${habit.title}`)}
          />
        ))}

        <TouchableOpacity 
          style={styles.createHabitButton}
          onPress={() => router.push("(stack)/habit" as any)}
        >
          <Text style={styles.createHabitButtonText}>
            Create a custom habit
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6'
  },
  scrollView: {
    paddingHorizontal: 16,
    paddingTop: 24
  },
  headerContainer: {
    marginBottom: 24
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8
  },
  headerSubtitle: {
    color: '#6B7280',
    fontSize: 16
  },
  habitItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  habitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  habitEmoji: {
    fontSize: 24
  },
  habitTextContainer: {
    marginLeft: 16,
    flex: 1
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: '600'
  },
  habitSubtitle: {
    color: '#6B7280'
  },
  createHabitButton: {
    backgroundColor: 'black',
    borderRadius: 30,
    padding: 16,
    marginTop: 16,
    marginBottom: 32
  },
  createHabitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600'
  }
});