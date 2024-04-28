import plinth/browser/element

@external(javascript, "../web.ffi.js", "getDocumentElement")
pub fn get_document_element() -> element.Element

@external(javascript, "../web.ffi.js", "getElementClientWidth")
pub fn get_element_client_width(element: element.Element) -> Int

@external(javascript, "../web.ffi.js", "getElementClientHeight")
pub fn get_element_client_height(element: element.Element) -> Int
