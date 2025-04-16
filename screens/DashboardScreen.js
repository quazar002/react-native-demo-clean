// DashboardScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';

const filters = ['12 Months', '6 Months', '30 Days', '7 Days'];

const mockItems = [
  {
    id: '002',
    seller: '위탁판매자 002',
    productName: '루이비통 알마 BB',
    date: '2025.03.06',
    status: 'risky',
    image: 'https://via.placeholder.com/50',
  },
  {
    id: '001',
    seller: '위탁판매자 001',
    productName: '루이비통 알마 BB',
    date: '2025.03.06',
    status: 'normal',
    image: 'https://via.placeholder.com/50',
  },
];

export default function DashboardScreen() {
  const [selectedFilter, setSelectedFilter] = useState('12 Months');

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>QUAZAR</Text>

      {/* Filter Buttons */}
      <View style={styles.filterRow}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.activeFilterButton,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart Placeholder */}
      <View style={styles.chartBox}>
        <Text style={{ color: '#aaa' }}>[ Chart Placeholder ]</Text>
      </View>

      {/* Live Items Section */}
      <Text style={styles.sectionTitle}>실시간 위탁판매 등록</Text>
      <Text style={styles.sectionSubtitle}>
        Lorem ipsum dolor sit ametis.
      </Text>

      {/* Item Cards */}
      {mockItems.map(item => (
        <View key={item.id} style={styles.card}>
          <View style={styles.leftSection}>
            <Image source={{ uri: item.image }} style={styles.avatar} />
            <View>
              <Text style={styles.seller}>{item.seller}</Text>
              <Text style={styles.productName}>{item.productName}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
          </View>

          <View style={styles.rightSection}>
            <Text
              style={[
                styles.statusTag,
                item.status === 'risky' ? styles.risky : styles.normal,
              ]}
            >
              {item.status === 'risky' ? '위험 감지' : '정상 감지'}
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.approveButton,
                  item.status === 'risky' ? styles.outlined : styles.filled,
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    item.status === 'risky' ? styles.blackText : styles.whiteText,
                  ]}
                >
                  승인
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.rejectButton,
                  item.status === 'risky'
                    ? styles.filledRed
                    : styles.outlined,
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    item.status === 'risky' ? styles.whiteText : styles.blackText,
                  ]}
                >
                  거부
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
  },
  activeFilterButton: {
    borderColor: '#000',
  },
  filterText: {
    fontSize: 13,
    color: '#333',
  },
  activeFilterText: {
    fontWeight: 'bold',
  },
  chartBox: {
    height: 180,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  leftSection: {
    flexDirection: 'row',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  seller: {
    fontWeight: '600',
  },
  productName: {
    color: '#444',
    fontSize: 13,
  },
  date: {
    fontSize: 11,
    color: '#888',
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  statusTag: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    fontWeight: '600',
    marginBottom: 6,
  },
  risky: {
    borderColor: '#ef4444',
    color: '#b91c1c',
  },
  normal: {
    borderColor: '#3b82f6',
    color: '#2563eb',
  },
  buttonRow: {
    flexDirection: 'row',
  },
  approveButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 6,
  },
  rejectButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  filled: {
    backgroundColor: '#2563eb',
  },
  filledRed: {
    backgroundColor: '#ef4444',
  },
  outlined: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  whiteText: {
    color: '#fff',
    fontWeight: '500',
  },
  blackText: {
    color: '#000',
    fontWeight: '500',
  },
});
