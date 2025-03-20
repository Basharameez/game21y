// Game data
const challenges = {
  java: {
    beginner: {
      title: 'Hello World in Java',
      description: 'Create a simple program that prints "Hello world!" to the console.',
      starterCode: 'public class HelloWorld {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}',
      expectedOutput: 'Hello world!'
    },
    medium: {
      title: 'FizzBuzz in Java',
      description: 'Print numbers from 1 to 15. For multiples of 3, print "Fizz". For multiples of 5, print "Buzz". For multiples of both, print "FizzBuzz".',
      starterCode: 'public class FizzBuzz {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}',
      expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz'
    },
    advanced: {
      title: 'Palindrome Checker in Java',
      description: 'Create a function that checks if a given string is a palindrome (reads the same forwards and backwards).',
      starterCode: 'public class PalindromeChecker {\n    public static void main(String[] args) {\n        // Check if "racecar" is a palindrome\n        // Your code here\n    }\n\n    // Create your palindrome checking method here\n}',
      expectedOutput: 'racecar is a palindrome'
    }
  },
  python: {
    beginner: {
      title: 'Hello World in Python',
      description: 'Create a simple program that prints "Hello world!" to the console.',
      starterCode: '# Your code here',
      expectedOutput: 'Hello world!'
    },
    medium: {
      title: 'FizzBuzz in Python',
      description: 'Print numbers from 1 to 15. For multiples of 3, print "Fizz". For multiples of 5, print "Buzz". For multiples of both, print "FizzBuzz".',
      starterCode: '# Your code here',
      expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz'
    },
    advanced: {
      title: 'Palindrome Checker in Python',
      description: 'Create a function that checks if a given string is a palindrome (reads the same forwards and backwards).',
      starterCode: '# Check if "racecar" is a palindrome\n# Your code here',
      expectedOutput: 'racecar is a palindrome'
    }
  },
  'c++': {
    beginner: {
      title: 'Hello World in C++',
      description: 'Create a simple program that prints "Hello world!" to the console.',
      starterCode: '#include <iostream>\n\nint main() {\n    // Your code here\n    return 0;\n}',
      expectedOutput: 'Hello world!'
    },
    medium: {
      title: 'FizzBuzz in C++',
      description: 'Print numbers from 1 to 15. For multiples of 3, print "Fizz". For multiples of 5, print "Buzz". For multiples of both, print "FizzBuzz".',
      starterCode: '#include <iostream>\n\nint main() {\n    // Your code here\n    return 0;\n}',
      expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz'
    },
    advanced: {
      title: 'Palindrome Checker in C++',
      description: 'Create a function that checks if a given string is a palindrome (reads the same forwards and backwards).',
      starterCode: '#include <iostream>\n#include <string>\n\n// Create your palindrome checking function here\n\nint main() {\n    // Check if "racecar" is a palindrome\n    // Your code here\n    return 0;\n}',
      expectedOutput: 'racecar is a palindrome'
    }
  }
};

// Game state
const gameState = {
  language: null,
  difficulty: null,
  code: '',
  gameStatus: 'selecting-language', // selecting-language, selecting-difficulty, showing-rules, coding, completed, failed
  timeRemaining: 300,
  compileStatus: 'idle', // idle, compiling, success, error
  compileOutput: '',
  compileError: '',
  expectedOutput: '',
  completedLevels: {},
  timer: null
};

// DOM elements
const screens = {
  languageSelector: document.getElementById('language-selector'),
  difficultySelector: document.getElementById('difficulty-selector'),
  gameRules: document.getElementById('game-rules'),
  codeEditor: document.getElementById('code-editor-screen'),
  resultSuccess: document.getElementById('result-success'),
  resultFailure: document.getElementById('result-failure')
};

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
});

// Event listeners
function setupEventListeners() {
  // Language selection
  const languageCards = document.querySelectorAll('#language-selector .card');
  languageCards.forEach(card => {
    card.addEventListener('click', () => {
      const language = card.getAttribute('data-language');
      selectLanguage(language);
    });
  });

  // Back buttons
  const backToDifficultyBtn = document.querySelector('#game-rules .back-button');
  backToDifficultyBtn.addEventListener('click', () => {
    showScreen('selecting-difficulty');
  });

  const backToLanguageBtn = document.querySelector('#difficulty-selector .back-button');
  backToLanguageBtn.addEventListener('click', () => {
    showScreen('selecting-language');
  });

  // Difficulty selection
  const difficultyCards = document.querySelectorAll('#difficulty-selector .card');
  difficultyCards.forEach(card => {
    card.addEventListener('click', () => {
      const difficulty = card.getAttribute('data-difficulty');
      selectDifficulty(difficulty);
    });
  });

  // Start challenge button
  const startChallengeBtn = document.getElementById('start-challenge');
  startChallengeBtn.addEventListener('click', startGame);

  // Preview toggle
  const previewToggleBtn = document.getElementById('preview-toggle');
  previewToggleBtn.addEventListener('click', togglePreview);

  // Compile button
  const compileBtn = document.getElementById('compile-button');
  compileBtn.addEventListener('click', compileCode);

  // Submit button
  const submitBtn = document.getElementById('submit-button');
  submitBtn.addEventListener('click', submitCode);

  // Restart buttons
  const restartBtns = document.querySelectorAll('#restart-button, #restart-button-failure');
  restartBtns.forEach(btn => {
    btn.addEventListener('click', resetGame);
  });

  // Next level button
  const nextLevelBtn = document.getElementById('next-level-button');
  nextLevelBtn.addEventListener('click', handleNextLevel);
}

// Game functions
function selectLanguage(language) {
  gameState.language = language;
  showScreen('selecting-difficulty');
  
  // Update completed levels indicators
  updateCompletedLevels();
}

function selectDifficulty(difficulty) {
  gameState.difficulty = difficulty;
  showScreen('showing-rules');
  
  // Load challenge details
  loadChallengeDetails();
}

function loadChallengeDetails() {
  const challenge = challenges[gameState.language][gameState.difficulty];
  
  // Update challenge info on rules screen
  document.getElementById('challenge-title').textContent = challenge.title;
  document.getElementById('challenge-description').textContent = challenge.description;
  
  // Update editor info
  document.getElementById('editor-challenge-title').textContent = challenge.title;
  document.getElementById('editor-challenge-description').textContent = challenge.description;
  document.getElementById('language-indicator').textContent = gameState.language;
  
  // Set expected output
  document.getElementById('expected-output').textContent = challenge.expectedOutput;
  gameState.expectedOutput = challenge.expectedOutput;
  
  // Set starter code
  document.getElementById('code-area').value = challenge.starterCode;
  gameState.code = challenge.starterCode;
}

function startGame() {
  gameState.timeRemaining = 300; // 5 minutes
  gameState.compileStatus = 'idle';
  gameState.compileOutput = '';
  gameState.compileError = '';
  
  showScreen('coding');
  startTimer();
  
  // Reset compile states
  document.querySelectorAll('.compile-state').forEach(el => {
    el.classList.remove('active');
  });
  document.getElementById('compile-idle').classList.add('active');
  
  // Reset submit button
  document.getElementById('submit-button').disabled = true;
  
  // Hide preview
  document.getElementById('preview-area').classList.remove('active');
  document.getElementById('output-area').classList.add('active');
  document.getElementById('preview-toggle').innerHTML = '<i data-lucide="play"></i> Show Preview';
  lucide.createIcons();
}

function resetGame() {
  gameState.language = null;
  gameState.difficulty = null;
  gameState.code = '';
  gameState.compileStatus = 'idle';
  gameState.compileOutput = '';
  gameState.compileError = '';
  
  // Stop timer if running
  if (gameState.timer) {
    clearInterval(gameState.timer);
    gameState.timer = null;
  }
  
  showScreen('selecting-language');
}

function togglePreview() {
  const previewArea = document.getElementById('preview-area');
  const outputArea = document.getElementById('output-area');
  const toggleBtn = document.getElementById('preview-toggle');
  
  if (previewArea.classList.contains('active')) {
    previewArea.classList.remove('active');
    outputArea.classList.add('active');
    toggleBtn.innerHTML = '<i data-lucide="play"></i> Show Preview';
  } else {
    previewArea.classList.add('active');
    outputArea.classList.remove('active');
    toggleBtn.innerHTML = '<i data-lucide="play"></i> Hide Preview';
  }
  
  lucide.createIcons();
}

function compileCode() {
  const codeArea = document.getElementById('code-area');
  gameState.code = codeArea.value;
  
  // Update compile status
  gameState.compileStatus = 'compiling';
  updateCompileUI();
  
  // Simulate compilation (1 second delay)
  setTimeout(() => {
    try {
      let output = '';
      let error = '';
      
      // Simple syntax check and output generation
      if (gameState.language === 'java') {
        if (!gameState.code.includes('System.out.println') || !gameState.code.includes('public static void main')) {
          error = 'Syntax error: Missing proper Java structure or print statement';
        } else {
          // Extract content from println
          const match = gameState.code.match(/System\.out\.println\("(.*)"\)/);
          if (match && match[1]) {
            output = match[1];
          } else {
            output = 'Hello world!'; // Default for demo
          }
        }
      } else if (gameState.language === 'python') {
        if (!gameState.code.includes('print')) {
          error = 'Syntax error: Missing print statement';
        } else {
          const match = gameState.code.match(/print\("(.*)"\)/);
          if (match && match[1]) {
            output = match[1];
          } else {
            output = 'Hello world!'; // Default for demo
          }
        }
      } else if (gameState.language === 'c++') {
        if (!gameState.code.includes('cout') || !gameState.code.includes('main')) {
          error = 'Syntax error: Missing proper C++ structure or output statement';
        } else {
          const match = gameState.code.match(/cout\s*<<\s*"(.*)"/);
          if (match && match[1]) {
            output = match[1];
          } else {
            output = 'Hello world!'; // Default for demo
          }
        }
      }
      
      if (error) {
        gameState.compileStatus = 'error';
        gameState.compileError = error;
        gameState.compileOutput = '';
      } else {
        gameState.compileStatus = 'success';
        gameState.compileOutput = output;
        gameState.compileError = '';
      }
      
      updateCompileUI();
    } catch (err) {
      gameState.compileStatus = 'error';
      gameState.compileError = 'An unexpected error occurred during compilation';
      gameState.compileOutput = '';
      updateCompileUI();
    }
  }, 1000);
}

function updateCompileUI() {
  // Hide all compile states
  document.querySelectorAll('.compile-state').forEach(el => {
    el.classList.remove('active');
  });
  
  // Show appropriate state
  if (gameState.compileStatus === 'idle') {
    document.getElementById('compile-idle').classList.add('active');
    document.getElementById('submit-button').disabled = true;
  } else if (gameState.compileStatus === 'compiling') {
    document.getElementById('compile-loading').classList.add('active');
    document.getElementById('submit-button').disabled = true;
  } else if (gameState.compileStatus === 'error') {
    document.getElementById('compile-error').classList.add('active');
    document.getElementById('error-output').textContent = gameState.compileError;
    document.getElementById('submit-button').disabled = true;
  } else if (gameState.compileStatus === 'success') {
    document.getElementById('compile-success').classList.add('active');
    document.getElementById('code-output').textContent = gameState.compileOutput;
    document.getElementById('submit-button').disabled = false;
    
    // Check if output matches expected
    const matchIndicator = document.getElementById('match-indicator');
    const outputMatches = gameState.compileOutput === gameState.expectedOutput;
    
    matchIndicator.innerHTML = outputMatches 
      ? '<i data-lucide="check"></i> Yes' 
      : '<i data-lucide="x-circle"></i> No';
    
    matchIndicator.className = outputMatches ? 'match' : 'no-match';
    
    lucide.createIcons();
  }
}

function submitCode() {
  if (gameState.compileStatus !== 'success') {
    gameState.gameStatus = 'failed';
    showScreen('failed');
    return;
  }
  
  // Check if output matches expected output
  if (gameState.compileOutput === gameState.expectedOutput) {
    // Mark level as completed
    gameState.completedLevels[`${gameState.language}-${gameState.difficulty}`] = true;
    showScreen('completed');
  } else {
    showScreen('failed');
  }
  
  // Stop the timer
  if (gameState.timer) {
    clearInterval(gameState.timer);
    gameState.timer = null;
  }
}

function handleNextLevel() {
  // Simple logic to move to next difficulty
  if (gameState.difficulty === 'beginner') {
    gameState.difficulty = 'medium';
    showScreen('showing-rules');
  } else if (gameState.difficulty === 'medium') {
    gameState.difficulty = 'advanced';
    showScreen('showing-rules');
  } else {
    // If already at advanced, just show the selection screen
    showScreen('selecting-difficulty');
  }
  
  // Load challenge details for the new difficulty
  loadChallengeDetails();
}

function showScreen(screenName) {
  // Hide all screens
  Object.values(screens).forEach(screen => {
    screen.classList.remove('active');
  });
  
  // Show requested screen
  gameState.gameStatus = screenName;
  
  switch (screenName) {
    case 'selecting-language':
      screens.languageSelector.classList.add('active');
      break;
    case 'selecting-difficulty':
      screens.difficultySelector.classList.add('active');
      updateCompletedLevels();
      break;
    case 'showing-rules':
      screens.gameRules.classList.add('active');
      break;
    case 'coding':
      screens.codeEditor.classList.add('active');
      break;
    case 'completed':
      screens.resultSuccess.classList.add('active');
      break;
    case 'failed':
      screens.resultFailure.classList.add('active');
      break;
  }
}

function startTimer() {
  // Reset time display
  updateTimeDisplay();
  
  // Clear any existing timer
  if (gameState.timer) {
    clearInterval(gameState.timer);
  }
  
  // Start countdown
  gameState.timer = setInterval(() => {
    gameState.timeRemaining--;
    
    // Update display
    updateTimeDisplay();
    
    // Check if time's up
    if (gameState.timeRemaining <= 0) {
      clearInterval(gameState.timer);
      showScreen('failed');
    }
  }, 1000);
}

function updateTimeDisplay() {
  const minutes = Math.floor(gameState.timeRemaining / 60);
  const seconds = gameState.timeRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  const timeDisplay = document.getElementById('time-display');
  timeDisplay.textContent = formattedTime;
  
  // Add warning class when time is running low
  const timerElement = document.querySelector('.timer');
  if (gameState.timeRemaining <= 60) {
    timerElement.classList.add('warning');
  } else {
    timerElement.classList.remove('warning');
  }
}

function updateCompletedLevels() {
  if (!gameState.language) return;
  
  // Check if each difficulty level has been completed
  const difficultyCards = document.querySelectorAll('#difficulty-selector .card');
  
  difficultyCards.forEach(card => {
    const difficulty = card.getAttribute('data-difficulty');
    const levelKey = `${gameState.language}-${difficulty}`;
    const isCompleted = gameState.completedLevels[levelKey];
    
    // Find the check icon element
    const checkIcon = card.querySelector('.check-icon');
    
    // If it doesn't exist, create one
    if (!checkIcon && isCompleted) {
      const icon = document.createElement('div');
      icon.className = 'check-icon';
      icon.innerHTML = '<i data-lucide="check-circle"></i>';
      card.appendChild(icon);
      lucide.createIcons();
    }
  });
}

// Initialize the game
setupEventListeners();
