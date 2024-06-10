let word = [];
let origin = [];
let asked = [];
let correctlyAnswered = [];
let finished = false;
let score = 0;
let currentTxt = '';
let ans = '';
let no = 0;
let chance = 0;
let letterNo = 1;
let correct = false;
let askedWord = '';
const WORDS = document.getElementById('words').innerText.split(',');
const alpha = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(',');
const speech = window.speechSynthesis || speechSynthesis;
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
    askedWord = text;
    if(text){
        currentTxt = 'Spell the word... '+text+' ...Origin of '+org;
    } else {
        finished = true;
        currentTxt = 'You have successfully finished the letter '+alpha[letterNo - 1];
    }
    speak(currentTxt);
    no = 0;
}
function repeat(){
    if(no < 3){
        speech.cancel();
        speak(currentTxt);
        no++
    } else {
        speech.cancel();
        speak('Max Repeat Reached');
    }
}
function assessInput(){
    const input = document.getElementById('input');

    if(input.value.toLowerCase() === ans){
        score += 10;
        speak('Correct');
        correct = true;
        input.style.border = '2px solid goldenrod';
        input.value = '';
		  if(chance < 2){
            correctlyAnswered.push(ans);
        }
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
    score = 0;
    displayScore();
    document.getElementById('start').innerText = 'Start';
    document.getElementById('input').innerText = '';
			document.getElementById('save').innerText = 'Save';
    document.getElementById('alphabet').innerText = alpha[letterNo - 1];
}
function saveData(){
    const json = JSON.stringify({
        asked: asked,
        correctlyAnswered: correctlyAnswered,
        currentTxt: currentTxt,
        score: score,
        ans: ans
    });

    localStorage.setItem(alpha[letterNo - 1], json);
    speech.cancel();
    speak('History Saved');
}
function getData(){
    const response = localStorage.getItem(alpha[letterNo - 1]);

    console.log(asked);
    const data = JSON.parse(response);

    asked = data.asked;
    correctlyAnswered = data.correctlyAnswered;
    currentTxt = data.currentTxt;
    score = data.score;
    ans = data.ans;
    document.getElementById('save').innerText = 'Save';
    speech.cancel();
    speak('History Restore');
    console.log(asked);
}
function clearData(){
    localStorage.removeItem(alpha[letterNo - 1]);
    word = [];
    origin = [];
    asked = [];
    correctlyAnswered = [];
    no = 0;
    currentTxt = '';
    correct = false;
    chance = 0;
    score = 0;
    ans = '';
    resetTexts();
    document.getElementById('save').innerText = 'Save';
    speech.cancel();
    speak('History Cleared');
}
async function getDefinition(){
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${askedWord}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(data)
        let text;
        if(!data[0]){
            text = data.title;
        } else {
            let def2 = 'Null'
            if(data[0].meanings[1]){
                def2 = data[0].meanings[1].definitions[0].definition;
            } else if(data[0].meanings[0].definitions[1]){
                def2 = data[0].meanings[0].definitions[1].definition;
            }
            const definition = `${data[0].meanings[0].definitions[0].definition} or ${def2}`;
            const origin = data[0].origin;
            const example = data[0].meanings[0].definitions[0].example;
            text = `${definition}...\nOrigin: ${origin}...\nExample: ${example}`;
        }
        return text
    } catch (error) {
        alert(error)
    }
}
async function showDefinition(){
    const defoutput = document.getElementById('defOutput');
    let text = await getDefinition();

    speak(text);
    text = text.replace(new RegExp(askedWord, 'g'), '*.*');
    defoutput.innerText = text;
}
function missedWord(){
    word = asked;
    asked = correctlyAnswered;
    document.getElementById('start').innerText = 'Start';
    speech.cancel()
    speak('Press start to start the missed words')
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
document.getElementById('input').addEventListener('keyup', (e) => {
    if(e.keyCode === 13){
        chance++
        speech.cancel();
        if(chance <= 3 && !correct){
            assessInput();
            if(correct){
                correct = false;
                displayAns();
                callWord();
                chance = 0;
           } else if(chance === 3 && !correct) {
            displayAns();
            callWord();
            chance = 0
        		}
        }
    }
});
document.getElementById('send').addEventListener('click', () => {
    chance++
    speech.cancel();
    if(chance <= 3 && !correct){
        assessInput();
        if(correct){
            correct = false;
            displayAns();
            callWord();
            chance = 0;
        } else if(chance === 3 && !correct) {
            displayAns();
            callWord();
            chance = 0
        }
    }
});
document.getElementById('forward').addEventListener('click', () => {
    if(letterNo >= 26){
        letterNo = 1;
    } else {
        letterNo += 1;
    }

	 speech.cancel();
	 speak(alpha[letterNo - 1]);
    word = [];
    origin = [];
    asked = [];
    correctlyAnswered = [];
    init();
    resetTexts();
});
document.getElementById('backward').addEventListener('click', () => {
    if(letterNo <= 0){
        letterNo = 1;
    } else {
        letterNo -= 1;
    }

	 speech.cancel();
	 speak(alpha[letterNo - 1]);
    init();
    resetTexts();
});
document.getElementById('save').addEventListener('click', (e) => {
    if(localStorage.hasOwnProperty(alpha[letterNo - 1])&&e.target.innerText === 'Continue'){
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
document.getElementById('def').addEventListener('click', () => {
    showDefinition();
});
document.getElementById('hide').addEventListener('click', (e) => {
    if(e.target.innerText === 'Hide'){
        document.getElementById('def-container').style.visibility = 'hidden';
        e.target.innerText = 'Show';
    } else if(e.target.innerText === 'Show'){
        document.getElementById('def-container').style.visibility = 'visible';
        e.target.innerText = 'Hide';
    }
});
document.getElementById('missed').addEventListener('click', (e) => {
    if(finished){
        missedWord();
    } else {
        speech.cancel();
        speak('Please finish this letter before practicing the missed word')
    }
});
init();