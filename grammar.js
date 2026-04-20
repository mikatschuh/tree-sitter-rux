/**
 * @file A tree-sitter-parser for the Rux Programming Language
 * @author Mika Aßmus mika.assmus@gmail.com
 * @license Apache 2.0
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const underscore_wrapped_digits = (digits) =>
  `_*[${digits}](?:_*[${digits}])*_*`;
const underscore_run = "_*";

const prefixed_integer = (prefix, digits) =>
  `0${prefix}${underscore_wrapped_digits(digits)}`;

const radix_mantissa = (digits) =>
  `(?:${underscore_wrapped_digits(digits)}(?:\\.${underscore_wrapped_digits(digits)})?|${underscore_run}\\.${underscore_wrapped_digits(digits)})`;

const prefixed_radix = (prefix, digits) =>
  `0${prefix}${radix_mantissa(digits)}`;

const decimal_integer = underscore_wrapped_digits("0-9");
const binary_integer = prefixed_integer("b", "01");
const seximal_integer = prefixed_integer("s", "0-5");
const octal_integer = prefixed_integer("o", "0-7");
const dozenal_integer = prefixed_integer("d", "0-9AaBb");
const hexadecimal_integer = prefixed_integer("x", "0-9A-Fa-f");

const any_base_integer = [
  decimal_integer,
  binary_integer,
  seximal_integer,
  octal_integer,
  dozenal_integer,
  hexadecimal_integer,
].join("|");

const exponent_integer = `(?:${any_base_integer})`;
const decimal_mantissa = radix_mantissa("0-9");
const decimal_number = `(?:${decimal_mantissa}(?:e[+-]?${exponent_integer})?)`;
const binary_number = `(?:${prefixed_radix("b", "01")}(?:e[+-]?${exponent_integer})?)`;
const seximal_number = `(?:${prefixed_radix("s", "0-5")})`;
const octal_number = `(?:${prefixed_radix("o", "0-7")})`;
const dozenal_number = `(?:${prefixed_radix("d", "0-9AaBb")})`;
const hexadecimal_number = `(?:${prefixed_radix("x", "0-9A-Fa-f")}(?:p[+-]?${exponent_integer})?)`;
const leading_dot_number = `(?:_*\\._*[0-9][^\\s+\\-]*)`;
const malformed_number = `(?:${decimal_integer}[^\\s+\\-]*|0[bsoxd][^\\s+\\-]*|${leading_dot_number})`;

module.exports = grammar({
  name: "rux",
  extras: ($) => [/\s/, $.comment],
  word: ($) => $.identifier_snake_case,

  rules: {
    source_file: ($) =>
      repeat(
        choice(
          $.operator,
          $.bracket,
          $.delimiter,
          $.keyword,
          $.number,
          $.atomic_type,
          $.builtin_type,
          $.boolean,
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
      token(
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
      ),
    number: ($) =>
      token(
        prec(
          2,
          choice(
            new RegExp(decimal_number),
            new RegExp(binary_number),
            new RegExp(seximal_number),
            new RegExp(octal_number),
            new RegExp(dozenal_number),
            new RegExp(hexadecimal_number),
            new RegExp(malformed_number),
          ),
        ),
      ),
    atomic_type: ($) =>
      token(prec(1, new RegExp(`[iu](?:${any_base_integer})`))),
    builtin_type: ($) =>
      token(
        prec(
          2,
          /(?:type|sumtype|producttype|usize|isize|f16|f32|f64|f128|bool)/,
        ),
      ),
    string: ($) => token(seq('"', repeat(choice(/[^"\\]+/, /\\./)), '"')),
    boolean: ($) => token(choice("true", "false")),

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
