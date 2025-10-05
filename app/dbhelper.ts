// db.ts
import * as SQLite from 'expo-sqlite';
import { format } from 'date-fns';

let db: SQLite.SQLiteDatabase | null = null;

export const initDb = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('habits.db');
  }
  return db;
};

export const createTables = async () => {
  const db = await initDb();
await db.execAsync(`DROP TABLE IF EXISTS habit_logs`);
  await db.execAsync(`DROP TABLE IF EXISTS habit_frequencies`);
  await db.execAsync(`DROP TABLE IF EXISTS habits`);


  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      emoji TEXT,
      reminderEnabled INTEGER,
      startDate TEXT
    )
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS habit_frequencies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habitId INTEGER,
      day TEXT,
      FOREIGN KEY (habitId) REFERENCES habits(id) ON DELETE CASCADE
    )
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS habit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habitId INTEGER,
      date TEXT,
      isDone INTEGER,
      FOREIGN KEY (habitId) REFERENCES habits(id) ON DELETE CASCADE
    )
  `);
};


export const insertOrUpdateHabit = async (habit: {
  HabitId: number;
  HabitName: string;
  Emoji: string;
  StartDate: string;
  ReminderTime: string; // Not used yet
  IsReminderEnabled: boolean;
}) => {
  const db = await initDb();

  const { HabitName, Emoji, StartDate, IsReminderEnabled } = habit;

  const result = await db.runAsync(
    `INSERT INTO habits (name, emoji, reminderEnabled, startDate) VALUES (?, ?, ?, ?)`,
    [HabitName, Emoji, IsReminderEnabled ? 1 : 0, StartDate]
  );

  return result.lastInsertRowId;
};

export const insertHabitFrequency = async (habitId: number, selectedDays: string[]) => {
  const db = await initDb();

  for (const day of selectedDays) {
    await db.runAsync(
      `INSERT INTO habit_frequencies (habitId, day) VALUES (?, ?)`,
      [habitId, day]
    );
  }
};

type Habit = {
  id: number;
  name: string;
  emoji: string;
  days: string;
  reminderEnabled: number;
  startDate: string;
};


export const getHabitsWithStreak = async (): Promise<any[]> => {
  const db = await initDb();
  const today = format(new Date(), 'yyyy-MM-dd');

  const rawHabits: Habit[] = await db.getAllAsync(`SELECT * FROM habits`);
  if (!rawHabits) return [];

  const result: any[] = [];

  for (const habit of rawHabits) {
    const streakRow = await db.getFirstAsync(
      `SELECT COUNT(*) as streak FROM habit_logs WHERE habitId = ? AND isDone = 1`,
      [habit.id]
    ) as { streak: number };

    const todayRow = await db.getFirstAsync(
      `SELECT isDone FROM habit_logs WHERE habitId = ? AND date = ?`,
      [habit.id, today]
    ) as { isDone: number } | undefined;

    const days = await db.getFirstAsync(
      `SELECT COUNT(*) as day FROM habit_frequencies WHERE habitId = ?`,
      [habit.id]
    ) as { day: number };

    const frequencyString = days?.day == 7 ? 'Daily' : `${days?.day}x / times a week`;
    console.log(`days: ${days.day}, Frequency: ${frequencyString}`);
    result.push({
      id: habit.id,
      name: habit.name,
      icon: habit.emoji,
      frequency: frequencyString,
      streak: streakRow?.streak || 0,
      isDoneToday: todayRow?.isDone ?? 0
    });
  }

  return result;
};
