import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Result { // создаем объект Result

    constructor() {
        // this.resultPassElement = null;

        //const that = this;

        this.routeParams = UrlManager.getQueryParams() // при открытии страницы получаем параметры из URL, которые прописали на странице test.js (location.href = 'result.html?score=' + result.score + '&total=' + result.total)
        this.init();
    }

    async init() {

        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        }

        if (this.routeParams.id) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result?userId=' + userInfo.userId); // GET запрос по умолчанию

                if (result) {
                    if (result.error) {  //проверяем поле "error" которое приходит с backend и вообще есть ли user
                        throw new Error(result.error);
                    }
                    document.getElementById('result-score').innerText = result.score + '/' + result.total; // пропишем в html результат тестирования
                    return;// в случае успешного результата функция далее не отрабатывала
                }
            } catch (error) {
                console.log(error);
            }
        }

        location.href = '#/';
    }
}

//     this
// .
//     resultPassElement = document.getElementById('result-pass'); //кнопка перехода на страницу answers.html
//     this
// .
//     resultPassElement
// .
//     onclick = function () {  // нажали на кнопку
//         that.processForm(); // вызов функции при клике на кнопку, данные будут передаваться по URL на другую страницу, сама работпа Ф описана ниже
//
//     }
// }
//
// // location.search не будет работать если у нас свой путь к файлам описанный в router.js (#/)
// processForm()
// { // при клике на кнопку отправки, будет вызов этой Ф (выше вызов)
//     let selectedAnswers = this.routeParams.selected_answers;
//     location.href = '#/answers?score=' + this.routeParams.score + '&total=' + this.routeParams.total + '&selected_answers=' + selectedAnswers; //переходим на страничку answers.html
//     console.log(this.routeParams);
// }


