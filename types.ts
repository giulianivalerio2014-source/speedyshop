
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

export interface Product {
  id: string;
  name: string;
  price: string; // Display string (e.g. "100")
  priceValue: number; // Numeric value for logic
  image: string;
  rarity: 'Common' | 'Rare' | 'Legendary' | 'Mythic' | 'OG' | 'SECRET'; // Added OG and SECRET
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  day: string;
  genre: string;
}

export interface PurchaseRecord {
  date: string;
  itemName: string;
  price: number;
}

export interface Mission {
  id: string;
  title: string;
  reward: number;
  isCompleted: boolean;
  isClaimed: boolean;
  type: 'standard' | 'gold';
  actionType?: 'login' | 'buy' | 'visit_shop' | 'chat_ai'; // To track actions
}

export interface User {
  username: string; // Unique Display Name
  email: string;    // Contact Email
  password?: string; 
  credits: number;
  
  // Mission System
  lastMissionDate?: string; // YYYY-MM-DD
  dailyMissions?: Mission[];
  
  // Logic tracking for specific missions
  hasCompletedFirstBuy?: boolean; // Tracks if the 50cr buy mission is done forever
  lastLoginMissionDate?: string;  // Tracks when the last "Login" mission was given (for every-other-day logic)

  history?: PurchaseRecord[];
  isBanned?: boolean;
  banReason?: string;
  nextMissionIsGold?: boolean; // Admin forced spawn
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export enum Section {
  HERO = 'hero',
  GALLERY = 'gallery',
  SHOP = 'shop',
}

export type ViewState = 'home' | 'credits' | 'admin' | 'shop_brainrot';
