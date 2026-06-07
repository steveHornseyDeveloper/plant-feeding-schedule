import type { UserSlug } from '@longstone/shared';

const STORAGE_KEY = 'longstone-current-user';

function uaPick(): UserSlug {
  if (typeof navigator === 'undefined') return 'alexa';
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return 'alexa';
  if (/Android/i.test(ua)) return 'stevie';
  return 'alexa';
}

export function detectUser(): UserSlug {
  if (typeof window === 'undefined') return 'alexa';
  const params = new URLSearchParams(window.location.search);
  const override = params.get('as');
  if (override === 'alexa' || override === 'stevie') {
    window.localStorage?.setItem(STORAGE_KEY, override);
    return override;
  }
  const stored = window.localStorage?.getItem(STORAGE_KEY);
  if (stored === 'alexa' || stored === 'stevie') return stored;
  const picked = uaPick();
  window.localStorage?.setItem(STORAGE_KEY, picked);
  return picked;
}
