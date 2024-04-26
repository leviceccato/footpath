import gleam/dict
import gleam/dynamic as d
import gleam/json
import gleam/list
import gleam/result
import gleam/string

pub type Locale =
  dict.Dict(String, String)

pub type Translator =
  fn(String, List(String)) -> String

pub fn json_to_translator(
  locale_json: String,
) -> Result(Translator, json.DecodeError) {
  use static_locale <- result.try(json_to_locale(locale_json))
  Ok(locale_to_translator(static_locale))
}

pub fn locale_to_translator(locale: Locale) -> Translator {
  let locale =
    dict.map_values(locale, fn(_, value) { value_to_translator_func(value) })

  fn(key, args) {
    locale
    |> dict.get(key)
    |> result.map(fn(translator) {
      case translator(args) {
        "" -> key
        value -> value
      }
    })
    |> result.unwrap(key)
  }
}

pub fn locale_decoder() {
  d.dict(d.string, d.string)
}

fn json_to_locale(locale_json: String) -> Result(Locale, json.DecodeError) {
  json.decode(locale_json, locale_decoder())
}

fn value_to_translator_func(value: String) -> fn(List(String)) -> String {
  let static_segments = string.split(value, "{}")

  fn(args) {
    list.interleave([static_segments, args])
    |> string.join("")
  }
}
