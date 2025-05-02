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

// Call company API with all images at once
async function analyzeImages(images) {
  const formData = new FormData();

  images.forEach((uri, idx) => {
    const filename = uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename ?? '');
    const ext = match?.[1]?.toLowerCase();
    const type = ext === 'png' ? 'image/png' : 'image/jpeg';

    formData.append('image_files', {
      uri,
      name: filename || `image_${idx}.jpg`,
      type,
    });
  });

  try {
    const response = await fetch('https://api.quazar.co.kr/api/b2b/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const text = await response.text();
    const result = JSON.parse(text);
    console.log('📦 Full API response:', result);

    return {
      is_fake: result.result === 'Fake',
      label: result.result,
      full: result,
    };
  } catch (error) {
    console.error('❌ Network error:', error);
    alert(`Network Error: ${error.message}`);
    return null;
  }
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
    paddingTop: 60, // Reduced padding
    paddingHorizontal: 15, // Reduced horizontal padding
    backgroundColor: '#f9f9f9',
  },
  sectionTitle: {
    fontSize: 20, // Reduced font size
    fontWeight: 'bold',
    marginBottom: 10, // Reduced margin
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15, // Reduced margin
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 8, // Reduced spacing between images
  },
  imageBox: {
    width: 80, // Reduced size
    height: 80, // Reduced size
    borderRadius: 6, // Reduced border radius
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#000',
    width: 20, // Reduced size
    height: 20, // Reduced size
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 6, // Reduced border radius
    paddingVertical: 10, // Reduced padding
    marginBottom: 15, // Reduced margin
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12, // Reduced padding
    paddingHorizontal: 15, // Reduced padding
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  left: {
    color: '#111',
    fontSize: 16, // Reduced font size
  },
  right: {
    color: '#666',
    fontSize: 16, // Reduced font size
  },
  input: {
    flex: 1,
    textAlign: 'right',
    color: '#333',
    fontSize: 16, // Reduced font size
  },
  recommendBox: {
    backgroundColor: '#fef6e8',
    borderRadius: 6, // Reduced border radius
    padding: 15, // Reduced padding
    marginBottom: 20, // Reduced margin
  },
  recommendTitle: {
    fontWeight: 'bold',
    marginBottom: 6, // Reduced margin
    color: '#a67700',
    fontSize: 18, // Reduced font size
  },
  recommendText: {
    marginBottom: 4, // Reduced margin
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16, // Reduced font size
  },
  recommendBullet: {
    fontSize: 14, // Reduced font size
    color: '#555',
    marginLeft: 8, // Reduced margin
    marginBottom: 3, // Reduced margin
  },
  bottomText: {
    marginTop: 8, // Reduced margin
    fontSize: 14, // Reduced font size
    color: '#555',
  },
  submitButton: {
    backgroundColor: '#d32f2f',
    padding: 15, // Reduced padding
    borderRadius: 6, // Reduced border radius
    alignItems: 'center',
    marginBottom: 30, // Reduced margin
    justifyContent: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 16, // Reduced font size
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
    gap: 4, // Reduced gap
    marginTop: 8, // Reduced margin
  },
  dot: {
    width: 6, // Reduced size
    height: 6, // Reduced size
    backgroundColor: '#69a1e1',
    borderRadius: 3,
  },
  loadingText: {
    fontSize: 14, // Reduced font size
    color: '#333',
    marginTop: 8, // Reduced margin
  },
  notificationBox: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    backgroundColor: '#fff',
    padding: 12, // Reduced padding
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 999,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  resultTitle: {
    fontSize: 14, // Reduced font size
    color: '#666',
    marginBottom: 4, // Reduced margin
  },
  resultMessage: {
    fontSize: 18, // Reduced font size
    color: '#1976d2',
    fontWeight: 'bold',
  },
});
