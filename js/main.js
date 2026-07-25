/*======================================================
    PokeCard Idle Collector 2.0
    MAIN ENGINE
======================================================*/

"use strict";

/*=====================================
CONFIGURACIÓN
=====================================*/

const GAME_VERSION = 2;

const START_MONEY = 500;

const START_PACKS = 3;

/*=====================================
DATOS DEL JUGADOR
=====================================*/

let player = {

    username: "",

    money: START_MONEY,

    packs: START_PACKS,

    level: 1,

    experience: 0,

    cards: [],

    discovered: [],

    missions: [],

    achievements: [],

    statistics:{

        packsOpened:0,

        cardsObtained:0,

        shinyObtained:0,

        luckyBlocks:0,

        moneyEarned:0,

        playTime:0

    }

};

/*=====================================
ELEMENTOS HTML
=====================================*/

const loginScreen =
document.getElementById("loginScreen");

const gameScreen =
document.getElementById("gameScreen");

const usernameInput =
document.getElementById("username");

const loginButton =
document.getElementById("loginButton");

const moneyText =
document.getElementById("money");

const packsText =
document.getElementById("packs");

const cardsText =
document.getElementById("cards");

const levelText =
document.getElementById("level");

const openPackButton =
document.getElementById("openPack");
/*=====================================
INICIAR JUEGO
=====================================*/

window.addEventListener("load", () => {

    loadGame();

    initializeGame();

});

/*=====================================
INICIALIZACIÓN
=====================================*/

function initializeGame(){

    loginButton.addEventListener("click", login);

    openPackButton.addEventListener("click", openPack);

    initializeTabs();

    updateUI();

}

/*=====================================
LOGIN
=====================================*/

function login(){

    const name = usernameInput.value.trim();

    if(name.length < 3){

        alert("El nombre debe tener al menos 3 caracteres.");

        return;

    }

    player.username = name;

    loginScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");

    saveGame();

    updateUI();

    showNotification("¡Bienvenido " + player.username + "!");

}

/*=====================================
PESTAÑAS
=====================================*/

function initializeTabs(){

    const buttons =
    document.querySelectorAll(".menuButton");

    const tabs =
    document.querySelectorAll(".tab");

    buttons.forEach(button=>{

        button.addEventListener("click",()=>{

            buttons.forEach(btn=>{

                btn.classList.remove("active");

            });

            tabs.forEach(tab=>{

                tab.classList.remove("active");

            });

            button.classList.add("active");

            const id =
            button.dataset.tab;

            document
            .getElementById(id)
            .classList
            .add("active");

        });

    });

}

/*=====================================
ACTUALIZAR INTERFAZ
=====================================*/

function updateUI(){

    moneyText.textContent =
    player.money;

    packsText.textContent =
    player.packs;

    cardsText.textContent =
    player.cards.length;

    levelText.textContent =
    player.level;

}

/*=====================================
GANAR DINERO
=====================================*/

function addMoney(amount){

    player.money += amount;

    player.statistics.moneyEarned += amount;

    updateUI();

    saveGame();

}

/*=====================================
GASTAR DINERO
=====================================*/

function removeMoney(amount){

    if(player.money < amount){

        return false;

    }

    player.money -= amount;

    updateUI();

    saveGame();

    return true;

}
/*=====================================
ABRIR SOBRE
=====================================*/

function openPack(){

    if(player.packs <= 0){

        showNotification("❌ No tienes sobres.");

        return;

    }

    player.packs--;

    player.statistics.packsOpened++;

    const obtainedCards = [];

    for(let i = 0; i < 5; i++){

        const card = generatePokemon();

        player.cards.push(card);

        obtainedCards.push(card);

        if(!player.discovered.includes(card.id)){

            player.discovered.push(card.id);

        }

        player.statistics.cardsObtained++;

        if(card.shiny){

            player.statistics.shinyObtained++;

        }

    }

    updateUI();

    saveGame();

    showOpeningAnimation(obtainedCards);

}

/*=====================================
GENERAR POKÉMON
=====================================*/

function generatePokemon(){

    const index =
    Math.floor(Math.random() * POKEMON.length);

    const basePokemon = POKEMON[index];

    const shiny =
    Math.random() < 0.01;

    return{

        id:basePokemon.id,

        name:basePokemon.name,

        rarity:basePokemon.rarity,

        generation:basePokemon.generation,

        sprite:basePokemon.sprite,

        shiny:shiny

    };

}

/*=====================================
ANIMACIÓN DE APERTURA
=====================================*/

function showOpeningAnimation(cards){

    const screen =
    document.getElementById("openingScreen");

    const container =
    document.getElementById("openingCards");

    container.innerHTML = "";

    cards.forEach(card=>{

        const div =
        document.createElement("div");

        div.className =
        "card " +
        card.rarity;

        if(card.shiny){

            div.classList.add("shiny");

        }

        div.innerHTML =

        `
        <img src="${card.sprite}">

        <h3>${card.name}</h3>

        <p>${card.rarity}</p>
        `;

        container.appendChild(div);

    });

    screen.classList.remove("hidden");

    setTimeout(()=>{

        screen.classList.add("hidden");

    },5000);

    showNotification(
        "📦 Has abierto un sobre."
    );

}

/*=====================================
GANAR SOBRE
=====================================*/

function addPack(amount=1){

    player.packs += amount;

    updateUI();

    saveGame();

}

/*=====================================
SUBIR NIVEL
=====================================*/

function addExperience(exp){

    player.experience += exp;

    while(player.experience >= 100){

        player.experience -= 100;

        player.level++;

        showNotification(

            "🎉 ¡Nivel " +
            player.level +
            "!"

        );

    }

    updateUI();

}

/*=====================================
TIEMPO DE JUEGO
=====================================*/

setInterval(()=>{

    player.statistics.playTime++;

},1000);
