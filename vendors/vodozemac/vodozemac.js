let wasm;

const cachedTextDecoder =
  typeof TextDecoder !== "undefined"
    ? new TextDecoder("utf-8", { ignoreBOM: true, fatal: true })
    : {
        decode: () => {
          throw Error("TextDecoder not available");
        },
      };

if (typeof TextDecoder !== "undefined") {
  cachedTextDecoder.decode();
}

let cachedUint8Memory0 = null;

function getUint8Memory0() {
  if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];

  if (typeof heap_next !== "number") throw new Error("corrupt heap");

  heap[idx] = obj;
  return idx;
}

function getObject(idx) {
  return heap[idx];
}

function _assertBoolean(n) {
  if (typeof n !== "boolean") {
    throw new Error(`expected a boolean argument, found ${typeof n}`);
  }
}

function dropObject(idx) {
  if (idx < 132) return;
  heap[idx] = heap_next;
  heap_next = idx;
}

function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}

function _assertNum(n) {
  if (typeof n !== "number")
    throw new Error(`expected a number argument, found ${typeof n}`);
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
  if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachedInt32Memory0;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder =
  typeof TextEncoder !== "undefined"
    ? new TextEncoder("utf-8")
    : {
        encode: () => {
          throw Error("TextEncoder not available");
        },
      };

const encodeString =
  typeof cachedTextEncoder.encodeInto === "function"
    ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
      }
    : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
          read: arg.length,
          written: buf.length,
        };
      };

function passStringToWasm0(arg, malloc, realloc) {
  if (typeof arg !== "string")
    throw new Error(`expected a string argument, found ${typeof arg}`);

  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length, 1) >>> 0;
    getUint8Memory0()
      .subarray(ptr, ptr + buf.length)
      .set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;

  const mem = getUint8Memory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7f) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, (len = offset + arg.length * 3), 1) >>> 0;
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);
    if (ret.read !== arg.length) throw new Error("failed to pass whole string");
    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}

function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1, 1) >>> 0;
  getUint8Memory0().set(arg, ptr / 1);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}

function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedUint16Memory0 = null;

function getUint16Memory0() {
  if (cachedUint16Memory0 === null || cachedUint16Memory0.byteLength === 0) {
    cachedUint16Memory0 = new Uint16Array(wasm.memory.buffer);
  }
  return cachedUint16Memory0;
}

function getArrayU16FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint16Memory0().subarray(ptr / 2, ptr / 2 + len);
}

function _assertClass(instance, klass) {
  if (!(instance instanceof klass)) {
    throw new Error(`expected instance of ${klass.name}`);
  }
  return instance.ptr;
}

function logError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    let error = (function () {
      try {
        return e instanceof Error
          ? `${e.message}\n\nStack:\n${e.stack}`
          : e.toString();
      } catch (_) {
        return "<failed to stringify thrown value>";
      }
    })();
    console.error(
      "wasm-bindgen: imported JS function that was not marked as `catch` threw an error:",
      error
    );
    throw e;
  }
}

function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    wasm.__wbindgen_exn_store(addHeapObject(e));
  }
}

const AccountFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_account_free(ptr >>> 0));
/**
 */
export class Account {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Account.prototype);
    obj.__wbg_ptr = ptr;
    AccountFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    AccountFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_account_free(ptr);
  }
  /**
   */
  constructor() {
    const ret = wasm.account_new();
    this.__wbg_ptr = ret >>> 0;
    return this;
  }
  /**
   * @param {string} pickle
   * @param {Uint8Array} pickle_key
   * @returns {Account}
   */
  static from_pickle(pickle, pickle_key) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        pickle,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passArray8ToWasm0(pickle_key, wasm.__wbindgen_malloc);
      const len1 = WASM_VECTOR_LEN;
      wasm.account_from_pickle(retptr, ptr0, len0, ptr1, len1);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Account.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} pickle
   * @param {Uint8Array} pickle_key
   * @returns {Account}
   */
  static from_libolm_pickle(pickle, pickle_key) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        pickle,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passArray8ToWasm0(pickle_key, wasm.__wbindgen_malloc);
      const len1 = WASM_VECTOR_LEN;
      wasm.account_from_libolm_pickle(retptr, ptr0, len0, ptr1, len1);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Account.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} pickle_key
   * @returns {string}
   */
  pickle(pickle_key) {
    let deferred3_0;
    let deferred3_1;
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      const ptr0 = passArray8ToWasm0(pickle_key, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.account_pickle(retptr, this.__wbg_ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr2 = r0;
      var len2 = r1;
      if (r3) {
        ptr2 = 0;
        len2 = 0;
        throw takeObject(r2);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @returns {string}
   */
  get ed25519_key() {
    let deferred1_0;
    let deferred1_1;
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      wasm.account_ed25519_key(retptr, this.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * @returns {string}
   */
  get curve25519_key() {
    let deferred1_0;
    let deferred1_1;
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      wasm.account_curve25519_key(retptr, this.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * @param {string} message
   * @returns {string}
   */
  sign(message) {
    let deferred2_0;
    let deferred2_1;
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      const ptr0 = passStringToWasm0(
        message,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.account_sign(retptr, this.__wbg_ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred2_0 = r0;
      deferred2_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
  /**
   * @returns {number}
   */
  get max_number_of_one_time_keys() {
    if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
    _assertNum(this.__wbg_ptr);
    const ret = wasm.account_max_number_of_one_time_keys(this.__wbg_ptr);
    return ret >>> 0;
  }
  /**
   * @returns {any}
   */
  get one_time_keys() {
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      wasm.account_one_time_keys(retptr, this.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {number} count
   */
  generate_one_time_keys(count) {
    if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
    _assertNum(this.__wbg_ptr);
    _assertNum(count);
    wasm.account_generate_one_time_keys(this.__wbg_ptr, count);
  }
  /**
   * @returns {any}
   */
  get fallback_key() {
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      wasm.account_fallback_key(retptr, this.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   */
  generate_fallback_key() {
    if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
    _assertNum(this.__wbg_ptr);
    wasm.account_generate_fallback_key(this.__wbg_ptr);
  }
  /**
   */
  mark_keys_as_published() {
    if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
    _assertNum(this.__wbg_ptr);
    wasm.account_mark_keys_as_published(this.__wbg_ptr);
  }
  /**
   * @param {string} identity_key
   * @param {string} one_time_key
   * @returns {Session}
   */
  create_outbound_session(identity_key, one_time_key) {
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      const ptr0 = passStringToWasm0(
        identity_key,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passStringToWasm0(
        one_time_key,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len1 = WASM_VECTOR_LEN;
      wasm.account_create_outbound_session(
        retptr,
        this.__wbg_ptr,
        ptr0,
        len0,
        ptr1,
        len1
      );
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Session.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} identity_key
   * @param {OlmMessage} message
   * @returns {InboundCreationResult}
   */
  create_inbound_session(identity_key, message) {
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      const ptr0 = passStringToWasm0(
        identity_key,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len0 = WASM_VECTOR_LEN;
      _assertClass(message, OlmMessage);
      if (message.__wbg_ptr === 0) {
        throw new Error("Attempt to use a moved value");
      }
      wasm.account_create_inbound_session(
        retptr,
        this.__wbg_ptr,
        ptr0,
        len0,
        message.__wbg_ptr
      );
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return InboundCreationResult.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const DecryptedMessageFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) =>
        wasm.__wbg_decryptedmessage_free(ptr >>> 0)
      );
/**
 */
export class DecryptedMessage {
  constructor() {
    throw new Error("cannot invoke `new` directly");
  }

  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(DecryptedMessage.prototype);
    obj.__wbg_ptr = ptr;
    DecryptedMessageFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    DecryptedMessageFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_decryptedmessage_free(ptr);
  }
  /**
   * @returns {string}
   */
  get plaintext() {
    let deferred1_0;
    let deferred1_1;
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      wasm.__wbg_get_decryptedmessage_plaintext(retptr, this.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * @param {string} arg0
   */
  set plaintext(arg0) {
    if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
    _assertNum(this.__wbg_ptr);
    const ptr0 = passStringToWasm0(
      arg0,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc
    );
    const len0 = WASM_VECTOR_LEN;
    wasm.__wbg_set_decryptedmessage_plaintext(this.__wbg_ptr, ptr0, len0);
  }
  /**
   * @returns {number}
   */
  get message_index() {
    if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
    _assertNum(this.__wbg_ptr);
    const ret = wasm.__wbg_get_decryptedmessage_message_index(this.__wbg_ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} arg0
   */
  set message_index(arg0) {
    if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
    _assertNum(this.__wbg_ptr);
    _assertNum(arg0);
    wasm.__wbg_set_decryptedmessage_message_index(this.__wbg_ptr, arg0);
  }
}

const EstablishedSasFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) =>
        wasm.__wbg_establishedsas_free(ptr >>> 0)
      );
/**
 */
export class EstablishedSas {
  constructor() {
    throw new Error("cannot invoke `new` directly");
  }

  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(EstablishedSas.prototype);
    obj.__wbg_ptr = ptr;
    EstablishedSasFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    EstablishedSasFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_establishedsas_free(ptr);
  }
  /**
   * @param {string} info
   * @returns {SasBytes}
   */
  bytes(info) {
    if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
    _assertNum(this.__wbg_ptr);
    const ptr0 = passStringToWasm0(
      info,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.establishedsas_bytes(this.__wbg_ptr, ptr0, len0);
    return SasBytes.__wrap(ret);
  }
  /**
   * @param {string} input
   * @param {string} info
   * @returns {string}
   */
  calculate_mac(input, info) {
    let deferred3_0;
    let deferred3_1;
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      const ptr0 = passStringToWasm0(
        input,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passStringToWasm0(
        info,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len1 = WASM_VECTOR_LEN;
      wasm.establishedsas_calculate_mac(
        retptr,
        this.__wbg_ptr,
        ptr0,
        len0,
        ptr1,
        len1
      );
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred3_0 = r0;
      deferred3_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} input
   * @param {string} info
   * @returns {string}
   */
  calculate_mac_invalid_base64(input, info) {
    let deferred3_0;
    let deferred3_1;
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      const ptr0 = passStringToWasm0(
        input,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passStringToWasm0(
        info,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len1 = WASM_VECTOR_LEN;
      wasm.establishedsas_calculate_mac_invalid_base64(
        retptr,
        this.__wbg_ptr,
        ptr0,
        len0,
        ptr1,
        len1
      );
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred3_0 = r0;
      deferred3_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} input
   * @param {string} info
   * @param {string} tag
   */
  verify_mac(input, info, tag) {
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      const ptr0 = passStringToWasm0(
        input,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passStringToWasm0(
        info,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len1 = WASM_VECTOR_LEN;
      const ptr2 = passStringToWasm0(
        tag,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len2 = WASM_VECTOR_LEN;
      wasm.establishedsas_verify_mac(
        retptr,
        this.__wbg_ptr,
        ptr0,
        len0,
        ptr1,
        len1,
        ptr2,
        len2
      );
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      if (r1) {
        throw takeObject(r0);
      }
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const GroupSessionFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) =>
        wasm.__wbg_groupsession_free(ptr >>> 0)
      );
/**
 */
export class GroupSession {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(GroupSession.prototype);
    obj.__wbg_ptr = ptr;
    GroupSessionFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    GroupSessionFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_groupsession_free(ptr);
  }
  /**
   */
  constructor() {
    const ret = wasm.groupsession_new();
    this.__wbg_ptr = ret >>> 0;
    return this;
  }
  /**
   * @returns {string}
   */
  get session_id() {
    let deferred1_0;
    let deferred1_1;
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      wasm.groupsession_session_id(retptr, this.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * @returns {string}
   */
  get session_key() {
    let deferred1_0;
    let deferred1_1;
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      wasm.groupsession_session_key(retptr, this.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * @returns {number}
   */
  get message_index() {
    if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
    _assertNum(this.__wbg_ptr);
    const ret = wasm.groupsession_message_index(this.__wbg_ptr);
    return ret >>> 0;
  }
  /**
   * @param {string} plaintext
   * @returns {string}
   */
  encrypt(plaintext) {
    let deferred2_0;
    let deferred2_1;
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      const ptr0 = passStringToWasm0(
        plaintext,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.groupsession_encrypt(retptr, this.__wbg_ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred2_0 = r0;
      deferred2_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
  /**
   * @param {Uint8Array} pickle_key
   * @returns {string}
   */
  pickle(pickle_key) {
    let deferred3_0;
    let deferred3_1;
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      const ptr0 = passArray8ToWasm0(pickle_key, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.groupsession_pickle(retptr, this.__wbg_ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr2 = r0;
      var len2 = r1;
      if (r3) {
        ptr2 = 0;
        len2 = 0;
        throw takeObject(r2);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} pickle
   * @param {Uint8Array} pickle_key
   * @returns {GroupSession}
   */
  static from_pickle(pickle, pickle_key) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        pickle,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passArray8ToWasm0(pickle_key, wasm.__wbindgen_malloc);
      const len1 = WASM_VECTOR_LEN;
      wasm.groupsession_from_pickle(retptr, ptr0, len0, ptr1, len1);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return GroupSession.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const InboundCreationResultFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) =>
        wasm.__wbg_inboundcreationresult_free(ptr >>> 0)
      );
/**
 */
export class InboundCreationResult {
  constructor() {
    throw new Error("cannot invoke `new` directly");
  }

  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(InboundCreationResult.prototype);
    obj.__wbg_ptr = ptr;
    InboundCreationResultFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    InboundCreationResultFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_inboundcreationresult_free(ptr);
  }
  /**
   * @returns {Session}
   */
  get session() {
    if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
    const ptr = this.__destroy_into_raw();
    _assertNum(ptr);
    const ret = wasm.inboundcreationresult_session(ptr);
    return Session.__wrap(ret);
  }
  /**
   * @returns {string}
   */
  get plaintext() {
    let deferred1_0;
    let deferred1_1;
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      wasm.inboundcreationresult_plaintext(retptr, this.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
}

const InboundGroupSessionFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) =>
        wasm.__wbg_inboundgroupsession_free(ptr >>> 0)
      );
/**
 */
export class InboundGroupSession {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(InboundGroupSession.prototype);
    obj.__wbg_ptr = ptr;
    InboundGroupSessionFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    InboundGroupSessionFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_inboundgroupsession_free(ptr);
  }
  /**
   * @param {string} session_key
   */
  constructor(session_key) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        session_key,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.inboundgroupsession_new(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      this.__wbg_ptr = r0 >>> 0;
      return this;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} session_key
   * @returns {InboundGroupSession}
   */
  static import(session_key) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        session_key,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.inboundgroupsession_import(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return InboundGroupSession.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  get session_id() {
    let deferred1_0;
    let deferred1_1;
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      wasm.inboundgroupsession_session_id(retptr, this.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * @returns {number}
   */
  get first_known_index() {
    if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
    _assertNum(this.__wbg_ptr);
    const ret = wasm.inboundgroupsession_first_known_index(this.__wbg_ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {string | undefined}
   */
  export_at(index) {
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      _assertNum(index);
      wasm.inboundgroupsession_export_at(retptr, this.__wbg_ptr, index);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      let v1;
      if (r0 !== 0) {
        v1 = getStringFromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1, 1);
      }
      return v1;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} ciphertext
   * @returns {DecryptedMessage}
   */
  decrypt(ciphertext) {
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      const ptr0 = passStringToWasm0(
        ciphertext,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.inboundgroupsession_decrypt(retptr, this.__wbg_ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return DecryptedMessage.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} pickle_key
   * @returns {string}
   */
  pickle(pickle_key) {
    let deferred3_0;
    let deferred3_1;
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      const ptr0 = passArray8ToWasm0(pickle_key, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.inboundgroupsession_pickle(retptr, this.__wbg_ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr2 = r0;
      var len2 = r1;
      if (r3) {
        ptr2 = 0;
        len2 = 0;
        throw takeObject(r2);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} pickle
   * @param {Uint8Array} pickle_key
   * @returns {InboundGroupSession}
   */
  static from_pickle(pickle, pickle_key) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        pickle,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passArray8ToWasm0(pickle_key, wasm.__wbindgen_malloc);
      const len1 = WASM_VECTOR_LEN;
      wasm.inboundgroupsession_from_pickle(retptr, ptr0, len0, ptr1, len1);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return InboundGroupSession.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} pickle
   * @param {Uint8Array} pickle_key
   * @returns {InboundGroupSession}
   */
  static from_libolm_pickle(pickle, pickle_key) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        pickle,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passArray8ToWasm0(pickle_key, wasm.__wbindgen_malloc);
      const len1 = WASM_VECTOR_LEN;
      wasm.inboundgroupsession_from_libolm_pickle(
        retptr,
        ptr0,
        len0,
        ptr1,
        len1
      );
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return InboundGroupSession.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const OlmMessageFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_olmmessage_free(ptr >>> 0));
/**
 */
export class OlmMessage {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(OlmMessage.prototype);
    obj.__wbg_ptr = ptr;
    OlmMessageFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    OlmMessageFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_olmmessage_free(ptr);
  }
  /**
   * @returns {string}
   */
  get ciphertext() {
    let deferred1_0;
    let deferred1_1;
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      wasm.__wbg_get_olmmessage_ciphertext(retptr, this.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * @param {string} arg0
   */
  set ciphertext(arg0) {
    if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
    _assertNum(this.__wbg_ptr);
    const ptr0 = passStringToWasm0(
      arg0,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc
    );
    const len0 = WASM_VECTOR_LEN;
    wasm.__wbg_set_olmmessage_ciphertext(this.__wbg_ptr, ptr0, len0);
  }
  /**
   * @returns {number}
   */
  get message_type() {
    if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
    _assertNum(this.__wbg_ptr);
    const ret = wasm.__wbg_get_olmmessage_message_type(this.__wbg_ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} arg0
   */
  set message_type(arg0) {
    if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
    _assertNum(this.__wbg_ptr);
    _assertNum(arg0);
    wasm.__wbg_set_olmmessage_message_type(this.__wbg_ptr, arg0);
  }
  /**
   * @param {number} message_type
   * @param {string} ciphertext
   */
  constructor(message_type, ciphertext) {
    _assertNum(message_type);
    const ptr0 = passStringToWasm0(
      ciphertext,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.olmmessage_new(message_type, ptr0, len0);
    this.__wbg_ptr = ret >>> 0;
    return this;
  }
}

const SasFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_sas_free(ptr >>> 0));
/**
 */
export class Sas {
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    SasFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_sas_free(ptr);
  }
  /**
   */
  constructor() {
    const ret = wasm.sas_new();
    this.__wbg_ptr = ret >>> 0;
    return this;
  }
  /**
   * @returns {string}
   */
  get public_key() {
    let deferred1_0;
    let deferred1_1;
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      wasm.sas_public_key(retptr, this.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * @param {string} key
   * @returns {EstablishedSas}
   */
  diffie_hellman(key) {
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const ptr = this.__destroy_into_raw();
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(ptr);
      const ptr0 = passStringToWasm0(
        key,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.sas_diffie_hellman(retptr, ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return EstablishedSas.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const SasBytesFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_sasbytes_free(ptr >>> 0));
/**
 */
export class SasBytes {
  constructor() {
    throw new Error("cannot invoke `new` directly");
  }

  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(SasBytes.prototype);
    obj.__wbg_ptr = ptr;
    SasBytesFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    SasBytesFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_sasbytes_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  get emoji_indices() {
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      wasm.sasbytes_emoji_indices(retptr, this.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v1 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1, 1);
      return v1;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint16Array}
   */
  get decimals() {
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      wasm.sasbytes_decimals(retptr, this.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v1 = getArrayU16FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 2, 2);
      return v1;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const SessionFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_session_free(ptr >>> 0));
/**
 */
export class Session {
  constructor() {
    throw new Error("cannot invoke `new` directly");
  }

  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Session.prototype);
    obj.__wbg_ptr = ptr;
    SessionFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    SessionFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_session_free(ptr);
  }
  /**
   * @param {Uint8Array} pickle_key
   * @returns {string}
   */
  pickle(pickle_key) {
    let deferred3_0;
    let deferred3_1;
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      const ptr0 = passArray8ToWasm0(pickle_key, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.session_pickle(retptr, this.__wbg_ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr2 = r0;
      var len2 = r1;
      if (r3) {
        ptr2 = 0;
        len2 = 0;
        throw takeObject(r2);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} pickle
   * @param {Uint8Array} pickle_key
   * @returns {Session}
   */
  static from_pickle(pickle, pickle_key) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        pickle,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passArray8ToWasm0(pickle_key, wasm.__wbindgen_malloc);
      const len1 = WASM_VECTOR_LEN;
      wasm.session_from_pickle(retptr, ptr0, len0, ptr1, len1);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Session.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} pickle
   * @param {Uint8Array} pickle_key
   * @returns {Session}
   */
  static from_libolm_pickle(pickle, pickle_key) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        pickle,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passArray8ToWasm0(pickle_key, wasm.__wbindgen_malloc);
      const len1 = WASM_VECTOR_LEN;
      wasm.session_from_libolm_pickle(retptr, ptr0, len0, ptr1, len1);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Session.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  get session_id() {
    let deferred1_0;
    let deferred1_1;
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      wasm.session_session_id(retptr, this.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * @param {OlmMessage} message
   * @returns {boolean}
   */
  session_matches(message) {
    if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
    _assertNum(this.__wbg_ptr);
    _assertClass(message, OlmMessage);
    if (message.__wbg_ptr === 0) {
      throw new Error("Attempt to use a moved value");
    }
    const ret = wasm.session_session_matches(this.__wbg_ptr, message.__wbg_ptr);
    return ret !== 0;
  }
  /**
   * @param {string} plaintext
   * @returns {OlmMessage}
   */
  encrypt(plaintext) {
    if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
    _assertNum(this.__wbg_ptr);
    const ptr0 = passStringToWasm0(
      plaintext,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.session_encrypt(this.__wbg_ptr, ptr0, len0);
    return OlmMessage.__wrap(ret);
  }
  /**
   * @param {OlmMessage} message
   * @returns {string}
   */
  decrypt(message) {
    let deferred2_0;
    let deferred2_1;
    try {
      if (this.__wbg_ptr == 0) throw new Error("Attempt to use a moved value");
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertNum(this.__wbg_ptr);
      _assertClass(message, OlmMessage);
      if (message.__wbg_ptr === 0) {
        throw new Error("Attempt to use a moved value");
      }
      wasm.session_decrypt(retptr, this.__wbg_ptr, message.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr1 = r0;
      var len1 = r1;
      if (r3) {
        ptr1 = 0;
        len1 = 0;
        throw takeObject(r2);
      }
      deferred2_0 = ptr1;
      deferred2_1 = len1;
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
}

async function __wbg_load(module, imports) {
  if (typeof Response === "function" && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === "function") {
      try {
        return await WebAssembly.instantiateStreaming(module, imports);
      } catch (e) {
        if (module.headers.get("Content-Type") != "application/wasm") {
          console.warn(
            "`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",
            e
          );
        } else {
          throw e;
        }
      }
    }

    const bytes = await module.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module, imports);

    if (instance instanceof WebAssembly.Instance) {
      return { instance, module };
    } else {
      return instance;
    }
  }
}

function __wbg_get_imports() {
  const imports = {};
  imports.wbg = {};
  imports.wbg.__wbindgen_error_new = function (arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_string_new = function (arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_set_20cbc34131e76824 = function () {
    return logError(function (arg0, arg1, arg2) {
      getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
    }, arguments);
  };
  imports.wbg.__wbindgen_is_undefined = function (arg0) {
    const ret = getObject(arg0) === undefined;
    _assertBoolean(ret);
    return ret;
  };
  imports.wbg.__wbg_self_7eede1f4488bf346 = function () {
    return handleError(function () {
      const ret = self.self;
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_msCrypto_511eefefbfc70ae4 = function () {
    return logError(function (arg0) {
      const ret = getObject(arg0).msCrypto;
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_crypto_c909fb428dcbddb6 = function () {
    return logError(function (arg0) {
      const ret = getObject(arg0).crypto;
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_getRandomValues_307049345d0bd88c = function () {
    return logError(function (arg0) {
      const ret = getObject(arg0).getRandomValues;
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_getRandomValues_cd175915511f705e = function () {
    return logError(function (arg0, arg1) {
      getObject(arg0).getRandomValues(getObject(arg1));
    }, arguments);
  };
  imports.wbg.__wbg_randomFillSync_85b3f4c52c56c313 = function () {
    return logError(function (arg0, arg1, arg2) {
      getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
    }, arguments);
  };
  imports.wbg.__wbg_static_accessor_MODULE_ef3aa2eb251158a5 = function () {
    return logError(function () {
      const ret = module;
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_require_900d5c3984fe7703 = function () {
    return logError(function (arg0, arg1, arg2) {
      const ret = getObject(arg0).require(getStringFromWasm0(arg1, arg2));
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_new_d9bc3a0147634640 = function () {
    return logError(function () {
      const ret = new Map();
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_set_8417257aaedc936b = function () {
    return logError(function (arg0, arg1, arg2) {
      const ret = getObject(arg0).set(getObject(arg1), getObject(arg2));
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_new_72fb9a18b5ae2624 = function () {
    return logError(function () {
      const ret = new Object();
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_new_63b92bc8671ed464 = function () {
    return logError(function (arg0) {
      const ret = new Uint8Array(getObject(arg0));
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_newwithlength_e9b4878cebadb3d3 = function () {
    return logError(function (arg0) {
      const ret = new Uint8Array(arg0 >>> 0);
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_subarray_a1f73cd4b5b42fe1 = function () {
    return logError(function (arg0, arg1, arg2) {
      const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_length_c20a40f15020d68a = function () {
    return logError(function (arg0) {
      const ret = getObject(arg0).length;
      _assertNum(ret);
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_set_a47bac70306a19a7 = function () {
    return logError(function (arg0, arg1, arg2) {
      getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    }, arguments);
  };
  imports.wbg.__wbindgen_is_string = function (arg0) {
    const ret = typeof getObject(arg0) === "string";
    _assertBoolean(ret);
    return ret;
  };
  imports.wbg.__wbg_buffer_12d079cc21e14bdb = function () {
    return logError(function (arg0) {
      const ret = getObject(arg0).buffer;
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbindgen_object_drop_ref = function (arg0) {
    takeObject(arg0);
  };
  imports.wbg.__wbindgen_throw = function (arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  };
  imports.wbg.__wbindgen_memory = function () {
    const ret = wasm.memory;
    return addHeapObject(ret);
  };

  return imports;
}

function __wbg_init_memory(imports, maybe_memory) {}

function __wbg_finalize_init(instance, module) {
  wasm = instance.exports;
  __wbg_init.__wbindgen_wasm_module = module;
  cachedInt32Memory0 = null;
  cachedUint16Memory0 = null;
  cachedUint8Memory0 = null;

  return wasm;
}

function initSync(module) {
  if (wasm !== undefined) return wasm;

  const imports = __wbg_get_imports();

  __wbg_init_memory(imports);

  if (!(module instanceof WebAssembly.Module)) {
    module = new WebAssembly.Module(module);
  }

  const instance = new WebAssembly.Instance(module, imports);

  return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
  if (wasm !== undefined) return wasm;

  if (typeof input === "undefined") {
    input = new URL("vodozemac_bg.wasm", import.meta.url);
  }
  const imports = __wbg_get_imports();

  if (
    typeof input === "string" ||
    (typeof Request === "function" && input instanceof Request) ||
    (typeof URL === "function" && input instanceof URL)
  ) {
    input = fetch(input);
  }

  __wbg_init_memory(imports);

  const { instance, module } = await __wbg_load(await input, imports);

  return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
