const lettersHtml = document.getElementById('letters');
const answerHtml = document.getElementById('answer');
const totalQuestionsHtml = document.getElementById('total_questions');
const currentQuestionHtml = document.getElementById('current_question');
let count = 0;

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

const setLetter = (array, className) => {
    return array.map(item => {
        return `<p class="btn ${className} ml-1 mr-1 mt-0 mb-0">${item}</p>`
    }).join('')
}

const render = () => {
    const randomTenArray = shuffleArray(dictionary).slice(0, 3);
    const letterArray = randomTenArray[count];
    let answerArray = [];

    answerHtml.innerHTML = '';
    currentQuestionHtml.innerHTML = `${count + 1}`
    totalQuestionsHtml.innerHTML = `${randomTenArray.length}`;

    if(count === randomTenArray.length) {
        count = 0;
        render();
    }

    const setLettersOfDictionary = () => {
        console.log(letterArray, 'letterArray');
        const randomLetterArray = shuffleArray([...letterArray]);
        lettersHtml.innerHTML = setLetter(randomLetterArray, 'btn-primary');
        const buttons = document.querySelectorAll('.btn');
        addBtn(buttons);
    }

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
            }

            if (letterArray.length === answerArray.length) {
                count++
                render();
            }

        })
    });

    setLettersOfDictionary();
}

render();




