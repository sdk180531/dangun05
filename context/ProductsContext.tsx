import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type Product = {
  id: string;
  title: string;
  location: string;
  time: string;
  price: string;
  likes: number;
  chats: number;
  thumbColor: string;
  imageUri?: string;
  category: string;
};

// Supabase DB 행 타입 (snake_case)
type ProductRow = {
  id: string;
  title: string;
  location: string;
  time: string;
  price: string;
  likes: number;
  chats: number;
  thumb_color: string;
  image_uri: string | null;
  category: string;
  created_at: string;
};

export const THUMB_COLORS = [
  '#C8D8E8', '#E8E0D8', '#D0D0D0', '#F5DEB3',
  '#C8E8C8', '#E8C8D8', '#D8E8C0', '#C0D0E8',
];

// DB 행 → TypeScript Product 변환
function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    title: row.title,
    location: row.location,
    time: row.time,
    price: row.price,
    likes: row.likes,
    chats: row.chats,
    thumbColor: row.thumb_color,
    imageUri: row.image_uri ?? undefined,
    category: row.category,
  };
}

type ProductsContextType = {
  products: Product[];
  isLoading: boolean;
  addProduct: (product: Product) => Promise<void>;
};

const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('상품 불러오기 실패:', error.message);
    } else if (data) {
      setProducts((data as ProductRow[]).map(rowToProduct));
    }
    setIsLoading(false);
  };

  const addProduct = async (product: Product) => {
    // 낙관적 업데이트 — 즉시 로컬 상태에 추가
    setProducts((prev) => [product, ...prev]);

    const { error } = await supabase.from('products').insert({
      id: product.id,
      title: product.title,
      location: product.location,
      time: product.time,
      price: product.price,
      likes: product.likes,
      chats: product.chats,
      thumb_color: product.thumbColor,
      image_uri: product.imageUri ?? null,
      category: product.category,
    });

    if (error) {
      console.error('상품 저장 실패:', error.message);
      // 실패 시 낙관적 업데이트 롤백
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      throw error;
    }
  };

  return (
    <ProductsContext.Provider value={{ products, isLoading, addProduct }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
}
