import {itBench, setBenchOpts} from "@dapplion/benchmark";
import crypto from "crypto";
import {ChaCha20Poly1305 as ChaCha20Poly1305Stablelib} from "@stablelib/chacha20poly1305";
import {chacha20poly1305 as noble} from '@noble/ciphers/chacha';
import {ChaCha20Poly1305} from "../../src/chacha20poly1305";
import {KEY_LENGTH, NONCE_LENGTH} from "../../common/const";
import {newInstance} from "../../src/wasm";
import {formatBytes} from "./util";

describe("chacha20poly1305", function () {
  this.timeout(0);
  setBenchOpts({
    minMs: 30_000,
  });
  const ctx = newInstance();
  const chainsafe = new ChaCha20Poly1305(ctx);

  const key = new Uint8Array(crypto.randomBytes(KEY_LENGTH));
  const stablelib = new ChaCha20Poly1305Stablelib(key);
  const nonce = new Uint8Array(crypto.randomBytes(NONCE_LENGTH));
  const ad = new Uint8Array(crypto.randomBytes(32));
  const runsFactor = 1000;


  for (const dataLength of [32, 64, 1024, 4096, 8192, 65536]) {
    const plainText = new Uint8Array(crypto.randomBytes(dataLength));
    const sealed = stablelib.seal(nonce, plainText, ad);
    const testCases: {impl: string; sealFn: () => void; openFn: () => void}[] = [
      {impl: "chainsafe", sealFn: () => chainsafe.seal(key, nonce, plainText, ad), openFn: () => chainsafe.open(key, nonce, sealed, ad)},
      {impl: "stablelib", sealFn: () => stablelib.seal(nonce, plainText, ad), openFn:  () => stablelib.open(nonce, sealed, ad)},
      {impl: "noble", sealFn: () => noble(key, nonce, ad).encrypt(plainText), openFn: () => noble(key, nonce, ad).decrypt(sealed)}
    ]

    // seal
    for (const {impl, sealFn} of testCases) {
      itBench({
        id: `${impl} seal ${formatBytes(dataLength)}`,
        fn: () => {
          for (let i = 0; i < runsFactor; i++) {
            sealFn();
          }
        },
        runsFactor,
      });
    }

    // open
    for (const {impl, openFn} of testCases) {
      itBench({
        id: `${impl} open ${formatBytes(dataLength)}`,
        fn: () => {
          for (let i = 0; i < runsFactor; i++) {
            openFn();
          }
        },
        runsFactor,
      });
    }
  }
});
