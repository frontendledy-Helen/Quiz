//проверяем что пользователь вводил данные на странице form.html (в URL должна быть строка ?name=...&lastName=...)
//общая Ф которая будет проверять значения в нашем URL адресе на всех страничках

function checkUserData() {
    const url = new URL(location.href); //текущий URL на странице
    const name = url.searchParams.get('name'); //берем текущие параметры из этого URL
    const lastName = url.searchParams.get('lastName');
    const email = url.searchParams.get('email');

    if (!name || !lastName || !email) {   // если одного из параметров нет, будем переводить на главную страницу
        location.href = 'index.html';
    }
}