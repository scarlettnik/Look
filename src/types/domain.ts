import type { CSSProperties } from 'react';

export type EntityId = number | string;

export interface CatalogFilters {
  sizes: string[];
  categories: string[];
  colors: string[];
  brands: string[];
  min_price: number | null;
  max_price: number | null;
}

export interface CatalogSearchRequest {
  query?: string | null;
}

export interface SizeParameters {
  breast: number;
  waist: number;
  hip: number;
}

export interface UserPreferences {
  complete_onboarding?: boolean;
  age?: number;
  gender?: string;
  styles?: string[];
  clothing_size?: string;
  size_parameters?: SizeParameters;
  wearing_styles?: string[];
}

export interface UserPreferencesDraft {
  gender: string;
  age: number;
  styles: string[];
  clothing_size: string;
  size_parameters: SizeParameters;
  wearing_styles: string[];
}

export interface TelegramProfile {
  id?: EntityId;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export interface ColorOption {
  color_name?: string;
  color_code?: string;
}

export interface ProductColorVariant extends ColorOption {
  product_id?: EntityId;
}

export interface ProductCard {
  id: EntityId;
  name?: string;
  brand?: string;
  type?: string;
  price?: number | null;
  discount_price?: number | null;
  description?: string;
  original_url?: string;
  image_urls?: string[];
  sizes?: Array<string | string[]>;
  color_name?: string;
  color_group?: ProductColorVariant[];
  colors?: ColorOption[];
  details?: Record<string, string | number | null>;
  is_contained_in_user_collections?: boolean;
  _pending?: boolean;
  _key?: string;
  style?: CSSProperties;
  cartItemId?: EntityId;
}

export interface ProductCollection {
  id: EntityId;
  name?: string;
  cover_image_url?: string;
  products?: ProductCard[];
}

export interface AuthUser extends TelegramProfile {
  preferences?: UserPreferences;
  collections?: ProductCollection[];
}

export interface CatalogMetadata {
  brands: string[];
  categories: string[];
  colors: Record<string, string>;
}

export interface SwipeHistoryEntry {
  direction: 'left' | 'right' | 'up';
  card: ProductCard;
}
