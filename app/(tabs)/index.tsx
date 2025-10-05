import { AddStreak } from '@/components/BottomSheet';
import React, { useEffect, useState } from 'react';
import { createTables, getHabitsWithStreak } from '../dbhelper';

import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Button } from 'react-native';
import { useRouter } from "expo-router"; // Import router
//import { createTables } from '../dbhelper'; // Adjust path as needed
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function HomeScreen() {
  // Calendar data
  const router = useRouter(); // Initialize router

  const getWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Move to Sunday
  
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date.getDate(); // Only return the day number
    });
  };
  
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dates = getWeekDates();
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const [modalOpen,setmodalOpen] = useState(false);

  const getFormattedDate = () => {
    const date = new Date();
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long', // "Sunday"
      month: 'short',  // "Mar"
      day: 'numeric',  // "23"
      year: 'numeric'  // "2025"
    }).format(date).replace(',', ' -'); // Format properly
  };
  // var habits = [
  //   { id: 1, name: "No Smoking", streak: 55, icon: "❤️", frequency: "Daily" },
  //   { id: 2, name: "Meditate", streak: 55, icon: "🧘", frequency: "Daily" },
  // ];
  interface Habit {
  id: number;
  name: string;
  streak: number;
  icon: string;
  frequency: string;
}
  var data: Habit[] = [];
  const [habits, setHabits] = useState<Habit[]>(data);  
useEffect(() => {
  (async () => {
    debugger;
    try {
      await createTables();
    } catch (e) {
      console.log("Error initializing database:", e);
    }

    try {
      console.log("before Habits:", habits);
      data = await getHabitsWithStreak();
      setHabits(data);
      console.log("after Habits:", data);
      console.log("Habits fetched:", habits);
    } catch (e) {
      console.log("Error in get:", e);
    }
    
  })();
}, []);


  return (
    <SafeAreaProvider style={styles.container}>
      {/* Calendar Row */}


      <View style={styles.calendarContainer}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.dayColumn}>
            <Text style={styles.dayText}>{day}</Text>
            <View style={[
              styles.dateCircle,
              index === today && styles.todayCircle
            ]}>
              <Text style={[
                styles.dateText,
                index === today && styles.todayText
              ]}>
                {dates[index]}
              </Text>
            </View>
          </View>
        ))}
      </View>
      
      {/* Date display */}
      <Text style={styles.currentDate}>{getFormattedDate()}</Text>
      
      {/* Habits list */}
      <ScrollView style={styles.habitsContainer}>
        {habits.map(habit => (
          <View key={habit.id} style={styles.habitCard}>
            <View style={styles.habitLeft}>
              <Text style={styles.habitIcon}>{habit.icon}</Text>
              <View style={styles.habitInfo}>
                <Text style={styles.habitName}>{habit.name}</Text>
                <Text style={styles.habitFrequency}>{habit.frequency}</Text>
              </View>
            </View>
            <View style={styles.habitRight}>
              <Text style={styles.streakCount}>{habit.streak}</Text>
              <Text style={styles.fireEmoji}>🔥</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={{ flex: 1 }}>

      {/* Add button */}
        <TouchableOpacity           onPress={() => router.push("/(stack)/streak" as any)} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>{modalOpen && <AddStreak onclose={() => {
          setmodalOpen(false)
        }} />}

</View>

    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f5f0',
    paddingTop: 10,
  },
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayText: {
    fontSize: 12,
    marginBottom: 5,
    color: '#333',
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCircle: {
    backgroundColor: '#222',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
  },
  todayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  currentDate: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#222',
  },
  habitsContainer: {
    paddingHorizontal: 20,
  },
  habitCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  habitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  habitInfo: {
    flexDirection: 'column',
  },
  habitName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  habitFrequency: {
    fontSize: 16,
    color: '#888',
  },
  habitRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakCount: {
    fontSize: 28,
    fontWeight: 'bold',
    marginRight: 5,
    color: '#222',
  },
  fireEmoji: {
    fontSize: 24,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 32,
  },
});
