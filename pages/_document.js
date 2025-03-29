import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta property="og:url" content="https://faizdev.my.id/" />
        <meta property="og:title" content="FaizBastomi | Portfolio" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/image/profile.jpg" />
        <link rel="icon" type="image/jpeg" sizes="16x16" href="/image/favicon_16.jpg" />
        <link rel="icon" type="image/jpeg" sizes="32x32" href="/image/favicon_32.jpg" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
