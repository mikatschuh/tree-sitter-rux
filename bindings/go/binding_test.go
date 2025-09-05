package tree_sitter_flou_parser_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_flou_parser "github.com/mikatschuh/tree-sitter-flou/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_flou_parser.Language())
	if language == nil {
		t.Errorf("Error loading Flou Parser grammar")
	}
}
