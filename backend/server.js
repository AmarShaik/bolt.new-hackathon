import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Together.ai API configuration
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions';

if (!TOGETHER_API_KEY) {
  console.error('TOGETHER_API_KEY is required in .env file');
  process.exit(1);
}

// Helper function to call Together.ai API
async function callTogetherAI(prompt, maxTokens = 150) {
  try {
    const response = await fetch(TOGETHER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Together.ai API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || '';
  } catch (error) {
    console.error('Together.ai API call failed:', error);
    return null;
  }
}

// Helper function to fetch website HTML
async function fetchWebsiteHTML(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Failed to fetch website:', error);
    throw error;
  }
}

// Helper function to analyze accessibility issues
function analyzeAccessibility($, url) {
  const issues = [];

  // Check for images without alt text
  $('img').each((i, img) => {
    const $img = $(img);
    const src = $img.attr('src');
    const alt = $img.attr('alt');
    
    if (!alt && alt !== '') {
      issues.push({
        type: 'missing-alt-text',
        severity: 'high',
        element: $.html($img),
        src: src,
        needsAI: true
      });
    }
  });

  // Check for form inputs without labels
  $('input:not([type="hidden"]), textarea, select').each((i, input) => {
    const $input = $(input);
    const id = $input.attr('id');
    const type = $input.attr('type');
    const name = $input.attr('name');
    
    const hasLabel = id && $(`label[for="${id}"]`).length > 0;
    const hasAriaLabel = $input.attr('aria-label');
    const hasAriaLabelledBy = $input.attr('aria-labelledby');
    
    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push({
        type: 'missing-form-label',
        severity: 'high',
        element: $.html($input),
        inputType: type || 'text',
        inputName: name || 'unnamed',
        needsAI: true
      });
    }
  });

  // Check for empty links
  $('a[href]').each((i, link) => {
    const $link = $(link);
    const text = $link.text().trim();
    const ariaLabel = $link.attr('aria-label');
    
    if (!text && !ariaLabel) {
      issues.push({
        type: 'empty-link',
        severity: 'high',
        element: $.html($link),
        href: $link.attr('href'),
        needsAI: true
      });
    }
  });

  // Check heading structure
  const headings = $('h1, h2, h3, h4, h5, h6').toArray();
  if (headings.length === 0) {
    issues.push({
      type: 'missing-headings',
      severity: 'medium',
      element: '<body>',
      needsAI: true
    });
  } else {
    // Check for proper heading hierarchy
    const levels = headings.map(h => parseInt(h.tagName.charAt(1)));
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] - levels[i - 1] > 1) {
        issues.push({
          type: 'improper-heading-structure',
          severity: 'medium',
          element: $.html(headings[i]),
          needsAI: true
        });
        break;
      }
    }
  }

  // Check for missing page title
  const title = $('title').text().trim();
  if (!title) {
    issues.push({
      type: 'missing-page-title',
      severity: 'high',
      element: '<title></title>',
      needsAI: true
    });
  }

  // Check for missing lang attribute
  const lang = $('html').attr('lang');
  if (!lang) {
    issues.push({
      type: 'missing-lang-attribute',
      severity: 'medium',
      element: '<html>',
      needsAI: true
    });
  }

  return issues;
}

// Helper function to generate AI content for issues
async function enhanceIssuesWithAI(issues) {
  const enhancedIssues = [];

  for (const issue of issues) {
    let aiContent = {};

    try {
      switch (issue.type) {
        case 'missing-alt-text':
          const altTextPrompt = `Generate descriptive alt text for an image with src="${issue.src}". The alt text should be concise (under 125 characters) and describe what the image shows. Only return the alt text, nothing else.`;
          aiContent.suggestedAltText = await callTogetherAI(altTextPrompt, 50);
          
          const altExplanationPrompt = `Explain in simple terms why alt text is important for web accessibility. Keep it under 100 words and focus on how it helps users with visual impairments.`;
          aiContent.explanation = await callTogetherAI(altExplanationPrompt, 100);
          
          aiContent.fixedCode = issue.element.replace('>', ` alt="${aiContent.suggestedAltText || 'Descriptive alt text'}">`);
          break;

        case 'missing-form-label':
          const labelPrompt = `Generate a clear, descriptive label for a form input of type "${issue.inputType}" with name "${issue.inputName}". Only return the label text, nothing else.`;
          aiContent.suggestedLabel = await callTogetherAI(labelPrompt, 30);
          
          const labelExplanationPrompt = `Explain why form labels are crucial for accessibility. Keep it under 100 words and focus on screen reader users.`;
          aiContent.explanation = await callTogetherAI(labelExplanationPrompt, 100);
          
          const inputId = `input-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          aiContent.fixedCode = `<label for="${inputId}">${aiContent.suggestedLabel || 'Input Label'}</label>\n${issue.element.replace('>', ` id="${inputId}">`)}`;
          break;

        case 'empty-link':
          const linkPrompt = `Generate descriptive link text for a link with href="${issue.href}". The text should clearly indicate where the link goes. Only return the link text, nothing else.`;
          aiContent.suggestedText = await callTogetherAI(linkPrompt, 30);
          
          const linkExplanationPrompt = `Explain why links need descriptive text for accessibility. Keep it under 100 words.`;
          aiContent.explanation = await callTogetherAI(linkExplanationPrompt, 100);
          
          aiContent.fixedCode = issue.element.replace('></a>', `>${aiContent.suggestedText || 'Descriptive link text'}</a>`);
          break;

        case 'missing-headings':
          const headingExplanationPrompt = `Explain why proper heading structure (h1, h2, h3, etc.) is important for web accessibility. Keep it under 100 words.`;
          aiContent.explanation = await callTogetherAI(headingExplanationPrompt, 100);
          
          aiContent.fixedCode = `<h1>Main Page Title</h1>\n<h2>Section Heading</h2>\n<h3>Subsection Heading</h3>`;
          break;

        case 'improper-heading-structure':
          const headingStructurePrompt = `Explain why heading levels shouldn't skip numbers (like going from h2 to h4). Keep it under 100 words.`;
          aiContent.explanation = await callTogetherAI(headingStructurePrompt, 100);
          
          aiContent.fixedCode = issue.element.replace(/h[4-6]/g, 'h3');
          break;

        case 'missing-page-title':
          const titleExplanationPrompt = `Explain why every web page needs a descriptive title element. Keep it under 100 words.`;
          aiContent.explanation = await callTogetherAI(titleExplanationPrompt, 100);
          
          aiContent.fixedCode = `<title>Descriptive Page Title - Website Name</title>`;
          break;

        case 'missing-lang-attribute':
          const langExplanationPrompt = `Explain why the html element needs a lang attribute for accessibility. Keep it under 100 words.`;
          aiContent.explanation = await callTogetherAI(langExplanationPrompt, 100);
          
          aiContent.fixedCode = `<html lang="en">`;
          break;

        default:
          aiContent.explanation = 'This accessibility issue should be addressed to improve user experience.';
          aiContent.fixedCode = issue.element;
      }
    } catch (error) {
      console.error(`Failed to generate AI content for ${issue.type}:`, error);
      aiContent.explanation = 'This accessibility issue should be addressed to improve user experience.';
      aiContent.fixedCode = issue.element;
    }

    enhancedIssues.push({
      ...issue,
      ...aiContent
    });
  }

  return enhancedIssues;
}

// Main analyze endpoint
app.post('/analyze', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    console.log(`Analyzing website: ${url}`);

    // Fetch website HTML
    const html = await fetchWebsiteHTML(url);
    
    // Parse HTML with Cheerio
    const $ = cheerio.load(html);
    
    // Analyze accessibility issues
    const rawIssues = analyzeAccessibility($, url);
    
    // Enhance issues with AI-generated content
    const enhancedIssues = await enhanceIssuesWithAI(rawIssues);
    
    // Calculate accessibility score
    const totalIssues = enhancedIssues.length;
    const criticalCount = enhancedIssues.filter(i => i.severity === 'critical').length;
    const highCount = enhancedIssues.filter(i => i.severity === 'high').length;
    const mediumCount = enhancedIssues.filter(i => i.severity === 'medium').length;
    const lowCount = enhancedIssues.filter(i => i.severity === 'low').length;
    
    let score = 100;
    score -= criticalCount * 25;
    score -= highCount * 15;
    score -= mediumCount * 8;
    score -= lowCount * 3;
    score = Math.max(0, score);

    // Calculate estimated fix time
    const estimatedMinutes = enhancedIssues.reduce((total, issue) => {
      const timeMap = { critical: 30, high: 20, medium: 10, low: 5 };
      return total + timeMap[issue.severity];
    }, 0);
    
    const estimatedFixTime = estimatedMinutes < 60 
      ? `${estimatedMinutes} minutes`
      : `${Math.round(estimatedMinutes / 60)} hours`;

    const report = {
      url,
      analyzedAt: new Date().toISOString(),
      overallScore: score,
      issueCount: {
        critical: criticalCount,
        high: highCount,
        medium: mediumCount,
        low: lowCount
      },
      issues: enhancedIssues,
      estimatedFixTime,
      totalIssues
    };

    res.json(report);

  } catch (error) {
    console.error('Analysis failed:', error);
    res.status(500).json({ 
      error: 'Failed to analyze website',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Accessibility Tester Backend running on port ${PORT}`);
  console.log(`🔑 Together.ai API Key: ${TOGETHER_API_KEY ? 'Configured' : 'Missing'}`);
});