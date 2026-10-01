import '@/app/globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { config } from '@fortawesome/fontawesome-svg-core';
import Footer from '@/components/Footer';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

const JakartaSans = Plus_Jakarta_Sans({
  display: 'swap',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata = {
  title: 'FaizBastomi | Portfolio',
  metadataBase: new URL('https://faizdev.my.id/'),
  openGraph: {
    url: 'https://faizdev.my.id/',
    title: 'FaizBastomi | Portfolio',
    type: 'website',
    images: ['/image/profile.jpg'],
  },
  icons: {
    icon: [
      { url: '/image/favicon_16.jpg', sizes: '16x16', type: 'image/jpeg' },
      { url: '/image/favicon_32.jpg', sizes: '32x32', type: 'image/jpeg' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={JakartaSans.className}>
      <body className="antialiased">
        {children}
        <Footer />
      </body>
    </html>
  );
}
