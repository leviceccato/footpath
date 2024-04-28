import plinth/browser/element

pub type SimpleBar

@external(javascript, "../simplebar.ffi.js", "createSimpleBar")
pub fn create_simple_bar(
  element: element.Element,
  auto_hide: Bool,
  scrollbar_min_size: Int,
  scrollbar_max_size: Int,
  content_class: String,
  scroll_content_class: String,
  scrollbar_class: String,
  track_class: String,
  force_visible: Bool,
  direction: String,
  click_on_track: Bool,
) -> SimpleBar

@external(javascript, "../simplebar.ffi.js", "getSimpleBarScrollElement")
pub fn get_simple_bar_scroll_element(simple_bar: SimpleBar) -> element.Element

@external(javascript, "../simplebar.ffi.js", "getSimpleBarContentElement")
pub fn get_simple_bar_content_element(simple_bar: SimpleBar) -> element.Element
