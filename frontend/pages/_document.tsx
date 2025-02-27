// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Global Metadata */}
          <meta charSet="utf-8" />
          <meta name="description" content="NEUROCHAT: A secure, real-time communication platform powered by blockchain neural networks." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="keywords" content="chat, secure, real-time, blockchain, neural networks, Actix, Next.js, PostgreSQL" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
          <title>NEUROCHAT - Secure Real-time Communication</title>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
