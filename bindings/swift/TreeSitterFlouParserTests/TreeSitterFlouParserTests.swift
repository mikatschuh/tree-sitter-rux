import XCTest
import SwiftTreeSitter
import TreeSitterFlouParser

final class TreeSitterFlouParserTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_flou_parser())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Flou Parser grammar")
    }
}
