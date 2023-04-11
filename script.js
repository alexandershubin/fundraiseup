const lettersElement = document.getElementById('letters');
const answerElement = document.getElementById('answer');
const totalQuestionsElement = document.getElementById('total_questions');
const currentQuestionElement = document.getElementById('current_question');

let count = 0;
let errorCount = 0;
const MAX_ERRORS = 3;

let successObject = {
    word: 0,
    error: 0
};

const resultArray = [];

const words = [
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

const randomWords = shuffleArray(words).slice(0, 7);

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

    return maxCountError ? randomWords[index] : '';
}

const renderResultModal = (resultError, resultArray) => {
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

const showSolution = (e, letterArray, answerArray, cl) => {
    if (letterArray.length === answerArray.length) {
        successObject = {error: errorCount, word: count};
        resultArray.push(successObject)
        count++;
        errorCount = 0;
        e.type === 'keydown' && document.removeEventListener('keydown', cl);
        render();
    }

    if (errorCount >= MAX_ERRORS) {
        lettersElement.innerHTML = '';
        lettersElement.innerHTML = setLetter(letterArray, 'btn-danger');
    }
};

const render = () => {
    const letterArray = randomWords[count];
    let answerArray = [];
    const resultError = [...resultArray].reduce((a, b) => a + b.error, 0);

    answerElement.innerHTML = '';
    currentQuestionElement.innerHTML = `${count + 1}`
    totalQuestionsElement.innerHTML = `${randomWords.length - 1}`;

    const randomLetterArray = shuffleArray([...letterArray]);
    lettersElement.innerHTML = setLetter(randomLetterArray, 'btn-primary');
    const buttons = document.querySelectorAll('.btn');

    const handleClick = (e) => {
        const index = answerArray.length;
        const diff = letterArray[index] === e.target.innerText;

        if (diff) {
            answerArray.push(e.target.innerText);
            answerElement.innerHTML = setLetter(answerArray, 'btn-success');
            e.target.remove();
            buttons.forEach(b => b.classList.remove('btn-danger'));
        } else {
            e.target.classList.add('btn-danger');
            errorCount++;
        }

        showSolution(e, letterArray, answerArray)
    };

    const handleKeyDown = (e) => {
        const index = answerArray.length;
        const diff = letterArray[index] === e.key;

        if (diff) {
            answerArray.push(e.key);
            answerElement.innerHTML = setLetter(answerArray, 'btn-success');

            buttons.forEach(b => b.textContent === e.key && b.remove());
            buttons.forEach(b => b.classList.remove('btn-danger'));
        } else {
            buttons.forEach(b => b.textContent === e.key && b.classList.add('btn-danger'));
            errorCount++;
        }

        showSolution(e, letterArray, answerArray, handleKeyDown)
    }
    const addHandleClick = () => {
        buttons.forEach(btn => {
            btn.addEventListener('click', handleClick);
        });
    };

    addHandleClick()
    document.addEventListener('keydown', handleKeyDown);
    count === 2 && renderResultModal(resultError, resultArray);
}

render();
