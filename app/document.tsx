import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Meta tags for better SEO and social sharing */}
        <meta name="application-name" content="EchoVerse" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EchoVerse" />
        <meta
          name="description"
          content="A decentralized pay-per-second music streaming platform powered by MegaETH blockchain technology"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="EchoVerse | Decentralized Music Streaming" />
        <meta
          property="og:description"
          content="A decentralized pay-per-second music streaming platform powered by MegaETH blockchain technology"
        />
        <meta property="og:site_name" content="EchoVerse" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="EchoVerse | Decentralized Music Streaming" />
        <meta
          name="twitter:description"
          content="A decentralized pay-per-second music streaming platform powered by MegaETH blockchain technology"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />

        {/* Preload critical fonts */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

