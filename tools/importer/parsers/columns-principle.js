/* eslint-disable */
/* global WebImporter */
/**
 * Parser: columns-principle
 * Base block: columns
 * Source: https://brandcenter.walmart.com/brand/brand-foundation
 * Selectors: .columns.vertical-center.wrap-in-tablet, .columns.vertical-center.reverse-columns-mobile.wrap-in-tablet
 * Structure: Two-column layout - image on one side, heading + description on the other
 * Handles both normal (image-left/text-right) and reversed (text-left/image-right) layouts
 * Generated: 2026-06-07
 */
export default function parse(element, { document }) {
  // Extract the two content columns (first two .dv-column elements have content, rest are empty)
  const columns = element.querySelectorAll(':scope .cmp-columns > .dv-column');
  const col1 = columns[0];
  const col2 = columns[1];

  // Determine which column has the image and which has text
  // Instance 1 & 3: image in col1, text in col2
  // Instance 2 (reverse-columns-mobile): text in col1, image in col2
  const col1Image = col1 ? col1.querySelector('img.cmp-image__image, img') : null;
  const col2Image = col2 ? col2.querySelector('img.cmp-image__image, img') : null;

  let imageCol;
  let textCol;

  if (col1Image) {
    imageCol = col1;
    textCol = col2;
  } else if (col2Image) {
    imageCol = col2;
    textCol = col1;
  } else {
    // Fallback: treat col1 as image, col2 as text
    imageCol = col1;
    textCol = col2;
  }

  // Extract image from the image column
  const image = imageCol ? imageCol.querySelector('img.cmp-image__image, img') : null;

  // Extract heading from the text column (h3 within .cmp-text)
  const heading = textCol ? textCol.querySelector('.cmp-text h3, h3, h2') : null;

  // Extract description paragraph from the text column
  const description = textCol ? textCol.querySelector('.cmp-text p, p') : null;

  // Build image cell
  const imageCell = [];
  if (image) {
    imageCell.push(image);
  }

  // Build text cell with heading + description
  const textCell = [];
  if (heading) {
    textCell.push(heading);
  }
  if (description) {
    textCell.push(description);
  }

  // Build cells array - single row with two column cells
  // Preserve original column order from source DOM
  const cells = [];
  if (col1Image) {
    // Image is in first column (normal layout)
    cells.push([imageCell, textCell]);
  } else {
    // Text is in first column (reversed layout)
    cells.push([textCell, imageCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-principle', cells });
  element.replaceWith(block);
}
