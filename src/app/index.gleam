import gleam/int
import gleam/io
import gleam/result
import lustre
import lustre/element.{text}
import lustre/element/html.{button, div, p}
import lustre/event.{on_click}
import app/i18n

pub fn main(default_locale_string: String) -> Result(Nil, Nil) {
  use default_translator <- result.try(
    i18n.translator_from_json(default_locale_string)
    |> result.map_error(fn(_) {
      io.println_error("Unable to parse default locale")
    }),
  )

  let app = lustre.simple(init, update, view)

  use _ <- result.try(
    lustre.start(app, "#root", default_translator)
    |> result.map_error(fn(_) { io.println_error("Failed to start app") }),
  )

  Ok(Nil)
}

type Model {
  Model(t: i18n.Translator, count: Int)
}

fn init(default_translator: i18n.Translator) -> Model {
  Model(t: default_translator, count: 0)
}

type Message {
  Incr
  Decr
}

fn update(m: Model, message: Message) -> Model {
  case message {
    Incr -> Model(..m, count: m.count + 1)
    Decr -> Model(..m, count: m.count - 1)
  }
}

fn view(m: Model) -> element.Element(Message) {
  let count = int.to_string(m.count)

  div([], [
    button([on_click(Incr)], [text(" + ")]),
    p([], [text(count)]),
    button([on_click(Decr)], [text(" - ")]),
    p([], [text(m.t("locale_es_es", []))]),
  ])
}
