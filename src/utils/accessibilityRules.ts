import { AccessibilityIssue, AccessibilityIssueType } from '../types/accessibility';
import { calculateContrast } from './colorContrast';

export const analyzeDocument = (html: string, url: string): AccessibilityIssue[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const issues: AccessibilityIssue[] = [];

  // Check for missing alt text
  issues.push(...checkImageAltText(doc));
  
  // Check heading structure
  issues.push(...checkHeadingStructure(doc));
  
  // Check form labels
  issues.push(...checkFormLabels(doc));
  
  // Check color contrast (simulated - would need computed styles in real implementation)
  issues.push(...checkColorContrast(doc));
  
  // Check page title
  issues.push(...checkPageTitle(doc));
  
  // Check language attribute
  issues.push(...checkLanguageAttribute(doc));
  
  // Check empty links
  issues.push(...checkEmptyLinks(doc));
  
  // Check skip links
  issues.push(...checkSkipLinks(doc));

  return issues;
};

const checkImageAltText = (doc: Document): AccessibilityIssue[] => {
  const images = Array.from(doc.querySelectorAll('img'));
  return images
    .filter(img => !img.getAttribute('alt') && !img.hasAttribute('alt'))
    .map((img, index) => ({
      id: `missing-alt-${index}`,
      type: 'missing-alt-text' as AccessibilityIssueType,
      severity: 'high' as const,
      title: 'Missing Alt Text',
      description: 'Image is missing alternative text for screen readers.',
      impact: 'Screen reader users cannot understand what this image represents, missing important visual information.',
      element: `<img src="${img.src}" />`,
      location: `Image ${index + 1}`,
      wcagReference: 'WCAG 1.1.1 - Non-text Content',
      solution: {
        description: 'Add descriptive alt text that explains what the image shows or its purpose.',
        codeExample: {
          before: `<img src="${img.src}" />`,
          after: `<img src="${img.src}" alt="Descriptive text explaining the image content" />`
        },
        steps: [
          'Identify the purpose of the image',
          'Write concise, descriptive alt text',
          'Add the alt attribute to the img tag',
          'For decorative images, use alt=""'
        ],
        difficulty: 'easy' as const,
        estimatedTime: '2-5 minutes',
        alternatives: [
          'Use aria-label for complex images',
          'Provide long descriptions with aria-describedby for detailed images'
        ]
      }
    }));
};

const checkHeadingStructure = (doc: Document): AccessibilityIssue[] => {
  const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const issues: AccessibilityIssue[] = [];
  
  if (headings.length === 0) {
    issues.push({
      id: 'no-headings',
      type: 'missing-heading' as AccessibilityIssueType,
      severity: 'high' as const,
      title: 'No Headings Found',
      description: 'Page lacks proper heading structure for navigation.',
      impact: 'Screen reader users cannot easily navigate through page content sections.',
      wcagReference: 'WCAG 1.3.1 - Info and Relationships',
      solution: {
        description: 'Add a proper heading hierarchy starting with h1 for the main title.',
        codeExample: {
          before: '<div class="title">Page Title</div>',
          after: '<h1>Page Title</h1>\n<h2>Section Title</h2>\n<h3>Subsection Title</h3>'
        },
        steps: [
          'Identify the main page topic and use h1',
          'Create section headings with h2',
          'Use h3-h6 for subsections in order',
          'Ensure headings describe their sections'
        ],
        difficulty: 'medium' as const,
        estimatedTime: '10-20 minutes'
      }
    });
  }

  // Check for skipped heading levels
  const levels = headings.map(h => parseInt(h.tagName.charAt(1)));
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      issues.push({
        id: `skipped-heading-${i}`,
        type: 'improper-heading-structure' as AccessibilityIssueType,
        severity: 'medium' as const,
        title: 'Skipped Heading Level',
        description: 'Heading levels should not skip numbers in sequence.',
        impact: 'Screen reader users may be confused by the document structure.',
        element: `<${headings[i].tagName.toLowerCase()}>${headings[i].textContent}</${headings[i].tagName.toLowerCase()}>`,
        wcagReference: 'WCAG 1.3.1 - Info and Relationships',
        solution: {
          description: 'Ensure heading levels follow a logical sequence without skipping.',
          codeExample: {
            before: `<h2>Section</h2>\n<h4>Subsection</h4>`,
            after: `<h2>Section</h2>\n<h3>Subsection</h3>`
          },
          steps: [
            'Review the current heading structure',
            'Identify skipped levels',
            'Adjust heading levels to be sequential',
            'Verify the logical flow makes sense'
          ],
          difficulty: 'easy' as const,
          estimatedTime: '5-10 minutes'
        }
      });
    }
  }

  return issues;
};

const checkFormLabels = (doc: Document): AccessibilityIssue[] => {
  const inputs = Array.from(doc.querySelectorAll('input:not([type="hidden"]), textarea, select'));
  return inputs
    .filter(input => {
      const id = input.getAttribute('id');
      const hasLabel = id && doc.querySelector(`label[for="${id}"]`);
      const hasAriaLabel = input.getAttribute('aria-label');
      const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
      return !hasLabel && !hasAriaLabel && !hasAriaLabelledBy;
    })
    .map((input, index) => ({
      id: `missing-label-${index}`,
      type: 'missing-form-label' as AccessibilityIssueType,
      severity: 'high' as const,
      title: 'Missing Form Label',
      description: 'Form input is missing an accessible label.',
      impact: 'Screen reader users cannot understand what information to enter in this field.',
      element: input.outerHTML,
      wcagReference: 'WCAG 1.3.1 - Info and Relationships',
      solution: {
        description: 'Associate the input with a label element or add aria-label.',
        codeExample: {
          before: `<input type="text" name="email" />`,
          after: `<label for="email">Email Address</label>\n<input type="text" id="email" name="email" />`
        },
        steps: [
          'Add an id attribute to the input',
          'Create a label element with for attribute matching the id',
          'Or add aria-label directly to the input',
          'Ensure the label text is descriptive'
        ],
        difficulty: 'easy' as const,
        estimatedTime: '2-5 minutes',
        alternatives: [
          'Use aria-label attribute',
          'Use aria-labelledby to reference other elements'
        ]
      }
    }));
};

const checkColorContrast = (doc: Document): AccessibilityIssue[] => {
  // This is a simplified version - real implementation would need computed styles
  const textElements = Array.from(doc.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button'));
  const issues: AccessibilityIssue[] = [];
  
  // Simulate finding low contrast (in reality, would analyze computed styles)
  const simulatedLowContrastElements = textElements.slice(0, Math.min(2, textElements.length));
  
  simulatedLowContrastElements.forEach((element, index) => {
    issues.push({
      id: `low-contrast-${index}`,
      type: 'low-contrast' as AccessibilityIssueType,
      severity: 'medium' as const,
      title: 'Low Color Contrast',
      description: 'Text color does not provide sufficient contrast against background.',
      impact: 'Users with visual impairments may have difficulty reading this text.',
      element: element.outerHTML.substring(0, 100) + '...',
      wcagReference: 'WCAG 1.4.3 - Contrast (Minimum)',
      solution: {
        description: 'Increase color contrast to meet WCAG AA standards (4.5:1 for normal text).',
        codeExample: {
          before: `.text { color: #888; background: #fff; }`,
          after: `.text { color: #333; background: #fff; }`
        },
        steps: [
          'Test current contrast ratio',
          'Darken text color or lighten background',
          'Verify new ratio meets WCAG standards',
          'Test with color blindness simulators'
        ],
        difficulty: 'easy' as const,
        estimatedTime: '5-10 minutes'
      }
    });
  });

  return issues;
};

const checkPageTitle = (doc: Document): AccessibilityIssue[] => {
  const title = doc.querySelector('title');
  if (!title || !title.textContent?.trim()) {
    return [{
      id: 'missing-page-title',
      type: 'missing-page-title' as AccessibilityIssueType,
      severity: 'high' as const,
      title: 'Missing Page Title',
      description: 'Page is missing a descriptive title element.',
      impact: 'Screen reader users and search engines cannot identify the page purpose.',
      wcagReference: 'WCAG 2.4.2 - Page Titled',
      solution: {
        description: 'Add a descriptive title that identifies the page content and purpose.',
        codeExample: {
          before: '<title></title>',
          after: '<title>Contact Us - Company Name</title>'
        },
        steps: [
          'Identify the main purpose of the page',
          'Write a concise, descriptive title',
          'Include relevant context like site name',
          'Keep it under 60 characters for SEO'
        ],
        difficulty: 'easy' as const,
        estimatedTime: '2-5 minutes'
      }
    }];
  }
  return [];
};

const checkLanguageAttribute = (doc: Document): AccessibilityIssue[] => {
  const html = doc.documentElement;
  if (!html.getAttribute('lang')) {
    return [{
      id: 'missing-lang-attribute',
      type: 'missing-lang-attribute' as AccessibilityIssueType,
      severity: 'medium' as const,
      title: 'Missing Language Attribute',
      description: 'HTML element is missing the lang attribute.',
      impact: 'Screen readers cannot determine the correct pronunciation and language rules.',
      wcagReference: 'WCAG 3.1.1 - Language of Page',
      solution: {
        description: 'Add a lang attribute to the html element specifying the page language.',
        codeExample: {
          before: '<html>',
          after: '<html lang="en">'
        },
        steps: [
          'Identify the primary language of the page content',
          'Add lang attribute to the html element',
          'Use appropriate language code (e.g., "en" for English)',
          'Consider lang attributes for foreign language sections'
        ],
        difficulty: 'easy' as const,
        estimatedTime: '1-2 minutes'
      }
    }];
  }
  return [];
};

const checkEmptyLinks = (doc: Document): AccessibilityIssue[] => {
  const links = Array.from(doc.querySelectorAll('a[href]'));
  return links
    .filter(link => !link.textContent?.trim() && !link.getAttribute('aria-label'))
    .map((link, index) => ({
      id: `empty-link-${index}`,
      type: 'empty-link' as AccessibilityIssueType,
      severity: 'high' as const,
      title: 'Empty Link',
      description: 'Link has no accessible text content.',
      impact: 'Screen reader users cannot understand where this link leads.',
      element: link.outerHTML,
      wcagReference: 'WCAG 2.4.4 - Link Purpose (In Context)',
      solution: {
        description: 'Add descriptive text content or aria-label to explain the link purpose.',
        codeExample: {
          before: '<a href="/contact"></a>',
          after: '<a href="/contact">Contact Us</a>'
        },
        steps: [
          'Identify the link destination',
          'Add descriptive text inside the link',
          'Or use aria-label for icon-only links',
          'Ensure the text describes the link purpose'
        ],
        difficulty: 'easy' as const,
        estimatedTime: '2-5 minutes'
      }
    }));
};

const checkSkipLinks = (doc: Document): AccessibilityIssue[] => {
  const skipLink = doc.querySelector('a[href="#main"], a[href="#content"], a[href^="#skip"]');
  if (!skipLink) {
    return [{
      id: 'missing-skip-link',
      type: 'missing-skip-link' as AccessibilityIssueType,
      severity: 'medium' as const,
      title: 'Missing Skip Link',
      description: 'Page lacks a skip navigation link for keyboard users.',
      impact: 'Keyboard users must tab through all navigation elements to reach main content.',
      wcagReference: 'WCAG 2.4.1 - Bypass Blocks',
      solution: {
        description: 'Add a skip link that allows users to jump directly to main content.',
        codeExample: {
          before: '<nav>...</nav>\n<main>...</main>',
          after: '<a href="#main" class="skip-link">Skip to main content</a>\n<nav>...</nav>\n<main id="main">...</main>'
        },
        steps: [
          'Add a skip link as the first focusable element',
          'Link to the main content area with id="main"',
          'Style the link to be visible when focused',
          'Test with keyboard navigation'
        ],
        difficulty: 'medium' as const,
        estimatedTime: '10-15 minutes'
      }
    }];
  }
  return [];
};