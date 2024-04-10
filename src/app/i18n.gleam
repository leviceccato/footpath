import gleam/dict
import gleam/result
import gleam/dynamic as d
import gleam/json
import gleam/string
import gleam/list

type TranslatorFunc =
  fn(List(String)) -> String

type Locale =
  dict.Dict(String, TranslatorFunc)

pub type Translator =
  fn(String, List(String)) -> String

pub fn translator_from_json(
  locale_json: String,
) -> Result(Translator, json.DecodeError) {
  use locale <- result.try(locale_from_json(locale_json))
  Ok(fn(key, args) {
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
  })
}

fn locale_from_json(locale_json: String) -> Result(Locale, json.DecodeError) {
  use static_locale <- result.try(json.decode(
    locale_json,
    d.dict(d.string, d.string),
  ))
  Ok(
    dict.map_values(static_locale, fn(_, value) { value_to_translator(value) }),
  )
}

fn value_to_translator(value: String) -> TranslatorFunc {
  let static_segments = string.split(value, "{}")
  fn(args) {
    list.interleave([static_segments, args])
    |> string.join("")
  }
}
