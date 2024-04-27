export function getDocumentElement() {
  return document.documentElement
}

export function getElementOffsetWidth(element) {
  return element.offsetWidth
}

export function getElementOffsetHeight(element) {
  return element.offsetHeight
}

export function getElementClientWidth(element) {
  return element.clientWidth
}

export function getElementClientHeight(element) {
  return element.clientHeight
}

export function createResizeObserver(callback) {
  return new ResizeObserver((entries) => {
    for (const entry of entries) {
      callback(entry)
    }
  })
}

export function resizeObserve(observer, element) {
  observer.observe(element)
}

export function resizeUnobserve(observer, element) {
  observer.unobserve(element)
}

export function disconnectResizeObserver(observer) {
  observer.disconnect()
}
