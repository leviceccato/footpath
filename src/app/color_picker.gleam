import gleam/dict
import gleam/dynamic
import gleam/float
import gleam/int
import gleam/result

import lustre
import lustre/attribute.{class, style}
import lustre/effect
import lustre/element
import lustre/element/html.{div}
import lustre/event

import app/err
import app/util
import app/web

const size = 180

pub type Model {
  Model(root_ref: util.ElementRef(Message), hsv: Hsv, top: Int, left: Int)
}

pub type Message {
  DidNothing
  DomUpdatedTopAndLeft(top: Int, left: Int)
  UserChangedHsv(hsv: Hsv)
}

pub fn color_picker() {
  lustre.component(
    fn(_) {
      let root_ref = util.create_element_ref()

      #(
        Model(root_ref: root_ref, hsv: #(0.0, 0.0, 0.0), top: 0, left: 0),
        mount(root_ref),
      )
    },
    update,
    view,
    dict.new(),
  )
}

fn update(m: Model, message: Message) -> #(Model, effect.Effect(Message)) {
  case message {
    DidNothing -> #(m, effect.none())

    DomUpdatedTopAndLeft(top, left) -> #(
      Model(..m, top: top, left: left),
      effect.none(),
    )
    UserChangedHsv(hsv) -> #(Model(..m, hsv: hsv), effect.none())
  }
}

fn mount(root_ref: util.ElementRef(Message)) -> effect.Effect(Message) {
  use dispatch <- util.from_dom_effect()

  use root_el <- err.unwrap_try(root_ref.get(), Nil)

  let range_rect = web.get_bounding_client_rect(root_el)

  let top = float.round(range_rect.top)
  let left = float.round(range_rect.left)

  dispatch(DomUpdatedTopAndLeft(top: top, left: left))
}

fn handle_picker_drag(
  event_: dynamic.Dynamic,
) -> Result(Message, List(dynamic.DecodeError)) {
  use mouse_position <- result.try(event.mouse_position(event_))

  let #(saturation, value) = position_to_sv(mouse_position)

  Ok(UserChangedHsv(#(0.0, saturation, value)))
}

fn handle_picker_dragstart(
  event_: dynamic.Dynamic,
) -> Result(Message, List(dynamic.DecodeError)) {
  use data_transfer <- result.try(
    web.get_event_data_transfer(event_)
    |> result.replace_error([]),
  )

  use empty_image <- result.try(
    web.query_selector("#empty-image")
    |> result.replace_error([]),
  )

  web.set_data_transfer_drag_image(data_transfer, empty_image, 0, 0)

  Ok(DidNothing)
}

fn view(m: Model) -> element.Element(Message) {
  let #(selector_x, selector_y) = hsv_to_position(m.hsv)

  div(
    [
      m.root_ref.attr,
      attribute.attribute("draggable", "true"),
      event.on("drag", handle_picker_drag),
      event.on("dragstart", handle_picker_dragstart),
      style([#("width", int.to_string(size) <> "px")]),
      class("relative aspect-square border"),
    ],
    [
      div(
        [
          class("absolute inset-0 bg-gradient-to-r from-white"),
          style([#("--tw-gradient-to", "red")]),
        ],
        [],
      ),
      div(
        [class("absolute inset-0 bg-gradient-to-b from-transparent to-black")],
        [],
      ),
      div(
        [
          class(
            "size-3 rounded-full absolute inset-[-5px] pointer-events-none bg-white border",
          ),
          style([
            #(
              "transform",
              "translate("
                <> float.to_string(selector_x)
                <> "px, "
                <> float.to_string(selector_y)
                <> "px)",
            ),
          ]),
        ],
        [],
      ),
    ],
  )
}

fn position_to_sv(position: #(Float, Float)) -> #(Float, Float) {
  let size_float = int.to_float(size)

  let x = float.clamp(position.0, 0.0, size_float)
  let y = float.clamp(position.1, 0.0, size_float)

  let saturation = x /. size_float
  let value = { size_float -. y } /. size_float

  #(saturation, value)
}

fn hsv_to_position(hsv: Hsv) -> #(Float, Float) {
  let #(_, saturation, value) = hsv

  let size_float = int.to_float(size)

  let x = float.clamp(saturation *. size_float, 0.0, size_float)
  let y = float.clamp(size_float -. value *. size_float, 0.0, size_float)

  #(x, y)
}

fn hsv_to_hsl(hsv: Hsv) -> Hsl {
  let #(hue, saturation, value) = hsv

  let lightness = value *. { 1.0 -. saturation /. 2.0 }

  let saturation = case lightness {
    0.0 | 1.0 -> saturation
    _ -> { value -. lightness } /. float.min(lightness, 1.0 -. lightness)
  }

  #(hue, saturation, lightness)
}
