(function () {
    const Answers = {
        quiz: null,
        quizzes: [], // сюда будем размешать объект полученный из https://testologia.ru/get-quizzes
        init() {

            const url = new URL(location.href)
            console.log(url)

            // запрос на сервер
            const xhr = new XMLHttpRequest(); // в xhr размещаем новый объект для наших запросов
            xhr.open('GET', 'https://testologia.ru/get-quizzes', false);
            xhr.send(); //отправить запрос

            if (xhr.status === 200 && xhr.responseText) { // если ответ пришел
                try { // опасную операцию обернем в try/catch - на случай если придут неправильные данные
                    this.quizzes = JSON.parse(xhr.responseText)  // превратим полученные данные в js объект, распарсим и расположим в объект quizzes, который создали на верху
                } catch (e) {
                    location.href = 'index.html'; // если будет ошибка
                }
                this.processQuizzes();// когда получили все данные вызовем Ф, которую создали ниже
            } else {
                location.href = 'index.html'; // если статус будет не === 200
            }
        },
        processQuizzes() { //обработка данных, полученных с сервера - вывод этих данных на страницу html
            console.log(this.quizzes); //увидим что пришло с backend (видим id и name)


        }

    }
    Answers.init();
})();