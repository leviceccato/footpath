import lustre/effect

import app/web

pub fn from_dom_effect(callback: fn(fn(a) -> Nil) -> Nil) -> effect.Effect(a) {
  use dispatch <- effect.from()

  web.request_animation_frame(fn(_) { callback(dispatch) })
  Nil
}
