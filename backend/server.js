const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// AI Analysis Service
class AIAnalysisService {
  constructor() {
    this.togetherApiKey = process.env.TOGETHER_API_KEY;
    this.groqApiKey = process.env.GROQ_API_KEY;
  }

  // Create the analysis prompt for the AI model
  createAnalysisPrompt(idea) {
    return `
Act as a startup business analyst. Analyze this startup idea and respond with ONLY a JSON object:

IDEA: "${idea}"

JSON Response Format:
{
  "feasibilityScore": <number 0-100 based on market viability>,
  "targetAudience": "<specific demographics and pain points>",
  "competitors": ["<real competitor 1>", "<real competitor 2>", "<indirect competitor>"],
  "monetizationStrategies": ["<revenue model 1>", "<revenue model 2>", "<revenue model 3>"],
  "suggestedTechStack": ["<frontend tech>", "<backend tech>", "<database>", "<cloud platform>"]
}

Requirements:
- Feasibility score: Consider market size, competition, technical difficulty, and business model viability
- Target audience: Be specific about demographics, income, location, and pain points
- Competitors: Name actual companies, not generic descriptions
- Monetization: Suggest 3 different revenue models
- Tech stack: Modern, scalable technologies appropriate for this business

JSON only:`;
  }

  // Call Together.ai API
  async callTogetherAI(prompt) {
    try {
      const response = await axios.post(
        'https://api.together.xyz/v1/chat/completions',
        {
          model: 'mistralai/Mistral-7B-Instruct-v0.1',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.togetherApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Together.ai API error:', error.response?.data || error.message);
      throw new Error('Failed to get analysis from Together.ai');
    }
  }

  // Call Groq API
  async callGroqAI(prompt) {
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.groqApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Groq API error:', error.response?.data || error.message);
      throw new Error('Failed to get analysis from Groq');
    }
  }

  // Main analysis method
  async analyzeIdea(idea) {
    const prompt = this.createAnalysisPrompt(idea);
    let aiResponse;

    // Try Together.ai first, then Groq as fallback
    if (this.togetherApiKey) {
      aiResponse = await this.callTogetherAI(prompt);
    } else if (this.groqApiKey) {
      aiResponse = await this.callGroqAI(prompt);
    } else {
      throw new Error('No API key configured. Please set TOGETHER_API_KEY or GROQ_API_KEY in your .env file');
    }

    // Parse the AI response
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        return this.validateAndCleanResponse(parsedResponse);
      } else {
        throw new Error('No valid JSON found in AI response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      // Return a fallback response
      return this.getFallbackResponse(idea);
    }
  }

  // Validate and clean the AI response
  validateAndCleanResponse(response) {
    // Handle targetAudience - convert object to string if needed
    let targetAudience = response.targetAudience || 'General consumers';
    if (typeof targetAudience === 'object' && targetAudience !== null) {
      // Convert object to readable string
      const parts = [];
      if (targetAudience.demographics) parts.push(`Demographics: ${targetAudience.demographics}`);
      if (targetAudience.income) parts.push(`Income: ${targetAudience.income}`);
      if (targetAudience.location) parts.push(`Location: ${targetAudience.location}`);
      if (targetAudience.painPoints) parts.push(`Pain Points: ${targetAudience.painPoints}`);
      targetAudience = parts.join(', ') || 'General consumers';
    }

    return {
      feasibilityScore: Math.min(100, Math.max(0, response.feasibilityScore || 50)),
      targetAudience: targetAudience,
      competitors: Array.isArray(response.competitors) ? response.competitors.slice(0, 3) : ['Unknown competitors'],
      monetizationStrategies: Array.isArray(response.monetizationStrategies) ? response.monetizationStrategies.slice(0, 2) : ['Subscription model', 'Freemium model'],
      suggestedTechStack: Array.isArray(response.suggestedTechStack) ? response.suggestedTechStack.slice(0, 4) : ['React', 'Node.js', 'MongoDB', 'AWS']
    };
  }

  // Fallback response if AI parsing fails
  getFallbackResponse(idea) {
    return {
      feasibilityScore: 65,
      targetAudience: 'Target audience based on the idea characteristics',
      competitors: ['Market leader in similar space', 'Emerging competitor', 'Indirect competitor'],
      monetizationStrategies: ['Subscription model', 'Transaction fees'],
      suggestedTechStack: ['React', 'Node.js', 'PostgreSQL', 'AWS']
    };
  }
}

// Initialize AI service
const aiService = new AIAnalysisService();

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Startup Idea Validator API',
    version: '1.0.0',
    endpoints: {
      analyze: 'POST /analyze'
    }
  });
});

// Main analysis endpoint
app.post('/analyze', async (req, res) => {
  try {
    const { idea } = req.body;

    // Validate input
    if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Please provide a valid startup idea' 
      });
    }

    if (idea.length > 1000) {
      return res.status(400).json({ 
        error: 'Startup idea is too long. Please keep it under 1000 characters.' 
      });
    }

    console.log('Analyzing startup idea...');

    // Get AI analysis
    const analysis = await aiService.analyzeIdea(idea);

    // Add metadata
    const response = {
      ...analysis,
      timestamp: new Date().toISOString(),
      originalIdea: idea
    };

    res.json(response);

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze startup idea. Please try again later.',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    availableEndpoints: ['GET /', 'POST /analyze', 'GET /health']
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Startup Idea Validator API running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 AI Provider: ${process.env.TOGETHER_API_KEY ? 'Together.ai' : process.env.GROQ_API_KEY ? 'Groq' : 'None configured'}`);
});

module.exports = app;
