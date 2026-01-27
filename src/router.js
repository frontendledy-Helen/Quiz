import {Form} from "./components/form.js";
import {Choice} from "./components/choice.js";
import {Test} from "./components/test.js";
import {Result} from "./components/result.js";
import {Answers} from "./components/answers.js";

export class Router {

    constructor() {
// создадим массив всех наших страниц, по которым возможно перемещение, а также начинать с любой страницы вход на сайт
        this.routes = [   // в массиве routes объекты со следующими полями (свойствами)
            {
                route: '#/',  // это сам URL по которому можно перейти и открыть соответствующую страницу, # - исп-ся чтобы не было сразу перехода
                title: 'Главная',  // заголовок страницы index.html // пропишется в URL
                template: 'templates/index.html', // путь до файла html, который мы будем подставлять в файл index.html
                styles: 'styles/index.css', // путь к стилям
                load: () => { //Ф загрузка первой страницы, оставляем пустой
                }
            },
            {
                route: '#/form',  // это сам URL по которому можно перейти и открыть соответствующую страницу, # - исп-ся чтобы не было сразу перехода
                title: 'Регистрация',  // заголовок страницы form.html // пропишется в URL
                template: 'templates/form.html', // путь до файла html, который мы будем подставлять в файл form.html
                styles: 'styles/form.css', // путь к стилям form.css
                load: () => { //Ф создаем экземпляр класса Form
                    new Form(); // создаем экземпляр класса Form из файла form.js, сделать экспорт и ипорт
                }
            },
            {
                route: '#/choice',  // это сам URL по которому можно перейти и открыть соответствующую страницу, # - исп-ся чтобы не было сразу перехода
                title: 'Выбор теста',  // заголовок страницы form.html // пропишется в URL
                template: 'templates/choice.html', // путь до файла html, который мы будем подставлять в файл form.html
                styles: 'styles/choice.css', // путь к стилям form.css
                load: () => { //Ф создаем экземпляр класса Form
                    new Choice(); // создаем экземпляр класса Form из файла form.js, сделать экспорт и ипорт
                }
            },
            {
                route: '#/test',  // это сам URL по которому можно перейти и открыть соответствующую страницу, # - исп-ся чтобы не было сразу перехода
                title: 'Прохождение теста',  // заголовок страницы form.html // пропишется в URL
                template: 'templates/test.html', // путь до файла html, который мы будем подставлять в файл form.html
                styles: 'styles/test.css', // путь к стилям form.css
                load: () => { //Ф создаем экземпляр класса Form
                    new Test(); // создаем экземпляр класса Form из файла form.js, сделать экспорт и ипорт
                }
            },
            {
                route: '#/result',  // это сам URL по которому можно перейти и открыть соответствующую страницу, # - исп-ся чтобы не было сразу перехода
                title: 'Результат',  // заголовок страницы form.html // пропишется в URL
                template: 'templates/result.html', // путь до файла html, который мы будем подставлять в файл form.html
                styles: 'styles/result.css', // путь к стилям form.css
                load: () => { //Ф создаем экземпляр класса Form
                    new Result(); // создаем экземпляр класса Form из файла form.js, сделать экспорт и ипорт
                }
            },
            {
                route: '#/answers',  // это сам URL по которому можно перейти и открыть соответствующую страницу, # - исп-ся чтобы не было сразу перехода
                title: 'Ответы',  // заголовок страницы form.html // пропишется в URL
                template: 'templates/answers.html', // путь до файла html, который мы будем подставлять в файл form.html
                styles: 'styles/answers.css', // путь к стилям form.css
                load: () => { //Ф создаем экземпляр класса Form
                    new Answers(); // создаем экземпляр класса Form из файла form.js, сделать экспорт и ипорт
                }
            },
        ]
    }

    // async - асинхронная Ф, используется метод await fetch
    async openRoute() {  //Ф открыть определеннфй роут

        // Добавим отладку для понимания проблемы
        const currentHash = window.location.hash;
        const routePart = currentHash.split('?')[0];
        console.log('Текущий hash:', currentHash);
        console.log('Ищем роут:', routePart);

        // newRoute - это тот роут который мы сейчас будем открывать (route: '#/form')
        const newRoute = this.routes.find(item => { // с помощью метода find ищем нужный роут, исходя мз того какой у нас сейчас прописан в URL
            return item.route === window.location.hash.split('?')[0]; // найдем роут который сейчас открыт, первую часть перед знаком ?
        });
        // после того как подгрузили наш роут (например '#/form'), надо подгрузить в index.html шаблон нашей страницы соответствующей form.html
        // но сначала сделаем проверку
        if (!newRoute) { // если роут не подгрузился из URL
            window.location.href = '#/'; //отправляем пользователя на главную страницу
            return; //и останавливаем работу Ф
        }

        // меняем html файл
        document.getElementById('content').innerHTML =
            await fetch(newRoute.template).then(response => response.text()); // подставляем с помощью fetch контент нужной страницы

        // меняем в html файле подключение нужного css файла (например form.css)
        document.getElementById('styles').setAttribute('href', newRoute.styles); //зменяем в href адрес странички styles.css в файле index.html
        document.getElementById('page-title').innerHTML = newRoute.title;
        // запустим Ф load
        newRoute.load();

        // теперь страница загружена, надо вызвать Ф openRoute
        // идем на страницу app.js и создаем экземпляр класса Router
    }

}
