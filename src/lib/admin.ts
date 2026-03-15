export function parseAdminEmails(raw: string | undefined): string[] {
  if (!raw) return [];

  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | undefined, adminEmails: string[]): boolean {
  if (!email) return false;
  return adminEmails.includes(email.trim().toLowerCase());
}
