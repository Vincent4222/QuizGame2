import { cultureGeneral } from "./questions.js";  
import { informatique } from "./questions2.js";
import { cinema } from "./questions3.js";

// Sélection des éléments HTML
const text = document.getElementById("question-text");
const container = document.getElementById("options-container");
const next = document.getElementById("next-button");
const replay = document.getElementById("replay-button");
const progressBar = document.getElementById("progress-bar");

let countdownTime = 29; 
let currentQuiz = null; 
let score = 0;
let currentQuestionIndex = 0;
let interval = null;

// Quizzes disponibles
const quizzes = {
  culturegenerale: cultureGeneral,
  informatique: informatique,
  cinema: cinema,
};

// Timer
let timeLeft = countdownTime;
const countdownElement = document.getElementById("countdown");
const pTimer = document.querySelector(".paragraph");

function startCountdown() {
    if (interval) clearInterval(interval); // Réinitialisation du timer

    timeLeft = countdownTime;
    countdownElement.innerText = timeLeft;
    pTimer.style.display = "block";

    interval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(interval);
        countdownElement.innerHTML = `<span style="font-size: 30px; font-weight: bold;">0 sec 😳</span>`; 
        text.innerHTML = `<strong>Temps écoulé ! 😳</strong><br>Votre score est : ${score} sur ${currentQuiz.questions.length}`;
        pTimer.style.display = "none";
        Array.from(container.children).forEach((btn) => (btn.disabled = true));
        next.disabled = true;
        next.style.display = "none";
        replay.disabled = false;
        replay.style.display = "inline-block";
        } else {
            countdownElement.innerText = timeLeft;
            timeLeft--;
        }
    }, 1000);
}

// Ajout d'événements pour la sélection des thèmes
document.querySelectorAll(".navbar button").forEach((button) => {
    button.addEventListener("click", () => {
        loadQuiz(button.dataset.quizName); 
        startCountdown(); // Le timer commence seulement après sélection du thème
    });
});

// Fonction pour charger un quiz
function loadQuiz(quizName) {
    currentQuiz = quizzes[quizName];

    if (!currentQuiz) {
        console.log("Quiz introuvable:", quizName);
        return;
    } else {
        currentQuestionIndex = 0;
        score = 0;
        loadQuestion();
    }
}

// Fonction pour charger une question
function loadQuestion() {
    if (!currentQuiz) {
        console.log("Aucun quiz chargé.");
        return;
    }
    container.innerHTML = "";
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    text.innerText = currentQuestion.text;
    next.disabled = true;

    currentQuestion.options.forEach((optionText) => {
        const optionsButton = document.createElement("button");
        optionsButton.innerText = optionText;
        optionsButton.classList.add("button-container");

        optionsButton.addEventListener("click", () => {
            if (optionText === currentQuestion.correctAnswer) {
                optionsButton.classList.add("correct");
                score++;
            } else {
                optionsButton.classList.add("incorrect");
            }
            Array.from(container.children).forEach((btn) => (btn.disabled = true));
            next.disabled = false;
        });

        container.appendChild(optionsButton);
    });
}

// Gère le bouton "Suivant"
next.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuiz.questions.length) {
        updateProgressBar();
        loadQuestion();
    } else {
        clearInterval(interval);
        text.innerHTML = `Fin du Quiz ! Votre score est : ${score} sur ${currentQuiz.questions.length}`;
        container.innerHTML = "";
        next.style.display = "none";
        replay.style.display = "inline-block";
        updateProgressBar();

        localStorage.setItem("LastResult", score);
        console.log(localStorage.getItem("LastResult"));
    }
});

// Mise à jour de la barre de progression
function updateProgressBar() {
    const totalQuestions = currentQuiz.questions.length;
    const numberQuestion = currentQuestionIndex;
    progressBar.innerText = numberQuestion + " / " + totalQuestions;
    progressBar.max = totalQuestions;
    progressBar.value = numberQuestion;
}

// Gère le bouton "Rejouer"
replay.addEventListener("click", () => {
    clearInterval(interval);
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = countdownTime;
    next.style.display = "inline-block";
    replay.style.display = "none";
    loadQuestion();
    updateProgressBar();
    startCountdown();
});
