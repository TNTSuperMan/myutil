const buffer = new ArrayBuffer(8);
const view = new DataView(buffer);

const rand_view = new Uint8Array(buffer);
export const cryptoMathRandom = (): number => {
  crypto.getRandomValues(rand_view);
  view.setUint8(0, 0);
  view.setUint8(1, view.getUint8(1) & 0b00011111);

  return Number(view.getBigUint64(0)) / 9007199254740992;
};
