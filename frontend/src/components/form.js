import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";
import config from "../../config/config.js";

export class Form {

    constructor(page) {
        this.agreeElement = null; //создадим элемент checkbox, а потом в него уже разместим найденный элемент checkbox (ниже)
        this.processElement = null; // создадим элемент кнопка, а потом в него уже разместим найденный элемент с id=process (ниже)
        this.page = page; // создадим элемент чтобы потом использовать

        // если польз. залогинен сразу перебрасываем его на страницу choice, минуя страницы login и signup
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (accessToken) {  //проверка залогинен пользователь или нет
            location.href = '#/choice';
            return; //обязательно завершить Ф, чтобы дальнейшие Ф не выполнялись
        }

        this.fields = [ //создадим массив из нашей формы регистрации
            {
                name: 'email',
                id: 'email', //из файла html
                element: null, // с помощью this.fields.forEach мы заполним вместо null найденный элемент по id
                regex: /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,   //регулярные выражения для проверки поля
                valid: false, //поле изначально пустое и не может быть валидно
            },
            {
                name: 'password',
                id: 'password', //из файла html
                element: null, // с помощью this.fields.forEach мы заполним вместо null найденный элемент по id
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/,   //регулярные выражения для проверки поля
                valid: false, //поле изначально пустое и не может быть валидно
            },
        ];

        if (this.page === 'signup') { // если страница регистрации то добавятся два инпута
            this.fields.unshift({
                    name: 'name',
                    id: 'name', //из файла html
                    element: null, // с помощью this.fields.forEach мы заполним вместо null найденный элемент по id
                    regex: /^[А-Я][а-я]+\s*$/,   //регулярные выражения для проверки поля
                    valid: false, //поле изначально пустое и не может быть валидно
                },
                {
                    name: 'lastName',
                    id: 'last-name', //из файла html
                    element: null, // с помощью this.fields.forEach мы заполним вместо null найденный элемент по id
                    regex: /^[А-Я][а-я]+\s*$/,   //регулярные выражения для проверки поля
                    valid: false, //поле изначально пустое и не может быть валидно
                });     // unshift () - чтобы поля name и lastName добавились перед логином и паролем
        }

        const that = this; //когда срабатывает Ф init в переменную that размещаем текущий контекст this, т.е. ссылку на наш объект Form
        this.fields.forEach(item => {  //пройдемся по всем элементам массива fields
            item.element = document.getElementById(item.id); //для каждого элемента в свойство element будем размещать наш элемент html, который будем искать по айдишнику (item.id)
            item.element.onchange = function () { // повесим на элементы обработчик события по изменению значения
                that.validateField.call(that, item, this) // благодаря Ф call мы не потеряем контекст this, поэтому используем сначала that, потом item - текущий элемент который проходим, и текущий element this
            }
        });

        this.processElement = document.getElementById('process'); //кнопка которая заблокирована, если поля не валидные
        this.processElement.onclick = function () {  // нажали на кнопку
            that.processForm(); // вызов функции приклике на кнопку, данные будут передаваться по URL на другую страницу, сама работы Ф описана ниже
        }

        if (this.page === 'signup') { // если страница регистрации
            this.agreeElement = document.getElementById('agree'); //нашли чекбокс и разместили его в элемент agreeElement, который создали ранее
            this.agreeElement.onchange = function () {  // изменили состояние чекбокса
                that.validateForm(); // сработал вызов Ф validateForm
            }
        }
    }

    //эта Ф вызывается в Ф init (выше)
    validateField(field, element) { // Ф принимает два параметра field (это элемент item используем выше) и текущий element this
        if (!element.value || !element.value.match(field.regex)) { //если поле не заполнено и не соответствует регулярке // сработает для всех полей
            element.parentNode.style.borderColor = 'red';
            field.valid = false; //в соответствии с массивом fields
        } else {
            element.parentNode.removeAttribute('style');
            field.valid = true; //в соответствии с массивом fields
        }
        this.validateForm();
    }

    validateForm() { //проверим все поля и раздизейблим кнопку для отправки, вызов ф-ции выше
        const validForm = this.fields.every(item => item.valid); //получим либо true либо false из массива fields
        const isValid = this.agreeElement ? this.agreeElement.checked && validForm : validForm; // итоговая проверка нашей формы , тернарный оператор для страницы login
        if (isValid) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return isValid;
    }

    async processForm() { // при клике на кнопку отправки, будет вызов этой Ф (выше вызов)
        if (this.validateForm()) { //если форма валидна

            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;

            if (this.page === 'signup') { // отправка запроса на регистрацию

                try {
                    const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: this.fields.find(item => item.name === 'name').element.value, // находим html элемент
                        lastName: this.fields.find(item => item.name === 'lastName').element.value, // находим html элемент
                        email: email, // находим html элемент
                        password: password, // находим html элемент
                    })
                    if (result) {
                        if (result.error || !result.user) {  //проверяем поле "error" которое приходит с backend и вообще есть ли user
                            throw new Error(result.message);
                        }
                    }
                } catch (error) {
                    return alert('Пользователь с таким email уже зарегистрирован!');
                }
            }   // после регистрации сразу получим токен для продолжения теста, чтобы не вводить пароль еще раз и авторизовываться
            try {
                const result = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email, // находим html элемент
                    password: password, // находим html элемент
                })
                if (result) {
                    if (result.error || !result.accessToken || !result.refreshToken || !result.refreshToken
                        || !result.fullName || !result.userId) {  //проверяем поля которые приходят с backend в ответ на POST запрос
                        throw new Error(result.message);
                    }

                    Auth.setTokens(result.accessToken, result.refreshToken)// сохраним токены которые получили с бакенд через localstorage
                    Auth.setUserInfo({
                        fullName: result.fullName,
                        userId: result.userId,
                        email: email
                    })
                    // если есть логин переводим пользователя на страницу choice
                    location.href = '#/choice'; // теперь при переходе на страницу choice у нас уже есть токены в localstorage
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}