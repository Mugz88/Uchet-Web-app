import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Modal, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

type Storage = { name: string; capacity: number };

export default function NormsScreen() {
  const [storages, setStorages] = useState<Storage[]>([]);
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const [newCap, setNewCap] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const data = await AsyncStorage.getItem('storages');
    setStorages(data ? JSON.parse(data) : []);
  };

  const save = async (list: Storage[]) => {
    await AsyncStorage.setItem('storages', JSON.stringify(list));
    setStorages(list);
  };

  const renderItem = ({ item, index }: { item: Storage; index: number }) => (
    <TouchableOpacity style={styles.box} onPress={() => { setNewCap(item.capacity.toString()); setModalIdx(index); }}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.cap}>Вместимость: {item.capacity}</Text>
      <Ionicons name="pencil" size={20} color="#007bff" />
    </TouchableOpacity>
  );

  const apply = async () => {
    if (modalIdx === null) return;
    const parsed = parseFloat(newCap);
    if (isNaN(parsed) || parsed <= 0) return;
    const list = [...storages];
    list[modalIdx].capacity = parsed;
    await save(list);
    setModalIdx(null);
    setNewCap('');
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList data={storages} keyExtractor={(_,i)=>i.toString()} renderItem={renderItem} />
      <Modal visible={modalIdx !== null} transparent animationType="slide" onRequestClose={()=>setModalIdx(null)}>
        <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':undefined} style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>Изменить вместимость</Text>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={newCap}
              onChangeText={setNewCap}
              keyboardType="numeric"
              placeholder="Введите число"
            />
            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancel} onPress={()=>{setModalIdx(null); setNewCap('');}}><Text style={{color:'#fff'}}>Отмена</Text></TouchableOpacity>
              <TouchableOpacity style={styles.save} onPress={apply}><Text style={{color:'#fff'}}>Сохранить</Text></TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection:'row', justifyContent:'space-between', padding:16, backgroundColor:'#eef', borderRadius:8, marginBottom:10, alignItems:'center' },
  name:{ fontSize:16, fontWeight:'600' },
  cap:{ fontSize:14, color:'#555' },
  overlay:{ flex:1,backgroundColor:'#00000088',justifyContent:'center',alignItems:'center' },
  modal:{ width:'80%', backgroundColor:'#fff', borderRadius:8, padding:20 },
  title:{ fontSize:18, marginBottom:12, fontWeight:'600' },
  input:{ borderBottomWidth:1, paddingVertical:6, fontSize:16, marginBottom:16 },
  actions:{ flexDirection:'row', justifyContent:'flex-end', gap:12 },
  cancel:{ backgroundColor:'#999', padding:10, borderRadius:6 },
  save:{ backgroundColor:'#28a745', padding:10, borderRadius:6 },
});
