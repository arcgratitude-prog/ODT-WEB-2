import React from 'react';
import { 
  Receipt, 
  CreditCard, 
  Tag, 
  ShieldCheck, 
  Clock, 
  FileText,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { TicketData } from '../../types/digitalPass';

interface OrderSummaryProps {
  ticket: TicketData;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ ticket }) => {
  const subtotal = ticket.price * ticket.quantity;
  const discount = ticket.discountApplied ? ticket.discountApplied.amount : 0;
  const grandTotal = subtotal - discount + ticket.processingFee;

  return (
    <div id="odt-order-receipt-card" className="bg-[#141026] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-fuchsia-500/15 border border-fuchsia-500/30 text-fuchsia-400">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Syne'] text-lg font-bold text-white">
              Order Receipt & Payment Breakdown
            </h3>
            <p className="text-xs text-white/50">
              Processed securely via Stripe & Apple Pay
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Paid in Full
        </span>
      </div>

      {/* Itemized Table */}
      <div className="space-y-3 text-sm">
        {/* Ticket Item */}
        <div className="flex items-center justify-between py-2 border-b border-white/5">
          <div className="space-y-0.5">
            <p className="font-semibold text-white">
              {ticket.eventName}
            </p>
            <p className="text-xs text-white/50">
              Tier: <span className="text-fuchsia-400 font-medium">{ticket.tierName}</span> • Qty: {ticket.quantity}
            </p>
          </div>
          <span className="font-mono font-bold text-white">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        {/* Promo Discount if applicable */}
        {ticket.discountApplied && (
          <div className="flex items-center justify-between py-2 border-b border-white/5 text-emerald-400">
            <div className="flex items-center gap-1.5 text-xs">
              <Tag className="w-3.5 h-3.5" />
              <span>Promo Applied ({ticket.discountApplied.code})</span>
            </div>
            <span className="font-mono font-bold">
              -${ticket.discountApplied.amount.toFixed(2)}
            </span>
          </div>
        )}

        {/* Processing & Facility Fee */}
        <div className="flex items-center justify-between py-2 border-b border-white/5 text-white/60 text-xs">
          <span>Ticketing Service & Studio Facility Fee</span>
          <span className="font-mono">${ticket.processingFee.toFixed(2)}</span>
        </div>

        {/* Grand Total */}
        <div className="flex items-center justify-between pt-3 text-base sm:text-lg font-bold">
          <span className="text-white">Total Amount Charged:</span>
          <span className="font-mono text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-amber-300 text-xl">
            ${grandTotal.toFixed(2)} USD
          </span>
        </div>
      </div>

      {/* Payment Method & Transaction Info */}
      <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="bg-black/30 p-3.5 rounded-2xl border border-white/5 space-y-1">
          <p className="text-white/50 uppercase tracking-wider font-bold text-[10px]">
            Payment Method
          </p>
          <div className="flex items-center gap-2 text-white font-medium">
            <CreditCard className="w-4 h-4 text-fuchsia-400" />
            <span>Card via Stripe</span>
          </div>
          <p className="text-[11px] text-white/40 font-mono">
            Transaction Ref: {ticket.orderNumber}
          </p>
        </div>

        <div className="bg-black/30 p-3.5 rounded-2xl border border-white/5 space-y-1">
          <p className="text-white/50 uppercase tracking-wider font-bold text-[10px]">
            Billing Information
          </p>
          <p className="text-white font-medium">
            {ticket.attendeeName}
          </p>
          <p className="text-white/50 text-[11px]">
            {ticket.attendeeEmail}
          </p>
        </div>
      </div>

      {/* Perks included */}
      <div className="mt-5 bg-gradient-to-r from-violet-950/30 to-fuchsia-950/30 border border-fuchsia-500/20 rounded-2xl p-4">
        <p className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Included in your pass:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/80">
          {ticket.perks.map((perk, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 shrink-0" />
              <span>{perk}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
