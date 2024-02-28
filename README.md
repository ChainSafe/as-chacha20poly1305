# as-chacha20poly1305

AssemblyScript implementation of chacha20poly1305, it's 20% - 60% faster compared to stablelib with no memory allocation in the middle.

This was ported from the typescript version https://github.com/StableLib/stablelib/tree/master/packages/chacha20poly1305

## Usage

`yarn add @chainsafe/as-chacha20poly1305`

```typescript
const ctx = newInstance();
const asImpl = new ChaCha20Poly1305(ctx);
const key = new Uint8Array(crypto.randomBytes(KEY_LENGTH));
const nonce = new Uint8Array(crypto.randomBytes(NONCE_LENGTH));
const plainText = new Uint8Array(crypto.randomBytes(512));
const ad = new Uint8Array(crypto.randomBytes(32))
const asSealed = asImpl.seal(key, nonce, plainText, ad);
// overwrite sealed to save memory allocation
const plainText2 = asImpl.open(key, nonce, sealed, true, ad);
expect(plainText2).to.be.deep.equal(plainText);
```

## Performance

Benchmark results of this implementation (chainSafe), stablelib 1.0.1 and noble 0.2.0 on a Mac M1 as of Aug 2023
```
chacha20poly1305
    ✓ chainsafe seal 32 bytes                                             721249.9 ops/s    1.386482 us/op        -      21318 runs   30.1 s
    ✓ stablelib seal 32 bytes                                             144494.9 ops/s    6.920660 us/op        -       4265 runs   30.0 s
    ✓ noble seal 32 bytes                                                 150163.8 ops/s    6.659396 us/op        -       4434 runs   30.0 s
    ✓ chainsafe open 32 bytes                                             671504.2 ops/s    1.489194 us/op        -      19851 runs   30.1 s
    ✓ stablelib open 32 bytes                                             147999.8 ops/s    6.756768 us/op        -       4363 runs   30.1 s
    ✓ noble open 32 bytes                                                 157093.5 ops/s    6.365635 us/op        -       4636 runs   30.0 s
    ✓ chainsafe seal 64 bytes                                             494830.5 ops/s    2.020894 us/op        -      14610 runs   30.0 s
    ✓ stablelib seal 64 bytes                                             136125.4 ops/s    7.346169 us/op        -       4025 runs   30.1 s
    ✓ noble seal 64 bytes                                                 150779.6 ops/s    6.632199 us/op        -       4459 runs   30.1 s
    ✓ chainsafe open 64 bytes                                             635232.8 ops/s    1.574226 us/op        -      18745 runs   30.0 s
    ✓ stablelib open 64 bytes                                             145797.0 ops/s    6.858851 us/op        -       4308 runs   30.1 s
    ✓ noble open 64 bytes                                                 148018.9 ops/s    6.755892 us/op        -       4371 runs   30.0 s
    ✓ chainsafe seal 1.00 KB                                              99285.50 ops/s    10.07196 us/op        -       2924 runs   30.0 s
    ✓ stablelib seal 1.00 KB                                              38798.05 ops/s    25.77449 us/op        -       1149 runs   30.1 s
    ✓ noble seal 1.00 KB                                                  82057.41 ops/s    12.18659 us/op        -       2424 runs   30.0 s
    ✓ chainsafe open 1.00 KB                                              100943.3 ops/s    9.906554 us/op        -       2982 runs   30.1 s
    ✓ stablelib open 1.00 KB                                              36347.17 ops/s    27.51246 us/op        -       1073 runs   30.0 s
    ✓ noble open 1.00 KB                                                  80123.76 ops/s    12.48069 us/op        -       2368 runs   30.1 s
    ✓ chainsafe seal 4.00 KB                                              28374.74 ops/s    35.24261 us/op        -        837 runs   30.1 s
    ✓ stablelib seal 4.00 KB                                              11710.30 ops/s    85.39493 us/op        -        347 runs   30.2 s
    ✓ noble seal 4.00 KB                                                  30496.07 ops/s    32.79111 us/op        -        900 runs   30.0 s
    ✓ chainsafe open 4.00 KB                                              29200.03 ops/s    34.24654 us/op        -        861 runs   30.1 s
    ✓ stablelib open 4.00 KB                                              10933.00 ops/s    91.46624 us/op        -        323 runs   30.1 s
    ✓ noble open 4.00 KB                                                  30155.13 ops/s    33.16186 us/op        -        892 runs   30.1 s
    ✓ chainsafe seal 8.00 KB                                              14577.58 ops/s    68.59850 us/op        -        431 runs   30.2 s
    ✓ stablelib seal 8.00 KB                                              5880.412 ops/s    170.0561 us/op        -        174 runs   30.3 s
    ✓ noble seal 8.00 KB                                                  16014.05 ops/s    62.44518 us/op        -        473 runs   30.1 s
    ✓ chainsafe open 8.00 KB                                              14990.32 ops/s    66.70972 us/op        -        443 runs   30.1 s
    ✓ stablelib open 8.00 KB                                              5563.228 ops/s    179.7517 us/op        -        165 runs   30.2 s
    ✓ noble open 8.00 KB                                                  15821.22 ops/s    63.20624 us/op        -        467 runs   30.1 s
    ✓ chainsafe seal 64.00 KB                                             1784.257 ops/s    560.4575 us/op        -         54 runs   30.8 s
    ✓ stablelib seal 64.00 KB                                             735.6552 ops/s    1.359332 ms/op        -         23 runs   32.6 s
    ✓ noble seal 64.00 KB                                                 2020.801 ops/s    494.8534 us/op        -         60 runs   30.7 s
    ✓ chainsafe open 64.00 KB                                             1854.636 ops/s    539.1893 us/op        -         56 runs   30.8 s
    ✓ stablelib open 64.00 KB                                             691.5201 ops/s    1.446090 ms/op        -         21 runs   31.8 s
    ✓ noble open 64.00 KB                                                 2085.731 ops/s    479.4481 us/op        -         62 runs   30.9 s
```

### License

Apache 2.0
