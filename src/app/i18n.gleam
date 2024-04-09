import gleam/dict
import gleam/result

type Translator =
  fn(List(String)) -> String

pub type Locale =
  dict.Dict(String, Translator)

pub fn t(locale: Locale, key: String, args: List(String)) -> String {
  locale
  |> dict.get(key)
  |> result.map(fn(translator) { translator(args) })
  |> result.map(fn(value) {
    case value {
      "" -> key
      _ -> value
    }
  })
  |> result.unwrap(key)
}
