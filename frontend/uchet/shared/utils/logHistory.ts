import AsyncStorage from '@react-native-async-storage/async-storage';

export type LogAction = 'add' | 'remove' | 'create' | 'delete';

export type LogEntry = {
  id: string;
  user: string;
  itemName: string;
  amount: number;
  timestamp: string;
  action: LogAction;
  storageId: string;
};

// Генерация ID без uuid
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const logHistory = async (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
  const newEntry: LogEntry = {
    ...entry,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };

  try {
    const existing = await AsyncStorage.getItem('history');
    const parsed: LogEntry[] = existing ? JSON.parse(existing) : [];
    parsed.unshift(newEntry); // добавляем в начало
    await AsyncStorage.setItem('history', JSON.stringify(parsed));
  } catch (e) {
    console.error('Ошибка при логировании:', e);
  }
};
