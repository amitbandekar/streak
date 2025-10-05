import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { useRouter } from 'expo-router';
import { insertOrUpdateHabit, insertHabitFrequency} from '../dbhelper'; // Adjust path as needed
import { Snackbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function CreateHabitScreen() {
  const [habitName, setHabitName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [isEmojiModalVisible, setEmojiModalVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  const showSnackbar = () => setVisible(true);
  const hideSnackbar = () => setVisible(false);
  

  const handleCreateHabit = async () => {
    // Validate input
    if (!habitName.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    if (selectedDays.length === 0) {
      Alert.alert('Error', 'Please select at least one day');
      return;
    }

    try {
      // Prepare habit object
      const habitData = {
        HabitId: 0, // New habit
        HabitName: habitName,
        Emoji: selectedEmoji,
        StartDate: new Date().toISOString().split('T')[0], // Current date
        ReminderTime: new Date().getTime().toString(), // You might want to add time picker later
        IsReminderEnabled: reminderEnabled ? true : false
      };

      // Insert habit and get the new habit ID
      const habitId = await insertOrUpdateHabit(habitData);

      // Insert habit frequencies
      await insertHabitFrequency(habitId, selectedDays);

      // Show success message
      //Alert.alert('Success', 'Habit created successfully!');
      // Reset form
      showSnackbar();
      setTimeout(() => {
      hideSnackbar();
      router.replace('/');
      }, 2000);
      setHabitName('');
      setSelectedDays([]);
      setReminderEnabled(false);
      setSelectedEmoji('');

    } catch (error) {
      console.error('Error creating habit:', error);
      Alert.alert('Error', 'Failed to create habit. Please try again.');
    }
  };
  // Emoji categories and emojis
  const EMOJI_CATEGORIES = [
    { icon: '😀', category: 'Smileys' },
    { icon: '👤', category: 'People' },
    { icon: '🐾', category: 'Animals' },
    { icon: '✋', category: 'Hands' },
    { icon: '✈️', category: 'Travel' },
    { icon: '⚽', category: 'Sports' },
    { icon: '📦', category: 'Objects' },
    { icon: 'ℹ️', category: 'Symbols' },
    { icon: '🚩', category: 'Flags' }
  ];

  // Emojis to display
  const EMOJIS = [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', 
    '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗',
    // Add more emojis as needed
  ];

  const DAYS = [
    { key: 'Monday', value: 'M' },
    { key: 'Tuesday', value: 'T' },
    { key: 'Wednesday', value: 'W' },
    { key: 'Thursday', value: 'T' },
    { key: 'Friday', value: 'F' },
    { key: 'Saturday', value: 'S' },
    { key: 'Sunday', value: 'S' }
  ];

  const toggleDay = (day: string) => {
    setSelectedDays(prev => {
      const newSelectedDays = new Set(prev);
      if (newSelectedDays.has(day)) {
        newSelectedDays.delete(day);
      } else {
        newSelectedDays.add(day);
      }
      return Array.from(newSelectedDays);
    });
  };



  const openEmojiPicker = () => {
    setEmojiModalVisible(true);
  };

  const selectEmoji = (emoji: string) => {
    setSelectedEmoji(emoji);
    setEmojiModalVisible(false);
  };

  return (
    <SafeAreaProvider style={styles.container}>     
      <View style={styles.formContainer}>
        <Text style={styles.label}>Name</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={habitName}
            onChangeText={setHabitName}
            placeholder="Workout"
            placeholderTextColor="#6B7280"
          />
          <TouchableOpacity style={styles.addButton} onPress={openEmojiPicker}>
            <Text style={styles.emojiText}>
              {selectedEmoji || '+'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Frequency</Text>
        <Text style={styles.sublabel}>Choose at least 1 day</Text>
        <View style={styles.daysContainer}>
          {DAYS.map(({ key, value }) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.dayButton,
                selectedDays.includes(key) && styles.selectedDayButton
              ]}
              onPress={() => toggleDay(key)}
            >
              <Text style={[
                styles.dayText,
                selectedDays.includes(key) && styles.selectedDayText
              ]}>
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.reminderContainer}>
          <Text style={styles.label}>Reminder</Text>
          <TouchableOpacity 
            style={[
              styles.toggleSwitch,
              reminderEnabled && styles.toggleSwitchActive
            ]}
            onPress={() => setReminderEnabled(!reminderEnabled)}
          >
            <View style={[
              styles.toggleSwitchHandle,
              reminderEnabled && styles.toggleSwitchHandleActive
            ]} />
          </TouchableOpacity>
        </View>
      </View>

      <Snackbar
        style={{    marginBottom: 80, }} // Optional for visibility
        visible={visible}
        onDismiss={hideSnackbar}
        duration={2000}
         
        >
        Habit saved successfully!
      </Snackbar>
     
      <TouchableOpacity 
        style={styles.createButton}
        onPress={handleCreateHabit}>
        <Text style={styles.createButtonText}>Create habit</Text>
      </TouchableOpacity>

      {/* Emoji Picker Modal */}
      <Modal
        isVisible={isEmojiModalVisible}
        style={styles.emojiModal}
        onBackdropPress={() => setEmojiModalVisible(false)}
        backdropOpacity={0.5}
        backdropColor="black"
      >
        <View style={styles.emojiModalContent}>
          <View style={styles.modalHandle} />
          <Text style={styles.emojiModalTitle}>Select Emoji</Text>
          
          <View style={styles.emojiCategoriesContainer}>
            {EMOJI_CATEGORIES.map((category, index) => (
              <TouchableOpacity key={index} style={styles.emojiCategoryButton}>
                <Text style={styles.emojiCategoryText}>{category.icon}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView 
            contentContainerStyle={styles.emojiGridContainer}
            showsVerticalScrollIndicator={false}
          >
            {EMOJIS.map((emoji, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.emojiButton}
                onPress={() => selectEmoji(emoji)}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.emojiModalActions}>
            <TouchableOpacity style={styles.emojiModalActionButton}>
              <Ionicons name="refresh" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.emojiModalActionButton}
              onPress={() => selectEmoji(selectedEmoji)}
            >
              <Ionicons name="checkmark" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  formContainer: {
    padding: 16
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: 'black'
  },
  sublabel: {
    color: '#6B7280',
    marginBottom: 8
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    marginBottom: 16
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: 'black'
  },  
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectedDayButton: {
    backgroundColor: 'black'
  },
  dayText: {
    color: '#6B7280'
  },
  selectedDayText: {
    color: 'white'
  },
  reminderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    backgroundColor: '#E5E5E5',
    borderRadius: 14,
    justifyContent: 'center',
    padding: 2
  },
  toggleSwitchActive: {
    backgroundColor: '#008475'
  },
  toggleSwitchHandle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    alignSelf: 'flex-start'
  },
  toggleSwitchHandleActive: {
    alignSelf: 'flex-end'
  },
  createButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 30,
    alignItems: 'center'
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  
  addButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emojiText: {
    fontSize: 24
  },
  
  // Emoji Modal Styles
  emojiModal: {
    justifyContent: 'flex-end',
    margin: 0
  },
  emojiModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 20,
    height: '70%'
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E5E5',
    alignSelf: 'center',
    borderRadius: 2,
    marginBottom: 16
  },
  emojiModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16
  },
  emojiCategoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  emojiCategoryButton: {
    padding: 8
  },
  emojiCategoryText: {
    fontSize: 20
  },
  emojiGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  emojiButton: {
    padding: 10,
    margin: 5
  },
  emojiModalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16
  },
  emojiModalActionButton: {
    padding: 10
  }
});