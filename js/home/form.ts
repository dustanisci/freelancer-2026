/**
 * form.ts — Formulário de contato, cards clicáveis e efeito tilt 3D
 */

const WA = '5511934967887'

function buildWaUrl(service = '', message = ''): string {
  const text = message || (service
    ? `Olá, Eduardo! Como você está? Vi seu site e tenho interesse em *${service}*. Podemos conversar?`
    : 'Olá, Eduardo! Como você está? Vi seu site e gostaria de conversar sobre seus serviços.')
  return `https://wa.me/${WA}?text=${encodeURIComponent(text)}`
}

export function initContactForm(): void {
  const form = document.getElementById('contactForm') as HTMLFormElement | null
  if (!form) return

  const submitBtn = form.querySelector<HTMLButtonElement>('#submitBtn')
  const nameInput = form.querySelector<HTMLInputElement>('#contactName')
  const serviceSelect = form.querySelector<HTMLSelectElement>('#contactService')
  const messageTextarea = form.querySelector<HTMLTextAreaElement>('#contactMessage')

  // Enable submit only when name, service and message are filled
  function updateSubmitState(): void {
    if (!submitBtn) return
    const valid = (nameInput?.value.trim() ?? '') !== ''
      && (serviceSelect?.value ?? '') !== ''
      && (messageTextarea?.value.trim() ?? '') !== ''
    submitBtn.disabled = !valid
  }

  nameInput?.addEventListener('input', updateSubmitState)
  serviceSelect?.addEventListener('change', updateSubmitState)
  messageTextarea?.addEventListener('input', updateSubmitState)
  updateSubmitState()

  form.addEventListener('submit', (e: Event) => {
    e.preventDefault()
    const name = nameInput?.value.trim() ?? ''
    const service = serviceSelect?.value ?? ''
    const details = (form.querySelector<HTMLTextAreaElement>('#contactMessage'))?.value.trim() ?? ''
    const extra = details ? ` ${details}` : ''
    const text = `Olá, Eduardo! Como você está? Me chamo *${name}*. Tenho interesse em *${service || 'seus serviços'}*.${extra}`
    window.open(buildWaUrl('', text), '_blank', 'noopener noreferrer')
  })

  // WhatsApp links nos cards de serviço (data-wa-service)
  document.querySelectorAll<HTMLElement>('[data-wa-service]').forEach(link => {
    link.addEventListener('click', (e: Event) => {
      e.preventDefault()
      const service = (link as HTMLElement).dataset['waService'] ?? ''
      window.open(buildWaUrl(service), '_blank', 'noopener noreferrer')
    })
  })
}

export function initCardClick(): void {
  document.querySelectorAll<HTMLElement>('.service-card').forEach(card => {
    const ctaLink = card.querySelector<HTMLAnchorElement>('.service-cta')
    if (!ctaLink) return

    card.addEventListener('click', (e: MouseEvent) => {
      if ((e.target as Element).closest('.service-cta')) return
      ctaLink.click()
    })
  })
}

export function initCardTilt(): void {
  // Only on fine-pointer devices (mouse), not touch
  if (!window.matchMedia('(pointer: fine)').matches) return

  document.querySelectorAll<HTMLElement>('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none'
    })

    card.addEventListener('mousemove', (e: MouseEvent) => {
      const { left, top, width, height } = card.getBoundingClientRect()
      const x = ((e.clientX - left) / width - 0.5) * 16
      const y = ((e.clientY - top) / height - 0.5) * -16
      card.style.transform = `perspective(700px) rotateY(${x}deg) rotateX(${y}deg) translateY(-6px) scale(1.02)`
    })

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.35s ease, box-shadow 0.35s ease'
      card.style.transform = ''
    })
  })
}

