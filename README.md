# Type-Safe Style Sheets

> WIP CSS toolchain. Like CSS, but safe, flexible and generalized AF. Includes
> lexer, parser¹, analyzer¹, traversal/transformation API¹, codegen¹, plugin
> host¹, service¹.
>
> 1. ↑ Still unimplemented 🤡

Architecture docs are under development.

## Goals

-   Type-safe CSS compile-time and native CSS variables.
-   Full isolation:
    -   classnames,
    -   variable names,
    -   font names,
    -   animation names,
    -   grid line names,
    -   etc.
-   Explicit symbols export/import.
-   React component selectors.
-   `::part(...)` selectors for React components.
-   Polyglot lexer and parser.
-   Extensible compiler.
-   Bundlers integration.
-   SCSS, LESS, etc., and more syntax and semantics via plugins.

## License

MIT
