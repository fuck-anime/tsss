import { Ascii } from './ascii';
import { Span } from './span';

/**
 * A lexical tree node.
 */
export type Lexical = Lexical.Node;

export namespace Lexical {
    /**
     * Either branch or leaf lexical node.
     */
    export type Node = Branch | Leaf;

    /**
     * Lexical tree branch node.
     */
    export type Branch = Root | Group | Quoted | Url | Comment | Quasi | Annotation | Identifier | Hash;

    /**
     * Lexical tree leaf node.
     */
    export type Leaf = Numeric | Separator | Operator | Blank | Cdx | Unexpected | Escape | Newline | Raw;

    /**
     * Lexical node type tags.
     */
    export const enum Type {
        /**
         * @see Root
         */
        Root,

        /**
         * @see Group
         */
        Group,

        /**
         * @see Quoted
         */
        Quoted,

        /**
         * @see Url
         */
        Url,

        /**
         * @see Comment
         */
        Comment,

        /**
         * @see Quasi
         */
        Quasi,

        /**
         * @see Annotation
         */
        Annotation,

        /**
         * @see Annotation
         */
        Identifier,

        /**
         * @see Hash
         */
        Hash,

        /**
         * @see Numeric
         */
        Numeric,

        /**
         * @see Separator
         */
        Separator,

        /**
         * @see Operator
         */
        Operator,

        /**
         * @see Blank
         */
        Blank,

        /**
         * @see Cdx
         */
        Cdx,

        /**
         * @see Unexpected
         */
        Unexpected,

        /**
         * @see Escape
         */
        Escape,

        /**
         * @see Newline
         */
        Newline,

        /**
         * @see Raw
         */
        Raw,
    }

    /**
     * Lexical node base class.
     */
    export abstract class Mixin {
        /**
         * Parent node reference.
         */
        parent: Node | null;

        /**
         * Previous sibling node reference.
         */
        prev: Node | null;

        /**
         * Next sibling node reference.
         */
        next: Node | null;

        /**
         * Source coordinates.
         */
        span: Span | null;

        /**
         * Node validity flag.
         */
        valid: boolean;

        protected constructor(init = {} as Mixin.Init) {
            this.parent = init.parent ?? null;
            this.prev = init.prev ?? null;
            this.next = init.next ?? null;
            this.span = init.span ?? null;
            this.valid = init.valid ?? true;
        }

        traverseDepth(this: Node, f: (node: Node, direction: TraverseDirection) => unknown) {
            const stack = [this] as Node[];

            const grey = new WeakSet<Node>();
            const black = new WeakSet<Node>();

            while (stack.length) {
                const top = stack[0]!;

                if (!grey.has(top)) {
                    // White:
                    grey.add(top);

                    if (f(top, TraverseDirection.Enter) !== skipChildren) {
                        switch (top.type) {
                            case Type.Root:
                            case Type.Group:
                            case Type.Quoted:
                            case Type.Url:
                            case Type.Comment:
                            case Type.Quasi:
                            case Type.Annotation:
                            case Type.Identifier:
                            case Type.Hash: {
                                for (let i = top.children.length - 1; i >= 0; i--) {
                                    stack.unshift(top.children[i]!);
                                }
                            }
                        }
                    }
                } else if (!black.has(top)) {
                    // Grey:
                    stack.shift();
                    black.add(top);
                    f(top, TraverseDirection.Exit);
                } else {
                    // Black:
                    stack.shift();
                }
            }
        }

        traverseBreadth(this: Node, f: (node: Node) => unknown) {
            const visited = new WeakSet<Node>();
            const queue = [this] as Node[];

            visited.add(this);

            while (queue.length) {
                const node = queue.shift()!;

                if (f(node) !== skipChildren) {
                    switch (node.type) {
                        case Type.Root:
                        case Type.Group:
                        case Type.Quoted:
                        case Type.Url:
                        case Type.Comment:
                        case Type.Quasi:
                        case Type.Annotation:
                        case Type.Identifier:
                        case Type.Hash: {
                            for (const child of node.children) {
                                queue.push(child);
                                visited.add(child);
                            }
                        }
                    }
                }
            }
        }
    }

    export namespace Mixin {
        /**
         * Lexical node base initializer.
         */
        export interface Init {
            /**
             * @default null
             * @see Mixin.parent
             */
            readonly parent?: Node | null;

            /**
             * @default null
             * @see Mixin.prev
             */
            readonly prev?: Node | null;

            /**
             * @default null
             * @see Mixin.next
             */
            readonly next?: Node | null;

            /**
             * @default null
             * @see Mixin.span
             */
            readonly span?: Span | null;

            /**
             * @default true
             * @see Mixin.valid
             */
            readonly valid?: boolean | null;
        }
    }

    export const enum TraverseDirection {
        Enter,
        Exit,
    }

    export const skipChildren = Symbol();

    // region Root
    /**
     * The document root.
     */
    export class Root extends Mixin {
        /**
         * A type tag.
         */
        readonly type = Type.Root;

        /**
         * Child nodes.
         */
        children: Node[];

        constructor(init = {} as Root.Init) {
            super(init);

            this.children = init.children ?? [];
        }
    }

    export namespace Root {
        /**
         * A root initializer.
         */
        export interface Init extends Mixin.Init {
            /**
             * @default []
             * @see Root.children
             */
            readonly children?: Node[] | null;
        }
    }
    // endregion

    // region Group
    /**
     * Anything within `()`, `[]`, `{}`.
     */
    export class Group extends Mixin {
        /**
         * A type tag.
         */
        readonly type = Type.Group;

        /**
         * Child nodes.
         */
        children: Node[];

        /**
         * Opening character.
         */
        opening: Ascii.Opening;

        /**
         * Ending character.
         */
        ending: Ascii.Ending;

        constructor(init = {} as Group.Init) {
            super(init);

            this.children = init.children ?? [];
            this.opening = init.opening ?? Ascii.Opening.PARENTHESIS_L;
            this.ending = init.ending ?? Ascii.get.complement(this.opening);
        }
    }

    export namespace Group {
        /**
         * A group initializer.
         */
        export interface Init extends Mixin.Init {
            /**
             * @default []
             * @see Group.children
             */
            readonly children?: Node[] | null;

            /**
             * @default Ascii.Opening.PARENTHESIS_L
             * @see Group.opening
             */
            readonly opening?: Ascii.Opening | null;

            /**
             * @default Ascii.get.complement(opening)
             * @see Group.ending
             */
            readonly ending?: Ascii.Ending | null;
        }
    }
    // endregion

    // region Quoted
    /**
     * An early form of a string literal.
     */
    export class Quoted extends Mixin {
        /**
         * A type tag.
         */
        readonly type = Type.Quoted;

        /**
         * Child nodes: raws, escapes, escaped newlines, quasis.
         */
        children: Node[];

        /**
         * Quote character.
         */
        quote: Ascii.Extquote;

        constructor(init = {} as Quoted.Init) {
            super(init);

            this.children = init.children ?? [];
            this.quote = init.quote ?? Ascii.Extquote.DOUBLE_QUOTE;
        }
    }

    export namespace Quoted {
        /**
         * A quoted initializer.
         */
        export interface Init extends Mixin.Init {
            /**
             * @default []
             * @see Quoted.children
             */
            readonly children?: Node[] | null;

            /**
             * @default Ascii.Extquote.DOUBLE_QUOTE
             * @see Quoted.quote
             */
            readonly quote?: Ascii.Extquote | null;
        }
    }
    // endregion

    // region URL
    /**
     * An early form of a URL literal.
     */
    export class Url extends Mixin {
        /**
         * A type tag.
         */
        readonly type = Type.Url;

        /**
         * Child nodes.
         */
        children: Node[];

        constructor(init = {} as Url.Init) {
            super(init);

            this.children = init.children ?? [];
        }
    }

    export namespace Url {
        /**
         * A URL initializer.
         */
        export interface Init extends Mixin.Init {
            /**
             * @default []
             * @see Url.children
             */
            readonly children?: Node[] | null;
        }
    }
    // endregion

    // region Comment
    /**
     * An early form of a comment node.
     */
    export class Comment extends Mixin {
        /**
         * A type tag.
         */
        readonly type = Type.Comment;

        /**
         * Child nodes: raws and quasis.
         */
        children: Node[];

        /**
         * Comment syntax type.
         */
        syntax: Comment.Syntax;

        constructor(init = {} as Comment.Init) {
            super(init);

            this.children = init.children ?? [];
            this.syntax = init.syntax ?? Comment.Syntax.Block;
        }
    }

    export namespace Comment {
        /**
         * Comment syntax type.
         */
        export const enum Syntax {
            /**
             * Block comment.
             */
            Block,

            /**
             * Line comment.
             */
            Line,
        }

        /**
         * A comment initializer.
         */
        export interface Init extends Mixin.Init {
            /**
             * @default []
             * @see Comment.children
             */
            readonly children?: Node[] | null;

            /**
             * @default Syntax.Block
             * @see Comment.syntax
             */
            readonly syntax?: Syntax | null;
        }
    }
    // endregion

    // region Quasi
    /**
     * An early form of an interpolation.
     */
    export class Quasi extends Mixin {
        /**
         * A type tag.
         */
        readonly type = Type.Quasi;

        /**
         * Child nodes: operators followed by a {@link Group}.
         */
        children: Node[];

        /**
         * Quasi syntax type.
         */
        syntax: Quasi.Syntax;

        constructor(init = {} as Quasi.Init) {
            super(init);

            this.children = init.children ?? [];
            this.syntax = init.syntax ?? '#{}';
        }
    }

    export namespace Quasi {
        /**
         * Quasi syntax type. The syntax type should be defined as a string
         * matching the following grammar:
         *
         * ```
         * Syntax   = Operator{0,2} Pair
         *
         * Operator = <ASCII operator character>
         * Pair     = '{}' | '[]' | '()'
         * ```
         */
        export type Syntax = `${Operator.Character | ''}${Operator.Character | ''}${'{}' | '[]' | '()'}`;

        /**
         * A quasi initializer.
         */
        export interface Init extends Mixin.Init {
            /**
             * @default []
             * @see Quasi.children
             */
            readonly children?: Node[] | null;

            /**
             * @default `#{}`
             * @see Quasi.syntax
             */
            readonly syntax?: Syntax | null;
        }
    }
    // endregion

    // region Annotation
    /**
     * An early form of an annotation. I.e., a Rust-like attribute.
     */
    export class Annotation extends Mixin {
        /**
         * A type tag.
         */
        readonly type = Type.Annotation;

        /**
         * Child nodes: operators followed by a {@link Group}.
         */
        children: Node[];

        /**
         * Annotation syntax type.
         */
        syntax: Annotation.Syntax;

        /**
         * Annotation placement type.
         */
        placement: Annotation.Placement;

        constructor(init = {} as Annotation.Init) {
            super(init);

            this.children = init.children ?? [];
            this.syntax = init.syntax ?? '#[]';
            this.placement = init.placement ?? Annotation.Placement.Outer;
        }
    }

    export namespace Annotation {
        /**
         * Annotation syntax type.
         *
         * @see Quasi.Syntax
         */
        export type Syntax = `${Operator.Character | ''}${Operator.Character | ''}${'{}' | '[]' | '()'}`;

        /**
         * Annotation placement type.
         */
        export const enum Placement {
            /**
             * Outer placement: `#[]` in Rust.
             */
            Outer,

            /**
             * Inner placement: `#![]` in Rust.
             */
            Inner,
        }

        export interface Init extends Mixin.Init {
            /**
             * @default []
             * @see Annotation.children
             */
            readonly children?: Node[] | null;

            /**
             * @default #[]
             * @see Annotation.syntax
             */
            readonly syntax?: Syntax | null;

            /**
             * @default Placement.Outer
             * @see Annotation.placement
             */
            readonly placement?: Placement | null;
        }
    }
    // endregion

    // region Identifier
    /**
     * An early form of an identifier.
     */
    export class Identifier extends Mixin {
        /**
         * A type tag.
         */
        readonly type = Type.Identifier;

        /**
         * Child nodes: raws and escapes.
         */
        children: Node[];

        /**
         * Identifier string value.
         */
        value: string;

        constructor(init = {} as Identifier.Init) {
            super(init);

            this.children = init.children ?? [];
            this.value = init.value ?? '';
        }
    }

    export namespace Identifier {
        /**
         * An identifier initializer.
         */
        export interface Init extends Mixin.Init {
            /**
             * @default []
             * @see Identifier.children
             */
            readonly children?: Node[] | null;

            /**
             * @default ''
             * @see Identifier.value
             */
            readonly value?: string | null;
        }
    }
    // endregion

    // region Hash
    /**
     * An early form of an id/color literal.
     */
    export class Hash extends Mixin {
        /**
         * A type tag.
         */
        readonly type = Type.Hash;

        /**
         * Child nodes: raws and escapes.
         */
        children: Node[];

        /**
         * Hash string value.
         */
        value: string;

        /**
         * Hash color value, an `0xrrggbbaa` integer.
         */
        color: number;

        /**
         * Hash id/color validity flags.
         */
        flags: Hash.Flags;

        constructor(init = {} as Hash.Init) {
            super(init);

            this.children = init.children ?? [];
            this.value = init.value ?? '';
            this.color = init.color ?? 0x00_00_00_ff;
            this.flags = init.flags ?? Hash.Flags.Neither;
        }
    }

    export namespace Hash {
        /**
         * A hash initializer.
         */
        export interface Init extends Mixin.Init {
            /**
             * @default []
             * @see Hash.children
             */
            readonly children?: Node[] | null;

            /**
             * @default ''
             * @see Hash.value
             */
            readonly value?: string | null;

            /**
             * @default 0x00_00_00_ff
             * @see Hash.color
             */
            readonly color?: number | null;

            /**
             * @default Flags.Neither
             * @see Hash.flags
             */
            readonly flags?: Flags | null;
        }

        /**
         * Hash id/color validity flags.
         */
        export const enum Flags {
            /**
             * Valid as neither id nor color.
             */
            Neither /* */ = 0b00,

            /**
             * Valid as id.
             */
            Id /*      */ = 0b01,

            /**
             * Va;id as color.
             */
            Color /*   */ = 0b10,

            /**
             * Both valid as id and color.
             */
            Both /*    */ = 0b11,
        }
    }
    // endregion

    // region Numeric
    /**
     * An early form of a number.
     */
    export class Numeric extends Mixin {
        /**
         * A type tag.
         */
        readonly type = Type.Numeric;

        /**
         * Numeric literal value.
         */
        value: number;

        constructor(init = {} as Numeric.Init) {
            super(init);

            this.value = init.value ?? 0;
        }
    }

    export namespace Numeric {
        /**
         * A numeric initializer.
         */
        export interface Init extends Mixin.Init {
            /**
             * @default 0
             * @see Numeric.value
             */
            readonly value?: number | null;
        }
    }
    // endregion

    // region Separator
    /**
     * Comma or semicolon.
     */
    export class Separator extends Mixin {
        /**
         * A type tag.
         */
        readonly type = Type.Separator;

        /**
         * Separator character.
         */
        separator: Ascii.Separator;

        constructor(init = {} as Separator.Init) {
            super(init);

            this.separator = init.separator ?? Ascii.Separator.COMMA;
        }
    }

    export namespace Separator {
        /**
         * A separator initializer.
         */
        export interface Init extends Mixin.Init {
            /**
             * @default Ascii.Separator.COMMA
             * @see Separator.separator
             */
            readonly separator?: Ascii.Separator | null;
        }
    }
    // endregion

    // region Operator
    /**
     * ASCII character except alphanumeric, control, separators, whitespace,
     * newlines, group delimiters, backslash.
     */
    export class Operator extends Mixin {
        /**
         * A type tag.
         */
        readonly type = Type.Operator;

        /**
         * An operator character.
         */
        operator: Ascii.Operator;

        constructor(init = {} as Operator.Init) {
            super(init);

            this.operator = init.operator ?? Ascii.Operator.EXCLAMATION;
        }
    }

    export namespace Operator {
        /**
         * An operator initializer.
         */
        export interface Init extends Mixin.Init {
            /**
             * @default Ascii.Operator.EXCLAMATION
             * @see Operator.operator
             */
            readonly operator?: Ascii.Operator | null;
        }

        /**
         * String form of an ASCII operator.
         */
        export const enum Character {
            EXCLAMATION /* */ = '!',
            HASH /*        */ = '#',
            DOLLAR /*      */ = '$',
            PERCENT /*     */ = '%',
            AMPERSAND /*   */ = '&',
            ASTERISK /*    */ = '*',
            PLUS /*        */ = '+',
            DOT /*         */ = '.',
            SLASH /*       */ = '/',
            COLON /*       */ = ':',
            ANGLE_L /*     */ = '<',
            EQUALS /*      */ = '=',
            ANGLE_R /*     */ = '>',
            QUESTION /*    */ = '?',
            AT /*          */ = '@',
            CARET /*       */ = '^',
            PIPE /*        */ = '|',
            TILDE /*       */ = '~',
            HYPHEN /*      */ = '-',
        }
    }
    // endregion

    // region Blank
    /**
     * A non-empty sequence of whitespace characters.
     */
    export class Blank extends Mixin {
        /**
         * A type tag.
         */
        readonly type = Type.Blank;

        /**
         * A string value of a whitespace sequence.
         */
        value: string;

        constructor(init = {} as Blank.Init) {
            super(init);

            this.value = init.value ?? '';
        }
    }

    export namespace Blank {
        /**
         * A whitespace initializer.
         */
        export interface Init extends Mixin.Init {
            /**
             * @default ''
             * @see Blank.value
             */
            readonly value?: string | null;
        }
    }
    // endregion

    // region CDX
    /**
     * HTML comment begin/end sequence.
     */
    export class Cdx extends Mixin {
        /**
         * A type tag.
         */
        readonly type = Type.Cdx;

        /**
         * CDX syntax type.
         */
        syntax: Cdx.Syntax;

        constructor(init = {} as Cdx.Init) {
            super(init);

            this.syntax = init.syntax ?? Cdx.Syntax.Cdo;
        }
    }

    export namespace Cdx {
        /**
         * CDX syntax type.
         */
        export const enum Syntax {
            /**
             * CDO: `<!--` token.
             */
            Cdo,

            /**
             * CDC: `-->` token.
             */
            Cdc,
        }

        /**
         * A CDX initializer.
         */
        export interface Init extends Mixin.Init {
            /**
             * @default Syntax.Cdo
             * @see Cdx.syntax
             */
            readonly syntax?: Syntax | null;
        }
    }
    // endregion

    // region Unexpected
    /**
     * Any unexpected characters — controls, dangling group delimiters, probably
     * something else.
     */
    export class Unexpected extends Mixin {
        /**
         * A type tag.
         */
        readonly type = Type.Unexpected;

        /**
         * String value of an unexpected sequence.
         */
        value: string;

        constructor(init = {} as Unexpected.Init) {
            super(init);

            this.value = init.value ?? '';
        }
    }

    export namespace Unexpected {
        /**
         * An unexpected initializer.
         */
        export interface Init extends Mixin.Init {
            /**
             * @default ''
             * @see Unexpected.value
             */
            readonly value?: string | null;
        }
    }
    // endregion

    // region Escape
    /**
     * An escape sequence.
     */
    export class Escape extends Mixin {
        /**
         * A type tag.
         */
        readonly type = Type.Escape;

        /**
         * Escape sequence codepoint.
         */
        codepoint: number;

        /**
         * Escape sequence string value.
         */
        value: string;

        constructor(init = {} as Escape.Init) {
            super(init);

            this.codepoint = init.codepoint ?? 0;
            this.value = init.value ?? String.fromCodePoint(this.codepoint);
        }
    }

    export namespace Escape {
        /**
         * An escape initializer.
         */
        export interface Init extends Mixin.Init {
            /**
             * @default 0
             * @see Escape.codepoint
             */
            readonly codepoint?: number | null;

            /**
             * @default String.fromCodePoint(codepoint)
             * @see Escape.value
             */
            readonly value?: string | null;
        }

        /**
         * Special escape sequence characters.
         */
        export const enum Special {
            /**
             * The `\0` sequence: null.
             */
            DECIMAL_0 /*   */ = Ascii.Decimal.DECIMAL_0,

            /**
             * The `\a` sequence: bell character.
             */
            LOWERCASE_A /* */ = Ascii.Lowercase.LOWERCASE_A,

            /**
             * The `\b` sequence: backspace.
             */
            LOWERCASE_B /* */ = Ascii.Lowercase.LOWERCASE_B,

            /**
             * The `\e` sequence: escape character.
             */
            LOWERCASE_E /* */ = Ascii.Lowercase.LOWERCASE_E,

            /**
             * The `\f` sequence: form feed.
             */
            LOWERCASE_F /* */ = Ascii.Lowercase.LOWERCASE_F,

            /**
             * The `\n` sequence: line feed.
             */
            LOWERCASE_N /* */ = Ascii.Lowercase.LOWERCASE_N,

            /**
             * The `\r` sequence: carriage return.
             */
            LOWERCASE_R /* */ = Ascii.Lowercase.LOWERCASE_R,

            /**
             * The `\t` sequence: horizontal tab.
             */
            LOWERCASE_T /* */ = Ascii.Lowercase.LOWERCASE_T,

            /**
             * The `\v` sequence: vertical tab.
             */
            LOWERCASE_V /* */ = Ascii.Lowercase.LOWERCASE_V,
        }

        export namespace is {
            /**
             * Checks if a byte is a {@link Special}.
             *
             * @param x A byte to check.
             */
            export const special = (x: number): x is Special => {
                switch (x) {
                    case Ascii.Decimal.DECIMAL_0:
                    case Ascii.Lowercase.LOWERCASE_A:
                    case Ascii.Lowercase.LOWERCASE_B:
                    case Ascii.Lowercase.LOWERCASE_E:
                    case Ascii.Lowercase.LOWERCASE_F:
                    case Ascii.Lowercase.LOWERCASE_N:
                    case Ascii.Lowercase.LOWERCASE_R:
                    case Ascii.Lowercase.LOWERCASE_T:
                    case Ascii.Lowercase.LOWERCASE_V:
                        return true;
                    default:
                        return false;
                }
            };
        }

        export namespace get {
            /**
             * Returns a codepoint escaped by a special escape.
             *
             * @param x A special escape character.
             */
            export const escaped = (x: Special): number => {
                switch (x) {
                    case Special.LOWERCASE_A:
                        return Ascii.Code.BELL;
                    case Special.LOWERCASE_B:
                        return Ascii.Code.BACKSPACE;
                    case Special.LOWERCASE_E:
                        return Ascii.Code.ESCAPE;
                    case Special.LOWERCASE_F:
                        return Ascii.Code.FORM_FEED;
                    case Special.LOWERCASE_N:
                        return Ascii.Code.LINE_FEED;
                    case Special.LOWERCASE_R:
                        return Ascii.Code.CARRIAGE_RETURN;
                    case Special.LOWERCASE_T:
                        return Ascii.Code.HORIZONTAL_TAB;
                    case Special.LOWERCASE_V:
                        return Ascii.Code.VERTICAL_TAB;
                    default:
                        return Ascii.Code.NULL;
                }
            };
        }
    }
    // endregion

    // region Newline
    /**
     * An escaped newline.
     */
    export class Newline extends Mixin {
        /**
         * A type tag.
         */
        readonly type = Type.Newline;

        constructor(init = {} as Newline.Init) {
            super(init);
        }
    }

    export namespace Newline {
        /**
         * A newline initializer.
         */
        export interface Init extends Mixin.Init {}
    }
    // endregion

    // region Raw
    /**
     * Raw segment of identifier, hash, quoted, url, comment, etc.
     */
    export class Raw extends Mixin {
        /**
         * A type tag.
         */
        readonly type = Type.Raw;

        /**
         * Raw value.
         */
        value: string;

        constructor(init = {} as Raw.Init) {
            super(init);

            this.value = init.value ?? '';
        }
    }

    export namespace Raw {
        /**
         * A raw initializer.
         */
        export interface Init extends Mixin.Init {
            /**
             * @default ''
             * @see Raw.value
             */
            readonly value?: string | null;
        }
    }
    // endregion
}
