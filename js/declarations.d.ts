// Type declarations for modules without built-in TypeScript types
declare module 'animejs' {
  interface AnimeParams {
    targets?: string | object | object[] | NodeList | null
    duration?: number
    delay?: number | ((el: Element, i: number, l: number) => number)
    easing?: string
    direction?: 'normal' | 'reverse' | 'alternate'
    loop?: boolean | number
    autoplay?: boolean
    opacity?: number | number[] | [number, number]
    translateY?: number | number[] | [number, number]
    translateX?: number | number[] | [number, number]
    scale?: number | number[] | [number, number]
    rotate?: number | number[] | [number, number]
    [key: string]: unknown
  }

  interface AnimeInstance {
    play(): void
    pause(): void
    restart(): void
    seek(time: number): void
    add(params: AnimeParams, offset?: string | number): AnimeInstance
  }

  interface AnimeStagger {
    (value: number, options?: { start?: number; from?: string | number; direction?: string; easing?: string; grid?: number[] }): (el: Element, i: number) => number
  }

  interface AnimeStatic {
    (params: AnimeParams): AnimeInstance
    timeline(params?: Partial<AnimeParams>): AnimeInstance
    stagger: AnimeStagger
    easings: Record<string, (t: number) => number>
  }

  const anime: AnimeStatic
  export default anime
}

declare module 'bootstrap' {
  export class Collapse {
    constructor(element: Element, options?: object)
    static getInstance(element: Element): Collapse | null
    show(): void
    hide(): void
    toggle(): void
    dispose(): void
  }
  export class Modal {
    constructor(element: Element, options?: object)
    static getInstance(element: Element): Modal | null
    show(): void
    hide(): void
    dispose(): void
  }
  export class Offcanvas {
    constructor(element: Element, options?: object)
    static getInstance(element: Element): Offcanvas | null
    static getOrCreateInstance(element: Element, options?: object): Offcanvas
    show(): void
    hide(): void
    toggle(): void
    dispose(): void
  }
}
