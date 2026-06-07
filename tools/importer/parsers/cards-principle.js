/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-principle
 * Base block: cards
 * Source: https://brandcenter.walmart.com/brand/brand-foundation
 * Selector: .principle-tiles
 * Generated: 2026-06-07
 *
 * Source structure:
 * - .principle-tiles
 *   - .principle-tiles-container
 *     - .tiles-list
 *       - .tile-carousel.stack-order
 *         - .slide (repeated per tile)
 *           - .tile
 *             - .tile-header (title text: "Grassroots", "Agile", "Confident")
 *             - p.tile-desc (description paragraph)
 *
 * Target: Cards block with one row per card, each row containing
 * a single cell with heading + description (text-only, no images).
 */
export default function parse(element, { document }) {
  // Find all tile slides - validated against source: .tile-carousel .slide
  const slides = element.querySelectorAll('.tile-carousel .slide, .tiles-list .slide, .slide');

  // Build cells array - one row per card tile
  const cells = [];

  slides.forEach((slide) => {
    // Extract tile header - validated against source: .tile-header
    const titleEl = slide.querySelector('.tile-header, [class*="tile-header"]');
    // Extract tile description - validated against source: p.tile-desc
    const descEl = slide.querySelector('p.tile-desc, .tile-desc, p');

    const cardCell = [];

    if (titleEl) {
      // Convert tile-header div to a proper heading for semantic structure
      const heading = document.createElement('h3');
      heading.textContent = titleEl.textContent;
      cardCell.push(heading);
    }

    if (descEl) {
      cardCell.push(descEl);
    }

    if (cardCell.length > 0) {
      cells.push([cardCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-principle', cells });
  element.replaceWith(block);
}
