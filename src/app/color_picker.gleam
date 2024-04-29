import gleam/dynamic

import lustre/attribute.{class}
import lustre/element
import lustre/element/html.{canvas}
import lustre/event

import app/msg

fn handle_picker_pointerdown(
  ev: dynamic.Dynamic,
) -> Result(msg.Message, List(dynamic.DecodeError)) {
  event.prevent_default(ev)
  event.stop_propagation(ev)
  todo
}

pub fn color_picker_view() -> element.Element(msg.Message) {
  canvas([
    event.on("pointerdown", handle_picker_pointerdown),
    class("block aspect-1 w-full"),
  ])
}
