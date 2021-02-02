import { Ascii } from './ascii';
import { Lexer } from './lexer';
import { Lexical } from './lexical';
import { Span } from './span';
import { Utf8 } from './utf8';

test('partial parsing', () => {
    // -   `Lexer.setup()`:
    //     -   Source buffer slice creation.
    //     -   Offset calculation.
    // -   `Lexer.decode()`:
    //     -   Offset usage.
    // -   `Lexer.consume()`:
    //     -   Codepoint offset incrementing.
    //     -   Byte offset incrementing.
    // -   `Lexer.advance()`:
    //     -   Span creation and assigning.
    // -   `Lexer.handleEof()`:
    //     -   Full stack consumption at EOF.
    // -   Etc.

    const source = String.raw`
        ъыъ
    `;

    const input: Lexer.Input = {
        filename: '~/kek.tsss',
        input: Utf8.encode(source),
        begin: {
            absolute: {
                byte: 9,
                codepoint: 9,
            },
            relative: {
                byte: 8,
                codepoint: 8,
            },
            line: 1,
        },
        end: {
            ...Span.Stop.empty(),
            absolute: {
                byte: 15,
                codepoint: 0,
            },
        },
    };

    const lexer = new Lexer();

    const identifier = lexer.tokenize(input).children[0] as Lexical.Identifier;

    expect(identifier).toBeInstanceOf(Lexical.Identifier);
    expect(identifier.value).toBe('ъыъ');
    expect(identifier.prev).toBe(null);
    expect(identifier.next).toBe(null);

    expect(identifier.span).toEqual({
        filename: '~/kek.tsss',
        begin: {
            absolute: {
                byte: 9,
                codepoint: 9,
            },
            relative: {
                byte: 8,
                codepoint: 8,
            },
            line: 1,
        },
        end: {
            absolute: {
                byte: 15,
                codepoint: 12,
            },
            relative: {
                byte: 14,
                codepoint: 11,
            },
            line: 1,
        },
    });
});

test('span increment', () => {
    // -   `Lexer.consume()`:
    //     -   Line incrementing.
    // -   Etc.

    const source = String.raw`
        'kek\
        ъыъ'
    `;

    const input: Lexer.Input = {
        filename: '~/kek.tsss',
        input: Utf8.encode(source),
        begin: {
            absolute: {
                byte: 9,
                codepoint: 9,
            },
            relative: {
                byte: 8,
                codepoint: 8,
            },
            line: 1,
        },
    };

    const lexer = new Lexer();

    const quoted = lexer.tokenize(input).children[0] as Lexical.Quoted;

    expect(quoted).toBeInstanceOf(Lexical.Quoted);

    expect(quoted.span).toEqual({
        filename: '~/kek.tsss',
        begin: {
            absolute: {
                byte: 9,
                codepoint: 9,
            },
            relative: {
                byte: 8,
                codepoint: 8,
            },
            line: 1,
        },
        end: {
            absolute: {
                byte: 30,
                codepoint: 27,
            },
            relative: {
                byte: 15,
                codepoint: 12,
            },
            line: 2,
        },
    });
});

test('empty input', () => {
    const lexer = new Lexer();

    const root = lexer.tokenize() as Lexical.Root;

    expect(root).toBeInstanceOf(Lexical.Root);
    expect(root.children).toEqual([]);

    expect(root.span).toEqual({
        filename: null,
        begin: {
            absolute: {
                byte: 0,
                codepoint: 0,
            },
            relative: {
                byte: 0,
                codepoint: 0,
            },
            line: 0,
        },
        end: {
            absolute: {
                byte: 0,
                codepoint: 0,
            },
            relative: {
                byte: 0,
                codepoint: 0,
            },
            line: 0,
        },
    });
});

test('valid groups', () => {
    const source = String.raw`
        (1)
        [2]
        {3}
    `;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer();

    const root = lexer.tokenize(input) as Lexical.Root;

    const parentheses = root.children[1] as Lexical.Group;
    const brackets = root.children[3] as Lexical.Group;
    const braces = root.children[5] as Lexical.Group;

    expect(parentheses).toBeInstanceOf(Lexical.Group);
    expect(brackets).toBeInstanceOf(Lexical.Group);
    expect(braces).toBeInstanceOf(Lexical.Group);

    expect(parentheses.opening).toBe(Ascii.Opening.PARENTHESIS_L);
    expect(brackets.opening).toBe(Ascii.Opening.BRACKET_L);
    expect(braces.opening).toBe(Ascii.Opening.BRACE_L);

    expect(parentheses.children).toHaveLength(1);
    expect(brackets.children).toHaveLength(1);
    expect(braces.children).toHaveLength(1);

    expect(parentheses.children[0]).toBeInstanceOf(Lexical.Numeric);
    expect(brackets.children[0]).toBeInstanceOf(Lexical.Numeric);
    expect(braces.children[0]).toBeInstanceOf(Lexical.Numeric);
});

test('invalid groups', () => {
    const source = String.raw`
        (1]2)
        (1[2)
    `;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer();

    const root = lexer.tokenize(input) as Lexical.Root;

    const ending = root.children[1] as Lexical.Group;

    expect(ending.children).toHaveLength(3);

    expect(ending.children[0]).toBeInstanceOf(Lexical.Numeric);
    expect(ending.children[1]).toBeInstanceOf(Lexical.Unexpected);
    expect(ending.children[2]).toBeInstanceOf(Lexical.Numeric);

    expect((ending.children[1] as Lexical.Unexpected).value).toBe(']');

    const opening = root.children[3] as Lexical.Group;
    const nested = opening.children[1] as Lexical.Group;

    expect(opening.children).toHaveLength(2);
    expect(nested.children).toHaveLength(3);

    expect(nested.children[0]).toBeInstanceOf(Lexical.Numeric);
    expect(nested.children[1]).toBeInstanceOf(Lexical.Unexpected);
    expect(nested.children[2]).toBeInstanceOf(Lexical.Blank);

    expect(nested.valid).toBe(false);
});

test('standard strings', () => {
    const source = String.raw`
        '1'
        "2"
        ${'`3`'}
        '4
        5'`;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer();

    const root = lexer.tokenize(input) as Lexical.Root;

    const single = root.children[1] as Lexical.Quoted;
    const double = root.children[3] as Lexical.Quoted;
    const backtick = root.children[5] as Lexical.Unexpected;
    const invalid = root.children[9] as Lexical.Quoted;
    const eof = root.children[12] as Lexical.Quoted;

    expect(single).toBeInstanceOf(Lexical.Quoted);
    expect(double).toBeInstanceOf(Lexical.Quoted);
    expect(backtick).toBeInstanceOf(Lexical.Unexpected);
    expect(invalid).toBeInstanceOf(Lexical.Quoted);
    expect(eof).toBeInstanceOf(Lexical.Quoted);

    expect(single.quote).toBe(Ascii.Code.SINGLE_QUOTE);
    expect(double.quote).toBe(Ascii.Code.DOUBLE_QUOTE);

    expect(backtick.value).toBe('`');

    expect(invalid.valid).toBe(false);
    expect(eof.valid).toBe(false);

    expect((single.children[0] as Lexical.Raw).value).toBe('1');
    expect((double.children[0] as Lexical.Raw).value).toBe('2');
    expect((invalid.children[0] as Lexical.Raw).value).toBe('4');
    expect(invalid.children).toHaveLength(1);
});

test('extended strings', () => {
    const source = String.raw`
        '1'
        "2"
        ${'`3`'}
        '4
        5'
    `;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer({
        'extended-strings': true,
    });

    const root = lexer.tokenize(input) as Lexical.Root;

    const single = root.children[1] as Lexical.Quoted;
    const double = root.children[3] as Lexical.Quoted;
    const backtick = root.children[5] as Lexical.Quoted;
    const multiline = root.children[7] as Lexical.Quoted;

    expect(single).toBeInstanceOf(Lexical.Quoted);
    expect(double).toBeInstanceOf(Lexical.Quoted);
    expect(backtick).toBeInstanceOf(Lexical.Quoted);
    expect(multiline).toBeInstanceOf(Lexical.Quoted);

    expect(backtick.quote).toBe(Ascii.Code.BACKTICK);
    expect(multiline.quote).toBe(Ascii.Code.SINGLE_QUOTE);

    expect((single.children[0] as Lexical.Raw).value).toBe('1');
    expect((double.children[0] as Lexical.Raw).value).toBe('2');
    expect((backtick.children[0] as Lexical.Raw).value).toBe('3');
    expect((multiline.children[0] as Lexical.Raw).value).toBe('4\n        5');
});

test('standard comments', () => {
    const source = String.raw`
        /* 1 */
        /* /* 2 */ */
        // 3
    `;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer();

    const root = lexer.tokenize(input) as Lexical.Root;

    const simple = root.children[1] as Lexical.Comment;
    const nesting = root.children[3] as Lexical.Comment;
    const blank = root.children[4] as Lexical.Blank;
    const asterisk = root.children[5] as Lexical.Operator;
    const slash = root.children[6] as Lexical.Operator;
    const line = root.children[8] as Lexical.Operator;

    expect(simple).toBeInstanceOf(Lexical.Comment);
    expect(nesting).toBeInstanceOf(Lexical.Comment);
    expect(blank).toBeInstanceOf(Lexical.Blank);
    expect(asterisk).toBeInstanceOf(Lexical.Operator);
    expect(slash).toBeInstanceOf(Lexical.Operator);
    expect(line).toBeInstanceOf(Lexical.Operator);

    expect((simple.children[0] as Lexical.Raw).value).toBe(' 1 ');
    expect((nesting.children[0] as Lexical.Raw).value).toBe(' /* 2 ');
    expect(asterisk.operator).toBe(Ascii.Code.ASTERISK);
    expect(slash.operator).toBe(Ascii.Code.SLASH);
    expect(line.operator).toBe(Ascii.Code.SLASH);
});

test('extended comments', () => {
    const source = String.raw`
        /* 1 */
        /* /* 2 */ */
        // 3
    `;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer({
        'extended-comments': true,
    });

    const root = lexer.tokenize(input) as Lexical.Root;

    const simple = root.children[1] as Lexical.Comment;
    const nesting = root.children[3] as Lexical.Comment;
    const nested = nesting.children[1] as Lexical.Comment;
    const line = root.children[5] as Lexical.Comment;

    expect(simple).toBeInstanceOf(Lexical.Comment);
    expect(nesting).toBeInstanceOf(Lexical.Comment);
    expect(nested).toBeInstanceOf(Lexical.Comment);
    expect(line).toBeInstanceOf(Lexical.Comment);

    expect((simple.children[0] as Lexical.Raw).value).toBe(' 1 ');
    expect((nested.children[0] as Lexical.Raw).value).toBe(' 2 ');
    expect((line.children[0] as Lexical.Raw).value).toBe(' 3');
});

test('interpolations', () => {
    const source = String.raw`
        #{1}
        '2 #{3} 4'
        ${'`${5}`'}
        // #{6}
        '${'${7}'}'
    `;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer({
        'extended-strings': true,
        'extended-comments': true,
        'quasi-definitions': [
            {
                contexts: Lexer.Context.Mask.Any & ~Lexer.Context.Type.Line,
                syntaxes: ['#{}'],
            },
            {
                contexts: Lexer.Context.Type.Backtick,
                syntaxes: ['${}'],
            },
        ],
    });

    const root = lexer.tokenize(input) as Lexical.Root;

    const unquoted = root.children[1] as Lexical.Quasi; // #{1}
    const single = root.children[3] as Lexical.Quoted; // '2 #{3} 4'
    const sass = single.children[1] as Lexical.Quasi; // #{3}
    const comment = root.children[7] as Lexical.Comment; // // #{6}
    const backtick = root.children[5] as Lexical.Quoted; // `${5}`
    const js = backtick.children[0] as Lexical.Quasi; // ${5}
    const plain = root.children[9] as Lexical.Quoted; // '${7}'

    expect(unquoted).toBeInstanceOf(Lexical.Quasi);
    expect(sass).toBeInstanceOf(Lexical.Quasi);
    expect(js).toBeInstanceOf(Lexical.Quasi);

    expect(((unquoted.children[1] as Lexical.Group).children[0] as Lexical.Numeric).value).toBe(1);
    expect(((sass.children[1] as Lexical.Group).children[0] as Lexical.Numeric).value).toBe(3);
    expect(((js.children[1] as Lexical.Group).children[0] as Lexical.Numeric).value).toBe(5);

    expect((comment.children[0] as Lexical.Raw).value).toBe(' #{6}');
    expect((plain.children[0] as Lexical.Raw).value).toBe('${7}');

    expect(sass.syntax).toBe('#{}');
    expect(js.syntax).toBe('${}');
});

test('annotations', () => {
    const source = String.raw`
        #[1]
        '#[2]'
        /* #[3] */
        #![4]
    `;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer({
        'extended-strings': true,
        'annotation-definitions': [
            {
                placement: Lexical.Annotation.Placement.Outer,
                syntax: '#[]',
            },
            {
                placement: Lexical.Annotation.Placement.Inner,
                syntax: '#![]',
            },
        ],
    });

    const root = lexer.tokenize(input) as Lexical.Root;

    const outer = root.children[1] as Lexical.Annotation; // #[1]
    const quoted = root.children[3] as Lexical.Quoted; // '#[2]'
    const comment = root.children[5] as Lexical.Comment; // /* #[3] */
    const inner = root.children[7] as Lexical.Annotation; // #![4]

    expect(outer).toBeInstanceOf(Lexical.Annotation);
    expect(inner).toBeInstanceOf(Lexical.Annotation);

    expect(quoted.children).toHaveLength(1);
    expect(quoted.children[0]).toBeInstanceOf(Lexical.Raw);
    expect((quoted.children[0] as Lexical.Raw).value).toBe('#[2]');

    expect(comment.children).toHaveLength(1);
    expect(comment.children[0]).toBeInstanceOf(Lexical.Raw);
    expect((comment.children[0] as Lexical.Raw).value).toBe(' #[3] ');

    expect(outer.placement).toBe(Lexical.Annotation.Placement.Outer);
    expect(inner.placement).toBe(Lexical.Annotation.Placement.Inner);

    expect(((outer.children[1] as Lexical.Group).children[0] as Lexical.Numeric).value).toBe(1);
    expect(((inner.children[2] as Lexical.Group).children[0] as Lexical.Numeric).value).toBe(4);
});

test('identifiers', () => {
    const source = String.raw`
        kek
        kek1
        ъыъ
        →
        --kek
        kek--
        kek--puk
        \--kek
        kek-\-
        \ kek${'\\ '}
    `;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer();

    const root = lexer.tokenize(input) as Lexical.Root;

    const ascii = root.children[1] as Lexical.Identifier;
    const idc = root.children[3] as Lexical.Identifier;
    const cyr = root.children[5] as Lexical.Identifier;
    const nonAscii = root.children[7] as Lexical.Identifier;
    const hyphenPrefix = root.children[9] as Lexical.Identifier;
    const hyphenSuffix = root.children[11] as Lexical.Identifier;
    const hyphenInfix = root.children[13] as Lexical.Identifier;
    const escHyphenPrefix = root.children[15] as Lexical.Identifier;
    const escHyphenSuffix = root.children[17] as Lexical.Identifier;
    const escWhitespace = root.children[19] as Lexical.Identifier;

    expect(ascii).toBeInstanceOf(Lexical.Identifier);
    expect(idc).toBeInstanceOf(Lexical.Identifier);
    expect(cyr).toBeInstanceOf(Lexical.Identifier);
    expect(nonAscii).toBeInstanceOf(Lexical.Identifier);
    expect(hyphenPrefix).toBeInstanceOf(Lexical.Identifier);
    expect(hyphenSuffix).toBeInstanceOf(Lexical.Identifier);
    expect(hyphenInfix).toBeInstanceOf(Lexical.Identifier);
    expect(escHyphenPrefix).toBeInstanceOf(Lexical.Identifier);
    expect(escHyphenSuffix).toBeInstanceOf(Lexical.Identifier);
    expect(escWhitespace).toBeInstanceOf(Lexical.Identifier);

    expect(ascii.value).toBe('kek');
    expect(idc.value).toBe('kek1');
    expect(cyr.value).toBe('ъыъ');
    expect(nonAscii.value).toBe('→');
    expect(hyphenPrefix.value).toBe('--kek');
    expect(hyphenSuffix.value).toBe('kek--');
    expect(hyphenInfix.value).toBe('kek--puk');
    expect(escHyphenPrefix.value).toBe('--kek');
    expect(escHyphenSuffix.value).toBe('kek--');
    expect(escWhitespace.value).toBe(' kek ');
});

test('hashes', () => {
    const source = String.raw`
        #kek
        #f00
        #0
        #123
        #1234
        #123456
        #12345678
        #\30\30\30
        #f\66 \46 F
        #ffffffff
    `;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer();

    const root = lexer.tokenize(input) as Lexical.Root;

    // region
    const id = root.children[1] as Lexical.Hash;
    const both = root.children[3] as Lexical.Hash;
    const neither = root.children[5] as Lexical.Hash;
    const short = root.children[7] as Lexical.Hash;
    const shortA = root.children[9] as Lexical.Hash;
    const full = root.children[11] as Lexical.Hash;
    const fullA = root.children[13] as Lexical.Hash;
    const black = root.children[15] as Lexical.Hash;
    const white = root.children[17] as Lexical.Hash;
    const max = root.children[19] as Lexical.Hash;
    // endregion

    // region
    expect(id).toBeInstanceOf(Lexical.Hash);
    expect(both).toBeInstanceOf(Lexical.Hash);
    expect(neither).toBeInstanceOf(Lexical.Hash);
    expect(short).toBeInstanceOf(Lexical.Hash);
    expect(shortA).toBeInstanceOf(Lexical.Hash);
    expect(full).toBeInstanceOf(Lexical.Hash);
    expect(fullA).toBeInstanceOf(Lexical.Hash);
    expect(black).toBeInstanceOf(Lexical.Hash);
    expect(white).toBeInstanceOf(Lexical.Hash);
    expect(max).toBeInstanceOf(Lexical.Hash);
    // endregion

    // region
    expect(id.value).toBe('kek');
    expect(both.value).toBe('f00');
    expect(neither.value).toBe('0');
    expect(short.value).toBe('123');
    expect(shortA.value).toBe('1234');
    expect(full.value).toBe('123456');
    expect(fullA.value).toBe('12345678');
    expect(black.value).toBe('000');
    expect(white.value).toBe('ffFF');
    expect(max.value).toBe('ffffffff');
    // endregion

    // region
    expect(id.valid).toBe(true);
    expect(both.valid).toBe(true);
    expect(neither.valid).toBe(false);
    expect(short.valid).toBe(true);
    expect(shortA.valid).toBe(true);
    expect(full.valid).toBe(true);
    expect(fullA.valid).toBe(true);
    expect(black.valid).toBe(true);
    expect(white.valid).toBe(true);
    expect(max.valid).toBe(true);
    // endregion

    // region
    expect(id.flags).toBe(Lexical.Hash.Flags.Id);
    expect(both.flags).toBe(Lexical.Hash.Flags.Both);
    expect(neither.flags).toBe(Lexical.Hash.Flags.Neither);
    expect(short.flags).toBe(Lexical.Hash.Flags.Color);
    expect(shortA.flags).toBe(Lexical.Hash.Flags.Color);
    expect(full.flags).toBe(Lexical.Hash.Flags.Color);
    expect(fullA.flags).toBe(Lexical.Hash.Flags.Color);
    expect(black.flags).toBe(Lexical.Hash.Flags.Both);
    expect(white.flags).toBe(Lexical.Hash.Flags.Both);
    expect(max.flags).toBe(Lexical.Hash.Flags.Both);
    // endregion

    // region
    expect(id.color).toBe(0x00_00_00_ff);
    expect(both.color).toBe(0xff_00_00_ff);
    expect(neither.color).toBe(0x00_00_00_ff);
    expect(short.color).toBe(0x11_22_33_ff);
    expect(shortA.color).toBe(0x11_22_33_44);
    expect(full.color).toBe(0x12_34_56_ff);
    expect(fullA.color).toBe(0x12_34_56_78);
    expect(black.color).toBe(0x00_00_00_ff);
    expect(white.color).toBe(0xff_ff_ff_ff);
    expect(max.color).toBe(0xff_ff_ff_ff);
    // endregion
});

test('standard numbers', () => {
    const source = String.raw`
        1e2
        2e+2
        3e-2
        1.2e3
        2.2e+3
        3.2e-3
        +1e2
        +2e+2
        +3e-2
        +1.2e3
        +2.2e+3
        +3.2e-3
        -1e2
        -2e+2
        -3e-2
        -1.2e3
        -2.2e+3
        -3.2e-3
    `;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer();

    const root = lexer.tokenize(input) as Lexical.Root;

    const numbers = root.children.filter(x => x instanceof Lexical.Numeric) as Lexical.Numeric[];

    expect(numbers).toHaveLength(18);

    expect(numbers.map(x => x.value)).toEqual([
        1e2,
        2e2,
        3e-2,
        1.2e3,
        2.2e3,
        3.2e-3,
        +1e2,
        +2e2,
        +3e-2,
        +1.2e3,
        +2.2e3,
        +3.2e-3,
        -1e2,
        -2e2,
        -3e-2,
        -1.2e3,
        -2.2e3,
        -3.2e-3,
    ]);
});

test('standard numbers extra', () => {
    const source = String.raw`
        .1
        +.2
        3.
        --4
    `;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer();

    const root = lexer.tokenize(input) as Lexical.Root;

    const leading = root.children[1] as Lexical.Numeric;
    const signed = root.children[3] as Lexical.Numeric;
    const trailing = root.children[5] as Lexical.Numeric;
    const dot = root.children[6] as Lexical.Operator;
    const id = root.children[8] as Lexical.Identifier;

    expect(leading).toBeInstanceOf(Lexical.Numeric);
    expect(signed).toBeInstanceOf(Lexical.Numeric);
    expect(trailing).toBeInstanceOf(Lexical.Numeric);
    expect(dot).toBeInstanceOf(Lexical.Operator);
    expect(id).toBeInstanceOf(Lexical.Identifier);

    expect(leading.value).toBe(0.1);
    expect(signed.value).toBe(+0.2);
    expect(trailing.value).toBe(3);
    expect(dot.operator).toBe(Ascii.Operator.DOT);
    expect(id.value).toBe('--4');
});

test('extended numbers', () => {
    const source = String.raw`
        0xff
        0o77
        0b11
        24_34
        1.
        2.e3
        0xffem
        0xff_em
        0xff__em
        0xff___em
        0xff\65m
    `;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer({
        'extended-numbers': true,
    });

    const root = lexer.tokenize(input) as Lexical.Root;

    // region
    const hex = root.children[1] as Lexical.Numeric;
    const oct = root.children[3] as Lexical.Numeric;
    const bin = root.children[5] as Lexical.Numeric;
    const sep = root.children[7] as Lexical.Numeric;
    const trailing = root.children[9] as Lexical.Numeric;
    const exp = root.children[11] as Lexical.Numeric;
    const em = root.children[13] as Lexical.Numeric;
    const single = root.children[16] as Lexical.Numeric;
    const double = root.children[19] as Lexical.Numeric;
    const triple = root.children[22] as Lexical.Numeric;
    const esc = root.children[25] as Lexical.Numeric;

    const m1 = root.children[14] as Lexical.Identifier;
    const m2 = root.children[17] as Lexical.Identifier;
    const em1 = root.children[20] as Lexical.Identifier;
    const _em1 = root.children[23] as Lexical.Identifier;
    const em3 = root.children[26] as Lexical.Identifier;
    // endregion

    // region
    expect(hex).toBeInstanceOf(Lexical.Numeric);
    expect(oct).toBeInstanceOf(Lexical.Numeric);
    expect(bin).toBeInstanceOf(Lexical.Numeric);
    expect(sep).toBeInstanceOf(Lexical.Numeric);
    expect(trailing).toBeInstanceOf(Lexical.Numeric);
    expect(exp).toBeInstanceOf(Lexical.Numeric);
    expect(em).toBeInstanceOf(Lexical.Numeric);
    expect(single).toBeInstanceOf(Lexical.Numeric);
    expect(double).toBeInstanceOf(Lexical.Numeric);
    expect(triple).toBeInstanceOf(Lexical.Numeric);
    expect(esc).toBeInstanceOf(Lexical.Numeric);
    expect(m1).toBeInstanceOf(Lexical.Identifier);
    expect(m2).toBeInstanceOf(Lexical.Identifier);
    expect(em1).toBeInstanceOf(Lexical.Identifier);
    expect(_em1).toBeInstanceOf(Lexical.Identifier);
    expect(em3).toBeInstanceOf(Lexical.Identifier);
    // endregion

    // region
    expect(hex.value).toBe(0xff);
    expect(oct.value).toBe(0o77);
    expect(bin.value).toBe(0b11);
    expect(sep.value).toBe(24_34);
    expect(trailing.value).toBe(1);
    expect(exp.value).toBe(2e3);
    expect(em.value).toBe(0xffe);
    expect(single.value).toBe(0xff_e);
    expect(double.value).toBe(0xff);
    expect(triple.value).toBe(0xff);
    expect(esc.value).toBe(0xff);
    expect(m1.value).toBe('m');
    expect(m2.value).toBe('m');
    expect(em1.value).toBe('em');
    expect(_em1.value).toBe('_em');
    expect(em3.value).toBe('em');
    // endregion
});

test('separators', () => {
    const source = String.raw`
        , ;
    `;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer({
        'extended-numbers': true,
    });

    const root = lexer.tokenize(input) as Lexical.Root;

    const comma = root.children[1] as Lexical.Separator;
    const semicolon = root.children[3] as Lexical.Separator;

    expect(comma).toBeInstanceOf(Lexical.Separator);
    expect(semicolon).toBeInstanceOf(Lexical.Separator);

    expect(comma.separator).toBe(Ascii.Separator.COMMA);
    expect(semicolon.separator).toBe(Ascii.Separator.SEMICOLON);
});

test('operators', () => {
    const source = String.raw`
        !#$%&*+-./:<=>?@^|~
    `;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer({
        'extended-numbers': true,
    });

    const root = lexer.tokenize(input) as Lexical.Root;

    const operators = root.children.filter(x => x instanceof Lexical.Operator) as Lexical.Operator[];

    expect(operators).toHaveLength(19);
    expect(operators.map(x => String.fromCharCode(x.operator)).join('')).toBe('!#$%&*+-./:<=>?@^|~');
});

test('whitespace', () => {
    const source = `
        / \t
        / \r
        / \f
    `;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer();

    const root = lexer.tokenize(input) as Lexical.Root;

    const n = root.children[0] as Lexical.Blank;
    const t = root.children[2] as Lexical.Blank;
    const r = root.children[4] as Lexical.Blank;
    const f = root.children[6] as Lexical.Blank;

    expect(n).toBeInstanceOf(Lexical.Blank);
    expect(t).toBeInstanceOf(Lexical.Blank);
    expect(r).toBeInstanceOf(Lexical.Blank);
    expect(f).toBeInstanceOf(Lexical.Blank);

    expect(n.value).toBe('\n        ');
    expect(t.value).toBe(' \t\n        ');
    expect(r.value).toBe(' \r\n        ');
    expect(f.value).toBe(' \f\n    ');

    // \r\n is TWO newlines
    expect(r.span).toEqual<Partial<Span>>({
        filename: null,
        begin: {
            absolute: {
                byte: 22,
                codepoint: 22,
            },
            relative: {
                byte: 9,
                codepoint: 9,
            },
            line: 2,
        },
        end: {
            absolute: {
                byte: 33,
                codepoint: 33,
            },
            relative: {
                byte: 8,
                codepoint: 8,
            },
            line: 4,
        },
    });
});

test('cdx', () => {
    const source = String.raw`
        <!-- -->
    `;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer();

    const root = lexer.tokenize(input) as Lexical.Root;

    const cdo = root.children[1] as Lexical.Cdx;
    const cdc = root.children[3] as Lexical.Cdx;

    expect(cdo).toBeInstanceOf(Lexical.Cdx);
    expect(cdc).toBeInstanceOf(Lexical.Cdx);

    expect(cdo.syntax).toBe(Lexical.Cdx.Syntax.Cdo);
    expect(cdc.syntax).toBe(Lexical.Cdx.Syntax.Cdc);
});

test('no cdx', () => {
    const source = String.raw`
        <!-- -->
    `;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer({
        'standard-cdx': false,
    });

    const root = lexer.tokenize(input) as Lexical.Root;

    expect(root.children.filter(x => x instanceof Lexical.Cdx)).toHaveLength(0);
});

test('standard escapes', () => {
    const source = String.raw`
        \30\30 \n\1034567\103456 7\xff
    `;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer();

    const root = lexer.tokenize(input) as Lexical.Root;

    const id = root.children[1] as Lexical.Identifier;

    expect(id.value).toBe('00n\u{103456}7\u{103456}7xff');
});

test('extended escapes', () => {
    const source = String.raw`
        \01\30\30 \n\1034567\103456 7\xff\u1234\u{103456}\a\b\e\f\r\t\v\ы\l0\lы
    `;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer({
        'extended-escapes': true,
    });

    const root = lexer.tokenize(input) as Lexical.Root;

    const id = root.children[1] as Lexical.Identifier;

    expect(id.value).toBe('\x00100\n\u{103456}7\u{103456}7\xff\u1234\u{103456}\x07\b\x1b\f\r\t\vы0ы');
});

test('no standard escapes', () => {
    const source = String.raw`
        \01\30\30 \n\1034567\103456 7\xff\u1234\u{103456}\a\b\e\f\r\t\v\ы\l0\lы
    `;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer({
        'extended-escapes': true,
        'standard-escapes': false,
    });

    const root = lexer.tokenize(input) as Lexical.Root;

    const id1 = root.children[1] as Lexical.Identifier;
    const id2 = root.children[3] as Lexical.Identifier;
    const id3 = root.children[6] as Lexical.Identifier;

    expect(id1.value).toBe('\x0013030');
    expect(id2.value).toBe('\n1034567103456');
    expect(id3.value).toBe('\xff\u1234\u{103456}\x07\b\x1b\f\r\t\vы0ы');
});

test('literal escapes only', () => {
    const source = String.raw`
        \01\30\30 \n\1034567\103456 7\xff\u1234\u{103456}\a\b\e\f\r\t\v\ы\l0\lы
    `;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer({
        'extended-escapes': false,
        'standard-escapes': false,
    });

    const root = lexer.tokenize(input) as Lexical.Root;

    const id1 = root.children[1] as Lexical.Identifier;
    const id2 = root.children[3] as Lexical.Identifier;
    const id3 = root.children[6] as Lexical.Identifier;
    const id4 = root.children[8] as Lexical.Identifier;

    expect(id1.value).toBe('013030');
    expect(id2.value).toBe('n1034567103456');
    expect(id3.value).toBe('xffu1234u');
    expect(id4.value).toBe('abefrtvыl0lы');
});

test('escaped newlines', () => {
    const source = String.raw`
        '1\
        2'
        kek\
        puk
    `;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer();

    const root = lexer.tokenize(input) as Lexical.Root;

    const string = root.children[1] as Lexical.Quoted;
    const nested = string.children[1] as Lexical.Newline;
    const toplevel = root.children[4] as Lexical.Newline;

    expect(nested).toBeInstanceOf(Lexical.Newline);
    expect(toplevel).toBeInstanceOf(Lexical.Newline);
});

test('tree linking', () => {
    const source = String.raw`
        (a b)
    `;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer();

    const root = lexer.tokenize(input) as Lexical.Root;

    const group = root.children[1] as Lexical.Group;
    const a = group.children[0] as Lexical.Identifier;
    const blank = group.children[1] as Lexical.Blank;
    const b = group.children[2] as Lexical.Identifier;

    expect(root.parent).toBe(null);
    expect(group.parent).toBe(root);
    expect(group.prev).toBeInstanceOf(Lexical.Blank);
    expect(group.next).toBeInstanceOf(Lexical.Blank);

    expect(a.parent).toBe(group);
    expect(blank.parent).toBe(group);
    expect(b.parent).toBe(group);

    expect(a.next).toBe(blank);
    expect(blank.next).toBe(b);
    expect(b.next).toBe(null);

    expect(a.prev).toBe(null);
    expect(blank.prev).toBe(a);
    expect(b.prev).toBe(blank);

    expect(group.span).toEqual<Partial<Span>>({
        filename: null,
        begin: {
            absolute: {
                byte: 9,
                codepoint: 9,
            },
            relative: {
                byte: 8,
                codepoint: 8,
            },
            line: 1,
        },
        end: {
            absolute: {
                byte: 14,
                codepoint: 14,
            },
            relative: {
                byte: 13,
                codepoint: 13,
            },
            line: 1,
        },
    });
});
