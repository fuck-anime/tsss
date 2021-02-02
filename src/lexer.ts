import { Ascii } from './ascii';
import { ReadonlyRecord } from './core';
import { Lexical } from './lexical';
import { Span } from './span';
import { Utf8 } from './utf8';
import C = Ascii.Code;
import Q = Ascii.Extquote;
import I = Ascii.Ids;

import is = Ascii.is;
import O = Ascii.Opening;
import parse = Ascii.parse;
import S = Ascii.Sign;
import table = Ascii.table;

import T = Lexical.Type;

export class Lexer {
    // region Options
    protected readonly extnumbers: boolean;
    protected readonly extescapes: boolean;
    protected readonly stdescapes: boolean;
    protected readonly extstrings: boolean;
    protected readonly extcomments: boolean;
    protected readonly stdurls: boolean;
    protected readonly stdcdx: boolean;
    protected readonly quasidefs: ReadonlyRecord<Lexer.Context.Type, readonly Lexer.QuasiDefinition[]>;
    protected readonly annotationdefs: readonly Lexer.AnnotationDefinition[];
    // endregion

    // region State
    /**
     * An optional filename.
     */
    protected filename: string | null = null!;

    /**
     * A slice of the source buffer.
     */
    protected input: Uint8Array = null!;

    /**
     * Maximum input offset + 1.
     */
    protected length: number = null!;

    /**
     * Maximum input offset.
     */
    protected maximum: number = null!;

    /**
     * The stack.
     */
    protected stack: Lexer.Frame[] = null!;

    /**
     * Current source coordinates.
     */
    protected stop: Span.Stop = null!;

    /**
     * An offset of the {@link input} slice relative to the
     * {@link Lexer.Input.input}.
     */
    protected offset: number = null!;

    /**
     * Current offset.
     */
    protected cursor: number = null!;

    /**
     * Current stackframe.
     */
    protected frame: Lexer.Frame = null!;
    // endregion

    constructor(options = {} as Lexer.Options) {
        this.extnumbers = options['extended-numbers'] ?? false;
        this.extescapes = options['extended-escapes'] ?? false;
        this.stdescapes = options['standard-escapes'] ?? true;
        this.extstrings = options['extended-strings'] ?? false;
        this.extcomments = options['extended-comments'] ?? false;
        this.stdurls = options['standard-urls'] ?? true;
        this.stdcdx = options['standard-cdx'] ?? true;

        this.quasidefs = {
            [Lexer.Context.Type.Root]: [],
            [Lexer.Context.Type.Parentheses]: [],
            [Lexer.Context.Type.Brackets]: [],
            [Lexer.Context.Type.Braces]: [],
            [Lexer.Context.Type.Double]: [],
            [Lexer.Context.Type.Single]: [],
            [Lexer.Context.Type.Backtick]: [],
            [Lexer.Context.Type.Url]: [],
            [Lexer.Context.Type.Block]: [],
            [Lexer.Context.Type.Line]: [],
            [Lexer.Context.Type.Quasi]: [],
            [Lexer.Context.Type.Annotation]: [],
            [Lexer.Context.Type.Identifier]: [],
            [Lexer.Context.Type.Hash]: [],
        } as any;

        // Traverse high-level definitions.
        for (const definition of options['quasi-definitions'] ?? []) {
            const contexts = definition.contexts ?? 0; // High-level contexts definition.
            const syntaxes = definition.syntaxes ?? []; // High-level syntax definition.

            // Traverse all supported subtypes.
            for (const type of Lexer.Context.TYPES) {
                if (contexts & type) {
                    const definitions = this.quasidefs[type]; // An array of low-level definitions for current context type.

                    // Iterate high-level syntax definitions.
                    for (const syntax of syntaxes) {
                        if (definitions.some(x => x.syntax === syntax)) continue; // Short-circuit if the same syntax already exists.

                        (definitions as Lexer.QuasiDefinition[]).push({
                            syntax,
                            pattern: Array.from(syntax.slice(0, -1)).map(x => x.charCodeAt(0)),
                        });
                    }
                }
            }
        }

        this.annotationdefs = [];

        for (const definition of options['annotation-definitions'] ?? []) {
            const placement = definition.placement ?? Lexical.Annotation.Placement.Outer;
            const syntax = definition.syntax;

            if (!syntax || this.annotationdefs.some(x => x.syntax === syntax && x.placement === placement)) continue;

            (this.annotationdefs as Lexer.AnnotationDefinition[]).push({
                syntax,
                placement,
                pattern: Array.from(syntax.slice(0, -1)).map(x => x.charCodeAt(0)),
            });
        }
    }

    // region Internal API
    /**
     * Initializes an internal state before tokenization.
     *
     * @param input An input structure.
     */
    protected setup(input = {} as Lexer.Input) {
        const source = input.input ?? new Uint8Array();

        this.filename = input.filename ?? null;
        this.input = source.slice(input.begin?.absolute?.byte ?? 0, input.end?.absolute?.byte);
        this.length = this.input.length;
        this.maximum = this.input.length - 1;
        this.stack = [];
        this.stop = input.begin ?? Span.Stop.empty();
        this.offset = this.stop.absolute.byte;
        this.cursor = 0;
        this.frame = Lexer.Frame.infer(this.stop, this.filename, input.parent);
    }

    /**
     * Cleans an internal state after tokenization.
     */
    protected teardown() {
        this.filename = null!;
        this.input = null!;
        this.length = null!;
        this.maximum = null!;
        this.stack = null!;
        this.stop = null!;
        this.offset = null!;
        this.cursor = null!;
        this.frame = null!;
    }

    /**
     * An utility method to transition from a node currently in a
     * {@link Lexer.Frame.focus `focus`} to a new one.
     *
     * @param node A node to place into a focus.
     */
    protected advance(node: Lexical | null) {
        this.postprocessFocused();
        this.finishFocused();

        this.linkTransition(node);

        this.preprocessFocus(node);
        this.pushFocus(node);
    }

    /**
     * Special postprocessing hooks.
     *
     * > Certain nodes remain in a focus for unknown time, and transition from
     * > it at nearly unknown conditions. To postprocess these nodes we’ll call
     * > special conditional hooks here.
     */
    protected postprocessFocused() {
        // Decode unexpected token value:
        if (this.frame.focus?.type === T.Unexpected) {
            this.frame.focus.value = this.decode();
        }

        const MASK = Lexer.Context.Mask.Quoted | Lexer.Context.Mask.Comment | Lexer.Context.Type.Url;

        // Decode string/url/comment raw value:
        if (this.frame.focus?.type === T.Raw && this.frame.context & MASK) {
            this.frame.focus.value = this.decode();
        }
    }

    /**
     * Updates the {@link Span.end `end`} coordinates of a node currently in a
     * {@link Lexer.Frame.focus `focus`}.
     */
    protected finishFocused() {
        if (this.frame.focus) {
            this.frame.focus.span!.end = Span.Stop.clone(this.stop);
        }
    }

    /**
     * Links everything:
     *
     * -   Pushes a node currently in a {@link Lexer.Frame.focus `focus`} to the
     *     current {@link Lexer.Frame.parent `parent`}’s `children` list.
     * -   Updates the {@link Lexical.Mixin.next `next`} reference of a node
     *     currently in a focus.
     * -   Updates the {@link Lexical.Mixin.parent `parent`} and
     *     {@link Lexical.Mixin.prev `prev`} references of a node to focus.
     *
     * @param node A node to focus.
     */
    protected linkTransition(node: Lexical | null) {
        if (this.frame.focus) {
            this.frame.parent.children.push(this.frame.focus);
            this.frame.focus.next = node;
        }

        if (node) {
            node.parent = this.frame.parent;
            node.prev = this.frame.focus;
        }
    }

    /**
     * Updates the {@link Span.begin `begin`} coordinates of a node to be placed
     * into a {@link Lexer.Frame.focus `focus`}.
     *
     * @param node A node to be placed into a focus.
     */
    protected preprocessFocus(node: Lexical | null) {
        if (node && !node.span) {
            node.span = new Span({
                filename: this.filename,
                begin: Span.Stop.clone(this.stop),
            });
        }
    }

    /**
     * Pushes new node into a {@link Lexer.Frame.focus `focus`}.
     *
     * @param node A node to place into a focus.
     */
    protected pushFocus(node: Lexical | null) {
        this.frame.focus = node;
    }

    /**
     * Marks a number of bytes as consumed. Updates internal offsets.
     *
     * @param n A number of bytes to consume.
     */
    protected consume(n: number) {
        const { cursor, stop, input } = this;
        const { absolute, relative } = stop;

        const end = cursor + n;

        for (let i = cursor; i < end; i++) {
            const a = input[i]!; // Get the current byte.

            // Check if the byte isn’t a UTF-8 continuation byte:
            const cpStart = (a & 0b11_000000) !== 0b10_000000;

            // Check if the byte is a newline:
            const lnStart = is.newline(a);

            // If the byte is a codepoint start, increase the absolute codepoint offset:
            if (cpStart) absolute.codepoint++;

            if (lnStart) {
                // If the byte is a line start:

                stop.line++; //                 Increase the line number.
                relative.byte = 0; //      Reset the relative byte offset.
                relative.codepoint = 0; // Reset the relative codepoint offset.
            } else {
                // If the byte isn’t a newline, increase the relative byte offset:
                relative.byte++;

                // If the byte is a codepoint start, increase the relative codepoint offset:
                if (cpStart) relative.codepoint++;
            }
        }

        absolute.byte += n;
        this.cursor += n;
    }

    /**
     * Returns the `n`th next byte of the input, or `-1` if out of bounds.
     *
     * @param n A byte offset relative to the {@link `cursor`}.
     */
    protected lookahead(n: number): number {
        return this.input[this.cursor + n] ?? -1;
    }

    /**
     * Checks if an input slice at the given offset equals the byte array.
     *
     * @param pattern The byte array to match.
     * @param n A byte offset relative to the {@link cursor `cursor`}.
     */
    protected match(pattern: ArrayLike<number>, n: number): boolean {
        const offset = this.cursor + n;

        // Get a slice of the input array at the given offset and of the requested length:
        const slice = this.input.slice(offset, offset + pattern.length);

        // SC if the slice is shorter than the pattern:
        if (slice.length !== pattern.length) return false;

        for (let i = 0; i < slice.length; i++) {
            if (pattern[i] !== slice[i]) return false; // Compare byte-by-byte.
        }

        return true;
    }

    /**
     * Pushes {@link frame the current stackframe} onto the
     * {@link stack `stack`}, then creates a new one.
     *
     * @param parent A branch node to set as new stackframe’s
     * {@link Lexer.Frame.parent `parent`}.
     */
    protected push(parent: Lexical.Branch) {
        this.postprocessFocused();
        this.finishFocused();

        this.linkTransition(parent);
        this.preprocessFocus(parent);

        this.stack.push(this.frame); // Put current frame onto the stack.

        // Replace current frame:
        this.frame = {
            // Infer a context type:
            context: Lexer.Context.infer.context(parent),

            parent,
            focus: null,

            // Initialize hash-related fields:
            colorValidity: Lexer.Frame.ColorValidity.Indeterminate,
            colorRgba: 0,
            colorLength: 0,
        };
    }

    /**
     * Flushes the {@link Lexer.Frame.focus `focus`}, pops the stackframe, then
     * places its {@link Lexer.Frame.parent result node} into a focus.
     */
    protected pop() {
        const { parent } = this.frame;

        this.advance(null); //       Flush the last pending production.
        this.frame = this.stack.pop()!; // Revert the stack frame.
        this.pushFocus(parent); //   Focus the production.
    }

    /**
     * An utility method to decode a string from the
     * {@link Lexer.Frame.focus `focus`} begin to the
     * {@link cursor current offset}.
     */
    protected decode(): string {
        const focus = this.frame.focus;

        if (!focus) return '';

        return Utf8.decode(this.input.slice(focus.span!.begin.absolute.byte - this.offset, this.cursor));
    }

    /**
     * Pushes a color literal character into the hash-related internal state of
     * the current stackframe.
     *
     * @param character A character to push.
     */
    protected pushColorByte(character: number) {
        const frame = this.frame;

        if (frame.colorValidity !== Lexer.Frame.ColorValidity.Invalid) {
            if (is.hexadecimal(character)) {
                // If the hash token isn’t already invalid as a color literal, and the character is a hexadecimal digit:
                frame.colorRgba <<= 4;
                frame.colorRgba |= parse.digit(character);
                frame.colorLength++;
            } else {
                // If the hash token is already invalid as a color literal, or the character isn’t a hexadecimal digit:
                frame.colorValidity = Lexer.Frame.ColorValidity.Invalid;
                frame.colorRgba = 0;
                frame.colorLength = 0;
            }
        }
    }
    // endregion

    // region Readers
    // region Root readers
    /**
     * Calls readers depending on context.
     */
    protected readNode(): boolean {
        const context = this.frame.context;

        if (context & Lexer.Context.Mask.Group) {
            return (
                this.readBlank() ||
                this.readNumeric() || //                                        Before identifiers, operators, quasi and annotations.
                this.readUrlOpening() || //                                     Before identifiers.
                this.readCommentOpening() || //                                 Before operators, quasi, and annotations.
                this.readCdx() || //                                            Before quasi, annotations, identifiers, and operators.
                this.readQuasiOpening() || //                                   Before operators, identifiers, hashes and annotations.
                this.readAnnotationOpening() || //                              Before operators, identifiers, and hashes.
                this.readIdentifierOpening() || //                              Before operators.
                this.readHashOpening() || //                                    Before operators.
                this.readQuotedOpening() ||
                this.readSeparator() ||
                this.readOperator() ||
                this.readGroupOpening() ||
                this.readGroupEnding() ||
                this.readEscapeNewline() ||
                this.readUnexpected()
            );
        } else if (context & Lexer.Context.Mask.Quoted) {
            return (
                this.readEscapeRegular() || //                                  Before raws.
                this.readEscapeNewline() || //                                  Before raws.
                this.readQuasiOpening() || //                                   Before raws.
                this.readQuotedEnding() || //                                   Before raws.
                this.readLiteralRaw() ||
                this.readUnexpected()
            );
        } else if (context === Lexer.Context.Type.Url) {
            return (
                this.readEscapeRegular() || //                                  Before raws.
                this.readEscapeNewline() || //                                  Before raws.
                this.readBlank() || //                                          Before raws.
                this.readUrlComment() || //                                     Before raws.
                this.readQuotedOpening() || //                                  Before raws.
                this.readQuasiOpening() || //                                   Before raws.
                this.readUrlEnding() || //                                      Before raws.
                this.readLiteralRaw() ||
                this.readUnexpected()
            );
        } else if (context === Lexer.Context.Type.Block) {
            return (
                this.readCommentBlockOpening() || //                            Before raws and quasi.
                this.readCommentBlockEnding() || //                             Before raws and quasi.
                this.readQuasiOpening() || //                                   Before raws.
                this.readLiteralRaw() ||
                this.readUnexpected()
            );
        } else if (context === Lexer.Context.Type.Line) {
            return (
                this.readQuasiOpening() || //                                   Before raws.
                this.readCommentLineEnding() || //                              Before raws.
                this.readLiteralRaw() ||
                this.readUnexpected()
            );
        } else if (context === Lexer.Context.Type.Quasi) {
            return (
                this.readQuasiEnding() || //                                    Before operators, groups.
                this.readOperator() ||
                this.readGroupOpening() ||
                this.readUnexpected()
            );
        } else if (context === Lexer.Context.Type.Annotation) {
            return (
                this.readAnnotationEnding() || //                               Before operators, groups.
                this.readOperator() ||
                this.readGroupOpening() ||
                this.readUnexpected()
            );
        } else if (context === Lexer.Context.Type.Identifier) {
            return (
                this.readEscapeRegular() || //                                  Before raws and endings.
                this.readNameRaw() || //                                        Before endings.
                this.readIdentifierEnding() ||
                this.readUnexpected()
            );
        } else if (context === Lexer.Context.Type.Hash) {
            return (
                this.readEscapeRegular() || //                                  Before raws and endings.
                this.readNameRaw() || //                                        Before endings.
                this.readHashEnding() ||
                this.readUnexpected()
            );
        } else {
            return false;
        }
    }

    /**
     * Tokenizes input. Excepts the internal state to be initialized.
     */
    protected parseInput(): Lexical.Branch {
        while (this.cursor < this.length) {
            this.readNode();
        }

        this.handleEof();

        this.advance(null);

        const { parent } = this.frame;

        parent.span!.end = Span.Stop.clone(this.stop);

        this.teardown();

        return parent;
    }

    /**
     * A special method to pop everything from the stack.
     */
    protected handleEof() {
        while (this.stack.length) {
            const context = this.frame.context;

            if (context === Lexer.Context.Type.Hash) {
                this.closeHash();
            } else if (context & (Lexer.Context.Type.Root | Lexer.Context.Type.Line | Lexer.Context.Type.Identifier)) {
                this.pop();
            } else {
                // TODO: Emit error.
                this.frame.parent.valid = false;
                this.pop();
            }
        }
    }
    // endregion

    // region Group readers
    /**
     * Read group opening: `/[([{]/`.
     */
    protected readGroupOpening(): boolean {
        const a = this.lookahead(0);

        if (!is.opening(a)) return false;

        const group = new Lexical.Group({
            opening: a,
        });

        this.push(group);

        this.consume(1);

        return true;
    }

    /**
     * Read group ending: `/[)\]}]/`.
     */
    protected readGroupEnding(): boolean {
        const a = this.lookahead(0);

        if (!is.ending(a)) return false;

        if ((this.frame.parent as Lexical.Group).ending !== a) {
            // TODO:
            //     Emit error.
            //     And apply extended recovery.
            //     Cases:
            //         { a ) b }     => { a ) b }         => Ignored.   No parent frame matching the `)`.
            //         { a ( b }     => { a ( b ) }       => Recovered. The `a` frame matches the `}`.
            //                                                              -> Close the `b` frame without consuming the `}`.
            //         { a ( b [ c } => { a ( b [ c ] ) } => Recovered. The `a` frame matches the `}`.
            //                                                              -> Close the `c` frame without consuming the `}`.
            //                                                              -> The `b` frame will be closed on the next iteration.
            //     Oh, what about `( a ' b #{ c ) b } ' )`?
            //     The recovery should stop at any non-group context.

            return false;
        }

        this.pop();
        this.consume(1);

        return true;
    }
    // endregion

    // region Quoted readers
    /**
     * Read quoted literal opening: ``/["'`]/``.
     */
    protected readQuotedOpening(): boolean {
        const a = this.lookahead(0);

        if (!is.extquote(a) || (!this.extstrings && a === Q.BACKTICK)) return false;

        const quoted = new Lexical.Quoted({
            quote: a,
        });

        this.push(quoted);

        this.consume(1);

        return true;
    }

    /**
     * Read quoted literal ending: ``/["'`\r\n\f]/``.
     */
    protected readQuotedEnding(): boolean {
        const a = this.lookahead(0);

        let mismatch = true;
        let valid = true;

        if (a === (this.frame.parent as Lexical.Quoted).quote) {
            mismatch = false;
        } else if (!this.extstrings && is.newline(a)) {
            // TODO: Emit error.

            mismatch = false;
            valid = false;
        }

        if (mismatch) return false;

        this.frame.parent.valid = valid;

        this.pop();
        this.consume(1);

        return true;
    }
    // endregion

    // region URL readers
    /**
     * Read URL opening: `/url\(/i`
     */
    protected readUrlOpening(): boolean {
        const a = this.lookahead(0);
        const b = this.lookahead(1);
        const c = this.lookahead(2);
        const d = this.lookahead(3);

        if (!this.stdurls) return false;
        if ((a | 0x20) !== C.LOWERCASE_U) return false;
        if ((b | 0x20) !== C.LOWERCASE_R) return false;
        if ((c | 0x20) !== C.LOWERCASE_L) return false;
        if (d !== C.PARENTHESIS_L) return false;

        const url = new Lexical.Url();

        this.push(url);

        this.consume(4);

        return true;
    }

    /**
     * Read URL ending: `/\)/`.
     */
    protected readUrlEnding(): boolean {
        const a = this.lookahead(0);

        if (a !== C.PARENTHESIS_R) return false;

        this.pop();
        this.consume(1);

        return true;
    }

    /**
     * Read comment opening only if it’s followed by a whitespace.
     */
    protected readUrlComment(): boolean {
        let mismatch = true;

        const a = this.lookahead(0);
        const b = this.lookahead(1);
        const c = this.lookahead(2);

        if (a === C.SLASH && b === C.ASTERISK) {
            mismatch = false;
        } else if (this.extcomments && a === C.SLASH && b === C.SLASH) {
            mismatch = false;
        }

        if (mismatch || !is.blank(c)) return false;

        return this.readCommentOpening();
    }
    // endregion

    // region Comment readers
    /**
     * Read block comment opening: `/\/\*‍/`.
     */
    protected readCommentBlockOpening(): boolean {
        const a = this.lookahead(0);
        const b = this.lookahead(1);

        const context = this.frame.context;

        if (a !== C.SLASH || b !== C.ASTERISK) return false; //                         Signature mismatch.
        if (!this.extcomments && context === Lexer.Context.Type.Block) return false; // Nested comments disabled.

        const comment = new Lexical.Comment({
            syntax: Lexical.Comment.Syntax.Block,
        });

        this.push(comment);

        this.consume(2);

        return true;
    }

    /**
     * Read line comment begin: `/\/{2}/`.
     */
    protected readCommentLineOpening(): boolean {
        const a = this.lookahead(0);
        const b = this.lookahead(1);

        if (!this.extcomments) return false;
        if (a !== C.SLASH || b !== C.SLASH) return false;

        const comment = new Lexical.Comment({
            syntax: Lexical.Comment.Syntax.Line,
        });

        this.push(comment);

        this.consume(2);

        return true;
    }

    /**
     * Read block comment ending: `/\*\//`.
     */
    protected readCommentBlockEnding(): boolean {
        const a = this.lookahead(0);
        const b = this.lookahead(1);

        if (a !== C.ASTERISK || b !== C.SLASH) return false;

        this.pop();
        this.consume(2);

        return true;
    }

    /**
     * Read line comment ending: /[\r\n\f]/.
     */
    protected readCommentLineEnding(): boolean {
        const a = this.lookahead(0);

        if (!is.newline(a)) return false;

        this.pop();
        this.consume(1);

        return true;
    }

    protected readCommentOpening(): boolean {
        return this.readCommentBlockOpening() || this.readCommentLineOpening();
    }
    // endregion

    // region Quasi readers
    /**
     * Read quasi opening: *the syntax depends on options*.
     */
    protected readQuasiOpening(): boolean {
        let syntax = null as Lexical.Quasi.Syntax | null;

        for (const definition of this.quasidefs[this.frame.context]) {
            if (this.match(definition.pattern, 0)) {
                syntax = definition.syntax;
                break;
            }
        }

        if (!syntax) return false;

        const quasi = new Lexical.Quasi({
            syntax,
        });

        this.push(quasi);

        return true;
    }

    /**
     * Read quasi ending: *actually doesn’t match nor consume anything*.
     */
    protected readQuasiEnding(): boolean {
        if (this.frame.focus?.type !== T.Group) return false;

        this.pop();

        return true;
    }
    // endregion

    // region Annotation readers
    /**
     * Read annotation opening: *the syntax depends on options*.
     */
    protected readAnnotationOpening(): boolean {
        let syntax = null as Lexical.Annotation.Syntax | null;
        let placement = null as Lexical.Annotation.Placement | null;

        for (const definition of this.annotationdefs) {
            if (this.match(definition.pattern, 0)) {
                syntax = definition.syntax;
                placement = definition.placement;
                break;
            }
        }

        if (syntax == null || placement == null) return false;

        const annotation = new Lexical.Annotation({
            syntax,
            placement,
        });

        this.push(annotation);

        return true;
    }

    /**
     * Read annotation ending: *actually doesn’t match nor consume anything*
     */
    protected readAnnotationEnding(): boolean {
        if (this.frame.focus?.type !== T.Group) return false;

        this.pop();

        return true;
    }
    // endregion

    // region Identifier readers
    /**
     * Read identifier opening. Actually, doesn’t consume anything — just
     * matches the identifier opening signature, and then switches the frame.
     * Identifiers should start with either the `/\p{IDS}/` character, or a
     * backslash followed by neither newline nor EOF, where `/\p{IDS}/` is
     * `/[a-z_-]/i` or non-ASCII.
     */
    protected readIdentifierOpening(): boolean {
        const a = this.lookahead(0);
        const b = this.lookahead(1);
        const c = this.lookahead(2);

        let mismatch = true;

        if (is.ids(a)) {
            // ^\p{IDS}
            if (a === I.HYPHEN) {
                // ^-
                if (is.idc(b)) {
                    // ^-\p{IDC}
                    mismatch = false;
                } else if (b === C.BACKSLASH && !is.newline(c) && c !== -1) {
                    // Hyphen, then backslash followed by anything except NL/EOF.
                    // ^-\\(?!=\r|\n|\f|$)
                    mismatch = false;
                }
            } else {
                mismatch = false;
            }
        } else if (a === C.BACKSLASH && !is.newline(b) && b !== -1) {
            // Backslash followed by anything except NL/EOF.
            // ^\\(?!=\r|\n|\f|$)
            mismatch = false;
        }

        if (mismatch) return false;

        const identifier = new Lexical.Identifier();

        this.push(identifier);

        return true;
    }

    /**
     * Actually doesn’t consume anything — just switches the stackframe.
     */
    protected readIdentifierEnding(): boolean {
        this.pop();

        return true;
    }
    // endregion

    // region Hash readers
    /**
     * Read hash opening, then switch the stackframe. Hash should start with the
     * `/#(\p{IDC}|\\[^\p{NL}\p{EOF}])/` sequence, where `/\p{IDC}/` is
     * `/[0-9a-z_-]/i` or non-ASCII, `/\p{NL}/` is `/[\r\n\f]/`, `\p{EOF}`
     * is the end of file.
     */
    protected readHashOpening(): boolean {
        const a = this.lookahead(0);
        const b = this.lookahead(1);
        const c = this.lookahead(2);

        if (a !== C.HASH) return false;

        let mismatch = true;
        let flags = Lexical.Hash.Flags.Neither;
        let colorValidity = Lexer.Frame.ColorValidity.Indeterminate;

        if (is.ids(b)) {
            // IDS character:
            // ^\p{IDS}
            mismatch = false;
            flags |= Lexical.Hash.Flags.Id;
        } else if (is.idc(b)) {
            // IDC character:
            // ^\p{IDC}
            mismatch = false;
        } else if (b === C.BACKSLASH && !is.newline(c) && c !== -1) {
            // Escape:
            // ^\\[^\p{NL}\p{EOF}]
            mismatch = false;
            flags |= Lexical.Hash.Flags.Id;
        }

        if (is.idc(b) && !is.hexadecimal(b)) {
            colorValidity = Lexer.Frame.ColorValidity.Invalid;
        }

        if (mismatch) return false;

        const hash = new Lexical.Hash({ flags });

        this.push(hash);

        this.frame.colorValidity = colorValidity;

        this.consume(1);

        return true;
    }

    /**
     * Actually does not consume anything — just triggered when neither IDC nor
     * escape was read, and switches the stackframe.
     */
    protected readHashEnding(): boolean {
        this.closeHash();

        return true;
    }

    /**
     * Validate and parse a color value of a hash currently in a focus.
     */
    protected closeHash() {
        const frame = this.frame;
        const hash = frame.parent as Lexical.Hash;
        const length = frame.colorLength;

        if (length === 3 || length === 4 || length === 6 || length === 8) {
            hash.flags |= Lexical.Hash.Flags.Color;

            let rgba = frame.colorRgba;

            if (length === 3) {
                rgba = (rgba << 0x04) | 0x000f; //     Shift by 4 bits, and add the default short alpha.
            } else if (length === 6) {
                rgba = (rgba << 0x08) | 0x000000ff; // Shift by 8 bits, and add the default long alpha.
            }

            if (length < 6) {
                // Parse short format:
                rgba = //                          0000_rgba   -> 0r_0g_0b_0a
                    ((rgba & 0xf000) << 0x0c) | // 0000_r000   -> 0r_00_00_00
                    ((rgba & 0x0f00) << 0x08) | // 0000_0g00   -> 00_0g_00_00
                    ((rgba & 0x00f0) << 0x04) | // 0000_00b0   -> 00_00_0b_00
                    ((rgba & 0x000f) << 0x00); //  0000_000a   -> 00_00_00_0a

                rgba >>>= 0;

                rgba |= rgba << 0x04; //           0r_0g_0b_0a -> rr_gg_bb_aa
            }

            hash.color = rgba >>> 0;
        }

        hash.valid = hash.flags !== Lexical.Hash.Flags.Neither;

        this.pop();
    }
    // endregion

    // region Numeric readers
    /**
     * Read a binary/octal/hexadecimal integer:
     *
     * -   `/[+-]?0b[01]+(_[01]+)*_{0,2}/i`,
     * -   `/[+-]?0o[0-7]+(_[0-7]+)*_{0,2}/i`,
     * -   `/[+-]?0x[0-9a-f]+(_[0-9a-f]+)*_{0,2}/i`.
     */
    protected readNumericExtended(width: 1 | 3 | 4, letter: C, f: (x: number) => boolean): boolean {
        if (!this.extnumbers) return false;

        let mismatch = true;
        let consume = 0;

        let intnegative = false;

        const a = this.lookahead(0);
        const b = this.lookahead(1);
        const c = this.lookahead(2);
        const d = this.lookahead(3);

        if (a === C.DECIMAL_0 && (b | 0x20) === letter && f(c)) {
            // ^0b(?=\d)
            mismatch = false;
            consume = 2;
        } else if (is.sign(a) && b === C.DECIMAL_0 && (c | 0x20) === letter && f(d)) {
            // ^[+-]0b(?=\d)
            mismatch = false;
            intnegative = a === S.HYPHEN;
            consume = 3;
        }

        if (mismatch) return false;

        const numeric = new Lexical.Numeric();

        this.advance(numeric);
        this.consume(consume);

        let integer = 0;

        while (this.cursor < this.length) {
            const a = this.lookahead(0);
            const b = this.lookahead(1);

            if (f(a)) {
                // Digit:
                // ^\d
                integer = (integer << width) | parse.digit(a);
                this.consume(1);
            } else if (a === C.UNDERSCORE && f(b)) {
                // Separator followed by a digit:
                // ^_\d
                integer = (integer << width) | parse.digit(b);
                this.consume(2);
            } else if (a === C.UNDERSCORE && b === C.UNDERSCORE) {
                // Trailing double separator:
                // ^__
                this.consume(2);
                break;
            } else if (a === C.UNDERSCORE) {
                // Trailing separator:
                // ^_
                this.consume(1);
                break;
            } else {
                break;
            }
        }

        if (intnegative) {
            integer = -integer;
        }

        numeric.value = integer;

        return true;
    }

    /**
     * Read a binary literal: `/[+-]?0b[01]+(_[01]+)*_{0,2}/`.
     */
    protected readNumericBinary(): boolean {
        return this.readNumericExtended(1, C.LOWERCASE_B, is.binary);
    }

    /**
     * Read an octal literal: `/[+-]?0o[0-7]+(_[0-7]+)*_{0,2}/`.
     */
    protected readNumericOctal(): boolean {
        return this.readNumericExtended(3, C.LOWERCASE_O, is.octal);
    }

    /**
     * Read a hexadecimal literal: `/[+-]?0x[\da-f]+(_[\da-f]+)*_{0,2}/i`.
     */
    protected readNumericHexadecimal(): boolean {
        return this.readNumericExtended(4, C.LOWERCASE_X, is.hexadecimal);
    }

    /**
     * Read a decimal literal:
     *
     * -   `/[+-]?\d+(_\d+)*(\.(\d+(_\d+)*)?)?(e[+-]?\d+(_\d+)*)?_{0,2}/i`,
     * -   `/[+-]?\.\d+(_\d+)*(e[+-]?\d+(_\d+)*)?_{0,2}/i`.
     */
    protected readNumericDecimal(): boolean {
        const append = (character: number) => {
            const digit = parse.digit(character);

            if (scientific) {
                exponent *= 10;
                exponent += digit;
            } else if (real) {
                fraction += digit;
                fraction /= 10;
            } else {
                integer *= 10;
                integer += digit;
            }
        };

        let mismatch = true;
        let consume = 0;

        let intnegative = false;
        let expnegative = false;
        let scientific = false;
        let real = false;

        const a = this.lookahead(0);
        const b = this.lookahead(1);
        const c = this.lookahead(2);

        if (is.decimal(a)) {
            // ^(?=\d)
            mismatch = false;
        } else if (a === C.DOT && is.decimal(b)) {
            // ^.(?=\d)
            mismatch = false;
            real = true;
            consume = 1;
        } else if (is.sign(a) && is.decimal(b)) {
            // ^[+-](?=\d)
            mismatch = false;
            intnegative = a === S.HYPHEN;
            consume = 1;
        } else if (is.sign(a) && b === C.DOT && is.decimal(c)) {
            // ^[+-].(?=\d)
            mismatch = false;
            intnegative = a === S.HYPHEN;
            real = true;
            consume = 2;
        }

        if (mismatch) return false;

        const numeric = new Lexical.Numeric();

        this.advance(numeric);
        this.consume(consume);

        let integer = 0;
        let fraction = 0;
        let exponent = 0;

        while (this.cursor < this.length) {
            const a = this.lookahead(0);
            const b = this.lookahead(1);
            const c = this.lookahead(2);

            if (is.decimal(a)) {
                // Digit:
                // ^\d
                append(a);
                this.consume(1);
            } else if (this.extnumbers && a === C.UNDERSCORE && is.decimal(b)) {
                // Separator followed by a digit:
                // ^_\d
                append(b);
                this.consume(2);
            } else if (!real && a === C.DOT && is.decimal(b)) {
                // Dot followed by a digit:
                // ^.\d
                real = true;
                append(b);
                this.consume(2);
            } else if (this.extnumbers && !real && a === C.DOT) {
                // Trailing dot:
                // ^.
                real = true;
                this.consume(1);
            } else if (!scientific && (a | 0x20) === C.LOWERCASE_E && is.decimal(b)) {
                // Exponent letter followed by a digit:
                // ^e\d
                real = true;
                scientific = true;
                append(b);
                this.consume(2);
            } else if (!scientific && (a | 0x20) === C.LOWERCASE_E && is.sign(b) && is.decimal(c)) {
                // Exponent letter followed by a sign and a digit:
                // ^e[+-]\d
                real = true;
                scientific = true;
                expnegative = b === S.HYPHEN;
                append(c);
                this.consume(3);
            } else if (this.extnumbers && a === C.UNDERSCORE && b === C.UNDERSCORE) {
                // Trailing double separator:
                // ^__
                this.consume(1);
                break;
            } else if (this.extnumbers && a === C.UNDERSCORE) {
                // Trailing separator:
                // ^_
                this.consume(1);
                break;
            } else {
                break;
            }
        }

        if (intnegative) {
            integer = -integer;
            fraction = -fraction;
        }

        if (expnegative) {
            exponent = -exponent;
        }

        numeric.value = (integer + fraction) * 10 ** exponent;

        return true;
    }

    /**
     * Read any numeric literal.
     */
    protected readNumeric(): boolean {
        return this.readNumericBinary() || this.readNumericOctal() || this.readNumericHexadecimal() || this.readNumericDecimal();
    }
    // endregion

    // region Separator readers
    /**
     * Read a separator.
     */
    protected readSeparator(): boolean {
        const a = this.lookahead(0);

        if (!is.separator(a)) return false;

        const separator = new Lexical.Separator({
            separator: a,
        });

        this.advance(separator);
        this.consume(1);

        return true;
    }
    // endregion

    // region Operator readers
    /**
     * Read an operator.
     */
    protected readOperator(): boolean {
        const a = this.lookahead(0);

        if (!is.operator(a)) return false;

        const operator = new Lexical.Operator({
            operator: a,
        });

        this.advance(operator);
        this.consume(1);

        return true;
    }
    // endregion

    // region Blank readers
    /**
     * Read a whitespace: `/[ \t\r\n\f]+/`.
     */
    protected readBlank(): boolean {
        const a = this.lookahead(0);

        if (!is.blank(a)) return false;

        const blank = new Lexical.Blank();

        this.advance(blank);

        while (this.cursor < this.length) {
            const a = this.lookahead(0);

            if (is.blank(a)) {
                this.consume(1);
            } else {
                break;
            }
        }

        blank.value = this.decode();

        return true;
    }
    // endregion

    // region CDX readers
    /**
     * Read the `<!--` token.
     */
    protected readCdo(): boolean {
        const a = this.lookahead(0);
        const b = this.lookahead(1);
        const c = this.lookahead(2);
        const d = this.lookahead(3);

        if (a !== C.ANGLE_L || b !== C.EXCLAMATION || c !== C.HYPHEN || d !== C.HYPHEN) return false;

        this.advance(new Lexical.Cdx({ syntax: Lexical.Cdx.Syntax.Cdo }));
        this.consume(4);

        return true;
    }

    /**
     * Read the `-->` token.
     */
    protected readCdc(): boolean {
        const a = this.lookahead(0);
        const b = this.lookahead(1);
        const c = this.lookahead(2);

        if (a !== C.HYPHEN || b !== C.HYPHEN || c !== C.ANGLE_R) return false;

        this.advance(new Lexical.Cdx({ syntax: Lexical.Cdx.Syntax.Cdc }));
        this.consume(3);

        return true;
    }

    /**
     * Read CDO or CDC.
     */
    protected readCdx(): boolean {
        if (!this.stdcdx) return false;

        return this.readCdo() || this.readCdc();
    }
    // endregion

    // region Unexpected readers
    /**
     * Read characters not consumed by other readers: `/./`.
     */
    protected readUnexpected(): boolean {
        if (!this.frame.focus || this.frame.focus.type !== T.Unexpected) this.advance(new Lexical.Unexpected());

        this.consume(1);

        return true;
    }
    // endregion

    // region Escape readers
    /**
     * Read an extended escape:
     *
     * -   Byte: `/\\x[\da-f]{2}/i`.
     * -   BMP codepoint: `/\\u[\da-f]{4}/i`.
     * -   Supplementary codepoint: `/\\u\{\da-f]+\}/i`.
     * -   Literal codepoint: `/\\l./`.
     * -   Special: `/\\[0abefnrtv]/`.
     */
    protected readEscapeExtended(): boolean {
        const a = this.lookahead(0);
        const b = this.lookahead(1);
        const c = this.lookahead(2);
        const d = this.lookahead(3);
        const e = this.lookahead(4);
        const f = this.lookahead(5);

        if (!this.extescapes || a !== C.BACKSLASH) return false;

        // Special escape:
        if (Lexical.Escape.is.special(b)) {
            const escape = new Lexical.Escape({
                codepoint: Lexical.Escape.get.escaped(b),
            });

            this.advance(escape);
            this.consume(2);

            return true;
        }

        // Byte escape:
        if (b === C.LOWERCASE_X && is.hexadecimal(c) && is.hexadecimal(d)) {
            const escape = new Lexical.Escape({
                codepoint: parseInt(table[c]! + table[d]!, 16),
            });

            this.advance(escape);
            this.consume(4);

            return true;
        }

        // BMP codepoint escape:
        if (b === C.LOWERCASE_U && is.hexadecimal(c) && is.hexadecimal(d) && is.hexadecimal(e) && is.hexadecimal(f)) {
            const escape = new Lexical.Escape({
                codepoint: parseInt(table[c]! + table[d]! + table[e]! + table[f]!, 16),
            });

            this.advance(escape);
            this.consume(6);

            return true;
        }

        // Literal digit escape:
        if (b === C.LOWERCASE_L) {
            const length = Utf8.length(c);

            const escape = new Lexical.Escape({
                codepoint: Utf8.value(this.input, this.cursor + 2),
            });

            this.advance(escape);
            this.consume(2 + length);

            return true;
        }

        // Supplementary codepoint escape:
        if (b === C.LOWERCASE_U && c === C.BRACE_L && d !== C.BRACE_R) {
            let codepoint = 0;

            let offset = 3; // 0 — `\`, 1 — `u`, 2 — `{`.
            let cursor = this.cursor + offset;
            let focus = d;
            let valid = true;

            while (cursor < this.length && is.hexadecimal(focus)) {
                codepoint <<= 4;
                codepoint |= parse.digit(focus);

                offset++;
                cursor++;

                focus = this.input[cursor] ?? -1;
            }

            if (focus === C.BRACE_R) {
                offset++;
            } else {
                // TODO: Emit warning.
                valid = false;
            }

            this.advance(new Lexical.Escape({ valid, codepoint }));
            this.consume(offset);

            return true;
        }

        return false;
    }

    /**
     * Read a standard hexadecimal CSS escape.
     */
    protected readEscapeStandard(): boolean {
        const a = this.lookahead(0);
        const b = this.lookahead(1);

        if (!this.stdescapes || a !== C.BACKSLASH || !is.hexadecimal(b)) return false;

        let codepoint = 0;

        let offset = 1;
        let cursor = this.cursor + offset;
        let focus = b;

        while (cursor < this.length && offset <= 6 && is.hexadecimal(focus)) {
            codepoint <<= 4;
            codepoint |= parse.digit(focus);

            offset++;
            cursor++;

            focus = this.input[cursor] ?? -1;
        }

        if (is.blank(focus)) {
            offset += 1;
        }

        this.advance(new Lexical.Escape({ codepoint }));
        this.consume(offset);

        return true;
    }

    /**
     * Read a literal escape: `/\\./u`, where `.` is any codepoint except
     * newlines.
     */
    protected readEscapeLiteral(): boolean {
        const a = this.lookahead(0);
        const b = this.lookahead(1);

        if (a !== C.BACKSLASH) return false;

        if (is.newline(b) || this.cursor >= this.maximum) return false;

        const escape = new Lexical.Escape({
            codepoint: Utf8.value(this.input, this.cursor + 1),
        });

        this.advance(escape);
        this.consume(Utf8.length(b) + 1);

        return true;
    }

    /**
     * Read any escape sequence.
     */
    protected readEscapeRegular(): boolean {
        // TODO: Replace zero (?) and invalid codepoints with the replacement character.
        const result = this.readEscapeExtended() || this.readEscapeStandard() || this.readEscapeLiteral();

        if (!result) return false;

        const frame = this.frame;

        const focus = frame.focus as Lexical.Escape;
        const parent = frame.parent;

        switch (parent.type) {
            case T.Identifier: {
                parent.value += focus.value;

                break;
            }
            case T.Hash: {
                parent.value += focus.value;

                this.pushColorByte(focus.codepoint);

                break;
            }
        }

        return true;
    }

    /**
     * Read an escaped newline or EOF: `/\\(\r\n|\r|\n|\f|$)/`.
     */
    protected readEscapeNewline(): boolean {
        const a = this.lookahead(0);
        const b = this.lookahead(1);

        if (a !== C.BACKSLASH) return false;

        if (!is.newline(b) && this.cursor < this.maximum) return false;

        const newline = new Lexical.Newline();

        this.advance(newline);
        this.consume(1);

        if (this.cursor < this.maximum) {
            this.consume(1);
        }

        return true;
    }
    // endregion

    // region Raw readers
    /**
     * Read anything not consumed by other readers.
     */
    protected readLiteralRaw(): boolean {
        if (this.frame.focus?.type !== T.Raw) {
            this.advance(new Lexical.Raw());
        }

        this.consume(1);

        return true;
    }

    /**
     * Read an IDC: `/\p{IDC}+/`, where `/\p{IDC}/` is `/[\w-]/` and non-ASCII.
     */
    protected readNameRaw(): boolean {
        const a = this.lookahead(0);

        if (!is.idc(a)) return false;

        const raw = new Lexical.Raw();
        const frame = this.frame;

        this.advance(raw);

        while (this.cursor < this.length) {
            const a = this.lookahead(0);

            if (is.idc(a)) {
                this.consume(1);

                if (frame.context === Lexer.Context.Type.Hash) {
                    this.pushColorByte(a);
                }
            } else {
                break;
            }
        }

        const value = this.decode();

        raw.value = value;
        (this.frame.parent as Lexical.Identifier | Lexical.Hash).value += value;

        return true;
    }
    // endregion
    // endregion

    // region Public API
    /**
     * Tokenizes the source.
     *
     * @param input The input structure to tokenize.
     */
    tokenize(input = {} as Lexer.Input): Lexical.Branch {
        this.setup(input);

        return this.parseInput();
    }
    // endregion
}

export namespace Lexer {
    // region Options
    /**
     * Tokenizer options.
     */
    export interface Options {
        /**
         * Allow extended numbers:
         *
         * -   Hexadecimal, octal, binary literals.
         * -   Separators.
         * -   Trailing separators.
         * -   Trailing dot.
         */
        readonly 'extended-numbers'?: boolean | null;

        /**
         * Allow extended escapes:
         *
         * -   `\xXX`, `\uXXXX`, `\u{X}`..`\u{XXXXXX}`,
         * -   `\0`, `\r`, `\n`, etc.
         */
        readonly 'extended-escapes'?: boolean | null;

        /**
         * Disable standard escapes.
         */
        readonly 'standard-escapes'?: boolean | null;

        /**
         * Allow extended strings:
         *
         * -   With unescaped newlines.
         * -   With backtick quotes.
         */
        readonly 'extended-strings'?: boolean | null;

        /**
         * Allow extended comments:
         *
         * -   Rust-like nested block comments.
         * -   Line comments.
         */
        readonly 'extended-comments'?: boolean | null;

        /**
         * Disable standard URL literals.
         */
        readonly 'standard-urls'?: boolean | null;

        /**
         * Disable CDO/CDC tokens.
         */
        readonly 'standard-cdx'?: boolean | null;

        /**
         * A list of allowed interpolation syntaxes.
         */
        readonly 'quasi-definitions'?: readonly Options.QuasiDefinition[] | null;

        /**
         * A list of allowed annotation syntaxes.
         */
        readonly 'annotation-definitions'?: readonly Options.AnnotationDefinition[] | null;
    }

    export namespace Options {
        /**
         * Quasi syntax/context definition.
         */
        export interface QuasiDefinition {
            /**
             * Context mask. Quasi definitions with undefined/null/zero context
             * will be ignored.
             *
             * E.g., SASS interpolations work in the `Any & ~Line` contexts.
             */
            readonly contexts: Context.Type | Context.Mask | null;

            /**
             * Quasi syntaxes. E.g., SASS interpolations have the `#{}` syntax.
             * Quasi definitions with undefined/null/empty syntaxes will be
             * ignored.
             *
             * @see Lexical.Quasi.Syntax
             */
            readonly syntaxes: readonly Lexical.Quasi.Syntax[] | null;
        }

        /**
         * Annotation syntax/placement definition.
         */
        export interface AnnotationDefinition {
            /**
             * Annotation placement.
             *
             * @see Lexical.Annotation.Placement
             */
            readonly placement?: Lexical.Annotation.Placement | null;

            /**
             * Annotation syntax definition. Annotation definitions with
             * undefined/null syntax will be ignored.
             *
             * @see Lexical.Annotation.Syntax
             */
            readonly syntax?: Lexical.Annotation.Syntax | null;
        }
    }
    // endregion

    /**
     * Tokenizer input structure.
     */
    export interface Input {
        /**
         * @default null
         * @see Lexer.filename
         */
        readonly filename?: string | null;

        /**
         * The source buffer.
         *
         * @default new Uint8Array()
         */
        readonly input?: Uint8Array | null;

        /**
         * Begin coordinates of a slice to tokenize.
         *
         * @default Span.Stop.empty()
         */
        readonly begin?: Span.Stop | null;

        /**
         * End coordinates of a slice to tokenize. If none provided, the source
         * buffer will be parsed to the end.
         */
        readonly end?: Span.Stop | null;

        /**
         * A result node.
         *
         * @default new Lexical.Root()
         */
        readonly parent?: Lexical.Branch | null;
    }

    // region Context
    /**
     * Lexer context type.
     */
    export type Context = Context.Type;

    export namespace Context {
        /**
         * Lexer context type flags.
         */
        export const enum Type {
            Root /*        */ = 0b00_00_00_0_000_0001,
            Parentheses /* */ = 0b00_00_00_0_000_0010,
            Brackets /*    */ = 0b00_00_00_0_000_0100,
            Braces /*      */ = 0b00_00_00_0_000_1000,

            Double /*      */ = 0b00_00_00_0_001_0000,
            Single /*      */ = 0b00_00_00_0_010_0000,
            Backtick /*    */ = 0b00_00_00_0_100_0000,

            Url /*         */ = 0b00_00_00_1_000_0000,

            Block /*       */ = 0b00_00_01_0_000_0000,
            Line /*        */ = 0b00_00_10_0_000_0000,

            Quasi /*       */ = 0b00_01_00_0_000_0000,
            Annotation /*  */ = 0b00_10_00_0_000_0000,

            Identifier /*  */ = 0b01_00_00_0_000_0000,
            Hash /*        */ = 0b10_00_00_0_000_0000,
        }

        /**
         * Lexer context type masks.
         */
        export const enum Mask {
            Group /*    */ = Type.Root | Type.Parentheses | Type.Brackets | Type.Braces,
            Quoted /*   */ = Type.Double | Type.Single | Type.Backtick,
            Comment /*  */ = Type.Block | Type.Line,
            Fragment /* */ = Type.Quasi | Type.Annotation,
            Name /*     */ = Type.Identifier | Type.Hash,

            Any /*      */ = Group | Quoted | Type.Url | Comment | Fragment | Name,
        }

        /**
         * An array of all context types.
         */
        export const TYPES = [
            Type.Root,
            Type.Parentheses,
            Type.Brackets,
            Type.Braces,
            Type.Double,
            Type.Single,
            Type.Backtick,
            Type.Url,
            Type.Block,
            Type.Line,
            Type.Quasi,
            Type.Annotation,
            Type.Identifier,
            Type.Hash,
        ] as readonly Type[];

        export namespace infer {
            /**
             * Infer context type of a group node.
             *
             * @param node A node to infer context type for.
             */
            export const group = (node: Lexical.Group): Type.Parentheses | Type.Brackets | Type.Braces => {
                const { opening } = node;

                return opening === O.PARENTHESIS_L ? Type.Parentheses : opening === O.BRACKET_L ? Type.Brackets : Type.Braces;
            };

            /**
             * Infer context type for a quoted node.
             *
             * @param node A node to infer context type for.
             */
            export const quoted = (node: Lexical.Quoted): Type.Double | Type.Single | Type.Backtick => {
                const { quote } = node;

                return quote === Q.DOUBLE_QUOTE ? Type.Double : quote === Q.SINGLE_QUOTE ? Type.Single : Type.Backtick;
            };

            /**
             * Infer context type for a comment node.
             *
             * @param node A node to infer context type for.
             */
            export const comment = (node: Lexical.Comment): Type.Block | Type.Line => {
                const { syntax } = node;

                return syntax === Lexical.Comment.Syntax.Block ? Type.Block : Type.Line;
            };

            /**
             * Infer context type for a node.
             *
             * @param node A node to infer context type for.
             */
            export const context = (node: Lexical.Branch): Context => {
                switch (node.type) {
                    case T.Root:
                        return Type.Root;
                    case T.Group:
                        return group(node);
                    case T.Quoted:
                        return quoted(node);
                    case T.Url:
                        return Type.Url;
                    case T.Comment:
                        return comment(node);
                    case T.Quasi:
                        return Type.Quasi;
                    case T.Annotation:
                        return Type.Annotation;
                    case T.Identifier:
                        return Type.Identifier;
                    case T.Hash:
                        return Type.Hash;
                    default: {
                        ((_: never) => {})(node); // Sanity check to ensure switch exhaustiveness.

                        return null!;
                    }
                }
            };
        }
    }
    // endregion

    // region Frame
    /**
     * A stackframe structure.
     */
    export interface Frame {
        /**
         * Context type.
         */
        readonly context: Context;

        /**
         * Result node.
         */
        readonly parent: Lexical.Branch;

        /**
         * A node currently reading.
         */
        focus: Lexical | null;

        /**
         * Color literal validity in a hash context.
         */
        colorValidity: Frame.ColorValidity;

        /**
         * Color literal RGBA value.
         */
        colorRgba: number;

        /**
         * Color literal character length.
         */
        colorLength: number;
    }

    export namespace Frame {
        /**
         * Creates new stackframe with given result node.
         *
         * @param begin A default begin offset of the result node.
         * @param filename A default filename of the result node.
         * @param parent A result node.
         */
        export const infer = (begin: Span.Stop, filename: string | null, parent?: Lexical.Branch | null): Frame => {
            parent = parent ?? new Lexical.Root({ span: new Span({ filename, begin: Span.Stop.clone(begin) }), children: [] });

            return {
                context: Context.infer.context(parent),
                parent,

                focus: null,

                // TODO: Infer these fields for hash parents.
                colorValidity: ColorValidity.Indeterminate,
                colorRgba: 0,
                colorLength: 0,
            };
        };

        /**
         * Color literal validity type.
         */
        export const enum ColorValidity {
            /**
             * Neither valid nor invalid. Used while reading color literal
             * characters before it was invalidated somehow.
             */
            Indeterminate,

            /**
             * Definitely invalid.
             */
            Invalid,

            /**
             * Definitely valid.
             */
            Valid,
        }
    }
    // endregion

    /**
     * Internal quasi syntax definition.
     */
    export interface QuasiDefinition {
        /**
         * Quasi syntax type.
         */
        readonly syntax: Lexical.Quasi.Syntax;

        /**
         * The same string except the last byte as a byte array.
         */
        readonly pattern: readonly number[];
    }

    /**
     * Internal annotation syntax definition.
     */
    export interface AnnotationDefinition {
        /**
         * Annotation syntax type.
         */
        readonly syntax: Lexical.Annotation.Syntax;

        /**
         * Annotation placement.
         */
        readonly placement: Lexical.Annotation.Placement;

        /**
         * The syntax type string except the last byte as a byte array.
         */
        readonly pattern: readonly number[];
    }
}
