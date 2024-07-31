import lustre_http

import app/i18n

pub type Message {
  ApiUpdatedTranslator(Result(i18n.Locale, lustre_http.HttpError))
  UserClickedGetEsLocale
  UserUpdatedPopoverCoods(#(Float, Float))
  // UserToggledPreviewPicker(Bool)
  // UserUpdatedPreviewBgColor(colour.Color)
  // DomUpdatedPreviewSvRangeCoords(#(Int, Int))
  DoNothing
}
