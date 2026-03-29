/**
 * navbar.ts — Comportamento da navbar
 * Responsabilidades: scroll shrink, active link, collapse mobile
 */

import { Offcanvas } from 'bootstrap'

// Ensure Offcanvas is referenced so the import isn't tree-shaken
void Offcanvas

export function initNavbar(): void {
  const nav = document.getElementById('mainNav')
  if (!nav) return

  // Scroll: add/remove .scrolled
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40)
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  // Active link baseado na seção visível
  const sections = document.querySelectorAll<HTMLElement>('section[id]')
  const links = document.querySelectorAll<HTMLAnchorElement>('#mainNav .nav-link[href^="#"]')

  window.addEventListener('scroll', () => {
    const y = window.scrollY + 90
    sections.forEach(section => {
      const isActive = y >= section.offsetTop && y < section.offsetTop + section.offsetHeight
      if (isActive) {
        links.forEach(link =>
          link.classList.toggle('active', link.getAttribute('href') === '#' + section.id)
        )
      }
    })
  }, { passive: true })

  // Offcanvas mobile: fecha o menu explicitamente e rola para a seção após o fechamento.
  const sidebar = document.getElementById('navSidebar')
  if (sidebar) {
    const offcanvas = Offcanvas.getOrCreateInstance(sidebar)
    let pendingHash: string | null = null

    sidebar.querySelectorAll<HTMLAnchorElement>('.offcanvas-nav-link[href^="#"]').forEach(link => {
      link.addEventListener('click', (e: Event) => {
        e.preventDefault()
        pendingHash = link.getAttribute('href')
        offcanvas.hide()
      })
    })

    sidebar.addEventListener('hidden.bs.offcanvas', () => {
      if (pendingHash) {
        const target = document.querySelector<HTMLElement>(pendingHash)
        pendingHash = null
        if (target) {
          requestAnimationFrame(() => {
            const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 72
            window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' })
          })
        }
      }
    })
  }

}
