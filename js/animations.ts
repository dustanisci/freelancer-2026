/**
 * animations.ts — Todas as animações AnimeJS
 * Responsabilidades: hero entrance, floats de robôs, FAB, decorações
 */

import anime from 'animejs'

export function animateNavbar(): void {
  anime({
    targets: '#mainNav',
    translateY: [-30, 0],
    opacity: [0, 1],
    duration: 700,
    easing: 'easeOutExpo',
    delay: 100,
  })
}

export function animateHero(): void {
  const tl = anime.timeline({ easing: 'easeOutExpo' })

  tl.add({ targets: '#hero-pretitle', opacity: [0, 1], translateY: [-20, 0], duration: 600 })
    .add({ targets: '.title-line', opacity: [0, 1], translateY: [40, 0], duration: 700, delay: anime.stagger(120), easing: 'easeOutBack' }, '-=200')
    .add({ targets: '#hero-subtitle', opacity: [0, 1], translateY: [20, 0], duration: 600 }, '-=300')
    .add({ targets: '#hero-ctas', opacity: [0, 1], translateY: [20, 0], duration: 600 }, '-=300')
    .add({ targets: '#heroRobot', opacity: [0, 1], scale: [0.85, 1], duration: 800, easing: 'easeOutBack' }, '-=500')

  anime({ targets: '.gear-deco', opacity: [0, 1], duration: 1200, easing: 'easeOutCubic', delay: 600 })
  anime({ targets: '.lightning-hero', opacity: [0, 0.10], translateX: [-30, 0], duration: 900, easing: 'easeOutCubic', delay: 800 })
}

export function animateHeroRobotFloat(): void {
  anime({
    targets: '#heroRobot',
    translateY: [0, -18],
    duration: 2800,
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine',
  })
}

interface RobotConfig {
  selector: string
  amplitude: number
  duration: number
  delay: number
}

export function animateDecorativeRobots(): void {
  const robots: RobotConfig[] = [
    { selector: '.robot-services-left', amplitude: 14, duration: 3200, delay: 0 },
    { selector: '.robot-about-right',   amplitude: 12, duration: 3600, delay: 300 },
    { selector: '.robot-about-left',    amplitude: 10, duration: 4000, delay: 200 },
    { selector: '.robot-stats-right',   amplitude: 16, duration: 3000, delay: 100 },
    { selector: '.robot-contact-left',  amplitude: 13, duration: 3400, delay: 400 },
    { selector: '.lightning-stats',     amplitude: 8,  duration: 2600, delay: 0 },
  ]

  robots.forEach(({ selector, amplitude, duration, delay }) => {
    const el = document.querySelector(selector)
    if (!el) return
    anime({ targets: el, translateY: [0, -amplitude], duration, direction: 'alternate', loop: true, easing: 'easeInOutSine', delay })
  })
}

export function animateFAB(): void {
  anime({ targets: '.whatsapp-fab', opacity: [0, 1], scale: [0.5, 1], duration: 700, easing: 'easeOutBack', delay: 2000 })
}

export function animateServicesRobot(): void {
  anime({ targets: '.robot-services-left', opacity: [0, 1], translateX: [-20, 0], duration: 1000, easing: 'easeOutExpo', delay: 500 })
}
