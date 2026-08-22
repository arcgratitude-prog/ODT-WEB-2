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
    description: 'Master core 8-count footwork, fundamental frame, body alignment, timing, basic turns, and smooth leading & following connection.',
    focus: [
      'Basic 8-count step variations',
      'Frame & weight transfer mechanics',
      'Gentle lead & follow connection',
      'Timing, hip motion & rhythm'
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
    description: 'Level up your dance with body isolations, footwork syncopations (pasitos), head rolls, arms styling, and speed/control exercises.',
    focus: [
      'Ribcage & upper body isolations',
      'Urban footwork & syncopated pasitos',
      'Head roll safety & neck alignment',
      'Arm styling & leader/follower flair'
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
    description: 'Combine sensual body waves, urban dip transitions, musicality accents, and complex turn patterns into effortless social flow.',
    focus: [
      'Sensual waves & body rolls',
      'Urban flow turn combinations',
      'Dip safety & weight support',
      'Musical accents & breaks'
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
  tagline: 'Every 2nd Friday @ Dance Factory Tampa (8:00 PM - 1:00 AM)',
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
  tagline: 'Sunday, August 16th @ Yuengling Draft Haus (Presocial Class + Social)',
  classesCount: 1,
  popular: true,
  features: [
    'Presocial Class with Albina & Isaac (4:00 PM)',
    'Social Dancing with DJ JR (5:00 PM - 9:00 PM)',
    'Yuengling Draft Haus Venue (11109 N 30th St)',
    'Digital Mobile Pass with Instant Check-In'
  ],
  type: 'drop_in_1'
};

export const SECRET_OPEN_HOUSE_PASS: PassOption = {
  id: 'secret-open-house-120',
  name: 'Open House VIP $120 Cycle Pass',
  price: 120,
  originalPrice: 200,
  savings: 'SAVE $80 • EXCLUSIVE ON-SITE RATE',
  tagline: 'On-Site Open House Special: Full 4-Week Progressive Cycle (12 Classes)',
  classesCount: 12,
  popular: true,
  features: [
    'Exclusive $120 Rate (Save $80 Off Reg. $200)',
    'Full 4-Week Cycle Access (All 12 Classes: 7PM, 8PM & 9PM)',
    'Progressive Urban Bachata Curriculum & Video Recaps',
    'Valid for On-Site Open House Scans Only',
    'Digital Ticket Pass with Instant Check-In'
  ],
  type: 'cycle_4week'
};

export const PASS_OPTIONS: PassOption[] = [
  {
    id: 'track-foundations',
    name: 'Tier 1: Foundations Track',
    price: 80,
    tagline: 'Perfect for students building a strong foundation in bachata.',
    classesCount: 4,
    popular: false,
    features: [
      '4 weeks of Bachata Foundations classes (7:00-8:00 PM)',
      'Access to our monthly Lab Night Practice Social',
      '20% off ODT socials',
      '10% off private lessons'
    ],
    type: 'cycle_4week'
  },
  {
    id: 'track-progression',
    name: 'Tier 2: Progression Track',
    price: 105,
    savings: 'MOST POPULAR TRACK',
    tagline: 'Designed for dancers who want to strengthen technique & continue developing.',
    classesCount: 8,
    popular: true,
    features: [
      '4 weeks of Bachata Foundations classes (7:00-8:00 PM)',
      '4 weeks of Skills & Drills classes (8:00-9:00 PM)',
      'Access to our monthly Lab Night Practice Social',
      '20% off ODT socials',
      '10% off private lessons'
    ],
    type: 'cycle_4week'
  },
  {
    id: 'track-unlimited',
    name: 'Tier 3: Unlimited Track',
    price: 125,
    savings: 'FULL IMMERSION • BEST VALUE',
    tagline: 'Our most comprehensive membership for dancers wanting the full training experience.',
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
  }
];

export const SPECIAL_EVENTS: SpecialEvent[] = [
  {
    id: 'cycle-1',
    title: '4-WEEK URBAN BACHATA TRACKS',
    badge: 'PROGRESSIVE COURSES',
    dateString: 'August 12th – September 2nd (Every Wednesday)',
    isoDate: '2026-08-12T19:00:00',
    description: 'Structured 4-week tracks (Tier 1 Foundations $80, Tier 2 Progression $105, Tier 3 Unlimited $125) designed to elevate your social dancing confidence, technique, connection, and urban flow.',
    highlightText: '4-Week Tracks • Foundations ($80) • Progression ($105) • Unlimited ($125)',
    isFree: false,
    ctaText: 'Register for 4-Week Tracks'
  }
];

export const FAQ_DATA: FAQItem[] = [
  {
    question: 'Where can I learn bachata in Tampa?',
    answer: 'You can learn Bachata in Tampa at AI Urbano, located inside Dance Factory at WestShore Plaza Mall (334 Westshore Plaza A10, Tampa, FL 33609). Conveniently serving South Tampa, Ybor City, Brandon, Riverview, and St. Pete, AI Urbano offers weekly Wednesday evening classes for absolute beginners through advanced dancers with free mall parking.',
    category: 'Location'
  },
  {
    question: 'How much do bachata classes cost in Tampa?',
    answer: 'At AI Urbano in Tampa, single drop-in Bachata classes cost $20 per session. For maximum value, structured 4-week membership tracks start at $80 for Foundations Track, $105 for Progression Track, and $125 for Unlimited Track. All membership tracks include monthly practice social access, social admission discounts, and private lesson perks.',
    category: 'Pricing'
  },
  {
    question: 'Do I need a partner to take bachata classes?',
    answer: 'No partner is needed to attend Bachata classes in Tampa at AI Urbano. Students systematically rotate partners throughout class, allowing everyone to practice leading and following with multiple dancers in a welcoming social environment. If you attend with a partner and prefer not to rotate, simply inform the instructor.',
    category: 'Classes'
  },
  {
    question: 'Is bachata hard to learn for beginners?',
    answer: 'Bachata is one of the most accessible and fun Latin dances for beginners to learn! Built on a clear 8-count rhythm and simple step pattern, complete beginners can master fundamental timing, frame, and turns within their first few classes under structured instruction with instructors Albina & Isaac in Tampa.',
    category: 'Classes'
  },
  {
    question: 'What should I wear to a bachata class?',
    answer: 'Wear comfortable, breathable athletic apparel or casual streetwear that allows easy movement. Smooth-soled sneakers, jazz shoes, or leather-bottom dance shoes are recommended for effortless pivots on hardwood floors. Avoid heavy boots, rubber-soled shoes with excessive grip, or restrictively tight clothing.',
    category: 'General'
  },
  {
    question: 'How long does it take to learn bachata?',
    answer: 'Most beginners learn basic Bachata timing and core lead/follow connections within 1 to 2 classes. Completing a structured 4-week progressive track develops strong social dancing confidence, body isolations, and partner turns, while 2 to 3 months of consistent practice yields smooth, creative flow on the social dance floor.',
    category: 'General'
  },
  {
    question: 'Where is Dance Factory located inside WestShore Plaza Mall?',
    answer: 'Dance Factory is located inside WestShore Plaza Mall at suite A10 (334 Westshore Plaza A10, Tampa, FL 33609). Park in the main mall lot near the Dance Factory exterior entrance or mall wing for easy access.',
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
