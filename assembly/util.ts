@inline
export function load32(ptr: usize, offset: usize): u32 {
  return load<u32>(ptr + (offset << alignof<u32>()));
}

@inline
export function store32(ptr: usize, offset: usize, u: u32): void {
  store<u32>(ptr + (offset << alignof<u32>()), u);
}

@inline
export function load16(ptr: usize, offset: usize): u16 {
  return load<u16>(ptr + (offset << alignof<u16>()));
}

@inline
export function store16(ptr: usize, offset: usize, u: u16): void {
  store<u16>(ptr + (offset << alignof<u16>()), u);
}

@inline
export function store8(ptr: usize, offset: usize, u: u8): void {
  store<u8>(ptr + offset, u);
}

@inline
export function load8(ptr: usize, offset: usize): u8 {
  return load<u8>(ptr + offset);
}

// TODO: more unit tests in assembly
export function writeUint64LE(value: u32, out: usize, offset: u8 = 0): void {
  writeUint32LE(value, out, offset);
  writeUint32LE(i32(value / 0x100000000), out, offset + 4);
}

export function writeUint32LE(value: i32, out: usize, offset: u8 = 0): void {
  store32(out, offset / 4, value >>> 0);
}

export function wipe8(array: usize, length: u32): void {
  memory.fill(array, 0, length * sizeof<u8>());
}

export function wipe16(array: usize, length: u32): void {
  memory.fill(array, 0, length * sizeof<u16>());
}