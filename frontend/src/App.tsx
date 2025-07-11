import './App.css';
import IdeaValidator from './components/IdeaValidator';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">🚀 Startup Idea Validator</h1>
        <p className="App-subtitle">
          Get AI-powered analysis of your startup ideas
        </p>
      </header>
      <main className="App-main">
        <IdeaValidator />
      </main>
      <footer className="App-footer">
        <p>Powered by AI • Built with React & Node.js</p>
      </footer>
    </div>
  );
}

export default App;
