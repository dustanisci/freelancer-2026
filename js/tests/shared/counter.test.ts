import { describe, it, expect, vi, beforeEach } from 'vitest'
import { animateCounter } from '../../shared/counter'

// Immediately apply final value and invoke update() so the DOM is updated synchronously
vi.mock('animejs', () => ({
  default: vi.fn((opts: { targets: { val: number }; val: number; update?: () => void }) => {
    opts.targets.val = opts.val
    opts.update?.()
  }),
}))

describe('animateCounter', () => {
  beforeEach(() => {
    document.body.innerHTML = '<span id="counter">0</span>'
  })

  it('sets element textContent to target value', () => {
    const el = document.getElementById('counter')!
    animateCounter(el, 42)
    expect(el.textContent).toBe('42')
  })

  it('sets element textContent to zero', () => {
    const el = document.getElementById('counter')!
    animateCounter(el, 0)
    expect(el.textContent).toBe('0')
  })

  it('sets element textContent to large number', () => {
    const el = document.getElementById('counter')!
    animateCounter(el, 2500)
    expect(el.textContent).toBe('2500')
  })

  it('does not throw when el is null', () => {
    expect(() => animateCounter(null, 99)).not.toThrow()
  })

  it('accepts custom duration without throwing', () => {
    const el = document.getElementById('counter')!
    expect(() => animateCounter(el, 10, 500)).not.toThrow()
    expect(el.textContent).toBe('10')
  })
})
