import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import FloatingButton from '../../shared/Button/FloatingButton';
import { Ionicons } from '@expo/vector-icons';



export default function StorageDetailScreen() {
  const { storageId } = useLocalSearchParams<{ storageId: string }>();
  const [items, setItems] = useState<{ name: string; quantity: number }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);
  const inputRef = useRef<TextInput>(null);

  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [actionType, setActionType] = useState<'add' | 'subtract' | null>(null);
  const [adjustQuantity, setAdjustQuantity] = useState('');

  useEffect(() => {
    if (storageId) {
      
      loadItems();
    }
  }, [storageId]);

  useEffect(() => {
    if (modalVisible) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [modalVisible]);

  const getStorageKey = () => `items:${storageId}`;

  const loadItems = async () => {
    const key = getStorageKey();
    const data = await AsyncStorage.getItem(key);
    if (data) {
      try {
        setItems(JSON.parse(data));
      } catch {
        setItems([]);
      }
    } else {
      setItems([]);
    }
  };

  const saveItems = async (newItems: typeof items) => {
    const key = getStorageKey();
    setItems(newItems);
    await AsyncStorage.setItem(key, JSON.stringify(newItems));
  };

  const addItem = async () => {
    const trimmed = newItem.trim();
    const qty = parseInt(quantity);
    if (!trimmed || isNaN(qty) || qty <= 0) return;

    const updatedItems = [...items, { name: trimmed, quantity: qty }];
    await saveItems(updatedItems);
    setNewItem('');
    setQuantity('1');
    setModalVisible(false);
  };

  const renderItem = ({ item, index }: { item: { name: string; quantity: number }; index: number }) => (
    <TouchableOpacity
      style={styles.itemRow}
      onPress={() => setSelectedItemIndex(index)}
    >
      <Text style={styles.itemText}>{item.name} (x{item.quantity})</Text>
      <TouchableOpacity
        onPress={(event) => {
          event.stopPropagation();
          setConfirmDeleteIndex(index);
        }}
      >
        <Ionicons name="trash-outline" size={22} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={items}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Добавить предмет */}
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
            <Text style={styles.modalTitle}>Добавить предмет</Text>
            <TextInput
              ref={inputRef}
              placeholder="Название предмета"
              value={newItem}
              onChangeText={setNewItem}
              style={styles.input}
            />
            <TextInput
              placeholder="Количество"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancel} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#fff' }}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.create} onPress={addItem}>
                <Text style={{ color: '#fff' }}>Добавить</Text>
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
            <Text style={styles.modalTitle}>Удалить предмет?</Text>
            <Text style={{ marginBottom: 20 }}>Это действие нельзя отменить.</Text>
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
                    const updated = items.filter((_, i) => i !== confirmDeleteIndex);
                    await saveItems(updated);
                    setConfirmDeleteIndex(null);
                  }
                }}
              >
                <Text style={{ color: '#fff' }}>Удалить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <Modal
        visible={selectedItemIndex !== null && actionType === null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedItemIndex(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Что сделать с предметом?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.create}
                onPress={() => setActionType('add')}
              >
                <Text style={{ color: '#fff' }}>Добавить</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancel}
                onPress={() => setActionType('subtract')}
              >
                <Text style={{ color: '#fff' }}>Уменьшить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={selectedItemIndex !== null && actionType !== null}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setSelectedItemIndex(null);
          setActionType(null);
          setAdjustQuantity('');
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {actionType === 'add' ? 'Добавить' : 'Уменьшить'} количество
            </Text>
            <TextInput
              placeholder="Количество"
              value={adjustQuantity}
              onChangeText={setAdjustQuantity}
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancel}
                onPress={() => {
                  setSelectedItemIndex(null);
                  setActionType(null);
                  setAdjustQuantity('');
                }}
              >
                <Text style={{ color: '#fff' }}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.create}
                onPress={async () => {
                  const delta = parseInt(adjustQuantity);
                  if (isNaN(delta) || delta <= 0 || selectedItemIndex === null) return;

                  const updated = [...items];
                  const current = updated[selectedItemIndex];
                  let newQty =
                    actionType === 'add'
                      ? current.quantity + delta
                      : current.quantity - delta;

                  newQty = Math.max(0, newQty);
                  updated[selectedItemIndex] = { ...current, quantity: newQty };
                  await saveItems(updated);
                  setSelectedItemIndex(null);
                  setActionType(null);
                  setAdjustQuantity('');
                }}
              >
                <Text style={{ color: '#fff' }}>Применить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <FloatingButton onPress={() => setModalVisible(true)} />
    </View>
  );
}

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f6f6f6',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
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
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
});
