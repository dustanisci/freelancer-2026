import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { initNavbar } from '../../shared/navbar'

vi.mock('bootstrap', () => ({
  Offcanvas: {
    getOrCreateInstance: vi.fn(() => ({ hide: vi.fn() })),
  },
}))

// Helper to override window.scrollY (read-only in browsers)
const setScrollY = (y: number) => {
  Object.defineProperty(window, 'scrollY', { get: () => y, configurable: true })
}

describe('initNavbar — early return', () => {
  it('does not throw when #mainNav is absent', () => {
    document.body.innerHTML = ''
    expect(() => initNavbar()).not.toThrow()
  })
})

describe('initNavbar — scrolled class', () => {
  beforeEach(() => {
    document.body.innerHTML = '<nav id="mainNav"></nav>'
    setScrollY(0)
  })

  afterEach(() => {
    // Reset scrollY to 0 after each test
    setScrollY(0)
  })

  it('does not add .scrolled when scrollY is 0 on init', () => {
    initNavbar()
    expect(document.getElementById('mainNav')).not.toHaveClass('scrolled')
  })

  it('adds .scrolled when scrollY > 40 on init', () => {
    setScrollY(100)
    initNavbar()
    expect(document.getElementById('mainNav')).toHaveClass('scrolled')
  })

  it('adds .scrolled when scroll event fires with scrollY > 40', () => {
    initNavbar()
    setScrollY(80)
    window.dispatchEvent(new Event('scroll'))
    expect(document.getElementById('mainNav')).toHaveClass('scrolled')
  })

  it('removes .scrolled when scroll event fires with scrollY ≤ 40', () => {
    setScrollY(100)
    initNavbar()
    setScrollY(10)
    window.dispatchEvent(new Event('scroll'))
    expect(document.getElementById('mainNav')).not.toHaveClass('scrolled')
  })

  it('adds .scrolled exactly at the boundary (scrollY = 41)', () => {
    setScrollY(41)
    initNavbar()
    expect(document.getElementById('mainNav')).toHaveClass('scrolled')
  })

  it('does not add .scrolled at boundary scrollY = 40', () => {
    setScrollY(40)
    initNavbar()
    expect(document.getElementById('mainNav')).not.toHaveClass('scrolled')
  })
})

describe('initNavbar — active links', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <nav id="mainNav">
        <a class="nav-link" href="#inicio">Início</a>
        <a class="nav-link" href="#servicos">Serviços</a>
      </nav>
      <section id="inicio"></section>
      <section id="servicos"></section>
    `
    setScrollY(0)
    initNavbar()
  })

  it('does not throw when scroll event fires', () => {
    expect(() => window.dispatchEvent(new Event('scroll'))).not.toThrow()
  })
})

describe('initNavbar — offcanvas sidebar', () => {
  it('does not throw when #navSidebar is absent', () => {
    document.body.innerHTML = '<nav id="mainNav"></nav>'
    expect(() => initNavbar()).not.toThrow()
  })

  it('sets up click listeners on .offcanvas-nav-link elements', () => {
    document.body.innerHTML = `
      <nav id="mainNav"></nav>
      <div id="navSidebar">
        <a class="offcanvas-nav-link" href="#inicio">Início</a>
        <a class="offcanvas-nav-link" href="#servicos">Serviços</a>
      </div>
      <section id="inicio"></section>
    `
    expect(() => initNavbar()).not.toThrow()
  })

  it('calls offcanvas.hide() when a sidebar link is clicked', async () => {
    const { Offcanvas } = await import('bootstrap')
    const hideMock = vi.fn()
    vi.mocked(Offcanvas.getOrCreateInstance).mockReturnValue({ hide: hideMock } as never)

    document.body.innerHTML = `
      <nav id="mainNav"></nav>
      <div id="navSidebar">
        <a class="offcanvas-nav-link" href="#inicio">Início</a>
      </div>
      <section id="inicio"></section>
    `
    initNavbar()
    document.querySelector<HTMLAnchorElement>('.offcanvas-nav-link')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(hideMock).toHaveBeenCalledOnce()
  })

  it('scrolls to target section after hidden.bs.offcanvas fires', async () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)

    const { Offcanvas } = await import('bootstrap')
    const hideMock = vi.fn()
    vi.mocked(Offcanvas.getOrCreateInstance).mockReturnValue({ hide: hideMock } as never)

    document.body.innerHTML = `
      <nav id="mainNav"></nav>
      <div id="navSidebar">
        <a class="offcanvas-nav-link" href="#servicos">Serviços</a>
      </div>
      <section id="servicos"></section>
    `
    initNavbar()

    // Click the link to store pendingHash and trigger hide
    document.querySelector<HTMLAnchorElement>('.offcanvas-nav-link')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }))

    // Fire the hidden event that Bootstrap would emit
    document.getElementById('navSidebar')!.dispatchEvent(new Event('hidden.bs.offcanvas'))

    // requestAnimationFrame callback fires synchronously in jsdom
    await new Promise(resolve => requestAnimationFrame(resolve))

    expect(scrollToSpy).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'smooth' }))
    scrollToSpy.mockRestore()
  })
})
