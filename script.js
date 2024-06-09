let word = [];
let origin = [];
let asked = [];
let score = 0;
let currentTxt = '';
let ans = '';
let no = 0;
let chance = 0;
let letterNo = 1;
let correct = false;
const WORDS = document.getElementById('words').innerText.split(',');
const alpha = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(',');
async function init(){
    if(localStorage.hasOwnProperty(alpha[letterNo - 1])){
        document.getElementById('save').innerText = 'Continue';
    }
    try {
        const data = WORDS[letterNo - 1];
        const wordAll = data.split(' ');
        for (let i = 0; i < wordAll.length; i++) {
            if(i === 0 || isEven(i)){
                word.push(wordAll[i]);
            } else {
                origin.push(wordAll[i]);
            }
        }
        if(word.includes(' ') || word.includes('')){
            console.log('Error at'+word[word.indexOf(' ')]+' before'+word[word.indexOf(' ')]-1);
        }
    } catch (error) {
        console.error(error);
    }
}
function isEven(no){
    const result = no%2 === 0 ? true : false;
    return result;
}

function speak(str){
    const speech = window.speechSynthesis || speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();

    utterance.text = str
    utterance.voice = speech.getVoices().filter(voice => voice.lang === "en-GB" && voice.gender === "female" && voice.name.includes("female"))[0];
    utterance.rate = 0.7;

    speech.speak(utterance);
};
function getRandom(max){
    const no = Math.floor(Math.random() * max);
    return no;
}
function available(){
    const arrayObj = {
        word: [],
        origin: []
    }
    for (let i = 0; i < word.length; i++) {
        if(asked.includes(word[i])) continue;

        arrayObj.word.push(word[i]);
        arrayObj.origin.push(origin[i]);
    }
    if(arrayObj.word.length === 0){
        arrayObj.word.push('null');
    }
    return arrayObj
}
function generateNewWord(){
    const {word, origin} = available();
    const no = getRandom(word.length);

    if(word[0] !== 'null'){
        const speech ={
            text: word[no],
            org: origin[no]
        }
        asked.push(word[no]);
        ans = speech.text;
        

        return speech
    } else {
        return {
            text: null,
            org: null
        }
    }
}
function callWord(){
    const {text, org} = generateNewWord();
    if(text){
        currentTxt = 'Spell the word... '+text+' ...Origin of '+org;
    } else {
        currentTxt = 'You have successfully finished the letter '+alpha[letterNo - 1];
    }
    speak(currentTxt);
    no = 0;
}
function repeat(){
    if(no < 3){
        speak(currentTxt);
        no++
    } else {
        speak('Max Repeat Reached');
    }
}
function assessInput(){
    const input = document.getElementById('input');

    if(input.value.toLowerCase() === ans){
        score += 10;
        speak('Correct');
        correct = true
        input.style.border = '2px solid goldenrod';
        input.value = '';
    } else {
        score -= 10;
        speak('Wrong');
        correct = false;
        input.style.border = '2px solid red';
        input.value = '';
    }
    displayScore()
}
function displayScore(){
    const scoreboard = document.getElementById('score');
    scoreboard.innerText = score;
}
function displayAns(){
    const output = document.getElementById('output');
    output.innerText = ans.toUpperCase();
}
function resetTexts(){
    ans = '';
    document.getElementById('start').innerText = 'Start';
    document.getElementById('input').innerText = '';
    document.getElementById('alphabet').innerText = alpha[letterNo - 1];
}
function saveData(){
    const json = JSON.stringify({
        word: word,
        origin: origin,
        asked: asked,
        no: no,
        currentTxt: currentTxt,
        correct: correct,
        chance: chance,
        score: score,
        ans: ans
    });

    localStorage.setItem(alpha[letterNo - 1], json);
}
function getData(){
    const response = localStorage.getItem(alpha[letterNo - 1]);

    const data = JSON.parse(response);

    word = data.word;
    origin = data.origin;
    asked = data.asked;
    no = data.no;
    currentTxt = data.currentTxt;
    correct = data.correct;
    chance = data.chance;
    score = data.score;
    ans = data.ans;
    document.getElementById('save').innerText = 'Save';
}
function clearData(){
    localStorage.removeItem(alpha[letterNo - 1]);
    word = [];
    origin = [];
    asked = [];
    no = 0;
    currentTxt = '';
    correct = false;
    chance = 0;
    score = 0;
    ans = '';
    resetTexts();
    document.getElementById('save').innerText = 'Save';
}
document.getElementById('start').addEventListener('click', () => {
    switch(document.getElementById('start').innerText){
        case 'Start':
            callWord();
            document.getElementById('start').innerText = 'Repeat';
            break;
        case 'Repeat':
            repeat();
            break;
    }
});
document.getElementById('send').addEventListener('keyup', (e) => {
    if(e.key === 'Enter'){
        chance++
        if(chance <= 3 && !correct){
            assessInput();
            if(correct){
                correct = false;
                displayAns();
                callWord();
                chance = 0;
            }
        } else {
            displayAns();
            callWord();
            chance = 0
        }
    }
});
document.getElementById('send').addEventListener('click', () => {
    chance++
    if(chance <= 3 && !correct){
        assessInput();
        if(correct){
            correct = false;
            displayAns();
            callWord();
            chance = 0;
        }
    } else {
        displayAns();
        callWord();
        chance = 0
    }
});
document.getElementById('forward').addEventListener('click', () => {
    if(letterNo >= 26){
        letterNo = 1;
    } else {
        letterNo += 1;
    }

    word = [];
    origin = [];
    init();
    resetTexts();
});
document.getElementById('backward').addEventListener('click', () => {
    if(letterNo <- 0){
        letterNo = 1;
    } else {
        letterNo -= 1;
    }

    init();
    resetTexts();
});
document.getElementById('save').addEventListener('click', () => {
    if(localStorage.hasOwnProperty(alpha[letterNo - 1])){
        document.getElementById('save').innerText = 'Save';
        document.getElementById('start').innerText = 'Start';
        getData();
    } else {
        saveData();
    }
});
document.getElementById('reset').addEventListener('click', () => {
    clearData();
    init();
});

init();