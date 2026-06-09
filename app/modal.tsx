import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProducts, THUMB_COLORS } from '@/context/ProductsContext';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

type PickedImage = { uri: string; mimeType?: string | null };

async function uploadProductImages(images: PickedImage[]): Promise<string | undefined> {
  for (const img of images) {
    if (!img.uri) continue;
    try {
      const mimeType = img.mimeType ?? 'image/jpeg';
      const ext = mimeType === 'image/png' ? 'png' : 'jpg';
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const storagePath = `products/${filename}`;
      const uploadUrl = `${SUPABASE_URL}/storage/v1/object/product-images/${storagePath}`;
      const headers = {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
        'Content-Type': mimeType,
      };

      if (Platform.OS === 'web') {
        const res = await fetch(img.uri);
        const blob = await res.blob();
        const up = await fetch(uploadUrl, { method: 'POST', headers, body: blob });
        if (up.ok) return `${SUPABASE_URL}/storage/v1/object/public/product-images/${storagePath}`;
      } else {
        const result = await FileSystem.uploadAsync(uploadUrl, img.uri, {
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          headers,
        });
        if (result.status < 300) {
          return `${SUPABASE_URL}/storage/v1/object/public/product-images/${storagePath}`;
        }
      }
    } catch {
      // 업로드 실패 시 이미지 없이 상품 등록 계속
    }
  }
  return undefined;
}

const DAANGN_ORANGE = '#FF7E36';

type SellCategory = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
};

const SELL_CATEGORIES: SellCategory[] = [
  { label: '중고거래',      icon: 'pricetag',        iconColor: '#FF7E36' },
  { label: '나눔',          icon: 'gift',            iconColor: '#4DA6FF' },
  { label: '알바',          icon: 'briefcase',       iconColor: '#33B533' },
  { label: '부동산',        icon: 'home',            iconColor: '#9966FF' },
  { label: '중고차',        icon: 'car',             iconColor: '#FF4D4D' },
  { label: '게임',          icon: 'game-controller', iconColor: '#00B366' },
  { label: '전자기기',      icon: 'phone-portrait',  iconColor: '#FF9900' },
  { label: '가구/인테리어', icon: 'bed',             iconColor: '#3399FF' },
];

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addProduct } = useProducts();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<PickedImage[]>([]);
  const [category, setCategory] = useState('중고거래');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmit = title.trim().length > 0;

  const selectedCat = SELL_CATEGORIES.find((c) => c.label === category) ?? SELL_CATEGORIES[0];

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const randomColor = THUMB_COLORS[Math.floor(Math.random() * THUMB_COLORS.length)];
    try {
      const imageUri = await Promise.race([
        uploadProductImages(images),
        new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), 10000)),
      ]);
      await addProduct({
        id: Date.now().toString(),
        title: title.trim(),
        price: price.trim() ? `${price.trim()}원` : '가격 미정',
        location: '서초동',
        time: '방금 전',
        likes: 0,
        chats: 0,
        thumbColor: randomColor,
        imageUri,
        category,
      });
      router.back();
    } catch (e: unknown) {
      const detail = e instanceof Error ? e.message : String(e);
      Alert.alert('저장 실패', detail);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pickImage = async () => {
    if (images.length >= 10) {
      Alert.alert('사진은 최대 10장까지 추가할 수 있어요.');
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('앨범 접근 권한이 필요해요', '설정 > 앱 권한에서 사진 접근을 허용해주세요.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 10 - images.length,
      quality: 0.8,
    });
    if (!result.canceled) {
      const picked: PickedImage[] = result.assets.map((a) => ({ uri: a.uri, mimeType: a.mimeType }));
      setImages((prev) => [...prev, ...picked].slice(0, 10));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* 커스텀 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#212121" />
        </Pressable>
        <Text style={styles.headerTitle}>내 물건 팔기</Text>
        <Pressable
          style={styles.doneBtn}
          disabled={!canSubmit || isSubmitting}
          onPress={handleSubmit}
        >
          <Text style={[styles.doneBtnText, (canSubmit && !isSubmitting) ? styles.doneBtnTextActive : styles.doneBtnTextDisabled]}>
            {isSubmitting ? '업로드 중...' : '완료'}
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* 사진 추가 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photoSection}
        >
          <Pressable style={styles.photoBox} onPress={pickImage}>
            <Ionicons name="camera-outline" size={28} color="#999" />
            <Text style={styles.photoCount}>{images.length}/10</Text>
          </Pressable>
          {images.map((img, index) => (
            <View key={img.uri} style={styles.thumbWrapper}>
              <Image source={{ uri: img.uri }} style={styles.thumb} />
              <Pressable style={styles.removeBtn} onPress={() => removeImage(index)}>
                <Ionicons name="close-circle" size={20} color="#333" />
              </Pressable>
            </View>
          ))}
        </ScrollView>

        <View style={styles.divider} />

        {/* 제목 */}
        <View style={styles.field}>
          <TextInput
            style={styles.titleInput}
            placeholder="제목을 입력해주세요"
            placeholderTextColor="#bbb"
            value={title}
            onChangeText={setTitle}
            returnKeyType="next"
          />
        </View>

        <View style={styles.divider} />

        {/* 카테고리 */}
        <Pressable style={styles.rowField} onPress={() => setShowCategoryPicker(true)}>
          <View style={styles.categoryRow}>
            <Ionicons name={selectedCat.icon} size={18} color={selectedCat.iconColor} />
            <Text style={styles.categoryLabel}>{category}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#bbb" />
        </Pressable>

        <View style={styles.divider} />

        {/* 가격 */}
        <View style={styles.field}>
          <View style={styles.priceRow}>
            <Text style={styles.won}>₩</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="가격 (선택사항)"
              placeholderTextColor="#bbb"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
              returnKeyType="next"
            />
          </View>
        </View>

        <View style={styles.divider} />

        {/* 설명 */}
        <View style={styles.field}>
          <TextInput
            style={styles.descInput}
            placeholder="당근에 올릴 내용을 작성해주세요."
            placeholderTextColor="#bbb"
            multiline
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.divider} />

        {/* 거래 장소 */}
        <Pressable style={styles.rowField}>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={18} color="#555" />
            <Text style={styles.rowLabel}>거래 희망 장소 · 서초동</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#bbb" />
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* 카테고리 선택 바텀시트 */}
      <Modal
        visible={showCategoryPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setShowCategoryPicker(false)} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 8 }]}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>카테고리 선택</Text>
            <Pressable onPress={() => setShowCategoryPicker(false)} style={styles.sheetClose}>
              <Ionicons name="close" size={22} color="#444" />
            </Pressable>
          </View>
          <View style={styles.sheetDivider} />
          <ScrollView>
            {SELL_CATEGORIES.map((cat) => {
              const isSelected = cat.label === category;
              return (
                <Pressable
                  key={cat.label}
                  style={styles.sheetRow}
                  onPress={() => {
                    setCategory(cat.label);
                    setShowCategoryPicker(false);
                  }}
                >
                  <View style={styles.sheetRowLeft}>
                    <Ionicons name={cat.icon} size={20} color={cat.iconColor} />
                    <Text style={[styles.sheetRowLabel, isSelected && styles.sheetRowLabelActive]}>
                      {cat.label}
                    </Text>
                  </View>
                  {isSelected && <Ionicons name="checkmark" size={20} color={DAANGN_ORANGE} />}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  headerBtn: {
    padding: 8,
    width: 60,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
  },
  doneBtn: {
    width: 60,
    alignItems: 'flex-end',
    padding: 8,
  },
  doneBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  doneBtnTextActive: {
    color: DAANGN_ORANGE,
  },
  doneBtnTextDisabled: {
    color: '#ccc',
  },
  scroll: {
    flex: 1,
  },
  photoSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoBox: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    flexShrink: 0,
  },
  photoCount: {
    fontSize: 11,
    color: '#999',
  },
  thumbWrapper: {
    width: 80,
    height: 80,
    flexShrink: 0,
  },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  removeBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
  field: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  titleInput: {
    fontSize: 16,
    color: '#212121',
    padding: 0,
  },
  rowField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  rowLabel: {
    fontSize: 15,
    color: '#444',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryLabel: {
    fontSize: 15,
    color: '#212121',
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  won: {
    fontSize: 16,
    color: '#212121',
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
    padding: 0,
  },
  descInput: {
    fontSize: 15,
    color: '#212121',
    minHeight: 120,
    padding: 0,
    lineHeight: 22,
  },
  // 바텀시트
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
  },
  sheetClose: {
    padding: 4,
  },
  sheetDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e0e0e0',
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sheetRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sheetRowLabel: {
    fontSize: 16,
    color: '#212121',
  },
  sheetRowLabelActive: {
    fontWeight: '700',
    color: DAANGN_ORANGE,
  },
});
