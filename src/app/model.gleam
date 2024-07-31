import gleam/dict

import app/i18n
import app/util

pub type ColorPicker {
  ColorPicker(is_shown: Bool, sv_range_coords: #(Int, Int))
}

pub type Model {
  Model(
    base_url: String,
    t: i18n.Translator,
    translators: dict.Dict(String, i18n.Translator),
    popover_x: Int,
    popover_y: Int,
    popover_content: String,
    preview_bg_color: util.Hsl,
  )
}
