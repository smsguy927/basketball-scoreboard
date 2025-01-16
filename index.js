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
    timePerPeriodTs: 0,
    running: false,
    isHalftime: false,
    hasHalftimeRan: false,
    ended: false
}

const constants = {
    leadIcon: '👑',
    possIcon: '🏈',
    bonusIcon: '🎉',
    foulsIcon: '❌',
    maxFouls: 3,
    halfTimeTs: 300,
    hurryUpStart: 600,
    countdownStart: 100,
    periodSepChar: '/'
}


const newGameBtn = document.getElementById('new-game-button')
const newGameForm = document.getElementById('new-game-form')

const homeScoreCount = document.getElementById("home-score-count")
const awayScoreCount = document.getElementById("away-score-count")
const homePossBonus = document.getElementById("home-poss-bonus-container")
const awayPossBonus = document.getElementById("away-poss-bonus-container")
const homeFoulsCount = document.getElementById("home-fouls-count")
const awayFoulsCount = document.getElementById("away-fouls-count")
const timerSpan = document.getElementById("timer-span")
const periodCount = document.getElementById("period-count")
const periodSep = document.getElementById("period-sep")
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


    // hide form
    this[1].parentNode.hidden = true
    this[2].parentNode.hidden = true
    this[3].hidden = true

    // Clear Game State
    clearScores()
    clearPossBonus()
    clearFouls()
    resetTimer()

    // Set Initial Game State
    setPossession()
    setTimeParts(this[1].value)
    renderTime()
    gameState.currentPeriod = 1
    gameState.totalPeriods = parseInt(this[2].value)
    totalPeriods.innerText = gameState.totalPeriods
    gameState.timePerPeriodTs = gameState.totalTimeTs

    // Game Loop

    runTimer()


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
    timerSpan.textContent = '00:00:00'
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
        homePossBonus.children[0].innerText = constants.possIcon
        gameState.home.poss = true
    } else {
        awayPossBonus.children[0].innerText = constants.possIcon
        gameState.away.poss = true
    }
}

function setTimeParts(timeStr) {
    gameState.timeHrs = parseInt(timeStr.substring(0, 2))
    gameState.timeMins = parseInt(timeStr.substring(3, 5))
    gameState.timeSecs = parseInt(timeStr.substring(6, 8))
    calcTimeTs()
}
function setTimePartsFromTs() {
    let timeS = gameState.totalTimeTs / 10
    gameState.timeHrs = Math.floor(timeS / 3600)
    timeS -= gameState.timeHrs * 3600
    gameState.timeMins = Math.floor(timeS / 60)
    timeS -= gameState.timeMins * 60
    gameState.timeSecs = timeS
}

function renderTime() {
    const timeArr = []
    if (gameState.totalTimeTs < 600) {
        let displaySecs = gameState.totalTimeTs / 10
        if (displaySecs % 1 === 0) {
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
    if (gameState.totalTimeTs < constants.countdownStart) {
        timerSpan.classList.add('countdown')
        timerSpan.classList.remove('hurry-up')
    } else if (gameState.totalTimeTs < constants.hurryUpStart) {
        timerSpan.classList.add('hurry-up')
    } else {
        timerSpan.classList.remove('countdown')
        timerSpan.classList.remove('hurry-up')
    }
    timerSpan.innerText = timeArr.join(':')
}


function calcTimeTs() {

    let timeTs = 0
    timeTs += gameState.timeHrs * 3600
    timeTs += gameState.timeMins * 60
    timeTs += gameState.timeSecs

    gameState.totalTimeTs = timeTs * 10

}

function subtractSecond() {
    if (gameState.timeSecs === 0 && gameState.timeMins === 0 && gameState.timeHrs === 0) {
        return;
    }
    if (gameState.timeSecs === 0 && gameState.timeMins === 0) {
        gameState.timeHrs -= 1
        gameState.timeMins = 59
        gameState.timeSecs = 59
    } else if (gameState.timeSecs === 0) {
        gameState.timeMins -= 1
        gameState.timeSecs = 59
    } else {
        gameState.timeSecs -= 1
    }
}

function advancePeriod() {
    if (gameState.currentPeriod >= gameState.totalPeriods / 2 && !gameState.hasHalftimeRan) {
        gameState.isHalftime = true
        gameState.hasHalftimeRan = true
        gameState.running = false
        periodCount.innerText = "HALF"
        periodSep.innerText = ""
        totalPeriods.innerText = "TIME"
        gameState.totalTimeTs = constants.halfTimeTs
    } else {
        gameState.currentPeriod += 1
        periodCount.innerText = gameState.currentPeriod
        periodSep.innerText = constants.periodSepChar
        totalPeriods.innerText = gameState.totalPeriods
        gameState.totalTimeTs = gameState.timePerPeriodTs
        gameState.running = true
        gameState.isHalftime = false
    }
    setTimePartsFromTs()
}

function runTimer() {
    const interval = setInterval(() => {
        // TODO: Add Pause and Reset Timer Functionality
        if (gameState.totalTimeTs > 0) {
            gameState.totalTimeTs -= 1
            if (gameState.totalTimeTs % 10 === 9) {
                subtractSecond()
            }

            renderTime()
        } else if (gameState.currentPeriod < gameState.totalPeriods) {
            advancePeriod()

        } else {
            clearInterval(interval)
            gameState.running = false
            gameState.ended = true
            alert('Game Over')
        }
    }, 100)
}
