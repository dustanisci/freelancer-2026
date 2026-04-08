/**
 * counter.ts — Animação de contagem numérica (count-up)
 */

import anime from 'animejs'

export function animateCounter(el: Element | null, target: number, duration = 1800): void {
  if (!el) return
  const obj = { val: 0 }
  anime({
    targets: obj,
    val: target,
    round: 1,
    duration,
    easing: 'easeOutExpo',
    update() {
      el.textContent = String(Math.round(obj.val))
    },
  })
}
