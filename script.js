const lettersHtml = document.getElementById('letters');
const answerHtml = document.getElementById('answer');
const totalQuestionsHtml = document.getElementById('total_questions');
const currentQuestionHtml = document.getElementById('current_question');

let count = 0;
let errorCount = 0;

let successObject = {
    word: 0,
    error: 0
};

const resultArray = [];

const dictionary = [
    "apple",
    "function",
    "timeout",
    "task",
    "application",
    "data",
    "tragedy",
    "sun",
    "symbol",
    "button",
    "software"
];

const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
}

const randomTenArray = shuffleArray(dictionary).slice(0, 7);

const setLetter = (array, className) => {
    return array.map((item, index) => {
        return `<p class="btn ${className} ml-1 mr-1 mt-0 mb-0" id='${index}'>${item}</p>`
    }).join('')
}

const getResultWordNotError = (array) => {
    let maxWord = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i]["error"] === 0) {
            maxWord++
        }
    }
    return maxWord
}

const getResultMaxErrorWord = (array) => {
    let maxCountError = 0;
    let index = 0
    for (let i = 0; i < array.length; i++) {
        if (array[i]["error"] !== 0 && array[i]["error"] > maxCountError) {
            maxCountError = array[i]["error"];
            index = array[i]["word"]
        }
    }

    return maxCountError ? randomTenArray[index] : '';
}

const toNodeList = (arrayOfNodes) => {
    const fragment = document.createDocumentFragment();
    arrayOfNodes.forEach(function (item) {
        fragment.appendChild(item.cloneNode(true));
    });
    return fragment.childNodes;
};

const render = () => {
    const letterArray = randomTenArray[count];
    let answerArray = [];
    const resultError = [...resultArray].reduce((a, b) => a + b.error, 0);

    answerHtml.innerHTML = '';
    currentQuestionHtml.innerHTML = `${count + 1}`
    totalQuestionsHtml.innerHTML = `${randomTenArray.length - 1}`;

    const randomLetterArray = shuffleArray([...letterArray]);
    lettersHtml.innerHTML = setLetter(randomLetterArray, 'btn-primary');
    const buttons = document.querySelectorAll('.btn');

    const addBtn = (buttons) => buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = answerArray.length;
            const diff = letterArray[index] === e.target.innerText;

            if (diff) {
                answerArray.push(e.target.innerText);
                answerHtml.innerHTML = setLetter(answerArray, 'btn-success');
                btn.remove()
                buttons.forEach(b => b.classList.remove('btn-danger'));
            } else {
                btn.classList.add('btn-danger');
                errorCount++;
            }

            if (letterArray.length === answerArray.length) {
                successObject = {error: errorCount, word: count};
                resultArray.push(successObject)
                count++;
                errorCount = 0;
                render();
            }

            if (errorCount >= 3) {
                lettersHtml.innerHTML = '';
                lettersHtml.innerHTML = setLetter(letterArray.split(''), 'btn-danger');
            }
        })
    });

    const addKey = (event) => {
        const index = answerArray.length;
        const diff = letterArray[index] === event.key;

        if (diff) {
            answerArray.push(event.key);
            answerHtml.innerHTML = setLetter(answerArray, 'btn-success');

            buttons.forEach(b =>  b.textContent === event.key && b.remove());
            buttons.forEach(b => b.classList.remove('btn-danger'));
        } else {
            buttons.forEach(b => b.textContent === event.key && b.classList.add('btn-danger'));
            errorCount++;
        }

        if (letterArray.length === answerArray.length) {
            successObject = {error: errorCount, word: count};
            resultArray.push(successObject)
            count++;
            errorCount = 0;
            document.removeEventListener('keydown', addKey);
            render();
        }

        if (errorCount >= 3) {
            lettersHtml.innerHTML = '';
            lettersHtml.innerHTML = setLetter(letterArray.split(''), 'btn-danger');
        }
    }

    addBtn(buttons);
    document.addEventListener('keydown', addKey);

    if (count === 6) {
        document.body.innerHTML = `<div class="modal fade show" style="display: block;">
                                      <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content">
                                          <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalCenterTitle">Congratulations!!!</h5>
                                          </div>
                                          <div class="modal-body">
                                       
                                            <p>Число собранных слов без ошибок - ${getResultWordNotError(resultArray)}</p>
                                            <p>Число ошибок - ${resultError}</p>
                                            <p>Слово с самым большим числом ошибок - ${getResultMaxErrorWord(resultArray)}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>`
    }
}

render();




