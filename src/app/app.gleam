import gleam/dict
import gleam/dynamic
import gleam/float
import gleam/int
import gleam/io
import gleam/result
import gleam/string

import lustre
import lustre/attribute.{class, style}
import lustre/effect
import lustre/element.{text}
import lustre/element/html.{button, div, p}
import lustre/event
import lustre_http

import app/i18n
import app/msg

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
            count: 0,
            popover_x: 0,
            popover_y: 0,
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
    count: Int,
    popover_x: Int,
    popover_y: Int,
  )
}

fn update(
  m: Model,
  message: msg.Message,
) -> #(Model, effect.Effect(msg.Message)) {
  case message {
    msg.Incr -> #(Model(..m, count: m.count + 1), effect.none())
    msg.Decr -> #(Model(..m, count: m.count - 1), effect.none())

    msg.UserClickedGetEsLocale -> #(m, get_es_locale(m))

    msg.UserUpdatedPopoverCoods(#(x, y)) -> {
      let x = float.truncate(x)
      let y = float.truncate(y)

      #(Model(..m, popover_x: x, popover_y: y), effect.none())
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
  let count = int.to_string(m.count)

  div([class("h-full"), event.on("pointermove", handle_pointermove)], [
    button([event.on_click(msg.Incr)], [text(" + ")]),
    p([class("text-red-500 block")], [text(count)]),
    button([event.on_click(msg.Decr)], [text(" - ")]),
    p([], [text(m.t("locale-es-es", []))]),
    button([event.on_click(msg.UserClickedGetEsLocale)], [text("Get es locale")]),
    div(
      [
        class(
          "fixed top-0 left-0 pointer-events-none translate-x-[var(--x)] translate-y-[var(--y)]",
        ),
        style([
          #("--x", int.to_string(m.popover_x) <> "px"),
          #("--y", int.to_string(m.popover_y) <> "px"),
        ]),
      ],
      [text("Popover")],
    ),
  ])
}

fn handle_pointermove(
  event: dynamic.Dynamic,
) -> Result(msg.Message, List(dynamic.DecodeError)) {
  use mouse_position <- result.try(event.mouse_position(event))
  Ok(msg.UserUpdatedPopoverCoods(mouse_position))
}

fn get_es_locale(m: Model) -> effect.Effect(msg.Message) {
  lustre_http.get(
    m.base_url <> "/locales/es.json",
    lustre_http.expect_json(i18n.locale_decoder(), msg.ApiUpdatedTranslator),
  )
}
