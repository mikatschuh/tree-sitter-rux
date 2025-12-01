/**
 * @file A tree-sitter-parser for the Rux Programming Language
 * @author Mika Aßmus mika.assmus@gmail.com
 * @license PPL
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
        "proc",
        "if",
        "loop",
        "else",
        "return",
        "break",
        "continue",
        "defer",
        "move",
      ),
    number: ($) => /\d+\.?\d*/, // /[([\d\_]+[uifc])(0x)()]/,
    identifier: ($) => /[a-zA-Z_]\w*/,
    string: ($) => /\".*\"/,
    comment: ($) => token(seq(/\/\//, /.*/, /\n/)),
  },
});
