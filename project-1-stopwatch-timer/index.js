const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');
const miliseconds = document.getElementById('miliseconds');


const startBtn = document.getElementById('startbtn');
const stopBtn = document.getElementById('stopbtn');
const pauseBtn = document.getElementById('pausebtn');
const resetBtn = document.getElementById('resetbtn');


const laplist = document.getElementById('laplist');

let minute = 0;
let second = 0;
let mlisec = 0;

let interval;


startBtn.addEventListener('click',startTimer);
stopBtn.addEventListener('click',stopTimer);
pauseBtn.addEventListener('click',pauseTimer);
resetBtn.addEventListener('click',resetTimer);


function startTimer(){
interval = setInterval(updateTimer,10);
startBtn.disabled = true;
}


function stopTimer(){
clearInterval(interval);
addtoLapList();
resetTimerData();
startBtn.disabled = false;
}

function pauseTimer(){
clearInterval(interval);
pauseBtn.disabled = true;
}

function resetTimer(){
    clearInterval(interval);
    resetTimerData();
    startBtn.disabled = false;
    pauseBtn.disabled = false;
}

function updateTimer(){
    mlisec++;
    if(mlisec === 1000){
        mlisec = 0;
        second++;

        if(second === 60){
            second = 0;
            minute++;
        }
    }

    displayTimer();
}

function displayTimer(){
miliseconds.textContent = padTime(mlisec);
seconds.textContent = padTime(second);
minutes.textContent = padTime(minute);
}

function padTime(time){
    return time.toString().padStart(2,'0');
}


function resetTimerData(){
    minute = 0;
    second = 0;
    mlisec = 0;

    displayTimer();
}


function addtoLapList(){
    const lapTime = `${padTime(minute)}:${padTime(second)}:${padTime(mlisec)}`;
    const listItem = document.createElement('li');
     listItem.innerHTML = `<span>Lap ${laplist.childElementCount + 1}: </span>${lapTime}`;
     laplist.appendChild(listItem);
}