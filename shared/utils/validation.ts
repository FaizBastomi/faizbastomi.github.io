export function requireUrl(value: string) {
  if (!value) return { error: 'GitHub URL is required' };
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return { error: 'GitHub URL is not a valid URL' };
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return { error: 'GitHub URL must start with http(s)://' };
  return url.href;
}

export function validateUrl(value: string) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return { error: 'URL is required' };
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return { error: 'URL is not a valid URL' };
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:' && url.protocol !== 'mailto:') {
    return { error: 'URL must start with http(s):// or mailto:' };
  }
  return url.href;
}

const OBJECT_ID = /^[0-9a-f]{24}$/i;
const MAX_ORDER = 500;

export const ids = (value: unknown) =>
  String(value ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter((id) => OBJECT_ID.test(id))
    .slice(0, MAX_ORDER);

export const move = <T>(list: T[], from: number, to: number): T[] => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};
