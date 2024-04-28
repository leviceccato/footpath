import SimpleBar from 'simplebar'

export function createSimpleBar(
  element,
  autoHide,
  scrollbarMinSize,
  scrollbarMaxSize,
  contentClass,
  scrollContentClass,
  scrollbarClass,
  trackClass,
  forceVisible,
  direction,
  clickOnTrack
) {
  return new SimpleBar(element, {
    autoHide,
    scrollbarMinSize,
    scrollbarMaxSize,
    contentClass,
    scrollContentClass,
    scrollbarClass,
    trackClass,
    forceVisible,
    direction,
    clickOnTrack,
  })
}
