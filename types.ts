
export enum UserArchetype {
  PARTY = 'Party',
  ACTIVE = 'Active',
  CONSCIOUS = 'Conscious',
  CREATIVE = 'Creative',
  BUSINESS = 'Business',
  UNKNOWN = 'Pending...'
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface UserProfile {
  id: string;
  name: string;
  archetype: UserArchetype;
  interests: string[];
  avatar: string;
  location?: Coordinates;
  alcoholPreference?: boolean;
}

export interface Location {
  id: string;
  name: string;
  category: string;
  address: string;
  image: string;
  priceLevel: number;
  rating: number;
  coords: Coordinates;
  allowsAlcohol?: boolean;
}

export interface GroupMeeting {
  id: string;
  title: string;
  members: UserProfile[];
  location: Location;
  time: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed';
  iceBreakers: string[];
  totalBudget?: number;
  currentPool?: number;
  alcoholFriendly?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isAi?: boolean;
}
