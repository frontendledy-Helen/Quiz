(function () {

    const Form = {
        agreeElement: null, //создадим элемент checkbox, а потом в него уже разместим найденный элемент checkbox (ниже)
        processElement: null, // создадим элемент кнопка, а потом в него уже разместим найденный элемент с id=process (ниже)
        fields: [ //создадим массив из нашей формы регистрации
            {
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
            },
            {
                name: 'email',
                id: 'email', //из файла html
                element: null, // с помощью this.fields.forEach мы заполним вместо null найденный элемент по id
                regex: /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,   //регулярные выражения для проверки поля
                valid: false, //поле изначально пустое и не может быть валидно
            },

        ],
        init() { //при запусте страницы сработает вызов этой ф-ции
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

            this.agreeElement = document.getElementById('agree'); //нашли чекбокс и разместили его в элемент agreeElement, который создали ранее
            this.agreeElement.onchange = function () {  // изменили состояние чекбокса
                that.validateForm(); // сработал вызов Ф validateForm
            }

        },

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
        },
        validateForm() { //проверим все поля и раздизейблим кнопку для отправки, вызов ф-ции выше
            const validForm = this.fields.every(item => item.valid); //получим либо true либо false из массива fields
            const isValid = this.agreeElement.checked && validForm; // итоговая проверка нашей формы
            if (isValid) {
                this.processElement.removeAttribute('disabled');
            } else {
                this.processElement.setAttribute('disabled', 'disabled');
            }
            return isValid;
        },
        processForm() { // при клике на кнопку отправки, будет вызов этой Ф (выше вызов)
            if (this.validateForm()) { //если форма валидна

                let paramString = ''; //размещаем пустую строку, куда будем размещать значение каждого параметра
                this.fields.forEach(item => {
                    paramString += (!paramString ? '?' : '&') + item.name + '=' + item.element.value; //знаки ? и & в URL-адресе используются для передачи параметров запроса
                })

                location.href = 'choice.html' + paramString; //переходим на страничку choice.html + добавим данные в URL-адрес
            }
        }
    };

    Form.init(); //вызов ф-ции init, чтобы произвести первичную настройку нашей страницы
})();