/**
 * @file A tree-sitter-parser for the Flou Programming Language
 * @author Mika Aßmus mika.assmus@gmail.com
 * @license PPL
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "flou",

  rules: {
    source_file: ($) => repeat(choice($.keyword, $.number, $.identifier)),

    keyword: ($) =>
      choice("proc", "if", "loop", "else", "return", "break", "continue"),
    number: ($) => /\d+/,
    identifier: ($) => /[a-zA-Z_]\w*/,
  },
});
