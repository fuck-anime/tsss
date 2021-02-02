// Only import types. Node already has `Text{En,De}coder` globals, but TS doesn’t think so.
// The import will be silently removed from the built code.
import type { TextEncoder as E, TextDecoder as D } from 'util';

declare class TextEncoder extends E {} // Force TS think there is the `TextEncoder` global of the same interface as `util`’s one.
declare class TextDecoder extends D {} // Force TS think there is the `TextDecoder` global of the same interface as `util`’s one.

export namespace Utf8 {
    const encoder = new TextEncoder(); // Cached UTF-8 encoder.
    const decoder = new TextDecoder(); // Cached UTF-8 decoder.

    /**
     * Encodes a string to a `Uint8Array` UTF-8 buffer.
     *
     * @param input A string to encode.
     */
    export const encode = (input: string): Uint8Array => encoder.encode(input);

    /**
     * Decodes a `Uint8Array` UTF-8 buffer to a string.
     *
     * @param input A UTF-8 buffer to decode.
     */
    export const decode = (input: Uint8Array): string => decoder.decode(input);

    /**
     * Returns an expected byte length of the codepoint starting with the
     * specified byte. Expects a byte to belong to a valid UTF-8 input.
     *
     * @param byte A byte value to guess a byte length of a codepoint it starts.
     */
    export const length = (byte: number): number => {
        if ((byte & 0b11111_000) === 0b11110_000) {
            // Starts with `11110` => 4-byte sequence
            return 4;
        } else if ((byte & 0b1111_0000) === 0b1110_0000) {
            // Starts with `1110` => 3-byte sequence
            return 3;
        } else if ((byte & 0b111_00000) === 0b110_00000) {
            // Starts with `110` => 3-byte sequence
            return 2;
        } else {
            // An ASCII byte
            return 1;
        }
    };

    /**
     * Returns a value of a codepoint at the specified offset. Expects a valid
     * UTF-8 input.
     *
     * @param input An input UTF-8 buffer.
     * @param offset An offset of the codepoint to get.
     */
    export const value = (input: Uint8Array, offset: number): number => {
        const b1 = input[offset] ?? 0;

        switch (length(b1)) {
            /**
             * Four-byte codepoint:
             */
            case 4: {
                const b2 = input[++offset] ?? 0;
                const b3 = input[++offset] ?? 0;
                const b4 = input[++offset] ?? 0;

                // 4-byte sequence => 3 bits + 6 bits + 6 bits + 6 bits
                return ((b1 & 0b00000_111) << 18) | ((b2 & 0b00_111111) << 12) | ((b3 & 0b00_111111) << 6) | (b4 & 0b00_111111);
            }
            case 3: {
                const b2 = input[++offset] ?? 0;
                const b3 = input[++offset] ?? 0;

                // 3-byte sequence => 4 bits + 6 bits + 6 bits
                return ((b1 & 0b0000_1111) << 12) | ((b2 & 0b00_111111) << 6) | (b3 & 0b00_111111);
            }
            case 2: {
                const b2 = input[++offset] ?? 0;

                // 2-byte sequence => 5 bits + 6 bits
                return ((b1 & 0b000_11111) << 6) | (b2 & 0b00_111111);
            }
            default: {
                // ASCII byte => Just return it.
                return b1;
            }
        }
    };
}
