import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Animated,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Logo from '../assets/logo.svg'; // Make sure the logo exists or replace
import * as Haptics from 'expo-haptics';
import CustomDropdown from './CustomDropdown';

const MAX_IMAGES = 3;

// Call company API one image at a time
async function analyzeImages(images) {
  const results = [];

  for (let i = 0; i < images.length; i++) {
    const formData = new FormData();
    formData.append('image_file', {
      uri: images[i],
      type: 'image/jpeg',
      name: `image_${i}.jpg`,
    });

    try {
      const response = await fetch('http://api.quazar.co.kr/api/ai/object_detection', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const detectedKey = Object.keys(result.detected_object)[0];

        results.push({
          uri: images[i],
          category: detectedKey,
          bbox: result.detected_object[detectedKey]?.bbox || [],
        });

        // If any image is fake, return early
        if (detectedKey === 'fake') {
          return {
            is_fake: true,
            details: results,
          };
        }
      } else {
        console.error(`AI API 오류 (이미지 ${i}):`, response.status);
      }
    } catch (error) {
      console.error(`AI 분석 중 에러 발생 (이미지 ${i}):`, error);
    }
  }

  // If all images passed
  return {
    is_fake: false,
    details: results,
  };
}


export default function UploadScreen({ navigation }) {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const [itemName, setItemName] = useState('');
  const [modelName, setModelName] = useState('');
  const [condition, setCondition] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: MAX_IMAGES - images.length,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  const deleteImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async () => {
    if (images.length < 3 || !itemName.trim() || !modelName.trim() || !condition) {
      alert('이미지와 모든 상품 정보를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await analyzeImages(images);

      if (result?.is_fake) {
        navigation.navigate('Result', { images, analyzeResult: result });
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        fadeAnim.setValue(0);
        setShowNotification(true);

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();

        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => setShowNotification(false));
        }, 2000);
      }
    } catch (error) {
      console.error('에러 발생:', error);
      alert('AI 분석 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.sectionTitle}>상품정보</Text>

          {/* 이미지 업로드 */}
          <View style={styles.imageRow}>
            {images.length < MAX_IMAGES && (
              <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
                <Image
                  source={{ uri: 'https://img.icons8.com/ios-filled/50/camera.png' }}
                  style={{ width: 24, height: 24, tintColor: '#aaa' }}
                />
                <Text style={{ color: '#aaa', fontSize: 12 }}>
                  {images.length}/{MAX_IMAGES}
                </Text>
              </TouchableOpacity>
            )}

            {images.map((img, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: img }} style={styles.imageBox} />
                <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteImage(index)}>
                  <Text style={{ color: '#fff', fontSize: 12 }}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* 상품 입력 */}
          <View style={styles.infoBox}>
            <View style={styles.row}>
              <Text style={styles.left}>상품명</Text>
              <TextInput
                style={styles.input}
                value={itemName}
                onChangeText={(text) => setItemName(text.replace(/[0-9]/g, ''))}
                placeholder="예: 알마 BB"
                placeholderTextColor="#aaa"
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.left}>카테고리</Text>
              <Text style={styles.right}>가방/지갑</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.left}>상품상태</Text>
              <CustomDropdown
                selectedValue={condition}
                onValueChange={setCondition}
                placeholder="선택하세요"
                items={[
                  { label: '선택하세요', value: '' },
                  { label: '사용감 없음', value: '사용감 없음' },
                  { label: '약간의 사용감', value: '약간의 사용감' },
                  { label: '많은 사용감', value: '많은 사용감' },
                ]}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.left}>모델명</Text>
              <TextInput
                style={styles.input}
                value={modelName}
                onChangeText={(text) => setModelName(text.replace(/[0-9]/g, ''))}
                placeholder="예: 루이비통 알마 BB"
                placeholderTextColor="#aaa"
              />
            </View>
          </View>

          {/* 추천 박스 */}
          <View style={styles.recommendBox}>
            <Text style={styles.recommendTitle}>이 상품은 판매대기기기로 판매가 가능해요</Text>
            <Text style={styles.recommendText}>이런 분께 판매대기기를 추천해요</Text>
            <Text style={styles.recommendBullet}>• 번거로운 등록을 생략하고 싶은 분</Text>
            <Text style={styles.recommendBullet}>• 입금송, 등록사가 많아 답답했던 분</Text>
            <Text style={styles.recommendBullet}>• 내 상품의 가치를 빠르게 알고 싶은 분</Text>
            <Text style={styles.bottomText}>정품 검사, 촬영, 마케팅, 배송까지 해주는</Text>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
            <Text style={styles.submitText}>등록 완료</Text>
          </TouchableOpacity>
        </ScrollView>

        {showNotification && (
          <Animated.View style={[styles.notificationBox, { opacity: fadeAnim }]}>
            <Text style={styles.resultTitle}>AI 감정 결과</Text>
            <Text style={styles.resultMessage}>위험 상품이 아닙니다.</Text>
            <Logo width={80} height={20} style={{ marginTop: 8 }} />
          </Animated.View>
        )}

        {isLoading && (
          <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill}>
            <View style={styles.blurContent}>
              <Logo width={120} height={30} />
              <View style={styles.dots}>
                {[...Array(5)].map((_, i) => (
                  <View key={i} style={[styles.dot, { opacity: 1 - i * 0.15 }]} />
                ))}
              </View>
              <Text style={styles.loadingText}>사진을 감정중 입니다.</Text>
            </View>
          </BlurView>
        )}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 90,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 12, // Added spacing between images
  },
  imageBox: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#000',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  left: {
    color: '#111',
    fontSize: 18,
  },
  right: {
    color: '#666',
    fontSize: 18,
  },
  input: {
    flex: 1,
    textAlign: 'right',
    color: '#333',
    fontSize: 18,
  },
  recommendBox: {
    backgroundColor: '#fef6e8',
    borderRadius: 8,
    padding: 20,
    marginBottom: 30,
  },
  recommendTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#a67700',
    fontSize: 20,
  },
  recommendText: {
    marginBottom: 6,
    color: '#333',
    fontWeight: 'bold',
    fontSize: 18,
  },
  recommendBullet: {
    fontSize: 16,
    color: '#555',
    marginLeft: 10,
    marginBottom: 4,
  },
  bottomText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  submitButton: {
    backgroundColor: '#d32f2f',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
    justifyContent: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  blurContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
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
    marginTop: 10,
  },
  notificationBox: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 999,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  resultTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  resultMessage: {
    fontSize: 20,
    color: '#1976d2',
    fontWeight: 'bold',
  },
});

