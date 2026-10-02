import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, #10b981, #047857)',
          borderRadius: '112px',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
          <path d="M19 9h-4" />
          <path d="M19 9v4" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
