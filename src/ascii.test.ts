import { Ascii } from './ascii';
import C = Ascii.Code;
import O = Ascii.Opening;
import E = Ascii.Ending;
import H = Ascii.Hexadecimal;
import is = Ascii.is;
import get = Ascii.get;
import table = Ascii.table;
import decode = Ascii.decode;
import parse = Ascii.parse;
import charcode = Ascii.charcode;

test('is control', () => {
    expect(is.control(-1)).toBe(false);
    expect(is.control(NaN)).toBe(false);

    expect(is.control(C.NULL)).toBe(true);
    expect(is.control(C.BACKSPACE)).toBe(true);

    expect(is.control(C.HORIZONTAL_TAB)).toBe(false);
    expect(is.control(C.LINE_FEED)).toBe(false);

    expect(is.control(C.VERTICAL_TAB)).toBe(true);

    expect(is.control(C.FORM_FEED)).toBe(false);
    expect(is.control(C.CARRIAGE_RETURN)).toBe(false);

    expect(is.control(C.SO)).toBe(true);
    expect(is.control(C.US)).toBe(true);

    expect(is.control(C.WHITESPACE)).toBe(false);
    expect(is.control(C.TILDE)).toBe(false);

    expect(is.control(C.DELETE)).toBe(true);
});

test('is whitespace', () => {
    expect(is.whitespace(-1)).toBe(false);
    expect(is.whitespace(NaN)).toBe(false);

    expect(is.whitespace(C.HORIZONTAL_TAB)).toBe(true);
    expect(is.whitespace(C.WHITESPACE)).toBe(true);
});

test('is newline', () => {
    expect(is.newline(-1)).toBe(false);
    expect(is.newline(NaN)).toBe(false);

    expect(is.newline(C.LINE_FEED)).toBe(true);
    expect(is.newline(C.FORM_FEED)).toBe(true);
    expect(is.newline(C.CARRIAGE_RETURN)).toBe(true);
});

test('is blank', () => {
    expect(is.blank(-1)).toBe(false);
    expect(is.blank(NaN)).toBe(false);

    expect(is.blank(C.HORIZONTAL_TAB)).toBe(true);
    expect(is.blank(C.WHITESPACE)).toBe(true);
    expect(is.blank(C.LINE_FEED)).toBe(true);
    expect(is.blank(C.FORM_FEED)).toBe(true);
    expect(is.blank(C.CARRIAGE_RETURN)).toBe(true);
});

test('is decimal', () => {
    expect(is.decimal(-1)).toBe(false);
    expect(is.decimal(NaN)).toBe(false);

    expect(is.decimal(C.SLASH)).toBe(false);
    expect(is.decimal(C.DECIMAL_0)).toBe(true);
    expect(is.decimal(C.DECIMAL_9)).toBe(true);
    expect(is.decimal(C.COLON)).toBe(false);
});

test('is uppercase', () => {
    expect(is.uppercase(-1)).toBe(false);
    expect(is.uppercase(NaN)).toBe(false);

    expect(is.uppercase(C.AT)).toBe(false);
    expect(is.uppercase(C.UPPERCASE_A)).toBe(true);
    expect(is.uppercase(C.UPPERCASE_Z)).toBe(true);
    expect(is.uppercase(C.BRACKET_L)).toBe(false);
});

test('is lowercase', () => {
    expect(is.lowercase(-1)).toBe(false);
    expect(is.lowercase(NaN)).toBe(false);

    expect(is.lowercase(C.BACKTICK)).toBe(false);
    expect(is.lowercase(C.LOWERCASE_A)).toBe(true);
    expect(is.lowercase(C.LOWERCASE_Z)).toBe(true);
    expect(is.lowercase(C.BRACE_L)).toBe(false);
});

test('is letter', () => {
    expect(is.letter(-1)).toBe(false);
    expect(is.letter(NaN)).toBe(false);

    expect(is.letter(C.AT)).toBe(false);
    expect(is.letter(C.UPPERCASE_A)).toBe(true);
    expect(is.letter(C.UPPERCASE_Z)).toBe(true);
    expect(is.letter(C.BRACKET_L)).toBe(false);

    expect(is.letter(C.BACKTICK)).toBe(false);
    expect(is.letter(C.LOWERCASE_A)).toBe(true);
    expect(is.letter(C.LOWERCASE_Z)).toBe(true);
    expect(is.letter(C.BRACE_L)).toBe(false);
});

test('is alphanumeric', () => {
    expect(is.alphanumeric(-1)).toBe(false);
    expect(is.alphanumeric(NaN)).toBe(false);

    expect(is.alphanumeric(C.SLASH)).toBe(false);
    expect(is.alphanumeric(C.DECIMAL_0)).toBe(true);
    expect(is.alphanumeric(C.DECIMAL_9)).toBe(true);
    expect(is.alphanumeric(C.COLON)).toBe(false);

    expect(is.alphanumeric(C.AT)).toBe(false);
    expect(is.alphanumeric(C.UPPERCASE_A)).toBe(true);
    expect(is.alphanumeric(C.UPPERCASE_Z)).toBe(true);
    expect(is.alphanumeric(C.BRACKET_L)).toBe(false);

    expect(is.alphanumeric(C.BACKTICK)).toBe(false);
    expect(is.alphanumeric(C.LOWERCASE_A)).toBe(true);
    expect(is.alphanumeric(C.LOWERCASE_Z)).toBe(true);
    expect(is.alphanumeric(C.BRACE_L)).toBe(false);
});

test('is ids', () => {
    expect(is.ids(-1)).toBe(false);
    expect(is.ids(NaN)).toBe(false);

    expect(is.ids(C.SLASH)).toBe(false);
    expect(is.ids(C.DECIMAL_0)).toBe(false);
    expect(is.ids(C.DECIMAL_9)).toBe(false);
    expect(is.ids(C.COLON)).toBe(false);

    expect(is.ids(C.AT)).toBe(false);
    expect(is.ids(C.UPPERCASE_A)).toBe(true);
    expect(is.ids(C.UPPERCASE_Z)).toBe(true);
    expect(is.ids(C.BRACKET_L)).toBe(false);

    expect(is.ids(C.BACKTICK)).toBe(false);
    expect(is.ids(C.LOWERCASE_A)).toBe(true);
    expect(is.ids(C.LOWERCASE_Z)).toBe(true);
    expect(is.ids(C.BRACE_L)).toBe(false);

    expect(is.ids(C.HYPHEN)).toBe(true);
    expect(is.ids(C.UNDERSCORE)).toBe(true);

    expect(is.ids(C.DELETE)).toBe(false);

    expect(is.ids(128)).toBe(true);
});

test('is idc', () => {
    expect(is.idc(-1)).toBe(false);
    expect(is.idc(NaN)).toBe(false);

    expect(is.idc(C.SLASH)).toBe(false);
    expect(is.idc(C.DECIMAL_0)).toBe(true);
    expect(is.idc(C.DECIMAL_9)).toBe(true);
    expect(is.idc(C.COLON)).toBe(false);

    expect(is.idc(C.AT)).toBe(false);
    expect(is.idc(C.UPPERCASE_A)).toBe(true);
    expect(is.idc(C.UPPERCASE_Z)).toBe(true);
    expect(is.idc(C.BRACKET_L)).toBe(false);

    expect(is.idc(C.BACKTICK)).toBe(false);
    expect(is.idc(C.LOWERCASE_A)).toBe(true);
    expect(is.idc(C.LOWERCASE_Z)).toBe(true);
    expect(is.idc(C.BRACE_L)).toBe(false);

    expect(is.idc(C.HYPHEN)).toBe(true);
    expect(is.idc(C.UNDERSCORE)).toBe(true);

    expect(is.idc(C.DELETE)).toBe(false);

    expect(is.idc(128)).toBe(true);
});

test('is binary', () => {
    expect(is.binary(-1)).toBe(false);
    expect(is.binary(NaN)).toBe(false);

    expect(is.binary(C.SLASH)).toBe(false);
    expect(is.binary(C.DECIMAL_0)).toBe(true);
    expect(is.binary(C.DECIMAL_1)).toBe(true);
    expect(is.binary(C.DECIMAL_2)).toBe(false);
});

test('is octal', () => {
    expect(is.octal(-1)).toBe(false);
    expect(is.octal(NaN)).toBe(false);

    expect(is.octal(C.SLASH)).toBe(false);
    expect(is.octal(C.DECIMAL_0)).toBe(true);
    expect(is.octal(C.DECIMAL_7)).toBe(true);
    expect(is.octal(C.DECIMAL_8)).toBe(false);
});

test('is hexadecimal', () => {
    expect(is.hexadecimal(-1)).toBe(false);
    expect(is.hexadecimal(NaN)).toBe(false);

    expect(is.hexadecimal(C.SLASH)).toBe(false);
    expect(is.hexadecimal(C.DECIMAL_0)).toBe(true);
    expect(is.hexadecimal(C.DECIMAL_9)).toBe(true);
    expect(is.hexadecimal(C.COLON)).toBe(false);

    expect(is.hexadecimal(C.AT)).toBe(false);
    expect(is.hexadecimal(C.UPPERCASE_A)).toBe(true);
    expect(is.hexadecimal(C.UPPERCASE_F)).toBe(true);
    expect(is.hexadecimal(C.UPPERCASE_G)).toBe(false);

    expect(is.hexadecimal(C.BACKTICK)).toBe(false);
    expect(is.hexadecimal(C.LOWERCASE_A)).toBe(true);
    expect(is.hexadecimal(C.LOWERCASE_F)).toBe(true);
    expect(is.hexadecimal(C.LOWERCASE_G)).toBe(false);
});

test('is separator', () => {
    expect(is.separator(-1)).toBe(false);
    expect(is.separator(NaN)).toBe(false);

    expect(is.separator(C.COMMA)).toBe(true);
    expect(is.separator(C.SEMICOLON)).toBe(true);
});

test('is operator', () => {
    expect(is.operator(-1)).toBe(false);
    expect(is.operator(NaN)).toBe(false);

    expect(is.operator(C.EXCLAMATION)).toBe(true);
    expect(is.operator(C.HASH)).toBe(true);
    expect(is.operator(C.DOLLAR)).toBe(true);
    expect(is.operator(C.PERCENT)).toBe(true);
    expect(is.operator(C.AMPERSAND)).toBe(true);
    expect(is.operator(C.ASTERISK)).toBe(true);
    expect(is.operator(C.PLUS)).toBe(true);
    expect(is.operator(C.DOT)).toBe(true);
    expect(is.operator(C.SLASH)).toBe(true);
    expect(is.operator(C.COLON)).toBe(true);
    expect(is.operator(C.ANGLE_L)).toBe(true);
    expect(is.operator(C.EQUALS)).toBe(true);
    expect(is.operator(C.ANGLE_R)).toBe(true);
    expect(is.operator(C.QUESTION)).toBe(true);
    expect(is.operator(C.AT)).toBe(true);
    expect(is.operator(C.CARET)).toBe(true);
    expect(is.operator(C.PIPE)).toBe(true);
    expect(is.operator(C.TILDE)).toBe(true);
    expect(is.operator(C.HYPHEN)).toBe(true);
});

test('is escape', () => {
    expect(is.escape(-1)).toBe(false);
    expect(is.escape(NaN)).toBe(false);

    expect(is.escape(C.BACKSLASH)).toBe(true);
});

test('is quote', () => {
    expect(is.quote(-1)).toBe(false);
    expect(is.quote(NaN)).toBe(false);

    expect(is.quote(C.DOUBLE_QUOTE)).toBe(true);
    expect(is.quote(C.SINGLE_QUOTE)).toBe(true);
    expect(is.quote(C.BACKTICK)).toBe(false);
});

test('is extquote', () => {
    expect(is.extquote(-1)).toBe(false);
    expect(is.extquote(NaN)).toBe(false);

    expect(is.extquote(C.DOUBLE_QUOTE)).toBe(true);
    expect(is.extquote(C.SINGLE_QUOTE)).toBe(true);
    expect(is.extquote(C.BACKTICK)).toBe(true);
});

test('is opening', () => {
    expect(is.opening(-1)).toBe(false);
    expect(is.opening(NaN)).toBe(false);

    expect(is.opening(C.PARENTHESIS_L)).toBe(true);
    expect(is.opening(C.BRACKET_L)).toBe(true);
    expect(is.opening(C.BRACE_L)).toBe(true);

    expect(is.opening(C.PARENTHESIS_R)).toBe(false);
    expect(is.opening(C.BRACKET_R)).toBe(false);
    expect(is.opening(C.BRACE_R)).toBe(false);

    expect(is.opening(C.ANGLE_L)).toBe(false);
    expect(is.opening(C.ANGLE_R)).toBe(false);
});

test('is ending', () => {
    expect(is.ending(-1)).toBe(false);
    expect(is.ending(NaN)).toBe(false);

    expect(is.ending(C.PARENTHESIS_L)).toBe(false);
    expect(is.ending(C.BRACKET_L)).toBe(false);
    expect(is.ending(C.BRACE_L)).toBe(false);

    expect(is.ending(C.PARENTHESIS_R)).toBe(true);
    expect(is.ending(C.BRACKET_R)).toBe(true);
    expect(is.ending(C.BRACE_R)).toBe(true);

    expect(is.ending(C.ANGLE_L)).toBe(false);
    expect(is.ending(C.ANGLE_R)).toBe(false);
});

test('is pair', () => {
    expect(is.pair(-1)).toBe(false);
    expect(is.pair(NaN)).toBe(false);

    expect(is.pair(C.PARENTHESIS_L)).toBe(true);
    expect(is.pair(C.BRACKET_L)).toBe(true);
    expect(is.pair(C.BRACE_L)).toBe(true);

    expect(is.pair(C.PARENTHESIS_R)).toBe(true);
    expect(is.pair(C.BRACKET_R)).toBe(true);
    expect(is.pair(C.BRACE_R)).toBe(true);

    expect(is.pair(C.ANGLE_L)).toBe(false);
    expect(is.pair(C.ANGLE_R)).toBe(false);
});

test('is sign', () => {
    expect(is.sign(-1)).toBe(false);
    expect(is.sign(NaN)).toBe(false);

    expect(is.sign(C.PLUS)).toBe(true);
    expect(is.sign(C.HYPHEN)).toBe(true);
});

test('is complement', () => {
    expect(is.complement(O.PARENTHESIS_L, E.BRACKET_R)).toBe(false);
    expect(is.complement(0, 0)).toBe(false);

    expect(is.complement(O.PARENTHESIS_L, E.PARENTHESIS_R)).toBe(true);
    expect(is.complement(O.BRACKET_L, E.BRACKET_R)).toBe(true);
    expect(is.complement(O.BRACE_L, E.BRACE_R)).toBe(true);
});

test('get complement', () => {
    expect(get.complement(O.PARENTHESIS_L)).toBe(E.PARENTHESIS_R);
    expect(get.complement(O.BRACKET_L)).toBe(E.BRACKET_R);
    expect(get.complement(O.BRACE_L)).toBe(E.BRACE_R);
});

test('table', () => {
    let t =
        '\x00\x01\x02\x03\x04\x05\x06\x07\b\t\n' +
        '\x0B\f\r\x0E\x0F\x10\x11\x12\x13\x14\x15' +
        '\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F' +
        ' !"#$%&\'()*+,-./0123456789:;<=>?@' +
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`' +
        'abcdefghijklmnopqrstuvwxyz{|}~\x7F';

    expect(table).toBe(t);

    expect(table[-1]).toBe(undefined);
    expect(table[C.NULL]).toBe('\x00');
    expect(table[C.UPPERCASE_A]).toBe('A');
    expect(table[C.DELETE]).toBe('\x7f');
    expect(table[128]).toBe(undefined);
    expect(table[14.88]).toBe(undefined);
});

test('decode', () => {
    expect(decode(-1)).toBe('');
    expect(decode(C.NULL)).toBe('\x00');
    expect(decode(C.UPPERCASE_A)).toBe('A');
    expect(decode(C.DELETE)).toBe('\x7f');
    expect(decode(128)).toBe('');
    expect(decode(14.88)).toBe('');
});

test('parse digit', () => {
    expect(parse.digit(0)).toBe(0);

    expect(parse.digit(H.DECIMAL_0)).toBe(0);
    expect(parse.digit(H.DECIMAL_1)).toBe(1);
    expect(parse.digit(H.DECIMAL_2)).toBe(2);
    expect(parse.digit(H.DECIMAL_3)).toBe(3);
    expect(parse.digit(H.DECIMAL_4)).toBe(4);
    expect(parse.digit(H.DECIMAL_5)).toBe(5);
    expect(parse.digit(H.DECIMAL_6)).toBe(6);
    expect(parse.digit(H.DECIMAL_7)).toBe(7);
    expect(parse.digit(H.DECIMAL_8)).toBe(8);
    expect(parse.digit(H.DECIMAL_9)).toBe(9);

    expect(parse.digit(H.UPPERCASE_A)).toBe(10);
    expect(parse.digit(H.UPPERCASE_B)).toBe(11);
    expect(parse.digit(H.UPPERCASE_C)).toBe(12);
    expect(parse.digit(H.UPPERCASE_D)).toBe(13);
    expect(parse.digit(H.UPPERCASE_E)).toBe(14);
    expect(parse.digit(H.UPPERCASE_F)).toBe(15);

    expect(parse.digit(H.LOWERCASE_A)).toBe(10);
    expect(parse.digit(H.LOWERCASE_B)).toBe(11);
    expect(parse.digit(H.LOWERCASE_C)).toBe(12);
    expect(parse.digit(H.LOWERCASE_D)).toBe(13);
    expect(parse.digit(H.LOWERCASE_E)).toBe(14);
    expect(parse.digit(H.LOWERCASE_F)).toBe(15);
});

test('charcode', () => {
    expect(charcode('')).toBe(0);
    expect(charcode('1')).toBe(C.DECIMAL_1);
    expect(charcode('12')).toBe(C.DECIMAL_1);
});
