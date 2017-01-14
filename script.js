var resultEl = document.getElementById('result');
window.SpeechRecognition = window.SpeechRecognition       ||
                           window.webkitSpeechRecognition ||
                           null;

if (window.SpeechRecognition === null) {
  document.getElementById('unsupported-msg').classList.remove('hidden');
  document.getElementById('play').setAttribute('disabled', 'disabled');
  document.getElementById('stop').setAttribute('disabled', 'disabled');
} else {
  var recognizer = new window.SpeechRecognition();

  // Recogniser stop listening even if the user pauses
  recognizer.continuous = false;
  recognizer.lang = 'ru-RU';

  // Start recognising
  recognizer.onresult = function(event) {
    var resStr = event.results[0][0].transcript,
        result = 0,
        action;

    resStr.split(' ').forEach(function(word){
      if (!isNaN(parseInt(word))) {
        switch(action) {
          case undefined:
          case 'sum':
            result += parseInt(word);
            break;
          case 'substraction':
            result -= parseInt(word);
            break;
          default:
            break;
        }
      } else {
          if (word === '+' || word === 'плюс' || word === 'plus') {
            action = 'sum';
          } else if (word === '-' || word === 'минус' || word === 'minus') {
        action = 'substraction';
          }
      }
    });

    resultEl.textContent = result;
  };

  // Listen for errors
  recognizer.onerror = function(event) {
    console.error(event.message);
  };

  document.getElementById('play').addEventListener('click', function() {
    recognizer.start();
    console.log('start talking');
  });
}