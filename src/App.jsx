import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import MoodSelectionPage from './pages/MoodSelectionPage';
import MoodExperiencePage from './pages/MoodExperiencePage';
import NotePage from './pages/NotePage';
import MoodAnalysisPage from './pages/MoodAnalysisPage';
import MusicExperiencePage from './pages/MusicExperiencePage';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [selectedMood, setSelectedMood] = useState(null);
  const [savedNote, setSavedNote] = useState({ noteText: '', inputMethod: 'text' });
  const [savedAnalysis, setSavedAnalysis] = useState(null);

  const handleStartJourney = () => setCurrentScreen('mood-selection');

  const handleBackToLanding = () => setCurrentScreen('landing');

  const handleSelectMood = (mood) => setSelectedMood(mood);

  const handleContinueToExperience = (mood) => {
    if (mood) setSelectedMood(mood);
    setCurrentScreen('mood-experience');
  };

  const handleChangeMood = () => setCurrentScreen('mood-selection');

  const handleGoToNote = () => setCurrentScreen('note');

  const handleNoteBack = () => setCurrentScreen('mood-experience');

  const handleNoteContinue = (payload) => {
    setSavedNote({
      noteText: payload.noteText,
      inputMethod: payload.inputMethod || 'text',
    });
    setCurrentScreen('mood-analysis');
  };

  const handleAnalysisBack = () => {
    setCurrentScreen('note');
  };

  const handleAnalysisContinue = (analysisData) => {
    setSavedAnalysis(analysisData);
    setCurrentScreen('music-experience');
  };

  const handleMusicBack = () => {
    setCurrentScreen('mood-analysis');
  };

  return (
    <div
      className={`min-h-screen text-slate-100 ${
        currentScreen === 'mood-experience' ||
        currentScreen === 'note' ||
        currentScreen === 'mood-analysis' ||
        currentScreen === 'music-experience'
          ? ''
          : 'bg-[#06070d]'
      }`}
    >
      {currentScreen === 'landing' && (
        <LandingPage onStartJourney={handleStartJourney} />
      )}

      {currentScreen === 'mood-selection' && (
        <MoodSelectionPage
          selectedMood={selectedMood}
          onSelectMood={handleSelectMood}
          onContinue={handleContinueToExperience}
          onBack={handleBackToLanding}
        />
      )}

      {currentScreen === 'mood-experience' && (
        <MoodExperiencePage
          selectedMood={selectedMood}
          onSelectMood={handleSelectMood}
          onChangeMood={handleChangeMood}
          onContinueNext={handleGoToNote}
        />
      )}

      {currentScreen === 'note' && (
        <NotePage
          selectedMood={selectedMood}
          initialNoteText={savedNote.noteText}
          initialInputMode={savedNote.inputMethod}
          onBack={handleNoteBack}
          onContinue={handleNoteContinue}
        />
      )}

      {currentScreen === 'mood-analysis' && (
        <MoodAnalysisPage
          selectedMood={selectedMood}
          noteText={savedNote.noteText}
          inputMethod={savedNote.inputMethod}
          onBack={handleAnalysisBack}
          onContinue={handleAnalysisContinue}
        />
      )}

      {currentScreen === 'music-experience' && (
        <MusicExperiencePage
          selectedMood={selectedMood}
          emotionalState={savedAnalysis?.emotionalState}
          suggestedExperience={savedAnalysis?.suggestedExperience}
          noteText={savedNote.noteText}
          onBack={handleMusicBack}
        />
      )}
    </div>
  );
}
