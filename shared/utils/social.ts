import {
  faGithub,
  faXTwitter,
  faTwitter,
  faLinkedin,
  faDiscord,
  faTelegram,
  faInstagram,
  faYoutube,
  faThreads,
  faTiktok,
  faTwitch,
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faGlobe, faShareNodes, faLink, faAt } from '@fortawesome/free-solid-svg-icons';

export const SOCIAL_PRESETS = [
  { name: 'GitHub', icon: 'github', defaultPrefix: 'https://github.com/' },
  { name: 'X / Twitter', icon: 'x-twitter', defaultPrefix: 'https://x.com/' },
  { name: 'LinkedIn', icon: 'linkedin', defaultPrefix: 'https://linkedin.com/in/' },
  { name: 'Discord', icon: 'discord', defaultPrefix: 'https://discord.gg/' },
  { name: 'Telegram', icon: 'telegram', defaultPrefix: 'https://t.me/' },
  { name: 'Email', icon: 'envelope', defaultPrefix: 'mailto:' },
  { name: 'Instagram', icon: 'instagram', defaultPrefix: 'https://instagram.com/' },
  { name: 'YouTube', icon: 'youtube', defaultPrefix: 'https://youtube.com/@' },
  { name: 'Website', icon: 'globe', defaultPrefix: 'https://' },
  { name: 'Custom', icon: 'link', defaultPrefix: 'https://' },
] as const;

export function getSocialIcon(iconName?: string | null) {
  const key = String(iconName || '')
    .toLowerCase()
    .trim();
  switch (key) {
    case 'github':
      return faGithub;
    case 'twitter':
      return faTwitter;
    case 'x':
    case 'xtwitter':
    case 'x-twitter':
      return faXTwitter;
    case 'linkedin':
      return faLinkedin;
    case 'discord':
      return faDiscord;
    case 'telegram':
      return faTelegram;
    case 'instagram':
      return faInstagram;
    case 'youtube':
      return faYoutube;
    case 'threads':
      return faThreads;
    case 'tiktok':
      return faTiktok;
    case 'twitch':
      return faTwitch;
    case 'email':
    case 'envelope':
    case 'mail':
      return faEnvelope;
    case 'website':
    case 'globe':
      return faGlobe;
    case 'share':
      return faShareNodes;
    case 'at':
      return faAt;
    default:
      return faLink;
  }
}
