let card = document.getElementsByClassName("card");
let cards = [...card];
let openedCards = [];
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
let dtopCoverImage = document.getElementsByClassName("desktopCover");
// array of images to shuffle
let cardImages = document.getElementsByClassName("card-image");
let cardImgArray = [...cardImages];

// shuffle function to randomize cards
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
// dispaly card function
function displayCard() {
    cardOpen(this);
    this.children[0].classList.toggle("showCard");
    this.children[0].classList.toggle("open");
    this.children[0].classList.toggle("show");
    this.classList.toggle("disabled");
}
// open cards than check for match if 2 cards are open
function cardOpen(card) {
    openedCards.push(card);
    let len = openedCards.length;
    if (len === 2) {
        moveCounter();
        if (openedCards[0].type === openedCards[1].type) {
            matched();
            woowho.play();
        } else {
            doh.play();
            resetPicks();
        }
    }
}
// move counter
function moveCounter() {
    moves++;
    if (moves == 1) {
        startTimer();
    }
}
// match check
function matched() {
    disable();
    // add timeout so there is a delay before matches are removed
    setTimeout(function () {
        openedCards[0].classList.add("match");
        openedCards[1].classList.add("match");
        openedCards[0].classList.remove("show", "open");
        openedCards[1].classList.remove("show", "open");
        matches.push(openedCards[0]);
        matches.push(openedCards[1]);
        enable();
        openedCards = [];
        if (matches.length == 20) {
            gameOver();
        }
    }, 400);
}
// reset picks when not matched
function resetPicks() {
    openedCards[0].classList.add("unmatched");
    openedCards[1].classList.add("unmatched");
    disable();
    setTimeout(function () {
        openedCards[0].classList.remove("show", "open", "unmatched");
        openedCards[1].classList.remove("show", "open", "unmatched");
        openedCards[0].children[0].classList.remove("showCard");
        openedCards[1].children[0].classList.remove("showCard");
        enable();
        openedCards = [];
    }, 425);
}
// disables click so you can't open more than 2 cards
function disable() {
    cards.filter((card, i, cards) => {
        card.classList.add("disabled");
    });
}
// re-enables cards to be clicked
function enable() {
    cards.filter((card) => {
        card.classList.remove('disabled');
        for (let i = 0; i < matches.length; i++) {
            matches[i].classList.add('disabled');
        }
    })
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
// check for game over and provide rating based on number of moves
function gameOver() {
    if (matches.length == 20) {
        clearInterval(interval);
        let finalTime = timer.innerHTML;
        console.log(modal);
        modal.classList.add("showModal");
        audio.pause();
        audio.currentTime = 0;
        document.getElementById("numMoves").innerHTML = moves;
        document.getElementById("totalTime").innerHTML = finalTime;
        closeModal();

        if (moves >= 10 && moves < 15) {
            beerRating[0].classList.toggle("hideBeers");
        } else if (moves >= 15 && moves < 20) {
            beerRating[1].classList.toggle("hideBeers");
        } else if (moves >= 20) {
            beerRating[2].classList.toggle("hideBeers");
        }
    }
}

function closeModal() {
    closeicon.addEventListener("click", function (e) {
        modal.classList.remove("showModal");
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



function startGame() {
    // shuffle cards using Fisher-Yates shuffle function
    let shuffledDeck = shuffle(cardImgArray);
    // sets gameStarted variable to true for sound toggle function
    gameStarted = true;
    // checks if sound is on before starting theme
    if (sound) {
        audio.play();
    }

    console.log(beerRating);

    for (i = 0; i < shuffledDeck.length; i++) {
        //remove all images from previous games from each card (if any)
        cards[i].innerHTML = "";
        // add the shuffled images to each card
        cards[i].appendChild(shuffledDeck[i]);
        cards[i].type = `${shuffledDeck[i].alt}`;
        // remove extra classes before game starts
        cards[i].classList.remove("show", "open", "match", "disabled");
        cards[i].children[0].classList.remove("showCard");
    }
    // add event listener onto the cards
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener("click", displayCard);
    }
    // mobileCoverImage[0].classList.add('hideCover');
    dtopCoverImage[0].classList.add("hideCover");

    // show the cards briefly before game starts
    setTimeout(function () {
        flashCards();
    }, 500);
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
    dtopCoverImage[0].classList.remove("hideCover");
    resetTimer();
    audio.pause();
    audio.currentTime = 0;
}

function flashCards() {
    for (i = 0; i < cards.length; i++) {
        cards[i].children[0].classList.add("showCard");
    }
    setTimeout(function () {
        for (i = 0; i < cards.length; i++) {
            cards[i].children[0].classList.remove("showCard");
        }
    }, 1500);
}