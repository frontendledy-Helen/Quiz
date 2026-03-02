// выносим отдельно запросы на сервер, которые часто будут повторяться
// это будет для всех страниц, в этой Ф отрабатываются все запросы на backend
import {Auth} from "./auth.js";

export class CustomHttp {
    static async request(url, method = 'GET', body = null) {  //передаем по умолчанию метод GET если не укажем и body не нужен ксли метод GET

        const params = {  // это для GET запросов
            method: method,
            headers: {
                'Content-Type': 'application/json', // отправлять объект json
                'Accept': 'application/json'  // получать объект json
            }
        };

        let token = localStorage.getItem(Auth.accessTokenKey); // найдем токены из localStorage, если они есть по ключу 'accessToken'

        if (token) { // если токен есть будем добавлять его к каждому запросу в заголовки
            params.headers['x-access-token'] = token; // то что сохранили после логина будет каждый раз обновляться при переходе на другую страницу
        }

        if (body) { // если другой метод (все остальные запросы кроме GET) и в Ф пришло body
            params.body = JSON.stringify(body);
        }

        const response = await fetch(url, params);

        if (response.status < 200 || response.status >= 300) { // проверяем статус от сервера
            if (response.status === 401) { // если пришло сообщение 401 - нужно обновить токены
                const result = await Auth.processUnauthorizedResponse(); // запускаем Ф обработки ответа 401
                if (result) {
                    return await this.request(url, method, body); // рекурсия - Ф вызывает сама же себя с теми же самыми параметрами
                } else {
                    return null;
                }
            }

            throw new Error(response.message); // приходит сообщение от back
        }

        return await response.json(); // вернем результат ответа в response.json()
    }
}