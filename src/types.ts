export interface ClassItem {
  id: string;
  time: string;
  title: string;
  level: 'Beginner' | 'Open Level' | 'Intermediate';
  tag: string;
  description: string;
  focus: string[];
  recommendedFor: string;
  instructorNote: string;
  iconName: string;
}

export interface PassOption {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  savings?: string;
  popular?: boolean;
  tagline: string;
  classesCount: number;
  features: string[];
  type: 'drop_in_1' | 'drop_in_2' | 'drop_in_full' | 'cycle_4week' | 'free_open_house';
}

export interface TicketPass {
  ticketId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  passName: string;
  passType: string;
  price: number;
  classesIncluded: string;
  eventDate: string;
  location: string;
  purchaseTimestamp: number;
  status: 'VALID' | 'CONFIRMED';
  qrCodeSeed: string;
}

export interface SpecialEvent {
  id: string;
  title: string;
  badge: string;
  dateString: string;
  isoDate: string;
  description: string;
  highlightText: string;
  isFree?: boolean;
  ctaText: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'General' | 'Classes' | 'Pricing' | 'Location';
}

export interface StudioInfo {
  name: string;
  mallName: string;
  address: string;
  cityStateZip: string;
  fullAddress: string;
  parkingInfo: string;
  instagram: string;
  instagramUrl?: string;
  whatsappLink?: string;
  googleMapsUrl?: string;
  googleReviewUrl?: string;
  phone?: string;
  amenities: string[];
}

export interface EnrolledCycle {
  id: string;
  title: string;
  schedule: string;
  location: string;
  startDate: string;
  currentWeek: number;
  totalWeeks: number;
  nextClassDate: string;
  instructors: string;
  status: 'Active' | 'Upcoming' | 'Completed';
}

export interface MemberUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  danceRole: 'Lead' | 'Follow' | 'Both' | 'Social Dancer / Enthusiast';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  joinedDate: string;
  avatarUrl?: string;
  referralCode: string;
  referralCount: number;
  attendanceCount: number;
  socialsAttendedCount: number; // e.g. 4 socials attended
  socialPunchGoal: number; // e.g. 5
  totalTicketsPurchased: number;
  freeSocialRewardEarned: boolean;
  enrolledCycles: EnrolledCycle[];
  achievements: { id: string; title: string; desc: string; icon: string; date?: string }[];
  // Real fields from the actual members backend (api/member-login.js) —
  // optional since a not-yet-logged-in or legacy demo user won't have
  // them. This is what actually reflects whether their Tier membership
  // is currently active, computed server-side from membership_expires_at.
  isActive?: boolean;
  membershipExpiresAt?: string;
}

export type StudentUser = MemberUser; // Backward compatibility alias

// Checkout theme — matches the color of whatever section the customer is
// booking from (weekly classes vs. Bachata Invasion vs. Bachata Locura)
// instead of always showing the same accent color.
export type CheckoutTheme = 'red' | 'fuchsia' | 'silver';

