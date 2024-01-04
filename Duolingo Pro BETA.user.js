// ==UserScript==
// @name         Duolingo Pro BETA
// @namespace    Violentmonkey Scripts
// @version      2.0BETA9.2
// @description  Duolingo Auto Solver Tool - WORKING DECEMBER 2023
// @author       anonymoushackerIV
// @match        https://*.duolingo.com/*
// @grant        none
// @license      MIT
// @require      https://unpkg.com/@supabase/supabase-js@2.12.1
// @downloadURL https://update.greasyfork.org/scripts/473310/Duolingo%20Pro%20BETA.user.js
// @updateURL https://update.greasyfork.org/scripts/473310/Duolingo%20Pro%20BETA.meta.js
// ==/UserScript==

let solvingIntervalId;
let isAutoMode = false;
let isSolving = false;
let isTokenRunning = false;

const debug = false;

let duolingoProCurrentVersionShort = "2.0B9.2";
let duolingoProCurrentVersion = "2.0 BETA 9.2";

let simulated;
if (JSON.parse(localStorage.getItem('DuolingoProSettingsHumaneSolvingMode')) === null) {
    simulated = false;
} else {
    simulated = JSON.parse(localStorage.getItem('DuolingoProSettingsHumaneSolvingMode'));
}

let isSendFeedbackButtonPressed = false;

let autoSolverBoxRepeatAmount = 0;
autoSolverBoxRepeatAmount = Number(sessionStorage.getItem('autoSolverBoxRepeatAmount'));

let DuolingoProAmountOfQuestionsEverSolved = 0;
DuolingoProAmountOfQuestionsEverSolved = Number(localStorage.getItem('DuolingoProAmountOfQuestionsEverSolved'));

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

let wasDuolingoProJustSolveThisLessonButtonOnePressed = false;
if (JSON.parse(sessionStorage.getItem('wasDuolingoProJustSolveThisLessonButtonOnePressed')) === null) {
    wasDuolingoProJustSolveThisLessonButtonOnePressed = false;
} else {
    wasDuolingoProJustSolveThisLessonButtonOnePressed = JSON.parse(sessionStorage.getItem('wasDuolingoProJustSolveThisLessonButtonOnePressed'));
}

// Whats New Variables Start
try {
localStorage.removeItem('wasWhatsNewInTwoPointZeroBetaThreeFinished');

localStorage.removeItem('wasWhatsNewInTwoPointZeroBetaFourFinished');
} catch (error) {
}

let wasWhatsNewInTwoPointZeroBetaSixFinished = false;
if (JSON.parse(localStorage.getItem('wasWhatsNewInTwoPointZeroBetaSixFinished')) === null) {
    wasWhatsNewInTwoPointZeroBetaSixFinished = false;
} else {
    wasWhatsNewInTwoPointZeroBetaSixFinished = JSON.parse(localStorage.getItem('wasWhatsNewInTwoPointZeroBetaSixFinished'));
}

let wasWhatsNewInTwoPointZeroBetaSevenFinished = false;
if (JSON.parse(localStorage.getItem('wasWhatsNewInTwoPointZeroBetaSevenFinished')) === null) {
    wasWhatsNewInTwoPointZeroBetaSevenFinished = false;
} else {
    wasWhatsNewInTwoPointZeroBetaSevenFinished = JSON.parse(localStorage.getItem('wasWhatsNewInTwoPointZeroBetaSevenFinished'));
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

let DuolingoProSettingsHumaneSolvingMode = true;
if (JSON.parse(localStorage.getItem('DuolingoProSettingsHumaneSolvingMode')) === null) {
    DuolingoProSettingsHumaneSolvingMode = true; // default
} else {
    DuolingoProSettingsHumaneSolvingMode = JSON.parse(localStorage.getItem('DuolingoProSettingsHumaneSolvingMode'));
}

let DuolingoProSettingsNeverEndMode = false;
if (JSON.parse(localStorage.getItem('DuolingoProSettingsNeverEndMode')) === null) {
    DuolingoProSettingsNeverEndMode = false; // default
} else {
    DuolingoProSettingsNeverEndMode = JSON.parse(localStorage.getItem('DuolingoProSettingsNeverEndMode'));
}

let DuolingoProShadeLessonsMode = true;
if (JSON.parse(localStorage.getItem('DuolingoProShadeLessonsMode')) === null) {
    DuolingoProShadeLessonsMode = true; // default
} else {
    DuolingoProShadeLessonsMode = JSON.parse(localStorage.getItem('DuolingoProShadeLessonsMode'));
}

let DuolingoProAntiStuckProtectionMode = true;
if (JSON.parse(localStorage.getItem('DuolingoProAntiStuckProtectionMode')) === null) {
    DuolingoProAntiStuckProtectionMode = true; // default
} else {
    DuolingoProAntiStuckProtectionMode = JSON.parse(localStorage.getItem('DuolingoProAntiStuckProtectionMode'));
}

let DuolingoProSettingsUpdateNotifications = true;
if (JSON.parse(localStorage.getItem('DuolingoProSettingsUpdateNotifications')) === null) {
    DuolingoProSettingsUpdateNotifications = true; // default
} else {
    DuolingoProSettingsUpdateNotifications = JSON.parse(localStorage.getItem('DuolingoProSettingsUpdateNotifications'));
}

let DuolingoProSettingsSolveIntervalValue = true;
if (JSON.parse(localStorage.getItem('DuolingoProSettingsSolveIntervalValue')) === null) {
    DuolingoProSettingsSolveIntervalValue = true; // default
} else {
    DuolingoProSettingsSolveIntervalValue = JSON.parse(localStorage.getItem('DuolingoProSettingsSolveIntervalValue'));
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
    <!--<a href="https://duolingoprowebsite.framer.website" target="_blank" rel="noopener noreferrer">
        <div class="SendFeedbackButtonNewTagOne">NEW</div>
    </a>-->
    <div class="SendFeedbackButtonAndSettingsButtonBox">
        <div class="SendFeedbackButtonOne">
            <p class="SendFeedbackButtonTextOne">SEND FEEDBACK</p>
        </div>
        <div class="DuolingoProSettingsButtonOne">
            <p class="DuolingoProSettingsButtonOneTextOne">SETTINGS</p>
        </div>
    </div>
    <div class="AutoSolverBoxBackground">
        <div class="AutoSolverBoxLayers">
            <div class="AutoSolverBoxAlertSectionOne">

                <div class="AutoSolverBoxAlertOneBox" id="DPSeeAllCurrentIssuesButtonABButtonID" style="background: rgba(255, 59, 48, 0.10); padding: 8px; border-radius: 8px;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 17" width="18" height="18" fill="#FF2D55">
                        <path d="M2.96094 16.0469C1.53125 16.0469 0.59375 14.9688 0.59375 13.6797C0.59375 13.2812 0.695312 12.875 0.914062 12.4922L6.92969 1.97656C7.38281 1.19531 8.17188 0.789062 8.97656 0.789062C9.77344 0.789062 10.5547 1.1875 11.0156 1.97656L17.0312 12.4844C17.25 12.8672 17.3516 13.2812 17.3516 13.6797C17.3516 14.9688 16.4141 16.0469 14.9844 16.0469H2.96094ZM8.98438 10.4609C9.52344 10.4609 9.83594 10.1562 9.86719 9.59375L9.99219 6.22656C10.0234 5.64062 9.59375 5.23438 8.97656 5.23438C8.35156 5.23438 7.92969 5.63281 7.96094 6.22656L8.08594 9.60156C8.10938 10.1562 8.42969 10.4609 8.98438 10.4609ZM8.98438 13.2812C9.60156 13.2812 10.0859 12.8906 10.0859 12.2891C10.0859 11.7031 9.60938 11.3047 8.98438 11.3047C8.35938 11.3047 7.875 11.7031 7.875 12.2891C7.875 12.8906 8.35938 13.2812 8.98438 13.2812Z"/>
                    </svg>
                    <p class="AutoSolverBoxAlertOneBoxTextOne" style="color: #FF4B4B;">See Issues</p>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 15" width="9" height="15" fill="#FF2D55">
                        <path d="M8.57031 7.35938C8.57031 7.74219 8.4375 8.0625 8.10938 8.375L2.20312 14.1641C1.96875 14.3984 1.67969 14.5156 1.33594 14.5156C0.648438 14.5156 0.0859375 13.9609 0.0859375 13.2734C0.0859375 12.9219 0.226562 12.6094 0.484375 12.3516L5.63281 7.35156L0.484375 2.35938C0.226562 2.10938 0.0859375 1.78906 0.0859375 1.44531C0.0859375 0.765625 0.648438 0.203125 1.33594 0.203125C1.67969 0.203125 1.96875 0.320312 2.20312 0.554688L8.10938 6.34375C8.42969 6.64844 8.57031 6.96875 8.57031 7.35938Z"/>
                    </svg>
                </div>

            </div>
            <div class="AutoSolverBoxTitleSectionOne">
                <p class="AutoSolverBoxTitleSectionOneTextOne">AutoSolver</p>
                <div class="AutoSolverBoxTitleSectionOneBETATagOne">
                    <p class="AutoSolverBoxTitleSectionOneBETATagOneTextOne">2.0 BETA 9.2</p>
                </div>
            </div>
            <p class="AutoSolverBoxTitleSectionTwoTextOne">How many lessons would you like to AutoSolve?</p>
            <div class="AutoSolverBoxSectionThreeBox">
                <div class="AutoSolverBoxSectionThreeBoxSectionOne">
                    <button class="AutoSolverBoxRepeatAmountButton activatorThingDPHDJ" id="DPASBadB1" aria-label="Subtract">-</button>
                    <div class="AutoSolverBoxRepeatNumberDisplay">0</div>
                    <button class="AutoSolverBoxRepeatAmountButton activatorThingDPHDJ" id="DPASBauB1" aria-label="Add">+</button>
                    <button class="AutoSolverBoxRepeatAmountButton activatorThingDPHDJ" id="DPASBfmB1" aria-label="Toggle Infinity Mode" style="font-size: 20px;">∞</button>
                </div>
                <div class="AutoSolverBoxSectionThreeBoxSectionTwo" id="AutoSolverBoxSectionThreeBoxSectionTwoIDOne">
                    <div class="AutoSolverBoxSectionThreeBoxSectionTwoTextOne">Practice Only Mode</div>
                    <button class="AutoSolverBoxSectionThreeBoxSectionTwoButton" id="AutoSolverBoxSectionThreeBoxSectionTwoButtonIDOne">ON</button>
                </div>
                <div class="AutoSolverBoxSectionThreeBoxSectionTwo" id="AutoSolverBoxSectionThreeBoxSectionTwoIDTwo">
                    <div class="AutoSolverBoxSectionThreeBoxSectionTwoTextOne">Repeat Lesson Mode</div>
                    <button class="AutoSolverBoxSectionThreeBoxSectionTwoButton" id="AutoSolverBoxSectionThreeBoxSectionTwoButtonIDTwo">ON</button>
                </div>
                <button class="AutoSolverBoxRepeatAmountButton" id="DPASBsB1" style="width: 100%;">START</button>
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
    justify-content: flex-end;
}

.DuolingoProSettingsButtonOne {
    position: relative;
    display: flex;
    height: 48px;
    width: calc(100% - 0px);
    padding: 16px;
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

    user-select: none;
    -moz-user-select: none;
    -webkit-text-select: none;
    -webkit-user-select: none;
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

    user-select: none;
    -moz-user-select: none;
    -webkit-text-select: none;
    -webkit-user-select: none;
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

    color: #FFF;
    font-weight: 700;
    margin: 0px;
    font-size: 12px;

    user-select: none;
    -moz-user-select: none;
    -webkit-text-select: none;
    -webkit-user-select: none;
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
    background: rgb(var(--color-snow), 0.84);
    backdrop-filter: blur(32px);

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
    gap: 8px;
}

.AutoSolverBoxAlertOneBox {
    display: flex;
    align-items: center;
    gap: 8px;
    align-self: stretch;

    cursor: pointer;
    transition: .1s;
}
.AutoSolverBoxAlertOneBox:hover {
    filter: brightness(0.95);
}
.AutoSolverBoxAlertOneBox:active {
    filter: brightness(0.9);
    transform: scale(0.95);
}

.AutoSolverBoxAlertOneBoxTextOne {
    font-weight: 700;
    font-size: 16px;
    flex: 1 0 0;

    margin: 0px;

    user-select: none;
    -moz-user-select: none;
    -webkit-text-select: none;
    -webkit-user-select: none;
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

.AutoSolverBoxRepeatAmountButton {
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

    cursor: pointer;
    transition: all .1s, opacity .2s;

    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}
.AutoSolverBoxRepeatAmountButton:hover {
    filter: brightness(0.95);
}
.AutoSolverBoxRepeatAmountButton:active {
    margin-top: 2px;
    height: 46px;
    filter: brightness(0.9);
}

.AutoSolverBoxRepeatAmountButtonActive {
    border: 2px solid rgba(0, 0, 0, 0.20);
    border-bottom: 4px solid rgba(0, 0, 0, 0.20);
    background: #007AFF;

    color: #FFF;
}
.AutoSolverBoxRepeatAmountButtonActive:hover {
}
.AutoSolverBoxRepeatAmountButtonActive:active {
    border-bottom: 2px solid rgba(0, 0, 0, 0.20);
}

.AutoSolverBoxRepeatAmountButtonDeactive {
    height: 46px;
    margin-top: 2px;

    border: 2px solid rgba(0, 0, 0, 0.20);
    background: #007AFF;

    opacity: 0.5;

    cursor: not-allowed;

    color: #FFF;
}
.AutoSolverBoxRepeatAmountButtonDeactive:hover {
}
.AutoSolverBoxRepeatAmountButtonDeactive:active {
}

.AutoSolverBoxRepeatAmountButtonOff {
    border: 2px solid rgb(var(--color-swan));
    border-bottom: 4px solid rgb(var(--color-swan));
    background: rgb(var(--color-snow));

    color: rgb(var(--color-eel));
}
.AutoSolverBoxRepeatAmountButtonOff:hover {
}
.AutoSolverBoxRepeatAmountButtonOff:active {
    border-bottom: 2px solid rgb(var(--color-swan));
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

    transition: all .2s, font-size .0s;
    z-index: 2;
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
            checkForUpdatesVersion();

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
setInterval(injectContent, 100);

function initializeDuolingoProSystemButtons() {
    const DuolingoProSettingsButtonOne = document.querySelector('.DuolingoProSettingsButtonOne');
    DuolingoProSettingsButtonOne.addEventListener('click', () => {
        wasDuolingoProSettingsButtonOnePressed = true;
    });

    const SendFeedbackButton = document.querySelector('.SendFeedbackButtonOne');
    SendFeedbackButton.addEventListener('click', () => {
        isSendFeedbackButtonPressed = true;
    });

    const SeeCurrentIssuesButton = document.querySelector('#DPSeeAllCurrentIssuesButtonABButtonID');
    SeeCurrentIssuesButton.addEventListener('click', () => {
        CurrentIssuesPopUpFunction(true);
    });
}

function something() {
    let AutoSolverBoxRepeatStartButton = document.querySelector('#DPASBsB1');
    if (autoSolverBoxRepeatAmount > 0 || DuolingoProSettingsNeverEndMode) {
        AutoSolverBoxRepeatStartButton.classList.add('AutoSolverBoxRepeatAmountButtonActive');
        try {
            AutoSolverBoxRepeatStartButton.classList.remove('AutoSolverBoxRepeatAmountButtonDeactive');
        } catch (error) {}
    } else {
        AutoSolverBoxRepeatStartButton.classList.add('AutoSolverBoxRepeatAmountButtonDeactive');
        try {
            AutoSolverBoxRepeatStartButton.classList.remove('AutoSolverBoxRepeatAmountButtonActive');
        } catch (error) {}
    }
}

function initializeAutoSolverBoxButtonInteractiveness() {
    const AutoSolverBoxRepeatNumberDisplay = document.querySelector('.AutoSolverBoxRepeatNumberDisplay');
    const AutoSolverBoxRepeatNumberDownButton = document.querySelector('#DPASBadB1');
    const AutoSolverBoxRepeatNumberUpButton = document.querySelector('#DPASBauB1');
    const AutoSolverBoxForeverModeButton = document.querySelector('#DPASBfmB1');
    const AutoSolverBoxRepeatStartButton = document.querySelector('#DPASBsB1');

    DPABaBsFunc1();

    AutoSolverBoxRepeatNumberDisplay.textContent = autoSolverBoxRepeatAmount;
    AutoSolverBoxForeverModeButtonUpdateFunc();
    something();

    function AutoSolverBoxForeverModeButtonUpdateFunc() {
        if (DuolingoProSettingsNeverEndMode) {
            AutoSolverBoxForeverModeButton.classList.add('AutoSolverBoxRepeatAmountButtonActive');
            try {
                AutoSolverBoxForeverModeButton.classList.remove('AutoSolverBoxRepeatAmountButtonOff');
            } catch (error) {}

            AutoSolverBoxRepeatNumberDisplay.style.marginLeft = '-56px';
            AutoSolverBoxRepeatNumberDisplay.style.marginRight = '-56px';
            AutoSolverBoxRepeatNumberDownButton.style.opacity = '0';
            AutoSolverBoxRepeatNumberUpButton.style.opacity = '0';
            AutoSolverBoxRepeatNumberDisplay.textContent = "∞";
            AutoSolverBoxRepeatNumberDisplay.style.fontSize = '24px';
        } else {
            AutoSolverBoxForeverModeButton.classList.add('AutoSolverBoxRepeatAmountButtonOff');
            try {
                AutoSolverBoxForeverModeButton.classList.remove('AutoSolverBoxRepeatAmountButtonActive');
            } catch (error) {}

            AutoSolverBoxRepeatNumberDisplay.style.marginLeft = '';
            AutoSolverBoxRepeatNumberDisplay.style.marginRight = '';
            AutoSolverBoxRepeatNumberDownButton.style.opacity = '';
            AutoSolverBoxRepeatNumberUpButton.style.opacity = '';
            AutoSolverBoxRepeatNumberDisplay.textContent = autoSolverBoxRepeatAmount;
            AutoSolverBoxRepeatNumberDisplay.style.fontSize = '';
        }
    }
    if (DuolingoProSettingsNeverEndMode) {
        AutoSolverBoxRepeatNumberDisplay.textContent = "∞";
        AutoSolverBoxRepeatNumberDisplay.style.fontSize = '22px';
    }
    AutoSolverBoxForeverModeButton.addEventListener('click', () => {
        DuolingoProSettingsNeverEndMode = !DuolingoProSettingsNeverEndMode;
        localStorage.setItem('DuolingoProSettingsNeverEndMode', DuolingoProSettingsNeverEndMode);
        AutoSolverBoxForeverModeButtonUpdateFunc();
        something();
    });

    AutoSolverBoxRepeatNumberDownButton.addEventListener('click', () => {
        if (!DuolingoProSettingsNeverEndMode) {
            if (autoSolverBoxRepeatAmount !== 0) {
                autoSolverBoxRepeatAmount--;
            } else if (autoSolverBoxRepeatAmount < 0) {
                autoSolverBoxRepeatAmount = 0;
            }
            AutoSolverBoxRepeatNumberDisplay.textContent = autoSolverBoxRepeatAmount;
            sessionStorage.setItem('autoSolverBoxRepeatAmount', autoSolverBoxRepeatAmount);
            DPABaBsFunc1();
        } else {
        }
        something();
    });

    AutoSolverBoxRepeatNumberUpButton.addEventListener('click', () => {
        if (!DuolingoProSettingsNeverEndMode) {
            if (autoSolverBoxRepeatAmount !== 999999) {
                autoSolverBoxRepeatAmount++;
            } else if (autoSolverBoxRepeatAmount > 999999) {
                autoSolverBoxRepeatAmount = 999999;
            }
            AutoSolverBoxRepeatNumberDisplay.textContent = autoSolverBoxRepeatAmount;
            sessionStorage.setItem('autoSolverBoxRepeatAmount', autoSolverBoxRepeatAmount);
            DPABaBsFunc1();
        } else {
        }
        something();
    });


    function DPABaBsFunc1() {
        if (autoSolverBoxRepeatAmount === 0 || autoSolverBoxRepeatAmount < 0) {
            AutoSolverBoxRepeatNumberDownButton.classList.add('AutoSolverBoxRepeatAmountButtonDeactive');
            try {
                AutoSolverBoxRepeatNumberDownButton.classList.remove('AutoSolverBoxRepeatAmountButtonActive');
            } catch (error) {}
        } else {
            AutoSolverBoxRepeatNumberDownButton.classList.add('AutoSolverBoxRepeatAmountButtonActive');
            try {
                AutoSolverBoxRepeatNumberDownButton.classList.remove('AutoSolverBoxRepeatAmountButtonDeactive');
            } catch (error) {}
        }
        if (autoSolverBoxRepeatAmount === 999999 || autoSolverBoxRepeatAmount > 999999) {
            AutoSolverBoxRepeatNumberUpButton.classList.add('AutoSolverBoxRepeatAmountButtonDeactive');
            try {
                AutoSolverBoxRepeatNumberUpButton.classList.remove('AutoSolverBoxRepeatAmountButtonActive');
            } catch (error) {}
        } else {
            AutoSolverBoxRepeatNumberUpButton.classList.add('AutoSolverBoxRepeatAmountButtonActive');
            try {
                AutoSolverBoxRepeatNumberUpButton.classList.remove('AutoSolverBoxRepeatAmountButtonDeactive');
            } catch (error) {}
        }
    }

    if (autoSolverBoxRepeatAmount === 0 && !DuolingoProSettingsNeverEndMode) {
        wasAutoSolverBoxRepeatStartButtonPressed = false;
        sessionStorage.setItem('wasAutoSolverBoxRepeatStartButtonPressed', wasAutoSolverBoxRepeatStartButtonPressed);
        AutoSolverBoxRepeatStartButton.textContent = 'START';
    }

    if (wasAutoSolverBoxRepeatStartButtonPressed === true) {
        AutoSolverBoxRepeatStartButton.textContent = 'STOP';
        AutoSolverBoxRepeatStartButtonActions();
    }

    function AutoSolverBoxRepeatStartButtonActions() {
        if (autoSolverBoxRepeatAmount > 0 || DuolingoProSettingsNeverEndMode) {
            sessionStorage.setItem('autoSolverBoxRepeatAmount', autoSolverBoxRepeatAmount);

            try {
                let openChestThingy = document.querySelector("button[aria-label='Open chest']");
                openChestThingy.click();
            } catch (error) {
            }

            setTimeout(function() {
                if (!DuolingoProSettingsNeverEndMode) {
                    if (wasAutoSolverBoxRepeatStartButtonPressed === true && autoSolverBoxRepeatAmount > 0) {
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
                } else if (wasAutoSolverBoxRepeatStartButtonPressed === true) {
                    if (autoSolverBoxPracticeOnlyMode) {
                        window.location.href = "https://duolingo.com/practice";
                    } else if (autoSolverBoxRepeatLessonMode) {
                        window.location.href = "https://duolingo.com/lesson/unit/1/level/1";
                    } else {
                        window.location.href = "https://duolingo.com/lesson";
                    }
                }
            }, 4000);
        }
    }

    try {
        AutoSolverBoxRepeatStartButton.addEventListener('click', () => {
            if (autoSolverBoxRepeatAmount > 0 || DuolingoProSettingsNeverEndMode) {
                AutoSolverBoxRepeatStartButton.textContent = AutoSolverBoxRepeatStartButton.textContent === 'START' ? 'STOP' : 'START';
                wasAutoSolverBoxRepeatStartButtonPressed = !wasAutoSolverBoxRepeatStartButtonPressed;
                sessionStorage.setItem('wasAutoSolverBoxRepeatStartButtonPressed', wasAutoSolverBoxRepeatStartButtonPressed);
            }
            analyticsLogsSend('Duolingo Pro AutoSolver Box START Button', wasAutoSolverBoxRepeatStartButtonPressed ? 'ON' : 'OFF')
            setTimeout(function() {
                AutoSolverBoxRepeatStartButtonActions();
            }, 500);
        });
    } catch(error) {
    }

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
}


function checkURLForAutoSolverBox() {
    if (window.location.pathname === '/lesson' || window.location.pathname.includes('/unit') || window.location.pathname === '/practice') {
        let jfgsdodhgsf = document.querySelector('#solveAllButton');
        if (jfgsdodhgsf) {
            if (wasAutoSolverBoxRepeatStartButtonPressed === true) {
                autoSolverBoxRepeatAmount--;
                sessionStorage.setItem('autoSolverBoxRepeatAmount', autoSolverBoxRepeatAmount);
                solving();
            }
        } else {
            setTimeout(function() {
                checkURLForAutoSolverBox();
            }, 100);
        }
    } else {
    }
}

checkURLForAutoSolverBox();


injectContent();


let DuolingoSiderbarPaddingThingFunctionRepeatTimes = 20;
let DuolingoProBoxHeightForSidebarPadding;

function DuolingoHomeSidebarAddPaddingFunction() {
    if (window.location.pathname === '/learn') {
        DuolingoProBoxHeightForSidebarPadding = document.querySelector('.boxFirst');
        try {
            const DuolingoSiderbarPaddingThing = document.querySelector('.Fc0NK');
            DuolingoSiderbarPaddingThing.style.paddingBottom = String(String(DuolingoProBoxHeightForSidebarPadding.offsetHeight += 8) + 'px'); // or 574px if an 8px gap preferred
        } catch(error) {
        }
    }
}

setInterval(DuolingoHomeSidebarAddPaddingFunction, 100);


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
    align-items: center;
    gap: 8px;
    align-self: stretch;
}

.BlockedByDuolingoProBoxSectionOneTextOne {
    flex: 1 0 0;

    color: rgb(var(--color-eel));
    font-size: 18px;
    font-weight: 700;

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

    user-select: none;
    -moz-user-select: none;
    -webkit-text-select: none;
    -webkit-user-select: none;
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
    } catch(error) {}
}

if (DuolingoProSettingsProBlockMode) {
    setInterval(iforgot, 100);
    setInterval(DuolingoRemoveLearnAds, 100);
}


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
                <textarea class="SendFeebackBoxSectionTwo" id="SendFeebackBoxSectionTwoID" placeholder="Write here as much as you can with as many details as possible. Responses that are less than two sentences will be automatically deleted. Bug Reports that don't state your Course will be automatically ignored."/></textarea>

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


                <p class="SendFeebackBoxSectionThree">Upload Photo - Optional</p>
                <input type="file" accept="image/png, image/jpeg" class="loldonttouchthisbit" id="SendFeedbackFileUploadButtonIDOne" onchange="showFileName()"/>


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
.loldonttouchthisbit {
    display: flex;
    height: 54px;
    width: 100%;
    align-items: center;
    /*flex: 1 0 0;*/

    border-radius: 8px;

    padding: 14px;

    cursor: pointer;
    transition: .1s;

    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    overflow: hidden;
}

#SendFeedbackFileUploadButtonIDOne {
    border: 2px solid rgb(var(--color-swan));
    border-bottom: 4px solid rgb(var(--color-swan));
    background: rgb(var(--color-snow));

    color: rgb(var(--color-eel));
}

#SendFeedbackFileUploadButtonIDOne:hover {
    filter: brightness(0.95);
}

#SendFeedbackFileUploadButtonIDOne:active {
    height: 52px;

    border-bottom: 2px solid rgb(var(--color-swan));

    filter: brightness(0.9);
    margin-top: 2px;
}

#SendFeedbackFileUploadButtonIDOne::file-selector-button {
    display: none;
}

#SendFeedbackFileUploadButtonIDTwo {
    border: 2px solid rgba(0, 0, 0, 0.20);
    border-bottom: 4px solid rgba(0, 0, 0, 0.20);
    background: #007AFF;

    color: rgb(241, 247, 251);
}

#SendFeedbackFileUploadButtonIDTwo:hover {
    filter: brightness(0.95);
}

#SendFeedbackFileUploadButtonIDTwo:active {
    height: 52px;

    border-bottom: 2px solid rgba(0, 0, 0, 0.20);

    filter: brightness(0.9);
    margin-top: 2px;
}

#SendFeedbackFileUploadButtonIDTwo::file-selector-button {
    display: none;
}



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
    opacity: 0;
    transition: .2s;

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
    max-width: 544px;
    min-width: 368px;

    transition: .2s;
    <!-- transform: scale(0.8); -->
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
    width: 36px;
    height: 38px;
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

    user-select: none;
    -moz-user-select: none;
    -webkit-text-select: none;
    -webkit-user-select: none;
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

    user-select: none;
    -moz-user-select: none;
    -webkit-text-select: none;
    -webkit-user-select: none;
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

    user-select: none;
    -moz-user-select: none;
    -webkit-text-select: none;
    -webkit-user-select: none;
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

    user-select: none;
    -moz-user-select: none;
    -webkit-text-select: none;
    -webkit-user-select: none;
}
`;

let randomValue;
let randomValueInText;

function setRandomValue() {
    if (Boolean(localStorage.getItem("RandomValue")) === false) {
        // Generates a random number between 0 and 9999999999
        randomValue = Math.floor(Math.random() * 10000000000);

        // Convert the random number to a string
        randomValueInText = String(randomValue);

        // Prepend zeros to the string until it is 10 digits long
        while (randomValueInText.length < 10) {
            randomValueInText = "0" + randomValueInText;
        }

        localStorage.setItem("RandomValue", randomValueInText);
        console.log("Generated ID: ", randomValue);
    } else {
        randomValue = localStorage.getItem("RandomValue");
    }
}

setRandomValue();

let fileInput;

let injectedSendFeedBackBoxElement = null;
let injectedSendFeedBackBoxStyle = null;

let isSendFeebackBoxSectionEightSendButtonEnabled = false;

let SendFeedbackTextAreaValue;
let idktype = 'Bug Report';
let sendFeedbackStatus = 'none';

function injectSendFeedBackBox() {
    if (isSendFeedbackButtonPressed === true) {
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

            let SendFeedbackWholeDiv = document.querySelector('.SendFeebackBoxShadow');
            let SendFeedbackBoxDiv = document.querySelector('.SendFeebackBoxBackground');

            setTimeout(function() {
                SendFeedbackWholeDiv.style.opacity = '1';
                //SendFeedbackBoxDiv.style.transform = 'scale(1)';
            }, 50);


            fileInput = document.querySelector('.loldonttouchthisbit');
            fileInput.addEventListener('change', function() {
                if (fileInput.files.length > 0) {
                    fileInput.setAttribute('id', 'SendFeedbackFileUploadButtonIDTwo');
                } else {
                    fileInput.setAttribute('id', 'SendFeedbackFileUploadButtonIDOne');
                }
            });


            const SendFeedbackCloseButton = document.querySelector('.SendFeebackBoxSectionOneCancelBoxBackground');
            SendFeedbackCloseButton.addEventListener('click', () => {
                isSendFeedbackButtonPressed = false;
            });

            const TextAreaOneOne = document.getElementById('SendFeebackBoxSectionTwoID');

            // Set the value of the textarea to the variable

            const bugRadio = document.getElementById('SendFeebackTypeButtonOne');
            const suggestionRadio = document.getElementById('SendFeebackTypeButtonTwo');

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
                    sendFeedbackServer(SendFeedbackTextAreaValue, idktype);

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
                            }, 2000);
                        } else if (sendFeedbackStatus === 'error') {
                            SendFeebackBoxSectionEightSendButton.textContent = 'ERROR SENDING';
                            SendFeebackBoxSectionEightSendButton.style.background = '#FF2D55';
                            SendFeebackBoxSectionEightSendButton.style.border = '2px solid rgba(0, 0, 0, 0.20)';
                            SendFeebackBoxSectionEightSendButton.style.borderBottom = '4px solid rgba(0, 0, 0, 0.20)';

                            setTimeout(function() {
                                SendFeebackBoxSectionEightSendButton.textContent = 'TRY AGAIN';
                            }, 2000);

                            setTimeout(function() {
                                SendFeebackBoxSectionEightSendButton.textContent = 'SEND';
                                SendFeebackBoxSectionEightSendButton.style.background = '';
                                SendFeebackBoxSectionEightSendButton.style.border = '';
                                SendFeebackBoxSectionEightSendButton.style.borderBottom = '';
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
        if (injectedSendFeedBackBoxElement) {
            let SendFeedbackWholeDiv = document.querySelector('.SendFeebackBoxShadow');
            let SendFeedbackBoxDiv = document.querySelector('.SendFeebackBoxBackground');

            setTimeout(function() {
                SendFeedbackWholeDiv.style.opacity = '0';
                //SendFeedbackBoxDiv.style.transform = 'scale(0.8)';
            }, 50);

            setTimeout(function() {
                document.body.removeChild(injectedSendFeedBackBoxElement);
                document.head.removeChild(injectedSendFeedBackBoxStyle);
                injectedSendFeedBackBoxElement = null;
                injectedSendFeedBackBoxStyle = null;
            }, 500);
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
                <p class="WhatsNewBoxOneSectionOneBoxOneTextOne">2.0 BETA 9.2</p>
            </div>
        </div>
        <div class="WhatsNewBoxOneSectionTwo">
            <img src="https://exampleimage.png" class="WhatsNewBoxOneSectionTwoImageOne">
        </div>
        <div class="WhatsNewBoxOneSectionThree">
            <p class="WhatsNewBoxOneSectionThreeTextOne">Example Title</p>
            <p class="WhatsNewBoxOneSectionThreeTextTwo">Example description.</p>
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
    opacity: 0;
    transition: .2s;

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
    transition: .2s;
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

    transition: .1s;
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

    transition: .1s;
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

    transition: .1s;
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

    transition: .1s;

    user-select: none;
    -moz-user-select: none;
    -webkit-text-select: none;
    -webkit-user-select: none;
}
`;

let injectedWhatsNewBoxElement = null;
let injectedWhatsNewBoxStyle = null;

function injectWhatsNewBox() {
    if (wasWhatsNewInTwoPointZeroBetaSevenFinished === false) {
        if (window.location.pathname === '/learn') {
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

                let WhatsNewBoxOneWholeDiv = document.querySelector('.WhatsNewBoxOneShadow');
                setTimeout(function() {
                    WhatsNewBoxOneWholeDiv.style.opacity = '1';
                }, 50);

                const WhatsNewBoxOneSectionFour = document.querySelector('.WhatsNewBoxOneSectionFour');
                modifyWhatsNewBox();
                WhatsNewBoxOneSectionFour.addEventListener('click', () => {
                    whatsNewInBetaStage++;
                    console.log('something');
                    modifyWhatsNewBox();
                });

                modifyWhatsNewBox();
            }
        }
    } else {
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
    const WhatsNewBoxOneSectionTwoImageOneElement = document.querySelector('img.WhatsNewBoxOneSectionTwoImageOne');
    const WhatsNewBoxOneSectionTwoImageOneURL = document.querySelector('img.WhatsNewBoxOneSectionTwoImageOne');

    if (whatsNewInBetaStage === 1) {
        WhatsNewBoxOneSectionThreeTextOne.textContent = 'Major Bug Fixes';
        WhatsNewBoxOneSectionThreeTextTwo.textContent = 'Duolingo Pro BETA 7 has fixes for major common bugs that stopped AutoSolver, Solve and Solve All Buttons from solving certain questions.';
        WhatsNewBoxOneSectionTwoImageOneURL.src = 'https://framerusercontent.com/images/oaXxGJyRWwPc6cFDUM3fPxlDI.png';
        WhatsNewBoxOneSectionFourTextOne.textContent = 'NEXT';
    } else if (whatsNewInBetaStage === 2) {
        WhatsNewBoxAnimations();
        setTimeout(function() {
            WhatsNewBoxOneSectionThreeTextOne.textContent = 'Low Performance Mode';
            WhatsNewBoxOneSectionThreeTextTwo.textContent = 'Low Performance Mode enables Duolingo and Duolingo Pro to use less processing power by limiting animations and background tasks. This can reduce lags on certain lower end devices. You can enable this feature in Duolingo Pro Settings.';
            WhatsNewBoxOneSectionTwoImageOneURL.src = 'https://framerusercontent.com/images/yxmX51WMXqAJmg5DvHXzPR5aQak.png';
            WhatsNewBoxOneSectionFourTextOne.textContent = 'DONE';
        }, 100);
    } else {
        let WhatsNewBoxOneWholeDiv = document.querySelector('.WhatsNewBoxOneShadow');
        setTimeout(function() {
            WhatsNewBoxOneWholeDiv.style.opacity = '0';
        }, 50);

        setTimeout(function() {
            wasWhatsNewInTwoPointZeroBetaSevenFinished = true;
            localStorage.setItem('wasWhatsNewInTwoPointZeroBetaSevenFinished', true);
        }, 500);
    }

    function WhatsNewBoxAnimations() {
        WhatsNewBoxOneSectionThreeTextOne.style.opacity = '0';
        WhatsNewBoxOneSectionThreeTextTwo.style.opacity = '0';
        WhatsNewBoxOneSectionTwoImageOneElement.style.opacity = '0';
        WhatsNewBoxOneSectionFourTextOne.style.opacity = '0';

        setTimeout(function() {
            WhatsNewBoxOneSectionThreeTextOne.style.opacity = '1';
            WhatsNewBoxOneSectionThreeTextTwo.style.opacity = '1';
            WhatsNewBoxOneSectionTwoImageOneElement.style.opacity = '1';
            WhatsNewBoxOneSectionFourTextOne.style.opacity = '1';
        }, 300);
    }
}


const DuolingoProSettingsBoxHTML = `
<div class="DuolingoProSettingsBoxShadow">
    <div class="DuolingoProSettingsBoxBackground">
        <div class="DuolingoProSettingsBoxLayers">
            <div class="DuolingoProSettingsBoxSectionOne">
                <p class="DuolingoProSettingsBoxSectionOneTextOne">Settings</p>
                <div class="DuolingoProSettingsBoxSectionOneBoxOne">
                    <p class="DuolingoProSettingsBoxSectionOneBoxOneTextOne">2.0 BETA 9.2</p>
                </div>
            </div>
            <div class="DuolingoProSettingsBoxSectionTwo">
                <div class="DuolingoProSettingsBoxSectionTwoBoxOne">
                    <div class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOne">
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextThree" style="color: #007AFF;">RECOMMENDED</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextOne">Show AutoSolver Box</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextTwo">AutoSolver Box makes it easier to binge solve questions automatically.</p>
                    </div>
                    <div class="DuolingoProSettingsBoxToggleTypeOne" id="DuolingoProSettingsBoxToggleOneID">ON</div>
                </div>
                <div class="DuolingoProSettingsBoxSectionTwoBoxOne">
                    <div class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOne">
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextThree" style="color: #FF2D55;">ALPHA</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextOne">Show Practice Only Mode for AutoSolver Box</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextTwo">Practice Mode enables AutoSolver to only do practices and repeat them.</p>
                    </div>
                    <div class="DuolingoProSettingsBoxToggleTypeOne" id="DuolingoProSettingsBoxToggleTwoID">OFF</div>
                </div>
                <div class="DuolingoProSettingsBoxSectionTwoBoxOne">
                    <div class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOne">
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextThree" style="color: #007AFF;">RECOMMENDED - HIGHER STABILITY</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextOne">Show Repeat Lesson Mode for AutoSolver Box</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextTwo">Repeat Lesson Mode enables AutoSolver to only do a set lesson and repeat it. This mode is recommended over Practice Only Mode because of it's higher stability.</p>
                    </div>
                    <div class="DuolingoProSettingsBoxToggleTypeOne" id="DuolingoProSettingsBoxToggleThreeID">NOT SET</div>
                </div>
                <div class="DuolingoProSettingsBoxSectionTwoBoxOne">
                    <div class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOne">
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextOne">Low Performance Mode</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextTwo">In low performance mode, Duolingo Pro reduces animations and background tasks to reduce lag. Only recommended for low-performance devices.</p>
                    </div>
                    <div class="DuolingoProSettingsBoxToggleTypeOne" id="DuolingoProSettingsBoxToggleFourID">OFF</div>
                </div>
                <div class="DuolingoProSettingsBoxSectionTwoBoxOne">
                    <div class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOne">
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextThree" style="color: #34C759;">NEW</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextOne">ProShade</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextTwo">.</p>
                    </div>
                    <div class="DuolingoProSettingsBoxToggleTypeOne" id="DuolingoProSettingsBoxToggleNineID">ON</div>
                </div>
                <div class="DuolingoProSettingsBoxSectionTwoBoxOne">
                    <div class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOne">
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextThree" style="color: #34C759;">NEW</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextOne">Simple AntiStuck Protection</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextTwo">.</p>
                    </div>
                    <div class="DuolingoProSettingsBoxToggleTypeOne" id="DuolingoProSettingsBoxToggleTenID">ON</div>
                </div>
                <div class="DuolingoProSettingsBoxSectionTwoBoxOne">
                    <div class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOne">
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextOne">ProBlock Ads by Duolingo Pro</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextTwo">ProBlock removes ads that pop-up on the main Duolingo tabs like Learn, Practice, and Shop.</p>
                    </div>
                    <div class="DuolingoProSettingsBoxToggleTypeOne" id="DuolingoProSettingsBoxToggleFiveID">ON</div>
                </div>
                <div class="DuolingoProSettingsBoxSectionTwoBoxOne">
                    <div class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOne">
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextThree" style="color: #007AFF;">RECOMMENDED</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextOne">Update Notifications</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextTwo">Get an on-screen notification when a new update is available for Duolingo Pro.</p>
                    </div>
                    <div class="DuolingoProSettingsBoxToggleTypeOne" id="DuolingoProSettingsBoxToggleEightID">ON</div>
                </div>
                <div class="DuolingoProSettingsBoxSectionTwoBoxOne">
                    <div class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOne">
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextThree" style="color: #FF2D55;">EXPERIMENTAL</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextOne">TurboSolve Mode - Currently Unavailable</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextTwo">TurboSolve, thanks to <a href="https://github.com/SicariusBlack" style="color: #007AFF; font-size: 14px; font-style: normal; font-weight: 700; line-height: normal;">SicariusBlack</a>, improves AutoSolve and Solve All speeds by up to 5 times. This is an experimental feature.</p>
                    </div>
                    <div class="DuolingoProSettingsBoxToggleTypeOne" id="DuolingoProSettingsBoxToggleSixID">ON</p>
                    </div>
                </div>
                <div class="DuolingoProSettingsBoxSectionTwoBoxOne">
                    <div class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOne">
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextOne">Humane Solving Mode - Currently Unavailable</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextTwo">Humane Solving mode, thanks to <a href="https://github.com/SicariusBlack" style="color: #007AFF; font-size: 14px; font-style: normal; font-weight: 700; line-height: normal;">SicariusBlack</a>, solves every question step by step, greatly reducing the slim chances of being caught and banned.</p>
                    </div>
                    <div class="DuolingoProSettingsBoxToggleTypeOne" id="DuolingoProSettingsBoxToggleSevenID">ON</div>
                </div>
                <div class="DuolingoProSettingsBoxSectionTwoBoxOne">
                    <div class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOne">
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextOne">Contributors</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextTwo"><a href="https://github.com/surebrec"  target="_blank" rel="noopener noreferrer" style="color: #007AFF; text-decoration-line: none;">surebrec</a>, <a href="https://github.com/anonymoushackerIV"  target="_blank" rel="noopener noreferrer" style="color: #007AFF; text-decoration-line: none;">anonymoushackerIV</a>, <a href="https://github.com/SicariusBlack"  target="_blank" rel="noopener noreferrer" style="color: #007AFF; text-decoration-line: none;">SicariusBlack</a></p>
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
    opacity: 0;
    transition: .2s;

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
    max-width: 544px;
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

    cursor: pointer;
    transition: .1s;


    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    margin: 0px;

    user-select: none;
    -moz-user-select: none;
    -webkit-text-select: none;
    -webkit-user-select: none;

}

.DuolingoProSettingsBoxToggleTypeOneON {
    border: 2px solid rgba(0, 0, 0, 0.20);
    border-bottom: 4px solid rgba(0, 0, 0, 0.20);
    background: #007AFF;

    color: #FFF;
}
.DuolingoProSettingsBoxToggleTypeOneON:hover {
    filter: brightness(0.95);
}
.DuolingoProSettingsBoxToggleTypeOneON:active {
    filter: brightness(0.9);

    margin-top: 2px;
    height: 46px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.20);
}

.DuolingoProSettingsBoxToggleTypeOneOFF {
    border: 2px solid rgb(var(--color-swan));
    border-bottom: 4px solid rgb(var(--color-swan));
    background: rgb(var(--color-snow));

    color: rgb(var(--color-eel));
}
.DuolingoProSettingsBoxToggleTypeOneOFF:hover {
    filter: brightness(0.95);
}
.DuolingoProSettingsBoxToggleTypeOneOFF:active {
    filter: brightness(0.9);

    margin-top: 2px;
    height: 46px;
    border-bottom: 2px solid rgb(var(--color-swan));
}


.DuolingoProSettingsBoxToggleTypeOneTextOne {
    color: #FFF;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    margin: 0px;

    user-select: none;
    -moz-user-select: none;
    -webkit-text-select: none;
    -webkit-user-select: none;
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

    user-select: none;
    -moz-user-select: none;
    -webkit-text-select: none;
    -webkit-user-select: none;
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

    user-select: none;
    -moz-user-select: none;
    -webkit-text-select: none;
    -webkit-user-select: none;
}
`;

let injectedDuolingoProSettingsBoxElement = null;
let injectedDuolingoProSettingsBoxStyle = null;

function injectDuolingoProSettingsBox() {
    if (wasDuolingoProSettingsButtonOnePressed === true) {
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

            let DuolingoProSettingsBoxWholeDiv = document.querySelector('.DuolingoProSettingsBoxShadow');
            setTimeout(function() {
                DuolingoProSettingsBoxWholeDiv.style.opacity = '1';
            }, 50);

            const DuolingoProSettingsBoxCancelButton = document.querySelector('.DuolingoProSettingsBoxCancelButton');
            DuolingoProSettingsBoxCancelButton.addEventListener('click', () => {
                let DuolingoProSettingsBoxWholeDiv = document.querySelector('.DuolingoProSettingsBoxShadow');
                setTimeout(function() {
                    DuolingoProSettingsBoxWholeDiv.style.opacity = '0';
                }, 50);

                setTimeout(function() {
                    wasDuolingoProSettingsButtonOnePressed = false;

                    AutoSolverSettingsShowAutoSolverBox = JSON.parse(localStorage.getItem('AutoSolverSettingsShowAutoSolverBox'));
                    AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox = JSON.parse(localStorage.getItem('AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox'));
                    AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox = JSON.parse(localStorage.getItem('AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox'));
                    AutoSolverSettingsLowPerformanceMode = JSON.parse(localStorage.getItem('AutoSolverSettingsLowPerformanceMode'));
                }, 500);
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
                //if (JSON.parse(localStorage.getItem('DuolingoProSettingsNeverEndMode')) !== DuolingoProSettingsNeverEndMode) {
                //    settingsStuff("Duolingo Pro Never End Mode", DuolingoProSettingsNeverEndMode ? 'ON' : 'OFF');
                //}
                if (JSON.parse(localStorage.getItem('DuolingoProSettingsUpdateNotifications')) !== DuolingoProSettingsUpdateNotifications) {
                    settingsStuff("Duolingo Pro Update Notifications", DuolingoProSettingsUpdateNotifications ? 'ON' : 'OFF');
                }
                if (JSON.parse(localStorage.getItem('DuolingoProShadeLessonsMode')) !== DuolingoProShadeLessonsMode) {
                    settingsStuff("Duolingo Pro Shade Mode", DuolingoProShadeLessonsMode ? 'ON' : 'OFF');
                }
                if (JSON.parse(localStorage.getItem('DuolingoProAntiStuckProtectionMode')) !== DuolingoProAntiStuckProtectionMode) {
                    settingsStuff("Duolingo Pro AntiStuck Protection", DuolingoProAntiStuckProtectionMode ? 'ON' : 'OFF');
                }

                localStorage.setItem('AutoSolverSettingsShowAutoSolverBox', AutoSolverSettingsShowAutoSolverBox);
                localStorage.setItem('AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox', AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox);
                localStorage.setItem('AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox', AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox);
                localStorage.setItem('AutoSolverSettingsLowPerformanceMode', AutoSolverSettingsLowPerformanceMode);
                localStorage.setItem('DuolingoProSettingsProBlockMode', DuolingoProSettingsProBlockMode);
                localStorage.setItem('DuolingoProSettingsTurboSolveMode', DuolingoProSettingsTurboSolveMode);
                localStorage.setItem('DuolingoProSettingsHumaneSolvingMode', DuolingoProSettingsHumaneSolvingMode);
                //localStorage.setItem('DuolingoProSettingsNeverEndMode', DuolingoProSettingsNeverEndMode);
                localStorage.setItem('DuolingoProShadeLessonsMode', DuolingoProShadeLessonsMode);
                localStorage.setItem('DuolingoProAntiStuckProtectionMode', DuolingoProAntiStuckProtectionMode);

                localStorage.setItem('DuolingoProSettingsUpdateNotifications', DuolingoProSettingsUpdateNotifications);

                if (!AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox) {
                    autoSolverBoxPracticeOnlyMode = false;
                    sessionStorage.setItem('autoSolverBoxPracticeOnlyMode', autoSolverBoxPracticeOnlyMode);
                }

                if (!AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox) {
                    autoSolverBoxPracticeOnlyMode = false;
                    sessionStorage.setItem('autoSolverBoxRepeatLessonMode', autoSolverBoxRepeatLessonMode);
                }

                console.log('Settings saved');
                //notificationCall("New Settings Saved", "Reloading the tab and applying new settings.");

                let DuolingoProSettingsBoxSaveButtonTextElement = DuolingoProSettingsBoxSaveButton.querySelector('.DuolingoProSettingsBoxSaveButtonTextOne');
                DuolingoProSettingsBoxSaveButtonTextElement.textContent = 'SAVING AND RELOADING';

                setTimeout(function() {
                    //wasDuolingoProSettingsButtonOnePressed = false;
                    location.reload();
                }, 2000);

            });

            const DuolingoProSettingsBoxToggleOneIDElement = document.querySelector('#DuolingoProSettingsBoxToggleOneID');
            DuolingoProSettingsBoxToggleOneIDElement.addEventListener('mouseup', () => {
                AutoSolverSettingsShowAutoSolverBox = !AutoSolverSettingsShowAutoSolverBox;
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleOneIDElement, AutoSolverSettingsShowAutoSolverBox);
            });

            const DuolingoProSettingsBoxToggleTwoIDElement = document.querySelector('#DuolingoProSettingsBoxToggleTwoID');
            DuolingoProSettingsBoxToggleTwoIDElement.addEventListener('mouseup', () => {
                AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox = !AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox;
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleTwoIDElement, AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox);
            });

            const DuolingoProSettingsBoxToggleThreeIDElement = document.querySelector('#DuolingoProSettingsBoxToggleThreeID');
            DuolingoProSettingsBoxToggleThreeIDElement.addEventListener('mouseup', () => {
                AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox = !AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox;
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleThreeIDElement, AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox);
            });

            const DuolingoProSettingsBoxToggleFourIDElement = document.querySelector('#DuolingoProSettingsBoxToggleFourID');
            DuolingoProSettingsBoxToggleFourIDElement.addEventListener('mouseup', () => {
                AutoSolverSettingsLowPerformanceMode = !AutoSolverSettingsLowPerformanceMode;
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleFourIDElement, AutoSolverSettingsLowPerformanceMode);
            });

            const DuolingoProSettingsBoxToggleFiveIDElement = document.querySelector('#DuolingoProSettingsBoxToggleFiveID');
            DuolingoProSettingsBoxToggleFiveIDElement.addEventListener('mouseup', () => {
                DuolingoProSettingsProBlockMode = !DuolingoProSettingsProBlockMode;
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleFiveIDElement, DuolingoProSettingsProBlockMode);
            });

            const DuolingoProSettingsBoxToggleSixIDElement = document.querySelector('#DuolingoProSettingsBoxToggleSixID');
            DuolingoProSettingsBoxToggleSixIDElement.addEventListener('mouseup', () => {
                DuolingoProSettingsTurboSolveMode = !DuolingoProSettingsTurboSolveMode;
                if (DuolingoProSettingsTurboSolveMode && DuolingoProSettingsHumaneSolvingMode) {
                    DuolingoProSettingsHumaneSolvingMode = false;
                }
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleSixIDElement, DuolingoProSettingsTurboSolveMode);
            });

            const DuolingoProSettingsBoxToggleSevenIDElement = document.querySelector('#DuolingoProSettingsBoxToggleSevenID');
            DuolingoProSettingsBoxToggleSevenIDElement.addEventListener('mouseup', () => {
                DuolingoProSettingsHumaneSolvingMode = !DuolingoProSettingsHumaneSolvingMode;
                if (DuolingoProSettingsHumaneSolvingMode && DuolingoProSettingsTurboSolveMode) {
                    DuolingoProSettingsTurboSolveMode = false;
                }
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleSevenIDElement, DuolingoProSettingsHumaneSolvingMode);
            });

            const DuolingoProSettingsBoxToggleEightIDElement = document.querySelector('#DuolingoProSettingsBoxToggleEightID');
            DuolingoProSettingsBoxToggleEightIDElement.addEventListener('mouseup', () => {
                DuolingoProSettingsUpdateNotifications = !DuolingoProSettingsUpdateNotifications;
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleEightIDElement, DuolingoProSettingsUpdateNotifications);
            });

            const DuolingoProSettingsBoxToggleNineIDElement = document.querySelector('#DuolingoProSettingsBoxToggleNineID');
            DuolingoProSettingsBoxToggleNineIDElement.addEventListener('mouseup', () => {
                DuolingoProShadeLessonsMode = !DuolingoProShadeLessonsMode;
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleNineIDElement, DuolingoProShadeLessonsMode);
            });

            const DuolingoProSettingsBoxToggleTenIDElement = document.querySelector('#DuolingoProSettingsBoxToggleTenID');
            DuolingoProSettingsBoxToggleTenIDElement.addEventListener('mouseup', () => {
                DuolingoProAntiStuckProtectionMode = !DuolingoProAntiStuckProtectionMode;
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleTenIDElement, DuolingoProAntiStuckProtectionMode);
            });

            function updateDuolingoProSettingsToggleAll() {
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleOneIDElement, AutoSolverSettingsShowAutoSolverBox);
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleTwoIDElement, AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox);
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleThreeIDElement, AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox);
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleFourIDElement, AutoSolverSettingsLowPerformanceMode);
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleFiveIDElement, DuolingoProSettingsProBlockMode);
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleSixIDElement, DuolingoProSettingsTurboSolveMode);
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleSevenIDElement, DuolingoProSettingsHumaneSolvingMode);
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleEightIDElement, DuolingoProSettingsUpdateNotifications);
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleNineIDElement, DuolingoProShadeLessonsMode);
                updateDuolingoProSettingsToggle(DuolingoProSettingsBoxToggleTenIDElement, DuolingoProAntiStuckProtectionMode);
            }
            updateDuolingoProSettingsToggleAll();
        }
    } else {
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
    if (element.id === 'DuolingoProSettingsBoxToggleThreeID') {
        element.textContent = value ? "LESSON 1" : "OFF";
    } else {
        element.textContent = value ? "ON" : "OFF";
    }
    if (value) {
        element.classList.add('DuolingoProSettingsBoxToggleTypeOneON');
        try {
            element.classList.remove('DuolingoProSettingsBoxToggleTypeOneOFF');
        } catch (error) {
        }
    } else {
        element.classList.add('DuolingoProSettingsBoxToggleTypeOneOFF');
        try {
            element.classList.remove('DuolingoProSettingsBoxToggleTypeOneON');
        } catch (error) {
        }
    }
}


function iwantstolol() {
    try {
        let nextStoryStartButton = document.querySelector('[data-test="story-start"]');
        if (nextStoryStartButton) {
            nextStoryStartButton.click();
            anonymousSolveDetails('Story Start');
        }
    } catch (error) {
    }
}

setInterval(iwantstolol, 500);

let downloadStuffVar = 'none';
let updateStuffVar = 'none';

if (String(localStorage.getItem('duolingoProLastInstalledVersion')) === null || String(localStorage.getItem('duolingoProLastInstalledVersion')) === "null") {
    downloadStuffVar = 'trying';

    setTimeout(function() {
        versionServerStuff('download', "Downloaded Version", duolingoProCurrentVersion);
        checkFlagTwo();
    }, 2000);

    function checkFlagTwo() {
        if (downloadStuffVar === 'trying') {
            setTimeout(function() {
                checkFlagTwo();
            }, 100);
        } else if (downloadStuffVar === 'true') {
            localStorage.setItem('duolingoProLastInstalledVersion', duolingoProCurrentVersion);
        } else if (downloadStuffVar === 'error') {
            setTimeout(function() {
                versionServerStuff('download', 'Downloaded Version', duolingoProCurrentVersion);
            }, 1000);
        } else if (downloadStuffVar === 'empty') {
            notificationCall("Duolingo Pro Encountered An Error", "Duolingo Pro error #0001");
        }
    }

} else if (String(localStorage.getItem('duolingoProLastInstalledVersion')) !== duolingoProCurrentVersion) {
    updateStuffVar = 'trying';

    setTimeout(function() {
        versionServerStuff('update', "Updated Version", duolingoProCurrentVersion, String(localStorage.getItem('duolingoProLastInstalledVersion')));
        checkFlagThree();
    }, 2000);

    function checkFlagThree() {
        if (updateStuffVar === 'trying') {
            setTimeout(function() {
                checkFlagThree();
            }, 100);
        } else if (updateStuffVar === 'true') {
            localStorage.setItem('duolingoProLastInstalledVersion', duolingoProCurrentVersion);
        } else if (updateStuffVar === 'error') {
            setTimeout(function() {
                versionServerStuff('update', "Updated Version", duolingoProCurrentVersion, String(localStorage.getItem('duolingoProLastInstalledVersion')));
            }, 1000);
        } else if (updateStuffVar === 'empty') {
            notificationCall("Duolingo Pro Encountered An Error", "Duolingo Pro error #0002");
        }
    }
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




const DuolingoProShadeHTML = `
<div class="BlockBoxOne">
    <div class="BlockBoxOneSectionOne">
        <p class="BlockBoxOneSectionOneTextOne">Duolingo Pro is working hard</p>
        <p class="BlockBoxOneSectionOneTextTwo">AntiStuck Protection is <a style="color: #007AFF;">active</a></p>
    </div>
    <div class="BlockBoxOneSectionTwo">
        <div class="BlockBoxOneSectionTwoBoxOne">END LESSON</div>
        <div class="BlockBoxOneSectionTwoBoxTwo">SHOW LESSON</div>
    </div>
</div>
`;

const DuolingoProShadeCSS = `
.BlockBoxOne {
    position: fixed;
    top: 0px;
    bottom: 0px;
    right: 0px;
    left: 0px;
    width: 100%;
    height: 100vh;
    background: rgb(var(--color-snow));

    justify-content: center;
    align-items: center;
    align-self: stretch;
    display: flex;

    z-index: 1920;
}

.BlockBoxOneSectionOne {
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    display: inline-flex;
}

.BlockBoxOneSectionOneTextOne {
    color: rgb(var(--color-eel));
    text-align: center;
    font-size: 32px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    margin: 0px;
}

.BlockBoxOneSectionOneTextTwo {
    align-self: stretch;

    color: rgb(var(--color-hare));
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    margin: 0px;
}

.BlockBoxOneSectionTwo {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;

    position: fixed;
    bottom: 16px;
    width: 500px;
}

.BlockBoxOneSectionTwoBoxOne {
    display: flex;
    height: 54px;
    padding: 0px 16px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex: 1 0 0;

    border-radius: 8px;
    border: 2px solid rgba(0, 0, 0, 0.20);
    border-bottom: 4px solid rgba(0, 0, 0, 0.20);
    background: #FF2D55;

    color: #FFF;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    cursor: pointer;
    transition: .1s;

    user-select: none;
    -moz-user-select: none;
    -webkit-text-select: none;
    -webkit-user-select: none;
}

.BlockBoxOneSectionTwoBoxOne:hover {
    filter: brightness(0.95);
}

.BlockBoxOneSectionTwoBoxOne:active {
    filter: brightness(0.9);
    height: 52px;
    margin-top: 2px;
    border: 2px solid rgba(0, 0, 0, 0.20);
}

.BlockBoxOneSectionTwoBoxTwo {
    display: flex;
    height: 54px;
    padding: 0px 16px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex: 1 0 0;

    border-radius: 8px;
    border: 2px solid rgba(0, 0, 0, 0.20);
    border-bottom: 4px solid rgba(0, 0, 0, 0.20);
    background: rgb(var(--color-hare), 0.5);

    color: rgb(var(--color-eel));
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    cursor: pointer;
    transition: .1s;

    user-select: none;
    -moz-user-select: none;
    -webkit-text-select: none;
    -webkit-user-select: none;
}

.BlockBoxOneSectionTwoBoxTwo:hover {
    filter: brightness(0.95);
}

.BlockBoxOneSectionTwoBoxTwo:active {
    filter: brightness(0.9);
    height: 52px;
    margin-top: 2px;
    border: 2px solid rgba(0, 0, 0, 0.20);
}
`;

let injectedDuolingoProShadeElement = null;
let injectedDuolingoProShadeStyle = null;

function injectDuolingoProShade() {
    if (window.location.pathname.includes('/lesson') && wasAutoSolverBoxRepeatStartButtonPressed && DuolingoProShadeLessonsMode) {
        if (!injectedDuolingoProShadeElement) {
            injectedDuolingoProShadeElement = document.createElement('div');
            injectedDuolingoProShadeElement.innerHTML = DuolingoProShadeHTML;
            document.body.appendChild(injectedDuolingoProShadeElement);

            injectedDuolingoProShadeStyle = document.createElement('style');
            injectedDuolingoProShadeStyle.type = 'text/css';
            injectedDuolingoProShadeStyle.innerHTML = DuolingoProShadeCSS;
            document.head.appendChild(injectedDuolingoProShadeStyle);

            const DuolingoProShadeEndLessonButton = document.querySelector('.BlockBoxOneSectionTwoBoxOne');
            const DuolingoProShadeShowLessonButton = document.querySelector('.BlockBoxOneSectionTwoBoxTwo');

            DuolingoProShadeEndLessonButton.addEventListener('click', () => {
                window.location.href = "https://duolingo.com/learn";
                DuolingoProShadeEndLessonButton.textContent = 'ENDING LESSON'
            });

            const DuolingoProShadeDivBox = document.querySelector('.BlockBoxOne');

            DuolingoProShadeShowLessonButton.addEventListener('mouseover', () => {
                DuolingoProShadeDivBox.style.transition = '0.4s';
                DuolingoProShadeDivBox.style.opacity = '0.8';
            });

            DuolingoProShadeShowLessonButton.addEventListener('mouseleave', () => {
                if (DuolingoProShadeDivBox.style.opacity === '0') {
                } else {
                    DuolingoProShadeDivBox.style.opacity = '';
                }
            });

            DuolingoProShadeShowLessonButton.addEventListener('click', () => {
                DuolingoProShadeDivBox.style.opacity = '0';
                DuolingoProShadeDivBox.style.pointerEvents = 'none';
            });
        }
    } else {
        if (injectedDuolingoProShadeElement) {
            document.body.removeChild(injectedDuolingoProShadeElement);
            document.head.removeChild(injectedDuolingoProShadeStyle);
            injectedDuolingoProShadeElement = null;
            injectedDuolingoProShadeStyle = null;
        }
    }
}

setInterval(injectDuolingoProShade, 100);




let antiStuckProtectionTimerVariable = 0;

if (window.location.pathname.includes('/lesson') && DuolingoProAntiStuckProtectionMode && wasAutoSolverBoxRepeatStartButtonPressed) {
    SimpleAntiStuckProtectionTimerFunction();
}

function SimpleAntiStuckProtectionTimerFunction() {
    setTimeout(function() {
        if (isAutoMode) {
            antiStuckProtectionTimerVariable = antiStuckProtectionTimerVariable + 0.1;
        }
    }, 100);

    if (antiStuckProtectionTimerVariable >= 30) {
        autoSolverBoxRepeatAmount++;
        sessionStorage.setItem('autoSolverBoxRepeatAmount', autoSolverBoxRepeatAmount);
        location.reload();
    }
}


const DuolingoProSolveJustThisBoxButtonHTML = `
<div class="DPJustSolveThisLessonButtonOne">AUTOSOLVE LESSON</div>
`;

const DuolingoProSolveJustThisBoxButtonCSS = `
.DPJustSolveThisLessonButtonOne {
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
    margin-top: 16px;

    font-size: 16px;
    font-weight: 700;
    text-align: center;
    color: #fff;

    user-select: none;
    -moz-user-select: none;
    -webkit-text-select: none;
    -webkit-user-select: none;
}
.DPJustSolveThisLessonButtonOne:hover {
    filter: brightness(0.95);
}
.DPJustSolveThisLessonButtonOne:active {
    height: 46px;
    margin-top: 18px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.20);
    filter: brightness(0.9);
}
`;

let injectedDuolingoProSolveJustThisBoxButtonElement = null;
let injectedDuolingoProSolveJustThisBoxButtonStyle = null;

function DuolingoProSolveJustThisBoxExtraButtonFunction() {
    try {
        let targetDivTwo = document.querySelector('._3lZ4K');
        if (targetDivTwo) {
            if (!injectedDuolingoProSolveJustThisBoxButtonElement) {
                targetDivTwo.insertAdjacentHTML('beforeend', DuolingoProSolveJustThisBoxButtonHTML);
                injectedDuolingoProSolveJustThisBoxButtonElement = DuolingoProSolveJustThisBoxButtonHTML;

                injectedDuolingoProSolveJustThisBoxButtonStyle = document.createElement('style');
                injectedDuolingoProSolveJustThisBoxButtonStyle.type = 'text/css';
                injectedDuolingoProSolveJustThisBoxButtonStyle.innerHTML = DuolingoProSolveJustThisBoxButtonCSS;
                document.head.appendChild(injectedDuolingoProSolveJustThisBoxButtonStyle);

                const DuolingoProJustSolveThisLessonButtonOneDivBox = document.querySelector('.DPJustSolveThisLessonButtonOne');
                DuolingoProJustSolveThisLessonButtonOneDivBox.addEventListener('click', () => {
                    let DuolingoProJustSolveThisLessonButtonOneDivBoxButtonToPress = document.querySelector('[data-test="skill-path-state-passed skill-path-unit-test-0"]');
                    if (DuolingoProJustSolveThisLessonButtonOneDivBoxButtonToPress) {
                        wasDuolingoProJustSolveThisLessonButtonOnePressed = true;
                        sessionStorage.setItem('wasDuolingoProJustSolveThisLessonButtonOnePressed', wasDuolingoProJustSolveThisLessonButtonOnePressed);

                        DuolingoProJustSolveThisLessonButtonOneDivBoxButtonToPress.click();
                    }
                });
            } else {
            }
        } else {
            if (injectedDuolingoProSolveJustThisBoxButtonElement) {
                injectedDuolingoProSolveJustThisBoxButtonElement = null;
            }
        }
    } catch(error) {}
}

setInterval(DuolingoProSolveJustThisBoxExtraButtonFunction, 100);

if (wasDuolingoProJustSolveThisLessonButtonOnePressed) {
    setTimeout(function() {
        solving(true);
    }, 1000);
    wasDuolingoProJustSolveThisLessonButtonOnePressed = false;
    sessionStorage.setItem('wasDuolingoProJustSolveThisLessonButtonOnePressed', wasDuolingoProJustSolveThisLessonButtonOnePressed);
}


let duolingoProCurrentNewVersion;
function checkForUpdatesVersion() {
    //setTimeout(function() {
        if (window.location.pathname.includes('/learn')) {
            fetch('https://anonymoushackeriv.github.io/duolingopro/status.html')
                .then(response => response.text())
                .then(data => {

                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');

                const elementWithClass = doc.querySelector('#DuolingoProCurrentVersionREAD');
                if (elementWithClass) {
                    duolingoProCurrentNewVersion = elementWithClass.textContent;

                    console.log(duolingoProCurrentNewVersion);
                    if (duolingoProCurrentVersion !== duolingoProCurrentNewVersion) {
                        UpdateAvailableAutoSolverBoxAlertFunction();
                    }
                } else {
                    //notificationCall("Error Fetching Content", "An error occurred while fetching update data.");
                }
            })
                .catch(error => {
                console.error('Error fetching content:', error);
                //notificationCall("Error Checking For Updated", "An error occurred while checking for an update.");
            });
        }
    //}, 100);
}



const DuolingoProNotificationBoxHTML = `
<div class="BlockedByDuolingoProBoxBackground" id="DuolingoProNotificationBackgroundOneID">
    <div class="BlockedByDuolingoProBoxSectionOne">
        <p class="BlockedByDuolingoProBoxSectionOneTextOne" id="DuolingoProNotificationTitleOneID">Title</p>
        <p class="BlockedByDuolingoProBoxSectionOneTextTwo" id="DuolingoProNotificationHideButtonOneID">DISMISS</p>
    </div>
    <p class="BlockedByDuolingoProBoxSectionTwoTextOne" id="DuolingoProNotificationDescriptionOneID">Description</p>
</div>
`;

const DuolingoProNotificationBoxCSS = `
.BlockedByDuolingoProBoxBackground {
    position: fixed;
    display: flex;
    width: 368px !important;
    padding: 16px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;

    border-radius: 16px;
    border: 2px solid rgb(var(--color-swan));
    background: rgb(var(--color-snow), 0.84);
    backdrop-filter: blur(16px);

    z-index: 2048;

    opacity: 1;
    transition: opacity .2s;

    left: 24px;
    top: calc(100%);
    /* Initially, it's hidden below the viewport */
    transition: top 0.5s cubic-bezier(0.16, 1, 0.32, 1);
    /* Add a transition for the 'top' property */
}

.BlockedByDuolingoProBoxSectionOne {
    display: flex;
    align-items: center;
    gap: 8px;
    align-self: stretch;
}

.BlockedByDuolingoProBoxSectionOneTextOne {
    flex: 1 0 0;

    color: rgb(var(--color-eel));
    font-size: 18px;
    font-weight: 700;

    margin: 0px;
    cursor: default;
}

.BlockedByDuolingoProBoxSectionOneTextTwo {
    color: #007AFF;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    margin: 0px;
    cursor: pointer;

    user-select: none;
    -moz-user-select: none;
    -webkit-text-select: none;
    -webkit-user-select: none;

    transition: .1s;
}
.BlockedByDuolingoProBoxSectionOneTextTwo:hover {
    filter: brightness(0.9);
}
.BlockedByDuolingoProBoxSectionOneTextTwo:active {
    filter: brightness(0.8);
}

.BlockedByDuolingoProBoxSectionTwoTextOne {
    align-self: stretch;

    color: rgb(var(--color-eel), 0.6);
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    margin: 0px;
    cursor: default;
}
`;

let injectedDuolingoProNotificationBoxElement = null;
let injectedDuolingoProNotificationBoxStyle = null;

let DuolingoProNotificationOneVar = false;

function injectDuolingoProNotificationBox() {
    if (!injectedDuolingoProNotificationBoxElement) {
        injectedDuolingoProNotificationBoxElement = document.createElement('div');
        injectedDuolingoProNotificationBoxElement.innerHTML = DuolingoProNotificationBoxHTML;
        document.body.appendChild(injectedDuolingoProNotificationBoxElement);

        injectedDuolingoProNotificationBoxStyle = document.createElement('style');
        injectedDuolingoProNotificationBoxStyle.type = 'text/css';
        injectedDuolingoProNotificationBoxStyle.innerHTML = DuolingoProNotificationBoxCSS;
        document.head.appendChild(injectedDuolingoProNotificationBoxStyle);
    }
}

setInterval(injectDuolingoProNotificationBox, 100);

function notificationCall(title, description) {
    if (!DuolingoProNotificationOneVar) {
        notificationPopOne("", "", false);
        setTimeout(function() {
            notificationPopOne(title, description, true);
            DuolingoProNotificationOneVar = true;
        }, 600);
    } else if (DuolingoProNotificationOneVar) {
        notificationPopOne("", "", false);
        DuolingoProNotificationOneVar = false;
        setTimeout(function() {
            notificationPopOne(title, description, true);
            DuolingoProNotificationOneVar = false;
        }, 600);
    }
}

function notificationPopOne(title, description, value) {
    let DuolingoProNotificationOne = document.querySelector('#DuolingoProNotificationBackgroundOneID');

    let DuolingoProNotificationOneTitle = document.querySelector('#DuolingoProNotificationTitleOneID');
    let DuolingoProNotificationOneDescription = document.querySelector('#DuolingoProNotificationDescriptionOneID');
    let DuolingoProNotificationOneHideButton = document.querySelector('#DuolingoProNotificationHideButtonOneID');

    DuolingoProNotificationOneTitle.textContent = title;
    DuolingoProNotificationOneDescription.textContent = description;

    let DuolingoProNotificationOneHeight = DuolingoProNotificationOne.getBoundingClientRect().height;

    if (value) {
        DuolingoProNotificationOne.style.top = `calc(100% - ${DuolingoProNotificationOneHeight + 24}px)`;
    } else {
        DuolingoProNotificationOne.style.top = `calc(100%)`;
    }
    DuolingoProNotificationOneHideButton.addEventListener('click', () => {
        DuolingoProNotificationOne.style.top = `calc(100%)`;
        DuolingoProNotificationOneVar = false;
    });
}

const proUICSS = `
@font-face {
    font-family: "SF Pro Rounded Bold";
    src: url("https://github.com/anonymoushackerIV/anonymoushackerIV.github.io/raw/main/duolingopro/fonts/SF-Pro-Rounded-Bold.otf");
}
`

let injectedproUICSSCSS = null;
function proUIFunction() {
    injectedproUICSSCSS = document.createElement('style');
    injectedproUICSSCSS.type = 'text/css';
    injectedproUICSSCSS.innerHTML = proUICSS;
    document.head.appendChild(injectedproUICSSCSS);
}
proUIFunction();
if (AutoSolverSettingsLowPerformanceMode) {
    //LowPerformanceAnimations();
}


let DuolingoProShortSessionID;
if (Number(sessionStorage.getItem('DuolingoProShortSessionID')) === null || Number(sessionStorage.getItem('DuolingoProShortSessionID')) === 0 || Number(sessionStorage.getItem('DuolingoProShortSessionID')) === NaN) {
    DuolingoProShortSessionID = Math.floor(Math.random() * (9999 - 1 + 1)) + 1;
    sessionStorage.setItem('DuolingoProShortSessionID', DuolingoProShortSessionID);
} else {
    DuolingoProShortSessionID = Number(sessionStorage.getItem('DuolingoProShortSessionID')); //sessionStorage will be deleted after the tab is closed
}




const asdgfhjklHTML = `
<div class="jfie" id="dshuigf" style="transition: all 0.5s cubic-bezier(0.16, 1, 0.32, 1); position: fixed; bottom: 16px; left: 16px; z-index: 1024; display: inline-flex; padding: 8px 12px; flex-direction: column; justify-content: center; align-items: center; border-radius: 32px; border: 2px solid rgb(var(--color-swan), 0.84); background: rgb(var(--color-snow), 0.84); box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.08); backdrop-filter: blur(16px); color: rgb(var(--color-eel), 0.64); font-size: 16px; font-weight: 700;">null</div>
`;

let asdgfhjklElement = null;
let smythr;

function asdgfhjklElementFunctionInj() {
    if (!asdgfhjklElement) {
        // Creating a container for the overlay
        document.body.insertAdjacentHTML('beforeend', asdgfhjklHTML);
        asdgfhjklElement = asdgfhjklHTML;

        smythr = document.querySelector('#dshuigf');
        smythr.style.opacity = '0';
    }
}

setInterval(asdgfhjklElementFunctionInj, 100);

function refreshactivatorThingDPHDJfunction() {
    let dfsuhf = document.querySelectorAll('.activatorThingDPHDJ');

    dfsuhf.forEach(dfsuhfO => {
        dfsuhfO.addEventListener('mouseover', () => {
            fhduishfu(true, dfsuhfO.getAttribute('aria-label'));
        });
    });
    dfsuhf.forEach(dfsuhfO => {
        dfsuhfO.addEventListener('mouseleave', () => {
            fhduishfu(false);
        });
    });
}
setInterval(refreshactivatorThingDPHDJfunction, 200);

function fhduishfu(state, message) {
    if (state) {
        smythr.textContent = message;
        smythr.style.opacity = '1';
    } else {
        smythr.style.opacity = '0';
    }
}

const UpdateAvailableAutoSolverBoxAlertHTML = `
<div class="AutoSolverBoxAlertOneBox" id="AutoSolverBoxAlertOneBoxIDUpdate" style="background: rgba(0, 122, 255, 0.10); padding: 8px; border-radius: 8px;">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" width="18" height="18" fill="#007AFF">
        <path d="M8.64844 16.625C4.125 16.625 0.398438 12.8984 0.398438 8.375C0.398438 3.84375 4.11719 0.125 8.64844 0.125C13.1719 0.125 16.8984 3.84375 16.8984 8.375C16.8984 12.8984 13.1797 16.625 8.64844 16.625ZM8.64844 3.47656C8.46875 3.47656 8.25 3.55469 8.09375 3.72656L4.92969 7.125C4.70312 7.36719 4.59375 7.57812 4.59375 7.83594C4.59375 8.22656 4.89062 8.52344 5.28906 8.52344H6.72656V11.7188C6.72656 12.4531 7.14062 12.8672 7.85938 12.8672H9.42188C10.1328 12.8672 10.5625 12.4531 10.5625 11.7188V8.52344H12C12.3906 8.52344 12.7031 8.22656 12.7031 7.82812C12.7031 7.57812 12.6016 7.39062 12.3516 7.125L9.21094 3.72656C9.03906 3.54688 8.84375 3.47656 8.64844 3.47656Z"/>
    </svg>
    <p class="AutoSolverBoxAlertOneBoxTextOne" style="color: #007AFF;">Update Available</p>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 15" width="9" height="15" fill="#007AFF">
        <path d="M8.57031 7.35938C8.57031 7.74219 8.4375 8.0625 8.10938 8.375L2.20312 14.1641C1.96875 14.3984 1.67969 14.5156 1.33594 14.5156C0.648438 14.5156 0.0859375 13.9609 0.0859375 13.2734C0.0859375 12.9219 0.226562 12.6094 0.484375 12.3516L5.63281 7.35156L0.484375 2.35938C0.226562 2.10938 0.0859375 1.78906 0.0859375 1.44531C0.0859375 0.765625 0.648438 0.203125 1.33594 0.203125C1.67969 0.203125 1.96875 0.320312 2.20312 0.554688L8.10938 6.34375C8.42969 6.64844 8.57031 6.96875 8.57031 7.35938Z"/>
    </svg>
</div>
`;

let UpdateAvailableAutoSolverBoxAlertElement = null;

function UpdateAvailableAutoSolverBoxAlertFunction() {
    try {
        let targetDiv = document.querySelector('.AutoSolverBoxAlertSectionOne');
        if (targetDiv) {
            if (!UpdateAvailableAutoSolverBoxAlertElement) {
                targetDiv.insertAdjacentHTML('beforeend', UpdateAvailableAutoSolverBoxAlertHTML);
                let dhsofadsuh = document.querySelector('#AutoSolverBoxAlertOneBoxIDUpdate');
                dhsofadsuh.addEventListener('click', () => {
                    UpdateAvailablePopUpFunction(true);
                });
            }
        }
    } catch(error) {}
}


const UpdateAvailablePopUpHTML = `
<div class="DPUDPUshadowThing">
    <div class="BPUDPUB1">
        <div class="BPUDPUL1">
            <h1 class="BPUDPUL1T1" style="font-size: 32px;">An Update is Available</h1>
            <p class="BPUDPUL1T1" id="huhuiguyfty" style="font-size: 16px;">Duolingo Pro 2.0 BETA 10 is now available for download.</p>
        </div>
        <div style="position: absolute; bottom: 16px; display: flex; width: 512px; justify-content: center; align-items: center; gap: 8px;">
            <a href="https://greasyfork.org/en/scripts/473310-duolingo-pro-beta" target="_blank">
		    <div class="BPUDPUB1BN1" id="BPUDPUB1BN1ON1">MANUALLY UPDATE</div>
            </a>
			<div class="BPUDPUB1BN1" id="BPUDPUB1BN1DS">OK</div>
		</div>
    </div>
</div>
`;

const UpdateAvailablePopUpCSS = `
.DPUDPUshadowThing {
	display: flex;
	width: 100%;
	height: 100vh;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;

    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    opacity: 0;
    transition: .2s;

    z-index: 2;
	position: fixed;
    top: 0px;
    bottom: 0px;
    right: 0px;
    left: 0px;
}

.BPUDPUB1 {
	position: relative;
	width: 544px;
	height: 544px;

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;

	box-sizing: border-box;

	border-radius: 16px;
	border: 2px solid rgba(0, 0, 0, 0.10);
	background: #FFF;

	background: url("https://assets.univer.se/69263e2d-23c8-4c60-b47c-3797fe76e72d?auto=compress") 546px 546px;
	/*background-size: cover;*/
	/*background-clip: padding-box;*/
}

.BPUDPUL1 {
	display: inline-flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 4px;
    padding: 16px;
}

.BPUDPUL1T1 {
	color: #FFF;
	text-align: center;
	font-weight: 700;

	margin: 0px;
}

.BPUDPUB1BN1 {
	display: flex;
	width: 256px;
	height: 54px;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	border-radius: 8px;
	border: 2px solid rgba(0, 0, 0, 0.20);
	border-bottom: 4px solid rgba(0, 0, 0, 0.20);
	background: #FFF;

	color: #000;
	font-size: 16px;
	font-weight: 700;

	margin: 0px;
	cursor: pointer;
	transition: .1s;

    user-select: none;
    -moz-user-select: none;
    -webkit-text-select: none;
    -webkit-user-select: none;
}
.BPUDPUB1BN1:hover {
    filter: brightness(0.95);
}
.BPUDPUB1BN1:active {
    filter: brightness(0.9);
    height: 52px;
    margin-top: 2px;
	border-bottom: 2px solid rgba(0, 0, 0, 0.20);
}
`;

//let UpdateAvailablePopUpElement = null;
let UpdateAvailablePopUpStyle = null;

function UpdateAvailablePopUpFunction(status) {
    try {
        if (status) {
            UpdateAvailablePopUpStyle = document.createElement('style');
            UpdateAvailablePopUpStyle.type = 'text/css';
            UpdateAvailablePopUpStyle.innerHTML = UpdateAvailablePopUpCSS;
            document.head.appendChild(UpdateAvailablePopUpStyle);

            document.body.insertAdjacentHTML('beforeend', UpdateAvailablePopUpHTML);

            setTimeout(function() {
                let smthdfshfb = document.querySelector('.DPUDPUshadowThing');
                smthdfshfb.style.opacity = '1';
            }, 50);


            let dfhsfldsls = document.querySelector('#huhuiguyfty');
            dfhsfldsls.textContent = 'Duolingo Pro ' + duolingoProCurrentNewVersion + ' is now available for download.';

            let smfuerhguf = document.querySelector('#BPUDPUB1BN1DS');
            smfuerhguf.addEventListener('click', () => {
                UpdateAvailablePopUpFunction(false);
            });
        } else {
            let smthdfshfb = document.querySelector('.DPUDPUshadowThing');
            smthdfshfb.style.opacity = '0';

            setTimeout(function() {
                smthdfshfb.remove();

                //UpdateAvailablePopUpElement = null;
                UpdateAvailablePopUpStyle = null;
            }, 200);

        }
    } catch(error) {}
}


const DPAutoServerButtonMainMenuHTML = `
<div class="DPAutoServerButtonMainMenu activatorThingDPHDJ" aria-label="AutoServer">
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_952_270)">
            <rect width="30" height="30" rx="15" fill="#007AFF"/>
            <path d="M19.9424 20.5947H10.4404C7.96582 20.5947 6.04492 18.7764 6.04492 16.582C6.04492 14.8115 7.02246 13.3623 8.61523 13.0342C8.73145 11.0859 10.5361 9.77344 12.3545 10.1904C13.2773 8.88477 14.7061 8.02344 16.4766 8.02344C19.4502 8.02344 21.7334 10.2998 21.7402 13.458C23.1279 14.0322 23.9551 15.3926 23.9551 16.876C23.9551 18.9404 22.1777 20.5947 19.9424 20.5947ZM10.6318 16.1445C10.2285 16.6504 10.6934 17.1904 11.2539 16.9102L13.4688 15.7549L16.1006 17.2109C16.2578 17.2998 16.4082 17.3477 16.5586 17.3477C16.7705 17.3477 16.9688 17.2383 17.1465 17.0195L19.3818 14.1963C19.7646 13.7109 19.3203 13.1641 18.7598 13.4443L16.5312 14.5928L13.9062 13.1436C13.7422 13.0547 13.5986 13.0068 13.4414 13.0068C13.2363 13.0068 13.0381 13.1094 12.8535 13.335L10.6318 16.1445Z" fill="white"/>
        </g>
        <defs>
            <clipPath id="clip0_952_270">
                <rect width="30" height="30" rx="15" fill="white"/>
            </clipPath>
        </defs>
    </svg>
    <p class="DPAutoServerElementsMenu" style="flex: 1 0 0; color: #007AFF; font-size: 16px; font-style: normal; font-weight: 700; line-height: normal; margin: 0px; user-select: none; -moz-user-select: none; -webkit-text-select: none; -webkit-user-select: none;">AutoServer</p>
    <svg class="DPAutoServerElementsMenu" style="visibility: hidden;" width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.57031 7.85938C8.57031 8.24219 8.4375 8.5625 8.10938 8.875L2.20312 14.6641C1.96875 14.8984 1.67969 15.0156 1.33594 15.0156C0.648438 15.0156 0.0859375 14.4609 0.0859375 13.7734C0.0859375 13.4219 0.226562 13.1094 0.484375 12.8516L5.63281 7.85156L0.484375 2.85938C0.226562 2.60938 0.0859375 2.28906 0.0859375 1.94531C0.0859375 1.26562 0.648438 0.703125 1.33594 0.703125C1.67969 0.703125 1.96875 0.820312 2.20312 1.05469L8.10938 6.84375C8.42969 7.14844 8.57031 7.46875 8.57031 7.85938Z" fill="#007AFF"/>
    </svg>
</div>
`;

const DPAutoServerButtonMainMenuCSS = `
.DPAutoServerButtonMainMenu {
	display: flex;
	box-sizing: border-box;
	justify-content: center;
	align-items: center;
	gap: 16px;
	flex-shrink: 0;

	border-radius: 12px;

	cursor: pointer;
}
.DPAutoServerButtonMainMenu:hover {
	background: rgba(0, 122, 255, 0.10);
}
.DPAutoServerButtonMainMenu:active {
	filter: brightness(.9);

}

.DPAutoServerButtonMainMenuMedium {
	width: 56px;
	height: 52px;
	padding: 8px;
}
.DPAutoServerButtonMainMenu:hover .DPAutoServerElementsMenu {
	visibility: visible !important;
}

.DPAutoServerButtonMainMenuLarge {
	width: 222px;
	height: 52px;
	padding: 16px 16px 16px 17px;
}
`;

let DPAutoServerButtonMainMenuElement = null;
let DPAutoServerButtonMainMenuStyle = null;

function DPAutoServerButtonMainMenuFunction() {
    try {
        let targetDiv = document.querySelector('._3bTT7');
        if (targetDiv) {
            DPAutoServerButtonMainMenuStyle = document.createElement('style');
            DPAutoServerButtonMainMenuStyle.type = 'text/css';
            DPAutoServerButtonMainMenuStyle.innerHTML = DPAutoServerButtonMainMenuCSS;
            document.head.appendChild(DPAutoServerButtonMainMenuStyle);

            let targetDivLast = document.querySelector('[data-test="profile-tab"]');

            if (targetDiv && targetDivLast) {
                targetDiv.lastChild.insertAdjacentHTML('beforebegin', DPAutoServerButtonMainMenuHTML);

                let otherTargetDiv = document.querySelector('.DPAutoServerButtonMainMenu');
                otherTargetDiv.addEventListener('click', () => {
                    notificationCall("Under Construction", "AutoServer is under construction and currently not available. We'll let you know when you can use it.");
                });

                if (targetDiv.offsetWidth === 56) {
                    otherTargetDiv.classList.add('DPAutoServerButtonMainMenuMedium');
                    let otherDeleteDiv = document.querySelector('.DPAutoServerElementsMenu');
                    otherDeleteDiv.remove();
                    otherDeleteDiv = document.querySelector('.DPAutoServerElementsMenu');
                    otherDeleteDiv.remove();

                    fdhuf();

                    function fdhuf() {
                        if (targetDiv.offsetWidth !== 56) {
                            otherTargetDiv.remove();
                            setTimeout(function() {
                                DPAutoServerButtonMainMenuFunction();
                            }, 50);
                        } else {
                            setTimeout(function() {
                                fdhuf();
                            }, 100);
                        }
                    }

                } else {
                    otherTargetDiv.classList.add('DPAutoServerButtonMainMenuLarge');

                    urhef();

                    function urhef() {
                        if (targetDiv.offsetWidth === 56) {
                            otherTargetDiv.remove();
                            setTimeout(function() {
                                DPAutoServerButtonMainMenuFunction();
                            }, 50);
                        } else {
                            setTimeout(function() {
                                urhef();
                            }, 100);
                        }
                    }
                }
            } else {
                setTimeout(function() {
                    DPAutoServerButtonMainMenuFunction();
                }, 100);
            }
        } else {
            setTimeout(function() {
                DPAutoServerButtonMainMenuFunction();
            }, 1000);
        }
    } catch(error) {}
}

DPAutoServerButtonMainMenuFunction();


const DuolingoProCounterOneHTML = `
<div class="DPCOBlockBoxOneSectionThree" style="transition: all 0.5s cubic-bezier(0.16, 1, 0.32, 1); position: fixed; top: 16px; right: 16px; z-index: 1024; display: inline-flex; padding: 8px 12px; flex-direction: column; justify-content: center; align-items: center; border-radius: 32px; border: 2px solid rgb(var(--color-swan), 0.84); background: rgb(var(--color-snow), 0.84); box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.08); backdrop-filter: blur(16px); color: rgb(var(--color-eel), 0.64); font-size: 16px; font-weight: 700; z-index: 1984;">Left</div>
`;

let injectedDuolingoProCounterOneElement = null;

function DuolingoProCounterOneFunction() {
    // || window.location.pathname.includes('/practice')
    if (window.location.pathname.includes('/lesson') && wasAutoSolverBoxRepeatStartButtonPressed) {
        if (!injectedDuolingoProCounterOneElement) {
            document.body.insertAdjacentHTML('beforeend', DuolingoProCounterOneHTML);
            injectedDuolingoProCounterOneElement = DuolingoProCounterOneHTML;

            let DuolingoProShadeStatusOne = document.querySelector('.DPCOBlockBoxOneSectionThree');
            if (DuolingoProSettingsNeverEndMode) {
                DuolingoProShadeStatusOne.textContent = '∞';
            } else if (autoSolverBoxRepeatAmount === 1) {
                DuolingoProShadeStatusOne.textContent = '1 Lesson Left';
            } else if (autoSolverBoxRepeatAmount === 0) {
                DuolingoProShadeStatusOne.textContent = 'Last Lesson';
            } else if (autoSolverBoxRepeatAmount) {
                DuolingoProShadeStatusOne.textContent = String(autoSolverBoxRepeatAmount + ' Lessons Left');
            }
        }
    } else {
        if (injectedDuolingoProCounterOneElement) {
            let DuolingoProShadeStatusOne = document.querySelector('.DPCOBlockBoxOneSectionThree');
            if (DuolingoProShadeStatusOne) {
                DuolingoProShadeStatusOne.remove();
            }
            injectedDuolingoProShadeElement = null;
        }
    }
}

setInterval(DuolingoProCounterOneFunction, 100);




const CurrentIssuesPopUpHTML = `
<div class="DPIPUShadowThing">
    <div class="DPIPUB1">
        <div class="DPIPUL1">
            <h2 class="DPIPUL1T1">Active Issues</h2>
            <p class="DPIPUL1T2" id="DPIPUL1T2DATE">Updated: December 11, 2023</p>
        </div>
        <div class="DPIPUL2">
            <div class="DPIPUL2TI1">
                <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z" fill="#FF2D55"/>
                </svg>
                <p class="DPIPUL2TI1T1 DPIPUL2TI1T1R">Stories are not supported yet.</p>
            </div>
            <div class="DPIPUL2TI1">
                <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.64844 17.1172C4.125 17.1172 0.398438 13.3906 0.398438 8.85938C0.398438 4.33594 4.11719 0.609375 8.64844 0.609375C13.1719 0.609375 16.8984 4.33594 16.8984 8.85938C16.8984 13.3906 13.1797 17.1172 8.64844 17.1172ZM8.65625 10.0312C9.19531 10.0312 9.50781 9.72656 9.53906 9.16406L9.66406 5.79688C9.69531 5.21094 9.26562 4.80469 8.64844 4.80469C8.02344 4.80469 7.60156 5.20312 7.63281 5.79688L7.75781 9.17188C7.78125 9.72656 8.10156 10.0312 8.65625 10.0312ZM8.65625 12.8516C9.27344 12.8516 9.75 12.4609 9.75 11.8594C9.75 11.2734 9.28125 10.875 8.65625 10.875C8.03125 10.875 7.54688 11.2734 7.54688 11.8594C7.54688 12.4609 8.03125 12.8516 8.65625 12.8516Z" fill="#FF9500"/>
                </svg>
                <p class="DPIPUL2TI1T1 DPIPUL2TI1T1O">AutoSolve This Lesson doesn’t work yet.</p>
            </div>
            <div class="DPIPUL2TI1">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.64844 16.6172C4.125 16.6172 0.398438 12.8906 0.398438 8.35938C0.398438 3.83594 4.11719 0.109375 8.64844 0.109375C13.1719 0.109375 16.8984 3.83594 16.8984 8.35938C16.8984 12.8906 13.1797 16.6172 8.64844 16.6172ZM7.78906 12.2812C8.125 12.2812 8.42969 12.1094 8.63281 11.8125L12.2578 6.26562C12.3984 6.0625 12.4766 5.85156 12.4766 5.65625C12.4766 5.17188 12.0469 4.82812 11.5781 4.82812C11.2734 4.82812 11.0156 4.99219 10.8125 5.32031L7.76562 10.1641L6.40625 8.48438C6.19531 8.23438 5.97656 8.125 5.69531 8.125C5.21875 8.125 4.82812 8.50781 4.82812 8.99219C4.82812 9.21875 4.89844 9.41406 5.07812 9.63281L6.91406 11.8203C7.16406 12.125 7.4375 12.2812 7.78906 12.2812Z" fill="#34C759"/>
                </svg>
                <p class="DPIPUL2TI1T1 DPIPUL2TI1T1G">Chests should now open automatically, if they still don’t, submit a feedback with the name of your course.</p>
            </div>
            <div class="DPIPUL2TI2">
                <p class="DPIPUL2TI1T1">Next Update Tracker</p>
                <div class="DPIPUL2TI1">
                    <svg width="17" height="18" viewBox="0 0 17 18" fill="rgb(var(--color-swan))" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.64844 17.1172C4.125 17.1172 0.398438 13.3906 0.398438 8.85938C0.398438 4.33594 4.11719 0.609375 8.64844 0.609375C13.1719 0.609375 16.8984 4.33594 16.8984 8.85938C16.8984 13.3906 13.1797 17.1172 8.64844 17.1172ZM8.64844 15.0625C12.0859 15.0625 14.8438 12.2969 14.8438 8.85938C14.8438 5.42969 12.0781 2.66406 8.64844 2.66406C5.21094 2.66406 2.46094 5.42969 2.46094 8.85938C2.46094 12.2969 5.21875 15.0625 8.64844 15.0625Z"/>
                    </svg>
                    <div class="DPIPUL2TI2TG1">
                        <div class="DPIPUL2TI2TG1TG1"></div>
                    </div>
                    <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.64844 17.1172C4.125 17.1172 0.398438 13.3906 0.398438 8.85938C0.398438 4.33594 4.11719 0.609375 8.64844 0.609375C13.1719 0.609375 16.8984 4.33594 16.8984 8.85938C16.8984 13.3906 13.1797 17.1172 8.64844 17.1172ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z" fill="#34C759"/>
                    </svg>
                </div>
            </div>
        </div>
        <div class="DPIPUL3" style="display: flex; justify-content: center; align-items: flex-start; gap: 8px; align-self: stretch;">
            <div class="DPIPUL3B1">SEE FIXES</div>
            <div class="DPIPUL3B1" id="DPIPUL3BDissmissID">OK</div>
        </div>
    </div>
</div>
`;

const CurrentIssuesPopUpCSS = `
.DPIPUShadowThing {
	display: flex;
	width: 100%;
	height: 100vh;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;

	position: fixed;
	top: 0px;
	bottom: 0px;
	right: 0px;
	left: 0px;
    z-index: 2;

	background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    opacity: 0;
    transition: .2s;
}

.DPIPUB1 {
	display: flex;
	width: 544px;
	max-height: 544px;
	padding: 16px;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 16px;
	flex-shrink: 0;

	border-radius: 16px;
	border: 2px solid rgb(var(--color-swan));
	background: rgb(var(--color-snow));
}

.DPIPUL1 {
	display: flex;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
}

.DPIPUL1T1 {
	color: rgb(var(--color-eel));
	font-size: 24px;
	font-weight: 700;

	margin: 0px;
}

.DPIPUL1T2 {
	color: rgb(var(--color-eel), .4);
	font-size: 16px;
	font-weight: 700;

	margin: 0px;
}

.DPIPUL2 {
	display: flex;
	width: 100%;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	gap: 16px;
}

.DPIPUL2TI1 {
	display: flex;
	align-items: center;
	gap: 8px;
	align-self: stretch;
}

.DPIPUL2TI1T1 {
	flex: 1 0 0;

	font-size: 16px;
	font-weight: 700;

	margin: 0px;
}

.DPIPUL2TI1T1R {
	color: #FF2D55;
}
.DPIPUL2TI1T1O {
	color: #FF9500;
}
.DPIPUL2TI1T1G {
	color: #34C759;
}

.DPIPUL2TI2 {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	gap: 8px;
	align-self: stretch;
}

.DPIPUL2TI2TG1 {
	display: flex;
	height: 8px;
	padding-right: 0px;
	align-items: center;
	flex: 1 0 0;

	border-radius: 8px;
	background: rgb(var(--color-swan));
}

.DPIPUL2TI2TG1TG1 {
	display: flex;
	height: 8px;
	width: 60%;

	border-radius: 8px;
	background: linear-gradient(117deg, #34C759 16.66%, #007AFF 50%, #AF52DE 83.34%);
}

.DPIPUL3B1 {
	display: flex;
	height: 54px;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	flex: 1 0 0;

	border-radius: 8px;
	border: 2px solid rgb(var(--color-swan));
    border-bottom: 4px solid rgb(var(--color-swan));
    background: rgb(var(--color-snow));


	color: rgb(var(--color-eel));
	font-size: 16px;
	font-weight: 700;

	cursor: pointer;
	transition: .1s;

	user-select: none;
    -moz-user-select: none;
    -webkit-text-select: none;
    -webkit-user-select: none;
}
.DPIPUL3B1:hover {
    filter: brightness(0.95);
}
.DPIPUL3B1:active {
    filter: brightness(0.9);

    margin-top: 2px;
    height: 52px;
    border-bottom: 2px solid rgb(var(--color-swan));
}
`;

let CurrentIssuesPopUpElement = null;
let CurrentIssuesPopUpStyle = null;

function CurrentIssuesPopUpFunction(status) {
    try {
        if (status) {
            //notificationCall("smth", "s,th");
            CurrentIssuesPopUpStyle = document.createElement('style');
            CurrentIssuesPopUpStyle.type = 'text/css';
            CurrentIssuesPopUpStyle.innerHTML = CurrentIssuesPopUpCSS;
            document.head.appendChild(CurrentIssuesPopUpStyle);

            document.body.insertAdjacentHTML('beforeend', CurrentIssuesPopUpHTML);

            setTimeout(function() {
                let djhsafjkds = document.querySelector('.DPIPUShadowThing');
                djhsafjkds.style.opacity = '1';
            }, 50);

            let gfhdsfjdsh = document.querySelector('#DPIPUL3BDissmissID');
            gfhdsfjdsh.addEventListener('click', () => {
                CurrentIssuesPopUpFunction(false);
            });
        } else {
            let djhsafjkds = document.querySelector('.DPIPUShadowThing');
            djhsafjkds.style.opacity = '0';

            setTimeout(function() {
                djhsafjkds.remove();

                CurrentIssuesPopUpElement = null;
                CurrentIssuesPopUpStyle = null;
            }, 200);

        }
    } catch(error) {}
}














function solving() {
    if (solvingIntervalId) {
        clearInterval(solvingIntervalId);
        solvingIntervalId = undefined;
        document.getElementById("solveAllButton").innerText = "SOLVE ALL";
        isAutoMode = false;
    } else {
        document.getElementById("solveAllButton").innerText = "PAUSE SOLVE";
        isAutoMode = true;
        solvingIntervalId = setInterval(solve, 800);
    }
}

function solve() {
    const selAgain = document.querySelectorAll('[data-test="player-practice-again"]');
    const practiceAgain = document.querySelector('[data-test="player-practice-again"]');

    function nextClickFunc() {
        if (isAutoMode) {
            setTimeout(function() {
                try {
                    let next = document.querySelector('[data-test="player-next"]');
                    if (next) {
                        next.click();
                    }
                    return;
                } catch (error) {}
            }, 50);
        }
    }

    try {
        let noideatwo = document.querySelector('[data-test="practice-hub-ad-no-thanks-button"]');
        if (noideatwo) {
            noideatwo.click();
        }
    } catch (error) {}
    try {
        let noideathree = document.querySelector('.vpDIE');
        if (noideathree) {
            noideathree.click();
        }
    } catch (error) {}
    try {
        let noideafour = document.querySelector('[data-test="plus-no-thanks"]');
        if (noideafour) {
            noideafour.click();
        }
    } catch (error) {}

    if (selAgain.length === 1 && isAutoMode) {
        // Make sure it's the `practice again` button
        //if (selAgain[0].innerHTML.toLowerCase() === 'practice again') {
        // Click the `practice again` button
        selAgain[0].click();
        // Terminate
        return;
        //}
    }
    if (practiceAgain !== null && isAutoMode) {
        practiceAgain.click();
        return;
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

    if (document.querySelectorAll('[data-test*="challenge-speak"]').length > 0) {
        if (debug) {
            document.getElementById("solveAllButton").innerText = 'Challenge Speak';
        }
        const buttonSkip = document.querySelector('button[data-test="player-skip"]');
        if (buttonSkip) {
            buttonSkip.click();
        }
        nextClickFunc();
    } else if (window.sol.type === 'listenMatch') {
        // listen match question
        if (debug) {
            document.getElementById("solveAllButton").innerText = 'Listen Match';
        }
        const buttonSkip = document.querySelector('button[data-test="player-skip"]');
        if (buttonSkip) {
            buttonSkip.click();
        }
        nextClickFunc();
    } else if (document.querySelectorAll('[data-test="challenge-choice"]').length > 0) {
        // choice challenge (TODO)
        if (debug) {
            document.getElementById("solveAllButton").innerText = 'Challenge Choice';
        }
        // text input (if one exists)
        if (document.querySelectorAll('[data-test="challenge-text-input"]').length > 0) {
            if (debug) {
                document.getElementById("solveAllButton").innerText = 'Challenge Choice with Text Input';
            }
            let elm = document.querySelectorAll('[data-test="challenge-text-input"]')[0];
            let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0].split(/(?<=^\S+)\s/)[1] : (window.sol.displayTokens ? window.sol.displayTokens.find(t => t.isBlank).text : window.sol.prompt));
            let inputEvent = new Event('input', {
                bubbles: true
            });

            elm.dispatchEvent(inputEvent);
        }
        // choice
        if (window.sol.correctTokens !== undefined) {
            try {
                correctTokensRun();
                nextButton.click()
            } catch (error) {
                notificationCall("first error", "first error");
            }
        } else if (window.sol.correctIndex !== undefined) {
            try {
                document.querySelectorAll('[data-test="challenge-choice"]')[window.sol.correctIndex].click();
                nextButton.click();
            } catch (error) {
                notificationCall("second error", "second error");
            }
        } else if (window.sol.correctSolutions !== undefined) {
            //notificationCall("third", "third");
            try {
                var xpath = `//*[@data-test="challenge-choice" and ./*[@data-test="challenge-judge-text"]/text()="${window.sol.correctSolutions[0].split(/(?<=^\S+)\s/)[0]}"]`;
                document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
                nextButton.click();
            } catch (error) {
                //notificationCall("third error", "third error");
                try {
                    document.querySelectorAll('[data-test="challenge-choice"]')[window.sol.correctIndex].click();
                    nextButton.click();
                } catch (error) {
                    //notificationCall("third error - attempt fail", "third error fix attempt failed");
                    try {
                        correctTokensRun();
                    } catch (error) {
                        //notificationCall("Third Error - Second Fix Attempt Fail", "Third error fix secondattempt failed");
                    }
                }
            }
            console.error('third 3');
        }
        nextClickFunc();
    } else if (document.querySelectorAll('[data-test$="challenge-tap-token"]').length > 0) {
        // match correct pairs challenge
        if (window.sol.pairs !== undefined) {
            if (debug) {
                document.getElementById("solveAllButton").innerText = 'Pairs';
            }
            let nl = document.querySelectorAll('[data-test$="challenge-tap-token"]');
            if (document.querySelectorAll('[data-test="challenge-tap-token-text"]').length === nl.length) {
                window.sol.pairs?.forEach((pair) => {
                    for (let i = 0; i < nl.length; i++) {
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
                })
            }
        } else if (window.sol.correctTokens !== undefined) {
            if (debug) {
                document.getElementById("solveAllButton").innerText = 'Token Run';
            }
            correctTokensRun();
            nextButton.click()
        } else if (window.sol.correctIndices !== undefined) {
            if (debug) {
                document.getElementById("solveAllButton").innerText = 'Indices Run';
            }
            correctIndicesRun();
        }
        nextClickFunc();
    } else if (document.querySelectorAll('[data-test="challenge-tap-token-text"]').length > 0) {
        if (debug) {
            document.getElementById("solveAllButton").innerText = 'Challenge Tap Token Text';
        }
        // fill the gap challenge
        correctIndicesRun();
        nextClickFunc();
    } else if (document.querySelectorAll('[data-test="challenge-text-input"]').length > 0) {
        if (debug) {
            document.getElementById("solveAllButton").innerText = 'Challenge Text Input';
        }
        let elm = document.querySelectorAll('[data-test="challenge-text-input"]')[0];
        let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0] : (window.sol.displayTokens ? window.sol.displayTokens.find(t => t.isBlank).text : window.sol.prompt));
        let inputEvent = new Event('input', {
            bubbles: true
        });

        elm.dispatchEvent(inputEvent);
        nextClickFunc();
    } else if (document.querySelectorAll('[data-test*="challenge-partialReverseTranslate"]').length > 0) {
        if (debug) {
            document.getElementById("solveAllButton").innerText = 'Partial Reverse';
        }
        let elm = document.querySelector('[data-test*="challenge-partialReverseTranslate"]')?.querySelector("span[contenteditable]");
        let nativeInputNodeTextSetter = Object.getOwnPropertyDescriptor(Node.prototype, "textContent").set
        nativeInputNodeTextSetter.call(elm, window.sol?.displayTokens?.filter(t => t.isBlank)?.map(t => t.text)?.join()?.replaceAll(',', ''));
        let inputEvent = new Event('input', {
            bubbles: true
        });

        elm.dispatchEvent(inputEvent);
        nextClickFunc();
    } else if (document.querySelectorAll('textarea[data-test="challenge-translate-input"]').length > 0) {
        if (debug) {
            document.getElementById("solveAllButton").innerText = 'Challenge Translate Input';
        }
        const elm = document.querySelector('textarea[data-test="challenge-translate-input"]');
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0] : window.sol.prompt);

        let inputEvent = new Event('input', {
            bubbles: true
        });

        elm.dispatchEvent(inputEvent);
        nextClickFunc();
    }
    nextButton.click()
}

function correctTokensRun() {
    const all_tokens = document.querySelectorAll('[data-test$="challenge-tap-token"]');
    const correct_tokens = window.sol.correctTokens;
    const clicked_tokens = [];
    correct_tokens.forEach(correct_token => {
        const matching_elements = Array.from(all_tokens).filter(element => element.textContent.trim() === correct_token.trim());
        if (matching_elements.length > 0) {
            const match_index = clicked_tokens.filter(token => token.textContent.trim() === correct_token.trim()).length;
            if (match_index < matching_elements.length) {
                matching_elements[match_index].click();
                clicked_tokens.push(matching_elements[match_index]);
            } else {
                clicked_tokens.push(matching_elements[0]);
            }
        }
    });
}

function correctIndicesRun() {
    if (window.sol.correctIndices) {
        window.sol.correctIndices?.forEach(index => {
            document.querySelectorAll('div[data-test="word-bank"] [data-test="challenge-tap-token-text"]')[index].click();
        });
        // nextButton.click();
    }
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
    if (messageValue) {
        const { data, error } = await supabase
        .from('settings_stuff')
        .insert([{ text: messageValue, value: value, randomValue: randomValue, version: duolingoProCurrentVersionShort }]);

        if (error) {
            console.error("Error sending message:", error);
        } else {
            console.log("Message sent successfully:", data);
        }
    } else {
        console.error("Message text is empty.");
    }
}

async function sendFeedbackServer(feedbackTextOne, feedbackTypeOne) {
    let randomNameForSendFeedbackFile;

    try {
        function generateRandomString(length) {
            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
        randomNameForSendFeedbackFile = generateRandomString(8);
    } catch (error) {
    }

    if (feedbackTextOne) {
        try {
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];

                const bucket = await supabase.storage.from('SendFeedbackImages');

                const uploadResponse = await bucket.upload(randomValue + "-" + randomNameForSendFeedbackFile, file);

                // Get the public URL for the uploaded file
                const publicUrl = uploadResponse.publicUrl;

                const { data, error } = await supabase
                .from('sentFeedback')
                .insert([{ text: feedbackTextOne, textType: feedbackTypeOne, randomValue: randomValue, version: duolingoProCurrentVersion, imageKey: randomNameForSendFeedbackFile }])
                if (error) {
                    console.error("Error sending message:", error);
                    sendFeedbackStatus = 'error';
                } else {
                    console.log("Message sent successfully:", data);
                }

                sendFeedbackStatus = 'true';
            } else {
                const { data, error } = await supabase
                .from('sentFeedback')
                .insert([{ text: feedbackTextOne, textType: feedbackTypeOne, randomValue: randomValue, version: duolingoProCurrentVersion }])
                if (error) {
                    console.error("Error sending message:", error);
                    sendFeedbackStatus = 'error';
                } else {
                    console.log("Message sent successfully:", data);
                    sendFeedbackStatus = 'true';
                }

            }
        } catch (error) {
            sendFeedbackStatus = 'error';
        }
    } else {
        console.error("Message text is empty.");
        sendFeedbackStatus = 'empty';
    }
}

async function analyticsLogsSend(text, value) {
    if (text) {
        const { data, error } = await supabase
        .from('analytics_logs')
        .insert([{ text: text, value: value, randomValue: randomValue, version: duolingoProCurrentVersionShort }]);

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
    if (value) {
        DuolingoProAmountOfQuestionsEverSolved++;
        localStorage.setItem('DuolingoProAmountOfQuestionsEverSolved', DuolingoProAmountOfQuestionsEverSolved);
    } else {
        console.error("Message text is empty.");
    }
}

async function versionServerStuff(option, status, to, from) {
    if (option === 'download') {
        if (status) {
            const { data, error } = await supabase
            .from('update_stuff')
            .insert([{ status: status, to: to, from: from, randomValue: randomValue }]);

            if (error) {
                console.error("Error sending message:", error);
                downloadStuffVar = 'error';
            } else {
                console.log("Message sent successfully:", data);
                downloadStuffVar = 'true';
            }
        } else {
            console.error("Message text is empty.");
            downloadStuffVar = 'empty';
        }
    } else if (option === 'update') {
        if (status) {
            const { data, error } = await supabase
            .from('DownloadStuff')
            .insert([{ status: status, to: to, from: from, randomValue: randomValue }]);

            if (error) {
                console.error("Error sending message:", error);
                updateStuffVar = 'error';
            } else {
                console.log("Message sent successfully:", data);
                updateStuffVar = 'true';
            }
        } else {
            console.error("Message text is empty.");
            updateStuffVar = 'empty';
        }
    }
}
