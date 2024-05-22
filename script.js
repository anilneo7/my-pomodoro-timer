const timer = document.querySelector('.timer');
const title = document.querySelector('.title');
const startBtn = document.querySelector('.startBtn');
const pauseBtn = document.querySelector('.pauseBtn');
const resumeBtn = document.querySelector('.resumeBtn');
const resetBtn = document.querySelector('.resetBtn');
const pomoCountsDisplay = document.querySelector('.pomoCountsDisplay');
const quotes = document.querySelector('#quotes');
const newPomodoroBtn = document.querySelector(".newPomodoroBtn");

// Input elements for setting custom timer
const workTimeInput = document.querySelector('#workTimeInput');
const breakTimeInput = document.querySelector('#breakTimeInput');
const setTimeBtn = document.querySelector('#setTimeBtn');

// Permanent variables
let WORK_TIME = 25 * 60; // as seconds is used in setInterval function
let BREAK_TIME = 5 * 60;
let timerId = null;
let oneRoundCompleted = false; // This is the FLAG for oneRoundCompleted=work time + break time
let totalCount = 0;
let pause = false;

// Countdown function
const countDown = (startTime) => {
    return () => {
        const mins = Math.floor(startTime / 60).toString().padStart(2, '0'); 
        const sec = Math.floor(startTime % 60).toString().padStart(2, '0');
        timer.textContent = `${mins}:${sec}`;
        startTime--;
        if (startTime < 0) {
            stopTimer();
            if (!oneRoundCompleted) { 
                timerId = startTimer(BREAK_TIME); 
                oneRoundCompleted = true;
                updateTitle("It's Break Time");
            } else {
                updateTitle("One round of Pomodoro technique is completed");
                setTimeout(() => { updateTitle("Start Another Round"); }, 3500);
                totalCount++;
                saveLocalCounts();
                showPomoCounts();
            }
        }
    };
};

// Function to save pomodoro counts to local storage
const saveLocalCounts = () => {
    let counts = JSON.parse(localStorage.getItem("pomoCounts"));
    counts !== null ? counts++ : counts = 1;
    localStorage.setItem("pomoCounts", JSON.stringify(counts));
};

// Function to update title
const updateTitle = (msg) => {
    title.textContent = msg;
};

// Function to start timer
const startTimer = (startTime) => {
    if (timerId != null) {
        stopTimer();
    }
    return setInterval(countDown(startTime), 1000);
};

// Function to stop timer
const stopTimer = () => {
    clearInterval(timerId);
    timerId = null;
};

// Function to get time in seconds
const getTimeInSeconds = (timeString) => {
    const [minutes, seconds] = timeString.split(":");
    return parseInt(minutes) * 60 + parseInt(seconds);
};

// Event listener for start button
startBtn.addEventListener('click', () => {
    timerId = startTimer(WORK_TIME);
    updateTitle("It's work time");
});

// Event listener for pause button
pauseBtn.addEventListener('click', () => {
    stopTimer();
    pause = true;
    updateTitle("Timer Paused");
});

// Event listener for resume button
resumeBtn.addEventListener('click', () => {
    if (pause) {
        const currentTime = getTimeInSeconds(timer.textContent);
        timerId = startTimer(currentTime);
        pause = false;
        updateTitle("It's Work Time");
    }
});

// Event listener for reset button
resetBtn.addEventListener('click', () => {
    stopTimer();
    timer.textContent = `${String(Math.floor(WORK_TIME / 60)).padStart(2, '0')}:${String(WORK_TIME % 60).padStart(2, '0')}`;
    updateTitle("Timer reset");
    oneRoundCompleted = false;
});

// Function to show completed pomodoros on screen from local storage
const showPomoCounts = () => {
    const counts = JSON.parse(localStorage.getItem("pomoCounts"));
    if (counts > 0) {
        pomoCountsDisplay.style.display = "flex";
    }
    pomoCountsDisplay.firstElementChild.textContent = counts;
};

// Calling showPomoCounts initially
showPomoCounts();

// JS to add motivational quotes
const motivationalQuotes = [
    "Push yourself, because no one else is going to do it for you.",
    "Success doesn't come from what you do occasionally, it comes from what you do consistently.",
    "Your future is created by what you do today, not tomorrow.",
    "The harder you work for something, the greater you’ll feel when you achieve it.",
    "Dream big. Start small. Act now.",
    "Don’t stop when you’re tired. Stop when you’re done.",
    "Focus on your goal. Don’t look in any direction but ahead.",
    "You don’t have to be great to start, but you have to start to be great.",
    "Every champion was once a contender that didn’t give up.",
    "Success is what happens after you have survived all your mistakes.",
    "Work hard in silence, let success be your noise.",
    "You are your only limit.",
    "The key to success is to focus on goals, not obstacles.",
    "Your time is limited, don’t waste it living someone else’s life.",
    "Start where you are. Use what you have. Do what you can."
];

const randomQuotesGenerator = () => {
    let randomQuote = Math.floor(Math.random() * motivationalQuotes.length);
    quotes.textContent = `"${motivationalQuotes[randomQuote]}"`;
    console.log(randomQuote);
};
randomQuotesGenerator();
setInterval(randomQuotesGenerator, 15000);

// Event listener to start new pomodoro that clears previous pomodoro counts
newPomodoroBtn.addEventListener("click", () => {
    localStorage.setItem("pomoCounts", 0);
    showPomoCounts();
});

// Code to set custom timer
setTimeBtn.addEventListener("click", () => {
    const workMinute = parseInt(workTimeInput.value);
    const breakMinute = parseInt(breakTimeInput.value);
    if (!isNaN(workMinute) && workMinute > 0) {
        WORK_TIME = workMinute * 60;
        timer.textContent = `${String(workMinute).padStart(2, '0')}:00`;
    }
    if (!isNaN(breakMinute) && breakMinute > 0) {
        BREAK_TIME = breakMinute * 60;
    }
    updateTitle("Timer Settings Updated!");
}); 
 
