
// Ф которая будет срабатывать при открытии какой-либо страницы, в момент загрузки файла

import {Router} from "./router.js";

class App {
    constructor() {  //когда все (DOMContentLoaded) на нашей страницу загрузилось,
        this.router = new Router(); // создадим переменную с экзепляром класса Router, т.к. this.router нам еще понадобится
        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this));  // пропишем Ф которая определит, какую страницу мы сейчас открыли

        // событие ('hashchange') - когда меняется hash в URL (#/result, #/test и т.д.)
        // срабатывает при программном изменении hash (location.href = '#/result')
        // и при нажатии кнопок браузера "Назад"/"Вперед" (если меняется hash)
        window.addEventListener('hashchange', this.handleRouteChanging.bind(this));

        // событие ('popstate') - когда меняется история через History API (pushState/replaceState)
        // оставляем на случай использования History API в будущем
        // window.addEventListener('popstate', this.handleRouteChanging.bind(this));
    }

    // т.к. используем два раза прописываем отдельную Ф handleRouteChanging и используем выше
    handleRouteChanging() { // отловить изменения нашего роута
        this.router.openRoute(); // когда весь контент на страницу загружен вызовем Ф openRoute
    }
}

(new App()) // сразу создаем экземпляр класса App, чтобы был осуществлян вызов нашей Ф