import gleam/dict
import gleam/dynamic
import gleam/float
import gleam/int
import gleam/io
import gleam/list
import gleam/result
import gleam/string

import lustre
import lustre/attribute.{alt, class, id, src, style}
import lustre/effect
import lustre/element.{text}
import lustre/element/html.{button, div, img}
import lustre/event
import lustre_http

import app/i18n
import app/model
import app/msg
import app/web

// Constants

const popover_width = 200

const popover_height = 32

const popover_margin = 32

const pointer_safe_width = 32

const pointer_safe_height = 32

// const preview_color_picker_id = "preview_picker"

// Main

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
          model.Model(
            base_url,
            translators,
            t: en_us_translator,
            popover_x: 0,
            popover_y: 0,
            popover_content: "This is the popover content",
            preview_bg_color: #(0.1, 0.1, 0.1),
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

fn update(
  m: model.Model,
  message: msg.Message,
) -> #(model.Model, effect.Effect(msg.Message)) {
  case message {
    msg.DoNothing -> #(m, effect.none())

    // msg.UserToggledPreviewPicker(True) -> #(
    //   model.Model(
    //     ..m,
    //     preview_picker: model.ColorPicker(..m.preview_picker, is_shown: True),
    //   ),
    //   color_picker.init(preview_color_picker_id),
    // )
    // msg.UserToggledPreviewPicker(False) -> #(
    //   model.Model(
    //     ..m,
    //     preview_picker: model.ColorPicker(..m.preview_picker, is_shown: False),
    //   ),
    //   color_picker.destroy(preview_color_picker_id),
    // )
    // msg.DomUpdatedPreviewSvRangeCoords(coords) -> #(
    //   model.Model(
    //     ..m,
    //     preview_picker: model.ColorPicker(
    //       ..m.preview_picker,
    //       sv_range_coords: coords,
    //     ),
    //   ),
    //   effect.none(),
    // )
    // msg.UserUpdatedPreviewBgColor(color) -> #(
    //   model.Model(..m, preview_bg_color: color),
    //   effect.none(),
    // )
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

      #(
        model.Model(..m, popover_x: clamped_x, popover_y: clamped_y),
        effect.none(),
      )
    }

    msg.ApiUpdatedTranslator(maybe_translator) -> {
      case maybe_translator {
        Ok(translator) -> #(
          model.Model(..m, t: i18n.locale_to_translator(translator)),
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

fn view(m: model.Model) -> element.Element(msg.Message) {
  div(
    [
      class("h-full p-6"),
      event.on("pointermove", handle_pointermove),
      event.on("pointerout", handle_pointerout),
    ],
    [
      // This is a hack to allow hidden drag previews. Specifically for the color picker.
      img([
        id("empty-image"),
        alt(""),
        src(
          "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=",
        ),
      ]),
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
      button(
        // [
        //   event.on_click(msg.UserToggledPreviewPicker(
        //     !m.preview_picker.is_shown,
        //   )),
        // ],
        [],
        [text("Toggle color picker")],
      ),
      // case m.preview_picker.is_shown {
      //   True -> color_picker.view(m.preview_bg_color, preview_color_picker_id)
      //   False -> element.none()
      // },
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
  _ev: dynamic.Dynamic,
) -> Result(msg.Message, List(dynamic.DecodeError)) {
  Ok(msg.UserUpdatedPopoverCoods(#(0.0, 0.0)))
}

fn handle_pointermove(
  ev: dynamic.Dynamic,
) -> Result(msg.Message, List(dynamic.DecodeError)) {
  event.mouse_position(ev)
  |> result.map(msg.UserUpdatedPopoverCoods)
}

fn get_es_locale(m: model.Model) -> effect.Effect(msg.Message) {
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
