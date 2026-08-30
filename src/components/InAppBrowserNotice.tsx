import React, { useEffect, useState } from 'react';
import { ExternalLink, Copy, Check, X } from 'lucide-react';

// The "in-app browsers" that social apps open links in (Instagram, Facebook,
// TikTok, etc.) are webviews that don't fully support Apple Pay / Google Pay's
// inline payment sheet. Inside them, wallet checkout falls back to a clunky
// separate page. When we detect one, we gently nudge the visitor to reopen the
// site in their real browser (Chrome / Safari), where checkout is smooth.
const IN_APP_SIGNATURES = [
  'Instagram',
  'FBAN', 'FBAV', 'FB_IAB', 'FBIOS', // Facebook family
  'Messenger',
  'BytedanceWebview', 'musical_ly', 'TikTok', 'Trill', // TikTok family
  'Snapchat',
  'LinkedInApp',
  'Pinterest',
  'Line/',
  'Twitter',
];

function detectInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return IN_APP_SIGNATURES.some((sig) => ua.includes(sig));
}

export const InAppBrowserNotice: React.FC = () => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  // User-agent is only readable on the client, so decide after mount.
  useEffect(() => {
    setShow(detectInAppBrowser());
  }, []);

  const handleCopy = async () => {
    const url = window.location.href;
    let ok = false;
    try {
      await navigator.clipboard.writeText(url);
      ok = true;
    } catch {
      // Fallback for older webviews without the async clipboard API.
      try {
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand('copy');
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!show || dismissed) return null;

  return (
    <div className="fixed inset-x-0 top-20 sm:top-24 z-[60] px-3 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="pointer-events-auto mx-auto max-w-md liquid-glass-panel-dark rounded-2xl border border-white/15 shadow-2xl px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center">
            <ExternalLink className="w-4 h-4 text-red-400" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white leading-snug">
              Open in your browser for smooth checkout
            </p>
            <p className="text-xs text-slate-400 mt-0.5 leading-snug">
              You&apos;re in an in-app browser. Apple&nbsp;Pay &amp; Google&nbsp;Pay work best in Chrome or Safari &mdash; tap the{' '}
              <span className="font-semibold text-slate-200">&#8943;</span> menu and choose{' '}
              <span className="font-semibold text-slate-200">&ldquo;Open in browser&rdquo;</span>, or copy the link.
            </p>

            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-3 py-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Link copied' : 'Copy link'}
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="text-xs font-medium text-slate-400 hover:text-slate-200 px-2 py-1.5 transition-colors"
              >
                Not now
              </button>
            </div>
          </div>

          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="flex-shrink-0 -mt-0.5 -mr-1 p-1 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
