(function () {
    const Answers = {
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
                    this.startQuiz(); // вызов Ф startQuiz, отобразится первый вопрос
                } else {
                    location.href = 'index.html'; // если статус будет не === 200
                }

            } else {
                location.href = 'index.html'; //если параметр testId не существует отправим пользователя на главную страницу
            }

        },
        startQuiz() { //обработка данных, полученных с сервера - вывод этих данных на страницу html
            console.log(this.quiz); //увидим что пришло с backend (видим id,name,questions)

        }


    }
    Answers.init();
})();