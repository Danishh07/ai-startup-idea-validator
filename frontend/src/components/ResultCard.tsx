import React, { useState } from 'react';
import './ResultCard.css';
import { exportToPDF } from '../utils/pdfExport';

interface AnalysisResult {
  feasibilityScore: number;
  targetAudience: string;
  competitors: string[];
  monetizationStrategies: string[];
  suggestedTechStack: string[];
  timestamp: string;
  originalIdea: string;
}

interface ResultCardProps {
  result: AnalysisResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [isExporting, setIsExporting] = useState(false);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFeasibilityColor = (score: number) => {
    if (score >= 80) return 'var(--success-color)';
    if (score >= 60) return 'var(--warning-color)';
    return 'var(--danger-color)';
  };

  const getFeasibilityLabel = (score: number) => {
    if (score >= 80) return 'High';
    if (score >= 60) return 'Moderate';
    return 'Low';
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF(result, result.originalIdea);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="result-card" data-testid="result-card">
      <div className="result-header">
        <div className="result-header-content">
          <h2 className="result-title">📊 Analysis Results</h2>
          <div className="result-timestamp">
            Analyzed on {formatDate(result.timestamp)}
          </div>
        </div>
        <button 
          className="export-pdf-btn"
          onClick={handleExportPDF}
          disabled={isExporting}
          title="Export to PDF"
        >
          {isExporting ? '⏳' : '📄'} {isExporting ? 'Exporting...' : 'Export PDF'}
        </button>
      </div>

      <div className="result-content">
        {/* Feasibility Score */}
        <div className="metric-section">
          <h3 className="metric-title">🎯 Feasibility Score</h3>
          <div className="feasibility-score-container">
            <div className="feasibility-score-circle">
              <div 
                className="feasibility-score-value" 
                style={{ color: getFeasibilityColor(result.feasibilityScore) }}
                data-testid="feasibility-score"
              >
                {result.feasibilityScore}
              </div>
              <div className="feasibility-score-label">
                {getFeasibilityLabel(result.feasibilityScore)}
              </div>
            </div>
          </div>
        </div>

        {/* Target Audience */}
        <div className="metric-section">
          <h3 className="metric-title">👥 Target Audience</h3>
          <p className="metric-value" data-testid="target-audience">
            {result.targetAudience}
          </p>
        </div>

        {/* Competitors */}
        <div className="metric-section">
          <h3 className="metric-title">🏆 Key Competitors</h3>
          <div className="competitors-list">
            {result.competitors.map((competitor, index) => (
              <span key={index} className="competitor-tag">
                {competitor}
              </span>
            ))}
          </div>
        </div>

        {/* Monetization Strategies */}
        <div className="metric-section">
          <h3 className="metric-title">💰 Monetization Strategies</h3>
          <ul className="strategy-list">
            {result.monetizationStrategies.map((strategy, index) => (
              <li key={index} className="strategy-item">
                {strategy}
              </li>
            ))}
          </ul>
        </div>

        {/* Suggested Tech Stack */}
        <div className="metric-section">
          <h3 className="metric-title">🛠️ Suggested Tech Stack</h3>
          <div className="tech-stack-grid">
            {result.suggestedTechStack.map((tech, index) => (
              <span key={index} className="tech-tag">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Original Idea */}
        <div className="metric-section">
          <h3 className="metric-title">💡 Your Original Idea</h3>
          <div className="original-idea">
            "{result.originalIdea}"
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
