// ==UserScript==
// @name         Duolingo Pro BETA
// @namespace    Violentmonkey Scripts
// @version      2.0BETA9.6.1
// @description  Duolingo Auto Solver Tool - Working March 2024
// @author       anonymoushackerIV
// @match        https://*.duolingo.com/*
// @grant        none
// @license      MIT
// @require      https://unpkg.com/@supabase/supabase-js@2.12.1
// @icon         https://github.com/anonymoushackerIV/Duolingo-Pro-Assets/blob/main/images/Duolingo-Pro-Icon.png?raw=true
// ==/UserScript==

let solvingIntervalId;
let isAutoMode = false;
let isSolving = false;
let isTokenRunning = false;

const debug = false;

let ASB969 = false;
let ASTL464 = false;
let duolingoProCurrentVersionShort = "2.0B9.6.1";
let duolingoProCurrentVersion = "2.0 BETA 9.6.1";
let duolingoProFormalCurrentVersion = "2.0BETA9.6.1";

let solveSpeed;
if (isNaN(parseFloat(localStorage.getItem('duopro.autoSolveDelay')))) {
    solveSpeed = 0.8;
    localStorage.setItem('duopro.autoSolveDelay', solveSpeed);
} else {
    solveSpeed = parseFloat(localStorage.getItem('duopro.autoSolveDelay'));
}

let autoSolverBoxRepeatAmount = 0;
autoSolverBoxRepeatAmount = Number(sessionStorage.getItem('autoSolverBoxRepeatAmount'));

let DuolingoProAmountOfQuestionsEverSolved = 0;
DuolingoProAmountOfQuestionsEverSolved = Number(localStorage.getItem('DuolingoProAmountOfQuestionsEverSolved'));

let ProBlockBannerOneVisible = false;
if (JSON.parse(localStorage.getItem('ProBlockBannerOneVisible')) === null) {
    ProBlockBannerOneVisible = false;
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

let DLPpromotionBubbleVisibility;
if (JSON.parse(localStorage.getItem('DLP4Uz53cm6wjnOG7tY')) === null) {
    DLPpromotionBubbleVisibility = true;
} else {
    DLPpromotionBubbleVisibility = JSON.parse(localStorage.getItem('DLP4Uz53cm6wjnOG7tY'));
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
} catch (error) {}
try {
    localStorage.removeItem('wasWhatsNewInTwoPointZeroBetaFourFinished');
} catch (error) {}
try {
    localStorage.removeItem('wasWhatsNewInTwoPointZeroBetaSixFinished');
} catch (error) {}
try {
    localStorage.removeItem('wasWhatsNewInTwoPointZeroBetaSevenFinished');
} catch (error) {}
// DuolingoProSettingsHumaneSolvingMode
// Whats New Variables End

let wasDuolingoProSettingsButtonOnePressed = false;

// Duolingo Pro Settings Variables Start

//moved here
let AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox = true;
let AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox = true;
//moved here

let AutoSolverSettingsShowAutoSolverBox = true;
if (JSON.parse(localStorage.getItem('AutoSolverSettingsShowAutoSolverBox')) === null) {
    AutoSolverSettingsShowAutoSolverBox = true; // default
} else if (JSON.parse(localStorage.getItem('AutoSolverSettingsShowAutoSolverBox')) === false) {
    AutoSolverSettingsShowAutoSolverBox = JSON.parse(localStorage.getItem('AutoSolverSettingsShowAutoSolverBox'));

    //AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox = false;
    //localStorage.setItem('AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox', AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox);
} else {
    AutoSolverSettingsShowAutoSolverBox = JSON.parse(localStorage.getItem('AutoSolverSettingsShowAutoSolverBox'));
}

let AutoSolverSettingsLowPerformanceMode = false;
if (JSON.parse(localStorage.getItem('AutoSolverSettingsLowPerformanceMode')) === null) {
    AutoSolverSettingsLowPerformanceMode = false; // default
} else {
    AutoSolverSettingsLowPerformanceMode = JSON.parse(localStorage.getItem('AutoSolverSettingsLowPerformanceMode'));
}

let DuolingoProSettingsProBlockMode = false;
if (JSON.parse(localStorage.getItem('DuolingoProSettingsProBlockMode')) === null) {
    DuolingoProSettingsProBlockMode = false; // default
} else {
    DuolingoProSettingsProBlockMode = JSON.parse(localStorage.getItem('DuolingoProSettingsProBlockMode'));
    if (!DuolingoProSettingsProBlockMode) {
        ProBlockBannerOneVisible = true;
        localStorage.setItem('ProBlockBannerOneVisible', ProBlockBannerOneVisible);
    }
}

let DuolingoProSettingsTurboSolveMode = false;
if (JSON.parse(localStorage.getItem('DuolingoProSettingsTurboSolveMode')) === null) {
    DuolingoProSettingsTurboSolveMode = false;
} else {
    DuolingoProSettingsTurboSolveMode = JSON.parse(localStorage.getItem('DuolingoProSettingsTurboSolveMode'));
}

let DuolingoProSettingsNeverEndMode = false;
if (JSON.parse(localStorage.getItem('DuolingoProSettingsNeverEndMode')) === null) {
    DuolingoProSettingsNeverEndMode = false;
} else {
    DuolingoProSettingsNeverEndMode = JSON.parse(localStorage.getItem('DuolingoProSettingsNeverEndMode'));
}

let DuolingoProShadeLessonsMode = true;
if (JSON.parse(localStorage.getItem('DuolingoProShadeLessonsMode')) === null) {
    DuolingoProShadeLessonsMode = true;
} else {
    DuolingoProShadeLessonsMode = JSON.parse(localStorage.getItem('DuolingoProShadeLessonsMode'));
}

let DuolingoProAntiStuckProtectionMode = true;
if (JSON.parse(localStorage.getItem('DuolingoProAntiStuckProtectionMode')) === null) {
    DuolingoProAntiStuckProtectionMode = true;
} else {
    DuolingoProAntiStuckProtectionMode = JSON.parse(localStorage.getItem('DuolingoProAntiStuckProtectionMode'));
}

let DuolingoProSettingsUpdateNotifications = true;
if (JSON.parse(localStorage.getItem('DuolingoProSettingsUpdateNotifications')) === null) {
    DuolingoProSettingsUpdateNotifications = true;
} else {
    DuolingoProSettingsUpdateNotifications = JSON.parse(localStorage.getItem('DuolingoProSettingsUpdateNotifications'));
}

let DuolingoProSettingsSolveIntervalValue = true;
if (JSON.parse(localStorage.getItem('DuolingoProSettingsSolveIntervalValue')) === null) {
    DuolingoProSettingsSolveIntervalValue = true;
} else {
    DuolingoProSettingsSolveIntervalValue = JSON.parse(localStorage.getItem('DuolingoProSettingsSolveIntervalValue'));
}
// Duolingo Pro Settings Variables End


function createButton(id, text, styleClass, eventHandlers) {
    const button = document.createElement('button');
    button.id = id;
    button.innerText = text;
    button.className = styleClass;
    Object.keys(eventHandlers).forEach(event => {
        button.addEventListener(event, eventHandlers[event]);
    });
    return button;
}

function addButtons() {
    if (window.location.pathname === '/learn' && document.querySelector('a[data-test="global-practice"]')) {
        return;
    }

    if (document.querySelector("#solveAllButton")) {
        return;
    }

    const original = document.querySelector('[data-test="player-next"]');
    const storiesContinue = document.querySelector('[data-test="stories-player-continue"]');
    const target = original || storiesContinue;

    if (!target) {
        const startButton = document.querySelector('[data-test="start-button"]');
        if (!startButton) {
            return;
        }
        const solveAllButton = createButton("solveAllButton", "COMPLETE SKILL", "solve-all-btn", {
            'click': () => {
                solving(true);
                setInterval(() => {
                    const startButton = document.querySelector('[data-test="start-button"]');
                    if (startButton && startButton.innerText.startsWith("START")) {
                        startButton.click();
                    }
                }, 1000);
                startButton.click();
            }
        });
        startButton.parentNode.appendChild(solveAllButton);
    } else {
        const wrapper = document.querySelector('._10vOG, ._2L_r0');
        wrapper.style.display = "flex";

        const buttonsCSS = document.createElement('style');
        buttonsCSS.innerHTML = `
        .solve-btn {
            position: relative;
            min-width: 150px;
            font-size: 17px;
            border: none;
            border-bottom: 4px solid #2b70c9;
            border-radius: 16px;
            padding: 13px 16px;
            transition: filter .0s;
            font-weight: 700;
            letter-spacing: .8px;
            background: #1cb0f6;
            color: rgb(var(--color-snow));
            margin-left: 20px;
            cursor: pointer;
        }
        .pause-btn {
            position: relative;
            min-width: 100px;
            font-size: 17px;
            border: none;
            border-bottom: 4px solid #ff9600;
            border-radius: 16px;
            padding: 13px 16px;
            transition: filter .0s;
            font-weight: 700;
            letter-spacing: .8px;
            background: #ffc800;
            color: rgb(var(--color-snow));
            margin-left: 20px;
            cursor: pointer;
        }
        .auto-solver-btn:hover {
            filter: brightness(1.1);
        }
        .auto-solver-btn:active {
            border-bottom: 0px;
            margin-bottom: 4px;
            top: 4px;
        }
        `;
        document.head.appendChild(buttonsCSS);

        const solveCopy = createButton('solveAllButton', solvingIntervalId ? 'PAUSE SOLVE' : 'SOLVE ALL', 'auto-solver-btn solve-btn', {
            'click': solving
        });

        const pauseCopy = createButton('', 'SOLVE', 'auto-solver-btn pause-btn', {
            'click': solve
        });

        target.parentElement.appendChild(pauseCopy);
        target.parentElement.appendChild(solveCopy);
    }
}
setInterval(addButtons, 500);

const DLPuniversalCSS = `
:root {
    --DLP-red: #FF3B30;
    --DLP-orange: #FF9500;
    --DLP-yellow: #FFCC00;
    --DLP-green: 52, 199, 89;
    --DLP-cyan: #5AC8FA;
    --DLP-blue: 0, 122, 255;
    --DLP-indigo: #5856D6;
    --DLP-purple: #AF52DE;
    --DLP-pink: 255, 45, 85;
}

.noSelect {
    user-select: none;
    -moz-user-select: none;
    -webkit-text-select: none;
    -webkit-user-select: none;
}

.DPLBoxStyleT1 {
    display: flex;
    width: 512px;
    max-height: 84%;
    gap: 8px;
    padding: 16px;
    justify-content: center;
    align-items: center;
	flex-direction: column;

    border-radius: 16px;
    border: 2px solid rgb(var(--color-swan));
    background: rgb(var(--color-snow));
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.10);

    transition: .2s;
    <!-- transform: scale(0.8); -->

}
.DPLBoxShadowStyleT1 {
    position: fixed;
    display: flex;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;

    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(8px);
    opacity: 0;
    transition: .2s;

    z-index: 128;
    top: 0px;
    bottom: 0px;
    right: 0px;
    left: 0px;
}

.VStack {
    display: flex;
    flex-direction: column;
}
.HStack {
    display: flex;
    flex-direction: row;
}

.selfFill {
    align-self: stretch;
}

.paragraphText {
    font-size: 16px;
    font-weight: 700;

    margin: 0;
}

.DPLPrimaryButtonStyleT1 {
    display: flex;
    height: 54px;
    padding: 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    flex: 1 0 0;

    border-radius: 8px;
    border: 2px solid rgba(0, 0, 0, 0.20);
    border-bottom: 4px solid rgba(0, 0, 0, 0.20);
    background: rgb(var(--DLP-blue));

    color: #fff;
    font-weight: 700;

    transition: .1s;
    cursor: pointer;
}
.DPLPrimaryButtonStyleT1:hover {
    filter: brightness(0.95);
}
.DPLPrimaryButtonStyleT1:active {
    filter: brightness(0.9);
    height: 52px;
    margin-top: 2px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.20);
}
.DPLPrimaryButtonDisabledStyleT1 {
    display: flex;

    height: 52px;
    margin-top: 2px;

    padding: 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    flex: 1 0 0;

    border-radius: 8px;
    border: 2px solid rgba(0, 0, 0, 0.20);
    opacity: 0.5;
    background: rgb(var(--DLP-blue));

    color: #fff;
    font-weight: 700;

    transition: .1s;
    cursor: pointer;
}

.DPLSecondaryButtonStyleT1 {
    display: flex;
    height: 54px;
    padding: 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;

    border-radius: 8px;
    border: 2px solid rgb(var(--DLP-blue), 0.1);
    border-bottom: 4px solid rgb(var(--DLP-blue), 0.1);
    background: rgb(var(--DLP-blue), 0.1);

    color: rgb(var(--DLP-blue));
    font-weight: 700;

    transition: .1s;
    cursor: pointer;
}
.DPLSecondaryButtonStyleT1:hover {
    filter: brightness(0.95);
}
.DPLSecondaryButtonStyleT1:active {
    filter: brightness(0.9);
    height: 52px;
    margin-top: 2px;
    border-bottom: 2px solid rgb(var(--DLP-blue), 0.1);
}


.DLPSettingsToggleT1 {
    display: inline-flex;
    height: 48px;
    width: 64px;
    justify-content: flex-end;
    align-items: center;
    flex-shrink: 0;

    border-radius: 16px;

    cursor: pointer;
}

.DLPSettingsToggleT1B1 {
    display: flex;
    height: 32px;
    width: 32px;
    justify-content: center;
    align-items: center;

    border-radius: 8px;

    transition: .2s;
}

.DLPSettingsToggleT1:hover .DLPSettingsToggleT1B1 {
    filter: brightness(0.9);
    transform: scale(1.05);
}

.DLPSettingsToggleT1:active .DLPSettingsToggleT1B1 {
    filter: brightness(0.9);
    transform: scale(0.9);
}

.DLPSettingsToggleT1ON {
    border: 2px solid rgba(52, 199, 89, 0.1);
    background: rgba(var(--DLP-green), 0.1);
}

.DLPSettingsToggleT1ONB1 {
    border: 2px solid rgba(0, 0, 0, 0.1);
    background: rgba(var(--DLP-green));
    margin-right: 6px;
}

.DLPSettingsToggleT1OFF {
    border: 2px solid rgba(255, 45, 85, 0.1);
    background: rgba(var(--DLP-pink), 0.1);
}

.DLPSettingsToggleT1OFFB1 {
    border: 2px solid rgba(0, 0, 0, 0.1);
    background: rgba(var(--DLP-pink));
    margin-right: 22px;
}

.DLPSettingsToggleT2 {
    display: flex;
    width: 96px;
    height: 48px;
    align-items: center;
    flex-shrink: 0;

    border-radius: 16px;
    border: 2px solid rgba(0, 122, 255, 0.1);
    background: rgba(var(--DLP-blue), 0.1);

    cursor: pointer;
}

.DLPSettingsToggleT2B1 {
    display: flex;
    height: 32px;
    width: 32px;
    margin-left: 6px;
    justify-content: center;
    align-items: center;

    border-radius: 8px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    background: rgba(var(--DLP-blue));

    transition: .2s;
}

.DLPSettingsToggleT2:hover .DLPSettingsToggleT2B1 {
    filter: brightness(0.9);
    transform: scale(1.05);
}

.DLPSettingsToggleT2:active .DLPSettingsToggleT2B1 {
    filter: brightness(0.9);
    transform: scale(0.9);
}

.DLPSettingsToggleT2B1T1 {
    color: #FFF;
    text-align: center;
    font-size: 16px;
    font-weight: 700;
}

.DLPSettingsToggleT3 {
    display: flex;
    width: 48px;
    height: 48px;
    align-items: center;
    flex-shrink: 0;

    border-radius: 16px;
    border: 2px solid rgba(0, 122, 255, 0.1);
    background: rgba(var(--DLP-blue), 0.1);

    cursor: pointer;
}

.DLPSettingsToggleT3B1 {
    display: flex;
    height: 32px;
    width: 32px;
    margin-left: 6px;
    justify-content: center;
    align-items: center;

    border-radius: 8px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    background: rgba(var(--DLP-blue));

    transition: .2s;
}

.DLPSettingsToggleT3:hover .DLPSettingsToggleT3B1 {
    filter: brightness(0.9);
    transform: scale(1.05);
}

.DLPSettingsToggleT3:active .DLPSettingsToggleT3B1 {
    filter: brightness(0.9);
    transform: scale(0.9);
}

.DLPFeedbackTextFieldT1 {
    display: flex;
    width: 100%;
    padding: 16px;
    justify-content: center;
    align-items: flex-start;
    align-self: stretch;

    border-radius: 8px;
    border: 2px solid rgb(var(--color-eel), 0.1);
    background: rgba(var(--color-swan), 0.5);

    color: rgb(var(--color-eel));
    font-size: 16px;
    font-weight: 700;

    transition: .2s;
}
.DLPFeedbackTextFieldT1::placeholder {
    font-weight: 700;
    color: rgb(var(--color-eel), 0.5);
}
.DLPFeedbackTextFieldT1:focus {
    border: 2px solid rgba(var(--DLP-blue));
}
`;

let injectedDLPuniversalCSS = null;

function DLPuniversalCSSfunc() {
    try {
        if (!injectedDLPuniversalCSS) {
            injectedDLPuniversalCSS = document.createElement('style');
            injectedDLPuniversalCSS.type = 'text/css';
            injectedDLPuniversalCSS.innerHTML = DLPuniversalCSS;
            document.head.appendChild(injectedDLPuniversalCSS);
        } else {
        }
    } catch(error) {
        // logDLP
    }
}
DLPuniversalCSSfunc();

const htmlContent = `
<div class="AutoSolverBoxFirst">
    <div id="HideAutoSolverBoxButtonOneID" class="AutoSolverBoxAlertOneBox" style="backdrop-filter: blur(32px); border: 2px solid rgba(0, 0, 0, 0.10); background: rgba(0, 122, 255, 0.60); padding: 8px; border-radius: 8px; align-self: end;">
        <svg id="HideAutoSolverBoxButtonOneIconOneID" width="23" height="15" viewBox="0 0 23 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.4297 14.1562C5.05469 14.1562 0.75 8.95312 0.75 7.375C0.75 5.78906 5.05469 0.59375 11.4297 0.59375C17.8984 0.59375 22.1172 5.78906 22.1172 7.375C22.1172 8.95312 17.9062 14.1562 11.4297 14.1562ZM11.4375 11.5078C13.7266 11.5078 15.5938 9.61719 15.5938 7.375C15.5938 5.07812 13.7266 3.24219 11.4375 3.24219C9.13281 3.24219 7.27344 5.07031 7.27344 7.375C7.28125 9.61719 9.13281 11.5078 11.4375 11.5078ZM11.4297 9C10.5312 9 9.80469 8.26562 9.80469 7.38281C9.80469 6.49219 10.5312 5.75 11.4297 5.75C12.3281 5.75 13.0625 6.49219 13.0625 7.38281C13.0625 8.26562 12.3281 9 11.4297 9Z" fill="rgba(255, 255, 255, 0.80)"/>
        </svg>
        <svg id="HideAutoSolverBoxButtonOneIconTwoID" width="23" height="16" viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.7266 15.4922L4.1875 1.97656C3.9375 1.72656 3.9375 1.29688 4.1875 1.04688C4.44531 0.789062 4.875 0.789062 5.125 1.04688L18.6562 14.5625C18.9141 14.8203 18.9219 15.2188 18.6562 15.4922C18.3984 15.7578 17.9844 15.75 17.7266 15.4922ZM18.4609 12.9062L15.3281 9.75781C15.5 9.32812 15.5938 8.85938 15.5938 8.375C15.5938 6.07812 13.7266 4.24219 11.4375 4.24219C10.9531 4.24219 10.4922 4.33594 10.0547 4.49219L7.75 2.17969C8.875 1.8125 10.1016 1.59375 11.4297 1.59375C17.8984 1.59375 22.1172 6.78906 22.1172 8.375C22.1172 9.28125 20.7344 11.3438 18.4609 12.9062ZM11.4297 15.1562C5.05469 15.1562 0.75 9.95312 0.75 8.375C0.75 7.46094 2.16406 5.35938 4.54688 3.77344L7.59375 6.82812C7.39062 7.29688 7.27344 7.82812 7.27344 8.375C7.28125 10.6172 9.13281 12.5078 11.4375 12.5078C11.9766 12.5078 12.4922 12.3906 12.9609 12.1875L15.2812 14.5078C14.125 14.9141 12.8281 15.1562 11.4297 15.1562ZM13.9609 8.21094C13.9609 8.27344 13.9609 8.32812 13.9531 8.38281L11.3203 5.75781C11.375 5.75 11.4375 5.75 11.4922 5.75C12.8594 5.75 13.9609 6.85156 13.9609 8.21094ZM8.88281 8.32031C8.88281 8.25781 8.88281 8.1875 8.89062 8.125L11.5391 10.7734C11.4766 10.7812 11.4219 10.7891 11.3594 10.7891C10 10.7891 8.88281 9.67969 8.88281 8.32031Z" fill="white" fill-opacity="0.8"/>
        </svg>
        <p id="HideAutoSolverBoxButtonOneTextOneID" class="AutoSolverBoxAlertOneBoxTextOne" style="color: rgba(255, 255, 255, 0.80);">Hide</p>
        <!--<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 15" width="9" height="15" fill="#007AFF">
            <path d="M8.57031 7.35938C8.57031 7.74219 8.4375 8.0625 8.10938 8.375L2.20312 14.1641C1.96875 14.3984 1.67969 14.5156 1.33594 14.5156C0.648438 14.5156 0.0859375 13.9609 0.0859375 13.2734C0.0859375 12.9219 0.226562 12.6094 0.484375 12.3516L5.63281 7.35156L0.484375 2.35938C0.226562 2.10938 0.0859375 1.78906 0.0859375 1.44531C0.0859375 0.765625 0.648438 0.203125 1.33594 0.203125C1.67969 0.203125 1.96875 0.320312 2.20312 0.554688L8.10938 6.34375C8.42969 6.64844 8.57031 6.96875 8.57031 7.35938Z"/>
        </svg>-->
    </div>
    <div class="AutoSolverBoxBackground">
        <div class="AutoSolverBoxLayers">
            <div class="AutoSolverBoxAlertSectionOne">
                <div class="AutoSolverBoxAlertSectionOneSystemSection">

                    <div id="SendFeedbackButtonOne" class="AutoSolverBoxAlertOneBox" style="border: 2px solid rgba(0, 122, 255, 0.10); flex: 1 0 0; background: rgba(0, 122, 255, 0.10); padding: 8px; border-radius: 8px;">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.22656 17.3125C4.70312 17.3125 4.39062 16.9531 4.39062 16.3906V14.1641H3.6875C1.52344 14.1641 -0.0078125 12.7109 -0.0078125 10.3438V4.14844C-0.0078125 1.77344 1.42969 0.320312 3.82031 0.320312H14.1641C16.5547 0.320312 17.9922 1.77344 17.9922 4.14844V10.3438C17.9922 12.7109 16.5547 14.1641 14.1641 14.1641H9.22656L6.29688 16.7734C5.86719 17.1562 5.57812 17.3125 5.22656 17.3125Z" fill="#007AFF"/>
                        </svg>
                        <p class="AutoSolverBoxAlertOneBoxTextOne" style="color: #007AFF;">Feedback</p>
                        <!--<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 15" width="9" height="15" fill="#007AFF">
                            <path d="M8.57031 7.35938C8.57031 7.74219 8.4375 8.0625 8.10938 8.375L2.20312 14.1641C1.96875 14.3984 1.67969 14.5156 1.33594 14.5156C0.648438 14.5156 0.0859375 13.9609 0.0859375 13.2734C0.0859375 12.9219 0.226562 12.6094 0.484375 12.3516L5.63281 7.35156L0.484375 2.35938C0.226562 2.10938 0.0859375 1.78906 0.0859375 1.44531C0.0859375 0.765625 0.648438 0.203125 1.33594 0.203125C1.67969 0.203125 1.96875 0.320312 2.20312 0.554688L8.10938 6.34375C8.42969 6.64844 8.57031 6.96875 8.57031 7.35938Z"/>
                        </svg>-->
                    </div>

                    <div id="DuolingoProSettingsButtonOne" class="AutoSolverBoxAlertOneBox" style="border: 2px solid rgba(0, 122, 255, 0.10); flex: 1 0 0; background: rgba(0, 122, 255, 0.10); padding: 8px; border-radius: 8px;">
                        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.46094 17.1875C9.28906 17.1875 9.13281 17.1797 8.96875 17.1719L8.55469 17.9453C8.42969 18.1875 8.17188 18.3281 7.89062 18.2891C7.60156 18.2344 7.40625 18.0156 7.36719 17.7344L7.24219 16.8672C6.92188 16.7812 6.61719 16.6641 6.32031 16.5469L5.67969 17.1172C5.47656 17.3047 5.17969 17.3516 4.92188 17.2109C4.67188 17.0547 4.57031 16.7891 4.625 16.5156L4.80469 15.6562C4.54688 15.4688 4.28906 15.2578 4.05469 15.0312L3.25781 15.3672C2.98438 15.4844 2.71094 15.4062 2.50781 15.1797C2.34375 14.9688 2.3125 14.6719 2.46094 14.4375L2.92188 13.6875C2.75 13.4219 2.59375 13.1406 2.4375 12.8438L1.57031 12.8828C1.28906 12.8984 1.03125 12.7344 0.945312 12.4531C0.851562 12.1953 0.9375 11.9062 1.15625 11.7344L1.84375 11.1953C1.76562 10.8828 1.70312 10.5625 1.67188 10.2344L0.84375 9.96094C0.5625 9.875 0.398438 9.64844 0.398438 9.35938C0.398438 9.07031 0.5625 8.84375 0.84375 8.75L1.67188 8.48438C1.70312 8.15625 1.76562 7.84375 1.84375 7.52344L1.15625 6.97656C0.9375 6.8125 0.851562 6.53125 0.945312 6.27344C1.03125 5.99219 1.28906 5.83594 1.57031 5.84375L2.4375 5.875C2.59375 5.57812 2.75 5.30469 2.92188 5.02344L2.46094 4.28125C2.3125 4.05469 2.34375 3.75781 2.50781 3.54688C2.71094 3.32031 2.98438 3.24219 3.25 3.35938L4.05469 3.67969C4.28906 3.46875 4.54688 3.25781 4.80469 3.0625L4.625 2.21875C4.5625 1.92188 4.67969 1.65625 4.91406 1.51562C5.1875 1.375 5.47656 1.41406 5.6875 1.60938L6.32031 2.17969C6.61719 2.05469 6.92969 1.94531 7.24219 1.85156L7.36719 0.992188C7.40625 0.710938 7.60156 0.492188 7.88281 0.445312C8.17188 0.398438 8.42969 0.53125 8.55469 0.765625L8.96875 1.54688C9.13281 1.53906 9.28906 1.53125 9.46094 1.53125C9.61719 1.53125 9.78125 1.53906 9.94531 1.54688L10.3594 0.765625C10.4766 0.539062 10.7344 0.398438 11.0234 0.4375C11.3047 0.492188 11.5078 0.710938 11.5469 0.992188L11.6719 1.85156C11.9844 1.94531 12.2891 2.05469 12.5859 2.17969L13.2266 1.60938C13.4375 1.41406 13.7266 1.375 13.9922 1.51562C14.2344 1.65625 14.3516 1.92188 14.2891 2.21094L14.1094 3.0625C14.3594 3.25781 14.6172 3.46875 14.8516 3.67969L15.6562 3.35938C15.9297 3.24219 16.2031 3.32031 16.4062 3.54688C16.5703 3.75781 16.5938 4.05469 16.4453 4.28125L15.9844 5.02344C16.1641 5.30469 16.3203 5.57812 16.4688 5.875L17.3438 5.84375C17.6172 5.83594 17.8828 5.99219 17.9688 6.27344C18.0625 6.53125 17.9609 6.80469 17.75 6.97656L17.0703 7.51562C17.1484 7.84375 17.2109 8.15625 17.2422 8.48438L18.0625 8.75C18.3438 8.85156 18.5234 9.07031 18.5234 9.35938C18.5234 9.64062 18.3438 9.86719 18.0625 9.96094L17.2422 10.2344C17.2109 10.5625 17.1484 10.8828 17.0703 11.1953L17.7578 11.7344C17.9688 11.9062 18.0625 12.1953 17.9688 12.4531C17.8828 12.7344 17.6172 12.8984 17.3438 12.8828L16.4688 12.8438C16.3203 13.1406 16.1641 13.4219 15.9844 13.6875L16.4453 14.4297C16.6016 14.6797 16.5703 14.9688 16.4062 15.1797C16.2031 15.4062 15.9219 15.4844 15.6562 15.3672L14.8594 15.0312C14.6172 15.2578 14.3594 15.4688 14.1094 15.6562L14.2891 16.5078C14.3516 16.7891 14.2344 17.0547 14 17.2031C13.7266 17.3516 13.4375 17.2969 13.2266 17.1172L12.5859 16.5469C12.2891 16.6641 11.9844 16.7812 11.6719 16.8672L11.5469 17.7344C11.5078 18.0156 11.3047 18.2344 11.0312 18.2812C10.7344 18.3281 10.4688 18.1953 10.3516 17.9453L9.94531 17.1719C9.78125 17.1797 9.61719 17.1875 9.46094 17.1875ZM9.44531 6.95312C10.4844 6.95312 11.375 7.60938 11.7109 8.53125H15.3281C14.9375 5.61719 12.4922 3.39062 9.46094 3.39062C8.64062 3.39062 7.86719 3.55469 7.16406 3.84375L8.99219 7C9.14062 6.96875 9.28906 6.95312 9.44531 6.95312ZM3.53906 9.35938C3.53906 11.2422 4.38281 12.9141 5.71875 14.0078L7.60156 10.9141C7.25 10.4922 7.03906 9.95312 7.03906 9.36719C7.03906 8.77344 7.25781 8.22656 7.60938 7.80469L5.78125 4.66406C4.40625 5.75 3.53906 7.44531 3.53906 9.35938ZM9.44531 10.2656C9.96094 10.2656 10.3516 9.875 10.3516 9.36719C10.3516 8.85938 9.96094 8.46094 9.44531 8.46094C8.94531 8.46094 8.54688 8.85938 8.54688 9.36719C8.54688 9.875 8.94531 10.2656 9.44531 10.2656ZM9.46094 15.3281C12.5078 15.3281 14.9609 13.0859 15.3359 10.1562H11.7266C11.4062 11.1016 10.5078 11.7734 9.44531 11.7734C9.28906 11.7734 9.125 11.7578 8.97656 11.7266L7.08594 14.8359C7.8125 15.1484 8.60938 15.3281 9.46094 15.3281Z" fill="#007AFF"/>
                        </svg>
                        <p class="AutoSolverBoxAlertOneBoxTextOne" style="color: #007AFF;">Settings</p>
                        <!--<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 15" width="9" height="15" fill="#007AFF">
                            <path d="M8.57031 7.35938C8.57031 7.74219 8.4375 8.0625 8.10938 8.375L2.20312 14.1641C1.96875 14.3984 1.67969 14.5156 1.33594 14.5156C0.648438 14.5156 0.0859375 13.9609 0.0859375 13.2734C0.0859375 12.9219 0.226562 12.6094 0.484375 12.3516L5.63281 7.35156L0.484375 2.35938C0.226562 2.10938 0.0859375 1.78906 0.0859375 1.44531C0.0859375 0.765625 0.648438 0.203125 1.33594 0.203125C1.67969 0.203125 1.96875 0.320312 2.20312 0.554688L8.10938 6.34375C8.42969 6.64844 8.57031 6.96875 8.57031 7.35938Z"/>
                        </svg>-->
                    </div>

                </div>

                <div class="AutoSolverBoxAlertOneBox" id="DPSeeAllCurrentIssuesButtonABButtonID" style="border: 2px solid rgba(255, 59, 48, 0.10); background: rgba(255, 59, 48, 0.10); padding: 8px; border-radius: 8px;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 17" width="18" height="18" fill="#FF2D55">
                        <path d="M2.96094 16.0469C1.53125 16.0469 0.59375 14.9688 0.59375 13.6797C0.59375 13.2812 0.695312 12.875 0.914062 12.4922L6.92969 1.97656C7.38281 1.19531 8.17188 0.789062 8.97656 0.789062C9.77344 0.789062 10.5547 1.1875 11.0156 1.97656L17.0312 12.4844C17.25 12.8672 17.3516 13.2812 17.3516 13.6797C17.3516 14.9688 16.4141 16.0469 14.9844 16.0469H2.96094ZM8.98438 10.4609C9.52344 10.4609 9.83594 10.1562 9.86719 9.59375L9.99219 6.22656C10.0234 5.64062 9.59375 5.23438 8.97656 5.23438C8.35156 5.23438 7.92969 5.63281 7.96094 6.22656L8.08594 9.60156C8.10938 10.1562 8.42969 10.4609 8.98438 10.4609ZM8.98438 13.2812C9.60156 13.2812 10.0859 12.8906 10.0859 12.2891C10.0859 11.7031 9.60938 11.3047 8.98438 11.3047C8.35938 11.3047 7.875 11.7031 7.875 12.2891C7.875 12.8906 8.35938 13.2812 8.98438 13.2812Z"/>
                    </svg>
                    <p class="AutoSolverBoxAlertOneBoxTextOne" style="color: #FF4B4B;">Issues & Fixes</p>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 15" width="9" height="15" fill="#FF2D55">
                        <path d="M8.57031 7.35938C8.57031 7.74219 8.4375 8.0625 8.10938 8.375L2.20312 14.1641C1.96875 14.3984 1.67969 14.5156 1.33594 14.5156C0.648438 14.5156 0.0859375 13.9609 0.0859375 13.2734C0.0859375 12.9219 0.226562 12.6094 0.484375 12.3516L5.63281 7.35156L0.484375 2.35938C0.226562 2.10938 0.0859375 1.78906 0.0859375 1.44531C0.0859375 0.765625 0.648438 0.203125 1.33594 0.203125C1.67969 0.203125 1.96875 0.320312 2.20312 0.554688L8.10938 6.34375C8.42969 6.64844 8.57031 6.96875 8.57031 7.35938Z"/>
                    </svg>
                </div>

            </div>
            <div class="AutoSolverBoxTitleSectionOne">
                <p class="AutoSolverBoxTitleSectionOneTextOne">Duolingo Pro</p>
                <div class="AutoSolverBoxTitleSectionOneBETATagOne">
                    <p class="AutoSolverBoxTitleSectionOneBETATagOneTextOne">2.0 BETA 9.6.1</p>
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
                    <div id="AutoSolverBoxToggleT1ID1" class="DLPSettingsToggleT1 DLPSettingsToggleT1ON">
                        <div class="DLPSettingsToggleT1B1 DLPSettingsToggleT1ONB1">
                            <svg class="DLPSettingsToggleT1B1I1" style="display: ;" "16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.41406 13.9453C5.91406 13.9453 5.53906 13.7656 5.20312 13.3672L1.17188 8.48438C0.890625 8.16406 0.789062 7.875 0.789062 7.54688C0.789062 6.8125 1.33594 6.27344 2.09375 6.27344C2.53125 6.27344 2.84375 6.42969 3.13281 6.77344L6.375 10.7969L12.7656 0.71875C13.0781 0.226562 13.3984 0.0390625 13.9141 0.0390625C14.6641 0.0390625 15.2109 0.570312 15.2109 1.30469C15.2109 1.57812 15.125 1.86719 14.9219 2.17969L7.64062 13.3125C7.35938 13.7422 6.94531 13.9453 6.41406 13.9453Z" fill="white"/>
                            </svg>
                            <svg class="DLPSettingsToggleT1B1I2" style="display: none; transform: scale(0);" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.867188 12.9922C0.414062 12.5469 0.429688 11.7578 0.851562 11.3359L5.32031 6.86719L0.851562 2.41406C0.429688 1.98438 0.414062 1.20312 0.867188 0.75C1.32031 0.289062 2.10938 0.304688 2.53125 0.734375L6.99219 5.19531L11.4531 0.734375C11.8906 0.296875 12.6562 0.296875 13.1094 0.75C13.5703 1.20312 13.5703 1.96875 13.125 2.41406L8.67188 6.86719L13.125 11.3281C13.5703 11.7734 13.5625 12.5312 13.1094 12.9922C12.6641 13.4453 11.8906 13.4453 11.4531 13.0078L6.99219 8.54688L2.53125 13.0078C2.10938 13.4375 1.32812 13.4453 0.867188 12.9922Z" fill="white"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="AutoSolverBoxSectionThreeBoxSectionTwo" id="AutoSolverBoxSectionThreeBoxSectionTwoIDTwo">
                    <div class="AutoSolverBoxSectionThreeBoxSectionTwoTextOne">Repeat Lesson Mode</div>
                    <div id="AutoSolverBoxToggleT1ID2" class="DLPSettingsToggleT1 DLPSettingsToggleT1ON">
                        <div class="DLPSettingsToggleT1B1 DLPSettingsToggleT1ONB1">
                            <svg class="DLPSettingsToggleT1B1I1" style="display: ;" "16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.41406 13.9453C5.91406 13.9453 5.53906 13.7656 5.20312 13.3672L1.17188 8.48438C0.890625 8.16406 0.789062 7.875 0.789062 7.54688C0.789062 6.8125 1.33594 6.27344 2.09375 6.27344C2.53125 6.27344 2.84375 6.42969 3.13281 6.77344L6.375 10.7969L12.7656 0.71875C13.0781 0.226562 13.3984 0.0390625 13.9141 0.0390625C14.6641 0.0390625 15.2109 0.570312 15.2109 1.30469C15.2109 1.57812 15.125 1.86719 14.9219 2.17969L7.64062 13.3125C7.35938 13.7422 6.94531 13.9453 6.41406 13.9453Z" fill="white"/>
                            </svg>
                            <svg class="DLPSettingsToggleT1B1I2" style="display: none; transform: scale(0);" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.867188 12.9922C0.414062 12.5469 0.429688 11.7578 0.851562 11.3359L5.32031 6.86719L0.851562 2.41406C0.429688 1.98438 0.414062 1.20312 0.867188 0.75C1.32031 0.289062 2.10938 0.304688 2.53125 0.734375L6.99219 5.19531L11.4531 0.734375C11.8906 0.296875 12.6562 0.296875 13.1094 0.75C13.5703 1.20312 13.5703 1.96875 13.125 2.41406L8.67188 6.86719L13.125 11.3281C13.5703 11.7734 13.5625 12.5312 13.1094 12.9922C12.6641 13.4453 11.8906 13.4453 11.4531 13.0078L6.99219 8.54688L2.53125 13.0078C2.10938 13.4375 1.32812 13.4453 0.867188 12.9922Z" fill="white"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <p class="AutoSolverBoxTitleSectionTwoTextOne" style="margin-top: 4px; margin-bottom: 8px; color: rgb(var(--color-hare));">Turn off both to use Path Mode</p>

                <button class="AutoSolverBoxRepeatAmountButton" id="DPASBsB1" style="width: 100%;">START</button>
            </div>
        </div>
    </div>
</div>
`;

const cssContent = `
.AutoSolverBoxFirst {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    position: fixed; /* Fix the position to the bottom-right corner */
    bottom: 24px;
    right: 24px;
    z-index: 2;
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

    transition: .5s;
    overflow: hidden;
}

.AutoSolverBoxLayers {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;

    transition: .5s;
}

.AutoSolverBoxAlertSectionOne {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
}

.AutoSolverBoxAlertSectionOneSystemSection {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
}

.AutoSolverBoxAlertOneBox {
    display: flex;
    align-items: center;
    gap: 8px;
    align-self: stretch;

    cursor: pointer;
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.AutoSolverBoxAlertOneBox:hover {
    filter: brightness(0.9);
    transform: scale(1.05);
}
.AutoSolverBoxAlertOneBox:active {
    filter: brightness(0.8);
    transform: scale(0.9);
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
    color: rgb(var(--color-wolf));

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
`;

let bannedViewHTML = `
<div class="AutoSolverBoxLayers" style="padding: 16px;">
    <svg style="margin: 8px;" width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30.7812 25.7188L27.8125 22.7344C28.8125 20.9688 29.3906 18.9219 29.3906 16.7188C29.3906 9.85938 23.8594 4.32812 16.9844 4.32812C14.7969 4.32812 12.75 4.90625 10.9844 5.90625L8 2.9375C10.5938 1.21875 13.6875 0.21875 17 0.21875C26.0469 0.21875 33.5 7.67188 33.5 16.7188C33.5 20.0312 32.5 23.125 30.7812 25.7188ZM30.8281 32.4219L1.29688 2.89062C0.796875 2.40625 0.796875 1.53125 1.29688 1.04688C1.8125 0.515625 2.65625 0.53125 3.17188 1.04688L32.6875 30.5469C33.2031 31.0625 33.1875 31.8906 32.6875 32.4062C32.1875 32.9219 31.3438 32.9219 30.8281 32.4219ZM23 27.5469L25.9844 30.5312C23.3906 32.2344 20.3125 33.2344 17 33.2344C7.95312 33.2344 0.5 25.7812 0.5 16.7188C0.5 13.4062 1.5 10.3125 3.21875 7.71875L6.20312 10.7031C5.1875 12.4688 4.60938 14.5312 4.60938 16.7188C4.60938 23.5938 10.125 29.125 17 29.125C19.1875 29.125 21.2344 28.5469 23 27.5469Z" fill="#FF2D55"/>
    </svg>
    <p style="padding: 8px; margin: 0; align-self: stretch; color: rgb(var(--color-eel)); text-align: center; font-size: 24px; font-weight: 700;">You've Been Banned</p>
    <p id="MHUXHhvVrJjRMuOe" style="margin: 0; align-self: stretch; color: rgb(var(--color-wolf)); text-align: center; font-size: 16px; font-weight: 700;">You’ve been banned from using Duolingo Pro because of</p>
    <p style="margin: 0; align-self: stretch; color: rgb(var(--color-wolf)); text-align: center; font-size: 16px; font-weight: 700;">All features of Duolingo Pro are disabled, except basic functions such as Solve buttons in lessons. </p>
    <p id="ACuvpqwPRPwTYTHRID" style="cursor: pointer; margin: 0; align-self: stretch; color: #007AFF; text-align: center; font-size: 16px; font-weight: 700;">How can I fix this?</p>
</div>
`;
let bannedViewElement = null;
function szdfgvhbjnk() {
    async function updateWarningsFromURL(url, currentVersion) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                //throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const versionData = data[currentVersion];
            if (versionData) {
                document.querySelector('.AutoSolverBoxLayers').remove();
                bannedViewElement = document.createElement('div');
                bannedViewElement.innerHTML = bannedViewHTML;
                document.querySelector('.AutoSolverBoxBackground').appendChild(bannedViewElement);
                for (const warningKey in versionData) {
                    if (warningKey === 'expiration') {
                        if (warningKey === 'never' || warningKey === 'forever' || warningKey === '') {
                        }
                    } else if (warningKey === 'reason') {
                        document.querySelector('#MHUXHhvVrJjRMuOe').textContent = "You’ve been banned from using Duolingo Pro because of " + versionData[warningKey] + ".";
                    } else if (warningKey === 'rebuttal') {
                        document.querySelector('#ACuvpqwPRPwTYTHRID').addEventListener('click', () => {
                            window.open(versionData[warningKey], '_blank');
                        });
                    }
                }
            } else {
                // cleanassbitch
            }
        } catch (error) {
            console.log(`Error getting data: ${error.message}`);
        }
    }
    updateWarningsFromURL('https://raw.githubusercontent.com/anonymoushackerIV/Duolingo-Pro-Assets/main/resources/security-1.json', String(randomValue));
}

let injectedContainer = null;
let injectedStyleElement = null;

function injectContent() {
    if (window.location.pathname === '/learn') {
        if (!injectedContainer) {
            injectedContainer = document.createElement('div');
            injectedContainer.innerHTML = htmlContent;
            document.body.appendChild(injectedContainer);

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

                if (AutoSolverSettingsShowAutoSolverBox) {
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
    const DuolingoProSettingsButtonOne = document.querySelector('#DuolingoProSettingsButtonOne');
    DuolingoProSettingsButtonOne.addEventListener('click', () => {
        wasDuolingoProSettingsButtonOnePressed = true;
    });

    const SendFeedbackButton = document.querySelector('#SendFeedbackButtonOne');
    SendFeedbackButton.addEventListener('click', () => {
        SendFeedBackBox(true);
    });

    const SeeCurrentIssuesButton = document.querySelector('#DPSeeAllCurrentIssuesButtonABButtonID');
    SeeCurrentIssuesButton.addEventListener('click', () => {
        CurrentIssuesPopUpFunction(true);
    });

    let _32a = false;
    let fornow1a;
    const HideAutoSolverBoxButtonOne = document.querySelector('#HideAutoSolverBoxButtonOneID');
    const AutoSolverBoxBackground = document.querySelector('.AutoSolverBoxBackground');
    if (AutoSolverSettingsShowAutoSolverBox) {
        AutoSolverBoxBackground.style.opacity = '';
        document.querySelector('#HideAutoSolverBoxButtonOneTextOneID').textContent = 'Hide';
        document.querySelector('#HideAutoSolverBoxButtonOneIconOneID').style.display = 'none';
        document.querySelector('#HideAutoSolverBoxButtonOneIconTwoID').style.display = '';
    } else if (!AutoSolverSettingsShowAutoSolverBox) {
        fornow1a = document.querySelector('.AutoSolverBoxBackground').offsetHeight;

        document.querySelector('#HideAutoSolverBoxButtonOneTextOneID').textContent = 'Show';
        document.querySelector('#HideAutoSolverBoxButtonOneIconOneID').style.display = '';
        document.querySelector('#HideAutoSolverBoxButtonOneIconTwoID').style.display = 'none';

        AutoSolverBoxBackground.style.opacity = '0';
        fornow1a = document.querySelector('.AutoSolverBoxBackground').offsetHeight;
        AutoSolverBoxBackground.style.height = '0px';

        _32a = true;
    }
    HideAutoSolverBoxButtonOne.addEventListener('click', () => {
        if (AutoSolverSettingsShowAutoSolverBox) {
            document.querySelector('#HideAutoSolverBoxButtonOneTextOneID').textContent = 'Show';
            HideAutoSolverBoxButtonOne.style.marginBottom = '0px';
            document.querySelector('#HideAutoSolverBoxButtonOneIconOneID').style.display = '';
            document.querySelector('#HideAutoSolverBoxButtonOneIconTwoID').style.display = 'none';
            AutoSolverSettingsShowAutoSolverBox = false;
            localStorage.setItem('AutoSolverSettingsShowAutoSolverBox', AutoSolverSettingsShowAutoSolverBox);

            document.querySelector('.AutoSolverBoxLayers').style.transform = 'scaleY(1.0)';
            AutoSolverBoxBackground.style.filter = 'blur(0)';

            fornow1a = document.querySelector('.AutoSolverBoxBackground').offsetHeight;
            AutoSolverBoxBackground.style.height = `${fornow1a}px`;
            setTimeout(function() {
                AutoSolverBoxBackground.style.height = '0px';
                AutoSolverBoxBackground.style.opacity = '0';

                document.querySelector('.AutoSolverBoxLayers').style.transform = 'scaleY(0)';
                AutoSolverBoxBackground.style.filter = 'blur(16px)';
                setTimeout(function() {
                }, 500);
            }, 50);
        } else if (!AutoSolverSettingsShowAutoSolverBox) {
            document.querySelector('#HideAutoSolverBoxButtonOneTextOneID').textContent = 'Hide';
            HideAutoSolverBoxButtonOne.style.marginBottom = '';
            document.querySelector('#HideAutoSolverBoxButtonOneIconOneID').style.display = 'none';
            document.querySelector('#HideAutoSolverBoxButtonOneIconTwoID').style.display = '';
            AutoSolverSettingsShowAutoSolverBox = true;
            localStorage.setItem('AutoSolverSettingsShowAutoSolverBox', AutoSolverSettingsShowAutoSolverBox);

            document.querySelector('.AutoSolverBoxLayers').style.transform = 'scaleY(0)';
            AutoSolverBoxBackground.style.filter = 'blur(16px)';

            setTimeout(function() {
                AutoSolverBoxBackground.style.height = `${fornow1a}px`;
                AutoSolverBoxBackground.style.opacity = '';

                document.querySelector('.AutoSolverBoxLayers').style.transform = 'scaleY(1.0)';
                AutoSolverBoxBackground.style.filter = 'blur(0)';
                setTimeout(function() {
                    AutoSolverBoxBackground.style.height = '';
                }, 500);
            }, 10);

            if (_32a === true) {
                something();
                initializeAutoSolverBoxButtonInteractiveness();
                _32a = false;
            }
        }
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

    function DPABaBsFunc1() {
        const AutoSolverBoxRepeatNumberDownButton = document.querySelector('#DPASBadB1');
        const AutoSolverBoxRepeatNumberUpButton = document.querySelector('#DPASBauB1');

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
            if (autoSolverBoxRepeatAmount > 0) {
                autoSolverBoxRepeatAmount--;
            } else if (autoSolverBoxRepeatAmount <= 0) {
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

            setTimeout(function() {
                try {
                    //let openChestThingy = document.querySelector("button[aria-label='Open chest']");
                    //openChestThingy.click();
                    let erXybYXuipnzVGxn = document.querySelectorAll('._33Jbm._1eJKW._16r-S.RQl8m');
                    let hyllzkmzXKVMUBGy = Array.from(erXybYXuipnzVGxn).find(button => !button.disabled);
                    if (hyllzkmzXKVMUBGy.length > 0) {
                        hyllzkmzXKVMUBGy.click();
                    }
                } catch (error) {
                }
            }, 1000);

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
            setTimeout(function() {
                AutoSolverBoxRepeatStartButtonActions();
            }, 500);
        });
    } catch(error) {
    }

    try {
        const AutoSolverBoxToggleT1ID1 = document.querySelector('#AutoSolverBoxToggleT1ID1');
        const AutoSolverBoxToggleT1ID2 = document.querySelector('#AutoSolverBoxToggleT1ID2');

        AutoSolverBoxToggleT1ID1.addEventListener('click', () => {
            if (autoSolverBoxPracticeOnlyMode) {
                autoSolverBoxPracticeOnlyMode = !autoSolverBoxPracticeOnlyMode;
                sessionStorage.setItem('autoSolverBoxPracticeOnlyMode', autoSolverBoxPracticeOnlyMode);
                updateAutoSolverToggles(AutoSolverBoxToggleT1ID1, autoSolverBoxPracticeOnlyMode);
            } else if (!autoSolverBoxPracticeOnlyMode) {
                autoSolverBoxPracticeOnlyMode = !autoSolverBoxPracticeOnlyMode;
                autoSolverBoxRepeatLessonMode = !autoSolverBoxPracticeOnlyMode;
                sessionStorage.setItem('autoSolverBoxPracticeOnlyMode', autoSolverBoxPracticeOnlyMode);
                sessionStorage.setItem('autoSolverBoxRepeatLessonMode', autoSolverBoxRepeatLessonMode);
                updateAutoSolverToggles(AutoSolverBoxToggleT1ID1, autoSolverBoxPracticeOnlyMode);
                updateAutoSolverToggles(AutoSolverBoxToggleT1ID2, autoSolverBoxRepeatLessonMode);
            }
        });

        AutoSolverBoxToggleT1ID2.addEventListener('click', () => {
            if (autoSolverBoxRepeatLessonMode) {
                autoSolverBoxRepeatLessonMode = !autoSolverBoxRepeatLessonMode;
                sessionStorage.setItem('autoSolverBoxRepeatLessonMode', autoSolverBoxRepeatLessonMode);
                updateAutoSolverToggles(AutoSolverBoxToggleT1ID2, autoSolverBoxRepeatLessonMode);
            } else {
                autoSolverBoxRepeatLessonMode = !autoSolverBoxRepeatLessonMode;
                autoSolverBoxPracticeOnlyMode = !autoSolverBoxRepeatLessonMode;
                sessionStorage.setItem('autoSolverBoxPracticeOnlyMode', autoSolverBoxPracticeOnlyMode);
                sessionStorage.setItem('autoSolverBoxRepeatLessonMode', autoSolverBoxRepeatLessonMode);
                updateAutoSolverToggles(AutoSolverBoxToggleT1ID2, autoSolverBoxRepeatLessonMode);
                updateAutoSolverToggles(AutoSolverBoxToggleT1ID1, autoSolverBoxPracticeOnlyMode);
            }
        });

        AutoSolverBoxToggleT1ID1.addEventListener('click', () => {
            updateAutoSolverToggles(AutoSolverBoxToggleT1ID1, autoSolverBoxPracticeOnlyMode);
            updateAutoSolverToggles(AutoSolverBoxToggleT1ID2, autoSolverBoxRepeatLessonMode);
        });

        updateAutoSolverToggles(AutoSolverBoxToggleT1ID1, autoSolverBoxPracticeOnlyMode);
        updateAutoSolverToggles(AutoSolverBoxToggleT1ID2, autoSolverBoxRepeatLessonMode);

    } catch(error) {
    }

    function updateAutoSolverToggles(element, variable) {
        let smthElement = element;
        let smthElementB = smthElement.querySelector(".DLPSettingsToggleT1B1");
        let smthElementBI1 = smthElement.querySelector(".DLPSettingsToggleT1B1I1");
        let smthElementBI2 = smthElement.querySelector(".DLPSettingsToggleT1B1I2");
        function idk() {
            if (variable === false) {
                smthElement.classList.add("DLPSettingsToggleT1OFF");
                smthElement.classList.remove("DLPSettingsToggleT1ON");
                smthElementB.classList.add("DLPSettingsToggleT1OFFB1");
                smthElementB.classList.remove("DLPSettingsToggleT1ONB1");
                smthElementBI1.style.transform = 'scale(0)';
                setTimeout(function() {
                    smthElementBI1.style.display = "none";
                    smthElementBI2.style.display = "";
                    smthElementBI2.style.transform = 'scale(1)';
                }, 100);
            } else if (variable === true) {
                smthElement.classList.add("DLPSettingsToggleT1ON");
                smthElement.classList.remove("DLPSettingsToggleT1OFF");
                smthElementB.classList.add("DLPSettingsToggleT1ONB1");
                smthElementB.classList.remove("DLPSettingsToggleT1OFFB1");
                smthElementBI2.style.transform = 'scale(0)';
                setTimeout(function() {
                    smthElementBI2.style.display = "none";
                    smthElementBI1.style.display = "";
                    smthElementBI1.style.transform = 'scale(1)';
                }, 100);
            } else {
                console.log("error #1");
            }
        };
        idk();

    }
}


function checkURLForAutoSolverBox() {
    if (window.location.pathname === '/lesson' || window.location.pathname.includes('/unit') || window.location.pathname === '/practice') {
        let jfgsdodhgsf = document.querySelector('#solveAllButton');
        if (jfgsdodhgsf) {
            if (wasAutoSolverBoxRepeatStartButtonPressed === true) {
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
        DuolingoProBoxHeightForSidebarPadding = document.querySelector('.AutoSolverBoxFirst');
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

//if (DuolingoProSettingsProBlockMode) {
//    setInterval(iforgot, 100);
//    setInterval(DuolingoRemoveLearnAds, 100);
//}


const SendFeedbackBoxHTML = `
<div class="DPLBoxShadowStyleT1" id="SendFeebackBoxShadow">
    <div class="DPLBoxStyleT1" id="SendFeebackBoxBackground">
        <div class="SendFeebackBoxLayers">

            <p class="selfFill paragraphText noSelect" style="font-size: 24px; line-height: 32px;">Send Feedback for Duolingo Pro</p>

            <div style="display: flex; padding: 16px; flex-direction: column; justify-content: center; align-items: flex-start; gap: 8px; align-self: stretch; border-radius: 8px; border: 2px solid rgba(88, 101, 242, 0.1); background: rgba(88, 101, 242, 0.1);">
                <div style="display: flex; align-items: center; gap: 8px; align-self: stretch;">
                    <svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5088 1.84C16.1708 1.214 14.7402 0.759052 13.2446 0.5C13.0609 0.832095 12.8463 1.27877 12.6983 1.6341C11.1084 1.39499 9.53312 1.39499 7.97243 1.6341C7.8245 1.27877 7.60503 0.832095 7.4197 0.5C5.92243 0.759052 4.49018 1.21567 3.15222 1.84331C0.453554 5.92136 -0.278011 9.89811 0.0877725 13.8184C1.87767 15.155 3.6123 15.967 5.31766 16.4984C5.73872 15.9189 6.11425 15.3028 6.43776 14.6536C5.82162 14.4195 5.23149 14.1306 4.67389 13.7952C4.82182 13.6856 4.96652 13.571 5.10632 13.4531C8.50728 15.0438 12.2025 15.0438 15.5628 13.4531C15.7043 13.571 15.849 13.6856 15.9953 13.7952C15.436 14.1322 14.8443 14.4211 14.2281 14.6553C14.5517 15.3028 14.9256 15.9205 15.3482 16.5C17.0552 15.9687 18.7915 15.1567 20.5814 13.8184C21.0106 9.27378 19.8482 5.33355 17.5088 1.84ZM6.90109 11.4075C5.88016 11.4075 5.04291 10.4543 5.04291 9.2937C5.04291 8.13305 5.86228 7.17831 6.90109 7.17831C7.93993 7.17831 8.77715 8.13138 8.75928 9.2937C8.76089 10.4543 7.93993 11.4075 6.90109 11.4075ZM13.7681 11.4075C12.7471 11.4075 11.9099 10.4543 11.9099 9.2937C11.9099 8.13305 12.7292 7.17831 13.7681 7.17831C14.8069 7.17831 15.6441 8.13138 15.6263 9.2937C15.6263 10.4543 14.8069 11.4075 13.7681 11.4075Z" fill="#5865F2"/>
                    </svg>
                    <p class="paragraphText noSelect" style="flex: 1 0 0; color: #5865F2;">Join our new Discord community, give feedback faster</p>
                </div>
                <p class="paragraphText noSelect" style="align-self: stretch; color: rgba(88, 101, 242, 0.50);">Our new Discord server is a great place to give feedback, as well as get up-to-date with the newest updates. <a href="https://discord.gg/r8xQ7K59Mt" target="_blank" rel="noopener noreferrer" class="DuolingoProFeedbackBoxPromotionLinkPurple">Join here</a></p>
            </div>

            <textarea class="DLPFeedbackTextFieldT1" id="SendFeebackBoxSectionTwoID" style="resize: vertical; height: 128px;" placeholder="Write here as much as you can with as many details as possible."/></textarea>

            <p class="selfFill paragraphText noSelect" style="line-height: 32px;">Choose Feedback Type</p>
            <div class="HStack selfFill" style="gap: 8px;">
                <div class="SendFeebackBoxSectionFourButtonOneBackground" id="SendFeebackTypeButtonOne">
                    <div class="SendFeebackBoxSectionFourButtonOneIconOne"/></div>
                    <p class="SendFeebackBoxSectionFourButtonOneTextOne">Bug Report</p>
                </div>
                <div class="SendFeebackBoxSectionFourButtonOneBackground" id="SendFeebackTypeButtonTwo">
                    <div class="SendFeebackBoxSectionFourButtonOneIconOne"/></div>
                    <p class="SendFeebackBoxSectionFourButtonOneTextOne">Suggestion</p>
                </div>
            </div>

            <p class="selfFill paragraphText noSelect" style="line-height: 32px;">Upload Photo <a style="color: rgb(var(--color-eel), 0.5)">- Optional</a></p>
            <input type="file" accept="image/png, image/jpeg" class="loldonttouchthisbit" id="SendFeedbackFileUploadButtonIDOne" onchange="showFileName()"/>

            <p class="selfFill paragraphText noSelect" style="line-height: 32px;">Email <a style="color: rgb(var(--color-eel), 0.5)">- Optional, can help us reach back</a></p>
            <input class="DLPFeedbackTextFieldT1" id="DLPFeedbackTextField2" type="email" style="resize: none; height: 54px;" placeholder="Email address">

            <div class="SendFeedbackBoxSectionEight">
                <button class="DPLSecondaryButtonStyleT1" id="SendFeebackBoxSectionOneCancelBoxBackground">CANCEL</button>
                <button class="DPLPrimaryButtonStyleT1" id="SendFeebackBoxSectionEightSendButton">SEND</button>
            </div>

        </div>
    </div>
</div>
`;

const SendFeedbackBoxCSS = `
.DuolingoProFeedbackBoxPromotionLinkPurple {
    color: rgba(88, 101, 242, 0.50);
    text-decoration-line: underline;
    transition: .1s;
}
.DuolingoProFeedbackBoxPromotionLinkPurple:hover {
    color: #5865F2;
}

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

.SendFeebackBoxLayers {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;

    width: 100%;
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
        randomValue = Math.floor(Math.random() * 10000000000);

        randomValueInText = String(randomValue);

        // Prepend zeros to the string until it is 10 digits long
        while (randomValueInText.length < 10) {
            randomValueInText = "0" + randomValueInText;
        }

        localStorage.setItem("RandomValue", randomValueInText);
        console.log("Generated ID: ", randomValue);
    } else {
        randomValue = localStorage.getItem("RandomValue");
        szdfgvhbjnk();
    }
}

setRandomValue();

let fileInput;

let injectedSendFeedBackBoxElement = null;
let injectedSendFeedBackBoxStyle = null;

let isSendFeebackBoxSectionEightSendButtonEnabled = false;

let SendFeedbackTextAreaValue;
let emailContactValue;
let idktype = 'Bug Report';
let sendFeedbackStatus = 'none';

function SendFeedBackBox(visibility) {
    if (visibility === true) {
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

            let poijhugjfhd = setInterval(SendFeedbackTextAreaStuff, 100);

            let SendFeedbackWholeDiv = document.querySelector('#SendFeebackBoxShadow');
            let SendFeedbackBoxDiv = document.querySelector('#SendFeebackBoxBackground');

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


            const SendFeedbackCloseButton = document.querySelector('#SendFeebackBoxSectionOneCancelBoxBackground');
            SendFeedbackCloseButton.addEventListener('click', () => {
                SendFeedBackBox(false);
                clearInterval(poijhugjfhd);
            });

            const TextAreaOneOne = document.getElementById('SendFeebackBoxSectionTwoID');

            const TextAreaTwoOne = document.getElementById('DLPFeedbackTextField2');

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

            let _283b = false;
            const SendFeebackBoxSectionEightSendButton = document.querySelector('#SendFeebackBoxSectionEightSendButton');
            SendFeebackBoxSectionEightSendButton.addEventListener('click', () => {
                if (isSendFeebackBoxSectionEightSendButtonEnabled && !_283b) {
                    _283b = true;
                    SendFeedbackTextAreaValue = TextAreaOneOne.value;
                    emailContactValue = TextAreaTwoOne.value;
                    sendFeedbackServer(SendFeedbackTextAreaValue, idktype, emailContactValue);

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
                                _283b = false;
                            }, 4000);

                            sendFeedbackStatus = 'empty';
                        } else if (sendFeedbackStatus === 'empty') {
                            setTimeout(function() {
                                checkFlag();
                                _283b = false;
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
    } else if (visibility === false) {
        if (injectedSendFeedBackBoxElement) {
            let SendFeedbackWholeDiv = document.querySelector('#SendFeebackBoxShadow');
            let SendFeedbackBoxDiv = document.querySelector('#SendFeebackBoxBackground');

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

function SendFeedbackTextAreaStuff() {
    try {
        const SendFeebackBoxSectionEightSendButton = document.querySelector('#SendFeebackBoxSectionEightSendButton');

        const SendFeebackBoxSectionTwo = document.querySelector('#SendFeebackBoxSectionTwoID');

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
            //disableHoverOne();
        } else {
            //enableHoverOne();
        }
    } catch (error) {
    }
}


const DuolingoProSettingsBoxHTML = `
<div class="DPLBoxShadowStyleT1" id="DuolingoProSettingsBoxShadow">
    <div class="DPLBoxStyleT1" id="DuolingoProSettingsBoxBackground" style="overflow-y: visible; overflow: hidden; padding: 0; padding-right: 16px; padding-left: 16px;">
        <div class="DuolingoProSettingsBoxLayers">
            <div class="DuolingoProSettingsBoxSectionOne">
                <p class="DuolingoProSettingsBoxSectionOneTextOne">Settings</p>
                <div class="DuolingoProSettingsBoxSectionOneBoxOne">
                    <p class="DuolingoProSettingsBoxSectionOneBoxOneTextOne">2.0 BETA 9.6.1</p>
                </div>
            </div>
            <div class="DuolingoProSettingsBoxSectionTwo">
                <div class="DuolingoProSettingsBoxSectionTwoBoxOne">
                    <div class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOne">
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextThree" style="color: #FF2D55;">BETA</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextOne">Shade</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextTwo">Duolingo Pro adds a view on top of your lesson to hide what AutoSolver is doing behind.</p>
                    </div>
                    <div id="DuolingoProSettingsBoxToggleT1ID1" class="DLPSettingsToggleT1 DLPSettingsToggleT1ON DLPSettingsToggleRmElement">
                        <div class="DLPSettingsToggleT1B1 DLPSettingsToggleT1ONB1 DLPSettingsToggleRmElement">
                            <svg class="DLPSettingsToggleT1B1I1 DLPSettingsToggleRmElement" style="display: ;" "16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.41406 13.9453C5.91406 13.9453 5.53906 13.7656 5.20312 13.3672L1.17188 8.48438C0.890625 8.16406 0.789062 7.875 0.789062 7.54688C0.789062 6.8125 1.33594 6.27344 2.09375 6.27344C2.53125 6.27344 2.84375 6.42969 3.13281 6.77344L6.375 10.7969L12.7656 0.71875C13.0781 0.226562 13.3984 0.0390625 13.9141 0.0390625C14.6641 0.0390625 15.2109 0.570312 15.2109 1.30469C15.2109 1.57812 15.125 1.86719 14.9219 2.17969L7.64062 13.3125C7.35938 13.7422 6.94531 13.9453 6.41406 13.9453Z" fill="white"/>
                            </svg>
                            <svg class="DLPSettingsToggleT1B1I2 DLPSettingsToggleRmElement" style="display: none; transform: scale(0);" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.867188 12.9922C0.414062 12.5469 0.429688 11.7578 0.851562 11.3359L5.32031 6.86719L0.851562 2.41406C0.429688 1.98438 0.414062 1.20312 0.867188 0.75C1.32031 0.289062 2.10938 0.304688 2.53125 0.734375L6.99219 5.19531L11.4531 0.734375C11.8906 0.296875 12.6562 0.296875 13.1094 0.75C13.5703 1.20312 13.5703 1.96875 13.125 2.41406L8.67188 6.86719L13.125 11.3281C13.5703 11.7734 13.5625 12.5312 13.1094 12.9922C12.6641 13.4453 11.8906 13.4453 11.4531 13.0078L6.99219 8.54688L2.53125 13.0078C2.10938 13.4375 1.32812 13.4453 0.867188 12.9922Z" fill="white"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="DuolingoProSettingsBoxSectionTwoBoxOne">
                    <div class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOne">
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextThree" style="color: #FF2D55;">BETA</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextOne">Question Solve Delay</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextTwo">Adjust how many seconds it takes for each question to get solved. A lower number will solve faster, and a higher number will solve slower. Use a higher number if your computer is slow or AutoSolver answers incorrectly. Continue clicking on the toggle to enter custom timing.</p>
                    </div>
                    <div id="DuolingoProSettingsBoxToggleT2ID2" class="DLPSettingsToggleT2 DLPSettingsToggleRmElement">
                        <div class="DLPSettingsToggleT2B1 DLPSettingsToggleRmElement">
                            <p class="DLPSettingsToggleT2B1T1 DLPSettingsToggleRmElement noSelect" style="margin: 0;">0.6</p>
                        </div>
                    </div>
                </div>

                <div class="DuolingoProSettingsBoxSectionTwoBoxOne">
                    <div class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOne">
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextThree" style="color: #FF2D55;">BETA</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextOne">AntiStuck</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextTwo">In a case where Duolingo Pro fails to answer a question, AntiStuck will send an anomosus fail report, which can be used by our developers to fix AutoSolve for that type of question, and also reload the lesson, in hopes of not encountering the same question in the next lesson.</p>
                    </div>
                    <div id="DuolingoProSettingsBoxToggleT1ID2" class="DLPSettingsToggleT1 DLPSettingsToggleT1ON DLPSettingsToggleRmElement">
                        <div class="DLPSettingsToggleT1B1 DLPSettingsToggleT1ONB1 DLPSettingsToggleRmElement">
                            <svg class="DLPSettingsToggleT1B1I1 DLPSettingsToggleRmElement" style="display: ;" "16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.41406 13.9453C5.91406 13.9453 5.53906 13.7656 5.20312 13.3672L1.17188 8.48438C0.890625 8.16406 0.789062 7.875 0.789062 7.54688C0.789062 6.8125 1.33594 6.27344 2.09375 6.27344C2.53125 6.27344 2.84375 6.42969 3.13281 6.77344L6.375 10.7969L12.7656 0.71875C13.0781 0.226562 13.3984 0.0390625 13.9141 0.0390625C14.6641 0.0390625 15.2109 0.570312 15.2109 1.30469C15.2109 1.57812 15.125 1.86719 14.9219 2.17969L7.64062 13.3125C7.35938 13.7422 6.94531 13.9453 6.41406 13.9453Z" fill="white"/>
                            </svg>
                            <svg class="DLPSettingsToggleT1B1I2 DLPSettingsToggleRmElement" style="display: none; transform: scale(0);" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.867188 12.9922C0.414062 12.5469 0.429688 11.7578 0.851562 11.3359L5.32031 6.86719L0.851562 2.41406C0.429688 1.98438 0.414062 1.20312 0.867188 0.75C1.32031 0.289062 2.10938 0.304688 2.53125 0.734375L6.99219 5.19531L11.4531 0.734375C11.8906 0.296875 12.6562 0.296875 13.1094 0.75C13.5703 1.20312 13.5703 1.96875 13.125 2.41406L8.67188 6.86719L13.125 11.3281C13.5703 11.7734 13.5625 12.5312 13.1094 12.9922C12.6641 13.4453 11.8906 13.4453 11.4531 13.0078L6.99219 8.54688L2.53125 13.0078C2.10938 13.4375 1.32812 13.4453 0.867188 12.9922Z" fill="white"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="DuolingoProSettingsBoxSectionTwoBoxOne">
                    <div class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOne">
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextThree" style="color: #007AFF;">DISABLED UNTIL NEXT MONTH</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextOne">Manually Check for an Update</p>
                        <p class="DuolingoProSettingsBoxSectionTwoBoxOneBoxOneTextTwo">Duolingo Pro automatically performs periodic checks for updates. Alternatively, you can manually check for updates too.</p>
                    </div>
                    <div id="DLPSettingsToggleT3ID3" class="DLPSettingsToggleT3">
                        <div class="DLPSettingsToggleT3B1">
                            <svg class="DLPSettingsToggleT3B1I1" width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.890625 10.3984C0.890625 6.45312 4.01562 3.32031 7.9375 3.32031C8.21094 3.32031 8.49219 3.35156 8.72656 3.39062L7.17188 1.86719C7.00781 1.6875 6.89844 1.48438 6.89844 1.21094C6.89844 0.65625 7.32812 0.210938 7.875 0.210938C8.14844 0.210938 8.375 0.3125 8.55469 0.5L11.7422 3.75C11.9453 3.94531 12.0547 4.20312 12.0547 4.47656C12.0547 4.75781 11.9531 4.99219 11.7422 5.20312L8.55469 8.4375C8.375 8.60938 8.14844 8.70312 7.875 8.70312C7.32812 8.70312 6.89844 8.27344 6.89844 7.72656C6.89844 7.45312 7.00781 7.25 7.17969 7.07812L8.9375 5.33594C8.64062 5.28125 8.30469 5.25781 7.9375 5.25781C5.11719 5.25781 2.90625 7.51562 2.90625 10.3984C2.90625 13.2188 5.17188 15.5 8 15.5C10.8281 15.5 13.1094 13.2188 13.1094 10.3984C13.1094 9.78906 13.5078 9.36719 14.0938 9.36719C14.6875 9.36719 15.1094 9.78906 15.1094 10.3984C15.1094 14.3359 11.9375 17.5156 8 17.5156C4.07031 17.5156 0.890625 14.3359 0.890625 10.3984Z" fill="white"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <div style="display: flex; padding: 16px; flex-direction: column; justify-content: center; align-items: flex-start; gap: 8px; align-self: stretch; border-radius: 8px; border: 2px solid rgba(0, 122, 255, 0.10); background: rgba(0, 122, 255, 0.10);">
                    <div style="display: flex; align-items: center; gap: 8px; align-self: stretch;">
                        <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 16.9766C8.57812 16.9766 8.24219 16.6719 8.15625 16.2188C7.35156 11.0156 6.70312 10.3984 1.66406 9.70312C1.21094 9.64062 0.882812 9.29688 0.882812 8.85938C0.882812 8.42188 1.21875 8.0625 1.67188 8.00781C6.71875 7.44531 7.4375 6.71094 8.15625 1.5C8.22656 1.05469 8.57031 0.742188 9 0.742188C9.42188 0.742188 9.76562 1.05469 9.83594 1.5C10.625 6.71094 11.3047 7.38281 16.3359 8.00781C16.7812 8.07031 17.1172 8.42188 17.1172 8.85938C17.1172 9.29688 16.7812 9.64844 16.3281 9.70312C11.2812 10.2734 10.5547 11.0078 9.83594 16.2188C9.77344 16.6641 9.42969 16.9766 9 16.9766Z" fill="#007AFF"/>
                        </svg>
                        <p class="paragraphText noSelect" style="flex: 1 0 0; color: #007AFF;">Contributors & Libraries</p>
                    </div>
                    <p class="paragraphText noSelect" style="align-self: stretch; color: rgba(0, 122, 255, 0.50);"><a href="https://github.com/anonymoushackerIV" target="_blank" rel="noopener noreferrer" class="DuolingoProSettingsBoxContributorsLink">anonymoushackerIV</a>, <a href="https://github.com/surebrec" target="_blank" rel="noopener noreferrer" class="DuolingoProSettingsBoxContributorsLink">surebrec</a>, <a href="https://github.com/SicariusBlack" target="_blank" rel="noopener noreferrer" class="DuolingoProSettingsBoxContributorsLink">SicariusBlack</a>, <a href="https://github.com/supabase/supabase-js" target="_blank" rel="noopener noreferrer" class="DuolingoProSettingsBoxContributorsLink">supabase-js</a>, <a href="https://github.com/niklasvh/html2canvas" target="_blank" rel="noopener noreferrer" class="DuolingoProSettingsBoxContributorsLink">html2canvas</a></p>
                </div>

            </div>
            <div class="DuolingoProSettingsBoxSectionThree">
                <button class="DPLSecondaryButtonStyleT1" id="DuolingoProSettingsBoxCancelButton">CANCEL</button>
                <button class="DPLPrimaryButtonStyleT1" id="DuolingoProSettingsBoxSaveButton">SAVE</button>
            </div>
        </div>
    </div>
</div>
`;

const DuolingoProSettingsBoxCSS = `
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
    //width: 98px;
    height: 36px;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    border-radius: 8px;
    border: 2px solid rgba(0, 0, 0, 0.20);
    background: #FF2D55;

    padding-left: 8px;
    padding-right: 8px;
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



.DuolingoProSettingsBoxSectionThree {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
}

.DuolingoProSettingsBoxContributorsLink {
    color: rgba(0, 122, 255, 0.50);
    text-decoration-line: underline;
    transition: .1s;
}
.DuolingoProSettingsBoxContributorsLink:hover {
    color: #007AFF;
}
`;

let injectedDuolingoProSettingsBoxElement = null;
let injectedDuolingoProSettingsBoxStyle = null;

function injectDuolingoProSettingsBox() {
    if (wasDuolingoProSettingsButtonOnePressed === true) {
        if (!injectedDuolingoProSettingsBoxElement) {

            injectedDuolingoProSettingsBoxElement = document.createElement('div');
            injectedDuolingoProSettingsBoxElement.innerHTML = DuolingoProSettingsBoxHTML;
            document.body.appendChild(injectedDuolingoProSettingsBoxElement);

            injectedDuolingoProSettingsBoxStyle = document.createElement('style');
            injectedDuolingoProSettingsBoxStyle.type = 'text/css';
            injectedDuolingoProSettingsBoxStyle.innerHTML = DuolingoProSettingsBoxCSS;
            document.head.appendChild(injectedDuolingoProSettingsBoxStyle);

            let DuolingoProSettingsBoxWholeDiv = document.querySelector('#DuolingoProSettingsBoxShadow');
            setTimeout(function() {
                DuolingoProSettingsBoxWholeDiv.style.opacity = '1';
            }, 50);

            const DuolingoProSettingsBoxCancelButton = document.querySelector('#DuolingoProSettingsBoxCancelButton');
            DuolingoProSettingsBoxCancelButton.addEventListener('click', () => {
                let DuolingoProSettingsBoxWholeDiv = document.querySelector('#DuolingoProSettingsBoxShadow');
                setTimeout(function() {
                    DuolingoProSettingsBoxWholeDiv.style.opacity = '0';
                }, 50);

                setTimeout(function() {
                    wasDuolingoProSettingsButtonOnePressed = false;

                    AutoSolverSettingsShowAutoSolverBox = JSON.parse(localStorage.getItem('AutoSolverSettingsShowAutoSolverBox'));
                    //AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox = JSON.parse(localStorage.getItem('AutoSolverSettingsShowPracticeOnlyModeForAutoSolverBox'));
                    //AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox = JSON.parse(localStorage.getItem('AutoSolverSettingsShowRepeatLessonModeForAutoSolverBox'));
                    AutoSolverSettingsLowPerformanceMode = JSON.parse(localStorage.getItem('AutoSolverSettingsLowPerformanceMode'));
                    solveSpeed = parseFloat(localStorage.getItem('duopro.autoSolveDelay'));
                }, 500);
            });

            const DuolingoProSettingsBoxSaveButton = document.querySelector('#DuolingoProSettingsBoxSaveButton');
            DuolingoProSettingsBoxSaveButton.addEventListener('click', () => {

                //if (JSON.parse(localStorage.getItem('AutoSolverSettingsLowPerformanceMode')) !== AutoSolverSettingsLowPerformanceMode) {
                //    settingsStuff("Duolingo Pro Low Performance Mode", AutoSolverSettingsLowPerformanceMode ? 'ON' : 'OFF');
                //}
                //if (JSON.parse(localStorage.getItem('DuolingoProSettingsProBlockMode')) !== DuolingoProSettingsProBlockMode) {
                //    settingsStuff("Duolingo Pro ProBlock", DuolingoProSettingsProBlockMode ? 'ON' : 'OFF');
                //}
                //if (JSON.parse(localStorage.getItem('DuolingoProShadeLessonsMode')) !== DuolingoProShadeLessonsMode) {
                //    settingsStuff("Duolingo Pro Shade Mode", DuolingoProShadeLessonsMode ? 'ON' : 'OFF');
                //}
                //if (JSON.parse(localStorage.getItem('DuolingoProAntiStuckProtectionMode')) !== DuolingoProAntiStuckProtectionMode) {
                //    settingsStuff("Duolingo Pro AntiStuck Protection", DuolingoProAntiStuckProtectionMode ? 'ON' : 'OFF');
                //}
                if (parseFloat(localStorage.getItem('duopro.autoSolveDelay')) !== solveSpeed) {

                }

                localStorage.setItem('duopro.autoSolveDelay', solveSpeed);
                localStorage.setItem('DuolingoProShadeLessonsMode', DuolingoProShadeLessonsMode);
                //localStorage.setItem('AutoSolverSettingsLowPerformanceMode', AutoSolverSettingsLowPerformanceMode);
                //localStorage.setItem('DuolingoProSettingsProBlockMode', DuolingoProSettingsProBlockMode);
                //localStorage.setItem('DuolingoProShadeLessonsMode', DuolingoProShadeLessonsMode);
                localStorage.setItem('DuolingoProAntiStuckProtectionMode', DuolingoProAntiStuckProtectionMode);

                DuolingoProSettingsBoxSaveButton.textContent = 'SAVING AND RELOADING';

                setTimeout(function() {
                    //wasDuolingoProSettingsButtonOnePressed = false;
                    location.reload();
                }, 2000);

            });

            const DuolingoProSettingsBoxToggleT1ID1 = document.querySelector('#DuolingoProSettingsBoxToggleT1ID1');
            DuolingoProSettingsBoxToggleT1ID1.addEventListener('click', () => {
                DuolingoProShadeLessonsMode = !DuolingoProShadeLessonsMode;
                updateDuolingoProSettingsToggle(1, DuolingoProSettingsBoxToggleT1ID1, DuolingoProShadeLessonsMode);
            });

            const DuolingoProSettingsBoxToggleT2ID2 = document.querySelector('#DuolingoProSettingsBoxToggleT2ID2');
            DuolingoProSettingsBoxToggleT2ID2.addEventListener('click', () => {
                if (solveSpeed === 0.6) {
                    solveSpeed = 0.7;
                    updateDuolingoProSettingsToggle(2, DuolingoProSettingsBoxToggleT2ID2, solveSpeed);
                } else if (solveSpeed === 0.7) {
                    solveSpeed = 0.8;
                    updateDuolingoProSettingsToggle(2, DuolingoProSettingsBoxToggleT2ID2, solveSpeed);
                } else if (solveSpeed === 0.8) {
                    solveSpeed = 0.9;
                    updateDuolingoProSettingsToggle(2, DuolingoProSettingsBoxToggleT2ID2, solveSpeed);
                } else if (solveSpeed === 0.9) {
                    updateDuolingoProSettingsToggle(2, DuolingoProSettingsBoxToggleT2ID2, "Custom");
                    setTimeout(function() {
                        ObywJEgHfSkHSgDTFunction();
                    }, 100);
                } else {
                    solveSpeed = 0.6;
                    updateDuolingoProSettingsToggle(2, DuolingoProSettingsBoxToggleT2ID2, solveSpeed);
                }
            });

            const DuolingoProSettingsBoxToggleT1ID2 = document.querySelector('#DuolingoProSettingsBoxToggleT1ID2');
            DuolingoProSettingsBoxToggleT1ID2.addEventListener('click', () => {
                DuolingoProAntiStuckProtectionMode = !DuolingoProAntiStuckProtectionMode;
                updateDuolingoProSettingsToggle(1, DuolingoProSettingsBoxToggleT1ID2, DuolingoProAntiStuckProtectionMode);
            });

            function slideEventForT22() {
                var startX = null;
                var startY = null;
                var pressed = false;

                document.addEventListener('mousedown', function(event) {
                    if (event.target.classList.contains('DLPSettingsToggleRmElement')) {
                        startX = event.clientX;
                        startY = event.clientY;
                        pressed = true;
                    }
                });

                document.addEventListener('mouseup', function(event) {
                    if (pressed) {
                        let currentX = event.clientX;
                        let currentY = event.clientY;
                        pressed = false;
                        if (Math.abs(currentX - startX) > 20 || Math.abs(currentY - startY) > 20) {
                            notificationCall("Try clicking instead of swiping", "Click on the toggle instead of swiping.");
                        }
                    }
                });
            }
            slideEventForT22();

            function updateDuolingoProSettingsToggleAll() {
                updateDuolingoProSettingsToggle(1, DuolingoProSettingsBoxToggleT1ID1, DuolingoProShadeLessonsMode);
                updateDuolingoProSettingsToggle(2, DuolingoProSettingsBoxToggleT2ID2, solveSpeed);
                updateDuolingoProSettingsToggle(1, DuolingoProSettingsBoxToggleT1ID2, DuolingoProAntiStuckProtectionMode);
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

function updateDuolingoProSettingsToggle(id, element, variable) {
    if (id === 1) {
        let smthElement = element;
        let smthElementB = smthElement.querySelector(".DLPSettingsToggleT1B1");
        let smthElementBI1 = smthElement.querySelector(".DLPSettingsToggleT1B1I1");
        let smthElementBI2 = smthElement.querySelector(".DLPSettingsToggleT1B1I2");
        if (variable === false) {
            smthElement.classList.add("DLPSettingsToggleT1OFF");
            smthElement.classList.remove("DLPSettingsToggleT1ON");
            smthElementB.classList.add("DLPSettingsToggleT1OFFB1");
            smthElementB.classList.remove("DLPSettingsToggleT1ONB1");
            smthElementBI1.style.transform = 'scale(0)';
            setTimeout(function() {
                smthElementBI1.style.display = "none";
                smthElementBI2.style.display = "";
                smthElementBI2.style.transform = 'scale(1)';
            }, 100);
        } else if (variable === true) {
            smthElement.classList.add("DLPSettingsToggleT1ON");
            smthElement.classList.remove("DLPSettingsToggleT1OFF");
            smthElementB.classList.add("DLPSettingsToggleT1ONB1");
            smthElementB.classList.remove("DLPSettingsToggleT1OFFB1");
            smthElementBI2.style.transform = 'scale(0)';
            setTimeout(function() {
                smthElementBI2.style.display = "none";
                smthElementBI1.style.display = "";
                smthElementBI1.style.transform = 'scale(1)';
            }, 100);
        } else {
            console.log("error #11");
        }
    } else if (id === 2) {
        let elementTB = element.querySelector(".DLPSettingsToggleT2B1");
        let elementTBT = element.querySelector(".DLPSettingsToggleT2B1T1");
        if (variable === 0.6) {
            elementTB.style.marginLeft = "6px";
            elementTBT.textContent = "0.6";
            elementTB.style.width = "";
        } else if (variable === 0.7) {
            elementTB.style.marginLeft = "22px";
            elementTBT.textContent = "0.7";
        } else if (variable === 0.8) {
            elementTB.style.marginLeft = "38px";
            elementTBT.textContent = "0.8";
        } else if (variable === 0.9) {
            elementTB.style.marginLeft = "54px";
            elementTBT.textContent = "0.9";
        } else if (variable === "Custom") {
            elementTB.style.marginLeft = "6px";
            elementTB.style.width = "80px";
            elementTBT.textContent = "Custom";
        } else {
            elementTB.style.marginLeft = "6px";
            elementTB.style.width = "80px";
            elementTBT.textContent = String(variable);
        }
    }
}


const ObywJEgHfSkHSgDT = `
<div class="DPLBoxShadowStyleT1" id="DLPSettingsBoxCustomSolveDelayBoxOneID">
	<div class="DPLBoxStyleT1 VStack" style="width: 256px;">
		<div class="DPIPUL1 HStack" style="display: flex; justify-content: center; align-items: center; gap: 8px; align-self: stretch;">
			<svg width="17" height="18" viewBox="0 0 17 18" fill="rgb(var(--color-eel))" xmlns="http://www.w3.org/2000/svg">
				<path d="M8.64844 17.1094C4.07812 17.1094 0.398438 13.4297 0.398438 8.85938C0.398438 6.97656 1.05469 5.22656 2.13281 3.84375C2.58594 3.21875 3.30469 3.17188 3.75 3.59375C4.20312 4.03125 4.10938 4.54688 3.72656 5.10938C2.92969 6.14844 2.46094 7.46875 2.45312 8.85938C2.44531 12.2812 5.20312 15.0547 8.64844 15.0547C12.0938 15.0547 14.8438 12.2812 14.8438 8.85938C14.8438 5.65625 12.4688 3.01562 9.35938 2.65625V4.16406C9.35938 4.65625 9.01562 5.03125 8.52344 5.03125C8.03125 5.03125 7.67969 4.65625 7.67969 4.16406V1.52344C7.67969 0.953125 8.0625 0.609375 8.65625 0.609375C13.2266 0.609375 16.8984 4.28906 16.8984 8.85938C16.8984 13.4297 13.2266 17.1094 8.64844 17.1094ZM9.91406 10.1719C9.21094 10.8594 8.20312 10.7031 7.67188 9.89062L5.1875 6.17969C4.80469 5.59375 5.34375 5.04688 5.92969 5.42969L9.64844 7.91406C10.4609 8.45312 10.6094 9.45312 9.91406 10.1719Z"/>
			</svg>
			<p class="DPIPUL1T2" style="margin: 0; flex: 1 0 0; color: rgb(var(--color-eel)); font-size: 16px; font-style: normal; font-weight: 700; line-height: normal; margin: 0;">Custom Solve Delay</p>
		</div>
		<input class="DLPFeedbackTextFieldT1" id="DLPSettingsBoxCustomSolveDelayBoxOneInputID" type="number" style="resize: none; height: 54px;" placeholder="0.6 - 30">
		<div style="display: flex; align-items: flex-start; gap: 8px; align-self: stretch;">
			<button class="DPLSecondaryButtonStyleT1" id="DLPSettingsBoxCustomSolveDelayBoxOneCancelButtonID">CANCEL</button>
			<button class="DPLPrimaryButtonStyleT1" id="DLPSettingsBoxCustomSolveDelayBoxOneSaveButtonID">SAVE</button>
		</div>
	</div>
</div>
`;
let ObywJEgHfSkHSgDTElement = null;
function ObywJEgHfSkHSgDTFunction() {
    try {
        if (!ObywJEgHfSkHSgDTElement) {
            document.body.insertAdjacentHTML('beforeend', ObywJEgHfSkHSgDT);
            ObywJEgHfSkHSgDTElement = ObywJEgHfSkHSgDT;
            let ooSOIuzdgFhWQnMF = document.querySelector("#DLPSettingsBoxCustomSolveDelayBoxOneID")
            setTimeout(function() {
                ooSOIuzdgFhWQnMF.style.opacity = "1";
            }, 50);

            let dyYWhDVQJASxSpEt = document.querySelector('#DLPSettingsBoxCustomSolveDelayBoxOneCancelButtonID');
            let WFJpVXqPJOKtwFRX = document.querySelector('#DLPSettingsBoxCustomSolveDelayBoxOneSaveButtonID');
            dyYWhDVQJASxSpEt.addEventListener('click', () => {
                solveSpeed = 0.6;
                const DuolingoProSettingsBoxToggleT2ID2 = document.querySelector('#DuolingoProSettingsBoxToggleT2ID2');
                updateDuolingoProSettingsToggle(2, DuolingoProSettingsBoxToggleT2ID2, solveSpeed);
                setTimeout(function() {
                    ooSOIuzdgFhWQnMF.style.opacity = '0';
                }, 50);
                ObywJEgHfSkHSgDTElement = null;
                ooSOIuzdgFhWQnMF.remove();
            });
            WFJpVXqPJOKtwFRX.addEventListener('click', () => {
                let inputValue = document.getElementById('DLPSettingsBoxCustomSolveDelayBoxOneInputID').value.trim();
                let regex = /^[0-9]+(\.[0-9]+)?$/;
                if (regex.test(inputValue) && inputValue >= 0.6 && inputValue <= 30) {
                    solveSpeed = parseFloat(inputValue).toFixed(1);
                    const DuolingoProSettingsBoxToggleT2ID2 = document.querySelector('#DuolingoProSettingsBoxToggleT2ID2');
                    updateDuolingoProSettingsToggle(2, DuolingoProSettingsBoxToggleT2ID2, solveSpeed);
                    setTimeout(function() {
                        ooSOIuzdgFhWQnMF.style.opacity = '0';
                    }, 50);
                    ObywJEgHfSkHSgDTElement = null;
                    ooSOIuzdgFhWQnMF.remove();
                } else {
                    notificationCall("Invalid Number", "Make sure to enter a number between 0.6 and 30, with no other text or spaces. ");
                    //alert('Input is invalid. Please enter a number between 0.6 and 30 with no more than 1 decimal.');
                }
            });
        }
    } catch(error) {}
}



let downloadStuffVar = 'none';
let updateStuffVar = 'none';

if (String(localStorage.getItem('duolingoProLastInstalledVersion')) === null || String(localStorage.getItem('duolingoProLastInstalledVersion')) === "null") {
    downloadStuffVar = 'trying';

    setTimeout(function() {
        versionServerStuff('download', "Download", duolingoProCurrentVersion);
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
                versionServerStuff('download', 'Download', duolingoProCurrentVersion);
                checkFlagTwo();
            }, 1000);
        } else if (downloadStuffVar === 'empty') {
            notificationCall("Duolingo Pro Encountered An Error", "Duolingo Pro error #0001");
        }
    }

} else if (String(localStorage.getItem('duolingoProLastInstalledVersion')) !== duolingoProCurrentVersion) {
    updateStuffVar = 'trying';

    localStorage.setItem('DLP4Uz53cm6wjnOG7tY', "true");
    DLPpromotionBubbleVisibility = true;

    setTimeout(function() {
        versionServerStuff('update', "Update", duolingoProCurrentVersion, String(localStorage.getItem('duolingoProLastInstalledVersion')));
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
                versionServerStuff('update', "Update", duolingoProCurrentVersion, String(localStorage.getItem('duolingoProLastInstalledVersion')));
                checkFlagThree();
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
            localStorage.setItem('screenWidthDuolingoPro', screenWidth);
            setTimeout(function() {
                BegMobileSupport();
            }, 1000);
        } else if (Number(localStorage.getItem('screenWidthDuolingoPro')) !== screenWidth) {
            localStorage.setItem('screenWidthDuolingoPro', screenWidth);
            setTimeout(function() {
                BegMobileSupport();
            }, 1000);
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
        const boxFirst = document.querySelector('.AutoSolverBoxFirst');

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
        <div class="BlockBoxOneSectionTwoBoxOne noSelect">END LESSON</div>
        <div class="BlockBoxOneSectionTwoBoxTwo noSelect">SHOW LESSON</div>
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

    z-index: 512;
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




const DuolingoProSolveJustThisBoxButtonHTML = `
<div class="DPJustSolveThisLessonButtonOne noSelect">AUTOSOLVE LESSON</div>
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
if (ASTL464) {
    setInterval(DuolingoProSolveJustThisBoxExtraButtonFunction, 100);
}

if (wasDuolingoProJustSolveThisLessonButtonOnePressed) {
    setTimeout(function() {
        solving(true);
    }, 1000);
    wasDuolingoProJustSolveThisLessonButtonOnePressed = false;
    sessionStorage.setItem('wasDuolingoProJustSolveThisLessonButtonOnePressed', wasDuolingoProJustSolveThisLessonButtonOnePressed);
}


let duolingoProCurrentNewVersion;
function checkForUpdatesVersion() {
    async function updateWarningsFromURL(url, currentVersion) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                //throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const versionData = data[currentVersion];
            if (versionData) {
                for (const warningKey in versionData) {
                    if (warningKey === 'status') {
                        if (versionData[warningKey] !== "latest") {
                            UpdateAvailableAutoSolverBoxAlertFunction();
                        }
                    }
                }
            } else {
                console.log(`Warnings not found for Duolingo Pro ${duolingoProFormalCurrentVersion}, this version may be deprecated.`);
                UpdateAvailableAutoSolverBoxAlertFunction();
            }
        } catch (error) {
            console.log(`Error getting data: ${error.message}`);
        }
    }
    updateWarningsFromURL('https://raw.githubusercontent.com/anonymoushackerIV/Duolingo-Pro-Assets/main/resources/issues-and-fixes.json', duolingoProFormalCurrentVersion);
}



const DuolingoProNotificationBoxHTML = `
<div class="BlockedByDuolingoProBoxBackground" id="DuolingoProNotificationBackgroundOneID">
    <div class="BlockedByDuolingoProBoxSectionOne">
        <p class="BlockedByDuolingoProBoxSectionOneTextOne" id="DuolingoProNotificationTitleOneID">Title</p>
        <p class="BlockedByDuolingoProBoxSectionOneTextTwo noSelect" id="DuolingoProNotificationHideButtonOneID">DISMISS</p>
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
<div class="AutoSolverBoxAlertOneBox" id="AutoSolverBoxAlertOneBoxIDUpdate" style="border: 2px solid rgba(52, 199, 89, 0.10); background: rgba(52, 199, 89, 0.10); padding: 8px; border-radius: 8px;">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" width="18" height="18" fill="#34C759">
        <path d="M8.64844 16.625C4.125 16.625 0.398438 12.8984 0.398438 8.375C0.398438 3.84375 4.11719 0.125 8.64844 0.125C13.1719 0.125 16.8984 3.84375 16.8984 8.375C16.8984 12.8984 13.1797 16.625 8.64844 16.625ZM8.64844 3.47656C8.46875 3.47656 8.25 3.55469 8.09375 3.72656L4.92969 7.125C4.70312 7.36719 4.59375 7.57812 4.59375 7.83594C4.59375 8.22656 4.89062 8.52344 5.28906 8.52344H6.72656V11.7188C6.72656 12.4531 7.14062 12.8672 7.85938 12.8672H9.42188C10.1328 12.8672 10.5625 12.4531 10.5625 11.7188V8.52344H12C12.3906 8.52344 12.7031 8.22656 12.7031 7.82812C12.7031 7.57812 12.6016 7.39062 12.3516 7.125L9.21094 3.72656C9.03906 3.54688 8.84375 3.47656 8.64844 3.47656Z"/>
    </svg>
    <p class="AutoSolverBoxAlertOneBoxTextOne" style="color: #34C759;">Update Available</p>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 15" width="9" height="15" fill="#34C759">
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
<div class="DPLBoxShadowStyleT1" id="DPUDPUshadowThing">
    <div class="BPUDPUB1">
        <div class="BPUDPUL1">
            <h1 class="BPUDPUL1T1" style="font-size: 32px;">An Update is Available</h1>
            <p class="BPUDPUL1T1" id="huhuiguyfty" style="font-size: 16px;">A newer version of Duolingo Pro is now available for download.</p>
        </div>
        <div style="position: absolute; bottom: 16px; display: flex; width: 512px; justify-content: center; align-items: center; gap: 8px;">
            <a href="https://greasyfork.org/en/scripts/473310-duolingo-pro-beta" target="_blank">
		    <div class="BPUDPUB1BN1 noSelect" id="BPUDPUB1BN1ON1">MANUALLY UPDATE</div>
            </a>
			<div class="BPUDPUB1BN1 noSelect" id="BPUDPUB1BN1DS">OK</div>
		</div>
    </div>
</div>
`;

const UpdateAvailablePopUpCSS = `
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
                let smthdfshfb = document.querySelector('#DPUDPUshadowThing');
                smthdfshfb.style.opacity = '1';
            }, 50);

            let smfuerhguf = document.querySelector('#BPUDPUB1BN1DS');
            smfuerhguf.addEventListener('click', () => {
                UpdateAvailablePopUpFunction(false);
            });
        } else {
            let smthdfshfb = document.querySelector('#DPUDPUshadowThing');
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
    <p class="DPAutoServerElementsMenu noSelect" style="flex: 1 0 0; color: #007AFF; font-size: 16px; font-style: normal; font-weight: 700; line-height: normal; margin: 0px;">AutoServer</p>
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

if (ASB969) {
    DPAutoServerButtonMainMenuFunction();
}


const DuolingoProCounterOneHTML = `
<div id="DLPTBL1ID" class="DuolingoProCounterBoxOneClass" style="display: inline-flex; justify-content: center; flex-direction: row-reverse; align-items: center; gap: 4px; position: fixed; top: 16px; right: 16px; z-index: 1024;">
    <div class="vCIrKKxykXwXyUza" id="DLPTB1e1ID">
        <svg id="DLPTB1e1i1ID" style="display: none;" width="20" height="10" viewBox="0 0 20 10" fill="rgb(var(--color-eel))" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.223633 5.06445C0.223633 2.2959 2.01465 0.470703 4.66699 0.470703C6.02734 0.470703 7.20312 1.04492 8.41309 2.2207L9.91016 3.66309L11.4004 2.2207C12.6104 1.04492 13.7861 0.470703 15.1465 0.470703C17.7988 0.470703 19.5898 2.2959 19.5898 5.06445C19.5898 7.82617 17.7988 9.65137 15.1465 9.65137C13.7861 9.65137 12.6104 9.08398 11.4004 7.9082L9.91016 6.45898L8.41309 7.9082C7.20312 9.08398 6.02734 9.65137 4.66699 9.65137C2.01465 9.65137 0.223633 7.82617 0.223633 5.06445ZM2.25391 5.06445C2.25391 6.61621 3.21777 7.62109 4.66699 7.62109C5.45312 7.62109 6.17773 7.23828 6.99121 6.46582L8.47461 5.06445L6.99121 3.66309C6.17773 2.89062 5.45312 2.50098 4.66699 2.50098C3.21777 2.50098 2.25391 3.50586 2.25391 5.06445ZM11.3389 5.06445L12.8223 6.46582C13.6426 7.23828 14.3604 7.62109 15.1465 7.62109C16.5957 7.62109 17.5596 6.61621 17.5596 5.06445C17.5596 3.50586 16.5957 2.50098 15.1465 2.50098C14.3604 2.50098 13.6357 2.89062 12.8223 3.66309L11.3389 5.06445Z"/>
        </svg>
        <p id="DLPTB1e1t1ID" class="vCIrKKxykXwXyUza-Text noSelect">Infinity</p>
    </div>
    <div class="vCIrKKxykXwXyUza" id="DLPTB1e2ID">
        <svg width="13" height="15" viewBox="0 0 13 15" fill="rgb(var(--color-eel))" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.3486 8.44531C12.3486 10.9336 10.9268 12.0137 6.92773 14.1055C6.74316 14.1943 6.54492 14.2559 6.4082 14.2559C6.27148 14.2559 6.07324 14.1943 5.89551 14.1055C1.88965 12.0205 0.474609 10.9336 0.474609 8.44531V3.38672C0.474609 2.40918 0.795898 2.0127 1.65039 1.65039C2.32031 1.36328 4.80859 0.529297 5.44434 0.324219C5.74512 0.228516 6.11426 0.166992 6.4082 0.166992C6.70215 0.166992 7.07129 0.242188 7.37207 0.324219C8.00781 0.501953 10.4961 1.37012 11.1729 1.65039C12.0205 2.0127 12.3486 2.40918 12.3486 3.38672V8.44531ZM6.33301 12.4512V1.79395C6.2168 1.80078 6.10742 1.82812 5.90234 1.89648C5.19824 2.16309 3.33203 2.80566 2.35449 3.16797C2.16309 3.24316 2.10156 3.35254 2.10156 3.6123V8.18555C2.10156 10.0381 3.09961 10.5576 6.06641 12.3281C6.19629 12.4033 6.26465 12.4375 6.33301 12.4512Z"/>
        </svg>
        <p class="vCIrKKxykXwXyUza-Text noSelect">AntiStuck <a id="DLPTB1e2t2ID" style="color: #FF2D55;">OFF</a></p>
    </div>
    <div class="vCIrKKxykXwXyUza" id="DLPTB1e3ID">
        <svg width="17" height="15" viewBox="0 0 17 15" fill="rgb(var(--color-eel))" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.32324 14.8984C4.86523 14.8984 4.5918 14.584 4.5918 14.0918V12.1436H3.97656C2.08301 12.1436 0.743164 10.8721 0.743164 8.80078V3.37988C0.743164 1.30176 2.00098 0.0302734 4.09277 0.0302734H13.1436C15.2354 0.0302734 16.4932 1.30176 16.4932 3.37988V8.80078C16.4932 10.8721 15.2354 12.1436 13.1436 12.1436H8.82324L6.25977 14.4268C5.88379 14.7617 5.63086 14.8984 5.32324 14.8984Z"/>
        </svg>
        <p class="vCIrKKxykXwXyUza-Text noSelect">Feedback</p>
    </div>
    <div class="vCIrKKxykXwXyUza" id="DLPTB1eC1ID" style="width: 40px; padding: 0;">
        <svg id="DLPTB1eC1i1ID" style="transition: all 0.8s cubic-bezier(0.16, 1, 0.32, 1);" width="15" height="16" viewBox="0 0 15 16" fill="rgb(var(--color-eel))" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.44238 15.29C3.48438 15.29 0.223633 12.0293 0.223633 8.06445C0.223633 4.10645 3.47754 0.845703 7.44238 0.845703C11.4004 0.845703 14.6611 4.10645 14.6611 8.06445C14.6611 12.0293 11.4072 15.29 7.44238 15.29ZM8.87793 11.5303C9.17188 11.2363 9.15137 10.7783 8.87793 10.5117L6.2666 8.07129L8.87793 5.63086C9.1582 5.36426 9.1582 4.88574 8.85742 4.6123C8.59082 4.36621 8.16016 4.35938 7.87305 4.63281L5.09766 7.23047C4.61914 7.68164 4.61914 8.46777 5.09766 8.91895L7.87305 11.5166C8.13281 11.7627 8.63184 11.7695 8.87793 11.5303Z"/>
        </svg>
    </div>
</div>
`;
const DuolingoProCounterOneCSS = `
.vCIrKKxykXwXyUza {
    border: 2px solid rgb(var(--color-swan));
    height: 40px;
    width: auto;
    padding: 0 12px;
    gap: 8px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;

    border-radius: 32px;
    background: rgb(var(--color-snow), 0.84);
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(16px);
    overflow: hidden;

    transition: all 0.4s cubic-bezier(0.16, 1, 0.32, 1);
    cursor: pointer;
}

.vCIrKKxykXwXyUza:hover {
    scale: 1.05;
}

.vCIrKKxykXwXyUza:active {
    scale: 0.85;
}

.vCIrKKxykXwXyUza svg {
    flex-shrink: 0;
}

.vCIrKKxykXwXyUza-Text {
    color: rgb(var(--color-eel));
    font-size: 16px;
    font-weight: 700;

    white-space: nowrap;
    margin: 0;
}
`;
let injectedDuolingoProCounterOneElement = null;
let injectedDuolingoProCounterOneStyle = null;

function DuolingoProCounterOneFunction() {
    if (window.location.pathname.includes('/lesson') && wasAutoSolverBoxRepeatStartButtonPressed || window.location.pathname.includes('/practice') && wasAutoSolverBoxRepeatStartButtonPressed) {
        if (!injectedDuolingoProCounterOneElement) {
            injectedDuolingoProCounterOneStyle = document.createElement('style');
            injectedDuolingoProCounterOneStyle.type = 'text/css';
            injectedDuolingoProCounterOneStyle.innerHTML = DuolingoProCounterOneCSS;
            document.head.appendChild(injectedDuolingoProCounterOneStyle);

            document.body.insertAdjacentHTML('beforeend', DuolingoProCounterOneHTML);
            injectedDuolingoProCounterOneElement = DuolingoProCounterOneHTML;

            let fgOFCULKfxUUvNjw1 = document.querySelector('#DLPTB1e1ID');
            let fgOFCULKfxUUvNjw2 = document.querySelector('#DLPTB1e2ID');
            let fgOFCULKfxUUvNjw3 = document.querySelector('#DLPTB1e3ID');
            let UqgpktnVnpDIrSaY = document.querySelector('#DLPTB1eC1ID');
            let UqgpktnVnpDIrSaY1 = document.querySelector('#DLPTB1eC1i1ID');
            let theBarVisibility = false;
            function hideKDOS(noAnimation) {
                fgOFCULKfxUUvNjw2.style.width = fgOFCULKfxUUvNjw2.offsetWidth + "px";
                fgOFCULKfxUUvNjw3.style.width = fgOFCULKfxUUvNjw3.offsetWidth + "px";
                fgOFCULKfxUUvNjw2.style.width = "0px";
                fgOFCULKfxUUvNjw3.style.width = "0px";
                fgOFCULKfxUUvNjw2.style.padding = "0";
                fgOFCULKfxUUvNjw3.style.padding = "0";
                fgOFCULKfxUUvNjw2.style.filter = "blur(8px)";
                fgOFCULKfxUUvNjw3.style.filter = "blur(8px)";
                fgOFCULKfxUUvNjw2.style.margin = "0 -4px";
                fgOFCULKfxUUvNjw3.style.margin = "0 -4px";
                fgOFCULKfxUUvNjw2.style.opacity = "0";
                fgOFCULKfxUUvNjw3.style.opacity = "0";
                if (!noAnimation) {
                    setTimeout(function() {
                        fgOFCULKfxUUvNjw2.style.display = "none";
                        fgOFCULKfxUUvNjw3.style.display = "none";
                    }, 400);
                } else {
                    fgOFCULKfxUUvNjw2.style.display = "none";
                    fgOFCULKfxUUvNjw3.style.display = "none";
                }
            }
            function showKDOS() {
                EAWoMwEP();
                fgOFCULKfxUUvNjw2.style.display = "";
                fgOFCULKfxUUvNjw3.style.display = "";
                fgOFCULKfxUUvNjw2.style.width = "";
                fgOFCULKfxUUvNjw3.style.width = "";
                fgOFCULKfxUUvNjw2.style.padding = "";
                fgOFCULKfxUUvNjw3.style.padding = "";
                let remember0009 = (fgOFCULKfxUUvNjw2.offsetWidth - 0) + "px";
                let remember0010 = (fgOFCULKfxUUvNjw3.offsetWidth - 0) + "px";
                fgOFCULKfxUUvNjw2.style.width = "0px";
                fgOFCULKfxUUvNjw3.style.width = "0px";
                requestAnimationFrame(function() {
                    fgOFCULKfxUUvNjw2.style.width = remember0009;
                    fgOFCULKfxUUvNjw2.style.padding = "";
                    fgOFCULKfxUUvNjw2.style.filter = "";
                    fgOFCULKfxUUvNjw2.style.opacity = "";
                    fgOFCULKfxUUvNjw2.style.margin = "";
                    fgOFCULKfxUUvNjw3.style.width = remember0010;
                    fgOFCULKfxUUvNjw3.style.padding = "";
                    fgOFCULKfxUUvNjw3.style.filter = "";
                    fgOFCULKfxUUvNjw3.style.opacity = "";
                    fgOFCULKfxUUvNjw3.style.margin = "";
                });
            }
            hideKDOS(true);
            UqgpktnVnpDIrSaY.addEventListener('click', () => {
                if (theBarVisibility) {
                    UqgpktnVnpDIrSaY1.style.transform = "rotate(0deg)";
                    theBarVisibility = false;
                    hideKDOS();
                } else {
                    UqgpktnVnpDIrSaY1.style.transform = "rotate(180deg)";
                    theBarVisibility = true;
                    showKDOS();
                }
            });
            fgOFCULKfxUUvNjw2.addEventListener('click', () => {
                DuolingoProAntiStuckProtectionMode = !DuolingoProAntiStuckProtectionMode;
                localStorage.setItem('DuolingoProAntiStuckProtectionMode', DuolingoProAntiStuckProtectionMode);
                EAWoMwEP();
                let remember013 = fgOFCULKfxUUvNjw2.offsetWidth;
                fgOFCULKfxUUvNjw2.style.width = '';
                let remember014 = fgOFCULKfxUUvNjw2.offsetWidth;
                fgOFCULKfxUUvNjw2.style.width = remember013 + 'px';
                requestAnimationFrame(function() {
                    fgOFCULKfxUUvNjw2.style.width = remember014 + 'px';
                });
            });
            fgOFCULKfxUUvNjw3.addEventListener('click', () => {
                solving("stop");
                SendFeedBackBox(true);
            });
        }

        let cLsYCmdd = document.querySelector('#DLPTB1e2t2ID');
        function EAWoMwEP() {
            if (DuolingoProAntiStuckProtectionMode) {
                cLsYCmdd.style.color = '#007AFF';
                cLsYCmdd.textContent = 'ON';
            } else {
                cLsYCmdd.style.color = '#FF2D55';
                cLsYCmdd.textContent = 'OFF';
            }
        }
        let DLPCE728 = document.querySelector('#DLPTB1e1t1ID');
        let DLPCE728i = document.querySelector('#DLPTB1e1i1ID');
        if (DuolingoProSettingsNeverEndMode) {
            DLPCE728i.style.display = '';
            DLPCE728.textContent = 'Infinity';
        } else if (window.location.pathname === '/practice') {
            if (autoSolverBoxRepeatAmount === 2) {
                DLPCE728.textContent = '1 Practice Left';
            } else if (autoSolverBoxRepeatAmount === 1) {
                DLPCE728.textContent = 'Last Practice';
            } else if (autoSolverBoxRepeatAmount === 0) {
                DLPCE728.textContent = 'Finishing Up...';
            } else if (autoSolverBoxRepeatAmount) {
                DLPCE728.textContent = String(autoSolverBoxRepeatAmount + ' Practices Left');
            }
        } else {
            if (autoSolverBoxRepeatAmount === 1) {
                DLPCE728.textContent = '1 Lesson Left';
            } else if (autoSolverBoxRepeatAmount === 0) {
                DLPCE728.textContent = 'Last Lesson';
            } else if (autoSolverBoxRepeatAmount) {
                DLPCE728.textContent = String(autoSolverBoxRepeatAmount + ' Lessons Left');
            }
        }
    } else {
        if (injectedDuolingoProCounterOneElement) {
            let DuolingoProShadeStatusOne = document.querySelector('#DLPTBL1ID');
            if (DuolingoProShadeStatusOne) {
                DuolingoProShadeStatusOne.remove();
            }
            injectedDuolingoProCounterOneElement = null;
        }
    }
}

setInterval(DuolingoProCounterOneFunction, 500);




const CurrentIssuesPopUpHTML = `
<div class="DPLBoxShadowStyleT1" id="SeeActiveIssuesBoxShadow">
    <div class="DPLBoxStyleT1" id="SendFeebackBoxBackground">
        <div class="DPIPUB1">
            <div class="DPIPUL1">
                <h2 class="DPIPUL1T1">Issues & Fixes</h2>
                <p class="DPIPUL1T2" id="DPIPUL1T2DATE">Loading...</p>
            </div>
            <div class="DPIPUL2">

            </div>
            <div class="DPIPUL3" style="display: flex; justify-content: center; align-items: flex-start; gap: 8px; align-self: stretch;">
                <div class="DPIPUL3B1 noSelect">LEARN MORE</div>
                <div class="DPIPUL3B1 noSelect" id="DPIPUL3BDissmissID">OK</div>
            </div>
        </div>
    </div>
</div>
`;

const CurrentIssuesPopUpCSS = `
.DPIPUB1 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;

    width: 100%;
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
.DPIPUL2TI1T1B {
	color: rgb(var(--color-eel));
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
            CurrentIssuesPopUpStyle = document.createElement('style');
            CurrentIssuesPopUpStyle.type = 'text/css';
            CurrentIssuesPopUpStyle.innerHTML = CurrentIssuesPopUpCSS;
            document.head.appendChild(CurrentIssuesPopUpStyle);

            document.body.insertAdjacentHTML('beforeend', CurrentIssuesPopUpHTML);

            setTimeout(function() {
                let djhsafjkds = document.querySelector('#SeeActiveIssuesBoxShadow');
                djhsafjkds.style.opacity = '1';
            }, 50);

            let gfhdsfjdsh = document.querySelector('#DPIPUL3BDissmissID');
            gfhdsfjdsh.addEventListener('click', () => {
                CurrentIssuesPopUpFunction(false);
            });

            let HighWarningComponent1 = `<div class="DPIPUL2TI1"><svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z" fill="#FF2D55"/></svg><p id="DPIPUL2TI1T1ID" class="DPIPUL2TI1T1 DPIPUL2TI1T1R">Warning Title</p></div>`;
            let MediumWarningComponent1 = `<div class="DPIPUL2TI1"><svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.64844 17.1172C4.125 17.1172 0.398438 13.3906 0.398438 8.85938C0.398438 4.33594 4.11719 0.609375 8.64844 0.609375C13.1719 0.609375 16.8984 4.33594 16.8984 8.85938C16.8984 13.3906 13.1797 17.1172 8.64844 17.1172ZM8.65625 10.0312C9.19531 10.0312 9.50781 9.72656 9.53906 9.16406L9.66406 5.79688C9.69531 5.21094 9.26562 4.80469 8.64844 4.80469C8.02344 4.80469 7.60156 5.20312 7.63281 5.79688L7.75781 9.17188C7.78125 9.72656 8.10156 10.0312 8.65625 10.0312ZM8.65625 12.8516C9.27344 12.8516 9.75 12.4609 9.75 11.8594C9.75 11.2734 9.28125 10.875 8.65625 10.875C8.03125 10.875 7.54688 11.2734 7.54688 11.8594C7.54688 12.4609 8.03125 12.8516 8.65625 12.8516Z" fill="#FF9500"/></svg><p id="DPIPUL2TI1T1ID" class="DPIPUL2TI1T1 DPIPUL2TI1T1O">Warning Title</p></div>`;
            let LowWarningComponent1 = `<div class="DPIPUL2TI1"><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.64844 16.6172C4.125 16.6172 0.398438 12.8906 0.398438 8.35938C0.398438 3.83594 4.11719 0.109375 8.64844 0.109375C13.1719 0.109375 16.8984 3.83594 16.8984 8.35938C16.8984 12.8906 13.1797 16.6172 8.64844 16.6172Z" fill="rgb(var(--color-eel))"/></svg><p id="DPIPUL2TI1T1ID" class="DPIPUL2TI1T1 DPIPUL2TI1T1B">Warning Title</p></div>`;
            let FixedWarningComponent1 = `<div class="DPIPUL2TI1"><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.64844 16.6172C4.125 16.6172 0.398438 12.8906 0.398438 8.35938C0.398438 3.83594 4.11719 0.109375 8.64844 0.109375C13.1719 0.109375 16.8984 3.83594 16.8984 8.35938C16.8984 12.8906 13.1797 16.6172 8.64844 16.6172ZM7.78906 12.2812C8.125 12.2812 8.42969 12.1094 8.63281 11.8125L12.2578 6.26562C12.3984 6.0625 12.4766 5.85156 12.4766 5.65625C12.4766 5.17188 12.0469 4.82812 11.5781 4.82812C11.2734 4.82812 11.0156 4.99219 10.8125 5.32031L7.76562 10.1641L6.40625 8.48438C6.19531 8.23438 5.97656 8.125 5.69531 8.125C5.21875 8.125 4.82812 8.50781 4.82812 8.99219C4.82812 9.21875 4.89844 9.41406 5.07812 9.63281L6.91406 11.8203C7.16406 12.125 7.4375 12.2812 7.78906 12.2812Z" fill="#34C759"/></svg><p id="DPIPUL2TI1T1ID" class="DPIPUL2TI1T1 DPIPUL2TI1T1G">Warning Title</p></div>`;

            function createWarningElement(warning) {
                let htmlContent = '';

                switch (warning['warning-level']) {
                    case 'high':
                        htmlContent = HighWarningComponent1;
                        break;
                    case 'medium':
                        htmlContent = MediumWarningComponent1;
                        break;
                    case 'low':
                        htmlContent = LowWarningComponent1;
                        break;
                    case 'fixed':
                        htmlContent = FixedWarningComponent1;
                        break;
                    default:
                        //htmlContent = `<div class="DPIPUL2TI1"><p id="DPIPUL2TI1T1ID" class="DPIPUL2TI1T1">${warning['warning-title']}</p></div>`;
                        break;
                }

                htmlContent = htmlContent.replace('Warning Title', warning['warning-title']);
                document.querySelector('.DPIPUL2').insertAdjacentHTML('beforeend', htmlContent);
            }

            let NextUpdateTrackerComponent1 = `
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
            `;

            async function updateWarningsFromURL(url, currentVersion) {
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();

                    const versionData = data[currentVersion];
                    const lastUpdated = versionData['last-updated'];
                    if (versionData) {
                        for (const warningKey in versionData) {
                            if (warningKey !== 'status' && warningKey !== 'last-updated') {
                                createWarningElement(versionData[warningKey]);
                            } else if (warningKey === 'status') {
                                let shfueowifj = versionData[warningKey];
                            }
                        }
                        document.querySelector('#DPIPUL1T2DATE').textContent = "Last Updated: " + String(lastUpdated);
                        document.querySelector('.DPIPUL2').insertAdjacentHTML('beforeend', NextUpdateTrackerComponent1);
                    } else {
                        alert(`Warnings not found for Duolingo Pro ${duolingoProFormalCurrentVersion}, this version may be deprecated. `);
                    }
                } catch (error) {
                    alert(`Error getting data: ${error.message}`);
                }
            }
            updateWarningsFromURL('https://raw.githubusercontent.com/anonymoushackerIV/Duolingo-Pro-Assets/main/resources/issues-and-fixes.json', duolingoProFormalCurrentVersion);
        } else {
            let djhsafjkds = document.querySelector('#SeeActiveIssuesBoxShadow');
            djhsafjkds.style.opacity = '0';

            setTimeout(function() {
                djhsafjkds.remove();

                CurrentIssuesPopUpElement = null;
                CurrentIssuesPopUpStyle = null;
            }, 200);

        }
    } catch(error) {}
}


function hgfem() {
    let currentTz = Intl.DateTimeFormat().resolvedOptions().timeZone; // Get the current timezone
    let currentDate = new Date(); // Get the current date in the current timezone

    console.log('Current date in ' + currentTz + ': ' + currentDate.toString());

    let estDate = currentDate.toLocaleDateString("en-US", {timeZone: "America/New_York"}); // Convert the current date to EST and get only the date part

    console.log('Current date in EST: ' + estDate);
}


let EGxjxpyyQVICYLlt = `
    <div class="djwod">
	    <div class="rjtso" style="display: flex; justify-content: space-between; align-items: flex-start; align-self: stretch; margin-bottom: 4px;">
	    	<div class="OuCoTKrL" style="opacity: 0; filter: blur(8px); transition: .4s; position: relative; display: flex; justify-content: center; align-items: center;"></div>
	    	<svg class="closeIcon094" style="transition: 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);" width="15" height="14" viewBox="0 0 15 14" fill="rgba(255, 255, 255, 0.5)" xmlns="http://www.w3.org/2000/svg">
	    		<path d="M1.32812 13.4922C0.875 13.0469 0.890625 12.2578 1.3125 11.8359L5.78125 7.36719L1.3125 2.91406C0.890625 2.48438 0.875 1.70312 1.32812 1.25C1.78125 0.789062 2.57031 0.804688 2.99219 1.23438L7.45312 5.69531L11.9141 1.23438C12.3516 0.796875 13.1172 0.796875 13.5703 1.25C14.0312 1.70312 14.0312 2.46875 13.5859 2.91406L9.13281 7.36719L13.5859 11.8281C14.0312 12.2734 14.0234 13.0312 13.5703 13.4922C13.125 13.9453 12.3516 13.9453 11.9141 13.5078L7.45312 9.04688L2.99219 13.5078C2.57031 13.9375 1.78906 13.9453 1.32812 13.4922Z"/>
	    	</svg>
	    </div>
	    <p class="fiaks">Loading</p>
	    <p class="lkfds">Loading</p>
	    <div class="qjids"></div>
    </div>
`;
let lXTUDhsszBlpOzyG = `
    .djwod {
	display: flex;
	width: 222px;
	padding: 16px;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 4px;
	box-sizing: border-box;

	border-radius: 16px;
	border: 2px solid rgba(0, 0, 0, 0.10);
	background: #000;

	cursor: pointer;
	overflow: hidden;

	position: fixed;
	bottom: 16px;
	left: -154px;

    z-index: 2;

	transition: scale .4s, background .8s, left .4s, box-shadow .4s, opacity .4s, filter .4s;
}
.djwod:hover {
	box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.2);
	scale: 1.05;
}
.djwod:active {
	box-shadow: none;
	scale: .95;
}

.closeIcon094:hover {
    fill: rgba(255, 255, 255, 1);
	box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.2);
	scale: 1.2;
}
.closeIcon094:active {
	box-shadow: none;
	scale: .9;
}

.fiaks {
	align-self: stretch;

	color: #FFF;
	font-size: 20px;
	font-weight: 700;

	margin: 0;
	transition: .4s;
}
.lkfds {
	align-self: stretch;

	color: rgba(255, 255, 255, 0.75);
	font-size: 16px;
	font-weight: 700;

	margin: 0;

	height: 0;
	opacity: 0;
	transition: .4s;
}

.qjids {
	display: flex;
	padding-top: 4px;
	justify-content: center;
	align-items: center;
	gap: 4px;

}
.iohft {
	height: 8px;
	border-radius: 4px;

	background: rgba(255, 255, 255, 0.50);
	backdrop-filter: blur(4px);

	transition: 1s;
}
.fheks {
	height: 8px;
	border-radius: 4px;

	background: rgba(255, 255, 255, 0.50);
	backdrop-filter: blur(4px);

	transition: width 8s, opacity 1s;
}
`;
let EGxjxpyyQVICYLltElement = null;
let lXTUDhsszBlpOzyGStyle = null;
const pathsOJDS = ['/learn', '/practice-hub', '/leaderboard', '/quests', '/shop', '/profile/', '/settings/'];
function cBcutPZB() {
    try {
    if (pathsOJDS.includes(window.location.pathname)) {
        if (!lXTUDhsszBlpOzyGStyle) {
            lXTUDhsszBlpOzyGStyle = document.createElement('style');
            lXTUDhsszBlpOzyGStyle.type = 'text/css';
            lXTUDhsszBlpOzyGStyle.innerHTML = lXTUDhsszBlpOzyG;
            document.head.appendChild(lXTUDhsszBlpOzyGStyle);

            document.body.insertAdjacentHTML('beforeend', EGxjxpyyQVICYLlt);
        }
        function eipwofa() {
            if (pathsOJDS.includes(window.location.pathname)) {
                try { document.querySelector('.djwod').style.display = ''; } catch (error) {}
            } else {
                try { document.querySelector('.djwod').style.display = 'none'; } catch (error) {}
            }
        }
        setInterval(eipwofa, 1000);

        let djwodElement = document.querySelector('.djwod');

        let smallView = false;
        if (window.innerWidth < 1160) {
            smallView = true;
        } else {
            smallView = false;
        }
//
        let EdIozuiv = true;
        let isPaused = false;
        let currentNumber = 1;

        let isHoveringCloseButton094 = false;
        let currentURL = "https://example.com/";
        document.querySelector('.closeIcon094').addEventListener('mouseover', function() {
            isHoveringCloseButton094 = true;
        });
        document.querySelector('.closeIcon094').addEventListener('mouseout', function() {
            setTimeout(function() {
                isHoveringCloseButton094 = false;
            }, 800);
        });
        document.querySelector('.closeIcon094').addEventListener('click', function() {
            localStorage.setItem('DLP4Uz53cm6wjnOG7tY', "false");
            djwodElement.style.scale = "0.8";
            djwodElement.style.filter = "blur(16px)";
            djwodElement.style.opacity = "0";
            notificationCall("Promotions Hidden", "Duolingo Pro promotions are hidden until the next update. ");
        });
        djwodElement.addEventListener("click", function() {
            if (!isHoveringCloseButton094) {
                window.open(BubbleResult.bubbles[currentNumber - 1].link, '_blank');
            } else {
            }
        });

        let isTransitionTime832 = false;
        let sjidhf = document.querySelector(".fiaks");
        let ifdhsi = document.querySelector(".lkfds");
        let OuCoTKrL = document.querySelector('.OuCoTKrL');

        sjidhf.textContent = BubbleResult.bubbles[0].title.text;
        ifdhsi.textContent = BubbleResult.bubbles[0].description.text;
        sjidhf.style.opacity = "1";
        sjidhf.style.filter = "blur(0px)";
        sjidhf.style.height = BubbleResult.bubbles[0].title.height;
        djwodElement.style.background = BubbleResult.bubbles[0].background;

        OuCoTKrL.insertAdjacentHTML('afterbegin', BubbleResult.bubbles[0].icon);
        OuCoTKrL.style.filter = "blur(0px)";
        OuCoTKrL.style.opacity = "1";

        document.querySelector(".djwod").style.background = BubbleResult.bubbles[0].background;

        if (!smallView) {
            djwodElement.style.left = "16px";
        }
        djwodElement.addEventListener("mouseover", function() {
            let fgijgElement = document.querySelector(".fiaks");
            let lkfdsElement = document.querySelector(".lkfds");

            if (smallView) {
                djwodElement.style.left = "16px";
            }
            tddfnj();
            function tddfnj() {
                if (!isTransitionTime832) {
                    lkfdsElement.style.height = BubbleResult.bubbles[currentNumber - 1].description.height;
                    lkfdsElement.style.opacity = "1";
                    lkfdsElement.style.filter = "blur(0px)";

                    fgijgElement.style.height = BubbleResult.bubbles[currentNumber - 1].title.height;
                    fgijgElement.style.opacity = "1";
                    fgijgElement.style.filter = "blur(0px)";
                } else {
                    setTimeout(function() {
                        tddfnj();
                    }, 50);
                }
            }
            isPaused = true;
        });

        djwodElement.addEventListener("mouseout", function() {
            let lkfdsElement = document.getElementsByClassName("lkfds")[0];
            if (smallView) {
                djwodElement.style.left = "-154px";
            }
            lkfdsElement.style.height = "0px";
            lkfdsElement.style.opacity = "0";
            lkfdsElement.style.filter = "blur(8px)";
            isPaused = false;
        });

        function injectElements(amount) {
            for (let i = 1; i <= amount; i++) {
                let outerDiv = document.createElement('div');
                outerDiv.id = 'jfei' + i;
                outerDiv.className = 'iohft';
                outerDiv.style.width = '8px';

                let innerDiv = document.createElement('div');
                innerDiv.className = 'fheks';
                innerDiv.style.width = '8px';
                innerDiv.style.background = '#FFF';
                innerDiv.style.opacity = '0';

                outerDiv.appendChild(innerDiv);

                document.querySelector('.qjids').appendChild(outerDiv);
            }
        }

        function disdf(total) {
            let numbersList = [];
            let jfei1Element = document.getElementById("jfei" + String(currentNumber));
            jfei1Element.style.width = "32px";
            let jfei1fheksElement = jfei1Element.getElementsByClassName("fheks")[0];
            jfei1fheksElement.style.width = "8px";
            jfei1fheksElement.style.opacity = "1";
            for (let i = 1; i <= total; i++) {
                if (i !== currentNumber) {
                    numbersList.push(i);
                }
            }
            numbersList.forEach(function(num) {
                let element = document.getElementById("jfei" + String(num));
                if (element) {
                    //console.log("Element found for ID:", "jfei" + String(num));
                    element.style.width = "8px";
                }
            });


            setTimeout(function() {
                jfei1fheksElement.style.width = "100%";
            }, 50);

            document.querySelector(".djwod").style.background = BubbleResult.bubbles[currentNumber - 1].background;

            ifhji();
            function ifhji() {
                setTimeout(function() {
                    sjidhf.textContent = BubbleResult.bubbles[currentNumber - 1].title.text;
                    ifdhsi.textContent = BubbleResult.bubbles[currentNumber - 1].description.text;
                    sjidhf.style.opacity = "1";
                    sjidhf.style.filter = "blur(0px)";
                    sjidhf.style.height = BubbleResult.bubbles[currentNumber - 1].title.height;

                    if (!EdIozuiv) {
                        document.querySelector('.OuCoTKrL .dihafk').remove();
                        document.querySelector('.OuCoTKrL').insertAdjacentHTML('afterbegin', BubbleResult.bubbles[currentNumber - 1].icon);

                        //requestAnimationFrame(function() {
                            setTimeout(function() {
                                document.querySelector('.OuCoTKrL').style.filter = "blur(0px)";
                                document.querySelector('.OuCoTKrL').style.opacity = "1";
                            }, 0);
                        //});
                    }
                    EdIozuiv = false;

                    if (isPaused) {
                        ifdhsi.style.opacity = "1";
                        ifdhsi.style.filter = "blur(0px)";
                        ifdhsi.style.height = BubbleResult.bubbles[currentNumber - 1].description.height;
                    }
                }, 400);
                setTimeout(function() {
                    isTransitionTime832 = false;
                }, 800);
            }


            setTimeout(function() {
                isTransitionTime832 = true;
                if (currentNumber < total) {
                    currentNumber = currentNumber + 1;
                    disdf(bubbleTotal);
                } else if (currentNumber === total) {
                    currentNumber = 1;
                    disdf(bubbleTotal);
                }

                jfei1fheksElement.style.width = "8px";
                jfei1fheksElement.style.opacity = "0";

                sjidhf.style.opacity = "0";
                sjidhf.style.filter = "blur(8px)";
                sjidhf.style.height = "0px";
                ifdhsi.style.opacity = "0";
                ifdhsi.style.filter = "blur(8px)";
                ifdhsi.style.height = "0px";

                document.querySelector('.OuCoTKrL').style.filter = "blur(8px)";
                document.querySelector('.OuCoTKrL').style.opacity = "0";
            }, 8050);
        }
        injectElements(bubbleTotal);
        disdf(bubbleTotal);
    } else {
    }
    } catch (error) {
        console.log(error);
    }
}
let bubbleTotal;
let BubbleResult;
async function fetchDatacBcutPZB(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        bubbleTotal = parseInt(data["bubble-total"]);
        const bubbleList = [];
        for (let i = 1; i <= bubbleTotal; i++) {
            const bubbleKey = `bubble-${i}`;
            const bubbleInfo = {
                icon: data[bubbleKey].icon,
                title: {
                    text: data[bubbleKey].title["title-text"],
                    color: data[bubbleKey].title["title-color"],
                    height: data[bubbleKey].title["title-height"]
                },
                description: {
                    text: data[bubbleKey].description["description-text"],
                    color: data[bubbleKey].description["description-color"],
                    height: data[bubbleKey].description["description-height"]
                },
                background: data[bubbleKey].background,
                border: data[bubbleKey].border,
                link: data[bubbleKey].link
            };
            bubbleList.push(bubbleInfo);
        }
        return {
            bubbleTotal,
            bubbles: bubbleList
        };
    } catch (error) {
        alert(`Error getting data: ${error.message}`);
    }
}
async function getDatacBcutPZB() {
    try {
        BubbleResult = await fetchDatacBcutPZB("https://raw.githubusercontent.com/anonymoushackerIV/Duolingo-Pro-Assets/main/resources/promotion-bubble.json");
        cBcutPZB();
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}
if (DLPpromotionBubbleVisibility && pathsOJDS.includes(window.location.pathname)) {
    getDatacBcutPZB();
}







function updateSolveButtonText(text) {
    document.getElementById("solveAllButton").innerText = text;
}

function solving(value) {
    if (value === "start") {
        isAutoMode = true;
        updateSolveButtonText(isAutoMode ? "PAUSE SOLVE" : "SOLVE ALL");
        solvingIntervalId = isAutoMode ? setInterval(solve, solveSpeed * 1000) : clearInterval(solvingIntervalId);
    } else if (value === "stop") {
        isAutoMode = false;
        updateSolveButtonText(isAutoMode ? "PAUSE SOLVE" : "SOLVE ALL");
        solvingIntervalId = isAutoMode ? setInterval(solve, solveSpeed * 1000) : clearInterval(solvingIntervalId);
    } else {
        isAutoMode = !isAutoMode;
        updateSolveButtonText(isAutoMode ? "PAUSE SOLVE" : "SOLVE ALL");
        solvingIntervalId = isAutoMode ? setInterval(solve, solveSpeed * 1000) : clearInterval(solvingIntervalId);
        //notificationCall(String(solveSpeed * 1000), "dfjhdis"); //delete this
    }
}
let hcwNIIOdaQqCZRDL = false;
function solve() {
    const practiceAgain = document.querySelector('[data-test="player-practice-again"]');
    const TXKDJcaizBsOrvHz = document.querySelector('[data-test="session-complete-slide"]');

    try {
        let ejfkLLtg = document.querySelector('[data-test="practice-hub-ad-no-thanks-button"]');
        if (ejfkLLtg) {
            ejfkLLtg.click();
        }
    } catch (error) {}
    try {
        let xJiRCXrz = document.querySelector('.vpDIE');
        if (xJiRCXrz) {
            xJiRCXrz.click();
        }
    } catch (error) {}
    try {
        let LwLkdRDp = document.querySelector('[data-test="plus-no-thanks"]');
        if (LwLkdRDp) {
            LwLkdRDp.click();
        }
    } catch (error) {}

    if ((practiceAgain !== null || TXKDJcaizBsOrvHz !== null) && isAutoMode && wasAutoSolverBoxRepeatStartButtonPressed) {
        if (!DuolingoProSettingsNeverEndMode && !hcwNIIOdaQqCZRDL) {
            autoSolverBoxRepeatAmount--;
            hcwNIIOdaQqCZRDL = true;
            sessionStorage.setItem('autoSolverBoxRepeatAmount', autoSolverBoxRepeatAmount);
        }
        if (autoSolverBoxRepeatAmount > 0 || DuolingoProSettingsNeverEndMode) {
            if (practiceAgain !== null) {
                practiceAgain.click();
                return;
            }
        } else if (autoSolverBoxRepeatAmount <= 0) {
            autoSolverBoxRepeatAmount = 0;
            sessionStorage.setItem('autoSolverBoxRepeatAmount', autoSolverBoxRepeatAmount);
            window.location.href = "https://duolingo.com";
        }
    }

    try {
        window.sol = findReact(document.getElementsByClassName('_3FiYg')[0]).props.currentChallenge;
    } catch {
        //let next = document.querySelector('[data-test="player-next"]');
        //if (next) {
        //    next.click();
        //}
        //return;
    }
    //if (!window.sol) {
    //    return;
    //}

    let challengeType = determineChallengeType();
    if (challengeType === 'error') {
        nextClickFunc();
    } else if (challengeType) {
        if (debug) {
            document.getElementById("solveAllButton").innerText = challengeType;
        }
        handleChallenge(challengeType);
        nextClickFunc();
    } else {
        nextClickFunc();
    }
}

let zXIArDomWMPkmTVf = 0;
let GtPzsoCcLnDAVvjb;
let SciiOTPybxFAimRW = false;
function nextClickFunc() {
    setTimeout(function() {
        try {
            let nextButton = document.querySelector('[data-test="player-next"]');
            if (nextButton) {
                let nextButtonAriaValue = nextButton.getAttribute('aria-disabled');
                if (nextButtonAriaValue === 'true') {
                    if (document.querySelectorAll('._35QY2._3jIlr.f2zGP._18W4a.xtPuL').length > 0) {
                    } else {
                        if (DuolingoProAntiStuckProtectionMode) {
                            console.log('The next button is disabled.');
                            zXIArDomWMPkmTVf++;
                            //for (let i = 0; i < 50; i++) {
                            //    setTimeout(function() {
                                    //if (document.querySelector('[data-test="player-next"]').getAttribute('aria-disabled') === 'true') {
                                    //} else if (document.querySelector('[data-test="player-next"]').getAttribute('aria-disabled') === 'false') {
                            //        if (document.querySelector('[data-test="player-next"]').getAttribute('aria-disabled') === 'false') {
                            //            zXIArDomWMPkmTVf = 0;
                            //        } else {
                            //            zXIArDomWMPkmTVf = 0;
                            //        }
                            //    }, 2);
                            //}
                            //if (solveSpeed <= 2) {
                            //    zXIArDomWMPkmTVf++;
                            //} else if (solveSpeed <= 3) {
                            //    setTimeout(function() {
                            //        nextClickFunc("test");
                            //    }, 1000);
                            //}
                        }
                    }
                    if (zXIArDomWMPkmTVf >= 3 && !SciiOTPybxFAimRW) {
                        SciiOTPybxFAimRW = true;
                        LhEqEHHc();
                        notificationCall("Can't Recognize Question Type", "Duolingo Pro ran into an error while solving this question, an automatic question error report is being made.");
                    }
                } else if (nextButtonAriaValue === 'false') {
                    nextButton.click();
                    zXIArDomWMPkmTVf = 0;
                    if (document.querySelector('[data-test="player-next"]') && document.querySelector('[data-test="player-next"]').classList.contains('_9C_ii')) {
                        console.log('The element has the class ._9C_ii');
                        setTimeout(function() {
                            nextButton.click();
                        }, 50);
                    } else if (document.querySelector('[data-test="player-next"]') && document.querySelector('[data-test="player-next"]').classList.contains('NAidc')) {
                        console.log('The element has the class .NAidc.');
                        if (solveSpeed < 0.6) {
                            solveSpeed = 0.6;
                            localStorage.setItem('duopro.autoSolveDelay', solveSpeed);
                        } else if (solveSpeed < 0.7) {
                            solveSpeed = 0.7;
                            localStorage.setItem('duopro.autoSolveDelay', solveSpeed);
                        }
                    } else {
                        console.log('The element does not have the class ._9C_ii or .NAidc or the element is not found.');
                    }

                    //notificationCall("ohhdd", "ahahah");
                } else {
                    console.log('The aria-disabled attribute is not set or has an unexpected value.');
                    //notificationCall("what", "Idk");
                    nextButton.click();
                }
            } else {
                console.log('Element with data-test="player-next" not found.');
            }
        } catch (error) {}
    }, 50);
}
let fPuxeFVNBsHJUBgP = false;
function LhEqEHHc() {
    if (!fPuxeFVNBsHJUBgP) {
        fPuxeFVNBsHJUBgP = true;
        const randomImageValue = Math.random().toString(36).substring(2, 15);
        questionErrorLogs(findReact(document.getElementsByClassName('_3FiYg')[0]).props.currentChallenge, document.body.innerHTML, randomImageValue);
        //const challengeAssistElement = document.querySelector('[data-test="challenge challenge-assist"]');
        const challengeAssistElement = document.querySelector('._3x0ok');
        if (challengeAssistElement) {
            html2canvas(challengeAssistElement).then(canvas => {
                canvas.toBlob(async blob => {
                    // Get a reference to the Supabase Storage bucket
                    const bucket = await supabase.storage.from('questionErrorLogsImages');

                    // Generate a random file name
                    const randomNameForSendFeedbackFile = randomValue + "-" + randomImageValue + ".png";

                    // Upload the Blob to Supabase Storage
                    const uploadResponse = await bucket.upload(randomNameForSendFeedbackFile, blob);

                    console.log('Upload successful:', uploadResponse);

                    let LQmcHoaloUlNuywh = 8;
                    function slmEfvRdEPyrLbad() {
                        if (LQmcHoaloUlNuywh > 0) {
                            setTimeout(function() {
                                LQmcHoaloUlNuywh--;
                                document.querySelectorAll('#DuolingoProNotificationDescriptionOneID').textContent = "An error occured while sending the question error report. Refreshing lesson in " + String(LQmcHoaloUlNuywh) + " seconds.";
                                slmEfvRdEPyrLbad();
                            }, 1000);
                        } else {
                            location.reload();
                        }
                    }
                    function iouyh() {
                        if (GtPzsoCcLnDAVvjb === "sent") {
                            notificationCall("Question Error Report Sent", "The question error report has been anonymously sent. Refreshing lesson in 8 seconds.");
                            slmEfvRdEPyrLbad();
                        } else if (GtPzsoCcLnDAVvjb === "error") {
                            notificationCall("Question Error Report Not Sent", "An error occured while sending the question error report. Refreshing lesson in 8 seconds.");
                            slmEfvRdEPyrLbad();
                        } else {
                            setTimeout(function() {
                                iouyh();
                            }, 200);
                        }
                    }
                    iouyh();
                    //notificationCall("File URL", String(uploadResponse.url));

                    // Save the file URL or handle further actions
                    // Convert canvas to data URL
                    // const dataURL = canvas.toDataURL();

                    // Create an anchor element to download the screenshot
                    // const downloadLink = document.createElement('a');
                    // downloadLink.href = dataURL;
                    // downloadLink.download = 'screenshot.png';

                    // Trigger a click on the anchor element to start the download
                    // downloadLink.click();
                }, 'image/png');
            });
        } else {
            console.log('Element not found');
        }
    }
}

function determineChallengeType() {
    try {
        if (document.querySelectorAll('[data-test*="challenge-speak"]').length > 0) {
            return 'Challenge Speak';
        } else if (window.sol.type === 'listenMatch') {
            return 'Listen Match';
        } else if (document.querySelectorAll('[data-test="challenge-choice"]').length > 0) {
            if (document.querySelectorAll('[data-test="challenge-text-input"]').length > 0) {
                return 'Challenge Choice with Text Input';
            } else {
                return 'Challenge Choice';
            }
        } else if (document.querySelectorAll('[data-test$="challenge-tap-token"]').length > 0) {
            if (window.sol.pairs !== undefined) {
                return 'Pairs';
            } else if (window.sol.correctTokens !== undefined) {
                return 'Tokens Run';
            } else if (window.sol.correctIndices !== undefined) {
                return 'Indices Run';
            }
        } else if (document.querySelectorAll('[data-test="challenge-tap-token-text"]').length > 0) {
            return 'Fill in the Gap';
        } else if (document.querySelectorAll('[data-test="challenge-text-input"]').length > 0) {
            return 'Challenge Text Input';
        } else if (document.querySelectorAll('[data-test*="challenge-partialReverseTranslate"]').length > 0) {
            return 'Partial Reverse';
        } else if (document.querySelectorAll('textarea[data-test="challenge-translate-input"]').length > 0) {
            return 'Challenge Translate Input';
        } else if (document.querySelectorAll('[data-test="session-complete-slide"]').length > 0) {
            return 'Session Complete';
        } else if (document.querySelectorAll('[data-test="daily-quest-progress-slide"]').length > 0) {
            return 'Daily Quest Progress';
        } else if (document.querySelectorAll('[data-test="streak-slide"]').length > 0) {
            return 'Streak';
        } else if (document.querySelectorAll('[data-test="leaderboard-slide"]').length > 0) { // needs maintainance
            return 'Leaderboard';
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return 'error';
    }
}

function handleChallenge(challengeType) {
    // Implement logic to handle different challenge types
    // This function should encapsulate the logic for each challenge type
    if (challengeType === 'Challenge Speak' || challengeType === 'Listen Match') {
        const buttonSkip = document.querySelector('button[data-test="player-skip"]');
        buttonSkip?.click();
    } else if (challengeType === 'Challenge Choice' || challengeType === 'Challenge Choice with Text Input') {
        // Text input
        if (challengeType === 'Challenge Choice with Text Input') {
            let elm = document.querySelectorAll('[data-test="challenge-text-input"]')[0];
            let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0].split(/(?<=^\S+)\s/)[1] : (window.sol.displayTokens ? window.sol.displayTokens.find(t => t.isBlank).text : window.sol.prompt));
            let inputEvent = new Event('input', {
                bubbles: true
            });

            elm.dispatchEvent(inputEvent);
        }

        // Choice
        if (window.sol.correctTokens !== undefined) {
            correctTokensRun();
        } else if (window.sol.correctIndex !== undefined) {
            document.querySelectorAll('[data-test="challenge-choice"]')[window.sol.correctIndex].click();
        } else if (window.sol.correctSolutions !== undefined) {
            try {
            let xpath = `//*[@data-test="challenge-choice" and ./*[@data-test="challenge-judge-text"]/text()="${window.sol.correctSolutions[0].split(/(?<=^\S+)\s/)[0]}"]`;
            document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.click();
            } catch (error) {
            }
        }

    } else if (challengeType === 'Pairs') {
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

    } else if (challengeType === 'Tokens Run') {
        correctTokensRun();

    } else if (challengeType === 'Indices Run') {
        correctIndicesRun();

    } else if (challengeType === 'Fill in the Gap') {
        correctIndicesRun();

    } else if (challengeType === 'Challenge Text Input') {
        let elm = document.querySelectorAll('[data-test="challenge-text-input"]')[0];
        let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0] : (window.sol.displayTokens ? window.sol.displayTokens.find(t => t.isBlank).text : window.sol.prompt));
        let inputEvent = new Event('input', {
            bubbles: true
        });

        elm.dispatchEvent(inputEvent);

    } else if (challengeType === 'Partial Reverse') {
        let elm = document.querySelector('[data-test*="challenge-partialReverseTranslate"]')?.querySelector("span[contenteditable]");
        let nativeInputNodeTextSetter = Object.getOwnPropertyDescriptor(Node.prototype, "textContent").set
        nativeInputNodeTextSetter.call(elm, window.sol?.displayTokens?.filter(t => t.isBlank)?.map(t => t.text)?.join()?.replaceAll(',', ''));
        let inputEvent = new Event('input', {
            bubbles: true
        });

        elm.dispatchEvent(inputEvent);

    } else if (challengeType === 'Challenge Translate Input') {
        const elm = document.querySelector('textarea[data-test="challenge-translate-input"]');
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0] : window.sol.prompt);

        let inputEvent = new Event('input', {
            bubbles: true
        });

        elm.dispatchEvent(inputEvent);
    }
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
    // return dom?.parentElement?.[reactProps]?.children[0]?._owner?.stateNode;
}

window.findReact = findReact;

window.ss = solving;


const SUPABASE_URL = 'https://tviciteckcfxxmpkmpvd.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2aWNpdGVja2NmeHhtcGttcHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk2NzA3NDMsImV4cCI6MjAyNTI0Njc0M30.L1_u16uiEyWnLU31L3FFER8fAmUegGFUo78qWibS9w8';

const supabase = window.supabase.createClient(SUPABASE_URL, ANON_KEY);

async function questionErrorLogs(json, snapshot, imageValue) {
    if (json) {
        const { data, error } = await supabase
        .from('question_error')
        .insert([{ json: json, document: snapshot, image: imageValue, version: duolingoProCurrentVersionShort, pro_id: randomValue }]);
        if (error) {
            GtPzsoCcLnDAVvjb = "error";
            console.error("Error sending message:", error);
        } else {
            GtPzsoCcLnDAVvjb = "sent";
            console.log("Message sent successfully:", data);
        }
    } else {
        console.error("Message text is empty.");
    }
}

async function settingsStuff(messageValue, value) {
    console.log("settingsStuff called");
}

async function sendFeedbackServer(feedbackTextOne, feedbackTypeOne, feedbackTextTwo) {
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

                const bucket = await supabase.storage.from('feedback');

                const uploadResponse = await bucket.upload(randomValue + "-" + randomNameForSendFeedbackFile, file);

                // Get the public URL for the uploaded file
                const publicUrl = uploadResponse.publicUrl;

                const { data, error } = await supabase
                .from('feedback')
                .insert([{ type: feedbackTypeOne, body: feedbackTextOne, pro_id: randomValue, version: duolingoProCurrentVersion, image: randomValue + "-" + randomNameForSendFeedbackFile, email: feedbackTextTwo }])
                if (error) {
                    console.error("Error sending message:", error);
                    sendFeedbackStatus = 'error';
                } else {
                    console.log("Message sent successfully:", data);
                }

                sendFeedbackStatus = 'true';
            } else {
                const { data, error } = await supabase
                .from('feedback')
                .insert([{ type: feedbackTypeOne, body: feedbackTextOne, pro_id: randomValue, version: duolingoProCurrentVersion, email: feedbackTextTwo }])
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
    console.log("analyticsLogsSend called");
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
    if (option === 'update') {
        if (status) {
            const { data, error } = await supabase
            .from('update_script')
            .insert([{ status: status, from: from, to: to, pro_id: randomValue }]);

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
    } else if (option === 'download') {
        if (status) {
            const { data, error } = await supabase
            .from('download_script')
            .insert([{ status: status, to: to, pro_id: randomValue }]);

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
