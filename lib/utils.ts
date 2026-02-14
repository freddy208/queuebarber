// Utilitaires

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatWaitTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

export function formatPhoneNumber(phone: string): string {
  // Format pour Cameroun : +237 6XX XX XX XX
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('237')) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith('6')) {
    return `+237${cleaned}`;
  }
  return phone;
}

export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  // Numéro camerounais : 9 chiffres commençant par 6
  return /^6\d{8}$/.test(cleaned);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bonjour';
  if (hour < 18) return 'Bon après-midi';
  return 'Bonsoir';
}