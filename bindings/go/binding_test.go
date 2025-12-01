package tree_sitter_tree_sitter_rux_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_tree_sitter_rux "github.com/mikatschuh/tree-sitter-rux/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_tree_sitter_rux.Language())
	if language == nil {
		t.Errorf("Error loading Tree Sitter Rux grammar")
	}
}
