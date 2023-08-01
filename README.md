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
    ✓ chainsafe seal 32 bytes                                             653167.9 ops/s    1.531000 us/op        -   17196777 runs   30.1 s
    ✓ stablelib seal 32 bytes                                             134499.0 ops/s    7.435000 us/op        -    3908292 runs   30.1 s
    ✓ noble seal 32 bytes                                                 153350.7 ops/s    6.521000 us/op        -    4439299 runs   30.1 s
    ✓ chainsafe open 32 bytes                                             457665.9 ops/s    2.185000 us/op        -   11511464 runs   30.1 s
    ✓ stablelib open 32 bytes                                             127388.5 ops/s    7.850000 us/op        -    3611082 runs   30.1 s
    ✓ noble open 32 bytes                                                 137287.2 ops/s    7.284000 us/op        -    3844123 runs   30.1 s
    ✓ chainsafe seal 64 bytes                                             449034.6 ops/s    2.227000 us/op        -   12323227 runs   30.1 s
    ✓ stablelib seal 64 bytes                                             125203.5 ops/s    7.987000 us/op        -    3651443 runs   30.1 s
    ✓ noble seal 64 bytes                                                 146092.0 ops/s    6.845000 us/op        -    4241264 runs   30.1 s
    ✓ chainsafe open 64 bytes                                             542299.3 ops/s    1.844000 us/op        -   10879791 runs   30.1 s
    ✓ stablelib open 64 bytes                                             126454.2 ops/s    7.908000 us/op        -    3399078 runs   30.1 s
    ✓ noble open 64 bytes                                                 146134.7 ops/s    6.843000 us/op        -    3825147 runs   30.1 s
    ✓ chainsafe seal 1.00 KB                                              99641.29 ops/s    10.03600 us/op        -    2930573 runs   30.1 s
    ✓ stablelib seal 1.00 KB                                              36844.63 ops/s    27.14100 us/op        -    1097638 runs   30.1 s
    ✓ noble seal 1.00 KB                                                  76161.46 ops/s    13.13000 us/op        -    2248184 runs   30.1 s
    ✓ chainsafe open 1.00 KB                                              101657.0 ops/s    9.837000 us/op        -    2789744 runs   30.1 s
    ✓ stablelib open 1.00 KB                                              34478.00 ops/s    29.00400 us/op        -    1000843 runs   30.1 s
    ✓ noble open 1.00 KB                                                  72463.77 ops/s    13.80000 us/op        -    2020143 runs   30.1 s
    ✓ chainsafe seal 8.00 KB                                              13900.28 ops/s    71.94100 us/op        -     412838 runs   30.0 s
    ✓ stablelib seal 8.00 KB                                              5704.604 ops/s    175.2970 us/op        -     170190 runs   30.1 s
    ✓ noble seal 8.00 KB                                                  15439.48 ops/s    64.76900 us/op        -     461084 runs   30.1 s
    ✓ chainsafe open 8.00 KB                                              14481.84 ops/s    69.05200 us/op        -     415486 runs   30.0 s
    ✓ stablelib open 8.00 KB                                              5297.705 ops/s    188.7610 us/op        -     154945 runs   30.0 s
    ✓ noble open 8.00 KB                                                  15275.57 ops/s    65.46400 us/op        -     447457 runs   30.1 s
    ✓ chainsafe seal 64.00 KB                                             1805.357 ops/s    553.9070 us/op        -      53108 runs   30.0 s
    ✓ stablelib seal 64.00 KB                                             741.8992 ops/s    1.347892 ms/op        -      21915 runs   30.1 s
    ✓ noble seal 64.00 KB                                                 2024.226 ops/s    494.0160 us/op        -      59531 runs   30.0 s
    ✓ chainsafe open 64.00 KB                                             1887.173 ops/s    529.8930 us/op        -      54369 runs   30.0 s
    ✓ stablelib open 64.00 KB                                             695.4659 ops/s    1.437885 ms/op        -      20400 runs   30.0 s
    ✓ noble open 64.00 KB                                                 1985.001 ops/s    503.7780 us/op        -      57644 runs   30.0 s
    ✓ chainsafe seal 1.00 MB                                              116.1527 ops/s    8.609358 ms/op        -       3426 runs   30.0 s
    ✓ stablelib seal 1.00 MB                                              47.55042 ops/s    21.03031 ms/op        -       1406 runs   30.1 s
    ✓ noble seal 1.00 MB                                                  130.8939 ops/s    7.639775 ms/op        -       3858 runs   30.0 s
    ✓ chainsafe open 1.00 MB                                              120.1874 ops/s    8.320342 ms/op        -       3503 runs   30.1 s
    ✓ stablelib open 1.00 MB                                              44.23757 ops/s    22.60522 ms/op        -       1301 runs   30.1 s
    ✓ noble open 1.00 MB                                                  128.7178 ops/s    7.768935 ms/op        -       3756 runs   30.0 s
```

### License

Apache 2.0
