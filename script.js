window.onload = function(){
  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;

  if (window.SpeechRecognition === null) {
    document.querySelector('.unsupported-msg').classList.remove('hidden');
    document.getElementById('play').classList.add('hidden');
  } else {
    var recognizer = new window.SpeechRecognition();

    // Recogniser stop listening even if the user pauses
    recognizer.continuous = false;
    recognizer.lang = 'ru-RU';

    // Start recognising
    recognizer.onresult = function(event) {
      var resEl = document.getElementById('result'),
          resStr = event.results[0][0].transcript,
          resultArr = [];

      resStr.split(' ').forEach(function(word){
        if (!isNaN(parseInt(word))) {
          resultArr.push(word);
        } else {
          switch(word) {
            case '+':
            case 'plus':
            case 'add':
            case 'плюс':
            case 'прибавить':
            case 'сложить':
            case 'додати':
              resultArr.push('+');
              break;
            case '-':
            case 'minus':
            case 'минус':
            case 'отнять':
            case 'вычесть':
            case 'мінус':
            case 'відняти':
              resultArr.push('-');
              break;
            case '*':
            case 'multiply':
            case 'умножить':
            case 'помножити':
              resultArr.push('*');
              break;
            case '/':
            case 'divide':
            case 'поделить':
            case 'делить':
            case 'разделить':
            case 'поділити':
            case 'розділити':
              resultArr.push('/');
              break;
            default:
              break;
          }
        }
      });
      resEl.parentElement.classList.remove('hidden');
      resEl.textContent = eval(resultArr.join(''));
    };

    // Listen for errors
    recognizer.onerror = function(event) {
      console.error(event.message);
    };

    document.getElementById('play').addEventListener('click', function() {
      recognizer.start();
    });
  }

  document.getElementById('hint').addEventListener('click', function() {
    document.querySelector('.modal-bg').classList.toggle('hidden');
  });
  
  document.getElementById('modal-close').addEventListener('click', function() {
    document.querySelector('.modal-bg').classList.add('hidden');
  });

  window.addEventListener('keydown', function(e) {
    if (e.keyCode === 27) {
      document.querySelector('.modal-bg').classList.add('hidden');
    }
  });
};