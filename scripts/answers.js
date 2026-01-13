(function () {
    const Answers = {
        currentQuestionIndex: 1, // индекс ТЕКУЩЕГО вопроса (полученного с сервера), (но первый у нас будет с индексом -1)
        showQuestionsElement: null, //вопросы с ответами выбранного теста
        questions: [], //вопросы выбранного теста
        answers: [], //ответы на вопросы выбранного теста
        quiz: [],
        init() {

            const choiceTestId = localStorage.getItem('selectedTest');
            console.log("id выбранного теста - " + choiceTestId)

            if (choiceTestId) { // если параметр testId существует
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
                itemTitleElement.innerHTML = '<span> Вопрос ' + [i+1] + ':</span> ' + question.question;

                itemElement.appendChild(itemTitleElement);


                for (let j = 0; j < question.answers.length; j++) {
                    const answerElement = document.createElement('div'); //сюда соберем один ответ
                    answerElement.className = 'test-answer-option';

                    const answersCircleElement = document.createElement('div'); //создадим кружок
                    answersCircleElement.className = 'circle';

                    const answersTextElement = document.createElement('div'); //подгрузим ответы
                    answersTextElement.className = 'answer-text';
                    const answer = question.answers[j];
                    answersTextElement.innerHTML = answer.answer;

                    answerElement.appendChild(answersCircleElement);
                    answerElement.appendChild(answersTextElement);

                    itemElement.appendChild(answerElement);
                }



                this.showQuestionsElement.appendChild(itemElement); // теперь в html можно удалить вопросы и ответы

            }
        }

    }
    Answers.init();
})();