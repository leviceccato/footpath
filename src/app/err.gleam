import gleam/result

pub fn map_try(
  res: Result(a, b),
  mapper: fn(b) -> d,
  then: fn(a) -> Result(c, d),
) -> Result(c, d) {
  res
  |> result.map_error(mapper)
  |> result.try(then)
}

pub fn replace_try(
  res: Result(a, b),
  error: d,
  then: fn(a) -> Result(c, d),
) -> Result(c, d) {
  res
  |> result.replace_error(error)
  |> result.try(then)
}

pub fn lazy_unwrap_try(
  res: Result(a, b),
  default: fn(b) -> c,
  then: fn(a) -> c,
) -> c {
  case res {
    Ok(value) -> then(value)
    Error(value) -> default(value)
  }
}

pub fn unwrap_try(res: Result(a, b), default: c, then: fn(a) -> c) -> c {
  case res {
    Ok(value) -> then(value)
    Error(_) -> default
  }
}
