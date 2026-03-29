/**
 * main.ts — Entry point ESM (Vite)
 * Orquestra todos os módulos
 */

import { populateExpYears } from './utils'
import { initNavbar } from './navbar'
import {
  animateNavbar,
  animateHero,
  animateHeroRobotFloat,
  animateDecorativeRobots,
  animateFAB,
  animateServicesRobot,
} from './animations'
import { initScrollAnimations } from './scroll-animations'
import { initContactForm, initCardTilt, initCardClick } from './form.ts'

document.addEventListener('DOMContentLoaded', () => {
  // Habilita animações CSS (progressive enhancement)
  document.body.classList.add('js-anim')

  // Preenche anos de experiência e ano atual
  populateExpYears()

  // Navbar: scroll shrink + active + collapse mobile
  initNavbar()

  // Animações de entrada
  animateNavbar()
  animateHero()
  animateFAB()

  // Animações de scroll (IntersectionObserver)
  initScrollAnimations()

  // Formulário de contato + links WhatsApp dos cards
  initContactForm()

  // Whole-card click → WhatsApp
  initCardClick()

  // Efeito tilt 3D nos cards (mouse only)
  initCardTilt()

  // Animações de loop (float) — aguarda hero terminar
  setTimeout(() => {
    animateHeroRobotFloat()
    animateDecorativeRobots()
    animateServicesRobot()
  }, 1500)
})
