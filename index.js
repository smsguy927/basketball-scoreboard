const crownIcon = '👑'
const possesionIcon = '🏈'
const bonusIcon = '🎉'
const gameState = {
    home: {
        score: 0,
        fouls: 0,
        poss: false,
        bonus: false
    },
    away: {
        score: 0,
        fouls: 0,
        poss: false,
        bonus: false
    },
    timeHrs: 0,
    timeMins: 0,
    timeSecs: 0,
    totalTimeTs: 0,
    currentPeriod: 0,
    totalPeriods: 0,
    running: false
}


const newGameBtn = document.getElementById('new-game-button')
const newGameForm = document.getElementById('new-game-form')

const homeScoreCount = document.getElementById("home-score-count")
const awayScoreCount = document.getElementById("away-score-count")
const homePossBonus = document.getElementById("home-poss-bonus-container")
const awayPossBonus = document.getElementById("away-poss-bonus-container")
const homeFoulsCount = document.getElementById("home-fouls-count")
const awayFoulsCount = document.getElementById("away-fouls-count")
const time = document.getElementById("time")
const periodCount = document.getElementById("period-count")
const totalPeriods = document.getElementById("period-total")

function pressNewGame() {

    this.parentNode.children[1].hidden = false
    this.parentNode.children[2].hidden = false
    this.parentNode.children[3].hidden = false

}

newGameBtn.addEventListener('click', pressNewGame)
newGameForm.addEventListener('submit', startGame)


function startGame(e) {
    e.preventDefault()
    alert(this === e.target)

    // hide form
    this[1].parentNode.hidden = true
    this[2].parentNode.hidden = true
    this[3].hidden = true

    // Clear Game State
    clearScores()
    clearPossBonus()
    clearFouls()
    resetTimer()
    setPossession()

    setTimeParts(this[1].value)
    renderTime()
    gameState.totalPeriods = this[2].value
    totalPeriods.innerText = gameState.totalPeriods

}

function clearScores() {
    gameState.home.score = 0
    gameState.away.score = 0
    homeScoreCount.innerText = gameState.home.score
    awayScoreCount.innerText = gameState.away.score
}

function clearPossBonus() {
    gameState.home.poss = false
    gameState.home.bonus = false
    gameState.away.poss = false
    gameState.away.bonus = false
    homePossBonus.children[0].innerText = ''
    homePossBonus.children[1].innerText = ''
    awayPossBonus.children[0].innerText = ''
    awayPossBonus.children[1].innerText = ''
}

function clearFouls() {
    gameState.home.fouls = 0
    gameState.away.fouls = 0
    homeFoulsCount.innerText = gameState.home.fouls
    awayFoulsCount.innerText = gameState.away.fouls
}

function resetTimer() {
    gameState.timeTs = 0
    time.textContent = '00:00:00'
    gameState.currentPeriod = 0
    periodCount.innerText = gameState.currentPeriod
    gameState.totalPeriods = 0
    totalPeriods.innerText = gameState.totalPeriods
}

function flipACoin() {
    return Math.floor(Math.random() * 2)
}

function setPossession() {
    if (flipACoin()) {
        homePossBonus.children[0].innerText = possesionIcon
        gameState.home.poss = true
    } else {
        awayPossBonus.children[0].innerText = possesionIcon
        gameState.away.poss = true
    }
}

function setTimeParts(timeStr) {

    gameState.timeHrs = parseInt(timeStr.substring(0, 2))
    gameState.timeMins = parseInt(timeStr.substring(3, 5))
    gameState.timeSecs = parseInt(timeStr.substring(6, 8))
    calcTimeTs()

}

function renderTime() {
    const timeArr = []
    if (gameState.totalTimeTs < 600) {
        let displaySecs = gameState.totalTimeTs / 10
        if(displaySecs % 1 === 0){
            displaySecs += ".0"
        }
        timeArr.push(displaySecs)
    } else {
        if (gameState.timeHrs) {
            timeArr.push(gameState.timeHrs)
        }
        timeArr.push(gameState.timeMins.toString().padStart(2, '0'))
        timeArr.push(gameState.timeSecs.toString().padStart(2, '0'))
    }
    time.innerText = timeArr.join(':')
}

function calcTimeTs() {

    let timeTs = 0
    timeTs += gameState.timeHrs * 3600
    timeTs += gameState.timeMins * 60
    timeTs += gameState.timeSecs

    gameState.totalTimeTs = timeTs * 10

}

function runTimer(timeTs) {
    const interval = setInterval(() => {

    }, 100)
}
