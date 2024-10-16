/* tslint:disable */
/* eslint-disable */
/**
*/
export class Account {
  free(): void;
/**
*/
  constructor();
/**
* @param {string} pickle
* @param {Uint8Array} pickle_key
* @returns {Account}
*/
  static from_pickle(pickle: string, pickle_key: Uint8Array): Account;
/**
* @param {string} pickle
* @param {Uint8Array} pickle_key
* @returns {Account}
*/
  static from_libolm_pickle(pickle: string, pickle_key: Uint8Array): Account;
/**
* @param {Uint8Array} pickle_key
* @returns {string}
*/
  pickle(pickle_key: Uint8Array): string;
/**
* @param {string} message
* @returns {string}
*/
  sign(message: string): string;
/**
* @param {number} count
*/
  generate_one_time_keys(count: number): void;
/**
*/
  generate_fallback_key(): void;
/**
*/
  mark_keys_as_published(): void;
/**
* @param {string} identity_key
* @param {string} one_time_key
* @returns {Session}
*/
  create_outbound_session(identity_key: string, one_time_key: string): Session;
/**
* @param {string} identity_key
* @param {OlmMessage} message
* @returns {InboundCreationResult}
*/
  create_inbound_session(identity_key: string, message: OlmMessage): InboundCreationResult;
/**
*/
  readonly curve25519_key: string;
/**
*/
  readonly ed25519_key: string;
/**
*/
  readonly fallback_key: any;
/**
*/
  readonly max_number_of_one_time_keys: number;
/**
*/
  readonly one_time_keys: any;
}
/**
*/
export class DecryptedMessage {
  free(): void;
/**
*/
  message_index: number;
/**
*/
  plaintext: string;
}
/**
*/
export class EstablishedSas {
  free(): void;
/**
* @param {string} info
* @returns {SasBytes}
*/
  bytes(info: string): SasBytes;
/**
* @param {string} input
* @param {string} info
* @returns {string}
*/
  calculate_mac(input: string, info: string): string;
/**
* @param {string} input
* @param {string} info
* @returns {string}
*/
  calculate_mac_invalid_base64(input: string, info: string): string;
/**
* @param {string} input
* @param {string} info
* @param {string} tag
*/
  verify_mac(input: string, info: string, tag: string): void;
}
/**
*/
export class GroupSession {
  free(): void;
/**
*/
  constructor();
/**
* @param {string} plaintext
* @returns {string}
*/
  encrypt(plaintext: string): string;
/**
* @param {Uint8Array} pickle_key
* @returns {string}
*/
  pickle(pickle_key: Uint8Array): string;
/**
* @param {string} pickle
* @param {Uint8Array} pickle_key
* @returns {GroupSession}
*/
  static from_pickle(pickle: string, pickle_key: Uint8Array): GroupSession;
/**
*/
  readonly message_index: number;
/**
*/
  readonly session_id: string;
/**
*/
  readonly session_key: string;
}
/**
*/
export class InboundCreationResult {
  free(): void;
/**
*/
  readonly plaintext: string;
/**
*/
  readonly session: Session;
}
/**
*/
export class InboundGroupSession {
  free(): void;
/**
* @param {string} session_key
*/
  constructor(session_key: string);
/**
* @param {string} session_key
* @returns {InboundGroupSession}
*/
  static import(session_key: string): InboundGroupSession;
/**
* @param {number} index
* @returns {string | undefined}
*/
  export_at(index: number): string | undefined;
/**
* @param {string} ciphertext
* @returns {DecryptedMessage}
*/
  decrypt(ciphertext: string): DecryptedMessage;
/**
* @param {Uint8Array} pickle_key
* @returns {string}
*/
  pickle(pickle_key: Uint8Array): string;
/**
* @param {string} pickle
* @param {Uint8Array} pickle_key
* @returns {InboundGroupSession}
*/
  static from_pickle(pickle: string, pickle_key: Uint8Array): InboundGroupSession;
/**
* @param {string} pickle
* @param {Uint8Array} pickle_key
* @returns {InboundGroupSession}
*/
  static from_libolm_pickle(pickle: string, pickle_key: Uint8Array): InboundGroupSession;
/**
*/
  readonly first_known_index: number;
/**
*/
  readonly session_id: string;
}
/**
*/
export class OlmMessage {
  free(): void;
/**
* @param {number} message_type
* @param {string} ciphertext
*/
  constructor(message_type: number, ciphertext: string);
/**
*/
  ciphertext: string;
/**
*/
  message_type: number;
}
/**
*/
export class Sas {
  free(): void;
/**
*/
  constructor();
/**
* @param {string} key
* @returns {EstablishedSas}
*/
  diffie_hellman(key: string): EstablishedSas;
/**
*/
  readonly public_key: string;
}
/**
*/
export class SasBytes {
  free(): void;
/**
*/
  readonly decimals: Uint16Array;
/**
*/
  readonly emoji_indices: Uint8Array;
}
/**
*/
export class Session {
  free(): void;
/**
* @param {Uint8Array} pickle_key
* @returns {string}
*/
  pickle(pickle_key: Uint8Array): string;
/**
* @param {string} pickle
* @param {Uint8Array} pickle_key
* @returns {Session}
*/
  static from_pickle(pickle: string, pickle_key: Uint8Array): Session;
/**
* @param {string} pickle
* @param {Uint8Array} pickle_key
* @returns {Session}
*/
  static from_libolm_pickle(pickle: string, pickle_key: Uint8Array): Session;
/**
* @param {OlmMessage} message
* @returns {boolean}
*/
  session_matches(message: OlmMessage): boolean;
/**
* @param {string} plaintext
* @returns {OlmMessage}
*/
  encrypt(plaintext: string): OlmMessage;
/**
* @param {OlmMessage} message
* @returns {string}
*/
  decrypt(message: OlmMessage): string;
/**
*/
  readonly session_id: string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_groupsession_free: (a: number) => void;
  readonly groupsession_new: () => number;
  readonly groupsession_session_id: (a: number, b: number) => void;
  readonly groupsession_session_key: (a: number, b: number) => void;
  readonly groupsession_message_index: (a: number) => number;
  readonly groupsession_encrypt: (a: number, b: number, c: number, d: number) => void;
  readonly groupsession_pickle: (a: number, b: number, c: number, d: number) => void;
  readonly groupsession_from_pickle: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly __wbg_decryptedmessage_free: (a: number) => void;
  readonly __wbg_get_decryptedmessage_plaintext: (a: number, b: number) => void;
  readonly __wbg_set_decryptedmessage_plaintext: (a: number, b: number, c: number) => void;
  readonly __wbg_get_decryptedmessage_message_index: (a: number) => number;
  readonly __wbg_set_decryptedmessage_message_index: (a: number, b: number) => void;
  readonly __wbg_inboundgroupsession_free: (a: number) => void;
  readonly inboundgroupsession_new: (a: number, b: number, c: number) => void;
  readonly inboundgroupsession_import: (a: number, b: number, c: number) => void;
  readonly inboundgroupsession_session_id: (a: number, b: number) => void;
  readonly inboundgroupsession_first_known_index: (a: number) => number;
  readonly inboundgroupsession_export_at: (a: number, b: number, c: number) => void;
  readonly inboundgroupsession_decrypt: (a: number, b: number, c: number, d: number) => void;
  readonly inboundgroupsession_pickle: (a: number, b: number, c: number, d: number) => void;
  readonly inboundgroupsession_from_pickle: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly inboundgroupsession_from_libolm_pickle: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly __wbg_sas_free: (a: number) => void;
  readonly sas_new: () => number;
  readonly sas_public_key: (a: number, b: number) => void;
  readonly sas_diffie_hellman: (a: number, b: number, c: number, d: number) => void;
  readonly __wbg_establishedsas_free: (a: number) => void;
  readonly establishedsas_bytes: (a: number, b: number, c: number) => number;
  readonly establishedsas_calculate_mac: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly establishedsas_calculate_mac_invalid_base64: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly establishedsas_verify_mac: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
  readonly __wbg_sasbytes_free: (a: number) => void;
  readonly sasbytes_emoji_indices: (a: number, b: number) => void;
  readonly sasbytes_decimals: (a: number, b: number) => void;
  readonly __wbg_account_free: (a: number) => void;
  readonly __wbg_inboundcreationresult_free: (a: number) => void;
  readonly inboundcreationresult_session: (a: number) => number;
  readonly inboundcreationresult_plaintext: (a: number, b: number) => void;
  readonly account_new: () => number;
  readonly account_from_pickle: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly account_from_libolm_pickle: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly account_pickle: (a: number, b: number, c: number, d: number) => void;
  readonly account_ed25519_key: (a: number, b: number) => void;
  readonly account_curve25519_key: (a: number, b: number) => void;
  readonly account_sign: (a: number, b: number, c: number, d: number) => void;
  readonly account_max_number_of_one_time_keys: (a: number) => number;
  readonly account_one_time_keys: (a: number, b: number) => void;
  readonly account_generate_one_time_keys: (a: number, b: number) => void;
  readonly account_fallback_key: (a: number, b: number) => void;
  readonly account_generate_fallback_key: (a: number) => void;
  readonly account_mark_keys_as_published: (a: number) => void;
  readonly account_create_outbound_session: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly account_create_inbound_session: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly __wbg_session_free: (a: number) => void;
  readonly session_pickle: (a: number, b: number, c: number, d: number) => void;
  readonly session_from_pickle: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly session_from_libolm_pickle: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly session_session_id: (a: number, b: number) => void;
  readonly session_session_matches: (a: number, b: number) => number;
  readonly session_encrypt: (a: number, b: number, c: number) => number;
  readonly session_decrypt: (a: number, b: number, c: number) => void;
  readonly __wbg_olmmessage_free: (a: number) => void;
  readonly __wbg_get_olmmessage_ciphertext: (a: number, b: number) => void;
  readonly __wbg_set_olmmessage_ciphertext: (a: number, b: number, c: number) => void;
  readonly __wbg_get_olmmessage_message_type: (a: number) => number;
  readonly __wbg_set_olmmessage_message_type: (a: number, b: number) => void;
  readonly olmmessage_new: (a: number, b: number, c: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
