/**
 * @file A tree-sitter-parser for the Rux Programming Language
 * @author Mika Aßmus mika.assmus@gmail.com
 * @license Apache 2.0
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "rux",
  extras: ($) => [/\s/, $.comment],

  rules: {
    source_file: ($) =>
      repeat(
        choice(
          $.operator,
          $.bracket,
          $.delimiter,
          $.keyword,
          $.number,
          $.string,
          $.identifier,
        ),
      ),

    operator: ($) =>
      token(
        choice(
          "!",
          "'",
          "=",
          "<",
          ">",
          "+",
          "-",
          "*",
          "/",
          "%",
          "·",
          "^",
          "|",
          "&",
          ":",
        ),
      ),
    // Klammern () [] {}
    open_round: ($) => /\(/,
    open_squared: ($) => /\[/,
    open_curly: ($) => /\{/,
    closed_round: ($) => /\)/,
    closed_squared: ($) => /\]/,
    closed_curly: ($) => /\}/,

    bracket: ($) =>
      choice(
        $.open_round,
        $.open_squared,
        $.open_curly,
        $.closed_round,
        $.closed_squared,
        $.closed_curly,
      ),

    // Satz- oder Ausdrucks-Trennzeichen wie , ;
    delimiter: ($) => token(choice(".", ";", ",")),

    keyword: ($) =>
      choice(
        "fn",
        "struct",
        "enum",

        "let",
        "var",

        "if",
        "else",
        "loop",
        "in",
        "return",
        "break",
        "continue",
      ),
    number: ($) => /\d+\.?\d*\w*/, // /[([\d\_]+[uifc])(0x)()]/,
    string: ($) =>
      token(seq('"', repeat(choice(/[^"\\]+/, /\\./)), '"')),

    identifier: ($) =>
      choice(
        $.identifier_upper_snake_case,
        $.identifier_pascal_case,
        $.identifier_snake_case,
      ),
    identifier_snake_case: ($) => /[a-z][a-z0-9]*(?:_[a-z0-9]+)*/,
    identifier_upper_snake_case: ($) => /[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*/,
    identifier_pascal_case: ($) =>
      /(?:[A-Z][a-zA-Z0-9]*|[a-z]+(?:[A-Z][a-zA-Z0-9]*)+)/,

    comment: ($) => token(seq("//", /.*/)),
  },
});
