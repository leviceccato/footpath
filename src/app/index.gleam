import gleam/int
import lustre
import lustre/element.{text}
import lustre/element/html.{button, div, p}
import lustre/event.{on_click}

pub fn main(default_locale_string: String) {
  let app = lustre.simple(init, update, view)
  let assert Ok(_) = lustre.start(app, "#root", default_locale_string)

  Nil
}

type Model {
  Model(locale: String, count: Int)
}

fn init(default_locale_string: String) -> Model {
  Model(locale: default_locale_string, count: 0)
}

type Msg {
  Incr
  Decr
}

fn update(model: Model, msg: Msg) -> Model {
  case msg {
    Incr -> Model(..model, count: model.count + 1)
    Decr -> Model(..model, count: model.count - 1)
  }
}

fn view(model: Model) -> element.Element(Msg) {
  let count = int.to_string(model.count)

  div([], [
    button([on_click(Incr)], [text(" + ")]),
    p([], [text(count)]),
    button([on_click(Decr)], [text(" - ")]),
  ])
}
