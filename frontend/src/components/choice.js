import {UrlManager} from '../utils/url-manager.js';
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Choice {

    constructor() {

        this.quizzes = []; // сюда будем размешать объект полученный из https://testologia.ru/get-quizzes
        this.testResult = null; // сюда будем получать результаты пройденных тестов для отображения на странице test.html
        //проверка наличия name&lastname&email в строке url
        this.routeParams = UrlManager.getQueryParams() // при открытии страницы получаем параметры из URL

        this.init();
    }

    async init() {

        // метод для получения всех тестов
        try {
            const result = await CustomHttp.request(config.host + '/tests')
            if (result) {
                if (result.error) {  //проверяем поле "error" которое приходит с backend и вообще есть ли user
                    throw new Error(result.error);
                }

                this.quizzes = result;
            }
        } catch (error) {
            return console.log(error);
        }

        // делаем запрос на backend  о выполненных тестах ранее, об их результатах
        const userInfo = Auth.getUserInfo(); // получаем данные юзера
        if (userInfo) { // если юзер авторизован и мы получили его данные то делаем запрос о результатах пройденных тестов
            try {
                const result = await CustomHttp.request(config.host + '/tests/results?userId=' + userInfo.userId);
                if (result) {
                    if (result.error) {  //проверяем поле "error" которое приходит с backend и вообще есть ли user
                        throw new Error(result.error);
                    }

                    this.testResult = result; // получили с бэка
                }
            } catch (error) {
                return console.log(error);
            }
        }
        this.processQuizzes();// когда получили все данные вызовем Ф и отработали два варианта init, которую создали ниже
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

                const result = this.testResult.find(item => item.testId === quiz.id) // если тесты уже были пройдены
                if (result) { // будут появляться на страничке test.html маленькие блоки соответствующие testId
                    const choiceOptionResultElement = document.createElement('div');
                    choiceOptionResultElement.className = 'choice-option-result';
                    choiceOptionResultElement.innerHTML = '<div>Результат</div><div>' + result.score + '/' + result.total + '</div>';
                    choiceOptionElement.appendChild(choiceOptionResultElement);
                }

                const choiceOptionImageElement = document.createElement('img'); //подключение стрелочки, у всех input одна и та же
                choiceOptionImageElement.setAttribute('src', '/images/choice-arrow.png');
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
            location.href = '#/test?id=' + dataId; // отправляем на страницу test.html + добавляем текущие параметры name?lastname&email + id=dataId
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