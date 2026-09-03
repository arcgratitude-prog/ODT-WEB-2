import React, { useEffect, useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { TicketData, ViewMode } from '../types/digitalPass';
import { PassNavbar } from './pass/PassNavbar';
import { Ticket3D } from './pass/Ticket3D';
import { EmailHeader } from './pass/EmailHeader';
import { OrderSummary } from './pass/OrderSummary';
import { EventDetails } from './pass/EventDetails';
import { WalletPassModal } from './pass/WalletPassModal';
import { CheckInSimulatorModal } from './pass/CheckInSimulatorModal';
import { CustomizerModal } from './pass/CustomizerModal';
import { downloadCalendarEvent } from '../utils/passCalendar';

interface RawBooking {
  ticketId: string;
  customerName: string;
  customerEmail: string;
  passName: string;
  passType: string | null;
  amountCents: number;
  classesIncluded: string | null;
}

// Maps a real booking record onto the TicketData shape the ported Stitch
// components expect. Every field here is either real data or an honest,
// clearly-labeled placeholder (e.g. "General Admission") — nothing here
// invents fake specifics like a discount, processing fee, or VIP section
// that doesn't actually exist in the current checkout system.
function bookingToTicketData(b: RawBooking): TicketData {
  const passNameLower = (b.passName || '').toLowerCase();
  const isLocura = passNameLower.includes('locura');
  const isInvasion = passNameLower.includes('invasion');
  const isX1 = passNameLower.includes('x1');
  const isSocialEvent = isLocura || isInvasion;
  const instructors = isX1 ? 'Albina & Antonio' : 'Albina & Isaac';

  let date: string, time: string, doorsOpen: string, schedule: TicketData['schedule'], dj: string, subtitle: string, category: TicketData['category'], passColorTheme: TicketData['passColorTheme'], curriculum: string[] | undefined;

  if (isLocura) {
    date = 'Sunday, September 20, 2026';
    time = '4:00 PM – 9:00 PM EDT';
    doorsOpen = '4:00 PM';
    dj = 'DJ JR';
    subtitle = 'Presocial Class & Pink/Purple Themed Social';
    category = 'Social';
    passColorTheme = 'obsidian';
    curriculum = undefined;
    schedule = [
      { time: '4:00 PM', title: 'Presocial Class with Albina & Isaac', description: 'All-levels class to warm up before the social.' },
      { time: '5:00 PM', title: 'Social Dancing Begins', description: 'Music by DJ JR.' },
      { time: '9:00 PM', title: 'Event Ends', description: '' },
    ];
  } else if (isInvasion) {
    date = 'Friday, September 11, 2026';
    time = '8:00 PM – 1:00 AM EDT';
    doorsOpen = '8:00 PM';
    dj = 'DJ JR';
    subtitle = 'Class & Late Night Social';
    category = 'Social';
    passColorTheme = 'vibrant';
    curriculum = undefined;
    schedule = [
      { time: '8:00 PM', title: 'Class with Albina & Isaac', description: '' },
      { time: '9:00 PM', title: 'Social Dancing Begins', description: 'Music by DJ JR.' },
      { time: '1:00 AM', title: 'Event Ends', description: '' },
    ];
  } else if (isX1) {
    // Private 90-minute session, recurring weekly for the Monthly pass or
    // a single one-time session for the Drop-In — no single event date.
    date = passNameLower.includes('monthly') ? 'Weekly — Private Session' : 'One-Time Private Session';
    time = b.classesIncluded || '90 Minutes';
    doorsOpen = 'N/A';
    dj = '';
    subtitle = '90-Minute Private Training';
    category = 'VIP';
    passColorTheme = 'gold';
    curriculum = ['Warm Up, Mobility, Isolation', 'Train, Concept, Movement, Apply'];
    schedule = [
      { time: '90 min', title: 'Private Session with Albina & Antonio', description: 'Dance Factory Tampa' },
    ];
  } else {
    // Weekly class pass (tier or drop-in) — recurring, no single event date.
    date = 'Ongoing — Weekly';
    time = b.classesIncluded || 'See class schedule';
    doorsOpen = 'N/A';
    dj = '';
    subtitle = b.classesIncluded ? `${b.classesIncluded} — Weekly Class Pass` : 'Weekly Class Pass';
    category = 'Course';
    passColorTheme = 'ruby';
    curriculum = ['Structured Urban Bachata curriculum', 'Video recaps after each class'];
    schedule = [
      { time: 'Weekly', title: b.classesIncluded || 'Class Session', description: 'Dance Factory Tampa' },
    ];
  }

  const perks = isLocura
    ? ['4 PM presocial class with Albina & Isaac', 'Full night of social dancing, 4–9 PM', 'Music by DJ JR', 'Pink & Purple dress theme']
    : isInvasion
    ? ['8–9 PM class with Albina & Isaac', 'Social dancing 9 PM–1 AM', 'Music by DJ JR']
    : isX1
    ? ['90 minutes of direct one-on-one coaching', 'Warm Up, Mobility, Isolation, Train, Concept, Movement, Apply', 'Personalized to your goals']
    : ['Structured Urban Bachata curriculum', 'Video recaps after each class', ...(b.classesIncluded ? [`Classes: ${b.classesIncluded}`] : [])];

  // Deterministic pseudo-barcode from the ticket ID — decorative only
  // (real check-in still uses staff name search, not this barcode).
  const barcodeNumber = Array.from(b.ticketId).map((c) => c.charCodeAt(0)).join('').slice(0, 16).padEnd(16, '0');

  // Once a dated social event has actually happened, its ticket isn't
  // something to show at a door for check-in anymore — the digital pass
  // page marks this clearly rather than looking identical to a still-
  // valid upcoming ticket. Tiers/drop-ins aren't tied to one single
  // calendar date the same way, so they don't get this treatment.
  let isPastEvent = false;
  if (isLocura) {
    isPastEvent = new Date('2026-09-20T21:00:00') < new Date();
  } else if (isInvasion) {
    isPastEvent = new Date('2026-09-12T01:00:00') < new Date();
  }

  return {
    id: b.ticketId,
    orderNumber: b.ticketId,
    eventName: isSocialEvent ? (isLocura ? 'Bachata Locura' : 'Bachata Invasion') : b.passName,
    subtitle,
    category,
    tierName: b.passName,
    attendeeName: b.customerName,
    attendeeEmail: b.customerEmail,
    date,
    time,
    doorsOpen,
    venueName: 'Dance Factory Tampa',
    venueAddress: '334 Westshore Plaza A10',
    cityState: 'Tampa, FL 33609',
    instructors: [instructors],
    dj,
    price: b.amountCents / 100,
    quantity: 1,
    discountApplied: undefined, // No promo/discount system exists currently — kept honest rather than faked.
    processingFee: 0, // No separate processing fee exists currently.
    total: b.amountCents / 100,
    qrCodeUrl: `https://officialdancetheory.com/?ticket=${encodeURIComponent(b.ticketId)}`,
    barcodeNumber,
    gateSection: 'Main Entrance',
    seatOrLevel: 'General Admission — No Assigned Seating',
    passColorTheme,
    curriculum,
    schedule,
    perks,
    isPastEvent,
  };
}

export const DigitalPassPage: React.FC<{ ticketId: string }> = ({ ticketId }) => {
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('stage3d');
  const [status, setStatus] = useState<'loading' | 'ready' | 'not_found' | 'error'>('loading');

  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/get-ticket?id=${encodeURIComponent(ticketId)}`);
        if (cancelled) return;
        if (res.status === 404) {
          setStatus('not_found');
          return;
        }
        if (!res.ok) {
          setStatus('error');
          return;
        }
        const data: RawBooking = await res.json();
        setTicket(bookingToTicketData(data));
        setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();
    return () => { cancelled = true; };
  }, [ticketId]);

  const handleDownloadCalendar = () => {
    if (!ticket) return;
    const added = downloadCalendarEvent(ticket);
    if (!added) {
      // Weekly class passes have no single date to add — nothing to do
      // silently rather than downloading a nonsense .ics file.
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-fuchsia-400 animate-spin" />
      </div>
    );
  }

  if (status === 'not_found') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-center px-6">
        <AlertTriangle className="w-10 h-10 text-amber-400 mb-4" />
        <p className="text-white text-lg font-bold">Ticket not found</p>
        <p className="text-white/50 text-sm mt-2">Double check the link from your confirmation email.</p>
      </div>
    );
  }

  if (status === 'error' || !ticket) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-center px-6">
        <AlertTriangle className="w-10 h-10 text-red-400 mb-4" />
        <p className="text-white text-lg font-bold">Something went wrong loading your pass.</p>
        <p className="text-white/50 text-sm mt-2">Please try again in a moment.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      <PassNavbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedTicket={ticket}
        onSelectPreset={setTicket}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenWallet={() => setIsWalletOpen(true)}
        onDownloadCalendar={handleDownloadCalendar}
      />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {ticket.isPastEvent && (
          <div className="mb-6 p-4 rounded-2xl bg-slate-800/60 border border-slate-700 text-center">
            <p className="text-sm font-bold text-slate-300">
              This event has already happened — this pass is no longer valid for entry.
            </p>
          </div>
        )}
        {viewMode === 'email' && (
          <div className="space-y-6">
            <EmailHeader
              ticket={ticket}
              onOpenWallet={() => setIsWalletOpen(true)}
              onDownloadCalendar={handleDownloadCalendar}
              onSimulateCheckIn={() => setIsCheckInOpen(true)}
            />
            <OrderSummary ticket={ticket} />
            <EventDetails ticket={ticket} />
          </div>
        )}

        {(viewMode === 'stage3d' || viewMode === 'print') && (
          <div className={`space-y-6 ${ticket.isPastEvent ? 'opacity-50 grayscale' : ''}`}>
            <Ticket3D
              ticket={ticket}
              isStageMode={viewMode === 'stage3d'}
              onOpenCheckIn={() => setIsCheckInOpen(true)}
              onOpenWallet={() => setIsWalletOpen(true)}
            />
            <OrderSummary ticket={ticket} />
            <EventDetails ticket={ticket} />
          </div>
        )}
      </main>

      <WalletPassModal ticket={ticket} isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
      <CheckInSimulatorModal ticket={ticket} isOpen={isCheckInOpen} onClose={() => setIsCheckInOpen(false)} />
      <CustomizerModal
        ticket={ticket}
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        onUpdateTicket={setTicket}
      />
    </div>
  );
};
