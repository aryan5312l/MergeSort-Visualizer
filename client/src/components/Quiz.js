import React, { useState } from 'react';
import './Quiz.css';

export const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const questions = [
    {
      question: "What is the time complexity of Merge Sort?",
      options: [
        "O(n)",
        "O(n log n)",
        "O(n²)",
        "O(log n)"
      ],
      correctAnswer: 1,
      explanation: "Merge Sort has a time complexity of O(n log n) because it divides the array into two halves (log n levels) and performs linear-time merging at each level."
    },
    {
      question: "What is the space complexity of Merge Sort?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      correctAnswer: 2,
      explanation: "Merge Sort requires O(n) extra space for the temporary arrays used during merging."
    },
    {
      question: "Which case of the Master Theorem applies to Merge Sort's recurrence T(n) = 2T(n/2) + n?",
      options: [
        "Case 1: f(n) is polynomially smaller than n^logb(a)",
        "Case 2: f(n) is equal to n^logb(a)",
        "Case 3: f(n) is polynomially larger than n^logb(a)",
        "None of the above"
      ],
      correctAnswer: 1,
      explanation: "For Merge Sort, a=2, b=2, and f(n)=n. logb(a) = log2(2) = 1, so f(n) = n = n^logb(a), making it Case 2."
    },
    {
      question: "What is the best-case time complexity of Merge Sort?",
      options: [
        "O(n)",
        "O(n log n)",
        "O(n²)",
        "Depends on the input"
      ],
      correctAnswer: 1,
      explanation: "Merge Sort always performs the same number of operations regardless of input order, making its best case O(n log n)."
    },
    {
      question: "How many levels of recursion does Merge Sort have for an array of size n?",
      options: [
        "log₂(n)",
        "n",
        "n/2",
        "n log n"
      ],
      correctAnswer: 0,
      explanation: "The array is divided in half at each level until reaching size 1, resulting in log₂(n) levels."
    }
  ];

  const handleAnswerClick = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(null);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
  };

  return (
    <div className="quiz-container">
      <h2>Merge Sort Quiz</h2>
      
      {showScore ? (
        <div className="score-section">
          <h3>Quiz Complete!</h3>
          <p>You scored {score} out of {questions.length}</p>
          <button onClick={resetQuiz}>Try Again</button>
        </div>
      ) : (
        <div className="question-section">
          <div className="question-count">
            <span>Question {currentQuestion + 1}</span>/{questions.length}
          </div>
          <div className="question-text">
            {questions[currentQuestion].question}
          </div>
          <div className="answer-options">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className={`answer-button ${
                  selectedAnswer === index ? 'selected' : ''
                } ${
                  selectedAnswer !== null
                    ? index === questions[currentQuestion].correctAnswer
                      ? 'correct'
                      : selectedAnswer === index
                      ? 'incorrect'
                      : ''
                    : ''
                }`}
                onClick={() => handleAnswerClick(index)}
                disabled={selectedAnswer !== null}
              >
                {option}
              </button>
            ))}
          </div>
          {selectedAnswer !== null && (
            <div className="explanation">
              <p>{questions[currentQuestion].explanation}</p>
              <button onClick={handleNextQuestion}>
                {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 