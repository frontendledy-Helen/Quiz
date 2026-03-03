import {UrlManager} from '../utils/url-manager.js';
import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Answers {

    constructor() {

        this.answersCircleElement = null;
        this.answersTextElement = null;
        this.answers = []; //верные ответы на вопросы выбранного теста
        this.quiz = null; // выбранный пользователем тест с вопросами и ответами

        this.routeParams = UrlManager.getQueryParams() // при открытии страницы получаем параметры из URL

        const choiceTestId = localStorage.getItem('selectedTest'); //найдем id теста выбранного пользователем (перередано через localStorage)
        console.log("id выбранного теста - " + choiceTestId)
        this.init();
    }

    async init() {
        const userInfo = Auth.getUserInfo();
        if (userInfo && this.routeParams.id) {
            const profileElement = document.getElementById('profile-name');
            if (profileElement) {
                profileElement.innerText = userInfo.fullName;
            }
            const emailElement = document.getElementById('profile-email');
            if (emailElement) {
                emailElement.innerText = userInfo.email;
            }
        } else {
            location.href = '#/';
            return;
        }
        try {
            const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + userInfo.userId
            );

            if (!result || result.error || !result.test) {
                throw new Error(result?.message || 'Answers loading error');
            }

            this.quiz = result.test;
            this.renderQuestions();


            const back = document.getElementById('back-to-result');
            if (back) {
                back.onclick = () => {
                    location.href = '#/result?id=' + this.routeParams.id;
                };
            }
        } catch (error) {
            console.log(error);
            location.href = '#/';
        }
    }

    renderQuestions() { //обработка данных, полученных с сервера - вывод этих данных на страницу html
        if (!this.quiz || !this.quiz.questions || !this.quiz.questions.length) {
            location.href = '#/';
            return;
        }

        const titleElement = document.getElementById('test-passed');
        const listElement = document.getElementById('answers-list');

        if (titleElement && listElement) {
            titleElement.innerText = this.quiz.name;
            listElement.innerHTML = '';
        } else {
            return;
        }

        this.quiz.questions.forEach((question, questionIndex) => {
            const itemElement = document.createElement('div'); // создаем div (answer)
            itemElement.className = 'answer'; // присваиваем с индексом вопроса

            const itemTitleElement = document.createElement('div'); // создаем div (в answer)
            itemTitleElement.className = 'common-title answer-title'
            itemTitleElement.innerHTML = '<span>Вопрос ' + (questionIndex + 1) + ':</span> ' + question.question;
            itemElement.appendChild(itemTitleElement);

            question.answers.forEach((answer) => {
                const answerElement = document.createElement('div'); //сюда соберем один ответ
                answerElement.className = 'test-answer-option';

                const answersCircleElement = document.createElement('div'); //создадим кружок
                answersCircleElement.className = 'circle';

                const answersTextElement = document.createElement('div'); //подгрузим ответы
                answersTextElement.className = 'answer-text';
                answersTextElement.innerText = answer.answer;

                // answer.correct есть только у выбранного пользователем ответа:
                // true  -> выбран верно
                // false -> выбран неверно
                if (answer.correct === true) {
                    answersCircleElement.className = 'green';
                    answersTextElement.className = 'right';
                } else if (answer.correct === false) {
                    answersCircleElement.className = 'red';
                    answersTextElement.className = 'wrong';
                }
                answerElement.appendChild(answersCircleElement);
                answerElement.appendChild(answersTextElement);
                itemElement.appendChild(answerElement);
            });
            listElement.appendChild(itemElement);
        });

    }
}

//     this
// .
//     showQuestionsElement
// .
//
//     appendChild(itemElement); // теперь в html можно удалить вопросы и ответы
// }
// }
//
// comparisonOptions()
// {  // сравнение вариантов ответов
//     const rightAnswersArray = this.answers // массив правильных ответов
//
//     const that = this;
//
//     const selectedAnswers = this.routeParams.selected_answers; //получили ответы пользователя из URL
//
//     if (selectedAnswers) { //проверка, если данные с url получены
//         const selectedAnswersArray = selectedAnswers.split(',').map(Number); // создали массив ответов пользователя
//         // console.log('Ответы пользователя - ' + selectedAnswersArray)
//         // console.log('Правильные ответы - ' + rightAnswersArray);
//
//         // Перебираем все вопросы
//         for (let i = 0; i < this.quiz.questions.length; i++) {
//             const question = this.quiz.questions[i];
//             const correctAnswer = this.answers[i]; // правильный ответ на текущий вопрос
//             const userAnswer = selectedAnswersArray[i]; // ответ пользователя на текущий вопрос
//
//             // Перебираем все ответы на текущий вопрос
//             for (let j = 0; j < question.answers.length; j++) {
//                 const answer = question.answers[j]; //ответ на текущий вопрос
//                 const answerId = answer.id; // номер текущего ответа
//
//                 const answerElement = document.querySelector(`.test-answer-option[data-question-index="${i}"][data-answer-index="${j}"]`);
//                 const answersCircleElement = answerElement.querySelector('.circle');
//                 const answersTextElement = answerElement.querySelector('.answer-text');
//
//                 // Удаляем старые классы
//                 answersCircleElement.classList.remove('green', 'red', 'circle');
//                 answersTextElement.classList.remove('right', 'wrong', 'answer-text');
//
//                 // Сравнение ответов
//                 if (answerId === correctAnswer) {
//                     if (answerId === userAnswer) {
//                         answersCircleElement.classList.add('green');
//                         answersTextElement.classList.add('right');
//                     } else {
//                         answersCircleElement.classList.add('circle');
//                         answersTextElement.classList.add('answer-text');
//                     }
//                 } else if (answerId === userAnswer) {
//                     answersCircleElement.classList.add('red');
//                     answersTextElement.classList.add('wrong');
//                 } else {
//                     answersCircleElement.className = 'circle';
//                     answersTextElement.className = 'answer-text';
//                 }
//             }
//         }
//
//     } else {
//         location.href = '#/';
//     }
//
//     this.backToResult = document.getElementById('back-to-result');
//     this.backToResult.onclick = function () { // нажали на кнопку
//         that.moveResult()
//     }
// }
//
//
// // location.search не будет работать если у нас свой путь к файлам описанный в router.js (#/)
//
// moveResult()
// { // при клике на кнопку отправки, будет вызов этой Ф (выше вызов)
//
//     console.log('moveResult вызван, routeParams:', this.routeParams);
//
//     // Проверяем наличие параметров
//     if (!this.routeParams || !this.routeParams.score || !this.routeParams.total) {
//         console.error('Отсутствуют необходимые параметры!', this.routeParams);
//         return;
//     }
//
//     const score = encodeURIComponent(this.routeParams.score || '');
//     const total = encodeURIComponent(this.routeParams.total || '');
//     const selectedAnswers = encodeURIComponent(this.routeParams.selected_answers || '');
//
//     const newUrl = '#/result?score=' + score + '&total=' + total + '&selected_answers=' + selectedAnswers;
//     console.log('Переход на:', newUrl);
//
//     location.href = newUrl;
//
//
//     // location.href = '#/result?score=' + this.routeParams.score + '&total=' + this.routeParams.total + '&selected_answers=' + this.routeParams.selected_answers; //переходим на страничку result.html
// }
// }
