export const slug = (name: string) =>
  String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

export const slugify = (text: string) =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
