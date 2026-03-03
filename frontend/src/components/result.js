import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Result { // создаем объект Result

    constructor() {
        //this.resultPassElement = null;
        this.routeParams = UrlManager.getQueryParams() // при открытии страницы получаем параметры из URL, которые прописали на странице test.js (location.href = 'result.html?score=' + result.score + '&total=' + result.total)
        this.init();

    }

    processForm() {
        location.href = '#/answers?id=' + this.routeParams.id;
    };

    async init() {

        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
            return;
        }

        if (!this.routeParams.id) {
            location.href = '#/';
            return;
        }
        try {
            const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result?userId=' + userInfo.userId); // GET запрос по умолчанию

            if (result) {
                if (result.error) {  //проверяем поле "error" которое приходит с backend и вообще есть ли user
                    throw new Error(result.error);
                }
                document.getElementById('result-score').innerText = result.score + '/' + result.total; // пропишем в html результат тестирования
            }
            const resultPassElement = document.getElementById('result-pass'); //кнопка перехода на страницу answers.html
            if (resultPassElement) {
                resultPassElement.onclick = () => this.processForm(); // нажали на кнопку
                // вызов функции при клике на кнопку, данные будут передаваться по URL на другую страницу, сама работпа Ф описана ниже
            }

        } catch (error) {
            console.log(error);
            location.href = '#/';
        }
    }
}







