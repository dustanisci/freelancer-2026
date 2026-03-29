import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { initContactForm, initCardClick, initCardTilt } from '../form'

// ─── Helpers ────────────────────────────────────────────────────────────────

function buildFormHTML(): string {
  return `
    <form id="contactForm">
      <input  id="contactName"    type="text" />
      <select id="contactService">
        <option value="">-- selecione --</option>
        <option value="site">Site</option>
        <option value="app">App</option>
      </select>
      <textarea id="contactMessage"></textarea>
      <button  id="submitBtn"     type="submit" disabled></button>
    </form>
  `
}

function setField(id: string, value: string, event: string): void {
  const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  el.value = value
  el.dispatchEvent(new Event(event, { bubbles: true }))
}

// ─── initContactForm — submit button state ──────────────────────────────────

describe('initContactForm — submit button state', () => {
  beforeEach(() => {
    document.body.innerHTML = buildFormHTML()
    initContactForm()
  })

  it('button starts disabled', () => {
    expect(document.getElementById('submitBtn')).toBeDisabled()
  })

  it('stays disabled with only name filled', () => {
    setField('contactName', 'Eduardo', 'input')
    expect(document.getElementById('submitBtn')).toBeDisabled()
  })

  it('stays disabled with only service filled', () => {
    setField('contactService', 'site', 'change')
    expect(document.getElementById('submitBtn')).toBeDisabled()
  })

  it('stays disabled with only message filled', () => {
    setField('contactMessage', 'Olá!', 'input')
    expect(document.getElementById('submitBtn')).toBeDisabled()
  })

  it('stays disabled with name + service but no message', () => {
    setField('contactName', 'Eduardo', 'input')
    setField('contactService', 'site', 'change')
    expect(document.getElementById('submitBtn')).toBeDisabled()
  })

  it('stays disabled with name + message but no service', () => {
    setField('contactName', 'Eduardo', 'input')
    setField('contactMessage', 'Olá!', 'input')
    expect(document.getElementById('submitBtn')).toBeDisabled()
  })

  it('stays disabled with service + message but no name', () => {
    setField('contactService', 'site', 'change')
    setField('contactMessage', 'Olá!', 'input')
    expect(document.getElementById('submitBtn')).toBeDisabled()
  })

  it('enables when all three fields are filled', () => {
    setField('contactName', 'Eduardo', 'input')
    setField('contactService', 'site', 'change')
    setField('contactMessage', 'Preciso de ajuda', 'input')
    expect(document.getElementById('submitBtn')).not.toBeDisabled()
  })

  it('disables again when name is cleared after all filled', () => {
    setField('contactName', 'Eduardo', 'input')
    setField('contactService', 'site', 'change')
    setField('contactMessage', 'Olá', 'input')
    setField('contactName', '', 'input')
    expect(document.getElementById('submitBtn')).toBeDisabled()
  })

  it('disables again when message is cleared after all filled', () => {
    setField('contactName', 'Eduardo', 'input')
    setField('contactService', 'site', 'change')
    setField('contactMessage', 'Olá', 'input')
    setField('contactMessage', '   ', 'input') // whitespace only
    expect(document.getElementById('submitBtn')).toBeDisabled()
  })
})

// ─── initContactForm — form submit ──────────────────────────────────────────

describe('initContactForm — form submit', () => {
  let openSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    document.body.innerHTML = buildFormHTML()
    initContactForm()
    openSpy = vi.spyOn(window, 'open').mockReturnValue(null)

    setField('contactName', 'Ana', 'input')
    setField('contactService', 'app', 'change')
    setField('contactMessage', 'Tenho interesse', 'input')
  })

  afterEach(() => {
    openSpy.mockRestore()
  })

  it('calls window.open on submit', () => {
    document.getElementById('contactForm')!.dispatchEvent(new Event('submit', { bubbles: true }))
    expect(openSpy).toHaveBeenCalledOnce()
  })

  it('opens a WhatsApp URL', () => {
    document.getElementById('contactForm')!.dispatchEvent(new Event('submit', { bubbles: true }))
    const url = openSpy.mock.calls[0][0] as string
    expect(url).toContain('wa.me/5511934967887')
  })

  it('URL contains encoded name', () => {
    document.getElementById('contactForm')!.dispatchEvent(new Event('submit', { bubbles: true }))
    const url = openSpy.mock.calls[0][0] as string
    expect(decodeURIComponent(url)).toContain('Ana')
  })

  it('URL contains encoded service', () => {
    document.getElementById('contactForm')!.dispatchEvent(new Event('submit', { bubbles: true }))
    const url = openSpy.mock.calls[0][0] as string
    expect(decodeURIComponent(url)).toContain('app')
  })

  it('opens with _blank and noopener', () => {
    document.getElementById('contactForm')!.dispatchEvent(new Event('submit', { bubbles: true }))
    expect(openSpy).toHaveBeenCalledWith(expect.any(String), '_blank', 'noopener noreferrer')
  })
})

// ─── initContactForm — data-wa-service links ─────────────────────────────────

describe('initContactForm — data-wa-service links', () => {
  let openSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    document.body.innerHTML = `
      ${buildFormHTML()}
      <a id="wa-link" href="#" data-wa-service="Site Landing Page">Contratar</a>
    `
    initContactForm()
    openSpy = vi.spyOn(window, 'open').mockReturnValue(null)
  })

  afterEach(() => {
    openSpy.mockRestore()
  })

  it('opens WhatsApp when a data-wa-service link is clicked', () => {
    document.getElementById('wa-link')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(openSpy).toHaveBeenCalledOnce()
  })

  it('URL includes the service name', () => {
    document.getElementById('wa-link')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    const url = decodeURIComponent(openSpy.mock.calls[0][0] as string)
    expect(url).toContain('Site Landing Page')
  })
})

// ─── initCardClick ────────────────────────────────────────────────────────────

describe('initCardClick', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="service-card">
        <span class="card-body">Conteúdo</span>
        <a class="service-cta" href="#">Contratar</a>
      </div>
    `
    initCardClick()
  })

  it('clicking card body triggers CTA click', () => {
    const ctaLink = document.querySelector<HTMLAnchorElement>('.service-cta')!
    const clickSpy = vi.spyOn(ctaLink, 'click')
    document.querySelector('.card-body')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(clickSpy).toHaveBeenCalledOnce()
  })

  it('clicking the CTA itself does not recursively call click()', () => {
    const ctaLink = document.querySelector<HTMLAnchorElement>('.service-cta')!
    const clickSpy = vi.spyOn(ctaLink, 'click')
    ctaLink.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(clickSpy).not.toHaveBeenCalled()
  })

  it('does not throw when service-card has no CTA', () => {
    document.body.innerHTML = '<div class="service-card"><span>text</span></div>'
    expect(() => initCardClick()).not.toThrow()
  })
})

// ─── initCardTilt ────────────────────────────────────────────────────────────

describe('initCardTilt', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(pointer: fine)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
    document.body.innerHTML = `
      <div class="service-card" style="width:200px;height:200px;"></div>
    `
  })

  it('does not throw when pointer is fine', () => {
    expect(() => initCardTilt()).not.toThrow()
  })

  it('does not throw when pointer is coarse (touch device)', () => {
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    expect(() => initCardTilt()).not.toThrow()
  })
})
