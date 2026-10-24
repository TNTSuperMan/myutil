let view = new DataView(new ArrayBuffer(8));

const use = () => {
  const v = view;
  view = new DataView(new ArrayBuffer(8));
  return {
    as_i8: () => v.getInt8(0),
    as_u8: () => v.getUint8(0),

    as_i16: () => v.getInt16(0, true),
    as_u16: () => v.getUint16(0, true),
    as_f16: () => v.getFloat16(0, true),

    as_i32: () => v.getInt32(0, true),
    as_u32: () => v.getUint32(0, true),
    as_f32: () => v.getFloat32(0, true),

    as_i64: () => v.getBigInt64(0, true),
    as_u64: () => v.getBigUint64(0, true),
    as_f64: () => v.getFloat64(0, true),
  };
};

export const ln = {
  i8: (num: number) => (view.setInt8(0, num), use()),
  u8: (num: number) => (view.setUint8(0, num), use()),

  i16: (num: number) => (view.setInt16(0, num, true), use()),
  u16: (num: number) => (view.setUint16(0, num, true), use()),
  f16: (num: number) => (view.setFloat16(0, num, true), use()),

  i32: (num: number) => (view.setInt32(0, num, true), use()),
  u32: (num: number) => (view.setUint32(0, num, true), use()),
  f32: (num: number) => (view.setFloat32(0, num, true), use()),

  i64: (num: bigint) => (view.setBigInt64(0, num, true), use()),
  u64: (num: bigint) => (view.setBigUint64(0, num, true), use()),
  f64: (num: number) => (view.setFloat64(0, num, true), use()),

  rand: () => (crypto.getRandomValues(view), use()),
};
