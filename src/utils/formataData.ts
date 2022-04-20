export function formatDate(date: string, format: string): string {
  return new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}
