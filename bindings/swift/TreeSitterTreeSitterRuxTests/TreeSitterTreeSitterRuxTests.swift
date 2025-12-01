import XCTest
import SwiftTreeSitter
import TreeSitterTreeSitterRux

final class TreeSitterTreeSitterRuxTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_tree_sitter_rux())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Tree Sitter Rux grammar")
    }
}
