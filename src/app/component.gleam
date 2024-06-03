import app/msg
import lustre/element

pub type Component =
  List(element.Element(msg.Message))
