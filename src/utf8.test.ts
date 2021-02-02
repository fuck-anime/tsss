import { Utf8 } from './utf8';

test('encode', () => {
    const encoded = Utf8.encode('1ъыъ');

    expect(encoded).toBeInstanceOf(Uint8Array);
    expect(Array.from(encoded)).toEqual([0x31, 0xd1, 0x8a, 0xd1, 0x8b, 0xd1, 0x8a]);
});

test('decode', () => {
    expect(Utf8.decode(new Uint8Array([0x31, 0xd1, 0x8a, 0xd1, 0x8b, 0xd1, 0x8a]))).toBe('1ъыъ');
});

test('length', () => {
    const seq1 = Utf8.encode('q');
    const seq2 = Utf8.encode('ц');
    const seq3 = Utf8.encode('→');
    const seq4 = Utf8.encode('𝓐');

    expect(Utf8.length(seq1[0]!)).toBe(1);
    expect(Utf8.length(seq2[0]!)).toBe(2);
    expect(Utf8.length(seq3[0]!)).toBe(3);
    expect(Utf8.length(seq4[0]!)).toBe(4);
});

test('value', () => {
    const seq1 = Utf8.encode('q');
    const seq2 = Utf8.encode('ц');
    const seq3 = Utf8.encode('→');
    const seq4 = Utf8.encode('𝓐');

    expect(Utf8.value(seq1, 0)).toBe('q'.codePointAt(0));
    expect(Utf8.value(seq2, 0)).toBe('ц'.codePointAt(0));
    expect(Utf8.value(seq3, 0)).toBe('→'.codePointAt(0));
    expect(Utf8.value(seq4, 0)).toBe('𝓐'.codePointAt(0));
});
