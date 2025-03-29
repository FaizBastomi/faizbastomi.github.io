import '@/styles/globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Footer from './components/Footer';

const JakartaSans = Plus_Jakarta_Sans({
  display: 'swap',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export default function App({ Component, pageProps }) {
  return (
    <div className={JakartaSans.className}>
      <Component {...pageProps} />
      <Footer />
    </div>
  );
}
