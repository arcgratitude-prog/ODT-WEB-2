import { ClassItem, PassOption, SpecialEvent, FAQItem, StudioInfo } from '../types';

export const STUDIO_INFO: StudioInfo = {
  name: 'Dance Factory',
  mallName: 'WestShore Plaza Mall',
  address: '334 Westshore Plaza A10',
  cityStateZip: 'Tampa, FL 33609',
  fullAddress: '334 Westshore Plaza A10, Tampa, FL 33609',
  parkingInfo: 'Free Mall Parking right outside the main mall entrance near Dance Factory studio (A10 suite).',
  instagram: '@AI.URBANO',
  instagramUrl: 'https://www.instagram.com/ai.urbano/',
  whatsappLink: 'https://chat.whatsapp.com/IyKDtYQCAf44qtuYW7etiU?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAacPtCM2gsXFFtGsj4gUK0hrWwuA_MFJPWCxeCOuxeZF6nSUSbKq_hm3nAOE0w_aem_e0SV09i_86LWoQO9SP46Tw',
  googleMapsUrl: 'https://www.google.com/maps/place/AI+Urbano/@27.9464832,-82.5272046,17z/data=!4m18!1m9!3m8!1s0x88c2c34d346e81f9:0xb7e00c082c6ea9c6!2sAI+Urbano!8m2!3d27.9464832!4d-82.5272046!9m1!1b1!16s%2Fg%2F11z9n2wb01!3m7!1s0x88c2c34d346e81f9:0xb7e00c082c6ea9c6!8m2!3d27.9464832!4d-82.5272046!9m1!1b1!16s%2Fg%2F11z9n2wb01?entry=ttu&g_ep=EgoyMDI2MDcyMS4wIKXMDSoASAFQAw%3D%3D',
  googleReviewUrl: 'https://www.google.com/maps/place/AI+Urbano/@27.9464832,-82.5272046,17z/data=!4m18!1m9!3m8!1s0x88c2c34d346e81f9:0xb7e00c082c6ea9c6!2sAI+Urbano!8m2!3d27.9464832!4d-82.5272046!9m1!1b1!16s%2Fg%2F11z9n2wb01!3m7!1s0x88c2c34d346e81f9:0xb7e00c082c6ea9c6!8m2!3d27.9464832!4d-82.5272046!9m1!1b1!16s%2Fg%2F11z9n2wb01?entry=ttu&g_ep=EgoyMDI2MDcyMS4wIKXMDSoASAFQAw%3D%3D',
  phone: '(813) 555-URBAN',
  amenities: [
    'Sprung Hardwood Dance Floor',
    'Full Wall Mirrors & Studio Lighting',
    'Climate Controlled Air Conditioning',
    'Free Ample Mall Parking',
    'Restrooms & Changing Area',
    'Surround Sound Audio System'
  ]
};

export const CLASSES_DATA: ClassItem[] = [
  {
    id: 'foundations',
    time: '7:00 PM - 8:00 PM',
    title: 'Bachata Foundation',
    level: 'Beginner',
    tag: 'Essential Tech',
    description: 'A progressive series to establish strong fundamentals, technical proficiency, and partner connection — building your confidence for social dancing.',
    focus: [
      'Clean, comfortable technique',
      'Proper technical skill building',
      'Timing & musical interpretation',
      'Partner connection basics'
    ],
    recommendedFor: 'Complete beginners, dancers new to Urban Bachata, or experienced dancers refining basic technique.',
    instructorNote: 'No partner or prior experience required! We rotate partners during class so everyone gets to practice.',
    iconName: 'Footprints'
  },
  {
    id: 'skills-drills',
    time: '8:00 PM - 9:00 PM',
    title: 'Skills and Drills',
    level: 'Open Level',
    tag: 'Technique & Styling',
    description: 'An all-levels training hour focused on solo movement, refining lead & follow technique, and footwork that translates directly to the social dance floor.',
    focus: [
      'Solo movement & body control',
      'Lead & follow technique refinement',
      'Urban footwork & syncopated pasitos',
      'Practical social-floor skills'
    ],
    recommendedFor: 'All levels wanting to improve body movement, control, confidence, and musicality.',
    instructorNote: 'High energy drills session that translates directly into social dancing smoothness.',
    iconName: 'Zap'
  },
  {
    id: 'urban-flow',
    time: '9:00 PM - 10:00 PM',
    title: 'Urban Flow',
    level: 'Intermediate',
    tag: 'Sensual & Combinations',
    description: 'A progressive intermediate course blending traditional and modern bachata — refining technique, musical creativity, and footwork into effortless flow.',
    focus: [
      'Musicality & creative interpretation',
      'Urban flow turn combinations',
      'Dip safety & weight support',
      'Footwork & flow on the floor'
    ],
    recommendedFor: 'Dancers comfortable with basics ready for intermediate combos and sensual urban dynamics.',
    instructorNote: 'Must have basic timing and turns down. We focus heavily on musicality and smooth flow!',
    iconName: 'Flame'
  }
];

export const BACHATA_INVASION_PASS_OPTION: PassOption = {
  id: 'social-invasion-10',
  name: 'Bachata Invasion Social Pass',
  price: 12,
  tagline: 'Friday, September 11th @ Dance Factory Tampa (8:00 PM - 1:00 AM)',
  classesCount: 1,
  popular: true,
  features: [
    '8:00 - 9:00 PM Urban Bachata Class by Albina & Isaac (AI Urbano / ODT)',
    '9:00 PM - 1:00 AM Social Dancing with DJ JR (90% Bachata / 10% Salsa)',
    'Dance Factory Tampa (Westshore Plaza Mall Unit A10)',
    'Free Ample Mall Parking',
    'Digital Mobile Pass with Instant Check-In'
  ],
  type: 'drop_in_1'
};

export const SOCIAL_PASS_OPTION: PassOption = {
  id: 'social-presale',
  name: 'Bachata Locura Social Pass',
  price: 15,
  originalPrice: 20,
  savings: 'Save $5 Pre-Sale',
  tagline: 'Sunday, September 20th @ Westshore Plaza Mall (Presocial Class + Social)',
  classesCount: 1,
  popular: true,
  features: [
    'Presocial Class with Albina & Isaac (4:00 PM)',
    'Social Dancing with DJ JR (4:00 PM - 9:00 PM)',
    'Westshore Plaza Mall Venue (334 Westshore Plaza, Unit A10)',
    'Digital Mobile Pass with Instant Check-In'
  ],
  type: 'drop_in_1'
};

export const PASS_OPTIONS: PassOption[] = [
  {
    id: 'track-foundations',
    name: 'Tier 1: Solo Sesh',
    price: 80,
    tagline: 'One class a week, your pick. Ease in on your own terms.',
    classesCount: 4,
    popular: false,
    features: [
      '4 weeks — pick 1 class hour to attend weekly',
      'Access to our monthly Lab Night Practice Social',
      '20% off ODT socials',
      '10% off private lessons'
    ],
    type: 'cycle_4week'
  },
  {
    id: 'track-progression',
    name: 'Tier 2: Grindin’',
    price: 105,
    savings: 'MOST POPULAR TRACK',
    tagline: 'Two classes a week. You’re building real momentum now.',
    classesCount: 8,
    popular: true,
    features: [
      '4 weeks — pick 2 class hours to attend weekly',
      'Access to our monthly Lab Night Practice Social',
      '20% off ODT socials',
      '10% off private lessons'
    ],
    type: 'cycle_4week'
  },
  {
    id: 'track-unlimited',
    name: 'Tier 3: Locked In',
    price: 125,
    savings: 'FULL IMMERSION • BEST VALUE',
    tagline: 'All 3 classes, every Wednesday. No half-stepping.',
    classesCount: 12,
    popular: false,
    features: [
      '4 weeks of Bachata Foundations classes (7:00-8:00 PM)',
      '4 weeks of Skills & Drills classes (8:00-9:00 PM)',
      '4 weeks of Urban Flow classes (9:00-10:00 PM)',
      'Access to our monthly Lab Night Practice Social',
      '20% off ODT socials',
      '10% off private lessons'
    ],
    type: 'cycle_4week'
  },
  {
    id: 'dropin-1',
    name: '1 Class Drop-In',
    price: 20,
    tagline: 'Pick any single Wednesday class session',
    classesCount: 1,
    popular: false,
    features: [
      'Valid for 1 class of your choice',
      'Choose 7PM, 8PM, or 9PM session',
      'Flexible drop-in attendance',
      'Digital Ticket on your phone'
    ],
    type: 'drop_in_1'
  },
  {
    id: 'dropin-2',
    name: '2 Class Drop-In',
    price: 35,
    tagline: 'Attend any 2 Wednesday class sessions',
    classesCount: 2,
    popular: false,
    features: [
      'Valid for 2 classes of your choice',
      'Mix & match any 7PM, 8PM, or 9PM sessions',
      'Flexible drop-in attendance',
      'Digital Ticket on your phone'
    ],
    type: 'drop_in_2'
  },
  {
    id: 'dropin-full',
    name: '3 Class Drop-In',
    price: 50,
    tagline: 'Full night — all 3 Wednesday class sessions',
    classesCount: 3,
    popular: false,
    features: [
      'Valid for all 3 Wednesday classes',
      '7PM Foundations + 8PM Skills & Drills + 9PM Urban Flow',
      'Best drop-in value for the full night',
      'Digital Ticket on your phone'
    ],
    type: 'drop_in_full'
  }
];

// Bachata X1 — private/semi-private 90-minute training sessions with
// Albina & Antonio. Kept separate from PASS_OPTIONS (the weekly group
// tiers) since this is a distinct offering with its own page.
export const X1_MONTHLY_PASS_OPTION: PassOption = {
  id: 'x1-monthly',
  name: 'Bachata X1 Monthly',
  price: 100,
  tagline: '90-minute private training sessions with Albina & Antonio',
  classesCount: 4,
  popular: true,
  features: [
    'Weekly 90-minute private session',
    'Direct coaching from Albina & Antonio',
    'Warm Up, Mobility, Isolation, Train, Concept, Movement, Apply',
    'Digital Ticket on your phone'
  ],
  type: 'cycle_4week'
};

export const X1_DROPIN_PASS_OPTION: PassOption = {
  id: 'x1-dropin',
  name: 'Bachata X1 Drop-In',
  price: 30,
  tagline: 'One 90-minute private session with Albina & Antonio',
  classesCount: 1,
  features: [
    'One 90-minute private session',
    'Direct coaching from Albina & Antonio',
    'Digital Ticket on your phone'
  ],
  type: 'drop_in_1'
};

export const SPECIAL_EVENTS: SpecialEvent[] = [
  {
    id: 'cycle-1',
    title: '4-WEEK URBAN BACHATA TRACKS',
    badge: 'PROGRESSIVE COURSES',
    dateString: 'Starts the day you enroll — every Wednesday for 4 weeks',
    isoDate: '',
    description: 'Structured 4-week tracks (Tier 1 Foundations $80, Tier 2 Progression $105, Tier 3 Unlimited $125) designed to elevate your social dancing confidence, technique, connection, and urban flow. Your 4 weeks start the moment you enroll — not on a fixed shared schedule.',
    highlightText: '4-Week Tracks • Foundations ($80) • Progression ($105) • Unlimited ($125)',
    isFree: false,
    ctaText: 'Register for 4-Week Tracks'
  }
];

export const FAQ_DATA: FAQItem[] = [
  {
    question: 'Where can I learn bachata in Tampa?',
    answer: 'AI Urbano, inside Dance Factory at WestShore Plaza Mall (334 Westshore Plaza A10, Tampa, FL 33609) — free parking, every Wednesday.',
    category: 'Location'
  },
  {
    question: 'How much do bachata classes cost in Tampa?',
    answer: 'Drop-ins start at $20/class. Monthly tracks run $80–$125 depending on how many classes per week.',
    category: 'Pricing'
  },
  {
    question: 'Do I need a partner to take bachata classes?',
    answer: 'No — we rotate partners all class so everyone gets to practice leading and following.',
    category: 'Classes'
  },
  {
    question: 'Is bachata hard to learn for beginners?',
    answer: 'Not at all. It runs on a simple 8-count rhythm, so most beginners pick up the basics within their first couple classes.',
    category: 'Classes'
  },
  {
    question: 'What should I wear to a bachata class?',
    answer: 'Comfortable athletic wear and smooth-soled shoes for easy pivots. Skip heavy boots or high-grip sneakers.',
    category: 'General'
  },
  {
    question: 'How long does it take to learn bachata?',
    answer: 'Basic timing and connection click within 1–2 classes; smooth, confident flow usually takes 2–3 months of consistent practice.',
    category: 'General'
  },
  {
    question: 'Where is Dance Factory located inside WestShore Plaza Mall?',
    answer: 'Suite A10 (334 Westshore Plaza A10, Tampa, FL 33609) — park in the main mall lot near the exterior entrance.',
    category: 'Location'
  }
];

export const INSTAGRAM_HIGHLIGHTS = [
  {
    caption: 'Sensual body waves & urban connection in flow class! 🔥 #UrbanBachata #AIBachata #TampaDance',
    likes: '428',
    tag: 'Urban Flow'
  },
  {
    caption: 'Skills & Drills night! Working on clean pasitos and isolations. 👟🕺 #BachataTampa',
    likes: '312',
    tag: 'Drills'
  },
  {
    caption: 'Foundations squad locking in that 8-count rhythm! Everyone killed it tonight. 👑',
    likes: '580',
    tag: 'Beginners'
  }
];
