import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import FloatingButton from '../../shared/Button/FloatingButton';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [storages, setStorages] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newStorageName, setNewStorageName] = useState('');
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);
  const inputRef = useRef<TextInput>(null);
  const router = useRouter();

  useEffect(() => {
    loadStorages();
  }, []);

  useEffect(() => {
    if (modalVisible) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [modalVisible]);

  const loadStorages = async () => {
    const data = await AsyncStorage.getItem('storages');
    if (data) setStorages(JSON.parse(data));
    else setStorages([]);
  };

  const saveStorages = async (newList: string[]) => {
    setStorages(newList);
    await AsyncStorage.setItem('storages', JSON.stringify(newList));
  };

  const addStorage = async () => {
    const trimmed = newStorageName.trim();
    if (!trimmed || storages.includes(trimmed)) return;

    const updated = [...storages, trimmed];
    await saveStorages(updated);
    setNewStorageName('');
    setModalVisible(false);
  };

  const deleteStorage = async (index: number) => {
    const name = storages[index];
    const updated = storages.filter((_, i) => i !== index);
    await saveStorages(updated);
    await AsyncStorage.removeItem(`items:${name}`); // удалить связанные предметы
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      style={styles.storageBox}
      onPress={() => router.push(`/${encodeURIComponent(item)}`)}
    >
      <Text style={styles.storageText}>{item}</Text>
      <TouchableOpacity onPress={() => setConfirmDeleteIndex(index)}>
        <Ionicons name="trash-outline" size={22} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={storages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Добавление хранилища */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Новое хранилище</Text>
            <TextInput
              ref={inputRef}
              placeholder="Введите название"
              value={newStorageName}
              onChangeText={setNewStorageName}
              style={styles.input}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancel} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#fff' }}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.create} onPress={addStorage}>
                <Text style={{ color: '#fff' }}>Создать</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Подтверждение удаления */}
      <Modal
        visible={confirmDeleteIndex !== null}
        animationType="fade"
        transparent
        onRequestClose={() => setConfirmDeleteIndex(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Удалить хранилище?</Text>
            <Text style={{ marginBottom: 20 }}>Все предметы внутри будут удалены.</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancel}
                onPress={() => setConfirmDeleteIndex(null)}
              >
                <Text style={{ color: '#fff' }}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.create}
                onPress={async () => {
                  if (confirmDeleteIndex !== null) {
                    await deleteStorage(confirmDeleteIndex);
                    setConfirmDeleteIndex(null);
                    loadStorages();
                  }
                }}
              >
                <Text style={{ color: '#fff' }}>Удалить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FloatingButton onPress={() => setModalVisible(true)} />
    </View>
  );
}

const styles = StyleSheet.create({
  storageBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ddeeff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  storageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 12,
    paddingVertical: 6,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancel: {
    backgroundColor: '#999',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  create: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
});
