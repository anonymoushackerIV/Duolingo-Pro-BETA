// ==UserScript==
// @name        Duolingo Pro BETA
// @namespace   Violentmonkey Scripts
// @match       https://*.duolingo.com/*
// @grant       GM_log
// @version     2.0
// @author      anonymoushackerIV
// @description Duolingo Auto-Solver Tool - WORKING AUGUST 2023
// ==/UserScript==

//localStorage.getItem("someVarKey");

let solvingIntervalId;
let isAutoMode = false;
isAutoMode = Boolean(sessionStorage.getItem('isAutoMode'));

const debug = false;

let numberOfTimes = 0;
numberOfTimes = Number(sessionStorage.getItem('numberOfTimes'));

let isStartButtonPressed = false;
isStartButtonPressed = Boolean(sessionStorage.getItem('isStartButtonPressed'));

let onboardingDone;

if (Boolean(localStorage.getItem("onboardingDone")) === false) {
    console.log('onboardingDone False');
} else if (Boolean(localStorage.getItem("onboardingDone")) === true) {
    console.log('onboardingDone True');
} else {
    console.log('onboardingDone Set to false');

    onboardingDone = false;
    Boolean(localStorage.setItem("onboardingDone", onboardingDone));
}
//...all your existing code

let lastVersionOnline;


const onBoardingHTML = `
<html>
    <head>
        <style>
            .BoxOneTwoButtonOne {
                display: flex;
                height: 50px;
                justify-content: center;
                align-items: center;
                align-self: stretch;
                border-radius: 12.5px;
                border-bottom: 4px solid #168DC5;
                background: #1CB0F6;
                cursor: pointer;
            }

            .BoxOneTwoButtonOne:hover {
                opacity: 0.8;
            }

            .BoxOneTwoButtonOne:active {
                opacity: 0.8;
                border-bottom: 0px solid #168DC5;
                margin-top: 4px;
                height: 46px;
            }

            .BoxOneTwoButtonOneTextOne {
                display: flex;
                width: 640px;
                flex-direction: column;
                justify-content: center;
                align-self: stretch;
                color: #FFF;
                text-align: center;
                font-size: 20px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
                height: 46px;
            }
        </style>
    </head>
    <body>
        <div class="screen" style="display: inline-flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0px;
        bottom: 0px;
        right: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        padding-top: 100px;
        padding-bottom: 100px;
        z-index: 2147483647;
        background-color: white;">
        <div class="BoxOne" style="display: flex;
max-width: 640px;
flex-direction: column;
align-items: center;
gap: 25px;
flex-shrink: 0;">
<div class="BoxOneOne" style="display: flex;
flex-direction: column;
align-items: center;
align-self: stretch;">
<div class="BoxOneOneOne" style="display: flex;
justify-content: space-between;
align-items: center;
align-self: stretch;">
<p class="BoxOneOneOneTextOne" style="color: #000;
font-size: 50px;
font-style: normal;
font-weight: 700;
line-height: 100%; /* 50px */
margin-top: 0px;
margin-bottom: 0px;">Welcome to</p>
<div class="BoxOneOneOneOne" style="display: flex;
padding: 12.5px;
flex-direction: column;
justify-content: center;
align-items: center;
border-radius: 12.5px;
background: #FF4B4B;">
<p class="BoxOneOneOneOneTextOne" style="color: #FFF;
font-size: 22.5px;
font-style: normal;
font-weight: 700;
line-height: normal;
margin-top: 0px;
margin-bottom: 0px;">v2.0 BETA 1</p>
</div>
</div>
<div class="BoxOneOneTwo" style="display: flex;
align-items: center;
align-self: stretch;">
<p class="BoxOneOneTwoTextOne" style="color: #000;
font-size: 100px;
font-style: normal;
font-weight: 700;
line-height: 100%; /* 100px */
margin-top: 0px;
margin-bottom: 0px;">Duolingo</p>
<p class="BoxOneOneTwoTextTwo" style="color: rgba(0, 0, 0, 0.00);
font-size: 50px;
font-style: normal;
font-weight: 700;
line-height: 100%; /* 50px */
margin-top: 0px;
margin-bottom: 0px;">I</p>
<p class="BoxOneOneTwoTextThree" style="color: #1CB0F6;
font-size: 100px;
font-style: normal;
font-weight: 700;
line-height: 100%; /* 100px */
margin-top: 0px;
margin-bottom: 0px;">Pro</p>
</div>
</div>
        <div class="BoxOneTwo" style="display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12.5px;
        align-self: stretch;">
            <div class="BoxOneTwoOne" style="display: flex;
            padding: 12.5px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            align-self: stretch;
            border-radius: 12.5px;
background: rgba(0, 0, 0, 0.05);">
<div class="BoxOneTwoOneOne" style="display: flex;
align-items: center;
gap: 6.25px;
align-self: stretch;">
<svg xmlns="http://www.w3.org/2000/svg" width="75" height="30" viewBox="0 0 75 30" fill="none">
    <path d="M45.3252 15.6865C45.3252 16.2847 45.1177 16.7852 44.605 17.2734L35.3765 26.3188C35.0103 26.6851 34.5586 26.8682 34.0215 26.8682C32.9473 26.8682 32.0684 26.0015 32.0684 24.9272C32.0684 24.3779 32.2881 23.8896 32.6909 23.4868L40.7353 15.6743L32.6909 7.87402C32.2881 7.4834 32.0684 6.98291 32.0684 6.4458C32.0684 5.38379 32.9473 4.50488 34.0215 4.50488C34.5586 4.50488 35.0103 4.68799 35.3765 5.0542L44.605 14.0996C45.1055 14.5757 45.3252 15.0762 45.3252 15.6865Z" fill="#1CB0F6"/>
</svg>
<div class="BoxOneTwoOneOneOne" style="display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
flex: 1 0 0;">
<p class="BoxOneTwoOneOneOneTextOne" style="align-self: stretch;
color: #000;
font-size: 22.5px;
font-style: normal;
font-weight: 700;
line-height: normal;
margin-top: 0px;
margin-bottom: 0px;">Solve, a better Skip button</p>
<p class="BoxOneTwoOneOneOneTextTwo" style="align-self: stretch;
color: rgba(0, 0, 0, 0.50);
font-size: 17.5px;
font-style: normal;
font-weight: 700;
line-height: normal;
margin-top: 0px;
margin-bottom: 0px;">Stuck somewhere and want to see the answer? Press Solve to only solve that question.</p>
</div>
</div>
</div>
<div class="BoxOneTwoTwo" style="display: flex;
padding: 12.5px;
flex-direction: column;
justify-content: center;
align-items: center;
align-self: stretch;
border-radius: 12.5px;
background: rgba(0, 0, 0, 0.05);">
<div class="BoxOneTwoOneOne" style="display: flex;
align-items: center;
gap: 6.25px;
align-self: stretch;">
<svg xmlns="http://www.w3.org/2000/svg" width="75" height="30" viewBox="0 0 75 30" fill="none">
    <path d="M17.3682 26.6182C16.2817 26.6182 15.4028 25.7515 15.4028 24.6772C15.4028 24.1401 15.6348 23.6396 16.0254 23.2368L24.082 15.4243L16.0254 7.62402C15.6226 7.22119 15.4028 6.7207 15.4028 6.1958C15.4028 5.12158 16.2817 4.25488 17.3682 4.25488C17.9053 4.25488 18.3447 4.43799 18.7109 4.8042L27.9517 13.8374C28.4399 14.3135 28.6719 14.8262 28.6719 15.4365C28.6719 16.0347 28.4521 16.5352 27.9517 17.0356L18.7109 26.0688C18.3325 26.4351 17.8931 26.6182 17.3682 26.6182ZM28.269 26.6182C27.1826 26.6182 26.3037 25.7515 26.3037 24.6772C26.3037 24.1401 26.5356 23.6396 26.9385 23.2368L34.9829 15.4243L26.9385 7.62402C26.5234 7.22119 26.3037 6.7207 26.3037 6.1958C26.3037 5.12158 27.1826 4.25488 28.269 4.25488C28.8062 4.25488 29.2456 4.43799 29.624 4.8042L38.8525 13.8374C39.353 14.3135 39.5728 14.8262 39.585 15.4365C39.585 16.0347 39.353 16.5352 38.8647 17.0356L29.624 26.0688C29.2456 26.4351 28.8062 26.6182 28.269 26.6182Z" fill="#1CB0F6"/>
    <path d="M39.3682 26.6182C38.2817 26.6182 37.4028 25.7515 37.4028 24.6772C37.4028 24.1401 37.6348 23.6396 38.0254 23.2368L46.082 15.4243L38.0254 7.62402C37.6226 7.22119 37.4028 6.7207 37.4028 6.1958C37.4028 5.12158 38.2817 4.25488 39.3682 4.25488C39.9053 4.25488 40.3447 4.43799 40.7109 4.8042L49.9517 13.8374C50.4399 14.3135 50.6719 14.8262 50.6719 15.4365C50.6719 16.0347 50.4521 16.5352 49.9517 17.0356L40.7109 26.0688C40.3325 26.4351 39.8931 26.6182 39.3682 26.6182ZM50.269 26.6182C49.1826 26.6182 48.3037 25.7515 48.3037 24.6772C48.3037 24.1401 48.5356 23.6396 48.9385 23.2368L56.9829 15.4243L48.9385 7.62402C48.5234 7.22119 48.3037 6.7207 48.3037 6.1958C48.3037 5.12158 49.1826 4.25488 50.269 4.25488C50.8062 4.25488 51.2456 4.43799 51.624 4.8042L60.8525 13.8374C61.353 14.3135 61.5728 14.8262 61.585 15.4365C61.585 16.0347 61.353 16.5352 60.8647 17.0356L51.624 26.0688C51.2456 26.4351 50.8062 26.6182 50.269 26.6182Z" fill="#1CB0F6"/>
</svg>
<div class="BoxOneTwoOneOneOne" style="display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
flex: 1 0 0;">
<p class="BoxOneTwoOneOneOneTextOne" style="align-self: stretch;
color: #000;
font-size: 22.5px;
font-style: normal;
font-weight: 700;
line-height: normal;
margin-top: 0px;
margin-bottom: 0px;">Solve All, skip the whole hustle</p>
<p class="BoxOneTwoOneOneOneTextTwo" style="align-self: stretch;
color: rgba(0, 0, 0, 0.50);
font-size: 17.5px;
font-style: normal;
font-weight: 700;
line-height: normal;
margin-top: 0px;
margin-bottom: 0px;">A steak saver and a leaderboard champion. Solve All let’s you finish the whole lesson without the hard work.</p>
</div>
</div>
</div>
<div class="BoxOneTwoThree" style="display: flex;
padding: 12.5px;
flex-direction: column;
justify-content: center;
align-items: center;
align-self: stretch;
border-radius: 12.5px;
background: rgba(0, 0, 0, 0.05);">
<div class="BoxOneTwoOneOne" style="display: flex;
align-items: center;
gap: 6.25px;
align-self: stretch;">
<svg xmlns="http://www.w3.org/2000/svg" width="76" height="31" viewBox="0 0 76 31" fill="none">
    <path d="M38 27.5894C30.9321 27.5894 25.1094 21.7666 25.1094 14.6865C25.1094 7.61865 30.9199 1.7959 38 1.7959C45.0679 1.7959 50.8906 7.61865 50.8906 14.6865C50.8906 21.7666 45.0801 27.5894 38 27.5894ZM30.2485 9.16895C29.7969 9.7793 30.0044 10.4263 30.7002 10.4263H45.2632C45.9712 10.4263 46.1665 9.7793 45.7148 9.15674C43.9937 6.69092 41.1494 5.15283 37.9756 5.15283C34.8018 5.15283 31.9575 6.69092 30.2485 9.16895ZM37.9878 17.6162C39.3306 17.6162 40.417 16.5298 40.417 15.1748C40.417 13.8442 39.3306 12.7578 37.9878 12.7578C36.645 12.7578 35.5586 13.8442 35.5586 15.1748C35.5586 16.5298 36.645 17.6162 37.9878 17.6162ZM28.8935 17.3232C29.626 20.021 31.5181 22.2305 34.1182 23.4268C34.6431 23.6953 35.0337 23.3901 35.0337 22.853C35.0947 19.6426 32.7144 16.9082 29.5771 16.4932C29.0278 16.4077 28.7104 16.6885 28.8935 17.3232ZM47.082 17.3232C47.2651 16.6885 46.9478 16.4077 46.3984 16.4932C43.2612 16.9082 40.8809 19.6548 40.9419 22.853C40.9419 23.3901 41.3325 23.6953 41.8574 23.4268C44.4575 22.2305 46.3496 20.021 47.082 17.3232Z" fill="#1CB0F6"/>
</svg>
<div class="BoxOneTwoOneOneOne" style="display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
flex: 1 0 0;">
<p class="BoxOneTwoOneOneOneTextOne" style="align-self: stretch;
color: #000;
font-size: 22.5px;
font-style: normal;
font-weight: 700;
line-height: normal;
margin-top: 0px;
margin-bottom: 0px;">AutoSolver Box, full automation (BETA)</p>
<p class="BoxOneTwoOneOneOneTextTwo" style="align-self: stretch;
color: rgba(0, 0, 0, 0.50);
font-size: 17.5px;
font-style: normal;
font-weight: 700;
line-height: normal;
margin-top: 0px;
margin-bottom: 0px;">AutoSolver Box enables you to set a certain amount of lessons you want completed, then mutes your tab, both sounds and visuals until it’s done. </p>
</div>
</div>
</div>
<div class="BoxOneTwoFour" style="display: flex;
padding: 12.5px;
flex-direction: column;
justify-content: center;
align-items: center;
align-self: stretch;
border-radius: 12.5px;
background: rgba(0, 0, 0, 0.05);">
<div class="BoxOneTwoOneOne" style="display: flex;
align-items: center;
gap: 6.25px;
align-self: stretch;">
<svg xmlns="http://www.w3.org/2000/svg" width="76" height="31" viewBox="0 0 76 31" fill="none">
    <path d="M27.2417 25.3687C24.4585 25.3687 22.9326 23.855 22.9326 21.084V6.31348C22.9326 3.54248 24.4585 2.02881 27.2417 2.02881H44.2461C47.0415 2.02881 48.5552 3.54248 48.5552 6.31348V12.9541C48.0547 12.8442 47.5298 12.7832 46.9927 12.7832C46.4556 12.7832 45.9307 12.8442 45.4058 12.9541V9.96338C45.4058 8.99902 44.9175 8.55957 44.0142 8.55957H27.4736C26.5581 8.55957 26.082 8.99902 26.082 9.96338V20.8154C26.082 21.7798 26.5581 22.2192 27.4736 22.2192H38.875C38.9849 23.3545 39.3877 24.4409 39.9858 25.3687H27.2417ZM33.4429 12.5146C33.0034 12.5146 32.8447 12.3804 32.8447 11.9287V11.2085C32.8447 10.769 33.0034 10.6226 33.4429 10.6226H34.1631C34.6147 10.6226 34.7734 10.769 34.7734 11.2085V11.9287C34.7734 12.3804 34.6147 12.5146 34.1631 12.5146H33.4429ZM37.3247 12.5146C36.873 12.5146 36.7266 12.3804 36.7266 11.9287V11.2085C36.7266 10.769 36.873 10.6226 37.3247 10.6226H38.0449C38.4966 10.6226 38.6431 10.769 38.6431 11.2085V11.9287C38.6431 12.3804 38.4966 12.5146 38.0449 12.5146H37.3247ZM41.2065 12.5146C40.7549 12.5146 40.5962 12.3804 40.5962 11.9287V11.2085C40.5962 10.769 40.7549 10.6226 41.2065 10.6226H41.9268C42.3662 10.6226 42.5249 10.769 42.5249 11.2085V11.9287C42.5249 12.3804 42.3662 12.5146 41.9268 12.5146H41.2065ZM29.561 16.3354C29.1216 16.3354 28.9629 16.2012 28.9629 15.7495V15.0293C28.9629 14.5898 29.1216 14.4434 29.561 14.4434H30.2812C30.7329 14.4434 30.8916 14.5898 30.8916 15.0293V15.7495C30.8916 16.2012 30.7329 16.3354 30.2812 16.3354H29.561ZM33.4429 16.3354C33.0034 16.3354 32.8447 16.2012 32.8447 15.7495V15.0293C32.8447 14.5898 33.0034 14.4434 33.4429 14.4434H34.1631C34.6147 14.4434 34.7734 14.5898 34.7734 15.0293V15.7495C34.7734 16.2012 34.6147 16.3354 34.1631 16.3354H33.4429ZM37.3247 16.3354C36.873 16.3354 36.7266 16.2012 36.7266 15.7495V15.0293C36.7266 14.5898 36.873 14.4434 37.3247 14.4434H38.0449C38.4966 14.4434 38.6431 14.5898 38.6431 15.0293V15.7495C38.6431 16.2012 38.4966 16.3354 38.0449 16.3354H37.3247ZM47.0049 27.4683C43.4771 27.4683 40.5718 24.563 40.5718 21.0352C40.5718 17.5195 43.4771 14.6143 47.0049 14.6143C50.5205 14.6143 53.4258 17.5195 53.4258 21.0352C53.4258 24.5508 50.4961 27.4683 47.0049 27.4683ZM44.0752 22.2192H47.0903C47.6641 22.2192 48.1035 21.7798 48.1035 21.2061V17.6538C48.1035 17.0801 47.6641 16.6406 47.0903 16.6406C46.5166 16.6406 46.0771 17.0801 46.0771 17.6538V20.1929H44.0752C43.5137 20.1929 43.0498 20.6445 43.0498 21.2061C43.0498 21.7798 43.5015 22.2192 44.0752 22.2192ZM29.561 20.1562C29.1216 20.1562 28.9629 20.0098 28.9629 19.5703V18.8501C28.9629 18.3984 29.1216 18.2642 29.561 18.2642H30.2812C30.7329 18.2642 30.8916 18.3984 30.8916 18.8501V19.5703C30.8916 20.0098 30.7329 20.1562 30.2812 20.1562H29.561ZM33.4429 20.1562C33.0034 20.1562 32.8447 20.0098 32.8447 19.5703V18.8501C32.8447 18.3984 33.0034 18.2642 33.4429 18.2642H34.1631C34.6147 18.2642 34.7734 18.3984 34.7734 18.8501V19.5703C34.7734 20.0098 34.6147 20.1562 34.1631 20.1562H33.4429ZM37.3247 20.1562C36.873 20.1562 36.7266 20.0098 36.7266 19.5703V18.8501C36.7266 18.3984 36.873 18.2642 37.3247 18.2642H38.0449C38.4966 18.2642 38.6431 18.3984 38.6431 18.8501V19.5703C38.6431 20.0098 38.4966 20.1562 38.0449 20.1562H37.3247Z" fill="#1CB0F6"/>
</svg>
<div class="BoxOneTwoOneOneOne" style="display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
flex: 1 0 0;">
<p class="BoxOneTwoOneOneOneTextOne" style="align-self: stretch;
color: #000;
font-size: 22.5px;
font-style: normal;
font-weight: 700;
line-height: normal;
margin-top: 0px;
margin-bottom: 0px;">More coming soon</p>
<p class="BoxOneTwoOneOneOneTextTwo" style="align-self: stretch;
color: rgba(0, 0, 0, 0.50);
font-size: 17.5px;
font-style: normal;
font-weight: 700;
line-height: normal;
margin-top: 0px;
margin-bottom: 0px;">Many bug fixes, support for more languages and lessons are coming, as well as a dedicated app that will put your steak and leaderboard position at safe hold, without you needing to sign in everyday.</p>
</div>
</div>
</div>
<div class="BoxOneTwoButtonOne">
<p class="BoxOneTwoButtonOneTextOne">CONTINUE</p>
</div>

        </div>
        </div>
    </body>
</html>
`;

function injectOnBoardingHTML() {
  // Creating a container for the overlay
    if (Boolean(localStorage.getItem("onboardingDone")) === false) {
  const containerOnBoarding = document.createElement('div');
  containerOnBoarding.innerHTML = onBoardingHTML;
  document.body.appendChild(containerOnBoarding);
} else {
        console.log('idk check');
}
}

//setTimeout(injectOnBoardingHTML, 1000);
injectOnBoardingHTML();


function onBoardingButton() {
    if (Boolean(localStorage.getItem("onboardingDone")) === false) {
  const onBoardingContinueButton = document.querySelector('.BoxOneTwoButtonOne');
        console.log('continue pressed');


    onBoardingContinueButton.addEventListener('click', () => {
        console.log('continue registered');
        onboardingDone = true;
        localStorage.setItem("onboardingDone", onboardingDone);
        window.location.reload();
    });
    } else {
        console.log('idk check again');
    }
}
onBoardingButton();



if (window.location.href.includes('duolingo.com/learn')) {
// HTML content
const htmlContent = `
    <div class="boxFirst">
    <a href="mailto:murk.hornet.0k@icloud.com">
    <button class="ContactButton">SEND FEEDBACK</button>
    </a>
  <div class="boxOne">
      <div class="BoxInsideAlert">
        <svg class="AutoBoxAlertIcon" xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
<path id="Vector" d="M2.74565 18.5C2.18774 18.5 1.70193 18.3759 1.2882 18.1276C0.880737 17.8857 0.564169 17.5569 0.338504 17.1411C0.112839 16.7316 0 16.2786 0 15.7823C0 15.3045 0.125376 14.8485 0.376113 14.4142L7.64456 1.86814C7.90157 1.4152 8.24008 1.07394 8.66007 0.844363C9.0863 0.614788 9.53451 0.5 10.0047 0.5C10.4686 0.5 10.9105 0.614788 11.3305 0.844363C11.7505 1.07394 12.0921 1.4152 12.3554 1.86814L19.6238 14.4142C19.7493 14.6313 19.8432 14.8578 19.9059 15.0936C19.9686 15.3231 20 15.5527 20 15.7823C20 16.2786 19.8872 16.7316 19.6615 17.1411C19.4358 17.5569 19.1161 17.8857 18.7024 18.1276C18.2949 18.3759 17.8122 18.5 17.2543 18.5H2.74565ZM10.0141 11.9943C10.6159 11.9943 10.9293 11.6841 10.9543 11.0635L11.1048 6.66132C11.1174 6.35728 11.017 6.10599 10.8039 5.90743C10.597 5.70268 10.3307 5.60031 10.0047 5.60031C9.67249 5.60031 9.40289 5.69958 9.19607 5.89813C8.98915 6.09668 8.892 6.35108 8.90452 6.66132L9.04557 11.0635C9.0707 11.6841 9.39345 11.9943 10.0141 11.9943ZM10.0141 15.2704C10.3526 15.2704 10.6409 15.168 10.8791 14.9632C11.1174 14.7523 11.2365 14.4824 11.2365 14.1535C11.2365 13.8309 11.1174 13.5641 10.8791 13.3532C10.6409 13.1421 10.3526 13.0367 10.0141 13.0367C9.66931 13.0367 9.37786 13.1421 9.13964 13.3532C8.90143 13.5641 8.78233 13.8309 8.78233 14.1535C8.78233 14.4824 8.90143 14.7523 9.13964 14.9632C9.38411 15.168 9.67557 15.2704 10.0141 15.2704Z" fill="#FF4B4B"/>
</svg>
        <p class="AutoBoxAlertText">Stories are not supported yet</p>
      </div>
      <div class="AutoBoxAlertTwo">
        <svg class="AutoBoxAlertTwoIcon" xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
<path id="Vector" d="M9.99998 20.5C8.63214 20.5 7.34419 20.2378 6.13613 19.7134C4.92808 19.1953 3.86384 18.476 2.94343 17.5551C2.023 16.6342 1.30073 15.5727 0.776601 14.3705C0.258868 13.1619 0 11.8701 0 10.4952C0 9.12667 0.258868 7.84131 0.776601 6.63907C1.30073 5.43044 2.01981 4.3657 2.93384 3.44483C3.85426 2.52398 4.91849 1.80455 6.12655 1.28657C7.3346 0.762189 8.62255 0.5 9.99039 0.5C11.3582 0.5 12.6462 0.762189 13.8543 1.28657C15.0687 1.80455 16.1329 2.52398 17.0469 3.44483C17.9674 4.3657 18.6896 5.43044 19.2138 6.63907C19.7379 7.84131 20 9.12667 20 10.4952C20 11.8701 19.7379 13.1619 19.2138 14.3705C18.6896 15.5727 17.9674 16.6342 17.0469 17.5551C16.1329 18.476 15.0719 19.1953 13.8639 19.7134C12.6558 20.2378 11.3678 20.5 9.99998 20.5ZM9.99998 12.0588C10.6136 12.0588 10.9332 11.739 10.9588 11.0995L11.1121 6.56234C11.1249 6.24899 11.0227 5.99 10.8054 5.78535C10.5944 5.57433 10.3228 5.46881 9.99039 5.46881C9.65163 5.46881 9.37678 5.57113 9.16585 5.77576C8.95492 5.98039 8.85584 6.24259 8.86863 6.56234L9.01244 11.0995C9.03802 11.739 9.36719 12.0588 9.99998 12.0588ZM9.99998 15.4352C10.3451 15.4352 10.6392 15.3297 10.8821 15.1186C11.1249 14.9013 11.2464 14.623 11.2464 14.2841C11.2464 13.9516 11.1249 13.6766 10.8821 13.4592C10.6392 13.2417 10.3451 13.1331 9.99998 13.1331C9.64843 13.1331 9.35122 13.2417 9.10832 13.4592C8.86544 13.6766 8.74399 13.9516 8.74399 14.2841C8.74399 14.623 8.86544 14.9013 9.10832 15.1186C9.3576 15.3297 9.65483 15.4352 9.99998 15.4352Z" fill="#FFC800"/>
</svg>
        <p class="AutoBoxAlertTwoText">Chests can’t open automatically</p>
      </div>
      <div class="BetaTagAlert">
<p class="BETATagSpaceText">AutoSolver</p>
      <div class="BETATag">
<p class="BETATagText">v2.0 BETA 1</p>
      </div>
        </div>
    <div class="BoxOutside">
      <p class="AutoBoxExplanation">How many lessons would you like to AutoSolve?</p>
    <div class="BoxInside">
      <button class="button-down">-</button>
      <div class="ticker">
    <div class="number">0</div>
        </div>
      <button class="button-up">+</button>
    </div>
      <button class="StartToolWithValue">START</button>
    </div>
    </div>
    </div>
`;

// CSS content
const cssContent = `
.boxFirst {
  display: inline-flex;
flex-direction: column;
align-items: flex-end;
gap: 16px;
  position: fixed; /* Fix the position to the bottom-right corner */
  bottom: 24px;
  right: 24px;
  z-index:2;
}

.ContactButton {
  position: relative;
  min-width: 50px;
  width: height;
  font-size: 17px;
  border: none;
  border: 2px solid rgb(var(--color-swan));
  border-bottom: 4px solid rgb(var(--color-swan));
  border-radius: 16px;
  padding: 13px 16px;
  transform: translateZ(0);
  transition: filter .0s;
  font-weight: 700;
  letter-spacing: .8px;
  background: rgb(var(--color-snow));
  color: rgb(var(--color-eel));
  text-align: center;
  cursor: pointer;
height: 50px;
}

.ContactButton:hover {
  position: relative;
  min-width: 50px;
  font-size: 17px;
  border: none;
  border: 2px solid rgb(var(--color-swan));
  border-bottom: 4px solid rgb(var(--color-swan));
  border-radius: 16px;
  padding: 13px 16px;
  transform: translateZ(0);
  transition: filter .0s;
  font-weight: 700;
  letter-spacing: .8px;
  background: rgb(var(--color-snow));
  color: rgb(var(--color-eel));
  text-align: center;
  cursor: pointer;
height: 50px;
        filter: brightness(0.9);
}

.ContactButton:active {
  position: relative;
  min-width: 50px;
  font-size: 17px;
  border: none;
  border: 2px solid rgb(var(--color-swan));
  border-bottom: 2px solid rgb(var(--color-swan));
  border-radius: 16px;
  padding: 13px 16px;
  transform: translateZ(0);
  transition: filter .0s;
  font-weight: 700;
  letter-spacing: .8px;
  background: rgb(var(--color-snow));
  color: rgb(var(--color-eel));
  text-align: center;
  cursor: pointer;
height: 48px;
        filter: brightness(0.9);
}

.boxOne {
  padding: 16px;
  background-color: rgb(var(--color-snow));
  border-radius: 16px;
  width: 300px;
  border: 2px solid rgb(var(--color-swan));
}
.BoxOutside {
  height: 100%;
  width: 100%;
  margin-right: 20px;
}

.BetaTagAlert  {
  display: flex;
justify-content: space-between;
align-items: center;
align-self: stretch;
  padding-bottom: 10px;
}

.BETATagSpaceText {
  color: rgb(var(--color-eel));
font-size: 25px;
font-style: normal;
font-weight: 700;
line-height: 100%; /* 50px */
margin-top: 0px;
margin-bottom: 0px;
}

.BETATag {
  display: flex;
padding: 10px;
flex-direction: column;
justify-content: center;
align-items: center;
border-radius: 12.5px;
background: #FF4B4B;
}

.BETATagText {color: #FFF;
font-style: normal;
font-weight: 700;
line-height: normal;
margin-top: 0px;
margin-bottom: 0px;
}

.BoxInsideAlert  {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 18px;
  padding-bottom: 16px;
}

.AutoBoxAlertIcon {
width: 20px;
height: 18px;
}

.AutoBoxAlertText {
  color: #FF4B4B;
  font-weight: 700;
  height: 18px;
  margin-top: 16px;
}

.AutoBoxAlertTwo {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 18px;
  padding-bottom: 24px;
  padding-top: 16px;
}

.AutoBoxAlertTwoIcon {
width: 20px;
height: 20px;
}

.AutoBoxAlertTwoText {
  color: #FFC800;
  font-weight: 700;
  height: 18px;
  margin-top: 16px;
}

.AutoBoxExplanation {
  color: rgb(var(--color-eel));
  margin-top: -0px;
}

.AutoBoxExplanation {
  color: rgb(var(--color-eel));
  margin-top: -0px;
  height: 30px;
  font-weight: 700;
}

.BoxInside {
  height: 100%;
  width: 100%;
  display: flex;
  margin-right: 20px;
}

.button-down {
  position: relative;
  min-width: 50px;
  width: height;
  font-size: 17px;
  border: none;
  border-bottom: 4px solid #168DC5;
  border-radius: 16px;
  padding: 13px 16px;
  transform: translateZ(0);
  transition: filter .0s;
  font-weight: 700;
  letter-spacing: .8px;
  background: #1cb0f6;
  color: rgb(var(--color-snow));
  text-align: center;
  cursor: pointer;
}

.button-down:hover {
  position: relative;
  min-width: 50px;
  width: height;
  font-size: 17px;
  border: none;
  border-bottom: 4px solid #168DC5;
  border-radius: 16px;
  padding: 13px 16px;
  transform: translateZ(0);
  transition: filter .0s;
  font-weight: 700;
  letter-spacing: .8px;
  background: #1cb0f6;
  color: rgb(var(--color-snow));
  text-align: center;
  cursor: pointer;
        filter: brightness(1.1);
}

.button-down:active {
  position: relative;
  min-width: 50px;
  width: height;
  font-size: 17px;
  border: none;
  border-bottom: 0px solid #168DC5;
  border-radius: 16px;
  padding: 13px 16px;
  transform: translateZ(0);
  transition: filter .0s;
  font-weight: 700;
  letter-spacing: .8px;
  background: #1cb0f6;
  color: rgb(var(--color-snow));
  text-align: center;
  cursor: pointer;
        margin-top: 4px;
        filter: brightness(1.1);
}

.ticker {
  position: relative;
  min-width: 100px;
  width: 100%;
  font-size: 17px;
  border: none;
  border-radius: 16px;
  padding: 13px 16px;
  transform: translateZ(0);
  transition: filter .0s;
  font-weight: 700;
  letter-spacing: .8px;
  background: rgb(var(--color-swan));
  color: rgb(var(--color-eel));
  margin-left: 10px;
  text-align: center;
}

.button-up {
  position: relative;
  min-width: 50px;
  width: height;
        font-size: 17px;
        border: none;
        border-bottom: 4px solid #168DC5;
        border-radius: 16px;
        padding: 13px 16px;
        transform: translateZ(0);
        transition: filter .0s;
        font-weight: 700;
        letter-spacing: .8px;
        background: #1cb0f6;
        color: rgb(var(--color-snow));
        margin-left: 10px;
  text-align: center;
        cursor: pointer;
}

.button-up:hover {
  position: relative;
  min-width: 50px;
  width: height;
        font-size: 17px;
        border: none;
        border-bottom: 4px solid #168DC5;
        border-radius: 16px;
        padding: 13px 16px;
        transform: translateZ(0);
        transition: filter .0s;
        font-weight: 700;
        letter-spacing: .8px;
        background: #1cb0f6;
        color: rgb(var(--color-snow));
        margin-left: 10px;
  text-align: center;
        cursor: pointer;
        filter: brightness(1.1);
}

.button-up:active {
  position: relative;
  min-width: 50px;
  width: height;
        font-size: 17px;
        border: none;
        border-bottom: 0px solid #168DC5;
        border-radius: 16px;
        padding: 13px 16px;
        transform: translateZ(0);
        transition: filter .0s;
        font-weight: 700;
        letter-spacing: .8px;
        background: #1cb0f6;
        color: rgb(var(--color-snow));
        margin-left: 10px;
  text-align: center;
        cursor: pointer;
        margin-top: 4px;
        filter: brightness(1.1);
}

.StartToolWithValue {
  position: relative;
  min-width: 150px;
  width: calc(100% - 0px);
  font-size: 17px;
  border: none;
  border-bottom: 4px solid #168DC5;
  border-radius: 16px;
  padding: 13px 16px;
  transform: translateZ(0);
  transition: filter .0s;
  font-weight: 700;
  letter-spacing: .8px;
  background: #1cb0f6;
  color: rgb(var(--color-snow));
  margin-top: 10px;
  text-align: center;
  cursor: pointer;
}

.StartToolWithValue:hover {
  position: relative;
  min-width: 150px;
  width: calc(100% - 0px);
  font-size: 17px;
  border: none;
  border-bottom: 4px solid #168DC5;
  border-radius: 16px;
  padding: 13px 16px;
  transform: translateZ(0);
  transition: filter .0s;
  font-weight: 700;
  letter-spacing: .8px;
  background: #1cb0f6;
  color: rgb(var(--color-snow));
  margin-top: 10px;
  text-align: center;
  cursor: pointer;
        filter: brightness(1.1);
}

.StartToolWithValue:active {
  position: relative;
  min-width: 150px;
  width: calc(100% - 0px);
  font-size: 17px;
  border: none;
  border-bottom: 0px solid #168DC5;
  border-radius: 16px;
  padding: 13px 16px;
  transform: translateZ(0);
  transition: filter .0s;
  font-weight: 700;
  letter-spacing: .8px;
  background: #1cb0f6;
  color: rgb(var(--color-snow));
  text-align: center;
  cursor: pointer;
        margin-top: 14px;
        filter: brightness(1.1);
}
`;

// Function to inject HTML and CSS into the document
let injectedContainer = null;
let injectedStyleElement = null;

function injectContent() {

  // Check if the current URL matches the target URL
  if (window.location.href === 'https://preview.duolingo.com/learn' || window.location.href === 'https://duolingo.com/learn') {
      //console.log('tageturlmatches')
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
    }
  } else {
      //console.log('tageturlnotmatches')
    // Remove the content if it was previously injected
    if (injectedContainer) {
      document.body.removeChild(injectedContainer);
      document.head.removeChild(injectedStyleElement);
      injectedContainer = null;
      injectedStyleElement = null;
    }
  }
}

// Check the URL and inject/remove content every 1 second
setInterval(injectContent, 1000);


// Function to initialize JavaScript functionality
function initialize() {
  const ticker = document.querySelector('.ticker');
  const buttonUp = document.querySelector('.button-up');
  const buttonDown = document.querySelector('.button-down');
    const solveFastButton = document.querySelector('.StartToolWithValue');


    solveFastButton.addEventListener('click', () => {
        sessionStorage.setItem('isAutoMode', true);
        sessionStorage.setItem('numberOfTimes', numberOfTimes);
        isStartButtonPressed = true;
        sessionStorage.setItem('isStartButtonPressed', true);
        isAutoMode = true;
    });


  buttonUp.addEventListener('click', () => {
    numberOfTimes++;
    ticker.textContent = numberOfTimes;
        sessionStorage.setItem('numberOfTimes', numberOfTimes);
  });

  buttonDown.addEventListener('click', () => {
    numberOfTimes--;
    if (numberOfTimes < 0) {
      numberOfTimes = 0;
    }
    ticker.textContent = numberOfTimes;
        sessionStorage.setItem('numberOfTimes', numberOfTimes);
  });
    console.log(isAutoMode)
}

// Calling the functions to inject content and initialize functionality
injectContent();
initialize();

}




const muteButtonHTML = `
<div class="TopBoxPart">
<button class="SettingsButtonOne">SETTINGS</button>
<button class="MuteAllDuolingoSounds">MUTE SOUND</button>
</div>
`;
const muteButtonCSS = `

.TopBoxPart {
display: inline-flex;
gap: 16px;
flex-direction: column;
position: fixed;
align-items: flex-end;
top: 100px;
right: 16px;
z-index: 2;
}

.SettingsButtonOne {
  min-width: 50px;
  width: height;
  font-size: 17px;
  border: none;
  border: 2px solid rgb(var(--color-swan));
  border-bottom: 4px solid rgb(var(--color-swan));
  border-radius: 16px;
  padding: 13px 16px;
  transform: translateZ(0);
  transition: filter .0s;
  font-weight: 700;
  letter-spacing: .8px;
  background: rgb(var(--color-snow));
  color: rgb(var(--color-eel));
  text-align: center;
  cursor: pointer;
height: 50px;
}

.SettingsButtonOne:hover {
  position: relative;
  min-width: 50px;
  width: height;
  font-size: 17px;
  border: none;
  border: 2px solid rgb(var(--color-swan));
  border-bottom: 4px solid rgb(var(--color-swan));
  border-radius: 16px;
  padding: 13px 16px;
  transform: translateZ(0);
  transition: filter .0s;
  font-weight: 700;
  letter-spacing: .8px;
  background: rgb(var(--color-snow));
  color: rgb(var(--color-eel));
  text-align: center;
  cursor: pointer;
height: 50px;
        filter: brightness(0.9);
}

.SettingsButtonOne:active {
  position: relative;
  min-width: 50px;
  font-size: 17px;
  border: none;
  border: 2px solid rgb(var(--color-swan));
  border-bottom: 2px solid rgb(var(--color-swan));
  border-radius: 16px;
  padding: 13px 16px;
  transform: translateZ(0);
  transition: filter .0s;
  font-weight: 700;
  letter-spacing: .8px;
  background: rgb(var(--color-snow));
  color: rgb(var(--color-eel));
  text-align: center;
  cursor: pointer;
height: 48px;
margin-top: 2px;
        filter: brightness(0.9);
}

.MuteAllDuolingoSounds {
  min-width: 50px;
  width: height;
  font-size: 17px;
  border: none;
  border: 2px solid rgb(var(--color-swan));
  border-bottom: 4px solid rgb(var(--color-swan));
  border-radius: 16px;
  padding: 13px 16px;
  transform: translateZ(0);
  transition: filter .0s;
  font-weight: 700;
  letter-spacing: .8px;
  background: rgb(var(--color-snow));
  color: rgb(var(--color-eel));
  text-align: center;
  cursor: pointer;
height: 50px;
}

.MuteAllDuolingoSounds:hover {
  position: relative;
  min-width: 50px;
  width: height;
  font-size: 17px;
  border: none;
  border: 2px solid rgb(var(--color-swan));
  border-bottom: 4px solid rgb(var(--color-swan));
  border-radius: 16px;
  padding: 13px 16px;
  transform: translateZ(0);
  transition: filter .0s;
  font-weight: 700;
  letter-spacing: .8px;
  background: rgb(var(--color-snow));
  color: rgb(var(--color-eel));
  text-align: center;
  cursor: pointer;
height: 50px;
        filter: brightness(0.9);
}

.MuteAllDuolingoSounds:active {
  position: relative;
  min-width: 50px;
  font-size: 17px;
  border: none;
  border: 2px solid rgb(var(--color-swan));
  border-bottom: 2px solid rgb(var(--color-swan));
  border-radius: 16px;
  padding: 13px 16px;
  transform: translateZ(0);
  transition: filter .0s;
  font-weight: 700;
  letter-spacing: .8px;
  background: rgb(var(--color-snow));
  color: rgb(var(--color-eel));
  text-align: center;
  cursor: pointer;
height: 48px;
margin-top: 2px;
        filter: brightness(0.9);
}
`;

function injectMuteButton() {
  const injectedMuteButtonContainer = document.createElement('div');
  injectedMuteButtonContainer.innerHTML = muteButtonHTML;
  document.body.appendChild(injectedMuteButtonContainer);

  // Creating a style tag for CSS
  const injectedMuteButtonStyle = document.createElement('style');
  injectedMuteButtonStyle.type = 'text/css';
  injectedMuteButtonStyle.innerHTML = muteButtonCSS;
  document.head.appendChild(injectedMuteButtonStyle);
    console.log('injected mute button');
}

injectMuteButton();


window.document.querySelector('.MuteAllDuolingoSounds').onclick = function() {
  function muteAudioElements(doc) {
    var audioElements = doc.getElementsByTagName('audio');
    for (var i = 0; i < audioElements.length; i++) {
      audioElements[i].muted = !audioElements[i].muted;
    }
  }

  // Mute audio elements in the main document.
  muteAudioElements(window.document);

  // Mute audio elements inside iframes.
  var iframes = window.document.getElementsByTagName('iframe');
  for (var i = 0; i < iframes.length; i++) {
    try {
      muteAudioElements(iframes[i].contentDocument);
    } catch (e) {
      console.error('Unable to access iframe content:', e);
    }
  }

  // Update the button text.
  this.textContent = this.textContent === 'UNDER CONSTRUCTION' ? 'MUTE SOUND' : 'UNDER CONSTRUCTION';
};



function checkDomainAndCallSolving() {
      console.log('checking domain');
  // Get the current URL.
  const currentUrl = window.location.href;

  // Check if the domain of the current URL includes "duolingo.com/lesson" or "duolingo.com/unit".
  const domain = currentUrl;
  const isDuolingoLessonOrUnit = domain.includes("duolingo.com/lesson") || domain.includes("duolingo.com/unit") || domain.includes("duolingo.com/practice");

      console.log(isDuolingoLessonOrUnit);
  // If the domain is a Duolingo lesson or unit, and the let value is true, call the solving function.
  if(Boolean(isDuolingoLessonOrUnit) && Boolean(isAutoMode)) {
      console.log('checked domain true');
      setTimeout(solving, 6000);
  } else {
      console.log('shouldnt happen ' + domain);
  }
}

// Add the checkDomainAndCallSolving function to the window.onload event listener.
window.onload = setTimeout(checkDomainAndCallSolving, 2000);




function checkAutoMode() {
    if(isAutoMode === true) {
        console.log('smth');
        console.log(numberOfTimes);
    } else {
        console.log('wdf');
    }
}

setInterval(checkAutoMode, 1000);




//testing
function checkUrl() {

  const currentUrl = window.location.href;
    const mainUrls = [
  'http://duolingo.com',
  'https://duolingo.com',
  'duolingo.com',
  'duolingo.com/learn',
  'http://duolingo.com/learn',
  'https://duolingo.com/learn',
  'http://preview.duolingo.com',
  'https://preview.duolingo.com',
  'preview.duolingo.com',
  'preview.duolingo.com/learn',
  'http://preview.duolingo.com/learn',
  'https://preview.duolingo.com/learn',
];
  const currentOrigin = window.location.origin;
try {
if(mainUrls.includes(currentUrl) && isAutoMode && numberOfTimes > 0 && isStartButtonPressed === true) {
window.location.href = currentOrigin + '/lesson';
    numberOfTimes = numberOfTimes - 1;

        sessionStorage.setItem('numberOfTimes', numberOfTimes);
console.log('hey1');

} if(isStartButtonPressed === true && numberOfTimes === 0) {
    isStartButtonPressed = false;
        sessionStorage.setItem('isStartButtonPressed', false);
}

} catch (error) {
console.log('error number 7');
}

console.log(currentUrl);

    console.log('isAutoMode ' + isAutoMode)

}

setInterval(checkUrl, 1000);
//testing

function addButtons() {
    if (window.location.pathname === '/learn') {
        let button = document.querySelector('a[data-test="global-practice"]');
        if (button) {
            return; //button.click();
        }
    }


    const solveAllButton = document.getElementById("solveAllButton");
    if (solveAllButton !== null) {
        //solving();
        return;
    }

    const original = document.querySelectorAll('[data-test="player-next"]')[0];
    if (original === undefined) {
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
            solving();
            setInterval(() => {
                const startButton = document.querySelector('[data-test="start-button"]');
                if (startButton && startButton.innerText.startsWith("START")) {
                    startButton.click();
                }
            }, 3000);
            startButton.click();
        });
        wrapper.appendChild(solveAllButton);
    } else {
        const wrapper = document.getElementsByClassName('_10vOG')[0];
        wrapper.style.display = "flex";




        const solveCopy = document.createElement('button');


        //


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


        //


        const pauseCopy = document.createElement('button');


        //


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


        //


        solveCopy.id = 'solveAllButton';
        solveCopy.innerHTML = solvingIntervalId ? 'PAUSE SOLVE' : 'SOLVE ALL';
        solveCopy.disabled = false;
        pauseCopy.innerHTML = 'SOLVE';


        const defaultButtonStyle = `
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


setInterval(addButtons, 1000);

function solving() {
    if (solvingIntervalId) {
        clearInterval(solvingIntervalId);
        solvingIntervalId = undefined;
        document.getElementById("solveAllButton").innerText = "SOLVE ALL";
        isAutoMode = false;
    } else {
        document.getElementById("solveAllButton").innerText = "PAUSE SOLVE";
        isAutoMode = true;
        solvingIntervalId = setInterval(solve, 500);
    }
}

function solve() {
    const selAgain = document.querySelectorAll('[data-test="player-practice-again"]');
    const practiceAgain = document.querySelector('[data-test="player-practice-again"]');
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
        if (debug)
            document.getElementById("solveAllButton").innerText = 'Challenge Speak';
        const buttonSkip = document.querySelector('button[data-test="player-skip"]');
        if (buttonSkip) {
            buttonSkip.click();
        }
    } else if (window.sol.type === 'listenMatch') {
        if (debug)
            document.getElementById("solveAllButton").innerText = 'Listen Match';

        console.log('hello');

        const nl = document.querySelectorAll('[data-test$="challenge-tap-token"]');
        window.sol.pairs?.forEach((pair) => {
            for (let i = 0; i < nl.length; i++) {
                let nlInnerText;
                if (nl[i].querySelectorAll('[data-test="challenge-tap-token-text"]').length > 1) {
                    nlInnerText = nl[i].querySelector('[data-test="challenge-tap-token-text"]').innerText.toLowerCase().trim();
                } else {
                    //nlInnerText = findSubReact(nl[i]).textContent.toLowerCase().trim();
                    nlInnerText = nl[i].getAttribute('data-test').split('-')[0].toLowerCase().trim();
                    console.log(nlInnerText);
                }
                if (
                    (
                        nlInnerText === pair.learningWord.toLowerCase().trim() ||
                        nlInnerText === pair.translation.toLowerCase().trim()
                    ) &&
                    !nl[i].disabled
                ) {
                    nl[i].click();
                }
            }
        });
    } else if (document.querySelectorAll('[data-test="challenge-choice"]').length > 0) {
        // choice challenge
        if (debug)
            document.getElementById("solveAllButton").innerText = 'Challenge Choice';
        if (window.sol.correctTokens !== undefined) {
            correctTokensRun();
            nextButton.click()
        } else if (window.sol.correctIndex !== undefined) {
            document.querySelectorAll('[data-test="challenge-choice"]')[window.sol.correctIndex].click();
            nextButton.click();
        }
    } else if (document.querySelectorAll('[data-test$="challenge-tap-token"]').length > 0) {
        // match correct pairs challenge
        if (window.sol.pairs !== undefined) {
            if (debug)
                document.getElementById("solveAllButton").innerText = 'Pairs';
            let nl = document.querySelectorAll('[data-test$="challenge-tap-token"]');
            if (document.querySelectorAll('[data-test="challenge-tap-token-text"]').length
                === nl.length) {
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
            if (debug)
                document.getElementById("solveAllButton").innerText = 'Token Run';
            correctTokensRun();
            nextButton.click()
        } else if (window.sol.correctIndices !== undefined) {
            if (debug)
                document.getElementById("solveAllButton").innerText = 'Indices Run';
            correctIndicesRun();
        }
    } else if (document.querySelectorAll('[data-test="challenge-tap-token-text"]').length > 0) {
        if (debug)
            document.getElementById("solveAllButton").innerText = 'Challenge Tap Token Text';
        // fill the gap challenge
        correctIndicesRun();
    } else if (document.querySelectorAll('[data-test="challenge-text-input"]').length > 0) {
        if (debug)
            document.getElementById("solveAllButton").innerText = 'Challenge Text Input';
        let elm = document.querySelectorAll('[data-test="challenge-text-input"]')[0];
        let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0] : (window.sol.displayTokens ? window.sol.displayTokens.find(t => t.isBlank).text : window.sol.prompt));
        let inputEvent = new Event('input', {
            bubbles: true
        });

        elm.dispatchEvent(inputEvent);
    } else if (document.querySelectorAll('[data-test*="challenge-partialReverseTranslate"]').length > 0) {
        if (debug)
            document.getElementById("solveAllButton").innerText = 'Partial Reverse';
        let elm = document.querySelector('[data-test*="challenge-partialReverseTranslate"]')?.querySelector("span[contenteditable]");
        let nativeInputNodeTextSetter = Object.getOwnPropertyDescriptor(Node.prototype, "textContent").set
        nativeInputNodeTextSetter.call(elm, '"' + window.sol?.displayTokens?.filter(t => t.isBlank)?.map(t => t.text)?.join()?.replaceAll(',', '') + '"');
        let inputEvent = new Event('input', {
            bubbles: true
        });

        elm.dispatchEvent(inputEvent);
    } else if (document.querySelectorAll('textarea[data-test="challenge-translate-input"]').length > 0) {
        if (debug)
            document.getElementById("solveAllButton").innerText = 'Challenge Translate Input';
        const elm = document.querySelector('textarea[data-test="challenge-translate-input"]');
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0] : window.sol.prompt);

        let inputEvent = new Event('input', {
            bubbles: true
        });

        elm.dispatchEvent(inputEvent);
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
}
else{
return dom?.parentElement?.[reactProps]?.children[0]?._owner?.stateNode;
}
    //return dom?.parentElement?.[reactProps]?.children[0]?._owner?.stateNode;
}


window.findReact = findReact;

window.ss = solving;