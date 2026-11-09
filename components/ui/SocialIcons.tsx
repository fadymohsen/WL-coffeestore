import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

export function InstagramIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 21v-7.6h2.6l.4-3H13.5V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3H10.4V21h3.1Z" />
    </svg>
  );
}

export function TikTokIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.6 3h-3.1v11.6a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V8.9a5.7 5.7 0 1 0 4.9 5.6V9.3a6.9 6.9 0 0 0 4 1.3V7.5a4 4 0 0 1-4-4.5Z" />
    </svg>
  );
}
