---
status: accepted
---

# Chapters speak the Eli5 Register — metaphor-led, picture-first

The Chapters were correct but dense: 1,100–2,100 words each, prose-led, with few figures. Readers who would get the method from five pictures had to extract it from thirteen thousand words. This decision rewrites all eight Chapters in the **Eli5 Register** (see `CONTEXT.md`): an eyebrow line rendered as a kicker pill, a lede that states the trick in at most two sentences, four to seven numbered one-claim parts, labeled cards for Example-Box material, and a real-names block that maps every metaphor back to its glossary term — at roughly half the previous word count. Every metaphor comes from the one shared Metaphor Map frozen in the spec (issue #61), so the same concept wears the same picture in every Chapter.

The trade-off is real: fewer words drop nuance, and a register this opinionated is hard to reverse across eight Chapters. Compression is bounded by one rule — a rewrite may drop claims, never invent them, and surviving claims keep their sources.

Figures split by scale. Hero and map-scale diagrams stay on the existing Excalidraw toolchain. Concept-scale figures are hand-authored inline SVG in the Markdown, drawn in `currentColor` so one source serves both themes with no generator step, each wrapped in a `figure` element whose caption states the figure's one claim.

Every figure must pass the **diagram doctrine**, enforced as a review axis on the Docs Lane:

1. Depict the mechanism, not its name.
2. A comparison must show the edge that differs.
3. Label every arrow with its meaning.
4. Match complexity to the stakes.
5. One figure, one claim — stated in the caption.

## Consequences

- New figures that decorate instead of explain fail review before auto-merge.
- A Chapter that needs more density than the register allows must link out rather than grow back.
- The Metaphor Map is the only source of metaphors; a new concept needs a Map entry before it needs a picture.
