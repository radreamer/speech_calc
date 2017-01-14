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
    var resStr = event.results[0][0].transcript;
    resStr.split(' ');

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