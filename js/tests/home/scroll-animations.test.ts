import { describe, it, expect, vi, beforeEach } from 'vitest'
import { initScrollAnimations } from '../../home/scroll-animations'

vi.mock('animejs', () => {
  const fn = vi.fn()
  ;(fn as ReturnType<typeof vi.fn> & { stagger: ReturnType<typeof vi.fn> }).stagger = vi.fn(() => 0)
  return { default: fn }
})
vi.mock('../../shared/counter', () => ({ animateCounter: vi.fn() }))
vi.mock('../../shared/utils', () => ({ calcExpYears: vi.fn(() => 14) }))

// ─── IntersectionObserver mock ────────────────────────────────────────────────

type IOCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void

let capturedCallbacks: IOCallback[] = []
const observeMock = vi.fn()
const unobserveMock = vi.fn()

const MockIntersectionObserver = vi.fn().mockImplementation(
  function (this: Record<string, unknown>, callback: IOCallback) {
    capturedCallbacks.push(callback)
    this['observe'] = observeMock
    this['unobserve'] = unobserveMock
    this['disconnect'] = vi.fn()
  },
)

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

// Helper: fire the nth observer's callback with a fake intersecting entry
function triggerIntersect(observerIndex: number, targetEl: Element) {
  const entry = {
    isIntersecting: true,
    target: targetEl,
    intersectionRatio: 1,
    boundingClientRect: {} as DOMRectReadOnly,
    intersectionRect: {} as DOMRectReadOnly,
    rootBounds: null,
    time: 0,
  } as IntersectionObserverEntry
  capturedCallbacks[observerIndex]?.([entry], {} as IntersectionObserver)
}

// ─── Full HTML fixture ─────────────────────────────────────────────────────────

function buildHTML(): string {
  return `
    <div id="services-grid">
      <div class="service-item"><div class="service-card"></div></div>
    </div>
    <section id="sobre">
      <div class="about-avatar-wrapper"></div>
      <span class="section-badge"></span>
      <h2 class="section-title"></h2>
      <p class="about-text"></p>
      <div class="about-tags"></div>
      <img class="robot-about-right" />
      <img class="robot-about-left" />
      <span class="exp-years-counter">0</span>
    </section>
    <section id="diferenciais">
      <div class="diff-card"></div>
      <img class="lightning-stats" />
      <img class="robot-stats-right" />
    </section>
    <section id="contato">
      <form class="contact-form"></form>
      <img class="robot-contact-left" />
    </section>
  `
}

describe('initScrollAnimations — setup', () => {
  beforeEach(() => {
    capturedCallbacks = []
    observeMock.mockClear()
    unobserveMock.mockClear()
    MockIntersectionObserver.mockClear()
    document.body.innerHTML = buildHTML()
    initScrollAnimations()
  })

  it('creates an IntersectionObserver for each section (4 total)', () => {
    expect(MockIntersectionObserver).toHaveBeenCalledTimes(4)
  })

  it('observes #services-grid element', () => {
    const target = document.getElementById('services-grid')!
    expect(observeMock).toHaveBeenCalledWith(target)
  })

  it('observes #sobre element', () => {
    const target = document.getElementById('sobre')!
    expect(observeMock).toHaveBeenCalledWith(target)
  })

  it('observes #diferenciais element', () => {
    const target = document.getElementById('diferenciais')!
    expect(observeMock).toHaveBeenCalledWith(target)
  })

  it('observes #contato element', () => {
    const target = document.getElementById('contato')!
    expect(observeMock).toHaveBeenCalledWith(target)
  })
})

describe('initScrollAnimations — intersection triggers anime', () => {
  let animeMock: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    capturedCallbacks = []
    observeMock.mockClear()
    unobserveMock.mockClear()
    MockIntersectionObserver.mockClear()

    const animeModule = await import('animejs')
    animeMock = vi.mocked(animeModule.default)
    animeMock.mockClear()

    document.body.innerHTML = buildHTML()
    initScrollAnimations()
  })

  it('calls anime when #services-grid intersects', () => {
    triggerIntersect(0, document.getElementById('services-grid')!)
    expect(animeMock).toHaveBeenCalled()
  })

  it('calls anime when #sobre intersects', () => {
    triggerIntersect(1, document.getElementById('sobre')!)
    expect(animeMock).toHaveBeenCalled()
  })

  it('calls anime when #diferenciais intersects', () => {
    triggerIntersect(2, document.getElementById('diferenciais')!)
    expect(animeMock).toHaveBeenCalled()
  })

  it('calls anime when #contato intersects', () => {
    triggerIntersect(3, document.getElementById('contato')!)
    expect(animeMock).toHaveBeenCalled()
  })

  it('unobserves the element after first intersection', () => {
    const target = document.getElementById('services-grid')!
    triggerIntersect(0, target)
    expect(unobserveMock).toHaveBeenCalledWith(target)
  })

  it('does not trigger anime when entry is not intersecting', () => {
    animeMock.mockClear()
    const target = document.getElementById('services-grid')!
    const entry = {
      isIntersecting: false,
      target,
      intersectionRatio: 0,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: 0,
    } as IntersectionObserverEntry
    capturedCallbacks[0]?.([entry], {} as IntersectionObserver)
    expect(animeMock).not.toHaveBeenCalled()
  })
})

describe('initScrollAnimations — missing elements', () => {
  beforeEach(() => {
    capturedCallbacks = []
    MockIntersectionObserver.mockClear()
    observeMock.mockClear()
  })

  it('does not throw when all sections are absent', () => {
    document.body.innerHTML = ''
    expect(() => initScrollAnimations()).not.toThrow()
  })

  it('does not observe null elements', () => {
    document.body.innerHTML = ''
    initScrollAnimations()
    expect(observeMock).not.toHaveBeenCalled()
  })
})
