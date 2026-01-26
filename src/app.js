// Ф которая будет срабатывать при открытии какой-либо страницы, в момент загрузки файла

import {Router} from "./router.js";

class App {
    constructor() {  //когда все (DOMContentLoaded) на нашей страницу загрузилось,
        this.router = new Router(); // создадим переменную с экзепляром класса Router, т.к. this.router нам еще понадобится
        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this));  // пропишем Ф которая определит, какую страницу мы сейчас открыли


        // событие ('popstate') - когда меняется наш URL, при переходе на другую страницу
        window.addEventListener('popstate', this.handleRouteChanging.bind(this));   // пропишем Ф которая определит, какую страницу мы сейчас открыли
    }

    // т.к. используем два раза прописываем отдельную Ф handleRouteChanging и используем выше
    handleRouteChanging() { // отловить изменения нашего роута
        this.router.openRoute(); // когда весь контент на страницу загружен вызовем Ф openRoute
    }
}

(new App()) // сразу создаем экземпляр класса App, чтобы был осуществлян вызов нашей Ф