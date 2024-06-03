import { Ok, Error } from './gleam.mjs'

export function getDocumentElement() {
  return document.documentElement
}

export function getElementClientWidth(element) {
  return element.clientWidth
}

export function getElementClientHeight(element) {
  return element.clientHeight
}

export function getBoundingClientRect(element) {
  return element.getBoundingClientRect()
}

export function requestAnimationFrame(callback) {
  return window.requestAnimationFrame(callback)
}

export function querySelector(selectors) {
  const element = document.querySelector(selectors)
  if (!element) {
    return new Error()
  }

  return new Ok(element)
}

export function getEventDataTransfer(event) {
  if (!event.dataTransfer) {
    return new Error()
  }

  return new Ok(event.dataTransfer)
}

export function setDataTransferDragImage(dataTransfer, image, width, height) {
  dataTransfer.setDragImage(image, width, height)
}
