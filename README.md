# 🚀 Startup Idea Validator

An AI-powered web application that helps entrepreneurs validate their startup ideas by providing structured business analysis using advanced language models.

## 🎯 Features

- **AI-Powered Analysis**: Uses cloud-based LLMs (Together.ai or Groq) for intelligent startup idea evaluation
- **Comprehensive Metrics**: 
  - Feasibility Score (0-100)
  - Target Audience Analysis
  - Competitor Identification
  - Monetization Strategies
  - Tech Stack Suggestions
- **PDF Export**: Export analysis results to professionally formatted PDF documents
- **Modern UI**: Clean, responsive design with real-time feedback
- **Cloud-Ready**: Optimized for deployment on Vercel (frontend) and Render (backend)

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Axios** for API communication
- **Modern CSS** with responsive design
- **Component-based architecture**

### Backend
- **Node.js** with Express.js
- **Together.ai** API integration
- **CORS** enabled for cross-origin requests
- **Environment-based configuration**

## 📦 Project Structure

```
startup-idea-validator/
├── frontend/                    # Vite React TypeScript frontend
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── IdeaValidator.tsx
│   │   │   ├── ResultCard.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── *.css           # Component styles
│   │   ├── App.tsx             # Main application component
│   │   ├── App.css             # Global styles
│   │   └── main.tsx            # Application entry point
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.ts          # Vite configuration
│   └── index.html              # HTML template
├── backend/                     # Express.js backend API
│   ├── server.js               # Main server file
│   ├── package.json            # Backend dependencies
│   └── .env                    # Environment variables
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- API key from Together.ai

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd startup-idea-validator
```

### 2. Setup Backend
```bash
cd backend
npm install

# Copy environment file and add your API keys
cp .env
# Edit .env file with your API keys
```

### 3. Setup Frontend
```bash
cd frontend
npm install
```

### 4. Get API Keys

#### Together.ai
1. Visit [Together.ai](https://api.together.xyz/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add to backend/.env: `TOGETHER_API_KEY=your_key_here`


### 5. Run the Application

Start the backend server:
```bash
cd backend
npm start
```

Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. Push your `frontend` folder to GitHub
2. Connect your GitHub repo to Vercel
3. Set the root directory to `frontend`
4. Set the build command to `npm run build`
5. Set the output directory to `dist`
6. Update the API URL in the environment variables: `VITE_API_URL=https://your-backend-url.render.com`
7. Deploy!

### Backend Deployment (Render)

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repo
4. Set the following:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**:
     - `TOGETHER_API_KEY=your_together_api_key`
     - `FRONTEND_URL=https://your-frontend-url.vercel.app`
     - `NODE_ENV=production`
5. Deploy!

## 📝 API Documentation

### POST /analyze
Analyzes a startup idea and returns structured feedback.

**Request Body:**
```json
{
  "idea": "Your startup idea description here..."
}
```

**Response:**
```json
{
  "feasibilityScore": 75,
  "targetAudience": "Young professionals aged 25-35",
  "competitors": ["Competitor 1", "Competitor 2", "Competitor 3"],
  "monetizationStrategies": ["Subscription model", "Freemium with premium features"],
  "suggestedTechStack": ["React", "Node.js", "MongoDB", "AWS"],
  "timestamp": "2024-01-15T10:30:00.000Z",
  "originalIdea": "Your original idea..."
}
```

### GET /health
Health check endpoint for monitoring.

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```bash
# Choose one AI provider
TOGETHER_API_KEY=your_together_api_key

# Server config
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend:**
The frontend uses environment variables for configuration. Create a `.env` file in the `frontend` directory for local development:
```bash
VITE_API_URL=http://localhost:5000
```

For production deployment, set the environment variable in your hosting platform (e.g., Vercel): `VITE_API_URL=https://your-backend-url.render.com`

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `FRONTEND_URL` is set correctly in backend .env
2. **API Key Issues**: Verify your API key is valid and has sufficient credits
3. **Network Errors**: Check that both frontend and backend are running
4. **Build Errors**: Ensure all dependencies are installed with `npm install`


## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Together.ai](https://together.ai/) for providing accessible AI models
- [React](https://reactjs.org/) for the frontend framework
- [Vite](https://vitejs.dev/) for fast development tooling
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Express.js](https://expressjs.com/) for the backend framework

---

**Happy validating! 🚀**