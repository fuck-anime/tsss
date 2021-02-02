/**
 * Node coordinates.
 */
export class Span {
    /**
     * An optional filename.
     */
    filename: string | null;

    /**
     * Span begin coordinates.
     */
    begin: Span.Stop;

    /**
     * Span end coordinates.
     */
    end: Span.Stop;

    constructor(init = {} as Span.Init) {
        this.filename = init.filename ?? null;
        this.begin = init.begin ?? Span.Stop.empty();
        this.end = init.end ?? Span.Stop.clone(this.begin);
    }

    /**
     * Clones a span object.
     */
    clone(): Span {
        return new Span({
            filename: this.filename,
            begin: Span.Stop.clone(this.begin),
            end: Span.Stop.clone(this.end),
        });
    }

    /**
     * Serializes a span object.
     */
    serialize(): Span.Serialized {
        return {
            type: 'Tsss.Span',
            filename: this.filename,
            begin: Span.Stop.serialize(this.begin),
            end: Span.Stop.serialize(this.end),
        };
    }
}

export namespace Span {
    /**
     * Span object initializer.
     */
    export interface Init {
        /**
         * @default null
         * @see Span.filename
         */
        readonly filename?: string | null;

        /**
         * @default Stop.empty()
         * @see Span.begin
         */
        readonly begin?: Stop | null;

        /**
         * @default Stop.empty()
         * @see Span.end
         */
        readonly end?: Stop | null;
    }

    export interface Serialized {
        /**
         * A type tag.
         */
        readonly type: 'Tsss.Span';

        /**
         * @see Span.filename
         */
        filename: string | null;

        /**
         * @see Span.begin
         */
        begin: Span.Stop.Serialized;

        /**
         * @see Span.end
         */
        end: Span.Stop.Serialized;
    }

    /**
     * Span stop is a POJO of specific interface. Be careful to follow the same
     * field order when creating `Stop` objects. `Stop` objects have certain
     * “static methods” defined as function in the `Stop` namespace.
     */
    export interface Stop {
        /**
         * An offset relative to the input start.
         */
        absolute: Offset;

        /**
         * An offset relative to the line start.
         */
        relative: Offset;

        /**
         * Line number.
         */
        line: number;
    }

    export namespace Stop {
        /**
         * A serialized version of `Stop`.
         */
        export interface Serialized {
            /**
             * A type tag.
             */
            readonly type: 'Tsss.Span.Stop';

            /**
             * @see Stop.absolute
             */
            absolute: Offset.Serialized;

            /**
             * @see Stop.relative
             */
            relative: Offset.Serialized;

            /**
             * @see Stop.line
             */
            line: number;
        }

        /**
         * Creates new empty `Stop` object.
         */
        export const empty = (): Stop => ({
            absolute: Offset.empty(),
            relative: Offset.empty(),
            line: 0,
        });

        /**
         * Clones an existing `Stop` object.
         *
         * @param stop A `Stop` object to clone.
         */
        export const clone = (stop: Stop): Stop => ({
            absolute: Offset.clone(stop.absolute),
            relative: Offset.clone(stop.relative),
            line: stop.line,
        });

        /**
         * Serializes a `Stop` object.
         *
         * @param stop A `Stop` object to serialize.
         */
        export const serialize = (stop: Stop): Serialized => ({
            type: 'Tsss.Span.Stop',
            absolute: Offset.serialize(stop.absolute),
            relative: Offset.serialize(stop.relative),
            line: stop.line,
        });
    }

    /**
     * Span stop offset is a POJO of specific interface. Be careful to follow
     * the same field order when creating `Offset` objects. `Offset` objects
     * have certain “static methods” defined as function in the `Offset`
     * namespace.
     */
    export interface Offset {
        /**
         * Offset value in bytes.
         */
        byte: number;

        /**
         * Offset value in codepoints.
         */
        codepoint: number;
    }

    export namespace Offset {
        /**
         * A serialized version of `Offset`.
         */
        export interface Serialized {
            /**
             * A type tag.
             */
            readonly type: 'Tsss.Span.Offset';

            /**
             * @see Offset.byte
             */
            byte: number;

            /**
             * @see Offset.codepoint
             */
            codepoint: number;
        }

        /**
         * Creates new empty `Offset` object.
         */
        export const empty = (): Offset => ({
            byte: 0,
            codepoint: 0,
        });

        /**
         * Clones an existing `Offset` object.
         *
         * @param offset An `Offset` object to clone.
         */
        export const clone = (offset: Offset): Offset => ({
            byte: offset.byte,
            codepoint: offset.codepoint,
        });

        /**
         * Serializes an `Offset` object.
         *
         * @param offset An `Offset` object to serialize.
         */
        export const serialize = (offset: Offset): Serialized => ({
            type: 'Tsss.Span.Offset',
            byte: offset.byte,
            codepoint: offset.codepoint,
        });
    }

    /**
     * Clones an existing `Span` object; returns `null` if the `span` parameter
     * is falsy.
     *
     * @param span A `Span` object to clone.
     */
    export const clone = <s extends Span | null>(span: s): s => {
        if (span) {
            return span.clone() as never;
        } else {
            return null as never;
        }
    };

    /**
     * Serializes a `Span` object; returns `null` if the `span` parameter is
     * falsy.
     *
     * @param span A `Span` object to serialize.
     */
    export const serialize = <s extends Span | null>(span: s): s extends null ? null : Serialized => {
        if (span) {
            return span.serialize() as never;
        } else {
            return null as never;
        }
    };
}
