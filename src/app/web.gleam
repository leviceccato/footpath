import gleam/dynamic

pub type Element

pub type DataTransfer

pub type DomRect {
  DomRect(
    x: Float,
    y: Float,
    width: Float,
    height: Float,
    top: Float,
    right: Float,
    bottom: Float,
    left: Float,
  )
}

@external(javascript, "../web.ffi.js", "getDocumentElement")
pub fn get_document_element() -> Element

@external(javascript, "../web.ffi.js", "getElementClientWidth")
pub fn get_element_client_width(element: Element) -> Int

@external(javascript, "../web.ffi.js", "getElementClientHeight")
pub fn get_element_client_height(element: Element) -> Int

@external(javascript, "../web.ffi.js", "getBoundingClientRect")
pub fn get_bounding_client_rect(element: Element) -> DomRect

@external(javascript, "../web.ffi.js", "requestAnimationFrame")
pub fn request_animation_frame(callback: fn(Float) -> Nil) -> Float

@external(javascript, "../web.ffi.js", "querySelector")
pub fn query_selector(selector: String) -> Result(Element, Nil)

@external(javascript, "../web.ffi.js", "getEventDataTransfer")
pub fn get_event_data_transfer(
  event: dynamic.Dynamic,
) -> Result(DataTransfer, Nil)

@external(javascript, "../web.ffi.js", "setDataTransferDragImage")
pub fn set_data_transfer_drag_image(
  data_transfer: DataTransfer,
  image: Element,
  width: Int,
  height: Int,
) -> Nil
