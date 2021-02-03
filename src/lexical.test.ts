import { Ascii } from './ascii';
import { Lexer } from './lexer';
import { Lexical } from './lexical';
import { Utf8 } from './utf8';

import t = Ascii.table;

test('depth-first traversal', () => {
    const source = String.raw`1-(2/3)*4`;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer();

    const root = lexer.tokenize(input) as Lexical.Root;

    const out = [] as string[];

    root.traverseDepth((node, direction) => {
        const d = direction ? 'Exit ' : 'Enter';

        switch (node.type) {
            case Lexical.Type.Root: {
                out.push(`${d} ::: Root`);
                break;
            }
            case Lexical.Type.Group: {
                out.push(`${d} ::: Group    :: ${t[node.opening]}${t[node.ending]}`);
                break;
            }
            case Lexical.Type.Numeric: {
                out.push(`${d} ::: Numeric  :: ${node.value}`);
                break;
            }
            case Lexical.Type.Operator: {
                out.push(`${d} ::: Operator :: ${t[node.operator]}`);
                break;
            }
        }
    });

    expect(out).toEqual([
        'Enter ::: Root',
        'Enter ::: Numeric  :: 1',
        'Exit  ::: Numeric  :: 1',
        'Enter ::: Operator :: -',
        'Exit  ::: Operator :: -',
        'Enter ::: Group    :: ()',
        'Enter ::: Numeric  :: 2',
        'Exit  ::: Numeric  :: 2',
        'Enter ::: Operator :: /',
        'Exit  ::: Operator :: /',
        'Enter ::: Numeric  :: 3',
        'Exit  ::: Numeric  :: 3',
        'Exit  ::: Group    :: ()',
        'Enter ::: Operator :: *',
        'Exit  ::: Operator :: *',
        'Enter ::: Numeric  :: 4',
        'Exit  ::: Numeric  :: 4',
        'Exit  ::: Root',
    ]);
});

test('depth-first traversal with break', () => {
    const source = String.raw`1-(2/3)*4`;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer();

    const root = lexer.tokenize(input) as Lexical.Root;

    const out = [] as string[];

    root.traverseDepth((node, direction) => {
        const d = direction ? 'Exit ' : 'Enter';

        switch (node.type) {
            case Lexical.Type.Root: {
                out.push(`${d} ::: Root`);
                break;
            }
            case Lexical.Type.Group: {
                out.push(`${d} ::: Group    :: ${t[node.opening]}${t[node.ending]}`);
                return Lexical.skipChildren;
            }
            case Lexical.Type.Numeric: {
                out.push(`${d} ::: Numeric  :: ${node.value}`);
                break;
            }
            case Lexical.Type.Operator: {
                out.push(`${d} ::: Operator :: ${t[node.operator]}`);
                break;
            }
        }

        return undefined;
    });

    expect(out).toEqual([
        'Enter ::: Root',
        'Enter ::: Numeric  :: 1',
        'Exit  ::: Numeric  :: 1',
        'Enter ::: Operator :: -',
        'Exit  ::: Operator :: -',
        'Enter ::: Group    :: ()',
        'Exit  ::: Group    :: ()',
        'Enter ::: Operator :: *',
        'Exit  ::: Operator :: *',
        'Enter ::: Numeric  :: 4',
        'Exit  ::: Numeric  :: 4',
        'Exit  ::: Root',
    ]);
});

test('breadth-first traversal', () => {
    const source = String.raw`1-(2/3)*4`;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer();

    const root = lexer.tokenize(input) as Lexical.Root;

    const out = [] as string[];

    root.traverseBreadth(node => {
        switch (node.type) {
            case Lexical.Type.Root: {
                out.push(`Root`);
                break;
            }
            case Lexical.Type.Group: {
                out.push(`Group    :: ${t[node.opening]}${t[node.ending]}`);
                break;
            }
            case Lexical.Type.Numeric: {
                out.push(`Numeric  :: ${node.value}`);
                break;
            }
            case Lexical.Type.Operator: {
                out.push(`Operator :: ${t[node.operator]}`);
                break;
            }
        }
    });

    expect(out).toEqual([
        'Root',
        'Numeric  :: 1',
        'Operator :: -',
        'Group    :: ()',
        'Operator :: *',
        'Numeric  :: 4',
        'Numeric  :: 2',
        'Operator :: /',
        'Numeric  :: 3',
    ]);
});

test('breadth-first traversal with break', () => {
    const source = String.raw`1-(2/3)*4`;

    const input: Lexer.Input = {
        input: Utf8.encode(source),
    };

    const lexer = new Lexer();

    const root = lexer.tokenize(input) as Lexical.Root;

    const out = [] as string[];

    root.traverseBreadth(node => {
        switch (node.type) {
            case Lexical.Type.Root: {
                out.push(`Root`);
                break;
            }
            case Lexical.Type.Group: {
                out.push(`Group    :: ${t[node.opening]}${t[node.ending]}`);
                return Lexical.skipChildren;
            }
            case Lexical.Type.Numeric: {
                out.push(`Numeric  :: ${node.value}`);
                break;
            }
            case Lexical.Type.Operator: {
                out.push(`Operator :: ${t[node.operator]}`);
                break;
            }
        }

        return undefined;
    });

    expect(out).toEqual(['Root', 'Numeric  :: 1', 'Operator :: -', 'Group    :: ()', 'Operator :: *', 'Numeric  :: 4']);
});
