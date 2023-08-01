import {itBench, setBenchOpts} from "@dapplion/benchmark";
import crypto from "crypto";
import {ChaCha20Poly1305 as ChaCha20Poly1305Stablelib} from "@stablelib/chacha20poly1305";
import {chacha20poly1305 as chacha20poly1305Noble} from '@noble/ciphers/chacha';
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

  for (const dataLength of [32, 64, 1024, 8192, 65536, 1048576]) {
    const plainText = new Uint8Array(crypto.randomBytes(dataLength));
    const sealed = stablelib.seal(nonce, plainText, ad);

    itBench({
      id: `chainsafe seal ${formatBytes(dataLength)}`,
      fn: () => {
        chainsafe.seal(key, nonce, plainText, ad);
      },
    });

    itBench({
      id: `stablelib seal ${formatBytes(dataLength)}`,
      fn: () => {
        stablelib.seal(nonce, plainText, ad);
      },
    });

    itBench({
      id: `noble seal ${formatBytes(dataLength)}`,
      fn: () => {
        chacha20poly1305Noble(key, nonce, ad).encrypt(plainText);
      },
    });

    itBench({
      id: `chainsafe open ${formatBytes(dataLength)}`,
      beforeEach: () => new Uint8Array(sealed),
      fn: (clonedSealed) => {
        chainsafe.open(key, nonce, clonedSealed, ad);
      },
    });

    itBench({
      id: `stablelib open ${formatBytes(dataLength)}`,
      beforeEach: () => new Uint8Array(sealed),
      fn: (clonedSealed) => {
        stablelib.open(nonce, clonedSealed, ad);
      },
    });

    itBench({
      id: `noble open ${formatBytes(dataLength)}`,
      beforeEach: () => new Uint8Array(sealed),
      fn: (clonedSealed) => {
        chacha20poly1305Noble(key, nonce, ad).decrypt(clonedSealed);
      },
    });
  }
});
