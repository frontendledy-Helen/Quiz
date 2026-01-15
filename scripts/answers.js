(function () {
    const Answers = {
        backToResult: null, // кнопка возврата на страницу результата
        showQuestionsElement: null, //html - вопросы с ответами выбранного теста
        answersCircleElement: null,
        answersTextElement: null,
        answers: [], //верные ответы на вопросы выбранного теста
        answerId: null, //id - ответы на все вопросы
        quiz: [], // выбранный пользователем тест с вопросами и ответами
        init() {

            const choiceTestId = localStorage.getItem('selectedTest');
            console.log("id выбранного теста - " + choiceTestId)


            if (choiceTestId) { // если параметр choiceTestId существует
                const xhr = new XMLHttpRequest();   // запрос на сервер о конкретном тесте
                xhr.open('GET', 'https://testologia.ru/get-quiz?id=' + choiceTestId, false)
                xhr.send();

                if (xhr.status === 200 && xhr.responseText) {
                    try { // обезопасим себя
                        this.quiz = JSON.parse(xhr.responseText); //распарсим пришедшие с backend свойство нашего главного объекта quiz, получим данные для quiz
                    } catch (e) {
                        location.href = 'index.html';
                    }
                    this.showSelectedTest(); // вызов Ф showSelectedTest, отобразится выбранный пользователем тест
                } else {
                    location.href = 'index.html'; // если статус будет не === 200
                }

            } else {
                location.href = 'index.html'; //если параметр testId не существует отправим пользователя на главную страницу
            }


            const xhr2 = new XMLHttpRequest();   // запрос на сервер о правильных ответах
            xhr2.open('GET', 'https://testologia.ru/get-quiz-right?id=' + choiceTestId, false)
            xhr2.send();

            if (xhr2.status === 200 && xhr2.responseText) {
                try { // обезопасим себя
                    this.answers = JSON.parse(xhr2.responseText); //распарсим пришедшие с backend правильные ответы
                } catch (e) {
                    location.href = 'index.html';
                }
                this.comparisonOptions(); // вызов Ф comparisonOptions, сравнение вариантов ответов
            } else {
                location.href = 'index.html'; // если статус будет не === 200
            }
        },
        showSelectedTest() { //обработка данных, полученных с сервера - вывод этих данных на страницу html

            console.log(this.quiz.questions); //увидим что пришло с backend (видим id,name,questions)
            document.getElementById('test-passed').innerText = this.quiz.name; //вывод на страницу названия теста
            this.showQuestionsElement = document.getElementById('answers-list')

            for (let i = 0; i < this.quiz.questions.length; i++) { // с помощью for создадим нужное количество элементов вопросов с ответами
                const itemElement = document.createElement('div'); // создаем div (answer)
                itemElement.className = 'answer'; // присваиваем с индексом вопроса

                const itemTitleElement = document.createElement('div'); // создаем div (в answer)
                itemTitleElement.className = 'common-title answer-title'
                const question = this.quiz.questions[i]; // создадим переменную с текущим новым вопросом теста (его индекс)
                itemTitleElement.innerHTML = '<span> Вопрос ' + [i + 1] + ':</span> ' + question.question;

                itemElement.appendChild(itemTitleElement);


                for (let j = 0; j < question.answers.length; j++) {
                    const answerElement = document.createElement('div'); //сюда соберем один ответ
                    answerElement.className = 'test-answer-option';
                    answerElement.dataset.questionIndex = i; // добавляем атрибут data-question-index
                    answerElement.dataset.answerIndex = j; // добавляем атрибут data-answer-index

                    const answersCircleElement = document.createElement('div'); //создадим кружок
                    answersCircleElement.className = 'circle';


                    const answersTextElement = document.createElement('div'); //подгрузим ответы
                    answersTextElement.className = 'answer-text';
                    const answer = question.answers[j];
                    this.answerId = answer.id; // id всех ответов
                    console.log('Ответы выгруженные с сервера - id - ' + this.answerId)

                    answersTextElement.innerHTML = answer.answer;

                    answerElement.appendChild(answersCircleElement);
                    answerElement.appendChild(answersTextElement);

                    itemElement.appendChild(answerElement);
                }

                this.showQuestionsElement.appendChild(itemElement); // теперь в html можно удалить вопросы и ответы

            }
        },
        comparisonOptions() {  // сравнение вариантов ответов
            const rightAnswersArray = this.answers // массив правильных ответов
            const url = new URL(location.href); //текущий URL на странице
            const selectedAnswers = url.searchParams.get('selected_answers'); //получили ответы пользователя из URL
            const selectedAnswersArray = selectedAnswers.split(',').map(Number); // создали массив ответов пользователя
            console.log('Ответы пользователя - ' + selectedAnswersArray)
            console.log('Правильные ответы - ' + rightAnswersArray);

            // Перебираем все вопросы
            for (let i = 0; i < this.quiz.questions.length; i++) {
                const question = this.quiz.questions[i];
                const correctAnswer = this.answers[i]; // правильный ответ на текущий вопрос
                const userAnswer = selectedAnswersArray[i]; // ответ пользователя на текущий вопрос

                // Перебираем все ответы на текущий вопрос
                for (let j = 0; j < question.answers.length; j++) {
                    const answer = question.answers[j]; //ответ на текущий вопрос
                    const answerId = answer.id; // номер текущего ответа

                    const answerElement = document.querySelector(`.test-answer-option[data-question-index="${i}"][data-answer-index="${j}"]`);
                    const answersCircleElement = answerElement.querySelector('.circle');
                    const answersTextElement = answerElement.querySelector('.answer-text');

                    // Удаляем старые классы
                    answersCircleElement.classList.remove('green', 'red', 'circle');
                    answersTextElement.classList.remove('right', 'wrong', 'answer-text');

                    // Сравнение ответов
                    if (answerId === correctAnswer) {
                        if (answerId === userAnswer) {
                            answersCircleElement.classList.add('green');
                            answersTextElement.classList.add('right');
                        } else {
                            answersCircleElement.classList.add('circle');
                            answersTextElement.classList.add('answer-text');
                        }
                    } else if (answerId === userAnswer) {
                        answersCircleElement.classList.add('red');
                        answersTextElement.classList.add('wrong');
                    } else {
                        answersCircleElement.className = 'circle';
                        answersTextElement.className = 'answer-text';
                    }
                }
            }
            this.backToResult = document.getElementById('back-to-result');
            this.backToResult.onclick = function () {  // нажали на кнопку
                location.href = 'result.html' + location.search; //переходим на страничку result.html
            }

        }


    }
    Answers.init();
})();