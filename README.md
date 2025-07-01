# AI-Powered Accessibility Tester

A comprehensive web application that analyzes websites for accessibility issues using AI and provides actionable solutions powered by Together.ai.

## Features

 **AI-Powered Analysis**
- Generates descriptive alt text for images using Together.ai
- Creates human-friendly explanations of accessibility issues
- Provides intelligent code suggestions to fix problems

 **Comprehensive Testing**
- Color contrast analysis
- Image alt text validation
- Form label checking
- Heading structure analysis
- Link accessibility
- WCAG compliance verification

 **Advanced Reporting**
- Accessibility score (0-100)
- Issue breakdown by severity (Critical, High, Medium, Low)
- Interactive charts and visualizations
- Downloadable reports
- Estimated fix times

 **Modern UI/UX**
- Responsive design for all devices
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Accessible interface (practicing what we preach!)

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- Lucide React for icons

**Backend:**
- Node.js with Express
- Together.ai API integration (Mixtral model)
- Cheerio for HTML parsing
- CORS enabled for cross-origin requests

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
npm run setup
```

### 2. Configure Together.ai API

1. Sign up for a Together.ai account at https://together.ai
2. Get your API key from the dashboard
3. Copy `backend/.env.example` to `backend/.env`
4. Add your Together.ai API key:

```env
TOGETHER_API_KEY=your_actual_api_key_here
PORT=3001
```

### 3. Start the Application

```bash
# Start both frontend and backend
npm run dev
```

This will start:
- Frontend on http://localhost:5173
- Backend on http://localhost:3001

### 4. Alternative: Start Separately

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
npm run dev:frontend
```

## API Endpoints

### POST /analyze
Analyzes a website for accessibility issues.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "analyzedAt": "2024-01-15T10:30:00.000Z",
  "overallScore": 75,
  "issueCount": {
    "critical": 2,
    "high": 3,
    "medium": 1,
    "low": 0
  },
  "issues": [
    {
      "type": "missing-alt-text",
      "severity": "high",
      "element": "<img src=\"logo.jpg\" />",
      "explanation": "AI-generated explanation...",
      "suggestedAltText": "Company logo with blue background",
      "fixedCode": "<img src=\"logo.jpg\" alt=\"Company logo with blue background\" />"
    }
  ],
  "estimatedFixTime": "45 minutes",
  "totalIssues": 6
}
```

### GET /health
Health check endpoint.

## How It Works

1. **URL Input**: User enters a website URL
2. **Content Fetching**: Backend fetches the website's HTML
3. **HTML Parsing**: Cheerio parses the DOM structure
4. **Issue Detection**: Custom rules identify accessibility problems
5. **AI Enhancement**: Together.ai generates explanations and fixes
6. **Report Generation**: Comprehensive report with scores and solutions
7. **Interactive Display**: Frontend shows results with charts and filters

## Accessibility Issues Detected

- **Missing Alt Text**: Images without descriptive alt attributes
- **Form Labels**: Input fields without proper labels
- **Empty Links**: Links with no accessible text
- **Heading Structure**: Improper heading hierarchy
- **Page Title**: Missing or empty page titles
- **Language Attribute**: Missing lang attribute on html element

## AI-Generated Content

The application uses Together.ai's Mixtral model to generate:

1. **Alt Text**: Descriptive text for images based on src attributes
2. **Explanations**: Plain-language descriptions of why issues matter
3. **Code Fixes**: Corrected HTML with proper accessibility attributes
4. **Form Labels**: Appropriate labels for form inputs
5. **Link Text**: Descriptive text for empty links

## Development

### Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HomePage.tsx
│   │   │   ├── ResultsPage.tsx
│   │   │   └── LoadingProgress.tsx
│   │   ├── hooks/
│   │   │   └── useAccessibilityAnalysis.ts
│   │   ├── types/
│   │   │   └── accessibility.ts
│   │   └── App.tsx
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md
```

### Adding New Issue Types

1. Add detection logic in `backend/server.js`
2. Update the `analyzeAccessibility` function
3. Add AI prompt handling in `enhanceIssuesWithAI`
4. Update TypeScript types in `src/types/accessibility.ts`

### Environment Variables

**Backend (.env):**
- `TOGETHER_API_KEY`: Your Together.ai API key
- `PORT`: Backend server port (default: 3001)

## Deployment

### Frontend
Deploy the frontend to any static hosting service (Netlify, Vercel, etc.):

```bash
npm run build
```

### Backend
Deploy the backend to any Node.js hosting service (Railway, Render, etc.):

```bash
cd backend
npm start
```

Make sure to set the `TOGETHER_API_KEY` environment variable in your hosting service.

## Demo

🔗 **Live Website**: [https://accessibility-ai.netlify.app/](https://accessibility-ai.netlify.app/)  
🎥 **YouTube Demo Video**: [https://youtu.be/xwL7rW4SrOM](https://youtu.be/xwL7rW4SrOM)


## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the GitHub issues
2. Review the Together.ai documentation
3. Ensure your API key is correctly configured

---

Built with ❤️ for web accessibility • Powered by Together.ai
