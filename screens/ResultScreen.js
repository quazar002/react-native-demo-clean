import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Logo from '../assets/logo.svg'; // Your logo
import { useNavigation } from '@react-navigation/native';

export default function ResultScreen({ route }) {
  const { images } = route.params;
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [isFake, setIsFake] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const result = true; // Force "fake" result for now
      setIsFake(result);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Logo width={160} height={40} style={styles.logo} />
        <View style={styles.dots}>
          {[...Array(5)].map((_, i) => (
            <View key={i} style={[styles.dot, { opacity: 1 - i * 0.15 }]} />
          ))}
        </View>
        <Text style={styles.loadingText}>사진을 감정중 입니다.</Text>
      </View>
    );
  }

  // === FAKE ITEM UI ===
  return (
    <View style={styles.fakeContainer}>
      <View style={styles.warningBox}>
        <Text style={styles.warningIcon}>⚠️</Text>
        <Text style={styles.warningText}>위험 상품입니다.</Text>
      </View>

      <Text style={styles.description}>
        고객님, 의뢰하신 상품의 감정 결과,{'\n'}
        정품으로 단정하기 어려운 부분이 있습니다.{'\n'}
        몇몇 특징에서 저희가 보유한 정품 데이터와 차이가 발견되었으며,{'\n'}
        <Text style={styles.redText}>현재로서는 위험 상품으로 분류됩니다.</Text>
      </Text>

      <TouchableOpacity
  style={styles.backButton}
  onPress={() => navigation.goBack()} // Use goBack() to return to the previous screen
>
  <Text style={styles.backButtonText}>보류</Text>
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    marginBottom: 20,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#69a1e1',
    borderRadius: 4,
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
  },
  fakeContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningBox: {
    borderWidth: 2,
    borderColor: '#d32f2f',
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 100,
    alignItems: 'center',
    marginBottom: 30,
  },
  warningIcon: {
    fontSize: 24,
    color: '#d32f2f',
    marginBottom: 10,
  },
  warningText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  description: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  redText: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#ccc',
    paddingVertical: 18,
    paddingHorizontal: 150,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
