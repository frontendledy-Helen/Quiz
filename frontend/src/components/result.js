import {UrlManager} from "../utils/url-manager.js";

export class Result { // создаем объект Result

    constructor() {
        this.resultPassElement = null;

        const that = this;

        this.routeParams = UrlManager.getQueryParams() // при открытии страницы получаем параметры из URL, которые прописали на странице test.js (location.href = 'result.html?score=' + result.score + '&total=' + result.total)

        if (this.routeParams) {
        document.getElementById('result-score').innerText = this.routeParams.score + '/' + this.routeParams.total; // пропишем в html результат тестирования
        } else {
            alert('не получили данные URL')
        }

        this.resultPassElement = document.getElementById('result-pass'); //кнопка перехода на страницу answers.html
        this.resultPassElement.onclick = function () {  // нажали на кнопку
            that.processForm(); // вызов функции при клике на кнопку, данные будут передаваться по URL на другую страницу, сама работпа Ф описана ниже

        }
    }

    // location.search не будет работать если у нас свой путь к файлам описанный в router.js (#/)
    processForm() { // при клике на кнопку отправки, будет вызов этой Ф (выше вызов)
        let selectedAnswers = this.routeParams.selected_answers;
        location.href = '#/answers?score=' + this.routeParams.score + '&total=' + this.routeParams.total + '&selected_answers=' + selectedAnswers; //переходим на страничку answers.html
        console.log(this.routeParams);
    }
}

