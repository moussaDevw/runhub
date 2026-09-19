export function formatCFA(amount: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(amount)} F CFA`;
}
