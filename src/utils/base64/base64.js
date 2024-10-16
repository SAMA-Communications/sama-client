import { Buffer } from "buffer";

function decodeBase64(base64) {
  const latin1String = window.atob(base64);
  const uint8Array = new Uint8Array(latin1String.length);
  for (let i = 0; i < latin1String.length; i++) {
    uint8Array[i] = latin1String.charCodeAt(i);
  }
  return uint8Array;
}

function encodeBase64(uint8Array) {
  return Buffer.from(uint8Array).toString("base64");
}

function encodeUnpaddedBase64(uint8Array) {
  return encodeBase64(uint8Array).replace(/={1,2}$/, "");
}

export { encodeUnpaddedBase64, decodeBase64 };
