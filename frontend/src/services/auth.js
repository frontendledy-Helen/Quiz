// сервис для сохранения токенов которые получили после авторизации пользователя
// после запроса POST куда отправили почту и пароль
import config from '../../config/config.js'


export class Auth {

    static accessTokenKey = 'accessToken';  // создаем переменную для ключа, чтобы в будущем не допустить ошибку при его написании, когда будем прописывать в Ф
    static refreshTokenKey = 'refreshToken';
    static userInfoKey = 'userInfo';

    static async processUnauthorizedResponse() { // обработка неавторизованного ответа 401
        const refreshToken = localStorage.getItem(this.refreshTokenKey); // получим с backend 'refreshToken'
        if (refreshToken) { // если этот токен существует
            const response = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // отправлять объект json
                    'Accept': 'application/json'  // получать объект json
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });
            if (response && response.status === 200) {  // если запрос прошел успешно
                const result = await response.json();
                if (result && !result.error) {  // если при обновлении токена у нас нет ошибки с backend
                    this.setTokens(result.accessToken, result.refreshToken);  // и мы получили новую пару токенов, если используем текущий класс Auth можно записать this.setTokens(result.accessToken, result.refreshToken);
                    return true;// если токены обновились из Ф будем возвращать true, значит все успешно обновилось
                }
            }
        }

        this.removeTokens(); //удаление токенов из localstorage
        location.href = '#/'; // переводим пользователя на главную страницу
        return false; // если токены не обновились будем перенаправлять пользователя на главную страницу
    }

    static async logout() {  //очистим токены на бакенде после нажатия кнопки ВЫЙТИ из авторизации, хороший тон
 // сделаем запрос на бэкенд чтобы очистить токены ненужные
        const refreshToken = localStorage.getItem(this.refreshTokenKey); // получим с backend 'refreshToken'
        if (refreshToken) { // если этот токен существует
            const response = await fetch(config.host + '/logout', { // отправляемся на страницу /logout
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // отправлять объект json
                    'Accept': 'application/json'  // получать объект json
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });
            if (response && response.status === 200) {  // если запрос прошел успешно
                const result = await response.json();
                if (result && !result.error) {  // если при обновлении токена у нас нет ошибки с backend
                    Auth.removeTokens();// то выбросим пользователя из системы - удалим токены
                    localStorage.removeItem(Auth.userInfoKey); // удалим имя/фамилия по ключу'userInfo'
                    return true;// если токены обновились из Ф будем возвращать true, значит все успешно обновилось
                }
            }
        }
    }

    static setTokens(accessToken, refreshToken) {    // нужен метод который установит токены в localstorage

        localStorage.setItem(this.accessTokenKey, accessToken); // устанавливаем значение accessToken, которое пришло в Ф setTokens
        localStorage.setItem(this.refreshTokenKey, refreshToken); // устанавливаем значение accessToken, которое пришло в Ф setTokens
    }

    static removeTokens() {    // удаление токенов из localstorage // refreshToken хранится 30 дней

        localStorage.removeItem(this.accessTokenKey); // устанавливаем значение accessToken, которое пришло в Ф setTokens
        localStorage.removeItem(this.refreshTokenKey); // устанавливаем значение accessToken, которое пришло в Ф setTokens
    }

    // установить информацию о пользователе в localstorage
    static setUserInfo(info) {
        localStorage.setItem(this.userInfoKey, JSON.stringify(info)); // в localstorage можно хранить только строки, поэтому используем JSON.stringify
    }

    static getUserInfo() {
        const userInfo = localStorage.getItem(this.userInfoKey); // получили имя пользователя из localstorage
        if (userInfo) { // если есть что-то
            return JSON.parse(userInfo); // распарсим имя
        }
        return null; // если ничего нет возвращаем null
    }
}