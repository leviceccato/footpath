import app/i18n

import lustre_http

pub type Message {
  Incr
  Decr
  ApiUpdatedTranslator(Result(i18n.Locale, lustre_http.HttpError))
  UserClickedGetEsLocale
  UserUpdatedPopoverCoods(#(Float, Float))
}
