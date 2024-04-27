import plinth/browser/element

@external(javascript, "../web.ffi.js", "getDocumentElement")
pub fn get_document_element() -> element.Element

@external(javascript, "../web.ffi.js", "getElementClientWidth")
pub fn get_element_client_width(element: element.Element) -> Int

@external(javascript, "../web.ffi.js", "getElementClientHeight")
pub fn get_element_client_height(element: element.Element) -> Int

@external(javascript, "../web.ffi.js", "getElementOffsetWidth")
pub fn get_element_offset_width(element: element.Element) -> Int

@external(javascript, "../web.ffi.js", "getElementOffsetHeight")
pub fn get_element_offset_height(element: element.Element) -> Int

pub type ResizeObserver

@external(javascript, "../web.ffi.js", "createResizeObserver")
pub fn create_resize_observer(
  callback: fn(element.Element) -> Nil,
) -> ResizeObserver

@external(javascript, "../web.ffi.js", "resizeObserve")
pub fn resize_observe(observer: ResizeObserver, element: element.Element) -> Nil

@external(javascript, "../web.ffi.js", "resizeUnobserve")
pub fn resize_unobserve(
  observer: ResizeObserver,
  element: element.Element,
) -> Nil

@external(javascript, "../web.ffi.js", "disconnectResizeObserver")
pub fn disconnect_resize_observer(observer: ResizeObserver) -> Nil
