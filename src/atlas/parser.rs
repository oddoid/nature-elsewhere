use super::aseprite;
use super::atlas;
use crate::{
  math::rect::R16,
  math::wh::{WH, WH16},
  math::xy::{XY, XY16},
  utils::Millis,
};
use failure::Error;
use std::collections::HashMap;
use std::convert::From;
use std::{convert::TryInto, f32};

pub fn parse(file: &aseprite::File) -> Result<atlas::Atlas, Error> {
  let aseprite::WH { w, h } = file.meta.size;
  Ok(atlas::Atlas {
    version: file.meta.version.clone(),
    filename: file.meta.image.clone(),
    format: file.meta.format.clone(),
    wh: WH { w: w.try_into()?, h: h.try_into()? },
    anims: parse_anim_map(file)?,
  })
}

pub fn parse_anim_map(
  aseprite::File { meta, frames }: &aseprite::File,
) -> Result<atlas::AnimMap, Error> {
  let aseprite::Meta { frame_tags, slices, .. } = meta;
  let mut record = HashMap::new();
  for frame_tag in frame_tags {
    // Every tag should be unique within the sheet.
    if record.contains_key(&frame_tag.name) {
      let msg = format!("Duplicate tag {}.", frame_tag.name);
      return Err(failure::err_msg(msg));
    }
    record
      .insert(frame_tag.name.clone(), parse_anim(frame_tag, frames, slices)?);
  }
  Ok(record)
}

pub fn parse_anim(
  frame_tag: &aseprite::FrameTag,
  frame_map: &aseprite::FrameMap,
  slices: &[aseprite::Slice],
) -> Result<atlas::Anim, Error> {
  let direction = atlas::AnimDirection::parse(&frame_tag.direction)?;
  let frames = parse_tag_frames(frame_tag, frame_map);
  if frames.is_empty() {
    let msg = format!("No cels in {} animation.", frame_tag.name);
    return Err(failure::err_msg(msg));
  }

  let mut cels = Vec::new();
  for (i, frame) in frames.iter().enumerate() {
    cels.push(parse_cel(frame_tag, frame, i.try_into()?, slices)?);
  }

  let mut duration =
    cels.iter().fold(0., |time, atlas::Cel { duration, .. }| time + duration);
  if direction == atlas::AnimDirection::PingPong && cels.len() > 2 {
    duration += duration - cels[0].duration + cels[cels.len() - 1].duration;
  }

  if duration == 0. {
    let msg = format!("Zero duration for {} animation.", frame_tag.name);
    return Err(failure::err_msg(msg));
  }

  if cels.len() > 2 {
    if let Some(i) = cels[1..cels.len() - 1]
      .iter()
      .position(|atlas::Cel { duration, .. }| duration.is_infinite())
    {
      let msg = format!(
        "Infinite duration for intermediate cel {} of {} animation.",
        i, frame_tag.name
      );
      return Err(failure::err_msg(msg));
    }
  }

  let aseprite::WH { w, h } = frames[0].source_size;
  Ok(atlas::Anim {
    wh: WH { w: w.try_into()?, h: h.try_into()? },
    cels,
    duration,
    direction,
  })
}

pub fn parse_tag_frames<'a>(
  aseprite::FrameTag { name, from, to, .. }: &aseprite::FrameTag,
  frame_map: &'a aseprite::FrameMap,
) -> Vec<&'a aseprite::Frame> {
  let mut frames = Vec::new();
  for i in *from..=*to {
    let tag_frame_number = format!("{} {}", name, i);
    frames.push(&frame_map[&tag_frame_number]);
  }
  return frames;
}

impl atlas::AnimDirection {
  fn parse(str: &str) -> Result<Self, Error> {
    match str {
      "forward" => Ok(Self::Forward),
      "reverse" => Ok(Self::Reverse),
      "pingpong" => Ok(Self::PingPong),
      _ => Err(failure::err_msg(format!(
        "AnimationDirection invalid: \"{}\".",
        str
      ))),
    }
  }
}

pub fn parse_cel(
  frame_tag: &aseprite::FrameTag,
  frame: &aseprite::Frame,
  frame_number: u32,
  slices: &[aseprite::Slice],
) -> Result<atlas::Cel, Error> {
  Ok(atlas::Cel {
    xy: parse_xy(frame)?,
    duration: parse_duration(frame.duration)?,
    slices: parse_slices(frame_tag, frame_number, slices)?,
  })
}

pub fn parse_xy(frame: &aseprite::Frame) -> Result<XY16, Error> {
  let WH { w, h } = parse_padding(frame)?;
  Ok(XY { x: (frame.frame.x + w / 2), y: (frame.frame.y + h / 2) })
}

pub fn parse_padding(
  aseprite::Frame { frame, source_size, .. }: &aseprite::Frame,
) -> Result<WH16, Error> {
  let w = (frame.w - source_size.w).try_into()?;
  let h = (frame.h - source_size.h).try_into()?;
  if w & 1 == 1 || h & 1 == 1 {
    return Err(failure::err_msg("Padding is not evenly divisible."));
  }
  Ok(WH { w, h })
}

pub fn parse_duration(duration: aseprite::Duration) -> Result<Millis, Error> {
  match duration {
    0 => Err(failure::err_msg("Duration is zero.")),
    aseprite::INFINITE => Ok(f32::INFINITY),
    _ => Ok(f32::from(duration)),
  }
}

pub fn parse_slices(
  aseprite::FrameTag { name, .. }: &aseprite::FrameTag,
  index: u32,
  slices: &[aseprite::Slice],
) -> Result<Vec<R16>, Error> {
  let mut rects = Vec::new();
  for slice in slices {
    if slice.name != *name {
      continue;
    }
    // For each Slice, get the greatest relevant Key.
    let key =
      slice.keys.iter().filter(|key| key.frame <= index).last().unwrap();
    let aseprite::Key { bounds, .. } = key;
    rects.push(R16::cast_wh(bounds.x, bounds.y, bounds.w, bounds.h));
  }
  Ok(rects)
}

#[cfg(test)]
mod test {
  use super::*;

  #[test]
  fn parse_anim_map() {
    let frame_tags = vec![
      aseprite::FrameTag {
        name: "sceneryCloud".to_string(),
        from: 0,
        to: 0,
        direction: "forward".to_string(),
      },
      aseprite::FrameTag {
        name: "palette-red".to_string(),
        from: 1,
        to: 1,
        direction: "forward".to_string(),
      },
      aseprite::FrameTag {
        name: "sceneryConifer".to_string(),
        from: 2,
        to: 2,
        direction: "forward".to_string(),
      },
      aseprite::FrameTag {
        name: "sceneryConifer-shadow".to_string(),
        from: 3,
        to: 3,
        direction: "forward".to_string(),
      },
    ];
    let mut frames = HashMap::new();
    frames.insert(
      "sceneryCloud 0".to_string(),
      aseprite::Frame {
        frame: aseprite::Rect { x: 220, y: 18, w: 18, h: 18 },
        rotated: false,
        trimmed: false,
        sprite_source_size: aseprite::Rect { x: 0, y: 0, w: 16, h: 16 },
        source_size: aseprite::WH { w: 16, h: 16 },
        duration: 1,
      },
    );
    frames.insert(
      "palette-red 1".to_string(),
      aseprite::Frame {
        frame: aseprite::Rect { x: 90, y: 54, w: 18, h: 18 },
        rotated: false,
        trimmed: false,
        sprite_source_size: aseprite::Rect { x: 0, y: 0, w: 16, h: 16 },
        source_size: aseprite::WH { w: 16, h: 16 },
        duration: 65535,
      },
    );
    frames.insert(
      "sceneryConifer 2".to_string(),
      aseprite::Frame {
        frame: aseprite::Rect { x: 72, y: 54, w: 18, h: 18 },
        rotated: false,
        trimmed: false,
        sprite_source_size: aseprite::Rect { x: 0, y: 0, w: 16, h: 16 },
        source_size: aseprite::WH { w: 16, h: 16 },
        duration: 65535,
      },
    );
    frames.insert(
      "sceneryConifer-shadow 3".to_string(),
      aseprite::Frame {
        frame: aseprite::Rect { x: 54, y: 54, w: 18, h: 18 },
        rotated: false,
        trimmed: false,
        sprite_source_size: aseprite::Rect { x: 54, y: 54, w: 18, h: 18 },
        source_size: aseprite::WH { w: 16, h: 16 },
        duration: 65535,
      },
    );
    let slices = vec![
      aseprite::Slice {
        name: "sceneryCloud".to_string(),
        color: "#0000ffff".to_string(),
        keys: vec![aseprite::Key {
          frame: 0,
          bounds: aseprite::Rect { x: 8, y: 12, w: 2, h: 3 },
        }],
      },
      aseprite::Slice {
        name: "palette-red".to_string(),
        color: "#0000ffff".to_string(),
        keys: vec![aseprite::Key {
          frame: 0,
          bounds: aseprite::Rect { x: 7, y: 11, w: 3, h: 4 },
        }],
      },
      aseprite::Slice {
        name: "sceneryConifer".to_string(),
        color: "#0000ffff".to_string(),
        keys: vec![aseprite::Key {
          frame: 0,
          bounds: aseprite::Rect { x: 7, y: 10, w: 3, h: 5 },
        }],
      },
      aseprite::Slice {
        name: "sceneryConifer-shadow".to_string(),
        color: "#0000ffff".to_string(),
        keys: vec![aseprite::Key {
          frame: 0,
          bounds: aseprite::Rect { x: 7, y: 9, w: 3, h: 6 },
        }],
      },
    ];
    let meta = aseprite::Meta {
      app: "http://www.aseprite.org/".to_string(),
      version: "1.2.8.1".to_string(),
      image: "atlas.png".to_string(),
      format: "I8".to_string(),
      size: aseprite::WH { w: 1024, h: 1024 },
      scale: "1".to_string(),
      frame_tags,
      slices,
    };
    let file = aseprite::File { meta, frames };
    let mut expected = atlas::AnimMap::new();
    expected.insert(
      "sceneryCloud".to_string(),
      atlas::Anim {
        wh: WH { w: 16, h: 16 },
        cels: vec![atlas::Cel {
          xy: XY { x: 221, y: 19 },
          duration: 1.,
          slices: vec![R16 {
            from: XY { x: 8, y: 12 },
            to: XY { x: 10, y: 15 },
          }],
        }],
        duration: 1.,
        direction: atlas::AnimDirection::Forward,
      },
    );
    expected.insert(
      "palette-red".to_string(),
      atlas::Anim {
        wh: WH { w: 16, h: 16 },
        cels: vec![atlas::Cel {
          xy: XY { x: 91, y: 55 },
          duration: f32::INFINITY,
          slices: vec![R16 {
            from: XY { x: 7, y: 11 },
            to: XY { x: 10, y: 15 },
          }],
        }],
        duration: f32::INFINITY,
        direction: atlas::AnimDirection::Forward,
      },
    );
    expected.insert(
      "sceneryConifer".to_string(),
      atlas::Anim {
        wh: WH { w: 16, h: 16 },
        cels: vec![atlas::Cel {
          xy: XY { x: 73, y: 55 },
          duration: f32::INFINITY,
          slices: vec![R16 {
            from: XY { x: 7, y: 10 },
            to: XY { x: 10, y: 15 },
          }],
        }],
        duration: f32::INFINITY,
        direction: atlas::AnimDirection::Forward,
      },
    );
    expected.insert(
      "sceneryConifer-shadow".to_string(),
      atlas::Anim {
        wh: WH { w: 16, h: 16 },
        cels: vec![atlas::Cel {
          xy: XY { x: 55, y: 55 },
          duration: f32::INFINITY,
          slices: vec![R16 {
            from: XY { x: 7, y: 9 },
            to: XY { x: 10, y: 15 },
          }],
        }],
        duration: f32::INFINITY,
        direction: atlas::AnimDirection::Forward,
      },
    );
    assert_eq!(super::parse_anim_map(&file).unwrap(), expected);
  }

  #[test]
  fn parse_anim() {
    let frame_tag = aseprite::FrameTag {
      name: "cloud s".to_string(),
      from: 1,
      to: 1,
      direction: "forward".to_string(),
    };
    let mut frames = HashMap::new();
    frames.insert(
      "cloud xs 0".to_string(),
      aseprite::Frame {
        frame: aseprite::Rect { x: 202, y: 36, w: 18, h: 18 },
        rotated: false,
        trimmed: false,
        sprite_source_size: aseprite::Rect { x: 0, y: 0, w: 16, h: 16 },
        source_size: aseprite::WH { w: 16, h: 16 },
        duration: 65535,
      },
    );
    frames.insert(
      "cloud s 1".to_string(),
      aseprite::Frame {
        frame: aseprite::Rect { x: 184, y: 36, w: 18, h: 18 },
        rotated: false,
        trimmed: false,
        sprite_source_size: aseprite::Rect { x: 0, y: 0, w: 16, h: 16 },
        source_size: aseprite::WH { w: 16, h: 16 },
        duration: 65535,
      },
    );
    frames.insert(
      "cloud m 2".to_string(),
      aseprite::Frame {
        frame: aseprite::Rect { x: 166, y: 36, w: 18, h: 18 },
        rotated: false,
        trimmed: false,
        sprite_source_size: aseprite::Rect { x: 0, y: 0, w: 16, h: 16 },
        source_size: aseprite::WH { w: 16, h: 16 },
        duration: 65535,
      },
    );
    let slices = [
      aseprite::Slice {
        name: "cloud xs".to_string(),
        color: "#0000ffff".to_string(),
        keys: vec![aseprite::Key {
          frame: 0,
          bounds: aseprite::Rect { x: 4, y: 12, w: 7, h: 3 },
        }],
      },
      aseprite::Slice {
        name: "cloud s".to_string(),
        color: "#0000ffff".to_string(),
        keys: vec![aseprite::Key {
          frame: 0,
          bounds: aseprite::Rect { x: 4, y: 11, w: 9, h: 4 },
        }],
      },
      aseprite::Slice {
        name: "cloud m".to_string(),
        color: "#0000ffff".to_string(),
        keys: vec![aseprite::Key {
          frame: 0,
          bounds: aseprite::Rect { x: 3, y: 11, w: 10, h: 4 },
        }],
      },
    ];
    assert_eq!(
      super::parse_anim(&frame_tag, &frames, &slices).unwrap(),
      atlas::Anim {
        wh: WH { w: 16, h: 16 },
        cels: vec![atlas::Cel {
          xy: XY { x: 185, y: 37 },
          duration: f32::INFINITY,
          slices: vec![R16 {
            from: XY { x: 4, y: 11 },
            to: XY { x: 13, y: 15 }
          }]
        }],
        duration: f32::INFINITY,
        direction: atlas::AnimDirection::Forward
      }
    );
  }

  #[test]
  fn parse_direction_valid() {
    assert_eq!(
      atlas::AnimDirection::parse("forward").unwrap(),
      atlas::AnimDirection::Forward
    );
  }

  #[test]
  fn parse_direction_invalid() {
    assert_eq!(atlas::AnimDirection::parse("invalid").is_err(), true);
  }

  #[test]
  fn parse_cel() {
    let frame_tag = aseprite::FrameTag {
      name: "stem ".to_string(),
      from: 0,
      to: 0,
      direction: "forward".to_string(),
    };
    let frame = aseprite::Frame {
      frame: aseprite::Rect { x: 130, y: 18, w: 18, h: 18 },
      rotated: false,
      trimmed: false,
      sprite_source_size: aseprite::Rect { x: 0, y: 0, w: 16, h: 16 },
      source_size: aseprite::WH { w: 16, h: 16 },
      duration: 65535,
    };
    let slices = [aseprite::Slice {
      name: "stem ".to_string(),
      color: "#0000ffff".to_string(),
      keys: vec![aseprite::Key {
        frame: 0,
        bounds: aseprite::Rect { x: 4, y: 4, w: 8, h: 12 },
      }],
    }];
    assert_eq!(
      super::parse_cel(&frame_tag, &frame, 0, &slices).unwrap(),
      atlas::Cel {
        xy: XY { x: 131, y: 19 },
        duration: f32::INFINITY,
        slices: vec![R16 { from: XY { x: 4, y: 4 }, to: XY { x: 12, y: 16 } }]
      }
    );
  }

  #[test]
  fn parse_xy_without_padding() {
    let frame = aseprite::Frame {
      frame: aseprite::Rect { x: 1, y: 2, w: 3, h: 4 },
      rotated: false,
      trimmed: false,
      sprite_source_size: aseprite::Rect { x: 0, y: 0, w: 3, h: 4 },
      source_size: aseprite::WH { w: 3, h: 4 },
      duration: 1,
    };
    assert_eq!(parse_xy(&frame).unwrap(), XY { x: 1, y: 2 });
  }

  #[test]
  fn parse_xy_with_padding() {
    let frame = aseprite::Frame {
      frame: aseprite::Rect { x: 1, y: 2, w: 5, h: 6 },
      rotated: false,
      trimmed: false,
      sprite_source_size: aseprite::Rect { x: 0, y: 0, w: 3, h: 4 },
      source_size: aseprite::WH { w: 3, h: 4 },
      duration: 1,
    };
    assert_eq!(parse_xy(&frame).unwrap(), XY { x: 2, y: 3 });
  }

  #[test]
  fn parse_padding_zero() {
    let frame = aseprite::Frame {
      frame: aseprite::Rect { x: 1, y: 2, w: 3, h: 4 },
      rotated: false,
      trimmed: false,
      sprite_source_size: aseprite::Rect { x: 0, y: 0, w: 3, h: 4 },
      source_size: aseprite::WH { w: 3, h: 4 },
      duration: 1,
    };
    assert_eq!(parse_padding(&frame).unwrap(), WH { w: 0, h: 0 });
  }

  #[test]
  fn parse_padding_nonzero() {
    let frame = aseprite::Frame {
      frame: aseprite::Rect { x: 1, y: 2, w: 4, h: 5 },
      rotated: false,
      trimmed: false,
      sprite_source_size: aseprite::Rect { x: 0, y: 0, w: 2, h: 3 },
      source_size: aseprite::WH { w: 2, h: 3 },
      duration: 1,
    };
    assert_eq!(parse_padding(&frame).unwrap(), WH { w: 2, h: 2 });
  }

  #[test]
  fn parse_padding_mixed() {
    let frame = aseprite::Frame {
      frame: aseprite::Rect { x: 1, y: 2, w: 4, h: 6 },
      rotated: false,
      trimmed: false,
      sprite_source_size: aseprite::Rect { x: 0, y: 0, w: 2, h: 2 },
      source_size: aseprite::WH { w: 2, h: 2 },
      duration: 1,
    };
    assert_eq!(parse_padding(&frame).unwrap(), WH { w: 2, h: 4 });
  }

  #[test]
  fn parse_padding_indivisible() {
    let frame = aseprite::Frame {
      frame: aseprite::Rect { x: 1, y: 2, w: 4, h: 6 },
      rotated: false,
      trimmed: false,
      sprite_source_size: aseprite::Rect { x: 0, y: 0, w: 3, h: 6 },
      source_size: aseprite::WH { w: 3, h: 6 },
      duration: 1,
    };
    assert_eq!(parse_padding(&frame).is_err(), true);
  }

  #[test]
  fn parse_duration_finite() {
    assert_eq!(parse_duration(1).unwrap(), 1.)
  }

  #[test]
  fn parse_duration_infinite() {
    assert_eq!(parse_duration(65535).unwrap(), f32::INFINITY)
  }

  #[test]
  fn parse_slices_rect() {
    let frame_tag = aseprite::FrameTag {
      name: "stem ".to_string(),
      from: 0,
      to: 0,
      direction: "forward".to_string(),
    };
    let slices = [aseprite::Slice {
      name: "stem ".to_string(),
      color: "#00000000".to_string(),
      keys: vec![aseprite::Key {
        frame: 0,
        bounds: aseprite::Rect { x: 0, y: 1, w: 2, h: 3 },
      }],
    }];
    assert_eq!(
      parse_slices(&frame_tag, 0, &slices).unwrap(),
      vec![R16 { from: XY { x: 0, y: 1 }, to: XY { x: 2, y: 4 } },]
    )
  }

  #[test]
  fn parse_slices_unrelated_tags() {
    let frame_tag = aseprite::FrameTag {
      name: "stem ".to_string(),
      from: 0,
      to: 0,
      direction: "forward".to_string(),
    };
    let slices = [aseprite::Slice {
      name: "unrelated ".to_string(),
      color: "#00000000".to_string(),
      keys: vec![aseprite::Key {
        frame: 0,
        bounds: aseprite::Rect { x: 0, y: 1, w: 2, h: 3 },
      }],
    }];
    assert_eq!(parse_slices(&frame_tag, 0, &slices).unwrap(), vec![])
  }

  #[test]
  fn parse_slices_unrelated_keys() {
    let frame_tag = aseprite::FrameTag {
      name: "stem ".to_string(),
      from: 0,
      to: 2,
      direction: "forward".to_string(),
    };
    let slices = [aseprite::Slice {
      name: "stem ".to_string(),
      color: "#00000000".to_string(),
      keys: vec![
        aseprite::Key {
          frame: 0,
          bounds: aseprite::Rect { x: 0, y: 1, w: 2, h: 3 },
        },
        aseprite::Key {
          frame: 1,
          bounds: aseprite::Rect { x: 4, y: 5, w: 6, h: 7 },
        },
        aseprite::Key {
          frame: 2,
          bounds: aseprite::Rect { x: 8, y: 9, w: 10, h: 11 },
        },
      ],
    }];
    assert_eq!(
      parse_slices(&frame_tag, 1, &slices).unwrap(),
      vec![R16 { from: XY { x: 4, y: 5 }, to: XY { x: 10, y: 12 } }]
    )
  }

  #[test]
  fn parse_slices_mul_keys() {
    let frame_tag = aseprite::FrameTag {
      name: "stem ".to_string(),
      from: 0,
      to: 1,
      direction: "forward".to_string(),
    };
    let slices = [aseprite::Slice {
      name: "stem ".to_string(),
      color: "#00000000".to_string(),
      keys: vec![
        aseprite::Key {
          frame: 0,
          bounds: aseprite::Rect { x: 0, y: 1, w: 2, h: 3 },
        },
        aseprite::Key {
          frame: 1,
          bounds: aseprite::Rect { x: 4, y: 5, w: 6, h: 7 },
        },
      ],
    }];
    assert_eq!(
      parse_slices(&frame_tag, 0, &slices).unwrap(),
      vec![R16 { from: XY { x: 0, y: 1 }, to: XY { x: 2, y: 4 } }]
    )
  }

  #[test]
  fn parse_slices_none() {
    // let frame_tag = aseprite::FrameTag {
    //   name: "stem ".to_string(),
    //   from: 0,
    //   to: 0,
    //   direction: "forward".to_string(),
    // };
    let frame_tag: aseprite::FrameTag =
      serde_json::from_value(serde_json::json!({
        "name": "stem ",
        "from": 0,
        "to": 0,
        "direction": "forward",
      }))
      .unwrap();
    assert_eq!(parse_slices(&frame_tag, 0, &[]).unwrap(), vec![]);
  }

  #[test]
  fn parse_slices_single() {
    let frame_tag = aseprite::FrameTag {
      name: "stem ".to_string(),
      from: 0,
      to: 1,
      direction: "forward".to_string(),
    };
    let slices = [aseprite::Slice {
      name: "stem ".to_string(),
      color: "#00000000".to_string(),
      keys: vec![aseprite::Key {
        frame: 0,
        bounds: aseprite::Rect { x: 0, y: 1, w: 2, h: 3 },
      }],
    }];
    assert_eq!(
      parse_slices(&frame_tag, 1, &slices).unwrap(),
      vec![R16 { from: XY { x: 0, y: 1 }, to: XY { x: 2, y: 4 } },]
    );
  }

  #[test]
  fn parse_slices_mul() {
    let frame_tag = aseprite::FrameTag {
      name: "stem ".to_string(),
      from: 0,
      to: 1,
      direction: "forward".to_string(),
    };
    let slices = [
      aseprite::Slice {
        name: "stem ".to_string(),
        color: "#00000000".to_string(),
        keys: vec![
          aseprite::Key {
            frame: 0,
            bounds: aseprite::Rect { x: 0, y: 1, w: 2, h: 3 },
          },
          aseprite::Key {
            frame: 1,
            bounds: aseprite::Rect { x: 4, y: 5, w: 6, h: 7 },
          },
          aseprite::Key {
            frame: 2,
            bounds: aseprite::Rect { x: 12, y: 13, w: 14, h: 15 },
          },
        ],
      },
      aseprite::Slice {
        name: "unrelated ".to_string(),
        color: "#00000000".to_string(),
        keys: vec![aseprite::Key {
          frame: 0,
          bounds: aseprite::Rect { x: 0, y: 1, w: 2, h: 3 },
        }],
      },
      aseprite::Slice {
        name: "stem ".to_string(),
        color: "#00000000".to_string(),
        keys: vec![aseprite::Key {
          frame: 1,
          bounds: aseprite::Rect { x: 0, y: 1, w: 2, h: 3 },
        }],
      },
      aseprite::Slice {
        name: "stem ".to_string(),
        color: "#00000000".to_string(),
        keys: vec![aseprite::Key {
          frame: 0,
          bounds: aseprite::Rect { x: 8, y: 9, w: 10, h: 11 },
        }],
      },
    ];
    assert_eq!(
      parse_slices(&frame_tag, 1, &slices).unwrap(),
      vec![
        R16 { from: XY { x: 4, y: 5 }, to: XY { x: 10, y: 12 } },
        R16 { from: XY { x: 0, y: 1 }, to: XY { x: 2, y: 4 } },
        R16 { from: XY { x: 8, y: 9 }, to: XY { x: 18, y: 20 } }
      ]
    );
  }
}
