import lustre/attribute
import lustre/effect

import app/web

pub fn from_dom_effect(callback: fn(fn(a) -> Nil) -> Nil) -> effect.Effect(a) {
  use dispatch <- effect.from()

  web.request_animation_frame(fn(_) { callback(dispatch) })

  Nil
}

pub type Hsv =
  #(Float, Float, Float)

pub type Hsl =
  #(Float, Float, Float)

pub type ElementRef(a) {
  ElementRef(
    attr: attribute.Attribute(a),
    get: fn() -> Result(web.Element, Nil),
  )
}

pub fn create_element_ref() -> ElementRef(a) {
  let id = web.generate_uid()

  ElementRef(attr: attribute.id(id), get: fn() { web.query_selector(id) })
}
