import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import QuazarLogo from '../assets/QUAZAR.svg'; // your logo SVG
// If you're using PNG instead: import QuazarLogo from '../assets/logo.png'

const image1 = require('../assets/images/image1.jpg');
const image2 = require('../assets/images/image2.jpg');
const image3 = require('../assets/images/image3.jpeg');
const image4 = require('../assets/images/image4.jpg');

const filters = ['12 Months', '6 Months', '30 Days', '7 Days'];

const mockItems = [
  {
    id: '001',
    seller: '위탁판매자 001',
    productName: '루이비통 알마 BB',
    date: '2025.03.06',
    status: 'normal',
    image: image1,
  },
  {
    id: '002',
    seller: '위탁판매자 002',
    productName: '구찌 마몬트 미니',
    date: '2025.03.06',
    status: 'risky',
    image: image2,
  },
  {
    id: '003',
    seller: '위탁판매자 003',
    productName: '샤넬 클래식 플랩 백',
    date: '2025.03.06',
    status: 'normal',
    image: image3,
  },
  {
    id: '004',
    seller: '위탁판매자 004',
    productName: '프라다 사피아노 지갑',
    date: '2025.03.06',
    status: 'risky',
    image: image4,
  },
];

const mockChartData = {
  '12 Months': {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      { data: [4, 5, 6, 4, 5, 6, 7, 8], color: () => '#008CFF' },
      { data: [2, 3, 2, 2, 3, 2, 3, 2], color: () => '#FF2121' },
    ],
  },
  '6 Months': {
    labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      { data: [4, 5, 6, 4, 5, 6], color: () => '#008CFF' },
      { data: [2, 3, 2, 2, 3, 2], color: () => '#FF2121' },
    ],
  },
  '30 Days': {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      { data: [4, 5, 6, 7], color: () => '#008CFF' },
      { data: [2, 3, 2, 3], color: () => '#FF2121' },
    ],
  },
  '7 Days': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      { data: [4, 5, 6, 4, 5, 6, 7], color: () => '#008CFF' },
      { data: [2, 3, 2, 2, 3, 2, 3], color: () => '#FF2121' },
    ],
  },
};

export default function DashboardScreen() {
  const [selectedFilter, setSelectedFilter] = useState('12 Months');
  const [chartData, setChartData] = useState(mockChartData['12 Months']);
  const [liveItems, setLiveItems] = useState(mockItems);

  useEffect(() => {
    const fetchedChartData = mockChartData[selectedFilter] || mockChartData['12 Months'];
    setChartData(fetchedChartData);
  }, [selectedFilter]);

  const handleApprove = (id) => {
    setLiveItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReject = (id) => {
    setLiveItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Fixed Logo Header */}
      <View style={styles.fixedHeader}>
        <QuazarLogo width={120} height={40} />
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollArea}>
        {/* Filter Buttons */}
        <View style={styles.filterRow}>
          {filters.map((filter) => (
            <Pressable
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
            </Pressable>
          ))}
        </View>

        {/* Chart */}
        <View style={styles.chartBox}>
          <LineChart
            data={chartData}
            width={350}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: () => '#888',
              labelColor: () => '#888',
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#fff',
              },
            }}
            bezier
            style={{ borderRadius: 16 }}
          />
        </View>

        <Text style={styles.sectionTitle}>실시간 위탁판매 등록</Text>
        <Text style={styles.sectionSubtitle}>Lorem ipsum dolor sit ametis.</Text>

        {/* Item Cards */}
        {liveItems.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardTop}>
              <Image source={item.image} style={styles.avatar} />
              <View style={styles.cardBody}>
                <Text style={styles.seller}>{item.seller}</Text>
                <Text style={styles.productName}>상품명: {item.productName}</Text>
              </View>
              <View style={styles.statusSection}>
                <Text
                  style={[
                    styles.statusTag,
                    item.status === 'risky' ? styles.risky : styles.normal,
                  ]}
                >
                  {item.status === 'risky' ? '위험 감지' : '정상 감지'}
                </Text>
                <Text style={styles.date}>{item.date} (목)</Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <Pressable
                onPress={() => handleApprove(item.id)}
                style={({ pressed }) => [
                  styles.approveButton,
                  pressed && styles.approvePressed,
                ]}
              >
                {({ pressed }) => (
                  <Text style={pressed ? styles.whiteText : styles.blackText}>승인</Text>
                )}
              </Pressable>
              <Pressable
                onPress={() => handleReject(item.id)}
                style={({ pressed }) => [
                  styles.rejectButton,
                  pressed && styles.rejectPressed,
                ]}
              >
                {({ pressed }) => (
                  <Text style={pressed ? styles.whiteText : styles.blackText}>거부</Text>
                )}
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fixedHeader: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    zIndex: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
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
    height: 220,
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
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderColor: '#eee',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center',
  },
  seller: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  productName: {
    fontSize: 13,
    color: '#444',
  },
  statusSection: {
    alignItems: 'flex-end',
  },
  statusTag: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
    fontWeight: '600',
    marginBottom: 4,
  },
  risky: {
    borderColor: '#FF2121',
    color: '#FF2121',
  },
  normal: {
    borderColor: '#008CFF',
    color: '#008CFF',
  },
  date: {
    fontSize: 11,
    color: '#888',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  approveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  approvePressed: {
    backgroundColor: '#008CFF',
    borderColor: '#008CFF',
  },
  rejectPressed: {
    backgroundColor: '#FF2121',
    borderColor: '#FF2121',
  },
  whiteText: {
    color: '#fff',
    fontWeight: '600',
  },
  blackText: {
    color: '#000',
    fontWeight: '600',
  },
});
