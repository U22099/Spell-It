const word = [];
const origin = [];
const asked = [];
let score = 0;
let currentTxt = '';
let ans = '';
let no = 0;
let chance = 0;
let correct = false;
const WORDS = document.getElementById('words').innerText.split(',');
const alpha = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(',');
async function init(str){
    try {
        const data = WORDS[alpha.indexOf(str)];
        const wordAll = data.split(' ');
        for (let i = 0; i < wordAll.length; i++) {
            if(i === 1 || isEven(i)){ 
                word.push(wordAll[i]);
            } else {
                origin.push(wordAll[i]);
            }
        }
        if(word.includes('') || origin.includes('')){
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
    const no = Math.floor((Math.random() * max));
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
    return arrayObj
}
function generateNewWord(){
    const {word, origin} = available();
    const no = getRandom(word.length-1);

    const speech ={
        text: word[no],
        org: origin[no]
    }
    asked.push(word[no]);
    ans = speech.text;

    return speech
}
function callWord(){
    const {text, org} = generateNewWord();
    currentTxt = 'Spell the word... '+text+' ...Origin of '+org;
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
    } else {
        score -= 10;
        speak('Wrong');
        correct = false;
        input.style.border = '2px solid red';
    }
    displayScore()
}
function displayScore(){
    const scoreboard = document.getElementById('score');
    scoreboard.innerText = score;
}
function displayAns(){
    const output = document.getElementById('output');
    const input = document.getElementById('input');
    input.innerText = '';
    output.innerText = ans.toUpperCase();
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
document.getElementById('send').addEventListener('click', () => {
    if(chance < 3 && !correct){
        assessInput();
        if(correct){
            correct = false;
            displayAns();
            callWord();
            chance = 0;
        }
        chance++
    } else {
        displayAns();
        callWord();
        chance = 0
    }
});
init('A');