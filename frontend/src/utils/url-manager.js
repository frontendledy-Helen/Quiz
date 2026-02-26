//проверяем что пользователь вводил данные на странице form.html (в URL должна быть строка ?name=...&lastName=...)
//общая Ф которая будет проверять значения в нашем URL адресе на всех страничках

export class UrlManager {  //сделаем методы статическими, чтобы не делать экземпляры, не привязывать класс, не использовать экземпляры

    static getQueryParams() { // Ф чтобы достать параметры из URL используем регулярку
        const qs = document.location.hash.split('+').join(' ')

        let params = {},
            tokens,
            re = /[?&]([^=]+)=([^&]*)/g;

        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }
        return params; // в результате получим объект со значениями (params.name, params.lastName, params.email)
    }


    static checkUserData(params) {
        if (!params.name || !params.lastName || !params.email) {   // если одного из параметров нет, будем переводить на главную страницу
            location.href = '#/';
        }
    }
}