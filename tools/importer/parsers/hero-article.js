/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-article variant.
 * Base block: hero
 * Source: https://brandcenter.walmart.com/brand/brand-foundation
 * Selector: .brand-guide-hero
 * Generated: 2026-06-07
 *
 * Structure: Full-viewport hero with centered h1 heading and parallax background image.
 * Source DOM: .brand-guide-hero > .brand-guide-hero-container.full-viewport-height
 *   - h1.pageTitle (centered heading)
 *   - .parallaxParent > .parallaxTarget > .imageContainer > img (background image)
 */
export default function parse(element, { document }) {
  // Extract the background image from parallax container
  const bgImage = element.querySelector('.parallaxParent img, .imageContainer img, .brand-guide-hero-container img');

  // Extract the heading (h1 with class pageTitle)
  const heading = element.querySelector('h1.pageTitle, h1, h2.pageTitle, h2');

  // Build cells array matching hero block structure:
  // Row 1: background image
  // Row 2: content (heading)
  const cells = [];

  // Row 1: Background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content cell with heading
  const contentCell = [];
  if (heading) {
    contentCell.push(heading);
  }
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-article', cells });
  element.replaceWith(block);
}
