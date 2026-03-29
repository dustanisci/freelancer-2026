/**
 * scroll-animations.ts — Reveal de elementos ao rolar a página
 * Responsabilidades: IntersectionObserver para cada seção
 */

import anime from 'animejs'
import { animateCounter } from './counter'
import { calcExpYears } from './utils'

type ObserveCallback = (entry: IntersectionObserverEntry) => void

function observe(
  el: Element | null,
  callback: ObserveCallback,
  options: IntersectionObserverInit = {}
): void {
  if (!el) return
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      callback(entry)
      observer.unobserve(entry.target)
    })
  }, options)
  observer.observe(el)
}

export function initScrollAnimations(): void {

  // Cards de serviços
  observe(document.getElementById('services-grid'), (entry) => {
    const cards = Array.from(entry.target.querySelectorAll<HTMLElement>('.service-item .service-card'))
    anime({
      targets: cards,
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 700,
      delay: anime.stagger(80),
      easing: 'easeOutExpo',
      complete() {
        // Clear inline transform so CSS :hover rule takes over cleanly
        cards.forEach(card => {
          card.style.removeProperty('transform')
          card.style.removeProperty('opacity')
          card.classList.add('anim-done')
        })
      },
    })
  }, { threshold: 0.08 })

  // Seção Sobre
  observe(document.getElementById('sobre'), () => {
    anime({ targets: '#sobre .about-avatar-wrapper', opacity: [0, 1], scale: [0.8, 1], duration: 800, easing: 'easeOutBack' })
    anime({ targets: ['#sobre .section-badge', '#sobre .section-title', '#sobre .about-text', '#sobre .about-tags'], opacity: [0, 1], translateX: [30, 0], duration: 700, delay: anime.stagger(100), easing: 'easeOutExpo' })
    anime({ targets: ['.robot-about-right', '.robot-about-left'], opacity: [0, 0.2], translateX: [20, 0], duration: 900, easing: 'easeOutExpo', delay: 300 })
    animateCounter(document.querySelector('.exp-years-counter'), calcExpYears(), 1800)
  }, { threshold: 0.15 })

  // Seção Diferenciais
  observe(document.getElementById('diferenciais'), () => {
    anime({ targets: '.diff-card', opacity: [0, 1], translateY: [30, 0], duration: 600, delay: anime.stagger(80), easing: 'easeOutExpo' })
    anime({ targets: ['.lightning-stats', '.robot-stats-right'], opacity: [0, 0.18], duration: 1000, easing: 'easeOutCubic', delay: 400 })
  }, { threshold: 0.1 })
  // Seção Contato
  observe(document.getElementById('contato'), () => {
    anime({ targets: '.contact-form', opacity: [0, 1], translateY: [40, 0], duration: 800, easing: 'easeOutExpo' })
    anime({ targets: '.robot-contact-left', opacity: [0, 0.2], translateX: [-20, 0], duration: 900, easing: 'easeOutExpo', delay: 300 })
  }, { threshold: 0.1 })
}
