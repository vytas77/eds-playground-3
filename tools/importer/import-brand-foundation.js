/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroArticleParser from './parsers/hero-article.js';
import columnsPrincipleParser from './parsers/columns-principle.js';
import cardsPrincipleParser from './parsers/cards-principle.js';
import carouselAssetsParser from './parsers/carousel-assets.js';

// TRANSFORMER IMPORTS
import walmartCleanupTransformer from './transformers/walmart-cleanup.js';
import walmartSectionsTransformer from './transformers/walmart-sections.js';

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'brand-foundation',
  description: 'Brand guide content page with sidebar navigation, article content, and brand principles',
  urls: ['https://brandcenter.walmart.com/brand/brand-foundation'],
  blocks: [
    {
      name: 'hero-article',
      instances: ['.brand-guide-hero']
    },
    {
      name: 'columns-principle',
      instances: ['.columns.vertical-center.wrap-in-tablet', '.columns.vertical-center.reverse-columns-mobile.wrap-in-tablet']
    },
    {
      name: 'cards-principle',
      instances: ['.principle-tiles']
    },
    {
      name: 'carousel-assets',
      instances: ['.lottie-carousel']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: '.brand-guide-hero',
      style: null,
      blocks: ['hero-article'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Introduction',
      selector: ['.brand-foundation-content-area', '.content-area-wrapper'],
      style: null,
      blocks: [],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: 'Brand Purpose',
      selector: '#brand-purpose',
      style: 'blue',
      blocks: [],
      defaultContent: []
    },
    {
      id: 'section-4',
      name: 'Company Positioning',
      selector: '#company-positioning',
      style: 'blue',
      blocks: [],
      defaultContent: []
    },
    {
      id: 'section-5',
      name: 'Brand Principles Intro',
      selector: '#brand-principles',
      style: null,
      blocks: [],
      defaultContent: []
    },
    {
      id: 'section-6',
      name: 'Brand Principles Details',
      selector: '.columns.vertical-center',
      style: null,
      blocks: ['columns-principle'],
      defaultContent: []
    },
    {
      id: 'section-7',
      name: 'Cheat Sheet',
      selector: '.principle-tiles',
      style: 'blue, rounded',
      blocks: ['cards-principle'],
      defaultContent: []
    },
    {
      id: 'section-8',
      name: 'Explore Assets',
      selector: '.lottie-carousel',
      style: null,
      blocks: ['carousel-assets'],
      defaultContent: []
    },
    {
      id: 'section-9',
      name: 'Footer',
      selector: '.footer-nav',
      style: 'dark',
      blocks: [],
      defaultContent: []
    }
  ]
};

// PARSER REGISTRY
const parsers = {
  'hero-article': heroArticleParser,
  'columns-principle': columnsPrincipleParser,
  'cards-principle': cardsPrincipleParser,
  'carousel-assets': carouselAssetsParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  walmartCleanupTransformer,
  walmartSectionsTransformer,
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach(blockDef => {
    blockDef.instances.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach(element => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach(block => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map(b => b.name),
      }
    }];
  }
};
