import Script from 'next/script'

// Google Analytics 4. The measurement ID is public, it is set in `.env.production` so local dev
// (`pnpm dev`) is never tracked. Page views on client-side navigation are picked up by GA's
// enhanced measurement (browser history events), so no router hook is needed
const gaId = process.env.NEXT_PUBLIC_GA_ID

export function Analytics() {
  if (!gaId) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
      </Script>
    </>
  )
}
