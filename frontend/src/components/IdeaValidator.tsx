import { useState } from 'react';
import axios from 'axios';
import './IdeaValidator.css';
import ResultCard from './ResultCard';
import LoadingSpinner from './LoadingSpinner';

// TypeScript interfaces for API response
interface AnalysisResult {
  feasibilityScore: number;
  targetAudience: string;
  competitors: string[];
  monetizationStrategies: string[];
  suggestedTechStack: string[];
  timestamp: string;
  originalIdea: string;
}

interface ApiError {
  error: string;
  details?: string;
}

const IdeaValidator = () => {
  // State management
  const [idea, setIdea] = useState<string>('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // API configuration
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous results
    setResult(null);
    setError('');
    
    // Validate input
    if (!idea.trim()) {
      setError('Please enter a startup idea');
      return;
    }

    if (idea.length > 1000) {
      setError('Please keep your idea under 1000 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Make API call to backend
      const response = await axios.post<AnalysisResult>(`${API_BASE_URL}/analyze`, {
        idea: idea.trim()
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      });

      setResult(response.data);
    } catch (err) {
      console.error('Analysis error:', err);
      
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          const errorData = err.response.data as ApiError;
          setError(errorData.error || 'Invalid request');
        } else if (err.response?.status === 500) {
          const errorData = err.response.data as ApiError;
          setError(errorData.error || 'Server error. Please try again.');
        } else if (err.code === 'ECONNABORTED') {
          setError('Request timed out. Please try again.');
        } else if (err.code === 'ERR_NETWORK') {
          setError('Network error. Please check your connection and try again.');
        } else {
          setError('Failed to analyze idea. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle textarea input
  const handleIdeaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIdea(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  // Clear form
  const handleClear = () => {
    setIdea('');
    setResult(null);
    setError('');
  };

  return (
    <div className="idea-validator">
      <div className="validator-container">
        
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="validator-form">
          <div className="form-group">
            <label htmlFor="idea-input" className="form-label">
              💡 Describe your startup idea
            </label>
            <textarea
              id="idea-input"
              value={idea}
              onChange={handleIdeaChange}
              placeholder="e.g., An AI-powered app that helps people find the perfect recipe based on ingredients they have at home, dietary restrictions, and cooking time preferences..."
              className={`form-textarea ${error ? 'error' : ''}`}
              rows={6}
              disabled={isLoading}
            />
            <div className="character-count">
              {idea.length}/1000 characters
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={isLoading || !idea.trim()}
              className="btn btn-primary"
            >
              {isLoading ? 'Analyzing...' : '🔍 Validate Idea'}
            </button>
            
            {(idea || result) && (
              <button
                type="button"
                onClick={handleClear}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                🗑️ Clear
              </button>
            )}
          </div>
        </form>

        {/* Loading Spinner */}
        {isLoading && <LoadingSpinner />}

        {/* Results */}
        {result && !isLoading && (
          <ResultCard result={result} />
        )}

        {/* Help Section */}
        <div className="help-section">
          <h3>💡 Tips for better analysis:</h3>
          <ul>
            <li>Be specific about your target market</li>
            <li>Mention the problem you're solving</li>
            <li>Include your unique value proposition</li>
            <li>Describe the business model if you have one</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IdeaValidator;
