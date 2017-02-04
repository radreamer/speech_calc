window.onload = function(){
  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;

  const translates = {
    'ru-RU': {
      title: 'Головой калькулятор',
      hint:
        '<p>Чтобы произвести вычисление, нажмите на кнопку записи и продиктуйте своё выражение. Вы можете использовать сложение, вычитание, умножение и деление.</p>' +
        '<p>Например: <i>"десять умножить на тридцать минус пятьдесят поделить на пять"</i>.</p>' +
        '<p>Результат тут же появится на экране.</p>' +
        '<p>Для работы голосового калькулятора, во всплывающем окне разрешите браузеру использование микрофона.</p>',
      langTitle: '<h3>Выберите язык:</h3>',
      unsuppotted: 'К сожалению, Ваш браузер не поддерживает распознавание речи. Попробуйте',
      result: 'Ваш результат:',
      error: 'Мы ничего не расслышали, пожалуйста, попробуйте еще раз'
    },
    'en-US' : {
      title: 'Voice calculator',
      hint:
        '<p>To perform the calculation, click on the record button and dictate yout expression. You can use addition, subtraction, multiplication and division.</p>' +
        '<p>For example: <i>"ten multiplied by thirty minus fifty divided into five"</i>.</p>' +
        '<p>The result will immediately appear on the screen.</p>' +
        '<p>For voice calculation, allow the browser to use the microphone in the pop-up window.</p>',
      langTitle: '<h3>Choose language:</h3>',
      unsuppotted: 'Unfortunately, your browser does not support speech recognition. Try',
      result: 'Your result:',
      error: 'We did not hear anything, please, try again'
    },
    'ua-UA': {
      title: 'Голосовий калькулятор',
      hint:
        '<p>Для того, щоб провести розрахунки, натисіть на кнопку запису та продиктуйте свій вираз. Ви можете використовувати додавання, віднімання, множення і ділення.</p>' +
        '<p>Наприклад: <i>"десять помножити на тридцять мінус п`ятдесят поділити на п`ять"</i>.</p>' +
        '<p>Результат миттєво з`виться на екрані.</p>' +
        '<p>Для роботи голосового калькулятора, у випливаючому вікні дозвольте браузеру використовувати мікрофон.</p>',
      langTitle: '<h3>Оберіть мову:</h3>',
      unsuppotted: 'Нажаль, Ваш браузер не підтримує розпізнавання мови. Спробуйте',
      result: 'Ваш результат:',
      error: 'Ми нічого не розчули, будь ласка, спробуйте ще раз'
    }
  };

  var language = navigator.language,
      resEl = document.getElementById('result'),
      errMsg = document.getElementById('error');

  function translateData() {
    document.title = translates[language].title;
    errMsg.textContent = translates[language].error;
    document.querySelector('.tlt-result').textContent = translates[language].result;
    document.querySelector('.tlt-unsupported').textContent = translates[language].unsuppotted;
  }

  translateData();

  const playBtn = document.getElementById('play'),
        modalBg = document.querySelector('.modal-bg'),
        modalContent = modalBg.querySelector('.modal-content');

  if (window.SpeechRecognition === null) {
    document.querySelector('.unsupported-msg').classList.remove('hidden');
    playBtn.classList.add('hidden');
  } else {
    var recognizer = new window.SpeechRecognition();

    // Recogniser stop listening if the user pauses
    recognizer.continuous = false;
    recognizer.lang = language;

    // Start recognising
    recognizer.onresult = function(event) {
      var resStr = event.results[0][0].transcript,
          resultArr = [],
          result;

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
      result = eval(resultArr.join(''));
      if (result === undefined || isNaN(result) || !isFinite(result)) {
        errMsg.classList.remove('hidden');
      } else {
        resEl.textContent = result;
        resEl.parentElement.classList.remove('hidden');
      }
      playBtn.classList.remove('pulse');
    };

    recognizer.onerror = function(event) {
      console.error(event.message);
      playBtn.classList.remove('pulse');
    };

    playBtn.addEventListener('click', function() {
      errMsg.classList.add('hidden');
      resEl.parentElement.classList.add('hidden');
      recognizer.start();
      this.classList.add('pulse');
    });
  }

  function changeLanguage(e) {
    if (!e.target.classList.contains('lang-btn')) {
      return;
    }
    language = e.target.dataset.lang;
    recognizer.lang = language;
    translateData();
    modalBg.classList.add('hidden');
  }

  document.getElementById('hint').addEventListener('click', function() {
    modalContent.innerHTML =
      '<h3>' + translates[language].title + '</h3>' +
      translates[language].hint;
    modalBg.classList.toggle('hidden');
  });

  document.getElementById('change-lang').addEventListener('click', function() {
    modalContent.innerHTML =
      translates[language].langTitle +
      '<button data-lang="en-US" class="lang-btn">English</button>' +
      '<button data-lang="ru-RU" class="lang-btn">Русский</button>'/* +
      '<button data-lang="ua-UA" class="lang-btn">Українська</button>'*/;
    modalBg.classList.toggle('hidden');
    modalContent.addEventListener('click', changeLanguage);
  });

  document.getElementById('modal-close').addEventListener('click', function() {
    modalBg.classList.add('hidden');
    modalContent.removeEventListener('click', changeLanguage);
  });

  window.addEventListener('keydown', function(e) {
    if (e.keyCode === 27) {
      modalBg.classList.add('hidden');
    }
  });
};