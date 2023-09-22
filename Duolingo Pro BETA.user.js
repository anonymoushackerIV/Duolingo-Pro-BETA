// ==UserScript==
// @name         Duolingo Pro BETA
// @namespace    Violentmonkey Scripts
// @version      2.0BETA6
// @description  Duolingo Auto Solver Tool - WORKING AUGUST 2023
// @author       anonymoushackerIV
// @match        https://*.duolingo.com/*
// @grant        none
// @license MIT
// @require      https://unpkg.com/@supabase/supabase-js@2.12.1
// ==/UserScript==

let solvingIntervalId;
let isAutoMode = false;
let isTokenRunning = false;
let isSolving = false;

const debug = false;

let simulated;
if (JSON.parse(localStorage.getItem('DuolingoProSettingsHumaneSolvingMode')) === null) {
    simulated = false;
} else {
    simulated = JSON.parse(localStorage.getItem('DuolingoProSettingsHumaneSolvingMode'));
}

let isSendFeedbackButtonPressed = false;

let autoSolverBoxRepeatAmount = 0;
autoSolverBoxRepeatAmount = Number(sessionStorage.getItem('autoSolverBoxRepeatAmount'));

let ProBlockBannerOneVisible = true;
if (JSON.parse(localStorage.getItem('ProBlockBannerOneVisible')) === null) {
    ProBlockBannerOneVisible = true;
} else {
    ProBlockBannerOneVisible = JSON.parse(localStorage.getItem('ProBlockBannerOneVisible'));
}


let autoSolverBoxPracticeOnlyMode;
let autoSolverBoxRepeatLessonMode;
if (JSON.parse(sessionStorage.getItem('autoSolverBoxPracticeOnlyMode')) === null) {
    autoSolverBoxPracticeOnlyMode = true;
} else {
    autoSolverBoxPracticeOnlyMode = JSON.parse(sessionStorage.getItem('autoSolverBoxPracticeOnlyMode'));
}
if (JSON.parse(sessionStorage.getItem('autoSolverBoxRepeatLessonMode')) === null) {
    autoSolverBoxRepeatLessonMode = false;
} else {
    autoSolverBoxRepeatLessonMode = JSON.parse(sessionStorage.getItem('autoSolverBoxRepeatLessonMode'));
}


let wasAutoSolverBoxRepeatStartButtonPressed = false;
if (JSON.parse(sessionStorage.getItem('wasAutoSolverBoxRepeatStartButtonPressed')) === null) {
    wasAutoSolverBoxRepeatStartButtonPressed = false;
} else {
    wasAutoSolverBoxRepeatStartButtonPressed = JSON.parse(sessionStorage.getItem('wasAutoSolverBoxRepeatStartButtonPressed'));
}

// Whats New Variables Start
let wasWhatsNewInTwoPointZeroBetaThreeFinished = false;
if (JSON.parse(localStorage.getItem('wasWhatsNewInTwoPointZeroBetaThreeFinished')) === null) {
    wasWhatsNewInTwoPointZeroBetaThreeFinished = false;
} else {
    wasWhatsNewInTwoPointZeroBetaThreeFinished = JSON.parse(localStorage.getItem('wasWhatsNewInTwoPointZeroBetaThreeFinished'));
}

let wasWhatsNewInTwoPointZeroBetaFourFinished = false;
if (JSON.parse(localStorage.getItem('wasWhatsNewInTwoPointZeroBetaFourFinished')) === null) {
    wasWhatsNewInTwoPointZeroBetaFourFinished = false;
} else {
    wasWhatsNewInTwoPointZeroBetaFourFinished = JSON.parse(localStorage.getItem('wasWhatsNewInTwoPointZeroBetaFourFinished'));
}

let wasWhatsNewInTwoPointZeroBetaSixFinished = false;
if (JSON.parse(localStorage.getItem('wasWhatsNewInTwoPointZeroBetaSixFinished')) === null) {
    wasWhatsNewInTwoPointZeroBetaSixFinished = false;
} else {
    wasWhatsNewInTwoPointZeroBetaSixFinished = JSON.parse(localStorage.getItem('wasWhatsNewInTwoPointZeroBetaSixFinished'));
}

let whatsNewInBetaStage = 1;
// Whats New Variables End

let wasDuolingoProSettingsButtonOnePressed = false;

// Duolingo Pro Settings Variables Start

//moved here
let AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox = false;
//moved here

let AutoSolverSettingsShowAutoSolverBox = true;
if (JSON.parse(localStorage.getItem('AutoSolverSettingsShowAutoSolverBox')) === null) {
    AutoSolverSettingsShowAutoSolverBox = true; // default
} else if (JSON.parse(localStorage.getItem('AutoSolverSettingsShowAutoSolverBox')) === false) {
    AutoSolverSettingsShowAutoSolverBox = JSON.parse(localStorage.getItem('AutoSolverSettingsShowAutoSolverBox'));

    AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox = false;
    localStorage.setItem('AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox', AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox);

} else {
    AutoSolverSettingsShowAutoSolverBox = JSON.parse(localStorage.getItem('AutoSolverSettingsShowAutoSolverBox'));
}

//was here
if (JSON.parse(localStorage.getItem('AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox')) === null) {
    AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox = false; // default
} else {
    AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox = JSON.parse(localStorage.getItem('AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox'));
}

let AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox = true;
if (JSON.parse(localStorage.getItem('AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox')) === null) {
    AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox = true; // default
} else {
    AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox = JSON.parse(localStorage.getItem('AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox'));
}

let AutoSolverSettingsLowPerformanceMode = false;
if (JSON.parse(localStorage.getItem('AutoSolverSettingsLowPerformanceMode')) === null) {
    AutoSolverSettingsLowPerformanceMode = false; // default
} else {
    AutoSolverSettingsLowPerformanceMode = JSON.parse(localStorage.getItem('AutoSolverSettingsLowPerformanceMode'));
}

let DuolingoProSettingsProBlockMode = true;
if (JSON.parse(localStorage.getItem('DuolingoProSettingsProBlockMode')) === null) {
    DuolingoProSettingsProBlockMode = true; // default
} else {
    DuolingoProSettingsProBlockMode = JSON.parse(localStorage.getItem('DuolingoProSettingsProBlockMode'));
    if (!DuolingoProSettingsProBlockMode) {
        ProBlockBannerOneVisible = true;
        localStorage.setItem('ProBlockBannerOneVisible', ProBlockBannerOneVisible);
    }
}

let DuolingoProSettingsTurboSolveMode = false;
if (JSON.parse(localStorage.getItem('DuolingoProSettingsTurboSolveMode')) === null) {
    DuolingoProSettingsTurboSolveMode = false; // default
} else {
    DuolingoProSettingsTurboSolveMode = JSON.parse(localStorage.getItem('DuolingoProSettingsTurboSolveMode'));
}

let DuolingoProSettingsHumaneSolvingMode = false;
if (JSON.parse(localStorage.getItem('DuolingoProSettingsHumaneSolvingMode')) === null) {
    DuolingoProSettingsHumaneSolvingMode = false; // default
} else {
    DuolingoProSettingsHumaneSolvingMode = JSON.parse(localStorage.getItem('DuolingoProSettingsHumaneSolvingMode'));
}
// Duolingo Pro Settings Variables End


function addButtons() {
    if (window.location.pathname === '/learn') {
        let button = document.querySelector('a[data-test="global-practice"]');
        if (button) {
            return;
        }
    }

    const solveAllButton = document.getElementById("solveAllButton");
    if (solveAllButton !== null) {
        return;
    }

    const original = document.querySelectorAll('[data-test="player-next"]')[0];

    const storiesContinue = document.querySelectorAll('[data-test="stories-player-continue"]')[0];

    if (original === undefined) {

        if (storiesContinue === undefined) {
            const startButton = document.querySelector('[data-test="start-button"]');
            console.log(`Wrapper line: ${startButton}`);
            if (startButton === null) {
                return;
            }
            const wrapper = startButton.parentNode;
            const solveAllButton = document.createElement('a');
            solveAllButton.className = startButton.className;
            solveAllButton.id = "solveAllButton";
            solveAllButton.innerText = "COMPLETE SKILL";
            solveAllButton.removeAttribute('href');
            solveAllButton.addEventListener('click', () => {
                solving(true);
                setInterval(() => {
                    const startButton = document.querySelector('[data-test="start-button"]');
                    if (startButton && startButton.innerText.startsWith("START")) {
                        startButton.click();
                    }
                }, 1000);
                startButton.click();
            });
            wrapper.appendChild(solveAllButton);
        } else {
//        const wrapper = document.getElementsByClassName('_10vOG')[0];
        const wrapper = document.querySelector('._10vOG, ._2L_r0');
        wrapper.style.display = "flex";

        //

        const solveCopy = document.createElement('button');

        const presssolveCopy1 = () => {
            solveCopy.style.borderBottom = '0px';
            solveCopy.style.marginBottom = '4px';
            solveCopy.style.top = '4px';
        };

        // Function to revert the border-bottom when the button is released
        const releasesolveCopy1 = () => {
            solveCopy.style.borderBottom = '4px solid #2b70c9';
            solveCopy.style.marginBottom = '0px';
            solveCopy.style.top = '0px';
        };

        // Add event listeners for mousedown, mouseup, and mouseleave
        solveCopy.addEventListener('mousedown', presssolveCopy1);
        solveCopy.addEventListener('mouseup', releasesolveCopy1);
        solveCopy.addEventListener('mouseleave', releasesolveCopy1);


        const pauseCopy = document.createElement('button');

        const presspauseCopy2 = () => {
            pauseCopy.style.borderBottom = '0px';
            pauseCopy.style.marginBottom = '4px';
            pauseCopy.style.top = '4px';
        };

        // Function to revert the border-bottom when the button is released
        const releasepauseCopy2 = () => {
            pauseCopy.style.borderBottom = '4px solid #ff9600';
            pauseCopy.style.marginBottom = '0px';
            pauseCopy.style.top = '0px';
        };

        // Add event listeners for mousedown, mouseup, and mouseleave
        pauseCopy.addEventListener('mousedown', presspauseCopy2);
        pauseCopy.addEventListener('mouseup', releasepauseCopy2);
        pauseCopy.addEventListener('mouseleave', releasepauseCopy2);


        solveCopy.id = 'solveAllButton';
        solveCopy.innerHTML = solvingIntervalId ? 'PAUSE SOLVE' : 'SOLVE ALL';
        solveCopy.disabled = false;
        pauseCopy.innerHTML = 'SOLVE';

        const solveCopyStyle = `
        position: relative;
        min-width: 150px;
        font-size: 17px;
        border: none;
        border-bottom: 4px solid #2b70c9;
        border-radius: 16px;
        padding: 13px 16px;
        transform: translateZ(0);
        transition: filter .0s;
        font-weight: 700;
        letter-spacing: .8px;
        background: #1cb0f6;
        color: rgb(var(--color-snow));
        margin-left: 20px;
        cursor: pointer;
        `;

        const pauseCopyStyle = `
        position: relative;
        min-width: 100px;
        font-size: 17px;
        border: none;
        border-bottom: 4px solid #ff9600;
        border-radius: 16px;
        padding: 13px 16px;
        transform: translateZ(0);
        transition: filter .0s;
        font-weight: 700;
        letter-spacing: .8px;
        background: #ffc800;
        color: rgb(var(--color-snow));
        margin-left: 20px;
        cursor: pointer;
        `;

        solveCopy.style.cssText = solveCopyStyle;
        pauseCopy.style.cssText = pauseCopyStyle;

        [solveCopy, pauseCopy].forEach(button => {
            button.addEventListener("mousemove", () => {
                button.style.filter = "brightness(1.1)";
            });
        });

        [solveCopy, pauseCopy].forEach(button => {
            button.addEventListener("mouseleave", () => {
                button.style.filter = "none";
            });
        });

        storiesContinue.parentElement.appendChild(pauseCopy);
        storiesContinue.parentElement.appendChild(solveCopy);

        solveCopy.addEventListener('click', solving);
        pauseCopy.addEventListener('click', solve);

        //solving();
        }
    } else {
//        const wrapper = document.getElementsByClassName('_10vOG')[0];
        const wrapper = document.querySelector('._10vOG, ._2L_r0');
        wrapper.style.display = "flex";

        //

        const solveCopy = document.createElement('button');

        const presssolveCopy1 = () => {
            solveCopy.style.borderBottom = '0px';
            solveCopy.style.marginBottom = '4px';
            solveCopy.style.top = '4px';
        };

        // Function to revert the border-bottom when the button is released
        const releasesolveCopy1 = () => {
            solveCopy.style.borderBottom = '4px solid #2b70c9';
            solveCopy.style.marginBottom = '0px';
            solveCopy.style.top = '0px';
        };

        // Add event listeners for mousedown, mouseup, and mouseleave
        solveCopy.addEventListener('mousedown', presssolveCopy1);
        solveCopy.addEventListener('mouseup', releasesolveCopy1);
        solveCopy.addEventListener('mouseleave', releasesolveCopy1);


        const pauseCopy = document.createElement('button');

        const presspauseCopy2 = () => {
            pauseCopy.style.borderBottom = '0px';
            pauseCopy.style.marginBottom = '4px';
            pauseCopy.style.top = '4px';
        };

        // Function to revert the border-bottom when the button is released
        const releasepauseCopy2 = () => {
            pauseCopy.style.borderBottom = '4px solid #ff9600';
            pauseCopy.style.marginBottom = '0px';
            pauseCopy.style.top = '0px';
        };

        // Add event listeners for mousedown, mouseup, and mouseleave
        pauseCopy.addEventListener('mousedown', presspauseCopy2);
        pauseCopy.addEventListener('mouseup', releasepauseCopy2);
        pauseCopy.addEventListener('mouseleave', releasepauseCopy2);


        solveCopy.id = 'solveAllButton';
        solveCopy.innerHTML = solvingIntervalId ? 'PAUSE SOLVE' : 'SOLVE ALL';
        solveCopy.disabled = false;
        pauseCopy.innerHTML = 'SOLVE';

        const solveCopyStyle = `
        position: relative;
        min-width: 150px;
        font-size: 17px;
        border: none;
        border-bottom: 4px solid #2b70c9;
        border-radius: 16px;
        padding: 13px 16px;
        transform: translateZ(0);
        transition: filter .0s;
        font-weight: 700;
        letter-spacing: .8px;
        background: #1cb0f6;
        color: rgb(var(--color-snow));
        margin-left: 20px;
        cursor: pointer;
        `;

        const pauseCopyStyle = `
        position: relative;
        min-width: 100px;
        font-size: 17px;
        border: none;
        border-bottom: 4px solid #ff9600;
        border-radius: 16px;
        padding: 13px 16px;
        transform: translateZ(0);
        transition: filter .0s;
        font-weight: 700;
        letter-spacing: .8px;
        background: #ffc800;
        color: rgb(var(--color-snow));
        margin-left: 20px;
        cursor: pointer;
        `;

        solveCopy.style.cssText = solveCopyStyle;
        pauseCopy.style.cssText = pauseCopyStyle;

        [solveCopy, pauseCopy].forEach(button => {
            button.addEventListener("mousemove", () => {
                button.style.filter = "brightness(1.1)";
            });
        });

        [solveCopy, pauseCopy].forEach(button => {
            button.addEventListener("mouseleave", () => {
                button.style.filter = "none";
            });
        });

        original.parentElement.appendChild(pauseCopy);
        original.parentElement.appendChild(solveCopy);

        solveCopy.addEventListener('click', solving);
        pauseCopy.addEventListener('click', solve);

        //solving();
    }
}

setInterval(addButtons, 100);


const htmlContent = `
<div class="boxFirst">
    <a href="https://duolingoprowebsite.framer.website" target="_blank" rel="noopener noreferrer">
        <div class="SeeRoadmapButton">
            <p class="SeeRoadmapButtonTextOne">SEE ISSUES & ROADMAP</p>
            <div class="SendFeedbackButtonNewTagOne">
                <p class="SendFeedbackButtonNewTagOneTextOne">NEW</p>
            </div>
        </div>
    </a>
    <div class="SendFeedbackButtonAndSettingsButtonBox">
        <div class="SendFeedbackButtonOne">
            <p class="SendFeedbackButtonTextOne">SEND FEEDBACK</p>
        </div>
        <div class="DuolingoProSettingsButtonOne">
            <p class="DuolingoProSettingsButtonOneTextOne">SETTINGS</p>
            <div class="SendFeedbackButtonNewTagOne">
                <p class="SendFeedbackButtonNewTagOneTextOne">NEW</p>
            </div>
        </div>
    </div>
    <div class="AutoSolverBoxBackground">
        <div class="AutoSolverBoxLayers">
            <div class="AutoSolverBoxAlertSectionOne">
                <div class="AutoSolverBoxAlertOneBox">
                    <svg class="AutoSolverBoxAlertOneBoxIconOne" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 19" fill="none">
<path id="Vector" d="M2.74565 18.5C2.18774 18.5 1.70193 18.3759 1.2882 18.1276C0.880737 17.8857 0.564169 17.5569 0.338504 17.1411C0.112839 16.7316 0 16.2786 0 15.7823C0 15.3045 0.125376 14.8485 0.376113 14.4142L7.64456 1.86814C7.90157 1.4152 8.24008 1.07394 8.66007 0.844363C9.0863 0.614788 9.53451 0.5 10.0047 0.5C10.4686 0.5 10.9105 0.614788 11.3305 0.844363C11.7505 1.07394 12.0921 1.4152 12.3554 1.86814L19.6238 14.4142C19.7493 14.6313 19.8432 14.8578 19.9059 15.0936C19.9686 15.3231 20 15.5527 20 15.7823C20 16.2786 19.8872 16.7316 19.6615 17.1411C19.4358 17.5569 19.1161 17.8857 18.7024 18.1276C18.2949 18.3759 17.8122 18.5 17.2543 18.5H2.74565ZM10.0141 11.9943C10.6159 11.9943 10.9293 11.6841 10.9543 11.0635L11.1048 6.66132C11.1174 6.35728 11.017 6.10599 10.8039 5.90743C10.597 5.70268 10.3307 5.60031 10.0047 5.60031C9.67249 5.60031 9.40289 5.69958 9.19607 5.89813C8.98915 6.09668 8.892 6.35108 8.90452 6.66132L9.04557 11.0635C9.0707 11.6841 9.39345 11.9943 10.0141 11.9943ZM10.0141 15.2704C10.3526 15.2704 10.6409 15.168 10.8791 14.9632C11.1174 14.7523 11.2365 14.4824 11.2365 14.1535C11.2365 13.8309 11.1174 13.5641 10.8791 13.3532C10.6409 13.1421 10.3526 13.0367 10.0141 13.0367C9.66931 13.0367 9.37786 13.1421 9.13964 13.3532C8.90143 13.5641 8.78233 13.8309 8.78233 14.1535C8.78233 14.4824 8.90143 14.7523 9.13964 14.9632C9.38411 15.168 9.67557 15.2704 10.0141 15.2704Z"/>
                    </svg>
                    <p class="AutoSolverBoxAlertOneBoxTextOne">Stories are not supported yet</p>
                </div>
                <div class="AutoSolverBoxAlertTwoBox">
                    <svg class="AutoSolverBoxAlertTwoBoxIconOne" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 21" fill="none">
<path id="Vector" d="M9.99998 20.5C8.63214 20.5 7.34419 20.2378 6.13613 19.7134C4.92808 19.1953 3.86384 18.476 2.94343 17.5551C2.023 16.6342 1.30073 15.5727 0.776601 14.3705C0.258868 13.1619 0 11.8701 0 10.4952C0 9.12667 0.258868 7.84131 0.776601 6.63907C1.30073 5.43044 2.01981 4.3657 2.93384 3.44483C3.85426 2.52398 4.91849 1.80455 6.12655 1.28657C7.3346 0.762189 8.62255 0.5 9.99039 0.5C11.3582 0.5 12.6462 0.762189 13.8543 1.28657C15.0687 1.80455 16.1329 2.52398 17.0469 3.44483C17.9674 4.3657 18.6896 5.43044 19.2138 6.63907C19.7379 7.84131 20 9.12667 20 10.4952C20 11.8701 19.7379 13.1619 19.2138 14.3705C18.6896 15.5727 17.9674 16.6342 17.0469 17.5551C16.1329 18.476 15.0719 19.1953 13.8639 19.7134C12.6558 20.2378 11.3678 20.5 9.99998 20.5ZM9.99998 12.0588C10.6136 12.0588 10.9332 11.739 10.9588 11.0995L11.1121 6.56234C11.1249 6.24899 11.0227 5.99 10.8054 5.78535C10.5944 5.57433 10.3228 5.46881 9.99039 5.46881C9.65163 5.46881 9.37678 5.57113 9.16585 5.77576C8.95492 5.98039 8.85584 6.24259 8.86863 6.56234L9.01244 11.0995C9.03802 11.739 9.36719 12.0588 9.99998 12.0588ZM9.99998 15.4352C10.3451 15.4352 10.6392 15.3297 10.8821 15.1186C11.1249 14.9013 11.2464 14.623 11.2464 14.2841C11.2464 13.9516 11.1249 13.6766 10.8821 13.4592C10.6392 13.2417 10.3451 13.1331 9.99998 13.1331C9.64843 13.1331 9.35122 13.2417 9.10832 13.4592C8.86544 13.6766 8.74399 13.9516 8.74399 14.2841C8.74399 14.623 8.86544 14.9013 9.10832 15.1186C9.3576 15.3297 9.65483 15.4352 9.99998 15.4352Z"/>
                    </svg>
                    <p class="AutoSolverBoxAlertTwoBoxTextOne">5s delay when activating</p>
                </div>
                <div class="AutoSolverBoxAlertTwoBox">
                    <p class="AutoSolverBoxAlertTwoBoxTextOne" style="color: #34C759 !important;">Chests now open automatically</p>
                </div>
            </div>
            <div class="AutoSolverBoxTitleSectionOne">
                <p class="AutoSolverBoxTitleSectionOneTextOne">AutoSolver</p>
                <div class="AutoSolverBoxTitleSectionOneBETATagOne">
                    <p class="AutoSolverBoxTitleSectionOneBETATagOneTextOne">2.0 BETA 6</p>
                </div>
            </div>
            <p class="AutoSolverBoxTitleSectionTwoTextOne">How many lessons would you like to AutoSolve?</p>
            <div class="AutoSolverBoxSectionThreeBox">
                <div class="AutoSolverBoxSectionThreeBoxSectionOne">
                    <button class="AutoSolverBoxRepeatNumberDownButton">-</button>
                    <div class="AutoSolverBoxRepeatNumberDisplay">
                        <div class="number">0</div>
                    </div>
                    <button class="AutoSolverBoxRepeatNumberUpButton">+</button>
                </div>
                <div class="AutoSolverBoxSectionThreeBoxSectionTwo" id="AutoSolverBoxSectionThreeBoxSectionTwoIDOne">
                    <div class="AutoSolverBoxSectionThreeBoxSectionTwoTextOne">Practice Only Mode</div>
                    <button class="AutoSolverBoxSectionThreeBoxSectionTwoButton" id="AutoSolverBoxSectionThreeBoxSectionTwoButtonIDOne">ON</button>
                </div>
                <div class="AutoSolverBoxSectionThreeBoxSectionTwo" id="AutoSolverBoxSectionThreeBoxSectionTwoIDTwo">
                    <div class="AutoSolverBoxSectionThreeBoxSectionTwoTextOne">Repeat Lesson Mode</div>
                    <button class="AutoSolverBoxSectionThreeBoxSectionTwoButton" id="AutoSolverBoxSectionThreeBoxSectionTwoButtonIDTwo">ON</button>
                </div>
                <button class="AutoSolverBoxRepeatStartButton">START</button>
            </div>
        </div>
    </div>
</div>
`;

const cssContent = `
.boxFirst {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    position: fixed; /* Fix the position to the bottom-right corner */
    bottom: 24px;
    right: 24px;
    z-index: 2;
}

.SendFeedbackButtonAndSettingsButtonBox {
    display: flex;
    align-items: center;
    gap: 8px;
    align-self: stretch;

}

.DuolingoProSettingsButtonOne {
    position: relative;
    display: flex;
    height: 48px;
    width: calc(100% - 0px);
    padding: 16px 9px 16px 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;

    border-radius: 8px;
    border: 2px solid rgba(0, 0, 0, 0.20);
    border-bottom: 4px solid rgba(0, 0, 0, 0.20);
    background: #007AFF;

    cursor: pointer;
    transition: .1s;

    width: auto;
}

.DuolingoProSettingsButtonOne:hover {
    filter: brightness(0.95);
}

.DuolingoProSettingsButtonOne:active {
    border-bottom: 2px solid rgba(0, 0, 0, 0.20);
    height: 46px;
    margin-top: 2px;

    filter: brightness(0.9);
}

.DuolingoProSettingsButtonOneTextOne {
    font-size: 16px;
    font-weight: 700;
    text-align: center;
    line-height: normal;
    color: #fff;

    margin: 0px;

    user-select: none; // chrome and Opera
    -moz-user-select: none; // Firefox
    -webkit-text-select: none; // IOS Safari
    -webkit-user-select: none; // Safari
}

.SendFeedbackButtonOne {
    position: relative;
    display: flex;
    height: 48px;
    width: calc(100% - 0px);
    padding: 16px 16px 16px 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;

    border-radius: 8px;
    border: 2px solid rgba(0, 0, 0, 0.20);
    border-bottom: 4px solid rgba(0, 0, 0, 0.20);
    background: #007AFF;

    cursor: pointer;
    transition: .1s;

    width: auto;
}

.SendFeedbackButtonOne:hover {
    filter: brightness(0.95);
}

.SendFeedbackButtonOne:active {
    height: 46px;
    margin-top: 2px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.20);

    filter: brightness(0.9);
}

.SendFeedbackButtonTextOne {
    font-size: 16px;
    font-weight: 700;
    text-align: center;
    line-height: normal;
    color: #fff;

    margin: 0px;

    user-select: none; // chrome and Opera
    -moz-user-select: none; // Firefox
    -webkit-text-select: none; // IOS Safari
    -webkit-user-select: none; // Safari
}

.SendFeedbackButtonNewTagOne {
    display: flex;
    padding: 4px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    background: #FF2D55;
    border: 2px solid rgba(0, 0, 0, 0.20);
}

.SendFeedbackButtonNewTagOneTextOne {
    color: #FFF;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    margin-top: 0px;
    margin-bottom: 0px;
    font-size: 12px;

    user-select: none; // chrome and Opera
    -moz-user-select: none; // Firefox
    -webkit-text-select: none; // IOS Safari
    -webkit-user-select: none; // Safari
}

.SeeRoadmapButton {
    position: relative;
    display: flex;
    height: 48px;
    width: calc(100% - 0px);
    padding: 16px 9px 16px 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;

    border-radius: 8px;
    border: 2px solid rgba(0, 0, 0, 0.20);
    border-bottom: 4px solid rgba(0, 0, 0, 0.20);
    background: #007AFF;

    cursor: pointer;
    transition: .1s;

    width: auto;
}

.SeeRoadmapButton:hover {
    filter: brightness(0.95);
}

.SeeRoadmapButton:active {
    border-bottom: 2px solid rgba(0, 0, 0, 0.20);
    height: 46px;
    margin-top: 2px;

    filter: brightness(0.9);
}


.SeeRoadmapButtonTextOne {
    font-size: 16px;
    font-weight: 700;
    text-align: center;
    line-height: normal;
    color: #fff;

    margin: 0px;

    user-select: none; // chrome and Opera
    -moz-user-select: none; // Firefox
    -webkit-text-select: none; // IOS Safari
    -webkit-user-select: none; // Safari
}

.AutoSolverBoxBackground {
    display: flex;
    padding: 16px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;

    border-radius: 16px;
    border: 2px solid rgb(var(--color-swan));
    background: rgb(var(--color-snow));

    width: 300px;
}

.AutoSolverBoxLayers {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
}

.AutoSolverBoxAlertSectionOne {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding-bottom: 8px;
}

.AutoSolverBoxAlertOneBox {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 20px;

    cursor: default;
}

.AutoSolverBoxAlertOneBoxIconOne {
    width: 20px;
    height: 18px;

    fill: #FF2D55;
}

.AutoSolverBoxAlertOneBoxTextOne {
    color: #FF4B4B;
    font-weight: 700;
    font-size: 16px;

    margin-bottom: 0px;
}

.AutoSolverBoxAlertTwoBox {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 20px;

    cursor: default;
}

.AutoSolverBoxAlertTwoBoxIconOne {
    width: 20px !important;
    height: 20px !important;

    fill: #FF9500;
}

.AutoSolverBoxAlertTwoBoxTextOne {
    color: #FF9500;
    font-weight: 700;
    font-size: 16px;

    margin-bottom: 0px;
}

.AutoSolverBoxSectionThreeBox {
    display: flex;

    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    height: 100%;
    width: 100%;
}

.AutoSolverBoxTitleSectionOne {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
    padding-bottom: 8px;
    padding: 0px;
}

.AutoSolverBoxTitleSectionOneTextOne {
    color: rgb(var(--color-eel));
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    margin: 0px;

    cursor: default;
}

.AutoSolverBoxTitleSectionOneBETATagOne {
    display: flex;
    height: 36px;
    padding-right: 8px;
    padding-left: 8px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    background: #FF2D55;
    border: 2px solid rgba(0, 0, 0, 0.20);
}

.AutoSolverBoxTitleSectionOneBETATagOneTextOne {
    color: #FFF;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    margin-top: 0px;
    margin-bottom: 0px;
    font-size: 16px;

    cursor: default;
}

.AutoSolverBoxTitleSectionTwoTextOne {
    color: rgb(var(--color-eel), 0.8);

    height: 44px;
    font-weight: 700;
    font-size: 16px;
    margin: 0px;
    margin-top: -2px;

    cursor: default;
}

.AutoSolverBoxSectionThreeBoxSectionOne {
    height: 100%;
    width: 100%;
    display: flex;

    justify-content: center;
    align-items: center;
    gap: 8px
}

.AutoSolverBoxRepeatNumberDownButton {
    position: relative;
    display: flex;
    width: 48px;
    height: 48px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;

    border-radius: 8px;
    border: 2px solid rgba(0, 0, 0, 0.20);
    border-bottom: 4px solid rgba(0, 0, 0, 0.20);
    background: #007AFF;

    cursor: pointer;
    transition: .1s;

    color: #FFF;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.AutoSolverBoxRepeatNumberDownButton:hover {
    filter: brightness(0.95);
}

.AutoSolverBoxRepeatNumberDownButton:active {
    margin-top: 2px;
    height: 46px;

    border-bottom: 2px solid rgba(0, 0, 0, 0.20);

    filter: brightness(0.9);
}

.AutoSolverBoxRepeatNumberDisplay {
    position: relative;
    text-align: center;

    display: inline-flex;
    height: 48px;
    width: 100%;
    padding: 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;

    font-size: 16px;
    font-weight: 700;

    border-radius: 8px;
    border: 2px solid rgb(var(--color-eel), 0.2);
    background: rgb(var(--color-swan), 0.8);

    cursor: default;

    color: rgb(var(--color-eel));
    text-align: center;
}

.AutoSolverBoxRepeatNumberUpButton {
    position: relative;
    display: flex;
    width: 48px;
    height: 48px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;

    border-radius: 8px;
    border: 2px solid rgba(0, 0, 0, 0.20);
    border-bottom: 4px solid rgba(0, 0, 0, 0.20);
    background: #007AFF;

    cursor: pointer;
    transition: .1s;

    color: #FFF;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.AutoSolverBoxRepeatNumberUpButton:hover {
    filter: brightness(0.95);
}

.AutoSolverBoxRepeatNumberUpButton:active {
    margin-top: 2px;
    height: 46px;

    border-bottom: 2px solid rgba(0, 0, 0, 0.20);

    filter: brightness(0.9);
}

.AutoSolverBoxSectionThreeBoxSectionTwo {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
}

.AutoSolverBoxSectionThreeBoxSectionTwoTextOne {
    position: relative;
    text-align: center;
    display: inline-flex;
    height: 48px;
    width: 100%;
    justify-content: left;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 8px;
    cursor: default;
    color: rgb(var(--color-eel));
    text-align: left;
}

.AutoSolverBoxSectionThreeBoxSectionTwoButton {
    position: relative;
    display: flex;
    width: 64px;
    height: 48px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;

    border-radius: 8px;
    border: 2px solid rgba(0, 0, 0, 0.20);
    border-bottom: 4px solid rgba(0, 0, 0, 0.20);
    background: #007AFF;

    cursor: pointer;
    transition: .1s;

    color: rgb(var(--color-eel));
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.AutoSolverBoxSectionThreeBoxSectionTwoButton:hover {
    filter: brightness(0.95);
}

.AutoSolverBoxSectionThreeBoxSectionTwoButton:active {
    height: 46px;
    margin-top: 2px;

    border-bottom: 2px solid rgba(0, 0, 0, 0.20);

    filter: brightness(0.9);
}

.AutoSolverBoxRepeatStartButton {
    position: relative;
    display: flex;
    height: 48px;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;

    font-size: 16px;
    border-radius: 8px;
    border: 2px solid rgba(0, 0, 0, 0.20);
    border-bottom: 4px solid rgba(0, 0, 0, 0.20);
    background: #007AFF;
    font-weight: 700;
    color: #FFF;
    text-align: center;

    cursor: pointer;
    transition: .1s;
}

.AutoSolverBoxRepeatStartButton:hover {
    filter: brightness(0.95);
}

.AutoSolverBoxRepeatStartButton:active {
    height: 46px;
    margin-top: 2px;

    border-bottom: 2px solid rgba(0, 0, 0, 0.20);

    filter: brightness(0.9);
}
`;

let injectedContainer = null;
let injectedStyleElement = null;

function injectContent() {
    if (window.location.pathname === '/learn') {
        // Inject the content if it's not already injected
        if (!injectedContainer) {
            // Creating a container for the overlay
            injectedContainer = document.createElement('div');
            injectedContainer.innerHTML = htmlContent;
            document.body.appendChild(injectedContainer);

            // Creating a style tag for CSS
            injectedStyleElement = document.createElement('style');
            injectedStyleElement.type = 'text/css';
            injectedStyleElement.innerHTML = cssContent;
            document.head.appendChild(injectedStyleElement);

            initializeDuolingoProSystemButtons();

            try {
            let AutoSolverBoxSectionThreeBoxSectionTwoIDOneForHiding = document.querySelector('#AutoSolverBoxSectionThreeBoxSectionTwoIDOne');
            let AutoSolverBoxSectionThreeBoxSectionTwoIDTwoForHiding = document.querySelector('#AutoSolverBoxSectionThreeBoxSectionTwoIDTwo');
            const AutoSolverBoxBackgroundForHiding = document.querySelector('.AutoSolverBoxBackground');

            if (!AutoSolverSettingsShowAutoSolverBox) {
                AutoSolverBoxBackgroundForHiding.remove();
            } else if (AutoSolverSettingsShowAutoSolverBox) {
                initializeAutoSolverBoxButtonInteractiveness();
                something();
                if (!AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox) {
                    AutoSolverBoxSectionThreeBoxSectionTwoIDOneForHiding.remove();
                }
                if (!AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox) {
                    AutoSolverBoxSectionThreeBoxSectionTwoIDTwoForHiding.remove();
                }
            } else {
                console.log('error 5');
            }
            } catch(error) {
            }

        }
    } else {
        // Remove the content if it was previously injected
        if (injectedContainer) {
            document.body.removeChild(injectedContainer);
            document.head.removeChild(injectedStyleElement);
            injectedContainer = null;
            injectedStyleElement = null;
        }
    }
}

function initializeDuolingoProSystemButtons() {
    //console.log('yeah yeah yeah');
    const DuolingoProSettingsButtonOne = document.querySelector('.DuolingoProSettingsButtonOne');
    DuolingoProSettingsButtonOne.addEventListener('click', () => {
        wasDuolingoProSettingsButtonOnePressed = true;
        console.log('wasDuolingoProSettingsButtonOnePressed' + wasDuolingoProSettingsButtonOnePressed);
    });

    const SendFeedbackButton = document.querySelector('.SendFeedbackButtonOne');
    SendFeedbackButton.addEventListener('click', () => {
        isSendFeedbackButtonPressed = true;
        console.log('isSendFeedbackButtonPressed' + isSendFeedbackButtonPressed);
    });
}

let isAutoSolverBoxRepeatStartButtonEnabled = false;

function something() {
    //this is new
    try {
    const AutoSolverBoxRepeatStartButton = document.querySelector('.AutoSolverBoxRepeatStartButton');

    function disableHover() {
        AutoSolverBoxRepeatStartButton.style.filter = '';
        AutoSolverBoxRepeatStartButton.style.height = '';
        AutoSolverBoxRepeatStartButton.style.marginTop = '';
        AutoSolverBoxRepeatStartButton.style.borderBottom = '';
    }

    function enableHover() {
        AutoSolverBoxRepeatStartButton.style.filter = 'brightness(1.0)';
        AutoSolverBoxRepeatStartButton.style.height = '46px';
        AutoSolverBoxRepeatStartButton.style.marginTop = '2px';
        AutoSolverBoxRepeatStartButton.style.borderBottom = '2px solid rgba(0, 0, 0, 0.20)';
    }

    if (autoSolverBoxRepeatAmount > 0) {
        AutoSolverBoxRepeatStartButton.style.opacity = '100%';
        AutoSolverBoxRepeatStartButton.style.cursor = 'pointer';
        isAutoSolverBoxRepeatStartButtonEnabled = true;
        console.log(autoSolverBoxRepeatAmount);
    } else if (autoSolverBoxRepeatAmount === 0) {
        AutoSolverBoxRepeatStartButton.style.opacity = '0.5';
        AutoSolverBoxRepeatStartButton.style.cursor = 'not-allowed';
        isAutoSolverBoxRepeatStartButtonEnabled = false;
    } else {
        AutoSolverBoxRepeatStartButton.style.opacity = '0.5';
        AutoSolverBoxRepeatStartButton.style.cursor = 'not-allowed';
        isAutoSolverBoxRepeatStartButtonEnabled = false;
    }

    if (isAutoSolverBoxRepeatStartButtonEnabled) {
        disableHover();
    } else {
        enableHover();
    }
    } catch (error) {
    }
    //this is new end
}

function initializeAutoSolverBoxButtonInteractiveness() {
    const AutoSolverBoxRepeatNumberDisplay = document.querySelector('.AutoSolverBoxRepeatNumberDisplay');
    const AutoSolverBoxRepeatNumberDownButton = document.querySelector('.AutoSolverBoxRepeatNumberDownButton');
    const AutoSolverBoxRepeatNumberUpButton = document.querySelector('.AutoSolverBoxRepeatNumberUpButton');
    const AutoSolverBoxRepeatStartButton = document.querySelector('.AutoSolverBoxRepeatStartButton');

    AutoSolverBoxRepeatNumberDisplay.textContent = autoSolverBoxRepeatAmount;
    something();

    AutoSolverBoxRepeatNumberDownButton.addEventListener('click', () => {
        autoSolverBoxRepeatAmount--;
        if (autoSolverBoxRepeatAmount < 0) {
            autoSolverBoxRepeatAmount = 0;
        }
        AutoSolverBoxRepeatNumberDisplay.textContent = autoSolverBoxRepeatAmount;
        sessionStorage.setItem('autoSolverBoxRepeatAmount', autoSolverBoxRepeatAmount);

        something();
    });

    AutoSolverBoxRepeatNumberUpButton.addEventListener('click', () => {
        autoSolverBoxRepeatAmount++;
        AutoSolverBoxRepeatNumberDisplay.textContent = autoSolverBoxRepeatAmount;
        sessionStorage.setItem('autoSolverBoxRepeatAmount', autoSolverBoxRepeatAmount);

        something();
    });

    if (wasAutoSolverBoxRepeatStartButtonPressed === true) {
        AutoSolverBoxRepeatStartButton.textContent = 'STOP';
    }

    if (autoSolverBoxRepeatAmount === 0) {
        wasAutoSolverBoxRepeatStartButtonPressed = false;
        sessionStorage.setItem('wasAutoSolverBoxRepeatStartButtonPressed', wasAutoSolverBoxRepeatStartButtonPressed);
        AutoSolverBoxRepeatStartButton.textContent = 'START';
    }

    if (wasAutoSolverBoxRepeatStartButtonPressed === true) {
        AutoSolverBoxRepeatStartButton.textContent = 'STOP';
        AutoSolverBoxRepeatStartButtonActions();
    }

    function AutoSolverBoxRepeatStartButtonActions() {
        if (autoSolverBoxRepeatAmount > 0) {
            sessionStorage.setItem('autoSolverBoxRepeatAmount', autoSolverBoxRepeatAmount);

            openChestThingyFunction();

            setTimeout(function() {
                if (wasAutoSolverBoxRepeatStartButtonPressed === true && autoSolverBoxRepeatAmount > 0) {
                    autoSolverBoxRepeatAmount--;
                    sessionStorage.setItem('autoSolverBoxRepeatAmount', autoSolverBoxRepeatAmount);
                    if (autoSolverBoxPracticeOnlyMode) {
                        window.location.href = "https://duolingo.com/practice";
                    } else if (autoSolverBoxRepeatLessonMode) {
                        window.location.href = "https://duolingo.com/lesson/unit/1/level/1";
                    } else {
                        window.location.href = "https://duolingo.com/lesson";
                    }
                } else {
                    console.log('cancelled');
                }
            }, 4000);
        }
    }

    //this is new
    try {

    AutoSolverBoxRepeatStartButton.addEventListener('click', () => {
        if (autoSolverBoxRepeatAmount > 0) {
            AutoSolverBoxRepeatStartButton.textContent = AutoSolverBoxRepeatStartButton.textContent === 'START' ? 'STOP' : 'START';
            wasAutoSolverBoxRepeatStartButtonPressed = !wasAutoSolverBoxRepeatStartButtonPressed;
            sessionStorage.setItem('wasAutoSolverBoxRepeatStartButtonPressed', wasAutoSolverBoxRepeatStartButtonPressed);
        }

        console.log(wasAutoSolverBoxRepeatStartButtonPressed);

        analyticsLogsSend('Duolingo Pro AutoSolver Box START Button', wasAutoSolverBoxRepeatStartButtonPressed ? 'ON' : 'OFF')

        setTimeout(function() {
            AutoSolverBoxRepeatStartButtonActions();
        }, 500);

    });
    } catch(error) {
    }
    //this is new end

    try {
        const AutoSolverBoxSectionThreeBoxSectionTwoButtonIDOneElement = document.querySelector('#AutoSolverBoxSectionThreeBoxSectionTwoButtonIDOne');
        const AutoSolverBoxSectionThreeBoxSectionTwoButtonIDTwoElement = document.querySelector('#AutoSolverBoxSectionThreeBoxSectionTwoButtonIDTwo');


        AutoSolverBoxSectionThreeBoxSectionTwoButtonIDOneElement.addEventListener('mouseup', () => {
            if (autoSolverBoxPracticeOnlyMode) {
                autoSolverBoxPracticeOnlyMode = !autoSolverBoxPracticeOnlyMode;
                sessionStorage.setItem('autoSolverBoxPracticeOnlyMode', autoSolverBoxPracticeOnlyMode);
                updateAutoSolverToggles(AutoSolverBoxSectionThreeBoxSectionTwoButtonIDOneElement, autoSolverBoxPracticeOnlyMode);
            } else {
                autoSolverBoxPracticeOnlyMode = !autoSolverBoxPracticeOnlyMode;
                autoSolverBoxRepeatLessonMode = !autoSolverBoxPracticeOnlyMode;
                sessionStorage.setItem('autoSolverBoxPracticeOnlyMode', autoSolverBoxPracticeOnlyMode);
                sessionStorage.setItem('autoSolverBoxRepeatLessonMode', autoSolverBoxRepeatLessonMode);
                updateAutoSolverToggles(AutoSolverBoxSectionThreeBoxSectionTwoButtonIDOneElement, autoSolverBoxPracticeOnlyMode, AutoSolverBoxSectionThreeBoxSectionTwoButtonIDTwoElement, autoSolverBoxRepeatLessonMode);
            }
        });

        AutoSolverBoxSectionThreeBoxSectionTwoButtonIDTwoElement.addEventListener('mouseup', () => {
            if (autoSolverBoxRepeatLessonMode) {
                autoSolverBoxRepeatLessonMode = !autoSolverBoxRepeatLessonMode;
                sessionStorage.setItem('autoSolverBoxRepeatLessonMode', autoSolverBoxRepeatLessonMode);
                updateAutoSolverToggles(AutoSolverBoxSectionThreeBoxSectionTwoButtonIDTwoElement, autoSolverBoxRepeatLessonMode);
            } else {
                autoSolverBoxRepeatLessonMode = !autoSolverBoxRepeatLessonMode;
                autoSolverBoxPracticeOnlyMode = !autoSolverBoxRepeatLessonMode;
                sessionStorage.setItem('autoSolverBoxPracticeOnlyMode', autoSolverBoxPracticeOnlyMode);
                sessionStorage.setItem('autoSolverBoxRepeatLessonMode', autoSolverBoxRepeatLessonMode);
                updateAutoSolverToggles(AutoSolverBoxSectionThreeBoxSectionTwoButtonIDTwoElement, autoSolverBoxRepeatLessonMode, AutoSolverBoxSectionThreeBoxSectionTwoButtonIDOneElement, autoSolverBoxPracticeOnlyMode);
            }
        });

        AutoSolverBoxSectionThreeBoxSectionTwoButtonIDOneElement.addEventListener('mousedown', () => {
            if (!autoSolverBoxPracticeOnlyMode) {
                AutoSolverBoxSectionThreeBoxSectionTwoButtonIDOneElement.style.border = '2px solid rgb(var(--color-swan))';
                AutoSolverBoxSectionThreeBoxSectionTwoButtonIDOneElement.style.borderBottom = '2px solid rgb(var(--color-swan))';
            } else {
                AutoSolverBoxSectionThreeBoxSectionTwoButtonIDOneElement.style.border = '2px solid rgba(0, 0, 0, 0.20)';
                AutoSolverBoxSectionThreeBoxSectionTwoButtonIDOneElement.style.borderBottom = '2px solid rgba(0, 0, 0, 0.20)';
            }
        });

        AutoSolverBoxSectionThreeBoxSectionTwoButtonIDTwoElement.addEventListener('mousedown', () => {
            if (!autoSolverBoxRepeatLessonMode) {
                AutoSolverBoxSectionThreeBoxSectionTwoButtonIDTwoElement.style.border = '2px solid rgb(var(--color-swan))';
                AutoSolverBoxSectionThreeBoxSectionTwoButtonIDTwoElement.style.borderBottom = '2px solid rgb(var(--color-swan))';
            } else {
                AutoSolverBoxSectionThreeBoxSectionTwoButtonIDTwoElement.style.border = '2px solid rgba(0, 0, 0, 0.20)';
                AutoSolverBoxSectionThreeBoxSectionTwoButtonIDTwoElement.style.borderBottom = '2px solid rgba(0, 0, 0, 0.20)';
            }
        });

        addEventListener('mouseup', () => {
            updateAutoSolverToggles(AutoSolverBoxSectionThreeBoxSectionTwoButtonIDOneElement, autoSolverBoxPracticeOnlyMode);
            updateAutoSolverToggles(AutoSolverBoxSectionThreeBoxSectionTwoButtonIDTwoElement, autoSolverBoxRepeatLessonMode);
        });

        updateAutoSolverToggles(AutoSolverBoxSectionThreeBoxSectionTwoButtonIDOneElement, autoSolverBoxPracticeOnlyMode);
        updateAutoSolverToggles(AutoSolverBoxSectionThreeBoxSectionTwoButtonIDTwoElement, autoSolverBoxRepeatLessonMode);

    } catch(error) {
    }

    function updateAutoSolverToggles(element, value, oppsiteElement, oppositeValue) {
        try {
        element.textContent = value ? "ON" : "OFF";
        oppsiteElement.textContent = value ? "OFF" : "ON";
        } catch(error) {
        }
        try {
        if (value) {
            element.style.background = '#007AFF';
            element.style.border = '2px solid rgba(0, 0, 0, 0.20)';
            element.style.borderBottom = '4px solid rgba(0, 0, 0, 0.20)';
            element.style.color = '#fff';

            oppsiteElement.style.background = 'rgb(var(--color-snow))';
            oppsiteElement.style.border = '2px solid rgb(var(--color-swan))';
            oppsiteElement.style.borderBottom = '4px solid rgb(var(--color-swan))';
            oppsiteElement.style.color = '#fff';
        } else {
            element.style.background = 'rgb(var(--color-snow))';
            element.style.border = '2px solid rgb(var(--color-swan))';
            element.style.borderBottom = '4px solid rgb(var(--color-swan))';
            element.style.color = 'rgb(var(--color-eel))';

            oppsiteElement.style.background = '#007AFF';
            oppsiteElement.style.border = '2px solid rgba(0, 0, 0, 0.20)';
            oppsiteElement.style.borderBottom = '4px solid rgba(0, 0, 0, 0.20)';
            oppsiteElement.style.color = 'rgb(var(--color-eel))';
        }
        } catch(error) {
        }
    }

    function openChestThingyFunction() {
        try {
            const openChestThingy = document.querySelector("button[aria-label='Open chest']");
            openChestThingy.click();
        } catch (error) {
        }
    }

    console.log('initializeAutoSolverBoxButtonInteractiveness ran');
}

setInterval(injectContent, 100);


function checkURLForAutoSolverBox() {
    if (window.location.pathname === '/lesson' || window.location.pathname.includes('/unit') || window.location.pathname === '/practice') {
        setTimeout(function() {
            if (wasAutoSolverBoxRepeatStartButtonPressed === true) {
                solving(true);
            } else {
                console.log('error 2');
            }
        }, 1000);
    } else {
    }
}

checkURLForAutoSolverBox();


injectContent();


let DuolingoSiderbarPaddingThingFunctionRepeatTimes = 20;

function DuolingoHomeSiderbarAddPaddingFunction() {
    if (window.location.pathname === '/learn') {
        try {
            const DuolingoSiderbarPaddingThing = document.querySelector('.Fc0NK');
            if (AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox === true && AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox === true) {
                DuolingoSiderbarPaddingThing.style.paddingBottom = '582px'; // or 574px if an 8px gap preferred
            } else if (AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox === true || AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox === true) {
                DuolingoSiderbarPaddingThing.style.paddingBottom = '526px'; // or 518px if an 8px gap preferred
            } else {
                DuolingoSiderbarPaddingThing.style.paddingBottom = '470px'; // or 462px if an 8px gap preferred
            }
        } catch(error) {
        }
    }
}

setInterval(DuolingoHomeSiderbarAddPaddingFunction, 100);


function DuolingoRemoveLearnAds() {
//    if (window.location.pathname === '/learn' || window.location.pathname === '/shop') {
        try {
            const DuolingoRemoveLearnAdsElementOne = document.querySelector('._3bfsh');
            DuolingoRemoveLearnAdsElementOne.remove();
        } catch(error) {
        }
//    }
}

const RemovedByDuolingoProOneHTML = `
<div class="BlockedByDuolingoProBoxBackground">
    <div class="BlockedByDuolingoProBoxSectionOne">
        <p class="BlockedByDuolingoProBoxSectionOneTextOne">Ads Blocked by Duolingo Pro</p>
        <p class="BlockedByDuolingoProBoxSectionOneTextTwo">HIDE</p>
    </div>
    <p class="BlockedByDuolingoProBoxSectionTwoTextOne">These ads were removed with ProBlock by Duolingo Pro.</p>
</div>
`;

const RemovedByDuolingoProOneCSS = `
.BlockedByDuolingoProBoxBackground {
    display: flex;
    width: 100%;
    padding: 16px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;

    border-radius: 16px;
    border: 2px solid rgb(var(--color-swan));
    background: rgb(var(--color-snow));
}

.BlockedByDuolingoProBoxSectionOne {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
}

.BlockedByDuolingoProBoxSectionOneTextOne {
    color: rgb(var(--color-eel));
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    margin: 0px;
    cursor: default;
}

.BlockedByDuolingoProBoxSectionOneTextTwo {
    color: var(--web-ui_button-color,rgb(var(--color-macaw)));
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    margin: 0px;
    cursor: pointer;
    transition: .1s;

    user-select: none; // chrome and Opera
    -moz-user-select: none; // Firefox
    -webkit-text-select: none; // IOS Safari
    -webkit-user-select: none; // Safari
}

.BlockedByDuolingoProBoxSectionOneTextTwo:hover {
    filter: brightness(1.1);
}

.BlockedByDuolingoProBoxSectionOneTextTwo:active {
    filter: brightness(1.2);
}

.BlockedByDuolingoProBoxSectionTwoTextOne {
    align-self: stretch;

    color: rgb(var(--color-hare));
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    margin: 0px;
    cursor: default;
}
`;

let injectedRemovedByDuolingoProOneElement = null;
let injectedRemovedByDuolingoProOneStyle = null;

function iforgot() {
    try {
//        if (window.location.pathname === '/learn' || window.location.pathname === '/shop') {

            let targetDiv = document.querySelector('.Fc0NK');

            if (targetDiv) {

                if (ProBlockBannerOneVisible) {

                    if (!injectedRemovedByDuolingoProOneElement) {

                        injectedRemovedByDuolingoProOneStyle = document.createElement('style');
                        injectedRemovedByDuolingoProOneStyle.type = 'text/css';
                        injectedRemovedByDuolingoProOneStyle.innerHTML = RemovedByDuolingoProOneCSS;
                        document.head.appendChild(injectedRemovedByDuolingoProOneStyle);

                        injectedRemovedByDuolingoProOneElement = document.createElement('div');
                        injectedRemovedByDuolingoProOneElement.innerHTML = RemovedByDuolingoProOneHTML;
                        targetDiv.appendChild(injectedRemovedByDuolingoProOneElement);
                    } else {
                        let BlockedByDuolingoProBoxSectionOneTextTwoElement = document.querySelector('.BlockedByDuolingoProBoxSectionOneTextTwo');
                        let BlockedByDuolingoProBoxBackgroundElement = document.querySelector('.BlockedByDuolingoProBoxBackground');

                        BlockedByDuolingoProBoxSectionOneTextTwoElement.addEventListener('click', () => {
                            ProBlockBannerOneVisible = false;
                            localStorage.setItem("ProBlockBannerOneVisible", ProBlockBannerOneVisible);
                            BlockedByDuolingoProBoxBackgroundElement.remove();
                        });

                        if (document.querySelector('.BlockedByDuolingoProBoxBackground')) {
                        } else {
                            injectedRemovedByDuolingoProOneElement = null;
                            injectedRemovedByDuolingoProOneStyle = null;
                        }

                    }
                }
            } else {
                console.error("Target div with class 'Fc0NK' not found.");
            }
//        } else {
//        }
    } catch(error) {
    }
}

if (DuolingoProSettingsProBlockMode) {
    setInterval(iforgot, 100);
    setInterval(DuolingoRemoveLearnAds, 100);
}



function theconsoleOne() {
    console.log(autoSolverBoxPracticeOnlyMode);
    console.log(autoSolverBoxRepeatLessonMode);
}
//setInterval(theconsoleOne, 1000);



const SendFeedbackBoxHTML = `
<div class="SendFeebackBoxShadow">
    <div class="SendFeebackBoxBackground">
        <div class="SendFeebackBoxLayers">

            <div class="SendFeebackBoxSectionOne">
                <p class="SendFeebackBoxSectionOneTextOne">Send Feedback for Duolingo Pro</p>
                <div class="SendFeebackBoxSectionOneCancelBoxBackground">
                    <svg class="SendFeebackBoxSectionOneCancelBoxIconOne" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M0.633789 11.4307C0.237305 11.041 0.250977 10.3506 0.620117 9.98146L4.53027 6.0713L0.620117 2.17481C0.250977 1.79884 0.237305 1.11524 0.633789 0.718757C1.03027 0.315437 1.7207 0.329109 2.08984 0.705085L5.99316 4.60841L9.89648 0.705085C10.2793 0.322273 10.9492 0.322273 11.3457 0.718757C11.749 1.11524 11.749 1.78517 11.3594 2.17481L7.46289 6.0713L11.3594 9.97462C11.749 10.3643 11.7422 11.0273 11.3457 11.4307C10.9561 11.8271 10.2793 11.8271 9.89648 11.4443L5.99316 7.54103L2.08984 11.4443C1.7207 11.8203 1.03711 11.8271 0.633789 11.4307Z"/>
                    </svg>
                </div>
            </div>

                <!-- MULTI-LINE TEXT FIELD -->
                <textarea class="SendFeebackBoxSectionTwo" id="SendFeebackBoxSectionTwoID" placeholder="Write here as much as you can with as many details as possible. Responses that are less than two sentences will be automatically ignored. "/></textarea>

                <p class="SendFeebackBoxSectionThree">Choose Feedback Type</p>

                <!-- MUTLIPLE CHOICE -->
                <div class="SendFeebackBoxSectionFour">
                    <div class="SendFeebackBoxSectionFourButtonOneBackground" id="SendFeebackTypeButtonOne">
                        <div class="SendFeebackBoxSectionFourButtonOneIconOne"/></div>
                        <p class="SendFeebackBoxSectionFourButtonOneTextOne">Bug Report</p>
                    </div>
                    <div class="SendFeebackBoxSectionFourButtonOneBackground" id="SendFeebackTypeButtonTwo">
                        <div class="SendFeebackBoxSectionFourButtonOneIconOne"/></div>
                        <p class="SendFeebackBoxSectionFourButtonOneTextOne">Suggestion</p>
                    </div>
                </div>

                <!-- SINGLE LINE TEXT FIELD -->
                <p class="SendFeebackBoxSectionThree">Choose Sender ID</p>
                <div class="SendFeebackBoxSectionSix">
                    <div class="SendFeebackBoxSectionSixIconOneBox">
                        <div class="SendFeebackBoxSectionSixIconOne">
                        </div>
                    </div>
                    <div class="SendFeebackBoxSectionSixTextOne">My Duolingo ProID <a href="https://duolingoprowebsite.framer.website/proID" target="_blank" rel="noopener noreferrer" style="color: rgb(255, 255, 255, 0.6); font-size: 16px; font-style: normal; font-weight: 700; line-height: normal;">&nbsp;(LEARN&nbsp;MORE)</a></div>
                    <div class="SendFeebackBoxSectionSixIconTwoBox">
                        <svg class="SendFeebackBoxSectionSixIconTwo" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
<path d="M8 16.4536C3.75928 16.4536 0.265625 12.96 0.265625 8.71191C0.265625 4.47119 3.75195 0.977539 8 0.977539C12.2407 0.977539 15.7344 4.47119 15.7344 8.71191C15.7344 12.96 12.248 16.4536 8 16.4536ZM7.80225 10.1548C8.29297 10.1548 8.62988 9.89844 8.68848 9.56152C8.68848 9.53223 8.6958 9.49561 8.6958 9.47363C8.76172 9.12939 9.07666 8.88037 9.50879 8.59473C10.2998 8.09668 10.7173 7.66455 10.7173 6.80762C10.7173 5.52588 9.53076 4.71289 8.05127 4.71289C6.73291 4.71289 5.79541 5.26953 5.50244 6.0166C5.44385 6.16309 5.40723 6.30225 5.40723 6.46338C5.40723 6.88086 5.73682 7.1958 6.16162 7.1958C6.46924 7.1958 6.71094 7.07861 6.88672 6.84424L6.96729 6.73438C7.21631 6.36084 7.5166 6.20703 7.88281 6.20703C8.36621 6.20703 8.71777 6.51465 8.71777 6.91748C8.71777 7.34961 8.39551 7.55469 7.77295 7.97949C7.23828 8.36035 6.85742 8.73389 6.85742 9.33447V9.38574C6.85742 9.89111 7.19434 10.1548 7.80225 10.1548ZM7.80225 12.6304C8.38086 12.6304 8.82764 12.2642 8.82764 11.7002C8.82764 11.1509 8.38818 10.77 7.80225 10.77C7.21631 10.77 6.75488 11.1436 6.75488 11.7002C6.75488 12.2568 7.21631 12.6304 7.80225 12.6304Z"/>
                        </svg>
                    </div>
                </div>

                <div class="SendFeebackBoxSectionSeven">
                    <div class="SendFeebackBoxSectionSevenBoxTwo">
                        <div class="SendFeebackBoxSectionSevenBoxTwoIconOneBox">
                            <div class="SendFeebackBoxSectionSevenBoxTwoIconOne">
                            </div>
                        </div>
                        <p class="SendFeebackBoxSectionSevenBoxTwoTextOne">Anonymous (Not available in BETA)</p>
                        <div class="SendFeebackBoxSectionSevenBoxTwoIconTwoBox">
                            <svg class="SendFeebackBoxSectionSevenBoxTwoIconTwo" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
<path d="M8 16.4536C3.75928 16.4536 0.265625 12.96 0.265625 8.71191C0.265625 4.47119 3.75195 0.977539 8 0.977539C12.2407 0.977539 15.7344 4.47119 15.7344 8.71191C15.7344 12.96 12.248 16.4536 8 16.4536ZM7.80225 10.1548C8.29297 10.1548 8.62988 9.89844 8.68848 9.56152C8.68848 9.53223 8.6958 9.49561 8.6958 9.47363C8.76172 9.12939 9.07666 8.88037 9.50879 8.59473C10.2998 8.09668 10.7173 7.66455 10.7173 6.80762C10.7173 5.52588 9.53076 4.71289 8.05127 4.71289C6.73291 4.71289 5.79541 5.26953 5.50244 6.0166C5.44385 6.16309 5.40723 6.30225 5.40723 6.46338C5.40723 6.88086 5.73682 7.1958 6.16162 7.1958C6.46924 7.1958 6.71094 7.07861 6.88672 6.84424L6.96729 6.73438C7.21631 6.36084 7.5166 6.20703 7.88281 6.20703C8.36621 6.20703 8.71777 6.51465 8.71777 6.91748C8.71777 7.34961 8.39551 7.55469 7.77295 7.97949C7.23828 8.36035 6.85742 8.73389 6.85742 9.33447V9.38574C6.85742 9.89111 7.19434 10.1548 7.80225 10.1548ZM7.80225 12.6304C8.38086 12.6304 8.82764 12.2642 8.82764 11.7002C8.82764 11.1509 8.38818 10.77 7.80225 10.77C7.21631 10.77 6.75488 11.1436 6.75488 11.7002C6.75488 12.2568 7.21631 12.6304 7.80225 12.6304Z"/>
                            </svg>
                        </div>
                    </div>
                    <div class="SendFeebackBoxSectionSevenBoxOne">
                        <div class="SendFeebackBoxSectionSevenBoxOneBoxOne"></div>
                        <div class="SendFeebackBoxSectionSevenBoxOneBoxOne"></div>
                        <div class="SendFeebackBoxSectionSevenBoxOneBoxOne"></div>
                        <div class="SendFeebackBoxSectionSevenBoxOneBoxOne"></div>
                        <div class="SendFeebackBoxSectionSevenBoxOneBoxOne"></div>
                        <div class="SendFeebackBoxSectionSevenBoxOneBoxOne"></div>
                        <div class="SendFeebackBoxSectionSevenBoxOneBoxOne"></div>
                        <div class="SendFeebackBoxSectionSevenBoxOneBoxOne"></div>
                        <div class="SendFeebackBoxSectionSevenBoxOneBoxOne"></div>
                        <div class="SendFeebackBoxSectionSevenBoxOneBoxOne"></div>
                        <div class="SendFeebackBoxSectionSevenBoxOneBoxOne"></div>
                        <div class="SendFeebackBoxSectionSevenBoxOneBoxOne"></div>
                    </div>
                </div>

                <!-- SUBMIT BUTTON -->
                <div class="SendFeedbackBoxSectionEight">
                    <a class="SendFeebackBoxSectionEightEmailButton" href="mailto:murk.hornet.0k@icloud.com">CONTACT VIA EMAIL</a>
                    <button class="SendFeebackBoxSectionEightSendButton" id="SendFeebackBoxSectionEightSendButton">SEND</button>
                </div>

        </div>
    </div>
</div>
`;

const SendFeedbackBoxCSS = `
.SendFeebackBoxShadow {
    position: fixed;
    display: flex;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;

    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);

    z-index: 2;
    top: 0px;
    bottom: 0px;
    right: 0px;
    left: 0px;
}

.SendFeebackBoxBackground {
    display: flex;
    padding: 16px;
    justify-content: center;
    align-items: center;
    gap: 16px;

    border-radius: 16px;
    border: 2px solid rgb(var(--color-swan));
    background: rgb(var(--color-snow));

    width: 80%;
    max-width: 500px;
    min-width: 368px;
}

.SendFeebackBoxLayers {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;

    width: 100%;
}

form {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
}

.SendFeebackBoxSectionOne {
    display: flex;
    justify-content: space-between;
    align-items: center;

    gap: 16px;
    width: 100%;
    height: 38px;
}

.SendFeebackBoxSectionOneTextOne {
    color: rgb(var(--color-eel));
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    margin-top: 0px;
    margin-bottom: 0px;

    height: 32px;

    cursor: default;
}

.SendFeebackBoxSectionOneCancelBoxBackground {
    display: flex;
    width: 34px;
    height: 36px;
    flex-shrink: 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background: rgb(var(--color-snow));

    border-radius: 8px;
    border: 2px solid rgb(var(--color-eel), 0.2);
    border-bottom: 4px solid rgb(var(--color-eel), 0.2);

    cursor: pointer;
    transition: .1s;
}

.SendFeebackBoxSectionOneCancelBoxBackground:hover {
    filter: brightness(0.95);
}

.SendFeebackBoxSectionOneCancelBoxBackground:active {
    height: 34px;

    border-bottom: 2px solid rgb(var(--color-eel), 0.2);
    margin-top: 2px;
    filter: brightness(0.9);
}

.SendFeebackBoxSectionOneCancelBoxIconOne {
    display: flex;
    width: 12px;
    height: 12px;
    flex-direction: column;
    justify-content: center;
    flex-shrink: 0;

    fill: rgb(var(--color-eel), 0.4);
}

.SendFeebackBoxSectionTwo {
    display: flex;
    width: 100%;
    height: 150px;
    resize: vertical;

    padding: 8px;

    box-sizing: border-box;

    justify-content: center;
    align-items: center;

    border-radius: 8px;
    border: 2px solid rgb(var(--color-eel), 0.2);
    background: rgb(var(--color-swan), 0.4);


    color: rgb(var(--color-eel));
    placeholder-color: rgb(var(--color-swan));
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.SendFeebackBoxSectionTwo::placeholder {
    font-weight: 700;
}

.SendFeebackBoxSectionTwo:focus {
    border: 2px solid #007AFF;
}

.SendFeebackBoxSectionThree {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;

    color: rgb(var(--color-eel));
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    cursor: default;

    margin-top: 0px;
    margin-bottom: 0px;

    height: 32px;
}

.SendFeebackBoxSectionFour {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    align-self: stretch;
    gap: 8px;
}

.SendFeebackBoxSectionFourButtonOneBackground {
    display: flex;
    height: 54px;
    align-items: center;
    flex: 1 0 0;

    border-radius: 8px;
    border: 2px solid rgb(var(--color-swan));
    border-bottom: 4px solid rgb(var(--color-swan));
    background: rgb(var(--color-snow));

    cursor: pointer;
    transition: .1s;
}

.SendFeebackBoxSectionFourButtonOneBackground:hover {
    filter: brightness(0.95);
}

.SendFeebackBoxSectionFourButtonOneBackground:active {
    height: 52px;

    border-bottom: 2px solid rgb(var(--color-swan));

    filter: brightness(0.9);
    margin-top: 2px;
}

.SendFeebackBoxSectionFourButtonOneIconOneBox {
    display: flex;
    width: 48px;
    height: 48px;
    justify-content: center;
    align-items: center;
}

.SendFeebackBoxSectionFourButtonOneIconOne {
    appearance: none;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    margin-right: 16px;
    margin-left: 16px;

    border-radius: 20px;
    border: 4px solid rgb(var(--color-swan), 0.4);
    background: rgb(var(--color-swan), 0.2);
    opacity: 100% !important;

    cursor: pointer;
}

.SendFeebackBoxSectionFourButtonOneTextOne {
    flex: 1 0 0;

    color: rgb(var(--color-swan));
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    margin: 0px;

    user-select: none; // chrome and Opera
    -moz-user-select: none; // Firefox
    -webkit-text-select: none; // IOS Safari
    -webkit-user-select: none; // Safari
}

.SendFeebackBoxSectionFourButtonOneIconTwoBox {
    display: flex;
    width: 48px;
    height: 48px;
    justify-content: center;
    align-items: center;
}

.SendFeebackBoxSectionFourButtonOneIconTwo {
    display: flex;
    width: 16px;
    height: 16px;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    color: rgba(255, 45, 85, 0.00);
    text-align: center;
    font-size: 15px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    fill: #FF2D55;
}


.SendFeebackBoxSectionSix {
    display: flex;
    height: 54px;
    align-items: center;
    align-self: stretch;
    flex: 1 0 0;

    border-radius: 8px;
    border: 2px solid rgba(0, 0, 0, 0.20);
    border-bottom: 4px solid rgba(0, 0, 0, 0.20);
    background: #007AFF;

    cursor: pointer;
    transition: .1s;
}

.SendFeebackBoxSectionSix:hover {
    filter: brightness(0.95);
}

.SendFeebackBoxSectionSix:active {
    height: 52px;

    border-bottom: 2px solid rgba(0, 0, 0, 0.20);

    filter: brightness(0.9);
    margin-top: 2px;
}

.SendFeebackBoxSectionSixIconOneBox {
    display: flex;
    width: 48px;
    height: 48px;
    justify-content: center;
    align-items: center;
}

.SendFeebackBoxSectionSixIconOne {
    width: 20px;
    height: 20px;
    flex-shrink: 0;

    border-radius: 20px;
    border: 4px solid rgb(241, 247, 251, 0.40);
    background: rgb(241, 247, 251, 0.40);
}

.SendFeebackBoxSectionSixTextOne {
    flex: 1 0 0;

    color: rgb(241, 247, 251);
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    user-select: none; // chrome and Opera
    -moz-user-select: none; // Firefox
    -webkit-text-select: none; // IOS Safari
    -webkit-user-select: none; // Safari
}

.SendFeebackBoxSectionSixIconTwoBox {
    display: flex;
    width: 48px;
    height: 48px;
    justify-content: center;
    align-items: center;
}

.SendFeebackBoxSectionSixIconTwo {
    display: flex;
    width: 16px;
    height: 16px;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    fill: rgb(241, 247, 251);
    text-align: center;
    line-height: normal;
}

.SendFeebackBoxSectionSeven {
    //  height: 48px;
    height: 56px;
    align-self: stretch;

    border-radius: 8px;

    position: relative;

    cursor: not-allowed !important;
}

.SendFeebackBoxSectionSevenBoxOne {
    flex-shrink: 0;
    display: flex;
    gap: 32px;
    align-items: center;

    height: 54px;
    /* set the height */
    overflow: hidden;
    /* clip any overflowing content */
    border-radius: 8px;

    pointer-events: none;
}

.SendFeebackBoxSectionSevenBoxOneBoxOne {
    width: 16px;
    height: 100px;
    transform: rotate(45deg);
    flex-shrink: 0;

    background: rgb(var(--color-eel), 0.1);
}

.SendFeebackBoxSectionSevenBoxTwo {
    display: flex;
    height: 54px;
    align-items: center;
    align-self: stretch;
    flex: 1 0 0;

    position: absolute;
    width: 100%;

    border-radius: 8px;
    border: 2px solid rgb(var(--color-swan));
    border-bottom: 4px solid rgb(var(--color-swan));
    background: rgb(var(--color-snow));
    //  cursor: pointer;
    transition: .1s;
}

.SendFeebackBoxSectionSevenBoxTwo:hover {
    filter: brightness(0.95);
}

.SendFeebackBoxSectionSevenBoxTwo:active {
    border-bottom: 4px solid rgb(var(--color-swan));
    filter: brightness(0.95);
}

.SendFeebackBoxSectionSevenBoxTwoIconOneBox {
    display: flex;
    width: 48px;
    height: 48px;
    justify-content: center;
    align-items: center;
}

.SendFeebackBoxSectionSevenBoxTwoIconOne {
    width: 20px;
    height: 20px;
    flex-shrink: 0;

    border-radius: 20px;
    border: 4px solid rgb(var(--color-swan), 0.4);
    background: rgb(var(--color-swan), 0.2);
}

.SendFeebackBoxSectionSevenBoxTwoTextOne {
    flex: 1 0 0;

    color: rgb(var(--color-swan));
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    margin-top: 0px;
    margin-bottom: 0px;

    user-select: none; // chrome and Opera
    -moz-user-select: none; // Firefox
    -webkit-text-select: none; // IOS Safari
    -webkit-user-select: none; // Safari
}

.SendFeebackBoxSectionSevenBoxTwoIconTwoBox {
    display: flex;
    width: 48px;
    height: 48px;
    justify-content: center;
    align-items: center;
}

.SendFeebackBoxSectionSevenBoxTwoIconTwo {
    display: flex;
    width: 16px;
    height: 16px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    line-height: normal;

    fill: rgb(var(--color-swan));
}

.SendFeedbackBoxSectionEight {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;
}

.SendFeebackBoxSectionEightSendButton {
    display: flex;
    height: 54px;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 10px;
    align-self: stretch;

    border-radius: 8px;
    border: 2px solid #0062CC;
    border-bottom: 4px solid #0062CC;
    background: #007AFF;

    color: #FFF;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    cursor: pointer;
    transition: .1s;

    padding: 0px;
}

.SendFeebackBoxSectionEightSendButton:hover {
    filter: brightness(0.95);
}

.SendFeebackBoxSectionEightSendButton:active {
    height: 52px;
    border-bottom: 2px solid #0062CC;
    margin-top: 2px;

    filter: brightness(0.9);
}

.SendFeebackBoxSectionEightEmailButton {
    display: flex;
    height: 54px;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 10px;
    align-self: stretch;

    border-radius: 8px;
    border: 2px solid rgb(var(--color-swan));
    border-bottom: 4px solid rgb(var(--color-swan));
    background: rgb(var(--color-snow));

    color: rgb(var(--color-eel));
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    cursor: pointer;
    transition: .1s;

    text-decoration: none;
}

.SendFeebackBoxSectionEightEmailButton:hover {
    filter: brightness(0.95);
}

.SendFeebackBoxSectionEightEmailButton:active {
    height: 52px;

    border-bottom: 2px solid rgb(var(--color-swan));

    margin-top: 2px;
    filter: brightness(0.9);
}

.SendFeebackBoxSectionEightTextOne {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1 0 0;
    align-self: stretch;

    color: #FFF;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    user-select: none; // chrome and Opera
    -moz-user-select: none; // Firefox
    -webkit-text-select: none; // IOS Safari
    -webkit-user-select: none; // Safari
}
`;

let randomValue;

function setRandomValue() {
    if (Boolean(localStorage.getItem("RandomValue")) === false) {
        randomValue = Math.floor(Math.random() * 1000000); // Generates a random number between 0 and 999999
        localStorage.setItem("RandomValue", String(randomValue));
        console.log("Generated ID: ", randomValue); // This is to show you the generated ID, you can remove it later
    } else {
        randomValue = localStorage.getItem("RandomValue");
    }
}

setRandomValue();


let injectedSendFeedBackBoxElement = null;
let injectedSendFeedBackBoxStyle = null;

let isSendFeebackBoxSectionEightSendButtonEnabled = false;

let SendFeedbackTextAreaValue;
let idktype = 'Bug Report';
let sendFeedbackStatus = 'none';

function injectSendFeedBackBox() {
    //console.log('injectSendFeedBackBox called');
    if (isSendFeedbackButtonPressed === true) {
        // Inject the content if it's not already injected
        if (!injectedSendFeedBackBoxElement) {
            // Creating a container for the overlay
            injectedSendFeedBackBoxElement = document.createElement('div');
            injectedSendFeedBackBoxElement.innerHTML = SendFeedbackBoxHTML;
            document.body.appendChild(injectedSendFeedBackBoxElement);

            // Creating a style tag for CSS
            injectedSendFeedBackBoxStyle = document.createElement('style');
            injectedSendFeedBackBoxStyle.type = 'text/css';
            injectedSendFeedBackBoxStyle.innerHTML = SendFeedbackBoxCSS;
            document.head.appendChild(injectedSendFeedBackBoxStyle);

            const SendFeedbackCloseButton = document.querySelector('.SendFeebackBoxSectionOneCancelBoxBackground');
            SendFeedbackCloseButton.addEventListener('click', () => {
                isSendFeedbackButtonPressed = false;
            });
            // Get the textarea element
            const TextAreaOneOne = document.getElementById('SendFeebackBoxSectionTwoID');

            // Set the value of the textarea to the variable


            const bugRadio = document.getElementById('SendFeebackTypeButtonOne');
            const suggestionRadio = document.getElementById('SendFeebackTypeButtonTwo');

            // Create a variable to store the value of the selected radio button

            // Add a change event listener to both radio buttons


            bugRadio.addEventListener('mousedown', () => {
                if (idktype === 'Bug Report') {
                    bugRadio.style.border = '2px solid rgba(0, 0, 0, 0.20)';
                    bugRadio.style.borderBottom = '2px solid rgba(0, 0, 0, 0.20)';
                } else {
                    bugRadio.style.border = '2px solid rgb(var(--color-swan))';
                    bugRadio.style.borderBottom = '2px solid rgb(var(--color-swan))';
                }
            });

            bugRadio.addEventListener('mouseup', () => {
                idktype = 'Bug Report';
                updateDuolingoProSendFeedbackButtons(bugRadio, idktype);
            });

            suggestionRadio.addEventListener('mousedown', () => {
                if (idktype === 'Suggestion') {
                    suggestionRadio.style.border = '2px solid rgba(0, 0, 0, 0.20)';
                    suggestionRadio.style.borderBottom = '2px solid rgba(0, 0, 0, 0.20)';
                } else {
                    suggestionRadio.style.border = '2px solid rgb(var(--color-swan))';
                    suggestionRadio.style.borderBottom = '2px solid rgb(var(--color-swan))';
                }
            });

            suggestionRadio.addEventListener('mouseup', () => {
                idktype = 'Suggestion';
                updateDuolingoProSendFeedbackButtonsTwo(bugRadio, idktype);
            });

            addEventListener('mouseup', () => {
                updateDuolingoProSendFeedbackButtons(bugRadio, idktype);
                updateDuolingoProSendFeedbackButtonsTwo(suggestionRadio, idktype);
            });

            updateDuolingoProSendFeedbackButtons(bugRadio, idktype);
            updateDuolingoProSendFeedbackButtonsTwo(suggestionRadio, idktype);



            const SendFeebackBoxSectionTwo = document.querySelector('.SendFeebackBoxSectionTwo');

            const SendFeebackBoxSectionEightSendButton = document.querySelector('.SendFeebackBoxSectionEightSendButton');
            SendFeebackBoxSectionEightSendButton.addEventListener('click', () => {
                if (isSendFeebackBoxSectionEightSendButtonEnabled) {
                    SendFeedbackTextAreaValue = TextAreaOneOne.value;
                    sendFeedbackNew(SendFeedbackTextAreaValue, idktype);

                    sendFeedbackStatus = 'trying';

                    function checkFlag() {
                        if (sendFeedbackStatus === 'trying') {
                            SendFeebackBoxSectionEightSendButton.textContent = 'SENDING';
                            setTimeout(function() {
                                checkFlag();
                            }, 100);
                        } else if (sendFeedbackStatus === 'true') {
                            SendFeebackBoxSectionEightSendButton.textContent = 'SUCCESSFULLY SENT';
                            setTimeout(function() {
                                location.reload();
                            }, 1000);
                        } else if (sendFeedbackStatus === 'error') {
                            SendFeebackBoxSectionEightSendButton.textContent = 'ERROR SENDING';
                            SendFeebackBoxSectionEightSendButton.style.background = '#FF2D55';
                            SendFeebackBoxSectionTwo.style.border = '2px solid rgba(0, 0, 0, 0.20)';
                            SendFeebackBoxSectionTwo.style.borderBottom = '4px solid rgba(0, 0, 0, 0.20)';

                            setTimeout(function() {
                                SendFeebackBoxSectionEightSendButton.textContent = 'TRY AGAIN';
                            }, 2000);

                            setTimeout(function() {
                                SendFeebackBoxSectionEightSendButton.textContent = 'SEND';
                                SendFeebackBoxSectionEightSendButton.style.background = '';
                                SendFeebackBoxSectionTwo.style.border = '';
                                SendFeebackBoxSectionTwo.style.borderBottom = '';
                            }, 4000);

                            sendFeedbackStatus = 'empty';
                        } else if (sendFeedbackStatus === 'empty') {
                            setTimeout(function() {
                                checkFlag();
                            }, 100);
                        }
                    }
                    checkFlag();

                }
            });


            function updateDuolingoProSendFeedbackButtons(element, value) {
                let textElement = element.querySelector('.SendFeebackBoxSectionFourButtonOneTextOne');
                let iconElement = element.querySelector('.SendFeebackBoxSectionFourButtonOneIconOne');

                if (value === 'Bug Report') {
                    element.style.background = '#FF2D55';
                    element.style.border = '2px solid rgba(0, 0, 0, 0.20)';
                    element.style.borderBottom = '4px solid rgba(0, 0, 0, 0.20)';
                    textElement.style.color = 'rgb(241, 247, 251)';
                    iconElement.style.border = '4px solid rgb(241, 247, 251, 0.40)';
                    iconElement.style.background = 'rgb(241, 247, 251, 0.40)';
                } else {
                    element.style.background = 'rgb(var(--color-snow))';
                    element.style.border = '2px solid rgb(var(--color-swan))';
                    element.style.borderBottom = '4px solid rgb(var(--color-swan))';
                    textElement.style.color = 'rgb(var(--color-eel), 0.4)';
                    iconElement.style.border = '4px solid rgb(var(--color-swan))';
                    iconElement.style.background = 'rgb(var(--color-swan), 0.4)';
                }

            }

            function updateDuolingoProSendFeedbackButtonsTwo(element, value) {
                let textElement = element.querySelector('.SendFeebackBoxSectionFourButtonOneTextOne');
                let iconElement = element.querySelector('.SendFeebackBoxSectionFourButtonOneIconOne');

                if (value === 'Suggestion') {
                    element.style.background = '#34C759';
                    element.style.border = '2px solid rgba(0, 0, 0, 0.20)';
                    element.style.borderBottom = '4px solid rgba(0, 0, 0, 0.20)';
                    textElement.style.color = 'rgb(241, 247, 251)';
                    iconElement.style.border = '4px solid rgb(241, 247, 251, 0.40)';
                    iconElement.style.background = 'rgb(241, 247, 251, 0.40)';
                } else {
                    element.style.background = 'rgb(var(--color-snow))';
                    element.style.border = '2px solid rgb(var(--color-swan))';
                    element.style.borderBottom = '4px solid rgb(var(--color-swan))';
                    textElement.style.color = 'rgb(var(--color-eel), 0.4)';
                    iconElement.style.border = '4px solid rgb(var(--color-swan))';
                    iconElement.style.background = 'rgb(var(--color-swan), 0.4)';
                }

            }


        }
    } else {
        // Remove the content if it was previously injected
        if (injectedSendFeedBackBoxElement) {
            document.body.removeChild(injectedSendFeedBackBoxElement);
            document.head.removeChild(injectedSendFeedBackBoxStyle);
            injectedSendFeedBackBoxElement = null;
            injectedSendFeedBackBoxStyle = null;
        }
    }
}

setInterval(injectSendFeedBackBox, 100);

function SendFeedbackTextAreaStuff() {
    if (isSendFeedbackButtonPressed === true) {
        try {
            const SendFeebackBoxSectionEightSendButton = document.querySelector('.SendFeebackBoxSectionEightSendButton');

            const SendFeebackBoxSectionTwo = document.querySelector('.SendFeebackBoxSectionTwo');

            function disableHoverOne() {
                SendFeebackBoxSectionEightSendButton.style.marginTop = '';
                SendFeebackBoxSectionEightSendButton.style.height = '';

                SendFeebackBoxSectionEightSendButton.style.border = '';
                SendFeebackBoxSectionEightSendButton.style.borderBottom = '';
            }

            function enableHoverOne() {
                SendFeebackBoxSectionEightSendButton.style.marginTop = '2px';
                SendFeebackBoxSectionEightSendButton.style.height = '52px';

                SendFeebackBoxSectionEightSendButton.style.border = '2px solid rgb(var(--color-eel), 0.2)';
                SendFeebackBoxSectionEightSendButton.style.borderBottom = '2px solid rgb(var(--color-eel), 0.2)';
            }

            if (SendFeebackBoxSectionTwo.value.trim().length > 16) {
                SendFeebackBoxSectionEightSendButton.style.opacity = '100%';
                SendFeebackBoxSectionEightSendButton.style.cursor = 'pointer';

                isSendFeebackBoxSectionEightSendButtonEnabled = true;
            } else {
                SendFeebackBoxSectionEightSendButton.style.opacity = '0.5';
                SendFeebackBoxSectionEightSendButton.style.cursor = 'not-allowed';

                isSendFeebackBoxSectionEightSendButtonEnabled = false;
            }

            if (isSendFeebackBoxSectionEightSendButtonEnabled) {
                disableHoverOne();
            } else {
                enableHoverOne();
            }
        } catch (error) {
        }
    }
}

setInterval(SendFeedbackTextAreaStuff, 100);






const WhatsNewBoxHTML = `
<div class="WhatsNewBoxOneShadow">
    <div class="WhatsNewBoxOneBackground">
        <div class="WhatsNewBoxOneSectionOne">
            <p class="WhatsNewBoxOneSectionOneTextOne">What’s New</p>
            <div class="WhatsNewBoxOneSectionOneBoxOne">
                <p class="WhatsNewBoxOneSectionOneBoxOneTextOne">2.0 BETA 6</p>
            </div>
        </div>
        <div class="WhatsNewBoxOneSectionTwo">
            <img src="https://framerusercontent.com/images/oaXxGJyRWwPc6cFDUM3fPxlDI.png" class="WhatsNewBoxOneSectionTwoImageOne">
        </div>
        <div class="WhatsNewBoxOneSectionThree">
            <p class="WhatsNewBoxOneSectionThreeTextOne">Brand New Backend</p>
            <p class="WhatsNewBoxOneSectionThreeTextTwo">The backend for AutoSolver has been completely rewritten, providing more stability.</p>
        </div>
        <div class="WhatsNewBoxOneSectionFour">
            <p class="WhatsNewBoxOneSectionFourTextOne">NEXT</p>
        </div>
    </div>
</div>
`;

const WhatsNewBoxCSS = `
.WhatsNewBoxOneShadow {
    position: fixed;
    display: flex;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;

    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);

    z-index: 2;
    top: 0px;
    bottom: 0px;
    right: 0px;
    left: 0px;
}

.WhatsNewBoxOneBackground {
    display: flex;
    padding: 16px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;

    border-radius: 16px;
    border: 2px solid rgba(0, 0, 0, 0.10);
    background: #FFF;

    width: 400px;
}

.WhatsNewBoxOneSectionOne {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
}

.WhatsNewBoxOneSectionOneTextOne {
    color: #000;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    cursor: default;
    margin: 0px;
}

.WhatsNewBoxOneSectionOneBoxOne {
    display: flex;
    padding: 8px;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    border-radius: 8px;
    border: 2px solid rgba(0, 0, 0, 0.20);
    background: #FF2D55;
}

.WhatsNewBoxOneSectionOneBoxOneTextOne {
    color: #FFF;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    cursor: default;
    margin: 0px;
}

.WhatsNewBoxOneSectionTwo {
    display: flex;
    height: 300px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-self: stretch;
    padding: 0px;

    border-radius: 8px;
    border: 2px solid rgba(0, 0, 0, 0.20);
    background: rgba(0, 0, 0, 0.05);
}

.WhatsNewBoxOneSectionTwoImageOne {
    width: 100%;
    border-radius: 8px;
}

.WhatsNewBoxOneSectionThree {
    display: flex;
    padding-bottom: 0px;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    align-self: stretch;

    margin-top: 4px;
    margin-bottom: 8px;
}

.WhatsNewBoxOneSectionThreeTextOne {
    align-self: stretch;

    color: #000;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    cursor: default;
    margin: 0px;
}

.WhatsNewBoxOneSectionThreeTextTwo {
    align-self: stretch;

    color: rgba(0, 0, 0, 0.50);
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    cursor: default;
    margin: 0px;
}

.WhatsNewBoxOneSectionFour {
    display: flex;
    height: 48px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;

    border-radius: 8px;
    border: 2px solid rgba(0, 0, 0, 0.20);
    border-bottom: 4px solid rgba(0, 0, 0, 0.20);
    background: #007AFF;

    cursor: pointer;
    transition: .1s;
}

.WhatsNewBoxOneSectionFour:hover {
    filter: brightness(0.95);
}

.WhatsNewBoxOneSectionFour:active {
    filter: brightness(0.9);
    margin-top: 2px;
    height: 46px;

    border-bottom: 2px solid rgba(0, 0, 0, 0.20);

    filter: brightness(0.9);
}

.WhatsNewBoxOneSectionFourTextOne {
    color: #FFF;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    margin: 0px;

    user-select: none; // chrome and Opera
    -moz-user-select: none; // Firefox
    -webkit-text-select: none; // IOS Safari
    -webkit-user-select: none; // Safari
}
`;

const simplifiedUICSS = `
div {
    transition: none !important;
    animation-duration: 0s !important;
}

.fSJFz { /* explosion effect at the tip of the progress bar */
    display: none !important;
}
`

let injectedWhatsNewBoxElement = null;
let injectedWhatsNewBoxStyle = null;

function injectWhatsNewBox() {
    //console.log('injectWhatsNewBox called');
    if (wasWhatsNewInTwoPointZeroBetaSixFinished === false) {

        if (window.location.pathname === '/learn') {
            // Inject the content if it's not already injected
            if (!injectedWhatsNewBoxElement) {
                // Creating a container for the overlay
                injectedWhatsNewBoxElement = document.createElement('div');
                injectedWhatsNewBoxElement.innerHTML = WhatsNewBoxHTML;
                document.body.appendChild(injectedWhatsNewBoxElement);

                // Creating a style tag for CSS
                injectedWhatsNewBoxStyle = document.createElement('style');
                injectedWhatsNewBoxStyle.type = 'text/css';
                injectedWhatsNewBoxStyle.innerHTML = WhatsNewBoxCSS;
                document.head.appendChild(injectedWhatsNewBoxStyle);

                const WhatsNewBoxOneSectionFour = document.querySelector('.WhatsNewBoxOneSectionFour');
                modifyWhatsNewBox();
                WhatsNewBoxOneSectionFour.addEventListener('click', () => {
                    whatsNewInBetaStage++;
                    console.log('something');
                    modifyWhatsNewBox();
                });
            }
        }
  } else {
      // Remove the content if it was previously injected
      if (injectedWhatsNewBoxElement) {
          document.body.removeChild(injectedWhatsNewBoxElement);
          document.head.removeChild(injectedWhatsNewBoxStyle);
          injectedWhatsNewBoxElement = null;
          injectedWhatsNewBoxStyle = null;
    }
  }
}

setInterval(injectWhatsNewBox, 100);

function modifyWhatsNewBox() {
    const WhatsNewBoxOneSectionThreeTextOne = document.querySelector('.WhatsNewBoxOneSectionThreeTextOne');
    const WhatsNewBoxOneSectionThreeTextTwo = document.querySelector('.WhatsNewBoxOneSectionThreeTextTwo');
    const WhatsNewBoxOneSectionFourTextOne = document.querySelector('.WhatsNewBoxOneSectionFourTextOne');
    const WhatsNewBoxOneSectionTwoImageOneURL = document.querySelector('img.WhatsNewBoxOneSectionTwoImageOne');

    if (whatsNewInBetaStage === 0) {
        WhatsNewBoxOneSectionThreeTextOne.textContent = 'New and Improved Backend';
        WhatsNewBoxOneSectionThreeTextTwo.textContent = 'The backend for AutoSolver has been completely rewritten, providing more stability and less bugs.';
        WhatsNewBoxOneSectionTwoImageOneURL.src = 'https://framerusercontent.com/images/oaXxGJyRWwPc6cFDUM3fPxlDI.png';
        WhatsNewBoxOneSectionFourTextOne.textContent = 'NEXT';
    } else if (whatsNewInBetaStage === 0) {
      WhatsNewBoxOneSectionThreeTextOne.textContent = 'Duolingo Pro Website';
        WhatsNewBoxOneSectionThreeTextTwo.textContent = 'The issues & roadmap page provides a better visual of what issues currently exist, when they’re scheduled to be fixed and what features are coming soon.';
        WhatsNewBoxOneSectionTwoImageOneURL.src = 'https://framerusercontent.com/images/q30YeZga0tb4ndWMVmFEjDiTww.png';
        WhatsNewBoxOneSectionFourTextOne.textContent = 'NEXT';
    } else if (whatsNewInBetaStage === 1) {
      WhatsNewBoxOneSectionThreeTextOne.textContent = 'Settings Tab for Duolingo Pro';
        WhatsNewBoxOneSectionThreeTextTwo.textContent = 'With the new settings tab, you can now enable new features or disable them to your need.';
        WhatsNewBoxOneSectionTwoImageOneURL.src = 'https://framerusercontent.com/images/itNtqAZjyPuh8dVnLItNGqjA2I.png';
        WhatsNewBoxOneSectionFourTextOne.textContent = 'NEXT';
    } else if (whatsNewInBetaStage === 2) {
      WhatsNewBoxOneSectionThreeTextOne.textContent = 'ProBlock by Duolingo Pro';
        WhatsNewBoxOneSectionThreeTextTwo.textContent = 'ProBlock removes ads that pop-up on the main Duolingo tabs like Learn, Practice, and Shop.';
        WhatsNewBoxOneSectionTwoImageOneURL.src = 'https://framerusercontent.com/images/VFa03QdeAxhSUggKUbsQRtiYYag.png';
        WhatsNewBoxOneSectionFourTextOne.textContent = 'NEXT';
    } else if (whatsNewInBetaStage === 3) {
      WhatsNewBoxOneSectionThreeTextOne.textContent = 'Auto-Repeat Lessons';
        WhatsNewBoxOneSectionThreeTextTwo.textContent = 'Auto-Repeat Lesson Mode enables AutoSolver to only do a set lesson and repeat it. This mode improves chances of AutoSolver not getting stuck. We recommend using this mode with the Spanish/French/German course from English IF your main goal is to gain the most XP autonomously.';
        WhatsNewBoxOneSectionTwoImageOneURL.src = 'https://framerusercontent.com/images/fHj0L8tJB3xiZGMZDMju7Youjmg.png';
        WhatsNewBoxOneSectionFourTextOne.textContent = 'NEXT';
    } else if (whatsNewInBetaStage === 4) {
      WhatsNewBoxOneSectionThreeTextOne.textContent = 'Refreshed Send Feedback';
        WhatsNewBoxOneSectionThreeTextTwo.textContent = 'The refreshed Send Feedback box makes it even more easier and faster to send feedback. The refreshed design makes it more fun while the all-new backend sends faster with less errors.';
        WhatsNewBoxOneSectionTwoImageOneURL.src = 'https://framerusercontent.com/images/5TfQixlud5chFxBxRfIaUT98KRk.png';
        WhatsNewBoxOneSectionFourTextOne.textContent = 'NEXT';
    } else if (whatsNewInBetaStage === 5) {
      WhatsNewBoxOneSectionThreeTextOne.textContent = 'Humane Solving Mode';
        WhatsNewBoxOneSectionThreeTextTwo.textContent = 'Humane Solving mode solves each question step by step, making activity look less suspicious on Duolingo lesson logs, reducing the slim chances of being banned or temporarily deactivated to even less.';
        WhatsNewBoxOneSectionTwoImageOneURL.src = 'https://framerusercontent.com/images/RhmJpQO6B9QXULLIQgZJeUPiroY.png';
        WhatsNewBoxOneSectionFourTextOne.textContent = 'NEXT';
    } else if (whatsNewInBetaStage === 6) {
      WhatsNewBoxOneSectionThreeTextOne.textContent = 'TurboSolve';
        WhatsNewBoxOneSectionThreeTextTwo.textContent = 'TurboSolve can solve question up to 5 times faster, reducing the time spent on lessons greatly while getting more work done.';
        WhatsNewBoxOneSectionTwoImageOneURL.src = 'https://framerusercontent.com/images/RhmJpQO6B9QXULLIQgZJeUPiroY.png';
        WhatsNewBoxOneSectionFourTextOne.textContent = 'NEXT';
    } else if (whatsNewInBetaStage === 7) {
      WhatsNewBoxOneSectionThreeTextOne.textContent = 'ProAccount (planned)';
        WhatsNewBoxOneSectionThreeTextTwo.textContent = 'ProAccount is a new planned feature that will allow cross-device syncing and make one-on-one support possible in the future. BETA 6 is laying the foundation for these new features.';
        WhatsNewBoxOneSectionTwoImageOneURL.src = 'https://framerusercontent.com/images/e0zC1jjKLy7Ucvx8avK99oo52GE.png';
        WhatsNewBoxOneSectionFourTextOne.textContent = 'CLOSE';
    } else if (whatsNewInBetaStage === 0) {
      WhatsNewBoxOneSectionThreeTextOne.textContent = 'ProServer, the next era';
        WhatsNewBoxOneSectionThreeTextTwo.textContent = 'ProServer will be the next ginormous step Duolingo Pro will take. No more having to log in to keep your steak going, or stay in the leaderboard. ProServer by Duolingo Pro will make sure to do those things without any input needed every day.';
        WhatsNewBoxOneSectionTwoImageOneURL.src = 'https://framerusercontent.com/images/e0zC1jjKLy7Ucvx8avK99oo52GE.png';
        WhatsNewBoxOneSectionFourTextOne.textContent = 'CLOSE';
    } else {
        wasWhatsNewInTwoPointZeroBetaSixFinished = true;
        localStorage.setItem('wasWhatsNewInTwoPointZeroBetaSixFinished', wasWhatsNewInTwoPointZeroBetaSixFinished);
    }

}


const DuolingoProSettingsBoxHTML = `
<div class="DuolingoProSettingsBoxShadow">
    <div class="DuolingoProSettingsBoxBackground">
        <div class="DuolingoProSettingsBoxLayers">
            <div class="DuolingoProSettingsBoxSectionOne">
                <p class="DuolingoProSettingsBoxSectionOneTextOne">Settings (scrollable)</p>
                <div class="DuolingoProSettingsBoxSectionOneBoxOne">
                    <p class="DuolingoProSettingsBoxSectionOneBoxOneTextOne">2.0 BETA 6</p>
                </div>
            </div>
            <div class="DuolingoProSettingsBoxSectionTwo">
                <div class="DuolingoProSettingsBoxSectionTwoBoxOne">
                    <div class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOne">
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextThree">RECOMMENDED</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextOne">Show AutoSolver Box</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextTwo">AutoSolver Box makes it easier to binge solve questions automatically.</p>
                    </div>
                    <div class="DuolingoProSettingsBoxToggleTypeOne" id="DuolingoProSettingsBoxToggleOneID">
                        <p class="DuolingoProSettingsBoxToggleTypeOneTextOne">ON</p>
                    </div>
                </div>
                <div class="DuolingoProSettingsBoxSectionTwoBoxOne">
                    <div class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOne">
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextOne">Show Practice Only Mode for AutoSolver Box</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextTwo">NOTE: THIS MODE CURRENTY DOESN'T WORK. KEEP OFF UNLESS YOU WANT TO TRY IT OUT. Practice Mode enables AutoSolver to only do practices and repeat them.</p>
                    </div>
                    <div class="DuolingoProSettingsBoxToggleTypeOne" id="DuolingoProSettingsBoxToggleTwoID">
                        <p class="DuolingoProSettingsBoxToggleTypeOneTextOne">OFF</p>
                    </div>
                </div>
                <div class="DuolingoProSettingsBoxSectionTwoBoxOne">
                    <div class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOne">
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextThree">RECOMMENDED</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextOne">Show Repeat Lesson Mode for AutoSolver Box</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextTwo">Repeat Lesson Mode enables AutoSolver to only do a set lesson and repeat it. This mode improves chances of AutoSolver NOT getting stuck on an unsupported question type.  We recommend using this mode with the Spanish/French/German course from English IF your main goal is to gain the most XP autonomously.</p>
                    </div>
                    <div class="DuolingoProSettingsBoxToggleTypeOne" id="DuolingoProSettingsBoxToggleThreeID">
                        <p class="DuolingoProSettingsBoxToggleTypeOneTextOne">NOT SET</p>
                    </div>
                </div>
                <div class="DuolingoProSettingsBoxSectionTwoBoxOne">
                    <div class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOne">
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextOne">Low Performance Mode</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextTwo">In low performance mode, Duolingo Pro works slower while using slightly less power. NOTE: This mode doesn't do anything *yet*.</p>
                    </div>
                    <div class="DuolingoProSettingsBoxToggleTypeOne" id="DuolingoProSettingsBoxToggleFourID">
                        <p class="DuolingoProSettingsBoxToggleTypeOneTextOne">OFF</p>
                    </div>
                </div>
                <div class="DuolingoProSettingsBoxSectionTwoBoxOne">
                    <div class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOne">
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextThree">RECOMMENDED</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextOne">ProBlock Ads by Duolingo Pro</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextTwo">ProBlock removes ads that pop-up on the main Duolingo tabs like Learn, Practice, and Shop.</p>
                    </div>
                    <div class="DuolingoProSettingsBoxToggleTypeOne" id="DuolingoProSettingsBoxToggleFiveID">
                        <p class="DuolingoProSettingsBoxToggleTypeOneTextOne">ON</p>
                    </div>
                </div>
                <div class="DuolingoProSettingsBoxSectionTwoBoxOne">
                    <div class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOne">
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextFour">EXPERIMENTAL</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextOne">TurboSolve Mode</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextTwo">TurboSolve, thanks to <a href="https://github.com/SicariusBlack" style="color: #007AFF; font-size: 14px; font-style: normal; font-weight: 700; line-height: normal;">SicariusBlack</a>, improves AutoSolve and Solve All speeds by up to 5 times. This is an experimental feature.</p>
                    </div>
                    <div class="DuolingoProSettingsBoxToggleTypeOne" id="DuolingoProSettingsBoxToggleSixID">
                        <p class="DuolingoProSettingsBoxToggleTypeOneTextOne">ON</p>
                    </div>
                </div>
                <div class="DuolingoProSettingsBoxSectionTwoBoxOne">
                    <div class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOne">
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextFour">NEW</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextOne">Humane Solving Mode</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextTwo">Humane Solving mode, thanks to <a href="https://github.com/SicariusBlack" style="color: #007AFF; font-size: 14px; font-style: normal; font-weight: 700; line-height: normal;">SicariusBlack</a>, solves every question step by step, greatly reducing the slim chances of being caught and banned.</p>
                    </div>
                    <div class="DuolingoProSettingsBoxToggleTypeOne" id="DuolingoProSettingsBoxToggleSevenID">
                        <p class="DuolingoProSettingsBoxToggleTypeOneTextOne">ON</p>
                    </div>
                </div>
                <div class="DuolingoProSettingsBoxSectionTwoBoxOne">
                    <div class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOne">
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextOne">Contributors</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextTwo"><a href="https://github.com/SicariusBlack"  target="_blank" rel="noopener noreferrer" style="color: #007AFF; text-decoration-line: none;">SicariusBlack</a></p>
                    </div>
                </div>
            </div>
            <div class="DuolingoProSettingsBoxSectionThree">
                <div class="DuolingoProSettingsBoxCancelButton">
                    <p class="DuolingoProSettingsBoxCancelButtonTextOne">CANCEL</p>
                </div>
                <div class="DuolingoProSettingsBoxSaveButton">
                    <p class="DuolingoProSettingsBoxSaveButtonTextOne">SAVE</p>
                </div>
            </div>
        </div>
    </div>
</div>
`;

const DuolingoProSettingsBoxCSS = `
.DuolingoProSettingsBoxShadow {
    position: fixed;
    display: flex;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;

    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);

    z-index: 2;
    top: 0px;
    bottom: 0px;
    right: 0px;
    left: 0px;
}

.DuolingoProSettingsBoxBackground {
    display: flex;

    max-height: 80vh;
    width: 80%;
    max-width: 600px;
    min-width: 368px;
    padding-right: 16px;
    padding-left: 16px;
    margin-bottom: 16px;
    overflow-y: visible;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;

    border-radius: 16px;
    border: 2px solid rgb(var(--color-swan));
    background: rgb(var(--color-snow));
}

.DuolingoProSettingsBoxLayers {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;

    overflow-y: auto;
    padding: 16px 0 16px 0;
    margin-right: -16px;
    padding-right: 16px;
}

.DuolingoProSettingsBoxSectionOne {
    display: flex;
    height: 36px;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
}

.DuolingoProSettingsBoxSectionOneTextOne {
    color: rgb(var(--color-eel));
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    margin: 0px;
    cursor: default;
}

.DuolingoProSettingsBoxSectionOneBoxOne {
    display: flex;
    width: 98px;
    height: 36px;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    border-radius: 8px;
    border: 2px solid rgba(0, 0, 0, 0.20);
    background: #FF2D55;
}

.DuolingoProSettingsBoxSectionOneBoxOneTextOne {
    color: #FFF;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    margin: 0px;
    cursor: default;
}

.DuolingoProSettingsBoxSectionTwo {
    display: flex;
    padding-bottom: 8px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;
}

.DuolingoProSettingsBoxSectionTwoBoxOne {
    display: flex;
    align-items: center;
    gap: 16px;
    align-self: stretch;
}

.DuolingoProSettingsBoxSectionTwoBoxOneBoxOne {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    flex: 1 0 0;
}

.DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextOne {
    align-self: stretch;

    color: rgb(var(--color-eel));
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    margin: 0px;
    cursor: default;
}

.DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextTwo {
    align-self: stretch;

    color: rgb(var(--color-hare));
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    margin: 0px;
    cursor: default;
}

.DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextThree {
    align-self: stretch;

    color: #007AFF;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    margin: 0px;
    cursor: default;
}

.DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextFour {
    align-self: stretch;

    color: #FF2D55;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    margin: 0px;
    cursor: default;
}

.DuolingoProSettingsBoxToggleTypeOne {
    display: flex;
    width: 98px;
    height: 48px;
    justify-content: center;
    align-items: center;
    gap: 8px;

    border-radius: 8px;
    border: 2px solid rgba(0, 0, 0, 0.20);
    border-bottom: 4px solid rgba(0, 0, 0, 0.20);
    background: #007AFF;

    cursor: pointer;
    transition: .1s;
}

.DuolingoProSettingsBoxToggleTypeOne:hover {
    filter: brightness(0.95);
}

.DuolingoProSettingsBoxToggleTypeOne:active {
    filter: brightness(0.9);

    margin-top: 2px;
    height: 46px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.20);
}

.DuolingoProSettingsBoxToggleTypeOneTextOne {
    color: #FFF;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    margin: 0px;

    user-select: none; // chrome and Opera
    -moz-user-select: none; // Firefox
    -webkit-text-select: none; // IOS Safari
    -webkit-user-select: none; // Safari
}

.DuolingoProSettingsBoxSectionThree {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
}

.DuolingoProSettingsBoxCancelButton {
    display: flex;
    width: 98px;
    height: 54px;
    justify-content: center;
    align-items: center;
    gap: 8px;

    border-radius: 8px;
    border: 2px solid rgb(var(--color-swan));
    border-bottom: 4px solid rgb(var(--color-swan));
    background: rgb(var(--color-snow));

    cursor: pointer;
    transition: .1s;
}

.DuolingoProSettingsBoxCancelButton:hover {
    filter: brightness(0.95);
}

.DuolingoProSettingsBoxCancelButton:active {
    filter: brightness(0.9);

    margin-top: 2px;
    height: 52px;
    border-bottom: 2px solid rgb(var(--color-swan));
}

.DuolingoProSettingsBoxCancelButtonTextOne {
    color: rgb(var(--color-eel));
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    margin: 0px;

    user-select: none; // chrome and Opera
    -moz-user-select: none; // Firefox
    -webkit-text-select: none; // IOS Safari
    -webkit-user-select: none; // Safari
}

.DuolingoProSettingsBoxSaveButton {
    display: flex;
    height: 54px;
    padding: 0px 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    flex: 1 0 0;

    border-radius: 8px;
    border: 2px solid rgba(0, 0, 0, 0.20);
    border-bottom: 4px solid rgba(0, 0, 0, 0.20);
    background: #007AFF;

    cursor: pointer;
    transition: .1s;
}

.DuolingoProSettingsBoxSaveButton:hover {
    filter: brightness(0.95);
}

.DuolingoProSettingsBoxSaveButton:active {
    filter: brightness(0.9);

    margin-top: 2px;
    height: 52px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.20);
}

.DuolingoProSettingsBoxSaveButtonTextOne {
    color: #FFF;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    margin: 0px;

    user-select: none; // chrome and Opera
    -moz-user-select: none; // Firefox
    -webkit-text-select: none; // IOS Safari
    -webkit-user-select: none; // Safari
}
`;

let injectedDuolingoProSettingsBoxElement = null;
let injectedDuolingoProSettingsBoxStyle = null;

function injectDuolingoProSettingsBox() {
    //console.log('injectDuolingoProSettingsBox called');
    if (wasDuolingoProSettingsButtonOnePressed === true) {
        // Inject the content if it's not already injected
        if (!injectedDuolingoProSettingsBoxElement) {
            // Creating a container for the overlay
            injectedDuolingoProSettingsBoxElement = document.createElement('div');
            injectedDuolingoProSettingsBoxElement.innerHTML = DuolingoProSettingsBoxHTML;
            document.body.appendChild(injectedDuolingoProSettingsBoxElement);

            // Creating a style tag for CSS
            injectedDuolingoProSettingsBoxStyle = document.createElement('style');
            injectedDuolingoProSettingsBoxStyle.type = 'text/css';
            injectedDuolingoProSettingsBoxStyle.innerHTML = DuolingoProSettingsBoxCSS;
            document.head.appendChild(injectedDuolingoProSettingsBoxStyle);

            const DuolingoProSettingsBoxCancelButton = document.querySelector('.DuolingoProSettingsBoxCancelButton');
            DuolingoProSettingsBoxCancelButton.addEventListener('click', () => {
                wasDuolingoProSettingsButtonOnePressed = false;

                AutoSolverSettingsShowAutoSolverBox = JSON.parse(localStorage.getItem('AutoSolverSettingsShowAutoSolverBox'));
                AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox = JSON.parse(localStorage.getItem('AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox'));
                AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox = JSON.parse(localStorage.getItem('AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox'));
                AutoSolverSettingsLowPerformanceMode = JSON.parse(localStorage.getItem('AutoSolverSettingsLowPerformanceMode'));
            });

            const DuolingoProSettingsBoxSaveButton = document.querySelector('.DuolingoProSettingsBoxSaveButton');
            DuolingoProSettingsBoxSaveButton.addEventListener('click', () => {

                if (JSON.parse(localStorage.getItem('AutoSolverSettingsShowAutoSolverBox')) !== AutoSolverSettingsShowAutoSolverBox) {
                    settingsStuff("Duolingo Pro AutoSolver Box", AutoSolverSettingsShowAutoSolverBox ? 'ON' : 'OFF');
                }

                if (JSON.parse(localStorage.getItem('AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox')) !== AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox) {
                    settingsStuff("Duolingo Pro Practice Only Mode", AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox ? 'ON' : 'OFF');
                }

                if (JSON.parse(localStorage.getItem('AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox')) !== AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox) {
                    settingsStuff("Duolingo Pro Repeat Lesson Mode", AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox ? 'ON' : 'OFF');
                }

                if (JSON.parse(localStorage.getItem('AutoSolverSettingsLowPerformanceMode')) !== AutoSolverSettingsLowPerformanceMode) {
                    settingsStuff("Duolingo Pro Low Performance Mode", AutoSolverSettingsLowPerformanceMode ? 'ON' : 'OFF');
                }

                if (JSON.parse(localStorage.getItem('DuolingoProSettingsProBlockMode')) !== DuolingoProSettingsProBlockMode) {
                    settingsStuff("Duolingo Pro ProBlock", DuolingoProSettingsProBlockMode ? 'ON' : 'OFF');
                }

                if (JSON.parse(localStorage.getItem('DuolingoProSettingsTurboSolveMode')) !== DuolingoProSettingsTurboSolveMode) {
                    settingsStuff("Duolingo Pro TurboSolve Mode", DuolingoProSettingsTurboSolveMode ? 'ON' : 'OFF');
                }

                if (JSON.parse(localStorage.getItem('DuolingoProSettingsHumaneSolvingMode')) !== DuolingoProSettingsHumaneSolvingMode) {
                    settingsStuff("Duolingo Pro Humane Solving Mode", DuolingoProSettingsHumaneSolvingMode ? 'ON' : 'OFF');
                }

                localStorage.setItem('AutoSolverSettingsShowAutoSolverBox', AutoSolverSettingsShowAutoSolverBox);
                localStorage.setItem('AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox', AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox);
                localStorage.setItem('AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox', AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox);
                localStorage.setItem('AutoSolverSettingsLowPerformanceMode', AutoSolverSettingsLowPerformanceMode);
                localStorage.setItem('DuolingoProSettingsProBlockMode', DuolingoProSettingsProBlockMode);
                localStorage.setItem('DuolingoProSettingsTurboSolveMode', DuolingoProSettingsTurboSolveMode);
                localStorage.setItem('DuolingoProSettingsHumaneSolvingMode', DuolingoProSettingsHumaneSolvingMode);

                if (!AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox) {
                    autoSolverBoxPracticeOnlyMode = false;
                    sessionStorage.setItem('autoSolverBoxPracticeOnlyMode', autoSolverBoxPracticeOnlyMode);
                }

                if (!AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox) {
                    autoSolverBoxPracticeOnlyMode = false;
                    sessionStorage.setItem('autoSolverBoxRepeatLessonMode', autoSolverBoxRepeatLessonMode);
                }

                console.log('Settings saved');

                let DuolingoProSettingsBoxSaveButtonTextElement = DuolingoProSettingsBoxSaveButton.querySelector('.DuolingoProSettingsBoxSaveButtonTextOne');
                DuolingoProSettingsBoxSaveButtonTextElement.textContent = 'SAVED';

                setTimeout(function() {
                    //wasDuolingoProSettingsButtonOnePressed = false;
                    location.reload();
                }, 600);

            });

            const DuolingoProSettingsBoxToggleOneIDElement = document.querySelector('#DuolingoProSettingsBoxToggleOneID');

            DuolingoProSettingsBoxToggleOneIDElement.addEventListener('mousedown', () => {
                if (!AutoSolverSettingsShowAutoSolverBox) {
                    DuolingoProSettingsBoxToggleOneIDElement.style.border = '2px solid rgb(var(--color-swan))';
                    DuolingoProSettingsBoxToggleOneIDElement.style.borderBottom = '2px solid rgb(var(--color-swan))';
                } else {
                    DuolingoProSettingsBoxToggleOneIDElement.style.border = '2px solid rgba(0, 0, 0, 0.20)';
                    DuolingoProSettingsBoxToggleOneIDElement.style.borderBottom = '2px solid rgba(0, 0, 0, 0.20)';
                }
            });

            DuolingoProSettingsBoxToggleOneIDElement.addEventListener('mouseup', () => {
                AutoSolverSettingsShowAutoSolverBox = !AutoSolverSettingsShowAutoSolverBox; // Toggle the variable
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleOneIDElement, AutoSolverSettingsShowAutoSolverBox);
            });

            const DuolingoProSettingsBoxToggleTwoIDElement = document.querySelector('#DuolingoProSettingsBoxToggleTwoID');

            DuolingoProSettingsBoxToggleTwoIDElement.addEventListener('mousedown', () => {
                if (!AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox) {
                    DuolingoProSettingsBoxToggleTwoIDElement.style.border = '2px solid rgb(var(--color-swan))';
                    DuolingoProSettingsBoxToggleTwoIDElement.style.borderBottom = '2px solid rgb(var(--color-swan))';
                } else {
                    DuolingoProSettingsBoxToggleTwoIDElement.style.border = '2px solid rgba(0, 0, 0, 0.20)';
                    DuolingoProSettingsBoxToggleTwoIDElement.style.borderBottom = '2px solid rgba(0, 0, 0, 0.20)';
                }
            });

            DuolingoProSettingsBoxToggleTwoIDElement.addEventListener('mouseup', () => {
                AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox = !AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox; // Toggle the variable
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleTwoIDElement, AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox);
            });

            const DuolingoProSettingsBoxToggleThreeIDElement = document.querySelector('#DuolingoProSettingsBoxToggleThreeID');

            DuolingoProSettingsBoxToggleThreeIDElement.addEventListener('mousedown', () => {
                if (!AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox) {
                    DuolingoProSettingsBoxToggleThreeIDElement.style.border = '2px solid rgb(var(--color-swan))';
                    DuolingoProSettingsBoxToggleThreeIDElement.style.borderBottom = '2px solid rgb(var(--color-swan))';
                } else {
                    DuolingoProSettingsBoxToggleThreeIDElement.style.border = '2px solid rgba(0, 0, 0, 0.20)';
                    DuolingoProSettingsBoxToggleThreeIDElement.style.borderBottom = '2px solid rgba(0, 0, 0, 0.20)';
                }
            });

            DuolingoProSettingsBoxToggleThreeIDElement.addEventListener('mouseup', () => {
                AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox = !AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox; // Toggle the variable
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleThreeIDElement, AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox);
            });

            const DuolingoProSettingsBoxToggleFourIDElement = document.querySelector('#DuolingoProSettingsBoxToggleFourID');

            DuolingoProSettingsBoxToggleFourIDElement.addEventListener('mousedown', () => {
                if (!AutoSolverSettingsLowPerformanceMode) {
                    DuolingoProSettingsBoxToggleFourIDElement.style.border = '2px solid rgb(var(--color-swan))';
                    DuolingoProSettingsBoxToggleFourIDElement.style.borderBottom = '2px solid rgb(var(--color-swan))';
                } else {
                    DuolingoProSettingsBoxToggleFourIDElement.style.border = '2px solid rgba(0, 0, 0, 0.20)';
                    DuolingoProSettingsBoxToggleFourIDElement.style.borderBottom = '2px solid rgba(0, 0, 0, 0.20)';
                }
            });

            DuolingoProSettingsBoxToggleFourIDElement.addEventListener('mouseup', () => {
                AutoSolverSettingsLowPerformanceMode = !AutoSolverSettingsLowPerformanceMode; // Toggle the variable
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleFourIDElement, AutoSolverSettingsLowPerformanceMode);
            });

            const DuolingoProSettingsBoxToggleFiveIDElement = document.querySelector('#DuolingoProSettingsBoxToggleFiveID');

            DuolingoProSettingsBoxToggleFiveIDElement.addEventListener('mousedown', () => {
                if (!DuolingoProSettingsProBlockMode) {
                    DuolingoProSettingsBoxToggleFiveIDElement.style.border = '2px solid rgb(var(--color-swan))';
                    DuolingoProSettingsBoxToggleFiveIDElement.style.borderBottom = '2px solid rgb(var(--color-swan))';
                } else {
                    DuolingoProSettingsBoxToggleFiveIDElement.style.border = '2px solid rgba(0, 0, 0, 0.20)';
                    DuolingoProSettingsBoxToggleFiveIDElement.style.borderBottom = '2px solid rgba(0, 0, 0, 0.20)';
                }
            });

            DuolingoProSettingsBoxToggleFiveIDElement.addEventListener('mouseup', () => {
                DuolingoProSettingsProBlockMode = !DuolingoProSettingsProBlockMode; // Toggle the variable
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleFiveIDElement, DuolingoProSettingsProBlockMode);
            });

            const DuolingoProSettingsBoxToggleSixIDElement = document.querySelector('#DuolingoProSettingsBoxToggleSixID');

            DuolingoProSettingsBoxToggleSixIDElement.addEventListener('mousedown', () => {
                if (!DuolingoProSettingsTurboSolveMode) {
                    DuolingoProSettingsBoxToggleSixIDElement.style.border = '2px solid rgb(var(--color-swan))';
                    DuolingoProSettingsBoxToggleSixIDElement.style.borderBottom = '2px solid rgb(var(--color-swan))';
                } else {
                    DuolingoProSettingsBoxToggleSixIDElement.style.border = '2px solid rgba(0, 0, 0, 0.20)';
                    DuolingoProSettingsBoxToggleSixIDElement.style.borderBottom = '2px solid rgba(0, 0, 0, 0.20)';
                }
            });

            DuolingoProSettingsBoxToggleSixIDElement.addEventListener('mouseup', () => {
                DuolingoProSettingsTurboSolveMode = !DuolingoProSettingsTurboSolveMode; // Toggle the variable
                if (DuolingoProSettingsTurboSolveMode && DuolingoProSettingsHumaneSolvingMode) {
                    DuolingoProSettingsHumaneSolvingMode = false;
                }

                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleSixIDElement, DuolingoProSettingsTurboSolveMode);
            });

            const DuolingoProSettingsBoxToggleSevenIDElement = document.querySelector('#DuolingoProSettingsBoxToggleSevenID');

            DuolingoProSettingsBoxToggleSevenIDElement.addEventListener('mousedown', () => {
                if (!DuolingoProSettingsHumaneSolvingMode) {
                    DuolingoProSettingsBoxToggleSevenIDElement.style.border = '2px solid rgb(var(--color-swan))';
                    DuolingoProSettingsBoxToggleSevenIDElement.style.borderBottom = '2px solid rgb(var(--color-swan))';
                } else {
                    DuolingoProSettingsBoxToggleSevenIDElement.style.border = '2px solid rgba(0, 0, 0, 0.20)';
                    DuolingoProSettingsBoxToggleSevenIDElement.style.borderBottom = '2px solid rgba(0, 0, 0, 0.20)';
                }
            });

            DuolingoProSettingsBoxToggleSevenIDElement.addEventListener('mouseup', () => {
                DuolingoProSettingsHumaneSolvingMode = !DuolingoProSettingsHumaneSolvingMode; // Toggle the variable
                if (DuolingoProSettingsHumaneSolvingMode && DuolingoProSettingsTurboSolveMode) {
                    DuolingoProSettingsTurboSolveMode = false;
                }

                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleSevenIDElement, DuolingoProSettingsHumaneSolvingMode);
            });

            addEventListener('mouseup', () => {
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleOneIDElement, AutoSolverSettingsShowAutoSolverBox);
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleTwoIDElement, AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox);
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleThreeIDElement, AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox);
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleFourIDElement, AutoSolverSettingsLowPerformanceMode);
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleFiveIDElement, DuolingoProSettingsProBlockMode);
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleSixIDElement, DuolingoProSettingsTurboSolveMode);
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleSevenIDElement, DuolingoProSettingsHumaneSolvingMode);
            });

            updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleOneIDElement, AutoSolverSettingsShowAutoSolverBox);
            updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleTwoIDElement, AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox);
            updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleThreeIDElement, AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox);
            updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleFourIDElement, AutoSolverSettingsLowPerformanceMode);
            updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleFiveIDElement, DuolingoProSettingsProBlockMode);
            updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleSixIDElement, DuolingoProSettingsTurboSolveMode);
            updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleSevenIDElement, DuolingoProSettingsHumaneSolvingMode);

        }
    } else {
        // Remove the content if it was previously injected
        if (injectedDuolingoProSettingsBoxElement) {
            document.body.removeChild(injectedDuolingoProSettingsBoxElement);
            document.head.removeChild(injectedDuolingoProSettingsBoxStyle);
            injectedDuolingoProSettingsBoxElement = null;
            injectedDuolingoProSettingsBoxStyle = null;
        }
    }
}

setInterval(injectDuolingoProSettingsBox, 100);

function updateDuolingoProSettingsToggle(element, value) {
    let textElement = element.querySelector('.DuolingoProSettingsBoxToggleTypeOneTextOne');
    if (element.id === 'DuolingoProSettingsBoxToggleThreeID') {
        textElement.textContent = value ? "LESSON 1" : "OFF";
    } else {
        textElement.textContent = value ? "ON" : "OFF";
    }
    if (value) {
        element.style.background = '#007AFF';
        element.style.border = '2px solid rgba(0, 0, 0, 0.20)';
        element.style.borderBottom = '4px solid rgba(0, 0, 0, 0.20)';
        textElement.style.color = '#fff';
    } else {
        element.style.background = 'rgb(var(--color-snow))';
        element.style.border = '2px solid rgb(var(--color-swan))';
        element.style.borderBottom = '4px solid rgb(var(--color-swan))';
        textElement.style.color = 'rgb(var(--color-eel))';
    }
}


function iwantstolol() {
    try {
        let nextButtonButton = document.querySelector('[data-test="story-start"]');
        if (nextButtonButton) {
            nextButtonButton.click();
        }
    } catch (error) {
    }
}

setInterval(iwantstolol, 500);

let duolingoProCurrentVersion = "2.0 BETA 6";
if (String(localStorage.getItem('duolingoProLastInstalledVersion')) === null || String(localStorage.getItem('duolingoProLastInstalledVersion')) === "null") {
    setTimeout(function() {
        updateStuff("Downloaded Version", duolingoProCurrentVersion);
    }, 2000);
    setTimeout(function() {
        localStorage.setItem('duolingoProLastInstalledVersion', duolingoProCurrentVersion);
    }, 3000);
} else if (String(localStorage.getItem('duolingoProLastInstalledVersion')) !== duolingoProCurrentVersion) {
    setTimeout(function() {
        updateStuff("Updated Version", duolingoProCurrentVersion, String(localStorage.getItem('duolingoProLastInstalledVersion')));
    }, 2000);
    setTimeout(function() {
        localStorage.setItem('duolingoProLastInstalledVersion', duolingoProCurrentVersion);
    }, 3000);
}

let screenWidth = screen.width;

function BegMobileSupport() {
    try {
        screenWidth = screen.width;
        if (Number(localStorage.getItem('screenWidthDuolingoPro')) === null || isNaN(Number(localStorage.getItem('screenWidthDuolingoPro'))) || Number(localStorage.getItem('screenWidthDuolingoPro')) === 0) {
            setTimeout(function() {
                settingsStuff("Screen Width Set To", String(screenWidth));
            }, 2000);
            setTimeout(function() {
                localStorage.setItem('screenWidthDuolingoPro', screenWidth);
            }, 3000);
            setTimeout(function() {
                BegMobileSupport();
            }, 4000);
        } else if (Number(localStorage.getItem('screenWidthDuolingoPro')) !== screenWidth) {
            setTimeout(function() {
                settingsStuff("Screen Width Change To", String(screenWidth) + " from " + localStorage.getItem('screenWidthDuolingoPro'));
            }, 2000);
            setTimeout(function() {
                localStorage.setItem('screenWidthDuolingoPro', screenWidth);
            }, 3000);
            setTimeout(function() {
                BegMobileSupport();
            }, 4000);
        } else {
            setTimeout(function() {
                BegMobileSupport();
            }, 1000);
        }
    } catch (error) {
    }
}

BegMobileSupport();

function MidMobileSupport() {
    try {
        screenWidth = screen.width;
        const boxFirst = document.querySelector('.boxFirst');

        if (screenWidth < 700) {
            boxFirst.style.marginBottom = '64px';
        } else {
            boxFirst.style.marginBottom = '';
        }
    } catch (error) {
    }
}

setInterval(MidMobileSupport, 1000);




let injectedSimplifiedUICSS = null;

async function solving(forceState) {
    if (isAutoMode == false || forceState == true) {
        let solveAllButton = await waitForElm("#solveAllButton");
        solveAllButton.innerText = "PAUSE SOLVE";
        isAutoMode = true;

        let delayTime;
        if (DuolingoProSettingsTurboSolveMode) {
            delayTime = 150;

            injectedSimplifiedUICSS = document.createElement('style');
            injectedSimplifiedUICSS.type = 'text/css';
            injectedSimplifiedUICSS.innerHTML = simplifiedUICSS;
            document.head.appendChild(injectedSimplifiedUICSS);

        } else if (simulated == true) {
            delayTime = 150;
        } else {
            delayTime = 500;
        }

        let solveLoop = async () => {
            if (isAutoMode == true && isSolving == false) {
                isSolving = true;
                document.getElementById("solveAllButton") ? document.getElementById("solveAllButton").innerText = "PAUSE SOLVE": undefined;
                await solve();
                await sleep(delayTime, 0, 0);
                isSolving = false;
                solveLoop();
            }
        }
        solveLoop(); // initiate the loop
    } else {
        document.getElementById("solveAllButton").innerText = "SOLVE ALL";
        isAutoMode = false;
    }
}

async function solve() {
    const selAgain = document.querySelectorAll('[data-test="player-practice-again"]');
    const practiceAgain = document.querySelector('[data-test="player-practice-again"]');
    if (selAgain.length === 1 && isAutoMode) {
        // Make sure it's the `practice again` button
        //if (selAgain[0].innerHTML.toLowerCase() === 'practice again') {
        // Click the `practice again` button
        if (simulated == true) await sleep(50, 50);
        selAgain[0].click();
        // Terminate
        return;
        //}
    }
    if (practiceAgain !== null && isAutoMode) {
        if (!AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox) {
            practiceAgain.click();
            return;
        }
    }
    try {
        window.sol = findReact(document.getElementsByClassName('_3FiYg')[0]).props.currentChallenge;
    } catch {
        let next = document.querySelector('[data-test="player-next"]');
        if (next) {
            next.click();
        }
        return;
    }
    if (!window.sol) {
        return;
    }

    let nextButton = document.querySelector('[data-test="player-next"]');
    if (!nextButton) {
        return;
    }

    nextButton.click(); // skips motivational messages
    if (nextButton.getAttribute('aria-disabled') === 'true') {
        if (simulated == true) await sleep(300, 300, 200); // time to read the question

        if (document.querySelectorAll('[data-test*="challenge-speak"]').length > 0) {
            if (debug) {
                document.getElementById("solveAllButton").innerText = 'Challenge Speak';
            }
            waitForElm('button[data-test="player-skip"]').then((skip) => {
                skip.click();
            });
        } else if (window.sol.type === 'listenMatch') {
            // listen match question
            if (debug) {
                document.getElementById("solveAllButton").innerText = 'Listen Match';
            }
            waitForElm('button[data-test="player-skip"]').then((skip) => {
                skip.click();
            });
        } else if (document.querySelectorAll('[data-test="challenge-choice"]').length > 0) {
            // choice challenge
            if (debug) {
                document.getElementById("solveAllButton").innerText = 'Challenge Choice';
            }
            // text input (if one exists)
            if (document.querySelectorAll('[data-test="challenge-text-input"]').length > 0) {
                if (debug) {
                    document.getElementById("solveAllButton").innerText = 'Challenge Choice with Text Input';
                }
                try {
                    window.sol = findReact(document.getElementsByClassName('_3FiYg')[0]).props.currentChallenge;
                }
                catch { return }
                let elm = document.querySelectorAll('[data-test="challenge-text-input"]')[0];
                elm?.click();
                let answer = window.sol.correctSolutions ? window.sol.correctSolutions[0].split(/(?<=^\S+)\s/)[1] : (window.sol.displayTokens ? window.sol.displayTokens.find(t => t.isBlank).text : window.sol.prompt);
                if (!answer) return;

                if (simulated == true) await sleep(answer.length*100, 100);
                let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeInputValueSetter.call(elm, simplifyString(answer));
                let inputEvent = new Event('input', {
                    bubbles: true
                });

                elm.dispatchEvent(inputEvent);
            }
            // choice
            if (window.sol.correctTokens !== undefined) {
                await correctTokensRun();
            } else if (window.sol.correctIndex !== undefined) {
                document.querySelectorAll('[data-test="challenge-choice"]')[window.sol.correctIndex].click();
            } else if (window.sol.correctSolutions !== undefined) {
                var xpath = `//div[@data-test="challenge-choice" and ./div[@data-test="challenge-judge-text"]/text()="${window.sol.correctSolutions[0].split(/(?<=^\S+)\s/)[0]}"]`;
                document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.click();
            }
        } else if (document.querySelectorAll('[data-test$="challenge-tap-token"]').length > 0) {
            // match correct pairs challenge
            if (window.sol.pairs !== undefined) {
                if (debug) {
                    document.getElementById("solveAllButton").innerText = 'Pairs';
                }
                await correctPairsRun();
            } else if (window.sol.correctTokens !== undefined) {
                if (debug) {
                    document.getElementById("solveAllButton").innerText = 'Token Run';
                }
                await correctTokensRun();
            } else if (window.sol.correctIndices !== undefined) {
                if (debug) {
                    document.getElementById("solveAllButton").innerText = 'Indices Run';
                }
                await correctIndicesRun();
            }
        } else if (document.querySelectorAll('[data-test="challenge-tap-token-text"]').length > 0) {
            if (debug) {
                document.getElementById("solveAllButton").innerText = 'Challenge Tap Token Text';
            }
            // fill the gap challenge
            await correctIndicesRun();
        } else if (document.querySelectorAll('[data-test="challenge-text-input"]').length > 0) {
            if (debug) {
                document.getElementById("solveAllButton").innerText = 'Challenge Text Input';
            }
            try {
                window.sol = findReact(document.getElementsByClassName('_3FiYg')[0]).props.currentChallenge;
            }
            catch { return }
            let elm = document.querySelectorAll('[data-test="challenge-text-input"]')[0];
            elm?.click();
            let answer = window.sol.correctSolutions ? window.sol.correctSolutions[0] : (window.sol.displayTokens ? window.sol.displayTokens.find(t => t.isBlank).text : window.sol.prompt);
            if (!answer) return;

            if (simulated == true) await sleep(answer.length*100, 100);
            let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(elm, simplifyString(answer));
            let inputEvent = new Event('input', {
                bubbles: true
            });

            elm.dispatchEvent(inputEvent);
        } else if (document.querySelectorAll('[data-test*="challenge-partialReverseTranslate"]').length > 0) {
            if (debug) {
                document.getElementById("solveAllButton").innerText = 'Partial Reverse';
            }
            try {
                window.sol = findReact(document.getElementsByClassName('_3FiYg')[0]).props.currentChallenge;
            }
            catch { return }
            let elm = document.querySelector('[data-test*="challenge-partialReverseTranslate"]')?.querySelector("span[contenteditable]");
            elm?.click();
            let answer = window.sol?.displayTokens?.filter(t => t.isBlank)?.map(t => t.text)?.join()?.replaceAll(',', '');
            if (!answer) return;

            if (simulated == true) await sleep(answer.length*100, 100);
            let nativeInputNodeTextSetter = Object.getOwnPropertyDescriptor(Node.prototype, "textContent").set;
            nativeInputNodeTextSetter.call(elm, simplifyString(answer));
            let inputEvent = new Event('input', {
                bubbles: true
            });

            elm.dispatchEvent(inputEvent);
        } else if (document.querySelectorAll('textarea[data-test="challenge-translate-input"]').length > 0) {
            if (debug) {
                document.getElementById("solveAllButton").innerText = 'Challenge Translate Input';
            }
            try {
                window.sol = findReact(document.getElementsByClassName('_3FiYg')[0]).props.currentChallenge;
            }
            catch { return }
            const elm = document.querySelector('textarea[data-test="challenge-translate-input"]');
            elm?.click();
            let answer = window.sol.correctSolutions ? window.sol.correctSolutions[0] : window.sol.prompt;
            if (!answer) return;

            if (simulated == true) await sleep(answer.length*100, 100);
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeInputValueSetter.call(elm, simplifyString(answer));

            let inputEvent = new Event('input', {
                bubbles: true
            });

            elm.dispatchEvent(inputEvent);
        }
        await nextButtonClick();
        anonymousSolveDetails('1');
        await nextButtonClick();
    }
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector) && (document.querySelector(selector).getAttribute('aria-disabled') !== 'true')) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector) && (document.querySelector(selector).getAttribute('aria-disabled') !== 'true')) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}


function simplifyString(str) {
    return str.replace(/[\p{P}$+<=>^`|~]/gu, '').replace(/\s{2,}/g, ' ').toLowerCase();
}

function sleepNormal(ms, tolerance = 0) {
    /** Sleeps for a random amount of time sampled from a non-uniform distribution within range [ms, ms + tolerance]. */
    let sleepTime = ms + tolerance * (Math.random() + Math.random() + Math.random())/3; // simulates normal distribution
    return new Promise(resolve => setTimeout(resolve, sleepTime));
}

async function sleepInverseCDF(msRange) {
    /**
     * Uses the inverse CDF method to determine the random amount of time to sleep from 0 to ~msRange,
     * with outlying values spanning up to 10*msRange.
     *
     * This method is intended to create outliers.
     */
    let u = 1;
    while(u > 0.9999999999) u = Math.random(); // limit output range to 10*msRange

    let sleepTime = -1*Math.log10(1 - u) // x = –log(1–u)
    sleepTime *= msRange; // map to range
    await sleepNormal(sleepTime);
}


// General-use sleep functions
async function sleep(ms, tolerance = 0, msRange = 10) {
    /** The most sophisticated version of sleep for general use. */
    await sleepNormal(ms, tolerance);
    await sleepInverseCDF(msRange);
    await sleepProbability(0, 2000, 0.005); // add a bit of texture
}

async function sleepProbability(ms, tolerance = 0, probability = 0.05) {
    /** Has a probability to sleep for ms milliseconds. */
    if (Math.random() < probability) {
        await sleep(ms, tolerance);
    }
}


function until(conditionFunction) {
    /**
     * Utility function to resolve a promise when condition is fulfilled.
     * Usage: await until(_ => condition == true);
     */
    const poll = resolve => {
        if(conditionFunction()) resolve();
        else setTimeout(_ => poll(resolve), 150); // callback interval
    }

    return new Promise(poll);
}

async function nextButtonClick() {
    return Promise.race([
        new Promise(async (resolve) => {
            let next = await waitForElm('[data-test="player-next"]');
            await until(_ => isTokenRunning == false);
            if (!DuolingoProSettingsTurboSolveMode) await sleep(100, 50);
            next.click();
            resolve();
        }),
        new Promise(async (resolve) => {
            setTimeout(() => resolve(), 700); // Maximum wait time until the "next" button shows up
        })
    ]);
}


async function correctTokensRun() {
    isTokenRunning = true;
    const all_tokens = document.querySelectorAll('[data-test$="challenge-tap-token"]');
    const correct_tokens = window.sol.correctTokens;
    const clicked_tokens = [];
    for (const correct_token of correct_tokens) {
        const matching_elements = Array.from(all_tokens).filter(element => element.textContent.trim() === correct_token.trim());
        if (simulated == true) {
            await sleepProbability(200, 500, 0.1); // has a small chance to stay idle for a while
            await sleepProbability(0, 200, 0.3);
            await sleep(50, 100, 200);
        }
        if (matching_elements.length > 0) {
            const match_index = clicked_tokens.filter(token => token.textContent.trim() === correct_token.trim()).length;
            if (match_index < matching_elements.length) {
                matching_elements[match_index].click();
                clicked_tokens.push(matching_elements[match_index]);
            } else {
                clicked_tokens.push(matching_elements[0]);
            }
        }
    };
    isTokenRunning = false;
}

async function correctIndicesRun() {
    isTokenRunning = true;
    if (window.sol.correctIndices) {
        for (const index of window.sol.correctIndices) {
            if (simulated == true) await sleep(50, 100);
            document.querySelectorAll('div[data-test="word-bank"] [data-test="challenge-tap-token-text"]')[index].click();
        };
        // nextButtonClick();
    }
    isTokenRunning = false;
}

async function correctPairsRun() {
    isTokenRunning = true;
    let nl = document.querySelectorAll('button[data-test*="challenge-tap-token"]');
    if (document.querySelectorAll('[data-test*="challenge-tap-token-text"]').length === nl.length) {
        for (const pair of window.sol.pairs) {
            for (let i = 0; i < nl.length; i++) {
                if (simulated == true) {
                    await sleep(50, 20, 50);
                }
                const nlInnerText = nl[i].querySelector('[data-test="challenge-tap-token-text"]').innerText.toLowerCase().trim();
                try {
                    if (
                        (
                            nlInnerText === pair.transliteration.toLowerCase().trim() ||
                            nlInnerText === pair.character.toLowerCase().trim()
                        )
                        && !nl[i].disabled
                    ) {
                        nl[i].click()
                    }
                } catch (TypeError) {
                    if (
                        (
                            nlInnerText === pair.learningToken.toLowerCase().trim() ||
                            nlInnerText === pair.fromToken.toLowerCase().trim()
                        )
                        && !nl[i].disabled
                    ) {
                        nl[i].click()
                    }
                }
            }
        }
    }
    isTokenRunning = false;
}

function findSubReact(dom, traverseUp = 0) {
    const key = Object.keys(dom).find(key => key.startsWith("__reactProps$"));
    return dom.parentElement[key].children.props;
}

function findReact(dom, traverseUp = 0) {
    let reactProps = Object.keys(dom.parentElement).find((key) => key.startsWith("__reactProps$"));
    while (traverseUp-- > 0 && dom.parentElement) {
        dom = dom.parentElement;
        reactProps = Object.keys(dom.parentElement).find((key) => key.startsWith("__reactProps$"));
    }
    if(dom?.parentElement?.[reactProps]?.children[0] == null){
        return dom?.parentElement?.[reactProps]?.children[1]?._owner?.stateNode;
    } else {
        return dom?.parentElement?.[reactProps]?.children[0]?._owner?.stateNode;
    }
    //return dom?.parentElement?.[reactProps]?.children[0]?._owner?.stateNode;
}

window.findReact = findReact;

window.ss = solving;


const SUPABASE_URL = 'https://henexdxgboppadgsxegm.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlbmV4ZHhnYm9wcGFkZ3N4ZWdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ5MDI0ODEsImV4cCI6MjAxMDQ3ODQ4MX0.k3Y9mjNaw_SKrHfWr9dA7PkWCOl_i2zEUjo77OxNH68';

const supabase = window.supabase.createClient(SUPABASE_URL, ANON_KEY);

async function settingsStuff(messageValue, value) {
    console.log("settingsStuff called");
    // Add a breakpoint here.
//    debugger;

//    const messageText = document.getElementById('messageInput').value;

//    , timestamptz: new Date().toISOString().substr(0, 19)

    if (messageValue) {
        const { data, error } = await supabase
        .from('settings_stuff')
        .insert([{ text: messageValue, value: value, randomValue: randomValue, duolingo_pro_version: duolingoProCurrentVersion }]);

        if (error) {
            console.error("Error sending message:", error);
        } else {
            console.log("Message sent successfully:", data);
        }
    } else {
        console.error("Message text is empty.");
    }
}

async function sendFeedbackNew(feedbackTextOne, feedbackTypeOne) {
    console.log("sendFeedbackNew called");
    // Add a breakpoint here.
//    debugger;

//    const messageText = document.getElementById('messageInput').value;

//    , timestamptz: new Date().toISOString().substr(0, 19)

    if (feedbackTextOne) {
        const { data, error } = await supabase
        .from('send_feedback')
        .insert([{ feedback_text: feedbackTextOne, feedback_type: feedbackTypeOne, randomValue: randomValue, duolingo_pro_version: duolingoProCurrentVersion }]);

        if (error) {
            console.error("Error sending message:", error);
            sendFeedbackStatus = 'error';
        } else {
            console.log("Message sent successfully:", data);
            sendFeedbackStatus = 'true';
        }
    } else {
        console.error("Message text is empty.");
        sendFeedbackStatus = 'empty';
    }
}

async function analyticsLogsSend(text, value) {
    console.log("analyticsLogsSend called");
    // Add a breakpoint here.
//    debugger;

//    const messageText = document.getElementById('messageInput').value;

//    , timestamptz: new Date().toISOString().substr(0, 19)

    if (text) {
        const { data, error } = await supabase
        .from('analytics_logs')
        .insert([{ text: text, value: value, randomValue: randomValue, duolingo_pro_version: duolingoProCurrentVersion }]);

        if (error) {
            console.error("Error sending message:", error);
        } else {
            console.log("Message sent successfully:", data);
        }
    } else {
        console.error("Message text is empty.");
    }
}

async function anonymousSolveDetails(value) {
    console.log("anonymousSolveDetails called");
    // Add a breakpoint here.
//    debugger;

//    const messageText = document.getElementById('messageInput').value;

//    , timestamptz: new Date().toISOString().substr(0, 19)

    if (value) {
        const { data, error } = await supabase
        .from('solve_details')
        .insert([{ value: value, duolingo_pro_version: duolingoProCurrentVersion }]);

        if (error) {
            console.error("Error sending message:", error);
        } else {
            console.log("Message sent successfully:", data);
        }
    } else {
        console.error("Message text is empty.");
    }
}

async function updateStuff(status, to, from) {
    if (status) {
        const { data, error } = await supabase
        .from('update_stuff')
        .insert([{ status: status, to: to, from: from, randomValue: randomValue }]);

        if (error) {
            console.error("Error sending message:", error);
        } else {
            console.log("Message sent successfully:", data);
        }
    } else {
        console.error("Message text is empty.");
    }
}
