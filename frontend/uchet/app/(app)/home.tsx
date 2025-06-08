import React, { useEffect, useState, useCallback  } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';
import { useAuth } from '../../entities/auth/AuthContext';
import { useFocusEffect } from '@react-navigation/native';


type StorageItem = {
  name: string;
  capacity: number; // Объём
};

type Item = {
  name: string;
  quantity: number;
  unitVolume?: number;
  totalVolume?: number;
};

type HistoryItem = {
  id: string;
  user: string;
  itemName: string;
  amount: number;
  timestamp: string;
  action: 'create' | 'add' | 'remove' | 'delete';
  storageId: string;
};

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const { user } = useAuth();
  const username = user?.loginUser || '';

  const [storages, setStorages] = useState<StorageItem[]>([]);
  const [volumeMap, setVolumeMap] = useState<Record<string, number>>({});
  const [writes, setWrites] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [lastWriteDate, setLastWriteDate] = useState<string>('—');
  const [lastDeductDate, setLastDeductDate] = useState<string>('—');

  useFocusEffect(
    useCallback(() => {
      loadAllData();
    }, [])
  );

  const loadAllData = async () => {
    const storagesRaw = await AsyncStorage.getItem('storages');
    const storagesArr: StorageItem[] = storagesRaw ? JSON.parse(storagesRaw) : [];
    setStorages(storagesArr);

    const volumeUsage: Record<string, number> = {};
    for (const s of storagesArr) {
      const raw = await AsyncStorage.getItem(`items:${s.name}`);
      const items: Item[] = raw ? JSON.parse(raw) : [];
      const totalVolume = items.reduce(
        (sum, item) => sum + (item.totalVolume || (item.quantity * (item.unitVolume || 0))),
        0
      );
      volumeUsage[s.name] = totalVolume;
    }
    setVolumeMap(volumeUsage);

    const historyRaw = await AsyncStorage.getItem('history');
    const history: HistoryItem[] = historyRaw ? JSON.parse(historyRaw) : [];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let w = 0, d = 0;
    let lw = '', ld = '';

    for (const record of history) {
      const date = new Date(record.timestamp);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        if (record.action === 'add' || record.action === 'create') {
          w++;
          if (!lw || date > new Date(lw)) lw = record.timestamp;
        }
        if (record.action === 'remove' || record.action === 'delete') {
          d++;
          if (!ld || date > new Date(ld)) ld = record.timestamp;
        }
      }
    }

    setWrites(w);
    setDeductions(d);
    setLastWriteDate(lw ? new Date(lw).toLocaleString() : '—');
    setLastDeductDate(ld ? new Date(ld).toLocaleString() : '—');
  };

  const totalCapacity = storages.reduce((sum, s) => sum + s.capacity, 0);
  const totalUsedVolume = storages.reduce(
    (sum, s) => sum + (volumeMap[s.name] || 0),
    0
  );
  const percentUsed = totalCapacity ? Math.round((totalUsedVolume / totalCapacity) * 100) : 0;

  const labels = storages.map((s) => s.name);
  const volumes = storages.map((s) => volumeMap[s.name] || 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcome}>
        Добро пожаловать{username ? `, ${username}` : ''}!
      </Text>

      <View style={styles.card}>
        <Text style={styles.title}>Общий объём: {totalCapacity} м³</Text>
        <Text style={styles.title}>
          Занято: {totalUsedVolume} м³ ({percentUsed}%)
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Пополнения за месяц: {writes}</Text>
        <Text style={styles.title}>Списания за месяц: {deductions}</Text>
        <Text style={styles.title}>Последнее пополнение: {lastWriteDate}</Text>
        <Text style={styles.title}>Последнее списание: {lastDeductDate}</Text>
      </View>

      {labels.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Заполненность по хранилищам (м³)</Text>
          <BarChart
            data={{
              labels,
              datasets: [{ data: volumes }],
            }}
            width={screenWidth - 40}
            height={220}
            fromZero
            yAxisSuffix="м³"
            chartConfig={{
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              barPercentage: 0.5,
            }}
            style={styles.chart}
            showValuesOnTopOfBars
            yAxisLabel=''
            xAxisLabel=''
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    flexGrow: 1,
  },
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: '600',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
});
