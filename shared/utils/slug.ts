export const slug = (name: string) =>
  String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
