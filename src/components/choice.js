export class Choice {

    constructor() {

        this.quizzes = []; // сюда будем размешать объект полученный из https://testologia.ru/get-quizzes
        checkUserData() // проверка на заполнение URL, описанная в файле common.js
        // запрос на сервер
        const xhr = new XMLHttpRequest(); // в xhr размещаем новый объект для наших запросов
        xhr.open('GET', 'https://testologia.ru/get-quizzes', false);
        xhr.send(); //отправить запрос

        if (xhr.status === 200 && xhr.responseText) {
            try { // опасную операцию обернем в try/catch - на случай если придут неправильные данные
                this.quizzes = JSON.parse(xhr.responseText)  // превратим полученные данные в js объект, распарсим и расположим в объект quizzes, который создали на верху
            } catch (e) {
                location.href = 'index.html'; // если будет ошибка
            }
            this.processQuizzes();// когда получили все данные вызовем Ф, которую создали ниже
        } else {
            location.href = 'index.html'; // если статус будет не === 200
        }
    }

    processQuizzes() { //обработка данных, полученных с сервера - вывод этих данных на страницу html
        console.log(this.quizzes); //увидим что пришло с backend (видим id и name)
        const choiceOptionsElement = document.getElementById('choice-options'); //элемент в котором находятся все созданные блоки

        // циклом пройдемся по каждому пришедшему объекту и сделаем новое поле формы с заполнением пришедшим с backend
        if (this.quizzes && this.quizzes.length > 0) { // сделаем проверку, вдруг с backend ничего не придет
            this.quizzes.forEach(quiz => {
                const that = this; // потому что this не видим в этой области

                const choiceOptionElement = document.createElement('div'); // создадим новые элементы html - куда разместим id и name, которые пришли с backend
                choiceOptionElement.className = 'choice-option';
                choiceOptionElement.setAttribute('data-id', quiz.id); //добавим каждому элементу id, чтобы потом вставить его в URL при переходе на другую страницу
                choiceOptionElement.onclick = function () {  // добавим событие по клику на input
                    that.chooseQuiz(this) //текущий элемент который мы будем использовать
                }

                const choiceOptionTextElement = document.createElement('div');
                choiceOptionTextElement.className = 'choice-option-text';
                choiceOptionTextElement.innerText = quiz.name; // заполнение из полученного массива

                const choiceOptionArrowElement = document.createElement('div');
                choiceOptionArrowElement.className = 'choice-option-arrow';

                const choiceOptionImageElement = document.createElement('img'); //подключение стрелочки, у всех input одна и та же
                choiceOptionImageElement.setAttribute('src', 'images/choice-arrow.png');
                choiceOptionImageElement.setAttribute('alt', 'Стрелка');

                // вложим созданные элументы друг в друга
                choiceOptionArrowElement.appendChild(choiceOptionImageElement);
                choiceOptionElement.appendChild(choiceOptionTextElement);
                choiceOptionElement.appendChild(choiceOptionArrowElement);

                choiceOptionsElement.appendChild(choiceOptionElement);

                //теперь можно удалить в html элементы которые создали в js
            });
        }
    }

    chooseQuiz(element) { //Ф, благодаря которой будет происходить выбор теста и совершаться
        const dataId = element.getAttribute('data-id') //  найдем id input`a, по которому сделали клик
        if (dataId) { // если есть id
            location.href = 'test.html' + location.search + '&id=' + dataId; // отправляем на страницу test.html + добавляем текущие параметры name?lastname&email + id=dataId
            this.saveSelectedTest(dataId);
        }
    }

    saveSelectedTest(dataId) {
        // Сохраняем testId в localStorage
        localStorage.setItem('selectedTest', dataId);

        // Проверяем, что значение реально сохранилось
        let savedValue = localStorage.getItem('selectedTest');
        console.log(`Сохранено значение: ${savedValue}`); // Выведем в консоль сохраненное значение
    }
}