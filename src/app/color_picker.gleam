import gleam/dynamic
import gleam/float
import gleam/int
import gleam/io
import gleam/result

import gleam_community/colour
import lustre/attribute.{class, style}
import lustre/effect
import lustre/element
import lustre/element/html.{div}
import lustre/event

import app/err
import app/msg
import app/util
import app/web

const size = 180

pub fn init(id: String) -> effect.Effect(msg.Message) {
  use dispatch <- util.from_dom_effect()

  use sv_range_el <- err.unwrap_try(web.query_selector("#" <> id), Nil)

  let range_rect = web.get_bounding_client_rect(sv_range_el)

  let x = float.round(range_rect.left)
  let y = float.round(range_rect.top)

  dispatch(msg.DomUpdatedPreviewSvRangeCoords(#(x, y)))
}

pub fn destroy(id: String) -> effect.Effect(msg.Message) {
  use _ <- effect.from()

  use canvas_el <- err.unwrap_try(web.query_selector("#" <> id), Nil)

  io.println("color picker destroy")
  io.debug(canvas_el)

  Nil
}

fn handle_picker_drag(
  event_: dynamic.Dynamic,
) -> Result(msg.Message, List(dynamic.DecodeError)) {
  use mouse_position <- result.try(
    event.mouse_position(event_)
    |> result.map_error(fn(_) { [] }),
  )

  let message = case position_to_color(mouse_position) {
    Ok(color) -> msg.UserUpdatedPreviewBgColor(color)
    Error(_) -> msg.DoNothing
  }

  Ok(message)
}

fn handle_picker_dragstart(
  event_: dynamic.Dynamic,
) -> Result(msg.Message, List(dynamic.DecodeError)) {
  use data_transfer <- result.try(
    web.get_event_data_transfer(event_)
    |> result.map_error(fn(_) { [] }),
  )

  use empty_image <- result.try(
    web.query_selector("#empty-image")
    |> result.map_error(fn(_) { [] }),
  )

  web.set_data_transfer_drag_image(data_transfer, empty_image, 0, 0)

  Ok(msg.DoNothing)
}

pub fn view(color: colour.Color, id: String) -> element.Element(msg.Message) {
  let #(selector_x, selector_y) = color_to_position(color)
  div(
    [
      attribute.id(id),
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

fn position_to_color(position: #(Float, Float)) -> Result(colour.Color, Nil) {
  let size_float = int.to_float(size)

  let x = float.clamp(position.0, 0.0, size_float)
  let y = float.clamp(position.1, 0.0, size_float)

  let saturation = x /. size_float
  let value = { size_float -. y } /. size_float

  hsv_to_color(0.0, saturation, value)
}

fn color_to_position(color: colour.Color) -> #(Float, Float) {
  let #(_, saturation, value) = color_to_hsv(color)

  let size_float = int.to_float(size)

  let x = float.clamp(saturation *. size_float, 0.0, size_float)
  let y = float.clamp(size_float -. value *. size_float, 0.0, size_float)

  #(x, y)
}

fn color_to_hsv(color: colour.Color) -> #(Float, Float, Float) {
  let #(hue, saturation, lightness, _) = colour.to_hsla(color)

  let value = lightness +. saturation *. float.min(lightness, 1.0 -. lightness)

  let saturation = case value {
    0.0 -> saturation
    _ -> 2.0 *. { 1.0 -. lightness /. value }
  }

  #(hue, saturation, value)
}

fn hsv_to_color(
  hue: Float,
  saturation: Float,
  value: Float,
) -> Result(colour.Color, Nil) {
  let lightness = value *. { 1.0 -. saturation /. 2.0 }

  let saturation = case lightness {
    0.0 | 1.0 -> saturation
    _ -> { value -. lightness } /. float.min(lightness, 1.0 -. lightness)
  }

  colour.from_hsla(hue, saturation, lightness, 1.0)
}
