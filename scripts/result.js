(function () {
    const Result = { // создаем объект Result
        resultPassElement: null,
        init() {
            const that = this;
            const url = new URL(location.href)  //распарсим наш URL, который прописали на странице test.js (location.href = 'result.html?score=' + result.score + '&total=' + result.total)
            document.getElementById('result-score').innerText = url.searchParams.get('score') + '/' + url.searchParams.get('total'); // пропишем в html результат тестирования


            this.resultPassElement = document.getElementById('result-pass'); //кнопка перехода на страницу answers.html
            this.resultPassElement.onclick = function () {  // нажали на кнопку
                that.processForm(); // вызов функции при клике на кнопку, данные будут передаваться по URL на другую страницу, сама работпа Ф описана ниже
            }

        },
        processForm() { // при клике на кнопку отправки, будет вызов этой Ф (выше вызов)

                location.href = 'answers.html' //переходим на страничку choice.html
        }

    }

    Result.init();
})();