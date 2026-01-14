(function () {
    const Answers = {
        selectedAnswersArray: null, //массив ответов пользователя
        showQuestionsElement: null, //html - вопросы с ответами выбранного теста
        answersCircleElement: null,
        answersTextElement: null,
        answers: [], //верные ответы на вопросы выбранного теста
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

            console.log(this.answers) // массив верных ответов
            console.log(this.selectedAnswersArray) //массив ответов пользователя

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
                    const answersCircleElement = document.createElement('div'); //создадим кружок
                    answersCircleElement.className = 'circle';

                    const answersTextElement = document.createElement('div'); //подгрузим ответы
                    answersTextElement.className = 'answer-text';
                    const answer = question.answers[j];
                    console.log(answer.id)

                    answersTextElement.innerHTML = answer.answer;


                    // if (rightAnswersArray[i].includes(answer.id) && this.selectedAnswersArray[i].includes(answer.id)) {
                    //     answersCircleElement.className = 'green';
                    //     answersTextElement.className = 'right';
                    // } else if (rightAnswersArray[i].includes(answer.id) && !this.selectedAnswersArray[i].includes(answer.id)) {
                    //     answersCircleElement.className = 'red';
                    //     answersTextElement.className = 'wrong';
                    // } else {
                    //     answersCircleElement.className = 'circle';
                    //     answersTextElement.className = 'answer-text';
                    // }




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

            if (this.answers.includes(answer.id) && this.selectedAnswersArray.includes(answer.id)) {
                this.answersCircleElement.className = 'green';
                this.answersTextElement.className = 'right';
            } else if (this.answers.includes(answer.id) && !this.selectedAnswersArray.includes(answer.id)) {
                this.answersCircleElement.className = 'red';
                this.answersTextElement.className = 'wrong';
            } else {
                this.answersCircleElement.className = 'circle';
                this.answersTextElement.className = 'answer-text';
            }

        }

    }
    Answers.init();
})();