//Declaring variables
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
const alpha = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,ALL".split(',');
const speech = window.speechSynthesis || speechSynthesis;

//Defining needed functions

//init Function 

function init(){
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
        if((word.includes(' ') || word.includes(''))&&word.length > 1){
            alert('Error at '+word[word.indexOf('')]+' before '+word[word.indexOf('') - 1]);
        }
        document.getElementById('max-score').innerText = `Max-Score: ${word.length*10}`;
    } catch (error) {
        console.error(error);
    }
}

//Utility function to check if a number is even

function isEven(no){
    const result = no%2 === 0 ? true : false;
    return result;
}

//Utility Speak function 

function speak(str){
    const utterance = new SpeechSynthesisUtterance();

    utterance.text = str
    utterance.voice = speech.getVoices().filter(voice => voice.lang === "en-GB" && voice.gender === "female" && voice.name.includes("female"))[0];
    utterance.rate = 0.7;

    speech.speak(utterance);
};

// Get random number with max-value (max)

function getRandom(max){
    const no = Math.floor(Math.random() * max);
    return no;
}

//check if a word is available (hasnt been called)

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

//Generates a random word to ve called

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

//Calls the randomly generated word

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

//Repeats the called word for only 3 times

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

//Assesses users answer

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

//check if answer is wrong and move to the next word

function checkAns(){
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

//Display scoreboard

function displayScore(){
    const scoreboard = document.getElementById('score');
    scoreboard.innerText = `Score: ${score}`;
}

//Display Answer

function displayAns(){
    const output = document.getElementById('output');
    output.innerText = ans.toUpperCase();
}

//Reset all used variables

function resets(){
    word = [];
    origin = [];
    asked = [];
    correctlyAnswered = [];
    finished = false;
    score = 0;
    currentTxt = '';
    ans = '';
    no = 0;
    chance = 0;
    askedWord = '';
    correct = false;
    displayScore();
    document.getElementById('start').innerText = 'Start';
    document.getElementById('input').innerText = '';
			document.getElementById('output').innerText = '';
			document.getElementById('save').innerText = 'Save';
    document.getElementById('alphabet').innerText = alpha[letterNo - 1];
}

//Save data to localstorage

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

//Gets data from localstorage

function getData(){
    const response = localStorage.getItem(alpha[letterNo - 1]);

    const data = JSON.parse(response);

    asked = data.asked;
    correctlyAnswered = data.correctlyAnswered;
    currentTxt = data.currentTxt;
    score = data.score;
    ans = data.ans;
    document.getElementById('save').innerText = 'Save';
    speech.cancel();
    speak('History Restore');
}

//Clears data in localstorage

function clearData(){
    localStorage.removeItem(alpha[letterNo - 1]);
    resets();
    document.getElementById('save').innerText = 'Save';
    speech.cancel();
    speak('History Cleared');
}

//fetches definition of a word

async function getDefinition(){
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${askedWord}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

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

//Display the definition and reads it out also using regular exp to remove any occurencebof answer in the definition

async function showDefinition(){
    const defoutput = document.getElementById('defOutput');
    let text = await getDefinition();

    speak(text);
    text = text.replace(new RegExp(askedWord, 'g'), '*.*');
    defoutput.innerText = text;
}

//switch the asked word for the new total word and correctly amswered words for the askedword so it would only call words that wherent spelt correctly at first input

function missedWord(){
    word = asked;
    asked = correctlyAnswered;
    document.getElementById('start').innerText = 'Start';
    speech.cancel()
    speak('Press start to start the missed words')
}

//Switches the definition card's visibility

function switchDefinitionVisibility(e){
	if(e.target.innerText === 'Hide'){
        document.getElementById('def-container').style.visibility = 'hidden';
        e.target.innerText = 'Show';
    } else if(e.target.innerText === 'Show'){
        document.getElementById('def-container').style.visibility = 'visible';
        e.target.innerText = 'Hide';
    }
}


//Adding Event Listeners

//Adding start event
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

//Adding Enter Key Pressed event

document.getElementById('input').addEventListener('keyup', (e) => {
    if(e.keyCode === 13){
        checkAns()
    }
});

//Adding send event

document.getElementById('send').addEventListener('click', () => {
    checkAns()
});

//Adding forward event to change the alphabet

document.getElementById('forward').addEventListener('click', () => {
    if(letterNo >= 27){
        letterNo = 1;
    } else {
        letterNo += 1;
    }

	 speech.cancel();
	 speak(alpha[letterNo - 1]);
    resets();
    init()
});

//Adding backward event to change the alphabet

document.getElementById('backward').addEventListener('click', () => {
    if(letterNo <= 1){
        letterNo = 27;
    } else {
        letterNo -= 1;
    }
    speech.cancel();
    speak(alpha[letterNo - 1]);
    resets();
    init();
});

//Event for save

document.getElementById('save').addEventListener('click', (e) => {
    if(localStorage.hasOwnProperty(alpha[letterNo - 1])&&e.target.innerText === 'Continue'){
        document.getElementById('save').innerText = 'Save';
        document.getElementById('start').innerText = 'Start';
        getData();
    } else {
        saveData();
    }
});

//Event for Reveal

document.getElementById('reveal').addEventListener('click', () => {
    displayAns();
    callWord();
    chance = 0
});

//Event for Reset

document.getElementById('reset').addEventListener('click', () => {
    clearData();
    init();
});

//Event for Definition

document.getElementById('def').addEventListener('click', () => {
    showDefinition();
});

//Toggle Definition visibility

document.getElementById('hide').addEventListener('click', (e) => {
    switchDefinitionVisibility(e);
});

//Event for missed words

document.getElementById('missed').addEventListener('click', () => {
    if(finished){
        missedWord();
    } else {
        speech.cancel();
        speak('Please finish this letter before practicing the missed word')
    }
});

//initializing
init();