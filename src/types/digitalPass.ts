// Types for the interactive 3D digital pass page. Ported from a Google
// Stitch/AI Studio design prototype. Kept in their own file (rather than
// added to the shared src/types.ts) since this is a self-contained feature
// with no overlap with the rest of the site's types.

export interface TicketData {
  id: string;
  orderNumber: string;
  eventName: string;
  subtitle: string;
  category: 'Social' | 'Masterclass' | 'Course' | 'Festival' | 'VIP';
  tierName: string;
  attendeeName: string;
  attendeeEmail: string;
  date: string;
  time: string;
  doorsOpen: string;
  venueName: string;
  venueAddress: string;
  cityState: string;
  instructors: string[];
  dj: string;
  price: number;
  quantity: number;
  discountApplied?: {
    code: string;
    amount: number;
  };
  processingFee: number;
  total: number;
  qrCodeUrl: string;
  barcodeNumber: string;
  gateSection: string;
  seatOrLevel: string;
  passColorTheme: 'vibrant' | 'gold' | 'holographic' | 'obsidian' | 'ruby';
  curriculum?: string[];
  isPastEvent?: boolean;
  schedule: Array<{
    time: string;
    title: string;
    description: string;
  }>;
  perks: string[];
}

export type ViewMode = 'email' | 'stage3d' | 'print';
