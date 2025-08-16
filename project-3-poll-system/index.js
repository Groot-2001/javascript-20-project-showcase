document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const pollForm = document.getElementById('poll-form');
  const pollResults = document.getElementById('poll-results');
  const resultsContainer = document.querySelector('.results-container');
  const votesCountEl = document.getElementById('votes-count');
  const shareButton = document.getElementById('share-button');

  // Poll Data
  let pollData = {
    javascript: 0,
    go: 0,
    python: 0,
    cpp: 0,
    totalVotes: 0
  };

  // Initialize from localStorage if available
  const savedData = localStorage.getItem('pollData');
  if (savedData) {
    pollData = JSON.parse(savedData);
    showResults(); // Show existing results if data exists
  }

  // Form Submission
  pollForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedOption = document.querySelector('input[name="programming-language"]:checked');

    if (!selectedOption) {
      showError('Please select an option before voting!');
      return;
    }

    // Update poll data
    pollData[selectedOption.value]++;
    pollData.totalVotes++;

    // Save to localStorage
    localStorage.setItem('pollData', JSON.stringify(pollData));

    // Show results
    showResults();

    // Reset form
    pollForm.reset();
  });

  // Show Results Function
  function showResults() {
    // Calculate percentages
    const results = {
      javascript: calculatePercentage(pollData.javascript),
      go: calculatePercentage(pollData.go),
      python: calculatePercentage(pollData.python),
      cpp: calculatePercentage(pollData.cpp)
    };

    // Update votes count
    votesCountEl.textContent = pollData.totalVotes;

    // Generate results HTML
    resultsContainer.innerHTML = `
      ${createResultBar('javascript', 'JavaScript', results.javascript)}
      ${createResultBar('go', 'Go', results.go)}
      ${createResultBar('python', 'Python', results.python)}
      ${createResultBar('cpp', 'C++', results.cpp)}
    `;

    // Animate result bars
    animateResultBars();

    // Show results section
    pollResults.hidden = false;
    pollResults.setAttribute('data-visible', 'true');

    // Scroll to results smoothly
    setTimeout(() => {
      pollResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 300);
  }

  // Helper: Calculate percentage
  function calculatePercentage(votes) {
    return pollData.totalVotes > 0 ? Math.round((votes / pollData.totalVotes) * 100) : 0;
  }

  // Helper: Create result bar HTML
  function createResultBar(id, language, percentage) {
    return `
      <div class="result-item">
        <div class="result-label">
          <span class="result-language">${language}</span>
          <span class="result-percentage">${percentage}%</span>
        </div>
        <div class="result-bar-container">
          <div class="result-bar" data-percentage="${percentage}" id="${id}-bar"></div>
        </div>
      </div>
    `;
  }

  // Helper: Animate result bars
  function animateResultBars() {
    document.querySelectorAll('.result-bar').forEach(bar => {
      const percentage = bar.getAttribute('data-percentage');
      bar.style.width = `${percentage}%`;
    });
  }

  // Helper: Show error message
  function showError(message) {
    // Remove any existing errors first
    const existingError = document.querySelector('.error-message');
    if (existingError) existingError.remove();

    // Create and show error
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    errorEl.style.cssText = `
      color: var(--error);
      background: rgba(214, 48, 49, 0.1);
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm);
      margin: 1rem 0;
      text-align: center;
      animation: fadeIn 0.3s ease-out;
    `;

    pollForm.insertBefore(errorEl, pollForm.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      errorEl.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => errorEl.remove(), 300);
    }, 5000);
  }

  // Share Results Functionality
  shareButton.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({
        title: 'Programming Language Poll Results',
        text: `Check out these poll results for favorite programming languages! Total votes: ${pollData.totalVotes}`,
        url: window.location.href
      }).catch(err => {
        console.log('Error sharing:', err);
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  });

  // Fallback for browsers without Web Share API
  function copyToClipboard() {
    const resultsText = `Poll Results:\n\n` +
      `JavaScript: ${calculatePercentage(pollData.javascript)}%\n` +
      `Go: ${calculatePercentage(pollData.go)}%\n` +
      `Python: ${calculatePercentage(pollData.python)}%\n` +
      `C++: ${calculatePercentage(pollData.cpp)}%\n\n` +
      `Total Votes: ${pollData.totalVotes}`;

    navigator.clipboard.writeText(resultsText).then(() => {
      const originalText = shareButton.innerHTML;
      shareButton.innerHTML = '✓ Copied!';
      setTimeout(() => {
        shareButton.innerHTML = originalText;
      }, 2000);
    });
  }

  // Add CSS for animations if not already present
  if (!document.getElementById('dynamic-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'dynamic-styles';
    styleEl.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
      }
    `;
    document.head.appendChild(styleEl);
  }
});