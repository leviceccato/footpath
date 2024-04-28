import gleam/dict
import gleam/dynamic
import gleam/float
import gleam/int
import gleam/io
import gleam/list
import gleam/result
import gleam/string

import gleam_community/colour
import lustre
import lustre/attribute.{class, style}
import lustre/effect
import lustre/element.{text}
import lustre/element/html.{button, div}
import lustre/event
import lustre_http

import app/i18n
import app/msg
import app/web

const popover_width = 200

const popover_height = 32

const popover_margin = 32

const pointer_safe_width = 32

const pointer_safe_height = 32

pub fn main(base_url: String, en_us_locale_string: String) {
  use en_us_translator <- result.try(
    i18n.json_to_translator(en_us_locale_string)
    |> result.map_error(fn(_) {
      io.println_error("Unable to parse default locale")
    }),
  )

  let translators =
    dict.new()
    |> dict.insert("en-us", en_us_translator)

  let app =
    lustre.application(
      fn(_) {
        #(
          Model(
            base_url,
            translators,
            t: en_us_translator,
            popover_x: 0,
            popover_y: 0,
            popover_content: "This is the popover content",
            preview_bg_color: colour.white,
          ),
          effect.none(),
        )
      },
      update,
      view,
    )

  use _ <- result.try(
    lustre.start(app, "#root", Nil)
    |> result.map_error(fn(_) { io.println_error("Failed to start app") }),
  )

  Ok(Nil)
}

type Model {
  Model(
    base_url: String,
    t: i18n.Translator,
    translators: dict.Dict(String, i18n.Translator),
    popover_x: Int,
    popover_y: Int,
    popover_content: String,
    preview_bg_color: colour.Color,
  )
}

fn update(
  m: Model,
  message: msg.Message,
) -> #(Model, effect.Effect(msg.Message)) {
  case message {
    msg.UserClickedGetEsLocale -> #(m, get_es_locale(m))

    msg.UserUpdatedPopoverCoods(#(x, y)) -> {
      let document_element = web.get_document_element()

      let clamped_x =
        x
        |> float.truncate
        |> int.add(pointer_safe_width)
        |> int.clamp(
          popover_margin,
          web.get_element_client_width(document_element)
            - popover_margin
            - popover_width,
        )

      let clamped_y =
        y
        |> float.truncate
        |> int.add(pointer_safe_height)
        |> int.clamp(
          popover_margin,
          web.get_element_client_height(document_element)
            - popover_margin
            - popover_height,
        )

      #(Model(..m, popover_x: clamped_x, popover_y: clamped_y), effect.none())
    }

    msg.ApiUpdatedTranslator(maybe_translator) -> {
      case maybe_translator {
        Ok(translator) -> #(
          Model(..m, t: i18n.locale_to_translator(translator)),
          effect.none(),
        )
        Error(error) -> {
          io.debug("got here " <> string.inspect(error))
          #(m, effect.none())
        }
      }
    }
  }
}

fn view(m: Model) -> element.Element(msg.Message) {
  div(
    [
      class("h-full p-6"),
      event.on("pointermove", handle_pointermove),
      event.on("pointerout", handle_pointerout),
    ],
    [
      button([event.on_click(msg.UserClickedGetEsLocale)], [
        text("Get es locale"),
      ]),
      div([class("mt-6 w-[200px] h-[400px] border")], [
        scroll_view(
          div([class("p-2")], [
            text(
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras semper mi ac dolor fermentum, in aliquet orci lobortis. Proin non lacinia lacus, a pulvinar turpis. Integer neque quam, pulvinar at pulvinar nec, commodo at ex. Vestibulum viverra finibus molestie. Sed rhoncus id nisi ac pharetra. Quisque pulvinar ex lobortis efficitur mattis. Etiam dapibus fringilla nibh vel sollicitudin. Sed a eros dui. Aenean sed sodales quam. Suspendisse aliquam diam ipsum, sed vulputate justo sollicitudin et. Mauris euismod ullamcorper nibh quis sodales. Proin suscipit nunc ac lectus fermentum, eu gravida mi scelerisque. Proin diam felis, fringilla eget mattis ut, sollicitudin sit amet nunc. Aenean vulputate elit metus, quis molestie lacus finibus vel. Morbi dui ex, pellentesque in commodo nec, porttitor lobortis justo. Nunc ac dolor sit amet mi interdum tempus at non nisl.",
            ),
          ]),
        ),
      ]),
      div(
        [
          class(
            "overflow-x-hidden fixed border top-0 left-0 pointer-events-none translate-x-[var(--x)] translate-y-[var(--y)]",
          ),
          style([
            #("width", int.to_string(popover_width) <> "px"),
            #("height", int.to_string(popover_height) <> "px"),
            #("--x", int.to_string(m.popover_x) <> "px"),
            #("--y", int.to_string(m.popover_y) <> "px"),
          ]),
        ],
        [
          div(
            [class("flex")],
            // Need to add a few here so there are no blank spaces in the animation
            list.range(0, 4)
              |> list.map(fn(_) {
              div(
                [
                  class(
                    "whitespace-nowrap p-0.5 animate-[slide_3s_linear_infinite]",
                  ),
                ],
                [text(m.popover_content)],
              )
            }),
          ),
        ],
      ),
    ],
  )
}

fn handle_pointerout(
  _event: dynamic.Dynamic,
) -> Result(msg.Message, List(dynamic.DecodeError)) {
  Ok(msg.UserUpdatedPopoverCoods(#(0.0, 0.0)))
}

fn handle_pointermove(
  event: dynamic.Dynamic,
) -> Result(msg.Message, List(dynamic.DecodeError)) {
  event.mouse_position(event)
  |> result.map(msg.UserUpdatedPopoverCoods)
}

fn get_es_locale(m: Model) -> effect.Effect(msg.Message) {
  lustre_http.get(
    m.base_url <> "/locales/es.json",
    lustre_http.expect_json(i18n.locale_decoder(), msg.ApiUpdatedTranslator),
  )
}

fn scroll_view(
  children: element.Element(msg.Message),
) -> element.Element(msg.Message) {
  div([class("scroll-view overflow-auto max-w-full max-h-full")], [children])
}

fn color_picker_view() -> element.Element(msg.Message) {
  todo
}
