export namespace Ascii {
    /**
     * ASCII control characters.
     */
    export const enum Control {
        NULL /*                */ = 0x00,
        SOH /*                 */ = 0x01,
        STX /*                 */ = 0x02,
        ETX /*                 */ = 0x03,
        EOT /*                 */ = 0x04,
        ENQ /*                 */ = 0x05,
        ACK /*                 */ = 0x06,
        BELL /*                */ = 0x07,
        BACKSPACE /*           */ = 0x08,
        VERTICAL_TAB /*        */ = 0x0b,
        SO /*                  */ = 0x0e,
        SI /*                  */ = 0x0f,
        DLE /*                 */ = 0x10,
        DC1 /*                 */ = 0x11,
        DC2 /*                 */ = 0x12,
        DC3 /*                 */ = 0x13,
        DC4 /*                 */ = 0x14,
        NAK /*                 */ = 0x15,
        SYN /*                 */ = 0x16,
        ETB /*                 */ = 0x17,
        CAN /*                 */ = 0x18,
        EM /*                  */ = 0x19,
        SUB /*                 */ = 0x1a,
        ESCAPE /*              */ = 0x1b,
        FS /*                  */ = 0x1c,
        GS /*                  */ = 0x1d,
        RS /*                  */ = 0x1e,
        US /*                  */ = 0x1f,
        DELETE /*              */ = 0x7f,
    }

    /**
     * ASCII horizontal whitespace characters (as per CSS Syntax spec).
     */
    export const enum Whitespace {
        HORIZONTAL_TAB /*      */ = 0x09,
        WHITESPACE /*          */ = 0x20,
    }

    /**
     * ASCII newline characters (as per CSS Syntax spec).
     */
    export const enum Newline {
        LINE_FEED /*           */ = 0x0a,
        FORM_FEED /*           */ = 0x0c,
        CARRIAGE_RETURN /*     */ = 0x0d,
    }

    /**
     * ASCII horizontal/vertical whitespace characters.
     */
    export const enum Blank {
        HORIZONTAL_TAB /*      */ = Whitespace.HORIZONTAL_TAB,
        WHITESPACE /*          */ = Whitespace.WHITESPACE,

        LINE_FEED /*           */ = Newline.LINE_FEED,
        FORM_FEED /*           */ = Newline.FORM_FEED,
        CARRIAGE_RETURN /*     */ = Newline.CARRIAGE_RETURN,
    }

    /**
     * ASCII decimal digits.
     */
    export const enum Decimal {
        DECIMAL_0 /*           */ = 0x30,
        DECIMAL_1 /*           */ = 0x31,
        DECIMAL_2 /*           */ = 0x32,
        DECIMAL_3 /*           */ = 0x33,
        DECIMAL_4 /*           */ = 0x34,
        DECIMAL_5 /*           */ = 0x35,
        DECIMAL_6 /*           */ = 0x36,
        DECIMAL_7 /*           */ = 0x37,
        DECIMAL_8 /*           */ = 0x38,
        DECIMAL_9 /*           */ = 0x39,
    }

    /**
     * ASCII uppercase letters.
     */
    export const enum Uppercase {
        UPPERCASE_A /*         */ = 0x41,
        UPPERCASE_B /*         */ = 0x42,
        UPPERCASE_C /*         */ = 0x43,
        UPPERCASE_D /*         */ = 0x44,
        UPPERCASE_E /*         */ = 0x45,
        UPPERCASE_F /*         */ = 0x46,
        UPPERCASE_G /*         */ = 0x47,
        UPPERCASE_H /*         */ = 0x48,
        UPPERCASE_I /*         */ = 0x49,
        UPPERCASE_J /*         */ = 0x4a,
        UPPERCASE_K /*         */ = 0x4b,
        UPPERCASE_L /*         */ = 0x4c,
        UPPERCASE_M /*         */ = 0x4d,
        UPPERCASE_N /*         */ = 0x4e,
        UPPERCASE_O /*         */ = 0x4f,
        UPPERCASE_P /*         */ = 0x50,
        UPPERCASE_Q /*         */ = 0x51,
        UPPERCASE_R /*         */ = 0x52,
        UPPERCASE_S /*         */ = 0x53,
        UPPERCASE_T /*         */ = 0x54,
        UPPERCASE_U /*         */ = 0x55,
        UPPERCASE_V /*         */ = 0x56,
        UPPERCASE_W /*         */ = 0x57,
        UPPERCASE_X /*         */ = 0x58,
        UPPERCASE_Y /*         */ = 0x59,
        UPPERCASE_Z /*         */ = 0x5a,
    }

    /**
     * ASCII lowercase letters.
     */
    export const enum Lowercase {
        LOWERCASE_A /*         */ = 0x61,
        LOWERCASE_B /*         */ = 0x62,
        LOWERCASE_C /*         */ = 0x63,
        LOWERCASE_D /*         */ = 0x64,
        LOWERCASE_E /*         */ = 0x65,
        LOWERCASE_F /*         */ = 0x66,
        LOWERCASE_G /*         */ = 0x67,
        LOWERCASE_H /*         */ = 0x68,
        LOWERCASE_I /*         */ = 0x69,
        LOWERCASE_J /*         */ = 0x6a,
        LOWERCASE_K /*         */ = 0x6b,
        LOWERCASE_L /*         */ = 0x6c,
        LOWERCASE_M /*         */ = 0x6d,
        LOWERCASE_N /*         */ = 0x6e,
        LOWERCASE_O /*         */ = 0x6f,
        LOWERCASE_P /*         */ = 0x70,
        LOWERCASE_Q /*         */ = 0x71,
        LOWERCASE_R /*         */ = 0x72,
        LOWERCASE_S /*         */ = 0x73,
        LOWERCASE_T /*         */ = 0x74,
        LOWERCASE_U /*         */ = 0x75,
        LOWERCASE_V /*         */ = 0x76,
        LOWERCASE_W /*         */ = 0x77,
        LOWERCASE_X /*         */ = 0x78,
        LOWERCASE_Y /*         */ = 0x79,
        LOWERCASE_Z /*         */ = 0x7a,
    }

    /**
     * ASCII letters.
     */
    export const enum Letter {
        // region
        UPPERCASE_A /*         */ = Uppercase.UPPERCASE_A,
        UPPERCASE_B /*         */ = Uppercase.UPPERCASE_B,
        UPPERCASE_C /*         */ = Uppercase.UPPERCASE_C,
        UPPERCASE_D /*         */ = Uppercase.UPPERCASE_D,
        UPPERCASE_E /*         */ = Uppercase.UPPERCASE_E,
        UPPERCASE_F /*         */ = Uppercase.UPPERCASE_F,
        UPPERCASE_G /*         */ = Uppercase.UPPERCASE_G,
        UPPERCASE_H /*         */ = Uppercase.UPPERCASE_H,
        UPPERCASE_I /*         */ = Uppercase.UPPERCASE_I,
        UPPERCASE_J /*         */ = Uppercase.UPPERCASE_J,
        UPPERCASE_K /*         */ = Uppercase.UPPERCASE_K,
        UPPERCASE_L /*         */ = Uppercase.UPPERCASE_L,
        UPPERCASE_M /*         */ = Uppercase.UPPERCASE_M,
        UPPERCASE_N /*         */ = Uppercase.UPPERCASE_N,
        UPPERCASE_O /*         */ = Uppercase.UPPERCASE_O,
        UPPERCASE_P /*         */ = Uppercase.UPPERCASE_P,
        UPPERCASE_Q /*         */ = Uppercase.UPPERCASE_Q,
        UPPERCASE_R /*         */ = Uppercase.UPPERCASE_R,
        UPPERCASE_S /*         */ = Uppercase.UPPERCASE_S,
        UPPERCASE_T /*         */ = Uppercase.UPPERCASE_T,
        UPPERCASE_U /*         */ = Uppercase.UPPERCASE_U,
        UPPERCASE_V /*         */ = Uppercase.UPPERCASE_V,
        UPPERCASE_W /*         */ = Uppercase.UPPERCASE_W,
        UPPERCASE_X /*         */ = Uppercase.UPPERCASE_X,
        UPPERCASE_Y /*         */ = Uppercase.UPPERCASE_Y,
        UPPERCASE_Z /*         */ = Uppercase.UPPERCASE_Z,
        // endregion

        // region
        LOWERCASE_A /*         */ = Lowercase.LOWERCASE_A,
        LOWERCASE_B /*         */ = Lowercase.LOWERCASE_B,
        LOWERCASE_C /*         */ = Lowercase.LOWERCASE_C,
        LOWERCASE_D /*         */ = Lowercase.LOWERCASE_D,
        LOWERCASE_E /*         */ = Lowercase.LOWERCASE_E,
        LOWERCASE_F /*         */ = Lowercase.LOWERCASE_F,
        LOWERCASE_G /*         */ = Lowercase.LOWERCASE_G,
        LOWERCASE_H /*         */ = Lowercase.LOWERCASE_H,
        LOWERCASE_I /*         */ = Lowercase.LOWERCASE_I,
        LOWERCASE_J /*         */ = Lowercase.LOWERCASE_J,
        LOWERCASE_K /*         */ = Lowercase.LOWERCASE_K,
        LOWERCASE_L /*         */ = Lowercase.LOWERCASE_L,
        LOWERCASE_M /*         */ = Lowercase.LOWERCASE_M,
        LOWERCASE_N /*         */ = Lowercase.LOWERCASE_N,
        LOWERCASE_O /*         */ = Lowercase.LOWERCASE_O,
        LOWERCASE_P /*         */ = Lowercase.LOWERCASE_P,
        LOWERCASE_Q /*         */ = Lowercase.LOWERCASE_Q,
        LOWERCASE_R /*         */ = Lowercase.LOWERCASE_R,
        LOWERCASE_S /*         */ = Lowercase.LOWERCASE_S,
        LOWERCASE_T /*         */ = Lowercase.LOWERCASE_T,
        LOWERCASE_U /*         */ = Lowercase.LOWERCASE_U,
        LOWERCASE_V /*         */ = Lowercase.LOWERCASE_V,
        LOWERCASE_W /*         */ = Lowercase.LOWERCASE_W,
        LOWERCASE_X /*         */ = Lowercase.LOWERCASE_X,
        LOWERCASE_Y /*         */ = Lowercase.LOWERCASE_Y,
        LOWERCASE_Z /*         */ = Lowercase.LOWERCASE_Z,
        // endregion
    }

    /**
     * ASCII alphanumeric characters.
     */
    export const enum Alphanumeric {
        // region
        DECIMAL_0 /*           */ = Decimal.DECIMAL_0,
        DECIMAL_1 /*           */ = Decimal.DECIMAL_1,
        DECIMAL_2 /*           */ = Decimal.DECIMAL_2,
        DECIMAL_3 /*           */ = Decimal.DECIMAL_3,
        DECIMAL_4 /*           */ = Decimal.DECIMAL_4,
        DECIMAL_5 /*           */ = Decimal.DECIMAL_5,
        DECIMAL_6 /*           */ = Decimal.DECIMAL_6,
        DECIMAL_7 /*           */ = Decimal.DECIMAL_7,
        DECIMAL_8 /*           */ = Decimal.DECIMAL_8,
        DECIMAL_9 /*           */ = Decimal.DECIMAL_9,
        // endregion

        // region
        // region
        UPPERCASE_A /*         */ = Letter.UPPERCASE_A,
        UPPERCASE_B /*         */ = Letter.UPPERCASE_B,
        UPPERCASE_C /*         */ = Letter.UPPERCASE_C,
        UPPERCASE_D /*         */ = Letter.UPPERCASE_D,
        UPPERCASE_E /*         */ = Letter.UPPERCASE_E,
        UPPERCASE_F /*         */ = Letter.UPPERCASE_F,
        UPPERCASE_G /*         */ = Letter.UPPERCASE_G,
        UPPERCASE_H /*         */ = Letter.UPPERCASE_H,
        UPPERCASE_I /*         */ = Letter.UPPERCASE_I,
        UPPERCASE_J /*         */ = Letter.UPPERCASE_J,
        UPPERCASE_K /*         */ = Letter.UPPERCASE_K,
        UPPERCASE_L /*         */ = Letter.UPPERCASE_L,
        UPPERCASE_M /*         */ = Letter.UPPERCASE_M,
        UPPERCASE_N /*         */ = Letter.UPPERCASE_N,
        UPPERCASE_O /*         */ = Letter.UPPERCASE_O,
        UPPERCASE_P /*         */ = Letter.UPPERCASE_P,
        UPPERCASE_Q /*         */ = Letter.UPPERCASE_Q,
        UPPERCASE_R /*         */ = Letter.UPPERCASE_R,
        UPPERCASE_S /*         */ = Letter.UPPERCASE_S,
        UPPERCASE_T /*         */ = Letter.UPPERCASE_T,
        UPPERCASE_U /*         */ = Letter.UPPERCASE_U,
        UPPERCASE_V /*         */ = Letter.UPPERCASE_V,
        UPPERCASE_W /*         */ = Letter.UPPERCASE_W,
        UPPERCASE_X /*         */ = Letter.UPPERCASE_X,
        UPPERCASE_Y /*         */ = Letter.UPPERCASE_Y,
        UPPERCASE_Z /*         */ = Letter.UPPERCASE_Z,
        // endregion

        // region
        LOWERCASE_A /*         */ = Letter.LOWERCASE_A,
        LOWERCASE_B /*         */ = Letter.LOWERCASE_B,
        LOWERCASE_C /*         */ = Letter.LOWERCASE_C,
        LOWERCASE_D /*         */ = Letter.LOWERCASE_D,
        LOWERCASE_E /*         */ = Letter.LOWERCASE_E,
        LOWERCASE_F /*         */ = Letter.LOWERCASE_F,
        LOWERCASE_G /*         */ = Letter.LOWERCASE_G,
        LOWERCASE_H /*         */ = Letter.LOWERCASE_H,
        LOWERCASE_I /*         */ = Letter.LOWERCASE_I,
        LOWERCASE_J /*         */ = Letter.LOWERCASE_J,
        LOWERCASE_K /*         */ = Letter.LOWERCASE_K,
        LOWERCASE_L /*         */ = Letter.LOWERCASE_L,
        LOWERCASE_M /*         */ = Letter.LOWERCASE_M,
        LOWERCASE_N /*         */ = Letter.LOWERCASE_N,
        LOWERCASE_O /*         */ = Letter.LOWERCASE_O,
        LOWERCASE_P /*         */ = Letter.LOWERCASE_P,
        LOWERCASE_Q /*         */ = Letter.LOWERCASE_Q,
        LOWERCASE_R /*         */ = Letter.LOWERCASE_R,
        LOWERCASE_S /*         */ = Letter.LOWERCASE_S,
        LOWERCASE_T /*         */ = Letter.LOWERCASE_T,
        LOWERCASE_U /*         */ = Letter.LOWERCASE_U,
        LOWERCASE_V /*         */ = Letter.LOWERCASE_V,
        LOWERCASE_W /*         */ = Letter.LOWERCASE_W,
        LOWERCASE_X /*         */ = Letter.LOWERCASE_X,
        LOWERCASE_Y /*         */ = Letter.LOWERCASE_Y,
        LOWERCASE_Z /*         */ = Letter.LOWERCASE_Z,
        // endregion
        // endregion
    }

    /**
     * ASCII identifier start characters (as per CSS Syntax spec).
     */
    export const enum Ids {
        // region
        // region
        UPPERCASE_A /*         */ = Alphanumeric.UPPERCASE_A,
        UPPERCASE_B /*         */ = Alphanumeric.UPPERCASE_B,
        UPPERCASE_C /*         */ = Alphanumeric.UPPERCASE_C,
        UPPERCASE_D /*         */ = Alphanumeric.UPPERCASE_D,
        UPPERCASE_E /*         */ = Alphanumeric.UPPERCASE_E,
        UPPERCASE_F /*         */ = Alphanumeric.UPPERCASE_F,
        UPPERCASE_G /*         */ = Alphanumeric.UPPERCASE_G,
        UPPERCASE_H /*         */ = Alphanumeric.UPPERCASE_H,
        UPPERCASE_I /*         */ = Alphanumeric.UPPERCASE_I,
        UPPERCASE_J /*         */ = Alphanumeric.UPPERCASE_J,
        UPPERCASE_K /*         */ = Alphanumeric.UPPERCASE_K,
        UPPERCASE_L /*         */ = Alphanumeric.UPPERCASE_L,
        UPPERCASE_M /*         */ = Alphanumeric.UPPERCASE_M,
        UPPERCASE_N /*         */ = Alphanumeric.UPPERCASE_N,
        UPPERCASE_O /*         */ = Alphanumeric.UPPERCASE_O,
        UPPERCASE_P /*         */ = Alphanumeric.UPPERCASE_P,
        UPPERCASE_Q /*         */ = Alphanumeric.UPPERCASE_Q,
        UPPERCASE_R /*         */ = Alphanumeric.UPPERCASE_R,
        UPPERCASE_S /*         */ = Alphanumeric.UPPERCASE_S,
        UPPERCASE_T /*         */ = Alphanumeric.UPPERCASE_T,
        UPPERCASE_U /*         */ = Alphanumeric.UPPERCASE_U,
        UPPERCASE_V /*         */ = Alphanumeric.UPPERCASE_V,
        UPPERCASE_W /*         */ = Alphanumeric.UPPERCASE_W,
        UPPERCASE_X /*         */ = Alphanumeric.UPPERCASE_X,
        UPPERCASE_Y /*         */ = Alphanumeric.UPPERCASE_Y,
        UPPERCASE_Z /*         */ = Alphanumeric.UPPERCASE_Z,
        // endregion

        // region
        LOWERCASE_A /*         */ = Alphanumeric.LOWERCASE_A,
        LOWERCASE_B /*         */ = Alphanumeric.LOWERCASE_B,
        LOWERCASE_C /*         */ = Alphanumeric.LOWERCASE_C,
        LOWERCASE_D /*         */ = Alphanumeric.LOWERCASE_D,
        LOWERCASE_E /*         */ = Alphanumeric.LOWERCASE_E,
        LOWERCASE_F /*         */ = Alphanumeric.LOWERCASE_F,
        LOWERCASE_G /*         */ = Alphanumeric.LOWERCASE_G,
        LOWERCASE_H /*         */ = Alphanumeric.LOWERCASE_H,
        LOWERCASE_I /*         */ = Alphanumeric.LOWERCASE_I,
        LOWERCASE_J /*         */ = Alphanumeric.LOWERCASE_J,
        LOWERCASE_K /*         */ = Alphanumeric.LOWERCASE_K,
        LOWERCASE_L /*         */ = Alphanumeric.LOWERCASE_L,
        LOWERCASE_M /*         */ = Alphanumeric.LOWERCASE_M,
        LOWERCASE_N /*         */ = Alphanumeric.LOWERCASE_N,
        LOWERCASE_O /*         */ = Alphanumeric.LOWERCASE_O,
        LOWERCASE_P /*         */ = Alphanumeric.LOWERCASE_P,
        LOWERCASE_Q /*         */ = Alphanumeric.LOWERCASE_Q,
        LOWERCASE_R /*         */ = Alphanumeric.LOWERCASE_R,
        LOWERCASE_S /*         */ = Alphanumeric.LOWERCASE_S,
        LOWERCASE_T /*         */ = Alphanumeric.LOWERCASE_T,
        LOWERCASE_U /*         */ = Alphanumeric.LOWERCASE_U,
        LOWERCASE_V /*         */ = Alphanumeric.LOWERCASE_V,
        LOWERCASE_W /*         */ = Alphanumeric.LOWERCASE_W,
        LOWERCASE_X /*         */ = Alphanumeric.LOWERCASE_X,
        LOWERCASE_Y /*         */ = Alphanumeric.LOWERCASE_Y,
        LOWERCASE_Z /*         */ = Alphanumeric.LOWERCASE_Z,
        // endregion
        // endregion

        // region
        HYPHEN /*              */ = 0x2d,
        UNDERSCORE /*          */ = 0x5f,
        // endregion
    }

    /**
     * ASCII identifier continue characters (as per CSS Syntax spec).
     */
    export const enum Idc {
        // region
        DECIMAL_0 /*           */ = Alphanumeric.DECIMAL_0,
        DECIMAL_1 /*           */ = Alphanumeric.DECIMAL_1,
        DECIMAL_2 /*           */ = Alphanumeric.DECIMAL_2,
        DECIMAL_3 /*           */ = Alphanumeric.DECIMAL_3,
        DECIMAL_4 /*           */ = Alphanumeric.DECIMAL_4,
        DECIMAL_5 /*           */ = Alphanumeric.DECIMAL_5,
        DECIMAL_6 /*           */ = Alphanumeric.DECIMAL_6,
        DECIMAL_7 /*           */ = Alphanumeric.DECIMAL_7,
        DECIMAL_8 /*           */ = Alphanumeric.DECIMAL_8,
        DECIMAL_9 /*           */ = Alphanumeric.DECIMAL_9,
        // endregion

        // region
        // region
        UPPERCASE_A /*         */ = Ids.UPPERCASE_A,
        UPPERCASE_B /*         */ = Ids.UPPERCASE_B,
        UPPERCASE_C /*         */ = Ids.UPPERCASE_C,
        UPPERCASE_D /*         */ = Ids.UPPERCASE_D,
        UPPERCASE_E /*         */ = Ids.UPPERCASE_E,
        UPPERCASE_F /*         */ = Ids.UPPERCASE_F,
        UPPERCASE_G /*         */ = Ids.UPPERCASE_G,
        UPPERCASE_H /*         */ = Ids.UPPERCASE_H,
        UPPERCASE_I /*         */ = Ids.UPPERCASE_I,
        UPPERCASE_J /*         */ = Ids.UPPERCASE_J,
        UPPERCASE_K /*         */ = Ids.UPPERCASE_K,
        UPPERCASE_L /*         */ = Ids.UPPERCASE_L,
        UPPERCASE_M /*         */ = Ids.UPPERCASE_M,
        UPPERCASE_N /*         */ = Ids.UPPERCASE_N,
        UPPERCASE_O /*         */ = Ids.UPPERCASE_O,
        UPPERCASE_P /*         */ = Ids.UPPERCASE_P,
        UPPERCASE_Q /*         */ = Ids.UPPERCASE_Q,
        UPPERCASE_R /*         */ = Ids.UPPERCASE_R,
        UPPERCASE_S /*         */ = Ids.UPPERCASE_S,
        UPPERCASE_T /*         */ = Ids.UPPERCASE_T,
        UPPERCASE_U /*         */ = Ids.UPPERCASE_U,
        UPPERCASE_V /*         */ = Ids.UPPERCASE_V,
        UPPERCASE_W /*         */ = Ids.UPPERCASE_W,
        UPPERCASE_X /*         */ = Ids.UPPERCASE_X,
        UPPERCASE_Y /*         */ = Ids.UPPERCASE_Y,
        UPPERCASE_Z /*         */ = Ids.UPPERCASE_Z,
        // endregion

        // region
        LOWERCASE_A /*         */ = Ids.LOWERCASE_A,
        LOWERCASE_B /*         */ = Ids.LOWERCASE_B,
        LOWERCASE_C /*         */ = Ids.LOWERCASE_C,
        LOWERCASE_D /*         */ = Ids.LOWERCASE_D,
        LOWERCASE_E /*         */ = Ids.LOWERCASE_E,
        LOWERCASE_F /*         */ = Ids.LOWERCASE_F,
        LOWERCASE_G /*         */ = Ids.LOWERCASE_G,
        LOWERCASE_H /*         */ = Ids.LOWERCASE_H,
        LOWERCASE_I /*         */ = Ids.LOWERCASE_I,
        LOWERCASE_J /*         */ = Ids.LOWERCASE_J,
        LOWERCASE_K /*         */ = Ids.LOWERCASE_K,
        LOWERCASE_L /*         */ = Ids.LOWERCASE_L,
        LOWERCASE_M /*         */ = Ids.LOWERCASE_M,
        LOWERCASE_N /*         */ = Ids.LOWERCASE_N,
        LOWERCASE_O /*         */ = Ids.LOWERCASE_O,
        LOWERCASE_P /*         */ = Ids.LOWERCASE_P,
        LOWERCASE_Q /*         */ = Ids.LOWERCASE_Q,
        LOWERCASE_R /*         */ = Ids.LOWERCASE_R,
        LOWERCASE_S /*         */ = Ids.LOWERCASE_S,
        LOWERCASE_T /*         */ = Ids.LOWERCASE_T,
        LOWERCASE_U /*         */ = Ids.LOWERCASE_U,
        LOWERCASE_V /*         */ = Ids.LOWERCASE_V,
        LOWERCASE_W /*         */ = Ids.LOWERCASE_W,
        LOWERCASE_X /*         */ = Ids.LOWERCASE_X,
        LOWERCASE_Y /*         */ = Ids.LOWERCASE_Y,
        LOWERCASE_Z /*         */ = Ids.LOWERCASE_Z,
        // endregion
        // endregion

        // region
        HYPHEN /*              */ = Ids.HYPHEN, // Also may be an operator.
        UNDERSCORE /*          */ = Ids.UNDERSCORE,
        // endregion
    }

    /**
     * ASCII binary digits.
     */
    export const enum Binary {
        DECIMAL_0 /*           */ = Decimal.DECIMAL_0,
        DECIMAL_1 /*           */ = Decimal.DECIMAL_1,
    }

    /**
     * ASCII octal digits.
     */
    export const enum Octal {
        DECIMAL_0 /*           */ = Decimal.DECIMAL_0,
        DECIMAL_1 /*           */ = Decimal.DECIMAL_1,
        DECIMAL_2 /*           */ = Decimal.DECIMAL_2,
        DECIMAL_3 /*           */ = Decimal.DECIMAL_3,
        DECIMAL_4 /*           */ = Decimal.DECIMAL_4,
        DECIMAL_5 /*           */ = Decimal.DECIMAL_5,
        DECIMAL_6 /*           */ = Decimal.DECIMAL_6,
        DECIMAL_7 /*           */ = Decimal.DECIMAL_7,
    }

    /**
     * ASCII hexadecimal digits (including {@link Decimal}).
     */
    export const enum Hexadecimal {
        DECIMAL_0 /*           */ = Decimal.DECIMAL_0,
        DECIMAL_1 /*           */ = Decimal.DECIMAL_1,
        DECIMAL_2 /*           */ = Decimal.DECIMAL_2,
        DECIMAL_3 /*           */ = Decimal.DECIMAL_3,
        DECIMAL_4 /*           */ = Decimal.DECIMAL_4,
        DECIMAL_5 /*           */ = Decimal.DECIMAL_5,
        DECIMAL_6 /*           */ = Decimal.DECIMAL_6,
        DECIMAL_7 /*           */ = Decimal.DECIMAL_7,
        DECIMAL_8 /*           */ = Decimal.DECIMAL_8,
        DECIMAL_9 /*           */ = Decimal.DECIMAL_9,

        UPPERCASE_A /*         */ = Uppercase.UPPERCASE_A,
        UPPERCASE_B /*         */ = Uppercase.UPPERCASE_B,
        UPPERCASE_C /*         */ = Uppercase.UPPERCASE_C,
        UPPERCASE_D /*         */ = Uppercase.UPPERCASE_D,
        UPPERCASE_E /*         */ = Uppercase.UPPERCASE_E,
        UPPERCASE_F /*         */ = Uppercase.UPPERCASE_F,

        LOWERCASE_A /*         */ = Lowercase.LOWERCASE_A,
        LOWERCASE_B /*         */ = Lowercase.LOWERCASE_B,
        LOWERCASE_C /*         */ = Lowercase.LOWERCASE_C,
        LOWERCASE_D /*         */ = Lowercase.LOWERCASE_D,
        LOWERCASE_E /*         */ = Lowercase.LOWERCASE_E,
        LOWERCASE_F /*         */ = Lowercase.LOWERCASE_F,
    }

    /**
     * ASCII separator characters.
     */
    export const enum Separator {
        COMMA /*               */ = 0x2c,
        SEMICOLON /*           */ = 0x3b,
    }

    /**
     * The backslash.
     */
    export const enum Escape {
        BACKSLASH /*           */ = 0x5c,
    }

    /**
     * ASCII quote characters (as per CSS Syntax spec).
     */
    export const enum Quote {
        DOUBLE_QUOTE /*        */ = 0x22,
        SINGLE_QUOTE /*        */ = 0x27,
    }

    /**
     * ASCII quote characters (including the backtick).
     */
    export const enum Extquote {
        DOUBLE_QUOTE /*        */ = Quote.DOUBLE_QUOTE,
        SINGLE_QUOTE /*        */ = Quote.SINGLE_QUOTE,

        BACKTICK /*            */ = 0x60,
    }

    /**
     * ASCII group opening characters.
     */
    export const enum Opening {
        PARENTHESIS_L /*       */ = 0x28,
        BRACKET_L /*           */ = 0x5b,
        BRACE_L /*             */ = 0x7b,
    }

    /**
     * ASCII group ending characters.
     */
    export const enum Ending {
        PARENTHESIS_R /*       */ = 0x29,
        BRACKET_R /*           */ = 0x5d,
        BRACE_R /*             */ = 0x7d,
    }

    /**
     * ASCII group opening/ending characters.
     */
    export const enum Pair {
        PARENTHESIS_L /*       */ = Opening.PARENTHESIS_L,
        BRACKET_L /*           */ = Opening.BRACKET_L,
        BRACE_L /*             */ = Opening.BRACE_L,

        PARENTHESIS_R /*       */ = Ending.PARENTHESIS_R,
        BRACKET_R /*           */ = Ending.BRACKET_R,
        BRACE_R /*             */ = Ending.BRACE_R,
    }

    /**
     * ASCII operator characters.
     */
    export const enum Operator {
        EXCLAMATION /*         */ = 0x21,
        HASH /*                */ = 0x23,
        DOLLAR /*              */ = 0x24,
        PERCENT /*             */ = 0x25,
        AMPERSAND /*           */ = 0x26,
        ASTERISK /*            */ = 0x2a,
        PLUS /*                */ = 0x2b,
        HYPHEN /*              */ = Ids.HYPHEN,
        DOT /*                 */ = 0x2e,
        SLASH /*               */ = 0x2f,
        COLON /*               */ = 0x3a,
        ANGLE_L /*             */ = 0x3c,
        EQUALS /*              */ = 0x3d,
        ANGLE_R /*             */ = 0x3e,
        QUESTION /*            */ = 0x3f,
        AT /*                  */ = 0x40,
        CARET /*               */ = 0x5e,
        PIPE /*                */ = 0x7c,
        TILDE /*               */ = 0x7e,
    }

    /**
     * ASCII numeric sign characters.
     */
    export const enum Sign {
        HYPHEN /*              */ = Ids.HYPHEN,
        PLUS /*                */ = Operator.PLUS,
    }

    /**
     * ASCII codes.
     */
    export const enum Code {
        // region Control
        NULL /*                */ = Control.NULL,
        SOH /*                 */ = Control.SOH,
        STX /*                 */ = Control.STX,
        ETX /*                 */ = Control.ETX,
        EOT /*                 */ = Control.EOT,
        ENQ /*                 */ = Control.ENQ,
        ACK /*                 */ = Control.ACK,
        BELL /*                */ = Control.BELL,
        BACKSPACE /*           */ = Control.BACKSPACE,
        VERTICAL_TAB /*        */ = Control.VERTICAL_TAB,
        SO /*                  */ = Control.SO,
        SI /*                  */ = Control.SI,
        DLE /*                 */ = Control.DLE,
        DC1 /*                 */ = Control.DC1,
        DC2 /*                 */ = Control.DC2,
        DC3 /*                 */ = Control.DC3,
        DC4 /*                 */ = Control.DC4,
        NAK /*                 */ = Control.NAK,
        SYN /*                 */ = Control.SYN,
        ETB /*                 */ = Control.ETB,
        CAN /*                 */ = Control.CAN,
        EM /*                  */ = Control.EM,
        SUB /*                 */ = Control.SUB,
        ESCAPE /*              */ = Control.ESCAPE,
        FS /*                  */ = Control.FS,
        GS /*                  */ = Control.GS,
        RS /*                  */ = Control.RS,
        US /*                  */ = Control.US,
        DELETE /*              */ = Control.DELETE,
        // endregion

        // region Blank
        HORIZONTAL_TAB /*      */ = Whitespace.HORIZONTAL_TAB,
        WHITESPACE /*          */ = Whitespace.WHITESPACE,

        LINE_FEED /*           */ = Newline.LINE_FEED,
        FORM_FEED /*           */ = Newline.FORM_FEED,
        CARRIAGE_RETURN /*     */ = Newline.CARRIAGE_RETURN,
        // endregion

        // region Decimal
        DECIMAL_0 /*           */ = Decimal.DECIMAL_0,
        DECIMAL_1 /*           */ = Decimal.DECIMAL_1,
        DECIMAL_2 /*           */ = Decimal.DECIMAL_2,
        DECIMAL_3 /*           */ = Decimal.DECIMAL_3,
        DECIMAL_4 /*           */ = Decimal.DECIMAL_4,
        DECIMAL_5 /*           */ = Decimal.DECIMAL_5,
        DECIMAL_6 /*           */ = Decimal.DECIMAL_6,
        DECIMAL_7 /*           */ = Decimal.DECIMAL_7,
        DECIMAL_8 /*           */ = Decimal.DECIMAL_8,
        DECIMAL_9 /*           */ = Decimal.DECIMAL_9,
        // endregion

        // region Uppercase
        UPPERCASE_A /*         */ = Uppercase.UPPERCASE_A,
        UPPERCASE_B /*         */ = Uppercase.UPPERCASE_B,
        UPPERCASE_C /*         */ = Uppercase.UPPERCASE_C,
        UPPERCASE_D /*         */ = Uppercase.UPPERCASE_D,
        UPPERCASE_E /*         */ = Uppercase.UPPERCASE_E,
        UPPERCASE_F /*         */ = Uppercase.UPPERCASE_F,
        UPPERCASE_G /*         */ = Uppercase.UPPERCASE_G,
        UPPERCASE_H /*         */ = Uppercase.UPPERCASE_H,
        UPPERCASE_I /*         */ = Uppercase.UPPERCASE_I,
        UPPERCASE_J /*         */ = Uppercase.UPPERCASE_J,
        UPPERCASE_K /*         */ = Uppercase.UPPERCASE_K,
        UPPERCASE_L /*         */ = Uppercase.UPPERCASE_L,
        UPPERCASE_M /*         */ = Uppercase.UPPERCASE_M,
        UPPERCASE_N /*         */ = Uppercase.UPPERCASE_N,
        UPPERCASE_O /*         */ = Uppercase.UPPERCASE_O,
        UPPERCASE_P /*         */ = Uppercase.UPPERCASE_P,
        UPPERCASE_Q /*         */ = Uppercase.UPPERCASE_Q,
        UPPERCASE_R /*         */ = Uppercase.UPPERCASE_R,
        UPPERCASE_S /*         */ = Uppercase.UPPERCASE_S,
        UPPERCASE_T /*         */ = Uppercase.UPPERCASE_T,
        UPPERCASE_U /*         */ = Uppercase.UPPERCASE_U,
        UPPERCASE_V /*         */ = Uppercase.UPPERCASE_V,
        UPPERCASE_W /*         */ = Uppercase.UPPERCASE_W,
        UPPERCASE_X /*         */ = Uppercase.UPPERCASE_X,
        UPPERCASE_Y /*         */ = Uppercase.UPPERCASE_Y,
        UPPERCASE_Z /*         */ = Uppercase.UPPERCASE_Z,
        // endregion

        // region Lowercase
        LOWERCASE_A /*         */ = Lowercase.LOWERCASE_A,
        LOWERCASE_B /*         */ = Lowercase.LOWERCASE_B,
        LOWERCASE_C /*         */ = Lowercase.LOWERCASE_C,
        LOWERCASE_D /*         */ = Lowercase.LOWERCASE_D,
        LOWERCASE_E /*         */ = Lowercase.LOWERCASE_E,
        LOWERCASE_F /*         */ = Lowercase.LOWERCASE_F,
        LOWERCASE_G /*         */ = Lowercase.LOWERCASE_G,
        LOWERCASE_H /*         */ = Lowercase.LOWERCASE_H,
        LOWERCASE_I /*         */ = Lowercase.LOWERCASE_I,
        LOWERCASE_J /*         */ = Lowercase.LOWERCASE_J,
        LOWERCASE_K /*         */ = Lowercase.LOWERCASE_K,
        LOWERCASE_L /*         */ = Lowercase.LOWERCASE_L,
        LOWERCASE_M /*         */ = Lowercase.LOWERCASE_M,
        LOWERCASE_N /*         */ = Lowercase.LOWERCASE_N,
        LOWERCASE_O /*         */ = Lowercase.LOWERCASE_O,
        LOWERCASE_P /*         */ = Lowercase.LOWERCASE_P,
        LOWERCASE_Q /*         */ = Lowercase.LOWERCASE_Q,
        LOWERCASE_R /*         */ = Lowercase.LOWERCASE_R,
        LOWERCASE_S /*         */ = Lowercase.LOWERCASE_S,
        LOWERCASE_T /*         */ = Lowercase.LOWERCASE_T,
        LOWERCASE_U /*         */ = Lowercase.LOWERCASE_U,
        LOWERCASE_V /*         */ = Lowercase.LOWERCASE_V,
        LOWERCASE_W /*         */ = Lowercase.LOWERCASE_W,
        LOWERCASE_X /*         */ = Lowercase.LOWERCASE_X,
        LOWERCASE_Y /*         */ = Lowercase.LOWERCASE_Y,
        LOWERCASE_Z /*         */ = Lowercase.LOWERCASE_Z,
        // endregion

        // region IDS
        HYPHEN /*              */ = Ids.HYPHEN,
        UNDERSCORE /*          */ = Ids.UNDERSCORE,
        // endregion

        // region Separator
        COMMA /*               */ = Separator.COMMA,
        SEMICOLON /*           */ = Separator.SEMICOLON,
        // endregion

        // region Escape
        BACKSLASH /*           */ = Escape.BACKSLASH,
        // endregion

        // region Extquote
        DOUBLE_QUOTE /*        */ = Quote.DOUBLE_QUOTE,
        SINGLE_QUOTE /*        */ = Quote.SINGLE_QUOTE,
        BACKTICK /*            */ = Extquote.BACKTICK,
        // endregion

        // region Group
        PARENTHESIS_L /*       */ = Opening.PARENTHESIS_L,
        BRACKET_L /*           */ = Opening.BRACKET_L,
        BRACE_L /*             */ = Opening.BRACE_L,
        PARENTHESIS_R /*       */ = Ending.PARENTHESIS_R,
        BRACKET_R /*           */ = Ending.BRACKET_R,
        BRACE_R /*             */ = Ending.BRACE_R,
        // endregion

        // region Operator
        EXCLAMATION /*         */ = 0x21,
        HASH /*                */ = 0x23,
        DOLLAR /*              */ = 0x24,
        PERCENT /*             */ = 0x25,
        AMPERSAND /*           */ = 0x26,
        ASTERISK /*            */ = 0x2a,
        PLUS /*                */ = 0x2b,
        DOT /*                 */ = 0x2e,
        SLASH /*               */ = 0x2f,
        COLON /*               */ = 0x3a,
        ANGLE_L /*             */ = 0x3c,
        EQUALS /*              */ = 0x3d,
        ANGLE_R /*             */ = 0x3e,
        QUESTION /*            */ = 0x3f,
        AT /*                  */ = 0x40,
        CARET /*               */ = 0x5e,
        PIPE /*                */ = 0x7c,
        TILDE /*               */ = 0x7e,
        // endregion
    }

    export namespace is {
        /**
         * Checks if a byte is a {@link Control}.
         *
         * > **NB:** UB if the `x` parameter is not an integer.
         *
         * @param x A byte to check.
         */
        export const control = (x: number): x is Control => {
            return (x >= Control.NULL && x <= Control.BACKSPACE) || x === Control.VERTICAL_TAB || (x >= Control.SO && x <= Control.US) || x === Control.DELETE;
        };

        /**
         * Checks is a byte is a {@link Whitespace}.
         *
         * @param x A byte to check.
         */
        export const whitespace = (x: number): x is Whitespace => {
            return x === Whitespace.WHITESPACE || x === Whitespace.HORIZONTAL_TAB;
        };

        /**
         * Checks if a byte is a {@link Newline}.
         *
         * @param x A byte to check.
         */
        export const newline = (x: number): x is Newline => {
            return x === Newline.LINE_FEED || x === Newline.CARRIAGE_RETURN || x === Newline.FORM_FEED;
        };

        /**
         * Checks if a byte is a {@link Blank}.
         *
         * @param x A byte to check.
         */
        export const blank = (x: number): x is Blank => {
            return whitespace(x) || newline(x);
        };

        /**
         * Checks if a byte is a {@link Decimal}.
         *
         * > **NB:** UB if the `x` parameter is not an integer.
         *
         * @param x A byte to check.
         */
        export const decimal = (x: number): x is Decimal => {
            return x >= Decimal.DECIMAL_0 && x <= Decimal.DECIMAL_9;
        };

        /**
         * Checks if a byte is an {@link Uppercase}.
         *
         * > **NB:** UB if the `x` parameter is not an integer.
         *
         * @param x A byte to check.
         */
        export const uppercase = (x: number): x is Uppercase => {
            return x >= Uppercase.UPPERCASE_A && x <= Uppercase.UPPERCASE_Z;
        };

        /**
         * Checks if a byte is a {@link Lowercase}.
         *
         * > **NB:** UB if the `x` parameter is not an integer.
         *
         * @param x A byte to check.
         */
        export const lowercase = (x: number): x is Lowercase => {
            return x >= Lowercase.LOWERCASE_A && x <= Lowercase.LOWERCASE_Z;
        };

        /**
         * Checks if a byte is a {@link Letter}.
         *
         * > **NB:** UB if the `x` parameter is not an integer.
         *
         * @param x A byte to check.
         */
        export const letter = (x: number): x is Letter => {
            return lowercase(x | 0x20);
        };

        /**
         * Checks if a byte is an {@link Alphanumeric}.
         *
         * > **NB:** UB if the `x` parameter is not an integer.
         *
         * @param x A byte to check.
         */
        export const alphanumeric = (x: number): x is Alphanumeric => {
            return decimal(x) || letter(x);
        };

        /**
         * Checks if a byte is an {@link Ids}.
         *
         * > **NB:** UB if the `x` parameter is not an integer.
         *
         * @param x A byte to check.
         */
        export const ids = (x: number): x is Ids => {
            return letter(x) || x === Ids.HYPHEN || x === Ids.UNDERSCORE || x > 127;
        };

        /**
         * Checks if a byte is an {@link Idc}.
         *
         * > **NB:** UB if the `x` parameter is not an integer.
         *
         * @param x A byte to check.
         */
        export const idc = (x: number): x is Idc => {
            return ids(x) || decimal(x);
        };

        /**
         * Checks if a byte is a {@link Binary}.
         *
         * @param x A byte to check.
         */
        export const binary = (x: number): x is Binary => {
            return x === Binary.DECIMAL_0 || x === Binary.DECIMAL_1;
        };

        /**
         * Checks if a byte is an {@link Octal}.
         *
         * > **NB:** UB if the `x` parameter is not an integer.
         *
         * @param x A byte to check.
         */
        export const octal = (x: number): x is Octal => {
            return x >= Octal.DECIMAL_0 && x <= Octal.DECIMAL_7;
        };

        /**
         * Checks if a byte is a {@link Hexadecimal}.
         *
         * > **NB:** UB if the `x` parameter is not an integer.
         *
         * @param x A byte to check.
         */
        export const hexadecimal = (x: number): x is Hexadecimal => {
            return decimal(x) || ((x | 0x20) >= Hexadecimal.LOWERCASE_A && (x | 0x20) <= Hexadecimal.LOWERCASE_F);
        };

        /**
         * Checks if a byte is a {@link Separator}.
         *
         * @param x A byte to check.
         */
        export const separator = (x: number): x is Separator => {
            return x === Separator.COMMA || x === Separator.SEMICOLON;
        };

        /**
         * Checks if a byte is an {@link Operator}.
         *
         * @param x A byte to check.
         */
        export const operator = (x: number): x is Operator => {
            switch (x) {
                case Operator.EXCLAMATION:
                case Operator.HASH:
                case Operator.DOLLAR:
                case Operator.PERCENT:
                case Operator.AMPERSAND:
                case Operator.ASTERISK:
                case Operator.PLUS:
                case Operator.DOT:
                case Operator.SLASH:
                case Operator.COLON:
                case Operator.ANGLE_L:
                case Operator.EQUALS:
                case Operator.ANGLE_R:
                case Operator.QUESTION:
                case Operator.AT:
                case Operator.CARET:
                case Operator.PIPE:
                case Operator.TILDE:

                case Operator.HYPHEN: {
                    return true;
                }
                default: {
                    return false;
                }
            }
        };

        /**
         * Checks if a byte is a backslash.
         *
         * @param x A byte to check.
         */
        export const escape = (x: number): x is Escape => {
            return x === Escape.BACKSLASH;
        };

        /**
         * Checks if a byte is a {@link Quote}.
         *
         * @param x A byte to check.
         */
        export const quote = (x: number): x is Quote => {
            return x === Quote.DOUBLE_QUOTE || x === Quote.SINGLE_QUOTE;
        };

        /**
         * Checks if a byte is an {@link Extquote}.
         *
         * @param x A byte to check.
         */
        export const extquote = (x: number): x is Extquote => {
            return quote(x) || x === Extquote.BACKTICK;
        };

        /**
         * Checks if a byte is an {@link Opening}.
         *
         * @param x A byte to check.
         */
        export const opening = (x: number): x is Opening => {
            return x === Opening.PARENTHESIS_L || x === Opening.BRACKET_L || x === Opening.BRACE_L;
        };

        /**
         * Checks if a byte is an {@link Ending}.
         *
         * @param x A byte to check.
         */
        export const ending = (x: number): x is Ending => {
            return x === Ending.PARENTHESIS_R || x === Ending.BRACKET_R || x === Ending.BRACE_R;
        };

        /**
         * Checks if a byte is a {@link Pair}.
         *
         * @param x A byte to check.
         */
        export const pair = (x: number): x is Pair => {
            return opening(x) || ending(x);
        };

        /**
         * Checks if a byte is a {@link Sign}.
         *
         * > **NB:** UB if the `x` parameter is not an integer.
         *
         * @param x A byte to check.
         */
        export const sign = (x: number): x is Sign => {
            return x === Sign.HYPHEN || x === Sign.PLUS;
        };

        /**
         * Checks if bytes are valid pair. E.g., `(` and `)` bytes complement
         * each other, but `(` and `]` do not.
         *
         * @param x A byte to check the `y` against.
         * @param y A byte is possibly complement to the `x` byte.
         */
        export const complement = (x: Opening, y: Ending): boolean => {
            switch (x) {
                case Opening.PARENTHESIS_L:
                    return y === Ending.PARENTHESIS_R;
                case Opening.BRACKET_L:
                    return y === Ending.BRACKET_R;
                case Opening.BRACE_L:
                    return y === Ending.BRACE_R;
                default:
                    return false;
            }
        };
    }

    export namespace get {
        /**
         * Returns an {@link Ending} complement of the {@link Opening}
         * character.
         *
         * > **NB:** UB if the `x` parameter is not an {@link Opening}.
         *
         * @param x An opening character to get complement for.
         */
        export const complement = (x: Opening): Ending => {
            switch (x) {
                case Opening.PARENTHESIS_L:
                    return Ending.PARENTHESIS_R;
                case Opening.BRACKET_L:
                    return Ending.BRACKET_R;
                default:
                    return Ending.BRACE_R;
            }
        };
    }

    let t = '';

    for (let i = 0; i < 128; i++) {
        t += String.fromCharCode(i);
    }

    /**
     * ASCII code to string table.
     */
    export const table = t;

    /**
     * Converts an ASCII code to a string. Returns the empty string for numbers
     * other than valid ASCII.
     *
     * @param x An ASCII code to convert to a string.
     */
    export const decode = (x: number): string => {
        if (x < 0) return '';
        if (x > 127) return '';

        return table[x] ?? '';
    };

    export namespace parse {
        /**
         * Returns a digit value of a decimal/hexadecimal ASCII character.
         *
         * > **NB: **UB if the `x` parameter is not a {@link Hexadecimal}.
         *
         * @param x An ASCII character to parse as a digit.
         */
        export const digit = (x: Hexadecimal): number => {
            const y = x & 0xf; // Get four last bits.

            if (x > Hexadecimal.DECIMAL_9) {
                // The code is greater than the `9` code          => Return its masked value + `9`.
                return y + 9;
            } else {
                // The code is less than or equal to the `9` code => Just return its masked value.
                return y;
            }
        };
    }

    /**
     * Returns an ASCII code of the first character of a string. Returns `0`
     * for an empty string.
     *
     * > **NB:** UB if the first character is not an ASCII.
     *
     * @param x A string to get its first character’s code.
     */
    export const charcode = (x: string) => x.charCodeAt(0) || 0;
}
