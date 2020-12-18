const cards = document.querySelectorAll(".card");

let isFlipped = false;
let clickDisabled = false;
let cardOne, cardTwo;
let gameStarted = false;
let matches = [];
let moves = 0;
let second = 0,
    minute = 0;
let timer = document.querySelector(".timer");
let interval = null;
// audio stuff
let sound = true;
let doh = new Audio("./assets/doh.mp3");
let woowho = new Audio("./assets/woowhoo.mp3");
let audio = new Audio("./assets/theme.mp3");
let audioStatus = document.querySelector(".sound");
// close icon in modal
let closeicon = document.getElementById("close");
// declare modal
let modal = document.getElementById("modal");
// rating
let beerRating = document.querySelector(".beerRating").children;
// coverImage
let dtopCoverImage = document.querySelector(".desktopCover");

// shuffle the cards and set order using flexbox order
function shuffle() {
    cards.forEach((card) => {
        let cardPosition = Math.floor(Math.random() * 20);
        card.style.order = cardPosition;
    });
}

function startGame() {
    shuffle();
    // add event listener on the cards
    cards.forEach((card) => card.addEventListener("click", displayCard));
    cards.forEach((card) =>
        card.classList.remove("show", "open", "match", "disabled", 'animate__bounceOutLeft', 'animate__bounceOutRight')
    );
    cards.forEach((card) => card.children[0].classList.remove("showCard"));
    // set matches to empty array
    matches = [];
    // set gameStarted to true for sound toggle
    gameStarted = true;
    // check if sound is on before starting theme
    if (sound) {
        audio.play();
    }
    // reset timer
    resetTimer();
    // remove cover image
    dtopCoverImage.classList.add("hideCover");
    // quickly show cards before game starts
    setTimeout(function () {
        flashCards();
    }, 500);
}
// function to flash the cards
function flashCards() {
    cards.forEach((card) => card.children[0].classList.add("showCard"));
    setTimeout(function () {
        cards.forEach((card) => card.children[0].classList.remove("showCard"));
    }, 1500);
}
// move counter
function moveCounter() {
    moves++;
    if (moves == 1) {
        startTimer();
    }
}

// toggle sounds on and off and sets text dynamically
function toggleSound() {
    if (gameStarted) {
        if (audio.paused) {
            audio.play();
            doh.muted = false;
            woowho.muted = false;
            sound = false;
            audioStatus.innerHTML = `Sound Off`;
        } else {
            audio.pause();
            doh.muted = true;
            woowho.muted = true;
            sound = true;
            audioStatus.innerHTML = `Sound On`;
        }
    } else {
        sound = false;
        doh.muted = true;
        woowho.muted = true;
        audioStatus.innerHTML = `Sound On`;
    }
}

function resetGame() {
    dtopCoverImage.classList.remove("hideCover");
    resetTimer();
    audio.pause();
    audio.currentTime = 0;
}

function closeModal() {
    closeicon.addEventListener("click", function (e) {
        modal.classList.remove("showModal", 'animate__fadeIn');
        resetGame();
    });
}

function resetTimer() {
    timer.innerHTML = "";
    clearInterval(interval);
    minute = 0;
    second = 0;
    timerOn = 0;
}
// timer function
function startTimer() {
    interval = setInterval(function () {
        if (second < 10) {
            timer.innerText = "0" + minute + "m   0" + second + "s";
        } else if (minute < 60) {
            timer.innerText = "0" + minute + "m  " + second + "s";
        }

        second++;
        if (second == 60) {
            minute++;
            second = 0;
        }
    }, 1000);
}

function displayCard() {
    if (clickDisabled) return;
    if (this === cardOne) return;

    this.children[0].classList.toggle("showCard");
    this.children[0].classList.toggle("open");

    if (!isFlipped) {
        // card one
        isFlipped = true;
        cardOne = this;
        return;
    }
    // card two
    cardTwo = this;
    checkMatch();
}

function checkMatch() {
    moveCounter();
    let isMatched =
        cardOne.children[0].dataset.value === cardTwo.children[0].dataset.value;

    isMatched ? matched() : resetPicks();
}

function matched() {
    woowho.play();
    cardOne.removeEventListener("click", displayCard);
    cardTwo.removeEventListener("click", displayCard);
    setTimeout(function () {
        cardOne.classList.add('animate__bounceOutLeft');
        cardTwo.classList.add('animate__bounceOutRight');
        matches.push(cardOne, cardTwo);
        if (matches.length == 20) {
            gameOver();
        }
        resetBoard();
    }, 500);
}

function resetBoard() {
    [isFlipped, clickDisabled] = [false, false];
    [cardOne, cardTwo] = [null, null];
}

function resetPicks() {
    doh.play();
    clickDisabled = true;
    setTimeout(() => {
        console.log(cardOne);
        cardOne.children[0].classList.remove("showCard", "open");
        cardTwo.children[0].classList.remove("showCard", "open");
        resetBoard();
    }, 700);
}

// check for game over and provide rating based on number of moves
function gameOver() {
    if (matches.length == 20) {
        clearInterval(interval);
        let finalTime = timer.innerHTML;
        console.log(modal);
        modal.classList.add("showModal", 'animate__fadeIn');
        audio.pause();
        audio.currentTime = 0;
        document.getElementById("numMoves").innerHTML = moves;
        document.getElementById("totalTime").innerHTML = finalTime;
        closeModal();

        if (moves >= 10 && moves < 15) {
            beerRating[1].classList.toggle("hideBeers");
        } else if (moves >= 15 && moves < 20) {
            beerRating[2].classList.toggle("hideBeers");
        } else if (moves >= 20) {
            beerRating[3].classList.toggle("hideBeers");
        }
    }
}