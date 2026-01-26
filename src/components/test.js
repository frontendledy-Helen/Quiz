export class Test {

    constructor() {
        this.progressBarElement = null; // создаем в начале этот элемент, чтобы он у нас существовал, потом заполняем
        this.nextButtonElement = null; //создаем в начале этот элемент, чтобы он у нас существовал
        this.prevButtonElement = null; //создаем в начале этот элемент, чтобы он у нас существовал
        this.passButtonElement = null; //создаем в начале этот элемент, чтобы он у нас существовал
        this.optionsElement = null;  //блок с ответами, который изначально отсутствует
        this.questionTitleElement = null; // название вопроса выводим на страницу, изначально ноль - этого элемента нет и мы не можем его использовать
        this.quiz = null;  //свойство нашего главного объекта - данные которые пришли в тесте после запроса (const xhr) разместим в новую переменную
        this.currentQuestionIndex = 1; // индекс ТЕКУЩЕГО вопроса (полученного с сервера), (но первый у нас будет с индексом -1)
        this.userResult = []; //массив для сохранения выбранных пользователем ответов, после нажатия на кнопку ДАЛЕЕ после каждого вопроса, в Ф move()

        checkUserData(); //проверка наличия name&lastname&email в строке url
        const url = new URL(location.href);
        const testId = url.searchParams.get('id'); // проверка наличия id в строке url

        if (testId) { // если параметр testId существует
            const xhr = new XMLHttpRequest();   // запрос на сервер о конкретном тесте
            xhr.open('GET', 'https://testologia.ru/get-quiz?id=' + testId, false)
            xhr.send();

            if (xhr.status === 200 && xhr.responseText) {
                try { // обезопасим себя
                    this.quiz = JSON.parse(xhr.responseText); //распарсим пришедшие с backend свойство нашего главного объекта quiz, получим данные для quiz
                } catch (e) {
                    location.href = '#/';
                }
                this.startQuiz(); // вызов Ф startQuiz, отобразится первый вопрос
            } else {
                location.href = '#/'; // если статус будет не === 200
            }

        } else {
            location.href = '#/'; //если параметр testId не существует отправим пользователя на главную страницу
        }
    }

    startQuiz() {  // в этой Ф будет начинаться прохождение нашего теста, по факту отобразится первый вопрос
        console.log(this.quiz) // вывели в консоль полученные с сервера вопросы

        this.progressBarElement = document.getElementById('progress-bar') // создадим элемент html куда будем вставлять кружки и подпись кружков ProgressBar`а
        this.questionTitleElement = document.getElementById('title'); //создадим элемент html - выведем вопрос, который получили с сервера, на страницу
        this.optionsElement = document.getElementById('options'); //создадим блок с ответами в html (куда будем подгружать все ответы с сервера, но удалим написанные ответы в html)
        this.nextButtonElement = document.getElementById('next'); // найдем кнопку ДАЛЕЕ
        this.nextButtonElement.onclick = this.move.bind(this, 'next') //при клике вызов Ф move , используем bind чтобы контекст не потерялся, а 'next' потому что это nextButtonElement
        this.prevButtonElement = document.getElementById('prev'); // найдем кнопку НАЗАД
        this.prevButtonElement.onclick = this.move.bind(this, 'prev'); // при клике вызов Ф move? которая сработает по 'prev', т.е. после else
        this.passButtonElement = document.getElementById('pass'); // найдем кнопку ПРОПУСТИТЬ ВОПРОС
        this.passButtonElement.onclick = this.move.bind(this, 'pass'); //при клике вызов Ф move , используем bind чтобы контекст не потерялся, а 'pass' потому что это passButtonElement
        document.getElementById('pre-title').innerText = this.quiz.name; //когда открыли страницу, выбранный на странице choice.html тест прописываем в html на странице test.html


        this.prepareProgressBar(); // вызов Ф для отображения ProgressBar`а для текущего вопроса, вызов перед отображением самого первого вопроса
        this.showQuestion(); //вызов отображения первого вопроса теста

        const timerElement = document.getElementById('timer') //найдем цифру? которую будем менять по таймеру в html
        let seconds = 59; //максимальное время всего теста, который запускается, как только будет начинаться прохождение нашего теста

        //для того, чтобы остановить таймер, сохраним наш setInterval в перемнную interval
        const interval = setInterval(function () {
            seconds--; // уменьшаем 59 на минус 1
            timerElement.innerText = seconds;// размещаем каждую секунду, то число которое получаем от 59-1

            if (seconds === 0) { //если время закончилось
                this.complete();// вызываем Ф завершения тестирования (которую описываем в самом низу)
                clearInterval(interval); // останавливаем таймер
            }
        }.bind(this), 1000); //каждую миллисекунду  !!! для таймера контекст this не работает, поэтому используем .bind(this) в конце setInterval
    }

    prepareProgressBar() { // Ф для подготовки ProgressBar`а для текущего вопроса
        for (let i = 0; i < this.quiz.questions.length; i++) { // с помощью for создадим нужное количество элементов progress-bar
            const itemElement = document.createElement('div'); // создаем div
            itemElement.className = 'test-progress-bar-item ' + (i === 0 ? 'active' : ''); // присваиваем два класса, только класс active присваиваем для одного div, с индексом 0

            const itemCircleElement = document.createElement('div'); // создаем div
            itemCircleElement.className = 'test-progress-bar-item-circle';

            const itemTextElement = document.createElement('div'); // создаем div
            itemTextElement.className = 'test-progress-bar-item-text';
            itemTextElement.innerText = 'Вопрос ' + (i + 1); //подпишем каждый следующий кружок номером вопроса

            itemElement.appendChild(itemCircleElement);
            itemElement.appendChild(itemTextElement);

            this.progressBarElement.appendChild(itemElement); // теперь в html можно удалить progressBar
        }
    }

    showQuestion() {  // после получения вопросов и ответов с сервера надо отобразить ТЕКУЩИЙ вопрос (currentQuestionIndex) на сайте в html
        const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1]; // создадим переменную с текущим новым вопросом теста (его индекс)
        this.questionTitleElement.innerHTML = '<span> Вопрос ' + this.currentQuestionIndex + ':</span> ' + activeQuestion.question;

        //т.к. эту функцию мы будем использовать много раз при переходе к другим вопросам, нужно каждый раз очищать блок с ответами
        this.optionsElement.innerHTML = ''; //очищаем блок с ответами
        const that = this; // для вызова функции chooseAnswer,т.к. контекст теряем надо создать переменную that
        const chosenOption = this.userResult.find(item => { // пройдем по массиву userResult, и проверяем есть ли уже какой-то результат (ниже будет проверка)
            return item.questionId === activeQuestion.id; // вернем в переменную chosenOption ответ пользователя (questionId) для текущего вопроса (chosenAnswerId), если возвращаемся НАЗАД, может быть null, если не отвечали на текущий вопрос
        });
        activeQuestion.answers.forEach(answer => { //пройдем циклом по всем элементам массива answers и создадим новую структуру html
            const optionElement = document.createElement('div'); //создали div
            optionElement.className = 'test-question-option'; //присвоили класс для этого div

            const inputId = 'answer-' + answer.id; //вынесем в переменную input id каждого ответа полученного с сервера из массива answers

            const inputElement = document.createElement('input'); // создаем input
            inputElement.className = 'option-answer'; //для того чтобы потом искать все input, чтобы вычислять по какому input был сделан клик и сохранять это значение в Ф move
            inputElement.setAttribute('id', inputId); //прикрепляем к input id каждого ответа полученного с сервера из массива answers, как класс
            inputElement.setAttribute('type', 'radio'); //прикрепляем к input type="radio" (<input type="radio" id="answer-1" name="answer">)
            inputElement.setAttribute('name', 'answer'); //прикрепляем к input name="answer", у всех одинаковый, чтобы связать все ответы наших input type="radio"
            inputElement.setAttribute('value', answer.id); //добавляем атрибут value - это id, который потом будем использовать

            if (chosenOption && chosenOption.chosenAnswerId === answer.id) {  //если выбран ответ и он соответствует текущему вопросу (при возврате НАЗАД)
                inputElement.setAttribute('checked', 'check'); // добавим для input атрибуд checked
            }


            inputElement.onchange = function () { //если выбран ответ в input, то убираем у кнопок "назад и далее" атрибут disabled
                that.chooseAnswer(); //вызовем функцию, но т.к. контекст теряем надо создать переменную that
            }

            const labelElement = document.createElement('label'); // создаем label
            labelElement.setAttribute('for', inputId);
            labelElement.innerText = answer.answer; //вставляем текст ответа из массива answers

            //теперь вставим блоки в блоки
            optionElement.appendChild(inputElement);
            optionElement.appendChild(labelElement);

            this.optionsElement.appendChild(optionElement);
        });


        //чтобы кнопка ДАЛЕЕ не блокировалась, если мы делаем возврат НАЗАД и у нас уже ранее был выбран ответ
        if (chosenOption && chosenOption.chosenAnswerId) {  //если ранее был выбран ответ (при возврате НАЗАД) чекнуто
            this.nextButtonElement.removeAttribute('disabled'); // раздизейблим кнопку ДАЛЕЕ
        } else {
            this.nextButtonElement.setAttribute('disabled', 'disabled'); //чтобы при переходе на следующий вопрос кнопка ДАЛЕЕ снова стала disabled
        }

        if (this.currentQuestionIndex === this.quiz.questions.length) { // когда мы дошли до последнего вопроса
            this.nextButtonElement.innerText = 'Завершить'; //меняем текст кнопки вместо ДАЛЕЕ - ЗАВЕРШИТЬ
        } else {
            this.nextButtonElement.innerText = 'Далее'; //если делаем НАЗАД - меняем текст кнопки вместо ЗАВЕРШИТЬ - ДАЛЕЕ
        }
        if (this.currentQuestionIndex > 1) { //если индекс вопроса меньше 1
            this.prevButtonElement.removeAttribute('disabled'); //то будем активировать кнопку НАЗАД
        } else {
            this.prevButtonElement.setAttribute('disabled', 'disabled'); // если меньше 1 задизейблим кнопку
        }
    }

    chooseAnswer() {  //убираем у кнопок "назад и далее" атрибут disabled
        this.nextButtonElement.removeAttribute('disabled'); //Ф срабатывает при вызове после клика на input (выше)
    }

    // переменная action может означать (назад(prev),далее(next) или пропустить(pass))
    move(action) { //универсальная Ф, которая означает что мы куда то переходим и нам надо отобразить следующий вопрос
        const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1]; // еще раз используем переменную с текущим вопросом теста (его индекс)
        //создадим функцию, которая будет запоминать тот ответ, по которому кликнул пользователь
        //чтобы превратить коллекцию элементов в массив, чтобы работать с методом обработки массивов find используем Array.from().find
        const chosenAnswer = Array.from(document.getElementsByClassName('option-answer')).find(element => {  // найдем все элементы input по классу, который создали при создании на страничке перечня вопросов и пройдемся по ним методом find
            return element.checked; //метод find возвращает элемент по которому кликнули (выводит после нажатия на кнопку ДАЛЕЕ)
        });

        // если жмем НАЗАД или ПРОПУСТИТЬ ВОПРОС в консоль выводит null
        let chosenAnswerId = null; // если значений не было выбор ответа по id остается пустым null

        if (chosenAnswer && chosenAnswer.value) {   //если chosenAnswer найден и там есть какое-то значение
            chosenAnswerId = Number(chosenAnswer.value); // то находим этот id и сохраняем в переменную chosenAnswerId (Number - приводит строку к числу, т.к. после использования в html в переменной chosenAnswerId будет просто строка )
        }
        // console.log(chosenAnswerId)

        // чтобы id ответов не записывались несколько раз (не дублировались), а перезаписывались в случае возвращения назад (в userResult ищем то значение, которое уже может существовать)
        // а также, чтобы ранее отмеченный ответ был не только в консоли, но и отображался на странице, для этого прописываем функцию if/else при формировании страницы после получения вопросов с backend (строка 82)
        const existingResult = this.userResult.find(item => { //пройдемся по массиву userResult (создан в начале вверху)
            return item.questionId === activeQuestion.id; // и вернем в переменную existingResult - id ответа, который выбрал пользователь
        });
        if (existingResult) {  //если id ответа уже существует
            existingResult.chosenAnswerId = chosenAnswerId; // то будем менять для existingResult - chosenAnswerId на chosenAnswerId - будем перезаписывать
        } else { // если такой записи еще не было - будем создавать
            //сохраним id выбранного ответа
            this.userResult.push({ // добавим в массив userResult следующие элементы
                questionId: activeQuestion.id, // делаем ссылку на вопрос, на котором мы в данный момент находимся
                chosenAnswerId: chosenAnswerId // добавляем вариант ответа, который выбрал пользователь, если ничего не выбрал будет - null
            });
        }
        console.log(this.userResult)

        // меняем индекс текущего вопроса после нажатия кнопки ДАЛЕЕ, после этого будем менять вид прогресс-бара
        if (action === 'next' || action === 'pass') { //если кнопка нажата на сдвиг вперед
            this.currentQuestionIndex++; // то будем увеличивать текущий индекс вопроса на 1
        } else { // если кнопка нажата назад
            this.currentQuestionIndex--; // то будем уменьшать текущий индекс вопроса на 1
        }

        if (this.currentQuestionIndex > this.quiz.questions.length) { //если индекс вопроса больше чем то количество вопросов которое у нас есть
            this.complete(); // вызываем Ф complete - завершения теста
            return; // чтобы далее Ф-ции forEach и showQuestion не выполнялись
        }

        // пройдемся циклом по коллекции всех элементов прогресс-бара, которую превратим в массив с помощью Array.from()
        Array.from(this.progressBarElement.children).forEach((item, index) => { //пройдемся циклом по всем элементам прогресс-бара
            const currentItemIndex = index + 1;  // в переменную currentItemIndex сохраним индекс вопроса прогресс-бара

            item.classList.remove('complete')// сначала для каждого элемента item будем удалять класс complete (вопрос который прошли)
            item.classList.remove('active')// сначала для каждого элемента item будем удалять класс active (вопрос который отрабатываем)

            if (currentItemIndex === this.currentQuestionIndex) { //если индекс вопроса прогресс-бара равен индексу ТЕКУЩЕГО вопроса (полученного с сервера)
                item.classList.add('active'); // значит вопрос открыт и в данный момент отрабатывается, добавили соответствующий класс (кружок не закрашен)
            } else if (currentItemIndex < this.currentQuestionIndex) { //если индекс вопроса прогресс-бара меньше индекса ТЕКУЩЕГО вопроса, то есть продвинулись на другой вопрос
                item.classList.add('complete'); // значит вопрос закрыт, добавили соответствующий класс (кружок полностью закрашен)
            }

        })

        this.showQuestion(); //после того как получили индекс вопроса, нужно его отобразить на нашей странице, вызываем функцию showQuestion
    }

    complete() { // Ф завершения теста, с сохранением ответов, которые пользователь выбрал и отправкой их на сервер
        const url = new URL(location.href); // создаем объект заново (в самом начале уже создавали) - можно вынести в объекты массива
        const id = url.searchParams.get('id'); // находим параметры пользователя
        const name = url.searchParams.get('name'); // находим параметры пользователя
        const lastName = url.searchParams.get('lastName'); // находим параметры пользователя
        const email = url.searchParams.get('email'); // находим параметры пользователя

        const xhr = new XMLHttpRequest(); // делаем новый запрос на сервер
        xhr.open('POST', 'https://testologia.ru/pass-quiz?id=' + id, false); // POST т.к. отправляем данные, в адресе передаем id (?id=)
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')// чтобы сервер понял что мы будем отправлять на сервер JSON данные
        xhr.send(JSON.stringify({  // отправляем наши данные (и превращаем наш javascript объект в JSON строку) - создаем объект
            name: name,
            lastName: lastName,
            email: email,
            results: this.userResult  // и будем передавать ответы
        }));

        // Преобразуем массив ответов пользователя в строку (id через запятую)
        const answerIds = this.userResult.map(item => item.chosenAnswerId).join(',');
        console.log('Ответы пользователя' + answerIds)

        // далее получим новые данные от сервера
        if (xhr.status === 200 && xhr.responseText) { // проверим данные
            let result = null;  //создадим локальную переменную, куда будем размещать ответ с сервера, изначально будет null
            try { // обезопасим себя
                result = JSON.parse(xhr.responseText); //распарсим в result пришедшие с backend данные и впишем новые значения
            } catch (e) { // если ошибка отправим пользователя на главную страницу
                location.href = '#/';
            }
            if (result) {
                console.log(result)
                //перейдем на страничку result.html
                location.href = '#/result?score=' + result.score + '&total=' + result.total + '&selected_answers=' + answerIds; // пропишем в url полученные с сервера score и total (проверяем F12 - сеть - pass-quiz?id= - предварительный просмотр)
            }
        } else {
            location.href = '#/'; // если статус будет не === 200
        }
    }
}