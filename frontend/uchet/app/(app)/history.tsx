import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  Button,
  TouchableOpacity,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';

type HistoryItem = {
  id: string;
  user: string;
  itemName: string;
  amount: number;
  timestamp: string;
  action: 'add' | 'remove' | 'create' | 'delete';
  storageId: string;
};

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filtered, setFiltered] = useState<HistoryItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [storageId, setStorageId] = useState('');
  const [user, setUser] = useState('');
  const [itemName, setItemName] = useState('');

  const [storageOptions, setStorageOptions] = useState<string[]>([]);
  const [userOptions, setUserOptions] = useState<string[]>([]);
  const [itemOptions, setItemOptions] = useState<string[]>([]);

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadHistory(); // Загружаем при фокусе
    }, [])
  );

  const loadHistory = async () => {
    const json = await AsyncStorage.getItem('history');
    if (json) {
      const parsed: HistoryItem[] = JSON.parse(json);
      setHistory(parsed);
      setFiltered(parsed);

      // Заполняем фильтры
      const unique = (arr: string[]) => [...new Set(arr)];
      setStorageOptions(unique(parsed.map(i => i.storageId)));
      setUserOptions(unique(parsed.map(i => i.user)));
      setItemOptions(unique(parsed.map(i => i.itemName)));
    }
  };

  const applyFilters = () => {
    const result = history.filter((item) => {
      const itemDate = new Date(item.timestamp);
      return (
        (!storageId || item.storageId === storageId) &&
        (!user || item.user === user) &&
        (!itemName || item.itemName === itemName) &&
        (!fromDate || itemDate >= fromDate) &&
        (!toDate || itemDate <= toDate)
      );
    });
    setFiltered(result);
    setModalVisible(false);
  };

  const clearFilters = () => {
    setStorageId('');
    setUser('');
    setItemName('');
    setFromDate(null);
    setToDate(null);
    setFiltered(history);
    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.item}>
      <Text style={styles.title}>
        {item.user} {item.action === 'add' && 'добавил'}{item.action === 'remove' && 'убрал'}
        {item.action === 'create' && 'создал'}{item.action === 'delete' && 'удалил'} {item.amount} шт.
        в <Text style={{ fontWeight: 'bold' }}>{item.storageId}</Text>
      </Text>
      <Text style={styles.subtitle}>
        {item.itemName} — {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>История изменений</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.filterButton}>
          <Text style={styles.filterText}>Фильтр</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      {/* Модалка фильтра */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Фильтры</Text>

          <Picker
            selectedValue={storageId}
            onValueChange={setStorageId}
            style={styles.picker}
          >
            <Picker.Item label="Все хранилища" value="" />
            {storageOptions.map((id) => (
              <Picker.Item key={id} label={id} value={id} />
            ))}
          </Picker>

          <Picker
            selectedValue={user}
            onValueChange={setUser}
            style={styles.picker}
          >
            <Picker.Item label="Все пользователи" value="" />
            {userOptions.map((u) => (
              <Picker.Item key={u} label={u} value={u} />
            ))}
          </Picker>

          <Picker
            selectedValue={itemName}
            onValueChange={setItemName}
            style={styles.picker}
          >
            <Picker.Item label="Все предметы" value="" />
            {itemOptions.map((item) => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
          </Picker>

          <View style={styles.dateRow}>
            <TouchableOpacity onPress={() => setShowFromPicker(true)} style={styles.dateButton}>
              <Text>От: {fromDate ? fromDate.toLocaleDateString() : '—'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowToPicker(true)} style={styles.dateButton}>
              <Text>До: {toDate ? toDate.toLocaleDateString() : '—'}</Text>
            </TouchableOpacity>
          </View>

          {showFromPicker && (
            <DateTimePicker
              value={fromDate || new Date()}
              mode="date"
              display="default"
              onChange={(_, selectedDate) => {
                setShowFromPicker(false);
                if (selectedDate) setFromDate(selectedDate);
              }}
            />
          )}
          {showToPicker && (
            <DateTimePicker
              value={toDate || new Date()}
              mode="date"
              display="default"
              onChange={(_, selectedDate) => {
                setShowToPicker(false);
                if (selectedDate) setToDate(selectedDate);
              }}
            />
          )}

          <View style={styles.modalButtons}>
            <Button title="Применить" onPress={applyFilters} />
            <Button title="Сбросить" onPress={clearFilters} color="gray" />
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 40,
  },
  list: {
    paddingBottom: 20,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    color: '#666',
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  filterButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 8,
  },
  filterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modal: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  picker: {
    backgroundColor: '#f2f2f2',
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  dateButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  modalButtons: {
    marginTop: 20,
    gap: 10,
  },
});
