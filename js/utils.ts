/**
 * utils.ts — Cálculo dinâmico dos anos de experiência
 */

export const FORMATION_YEAR = 2011

export function calcExpYears(): number {
  return new Date().getFullYear() - FORMATION_YEAR
}

export function populateExpYears(): void {
  const years = calcExpYears()
  const currentYear = new Date().getFullYear()

  const ids: Record<string, number> = {
    'exp-years-hero': years,
    'exp-years-about': years,
    'footer-year': currentYear,
  }

  Object.entries(ids).forEach(([id, value]) => {
    const el = document.getElementById(id)
    if (el) el.textContent = String(value)
  })

  const diffExpEl = document.getElementById('diff-exp-years')
  if (diffExpEl) diffExpEl.textContent = String(years)
}
