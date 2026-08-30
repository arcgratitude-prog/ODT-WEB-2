import { TicketData } from '../types/digitalPass';

export const EVENT_PRESETS: TicketData[] = [
  {
    id: 'bachata-invasion-01',
    orderNumber: 'ODT-94821-FL',
    eventName: 'Bachata Invasion: Tampa Edition',
    subtitle: 'Pre-Social Workshop & Late Night Latin Social',
    category: 'Social',
    tierName: 'VIP WORKSHOP + SOCIAL PASS',
    attendeeName: 'Alex Rivera',
    attendeeEmail: 'arcgratitude@gmail.com',
    date: 'Friday, September 18, 2026',
    time: '8:30 PM - 3:00 AM EDT',
    doorsOpen: '8:00 PM',
    venueName: 'The Dance Factory Tampa (ODT Main Studio)',
    venueAddress: '13936 N Dale Mabry Hwy',
    cityState: 'Tampa, FL 33618',
    instructors: ['Albina & Antonio', 'Special Guest Artists'],
    dj: 'DJ Mike Calderon & DJ Charun',
    price: 35.00,
    quantity: 1,
    discountApplied: {
      code: 'WEEKEND-PASS-PROMO',
      amount: 5.00,
    },
    processingFee: 2.25,
    total: 32.25,
    qrCodeUrl: 'https://officialdancetheory.com/verify/ODT-94821',
    barcodeNumber: '8492049182390192',
    gateSection: 'MAIN ENTRANCE / VIP FAST-TRACK',
    seatOrLevel: 'ALL LEVELS WELCOME (NO PARTNER REQUIRED)',
    passColorTheme: 'vibrant',
    curriculum: [
      'Sensual Bachata Body Waves & Isolations',
      'Modern Footwork & Syncopated Combinations',
      'Smooth Lead-Follow Connection & Musicality',
      'Social Floor Etiquette & Confidence Boosters'
    ],
    schedule: [
      {
        time: '8:00 PM',
        title: 'Doors Open & Check-in',
        description: 'Grab wristbands, complimentary welcome drink, and warm up.'
      },
      {
        time: '8:30 PM - 9:30 PM',
        title: 'Sensual Bachata Intensive Workshop',
        description: 'Led by Albina & Antonio. Breaking down partner connection & headrolls.'
      },
      {
        time: '9:30 PM - 10:00 PM',
        title: 'Modern Footwork & Styling Lab',
        description: 'Sharpen your rhythm, turns, and musicality with live percussion breaks.'
      },
      {
        time: '10:00 PM - 3:00 AM',
        title: 'Non-Stop Social Dancing Party',
        description: '80% Sensual/Traditional Bachata, 20% Salsa & Zouk with DJ Mike Calderon.'
      }
    ],
    perks: [
      'Guaranteed entry with express QR gate scan',
      'Full access to 90-min master workshop',
      'Social dancing access until 3:00 AM',
      'Complimentary coat check & hydration station',
      'Includes entry discount to Sunday Bachata Locura'
    ]
  },
  {
    id: 'bachata-course-7week',
    orderNumber: 'ODT-77290-ACAD',
    eventName: '7-Week Bachata Mastery Course',
    subtitle: 'From Foundations to Sensual Musicality & Social Mastery',
    category: 'Course',
    tierName: '7-WEEK FULL ACADEMY PASS',
    attendeeName: 'Alex Rivera',
    attendeeEmail: 'arcgratitude@gmail.com',
    date: 'Starts Tuesday, Oct 6, 2026 (7 Weeks)',
    time: '7:30 PM - 9:30 PM (Every Tuesday)',
    doorsOpen: '7:15 PM',
    venueName: 'Official Dance Theory Academy Studios',
    venueAddress: '13936 N Dale Mabry Hwy',
    cityState: 'Tampa, FL 33618',
    instructors: ['Isaac & Albina', 'ODT Pro Team'],
    dj: 'ODT Live Rhythm Audio',
    price: 185.00,
    quantity: 1,
    discountApplied: {
      code: 'EARLYBIRD-BACHATA',
      amount: 25.00,
    },
    processingFee: 4.50,
    total: 164.50,
    qrCodeUrl: 'https://officialdancetheory.com/academy/ODT-77290',
    barcodeNumber: '9920194820194811',
    gateSection: 'STUDIO A / DANCE THEORY LAB',
    seatOrLevel: 'LEVEL 1-3 PROGRESSIVE COHORT',
    passColorTheme: 'holographic',
    curriculum: [
      'Week 1-2: Timing, Rhythm Mechanics, Basic Frame & Lead/Follow Dynamics',
      'Week 3-4: Sensual Isolations, Chest Rolls, Camel Walks & Body Rolls',
      'Week 5: Shadow Position, Prep turns, Dips & Safe Counterbalances',
      'Week 6: Musicality Breakdown: Guitar Requinto, Bongo, Guira & Bass',
      'Week 7: Social Fluency, Floorcraft, Styling & Graduation Showcase'
    ],
    schedule: [
      {
        time: '7:15 PM',
        title: 'Studio Check-in & Warmups',
        description: 'Meet your class cohort and practice footwork warmups.'
      },
      {
        time: '7:30 PM - 8:30 PM',
        title: 'Technique & Concept Deep Dive',
        description: 'In-depth breakdown of body mechanics and partner connection.'
      },
      {
        time: '8:30 PM - 9:30 PM',
        title: 'Guided Social Practica & Feedback',
        description: 'Apply moves with rotation and personalized feedback from instructors.'
      }
    ],
    perks: [
      'Includes 14 hours of in-person studio instruction',
      'Free admission to all Friday Bachata Invasion socials during the term',
      'Access to private video recap library & music playlists',
      'Official Certificate of Completion from Dance Theory'
    ]
  },
  {
    id: 'bachata-locura-vip',
    orderNumber: 'ODT-33910-LOC',
    eventName: 'Bachata Locura: Sunday Rooftop Social',
    subtitle: 'Sunset Latin Vibes, Cocktails & Sensual Rhythms',
    category: 'VIP',
    tierName: 'ALL-ACCESS VIP LOUNGE PASS',
    attendeeName: 'Alex Rivera',
    attendeeEmail: 'arcgratitude@gmail.com',
    date: 'Sunday, September 20, 2026',
    time: '6:00 PM - 12:00 AM EDT',
    doorsOpen: '5:30 PM',
    venueName: 'The Godfrey Rooftop & ODT Sunset Deck',
    venueAddress: '7700 W Courtney Campbell Cswy',
    cityState: 'Tampa, FL 33607',
    instructors: ['ODT Guest Artists', 'Albina & Antonio'],
    dj: 'DJ Charun & Guest DJ Sol',
    price: 45.00,
    quantity: 1,
    processingFee: 2.50,
    total: 47.50,
    qrCodeUrl: 'https://officialdancetheory.com/vip/ODT-33910',
    barcodeNumber: '7712390192837102',
    gateSection: 'ROOFTOP VIP ACCESS ELEVATOR',
    seatOrLevel: 'RESERVED VIP SEATING AREA',
    passColorTheme: 'ruby',
    curriculum: [
      'Sunset Body Movement & Sensual Dips Workshop',
      'Rooftop Socializing & Partner Connection Drills',
      'Live Percussion Jam Session'
    ],
    schedule: [
      {
        time: '5:30 PM',
        title: 'VIP Early Entry & Sunset Welcome Cocktail',
        description: 'Enjoy panoramic sunset views of Tampa Bay with complimentary drink.'
      },
      {
        time: '6:30 PM - 7:30 PM',
        title: 'Sunset Sensual Workshop',
        description: 'Fun, dynamic sensual styling and smooth combinations for all levels.'
      },
      {
        time: '7:30 PM - 12:00 AM',
        title: 'Rooftop Bachata & Salsa Social',
        description: 'Dance under the stars with Tampa’s top dancers and guest DJs.'
      }
    ],
    perks: [
      'VIP priority elevator & lounge seating access',
      '1 Complimentary welcome signature cocktail or mocktail',
      'Workshop admission + professional event photos access',
      'Dedicated VIP bar line'
    ]
  },
  {
    id: 'weekend-dance-deal',
    orderNumber: 'ODT-55102-TRIO',
    eventName: 'Tampa Weekend Dance Tri-Pass',
    subtitle: 'Buy 2 Get 1 Free: Friday Invasion + Saturday Tropical + Sunday Locura',
    category: 'Festival',
    tierName: '3-DAY WEEKEND ACCESS PASS',
    attendeeName: 'Alex Rivera & Partner',
    attendeeEmail: 'arcgratitude@gmail.com',
    date: 'Sept 18 - Sept 20, 2026 (Full Weekend)',
    time: 'Fri 8:30 PM | Sat 9:00 PM | Sun 6:00 PM',
    doorsOpen: '30 mins before each event',
    venueName: 'ODT Venues (Tampa Dance Factory & Godfrey Deck)',
    venueAddress: 'Multiple Locations',
    cityState: 'Tampa, FL',
    instructors: ['Full ODT Instructor Team & Special Guests'],
    dj: 'DJ Mike Calderon, DJ Charun, DJ Sol',
    price: 85.00,
    quantity: 1,
    discountApplied: {
      code: 'BUY2-GET1-FREE',
      amount: 25.00,
    },
    processingFee: 3.50,
    total: 63.50,
    qrCodeUrl: 'https://officialdancetheory.com/pass/ODT-55102',
    barcodeNumber: '5510293810293847',
    gateSection: 'ALL VENUES / FAST PASS ENTRY',
    seatOrLevel: 'FULL ACCESS 3-DAY BUNDLE',
    passColorTheme: 'obsidian',
    curriculum: [
      '3 Workshops across Friday, Saturday & Sunday',
      'Mastering Sensual Bachata, Salsa on2, and Dominican Footwork'
    ],
    schedule: [
      {
        time: 'Friday 8:30 PM',
        title: 'Day 1: Bachata Invasion Workshop & Social (The Dance Factory)',
        description: 'Kickoff night dancing until 3 AM.'
      },
      {
        time: 'Saturday 9:00 PM',
        title: 'Day 2: Tropical Saturday Latin Night (Main Ballroom)',
        description: 'Salsa, Bachata, and Merengue party.'
      },
      {
        time: 'Sunday 6:00 PM',
        title: 'Day 3: Bachata Locura Sunset Rooftop Social (The Godfrey)',
        description: 'Sunset finale on Tampa Bay.'
      }
    ],
    perks: [
      'Full 3-day admission to all 3 events & workshops',
      'Saves $30+ over individual door tickets',
      'Universal QR wristband valid at all gates'
    ]
  }
];
