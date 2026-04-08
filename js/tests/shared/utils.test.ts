import { describe, it, expect, beforeEach } from 'vitest'
import { calcExpYears, FORMATION_YEAR, populateExpYears } from '../../shared/utils'

describe('FORMATION_YEAR', () => {
  it('is 2011', () => {
    expect(FORMATION_YEAR).toBe(2011)
  })
})

describe('calcExpYears', () => {
  it('returns current year minus FORMATION_YEAR', () => {
    const expected = new Date().getFullYear() - FORMATION_YEAR
    expect(calcExpYears()).toBe(expected)
  })

  it('returns a positive number', () => {
    expect(calcExpYears()).toBeGreaterThan(0)
  })

  it('matches manually computed value', () => {
    expect(calcExpYears()).toBe(new Date().getFullYear() - 2011)
  })
})

describe('populateExpYears', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <span id="exp-years-hero"></span>
      <span id="exp-years-about"></span>
      <span id="footer-year"></span>
      <span id="diff-exp-years"></span>
    `
  })

  it('sets exp-years-hero to years of experience', () => {
    populateExpYears()
    expect(document.getElementById('exp-years-hero')!.textContent).toBe(String(calcExpYears()))
  })

  it('sets exp-years-about to years of experience', () => {
    populateExpYears()
    expect(document.getElementById('exp-years-about')!.textContent).toBe(String(calcExpYears()))
  })

  it('sets footer-year to current year', () => {
    populateExpYears()
    expect(document.getElementById('footer-year')!.textContent).toBe(
      String(new Date().getFullYear()),
    )
  })

  it('sets diff-exp-years to years of experience', () => {
    populateExpYears()
    expect(document.getElementById('diff-exp-years')!.textContent).toBe(String(calcExpYears()))
  })

  it('does not throw when elements are absent', () => {
    document.body.innerHTML = ''
    expect(() => populateExpYears()).not.toThrow()
  })

  it('skips missing elements gracefully', () => {
    document.body.innerHTML = '<span id="exp-years-hero"></span>'
    populateExpYears()
    expect(document.getElementById('exp-years-hero')!.textContent).toBe(String(calcExpYears()))
  })
})
