// ==UserScript==
// @name         Duolingo PRO
// @namespace    http://duolingopro.net
// @version      3.0BETA.04
// @description  The fastest Duolingo XP gainer, working as of March 2025.
// @author       anonymousHackerIV
// @match        https://*.duolingo.com/*
// @match        https://*.duolingo.cn/*
// @icon         https://www.duolingopro.net/static/favicons/duo/128/light/primary.png
// @grant        GM_log
// ==/UserScript==

let storageLocal;
let storageSession;
let versionNumber = "04";
let storageLocalVersion = "04";
let storageSessionVersion = "04";
let versionName = "BETA.04";
let versionFull = "3.0BETA.04";
let versionFormal = "3.0 BETA.04";
let serverURL = "https://www.duolingopro.net";
let apiURL = "https://api.duolingopro.net";
let greasyfork = true;
let alpha = false;

let hidden = false;
let lastPage;
let currentPage = 1;
let windowBlurState = true;

let solvingIntervalId;
let isAutoMode;
let findReactMainElementClass = '_3yE3H';
let reactTraverseUp = 1;

const debug = false;

let temporaryRandom16 = Array.from({ length: 16 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('');

if (localStorage.getItem("DLP_Local_Storage") == null || JSON.parse(localStorage.getItem("DLP_Local_Storage")).storageVersion !== storageLocalVersion) {
    localStorage.setItem("DLP_Local_Storage", JSON.stringify({
        "version": versionNumber,
        "terms": "00",
        "random16": temporaryRandom16,
        "pins": {
            "home": ["DLP_Get_XP_1_ID", "DLP_Get_GEMS_1_ID"],
            "legacy": ["DLP_Get_PATH_1_ID", "DLP_Get_PRACTICE_1_ID"]
        },
        "settings": {
            "autoUpdate": !greasyfork,
            "showSolveButtons": true,
            "showAutoServerButton": alpha,
            "muteLessons": false,
            "solveSpeed": 0.9
        },
        "notifications": [
            {
                "id": "0001"
            }
        ],
        "tips": {
            "seeMore1": false
        },
        "languagePackVersion": "00",
        "onboarding": false,
        "storageVersion": storageLocalVersion
    }));
    storageLocal = JSON.parse(localStorage.getItem("DLP_Local_Storage"));
} else {
    storageLocal = JSON.parse(localStorage.getItem("DLP_Local_Storage"));
}
function saveStorageLocal() {
    localStorage.setItem("DLP_Local_Storage", JSON.stringify(storageLocal));
}

if (sessionStorage.getItem("DLP_Session_Storage") == null || JSON.parse(sessionStorage.getItem("DLP_Session_Storage")).storageVersion !== storageSessionVersion) {
    sessionStorage.setItem("DLP_Session_Storage", JSON.stringify({
        "legacy": {
            "page": 0,
            "status": false,
            "path": {
                "type": "lesson",
                "amount": 0
            },
            "practice": {
                "type": "lesson",
                "amount": 0
            },
            "listen": {
                "type": "lesson",
                "amount": 0
            },
            "lesson": {
                "section": 1,
                "unit": 1,
                "level": 1,
                "type": "lesson",
                "amount": 0
            }
        },
        "notifications": [
            {
                "id": "0001"
            }
        ],
        "storageVersion": storageSessionVersion
    }));
    storageSession = JSON.parse(sessionStorage.getItem("DLP_Session_Storage"));
} else {
    storageSession = JSON.parse(sessionStorage.getItem("DLP_Session_Storage"));
}
function saveStorageSession() {
    sessionStorage.setItem("DLP_Session_Storage", JSON.stringify(storageSession));
}

let systemLanguage = document.cookie.split('; ').find(row => row.startsWith('lang=')).split('=')[1];
let systemText = {
    en: {
        1: "Switch to Legacy",
        2: "Show",
        3: "Connecting",
        4: "Donate",
        5: "Feedback",
        6: "Settings",
        7: "What's New",
        8: "How much XP would you like to gain?",
        9: "GET",
        10: "How many Gems would you like to gain?",
        12: "Would you like to redeem 3 days of Super Duolingo?",
        13: "REDEEM",
        14: "Terms & Conditions",
        15: "See More",
        16: "Back",
        17: "How many lessons would you like to solve on the path?",
        18: "START",
        19: "How many practices would you like to solve?",
        21: "How many listening practices would you like to solve? (Requires Super Duolingo)",
        23: "Which and how many lessons would you like to repeat?",
        25: "Please read and accept the Terms & Conditions to use Duolingo PRO 3.0.",
        26: "These are the Terms & Conditions you agreed to use Duolingo PRO 3.0.",
        27: "LOADING TERMS & CONDITIONS<br><br>YOU CANNOT USE THIS SOFTWARE UNTIL TERMS & CONDITIONS ARE LOADED",
        28: "DECLINE",
        29: "ACCEPT",
        30: "Without accepting the Terms & Conditions, you cannot use Duolingo PRO 3.0.",
        31: "BACK",
        32: "Settings",
        34: "Automatic Updates",
        35: "Duolingo PRO 3.0 will automatically update itself when there's a new version available.",
        37: "SAVE",
        38: "Feedback",
        39: "Help us make Duolingo PRO 3.0 better.",
        40: "Write here as much as you can with as many details as possible.",
        41: "Feedback Type: ",
        42: "BUG REPORT",
        43: "SUGGESTION",
        44: "Add Attachment: (Optional)",
        45: "UPLOAD",
        47: "SEND",
        48: "What's New",
        51: "LEARN MORE",
        52: "Welcome to",
        53: "The next generation of Duolingo PRO is here, with Instant XP, Magnet UI, all powerful than ever. ",
        54: "START",
        100: "SOLVE",
        101: "SOLVE ALL",
        102: "PAUSE SOLVE",
        103: "Hide",
        104: "Show",
        105: "Switch to 3.0",
        106: "Switch to Legacy",
        107: "STOP",
        108: "Connected",
        109: "Error",
        110: "SEND",
        111: "SENDING",
        112: "SENT",
        113: "LOADING",
        114: "DONE",
        115: "FAILED",
        116: "SAVING AND APPLYING",
        200: "Under Construction",
        201: "The Gems function is currently under construction. We plan to make it accessible to everyone soon.",
        202: "Update Available",
        203: "You are using an outdated version of Duolingo PRO.<br><br>Please <a href='https://www.duolingopro.net/greasyfork' target='_blank' style='font-family: Duolingo Pro Rounded; color: #007AFF; text-decoration: underline;'>update Duolingo PRO</a> or turn on automatic updates.",
        204: "Feedback Sent",
        205: "Your feedback was successfully sent, and our developers will look over it. Keep in mind, we cannot respond back to your feedback.",
        206: "Error Sending Feedback",
        207: "Your feedback was not sent. This might be because you are using an outdated or a modified version of Duolingo PRO.",
        208: "Unknown Error",
        209: "Please try again later. An unknown error occurred. Number: ",
        210: "hour",
        211: "hours",
        212: "minute",
        213: "minutes",
        214: "and",
        215: "{hours} {hourUnit}",
        216: "{minutes} {minuteUnit}",
        217: "{hourPhrase} {conjunction} {minutePhrase}",
        218: "XP Successfully Received",
        219: "You received {amount} XP. You can request up to {remainingXP} XP before your limit resets back to {totalLimit} XP in {timeMessage}. To boost your limits, <a href='https://duolingopro.net/donate' target='_blank' style='font-family: Duolingo Pro Rounded; text-decoration: underline; color: #007AFF;'>donate</a>.",
        220: "Super Duolingo Successfully Redeemed",
        221: "You redeemed a 3 day Super Duolingo trial. You can request another 3 day Super Duolingo trial in {timeMessage}.",
        222: "Limit Warning",
        223: "You can only request up to {limitAmount} XP before your limit resets back to {totalLimitAmount} XP in {timeMessage}. To boost your limits, <a href='https://duolingopro.net/donate' target='_blank' style='font-family: Duolingo Pro Rounded; text-decoration: underline; color: #007AFF;'>donate</a>.",
        224: "Limit Reached",
        225: "You reached your XP limit for the next {timeMessage}. To boost your limits, <a href='https://duolingopro.net/donate' target='_blank' style='font-family: Duolingo Pro Rounded; text-decoration: underline; color: #007AFF;'>donate</a>.",
        227: "You already redeemed a 3 day Super Duolingo trial. You can request another 3 day Super Duolingo trial in {timeMessage}.",
        229: "GEMS testing",
        230: "GEMS testing",
        231: "Error Connecting",
        232: "Duolingo PRO was unable to connect to our servers. This may be because our servers are temporarily unavailable or you are using an outdated version. Check for <a href='https://status.duolingopro.net' target='_blank' style='font-family: Duolingo Pro Rounded; text-decoration: underline; color: #007AFF;'>server status</a> or <a href='https://duolingopro.net/greasyfork' target='_blank' style='font-family: Duolingo Pro Rounded; text-decoration: underline; color: #007AFF;'>updates</a>.",
    },
};

let CSS1;
let HTML2;
let CSS2;
let HTML3;
let HTML4;
let HTML5;
let CSS5;
let HTML6;
let CSS6;
let HTML7;
let CSS7;

function Two() {
CSS1 = `
@font-face {
    font-family: 'Duolingo Pro Rounded';
    src: url(${serverURL}/static/3.0/assets/fonts/Duolingo-Pro-Rounded-Semibold.woff) format('woff');
    font-weight: 700;
    font-style: normal;
}
@font-face {
    font-family: 'Duolingo Pro Rounded';
    src: url(${serverURL}/static/3.0/assets/fonts/Duolingo-Pro-Rounded-Medium.woff) format('woff');
    font-weight: 500;
    font-style: normal;
}`;

HTML2 = `
<canvas style="position: fixed; top: 0; left: 0; bottom: 0; right: 0; width: 100%; height: 100vh; z-index: 211; pointer-events: none;" id="DLP_Confetti_Canvas"></canvas>
<div class="DLP_Notification_Main"></div>
<div class="DLP_Main">
    <div class="DLP_HStack_8" style="align-self: flex-end;">
        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Switch_Legacy_Button_1_ID" style="outline: 2px solid rgba(0, 122, 255, 0.20); outline-offset: -2px; background: linear-gradient(0deg, rgba(0, 122, 255, 0.10) 0%, rgba(0, 122, 255, 0.10) 100%), rgba(var(--color-snow), 0.80); backdrop-filter: blur(16px);">
            <svg id="DLP_Inset_Icon_1_ID" width="17" height="18" viewBox="0 0 17 18" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM12.7656 9.84375C12.7656 7.96875 11.4531 6.71875 9.47656 6.71875H7.14844L6.5 6.76562L7 6.39844L7.78125 5.67969C7.92188 5.55469 7.99219 5.375 7.99219 5.19531C7.99219 4.8125 7.66406 4.48438 7.28906 4.48438C7.10156 4.48438 6.9375 4.55469 6.80469 4.69531L4.64844 6.875C4.50781 7.02344 4.42188 7.21094 4.42188 7.40625C4.42188 7.59375 4.5 7.78125 4.64844 7.9375L6.80469 10.125C6.9375 10.2578 7.11719 10.3281 7.30469 10.3281C7.67969 10.3281 8 10 8 9.60938C8 9.42969 7.92188 9.25781 7.78125 9.125L6.91406 8.375L6.5 8.09375L7.14844 8.14062H9.47656C10.5547 8.14062 11.2656 8.82812 11.2656 9.84375C11.2656 10.9062 10.5547 11.6094 9.48438 11.6094H8.33594C7.85156 11.6094 7.52344 11.8984 7.52344 12.3359C7.52344 12.7812 7.85156 13.0859 8.33594 13.0859H9.48438C11.4531 13.0859 12.7656 11.7969 12.7656 9.84375Z"/>
            </svg>
            <svg id="DLP_Inset_Icon_2_ID" width="17" height="18" viewBox="0 0 17 18" fill="#007AFF" xmlns="http://www.w3.org/2000/svg" display="none">
                <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM4.5625 9.84375C4.5625 11.7969 5.875 13.0859 7.84375 13.0859H8.99219C9.47656 13.0859 9.80469 12.7812 9.80469 12.3359C9.80469 11.8984 9.47656 11.6094 8.99219 11.6094H7.84375C6.77344 11.6094 6.0625 10.9062 6.0625 9.84375C6.0625 8.82812 6.77344 8.14062 7.85156 8.14062H10.1797L10.8281 8.09375L10.4141 8.375L9.54688 9.125C9.40625 9.25781 9.32812 9.42969 9.32812 9.60938C9.32812 10 9.64844 10.3281 10.0234 10.3281C10.2109 10.3281 10.3906 10.2578 10.5156 10.125L12.6797 7.9375C12.8281 7.78125 12.9062 7.59375 12.9062 7.40625C12.9062 7.21094 12.8203 7.02344 12.6797 6.875L10.5234 4.69531C10.3906 4.55469 10.2266 4.48438 10.0391 4.48438C9.66406 4.48438 9.33594 4.8125 9.33594 5.19531C9.33594 5.375 9.40625 5.55469 9.54688 5.67969L10.3281 6.39844L10.8281 6.76562L10.1797 6.71875H7.85156C5.875 6.71875 4.5625 7.96875 4.5625 9.84375Z"/>
            </svg>
            <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #007AFF; white-space: nowrap;">${systemText[systemLanguage][1]}</p>
        </div>
        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Hide_Button_1_ID" style="outline: 2px solid rgba(0, 122, 255, 0.20); outline-offset: -2px; background: rgba(0, 122, 255, 0.10); flex: none; backdrop-filter: blur(16px);">
            <svg id="DLP_Inset_Icon_1_ID" width="23" height="16" viewBox="0 0 23 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg" display="none">
                <path d="M17.7266 14.9922L4.1875 1.47656C3.9375 1.22656 3.9375 0.796875 4.1875 0.546875C4.44531 0.289062 4.875 0.289062 5.125 0.546875L18.6562 14.0625C18.9141 14.3203 18.9219 14.7188 18.6562 14.9922C18.3984 15.2578 17.9844 15.25 17.7266 14.9922ZM18.4609 12.4062L15.3281 9.25781C15.5 8.82812 15.5938 8.35938 15.5938 7.875C15.5938 5.57812 13.7266 3.74219 11.4375 3.74219C10.9531 3.74219 10.4922 3.83594 10.0547 3.99219L7.75 1.67969C8.875 1.3125 10.1016 1.09375 11.4297 1.09375C17.8984 1.09375 22.1172 6.28906 22.1172 7.875C22.1172 8.78125 20.7344 10.8438 18.4609 12.4062ZM11.4297 14.6562C5.05469 14.6562 0.75 9.45312 0.75 7.875C0.75 6.96094 2.16406 4.85938 4.54688 3.27344L7.59375 6.32812C7.39062 6.79688 7.27344 7.32812 7.27344 7.875C7.28125 10.1172 9.13281 12.0078 11.4375 12.0078C11.9766 12.0078 12.4922 11.8906 12.9609 11.6875L15.2812 14.0078C14.125 14.4141 12.8281 14.6562 11.4297 14.6562ZM13.9609 7.71094C13.9609 7.77344 13.9609 7.82812 13.9531 7.88281L11.3203 5.25781C11.375 5.25 11.4375 5.25 11.4922 5.25C12.8594 5.25 13.9609 6.35156 13.9609 7.71094ZM8.88281 7.82031C8.88281 7.75781 8.88281 7.6875 8.89062 7.625L11.5391 10.2734C11.4766 10.2812 11.4219 10.2891 11.3594 10.2891C10 10.2891 8.88281 9.17969 8.88281 7.82031Z"/>
            </svg>
            <svg id="DLP_Inset_Icon_2_ID" width="22" height="14" viewBox="0 0 22 14" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.2734 13.6406C4.89844 13.6406 0.59375 8.4375 0.59375 6.85156C0.59375 5.27344 4.90625 0.078125 11.2734 0.078125C17.75 0.078125 21.9688 5.27344 21.9688 6.85156C21.9688 8.4375 17.75 13.6406 11.2734 13.6406ZM11.2812 11.0078C13.5781 11.0078 15.4375 9.14844 15.4375 6.85938C15.4375 4.5625 13.5781 2.70312 11.2812 2.70312C8.98438 2.70312 7.125 4.5625 7.125 6.85938C7.125 9.14844 8.98438 11.0078 11.2812 11.0078ZM11.2812 8.49219C10.375 8.49219 9.64844 7.76562 9.64844 6.85938C9.64844 5.95312 10.375 5.22656 11.2812 5.22656C12.1875 5.22656 12.9141 5.95312 12.9141 6.85938C12.9141 7.76562 12.1875 8.49219 11.2812 8.49219Z"/>
            </svg>
            <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #007AFF;">${systemText[systemLanguage][2]}</p>
        </div>
    </div>
    <div class="DLP_Main_Box">
        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_1_ID" style="display: block;">
            <div class="DLP_VStack_8">
                <div class="DLP_VStack_8">
                    <div class="DLP_HStack_8">
                        <div id="DLP_Main_1_Server_Connection_Button_1_ID" class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" style="outline: 2px solid rgb(var(--color-eel), 0.20); outline-offset: -2px; background: rgb(var(--color-eel), 0.10); transition: opacity 0.8s cubic-bezier(0.16, 1, 0.32, 1), background 0.8s cubic-bezier(0.16, 1, 0.32, 1), outline 0.8s cubic-bezier(0.16, 1, 0.32, 1), filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.4s cubic-bezier(0.16, 1, 0.32, 1); padding: 10px 0px 10px 10px;">
                            <svg id="DLP_Inset_Icon_1_ID" width="17" height="18" viewBox="0 0 17 18" fill="rgb(var(--color-eel))" xmlns="http://www.w3.org/2000/svg" style="transition: 0.4s;">
                                <path d="M8.64844 2.66406C8.03125 2.66406 7.4375 2.75 6.875 2.92188L6.07812 1.02344C6.89062 0.757812 7.75781 0.609375 8.64844 0.609375C9.53906 0.609375 10.3984 0.757812 11.2031 1.02344L10.4219 2.92188C9.85938 2.75781 9.26562 2.66406 8.64844 2.66406ZM14.1016 5.91406C13.5312 4.84375 12.6562 3.96875 11.5859 3.39844L12.375 1.50781C13.9297 2.30469 15.2031 3.57812 16 5.125L14.1016 5.91406ZM5.70312 3.39844C4.63281 3.97656 3.75781 4.85156 3.19531 5.92188L1.29688 5.125C2.09375 3.57812 3.36719 2.30469 4.91406 1.50781L5.70312 3.39844ZM14.8438 8.85938C14.8438 8.24219 14.7578 7.64844 14.5859 7.08594L16.4844 6.29688C16.7578 7.10156 16.8984 7.96875 16.8984 8.85938C16.8984 9.75 16.7578 10.6172 16.4844 11.4219L14.5938 10.6328C14.75 10.0703 14.8438 9.47656 14.8438 8.85938ZM2.46094 8.85938C2.46094 9.47656 2.54688 10.0703 2.71094 10.625L0.8125 11.4219C0.546875 10.6094 0.398438 9.75 0.398438 8.85938C0.398438 7.96875 0.546875 7.10938 0.8125 6.29688L2.71094 7.08594C2.54688 7.64844 2.46094 8.24219 2.46094 8.85938ZM11.5859 14.3125C12.6562 13.7422 13.5391 12.875 14.1094 11.8047L16 12.5938C15.2031 14.1406 13.9297 15.4141 12.375 16.2109L11.5859 14.3125ZM3.19531 11.8047C3.76562 12.8672 4.63281 13.7422 5.70312 14.3125L4.91406 16.2031C3.36719 15.4141 2.09375 14.1406 1.29688 12.5938L3.19531 11.8047ZM8.64844 15.0547C9.26562 15.0547 9.85938 14.9609 10.4141 14.7969L11.2109 16.6953C10.3984 16.9609 9.53906 17.1094 8.64844 17.1094C7.75781 17.1094 6.89062 16.9609 6.08594 16.6953L6.875 14.7969C7.4375 14.9609 8.03125 15.0547 8.64844 15.0547Z"/>
                            </svg>
                            <svg id="DLP_Inset_Icon_2_ID" width="17" height="18" viewBox="0 0 17 18" fill="#FFF" xmlns="http://www.w3.org/2000/svg" display="none" style="transition: 0.4s;">
                                <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM3.89062 4.19531C4.25 4.44531 4.71094 4.65625 5.24219 4.82812C5.60938 3.85156 6.09375 3.05469 6.67188 2.49219C5.60156 2.82812 4.65625 3.42188 3.89062 4.19531ZM10.6328 2.49219C11.2031 3.05469 11.6953 3.85938 12.0547 4.82812C12.5859 4.65625 13.0469 4.44531 13.4062 4.19531C12.6484 3.42188 11.6953 2.82812 10.6328 2.49219ZM6.46094 5.11719C6.95312 5.20312 7.48438 5.25781 8.04688 5.28125V2.91406C7.42969 3.24219 6.86719 4.04688 6.46094 5.11719ZM9.25781 2.91406V5.28125C9.8125 5.25781 10.3438 5.20312 10.8359 5.11719C10.4297 4.04688 9.86719 3.24219 9.25781 2.91406ZM2.01562 8.25H4.58594C4.625 7.44531 4.73438 6.67969 4.89844 5.96875C4.19531 5.75 3.59375 5.46094 3.14062 5.11719C2.51562 6.02344 2.11719 7.10156 2.01562 8.25ZM12.7109 8.25H15.2891C15.1797 7.09375 14.7812 6.02344 14.1641 5.11719C13.7109 5.46094 13.1094 5.75 12.3984 5.96875C12.5703 6.67969 12.6719 7.44531 12.7109 8.25ZM5.82031 8.25H8.04688V6.48438C7.36719 6.46094 6.71094 6.38281 6.10938 6.27344C5.96094 6.89062 5.85938 7.5625 5.82031 8.25ZM9.25781 8.25H11.4766C11.4375 7.5625 11.3438 6.89062 11.1953 6.27344C10.5859 6.38281 9.92969 6.46094 9.25781 6.48438V8.25ZM2.01562 9.46094C2.11719 10.6328 2.52344 11.7109 3.15625 12.625C3.60938 12.2891 4.20312 12.0078 4.90625 11.7812C4.73438 11.0703 4.625 10.2891 4.58594 9.46094H2.01562ZM5.82031 9.46094C5.85938 10.1719 5.96094 10.8516 6.10938 11.4844C6.71875 11.3672 7.36719 11.2969 8.04688 11.2656V9.46094H5.82031ZM9.25781 11.2656C9.92969 11.2969 10.5781 11.3672 11.1875 11.4844C11.3438 10.8516 11.4453 10.1719 11.4844 9.46094H9.25781V11.2656ZM12.3984 11.7812C13.0938 12.0078 13.6953 12.2891 14.1484 12.625C14.7734 11.7109 15.1797 10.6328 15.2891 9.46094H12.7109C12.6797 10.2891 12.5703 11.0703 12.3984 11.7812ZM9.25781 12.4766V14.8203C9.85938 14.4922 10.4219 13.6953 10.8281 12.6406C10.3359 12.5547 9.8125 12.5 9.25781 12.4766ZM6.46875 12.6406C6.875 13.6953 7.4375 14.4922 8.04688 14.8203V12.4766C7.49219 12.5 6.96094 12.5547 6.46875 12.6406ZM3.91406 13.5391C4.66406 14.3047 5.60156 14.8828 6.64844 15.2188C6.08594 14.6641 5.60938 13.875 5.25 12.9297C4.72656 13.0938 4.27344 13.2969 3.91406 13.5391ZM12.0469 12.9297C11.6953 13.875 11.2109 14.6641 10.6484 15.2188C11.6953 14.8828 12.6328 14.3047 13.3828 13.5391C13.0312 13.2969 12.5781 13.0938 12.0469 12.9297Z"/>
                            </svg>
                            <svg id="DLP_Inset_Icon_3_ID" width="18" height="16" viewBox="0 0 18 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg" display="none" style="transition: 0.4s;">
                                <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                            </svg>
                            <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: rgb(var(--color-eel)); transition: 0.4s;">${systemText[systemLanguage][3]}</p>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Main_Donate_Button_1_ID" onclick="window.open('https://duolingopro.net/donate', '_blank');" style="outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; padding: 10px 0px 10px 10px;">
                            <svg width="17" height="19" viewBox="0 0 17 19" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.5 5.90755C16.4968 3.60922 14.6997 1.72555 12.5913 1.04588C9.97298 0.201877 6.51973 0.324211 4.01956 1.49921C0.989301 2.92355 0.0373889 6.04355 0.00191597 9.15522C-0.0271986 11.7136 0.229143 18.4517 4.04482 18.4997C6.87998 18.5356 7.30214 14.8967 8.61397 13.1442C9.5473 11.8974 10.749 11.5452 12.2284 11.1806C14.7709 10.5537 16.5037 8.55506 16.5 5.90755Z"/>
                            </svg>
                            <p class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][4]}</p>
                        </div>
                    </div>
                    <div class="DLP_HStack_8">
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Main_Feedback_1_Button_1_ID" style="outline: 2px solid rgba(0, 122, 255, 0.20); outline-offset: -2px; background: linear-gradient(0deg, rgba(0, 122, 255, 0.10) 0%, rgba(0, 122, 255, 0.10) 100%), rgba(var(--color-snow), 0.80); backdrop-filter: blur(16px);">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.22656 17.8125C4.70312 17.8125 4.39062 17.4531 4.39062 16.8906V14.6641H3.6875C1.52344 14.6641 -0.0078125 13.2109 -0.0078125 10.8438V4.64844C-0.0078125 2.27344 1.42969 0.820312 3.82031 0.820312H14.1641C16.5547 0.820312 17.9922 2.27344 17.9922 4.64844V10.8438C17.9922 13.2109 16.5547 14.6641 14.1641 14.6641H9.22656L6.29688 17.2734C5.86719 17.6562 5.57812 17.8125 5.22656 17.8125Z"/>
                            </svg>
                            <p class="DLP_Text_Style_1" style="color: #007AFF;">${systemText[systemLanguage][5]}</p>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Main_Settings_1_Button_1_ID" style="outline: 2px solid rgba(0, 122, 255, 0.20); outline-offset: -2px; background: linear-gradient(0deg, rgba(0, 122, 255, 0.10) 0%, rgba(0, 122, 255, 0.10) 100%), rgba(var(--color-snow), 0.80); backdrop-filter: blur(16px);">
                            <svg width="19" height="19" viewBox="0 0 19 19" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.46094 17.6875C9.28906 17.6875 9.13281 17.6797 8.96875 17.6719L8.55469 18.4453C8.42969 18.6875 8.17188 18.8281 7.89062 18.7891C7.60156 18.7344 7.40625 18.5156 7.36719 18.2344L7.24219 17.3672C6.92188 17.2812 6.61719 17.1641 6.32031 17.0469L5.67969 17.6172C5.47656 17.8047 5.17969 17.8516 4.92188 17.7109C4.67188 17.5547 4.57031 17.2891 4.625 17.0156L4.80469 16.1562C4.54688 15.9688 4.28906 15.7578 4.05469 15.5312L3.25781 15.8672C2.98438 15.9844 2.71094 15.9062 2.50781 15.6797C2.34375 15.4688 2.3125 15.1719 2.46094 14.9375L2.92188 14.1875C2.75 13.9219 2.59375 13.6406 2.4375 13.3438L1.57031 13.3828C1.28906 13.3984 1.03125 13.2344 0.945312 12.9531C0.851562 12.6953 0.9375 12.4062 1.15625 12.2344L1.84375 11.6953C1.76562 11.3828 1.70312 11.0625 1.67188 10.7344L0.84375 10.4609C0.5625 10.375 0.398438 10.1484 0.398438 9.85938C0.398438 9.57031 0.5625 9.34375 0.84375 9.25L1.67188 8.98438C1.70312 8.65625 1.76562 8.34375 1.84375 8.02344L1.15625 7.47656C0.9375 7.3125 0.851562 7.03125 0.945312 6.77344C1.03125 6.49219 1.28906 6.33594 1.57031 6.34375L2.4375 6.375C2.59375 6.07812 2.75 5.80469 2.92188 5.52344L2.46094 4.78125C2.3125 4.55469 2.34375 4.25781 2.50781 4.04688C2.71094 3.82031 2.98438 3.74219 3.25 3.85938L4.05469 4.17969C4.28906 3.96875 4.54688 3.75781 4.80469 3.5625L4.625 2.71875C4.5625 2.42188 4.67969 2.15625 4.91406 2.01562C5.1875 1.875 5.47656 1.91406 5.6875 2.10938L6.32031 2.67969C6.61719 2.55469 6.92969 2.44531 7.24219 2.35156L7.36719 1.49219C7.40625 1.21094 7.60156 0.992188 7.88281 0.945312C8.17188 0.898438 8.42969 1.03125 8.55469 1.26562L8.96875 2.04688C9.13281 2.03906 9.28906 2.03125 9.46094 2.03125C9.61719 2.03125 9.78125 2.03906 9.94531 2.04688L10.3594 1.26562C10.4766 1.03906 10.7344 0.898438 11.0234 0.9375C11.3047 0.992188 11.5078 1.21094 11.5469 1.49219L11.6719 2.35156C11.9844 2.44531 12.2891 2.55469 12.5859 2.67969L13.2266 2.10938C13.4375 1.91406 13.7266 1.875 13.9922 2.01562C14.2344 2.15625 14.3516 2.42188 14.2891 2.71094L14.1094 3.5625C14.3594 3.75781 14.6172 3.96875 14.8516 4.17969L15.6562 3.85938C15.9297 3.74219 16.2031 3.82031 16.4062 4.04688C16.5703 4.25781 16.5938 4.55469 16.4453 4.78125L15.9844 5.52344C16.1641 5.80469 16.3203 6.07812 16.4688 6.375L17.3438 6.34375C17.6172 6.33594 17.8828 6.49219 17.9688 6.77344C18.0625 7.03125 17.9609 7.30469 17.75 7.47656L17.0703 8.01562C17.1484 8.34375 17.2109 8.65625 17.2422 8.98438L18.0625 9.25C18.3438 9.35156 18.5234 9.57031 18.5234 9.85938C18.5234 10.1406 18.3438 10.3672 18.0625 10.4609L17.2422 10.7344C17.2109 11.0625 17.1484 11.3828 17.0703 11.6953L17.7578 12.2344C17.9688 12.4062 18.0625 12.6953 17.9688 12.9531C17.8828 13.2344 17.6172 13.3984 17.3438 13.3828L16.4688 13.3438C16.3203 13.6406 16.1641 13.9219 15.9844 14.1875L16.4453 14.9297C16.6016 15.1797 16.5703 15.4688 16.4062 15.6797C16.2031 15.9062 15.9219 15.9844 15.6562 15.8672L14.8594 15.5312C14.6172 15.7578 14.3594 15.9688 14.1094 16.1562L14.2891 17.0078C14.3516 17.2891 14.2344 17.5547 14 17.7031C13.7266 17.8516 13.4375 17.7969 13.2266 17.6172L12.5859 17.0469C12.2891 17.1641 11.9844 17.2812 11.6719 17.3672L11.5469 18.2344C11.5078 18.5156 11.3047 18.7344 11.0312 18.7812C10.7344 18.8281 10.4688 18.6953 10.3516 18.4453L9.94531 17.6719C9.78125 17.6797 9.61719 17.6875 9.46094 17.6875ZM9.44531 7.45312C10.4844 7.45312 11.375 8.10938 11.7109 9.03125H15.3281C14.9375 6.11719 12.4922 3.89062 9.46094 3.89062C8.64062 3.89062 7.86719 4.05469 7.16406 4.34375L8.99219 7.5C9.14062 7.46875 9.28906 7.45312 9.44531 7.45312ZM3.53906 9.85938C3.53906 11.7422 4.38281 13.4141 5.71875 14.5078L7.60156 11.4141C7.25 10.9922 7.03906 10.4531 7.03906 9.86719C7.03906 9.27344 7.25781 8.72656 7.60938 8.30469L5.78125 5.16406C4.40625 6.25 3.53906 7.94531 3.53906 9.85938ZM9.44531 10.7656C9.96094 10.7656 10.3516 10.375 10.3516 9.86719C10.3516 9.35938 9.96094 8.96094 9.44531 8.96094C8.94531 8.96094 8.54688 9.35938 8.54688 9.86719C8.54688 10.375 8.94531 10.7656 9.44531 10.7656ZM9.46094 15.8281C12.5078 15.8281 14.9609 13.5859 15.3359 10.6562H11.7266C11.4062 11.6016 10.5078 12.2734 9.44531 12.2734C9.28906 12.2734 9.125 12.2578 8.97656 12.2266L7.08594 15.3359C7.8125 15.6484 8.60938 15.8281 9.46094 15.8281Z"/>
                            </svg>
                            <p class="DLP_Text_Style_1" style="color: #007AFF;">${systemText[systemLanguage][6]}</p>
                        </div>
                    </div>
                    <div class="DLP_HStack_8">
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Secondary_Earn_Button_1_ID" style="outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; padding: 10px 0px 10px 10px;">
                            <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M-0.0078125 7.82031V6.33594C-0.0078125 5.15625 0.679688 4.55469 1.8125 4.55469H2.92188C2.47656 4.10156 2.20312 3.49219 2.20312 2.79688C2.20312 1.17188 3.51562 0 5.13281 0C6.38281 0 7.46875 0.734375 7.83594 2.03906C8.20312 0.734375 9.28906 0 10.5391 0C12.1562 0 13.4609 1.17188 13.4609 2.79688C13.4609 3.49219 13.1875 4.10156 12.7422 4.55469H13.8594C15.0156 4.55469 15.6797 5.15625 15.6797 6.33594V7.82031C15.6797 8.74219 15.125 9.23438 14.2188 9.23438H8.74219V4.55469H6.92969V3.52344C6.92969 2.50781 6.22656 1.76562 5.36719 1.76562C4.54688 1.76562 4.03125 2.28125 4.03125 3.07031C4.03125 3.89844 4.6875 4.55469 5.82812 4.55469H6.92969V9.23438H1.44531C0.546875 9.23438 -0.0078125 8.74219 -0.0078125 7.82031ZM10.3047 1.76562C9.44531 1.76562 8.74219 2.50781 8.74219 3.52344V4.55469H9.84375C10.9844 4.55469 11.6328 3.89844 11.6328 3.07031C11.6328 2.28125 11.125 1.76562 10.3047 1.76562ZM1.00781 14.8125V10.375H6.92969V16.9688H3.22656C1.82812 16.9688 1.00781 16.1953 1.00781 14.8125ZM8.74219 16.9688V10.375H14.6562V14.8125C14.6562 16.1953 13.8359 16.9688 12.4453 16.9688H8.74219Z" fill="white"/>
                            </svg>
                            <p class="DLP_Text_Style_1" style="color: #FFF;">Earn</p>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Main_YouTube_Button_1_ID" onclick="window.open('https://duolingopro.net/youtube', '_blank');" style="justify-content: center; flex: none; width: 40px; padding: 10px; outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: #FF3B30;">
                            <svg width="22" height="16" viewBox="0 0 22 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2043 1.0885C20.1084 1.33051 20.8189 2.041 21.0609 2.9451C21.4982 4.58216 21.5 7.99976 21.5 7.99976C21.5 7.99976 21.5 11.4174 21.0609 13.0544C20.8189 13.9585 20.1084 14.669 19.2043 14.911C17.5673 15.3501 11 15.3501 11 15.3501C11 15.3501 4.43274 15.3501 2.79568 14.911C1.89159 14.669 1.1811 13.9585 0.939084 13.0544C0.5 11.4174 0.5 7.99976 0.5 7.99976C0.5 7.99976 0.5 4.58216 0.939084 2.9451C1.1811 2.041 1.89159 1.33051 2.79568 1.0885C4.43274 0.649414 11 0.649414 11 0.649414C11 0.649414 17.5673 0.649414 19.2043 1.0885ZM14.3541 8.00005L8.89834 11.1497V4.85038L14.3541 8.00005Z"/>
                            </svg>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Main_Discord_Button_1_ID" onclick="window.open('https://duolingopro.net/discord', '_blank');" style="justify-content: center; flex: none; width: 40px; padding: 10px; outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: #5865F2;">
                            <svg width="22" height="16" viewBox="0 0 22 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.289 1.34C16.9296 0.714 15.4761 0.259052 13.9565 0C13.7699 0.332095 13.5519 0.77877 13.4016 1.1341C11.7862 0.894993 10.1857 0.894993 8.60001 1.1341C8.44972 0.77877 8.22674 0.332095 8.03844 0C6.51721 0.259052 5.06204 0.715671 3.70267 1.34331C0.960812 5.42136 0.21754 9.39811 0.589177 13.3184C2.40772 14.655 4.17011 15.467 5.90275 15.9984C6.33055 15.4189 6.71209 14.8028 7.04078 14.1536C6.41478 13.9195 5.81521 13.6306 5.24869 13.2952C5.39898 13.1856 5.546 13.071 5.68803 12.9531C9.14342 14.5438 12.8978 14.5438 16.3119 12.9531C16.4556 13.071 16.6026 13.1856 16.7512 13.2952C16.183 13.6322 15.5818 13.9211 14.9558 14.1553C15.2845 14.8028 15.6644 15.4205 16.0939 16C17.8282 15.4687 19.5922 14.6567 21.4107 13.3184C21.8468 8.77378 20.6658 4.83355 18.289 1.34ZM7.51153 10.9075C6.47426 10.9075 5.62361 9.95435 5.62361 8.7937C5.62361 7.63305 6.45609 6.67831 7.51153 6.67831C8.56699 6.67831 9.41761 7.63138 9.39945 8.7937C9.40109 9.95435 8.56699 10.9075 7.51153 10.9075ZM14.4884 10.9075C13.4511 10.9075 12.6005 9.95435 12.6005 8.7937C12.6005 7.63305 13.4329 6.67831 14.4884 6.67831C15.5438 6.67831 16.3945 7.63138 16.3763 8.7937C16.3763 9.95435 15.5438 10.9075 14.4884 10.9075Z"/>
                            </svg>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Main_GitHub_Button_1_ID" onclick="window.open('https://duolingopro.net/github', '_blank');" style="justify-content: center; flex: none; width: 40px; padding: 10px; outline: 2px solid rgba(255, 255, 255, 0.20); outline-offset: -2px; background: #333333;">
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.0087 0.5C5.19766 0.5 0.5 5.3125 0.5 11.2662C0.5 16.0253 3.50995 20.0538 7.68555 21.4797C8.2076 21.5868 8.39883 21.248 8.39883 20.963C8.39883 20.7134 8.38162 19.8578 8.38162 18.9664C5.45836 19.6082 4.84962 17.683 4.84962 17.683C4.37983 16.4353 3.68375 16.1146 3.68375 16.1146C2.72697 15.4551 3.75345 15.4551 3.75345 15.4551C4.81477 15.5264 5.37167 16.5602 5.37167 16.5602C6.31103 18.1999 7.82472 17.7366 8.43368 17.4514C8.52058 16.7562 8.79914 16.2749 9.09491 16.0076C6.7634 15.758 4.31035 14.8312 4.31035 10.6957C4.31035 9.51928 4.72765 8.55678 5.38888 7.80822C5.28456 7.54091 4.9191 6.43556 5.49342 4.95616C5.49342 4.95616 6.38073 4.67091 8.38141 6.06128C9.23797 5.82561 10.1213 5.70573 11.0087 5.70472C11.896 5.70472 12.8005 5.82963 13.6358 6.06128C15.6367 4.67091 16.524 4.95616 16.524 4.95616C17.0983 6.43556 16.7326 7.54091 16.6283 7.80822C17.3069 8.55678 17.707 9.51928 17.707 10.6957C17.707 14.8312 15.254 15.7401 12.905 16.0076C13.2879 16.3463 13.6183 16.9878 13.6183 18.0039C13.6183 19.4477 13.6011 20.6064 13.6011 20.9627C13.6011 21.248 13.7926 21.5868 14.3144 21.4799C18.49 20.0536 21.5 16.0253 21.5 11.2662C21.5172 5.3125 16.8023 0.5 11.0087 0.5Z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="DLP_HStack_Auto_Top DLP_NoSelect">
                    <div class="DLP_HStack_4">
                        <p class="DLP_Text_Style_2">Duolingo</p>
                        <p class="DLP_Text_Style_2" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PRO 3.0</p>
                    </div>
                    <p class="DLP_Text_Style_1" style="margin-top: 2px; font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${versionName}</p>
                </div>
                <p id="DLP_Main_Warning_1_ID" class="DLP_Text_Style_1" style="transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); text-align: center; opacity: 0.5; display: none;"></p>
                <div class="DLP_VStack_8" id="DLP_Main_Inputs_1_Divider_1_ID" style="opacity: 0.5; pointer-events: none; transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);">
                    <div class="DLP_VStack_8" id="DLP_Get_XP_1_ID" style="flex: 1 0 0;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][8]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; opacity: 0.5; display: none;">XP</p>
                                <svg width="15" height="16" viewBox="0 0 15 16" fill="#007AFF" opacity="0.5" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.39844 11.3594C0.78125 11.3594 0.398438 11 0.398438 10.4297C0.398438 9.72656 0.867188 9.25 1.625 9.25H3.46875L4.07812 6.17969H2.40625C1.78906 6.17969 1.39844 5.80469 1.39844 5.24219C1.39844 4.53125 1.875 4.05469 2.63281 4.05469H4.5L5.07812 1.17188C5.21094 0.507812 5.58594 0.15625 6.26562 0.15625C6.88281 0.15625 7.26562 0.507812 7.26562 1.07031C7.26562 1.19531 7.24219 1.35938 7.22656 1.45312L6.70312 4.05469H9.61719L10.1953 1.17188C10.3281 0.507812 10.6953 0.15625 11.375 0.15625C11.9844 0.15625 12.3672 0.507812 12.3672 1.07031C12.3672 1.19531 12.3516 1.35938 12.3359 1.45312L11.8125 4.05469H13.5938C14.2109 4.05469 14.5938 4.4375 14.5938 4.99219C14.5938 5.70312 14.125 6.17969 13.3672 6.17969H11.3906L10.7812 9.25H12.5859C13.2031 9.25 13.5859 9.64062 13.5859 10.1953C13.5859 10.8984 13.1172 11.3594 12.3516 11.3594H10.3594L9.72656 14.5469C9.59375 15.2266 9.17969 15.5547 8.52344 15.5547C7.91406 15.5547 7.53906 15.2109 7.53906 14.6406C7.53906 14.5391 7.55469 14.375 7.57812 14.2656L8.15625 11.3594H5.25L4.61719 14.5469C4.48438 15.2266 4.0625 15.5547 3.42188 15.5547C2.8125 15.5547 2.42969 15.2109 2.42969 14.6406C2.42969 14.5391 2.44531 14.375 2.46875 14.2656L3.04688 11.3594H1.39844ZM5.67188 9.25H8.57812L9.19531 6.17969H6.28125L5.67188 9.25Z"/>
                                </svg>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][9]}</p>
                                <svg id="DLP_Inset_Icon_1_ID" display="" width="16" height="16" viewBox="0 0 16 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.25 15.0156C0.554688 15.0156 -0.0078125 14.4609 -0.0078125 13.7734C-0.0078125 13.4297 0.140625 13.1094 0.390625 12.8516L5.54688 7.85156L0.390625 2.85938C0.132812 2.60156 -0.0078125 2.28125 -0.0078125 1.94531C-0.0078125 1.25781 0.554688 0.703125 1.25 0.703125C1.59375 0.703125 1.875 0.820312 2.10938 1.05469L8.02344 6.83594C8.33594 7.14062 8.48438 7.46875 8.48438 7.85938C8.48438 8.24219 8.34375 8.5625 8.02344 8.88281L2.10938 14.6641C1.86719 14.8984 1.58594 15.0156 1.25 15.0156ZM8.22656 15.0156C7.53125 15.0156 6.96875 14.4609 6.96875 13.7734C6.96875 13.4297 7.11719 13.1094 7.375 12.8516L12.5234 7.85156L7.375 2.85938C7.10938 2.60156 6.96875 2.28125 6.96875 1.94531C6.96875 1.25781 7.53125 0.703125 8.22656 0.703125C8.57031 0.703125 8.85156 0.820312 9.09375 1.05469L15 6.83594C15.3203 7.14062 15.4609 7.46875 15.4688 7.85938C15.4688 8.24219 15.3203 8.5625 15.0078 8.88281L9.09375 14.6641C8.85156 14.8984 8.57031 15.0156 8.22656 15.0156Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 2.66406C8.03125 2.66406 7.4375 2.75 6.875 2.92188L6.07812 1.02344C6.89062 0.757812 7.75781 0.609375 8.64844 0.609375C9.53906 0.609375 10.3984 0.757812 11.2031 1.02344L10.4219 2.92188C9.85938 2.75781 9.26562 2.66406 8.64844 2.66406ZM14.1016 5.91406C13.5312 4.84375 12.6562 3.96875 11.5859 3.39844L12.375 1.50781C13.9297 2.30469 15.2031 3.57812 16 5.125L14.1016 5.91406ZM5.70312 3.39844C4.63281 3.97656 3.75781 4.85156 3.19531 5.92188L1.29688 5.125C2.09375 3.57812 3.36719 2.30469 4.91406 1.50781L5.70312 3.39844ZM14.8438 8.85938C14.8438 8.24219 14.7578 7.64844 14.5859 7.08594L16.4844 6.29688C16.7578 7.10156 16.8984 7.96875 16.8984 8.85938C16.8984 9.75 16.7578 10.6172 16.4844 11.4219L14.5938 10.6328C14.75 10.0703 14.8438 9.47656 14.8438 8.85938ZM2.46094 8.85938C2.46094 9.47656 2.54688 10.0703 2.71094 10.625L0.8125 11.4219C0.546875 10.6094 0.398438 9.75 0.398438 8.85938C0.398438 7.96875 0.546875 7.10938 0.8125 6.29688L2.71094 7.08594C2.54688 7.64844 2.46094 8.24219 2.46094 8.85938ZM11.5859 14.3125C12.6562 13.7422 13.5391 12.875 14.1094 11.8047L16 12.5938C15.2031 14.1406 13.9297 15.4141 12.375 16.2109L11.5859 14.3125ZM3.19531 11.8047C3.76562 12.8672 4.63281 13.7422 5.70312 14.3125L4.91406 16.2031C3.36719 15.4141 2.09375 14.1406 1.29688 12.5938L3.19531 11.8047ZM8.64844 15.0547C9.26562 15.0547 9.85938 14.9609 10.4141 14.7969L11.2109 16.6953C10.3984 16.9609 9.53906 17.1094 8.64844 17.1094C7.75781 17.1094 6.89062 16.9609 6.08594 16.6953L6.875 14.7969C7.4375 14.9609 8.03125 15.0547 8.64844 15.0547Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_4_ID" display="none" width="18" height="16" viewBox="0 0 18 16" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_GEMS_1_ID" style="flex: 1 0 0; align-self: stretch; opacity: 0.5;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][10]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; opacity: 0.5; display: none;">GEMS</p>
                                <svg width="15" height="16" viewBox="0 0 15 16" fill="#007AFF" opacity="0.5" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.39844 11.3594C0.78125 11.3594 0.398438 11 0.398438 10.4297C0.398438 9.72656 0.867188 9.25 1.625 9.25H3.46875L4.07812 6.17969H2.40625C1.78906 6.17969 1.39844 5.80469 1.39844 5.24219C1.39844 4.53125 1.875 4.05469 2.63281 4.05469H4.5L5.07812 1.17188C5.21094 0.507812 5.58594 0.15625 6.26562 0.15625C6.88281 0.15625 7.26562 0.507812 7.26562 1.07031C7.26562 1.19531 7.24219 1.35938 7.22656 1.45312L6.70312 4.05469H9.61719L10.1953 1.17188C10.3281 0.507812 10.6953 0.15625 11.375 0.15625C11.9844 0.15625 12.3672 0.507812 12.3672 1.07031C12.3672 1.19531 12.3516 1.35938 12.3359 1.45312L11.8125 4.05469H13.5938C14.2109 4.05469 14.5938 4.4375 14.5938 4.99219C14.5938 5.70312 14.125 6.17969 13.3672 6.17969H11.3906L10.7812 9.25H12.5859C13.2031 9.25 13.5859 9.64062 13.5859 10.1953C13.5859 10.8984 13.1172 11.3594 12.3516 11.3594H10.3594L9.72656 14.5469C9.59375 15.2266 9.17969 15.5547 8.52344 15.5547C7.91406 15.5547 7.53906 15.2109 7.53906 14.6406C7.53906 14.5391 7.55469 14.375 7.57812 14.2656L8.15625 11.3594H5.25L4.61719 14.5469C4.48438 15.2266 4.0625 15.5547 3.42188 15.5547C2.8125 15.5547 2.42969 15.2109 2.42969 14.6406C2.42969 14.5391 2.44531 14.375 2.46875 14.2656L3.04688 11.3594H1.39844ZM5.67188 9.25H8.57812L9.19531 6.17969H6.28125L5.67188 9.25Z"/>
                                </svg>
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; flex: 1 0 0; text-align: end;">0</p>
                                <input style="display: none;" type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][9]}</p>
                                <svg id="DLP_Inset_Icon_1_ID" display="" width="16" height="16" viewBox="0 0 16 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.25 15.0156C0.554688 15.0156 -0.0078125 14.4609 -0.0078125 13.7734C-0.0078125 13.4297 0.140625 13.1094 0.390625 12.8516L5.54688 7.85156L0.390625 2.85938C0.132812 2.60156 -0.0078125 2.28125 -0.0078125 1.94531C-0.0078125 1.25781 0.554688 0.703125 1.25 0.703125C1.59375 0.703125 1.875 0.820312 2.10938 1.05469L8.02344 6.83594C8.33594 7.14062 8.48438 7.46875 8.48438 7.85938C8.48438 8.24219 8.34375 8.5625 8.02344 8.88281L2.10938 14.6641C1.86719 14.8984 1.58594 15.0156 1.25 15.0156ZM8.22656 15.0156C7.53125 15.0156 6.96875 14.4609 6.96875 13.7734C6.96875 13.4297 7.11719 13.1094 7.375 12.8516L12.5234 7.85156L7.375 2.85938C7.10938 2.60156 6.96875 2.28125 6.96875 1.94531C6.96875 1.25781 7.53125 0.703125 8.22656 0.703125C8.57031 0.703125 8.85156 0.820312 9.09375 1.05469L15 6.83594C15.3203 7.14062 15.4609 7.46875 15.4688 7.85938C15.4688 8.24219 15.3203 8.5625 15.0078 8.88281L9.09375 14.6641C8.85156 14.8984 8.57031 15.0156 8.22656 15.0156Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 2.66406C8.03125 2.66406 7.4375 2.75 6.875 2.92188L6.07812 1.02344C6.89062 0.757812 7.75781 0.609375 8.64844 0.609375C9.53906 0.609375 10.3984 0.757812 11.2031 1.02344L10.4219 2.92188C9.85938 2.75781 9.26562 2.66406 8.64844 2.66406ZM14.1016 5.91406C13.5312 4.84375 12.6562 3.96875 11.5859 3.39844L12.375 1.50781C13.9297 2.30469 15.2031 3.57812 16 5.125L14.1016 5.91406ZM5.70312 3.39844C4.63281 3.97656 3.75781 4.85156 3.19531 5.92188L1.29688 5.125C2.09375 3.57812 3.36719 2.30469 4.91406 1.50781L5.70312 3.39844ZM14.8438 8.85938C14.8438 8.24219 14.7578 7.64844 14.5859 7.08594L16.4844 6.29688C16.7578 7.10156 16.8984 7.96875 16.8984 8.85938C16.8984 9.75 16.7578 10.6172 16.4844 11.4219L14.5938 10.6328C14.75 10.0703 14.8438 9.47656 14.8438 8.85938ZM2.46094 8.85938C2.46094 9.47656 2.54688 10.0703 2.71094 10.625L0.8125 11.4219C0.546875 10.6094 0.398438 9.75 0.398438 8.85938C0.398438 7.96875 0.546875 7.10938 0.8125 6.29688L2.71094 7.08594C2.54688 7.64844 2.46094 8.24219 2.46094 8.85938ZM11.5859 14.3125C12.6562 13.7422 13.5391 12.875 14.1094 11.8047L16 12.5938C15.2031 14.1406 13.9297 15.4141 12.375 16.2109L11.5859 14.3125ZM3.19531 11.8047C3.76562 12.8672 4.63281 13.7422 5.70312 14.3125L4.91406 16.2031C3.36719 15.4141 2.09375 14.1406 1.29688 12.5938L3.19531 11.8047ZM8.64844 15.0547C9.26562 15.0547 9.85938 14.9609 10.4141 14.7969L11.2109 16.6953C10.3984 16.9609 9.53906 17.1094 8.64844 17.1094C7.75781 17.1094 6.89062 16.9609 6.08594 16.6953L6.875 14.7969C7.4375 14.9609 8.03125 15.0547 8.64844 15.0547Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_4_ID" display="none" width="18" height="16" viewBox="0 0 18 16" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_SUPER_1_ID" style="display: none;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][12]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID" style="flex: 1 0 0;">
                                <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][13]}</p>
                                <svg id="DLP_Inset_Icon_1_ID" display="" width="16" height="16" viewBox="0 0 16 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.25 15.0156C0.554688 15.0156 -0.0078125 14.4609 -0.0078125 13.7734C-0.0078125 13.4297 0.140625 13.1094 0.390625 12.8516L5.54688 7.85156L0.390625 2.85938C0.132812 2.60156 -0.0078125 2.28125 -0.0078125 1.94531C-0.0078125 1.25781 0.554688 0.703125 1.25 0.703125C1.59375 0.703125 1.875 0.820312 2.10938 1.05469L8.02344 6.83594C8.33594 7.14062 8.48438 7.46875 8.48438 7.85938C8.48438 8.24219 8.34375 8.5625 8.02344 8.88281L2.10938 14.6641C1.86719 14.8984 1.58594 15.0156 1.25 15.0156ZM8.22656 15.0156C7.53125 15.0156 6.96875 14.4609 6.96875 13.7734C6.96875 13.4297 7.11719 13.1094 7.375 12.8516L12.5234 7.85156L7.375 2.85938C7.10938 2.60156 6.96875 2.28125 6.96875 1.94531C6.96875 1.25781 7.53125 0.703125 8.22656 0.703125C8.57031 0.703125 8.85156 0.820312 9.09375 1.05469L15 6.83594C15.3203 7.14062 15.4609 7.46875 15.4688 7.85938C15.4688 8.24219 15.3203 8.5625 15.0078 8.88281L9.09375 14.6641C8.85156 14.8984 8.57031 15.0156 8.22656 15.0156Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 2.66406C8.03125 2.66406 7.4375 2.75 6.875 2.92188L6.07812 1.02344C6.89062 0.757812 7.75781 0.609375 8.64844 0.609375C9.53906 0.609375 10.3984 0.757812 11.2031 1.02344L10.4219 2.92188C9.85938 2.75781 9.26562 2.66406 8.64844 2.66406ZM14.1016 5.91406C13.5312 4.84375 12.6562 3.96875 11.5859 3.39844L12.375 1.50781C13.9297 2.30469 15.2031 3.57812 16 5.125L14.1016 5.91406ZM5.70312 3.39844C4.63281 3.97656 3.75781 4.85156 3.19531 5.92188L1.29688 5.125C2.09375 3.57812 3.36719 2.30469 4.91406 1.50781L5.70312 3.39844ZM14.8438 8.85938C14.8438 8.24219 14.7578 7.64844 14.5859 7.08594L16.4844 6.29688C16.7578 7.10156 16.8984 7.96875 16.8984 8.85938C16.8984 9.75 16.7578 10.6172 16.4844 11.4219L14.5938 10.6328C14.75 10.0703 14.8438 9.47656 14.8438 8.85938ZM2.46094 8.85938C2.46094 9.47656 2.54688 10.0703 2.71094 10.625L0.8125 11.4219C0.546875 10.6094 0.398438 9.75 0.398438 8.85938C0.398438 7.96875 0.546875 7.10938 0.8125 6.29688L2.71094 7.08594C2.54688 7.64844 2.46094 8.24219 2.46094 8.85938ZM11.5859 14.3125C12.6562 13.7422 13.5391 12.875 14.1094 11.8047L16 12.5938C15.2031 14.1406 13.9297 15.4141 12.375 16.2109L11.5859 14.3125ZM3.19531 11.8047C3.76562 12.8672 4.63281 13.7422 5.70312 14.3125L4.91406 16.2031C3.36719 15.4141 2.09375 14.1406 1.29688 12.5938L3.19531 11.8047ZM8.64844 15.0547C9.26562 15.0547 9.85938 14.9609 10.4141 14.7969L11.2109 16.6953C10.3984 16.9609 9.53906 17.1094 8.64844 17.1094C7.75781 17.1094 6.89062 16.9609 6.08594 16.6953L6.875 14.7969C7.4375 14.9609 8.03125 15.0547 8.64844 15.0547Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_4_ID" display="none" width="18" height="16" viewBox="0 0 18 16" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_DOUBLE_XP_BOOST_1_ID" style="display: none;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">Would you like to redeem an XP Boost?</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID" style="flex: 1 0 0;">
                                <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][13]}</p>
                                <svg id="DLP_Inset_Icon_1_ID" display="" width="16" height="16" viewBox="0 0 16 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.25 15.0156C0.554688 15.0156 -0.0078125 14.4609 -0.0078125 13.7734C-0.0078125 13.4297 0.140625 13.1094 0.390625 12.8516L5.54688 7.85156L0.390625 2.85938C0.132812 2.60156 -0.0078125 2.28125 -0.0078125 1.94531C-0.0078125 1.25781 0.554688 0.703125 1.25 0.703125C1.59375 0.703125 1.875 0.820312 2.10938 1.05469L8.02344 6.83594C8.33594 7.14062 8.48438 7.46875 8.48438 7.85938C8.48438 8.24219 8.34375 8.5625 8.02344 8.88281L2.10938 14.6641C1.86719 14.8984 1.58594 15.0156 1.25 15.0156ZM8.22656 15.0156C7.53125 15.0156 6.96875 14.4609 6.96875 13.7734C6.96875 13.4297 7.11719 13.1094 7.375 12.8516L12.5234 7.85156L7.375 2.85938C7.10938 2.60156 6.96875 2.28125 6.96875 1.94531C6.96875 1.25781 7.53125 0.703125 8.22656 0.703125C8.57031 0.703125 8.85156 0.820312 9.09375 1.05469L15 6.83594C15.3203 7.14062 15.4609 7.46875 15.4688 7.85938C15.4688 8.24219 15.3203 8.5625 15.0078 8.88281L9.09375 14.6641C8.85156 14.8984 8.57031 15.0156 8.22656 15.0156Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 2.66406C8.03125 2.66406 7.4375 2.75 6.875 2.92188L6.07812 1.02344C6.89062 0.757812 7.75781 0.609375 8.64844 0.609375C9.53906 0.609375 10.3984 0.757812 11.2031 1.02344L10.4219 2.92188C9.85938 2.75781 9.26562 2.66406 8.64844 2.66406ZM14.1016 5.91406C13.5312 4.84375 12.6562 3.96875 11.5859 3.39844L12.375 1.50781C13.9297 2.30469 15.2031 3.57812 16 5.125L14.1016 5.91406ZM5.70312 3.39844C4.63281 3.97656 3.75781 4.85156 3.19531 5.92188L1.29688 5.125C2.09375 3.57812 3.36719 2.30469 4.91406 1.50781L5.70312 3.39844ZM14.8438 8.85938C14.8438 8.24219 14.7578 7.64844 14.5859 7.08594L16.4844 6.29688C16.7578 7.10156 16.8984 7.96875 16.8984 8.85938C16.8984 9.75 16.7578 10.6172 16.4844 11.4219L14.5938 10.6328C14.75 10.0703 14.8438 9.47656 14.8438 8.85938ZM2.46094 8.85938C2.46094 9.47656 2.54688 10.0703 2.71094 10.625L0.8125 11.4219C0.546875 10.6094 0.398438 9.75 0.398438 8.85938C0.398438 7.96875 0.546875 7.10938 0.8125 6.29688L2.71094 7.08594C2.54688 7.64844 2.46094 8.24219 2.46094 8.85938ZM11.5859 14.3125C12.6562 13.7422 13.5391 12.875 14.1094 11.8047L16 12.5938C15.2031 14.1406 13.9297 15.4141 12.375 16.2109L11.5859 14.3125ZM3.19531 11.8047C3.76562 12.8672 4.63281 13.7422 5.70312 14.3125L4.91406 16.2031C3.36719 15.4141 2.09375 14.1406 1.29688 12.5938L3.19531 11.8047ZM8.64844 15.0547C9.26562 15.0547 9.85938 14.9609 10.4141 14.7969L11.2109 16.6953C10.3984 16.9609 9.53906 17.1094 8.64844 17.1094C7.75781 17.1094 6.89062 16.9609 6.08594 16.6953L6.875 14.7969C7.4375 14.9609 8.03125 15.0547 8.64844 15.0547Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_4_ID" display="none" width="18" height="16" viewBox="0 0 18 16" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_Streak_Freeze_1_ID" style="display: none;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">How many Streak Freezes would you like to get?</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; opacity: 0.5; display: none;">XP</p>
                                <svg width="15" height="16" viewBox="0 0 15 16" fill="#007AFF" opacity="0.5" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.39844 11.3594C0.78125 11.3594 0.398438 11 0.398438 10.4297C0.398438 9.72656 0.867188 9.25 1.625 9.25H3.46875L4.07812 6.17969H2.40625C1.78906 6.17969 1.39844 5.80469 1.39844 5.24219C1.39844 4.53125 1.875 4.05469 2.63281 4.05469H4.5L5.07812 1.17188C5.21094 0.507812 5.58594 0.15625 6.26562 0.15625C6.88281 0.15625 7.26562 0.507812 7.26562 1.07031C7.26562 1.19531 7.24219 1.35938 7.22656 1.45312L6.70312 4.05469H9.61719L10.1953 1.17188C10.3281 0.507812 10.6953 0.15625 11.375 0.15625C11.9844 0.15625 12.3672 0.507812 12.3672 1.07031C12.3672 1.19531 12.3516 1.35938 12.3359 1.45312L11.8125 4.05469H13.5938C14.2109 4.05469 14.5938 4.4375 14.5938 4.99219C14.5938 5.70312 14.125 6.17969 13.3672 6.17969H11.3906L10.7812 9.25H12.5859C13.2031 9.25 13.5859 9.64062 13.5859 10.1953C13.5859 10.8984 13.1172 11.3594 12.3516 11.3594H10.3594L9.72656 14.5469C9.59375 15.2266 9.17969 15.5547 8.52344 15.5547C7.91406 15.5547 7.53906 15.2109 7.53906 14.6406C7.53906 14.5391 7.55469 14.375 7.57812 14.2656L8.15625 11.3594H5.25L4.61719 14.5469C4.48438 15.2266 4.0625 15.5547 3.42188 15.5547C2.8125 15.5547 2.42969 15.2109 2.42969 14.6406C2.42969 14.5391 2.44531 14.375 2.46875 14.2656L3.04688 11.3594H1.39844ZM5.67188 9.25H8.57812L9.19531 6.17969H6.28125L5.67188 9.25Z"/>
                                </svg>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][9]}</p>
                                <svg id="DLP_Inset_Icon_1_ID" display="" width="16" height="16" viewBox="0 0 16 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.25 15.0156C0.554688 15.0156 -0.0078125 14.4609 -0.0078125 13.7734C-0.0078125 13.4297 0.140625 13.1094 0.390625 12.8516L5.54688 7.85156L0.390625 2.85938C0.132812 2.60156 -0.0078125 2.28125 -0.0078125 1.94531C-0.0078125 1.25781 0.554688 0.703125 1.25 0.703125C1.59375 0.703125 1.875 0.820312 2.10938 1.05469L8.02344 6.83594C8.33594 7.14062 8.48438 7.46875 8.48438 7.85938C8.48438 8.24219 8.34375 8.5625 8.02344 8.88281L2.10938 14.6641C1.86719 14.8984 1.58594 15.0156 1.25 15.0156ZM8.22656 15.0156C7.53125 15.0156 6.96875 14.4609 6.96875 13.7734C6.96875 13.4297 7.11719 13.1094 7.375 12.8516L12.5234 7.85156L7.375 2.85938C7.10938 2.60156 6.96875 2.28125 6.96875 1.94531C6.96875 1.25781 7.53125 0.703125 8.22656 0.703125C8.57031 0.703125 8.85156 0.820312 9.09375 1.05469L15 6.83594C15.3203 7.14062 15.4609 7.46875 15.4688 7.85938C15.4688 8.24219 15.3203 8.5625 15.0078 8.88281L9.09375 14.6641C8.85156 14.8984 8.57031 15.0156 8.22656 15.0156Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 2.66406C8.03125 2.66406 7.4375 2.75 6.875 2.92188L6.07812 1.02344C6.89062 0.757812 7.75781 0.609375 8.64844 0.609375C9.53906 0.609375 10.3984 0.757812 11.2031 1.02344L10.4219 2.92188C9.85938 2.75781 9.26562 2.66406 8.64844 2.66406ZM14.1016 5.91406C13.5312 4.84375 12.6562 3.96875 11.5859 3.39844L12.375 1.50781C13.9297 2.30469 15.2031 3.57812 16 5.125L14.1016 5.91406ZM5.70312 3.39844C4.63281 3.97656 3.75781 4.85156 3.19531 5.92188L1.29688 5.125C2.09375 3.57812 3.36719 2.30469 4.91406 1.50781L5.70312 3.39844ZM14.8438 8.85938C14.8438 8.24219 14.7578 7.64844 14.5859 7.08594L16.4844 6.29688C16.7578 7.10156 16.8984 7.96875 16.8984 8.85938C16.8984 9.75 16.7578 10.6172 16.4844 11.4219L14.5938 10.6328C14.75 10.0703 14.8438 9.47656 14.8438 8.85938ZM2.46094 8.85938C2.46094 9.47656 2.54688 10.0703 2.71094 10.625L0.8125 11.4219C0.546875 10.6094 0.398438 9.75 0.398438 8.85938C0.398438 7.96875 0.546875 7.10938 0.8125 6.29688L2.71094 7.08594C2.54688 7.64844 2.46094 8.24219 2.46094 8.85938ZM11.5859 14.3125C12.6562 13.7422 13.5391 12.875 14.1094 11.8047L16 12.5938C15.2031 14.1406 13.9297 15.4141 12.375 16.2109L11.5859 14.3125ZM3.19531 11.8047C3.76562 12.8672 4.63281 13.7422 5.70312 14.3125L4.91406 16.2031C3.36719 15.4141 2.09375 14.1406 1.29688 12.5938L3.19531 11.8047ZM8.64844 15.0547C9.26562 15.0547 9.85938 14.9609 10.4141 14.7969L11.2109 16.6953C10.3984 16.9609 9.53906 17.1094 8.64844 17.1094C7.75781 17.1094 6.89062 16.9609 6.08594 16.6953L6.875 14.7969C7.4375 14.9609 8.03125 15.0547 8.64844 15.0547Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_4_ID" display="none" width="18" height="16" viewBox="0 0 18 16" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_Streak_1_ID" style="display: none;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">How many days would you like to increase your Streak by?</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; opacity: 0.5; display: none;">GEMS</p>
                                <svg width="15" height="16" viewBox="0 0 15 16" fill="#007AFF" opacity="0.5" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.39844 11.3594C0.78125 11.3594 0.398438 11 0.398438 10.4297C0.398438 9.72656 0.867188 9.25 1.625 9.25H3.46875L4.07812 6.17969H2.40625C1.78906 6.17969 1.39844 5.80469 1.39844 5.24219C1.39844 4.53125 1.875 4.05469 2.63281 4.05469H4.5L5.07812 1.17188C5.21094 0.507812 5.58594 0.15625 6.26562 0.15625C6.88281 0.15625 7.26562 0.507812 7.26562 1.07031C7.26562 1.19531 7.24219 1.35938 7.22656 1.45312L6.70312 4.05469H9.61719L10.1953 1.17188C10.3281 0.507812 10.6953 0.15625 11.375 0.15625C11.9844 0.15625 12.3672 0.507812 12.3672 1.07031C12.3672 1.19531 12.3516 1.35938 12.3359 1.45312L11.8125 4.05469H13.5938C14.2109 4.05469 14.5938 4.4375 14.5938 4.99219C14.5938 5.70312 14.125 6.17969 13.3672 6.17969H11.3906L10.7812 9.25H12.5859C13.2031 9.25 13.5859 9.64062 13.5859 10.1953C13.5859 10.8984 13.1172 11.3594 12.3516 11.3594H10.3594L9.72656 14.5469C9.59375 15.2266 9.17969 15.5547 8.52344 15.5547C7.91406 15.5547 7.53906 15.2109 7.53906 14.6406C7.53906 14.5391 7.55469 14.375 7.57812 14.2656L8.15625 11.3594H5.25L4.61719 14.5469C4.48438 15.2266 4.0625 15.5547 3.42188 15.5547C2.8125 15.5547 2.42969 15.2109 2.42969 14.6406C2.42969 14.5391 2.44531 14.375 2.46875 14.2656L3.04688 11.3594H1.39844ZM5.67188 9.25H8.57812L9.19531 6.17969H6.28125L5.67188 9.25Z"/>
                                </svg>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">GET</p>
                                <svg id="DLP_Inset_Icon_1_ID" display="" width="16" height="16" viewBox="0 0 16 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.25 15.0156C0.554688 15.0156 -0.0078125 14.4609 -0.0078125 13.7734C-0.0078125 13.4297 0.140625 13.1094 0.390625 12.8516L5.54688 7.85156L0.390625 2.85938C0.132812 2.60156 -0.0078125 2.28125 -0.0078125 1.94531C-0.0078125 1.25781 0.554688 0.703125 1.25 0.703125C1.59375 0.703125 1.875 0.820312 2.10938 1.05469L8.02344 6.83594C8.33594 7.14062 8.48438 7.46875 8.48438 7.85938C8.48438 8.24219 8.34375 8.5625 8.02344 8.88281L2.10938 14.6641C1.86719 14.8984 1.58594 15.0156 1.25 15.0156ZM8.22656 15.0156C7.53125 15.0156 6.96875 14.4609 6.96875 13.7734C6.96875 13.4297 7.11719 13.1094 7.375 12.8516L12.5234 7.85156L7.375 2.85938C7.10938 2.60156 6.96875 2.28125 6.96875 1.94531C6.96875 1.25781 7.53125 0.703125 8.22656 0.703125C8.57031 0.703125 8.85156 0.820312 9.09375 1.05469L15 6.83594C15.3203 7.14062 15.4609 7.46875 15.4688 7.85938C15.4688 8.24219 15.3203 8.5625 15.0078 8.88281L9.09375 14.6641C8.85156 14.8984 8.57031 15.0156 8.22656 15.0156Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 2.66406C8.03125 2.66406 7.4375 2.75 6.875 2.92188L6.07812 1.02344C6.89062 0.757812 7.75781 0.609375 8.64844 0.609375C9.53906 0.609375 10.3984 0.757812 11.2031 1.02344L10.4219 2.92188C9.85938 2.75781 9.26562 2.66406 8.64844 2.66406ZM14.1016 5.91406C13.5312 4.84375 12.6562 3.96875 11.5859 3.39844L12.375 1.50781C13.9297 2.30469 15.2031 3.57812 16 5.125L14.1016 5.91406ZM5.70312 3.39844C4.63281 3.97656 3.75781 4.85156 3.19531 5.92188L1.29688 5.125C2.09375 3.57812 3.36719 2.30469 4.91406 1.50781L5.70312 3.39844ZM14.8438 8.85938C14.8438 8.24219 14.7578 7.64844 14.5859 7.08594L16.4844 6.29688C16.7578 7.10156 16.8984 7.96875 16.8984 8.85938C16.8984 9.75 16.7578 10.6172 16.4844 11.4219L14.5938 10.6328C14.75 10.0703 14.8438 9.47656 14.8438 8.85938ZM2.46094 8.85938C2.46094 9.47656 2.54688 10.0703 2.71094 10.625L0.8125 11.4219C0.546875 10.6094 0.398438 9.75 0.398438 8.85938C0.398438 7.96875 0.546875 7.10938 0.8125 6.29688L2.71094 7.08594C2.54688 7.64844 2.46094 8.24219 2.46094 8.85938ZM11.5859 14.3125C12.6562 13.7422 13.5391 12.875 14.1094 11.8047L16 12.5938C15.2031 14.1406 13.9297 15.4141 12.375 16.2109L11.5859 14.3125ZM3.19531 11.8047C3.76562 12.8672 4.63281 13.7422 5.70312 14.3125L4.91406 16.2031C3.36719 15.4141 2.09375 14.1406 1.29688 12.5938L3.19531 11.8047ZM8.64844 15.0547C9.26562 15.0547 9.85938 14.9609 10.4141 14.7969L11.2109 16.6953C10.3984 16.9609 9.53906 17.1094 8.64844 17.1094C7.75781 17.1094 6.89062 16.9609 6.08594 16.6953L6.875 14.7969C7.4375 14.9609 8.03125 15.0547 8.64844 15.0547Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_4_ID" display="none" width="18" height="16" viewBox="0 0 18 16" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_Heart_Refill_1_ID" style="display: none;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">Would you like to refill your Hearts to full?</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID" style="flex: 1 0 0;">
                                <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">REFILL</p>
                                <svg id="DLP_Inset_Icon_1_ID" display="" width="16" height="16" viewBox="0 0 16 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.25 15.0156C0.554688 15.0156 -0.0078125 14.4609 -0.0078125 13.7734C-0.0078125 13.4297 0.140625 13.1094 0.390625 12.8516L5.54688 7.85156L0.390625 2.85938C0.132812 2.60156 -0.0078125 2.28125 -0.0078125 1.94531C-0.0078125 1.25781 0.554688 0.703125 1.25 0.703125C1.59375 0.703125 1.875 0.820312 2.10938 1.05469L8.02344 6.83594C8.33594 7.14062 8.48438 7.46875 8.48438 7.85938C8.48438 8.24219 8.34375 8.5625 8.02344 8.88281L2.10938 14.6641C1.86719 14.8984 1.58594 15.0156 1.25 15.0156ZM8.22656 15.0156C7.53125 15.0156 6.96875 14.4609 6.96875 13.7734C6.96875 13.4297 7.11719 13.1094 7.375 12.8516L12.5234 7.85156L7.375 2.85938C7.10938 2.60156 6.96875 2.28125 6.96875 1.94531C6.96875 1.25781 7.53125 0.703125 8.22656 0.703125C8.57031 0.703125 8.85156 0.820312 9.09375 1.05469L15 6.83594C15.3203 7.14062 15.4609 7.46875 15.4688 7.85938C15.4688 8.24219 15.3203 8.5625 15.0078 8.88281L9.09375 14.6641C8.85156 14.8984 8.57031 15.0156 8.22656 15.0156Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 2.66406C8.03125 2.66406 7.4375 2.75 6.875 2.92188L6.07812 1.02344C6.89062 0.757812 7.75781 0.609375 8.64844 0.609375C9.53906 0.609375 10.3984 0.757812 11.2031 1.02344L10.4219 2.92188C9.85938 2.75781 9.26562 2.66406 8.64844 2.66406ZM14.1016 5.91406C13.5312 4.84375 12.6562 3.96875 11.5859 3.39844L12.375 1.50781C13.9297 2.30469 15.2031 3.57812 16 5.125L14.1016 5.91406ZM5.70312 3.39844C4.63281 3.97656 3.75781 4.85156 3.19531 5.92188L1.29688 5.125C2.09375 3.57812 3.36719 2.30469 4.91406 1.50781L5.70312 3.39844ZM14.8438 8.85938C14.8438 8.24219 14.7578 7.64844 14.5859 7.08594L16.4844 6.29688C16.7578 7.10156 16.8984 7.96875 16.8984 8.85938C16.8984 9.75 16.7578 10.6172 16.4844 11.4219L14.5938 10.6328C14.75 10.0703 14.8438 9.47656 14.8438 8.85938ZM2.46094 8.85938C2.46094 9.47656 2.54688 10.0703 2.71094 10.625L0.8125 11.4219C0.546875 10.6094 0.398438 9.75 0.398438 8.85938C0.398438 7.96875 0.546875 7.10938 0.8125 6.29688L2.71094 7.08594C2.54688 7.64844 2.46094 8.24219 2.46094 8.85938ZM11.5859 14.3125C12.6562 13.7422 13.5391 12.875 14.1094 11.8047L16 12.5938C15.2031 14.1406 13.9297 15.4141 12.375 16.2109L11.5859 14.3125ZM3.19531 11.8047C3.76562 12.8672 4.63281 13.7422 5.70312 14.3125L4.91406 16.2031C3.36719 15.4141 2.09375 14.1406 1.29688 12.5938L3.19531 11.8047ZM8.64844 15.0547C9.26562 15.0547 9.85938 14.9609 10.4141 14.7969L11.2109 16.6953C10.3984 16.9609 9.53906 17.1094 8.64844 17.1094C7.75781 17.1094 6.89062 16.9609 6.08594 16.6953L6.875 14.7969C7.4375 14.9609 8.03125 15.0547 8.64844 15.0547Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_4_ID" display="none" width="18" height="16" viewBox="0 0 18 16" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Main_See_More_1_Button_1_ID" style="outline: rgba(0, 122, 255, 0.2) solid 2px; outline-offset: -2px; background: linear-gradient(0deg, rgba(0, 122, 255, 0.10) 0%, rgba(0, 122, 255, 0.10) 100%), rgba(var(--color-snow), 0.80); backdrop-filter: blur(16px); transform: translate(0px, 0px) scale(1); align-self: stretch; justify-content: space-between;">
                        <p class="DLP_Text_Style_1" style="color: #007AFF;">${systemText[systemLanguage][15]}</p>
                        <svg width="9" height="16" viewBox="0 0 9 16" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.57031 7.85938C8.57031 8.24219 8.4375 8.5625 8.10938 8.875L2.20312 14.6641C1.96875 14.8984 1.67969 15.0156 1.33594 15.0156C0.648438 15.0156 0.0859375 14.4609 0.0859375 13.7734C0.0859375 13.4219 0.226562 13.1094 0.484375 12.8516L5.63281 7.85156L0.484375 2.85938C0.226562 2.60938 0.0859375 2.28906 0.0859375 1.94531C0.0859375 1.26562 0.648438 0.703125 1.33594 0.703125C1.67969 0.703125 1.96875 0.820312 2.20312 1.05469L8.10938 6.84375C8.42969 7.14844 8.57031 7.46875 8.57031 7.85938Z"/>
                        </svg>
                    </div>
                </div>
                <div class="DLP_HStack_Auto" style="padding-top: 4px;">
                    <div class="DLP_HStack_4 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Main_Terms_1_Button_1_ID" style="align-items: center;">
                        <p class="DLP_Text_Style_1" style="color: #007AFF; opacity: 0.5;">${systemText[systemLanguage][14]}</p>
                    </div>
                    <div class="DLP_HStack_4 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Main_Whats_New_1_Button_1_ID" style="align-items: center;">
                        <p class="DLP_Text_Style_1" style="color: #007AFF;">${systemText[systemLanguage][7]}</p>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_2_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_HStack_Auto_Top DLP_NoSelect">
                    <div class="DLP_HStack_4" id="DLP_Universal_Back_1_Button_1_ID">
                        <svg class="DLP_Magnetic_Hover_1" width="11" height="19" fill="rgb(var(--color-black-text))" viewBox="0 0 11 19" xmlns="http://www.w3.org/2000/svg" style="transform: translate(0px, 0px) scale(1); z-index: 0;">
                            <path d="M0.171875 9.44922C0.181641 9.04883 0.318359 8.7168 0.640625 8.4043L8.16016 1.05078C8.4043 0.796875 8.70703 0.679688 9.07812 0.679688C9.81055 0.679688 10.3965 1.25586 10.3965 1.98828C10.3965 2.34961 10.25 2.68164 9.98633 2.94531L3.30664 9.43945L9.98633 15.9531C10.25 16.2168 10.3965 16.5391 10.3965 16.9102C10.3965 17.6426 9.81055 18.2285 9.07812 18.2285C8.7168 18.2285 8.4043 18.1016 8.16016 17.8477L0.640625 10.4941C0.318359 10.1816 0.171875 9.84961 0.171875 9.44922Z"/>
                        </svg>
                        <p class="DLP_Text_Style_2">Duolingo</p>
                        <p class="DLP_Text_Style_2" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PRO 3.0</p>
                    </div>
                    <p class="DLP_Text_Style_1" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${versionName}</p>
                </div>
                <div class="DLP_VStack_8" id="DLP_Main_Inputs_1_Divider_1_ID">
                    <div class="DLP_HStack_8">
                    <div class="DLP_VStack_8" id="DLP_Get_XP_2_ID" style="flex: 1 0 0;">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <svg id="DLP_Inset_Icon_1_ID" class="DLP_Magnetic_Hover_1 DLP_NoSelect" width="13" height="20" viewBox="0 0 13 20" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.140625 12.25C0.140625 10.5156 1.50781 8.80469 3.73438 7.96875L3.98438 4.25781C2.77344 3.57812 1.875 2.85156 1.47656 2.35156C1.24219 2.05469 1.13281 1.74219 1.13281 1.46094C1.13281 0.875 1.57812 0.453125 2.22656 0.453125H10.7578C11.4062 0.453125 11.8516 0.875 11.8516 1.46094C11.8516 1.74219 11.7422 2.05469 11.5078 2.35156C11.1094 2.85156 10.2109 3.57031 9 4.25781L9.25781 7.96875C11.4766 8.80469 12.8438 10.5156 12.8438 12.25C12.8438 13.0312 12.3047 13.5547 11.5 13.5547H7.40625V17.3203C7.40625 18.2578 6.74219 19.5703 6.49219 19.5703C6.24219 19.5703 5.57812 18.2578 5.57812 17.3203V13.5547H1.48438C0.679688 13.5547 0.140625 13.0312 0.140625 12.25Z"/>
                            </svg>
                            <svg id="DLP_Inset_Icon_2_ID" class="DLP_Magnetic_Hover_1 DLP_NoSelect" width="13" height="20" viewBox="0 0 13 20" fill="rgb(var(--color-eel))" xmlns="http://www.w3.org/2000/svg" display="none">
                                <path opacity="0.5" d="M1.48438 13.5547C0.679688 13.5547 0.140625 13.0312 0.140625 12.25C0.140625 10.5156 1.50781 8.85156 3.55469 8.01562L3.80469 4.25781C2.77344 3.57031 1.86719 2.85156 1.47656 2.34375C1.24219 2.05469 1.13281 1.74219 1.13281 1.46094C1.13281 0.875 1.57812 0.453125 2.22656 0.453125H10.7578C11.4062 0.453125 11.8516 0.875 11.8516 1.46094C11.8516 1.74219 11.7422 2.05469 11.5078 2.34375C11.1172 2.85156 10.2188 3.57031 9.17969 4.25781L9.42969 8.01562C11.4766 8.85156 12.8438 10.5156 12.8438 12.25C12.8438 13.0312 12.3047 13.5547 11.5 13.5547H7.40625V17.3203C7.40625 18.2578 6.74219 19.5703 6.49219 19.5703C6.24219 19.5703 5.57812 18.2578 5.57812 17.3203V13.5547H1.48438ZM6.49219 7.44531C6.92969 7.44531 7.35156 7.47656 7.75781 7.54688L7.53125 3.55469C7.52344 3.38281 7.5625 3.29688 7.69531 3.21875C8.5625 2.76562 9.23438 2.28125 9.46094 2.07812C9.53125 2.00781 9.49219 1.92969 9.41406 1.92969H3.57812C3.5 1.92969 3.45312 2.00781 3.52344 2.07812C3.75 2.28125 4.42188 2.76562 5.28906 3.21875C5.42188 3.29688 5.46094 3.38281 5.45312 3.55469L5.22656 7.54688C5.63281 7.47656 6.05469 7.44531 6.49219 7.44531ZM1.92188 11.9844H11.0625C11.1797 11.9844 11.2344 11.9141 11.2109 11.7734C10.9922 10.3906 9.08594 8.96875 6.49219 8.96875C3.89844 8.96875 1.99219 10.3906 1.77344 11.7734C1.75 11.9141 1.80469 11.9844 1.92188 11.9844Z"/>
                            </svg>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][8]}</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; opacity: 0.5; display: none;">XP</p>
                                <svg width="15" height="16" viewBox="0 0 15 16" fill="#007AFF" opacity="0.5" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.39844 11.3594C0.78125 11.3594 0.398438 11 0.398438 10.4297C0.398438 9.72656 0.867188 9.25 1.625 9.25H3.46875L4.07812 6.17969H2.40625C1.78906 6.17969 1.39844 5.80469 1.39844 5.24219C1.39844 4.53125 1.875 4.05469 2.63281 4.05469H4.5L5.07812 1.17188C5.21094 0.507812 5.58594 0.15625 6.26562 0.15625C6.88281 0.15625 7.26562 0.507812 7.26562 1.07031C7.26562 1.19531 7.24219 1.35938 7.22656 1.45312L6.70312 4.05469H9.61719L10.1953 1.17188C10.3281 0.507812 10.6953 0.15625 11.375 0.15625C11.9844 0.15625 12.3672 0.507812 12.3672 1.07031C12.3672 1.19531 12.3516 1.35938 12.3359 1.45312L11.8125 4.05469H13.5938C14.2109 4.05469 14.5938 4.4375 14.5938 4.99219C14.5938 5.70312 14.125 6.17969 13.3672 6.17969H11.3906L10.7812 9.25H12.5859C13.2031 9.25 13.5859 9.64062 13.5859 10.1953C13.5859 10.8984 13.1172 11.3594 12.3516 11.3594H10.3594L9.72656 14.5469C9.59375 15.2266 9.17969 15.5547 8.52344 15.5547C7.91406 15.5547 7.53906 15.2109 7.53906 14.6406C7.53906 14.5391 7.55469 14.375 7.57812 14.2656L8.15625 11.3594H5.25L4.61719 14.5469C4.48438 15.2266 4.0625 15.5547 3.42188 15.5547C2.8125 15.5547 2.42969 15.2109 2.42969 14.6406C2.42969 14.5391 2.44531 14.375 2.46875 14.2656L3.04688 11.3594H1.39844ZM5.67188 9.25H8.57812L9.19531 6.17969H6.28125L5.67188 9.25Z"/>
                                </svg>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][9]}</p>
                                <svg id="DLP_Inset_Icon_1_ID" display="" width="16" height="16" viewBox="0 0 16 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.25 15.0156C0.554688 15.0156 -0.0078125 14.4609 -0.0078125 13.7734C-0.0078125 13.4297 0.140625 13.1094 0.390625 12.8516L5.54688 7.85156L0.390625 2.85938C0.132812 2.60156 -0.0078125 2.28125 -0.0078125 1.94531C-0.0078125 1.25781 0.554688 0.703125 1.25 0.703125C1.59375 0.703125 1.875 0.820312 2.10938 1.05469L8.02344 6.83594C8.33594 7.14062 8.48438 7.46875 8.48438 7.85938C8.48438 8.24219 8.34375 8.5625 8.02344 8.88281L2.10938 14.6641C1.86719 14.8984 1.58594 15.0156 1.25 15.0156ZM8.22656 15.0156C7.53125 15.0156 6.96875 14.4609 6.96875 13.7734C6.96875 13.4297 7.11719 13.1094 7.375 12.8516L12.5234 7.85156L7.375 2.85938C7.10938 2.60156 6.96875 2.28125 6.96875 1.94531C6.96875 1.25781 7.53125 0.703125 8.22656 0.703125C8.57031 0.703125 8.85156 0.820312 9.09375 1.05469L15 6.83594C15.3203 7.14062 15.4609 7.46875 15.4688 7.85938C15.4688 8.24219 15.3203 8.5625 15.0078 8.88281L9.09375 14.6641C8.85156 14.8984 8.57031 15.0156 8.22656 15.0156Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 2.66406C8.03125 2.66406 7.4375 2.75 6.875 2.92188L6.07812 1.02344C6.89062 0.757812 7.75781 0.609375 8.64844 0.609375C9.53906 0.609375 10.3984 0.757812 11.2031 1.02344L10.4219 2.92188C9.85938 2.75781 9.26562 2.66406 8.64844 2.66406ZM14.1016 5.91406C13.5312 4.84375 12.6562 3.96875 11.5859 3.39844L12.375 1.50781C13.9297 2.30469 15.2031 3.57812 16 5.125L14.1016 5.91406ZM5.70312 3.39844C4.63281 3.97656 3.75781 4.85156 3.19531 5.92188L1.29688 5.125C2.09375 3.57812 3.36719 2.30469 4.91406 1.50781L5.70312 3.39844ZM14.8438 8.85938C14.8438 8.24219 14.7578 7.64844 14.5859 7.08594L16.4844 6.29688C16.7578 7.10156 16.8984 7.96875 16.8984 8.85938C16.8984 9.75 16.7578 10.6172 16.4844 11.4219L14.5938 10.6328C14.75 10.0703 14.8438 9.47656 14.8438 8.85938ZM2.46094 8.85938C2.46094 9.47656 2.54688 10.0703 2.71094 10.625L0.8125 11.4219C0.546875 10.6094 0.398438 9.75 0.398438 8.85938C0.398438 7.96875 0.546875 7.10938 0.8125 6.29688L2.71094 7.08594C2.54688 7.64844 2.46094 8.24219 2.46094 8.85938ZM11.5859 14.3125C12.6562 13.7422 13.5391 12.875 14.1094 11.8047L16 12.5938C15.2031 14.1406 13.9297 15.4141 12.375 16.2109L11.5859 14.3125ZM3.19531 11.8047C3.76562 12.8672 4.63281 13.7422 5.70312 14.3125L4.91406 16.2031C3.36719 15.4141 2.09375 14.1406 1.29688 12.5938L3.19531 11.8047ZM8.64844 15.0547C9.26562 15.0547 9.85938 14.9609 10.4141 14.7969L11.2109 16.6953C10.3984 16.9609 9.53906 17.1094 8.64844 17.1094C7.75781 17.1094 6.89062 16.9609 6.08594 16.6953L6.875 14.7969C7.4375 14.9609 8.03125 15.0547 8.64844 15.0547Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_4_ID" display="none" width="18" height="16" viewBox="0 0 18 16" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_GEMS_2_ID" style="flex: 1 0 0; align-self: stretch; opacity: 0.5;">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <svg id="DLP_Inset_Icon_1_ID" class="DLP_Magnetic_Hover_1 DLP_NoSelect" width="13" height="20" viewBox="0 0 13 20" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.140625 12.25C0.140625 10.5156 1.50781 8.80469 3.73438 7.96875L3.98438 4.25781C2.77344 3.57812 1.875 2.85156 1.47656 2.35156C1.24219 2.05469 1.13281 1.74219 1.13281 1.46094C1.13281 0.875 1.57812 0.453125 2.22656 0.453125H10.7578C11.4062 0.453125 11.8516 0.875 11.8516 1.46094C11.8516 1.74219 11.7422 2.05469 11.5078 2.35156C11.1094 2.85156 10.2109 3.57031 9 4.25781L9.25781 7.96875C11.4766 8.80469 12.8438 10.5156 12.8438 12.25C12.8438 13.0312 12.3047 13.5547 11.5 13.5547H7.40625V17.3203C7.40625 18.2578 6.74219 19.5703 6.49219 19.5703C6.24219 19.5703 5.57812 18.2578 5.57812 17.3203V13.5547H1.48438C0.679688 13.5547 0.140625 13.0312 0.140625 12.25Z"/>
                            </svg>
                            <svg id="DLP_Inset_Icon_2_ID" class="DLP_Magnetic_Hover_1 DLP_NoSelect" width="13" height="20" viewBox="0 0 13 20" fill="rgb(var(--color-eel))" xmlns="http://www.w3.org/2000/svg" display="none">
                                <path opacity="0.5" d="M1.48438 13.5547C0.679688 13.5547 0.140625 13.0312 0.140625 12.25C0.140625 10.5156 1.50781 8.85156 3.55469 8.01562L3.80469 4.25781C2.77344 3.57031 1.86719 2.85156 1.47656 2.34375C1.24219 2.05469 1.13281 1.74219 1.13281 1.46094C1.13281 0.875 1.57812 0.453125 2.22656 0.453125H10.7578C11.4062 0.453125 11.8516 0.875 11.8516 1.46094C11.8516 1.74219 11.7422 2.05469 11.5078 2.34375C11.1172 2.85156 10.2188 3.57031 9.17969 4.25781L9.42969 8.01562C11.4766 8.85156 12.8438 10.5156 12.8438 12.25C12.8438 13.0312 12.3047 13.5547 11.5 13.5547H7.40625V17.3203C7.40625 18.2578 6.74219 19.5703 6.49219 19.5703C6.24219 19.5703 5.57812 18.2578 5.57812 17.3203V13.5547H1.48438ZM6.49219 7.44531C6.92969 7.44531 7.35156 7.47656 7.75781 7.54688L7.53125 3.55469C7.52344 3.38281 7.5625 3.29688 7.69531 3.21875C8.5625 2.76562 9.23438 2.28125 9.46094 2.07812C9.53125 2.00781 9.49219 1.92969 9.41406 1.92969H3.57812C3.5 1.92969 3.45312 2.00781 3.52344 2.07812C3.75 2.28125 4.42188 2.76562 5.28906 3.21875C5.42188 3.29688 5.46094 3.38281 5.45312 3.55469L5.22656 7.54688C5.63281 7.47656 6.05469 7.44531 6.49219 7.44531ZM1.92188 11.9844H11.0625C11.1797 11.9844 11.2344 11.9141 11.2109 11.7734C10.9922 10.3906 9.08594 8.96875 6.49219 8.96875C3.89844 8.96875 1.99219 10.3906 1.77344 11.7734C1.75 11.9141 1.80469 11.9844 1.92188 11.9844Z"/>
                            </svg>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][10]}</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; opacity: 0.5; display: none;">GEMS</p>
                                <svg width="15" height="16" viewBox="0 0 15 16" fill="#007AFF" opacity="0.5" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.39844 11.3594C0.78125 11.3594 0.398438 11 0.398438 10.4297C0.398438 9.72656 0.867188 9.25 1.625 9.25H3.46875L4.07812 6.17969H2.40625C1.78906 6.17969 1.39844 5.80469 1.39844 5.24219C1.39844 4.53125 1.875 4.05469 2.63281 4.05469H4.5L5.07812 1.17188C5.21094 0.507812 5.58594 0.15625 6.26562 0.15625C6.88281 0.15625 7.26562 0.507812 7.26562 1.07031C7.26562 1.19531 7.24219 1.35938 7.22656 1.45312L6.70312 4.05469H9.61719L10.1953 1.17188C10.3281 0.507812 10.6953 0.15625 11.375 0.15625C11.9844 0.15625 12.3672 0.507812 12.3672 1.07031C12.3672 1.19531 12.3516 1.35938 12.3359 1.45312L11.8125 4.05469H13.5938C14.2109 4.05469 14.5938 4.4375 14.5938 4.99219C14.5938 5.70312 14.125 6.17969 13.3672 6.17969H11.3906L10.7812 9.25H12.5859C13.2031 9.25 13.5859 9.64062 13.5859 10.1953C13.5859 10.8984 13.1172 11.3594 12.3516 11.3594H10.3594L9.72656 14.5469C9.59375 15.2266 9.17969 15.5547 8.52344 15.5547C7.91406 15.5547 7.53906 15.2109 7.53906 14.6406C7.53906 14.5391 7.55469 14.375 7.57812 14.2656L8.15625 11.3594H5.25L4.61719 14.5469C4.48438 15.2266 4.0625 15.5547 3.42188 15.5547C2.8125 15.5547 2.42969 15.2109 2.42969 14.6406C2.42969 14.5391 2.44531 14.375 2.46875 14.2656L3.04688 11.3594H1.39844ZM5.67188 9.25H8.57812L9.19531 6.17969H6.28125L5.67188 9.25Z"/>
                                </svg>
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; flex: 1 0 0; text-align: end;">0</p>
                                <input style="display: none;" type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][9]}</p>
                                <svg id="DLP_Inset_Icon_1_ID" display="" width="16" height="16" viewBox="0 0 16 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.25 15.0156C0.554688 15.0156 -0.0078125 14.4609 -0.0078125 13.7734C-0.0078125 13.4297 0.140625 13.1094 0.390625 12.8516L5.54688 7.85156L0.390625 2.85938C0.132812 2.60156 -0.0078125 2.28125 -0.0078125 1.94531C-0.0078125 1.25781 0.554688 0.703125 1.25 0.703125C1.59375 0.703125 1.875 0.820312 2.10938 1.05469L8.02344 6.83594C8.33594 7.14062 8.48438 7.46875 8.48438 7.85938C8.48438 8.24219 8.34375 8.5625 8.02344 8.88281L2.10938 14.6641C1.86719 14.8984 1.58594 15.0156 1.25 15.0156ZM8.22656 15.0156C7.53125 15.0156 6.96875 14.4609 6.96875 13.7734C6.96875 13.4297 7.11719 13.1094 7.375 12.8516L12.5234 7.85156L7.375 2.85938C7.10938 2.60156 6.96875 2.28125 6.96875 1.94531C6.96875 1.25781 7.53125 0.703125 8.22656 0.703125C8.57031 0.703125 8.85156 0.820312 9.09375 1.05469L15 6.83594C15.3203 7.14062 15.4609 7.46875 15.4688 7.85938C15.4688 8.24219 15.3203 8.5625 15.0078 8.88281L9.09375 14.6641C8.85156 14.8984 8.57031 15.0156 8.22656 15.0156Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 2.66406C8.03125 2.66406 7.4375 2.75 6.875 2.92188L6.07812 1.02344C6.89062 0.757812 7.75781 0.609375 8.64844 0.609375C9.53906 0.609375 10.3984 0.757812 11.2031 1.02344L10.4219 2.92188C9.85938 2.75781 9.26562 2.66406 8.64844 2.66406ZM14.1016 5.91406C13.5312 4.84375 12.6562 3.96875 11.5859 3.39844L12.375 1.50781C13.9297 2.30469 15.2031 3.57812 16 5.125L14.1016 5.91406ZM5.70312 3.39844C4.63281 3.97656 3.75781 4.85156 3.19531 5.92188L1.29688 5.125C2.09375 3.57812 3.36719 2.30469 4.91406 1.50781L5.70312 3.39844ZM14.8438 8.85938C14.8438 8.24219 14.7578 7.64844 14.5859 7.08594L16.4844 6.29688C16.7578 7.10156 16.8984 7.96875 16.8984 8.85938C16.8984 9.75 16.7578 10.6172 16.4844 11.4219L14.5938 10.6328C14.75 10.0703 14.8438 9.47656 14.8438 8.85938ZM2.46094 8.85938C2.46094 9.47656 2.54688 10.0703 2.71094 10.625L0.8125 11.4219C0.546875 10.6094 0.398438 9.75 0.398438 8.85938C0.398438 7.96875 0.546875 7.10938 0.8125 6.29688L2.71094 7.08594C2.54688 7.64844 2.46094 8.24219 2.46094 8.85938ZM11.5859 14.3125C12.6562 13.7422 13.5391 12.875 14.1094 11.8047L16 12.5938C15.2031 14.1406 13.9297 15.4141 12.375 16.2109L11.5859 14.3125ZM3.19531 11.8047C3.76562 12.8672 4.63281 13.7422 5.70312 14.3125L4.91406 16.2031C3.36719 15.4141 2.09375 14.1406 1.29688 12.5938L3.19531 11.8047ZM8.64844 15.0547C9.26562 15.0547 9.85938 14.9609 10.4141 14.7969L11.2109 16.6953C10.3984 16.9609 9.53906 17.1094 8.64844 17.1094C7.75781 17.1094 6.89062 16.9609 6.08594 16.6953L6.875 14.7969C7.4375 14.9609 8.03125 15.0547 8.64844 15.0547Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_4_ID" display="none" width="18" height="16" viewBox="0 0 18 16" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div class="DLP_HStack_8">
                    <div class="DLP_VStack_8" id="DLP_Get_SUPER_2_ID" style="flex: 1 0 0;">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <svg id="DLP_Inset_Icon_1_ID" class="DLP_Magnetic_Hover_1 DLP_NoSelect" width="13" height="20" viewBox="0 0 13 20" fill="#007AFF" xmlns="http://www.w3.org/2000/svg" display="none">
                                <path d="M0.140625 12.25C0.140625 10.5156 1.50781 8.80469 3.73438 7.96875L3.98438 4.25781C2.77344 3.57812 1.875 2.85156 1.47656 2.35156C1.24219 2.05469 1.13281 1.74219 1.13281 1.46094C1.13281 0.875 1.57812 0.453125 2.22656 0.453125H10.7578C11.4062 0.453125 11.8516 0.875 11.8516 1.46094C11.8516 1.74219 11.7422 2.05469 11.5078 2.35156C11.1094 2.85156 10.2109 3.57031 9 4.25781L9.25781 7.96875C11.4766 8.80469 12.8438 10.5156 12.8438 12.25C12.8438 13.0312 12.3047 13.5547 11.5 13.5547H7.40625V17.3203C7.40625 18.2578 6.74219 19.5703 6.49219 19.5703C6.24219 19.5703 5.57812 18.2578 5.57812 17.3203V13.5547H1.48438C0.679688 13.5547 0.140625 13.0312 0.140625 12.25Z"/>
                            </svg>
                            <svg id="DLP_Inset_Icon_2_ID" class="DLP_Magnetic_Hover_1 DLP_NoSelect" width="13" height="20" viewBox="0 0 13 20" fill="rgb(var(--color-eel))" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.5" d="M1.48438 13.5547C0.679688 13.5547 0.140625 13.0312 0.140625 12.25C0.140625 10.5156 1.50781 8.85156 3.55469 8.01562L3.80469 4.25781C2.77344 3.57031 1.86719 2.85156 1.47656 2.34375C1.24219 2.05469 1.13281 1.74219 1.13281 1.46094C1.13281 0.875 1.57812 0.453125 2.22656 0.453125H10.7578C11.4062 0.453125 11.8516 0.875 11.8516 1.46094C11.8516 1.74219 11.7422 2.05469 11.5078 2.34375C11.1172 2.85156 10.2188 3.57031 9.17969 4.25781L9.42969 8.01562C11.4766 8.85156 12.8438 10.5156 12.8438 12.25C12.8438 13.0312 12.3047 13.5547 11.5 13.5547H7.40625V17.3203C7.40625 18.2578 6.74219 19.5703 6.49219 19.5703C6.24219 19.5703 5.57812 18.2578 5.57812 17.3203V13.5547H1.48438ZM6.49219 7.44531C6.92969 7.44531 7.35156 7.47656 7.75781 7.54688L7.53125 3.55469C7.52344 3.38281 7.5625 3.29688 7.69531 3.21875C8.5625 2.76562 9.23438 2.28125 9.46094 2.07812C9.53125 2.00781 9.49219 1.92969 9.41406 1.92969H3.57812C3.5 1.92969 3.45312 2.00781 3.52344 2.07812C3.75 2.28125 4.42188 2.76562 5.28906 3.21875C5.42188 3.29688 5.46094 3.38281 5.45312 3.55469L5.22656 7.54688C5.63281 7.47656 6.05469 7.44531 6.49219 7.44531ZM1.92188 11.9844H11.0625C11.1797 11.9844 11.2344 11.9141 11.2109 11.7734C10.9922 10.3906 9.08594 8.96875 6.49219 8.96875C3.89844 8.96875 1.99219 10.3906 1.77344 11.7734C1.75 11.9141 1.80469 11.9844 1.92188 11.9844Z"/>
                            </svg>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][12]}</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID" style="flex: 1 0 0;">
                                <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][13]}</p>
                                <svg id="DLP_Inset_Icon_1_ID" display="" width="16" height="16" viewBox="0 0 16 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.25 15.0156C0.554688 15.0156 -0.0078125 14.4609 -0.0078125 13.7734C-0.0078125 13.4297 0.140625 13.1094 0.390625 12.8516L5.54688 7.85156L0.390625 2.85938C0.132812 2.60156 -0.0078125 2.28125 -0.0078125 1.94531C-0.0078125 1.25781 0.554688 0.703125 1.25 0.703125C1.59375 0.703125 1.875 0.820312 2.10938 1.05469L8.02344 6.83594C8.33594 7.14062 8.48438 7.46875 8.48438 7.85938C8.48438 8.24219 8.34375 8.5625 8.02344 8.88281L2.10938 14.6641C1.86719 14.8984 1.58594 15.0156 1.25 15.0156ZM8.22656 15.0156C7.53125 15.0156 6.96875 14.4609 6.96875 13.7734C6.96875 13.4297 7.11719 13.1094 7.375 12.8516L12.5234 7.85156L7.375 2.85938C7.10938 2.60156 6.96875 2.28125 6.96875 1.94531C6.96875 1.25781 7.53125 0.703125 8.22656 0.703125C8.57031 0.703125 8.85156 0.820312 9.09375 1.05469L15 6.83594C15.3203 7.14062 15.4609 7.46875 15.4688 7.85938C15.4688 8.24219 15.3203 8.5625 15.0078 8.88281L9.09375 14.6641C8.85156 14.8984 8.57031 15.0156 8.22656 15.0156Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 2.66406C8.03125 2.66406 7.4375 2.75 6.875 2.92188L6.07812 1.02344C6.89062 0.757812 7.75781 0.609375 8.64844 0.609375C9.53906 0.609375 10.3984 0.757812 11.2031 1.02344L10.4219 2.92188C9.85938 2.75781 9.26562 2.66406 8.64844 2.66406ZM14.1016 5.91406C13.5312 4.84375 12.6562 3.96875 11.5859 3.39844L12.375 1.50781C13.9297 2.30469 15.2031 3.57812 16 5.125L14.1016 5.91406ZM5.70312 3.39844C4.63281 3.97656 3.75781 4.85156 3.19531 5.92188L1.29688 5.125C2.09375 3.57812 3.36719 2.30469 4.91406 1.50781L5.70312 3.39844ZM14.8438 8.85938C14.8438 8.24219 14.7578 7.64844 14.5859 7.08594L16.4844 6.29688C16.7578 7.10156 16.8984 7.96875 16.8984 8.85938C16.8984 9.75 16.7578 10.6172 16.4844 11.4219L14.5938 10.6328C14.75 10.0703 14.8438 9.47656 14.8438 8.85938ZM2.46094 8.85938C2.46094 9.47656 2.54688 10.0703 2.71094 10.625L0.8125 11.4219C0.546875 10.6094 0.398438 9.75 0.398438 8.85938C0.398438 7.96875 0.546875 7.10938 0.8125 6.29688L2.71094 7.08594C2.54688 7.64844 2.46094 8.24219 2.46094 8.85938ZM11.5859 14.3125C12.6562 13.7422 13.5391 12.875 14.1094 11.8047L16 12.5938C15.2031 14.1406 13.9297 15.4141 12.375 16.2109L11.5859 14.3125ZM3.19531 11.8047C3.76562 12.8672 4.63281 13.7422 5.70312 14.3125L4.91406 16.2031C3.36719 15.4141 2.09375 14.1406 1.29688 12.5938L3.19531 11.8047ZM8.64844 15.0547C9.26562 15.0547 9.85938 14.9609 10.4141 14.7969L11.2109 16.6953C10.3984 16.9609 9.53906 17.1094 8.64844 17.1094C7.75781 17.1094 6.89062 16.9609 6.08594 16.6953L6.875 14.7969C7.4375 14.9609 8.03125 15.0547 8.64844 15.0547Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_4_ID" display="none" width="18" height="16" viewBox="0 0 18 16" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_DOUBLE_XP_BOOST_2_ID" style="flex: 1 0 0;">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <svg id="DLP_Inset_Icon_1_ID" class="DLP_Magnetic_Hover_1 DLP_NoSelect" width="13" height="20" viewBox="0 0 13 20" fill="#007AFF" xmlns="http://www.w3.org/2000/svg" display="none">
                                <path d="M0.140625 12.25C0.140625 10.5156 1.50781 8.80469 3.73438 7.96875L3.98438 4.25781C2.77344 3.57812 1.875 2.85156 1.47656 2.35156C1.24219 2.05469 1.13281 1.74219 1.13281 1.46094C1.13281 0.875 1.57812 0.453125 2.22656 0.453125H10.7578C11.4062 0.453125 11.8516 0.875 11.8516 1.46094C11.8516 1.74219 11.7422 2.05469 11.5078 2.35156C11.1094 2.85156 10.2109 3.57031 9 4.25781L9.25781 7.96875C11.4766 8.80469 12.8438 10.5156 12.8438 12.25C12.8438 13.0312 12.3047 13.5547 11.5 13.5547H7.40625V17.3203C7.40625 18.2578 6.74219 19.5703 6.49219 19.5703C6.24219 19.5703 5.57812 18.2578 5.57812 17.3203V13.5547H1.48438C0.679688 13.5547 0.140625 13.0312 0.140625 12.25Z"/>
                            </svg>
                            <svg id="DLP_Inset_Icon_2_ID" class="DLP_Magnetic_Hover_1 DLP_NoSelect" width="13" height="20" viewBox="0 0 13 20" fill="rgb(var(--color-eel))" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.5" d="M1.48438 13.5547C0.679688 13.5547 0.140625 13.0312 0.140625 12.25C0.140625 10.5156 1.50781 8.85156 3.55469 8.01562L3.80469 4.25781C2.77344 3.57031 1.86719 2.85156 1.47656 2.34375C1.24219 2.05469 1.13281 1.74219 1.13281 1.46094C1.13281 0.875 1.57812 0.453125 2.22656 0.453125H10.7578C11.4062 0.453125 11.8516 0.875 11.8516 1.46094C11.8516 1.74219 11.7422 2.05469 11.5078 2.34375C11.1172 2.85156 10.2188 3.57031 9.17969 4.25781L9.42969 8.01562C11.4766 8.85156 12.8438 10.5156 12.8438 12.25C12.8438 13.0312 12.3047 13.5547 11.5 13.5547H7.40625V17.3203C7.40625 18.2578 6.74219 19.5703 6.49219 19.5703C6.24219 19.5703 5.57812 18.2578 5.57812 17.3203V13.5547H1.48438ZM6.49219 7.44531C6.92969 7.44531 7.35156 7.47656 7.75781 7.54688L7.53125 3.55469C7.52344 3.38281 7.5625 3.29688 7.69531 3.21875C8.5625 2.76562 9.23438 2.28125 9.46094 2.07812C9.53125 2.00781 9.49219 1.92969 9.41406 1.92969H3.57812C3.5 1.92969 3.45312 2.00781 3.52344 2.07812C3.75 2.28125 4.42188 2.76562 5.28906 3.21875C5.42188 3.29688 5.46094 3.38281 5.45312 3.55469L5.22656 7.54688C5.63281 7.47656 6.05469 7.44531 6.49219 7.44531ZM1.92188 11.9844H11.0625C11.1797 11.9844 11.2344 11.9141 11.2109 11.7734C10.9922 10.3906 9.08594 8.96875 6.49219 8.96875C3.89844 8.96875 1.99219 10.3906 1.77344 11.7734C1.75 11.9141 1.80469 11.9844 1.92188 11.9844Z"/>
                            </svg>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">Would you like to redeem an XP Boost?</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID" style="flex: 1 0 0;">
                                <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][13]}</p>
                                <svg id="DLP_Inset_Icon_1_ID" display="" width="16" height="16" viewBox="0 0 16 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.25 15.0156C0.554688 15.0156 -0.0078125 14.4609 -0.0078125 13.7734C-0.0078125 13.4297 0.140625 13.1094 0.390625 12.8516L5.54688 7.85156L0.390625 2.85938C0.132812 2.60156 -0.0078125 2.28125 -0.0078125 1.94531C-0.0078125 1.25781 0.554688 0.703125 1.25 0.703125C1.59375 0.703125 1.875 0.820312 2.10938 1.05469L8.02344 6.83594C8.33594 7.14062 8.48438 7.46875 8.48438 7.85938C8.48438 8.24219 8.34375 8.5625 8.02344 8.88281L2.10938 14.6641C1.86719 14.8984 1.58594 15.0156 1.25 15.0156ZM8.22656 15.0156C7.53125 15.0156 6.96875 14.4609 6.96875 13.7734C6.96875 13.4297 7.11719 13.1094 7.375 12.8516L12.5234 7.85156L7.375 2.85938C7.10938 2.60156 6.96875 2.28125 6.96875 1.94531C6.96875 1.25781 7.53125 0.703125 8.22656 0.703125C8.57031 0.703125 8.85156 0.820312 9.09375 1.05469L15 6.83594C15.3203 7.14062 15.4609 7.46875 15.4688 7.85938C15.4688 8.24219 15.3203 8.5625 15.0078 8.88281L9.09375 14.6641C8.85156 14.8984 8.57031 15.0156 8.22656 15.0156Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 2.66406C8.03125 2.66406 7.4375 2.75 6.875 2.92188L6.07812 1.02344C6.89062 0.757812 7.75781 0.609375 8.64844 0.609375C9.53906 0.609375 10.3984 0.757812 11.2031 1.02344L10.4219 2.92188C9.85938 2.75781 9.26562 2.66406 8.64844 2.66406ZM14.1016 5.91406C13.5312 4.84375 12.6562 3.96875 11.5859 3.39844L12.375 1.50781C13.9297 2.30469 15.2031 3.57812 16 5.125L14.1016 5.91406ZM5.70312 3.39844C4.63281 3.97656 3.75781 4.85156 3.19531 5.92188L1.29688 5.125C2.09375 3.57812 3.36719 2.30469 4.91406 1.50781L5.70312 3.39844ZM14.8438 8.85938C14.8438 8.24219 14.7578 7.64844 14.5859 7.08594L16.4844 6.29688C16.7578 7.10156 16.8984 7.96875 16.8984 8.85938C16.8984 9.75 16.7578 10.6172 16.4844 11.4219L14.5938 10.6328C14.75 10.0703 14.8438 9.47656 14.8438 8.85938ZM2.46094 8.85938C2.46094 9.47656 2.54688 10.0703 2.71094 10.625L0.8125 11.4219C0.546875 10.6094 0.398438 9.75 0.398438 8.85938C0.398438 7.96875 0.546875 7.10938 0.8125 6.29688L2.71094 7.08594C2.54688 7.64844 2.46094 8.24219 2.46094 8.85938ZM11.5859 14.3125C12.6562 13.7422 13.5391 12.875 14.1094 11.8047L16 12.5938C15.2031 14.1406 13.9297 15.4141 12.375 16.2109L11.5859 14.3125ZM3.19531 11.8047C3.76562 12.8672 4.63281 13.7422 5.70312 14.3125L4.91406 16.2031C3.36719 15.4141 2.09375 14.1406 1.29688 12.5938L3.19531 11.8047ZM8.64844 15.0547C9.26562 15.0547 9.85938 14.9609 10.4141 14.7969L11.2109 16.6953C10.3984 16.9609 9.53906 17.1094 8.64844 17.1094C7.75781 17.1094 6.89062 16.9609 6.08594 16.6953L6.875 14.7969C7.4375 14.9609 8.03125 15.0547 8.64844 15.0547Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_4_ID" display="none" width="18" height="16" viewBox="0 0 18 16" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div class="DLP_HStack_8">
                    <div class="DLP_VStack_8" id="DLP_Get_Streak_Freeze_2_ID" style="flex: 1 0 0;">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <svg id="DLP_Inset_Icon_1_ID" class="DLP_Magnetic_Hover_1 DLP_NoSelect" width="13" height="20" viewBox="0 0 13 20" fill="#007AFF" xmlns="http://www.w3.org/2000/svg" display="none">
                                <path d="M0.140625 12.25C0.140625 10.5156 1.50781 8.80469 3.73438 7.96875L3.98438 4.25781C2.77344 3.57812 1.875 2.85156 1.47656 2.35156C1.24219 2.05469 1.13281 1.74219 1.13281 1.46094C1.13281 0.875 1.57812 0.453125 2.22656 0.453125H10.7578C11.4062 0.453125 11.8516 0.875 11.8516 1.46094C11.8516 1.74219 11.7422 2.05469 11.5078 2.35156C11.1094 2.85156 10.2109 3.57031 9 4.25781L9.25781 7.96875C11.4766 8.80469 12.8438 10.5156 12.8438 12.25C12.8438 13.0312 12.3047 13.5547 11.5 13.5547H7.40625V17.3203C7.40625 18.2578 6.74219 19.5703 6.49219 19.5703C6.24219 19.5703 5.57812 18.2578 5.57812 17.3203V13.5547H1.48438C0.679688 13.5547 0.140625 13.0312 0.140625 12.25Z"/>
                            </svg>
                            <svg id="DLP_Inset_Icon_2_ID" class="DLP_Magnetic_Hover_1 DLP_NoSelect" width="13" height="20" viewBox="0 0 13 20" fill="rgb(var(--color-eel))" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.5" d="M1.48438 13.5547C0.679688 13.5547 0.140625 13.0312 0.140625 12.25C0.140625 10.5156 1.50781 8.85156 3.55469 8.01562L3.80469 4.25781C2.77344 3.57031 1.86719 2.85156 1.47656 2.34375C1.24219 2.05469 1.13281 1.74219 1.13281 1.46094C1.13281 0.875 1.57812 0.453125 2.22656 0.453125H10.7578C11.4062 0.453125 11.8516 0.875 11.8516 1.46094C11.8516 1.74219 11.7422 2.05469 11.5078 2.34375C11.1172 2.85156 10.2188 3.57031 9.17969 4.25781L9.42969 8.01562C11.4766 8.85156 12.8438 10.5156 12.8438 12.25C12.8438 13.0312 12.3047 13.5547 11.5 13.5547H7.40625V17.3203C7.40625 18.2578 6.74219 19.5703 6.49219 19.5703C6.24219 19.5703 5.57812 18.2578 5.57812 17.3203V13.5547H1.48438ZM6.49219 7.44531C6.92969 7.44531 7.35156 7.47656 7.75781 7.54688L7.53125 3.55469C7.52344 3.38281 7.5625 3.29688 7.69531 3.21875C8.5625 2.76562 9.23438 2.28125 9.46094 2.07812C9.53125 2.00781 9.49219 1.92969 9.41406 1.92969H3.57812C3.5 1.92969 3.45312 2.00781 3.52344 2.07812C3.75 2.28125 4.42188 2.76562 5.28906 3.21875C5.42188 3.29688 5.46094 3.38281 5.45312 3.55469L5.22656 7.54688C5.63281 7.47656 6.05469 7.44531 6.49219 7.44531ZM1.92188 11.9844H11.0625C11.1797 11.9844 11.2344 11.9141 11.2109 11.7734C10.9922 10.3906 9.08594 8.96875 6.49219 8.96875C3.89844 8.96875 1.99219 10.3906 1.77344 11.7734C1.75 11.9141 1.80469 11.9844 1.92188 11.9844Z"/>
                            </svg>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">How many Streak Freezes would you like to get?</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; opacity: 0.5; display: none;">XP</p>
                                <svg width="15" height="16" viewBox="0 0 15 16" fill="#007AFF" opacity="0.5" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.39844 11.3594C0.78125 11.3594 0.398438 11 0.398438 10.4297C0.398438 9.72656 0.867188 9.25 1.625 9.25H3.46875L4.07812 6.17969H2.40625C1.78906 6.17969 1.39844 5.80469 1.39844 5.24219C1.39844 4.53125 1.875 4.05469 2.63281 4.05469H4.5L5.07812 1.17188C5.21094 0.507812 5.58594 0.15625 6.26562 0.15625C6.88281 0.15625 7.26562 0.507812 7.26562 1.07031C7.26562 1.19531 7.24219 1.35938 7.22656 1.45312L6.70312 4.05469H9.61719L10.1953 1.17188C10.3281 0.507812 10.6953 0.15625 11.375 0.15625C11.9844 0.15625 12.3672 0.507812 12.3672 1.07031C12.3672 1.19531 12.3516 1.35938 12.3359 1.45312L11.8125 4.05469H13.5938C14.2109 4.05469 14.5938 4.4375 14.5938 4.99219C14.5938 5.70312 14.125 6.17969 13.3672 6.17969H11.3906L10.7812 9.25H12.5859C13.2031 9.25 13.5859 9.64062 13.5859 10.1953C13.5859 10.8984 13.1172 11.3594 12.3516 11.3594H10.3594L9.72656 14.5469C9.59375 15.2266 9.17969 15.5547 8.52344 15.5547C7.91406 15.5547 7.53906 15.2109 7.53906 14.6406C7.53906 14.5391 7.55469 14.375 7.57812 14.2656L8.15625 11.3594H5.25L4.61719 14.5469C4.48438 15.2266 4.0625 15.5547 3.42188 15.5547C2.8125 15.5547 2.42969 15.2109 2.42969 14.6406C2.42969 14.5391 2.44531 14.375 2.46875 14.2656L3.04688 11.3594H1.39844ZM5.67188 9.25H8.57812L9.19531 6.17969H6.28125L5.67188 9.25Z"/>
                                </svg>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][9]}</p>
                                <svg id="DLP_Inset_Icon_1_ID" display="" width="16" height="16" viewBox="0 0 16 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.25 15.0156C0.554688 15.0156 -0.0078125 14.4609 -0.0078125 13.7734C-0.0078125 13.4297 0.140625 13.1094 0.390625 12.8516L5.54688 7.85156L0.390625 2.85938C0.132812 2.60156 -0.0078125 2.28125 -0.0078125 1.94531C-0.0078125 1.25781 0.554688 0.703125 1.25 0.703125C1.59375 0.703125 1.875 0.820312 2.10938 1.05469L8.02344 6.83594C8.33594 7.14062 8.48438 7.46875 8.48438 7.85938C8.48438 8.24219 8.34375 8.5625 8.02344 8.88281L2.10938 14.6641C1.86719 14.8984 1.58594 15.0156 1.25 15.0156ZM8.22656 15.0156C7.53125 15.0156 6.96875 14.4609 6.96875 13.7734C6.96875 13.4297 7.11719 13.1094 7.375 12.8516L12.5234 7.85156L7.375 2.85938C7.10938 2.60156 6.96875 2.28125 6.96875 1.94531C6.96875 1.25781 7.53125 0.703125 8.22656 0.703125C8.57031 0.703125 8.85156 0.820312 9.09375 1.05469L15 6.83594C15.3203 7.14062 15.4609 7.46875 15.4688 7.85938C15.4688 8.24219 15.3203 8.5625 15.0078 8.88281L9.09375 14.6641C8.85156 14.8984 8.57031 15.0156 8.22656 15.0156Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 2.66406C8.03125 2.66406 7.4375 2.75 6.875 2.92188L6.07812 1.02344C6.89062 0.757812 7.75781 0.609375 8.64844 0.609375C9.53906 0.609375 10.3984 0.757812 11.2031 1.02344L10.4219 2.92188C9.85938 2.75781 9.26562 2.66406 8.64844 2.66406ZM14.1016 5.91406C13.5312 4.84375 12.6562 3.96875 11.5859 3.39844L12.375 1.50781C13.9297 2.30469 15.2031 3.57812 16 5.125L14.1016 5.91406ZM5.70312 3.39844C4.63281 3.97656 3.75781 4.85156 3.19531 5.92188L1.29688 5.125C2.09375 3.57812 3.36719 2.30469 4.91406 1.50781L5.70312 3.39844ZM14.8438 8.85938C14.8438 8.24219 14.7578 7.64844 14.5859 7.08594L16.4844 6.29688C16.7578 7.10156 16.8984 7.96875 16.8984 8.85938C16.8984 9.75 16.7578 10.6172 16.4844 11.4219L14.5938 10.6328C14.75 10.0703 14.8438 9.47656 14.8438 8.85938ZM2.46094 8.85938C2.46094 9.47656 2.54688 10.0703 2.71094 10.625L0.8125 11.4219C0.546875 10.6094 0.398438 9.75 0.398438 8.85938C0.398438 7.96875 0.546875 7.10938 0.8125 6.29688L2.71094 7.08594C2.54688 7.64844 2.46094 8.24219 2.46094 8.85938ZM11.5859 14.3125C12.6562 13.7422 13.5391 12.875 14.1094 11.8047L16 12.5938C15.2031 14.1406 13.9297 15.4141 12.375 16.2109L11.5859 14.3125ZM3.19531 11.8047C3.76562 12.8672 4.63281 13.7422 5.70312 14.3125L4.91406 16.2031C3.36719 15.4141 2.09375 14.1406 1.29688 12.5938L3.19531 11.8047ZM8.64844 15.0547C9.26562 15.0547 9.85938 14.9609 10.4141 14.7969L11.2109 16.6953C10.3984 16.9609 9.53906 17.1094 8.64844 17.1094C7.75781 17.1094 6.89062 16.9609 6.08594 16.6953L6.875 14.7969C7.4375 14.9609 8.03125 15.0547 8.64844 15.0547Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_4_ID" display="none" width="18" height="16" viewBox="0 0 18 16" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_Streak_2_ID" style="flex: 1 0 0;">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <svg id="DLP_Inset_Icon_1_ID" class="DLP_Magnetic_Hover_1 DLP_NoSelect" width="13" height="20" viewBox="0 0 13 20" fill="#007AFF" xmlns="http://www.w3.org/2000/svg" display="none">
                                <path d="M0.140625 12.25C0.140625 10.5156 1.50781 8.80469 3.73438 7.96875L3.98438 4.25781C2.77344 3.57812 1.875 2.85156 1.47656 2.35156C1.24219 2.05469 1.13281 1.74219 1.13281 1.46094C1.13281 0.875 1.57812 0.453125 2.22656 0.453125H10.7578C11.4062 0.453125 11.8516 0.875 11.8516 1.46094C11.8516 1.74219 11.7422 2.05469 11.5078 2.35156C11.1094 2.85156 10.2109 3.57031 9 4.25781L9.25781 7.96875C11.4766 8.80469 12.8438 10.5156 12.8438 12.25C12.8438 13.0312 12.3047 13.5547 11.5 13.5547H7.40625V17.3203C7.40625 18.2578 6.74219 19.5703 6.49219 19.5703C6.24219 19.5703 5.57812 18.2578 5.57812 17.3203V13.5547H1.48438C0.679688 13.5547 0.140625 13.0312 0.140625 12.25Z"/>
                            </svg>
                            <svg id="DLP_Inset_Icon_2_ID" class="DLP_Magnetic_Hover_1 DLP_NoSelect" width="13" height="20" viewBox="0 0 13 20" fill="rgb(var(--color-eel))" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.5" d="M1.48438 13.5547C0.679688 13.5547 0.140625 13.0312 0.140625 12.25C0.140625 10.5156 1.50781 8.85156 3.55469 8.01562L3.80469 4.25781C2.77344 3.57031 1.86719 2.85156 1.47656 2.34375C1.24219 2.05469 1.13281 1.74219 1.13281 1.46094C1.13281 0.875 1.57812 0.453125 2.22656 0.453125H10.7578C11.4062 0.453125 11.8516 0.875 11.8516 1.46094C11.8516 1.74219 11.7422 2.05469 11.5078 2.34375C11.1172 2.85156 10.2188 3.57031 9.17969 4.25781L9.42969 8.01562C11.4766 8.85156 12.8438 10.5156 12.8438 12.25C12.8438 13.0312 12.3047 13.5547 11.5 13.5547H7.40625V17.3203C7.40625 18.2578 6.74219 19.5703 6.49219 19.5703C6.24219 19.5703 5.57812 18.2578 5.57812 17.3203V13.5547H1.48438ZM6.49219 7.44531C6.92969 7.44531 7.35156 7.47656 7.75781 7.54688L7.53125 3.55469C7.52344 3.38281 7.5625 3.29688 7.69531 3.21875C8.5625 2.76562 9.23438 2.28125 9.46094 2.07812C9.53125 2.00781 9.49219 1.92969 9.41406 1.92969H3.57812C3.5 1.92969 3.45312 2.00781 3.52344 2.07812C3.75 2.28125 4.42188 2.76562 5.28906 3.21875C5.42188 3.29688 5.46094 3.38281 5.45312 3.55469L5.22656 7.54688C5.63281 7.47656 6.05469 7.44531 6.49219 7.44531ZM1.92188 11.9844H11.0625C11.1797 11.9844 11.2344 11.9141 11.2109 11.7734C10.9922 10.3906 9.08594 8.96875 6.49219 8.96875C3.89844 8.96875 1.99219 10.3906 1.77344 11.7734C1.75 11.9141 1.80469 11.9844 1.92188 11.9844Z"/>
                            </svg>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">How many days would you like to increase your Streak by?</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; opacity: 0.5; display: none;">GEMS</p>
                                <svg width="15" height="16" viewBox="0 0 15 16" fill="#007AFF" opacity="0.5" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.39844 11.3594C0.78125 11.3594 0.398438 11 0.398438 10.4297C0.398438 9.72656 0.867188 9.25 1.625 9.25H3.46875L4.07812 6.17969H2.40625C1.78906 6.17969 1.39844 5.80469 1.39844 5.24219C1.39844 4.53125 1.875 4.05469 2.63281 4.05469H4.5L5.07812 1.17188C5.21094 0.507812 5.58594 0.15625 6.26562 0.15625C6.88281 0.15625 7.26562 0.507812 7.26562 1.07031C7.26562 1.19531 7.24219 1.35938 7.22656 1.45312L6.70312 4.05469H9.61719L10.1953 1.17188C10.3281 0.507812 10.6953 0.15625 11.375 0.15625C11.9844 0.15625 12.3672 0.507812 12.3672 1.07031C12.3672 1.19531 12.3516 1.35938 12.3359 1.45312L11.8125 4.05469H13.5938C14.2109 4.05469 14.5938 4.4375 14.5938 4.99219C14.5938 5.70312 14.125 6.17969 13.3672 6.17969H11.3906L10.7812 9.25H12.5859C13.2031 9.25 13.5859 9.64062 13.5859 10.1953C13.5859 10.8984 13.1172 11.3594 12.3516 11.3594H10.3594L9.72656 14.5469C9.59375 15.2266 9.17969 15.5547 8.52344 15.5547C7.91406 15.5547 7.53906 15.2109 7.53906 14.6406C7.53906 14.5391 7.55469 14.375 7.57812 14.2656L8.15625 11.3594H5.25L4.61719 14.5469C4.48438 15.2266 4.0625 15.5547 3.42188 15.5547C2.8125 15.5547 2.42969 15.2109 2.42969 14.6406C2.42969 14.5391 2.44531 14.375 2.46875 14.2656L3.04688 11.3594H1.39844ZM5.67188 9.25H8.57812L9.19531 6.17969H6.28125L5.67188 9.25Z"/>
                                </svg>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">GET</p>
                                <svg id="DLP_Inset_Icon_1_ID" display="" width="16" height="16" viewBox="0 0 16 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.25 15.0156C0.554688 15.0156 -0.0078125 14.4609 -0.0078125 13.7734C-0.0078125 13.4297 0.140625 13.1094 0.390625 12.8516L5.54688 7.85156L0.390625 2.85938C0.132812 2.60156 -0.0078125 2.28125 -0.0078125 1.94531C-0.0078125 1.25781 0.554688 0.703125 1.25 0.703125C1.59375 0.703125 1.875 0.820312 2.10938 1.05469L8.02344 6.83594C8.33594 7.14062 8.48438 7.46875 8.48438 7.85938C8.48438 8.24219 8.34375 8.5625 8.02344 8.88281L2.10938 14.6641C1.86719 14.8984 1.58594 15.0156 1.25 15.0156ZM8.22656 15.0156C7.53125 15.0156 6.96875 14.4609 6.96875 13.7734C6.96875 13.4297 7.11719 13.1094 7.375 12.8516L12.5234 7.85156L7.375 2.85938C7.10938 2.60156 6.96875 2.28125 6.96875 1.94531C6.96875 1.25781 7.53125 0.703125 8.22656 0.703125C8.57031 0.703125 8.85156 0.820312 9.09375 1.05469L15 6.83594C15.3203 7.14062 15.4609 7.46875 15.4688 7.85938C15.4688 8.24219 15.3203 8.5625 15.0078 8.88281L9.09375 14.6641C8.85156 14.8984 8.57031 15.0156 8.22656 15.0156Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 2.66406C8.03125 2.66406 7.4375 2.75 6.875 2.92188L6.07812 1.02344C6.89062 0.757812 7.75781 0.609375 8.64844 0.609375C9.53906 0.609375 10.3984 0.757812 11.2031 1.02344L10.4219 2.92188C9.85938 2.75781 9.26562 2.66406 8.64844 2.66406ZM14.1016 5.91406C13.5312 4.84375 12.6562 3.96875 11.5859 3.39844L12.375 1.50781C13.9297 2.30469 15.2031 3.57812 16 5.125L14.1016 5.91406ZM5.70312 3.39844C4.63281 3.97656 3.75781 4.85156 3.19531 5.92188L1.29688 5.125C2.09375 3.57812 3.36719 2.30469 4.91406 1.50781L5.70312 3.39844ZM14.8438 8.85938C14.8438 8.24219 14.7578 7.64844 14.5859 7.08594L16.4844 6.29688C16.7578 7.10156 16.8984 7.96875 16.8984 8.85938C16.8984 9.75 16.7578 10.6172 16.4844 11.4219L14.5938 10.6328C14.75 10.0703 14.8438 9.47656 14.8438 8.85938ZM2.46094 8.85938C2.46094 9.47656 2.54688 10.0703 2.71094 10.625L0.8125 11.4219C0.546875 10.6094 0.398438 9.75 0.398438 8.85938C0.398438 7.96875 0.546875 7.10938 0.8125 6.29688L2.71094 7.08594C2.54688 7.64844 2.46094 8.24219 2.46094 8.85938ZM11.5859 14.3125C12.6562 13.7422 13.5391 12.875 14.1094 11.8047L16 12.5938C15.2031 14.1406 13.9297 15.4141 12.375 16.2109L11.5859 14.3125ZM3.19531 11.8047C3.76562 12.8672 4.63281 13.7422 5.70312 14.3125L4.91406 16.2031C3.36719 15.4141 2.09375 14.1406 1.29688 12.5938L3.19531 11.8047ZM8.64844 15.0547C9.26562 15.0547 9.85938 14.9609 10.4141 14.7969L11.2109 16.6953C10.3984 16.9609 9.53906 17.1094 8.64844 17.1094C7.75781 17.1094 6.89062 16.9609 6.08594 16.6953L6.875 14.7969C7.4375 14.9609 8.03125 15.0547 8.64844 15.0547Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_4_ID" display="none" width="18" height="16" viewBox="0 0 18 16" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    </div>

                    <div class="DLP_HStack_8">
                    <div class="DLP_VStack_8" id="DLP_Get_Heart_Refill_2_ID" style="flex: 1 0 0;">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <svg id="DLP_Inset_Icon_1_ID" class="DLP_Magnetic_Hover_1 DLP_NoSelect" width="13" height="20" viewBox="0 0 13 20" fill="#007AFF" xmlns="http://www.w3.org/2000/svg" display="none">
                                <path d="M0.140625 12.25C0.140625 10.5156 1.50781 8.80469 3.73438 7.96875L3.98438 4.25781C2.77344 3.57812 1.875 2.85156 1.47656 2.35156C1.24219 2.05469 1.13281 1.74219 1.13281 1.46094C1.13281 0.875 1.57812 0.453125 2.22656 0.453125H10.7578C11.4062 0.453125 11.8516 0.875 11.8516 1.46094C11.8516 1.74219 11.7422 2.05469 11.5078 2.35156C11.1094 2.85156 10.2109 3.57031 9 4.25781L9.25781 7.96875C11.4766 8.80469 12.8438 10.5156 12.8438 12.25C12.8438 13.0312 12.3047 13.5547 11.5 13.5547H7.40625V17.3203C7.40625 18.2578 6.74219 19.5703 6.49219 19.5703C6.24219 19.5703 5.57812 18.2578 5.57812 17.3203V13.5547H1.48438C0.679688 13.5547 0.140625 13.0312 0.140625 12.25Z"/>
                            </svg>
                            <svg id="DLP_Inset_Icon_2_ID" class="DLP_Magnetic_Hover_1 DLP_NoSelect" width="13" height="20" viewBox="0 0 13 20" fill="rgb(var(--color-eel))" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.5" d="M1.48438 13.5547C0.679688 13.5547 0.140625 13.0312 0.140625 12.25C0.140625 10.5156 1.50781 8.85156 3.55469 8.01562L3.80469 4.25781C2.77344 3.57031 1.86719 2.85156 1.47656 2.34375C1.24219 2.05469 1.13281 1.74219 1.13281 1.46094C1.13281 0.875 1.57812 0.453125 2.22656 0.453125H10.7578C11.4062 0.453125 11.8516 0.875 11.8516 1.46094C11.8516 1.74219 11.7422 2.05469 11.5078 2.34375C11.1172 2.85156 10.2188 3.57031 9.17969 4.25781L9.42969 8.01562C11.4766 8.85156 12.8438 10.5156 12.8438 12.25C12.8438 13.0312 12.3047 13.5547 11.5 13.5547H7.40625V17.3203C7.40625 18.2578 6.74219 19.5703 6.49219 19.5703C6.24219 19.5703 5.57812 18.2578 5.57812 17.3203V13.5547H1.48438ZM6.49219 7.44531C6.92969 7.44531 7.35156 7.47656 7.75781 7.54688L7.53125 3.55469C7.52344 3.38281 7.5625 3.29688 7.69531 3.21875C8.5625 2.76562 9.23438 2.28125 9.46094 2.07812C9.53125 2.00781 9.49219 1.92969 9.41406 1.92969H3.57812C3.5 1.92969 3.45312 2.00781 3.52344 2.07812C3.75 2.28125 4.42188 2.76562 5.28906 3.21875C5.42188 3.29688 5.46094 3.38281 5.45312 3.55469L5.22656 7.54688C5.63281 7.47656 6.05469 7.44531 6.49219 7.44531ZM1.92188 11.9844H11.0625C11.1797 11.9844 11.2344 11.9141 11.2109 11.7734C10.9922 10.3906 9.08594 8.96875 6.49219 8.96875C3.89844 8.96875 1.99219 10.3906 1.77344 11.7734C1.75 11.9141 1.80469 11.9844 1.92188 11.9844Z"/>
                            </svg>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">Would you like to refill your Hearts to full?</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID" style="flex: 1 0 0;">
                                <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">REFILL</p>
                                <svg id="DLP_Inset_Icon_1_ID" display="" width="16" height="16" viewBox="0 0 16 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.25 15.0156C0.554688 15.0156 -0.0078125 14.4609 -0.0078125 13.7734C-0.0078125 13.4297 0.140625 13.1094 0.390625 12.8516L5.54688 7.85156L0.390625 2.85938C0.132812 2.60156 -0.0078125 2.28125 -0.0078125 1.94531C-0.0078125 1.25781 0.554688 0.703125 1.25 0.703125C1.59375 0.703125 1.875 0.820312 2.10938 1.05469L8.02344 6.83594C8.33594 7.14062 8.48438 7.46875 8.48438 7.85938C8.48438 8.24219 8.34375 8.5625 8.02344 8.88281L2.10938 14.6641C1.86719 14.8984 1.58594 15.0156 1.25 15.0156ZM8.22656 15.0156C7.53125 15.0156 6.96875 14.4609 6.96875 13.7734C6.96875 13.4297 7.11719 13.1094 7.375 12.8516L12.5234 7.85156L7.375 2.85938C7.10938 2.60156 6.96875 2.28125 6.96875 1.94531C6.96875 1.25781 7.53125 0.703125 8.22656 0.703125C8.57031 0.703125 8.85156 0.820312 9.09375 1.05469L15 6.83594C15.3203 7.14062 15.4609 7.46875 15.4688 7.85938C15.4688 8.24219 15.3203 8.5625 15.0078 8.88281L9.09375 14.6641C8.85156 14.8984 8.57031 15.0156 8.22656 15.0156Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 2.66406C8.03125 2.66406 7.4375 2.75 6.875 2.92188L6.07812 1.02344C6.89062 0.757812 7.75781 0.609375 8.64844 0.609375C9.53906 0.609375 10.3984 0.757812 11.2031 1.02344L10.4219 2.92188C9.85938 2.75781 9.26562 2.66406 8.64844 2.66406ZM14.1016 5.91406C13.5312 4.84375 12.6562 3.96875 11.5859 3.39844L12.375 1.50781C13.9297 2.30469 15.2031 3.57812 16 5.125L14.1016 5.91406ZM5.70312 3.39844C4.63281 3.97656 3.75781 4.85156 3.19531 5.92188L1.29688 5.125C2.09375 3.57812 3.36719 2.30469 4.91406 1.50781L5.70312 3.39844ZM14.8438 8.85938C14.8438 8.24219 14.7578 7.64844 14.5859 7.08594L16.4844 6.29688C16.7578 7.10156 16.8984 7.96875 16.8984 8.85938C16.8984 9.75 16.7578 10.6172 16.4844 11.4219L14.5938 10.6328C14.75 10.0703 14.8438 9.47656 14.8438 8.85938ZM2.46094 8.85938C2.46094 9.47656 2.54688 10.0703 2.71094 10.625L0.8125 11.4219C0.546875 10.6094 0.398438 9.75 0.398438 8.85938C0.398438 7.96875 0.546875 7.10938 0.8125 6.29688L2.71094 7.08594C2.54688 7.64844 2.46094 8.24219 2.46094 8.85938ZM11.5859 14.3125C12.6562 13.7422 13.5391 12.875 14.1094 11.8047L16 12.5938C15.2031 14.1406 13.9297 15.4141 12.375 16.2109L11.5859 14.3125ZM3.19531 11.8047C3.76562 12.8672 4.63281 13.7422 5.70312 14.3125L4.91406 16.2031C3.36719 15.4141 2.09375 14.1406 1.29688 12.5938L3.19531 11.8047ZM8.64844 15.0547C9.26562 15.0547 9.85938 14.9609 10.4141 14.7969L11.2109 16.6953C10.3984 16.9609 9.53906 17.1094 8.64844 17.1094C7.75781 17.1094 6.89062 16.9609 6.08594 16.6953L6.875 14.7969C7.4375 14.9609 8.03125 15.0547 8.64844 15.0547Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_4_ID" display="none" width="18" height="16" viewBox="0 0 18 16" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div style="flex: 1 0 0; align-self: stretch; opacity: 0; pointer-events: none;">
                    <div class="DLP_VStack_8" id="DLP_Get_Streak_Wager_2_ID" style="pointer-events: none; opacity: 0.5;">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <svg id="DLP_Inset_Icon_1_ID" class="DLP_Magnetic_Hover_1 DLP_NoSelect" width="13" height="20" viewBox="0 0 13 20" fill="#007AFF" xmlns="http://www.w3.org/2000/svg" display="none">
                                <path d="M0.140625 12.25C0.140625 10.5156 1.50781 8.80469 3.73438 7.96875L3.98438 4.25781C2.77344 3.57812 1.875 2.85156 1.47656 2.35156C1.24219 2.05469 1.13281 1.74219 1.13281 1.46094C1.13281 0.875 1.57812 0.453125 2.22656 0.453125H10.7578C11.4062 0.453125 11.8516 0.875 11.8516 1.46094C11.8516 1.74219 11.7422 2.05469 11.5078 2.35156C11.1094 2.85156 10.2109 3.57031 9 4.25781L9.25781 7.96875C11.4766 8.80469 12.8438 10.5156 12.8438 12.25C12.8438 13.0312 12.3047 13.5547 11.5 13.5547H7.40625V17.3203C7.40625 18.2578 6.74219 19.5703 6.49219 19.5703C6.24219 19.5703 5.57812 18.2578 5.57812 17.3203V13.5547H1.48438C0.679688 13.5547 0.140625 13.0312 0.140625 12.25Z"/>
                            </svg>
                            <svg id="DLP_Inset_Icon_2_ID" class="DLP_Magnetic_Hover_1 DLP_NoSelect" width="13" height="20" viewBox="0 0 13 20" fill="rgb(var(--color-eel))" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.5" d="M1.48438 13.5547C0.679688 13.5547 0.140625 13.0312 0.140625 12.25C0.140625 10.5156 1.50781 8.85156 3.55469 8.01562L3.80469 4.25781C2.77344 3.57031 1.86719 2.85156 1.47656 2.34375C1.24219 2.05469 1.13281 1.74219 1.13281 1.46094C1.13281 0.875 1.57812 0.453125 2.22656 0.453125H10.7578C11.4062 0.453125 11.8516 0.875 11.8516 1.46094C11.8516 1.74219 11.7422 2.05469 11.5078 2.34375C11.1172 2.85156 10.2188 3.57031 9.17969 4.25781L9.42969 8.01562C11.4766 8.85156 12.8438 10.5156 12.8438 12.25C12.8438 13.0312 12.3047 13.5547 11.5 13.5547H7.40625V17.3203C7.40625 18.2578 6.74219 19.5703 6.49219 19.5703C6.24219 19.5703 5.57812 18.2578 5.57812 17.3203V13.5547H1.48438ZM6.49219 7.44531C6.92969 7.44531 7.35156 7.47656 7.75781 7.54688L7.53125 3.55469C7.52344 3.38281 7.5625 3.29688 7.69531 3.21875C8.5625 2.76562 9.23438 2.28125 9.46094 2.07812C9.53125 2.00781 9.49219 1.92969 9.41406 1.92969H3.57812C3.5 1.92969 3.45312 2.00781 3.52344 2.07812C3.75 2.28125 4.42188 2.76562 5.28906 3.21875C5.42188 3.29688 5.46094 3.38281 5.45312 3.55469L5.22656 7.54688C5.63281 7.47656 6.05469 7.44531 6.49219 7.44531ZM1.92188 11.9844H11.0625C11.1797 11.9844 11.2344 11.9141 11.2109 11.7734C10.9922 10.3906 9.08594 8.96875 6.49219 8.96875C3.89844 8.96875 1.99219 10.3906 1.77344 11.7734C1.75 11.9141 1.80469 11.9844 1.92188 11.9844Z"/>
                            </svg>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">What would you like to set your Streak to?</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; opacity: 0.5; display: none;">GEMS</p>
                                <svg width="15" height="16" viewBox="0 0 15 16" fill="#007AFF" opacity="0.5" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.39844 11.3594C0.78125 11.3594 0.398438 11 0.398438 10.4297C0.398438 9.72656 0.867188 9.25 1.625 9.25H3.46875L4.07812 6.17969H2.40625C1.78906 6.17969 1.39844 5.80469 1.39844 5.24219C1.39844 4.53125 1.875 4.05469 2.63281 4.05469H4.5L5.07812 1.17188C5.21094 0.507812 5.58594 0.15625 6.26562 0.15625C6.88281 0.15625 7.26562 0.507812 7.26562 1.07031C7.26562 1.19531 7.24219 1.35938 7.22656 1.45312L6.70312 4.05469H9.61719L10.1953 1.17188C10.3281 0.507812 10.6953 0.15625 11.375 0.15625C11.9844 0.15625 12.3672 0.507812 12.3672 1.07031C12.3672 1.19531 12.3516 1.35938 12.3359 1.45312L11.8125 4.05469H13.5938C14.2109 4.05469 14.5938 4.4375 14.5938 4.99219C14.5938 5.70312 14.125 6.17969 13.3672 6.17969H11.3906L10.7812 9.25H12.5859C13.2031 9.25 13.5859 9.64062 13.5859 10.1953C13.5859 10.8984 13.1172 11.3594 12.3516 11.3594H10.3594L9.72656 14.5469C9.59375 15.2266 9.17969 15.5547 8.52344 15.5547C7.91406 15.5547 7.53906 15.2109 7.53906 14.6406C7.53906 14.5391 7.55469 14.375 7.57812 14.2656L8.15625 11.3594H5.25L4.61719 14.5469C4.48438 15.2266 4.0625 15.5547 3.42188 15.5547C2.8125 15.5547 2.42969 15.2109 2.42969 14.6406C2.42969 14.5391 2.44531 14.375 2.46875 14.2656L3.04688 11.3594H1.39844ZM5.67188 9.25H8.57812L9.19531 6.17969H6.28125L5.67188 9.25Z"/>
                                </svg>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">SET</p>
                                <svg id="DLP_Inset_Icon_1_ID" display="" width="16" height="16" viewBox="0 0 16 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.25 15.0156C0.554688 15.0156 -0.0078125 14.4609 -0.0078125 13.7734C-0.0078125 13.4297 0.140625 13.1094 0.390625 12.8516L5.54688 7.85156L0.390625 2.85938C0.132812 2.60156 -0.0078125 2.28125 -0.0078125 1.94531C-0.0078125 1.25781 0.554688 0.703125 1.25 0.703125C1.59375 0.703125 1.875 0.820312 2.10938 1.05469L8.02344 6.83594C8.33594 7.14062 8.48438 7.46875 8.48438 7.85938C8.48438 8.24219 8.34375 8.5625 8.02344 8.88281L2.10938 14.6641C1.86719 14.8984 1.58594 15.0156 1.25 15.0156ZM8.22656 15.0156C7.53125 15.0156 6.96875 14.4609 6.96875 13.7734C6.96875 13.4297 7.11719 13.1094 7.375 12.8516L12.5234 7.85156L7.375 2.85938C7.10938 2.60156 6.96875 2.28125 6.96875 1.94531C6.96875 1.25781 7.53125 0.703125 8.22656 0.703125C8.57031 0.703125 8.85156 0.820312 9.09375 1.05469L15 6.83594C15.3203 7.14062 15.4609 7.46875 15.4688 7.85938C15.4688 8.24219 15.3203 8.5625 15.0078 8.88281L9.09375 14.6641C8.85156 14.8984 8.57031 15.0156 8.22656 15.0156Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 2.66406C8.03125 2.66406 7.4375 2.75 6.875 2.92188L6.07812 1.02344C6.89062 0.757812 7.75781 0.609375 8.64844 0.609375C9.53906 0.609375 10.3984 0.757812 11.2031 1.02344L10.4219 2.92188C9.85938 2.75781 9.26562 2.66406 8.64844 2.66406ZM14.1016 5.91406C13.5312 4.84375 12.6562 3.96875 11.5859 3.39844L12.375 1.50781C13.9297 2.30469 15.2031 3.57812 16 5.125L14.1016 5.91406ZM5.70312 3.39844C4.63281 3.97656 3.75781 4.85156 3.19531 5.92188L1.29688 5.125C2.09375 3.57812 3.36719 2.30469 4.91406 1.50781L5.70312 3.39844ZM14.8438 8.85938C14.8438 8.24219 14.7578 7.64844 14.5859 7.08594L16.4844 6.29688C16.7578 7.10156 16.8984 7.96875 16.8984 8.85938C16.8984 9.75 16.7578 10.6172 16.4844 11.4219L14.5938 10.6328C14.75 10.0703 14.8438 9.47656 14.8438 8.85938ZM2.46094 8.85938C2.46094 9.47656 2.54688 10.0703 2.71094 10.625L0.8125 11.4219C0.546875 10.6094 0.398438 9.75 0.398438 8.85938C0.398438 7.96875 0.546875 7.10938 0.8125 6.29688L2.71094 7.08594C2.54688 7.64844 2.46094 8.24219 2.46094 8.85938ZM11.5859 14.3125C12.6562 13.7422 13.5391 12.875 14.1094 11.8047L16 12.5938C15.2031 14.1406 13.9297 15.4141 12.375 16.2109L11.5859 14.3125ZM3.19531 11.8047C3.76562 12.8672 4.63281 13.7422 5.70312 14.3125L4.91406 16.2031C3.36719 15.4141 2.09375 14.1406 1.29688 12.5938L3.19531 11.8047ZM8.64844 15.0547C9.26562 15.0547 9.85938 14.9609 10.4141 14.7969L11.2109 16.6953C10.3984 16.9609 9.53906 17.1094 8.64844 17.1094C7.75781 17.1094 6.89062 16.9609 6.08594 16.6953L6.875 14.7969C7.4375 14.9609 8.03125 15.0547 8.64844 15.0547Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_4_ID" display="none" width="18" height="16" viewBox="0 0 18 16" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_3_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_VStack_8">
                    <div class="DLP_HStack_8">
                        <div id="DLP_Secondary_1_Server_Connection_Button_1_ID" class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" style="outline: 2px solid rgb(var(--color-eel), 0.20); outline-offset: -2px; background: rgb(var(--color-eel), 0.10); transition: opacity 0.8s cubic-bezier(0.16, 1, 0.32, 1), background 0.8s cubic-bezier(0.16, 1, 0.32, 1), outline 0.8s cubic-bezier(0.16, 1, 0.32, 1), filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.4s cubic-bezier(0.16, 1, 0.32, 1); padding: 10px 0px 10px 10px; opacity: 0.25; pointer-events: none;">
                            <svg id="DLP_Inset_Icon_1_ID" width="17" height="18" viewBox="0 0 17 18" fill="(var(--color-eel))" xmlns="http://www.w3.org/2000/svg" style="transition: 0.4s;">
                                <path d="M8.64844 2.66406C8.03125 2.66406 7.4375 2.75 6.875 2.92188L6.07812 1.02344C6.89062 0.757812 7.75781 0.609375 8.64844 0.609375C9.53906 0.609375 10.3984 0.757812 11.2031 1.02344L10.4219 2.92188C9.85938 2.75781 9.26562 2.66406 8.64844 2.66406ZM14.1016 5.91406C13.5312 4.84375 12.6562 3.96875 11.5859 3.39844L12.375 1.50781C13.9297 2.30469 15.2031 3.57812 16 5.125L14.1016 5.91406ZM5.70312 3.39844C4.63281 3.97656 3.75781 4.85156 3.19531 5.92188L1.29688 5.125C2.09375 3.57812 3.36719 2.30469 4.91406 1.50781L5.70312 3.39844ZM14.8438 8.85938C14.8438 8.24219 14.7578 7.64844 14.5859 7.08594L16.4844 6.29688C16.7578 7.10156 16.8984 7.96875 16.8984 8.85938C16.8984 9.75 16.7578 10.6172 16.4844 11.4219L14.5938 10.6328C14.75 10.0703 14.8438 9.47656 14.8438 8.85938ZM2.46094 8.85938C2.46094 9.47656 2.54688 10.0703 2.71094 10.625L0.8125 11.4219C0.546875 10.6094 0.398438 9.75 0.398438 8.85938C0.398438 7.96875 0.546875 7.10938 0.8125 6.29688L2.71094 7.08594C2.54688 7.64844 2.46094 8.24219 2.46094 8.85938ZM11.5859 14.3125C12.6562 13.7422 13.5391 12.875 14.1094 11.8047L16 12.5938C15.2031 14.1406 13.9297 15.4141 12.375 16.2109L11.5859 14.3125ZM3.19531 11.8047C3.76562 12.8672 4.63281 13.7422 5.70312 14.3125L4.91406 16.2031C3.36719 15.4141 2.09375 14.1406 1.29688 12.5938L3.19531 11.8047ZM8.64844 15.0547C9.26562 15.0547 9.85938 14.9609 10.4141 14.7969L11.2109 16.6953C10.3984 16.9609 9.53906 17.1094 8.64844 17.1094C7.75781 17.1094 6.89062 16.9609 6.08594 16.6953L6.875 14.7969C7.4375 14.9609 8.03125 15.0547 8.64844 15.0547Z"/>
                            </svg>
                            <svg id="DLP_Inset_Icon_2_ID" width="17" height="18" viewBox="0 0 17 18" fill="#FFF" xmlns="http://www.w3.org/2000/svg" display="none" style="transition: 0.4s;">
                                <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM3.89062 4.19531C4.25 4.44531 4.71094 4.65625 5.24219 4.82812C5.60938 3.85156 6.09375 3.05469 6.67188 2.49219C5.60156 2.82812 4.65625 3.42188 3.89062 4.19531ZM10.6328 2.49219C11.2031 3.05469 11.6953 3.85938 12.0547 4.82812C12.5859 4.65625 13.0469 4.44531 13.4062 4.19531C12.6484 3.42188 11.6953 2.82812 10.6328 2.49219ZM6.46094 5.11719C6.95312 5.20312 7.48438 5.25781 8.04688 5.28125V2.91406C7.42969 3.24219 6.86719 4.04688 6.46094 5.11719ZM9.25781 2.91406V5.28125C9.8125 5.25781 10.3438 5.20312 10.8359 5.11719C10.4297 4.04688 9.86719 3.24219 9.25781 2.91406ZM2.01562 8.25H4.58594C4.625 7.44531 4.73438 6.67969 4.89844 5.96875C4.19531 5.75 3.59375 5.46094 3.14062 5.11719C2.51562 6.02344 2.11719 7.10156 2.01562 8.25ZM12.7109 8.25H15.2891C15.1797 7.09375 14.7812 6.02344 14.1641 5.11719C13.7109 5.46094 13.1094 5.75 12.3984 5.96875C12.5703 6.67969 12.6719 7.44531 12.7109 8.25ZM5.82031 8.25H8.04688V6.48438C7.36719 6.46094 6.71094 6.38281 6.10938 6.27344C5.96094 6.89062 5.85938 7.5625 5.82031 8.25ZM9.25781 8.25H11.4766C11.4375 7.5625 11.3438 6.89062 11.1953 6.27344C10.5859 6.38281 9.92969 6.46094 9.25781 6.48438V8.25ZM2.01562 9.46094C2.11719 10.6328 2.52344 11.7109 3.15625 12.625C3.60938 12.2891 4.20312 12.0078 4.90625 11.7812C4.73438 11.0703 4.625 10.2891 4.58594 9.46094H2.01562ZM5.82031 9.46094C5.85938 10.1719 5.96094 10.8516 6.10938 11.4844C6.71875 11.3672 7.36719 11.2969 8.04688 11.2656V9.46094H5.82031ZM9.25781 11.2656C9.92969 11.2969 10.5781 11.3672 11.1875 11.4844C11.3438 10.8516 11.4453 10.1719 11.4844 9.46094H9.25781V11.2656ZM12.3984 11.7812C13.0938 12.0078 13.6953 12.2891 14.1484 12.625C14.7734 11.7109 15.1797 10.6328 15.2891 9.46094H12.7109C12.6797 10.2891 12.5703 11.0703 12.3984 11.7812ZM9.25781 12.4766V14.8203C9.85938 14.4922 10.4219 13.6953 10.8281 12.6406C10.3359 12.5547 9.8125 12.5 9.25781 12.4766ZM6.46875 12.6406C6.875 13.6953 7.4375 14.4922 8.04688 14.8203V12.4766C7.49219 12.5 6.96094 12.5547 6.46875 12.6406ZM3.91406 13.5391C4.66406 14.3047 5.60156 14.8828 6.64844 15.2188C6.08594 14.6641 5.60938 13.875 5.25 12.9297C4.72656 13.0938 4.27344 13.2969 3.91406 13.5391ZM12.0469 12.9297C11.6953 13.875 11.2109 14.6641 10.6484 15.2188C11.6953 14.8828 12.6328 14.3047 13.3828 13.5391C13.0312 13.2969 12.5781 13.0938 12.0469 12.9297Z"/>
                            </svg>
                            <svg id="DLP_Inset_Icon_3_ID" width="18" height="16" viewBox="0 0 18 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg" display="none" style="transition: 0.4s;">
                                <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                            </svg>
                            <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #000; transition: 0.4s;">${systemText[systemLanguage][3]}</p>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Secondary_Donate_Button_1_ID" onclick="window.open('https://duolingopro.net/donate', '_blank');" style="outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; padding: 10px 0px 10px 10px;">
                            <svg width="17" height="19" viewBox="0 0 17 19" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.5 5.90755C16.4968 3.60922 14.6997 1.72555 12.5913 1.04588C9.97298 0.201877 6.51973 0.324211 4.01956 1.49921C0.989301 2.92355 0.0373889 6.04355 0.00191597 9.15522C-0.0271986 11.7136 0.229143 18.4517 4.04482 18.4997C6.87998 18.5356 7.30214 14.8967 8.61397 13.1442C9.5473 11.8974 10.749 11.5452 12.2284 11.1806C14.7709 10.5537 16.5037 8.55506 16.5 5.90755Z"/>
                            </svg>
                            <p class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][4]}</p>
                        </div>
                    </div>
                    <div class="DLP_HStack_8">
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Secondary_Feedback_1_Button_1_ID" style="outline: 2px solid rgba(0, 122, 255, 0.20); outline-offset: -2px; background: linear-gradient(0deg, rgba(0, 122, 255, 0.10) 0%, rgba(0, 122, 255, 0.10) 100%), rgba(var(--color-snow), 0.80); backdrop-filter: blur(16px);">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.22656 17.8125C4.70312 17.8125 4.39062 17.4531 4.39062 16.8906V14.6641H3.6875C1.52344 14.6641 -0.0078125 13.2109 -0.0078125 10.8438V4.64844C-0.0078125 2.27344 1.42969 0.820312 3.82031 0.820312H14.1641C16.5547 0.820312 17.9922 2.27344 17.9922 4.64844V10.8438C17.9922 13.2109 16.5547 14.6641 14.1641 14.6641H9.22656L6.29688 17.2734C5.86719 17.6562 5.57812 17.8125 5.22656 17.8125Z"/>
                            </svg>
                            <p class="DLP_Text_Style_1" style="color: #007AFF;">${systemText[systemLanguage][5]}</p>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Secondary_Settings_1_Button_1_ID" style="outline: 2px solid rgba(0, 122, 255, 0.20); outline-offset: -2px; background: linear-gradient(0deg, rgba(0, 122, 255, 0.10) 0%, rgba(0, 122, 255, 0.10) 100%), rgba(var(--color-snow), 0.80); backdrop-filter: blur(16px);">
                            <svg width="19" height="19" viewBox="0 0 19 19" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.46094 17.6875C9.28906 17.6875 9.13281 17.6797 8.96875 17.6719L8.55469 18.4453C8.42969 18.6875 8.17188 18.8281 7.89062 18.7891C7.60156 18.7344 7.40625 18.5156 7.36719 18.2344L7.24219 17.3672C6.92188 17.2812 6.61719 17.1641 6.32031 17.0469L5.67969 17.6172C5.47656 17.8047 5.17969 17.8516 4.92188 17.7109C4.67188 17.5547 4.57031 17.2891 4.625 17.0156L4.80469 16.1562C4.54688 15.9688 4.28906 15.7578 4.05469 15.5312L3.25781 15.8672C2.98438 15.9844 2.71094 15.9062 2.50781 15.6797C2.34375 15.4688 2.3125 15.1719 2.46094 14.9375L2.92188 14.1875C2.75 13.9219 2.59375 13.6406 2.4375 13.3438L1.57031 13.3828C1.28906 13.3984 1.03125 13.2344 0.945312 12.9531C0.851562 12.6953 0.9375 12.4062 1.15625 12.2344L1.84375 11.6953C1.76562 11.3828 1.70312 11.0625 1.67188 10.7344L0.84375 10.4609C0.5625 10.375 0.398438 10.1484 0.398438 9.85938C0.398438 9.57031 0.5625 9.34375 0.84375 9.25L1.67188 8.98438C1.70312 8.65625 1.76562 8.34375 1.84375 8.02344L1.15625 7.47656C0.9375 7.3125 0.851562 7.03125 0.945312 6.77344C1.03125 6.49219 1.28906 6.33594 1.57031 6.34375L2.4375 6.375C2.59375 6.07812 2.75 5.80469 2.92188 5.52344L2.46094 4.78125C2.3125 4.55469 2.34375 4.25781 2.50781 4.04688C2.71094 3.82031 2.98438 3.74219 3.25 3.85938L4.05469 4.17969C4.28906 3.96875 4.54688 3.75781 4.80469 3.5625L4.625 2.71875C4.5625 2.42188 4.67969 2.15625 4.91406 2.01562C5.1875 1.875 5.47656 1.91406 5.6875 2.10938L6.32031 2.67969C6.61719 2.55469 6.92969 2.44531 7.24219 2.35156L7.36719 1.49219C7.40625 1.21094 7.60156 0.992188 7.88281 0.945312C8.17188 0.898438 8.42969 1.03125 8.55469 1.26562L8.96875 2.04688C9.13281 2.03906 9.28906 2.03125 9.46094 2.03125C9.61719 2.03125 9.78125 2.03906 9.94531 2.04688L10.3594 1.26562C10.4766 1.03906 10.7344 0.898438 11.0234 0.9375C11.3047 0.992188 11.5078 1.21094 11.5469 1.49219L11.6719 2.35156C11.9844 2.44531 12.2891 2.55469 12.5859 2.67969L13.2266 2.10938C13.4375 1.91406 13.7266 1.875 13.9922 2.01562C14.2344 2.15625 14.3516 2.42188 14.2891 2.71094L14.1094 3.5625C14.3594 3.75781 14.6172 3.96875 14.8516 4.17969L15.6562 3.85938C15.9297 3.74219 16.2031 3.82031 16.4062 4.04688C16.5703 4.25781 16.5938 4.55469 16.4453 4.78125L15.9844 5.52344C16.1641 5.80469 16.3203 6.07812 16.4688 6.375L17.3438 6.34375C17.6172 6.33594 17.8828 6.49219 17.9688 6.77344C18.0625 7.03125 17.9609 7.30469 17.75 7.47656L17.0703 8.01562C17.1484 8.34375 17.2109 8.65625 17.2422 8.98438L18.0625 9.25C18.3438 9.35156 18.5234 9.57031 18.5234 9.85938C18.5234 10.1406 18.3438 10.3672 18.0625 10.4609L17.2422 10.7344C17.2109 11.0625 17.1484 11.3828 17.0703 11.6953L17.7578 12.2344C17.9688 12.4062 18.0625 12.6953 17.9688 12.9531C17.8828 13.2344 17.6172 13.3984 17.3438 13.3828L16.4688 13.3438C16.3203 13.6406 16.1641 13.9219 15.9844 14.1875L16.4453 14.9297C16.6016 15.1797 16.5703 15.4688 16.4062 15.6797C16.2031 15.9062 15.9219 15.9844 15.6562 15.8672L14.8594 15.5312C14.6172 15.7578 14.3594 15.9688 14.1094 16.1562L14.2891 17.0078C14.3516 17.2891 14.2344 17.5547 14 17.7031C13.7266 17.8516 13.4375 17.7969 13.2266 17.6172L12.5859 17.0469C12.2891 17.1641 11.9844 17.2812 11.6719 17.3672L11.5469 18.2344C11.5078 18.5156 11.3047 18.7344 11.0312 18.7812C10.7344 18.8281 10.4688 18.6953 10.3516 18.4453L9.94531 17.6719C9.78125 17.6797 9.61719 17.6875 9.46094 17.6875ZM9.44531 7.45312C10.4844 7.45312 11.375 8.10938 11.7109 9.03125H15.3281C14.9375 6.11719 12.4922 3.89062 9.46094 3.89062C8.64062 3.89062 7.86719 4.05469 7.16406 4.34375L8.99219 7.5C9.14062 7.46875 9.28906 7.45312 9.44531 7.45312ZM3.53906 9.85938C3.53906 11.7422 4.38281 13.4141 5.71875 14.5078L7.60156 11.4141C7.25 10.9922 7.03906 10.4531 7.03906 9.86719C7.03906 9.27344 7.25781 8.72656 7.60938 8.30469L5.78125 5.16406C4.40625 6.25 3.53906 7.94531 3.53906 9.85938ZM9.44531 10.7656C9.96094 10.7656 10.3516 10.375 10.3516 9.86719C10.3516 9.35938 9.96094 8.96094 9.44531 8.96094C8.94531 8.96094 8.54688 9.35938 8.54688 9.86719C8.54688 10.375 8.94531 10.7656 9.44531 10.7656ZM9.46094 15.8281C12.5078 15.8281 14.9609 13.5859 15.3359 10.6562H11.7266C11.4062 11.6016 10.5078 12.2734 9.44531 12.2734C9.28906 12.2734 9.125 12.2578 8.97656 12.2266L7.08594 15.3359C7.8125 15.6484 8.60938 15.8281 9.46094 15.8281Z"/>
                            </svg>
                            <p class="DLP_Text_Style_1" style="color: #007AFF;">${systemText[systemLanguage][6]}</p>
                        </div>
                    </div>
                    <div class="DLP_HStack_8">
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Main_Earn_Button_1_ID" style="outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; padding: 10px 0px 10px 10px;">
                            <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M-0.0078125 7.82031V6.33594C-0.0078125 5.15625 0.679688 4.55469 1.8125 4.55469H2.92188C2.47656 4.10156 2.20312 3.49219 2.20312 2.79688C2.20312 1.17188 3.51562 0 5.13281 0C6.38281 0 7.46875 0.734375 7.83594 2.03906C8.20312 0.734375 9.28906 0 10.5391 0C12.1562 0 13.4609 1.17188 13.4609 2.79688C13.4609 3.49219 13.1875 4.10156 12.7422 4.55469H13.8594C15.0156 4.55469 15.6797 5.15625 15.6797 6.33594V7.82031C15.6797 8.74219 15.125 9.23438 14.2188 9.23438H8.74219V4.55469H6.92969V3.52344C6.92969 2.50781 6.22656 1.76562 5.36719 1.76562C4.54688 1.76562 4.03125 2.28125 4.03125 3.07031C4.03125 3.89844 4.6875 4.55469 5.82812 4.55469H6.92969V9.23438H1.44531C0.546875 9.23438 -0.0078125 8.74219 -0.0078125 7.82031ZM10.3047 1.76562C9.44531 1.76562 8.74219 2.50781 8.74219 3.52344V4.55469H9.84375C10.9844 4.55469 11.6328 3.89844 11.6328 3.07031C11.6328 2.28125 11.125 1.76562 10.3047 1.76562ZM1.00781 14.8125V10.375H6.92969V16.9688H3.22656C1.82812 16.9688 1.00781 16.1953 1.00781 14.8125ZM8.74219 16.9688V10.375H14.6562V14.8125C14.6562 16.1953 13.8359 16.9688 12.4453 16.9688H8.74219Z" fill="white"/>
                            </svg>
                            <p class="DLP_Text_Style_1" style="color: #FFF;">Earn</p>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Secondary_YouTube_Button_1_ID" onclick="window.open('https://duolingopro.net/youtube', '_blank');" style="justify-content: center; flex: none; width: 40px; padding: 10px; outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: #FF3B30;">
                            <svg width="22" height="16" viewBox="0 0 22 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2043 1.0885C20.1084 1.33051 20.8189 2.041 21.0609 2.9451C21.4982 4.58216 21.5 7.99976 21.5 7.99976C21.5 7.99976 21.5 11.4174 21.0609 13.0544C20.8189 13.9585 20.1084 14.669 19.2043 14.911C17.5673 15.3501 11 15.3501 11 15.3501C11 15.3501 4.43274 15.3501 2.79568 14.911C1.89159 14.669 1.1811 13.9585 0.939084 13.0544C0.5 11.4174 0.5 7.99976 0.5 7.99976C0.5 7.99976 0.5 4.58216 0.939084 2.9451C1.1811 2.041 1.89159 1.33051 2.79568 1.0885C4.43274 0.649414 11 0.649414 11 0.649414C11 0.649414 17.5673 0.649414 19.2043 1.0885ZM14.3541 8.00005L8.89834 11.1497V4.85038L14.3541 8.00005Z"/>
                            </svg>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Secondary_Discord_Button_1_ID" onclick="window.open('https://duolingopro.net/discord', '_blank');" style="justify-content: center; flex: none; width: 40px; padding: 10px; outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: #5865F2;">
                            <svg width="22" height="16" viewBox="0 0 22 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.289 1.34C16.9296 0.714 15.4761 0.259052 13.9565 0C13.7699 0.332095 13.5519 0.77877 13.4016 1.1341C11.7862 0.894993 10.1857 0.894993 8.60001 1.1341C8.44972 0.77877 8.22674 0.332095 8.03844 0C6.51721 0.259052 5.06204 0.715671 3.70267 1.34331C0.960812 5.42136 0.21754 9.39811 0.589177 13.3184C2.40772 14.655 4.17011 15.467 5.90275 15.9984C6.33055 15.4189 6.71209 14.8028 7.04078 14.1536C6.41478 13.9195 5.81521 13.6306 5.24869 13.2952C5.39898 13.1856 5.546 13.071 5.68803 12.9531C9.14342 14.5438 12.8978 14.5438 16.3119 12.9531C16.4556 13.071 16.6026 13.1856 16.7512 13.2952C16.183 13.6322 15.5818 13.9211 14.9558 14.1553C15.2845 14.8028 15.6644 15.4205 16.0939 16C17.8282 15.4687 19.5922 14.6567 21.4107 13.3184C21.8468 8.77378 20.6658 4.83355 18.289 1.34ZM7.51153 10.9075C6.47426 10.9075 5.62361 9.95435 5.62361 8.7937C5.62361 7.63305 6.45609 6.67831 7.51153 6.67831C8.56699 6.67831 9.41761 7.63138 9.39945 8.7937C9.40109 9.95435 8.56699 10.9075 7.51153 10.9075ZM14.4884 10.9075C13.4511 10.9075 12.6005 9.95435 12.6005 8.7937C12.6005 7.63305 13.4329 6.67831 14.4884 6.67831C15.5438 6.67831 16.3945 7.63138 16.3763 8.7937C16.3763 9.95435 15.5438 10.9075 14.4884 10.9075Z"/>
                            </svg>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Secondary_GitHub_Button_1_ID" onclick="window.open('https://duolingopro.net/github', '_blank');" style="justify-content: center; flex: none; width: 40px; padding: 10px; outline: 2px solid rgba(255, 255, 255, 0.20); outline-offset: -2px; background: #333333;">
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.0087 0.5C5.19766 0.5 0.5 5.3125 0.5 11.2662C0.5 16.0253 3.50995 20.0538 7.68555 21.4797C8.2076 21.5868 8.39883 21.248 8.39883 20.963C8.39883 20.7134 8.38162 19.8578 8.38162 18.9664C5.45836 19.6082 4.84962 17.683 4.84962 17.683C4.37983 16.4353 3.68375 16.1146 3.68375 16.1146C2.72697 15.4551 3.75345 15.4551 3.75345 15.4551C4.81477 15.5264 5.37167 16.5602 5.37167 16.5602C6.31103 18.1999 7.82472 17.7366 8.43368 17.4514C8.52058 16.7562 8.79914 16.2749 9.09491 16.0076C6.7634 15.758 4.31035 14.8312 4.31035 10.6957C4.31035 9.51928 4.72765 8.55678 5.38888 7.80822C5.28456 7.54091 4.9191 6.43556 5.49342 4.95616C5.49342 4.95616 6.38073 4.67091 8.38141 6.06128C9.23797 5.82561 10.1213 5.70573 11.0087 5.70472C11.896 5.70472 12.8005 5.82963 13.6358 6.06128C15.6367 4.67091 16.524 4.95616 16.524 4.95616C17.0983 6.43556 16.7326 7.54091 16.6283 7.80822C17.3069 8.55678 17.707 9.51928 17.707 10.6957C17.707 14.8312 15.254 15.7401 12.905 16.0076C13.2879 16.3463 13.6183 16.9878 13.6183 18.0039C13.6183 19.4477 13.6011 20.6064 13.6011 20.9627C13.6011 21.248 13.7926 21.5868 14.3144 21.4799C18.49 20.0536 21.5 16.0253 21.5 11.2662C21.5172 5.3125 16.8023 0.5 11.0087 0.5Z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="DLP_HStack_Auto_Top DLP_NoSelect">
                    <div class="DLP_HStack_4">
                        <p class="DLP_Text_Style_2">Duolingo</p>
                        <p class="DLP_Text_Style_2" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PRO LE</p>
                    </div>
                    <p class="DLP_Text_Style_1" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${versionName}</p>
                </div>
                <p class="DLP_Text_Style_1" style="display: none; transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); opacity: 0; filter: blur(4px);">You are using an outdated version of Duolingo PRO. <br><br>Please update Duolingo PRO or turn on automatic updates. </p>
                <p class="DLP_Text_Style_1" style="display: none; transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); opacity: 0; filter: blur(4px);">Duolingo PRO failed to connect. This might be happening because of an issue on our system or your device. <br><br>Try updating Duolingo PRO. If the issue persists afterwards, join our Discord Server to get support. </p>
                <p class="DLP_Text_Style_1" style="display: none; transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); opacity: 0; filter: blur(4px);">We are currently unable to receive new requests due to high demand. Join our Discord Server to learn more. <br><br>You can help us handle more demand by donating on Patreon while getting exclusive features and higher limits. </p>
                <div class="DLP_VStack_8" id="DLP_Main_Inputs_2_Divider_1_ID">
                    <div class="DLP_VStack_8" id="DLP_Get_PATH_1_ID">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][17]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_2_ID" style="width: 48px; padding: 0;">
                                <svg id="DLP_Inset_Icon_1_ID" width="15" height="16" viewBox="0 0 15 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.49219 11.3594C0.875 11.3594 0.492188 11 0.492188 10.4297C0.492188 9.72656 0.960938 9.25 1.71875 9.25H3.5625L4.17188 6.17969H2.5C1.88281 6.17969 1.49219 5.80469 1.49219 5.24219C1.49219 4.53125 1.96875 4.05469 2.72656 4.05469H4.59375L5.17188 1.17188C5.30469 0.507812 5.67969 0.15625 6.35938 0.15625C6.97656 0.15625 7.35938 0.507812 7.35938 1.07031C7.35938 1.19531 7.33594 1.35938 7.32031 1.45312L6.79688 4.05469H9.71094L10.2891 1.17188C10.4219 0.507812 10.7891 0.15625 11.4688 0.15625C12.0781 0.15625 12.4609 0.507812 12.4609 1.07031C12.4609 1.19531 12.4453 1.35938 12.4297 1.45312L11.9062 4.05469H13.6875C14.3047 4.05469 14.6875 4.4375 14.6875 4.99219C14.6875 5.70312 14.2188 6.17969 13.4609 6.17969H11.4844L10.875 9.25H12.6797C13.2969 9.25 13.6797 9.64062 13.6797 10.1953C13.6797 10.8984 13.2109 11.3594 12.4453 11.3594H10.4531L9.82031 14.5469C9.6875 15.2266 9.27344 15.5547 8.61719 15.5547C8.00781 15.5547 7.63281 15.2109 7.63281 14.6406C7.63281 14.5391 7.64844 14.375 7.67188 14.2656L8.25 11.3594H5.34375L4.71094 14.5469C4.57812 15.2266 4.15625 15.5547 3.51562 15.5547C2.90625 15.5547 2.52344 15.2109 2.52344 14.6406C2.52344 14.5391 2.53906 14.375 2.5625 14.2656L3.14062 11.3594H1.49219ZM5.76562 9.25H8.67188L9.28906 6.17969H6.375L5.76562 9.25Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="20" height="12" viewBox="0 0 20 12" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.30859 11.789C0.683594 11.789 0.191406 11.3359 0.191406 10.7656C0.191406 10.4765 0.285156 10.2265 0.511719 9.91407L3.32422 5.99219V5.92969L0.605469 2.22656C0.347656 1.88281 0.261719 1.62501 0.261719 1.32032C0.261719 0.679687 0.769532 0.210938 1.45703 0.210938C1.90234 0.210938 2.21484 0.40625 2.51953 0.867187L4.93359 4.42969H4.99609L7.48828 0.789063C7.76172 0.382813 7.99609 0.210938 8.44922 0.210938C9.0664 0.210938 9.59765 0.65625 9.59765 1.21874C9.59765 1.52343 9.51172 1.77343 9.28515 2.06251L6.35546 5.97656V6.03125L9.19922 9.86718C9.41796 10.1484 9.51172 10.414 9.51172 10.7265C9.51172 11.3437 9.03515 11.789 8.3789 11.789C7.94922 11.789 7.66015 11.6172 7.35546 11.2031L4.83984 7.69531H4.77734L2.30078 11.2109C2.0039 11.6406 1.7539 11.789 1.30859 11.789ZM12.496 11.789C11.7539 11.789 11.3164 11.3359 11.3164 10.5625V1.59374C11.3164 0.820313 11.7539 0.367187 12.496 0.367187H15.9023C18.2148 0.367187 19.8086 1.90624 19.8086 4.22656C19.8086 6.53906 18.1601 8.08594 15.7851 8.08594H13.6757V10.5625C13.6757 11.3359 13.2382 11.789 12.496 11.789ZM13.6757 6.24219H15.2695C16.621 6.24219 17.4101 5.52344 17.4101 4.23438C17.4101 2.95312 16.6289 2.23438 15.2773 2.23438H13.6757V6.24219Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="24" height="12" viewBox="0 0 24 12" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.898438 5.85938C0.898438 2.69531 2.94531 0.609375 5.97656 0.609375C7.53125 0.609375 8.875 1.26562 10.2578 2.60938L11.9688 4.25781L13.6719 2.60938C15.0547 1.26562 16.3984 0.609375 17.9531 0.609375C20.9844 0.609375 23.0312 2.69531 23.0312 5.85938C23.0312 9.01562 20.9844 11.1016 17.9531 11.1016C16.3984 11.1016 15.0547 10.4531 13.6719 9.10938L11.9688 7.45312L10.2578 9.10938C8.875 10.4531 7.53125 11.1016 5.97656 11.1016C2.94531 11.1016 0.898438 9.01562 0.898438 5.85938ZM3.21875 5.85938C3.21875 7.63281 4.32031 8.78125 5.97656 8.78125C6.875 8.78125 7.70312 8.34375 8.63281 7.46094L10.3281 5.85938L8.63281 4.25781C7.70312 3.375 6.875 2.92969 5.97656 2.92969C4.32031 2.92969 3.21875 4.07812 3.21875 5.85938ZM13.6016 5.85938L15.2969 7.46094C16.2344 8.34375 17.0547 8.78125 17.9531 8.78125C19.6094 8.78125 20.7109 7.63281 20.7109 5.85938C20.7109 4.07812 19.6094 2.92969 17.9531 2.92969C17.0547 2.92969 16.2266 3.375 15.2969 4.25781L13.6016 5.85938Z"/>
                                </svg>
                            </div>
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; opacity: 0.5; display: none;">PATH</p>
                                <svg width="15" height="16" viewBox="0 0 15 16" fill="#007AFF" opacity="0.5" xmlns="http://www.w3.org/2000/svg" display="none">
                                    <path d="M1.39844 11.3594C0.78125 11.3594 0.398438 11 0.398438 10.4297C0.398438 9.72656 0.867188 9.25 1.625 9.25H3.46875L4.07812 6.17969H2.40625C1.78906 6.17969 1.39844 5.80469 1.39844 5.24219C1.39844 4.53125 1.875 4.05469 2.63281 4.05469H4.5L5.07812 1.17188C5.21094 0.507812 5.58594 0.15625 6.26562 0.15625C6.88281 0.15625 7.26562 0.507812 7.26562 1.07031C7.26562 1.19531 7.24219 1.35938 7.22656 1.45312L6.70312 4.05469H9.61719L10.1953 1.17188C10.3281 0.507812 10.6953 0.15625 11.375 0.15625C11.9844 0.15625 12.3672 0.507812 12.3672 1.07031C12.3672 1.19531 12.3516 1.35938 12.3359 1.45312L11.8125 4.05469H13.5938C14.2109 4.05469 14.5938 4.4375 14.5938 4.99219C14.5938 5.70312 14.125 6.17969 13.3672 6.17969H11.3906L10.7812 9.25H12.5859C13.2031 9.25 13.5859 9.64062 13.5859 10.1953C13.5859 10.8984 13.1172 11.3594 12.3516 11.3594H10.3594L9.72656 14.5469C9.59375 15.2266 9.17969 15.5547 8.52344 15.5547C7.91406 15.5547 7.53906 15.2109 7.53906 14.6406C7.53906 14.5391 7.55469 14.375 7.57812 14.2656L8.15625 11.3594H5.25L4.61719 14.5469C4.48438 15.2266 4.0625 15.5547 3.42188 15.5547C2.8125 15.5547 2.42969 15.2109 2.42969 14.6406C2.42969 14.5391 2.44531 14.375 2.46875 14.2656L3.04688 11.3594H1.39844ZM5.67188 9.25H8.57812L9.19531 6.17969H6.28125L5.67188 9.25Z"/>
                                </svg>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][18]}</p>
                                <svg id="DLP_Inset_Icon_1_ID" width="13" height="16" viewBox="0 0 13 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M-0.0078125 13.5391V2.17188C-0.0078125 1.17969 0.609375 0.671875 1.34375 0.671875C1.64844 0.671875 1.97656 0.757812 2.29688 0.945312L11.75 6.45312C12.4688 6.86719 12.8203 7.25781 12.8203 7.85938C12.8203 8.46094 12.4688 8.84375 11.75 9.26562L2.29688 14.7734C1.97656 14.9531 1.64844 15.0469 1.34375 15.0469C0.609375 15.0469 -0.0078125 14.5391 -0.0078125 13.5391Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="11" height="15" viewBox="0 0 11 15" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.24219 14.8984C0.398438 14.8984 -0.0078125 14.4766 -0.0078125 13.6484V2.07031C-0.0078125 1.24219 0.414062 0.820312 1.24219 0.820312H3.17188C4 0.820312 4.42188 1.24219 4.42188 2.07031V13.6484C4.42188 14.4766 4 14.8984 3.17188 14.8984H1.24219ZM7.57031 14.8984C6.72656 14.8984 6.32031 14.4766 6.32031 13.6484V2.07031C6.32031 1.24219 6.74219 0.820312 7.57031 0.820312H9.5C10.3281 0.820312 10.75 1.24219 10.75 2.07031V13.6484C10.75 14.4766 10.3281 14.8984 9.5 14.8984H7.57031Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_4_ID" display="none" width="18" height="16" viewBox="0 0 18 16" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_PRACTICE_1_ID">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][19]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_2_ID" style="width: 48px; padding: 0;">
                                <svg id="DLP_Inset_Icon_1_ID" width="15" height="16" viewBox="0 0 15 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.49219 11.3594C0.875 11.3594 0.492188 11 0.492188 10.4297C0.492188 9.72656 0.960938 9.25 1.71875 9.25H3.5625L4.17188 6.17969H2.5C1.88281 6.17969 1.49219 5.80469 1.49219 5.24219C1.49219 4.53125 1.96875 4.05469 2.72656 4.05469H4.59375L5.17188 1.17188C5.30469 0.507812 5.67969 0.15625 6.35938 0.15625C6.97656 0.15625 7.35938 0.507812 7.35938 1.07031C7.35938 1.19531 7.33594 1.35938 7.32031 1.45312L6.79688 4.05469H9.71094L10.2891 1.17188C10.4219 0.507812 10.7891 0.15625 11.4688 0.15625C12.0781 0.15625 12.4609 0.507812 12.4609 1.07031C12.4609 1.19531 12.4453 1.35938 12.4297 1.45312L11.9062 4.05469H13.6875C14.3047 4.05469 14.6875 4.4375 14.6875 4.99219C14.6875 5.70312 14.2188 6.17969 13.4609 6.17969H11.4844L10.875 9.25H12.6797C13.2969 9.25 13.6797 9.64062 13.6797 10.1953C13.6797 10.8984 13.2109 11.3594 12.4453 11.3594H10.4531L9.82031 14.5469C9.6875 15.2266 9.27344 15.5547 8.61719 15.5547C8.00781 15.5547 7.63281 15.2109 7.63281 14.6406C7.63281 14.5391 7.64844 14.375 7.67188 14.2656L8.25 11.3594H5.34375L4.71094 14.5469C4.57812 15.2266 4.15625 15.5547 3.51562 15.5547C2.90625 15.5547 2.52344 15.2109 2.52344 14.6406C2.52344 14.5391 2.53906 14.375 2.5625 14.2656L3.14062 11.3594H1.49219ZM5.76562 9.25H8.67188L9.28906 6.17969H6.375L5.76562 9.25Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="20" height="12" viewBox="0 0 20 12" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.30859 11.789C0.683594 11.789 0.191406 11.3359 0.191406 10.7656C0.191406 10.4765 0.285156 10.2265 0.511719 9.91407L3.32422 5.99219V5.92969L0.605469 2.22656C0.347656 1.88281 0.261719 1.62501 0.261719 1.32032C0.261719 0.679687 0.769532 0.210938 1.45703 0.210938C1.90234 0.210938 2.21484 0.40625 2.51953 0.867187L4.93359 4.42969H4.99609L7.48828 0.789063C7.76172 0.382813 7.99609 0.210938 8.44922 0.210938C9.0664 0.210938 9.59765 0.65625 9.59765 1.21874C9.59765 1.52343 9.51172 1.77343 9.28515 2.06251L6.35546 5.97656V6.03125L9.19922 9.86718C9.41796 10.1484 9.51172 10.414 9.51172 10.7265C9.51172 11.3437 9.03515 11.789 8.3789 11.789C7.94922 11.789 7.66015 11.6172 7.35546 11.2031L4.83984 7.69531H4.77734L2.30078 11.2109C2.0039 11.6406 1.7539 11.789 1.30859 11.789ZM12.496 11.789C11.7539 11.789 11.3164 11.3359 11.3164 10.5625V1.59374C11.3164 0.820313 11.7539 0.367187 12.496 0.367187H15.9023C18.2148 0.367187 19.8086 1.90624 19.8086 4.22656C19.8086 6.53906 18.1601 8.08594 15.7851 8.08594H13.6757V10.5625C13.6757 11.3359 13.2382 11.789 12.496 11.789ZM13.6757 6.24219H15.2695C16.621 6.24219 17.4101 5.52344 17.4101 4.23438C17.4101 2.95312 16.6289 2.23438 15.2773 2.23438H13.6757V6.24219Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="24" height="12" viewBox="0 0 24 12" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.898438 5.85938C0.898438 2.69531 2.94531 0.609375 5.97656 0.609375C7.53125 0.609375 8.875 1.26562 10.2578 2.60938L11.9688 4.25781L13.6719 2.60938C15.0547 1.26562 16.3984 0.609375 17.9531 0.609375C20.9844 0.609375 23.0312 2.69531 23.0312 5.85938C23.0312 9.01562 20.9844 11.1016 17.9531 11.1016C16.3984 11.1016 15.0547 10.4531 13.6719 9.10938L11.9688 7.45312L10.2578 9.10938C8.875 10.4531 7.53125 11.1016 5.97656 11.1016C2.94531 11.1016 0.898438 9.01562 0.898438 5.85938ZM3.21875 5.85938C3.21875 7.63281 4.32031 8.78125 5.97656 8.78125C6.875 8.78125 7.70312 8.34375 8.63281 7.46094L10.3281 5.85938L8.63281 4.25781C7.70312 3.375 6.875 2.92969 5.97656 2.92969C4.32031 2.92969 3.21875 4.07812 3.21875 5.85938ZM13.6016 5.85938L15.2969 7.46094C16.2344 8.34375 17.0547 8.78125 17.9531 8.78125C19.6094 8.78125 20.7109 7.63281 20.7109 5.85938C20.7109 4.07812 19.6094 2.92969 17.9531 2.92969C17.0547 2.92969 16.2266 3.375 15.2969 4.25781L13.6016 5.85938Z"/>
                                </svg>
                            </div>
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; opacity: 0.5; display: none;">PRACTICE</p>
                                <svg width="15" height="16" viewBox="0 0 15 16" fill="#007AFF" opacity="0.5" xmlns="http://www.w3.org/2000/svg" display="none">
                                    <path d="M1.39844 11.3594C0.78125 11.3594 0.398438 11 0.398438 10.4297C0.398438 9.72656 0.867188 9.25 1.625 9.25H3.46875L4.07812 6.17969H2.40625C1.78906 6.17969 1.39844 5.80469 1.39844 5.24219C1.39844 4.53125 1.875 4.05469 2.63281 4.05469H4.5L5.07812 1.17188C5.21094 0.507812 5.58594 0.15625 6.26562 0.15625C6.88281 0.15625 7.26562 0.507812 7.26562 1.07031C7.26562 1.19531 7.24219 1.35938 7.22656 1.45312L6.70312 4.05469H9.61719L10.1953 1.17188C10.3281 0.507812 10.6953 0.15625 11.375 0.15625C11.9844 0.15625 12.3672 0.507812 12.3672 1.07031C12.3672 1.19531 12.3516 1.35938 12.3359 1.45312L11.8125 4.05469H13.5938C14.2109 4.05469 14.5938 4.4375 14.5938 4.99219C14.5938 5.70312 14.125 6.17969 13.3672 6.17969H11.3906L10.7812 9.25H12.5859C13.2031 9.25 13.5859 9.64062 13.5859 10.1953C13.5859 10.8984 13.1172 11.3594 12.3516 11.3594H10.3594L9.72656 14.5469C9.59375 15.2266 9.17969 15.5547 8.52344 15.5547C7.91406 15.5547 7.53906 15.2109 7.53906 14.6406C7.53906 14.5391 7.55469 14.375 7.57812 14.2656L8.15625 11.3594H5.25L4.61719 14.5469C4.48438 15.2266 4.0625 15.5547 3.42188 15.5547C2.8125 15.5547 2.42969 15.2109 2.42969 14.6406C2.42969 14.5391 2.44531 14.375 2.46875 14.2656L3.04688 11.3594H1.39844ZM5.67188 9.25H8.57812L9.19531 6.17969H6.28125L5.67188 9.25Z"/>
                                </svg>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][18]}</p>
                                <svg id="DLP_Inset_Icon_1_ID" width="13" height="16" viewBox="0 0 13 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M-0.0078125 13.5391V2.17188C-0.0078125 1.17969 0.609375 0.671875 1.34375 0.671875C1.64844 0.671875 1.97656 0.757812 2.29688 0.945312L11.75 6.45312C12.4688 6.86719 12.8203 7.25781 12.8203 7.85938C12.8203 8.46094 12.4688 8.84375 11.75 9.26562L2.29688 14.7734C1.97656 14.9531 1.64844 15.0469 1.34375 15.0469C0.609375 15.0469 -0.0078125 14.5391 -0.0078125 13.5391Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="11" height="15" viewBox="0 0 11 15" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.24219 14.8984C0.398438 14.8984 -0.0078125 14.4766 -0.0078125 13.6484V2.07031C-0.0078125 1.24219 0.414062 0.820312 1.24219 0.820312H3.17188C4 0.820312 4.42188 1.24219 4.42188 2.07031V13.6484C4.42188 14.4766 4 14.8984 3.17188 14.8984H1.24219ZM7.57031 14.8984C6.72656 14.8984 6.32031 14.4766 6.32031 13.6484V2.07031C6.32031 1.24219 6.74219 0.820312 7.57031 0.820312H9.5C10.3281 0.820312 10.75 1.24219 10.75 2.07031V13.6484C10.75 14.4766 10.3281 14.8984 9.5 14.8984H7.57031Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_4_ID" display="none" width="18" height="16" viewBox="0 0 18 16" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_LISTEN_1_ID" style="display: none;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][21]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_2_ID" style="width: 48px; padding: 0;">
                                <svg id="DLP_Inset_Icon_1_ID" width="15" height="16" viewBox="0 0 15 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.49219 11.3594C0.875 11.3594 0.492188 11 0.492188 10.4297C0.492188 9.72656 0.960938 9.25 1.71875 9.25H3.5625L4.17188 6.17969H2.5C1.88281 6.17969 1.49219 5.80469 1.49219 5.24219C1.49219 4.53125 1.96875 4.05469 2.72656 4.05469H4.59375L5.17188 1.17188C5.30469 0.507812 5.67969 0.15625 6.35938 0.15625C6.97656 0.15625 7.35938 0.507812 7.35938 1.07031C7.35938 1.19531 7.33594 1.35938 7.32031 1.45312L6.79688 4.05469H9.71094L10.2891 1.17188C10.4219 0.507812 10.7891 0.15625 11.4688 0.15625C12.0781 0.15625 12.4609 0.507812 12.4609 1.07031C12.4609 1.19531 12.4453 1.35938 12.4297 1.45312L11.9062 4.05469H13.6875C14.3047 4.05469 14.6875 4.4375 14.6875 4.99219C14.6875 5.70312 14.2188 6.17969 13.4609 6.17969H11.4844L10.875 9.25H12.6797C13.2969 9.25 13.6797 9.64062 13.6797 10.1953C13.6797 10.8984 13.2109 11.3594 12.4453 11.3594H10.4531L9.82031 14.5469C9.6875 15.2266 9.27344 15.5547 8.61719 15.5547C8.00781 15.5547 7.63281 15.2109 7.63281 14.6406C7.63281 14.5391 7.64844 14.375 7.67188 14.2656L8.25 11.3594H5.34375L4.71094 14.5469C4.57812 15.2266 4.15625 15.5547 3.51562 15.5547C2.90625 15.5547 2.52344 15.2109 2.52344 14.6406C2.52344 14.5391 2.53906 14.375 2.5625 14.2656L3.14062 11.3594H1.49219ZM5.76562 9.25H8.67188L9.28906 6.17969H6.375L5.76562 9.25Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="20" height="12" viewBox="0 0 20 12" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.30859 11.789C0.683594 11.789 0.191406 11.3359 0.191406 10.7656C0.191406 10.4765 0.285156 10.2265 0.511719 9.91407L3.32422 5.99219V5.92969L0.605469 2.22656C0.347656 1.88281 0.261719 1.62501 0.261719 1.32032C0.261719 0.679687 0.769532 0.210938 1.45703 0.210938C1.90234 0.210938 2.21484 0.40625 2.51953 0.867187L4.93359 4.42969H4.99609L7.48828 0.789063C7.76172 0.382813 7.99609 0.210938 8.44922 0.210938C9.0664 0.210938 9.59765 0.65625 9.59765 1.21874C9.59765 1.52343 9.51172 1.77343 9.28515 2.06251L6.35546 5.97656V6.03125L9.19922 9.86718C9.41796 10.1484 9.51172 10.414 9.51172 10.7265C9.51172 11.3437 9.03515 11.789 8.3789 11.789C7.94922 11.789 7.66015 11.6172 7.35546 11.2031L4.83984 7.69531H4.77734L2.30078 11.2109C2.0039 11.6406 1.7539 11.789 1.30859 11.789ZM12.496 11.789C11.7539 11.789 11.3164 11.3359 11.3164 10.5625V1.59374C11.3164 0.820313 11.7539 0.367187 12.496 0.367187H15.9023C18.2148 0.367187 19.8086 1.90624 19.8086 4.22656C19.8086 6.53906 18.1601 8.08594 15.7851 8.08594H13.6757V10.5625C13.6757 11.3359 13.2382 11.789 12.496 11.789ZM13.6757 6.24219H15.2695C16.621 6.24219 17.4101 5.52344 17.4101 4.23438C17.4101 2.95312 16.6289 2.23438 15.2773 2.23438H13.6757V6.24219Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="24" height="12" viewBox="0 0 24 12" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.898438 5.85938C0.898438 2.69531 2.94531 0.609375 5.97656 0.609375C7.53125 0.609375 8.875 1.26562 10.2578 2.60938L11.9688 4.25781L13.6719 2.60938C15.0547 1.26562 16.3984 0.609375 17.9531 0.609375C20.9844 0.609375 23.0312 2.69531 23.0312 5.85938C23.0312 9.01562 20.9844 11.1016 17.9531 11.1016C16.3984 11.1016 15.0547 10.4531 13.6719 9.10938L11.9688 7.45312L10.2578 9.10938C8.875 10.4531 7.53125 11.1016 5.97656 11.1016C2.94531 11.1016 0.898438 9.01562 0.898438 5.85938ZM3.21875 5.85938C3.21875 7.63281 4.32031 8.78125 5.97656 8.78125C6.875 8.78125 7.70312 8.34375 8.63281 7.46094L10.3281 5.85938L8.63281 4.25781C7.70312 3.375 6.875 2.92969 5.97656 2.92969C4.32031 2.92969 3.21875 4.07812 3.21875 5.85938ZM13.6016 5.85938L15.2969 7.46094C16.2344 8.34375 17.0547 8.78125 17.9531 8.78125C19.6094 8.78125 20.7109 7.63281 20.7109 5.85938C20.7109 4.07812 19.6094 2.92969 17.9531 2.92969C17.0547 2.92969 16.2266 3.375 15.2969 4.25781L13.6016 5.85938Z"/>
                                </svg>
                            </div>
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; opacity: 0.5; display: none;">PATH</p>
                                <svg width="15" height="16" viewBox="0 0 15 16" fill="#007AFF" opacity="0.5" xmlns="http://www.w3.org/2000/svg" display="none">
                                    <path d="M1.39844 11.3594C0.78125 11.3594 0.398438 11 0.398438 10.4297C0.398438 9.72656 0.867188 9.25 1.625 9.25H3.46875L4.07812 6.17969H2.40625C1.78906 6.17969 1.39844 5.80469 1.39844 5.24219C1.39844 4.53125 1.875 4.05469 2.63281 4.05469H4.5L5.07812 1.17188C5.21094 0.507812 5.58594 0.15625 6.26562 0.15625C6.88281 0.15625 7.26562 0.507812 7.26562 1.07031C7.26562 1.19531 7.24219 1.35938 7.22656 1.45312L6.70312 4.05469H9.61719L10.1953 1.17188C10.3281 0.507812 10.6953 0.15625 11.375 0.15625C11.9844 0.15625 12.3672 0.507812 12.3672 1.07031C12.3672 1.19531 12.3516 1.35938 12.3359 1.45312L11.8125 4.05469H13.5938C14.2109 4.05469 14.5938 4.4375 14.5938 4.99219C14.5938 5.70312 14.125 6.17969 13.3672 6.17969H11.3906L10.7812 9.25H12.5859C13.2031 9.25 13.5859 9.64062 13.5859 10.1953C13.5859 10.8984 13.1172 11.3594 12.3516 11.3594H10.3594L9.72656 14.5469C9.59375 15.2266 9.17969 15.5547 8.52344 15.5547C7.91406 15.5547 7.53906 15.2109 7.53906 14.6406C7.53906 14.5391 7.55469 14.375 7.57812 14.2656L8.15625 11.3594H5.25L4.61719 14.5469C4.48438 15.2266 4.0625 15.5547 3.42188 15.5547C2.8125 15.5547 2.42969 15.2109 2.42969 14.6406C2.42969 14.5391 2.44531 14.375 2.46875 14.2656L3.04688 11.3594H1.39844ZM5.67188 9.25H8.57812L9.19531 6.17969H6.28125L5.67188 9.25Z"/>
                                </svg>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][18]}</p>
                                <svg id="DLP_Inset_Icon_1_ID" width="13" height="16" viewBox="0 0 13 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M-0.0078125 13.5391V2.17188C-0.0078125 1.17969 0.609375 0.671875 1.34375 0.671875C1.64844 0.671875 1.97656 0.757812 2.29688 0.945312L11.75 6.45312C12.4688 6.86719 12.8203 7.25781 12.8203 7.85938C12.8203 8.46094 12.4688 8.84375 11.75 9.26562L2.29688 14.7734C1.97656 14.9531 1.64844 15.0469 1.34375 15.0469C0.609375 15.0469 -0.0078125 14.5391 -0.0078125 13.5391Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="11" height="15" viewBox="0 0 11 15" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.24219 14.8984C0.398438 14.8984 -0.0078125 14.4766 -0.0078125 13.6484V2.07031C-0.0078125 1.24219 0.414062 0.820312 1.24219 0.820312H3.17188C4 0.820312 4.42188 1.24219 4.42188 2.07031V13.6484C4.42188 14.4766 4 14.8984 3.17188 14.8984H1.24219ZM7.57031 14.8984C6.72656 14.8984 6.32031 14.4766 6.32031 13.6484V2.07031C6.32031 1.24219 6.74219 0.820312 7.57031 0.820312H9.5C10.3281 0.820312 10.75 1.24219 10.75 2.07031V13.6484C10.75 14.4766 10.3281 14.8984 9.5 14.8984H7.57031Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_4_ID" display="none" width="18" height="16" viewBox="0 0 18 16" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_LESSON_1_ID" style="display: none;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][23]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; opacity: 0.5; display: none;">PRACTICE</p>
                                <svg width="15" height="16" viewBox="0 0 15 16" fill="#007AFF" opacity="0.5" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.39844 11.3594C0.78125 11.3594 0.398438 11 0.398438 10.4297C0.398438 9.72656 0.867188 9.25 1.625 9.25H3.46875L4.07812 6.17969H2.40625C1.78906 6.17969 1.39844 5.80469 1.39844 5.24219C1.39844 4.53125 1.875 4.05469 2.63281 4.05469H4.5L5.07812 1.17188C5.21094 0.507812 5.58594 0.15625 6.26562 0.15625C6.88281 0.15625 7.26562 0.507812 7.26562 1.07031C7.26562 1.19531 7.24219 1.35938 7.22656 1.45312L6.70312 4.05469H9.61719L10.1953 1.17188C10.3281 0.507812 10.6953 0.15625 11.375 0.15625C11.9844 0.15625 12.3672 0.507812 12.3672 1.07031C12.3672 1.19531 12.3516 1.35938 12.3359 1.45312L11.8125 4.05469H13.5938C14.2109 4.05469 14.5938 4.4375 14.5938 4.99219C14.5938 5.70312 14.125 6.17969 13.3672 6.17969H11.3906L10.7812 9.25H12.5859C13.2031 9.25 13.5859 9.64062 13.5859 10.1953C13.5859 10.8984 13.1172 11.3594 12.3516 11.3594H10.3594L9.72656 14.5469C9.59375 15.2266 9.17969 15.5547 8.52344 15.5547C7.91406 15.5547 7.53906 15.2109 7.53906 14.6406C7.53906 14.5391 7.55469 14.375 7.57812 14.2656L8.15625 11.3594H5.25L4.61719 14.5469C4.48438 15.2266 4.0625 15.5547 3.42188 15.5547C2.8125 15.5547 2.42969 15.2109 2.42969 14.6406C2.42969 14.5391 2.44531 14.375 2.46875 14.2656L3.04688 11.3594H1.39844ZM5.67188 9.25H8.57812L9.19531 6.17969H6.28125L5.67188 9.25Z"/>
                                </svg>
                                <div style="display: flex; align-items: center; gap: 8px; width: 100%; justify-content: flex-end;">
                                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; opacity: 0.5;">Unit:</p>
                                    <input type="text" value="1" placeholder="1" id="DLP_Inset_Input_3_ID" class="DLP_Input_Input_Style_1" style="width: 30px;">
                                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; opacity: 0.5;">Lesson:</p>
                                    <input type="text" value="1" placeholder="1" id="DLP_Inset_Input_4_ID" class="DLP_Input_Input_Style_1" style="width: 30px;">
                                </div>
                            </div>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_2_ID" style="width: 48px; padding: 0;">
                                <svg id="DLP_Inset_Icon_1_ID" width="15" height="16" viewBox="0 0 15 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.49219 11.3594C0.875 11.3594 0.492188 11 0.492188 10.4297C0.492188 9.72656 0.960938 9.25 1.71875 9.25H3.5625L4.17188 6.17969H2.5C1.88281 6.17969 1.49219 5.80469 1.49219 5.24219C1.49219 4.53125 1.96875 4.05469 2.72656 4.05469H4.59375L5.17188 1.17188C5.30469 0.507812 5.67969 0.15625 6.35938 0.15625C6.97656 0.15625 7.35938 0.507812 7.35938 1.07031C7.35938 1.19531 7.33594 1.35938 7.32031 1.45312L6.79688 4.05469H9.71094L10.2891 1.17188C10.4219 0.507812 10.7891 0.15625 11.4688 0.15625C12.0781 0.15625 12.4609 0.507812 12.4609 1.07031C12.4609 1.19531 12.4453 1.35938 12.4297 1.45312L11.9062 4.05469H13.6875C14.3047 4.05469 14.6875 4.4375 14.6875 4.99219C14.6875 5.70312 14.2188 6.17969 13.4609 6.17969H11.4844L10.875 9.25H12.6797C13.2969 9.25 13.6797 9.64062 13.6797 10.1953C13.6797 10.8984 13.2109 11.3594 12.4453 11.3594H10.4531L9.82031 14.5469C9.6875 15.2266 9.27344 15.5547 8.61719 15.5547C8.00781 15.5547 7.63281 15.2109 7.63281 14.6406C7.63281 14.5391 7.64844 14.375 7.67188 14.2656L8.25 11.3594H5.34375L4.71094 14.5469C4.57812 15.2266 4.15625 15.5547 3.51562 15.5547C2.90625 15.5547 2.52344 15.2109 2.52344 14.6406C2.52344 14.5391 2.53906 14.375 2.5625 14.2656L3.14062 11.3594H1.49219ZM5.76562 9.25H8.67188L9.28906 6.17969H6.375L5.76562 9.25Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="20" height="12" viewBox="0 0 20 12" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.30859 11.789C0.683594 11.789 0.191406 11.3359 0.191406 10.7656C0.191406 10.4765 0.285156 10.2265 0.511719 9.91407L3.32422 5.99219V5.92969L0.605469 2.22656C0.347656 1.88281 0.261719 1.62501 0.261719 1.32032C0.261719 0.679687 0.769532 0.210938 1.45703 0.210938C1.90234 0.210938 2.21484 0.40625 2.51953 0.867187L4.93359 4.42969H4.99609L7.48828 0.789063C7.76172 0.382813 7.99609 0.210938 8.44922 0.210938C9.0664 0.210938 9.59765 0.65625 9.59765 1.21874C9.59765 1.52343 9.51172 1.77343 9.28515 2.06251L6.35546 5.97656V6.03125L9.19922 9.86718C9.41796 10.1484 9.51172 10.414 9.51172 10.7265C9.51172 11.3437 9.03515 11.789 8.3789 11.789C7.94922 11.789 7.66015 11.6172 7.35546 11.2031L4.83984 7.69531H4.77734L2.30078 11.2109C2.0039 11.6406 1.7539 11.789 1.30859 11.789ZM12.496 11.789C11.7539 11.789 11.3164 11.3359 11.3164 10.5625V1.59374C11.3164 0.820313 11.7539 0.367187 12.496 0.367187H15.9023C18.2148 0.367187 19.8086 1.90624 19.8086 4.22656C19.8086 6.53906 18.1601 8.08594 15.7851 8.08594H13.6757V10.5625C13.6757 11.3359 13.2382 11.789 12.496 11.789ZM13.6757 6.24219H15.2695C16.621 6.24219 17.4101 5.52344 17.4101 4.23438C17.4101 2.95312 16.6289 2.23438 15.2773 2.23438H13.6757V6.24219Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="24" height="12" viewBox="0 0 24 12" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.898438 5.85938C0.898438 2.69531 2.94531 0.609375 5.97656 0.609375C7.53125 0.609375 8.875 1.26562 10.2578 2.60938L11.9688 4.25781L13.6719 2.60938C15.0547 1.26562 16.3984 0.609375 17.9531 0.609375C20.9844 0.609375 23.0312 2.69531 23.0312 5.85938C23.0312 9.01562 20.9844 11.1016 17.9531 11.1016C16.3984 11.1016 15.0547 10.4531 13.6719 9.10938L11.9688 7.45312L10.2578 9.10938C8.875 10.4531 7.53125 11.1016 5.97656 11.1016C2.94531 11.1016 0.898438 9.01562 0.898438 5.85938ZM3.21875 5.85938C3.21875 7.63281 4.32031 8.78125 5.97656 8.78125C6.875 8.78125 7.70312 8.34375 8.63281 7.46094L10.3281 5.85938L8.63281 4.25781C7.70312 3.375 6.875 2.92969 5.97656 2.92969C4.32031 2.92969 3.21875 4.07812 3.21875 5.85938ZM13.6016 5.85938L15.2969 7.46094C16.2344 8.34375 17.0547 8.78125 17.9531 8.78125C19.6094 8.78125 20.7109 7.63281 20.7109 5.85938C20.7109 4.07812 19.6094 2.92969 17.9531 2.92969C17.0547 2.92969 16.2266 3.375 15.2969 4.25781L13.6016 5.85938Z"/>
                                </svg>
                            </div>
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; opacity: 0.5; display: none;">PRACTICE</p>
                                <svg width="15" height="16" viewBox="0 0 15 16" fill="#007AFF" opacity="0.5" xmlns="http://www.w3.org/2000/svg" display="none">
                                    <path d="M1.39844 11.3594C0.78125 11.3594 0.398438 11 0.398438 10.4297C0.398438 9.72656 0.867188 9.25 1.625 9.25H3.46875L4.07812 6.17969H2.40625C1.78906 6.17969 1.39844 5.80469 1.39844 5.24219C1.39844 4.53125 1.875 4.05469 2.63281 4.05469H4.5L5.07812 1.17188C5.21094 0.507812 5.58594 0.15625 6.26562 0.15625C6.88281 0.15625 7.26562 0.507812 7.26562 1.07031C7.26562 1.19531 7.24219 1.35938 7.22656 1.45312L6.70312 4.05469H9.61719L10.1953 1.17188C10.3281 0.507812 10.6953 0.15625 11.375 0.15625C11.9844 0.15625 12.3672 0.507812 12.3672 1.07031C12.3672 1.19531 12.3516 1.35938 12.3359 1.45312L11.8125 4.05469H13.5938C14.2109 4.05469 14.5938 4.4375 14.5938 4.99219C14.5938 5.70312 14.125 6.17969 13.3672 6.17969H11.3906L10.7812 9.25H12.5859C13.2031 9.25 13.5859 9.64062 13.5859 10.1953C13.5859 10.8984 13.1172 11.3594 12.3516 11.3594H10.3594L9.72656 14.5469C9.59375 15.2266 9.17969 15.5547 8.52344 15.5547C7.91406 15.5547 7.53906 15.2109 7.53906 14.6406C7.53906 14.5391 7.55469 14.375 7.57812 14.2656L8.15625 11.3594H5.25L4.61719 14.5469C4.48438 15.2266 4.0625 15.5547 3.42188 15.5547C2.8125 15.5547 2.42969 15.2109 2.42969 14.6406C2.42969 14.5391 2.44531 14.375 2.46875 14.2656L3.04688 11.3594H1.39844ZM5.67188 9.25H8.57812L9.19531 6.17969H6.28125L5.67188 9.25Z"/>
                                </svg>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][18]}</p>
                                <svg id="DLP_Inset_Icon_1_ID" width="13" height="16" viewBox="0 0 13 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M-0.0078125 13.5391V2.17188C-0.0078125 1.17969 0.609375 0.671875 1.34375 0.671875C1.64844 0.671875 1.97656 0.757812 2.29688 0.945312L11.75 6.45312C12.4688 6.86719 12.8203 7.25781 12.8203 7.85938C12.8203 8.46094 12.4688 8.84375 11.75 9.26562L2.29688 14.7734C1.97656 14.9531 1.64844 15.0469 1.34375 15.0469C0.609375 15.0469 -0.0078125 14.5391 -0.0078125 13.5391Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="11" height="15" viewBox="0 0 11 15" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.24219 14.8984C0.398438 14.8984 -0.0078125 14.4766 -0.0078125 13.6484V2.07031C-0.0078125 1.24219 0.414062 0.820312 1.24219 0.820312H3.17188C4 0.820312 4.42188 1.24219 4.42188 2.07031V13.6484C4.42188 14.4766 4 14.8984 3.17188 14.8984H1.24219ZM7.57031 14.8984C6.72656 14.8984 6.32031 14.4766 6.32031 13.6484V2.07031C6.32031 1.24219 6.74219 0.820312 7.57031 0.820312H9.5C10.3281 0.820312 10.75 1.24219 10.75 2.07031V13.6484C10.75 14.4766 10.3281 14.8984 9.5 14.8984H7.57031Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_4_ID" display="none" width="18" height="16" viewBox="0 0 18 16" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Secondary_See_More_1_Button_1_ID" style="outline: rgba(0, 122, 255, 0.2) solid 2px; outline-offset: -2px; background: linear-gradient(0deg, rgba(0, 122, 255, 0.10) 0%, rgba(0, 122, 255, 0.10) 100%), rgba(var(--color-snow), 0.80); backdrop-filter: blur(16px); transform: translate(0px, 0px) scale(1); align-self: stretch; justify-content: space-between;">
                        <p class="DLP_Text_Style_1" style="color: #007AFF;">${systemText[systemLanguage][15]}</p>
                        <svg width="9" height="16" viewBox="0 0 9 16" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.57031 7.85938C8.57031 8.24219 8.4375 8.5625 8.10938 8.875L2.20312 14.6641C1.96875 14.8984 1.67969 15.0156 1.33594 15.0156C0.648438 15.0156 0.0859375 14.4609 0.0859375 13.7734C0.0859375 13.4219 0.226562 13.1094 0.484375 12.8516L5.63281 7.85156L0.484375 2.85938C0.226562 2.60938 0.0859375 2.28906 0.0859375 1.94531C0.0859375 1.26562 0.648438 0.703125 1.33594 0.703125C1.67969 0.703125 1.96875 0.820312 2.20312 1.05469L8.10938 6.84375C8.42969 7.14844 8.57031 7.46875 8.57031 7.85938Z"/>
                        </svg>
                    </div>
                    <div class="DLP_HStack_Auto" style="padding-top: 4px;">
                        <div class="DLP_HStack_4 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Secondary_Terms_1_Button_1_ID" style="align-items: center;">
                            <p class="DLP_Text_Style_1" style="color: #007AFF; opacity: 0.5;">${systemText[systemLanguage][14]}</p>
                        </div>
                        <div class="DLP_HStack_4 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Secondary_Whats_New_1_Button_1_ID" style="align-items: center;">
                            <p class="DLP_Text_Style_1" style="color: #007AFF;">${systemText[systemLanguage][7]}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_4_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_HStack_Auto_Top DLP_NoSelect">
                    <div class="DLP_HStack_4" id="DLP_Universal_Back_1_Button_1_ID">
                        <svg class="DLP_Magnetic_Hover_1" width="11" height="19" fill="rgb(var(--color-black-text))" viewBox="0 0 11 19" xmlns="http://www.w3.org/2000/svg" style="transform: translate(0px, 0px) scale(1); z-index: 0;">
                            <path d="M0.171875 9.44922C0.181641 9.04883 0.318359 8.7168 0.640625 8.4043L8.16016 1.05078C8.4043 0.796875 8.70703 0.679688 9.07812 0.679688C9.81055 0.679688 10.3965 1.25586 10.3965 1.98828C10.3965 2.34961 10.25 2.68164 9.98633 2.94531L3.30664 9.43945L9.98633 15.9531C10.25 16.2168 10.3965 16.5391 10.3965 16.9102C10.3965 17.6426 9.81055 18.2285 9.07812 18.2285C8.7168 18.2285 8.4043 18.1016 8.16016 17.8477L0.640625 10.4941C0.318359 10.1816 0.171875 9.84961 0.171875 9.44922Z"/>
                        </svg>
                        <p class="DLP_Text_Style_2">Duolingo</p>
                        <p class="DLP_Text_Style_2" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PRO LE</p>
                    </div>
                    <p class="DLP_Text_Style_1" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${versionName}</p>
                </div>
                <div class="DLP_VStack_8" id="DLP_Main_Inputs_1_Divider_1_ID">
                    <div class="DLP_VStack_8" id="DLP_Get_PATH_2_ID">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <svg id="DLP_Inset_Icon_1_ID" class="DLP_Magnetic_Hover_1 DLP_NoSelect" width="13" height="20" viewBox="0 0 13 20" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.140625 12.25C0.140625 10.5156 1.50781 8.80469 3.73438 7.96875L3.98438 4.25781C2.77344 3.57812 1.875 2.85156 1.47656 2.35156C1.24219 2.05469 1.13281 1.74219 1.13281 1.46094C1.13281 0.875 1.57812 0.453125 2.22656 0.453125H10.7578C11.4062 0.453125 11.8516 0.875 11.8516 1.46094C11.8516 1.74219 11.7422 2.05469 11.5078 2.35156C11.1094 2.85156 10.2109 3.57031 9 4.25781L9.25781 7.96875C11.4766 8.80469 12.8438 10.5156 12.8438 12.25C12.8438 13.0312 12.3047 13.5547 11.5 13.5547H7.40625V17.3203C7.40625 18.2578 6.74219 19.5703 6.49219 19.5703C6.24219 19.5703 5.57812 18.2578 5.57812 17.3203V13.5547H1.48438C0.679688 13.5547 0.140625 13.0312 0.140625 12.25Z"/>
                            </svg>
                            <svg id="DLP_Inset_Icon_2_ID" class="DLP_Magnetic_Hover_1 DLP_NoSelect" width="13" height="20" viewBox="0 0 13 20" fill="rgb(var(--color-eel))" xmlns="http://www.w3.org/2000/svg" display="none">
                                <path opacity="0.5" d="M1.48438 13.5547C0.679688 13.5547 0.140625 13.0312 0.140625 12.25C0.140625 10.5156 1.50781 8.85156 3.55469 8.01562L3.80469 4.25781C2.77344 3.57031 1.86719 2.85156 1.47656 2.34375C1.24219 2.05469 1.13281 1.74219 1.13281 1.46094C1.13281 0.875 1.57812 0.453125 2.22656 0.453125H10.7578C11.4062 0.453125 11.8516 0.875 11.8516 1.46094C11.8516 1.74219 11.7422 2.05469 11.5078 2.34375C11.1172 2.85156 10.2188 3.57031 9.17969 4.25781L9.42969 8.01562C11.4766 8.85156 12.8438 10.5156 12.8438 12.25C12.8438 13.0312 12.3047 13.5547 11.5 13.5547H7.40625V17.3203C7.40625 18.2578 6.74219 19.5703 6.49219 19.5703C6.24219 19.5703 5.57812 18.2578 5.57812 17.3203V13.5547H1.48438ZM6.49219 7.44531C6.92969 7.44531 7.35156 7.47656 7.75781 7.54688L7.53125 3.55469C7.52344 3.38281 7.5625 3.29688 7.69531 3.21875C8.5625 2.76562 9.23438 2.28125 9.46094 2.07812C9.53125 2.00781 9.49219 1.92969 9.41406 1.92969H3.57812C3.5 1.92969 3.45312 2.00781 3.52344 2.07812C3.75 2.28125 4.42188 2.76562 5.28906 3.21875C5.42188 3.29688 5.46094 3.38281 5.45312 3.55469L5.22656 7.54688C5.63281 7.47656 6.05469 7.44531 6.49219 7.44531ZM1.92188 11.9844H11.0625C11.1797 11.9844 11.2344 11.9141 11.2109 11.7734C10.9922 10.3906 9.08594 8.96875 6.49219 8.96875C3.89844 8.96875 1.99219 10.3906 1.77344 11.7734C1.75 11.9141 1.80469 11.9844 1.92188 11.9844Z"/>
                            </svg>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][17]}</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_2_ID" style="width: 48px; padding: 0;">
                                <svg id="DLP_Inset_Icon_1_ID" width="15" height="16" viewBox="0 0 15 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.49219 11.3594C0.875 11.3594 0.492188 11 0.492188 10.4297C0.492188 9.72656 0.960938 9.25 1.71875 9.25H3.5625L4.17188 6.17969H2.5C1.88281 6.17969 1.49219 5.80469 1.49219 5.24219C1.49219 4.53125 1.96875 4.05469 2.72656 4.05469H4.59375L5.17188 1.17188C5.30469 0.507812 5.67969 0.15625 6.35938 0.15625C6.97656 0.15625 7.35938 0.507812 7.35938 1.07031C7.35938 1.19531 7.33594 1.35938 7.32031 1.45312L6.79688 4.05469H9.71094L10.2891 1.17188C10.4219 0.507812 10.7891 0.15625 11.4688 0.15625C12.0781 0.15625 12.4609 0.507812 12.4609 1.07031C12.4609 1.19531 12.4453 1.35938 12.4297 1.45312L11.9062 4.05469H13.6875C14.3047 4.05469 14.6875 4.4375 14.6875 4.99219C14.6875 5.70312 14.2188 6.17969 13.4609 6.17969H11.4844L10.875 9.25H12.6797C13.2969 9.25 13.6797 9.64062 13.6797 10.1953C13.6797 10.8984 13.2109 11.3594 12.4453 11.3594H10.4531L9.82031 14.5469C9.6875 15.2266 9.27344 15.5547 8.61719 15.5547C8.00781 15.5547 7.63281 15.2109 7.63281 14.6406C7.63281 14.5391 7.64844 14.375 7.67188 14.2656L8.25 11.3594H5.34375L4.71094 14.5469C4.57812 15.2266 4.15625 15.5547 3.51562 15.5547C2.90625 15.5547 2.52344 15.2109 2.52344 14.6406C2.52344 14.5391 2.53906 14.375 2.5625 14.2656L3.14062 11.3594H1.49219ZM5.76562 9.25H8.67188L9.28906 6.17969H6.375L5.76562 9.25Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="20" height="12" viewBox="0 0 20 12" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.30859 11.789C0.683594 11.789 0.191406 11.3359 0.191406 10.7656C0.191406 10.4765 0.285156 10.2265 0.511719 9.91407L3.32422 5.99219V5.92969L0.605469 2.22656C0.347656 1.88281 0.261719 1.62501 0.261719 1.32032C0.261719 0.679687 0.769532 0.210938 1.45703 0.210938C1.90234 0.210938 2.21484 0.40625 2.51953 0.867187L4.93359 4.42969H4.99609L7.48828 0.789063C7.76172 0.382813 7.99609 0.210938 8.44922 0.210938C9.0664 0.210938 9.59765 0.65625 9.59765 1.21874C9.59765 1.52343 9.51172 1.77343 9.28515 2.06251L6.35546 5.97656V6.03125L9.19922 9.86718C9.41796 10.1484 9.51172 10.414 9.51172 10.7265C9.51172 11.3437 9.03515 11.789 8.3789 11.789C7.94922 11.789 7.66015 11.6172 7.35546 11.2031L4.83984 7.69531H4.77734L2.30078 11.2109C2.0039 11.6406 1.7539 11.789 1.30859 11.789ZM12.496 11.789C11.7539 11.789 11.3164 11.3359 11.3164 10.5625V1.59374C11.3164 0.820313 11.7539 0.367187 12.496 0.367187H15.9023C18.2148 0.367187 19.8086 1.90624 19.8086 4.22656C19.8086 6.53906 18.1601 8.08594 15.7851 8.08594H13.6757V10.5625C13.6757 11.3359 13.2382 11.789 12.496 11.789ZM13.6757 6.24219H15.2695C16.621 6.24219 17.4101 5.52344 17.4101 4.23438C17.4101 2.95312 16.6289 2.23438 15.2773 2.23438H13.6757V6.24219Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="24" height="12" viewBox="0 0 24 12" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.898438 5.85938C0.898438 2.69531 2.94531 0.609375 5.97656 0.609375C7.53125 0.609375 8.875 1.26562 10.2578 2.60938L11.9688 4.25781L13.6719 2.60938C15.0547 1.26562 16.3984 0.609375 17.9531 0.609375C20.9844 0.609375 23.0312 2.69531 23.0312 5.85938C23.0312 9.01562 20.9844 11.1016 17.9531 11.1016C16.3984 11.1016 15.0547 10.4531 13.6719 9.10938L11.9688 7.45312L10.2578 9.10938C8.875 10.4531 7.53125 11.1016 5.97656 11.1016C2.94531 11.1016 0.898438 9.01562 0.898438 5.85938ZM3.21875 5.85938C3.21875 7.63281 4.32031 8.78125 5.97656 8.78125C6.875 8.78125 7.70312 8.34375 8.63281 7.46094L10.3281 5.85938L8.63281 4.25781C7.70312 3.375 6.875 2.92969 5.97656 2.92969C4.32031 2.92969 3.21875 4.07812 3.21875 5.85938ZM13.6016 5.85938L15.2969 7.46094C16.2344 8.34375 17.0547 8.78125 17.9531 8.78125C19.6094 8.78125 20.7109 7.63281 20.7109 5.85938C20.7109 4.07812 19.6094 2.92969 17.9531 2.92969C17.0547 2.92969 16.2266 3.375 15.2969 4.25781L13.6016 5.85938Z"/>
                                </svg>
                            </div>
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; opacity: 0.5; display: none;">PATH</p>
                                <svg width="15" height="16" viewBox="0 0 15 16" fill="#007AFF" opacity="0.5" xmlns="http://www.w3.org/2000/svg" display="none">
                                    <path d="M1.39844 11.3594C0.78125 11.3594 0.398438 11 0.398438 10.4297C0.398438 9.72656 0.867188 9.25 1.625 9.25H3.46875L4.07812 6.17969H2.40625C1.78906 6.17969 1.39844 5.80469 1.39844 5.24219C1.39844 4.53125 1.875 4.05469 2.63281 4.05469H4.5L5.07812 1.17188C5.21094 0.507812 5.58594 0.15625 6.26562 0.15625C6.88281 0.15625 7.26562 0.507812 7.26562 1.07031C7.26562 1.19531 7.24219 1.35938 7.22656 1.45312L6.70312 4.05469H9.61719L10.1953 1.17188C10.3281 0.507812 10.6953 0.15625 11.375 0.15625C11.9844 0.15625 12.3672 0.507812 12.3672 1.07031C12.3672 1.19531 12.3516 1.35938 12.3359 1.45312L11.8125 4.05469H13.5938C14.2109 4.05469 14.5938 4.4375 14.5938 4.99219C14.5938 5.70312 14.125 6.17969 13.3672 6.17969H11.3906L10.7812 9.25H12.5859C13.2031 9.25 13.5859 9.64062 13.5859 10.1953C13.5859 10.8984 13.1172 11.3594 12.3516 11.3594H10.3594L9.72656 14.5469C9.59375 15.2266 9.17969 15.5547 8.52344 15.5547C7.91406 15.5547 7.53906 15.2109 7.53906 14.6406C7.53906 14.5391 7.55469 14.375 7.57812 14.2656L8.15625 11.3594H5.25L4.61719 14.5469C4.48438 15.2266 4.0625 15.5547 3.42188 15.5547C2.8125 15.5547 2.42969 15.2109 2.42969 14.6406C2.42969 14.5391 2.44531 14.375 2.46875 14.2656L3.04688 11.3594H1.39844ZM5.67188 9.25H8.57812L9.19531 6.17969H6.28125L5.67188 9.25Z"/>
                                </svg>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][18]}</p>
                                <svg id="DLP_Inset_Icon_1_ID" width="13" height="16" viewBox="0 0 13 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M-0.0078125 13.5391V2.17188C-0.0078125 1.17969 0.609375 0.671875 1.34375 0.671875C1.64844 0.671875 1.97656 0.757812 2.29688 0.945312L11.75 6.45312C12.4688 6.86719 12.8203 7.25781 12.8203 7.85938C12.8203 8.46094 12.4688 8.84375 11.75 9.26562L2.29688 14.7734C1.97656 14.9531 1.64844 15.0469 1.34375 15.0469C0.609375 15.0469 -0.0078125 14.5391 -0.0078125 13.5391Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="11" height="15" viewBox="0 0 11 15" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.24219 14.8984C0.398438 14.8984 -0.0078125 14.4766 -0.0078125 13.6484V2.07031C-0.0078125 1.24219 0.414062 0.820312 1.24219 0.820312H3.17188C4 0.820312 4.42188 1.24219 4.42188 2.07031V13.6484C4.42188 14.4766 4 14.8984 3.17188 14.8984H1.24219ZM7.57031 14.8984C6.72656 14.8984 6.32031 14.4766 6.32031 13.6484V2.07031C6.32031 1.24219 6.74219 0.820312 7.57031 0.820312H9.5C10.3281 0.820312 10.75 1.24219 10.75 2.07031V13.6484C10.75 14.4766 10.3281 14.8984 9.5 14.8984H7.57031Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_4_ID" display="none" width="18" height="16" viewBox="0 0 18 16" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_PRACTICE_2_ID">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <svg id="DLP_Inset_Icon_1_ID" class="DLP_Magnetic_Hover_1 DLP_NoSelect" width="13" height="20" viewBox="0 0 13 20" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.140625 12.25C0.140625 10.5156 1.50781 8.80469 3.73438 7.96875L3.98438 4.25781C2.77344 3.57812 1.875 2.85156 1.47656 2.35156C1.24219 2.05469 1.13281 1.74219 1.13281 1.46094C1.13281 0.875 1.57812 0.453125 2.22656 0.453125H10.7578C11.4062 0.453125 11.8516 0.875 11.8516 1.46094C11.8516 1.74219 11.7422 2.05469 11.5078 2.35156C11.1094 2.85156 10.2109 3.57031 9 4.25781L9.25781 7.96875C11.4766 8.80469 12.8438 10.5156 12.8438 12.25C12.8438 13.0312 12.3047 13.5547 11.5 13.5547H7.40625V17.3203C7.40625 18.2578 6.74219 19.5703 6.49219 19.5703C6.24219 19.5703 5.57812 18.2578 5.57812 17.3203V13.5547H1.48438C0.679688 13.5547 0.140625 13.0312 0.140625 12.25Z"/>
                            </svg>
                            <svg id="DLP_Inset_Icon_2_ID" class="DLP_Magnetic_Hover_1 DLP_NoSelect" width="13" height="20" viewBox="0 0 13 20" fill="rgb(var(--color-eel))" xmlns="http://www.w3.org/2000/svg" display="none">
                                <path opacity="0.5" d="M1.48438 13.5547C0.679688 13.5547 0.140625 13.0312 0.140625 12.25C0.140625 10.5156 1.50781 8.85156 3.55469 8.01562L3.80469 4.25781C2.77344 3.57031 1.86719 2.85156 1.47656 2.34375C1.24219 2.05469 1.13281 1.74219 1.13281 1.46094C1.13281 0.875 1.57812 0.453125 2.22656 0.453125H10.7578C11.4062 0.453125 11.8516 0.875 11.8516 1.46094C11.8516 1.74219 11.7422 2.05469 11.5078 2.34375C11.1172 2.85156 10.2188 3.57031 9.17969 4.25781L9.42969 8.01562C11.4766 8.85156 12.8438 10.5156 12.8438 12.25C12.8438 13.0312 12.3047 13.5547 11.5 13.5547H7.40625V17.3203C7.40625 18.2578 6.74219 19.5703 6.49219 19.5703C6.24219 19.5703 5.57812 18.2578 5.57812 17.3203V13.5547H1.48438ZM6.49219 7.44531C6.92969 7.44531 7.35156 7.47656 7.75781 7.54688L7.53125 3.55469C7.52344 3.38281 7.5625 3.29688 7.69531 3.21875C8.5625 2.76562 9.23438 2.28125 9.46094 2.07812C9.53125 2.00781 9.49219 1.92969 9.41406 1.92969H3.57812C3.5 1.92969 3.45312 2.00781 3.52344 2.07812C3.75 2.28125 4.42188 2.76562 5.28906 3.21875C5.42188 3.29688 5.46094 3.38281 5.45312 3.55469L5.22656 7.54688C5.63281 7.47656 6.05469 7.44531 6.49219 7.44531ZM1.92188 11.9844H11.0625C11.1797 11.9844 11.2344 11.9141 11.2109 11.7734C10.9922 10.3906 9.08594 8.96875 6.49219 8.96875C3.89844 8.96875 1.99219 10.3906 1.77344 11.7734C1.75 11.9141 1.80469 11.9844 1.92188 11.9844Z"/>
                            </svg>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][19]}</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_2_ID" style="width: 48px; padding: 0;">
                                <svg id="DLP_Inset_Icon_1_ID" width="15" height="16" viewBox="0 0 15 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.49219 11.3594C0.875 11.3594 0.492188 11 0.492188 10.4297C0.492188 9.72656 0.960938 9.25 1.71875 9.25H3.5625L4.17188 6.17969H2.5C1.88281 6.17969 1.49219 5.80469 1.49219 5.24219C1.49219 4.53125 1.96875 4.05469 2.72656 4.05469H4.59375L5.17188 1.17188C5.30469 0.507812 5.67969 0.15625 6.35938 0.15625C6.97656 0.15625 7.35938 0.507812 7.35938 1.07031C7.35938 1.19531 7.33594 1.35938 7.32031 1.45312L6.79688 4.05469H9.71094L10.2891 1.17188C10.4219 0.507812 10.7891 0.15625 11.4688 0.15625C12.0781 0.15625 12.4609 0.507812 12.4609 1.07031C12.4609 1.19531 12.4453 1.35938 12.4297 1.45312L11.9062 4.05469H13.6875C14.3047 4.05469 14.6875 4.4375 14.6875 4.99219C14.6875 5.70312 14.2188 6.17969 13.4609 6.17969H11.4844L10.875 9.25H12.6797C13.2969 9.25 13.6797 9.64062 13.6797 10.1953C13.6797 10.8984 13.2109 11.3594 12.4453 11.3594H10.4531L9.82031 14.5469C9.6875 15.2266 9.27344 15.5547 8.61719 15.5547C8.00781 15.5547 7.63281 15.2109 7.63281 14.6406C7.63281 14.5391 7.64844 14.375 7.67188 14.2656L8.25 11.3594H5.34375L4.71094 14.5469C4.57812 15.2266 4.15625 15.5547 3.51562 15.5547C2.90625 15.5547 2.52344 15.2109 2.52344 14.6406C2.52344 14.5391 2.53906 14.375 2.5625 14.2656L3.14062 11.3594H1.49219ZM5.76562 9.25H8.67188L9.28906 6.17969H6.375L5.76562 9.25Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="20" height="12" viewBox="0 0 20 12" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.30859 11.789C0.683594 11.789 0.191406 11.3359 0.191406 10.7656C0.191406 10.4765 0.285156 10.2265 0.511719 9.91407L3.32422 5.99219V5.92969L0.605469 2.22656C0.347656 1.88281 0.261719 1.62501 0.261719 1.32032C0.261719 0.679687 0.769532 0.210938 1.45703 0.210938C1.90234 0.210938 2.21484 0.40625 2.51953 0.867187L4.93359 4.42969H4.99609L7.48828 0.789063C7.76172 0.382813 7.99609 0.210938 8.44922 0.210938C9.0664 0.210938 9.59765 0.65625 9.59765 1.21874C9.59765 1.52343 9.51172 1.77343 9.28515 2.06251L6.35546 5.97656V6.03125L9.19922 9.86718C9.41796 10.1484 9.51172 10.414 9.51172 10.7265C9.51172 11.3437 9.03515 11.789 8.3789 11.789C7.94922 11.789 7.66015 11.6172 7.35546 11.2031L4.83984 7.69531H4.77734L2.30078 11.2109C2.0039 11.6406 1.7539 11.789 1.30859 11.789ZM12.496 11.789C11.7539 11.789 11.3164 11.3359 11.3164 10.5625V1.59374C11.3164 0.820313 11.7539 0.367187 12.496 0.367187H15.9023C18.2148 0.367187 19.8086 1.90624 19.8086 4.22656C19.8086 6.53906 18.1601 8.08594 15.7851 8.08594H13.6757V10.5625C13.6757 11.3359 13.2382 11.789 12.496 11.789ZM13.6757 6.24219H15.2695C16.621 6.24219 17.4101 5.52344 17.4101 4.23438C17.4101 2.95312 16.6289 2.23438 15.2773 2.23438H13.6757V6.24219Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="24" height="12" viewBox="0 0 24 12" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.898438 5.85938C0.898438 2.69531 2.94531 0.609375 5.97656 0.609375C7.53125 0.609375 8.875 1.26562 10.2578 2.60938L11.9688 4.25781L13.6719 2.60938C15.0547 1.26562 16.3984 0.609375 17.9531 0.609375C20.9844 0.609375 23.0312 2.69531 23.0312 5.85938C23.0312 9.01562 20.9844 11.1016 17.9531 11.1016C16.3984 11.1016 15.0547 10.4531 13.6719 9.10938L11.9688 7.45312L10.2578 9.10938C8.875 10.4531 7.53125 11.1016 5.97656 11.1016C2.94531 11.1016 0.898438 9.01562 0.898438 5.85938ZM3.21875 5.85938C3.21875 7.63281 4.32031 8.78125 5.97656 8.78125C6.875 8.78125 7.70312 8.34375 8.63281 7.46094L10.3281 5.85938L8.63281 4.25781C7.70312 3.375 6.875 2.92969 5.97656 2.92969C4.32031 2.92969 3.21875 4.07812 3.21875 5.85938ZM13.6016 5.85938L15.2969 7.46094C16.2344 8.34375 17.0547 8.78125 17.9531 8.78125C19.6094 8.78125 20.7109 7.63281 20.7109 5.85938C20.7109 4.07812 19.6094 2.92969 17.9531 2.92969C17.0547 2.92969 16.2266 3.375 15.2969 4.25781L13.6016 5.85938Z"/>
                                </svg>
                            </div>
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; opacity: 0.5; display: none;">PRACTICE</p>
                                <svg width="15" height="16" viewBox="0 0 15 16" fill="#007AFF" opacity="0.5" xmlns="http://www.w3.org/2000/svg" display="none">
                                    <path d="M1.39844 11.3594C0.78125 11.3594 0.398438 11 0.398438 10.4297C0.398438 9.72656 0.867188 9.25 1.625 9.25H3.46875L4.07812 6.17969H2.40625C1.78906 6.17969 1.39844 5.80469 1.39844 5.24219C1.39844 4.53125 1.875 4.05469 2.63281 4.05469H4.5L5.07812 1.17188C5.21094 0.507812 5.58594 0.15625 6.26562 0.15625C6.88281 0.15625 7.26562 0.507812 7.26562 1.07031C7.26562 1.19531 7.24219 1.35938 7.22656 1.45312L6.70312 4.05469H9.61719L10.1953 1.17188C10.3281 0.507812 10.6953 0.15625 11.375 0.15625C11.9844 0.15625 12.3672 0.507812 12.3672 1.07031C12.3672 1.19531 12.3516 1.35938 12.3359 1.45312L11.8125 4.05469H13.5938C14.2109 4.05469 14.5938 4.4375 14.5938 4.99219C14.5938 5.70312 14.125 6.17969 13.3672 6.17969H11.3906L10.7812 9.25H12.5859C13.2031 9.25 13.5859 9.64062 13.5859 10.1953C13.5859 10.8984 13.1172 11.3594 12.3516 11.3594H10.3594L9.72656 14.5469C9.59375 15.2266 9.17969 15.5547 8.52344 15.5547C7.91406 15.5547 7.53906 15.2109 7.53906 14.6406C7.53906 14.5391 7.55469 14.375 7.57812 14.2656L8.15625 11.3594H5.25L4.61719 14.5469C4.48438 15.2266 4.0625 15.5547 3.42188 15.5547C2.8125 15.5547 2.42969 15.2109 2.42969 14.6406C2.42969 14.5391 2.44531 14.375 2.46875 14.2656L3.04688 11.3594H1.39844ZM5.67188 9.25H8.57812L9.19531 6.17969H6.28125L5.67188 9.25Z"/>
                                </svg>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][18]}</p>
                                <svg id="DLP_Inset_Icon_1_ID" width="13" height="16" viewBox="0 0 13 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M-0.0078125 13.5391V2.17188C-0.0078125 1.17969 0.609375 0.671875 1.34375 0.671875C1.64844 0.671875 1.97656 0.757812 2.29688 0.945312L11.75 6.45312C12.4688 6.86719 12.8203 7.25781 12.8203 7.85938C12.8203 8.46094 12.4688 8.84375 11.75 9.26562L2.29688 14.7734C1.97656 14.9531 1.64844 15.0469 1.34375 15.0469C0.609375 15.0469 -0.0078125 14.5391 -0.0078125 13.5391Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="11" height="15" viewBox="0 0 11 15" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.24219 14.8984C0.398438 14.8984 -0.0078125 14.4766 -0.0078125 13.6484V2.07031C-0.0078125 1.24219 0.414062 0.820312 1.24219 0.820312H3.17188C4 0.820312 4.42188 1.24219 4.42188 2.07031V13.6484C4.42188 14.4766 4 14.8984 3.17188 14.8984H1.24219ZM7.57031 14.8984C6.72656 14.8984 6.32031 14.4766 6.32031 13.6484V2.07031C6.32031 1.24219 6.74219 0.820312 7.57031 0.820312H9.5C10.3281 0.820312 10.75 1.24219 10.75 2.07031V13.6484C10.75 14.4766 10.3281 14.8984 9.5 14.8984H7.57031Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_4_ID" display="none" width="18" height="16" viewBox="0 0 18 16" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_LISTEN_2_ID">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <svg id="DLP_Inset_Icon_1_ID" class="DLP_Magnetic_Hover_1 DLP_NoSelect" width="13" height="20" viewBox="0 0 13 20" fill="#007AFF" xmlns="http://www.w3.org/2000/svg" display="none">
                                <path d="M0.140625 12.25C0.140625 10.5156 1.50781 8.80469 3.73438 7.96875L3.98438 4.25781C2.77344 3.57812 1.875 2.85156 1.47656 2.35156C1.24219 2.05469 1.13281 1.74219 1.13281 1.46094C1.13281 0.875 1.57812 0.453125 2.22656 0.453125H10.7578C11.4062 0.453125 11.8516 0.875 11.8516 1.46094C11.8516 1.74219 11.7422 2.05469 11.5078 2.35156C11.1094 2.85156 10.2109 3.57031 9 4.25781L9.25781 7.96875C11.4766 8.80469 12.8438 10.5156 12.8438 12.25C12.8438 13.0312 12.3047 13.5547 11.5 13.5547H7.40625V17.3203C7.40625 18.2578 6.74219 19.5703 6.49219 19.5703C6.24219 19.5703 5.57812 18.2578 5.57812 17.3203V13.5547H1.48438C0.679688 13.5547 0.140625 13.0312 0.140625 12.25Z"/>
                            </svg>
                            <svg id="DLP_Inset_Icon_2_ID" class="DLP_Magnetic_Hover_1 DLP_NoSelect" width="13" height="20" viewBox="0 0 13 20" fill="rgb(var(--color-eel))" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.5" d="M1.48438 13.5547C0.679688 13.5547 0.140625 13.0312 0.140625 12.25C0.140625 10.5156 1.50781 8.85156 3.55469 8.01562L3.80469 4.25781C2.77344 3.57031 1.86719 2.85156 1.47656 2.34375C1.24219 2.05469 1.13281 1.74219 1.13281 1.46094C1.13281 0.875 1.57812 0.453125 2.22656 0.453125H10.7578C11.4062 0.453125 11.8516 0.875 11.8516 1.46094C11.8516 1.74219 11.7422 2.05469 11.5078 2.34375C11.1172 2.85156 10.2188 3.57031 9.17969 4.25781L9.42969 8.01562C11.4766 8.85156 12.8438 10.5156 12.8438 12.25C12.8438 13.0312 12.3047 13.5547 11.5 13.5547H7.40625V17.3203C7.40625 18.2578 6.74219 19.5703 6.49219 19.5703C6.24219 19.5703 5.57812 18.2578 5.57812 17.3203V13.5547H1.48438ZM6.49219 7.44531C6.92969 7.44531 7.35156 7.47656 7.75781 7.54688L7.53125 3.55469C7.52344 3.38281 7.5625 3.29688 7.69531 3.21875C8.5625 2.76562 9.23438 2.28125 9.46094 2.07812C9.53125 2.00781 9.49219 1.92969 9.41406 1.92969H3.57812C3.5 1.92969 3.45312 2.00781 3.52344 2.07812C3.75 2.28125 4.42188 2.76562 5.28906 3.21875C5.42188 3.29688 5.46094 3.38281 5.45312 3.55469L5.22656 7.54688C5.63281 7.47656 6.05469 7.44531 6.49219 7.44531ZM1.92188 11.9844H11.0625C11.1797 11.9844 11.2344 11.9141 11.2109 11.7734C10.9922 10.3906 9.08594 8.96875 6.49219 8.96875C3.89844 8.96875 1.99219 10.3906 1.77344 11.7734C1.75 11.9141 1.80469 11.9844 1.92188 11.9844Z"/>
                            </svg>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][21]}</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_2_ID" style="width: 48px; padding: 0;">
                                <svg id="DLP_Inset_Icon_1_ID" width="15" height="16" viewBox="0 0 15 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.49219 11.3594C0.875 11.3594 0.492188 11 0.492188 10.4297C0.492188 9.72656 0.960938 9.25 1.71875 9.25H3.5625L4.17188 6.17969H2.5C1.88281 6.17969 1.49219 5.80469 1.49219 5.24219C1.49219 4.53125 1.96875 4.05469 2.72656 4.05469H4.59375L5.17188 1.17188C5.30469 0.507812 5.67969 0.15625 6.35938 0.15625C6.97656 0.15625 7.35938 0.507812 7.35938 1.07031C7.35938 1.19531 7.33594 1.35938 7.32031 1.45312L6.79688 4.05469H9.71094L10.2891 1.17188C10.4219 0.507812 10.7891 0.15625 11.4688 0.15625C12.0781 0.15625 12.4609 0.507812 12.4609 1.07031C12.4609 1.19531 12.4453 1.35938 12.4297 1.45312L11.9062 4.05469H13.6875C14.3047 4.05469 14.6875 4.4375 14.6875 4.99219C14.6875 5.70312 14.2188 6.17969 13.4609 6.17969H11.4844L10.875 9.25H12.6797C13.2969 9.25 13.6797 9.64062 13.6797 10.1953C13.6797 10.8984 13.2109 11.3594 12.4453 11.3594H10.4531L9.82031 14.5469C9.6875 15.2266 9.27344 15.5547 8.61719 15.5547C8.00781 15.5547 7.63281 15.2109 7.63281 14.6406C7.63281 14.5391 7.64844 14.375 7.67188 14.2656L8.25 11.3594H5.34375L4.71094 14.5469C4.57812 15.2266 4.15625 15.5547 3.51562 15.5547C2.90625 15.5547 2.52344 15.2109 2.52344 14.6406C2.52344 14.5391 2.53906 14.375 2.5625 14.2656L3.14062 11.3594H1.49219ZM5.76562 9.25H8.67188L9.28906 6.17969H6.375L5.76562 9.25Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="20" height="12" viewBox="0 0 20 12" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.30859 11.789C0.683594 11.789 0.191406 11.3359 0.191406 10.7656C0.191406 10.4765 0.285156 10.2265 0.511719 9.91407L3.32422 5.99219V5.92969L0.605469 2.22656C0.347656 1.88281 0.261719 1.62501 0.261719 1.32032C0.261719 0.679687 0.769532 0.210938 1.45703 0.210938C1.90234 0.210938 2.21484 0.40625 2.51953 0.867187L4.93359 4.42969H4.99609L7.48828 0.789063C7.76172 0.382813 7.99609 0.210938 8.44922 0.210938C9.0664 0.210938 9.59765 0.65625 9.59765 1.21874C9.59765 1.52343 9.51172 1.77343 9.28515 2.06251L6.35546 5.97656V6.03125L9.19922 9.86718C9.41796 10.1484 9.51172 10.414 9.51172 10.7265C9.51172 11.3437 9.03515 11.789 8.3789 11.789C7.94922 11.789 7.66015 11.6172 7.35546 11.2031L4.83984 7.69531H4.77734L2.30078 11.2109C2.0039 11.6406 1.7539 11.789 1.30859 11.789ZM12.496 11.789C11.7539 11.789 11.3164 11.3359 11.3164 10.5625V1.59374C11.3164 0.820313 11.7539 0.367187 12.496 0.367187H15.9023C18.2148 0.367187 19.8086 1.90624 19.8086 4.22656C19.8086 6.53906 18.1601 8.08594 15.7851 8.08594H13.6757V10.5625C13.6757 11.3359 13.2382 11.789 12.496 11.789ZM13.6757 6.24219H15.2695C16.621 6.24219 17.4101 5.52344 17.4101 4.23438C17.4101 2.95312 16.6289 2.23438 15.2773 2.23438H13.6757V6.24219Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="24" height="12" viewBox="0 0 24 12" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.898438 5.85938C0.898438 2.69531 2.94531 0.609375 5.97656 0.609375C7.53125 0.609375 8.875 1.26562 10.2578 2.60938L11.9688 4.25781L13.6719 2.60938C15.0547 1.26562 16.3984 0.609375 17.9531 0.609375C20.9844 0.609375 23.0312 2.69531 23.0312 5.85938C23.0312 9.01562 20.9844 11.1016 17.9531 11.1016C16.3984 11.1016 15.0547 10.4531 13.6719 9.10938L11.9688 7.45312L10.2578 9.10938C8.875 10.4531 7.53125 11.1016 5.97656 11.1016C2.94531 11.1016 0.898438 9.01562 0.898438 5.85938ZM3.21875 5.85938C3.21875 7.63281 4.32031 8.78125 5.97656 8.78125C6.875 8.78125 7.70312 8.34375 8.63281 7.46094L10.3281 5.85938L8.63281 4.25781C7.70312 3.375 6.875 2.92969 5.97656 2.92969C4.32031 2.92969 3.21875 4.07812 3.21875 5.85938ZM13.6016 5.85938L15.2969 7.46094C16.2344 8.34375 17.0547 8.78125 17.9531 8.78125C19.6094 8.78125 20.7109 7.63281 20.7109 5.85938C20.7109 4.07812 19.6094 2.92969 17.9531 2.92969C17.0547 2.92969 16.2266 3.375 15.2969 4.25781L13.6016 5.85938Z"/>
                                </svg>
                            </div>
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; opacity: 0.5; display: none;">PATH</p>
                                <svg width="15" height="16" viewBox="0 0 15 16" fill="#007AFF" opacity="0.5" xmlns="http://www.w3.org/2000/svg" display="none">
                                    <path d="M1.39844 11.3594C0.78125 11.3594 0.398438 11 0.398438 10.4297C0.398438 9.72656 0.867188 9.25 1.625 9.25H3.46875L4.07812 6.17969H2.40625C1.78906 6.17969 1.39844 5.80469 1.39844 5.24219C1.39844 4.53125 1.875 4.05469 2.63281 4.05469H4.5L5.07812 1.17188C5.21094 0.507812 5.58594 0.15625 6.26562 0.15625C6.88281 0.15625 7.26562 0.507812 7.26562 1.07031C7.26562 1.19531 7.24219 1.35938 7.22656 1.45312L6.70312 4.05469H9.61719L10.1953 1.17188C10.3281 0.507812 10.6953 0.15625 11.375 0.15625C11.9844 0.15625 12.3672 0.507812 12.3672 1.07031C12.3672 1.19531 12.3516 1.35938 12.3359 1.45312L11.8125 4.05469H13.5938C14.2109 4.05469 14.5938 4.4375 14.5938 4.99219C14.5938 5.70312 14.125 6.17969 13.3672 6.17969H11.3906L10.7812 9.25H12.5859C13.2031 9.25 13.5859 9.64062 13.5859 10.1953C13.5859 10.8984 13.1172 11.3594 12.3516 11.3594H10.3594L9.72656 14.5469C9.59375 15.2266 9.17969 15.5547 8.52344 15.5547C7.91406 15.5547 7.53906 15.2109 7.53906 14.6406C7.53906 14.5391 7.55469 14.375 7.57812 14.2656L8.15625 11.3594H5.25L4.61719 14.5469C4.48438 15.2266 4.0625 15.5547 3.42188 15.5547C2.8125 15.5547 2.42969 15.2109 2.42969 14.6406C2.42969 14.5391 2.44531 14.375 2.46875 14.2656L3.04688 11.3594H1.39844ZM5.67188 9.25H8.57812L9.19531 6.17969H6.28125L5.67188 9.25Z"/>
                                </svg>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][18]}</p>
                                <svg id="DLP_Inset_Icon_1_ID" width="13" height="16" viewBox="0 0 13 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M-0.0078125 13.5391V2.17188C-0.0078125 1.17969 0.609375 0.671875 1.34375 0.671875C1.64844 0.671875 1.97656 0.757812 2.29688 0.945312L11.75 6.45312C12.4688 6.86719 12.8203 7.25781 12.8203 7.85938C12.8203 8.46094 12.4688 8.84375 11.75 9.26562L2.29688 14.7734C1.97656 14.9531 1.64844 15.0469 1.34375 15.0469C0.609375 15.0469 -0.0078125 14.5391 -0.0078125 13.5391Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="11" height="15" viewBox="0 0 11 15" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.24219 14.8984C0.398438 14.8984 -0.0078125 14.4766 -0.0078125 13.6484V2.07031C-0.0078125 1.24219 0.414062 0.820312 1.24219 0.820312H3.17188C4 0.820312 4.42188 1.24219 4.42188 2.07031V13.6484C4.42188 14.4766 4 14.8984 3.17188 14.8984H1.24219ZM7.57031 14.8984C6.72656 14.8984 6.32031 14.4766 6.32031 13.6484V2.07031C6.32031 1.24219 6.74219 0.820312 7.57031 0.820312H9.5C10.3281 0.820312 10.75 1.24219 10.75 2.07031V13.6484C10.75 14.4766 10.3281 14.8984 9.5 14.8984H7.57031Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_4_ID" display="none" width="18" height="16" viewBox="0 0 18 16" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_LESSON_2_ID">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <svg id="DLP_Inset_Icon_1_ID" class="DLP_Magnetic_Hover_1 DLP_NoSelect" width="13" height="20" viewBox="0 0 13 20" fill="#007AFF" xmlns="http://www.w3.org/2000/svg" display="none">
                                <path d="M0.140625 12.25C0.140625 10.5156 1.50781 8.80469 3.73438 7.96875L3.98438 4.25781C2.77344 3.57812 1.875 2.85156 1.47656 2.35156C1.24219 2.05469 1.13281 1.74219 1.13281 1.46094C1.13281 0.875 1.57812 0.453125 2.22656 0.453125H10.7578C11.4062 0.453125 11.8516 0.875 11.8516 1.46094C11.8516 1.74219 11.7422 2.05469 11.5078 2.35156C11.1094 2.85156 10.2109 3.57031 9 4.25781L9.25781 7.96875C11.4766 8.80469 12.8438 10.5156 12.8438 12.25C12.8438 13.0312 12.3047 13.5547 11.5 13.5547H7.40625V17.3203C7.40625 18.2578 6.74219 19.5703 6.49219 19.5703C6.24219 19.5703 5.57812 18.2578 5.57812 17.3203V13.5547H1.48438C0.679688 13.5547 0.140625 13.0312 0.140625 12.25Z"/>
                            </svg>
                            <svg id="DLP_Inset_Icon_2_ID" class="DLP_Magnetic_Hover_1 DLP_NoSelect" width="13" height="20" viewBox="0 0 13 20" fill="rgb(var(--color-eel))" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.5" d="M1.48438 13.5547C0.679688 13.5547 0.140625 13.0312 0.140625 12.25C0.140625 10.5156 1.50781 8.85156 3.55469 8.01562L3.80469 4.25781C2.77344 3.57031 1.86719 2.85156 1.47656 2.34375C1.24219 2.05469 1.13281 1.74219 1.13281 1.46094C1.13281 0.875 1.57812 0.453125 2.22656 0.453125H10.7578C11.4062 0.453125 11.8516 0.875 11.8516 1.46094C11.8516 1.74219 11.7422 2.05469 11.5078 2.34375C11.1172 2.85156 10.2188 3.57031 9.17969 4.25781L9.42969 8.01562C11.4766 8.85156 12.8438 10.5156 12.8438 12.25C12.8438 13.0312 12.3047 13.5547 11.5 13.5547H7.40625V17.3203C7.40625 18.2578 6.74219 19.5703 6.49219 19.5703C6.24219 19.5703 5.57812 18.2578 5.57812 17.3203V13.5547H1.48438ZM6.49219 7.44531C6.92969 7.44531 7.35156 7.47656 7.75781 7.54688L7.53125 3.55469C7.52344 3.38281 7.5625 3.29688 7.69531 3.21875C8.5625 2.76562 9.23438 2.28125 9.46094 2.07812C9.53125 2.00781 9.49219 1.92969 9.41406 1.92969H3.57812C3.5 1.92969 3.45312 2.00781 3.52344 2.07812C3.75 2.28125 4.42188 2.76562 5.28906 3.21875C5.42188 3.29688 5.46094 3.38281 5.45312 3.55469L5.22656 7.54688C5.63281 7.47656 6.05469 7.44531 6.49219 7.44531ZM1.92188 11.9844H11.0625C11.1797 11.9844 11.2344 11.9141 11.2109 11.7734C10.9922 10.3906 9.08594 8.96875 6.49219 8.96875C3.89844 8.96875 1.99219 10.3906 1.77344 11.7734C1.75 11.9141 1.80469 11.9844 1.92188 11.9844Z"/>
                            </svg>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][23]}</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; opacity: 0.5; display: none;">PRACTICE</p>
                                <svg width="15" height="16" viewBox="0 0 15 16" fill="#007AFF" opacity="0.5" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.39844 11.3594C0.78125 11.3594 0.398438 11 0.398438 10.4297C0.398438 9.72656 0.867188 9.25 1.625 9.25H3.46875L4.07812 6.17969H2.40625C1.78906 6.17969 1.39844 5.80469 1.39844 5.24219C1.39844 4.53125 1.875 4.05469 2.63281 4.05469H4.5L5.07812 1.17188C5.21094 0.507812 5.58594 0.15625 6.26562 0.15625C6.88281 0.15625 7.26562 0.507812 7.26562 1.07031C7.26562 1.19531 7.24219 1.35938 7.22656 1.45312L6.70312 4.05469H9.61719L10.1953 1.17188C10.3281 0.507812 10.6953 0.15625 11.375 0.15625C11.9844 0.15625 12.3672 0.507812 12.3672 1.07031C12.3672 1.19531 12.3516 1.35938 12.3359 1.45312L11.8125 4.05469H13.5938C14.2109 4.05469 14.5938 4.4375 14.5938 4.99219C14.5938 5.70312 14.125 6.17969 13.3672 6.17969H11.3906L10.7812 9.25H12.5859C13.2031 9.25 13.5859 9.64062 13.5859 10.1953C13.5859 10.8984 13.1172 11.3594 12.3516 11.3594H10.3594L9.72656 14.5469C9.59375 15.2266 9.17969 15.5547 8.52344 15.5547C7.91406 15.5547 7.53906 15.2109 7.53906 14.6406C7.53906 14.5391 7.55469 14.375 7.57812 14.2656L8.15625 11.3594H5.25L4.61719 14.5469C4.48438 15.2266 4.0625 15.5547 3.42188 15.5547C2.8125 15.5547 2.42969 15.2109 2.42969 14.6406C2.42969 14.5391 2.44531 14.375 2.46875 14.2656L3.04688 11.3594H1.39844ZM5.67188 9.25H8.57812L9.19531 6.17969H6.28125L5.67188 9.25Z"/>
                                </svg>
                                <div style="display: flex; align-items: center; gap: 8px; width: 100%; justify-content: flex-end;">
                                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; opacity: 0.5;">Unit:</p>
                                    <input type="text" value="1" placeholder="1" id="DLP_Inset_Input_3_ID" class="DLP_Input_Input_Style_1" style="width: 30px;">
                                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; opacity: 0.5;">Lesson:</p>
                                    <input type="text" value="1" placeholder="1" id="DLP_Inset_Input_4_ID" class="DLP_Input_Input_Style_1" style="width: 30px;">
                                </div>
                            </div>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_2_ID" style="width: 48px; padding: 0;">
                                <svg id="DLP_Inset_Icon_1_ID" width="15" height="16" viewBox="0 0 15 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.49219 11.3594C0.875 11.3594 0.492188 11 0.492188 10.4297C0.492188 9.72656 0.960938 9.25 1.71875 9.25H3.5625L4.17188 6.17969H2.5C1.88281 6.17969 1.49219 5.80469 1.49219 5.24219C1.49219 4.53125 1.96875 4.05469 2.72656 4.05469H4.59375L5.17188 1.17188C5.30469 0.507812 5.67969 0.15625 6.35938 0.15625C6.97656 0.15625 7.35938 0.507812 7.35938 1.07031C7.35938 1.19531 7.33594 1.35938 7.32031 1.45312L6.79688 4.05469H9.71094L10.2891 1.17188C10.4219 0.507812 10.7891 0.15625 11.4688 0.15625C12.0781 0.15625 12.4609 0.507812 12.4609 1.07031C12.4609 1.19531 12.4453 1.35938 12.4297 1.45312L11.9062 4.05469H13.6875C14.3047 4.05469 14.6875 4.4375 14.6875 4.99219C14.6875 5.70312 14.2188 6.17969 13.4609 6.17969H11.4844L10.875 9.25H12.6797C13.2969 9.25 13.6797 9.64062 13.6797 10.1953C13.6797 10.8984 13.2109 11.3594 12.4453 11.3594H10.4531L9.82031 14.5469C9.6875 15.2266 9.27344 15.5547 8.61719 15.5547C8.00781 15.5547 7.63281 15.2109 7.63281 14.6406C7.63281 14.5391 7.64844 14.375 7.67188 14.2656L8.25 11.3594H5.34375L4.71094 14.5469C4.57812 15.2266 4.15625 15.5547 3.51562 15.5547C2.90625 15.5547 2.52344 15.2109 2.52344 14.6406C2.52344 14.5391 2.53906 14.375 2.5625 14.2656L3.14062 11.3594H1.49219ZM5.76562 9.25H8.67188L9.28906 6.17969H6.375L5.76562 9.25Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="20" height="12" viewBox="0 0 20 12" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.30859 11.789C0.683594 11.789 0.191406 11.3359 0.191406 10.7656C0.191406 10.4765 0.285156 10.2265 0.511719 9.91407L3.32422 5.99219V5.92969L0.605469 2.22656C0.347656 1.88281 0.261719 1.62501 0.261719 1.32032C0.261719 0.679687 0.769532 0.210938 1.45703 0.210938C1.90234 0.210938 2.21484 0.40625 2.51953 0.867187L4.93359 4.42969H4.99609L7.48828 0.789063C7.76172 0.382813 7.99609 0.210938 8.44922 0.210938C9.0664 0.210938 9.59765 0.65625 9.59765 1.21874C9.59765 1.52343 9.51172 1.77343 9.28515 2.06251L6.35546 5.97656V6.03125L9.19922 9.86718C9.41796 10.1484 9.51172 10.414 9.51172 10.7265C9.51172 11.3437 9.03515 11.789 8.3789 11.789C7.94922 11.789 7.66015 11.6172 7.35546 11.2031L4.83984 7.69531H4.77734L2.30078 11.2109C2.0039 11.6406 1.7539 11.789 1.30859 11.789ZM12.496 11.789C11.7539 11.789 11.3164 11.3359 11.3164 10.5625V1.59374C11.3164 0.820313 11.7539 0.367187 12.496 0.367187H15.9023C18.2148 0.367187 19.8086 1.90624 19.8086 4.22656C19.8086 6.53906 18.1601 8.08594 15.7851 8.08594H13.6757V10.5625C13.6757 11.3359 13.2382 11.789 12.496 11.789ZM13.6757 6.24219H15.2695C16.621 6.24219 17.4101 5.52344 17.4101 4.23438C17.4101 2.95312 16.6289 2.23438 15.2773 2.23438H13.6757V6.24219Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="24" height="12" viewBox="0 0 24 12" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.898438 5.85938C0.898438 2.69531 2.94531 0.609375 5.97656 0.609375C7.53125 0.609375 8.875 1.26562 10.2578 2.60938L11.9688 4.25781L13.6719 2.60938C15.0547 1.26562 16.3984 0.609375 17.9531 0.609375C20.9844 0.609375 23.0312 2.69531 23.0312 5.85938C23.0312 9.01562 20.9844 11.1016 17.9531 11.1016C16.3984 11.1016 15.0547 10.4531 13.6719 9.10938L11.9688 7.45312L10.2578 9.10938C8.875 10.4531 7.53125 11.1016 5.97656 11.1016C2.94531 11.1016 0.898438 9.01562 0.898438 5.85938ZM3.21875 5.85938C3.21875 7.63281 4.32031 8.78125 5.97656 8.78125C6.875 8.78125 7.70312 8.34375 8.63281 7.46094L10.3281 5.85938L8.63281 4.25781C7.70312 3.375 6.875 2.92969 5.97656 2.92969C4.32031 2.92969 3.21875 4.07812 3.21875 5.85938ZM13.6016 5.85938L15.2969 7.46094C16.2344 8.34375 17.0547 8.78125 17.9531 8.78125C19.6094 8.78125 20.7109 7.63281 20.7109 5.85938C20.7109 4.07812 19.6094 2.92969 17.9531 2.92969C17.0547 2.92969 16.2266 3.375 15.2969 4.25781L13.6016 5.85938Z"/>
                                </svg>
                            </div>
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; opacity: 0.5; display: none;">PRACTICE</p>
                                <svg width="15" height="16" viewBox="0 0 15 16" fill="#007AFF" opacity="0.5" xmlns="http://www.w3.org/2000/svg" display="none">
                                    <path d="M1.39844 11.3594C0.78125 11.3594 0.398438 11 0.398438 10.4297C0.398438 9.72656 0.867188 9.25 1.625 9.25H3.46875L4.07812 6.17969H2.40625C1.78906 6.17969 1.39844 5.80469 1.39844 5.24219C1.39844 4.53125 1.875 4.05469 2.63281 4.05469H4.5L5.07812 1.17188C5.21094 0.507812 5.58594 0.15625 6.26562 0.15625C6.88281 0.15625 7.26562 0.507812 7.26562 1.07031C7.26562 1.19531 7.24219 1.35938 7.22656 1.45312L6.70312 4.05469H9.61719L10.1953 1.17188C10.3281 0.507812 10.6953 0.15625 11.375 0.15625C11.9844 0.15625 12.3672 0.507812 12.3672 1.07031C12.3672 1.19531 12.3516 1.35938 12.3359 1.45312L11.8125 4.05469H13.5938C14.2109 4.05469 14.5938 4.4375 14.5938 4.99219C14.5938 5.70312 14.125 6.17969 13.3672 6.17969H11.3906L10.7812 9.25H12.5859C13.2031 9.25 13.5859 9.64062 13.5859 10.1953C13.5859 10.8984 13.1172 11.3594 12.3516 11.3594H10.3594L9.72656 14.5469C9.59375 15.2266 9.17969 15.5547 8.52344 15.5547C7.91406 15.5547 7.53906 15.2109 7.53906 14.6406C7.53906 14.5391 7.55469 14.375 7.57812 14.2656L8.15625 11.3594H5.25L4.61719 14.5469C4.48438 15.2266 4.0625 15.5547 3.42188 15.5547C2.8125 15.5547 2.42969 15.2109 2.42969 14.6406C2.42969 14.5391 2.44531 14.375 2.46875 14.2656L3.04688 11.3594H1.39844ZM5.67188 9.25H8.57812L9.19531 6.17969H6.28125L5.67188 9.25Z"/>
                                </svg>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][18]}</p>
                                <svg id="DLP_Inset_Icon_1_ID" width="13" height="16" viewBox="0 0 13 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M-0.0078125 13.5391V2.17188C-0.0078125 1.17969 0.609375 0.671875 1.34375 0.671875C1.64844 0.671875 1.97656 0.757812 2.29688 0.945312L11.75 6.45312C12.4688 6.86719 12.8203 7.25781 12.8203 7.85938C12.8203 8.46094 12.4688 8.84375 11.75 9.26562L2.29688 14.7734C1.97656 14.9531 1.64844 15.0469 1.34375 15.0469C0.609375 15.0469 -0.0078125 14.5391 -0.0078125 13.5391Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_2_ID" display="none" width="11" height="15" viewBox="0 0 11 15" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.24219 14.8984C0.398438 14.8984 -0.0078125 14.4766 -0.0078125 13.6484V2.07031C-0.0078125 1.24219 0.414062 0.820312 1.24219 0.820312H3.17188C4 0.820312 4.42188 1.24219 4.42188 2.07031V13.6484C4.42188 14.4766 4 14.8984 3.17188 14.8984H1.24219ZM7.57031 14.8984C6.72656 14.8984 6.32031 14.4766 6.32031 13.6484V2.07031C6.32031 1.24219 6.74219 0.820312 7.57031 0.820312H9.5C10.3281 0.820312 10.75 1.24219 10.75 2.07031V13.6484C10.75 14.4766 10.3281 14.8984 9.5 14.8984H7.57031Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                                </svg>
                                <svg id="DLP_Inset_Icon_4_ID" display="none" width="18" height="16" viewBox="0 0 18 16" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_5_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_HStack_Auto_Top DLP_NoSelect">
                    <div class="DLP_HStack_4">
                        <p class="DLP_Text_Style_2">Duolingo</p>
                        <p class="DLP_Text_Style_2" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PRO 3.0</p>
                    </div>
                    <p class="DLP_Text_Style_1" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${versionName}</p>
                </div>
                <p class="DLP_Text_Style_1 DLP_NoSelect" id="DLP_Terms_1_Text_1_ID" style="opacity: 0.5;">${systemText[systemLanguage][25]}</p>
                <p class="DLP_Text_Style_1 DLP_NoSelect" id="DLP_Terms_1_Text_2_ID" style="opacity: 0.5; display: none; align-self: stretch;">${systemText[systemLanguage][26]}</p>
                <div class="DLP_Scroll_Box_Style_1">
                    <p id="DLP_Terms_Main_Text_1_ID" class="DLP_Scroll_Box_Text_Style_1">${systemText[systemLanguage][27]}</p>
                </div>
                <div class="DLP_HStack_8" id="DLP_Terms_1_Button_1_ID">
                    <div id="DLP_Terms_Decline_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1 DLP_NoSelect" style="outline: 2px solid rgba(0, 122, 255, 0.20); outline-offset: -2px; background: rgba(0, 122, 255, 0.10);">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.867188 12.9922C0.414062 12.5469 0.429688 11.7578 0.851562 11.3359L5.32031 6.86719L0.851562 2.41406C0.429688 1.98438 0.414062 1.20312 0.867188 0.75C1.32031 0.289062 2.10938 0.304688 2.53125 0.734375L6.99219 5.19531L11.4531 0.734375C11.8906 0.296875 12.6562 0.296875 13.1094 0.75C13.5703 1.20312 13.5703 1.96875 13.125 2.41406L8.67188 6.86719L13.125 11.3281C13.5703 11.7734 13.5625 12.5312 13.1094 12.9922C12.6641 13.4453 11.8906 13.4453 11.4531 13.0078L6.99219 8.54688L2.53125 13.0078C2.10938 13.4375 1.32812 13.4453 0.867188 12.9922Z"/>
                        </svg>
                        <p class="DLP_Text_Style_1" style="color: #007AFF;">${systemText[systemLanguage][28]}</p>
                    </div>
                    <div id="DLP_Terms_Accept_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1 DLP_NoSelect" style="outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: #007AFF;">
                        <p class="DLP_Text_Style_1" style="color: #FFF;">ACCEPT</p>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.25 15.0156C0.554688 15.0156 -0.0078125 14.4609 -0.0078125 13.7734C-0.0078125 13.4297 0.140625 13.1094 0.390625 12.8516L5.54688 7.85156L0.390625 2.85938C0.132812 2.60156 -0.0078125 2.28125 -0.0078125 1.94531C-0.0078125 1.25781 0.554688 0.703125 1.25 0.703125C1.59375 0.703125 1.875 0.820312 2.10938 1.05469L8.02344 6.83594C8.33594 7.14062 8.48438 7.46875 8.48438 7.85938C8.48438 8.24219 8.34375 8.5625 8.02344 8.88281L2.10938 14.6641C1.86719 14.8984 1.58594 15.0156 1.25 15.0156ZM8.22656 15.0156C7.53125 15.0156 6.96875 14.4609 6.96875 13.7734C6.96875 13.4297 7.11719 13.1094 7.375 12.8516L12.5234 7.85156L7.375 2.85938C7.10938 2.60156 6.96875 2.28125 6.96875 1.94531C6.96875 1.25781 7.53125 0.703125 8.22656 0.703125C8.57031 0.703125 8.85156 0.820312 9.09375 1.05469L15 6.83594C15.3203 7.14062 15.4609 7.46875 15.4688 7.85938C15.4688 8.24219 15.3203 8.5625 15.0078 8.88281L9.09375 14.6641C8.85156 14.8984 8.57031 15.0156 8.22656 15.0156Z"/>
                        </svg>
                    </div>
                </div>
                <div class="DLP_HStack_8" id="DLP_Terms_1_Button_2_ID" style="display: none;">
                    <div class="DLP_Button_Style_2 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Terms_Back_Button_1_ID" style="outline: 2px solid rgba(0, 122, 255, 0.20); outline-offset: -2px; background: rgba(0, 122, 255, 0.10);">
                        <svg width="9" height="16" viewBox="0 0 9 16" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.164062 7.85938C0.171875 7.46875 0.304688 7.14844 0.625 6.84375L6.53125 1.05469C6.77344 0.820312 7.05469 0.703125 7.39844 0.703125C8.08594 0.703125 8.65625 1.26562 8.65625 1.94531C8.65625 2.28906 8.50781 2.60938 8.25 2.85938L3.10156 7.85156L8.25 12.8516C8.50781 13.1094 8.65625 13.4219 8.65625 13.7734C8.65625 14.4609 8.08594 15.0156 7.39844 15.0156C7.05469 15.0156 6.77344 14.8984 6.53125 14.6641L0.625 8.875C0.304688 8.5625 0.164062 8.24219 0.164062 7.85938Z"/>
                        </svg>
                        <p class="DLP_Text_Style_1" style="color: #007AFF;">${systemText[systemLanguage][29]}</p>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_6_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_HStack_Auto_Top DLP_NoSelect">
                    <div class="DLP_HStack_4">
                        <p class="DLP_Text_Style_2">Duolingo</p>
                        <p class="DLP_Text_Style_2" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PRO 3.0</p>
                    </div>
                    <p class="DLP_Text_Style_1" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${versionName}</p>
                </div>
                <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.5;">${systemText[systemLanguage][30]}</p>
                <div class="DLP_HStack_8">
                    <div id="DLP_Terms_Declined_Back_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1 DLP_NoSelect" style="outline: 2px solid rgba(0, 122, 255, 0.20); outline-offset: -2px; background: rgba(0, 122, 255, 0.10);">
                        <svg width="9" height="16" viewBox="0 0 9 16" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.164062 7.85938C0.171875 7.46875 0.304688 7.14844 0.625 6.84375L6.53125 1.05469C6.77344 0.820312 7.05469 0.703125 7.39844 0.703125C8.08594 0.703125 8.65625 1.26562 8.65625 1.94531C8.65625 2.28906 8.50781 2.60938 8.25 2.85938L3.10156 7.85156L8.25 12.8516C8.50781 13.1094 8.65625 13.4219 8.65625 13.7734C8.65625 14.4609 8.08594 15.0156 7.39844 15.0156C7.05469 15.0156 6.77344 14.8984 6.53125 14.6641L0.625 8.875C0.304688 8.5625 0.164062 8.24219 0.164062 7.85938Z"/>
                        </svg>
                        <p class="DLP_Text_Style_1" style="color: #007AFF;">${systemText[systemLanguage][31]}</p>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_7_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_HStack_Auto_Top DLP_NoSelect">
                    <div id="DLP_Universal_Back_1_Button_1_ID" class="DLP_HStack_4">
                        <svg class="DLP_Magnetic_Hover_1" width="11" height="19" opacity=0.5 viewBox="0 0 11 19" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="nfwwjbvgzgudtdvj" patternUnits="objectBoundingBox" width="1" height="1">
                                    <image href="${serverURL}/static/images/flow/primary/512/light.png" width="19" height="19"/>
                                </pattern>
                            </defs>
                            <path d="M0.171875 9.44922C0.181641 9.04883 0.318359 8.7168 0.640625 8.4043L8.16016 1.05078C8.4043 0.796875 8.70703 0.679688 9.07812 0.679688C9.81055 0.679688 10.3965 1.25586 10.3965 1.98828C10.3965 2.34961 10.25 2.68164 9.98633 2.94531L3.30664 9.43945L9.98633 15.9531C10.25 16.2168 10.3965 16.5391 10.3965 16.9102C10.3965 17.6426 9.81055 18.2285 9.07812 18.2285C8.7168 18.2285 8.4043 18.1016 8.16016 17.8477L0.640625 10.4941C0.318359 10.1816 0.171875 9.84961 0.171875 9.44922Z" fill="url(#nfwwjbvgzgudtdvj)"/>
                        </svg>
                        <p class="DLP_Text_Style_2" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${systemText[systemLanguage][32]}</p>
                    </div>
                    <p class="DLP_Text_Style_1" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${versionName}</p>
                </div>
                <div id="DLP_Settings_Show_Solve_Buttons_1_ID" class="DLP_HStack_8" style="justify-content: center; align-items: center;">
                    <div class="DLP_VStack_0" style="align-items: flex-start; flex: 1 0 0;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.5;">Show Solve Buttons</p>
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.25;">In lessons and practices, see the solve and solve all buttons.</p>
                    </div>
                    <div id="DLP_Inset_Toggle_1_ID" class="DLP_Toggle_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect">
                        <svg id="DLP_Inset_Icon_1_ID" width="18" height="18" viewBox="0 0 18 18" fill="#FFF" xmlns="http://www.w3.org/2000/svg" display="none">
                            <path d="M9 17.1094C4.44531 17.1094 0.75 13.4141 0.75 8.85938C0.75 4.30469 4.44531 0.609375 9 0.609375C13.5547 0.609375 17.25 4.30469 17.25 8.85938C17.25 13.4141 13.5547 17.1094 9 17.1094ZM8.14062 12.7812C8.47656 12.7812 8.78125 12.6094 8.98438 12.3125L12.6094 6.76562C12.75 6.5625 12.8281 6.35156 12.8281 6.15625C12.8281 5.67188 12.3984 5.32812 11.9297 5.32812C11.625 5.32812 11.3672 5.49219 11.1641 5.82031L8.11719 10.6641L6.75781 8.98438C6.54688 8.73438 6.32812 8.625 6.04688 8.625C5.57031 8.625 5.17969 9.00781 5.17969 9.49219C5.17969 9.71875 5.25 9.91406 5.42969 10.1328L7.26562 12.3203C7.51562 12.625 7.78906 12.7812 8.14062 12.7812Z"/>
                        </svg>
                        <svg id="DLP_Inset_Icon_2_ID" width="18" height="18" viewBox="0 0 18 18" fill="#FFF" xmlns="http://www.w3.org/2000/svg" display="none">
                            <path d="M9 17.1094C4.44531 17.1094 0.75 13.4141 0.75 8.85938C0.75 4.30469 4.44531 0.609375 9 0.609375C13.5547 0.609375 17.25 4.30469 17.25 8.85938C17.25 13.4141 13.5547 17.1094 9 17.1094ZM6.53906 12.2188C6.8125 12.2188 7.03125 12.125 7.20312 11.9531L9 10.1484L10.8047 11.9531C10.9766 12.125 11.2031 12.2188 11.4688 12.2188C11.9766 12.2188 12.3672 11.8203 12.3672 11.3125C12.3672 11.0781 12.2734 10.8594 12.0938 10.6875L10.2812 8.875L12.1016 7.04688C12.2812 6.875 12.3672 6.65625 12.3672 6.42188C12.3672 5.92188 11.9766 5.53125 11.4766 5.53125C11.2109 5.53125 11.0078 5.60938 10.8203 5.79688L9 7.60156L7.19531 5.79688C7.01562 5.625 6.8125 5.53906 6.53906 5.53906C6.03906 5.53906 5.64844 5.92188 5.64844 6.4375C5.64844 6.66406 5.74219 6.88281 5.91406 7.05469L7.73438 8.875L5.91406 10.6953C5.74219 10.8594 5.64844 11.0859 5.64844 11.3125C5.64844 11.8203 6.03906 12.2188 6.53906 12.2188Z"/>
                        </svg>
                    </div>
                </div>
                <div id="DLP_Settings_Show_AutoServer_Button_1_ID" class="DLP_HStack_8" style="justify-content: center; align-items: center;">
                    <div class="DLP_VStack_0" style="align-items: flex-start; flex: 1 0 0;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.5;">Show AutoServer Button</p>
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.25;">See the AutoServer by Duolingo PRO button in your Duolingo menubar.</p>
                    </div>
                    <div id="DLP_Inset_Toggle_1_ID" class="DLP_Toggle_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect">
                        <svg id="DLP_Inset_Icon_1_ID" width="18" height="18" viewBox="0 0 18 18" fill="#FFF" xmlns="http://www.w3.org/2000/svg" display="none">
                            <path d="M9 17.1094C4.44531 17.1094 0.75 13.4141 0.75 8.85938C0.75 4.30469 4.44531 0.609375 9 0.609375C13.5547 0.609375 17.25 4.30469 17.25 8.85938C17.25 13.4141 13.5547 17.1094 9 17.1094ZM8.14062 12.7812C8.47656 12.7812 8.78125 12.6094 8.98438 12.3125L12.6094 6.76562C12.75 6.5625 12.8281 6.35156 12.8281 6.15625C12.8281 5.67188 12.3984 5.32812 11.9297 5.32812C11.625 5.32812 11.3672 5.49219 11.1641 5.82031L8.11719 10.6641L6.75781 8.98438C6.54688 8.73438 6.32812 8.625 6.04688 8.625C5.57031 8.625 5.17969 9.00781 5.17969 9.49219C5.17969 9.71875 5.25 9.91406 5.42969 10.1328L7.26562 12.3203C7.51562 12.625 7.78906 12.7812 8.14062 12.7812Z"/>
                        </svg>
                        <svg id="DLP_Inset_Icon_2_ID" width="18" height="18" viewBox="0 0 18 18" fill="#FFF" xmlns="http://www.w3.org/2000/svg" display="none">
                            <path d="M9 17.1094C4.44531 17.1094 0.75 13.4141 0.75 8.85938C0.75 4.30469 4.44531 0.609375 9 0.609375C13.5547 0.609375 17.25 4.30469 17.25 8.85938C17.25 13.4141 13.5547 17.1094 9 17.1094ZM6.53906 12.2188C6.8125 12.2188 7.03125 12.125 7.20312 11.9531L9 10.1484L10.8047 11.9531C10.9766 12.125 11.2031 12.2188 11.4688 12.2188C11.9766 12.2188 12.3672 11.8203 12.3672 11.3125C12.3672 11.0781 12.2734 10.8594 12.0938 10.6875L10.2812 8.875L12.1016 7.04688C12.2812 6.875 12.3672 6.65625 12.3672 6.42188C12.3672 5.92188 11.9766 5.53125 11.4766 5.53125C11.2109 5.53125 11.0078 5.60938 10.8203 5.79688L9 7.60156L7.19531 5.79688C7.01562 5.625 6.8125 5.53906 6.53906 5.53906C6.03906 5.53906 5.64844 5.92188 5.64844 6.4375C5.64844 6.66406 5.74219 6.88281 5.91406 7.05469L7.73438 8.875L5.91406 10.6953C5.74219 10.8594 5.64844 11.0859 5.64844 11.3125C5.64844 11.8203 6.03906 12.2188 6.53906 12.2188Z"/>
                        </svg>
                    </div>
                </div>
                <div id="DLP_Settings_Legacy_Solve_Speed_1_ID" class="DLP_HStack_8" style="justify-content: center; align-items: center;">
                    <div class="DLP_VStack_0" style="align-items: flex-start; flex: 1 0 0;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.5;">Legacy Solve Speed</p>
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.25;">Legacy will solve each question every this amount of seconds. The lower speed you set, the more mistakes Legacy can make.</p>
                    </div>
                    <div class="DLP_Input_Style_1_Active" style="flex: none; width: 72px;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #007AFF; opacity: 0.5; display: none;">GEMS</p>
                        <svg width="15" height="16" viewBox="0 0 15 16" fill="#007AFF" opacity="0.5" xmlns="http://www.w3.org/2000/svg" style="display: none;">
                            <path d="M1.39844 11.3594C0.78125 11.3594 0.398438 11 0.398438 10.4297C0.398438 9.72656 0.867188 9.25 1.625 9.25H3.46875L4.07812 6.17969H2.40625C1.78906 6.17969 1.39844 5.80469 1.39844 5.24219C1.39844 4.53125 1.875 4.05469 2.63281 4.05469H4.5L5.07812 1.17188C5.21094 0.507812 5.58594 0.15625 6.26562 0.15625C6.88281 0.15625 7.26562 0.507812 7.26562 1.07031C7.26562 1.19531 7.24219 1.35938 7.22656 1.45312L6.70312 4.05469H9.61719L10.1953 1.17188C10.3281 0.507812 10.6953 0.15625 11.375 0.15625C11.9844 0.15625 12.3672 0.507812 12.3672 1.07031C12.3672 1.19531 12.3516 1.35938 12.3359 1.45312L11.8125 4.05469H13.5938C14.2109 4.05469 14.5938 4.4375 14.5938 4.99219C14.5938 5.70312 14.125 6.17969 13.3672 6.17969H11.3906L10.7812 9.25H12.5859C13.2031 9.25 13.5859 9.64062 13.5859 10.1953C13.5859 10.8984 13.1172 11.3594 12.3516 11.3594H10.3594L9.72656 14.5469C9.59375 15.2266 9.17969 15.5547 8.52344 15.5547C7.91406 15.5547 7.53906 15.2109 7.53906 14.6406C7.53906 14.5391 7.55469 14.375 7.57812 14.2656L8.15625 11.3594H5.25L4.61719 14.5469C4.48438 15.2266 4.0625 15.5547 3.42188 15.5547C2.8125 15.5547 2.42969 15.2109 2.42969 14.6406C2.42969 14.5391 2.44531 14.375 2.46875 14.2656L3.04688 11.3594H1.39844ZM5.67188 9.25H8.57812L9.19531 6.17969H6.28125L5.67188 9.25Z"/>
                        </svg>
                        <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1" style="text-align: center;">
                    </div>
                </div>
                <div id="DLP_Settings_Auto_Update_Toggle_1_ID" class="DLP_HStack_8" style="justify-content: center; align-items: center; opacity: 0.5; pointer-events: none; cursor: not-allowed;">
                    <div class="DLP_VStack_0" style="align-items: flex-start; flex: 1 0 0;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.5;">${systemText[systemLanguage][34]}</p>
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.25;">${systemText[systemLanguage][35]}</p>
                    </div>
                    <div id="DLP_Inset_Toggle_1_ID" class="DLP_Toggle_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect">
                        <svg id="DLP_Inset_Icon_1_ID" width="18" height="18" viewBox="0 0 18 18" fill="#FFF" xmlns="http://www.w3.org/2000/svg" display="none">
                            <path d="M9 17.1094C4.44531 17.1094 0.75 13.4141 0.75 8.85938C0.75 4.30469 4.44531 0.609375 9 0.609375C13.5547 0.609375 17.25 4.30469 17.25 8.85938C17.25 13.4141 13.5547 17.1094 9 17.1094ZM8.14062 12.7812C8.47656 12.7812 8.78125 12.6094 8.98438 12.3125L12.6094 6.76562C12.75 6.5625 12.8281 6.35156 12.8281 6.15625C12.8281 5.67188 12.3984 5.32812 11.9297 5.32812C11.625 5.32812 11.3672 5.49219 11.1641 5.82031L8.11719 10.6641L6.75781 8.98438C6.54688 8.73438 6.32812 8.625 6.04688 8.625C5.57031 8.625 5.17969 9.00781 5.17969 9.49219C5.17969 9.71875 5.25 9.91406 5.42969 10.1328L7.26562 12.3203C7.51562 12.625 7.78906 12.7812 8.14062 12.7812Z"/>
                        </svg>
                        <svg id="DLP_Inset_Icon_2_ID" width="18" height="18" viewBox="0 0 18 18" fill="#FFF" xmlns="http://www.w3.org/2000/svg" display="none">
                            <path d="M9 17.1094C4.44531 17.1094 0.75 13.4141 0.75 8.85938C0.75 4.30469 4.44531 0.609375 9 0.609375C13.5547 0.609375 17.25 4.30469 17.25 8.85938C17.25 13.4141 13.5547 17.1094 9 17.1094ZM6.53906 12.2188C6.8125 12.2188 7.03125 12.125 7.20312 11.9531L9 10.1484L10.8047 11.9531C10.9766 12.125 11.2031 12.2188 11.4688 12.2188C11.9766 12.2188 12.3672 11.8203 12.3672 11.3125C12.3672 11.0781 12.2734 10.8594 12.0938 10.6875L10.2812 8.875L12.1016 7.04688C12.2812 6.875 12.3672 6.65625 12.3672 6.42188C12.3672 5.92188 11.9766 5.53125 11.4766 5.53125C11.2109 5.53125 11.0078 5.60938 10.8203 5.79688L9 7.60156L7.19531 5.79688C7.01562 5.625 6.8125 5.53906 6.53906 5.53906C6.03906 5.53906 5.64844 5.92188 5.64844 6.4375C5.64844 6.66406 5.74219 6.88281 5.91406 7.05469L7.73438 8.875L5.91406 10.6953C5.74219 10.8594 5.64844 11.0859 5.64844 11.3125C5.64844 11.8203 6.03906 12.2188 6.53906 12.2188Z"/>
                        </svg>
                    </div>
                </div>
                <div class="DLP_HStack_8">
                    <div id="DLP_Settings_Save_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1 DLP_NoSelect" style="outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: #007AFF;">
                        <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][37]}</p>
                        <svg id="DLP_Inset_Icon_1_ID" width="17" height="18" viewBox="0 0 17 18" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                        </svg>
                        <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>


        <div clas="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_8_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_HStack_Auto_Top DLP_NoSelect">
                    <div id="DLP_Universal_Back_1_Button_1_ID" class="DLP_HStack_4">
                        <svg class="DLP_Magnetic_Hover_1" width="11" height="19" opacity=0.5 viewBox="0 0 11 19" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="samivfevrtmmmsua" patternUnits="objectBoundingBox" width="1" height="1">
                                    <image href="${serverURL}/static/images/flow/primary/512/light.png" width="19" height="19"/>
                                </pattern>
                            </defs>
                            <path d="M0.171875 9.44922C0.181641 9.04883 0.318359 8.7168 0.640625 8.4043L8.16016 1.05078C8.4043 0.796875 8.70703 0.679688 9.07812 0.679688C9.81055 0.679688 10.3965 1.25586 10.3965 1.98828C10.3965 2.34961 10.25 2.68164 9.98633 2.94531L3.30664 9.43945L9.98633 15.9531C10.25 16.2168 10.3965 16.5391 10.3965 16.9102C10.3965 17.6426 9.81055 18.2285 9.07812 18.2285C8.7168 18.2285 8.4043 18.1016 8.16016 17.8477L0.640625 10.4941C0.318359 10.1816 0.171875 9.84961 0.171875 9.44922Z" fill="url(#samivfevrtmmmsua)"/>
                        </svg>
                        <p class="DLP_Text_Style_2" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${systemText[systemLanguage][38]}</p>
                    </div>
                    <p class="DLP_Text_Style_1" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${versionName}</p>
                </div>
                <div class="DLP_VStack_4" style="padding: 16px; border-radius: 8px; outline: 2px solid rgba(0, 122, 255, 0.20); outline-offset: -2px; background: rgba(0, 122, 255, 0.10); box-sizing: border-box;">
                    <div class="DLP_HStack_4">
                        <svg width="17" height="17" viewBox="0 0 17 17" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.54688 16.5078C4.04688 16.5078 0.398438 12.8594 0.398438 8.35938C0.398438 3.85938 4.04688 0.210938 8.54688 0.210938C13.0469 0.210938 16.6953 3.85938 16.6953 8.35938C16.6953 12.8594 13.0469 16.5078 8.54688 16.5078ZM8.54688 14.7188C12.0625 14.7188 14.9062 11.875 14.9062 8.35938C14.9062 4.84375 12.0625 2 8.54688 2C5.03125 2 2.1875 4.84375 2.1875 8.35938C2.1875 11.875 5.03125 14.7188 8.54688 14.7188ZM8.35938 9.875C7.82812 9.875 7.53125 9.63281 7.53125 9.16406V9.08594C7.53125 8.42188 7.92969 8.03125 8.47656 7.64844C9.125 7.19531 9.45312 6.96875 9.45312 6.5C9.45312 6.01562 9.0625 5.67188 8.48438 5.67188C8.05469 5.67188 7.71094 5.86719 7.45312 6.27344L7.34375 6.41406C7.17969 6.63281 6.96875 6.75 6.67188 6.75C6.3125 6.75 6 6.48438 6 6.09375C6 5.9375 6.03125 5.80469 6.08594 5.66406C6.34375 4.92188 7.27344 4.33594 8.60938 4.33594C10.0391 4.33594 11.2188 5.10938 11.2188 6.40625C11.2188 7.29688 10.7578 7.74219 9.96875 8.24219C9.49219 8.55469 9.19531 8.82031 9.16406 9.20312C9.15625 9.22656 9.15625 9.26562 9.14844 9.29688C9.11719 9.625 8.8125 9.875 8.35938 9.875ZM8.35156 12.3125C7.8125 12.3125 7.38281 11.9453 7.38281 11.4219C7.38281 10.9062 7.8125 10.5312 8.35156 10.5312C8.89062 10.5312 9.3125 10.8984 9.3125 11.4219C9.3125 11.9453 8.89062 12.3125 8.35156 12.3125Z"/>
                        </svg>
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; color: #007AFF;">Need Support?</p>
                    </div>
                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; color: #007AFF; opacity: 0.5;">Get help from our <a href='https://www.duolingopro.net/faq' target='_blank' style='font-family: Duolingo Pro Rounded; color: #007AFF; text-decoration: underline;'>FAQ page</a>, enhanced with AI, or join our <a href='https://www.duolingopro.net/discord' target='_blank' style='font-family: Duolingo Pro Rounded; color: #007AFF; text-decoration: underline;'>Discord server</a> and talk with the devs.</p>
                </div>
                <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.5; align-self: stretch;">${systemText[systemLanguage][39]}</p>
                <textarea id="DLP_Feedback_Text_Input_1_ID" class="DLP_Large_Input_Box_Style_1" style="height: 128px; max-height: 256px;" placeholder="${systemText[systemLanguage][40]}"/></textarea>
                <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.5; align-self: stretch;">${systemText[systemLanguage][41]}</p>
                <div class="DLP_HStack_8">
                    <div id="DLP_Feedback_Type_Bug_Report_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Feedback_Type_Button_Style_1_OFF" style="transition: background 0.4s, outline 0.4s, filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.4s cubic-bezier(0.16, 1, 0.32, 1);">
                        <p class="DLP_Text_Style_1" style="transition: 0.4s;">${systemText[systemLanguage][42]}</p>
                    </div>
                    <div id="DLP_Feedback_Type_Suggestion_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Feedback_Type_Button_Style_2_ON" style="transition: background 0.4s, outline 0.4s, filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.4s cubic-bezier(0.16, 1, 0.32, 1);">
                        <p class="DLP_Text_Style_1" style="transition: 0.4s;">${systemText[systemLanguage][43]}</p>
                    </div>
                </div>
                <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.5; align-self: stretch;">${systemText[systemLanguage][44]}</p>
                <div class="DLP_HStack_8">
                    <div id="DLP_Feedback_Attachment_Upload_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1 DLP_NoSelect" style="outline: 2px solid rgba(0, 122, 255, 0.20); outline-offset: -2px; background: rgba(0, 122, 255, 0.10); transition: background 0.4s, outline 0.4s, filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.4s cubic-bezier(0.16, 1, 0.32, 1);">
                        <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #007AFF; transition: 0.4s;">${systemText[systemLanguage][45]}</p>
                        <svg id="DLP_Inset_Icon_1_ID" width="14" height="14" viewBox="0 0 14 14" fill="#007AFF" xmlns="http://www.w3.org/2000/svg" style="transition: 0.4s;">
                            <path d="M-0.0078125 6.85938C-0.0078125 6.21094 0.523438 5.67969 1.17969 5.67969H5.51562V1.34375C5.51562 0.695312 6.03906 0.15625 6.69531 0.15625C7.35156 0.15625 7.88281 0.695312 7.88281 1.34375V5.67969H12.2188C12.8672 5.67969 13.3984 6.21094 13.3984 6.85938C13.3984 7.51562 12.8672 8.04688 12.2188 8.04688H7.88281V12.3828C7.88281 13.0312 7.35156 13.5703 6.69531 13.5703C6.03906 13.5703 5.51562 13.0312 5.51562 12.3828V8.04688H1.17969C0.523438 8.04688 -0.0078125 7.51562 -0.0078125 6.85938Z"/>
                        </svg>
                    </div>
                </div>
                <input type="file" accept="image/png, image/jpg, image/jpeg, video/mp4, image/gif, video/mov, video/webm" id="DLP_Feedback_Attachment_Input_Hidden_1_ID" style="display: none;"/>
                <div class="DLP_HStack_8">
                    <div id="DLP_Feedback_Send_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1 DLP_NoSelect" style="outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: #007AFF;">
                        <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][47]}</p>
                        <svg id="DLP_Inset_Icon_1_ID" display="" width="16" height="16" viewBox="0 0 16 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.25 15.0156C0.554688 15.0156 -0.0078125 14.4609 -0.0078125 13.7734C-0.0078125 13.4297 0.140625 13.1094 0.390625 12.8516L5.54688 7.85156L0.390625 2.85938C0.132812 2.60156 -0.0078125 2.28125 -0.0078125 1.94531C-0.0078125 1.25781 0.554688 0.703125 1.25 0.703125C1.59375 0.703125 1.875 0.820312 2.10938 1.05469L8.02344 6.83594C8.33594 7.14062 8.48438 7.46875 8.48438 7.85938C8.48438 8.24219 8.34375 8.5625 8.02344 8.88281L2.10938 14.6641C1.86719 14.8984 1.58594 15.0156 1.25 15.0156ZM8.22656 15.0156C7.53125 15.0156 6.96875 14.4609 6.96875 13.7734C6.96875 13.4297 7.11719 13.1094 7.375 12.8516L12.5234 7.85156L7.375 2.85938C7.10938 2.60156 6.96875 2.28125 6.96875 1.94531C6.96875 1.25781 7.53125 0.703125 8.22656 0.703125C8.57031 0.703125 8.85156 0.820312 9.09375 1.05469L15 6.83594C15.3203 7.14062 15.4609 7.46875 15.4688 7.85938C15.4688 8.24219 15.3203 8.5625 15.0078 8.88281L9.09375 14.6641C8.85156 14.8984 8.57031 15.0156 8.22656 15.0156Z"/>
                        </svg>
                        <svg id="DLP_Inset_Icon_2_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.64844 2.66406C8.03125 2.66406 7.4375 2.75 6.875 2.92188L6.07812 1.02344C6.89062 0.757812 7.75781 0.609375 8.64844 0.609375C9.53906 0.609375 10.3984 0.757812 11.2031 1.02344L10.4219 2.92188C9.85938 2.75781 9.26562 2.66406 8.64844 2.66406ZM14.1016 5.91406C13.5312 4.84375 12.6562 3.96875 11.5859 3.39844L12.375 1.50781C13.9297 2.30469 15.2031 3.57812 16 5.125L14.1016 5.91406ZM5.70312 3.39844C4.63281 3.97656 3.75781 4.85156 3.19531 5.92188L1.29688 5.125C2.09375 3.57812 3.36719 2.30469 4.91406 1.50781L5.70312 3.39844ZM14.8438 8.85938C14.8438 8.24219 14.7578 7.64844 14.5859 7.08594L16.4844 6.29688C16.7578 7.10156 16.8984 7.96875 16.8984 8.85938C16.8984 9.75 16.7578 10.6172 16.4844 11.4219L14.5938 10.6328C14.75 10.0703 14.8438 9.47656 14.8438 8.85938ZM2.46094 8.85938C2.46094 9.47656 2.54688 10.0703 2.71094 10.625L0.8125 11.4219C0.546875 10.6094 0.398438 9.75 0.398438 8.85938C0.398438 7.96875 0.546875 7.10938 0.8125 6.29688L2.71094 7.08594C2.54688 7.64844 2.46094 8.24219 2.46094 8.85938ZM11.5859 14.3125C12.6562 13.7422 13.5391 12.875 14.1094 11.8047L16 12.5938C15.2031 14.1406 13.9297 15.4141 12.375 16.2109L11.5859 14.3125ZM3.19531 11.8047C3.76562 12.8672 4.63281 13.7422 5.70312 14.3125L4.91406 16.2031C3.36719 15.4141 2.09375 14.1406 1.29688 12.5938L3.19531 11.8047ZM8.64844 15.0547C9.26562 15.0547 9.85938 14.9609 10.4141 14.7969L11.2109 16.6953C10.3984 16.9609 9.53906 17.1094 8.64844 17.1094C7.75781 17.1094 6.89062 16.9609 6.08594 16.6953L6.875 14.7969C7.4375 14.9609 8.03125 15.0547 8.64844 15.0547Z"/>
                        </svg>
                        <svg id="DLP_Inset_Icon_3_ID" display="none" width="17" height="18" viewBox="0 0 17 18" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.64844 17.1094C4.09375 17.1094 0.398438 13.4141 0.398438 8.85938C0.398438 4.30469 4.09375 0.609375 8.64844 0.609375C13.2031 0.609375 16.8984 4.30469 16.8984 8.85938C16.8984 13.4141 13.2031 17.1094 8.64844 17.1094ZM7.78906 12.7812C8.125 12.7812 8.42969 12.6094 8.63281 12.3125L12.2578 6.76562C12.3984 6.5625 12.4766 6.35156 12.4766 6.15625C12.4766 5.67188 12.0469 5.32812 11.5781 5.32812C11.2734 5.32812 11.0156 5.49219 10.8125 5.82031L7.76562 10.6641L6.40625 8.98438C6.19531 8.73438 5.97656 8.625 5.69531 8.625C5.21875 8.625 4.82812 9.00781 4.82812 9.49219C4.82812 9.71875 4.89844 9.91406 5.07812 10.1328L6.91406 12.3203C7.16406 12.625 7.4375 12.7812 7.78906 12.7812Z"/>
                        </svg>
                        <svg id="DLP_Inset_Icon_4_ID" display="none" width="18" height="16" viewBox="0 0 18 16" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.96094 15.5469C1.53125 15.5469 0.59375 14.4688 0.59375 13.1797C0.59375 12.7812 0.695312 12.375 0.914062 11.9922L6.92969 1.47656C7.38281 0.695312 8.17188 0.289062 8.97656 0.289062C9.77344 0.289062 10.5547 0.6875 11.0156 1.47656L17.0312 11.9844C17.25 12.3672 17.3516 12.7812 17.3516 13.1797C17.3516 14.4688 16.4141 15.5469 14.9844 15.5469H2.96094ZM8.98438 9.96094C9.52344 9.96094 9.83594 9.65625 9.86719 9.09375L9.99219 5.72656C10.0234 5.14062 9.59375 4.73438 8.97656 4.73438C8.35156 4.73438 7.92969 5.13281 7.96094 5.72656L8.08594 9.10156C8.10938 9.65625 8.42969 9.96094 8.98438 9.96094ZM8.98438 12.7812C9.60156 12.7812 10.0859 12.3906 10.0859 11.7891C10.0859 11.2031 9.60938 10.8047 8.98438 10.8047C8.35938 10.8047 7.875 11.2031 7.875 11.7891C7.875 12.3906 8.35938 12.7812 8.98438 12.7812Z"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_9_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_HStack_Auto_Top DLP_NoSelect">
                    <div id="DLP_Universal_Back_1_Button_1_ID" class="DLP_HStack_4">
                        <svg class="DLP_Magnetic_Hover_1" width="11" height="19" opacity=0.5 viewBox="0 0 11 19" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="xhyvfdodoyhnxdox" patternUnits="objectBoundingBox" width="1" height="1">
                                    <image href="${serverURL}/static/images/flow/primary/512/light.png" width="19" height="19"/>
                                </pattern>
                            </defs>
                            <path d="M0.171875 9.44922C0.181641 9.04883 0.318359 8.7168 0.640625 8.4043L8.16016 1.05078C8.4043 0.796875 8.70703 0.679688 9.07812 0.679688C9.81055 0.679688 10.3965 1.25586 10.3965 1.98828C10.3965 2.34961 10.25 2.68164 9.98633 2.94531L3.30664 9.43945L9.98633 15.9531C10.25 16.2168 10.3965 16.5391 10.3965 16.9102C10.3965 17.6426 9.81055 18.2285 9.07812 18.2285C8.7168 18.2285 8.4043 18.1016 8.16016 17.8477L0.640625 10.4941C0.318359 10.1816 0.171875 9.84961 0.171875 9.44922Z" fill="url(#xhyvfdodoyhnxdox)"/>
                        </svg>
                        <p class="DLP_Text_Style_2" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${systemText[systemLanguage][48]}</p>
                    </div>
                    <p class="DLP_Text_Style_1" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${versionName}</p>
                </div>
                <div class="DLP_VStack_8" id="DLP_Release_Notes_List_1_ID"></div>
                <div id="DLP_Release_Notes_Controls" class="DLP_NoSelect" style="display: flex; align-items: center; gap: 8px; margin: 8px;">
                    <svg id="DLP_Inset_Icon_1_ID" class="DLP_Magnetic_Hover_1" width="23" height="23" viewBox="0 0 23 23" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.42188 22.6016C1.83203 22.6016 0.449219 21.2305 0.449219 18.6641V4.42578C0.449219 1.85938 1.83203 0.488281 4.42188 0.488281H18.5781C21.1797 0.488281 22.5508 1.85938 22.5508 4.42578V18.6641C22.5508 21.2305 21.1797 22.6016 18.5781 22.6016H4.42188ZM13.9609 17.4336C14.418 16.9766 14.3945 16.2734 13.9609 15.8633L9.36719 11.5508L13.9609 7.23828C14.4062 6.82812 14.3945 6.08984 13.9375 5.67969C13.5273 5.29297 12.8594 5.29297 12.4141 5.70312L7.60938 10.2148C6.84766 10.9297 6.84766 12.1836 7.60938 12.8867L12.4141 17.3984C12.8125 17.7852 13.5859 17.7969 13.9609 17.4336Z"/>
                    </svg>
                    <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="color: #007AFF;">1/3</p>
                    <svg id="DLP_Inset_Icon_2_ID" class="DLP_Magnetic_Hover_1" width="23" height="23" viewBox="0 0 23 23" fill="#007AFF" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.42188 22.6016C1.83203 22.6016 0.449219 21.2305 0.449219 18.6641V4.42578C0.449219 1.85938 1.83203 0.488281 4.42188 0.488281H18.5781C21.1797 0.488281 22.5508 1.85938 22.5508 4.42578V18.6641C22.5508 21.2305 21.1797 22.6016 18.5781 22.6016H4.42188ZM8.79297 17.5625C9.17969 17.9375 9.96484 17.9141 10.375 17.5273L15.2852 12.9219C16.0703 12.1953 16.0703 10.918 15.2852 10.1914L10.375 5.58594C9.92969 5.16406 9.23828 5.15234 8.81641 5.55078C8.35938 5.98438 8.34766 6.72266 8.79297 7.14453L13.5039 11.5508L8.79297 15.9688C8.35938 16.3906 8.33594 17.0938 8.79297 17.5625Z"/>
                    </svg>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_10_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_VStack_8" style="padding: 8px 0;">
                    <div class="DLP_VStack_0">
                        <p class="DLP_Text_Style_1" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${systemText[systemLanguage][52]}</p>
                        <div class="DLP_HStack_4" style="align-self: auto;">
                            <p class="DLP_Text_Style_2">Duolingo</p>
                            <p class="DLP_Text_Style_2" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PRO 3.0</p>
                        </div>
                    </div>
                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5; text-align: center;">${systemText[systemLanguage][53]}</p>
                </div>
                <div class="DLP_HStack_8">
                    <div id="DLP_Onboarding_Start_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1 DLP_NoSelect" style="outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: #007AFF;">
                        <p class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][54]}</p>
                        <svg id="DLP_Inset_Icon_1_ID" display="" width="16" height="16" viewBox="0 0 16 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.25 15.0156C0.554688 15.0156 -0.0078125 14.4609 -0.0078125 13.7734C-0.0078125 13.4297 0.140625 13.1094 0.390625 12.8516L5.54688 7.85156L0.390625 2.85938C0.132812 2.60156 -0.0078125 2.28125 -0.0078125 1.94531C-0.0078125 1.25781 0.554688 0.703125 1.25 0.703125C1.59375 0.703125 1.875 0.820312 2.10938 1.05469L8.02344 6.83594C8.33594 7.14062 8.48438 7.46875 8.48438 7.85938C8.48438 8.24219 8.34375 8.5625 8.02344 8.88281L2.10938 14.6641C1.86719 14.8984 1.58594 15.0156 1.25 15.0156ZM8.22656 15.0156C7.53125 15.0156 6.96875 14.4609 6.96875 13.7734C6.96875 13.4297 7.11719 13.1094 7.375 12.8516L12.5234 7.85156L7.375 2.85938C7.10938 2.60156 6.96875 2.28125 6.96875 1.94531C6.96875 1.25781 7.53125 0.703125 8.22656 0.703125C8.57031 0.703125 8.85156 0.820312 9.09375 1.05469L15 6.83594C15.3203 7.14062 15.4609 7.46875 15.4688 7.85938C15.4688 8.24219 15.3203 8.5625 15.0078 8.88281L9.09375 14.6641C8.85156 14.8984 8.57031 15.0156 8.22656 15.0156Z"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_11_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_HStack_Auto_Top DLP_NoSelect">
                    <div class="DLP_HStack_4">
                        <p class="DLP_Text_Style_2" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Support</p>
                    </div>
                    <p class="DLP_Text_Style_1" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${versionName}</p>
                </div>

                <div class="DLP_HStack_8">
                    <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Main_Feedback_1_Button_1_ID" style="outline: 2px solid rgba(88, 101, 242, 0.20); outline-offset: -2px; background: rgba(88, 101, 242, 0.10); justify-content: center;">
                        <svg width="20" height="16" viewBox="0 0 20 16" fill="#5865F2" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.5948 2.06843C15.3649 1.51091 14.0498 1.10572 12.675 0.875C12.5061 1.17077 12.3088 1.56859 12.1728 1.88506C10.7113 1.6721 9.26323 1.6721 7.82858 1.88506C7.6926 1.56859 7.49086 1.17077 7.32049 0.875C5.94414 1.10572 4.62756 1.51239 3.39765 2.07139C0.916926 5.70339 0.244441 9.24519 0.580684 12.7367C2.22603 13.9271 3.82057 14.6503 5.3882 15.1235C5.77526 14.6074 6.12046 14.0588 6.41785 13.4806C5.85147 13.272 5.309 13.0147 4.79643 12.716C4.93242 12.6184 5.06543 12.5163 5.19393 12.4113C8.32024 13.8281 11.717 13.8281 14.806 12.4113C14.936 12.5163 15.069 12.6184 15.2035 12.716C14.6894 13.0162 14.1455 13.2735 13.5791 13.482C13.8765 14.0588 14.2202 14.6089 14.6087 15.125C16.1779 14.6518 17.7739 13.9286 19.4192 12.7367C19.8138 8.68915 18.7453 5.17988 16.5948 2.06843ZM6.84376 10.5895C5.90528 10.5895 5.13565 9.74059 5.13565 8.70689C5.13565 7.67319 5.88885 6.82287 6.84376 6.82287C7.79871 6.82287 8.56832 7.6717 8.55188 8.70689C8.55337 9.74059 7.79871 10.5895 6.84376 10.5895ZM13.1562 10.5895C12.2177 10.5895 11.4481 9.74059 11.4481 8.70689C11.4481 7.67319 12.2012 6.82287 13.1562 6.82287C14.1111 6.82287 14.8807 7.6717 14.8643 8.70689C14.8643 9.74059 14.1111 10.5895 13.1562 10.5895Z"/>
                        </svg>
                        <p class="DLP_Text_Style_1" style="color: #5865F2;">Talk in Discord</p>
                    </div>
                    <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Main_Settings_1_Button_1_ID" style="outline: 2px solid rgba(255, 45, 85, 0.20); outline-offset: -2px; background: rgba(255, 45, 85, 0.10); justify-content: center;">
                        <svg width="15" height="14" viewBox="0 0 15 14" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.36719 12.9922C0.914062 12.5469 0.929688 11.7578 1.35156 11.3359L5.82031 6.86719L1.35156 2.41406C0.929688 1.98438 0.914062 1.20312 1.36719 0.75C1.82031 0.289062 2.60938 0.304688 3.03125 0.734375L7.49219 5.19531L11.9531 0.734375C12.3906 0.296875 13.1562 0.296875 13.6094 0.75C14.0703 1.20312 14.0703 1.96875 13.625 2.41406L9.17188 6.86719L13.625 11.3281C14.0703 11.7734 14.0625 12.5312 13.6094 12.9922C13.1641 13.4453 12.3906 13.4453 11.9531 13.0078L7.49219 8.54688L3.03125 13.0078C2.60938 13.4375 1.82812 13.4453 1.36719 12.9922Z"/>
                        </svg>
                        <p class="DLP_Text_Style_1" style="color: #FF2D55;">End Chat</p>
                    </div>
                </div>

                <div class="DLP_VStack_8">
                    <div class="DLP_HStack_8">

                        <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID" style="width: 48px; background: rgba(0, 122, 255, 0.10); outline-offset: -2px; outline: 2px solid rgba(0, 122, 255, 0.20);">
                            <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.8438 10.2031C14.1719 9.88281 14.7109 9.85156 15.0234 10.1875C15.3594 10.5 15.3594 11.0938 15.0391 11.4062L9.19531 17.2578C7.13281 19.3125 4.14844 19.1797 2.25 17.2969C0.367188 15.4062 0.242188 12.4219 2.29688 10.3594L10.3359 2.3125C11.9297 0.726562 14.0625 0.804688 15.4531 2.1875C16.8672 3.60156 16.9141 5.70312 15.3203 7.29688L7.39062 15.2266C6.48438 16.1328 5.14844 16.1562 4.27344 15.2812C3.46094 14.4688 3.42188 13.0703 4.32812 12.1562L9.83594 6.64844C10.1719 6.3125 10.6719 6.3125 11 6.625C11.3281 6.95312 11.3125 7.45312 10.9766 7.78906L5.49219 13.2734C5.21094 13.5547 5.28906 13.8828 5.47656 14.0781C5.67188 14.2656 6 14.3438 6.28125 14.0625L14.1641 6.16406C14.9609 5.36719 15.1641 4.16406 14.3516 3.34375C13.5469 2.53906 12.3281 2.73438 11.5312 3.53906L3.54688 11.5078C2.11719 12.9453 2.23438 14.8438 3.47656 16.0781C4.70312 17.3125 6.60938 17.4375 8.03906 16L13.8438 10.2031Z" fill="#007AFF"/>
                            </svg>
                        </div>
                        <div class="DLP_Input_Style_1_Active">
                            <textarea type="text" placeholder="Type here..." id="DLP_Inset_Input_1_ID" class="DLP_Input_Style_1"></textarea>
                        </div>
                        <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID" style="width: 48px;">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.25 15.0156C0.554688 15.0156 -0.0078125 14.4609 -0.0078125 13.7734C-0.0078125 13.4297 0.140625 13.1094 0.390625 12.8516L5.54688 7.85156L0.390625 2.85938C0.132812 2.60156 -0.0078125 2.28125 -0.0078125 1.94531C-0.0078125 1.25781 0.554688 0.703125 1.25 0.703125C1.59375 0.703125 1.875 0.820312 2.10938 1.05469L8.02344 6.83594C8.33594 7.14062 8.48438 7.46875 8.48438 7.85938C8.48438 8.24219 8.34375 8.5625 8.02344 8.88281L2.10938 14.6641C1.86719 14.8984 1.58594 15.0156 1.25 15.0156ZM8.22656 15.0156C7.53125 15.0156 6.96875 14.4609 6.96875 13.7734C6.96875 13.4297 7.11719 13.1094 7.375 12.8516L12.5234 7.85156L7.375 2.85938C7.10938 2.60156 6.96875 2.28125 6.96875 1.94531C6.96875 1.25781 7.53125 0.703125 8.22656 0.703125C8.57031 0.703125 8.85156 0.820312 9.09375 1.05469L15 6.83594C15.3203 7.14062 15.4609 7.46875 15.4688 7.85938C15.4688 8.24219 15.3203 8.5625 15.0078 8.88281L9.09375 14.6641C8.85156 14.8984 8.57031 15.0156 8.22656 15.0156Z" fill="white"/>
                            </svg>
                        </div>

                    </div>
                </div>

            </div>
        </div>

    </div>
</div>
`;
CSS2 = `
.DLP_NoSelect {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.DLP_Text_Style_1 {
    font-family: "Duolingo Pro Rounded";
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    margin: 0;
    -webkit-font-smoothing: antialiased;
}
.DLP_Text_Style_2 {
    font-family: "Duolingo Pro Rounded";
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    margin: 0;
    -webkit-font-smoothing: antialiased;
}
.DLP_Magnetic_Hover_1 {
    transition: filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.4s cubic-bezier(0.16, 1, 0.32, 1);
    cursor: pointer;
}
.DLP_Magnetic_Hover_1:hover {
    filter: brightness(0.9);
    transform: scale(1.05);
}
.DLP_Magnetic_Hover_1:active {
    filter: brightness(0.9);
    transform: scale(0.9);
}
.DLP_Main {
    display: inline-flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    gap: 8px;

    position: fixed;
    right: 16px;
    bottom: 16px;
    z-index: 2;
}
@media (max-width: 699px) {
    .DLP_Main {
        display: inline-flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;
        gap: 8px;

        position: fixed;
        right: 16px;
        bottom: 16px;
        z-index: 2;
        margin-bottom: 80px;
    }
}
.DLP_Main_Box {
    display: flex;
    width: 312px;
    padding: 16px;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    overflow: hidden;

    border-radius: 16px;
    outline: 2px solid rgb(var(--color-eel), 0.10);
    outline-offset: -2px;
    background: rgb(var(--color-snow), 0.90);
    backdrop-filter: blur(16px);
}
.DLP_Main_Box_Divider {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;

    width: 100%;
}
svg {
    flex-shrink: 0;
}
.DLP_HStack_Auto {
    display: flex;
    align-items: center;
    justify-content: space-between;
    align-self: stretch;
}
.DLP_HStack_Auto_Top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    align-self: stretch;
}
.DLP_HStack_0 {
    display: flex;
    align-items: center;
    gap: 0;
    align-self: stretch;
}
.DLP_HStack_4 {
    display: flex;
    align-items: center;
    gap: 4px;
    align-self: stretch;
}
.DLP_HStack_6 {
    display: flex;
    align-items: center;
    gap: 6px;
    align-self: stretch;
}
.DLP_HStack_8 {
    display: flex;
    align-items: center;
    gap: 8px;
    align-self: stretch;
}
.DLP_VStack_0 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0;
    align-self: stretch;
}
.DLP_VStack_4 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;
    align-self: stretch;
}
.DLP_VStack_6 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 6px;
    align-self: stretch;
}
.DLP_VStack_8 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;
}
.DLP_VStack_12 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
    align-self: stretch;
}
.DLP_Button_Style_1 {
    display: flex;
    height: 40px;
    padding: 10px 12px 10px 10px;
    box-sizing: border-box;
    align-items: center;
    gap: 6px;
    flex: 1 0 0;

    border-radius: 8px;
}
.DLP_Input_Style_1 {
    border: none;
    outline: none;
    background: none;

    font-family: "Duolingo Pro Rounded";
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    color: #007AFF;

    width: 100%;

    width: 100%; /* Full width */
    height: auto; /* Let the height be controlled dynamically */
    min-height: 1.2em; /* Set minimum height for one line */
    max-height: calc(1.2em * 5); /* Limit to 5 lines */
    line-height: 1.2em; /* Adjust the line height */
    overflow-y: hidden; /* Hide vertical scrollbar */
    resize: none; /* Prevent manual resizing */
    padding: 0; /* Remove padding to eliminate extra space */
    margin: 0; /* Remove margin to eliminate extra space */
    box-sizing: border-box; /* Include padding in height calculation */

}
.DLP_Input_Style_1::placeholder {
    color: rgba(0, 122, 255, 0.50);
}
.DLP_Input_Input_Style_1 {
    border: none;
    outline: none;
    background: none;
    text-align: right;

    font-family: "Duolingo Pro Rounded";
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    color: #007AFF;

    width: 100%;
}
.DLP_Input_Input_Style_1::placeholder {
    color: rgba(0, 122, 255, 0.50);
}
.DLP_Input_Style_1_Active {
    display: flex;
    height: 48px;
    padding: 16px;
    box-sizing: border-box;
    align-items: center;
    flex: 1 0 0;
    gap: 6px;

    border-radius: 8px;
    outline: 2px solid rgba(0, 122, 255, 0.20);
    outline-offset: -2px;
    background: rgba(0, 122, 255, 0.10);
}
.DLP_Input_Button_Style_1_Active {
    display: flex;
    height: 48px;
    padding: 12px 12px 12px 14px;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    gap: 6px;

    border-radius: 8px;
    outline: 2px solid rgba(0, 0, 0, 0.20);
    outline-offset: -2px;
    background: #007AFF;
}
@keyframes DLP_Rotate_360_Animation_1 {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
@keyframes DLP_Pulse_Opacity_Animation_1 {
    0% {
        opacity: 1;
    }
    16.66666666% {
        opacity: 0.75;
    }
    33.33333333% {
        opacity: 1;
    }
    100% {
        opacity: 1;
    }
}
.DLP_Scroll_Box_Style_1 {
    display: flex;
    height: 200px;
    padding: 14px 16px;
    box-sizing: border-box;
    justify-content: center;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;

    border-radius: 8px;
    outline: 2px solid rgb(var(--color-eel), 0.10);
    outline-offset: -2px;
    background: rgb(var(--color-snow), 0.90);

    position: relative;
}
.DLP_Scroll_Box_Text_Style_1 {
    font-family: "Duolingo Pro Rounded";
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    opacity: 0.5;
    margin: 0;

    overflow-y: scroll;
    overflow-x: hidden;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 16px;
    left: 16px;
    padding-top: 16px;
    padding-bottom: 16px;
}
.DLP_Scroll_Box_Text_Style_1::-webkit-scrollbar {
    transform: translateX(16px);
}
.DLP_Button_Style_2 {
    display: flex;
    height: 48px;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    gap: 6px;
    flex: 1 0 0;

    border-radius: 8px;
}
.DLP_Toggle_Style_1 {
    display: flex;
    width: 48px;
    height: 48px;
    padding: 16px;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    gap: 6px;

    border-radius: 8px;
    transition: background 0.8s cubic-bezier(0.16, 1, 0.32, 1), filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.4s cubic-bezier(0.16, 1, 0.32, 1);
}
.DLP_Toggle_Style_1_ON {
    outline: 2px solid rgba(0, 0, 0, 0.20);
    outline-offset: -2px;
    background: #34C759;
}
.DLP_Toggle_Style_1_OFF {
    outline: 2px solid rgba(0, 0, 0, 0.20);
    outline-offset: -2px;
    background: #FF2D55;
}
.DLP_Large_Input_Box_Style_1 {
    display: flex;
    padding: 16px;
    box-sizing: border-box;
    justify-content: center;
    align-items: flex-start;
    align-self: stretch;

    border-radius: 8px;
    border: none;
    outline: 2px solid rgb(var(--color-eel), 0.10);
    outline-offset: -2px;
    background: rgb(var(--color-snow), 0.90);

    color: rgb(var(--color-eel), 0.50);
    font-size: 16px;
    font-weight: 700;
    font-family: Duolingo Pro Rounded, 'din-round' !important;

    resize: vertical;
    transition: .2s;
}
.DLP_Large_Input_Box_Style_1::placeholder {
    font-weight: 700;
    color: rgb(var(--color-eel), 0.25);
}
.DLP_Large_Input_Box_Style_1:focus {
    outline: 2px solid #007AFF;
}
.DLP_Feedback_Type_Button_Style_1_ON {
    outline: 2px solid rgba(0, 0, 0, 0.20);
    outline-offset: -2px;
    background: #FF2D55;
}
.DLP_Feedback_Type_Button_Style_1_ON .DLP_Text_Style_1 {
    color: #FFF;
}
.DLP_Feedback_Type_Button_Style_1_OFF {
    outline: 2px solid rgba(255, 45, 85, 0.20);
    outline-offset: -2px;
    background: rgba(255, 45, 85, 0.10);
}
.DLP_Feedback_Type_Button_Style_1_OFF .DLP_Text_Style_1 {
    color: #FF2D55;
}
.DLP_Feedback_Type_Button_Style_2_ON {
    outline: 2px solid rgba(0, 0, 0, 0.20);
    outline-offset: -2px;
    background: #34C759;
}
.DLP_Feedback_Type_Button_Style_2_ON .DLP_Text_Style_1 {
    color: #FFF;
}
.DLP_Feedback_Type_Button_Style_2_OFF {
    outline: 2px solid rgba(52, 199, 89, 0.20);
    outline-offset: -2px;
    background: rgba(52, 199, 89, 0.10);
}
.DLP_Feedback_Type_Button_Style_2_OFF .DLP_Text_Style_1 {
    color: #34C759;
}

.DLP_Notification_Main {
    display: flex;
    justify-content: center;
    align-items: center;

    transition: 0.8s cubic-bezier(0.16, 1, 0.32, 1);
    width: 300px;
    position: fixed;
    left: calc(50% - (300px / 2));
    z-index: 210;
    bottom: 16px;
    border-radius: 16px;
}
.DLP_Notification_Box {
    display: flex;
    width: 300px;
    padding: 16px;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;

    border-radius: 16px;
    outline: 2px solid rgb(var(--color-eel), 0.10);
    outline-offset: -2px;
    background: rgb(var(--color-snow), 0.90);
    backdrop-filter: blur(16px);

    transition: 0.8s cubic-bezier(0.16, 1, 0.32, 1);
    filter: blur(16px);
    opacity: 0;
}
._2V6ug._1ursp._7jW2t._3dDzz._1wiIJ {
    width: 36px !important;
    height: 38px !important;
}
._2V6ug._1ursp._7jW2t._3dDzz._1wiIJ::before {
    border-radius: 20px !important;
}
`;

HTML3 = `
<div class="DLP_Notification_Box" style="position: fixed;">
    <div class="DLP_HStack_4" style="align-items: center;">
        <svg id="DLP_Inset_Icon_1_ID" width="18" height="17" viewBox="0 0 18 17" fill="#34C759" xmlns="http://www.w3.org/2000/svg" display="none">
            <path d="M9 16.6094C4.44531 16.6094 0.75 12.9141 0.75 8.35938C0.75 3.80469 4.44531 0.109375 9 0.109375C13.5547 0.109375 17.25 3.80469 17.25 8.35938C17.25 12.9141 13.5547 16.6094 9 16.6094ZM8.14062 12.2812C8.47656 12.2812 8.78125 12.1094 8.98438 11.8125L12.6094 6.26562C12.75 6.0625 12.8281 5.85156 12.8281 5.65625C12.8281 5.17188 12.3984 4.82812 11.9297 4.82812C11.625 4.82812 11.3672 4.99219 11.1641 5.32031L8.11719 10.1641L6.75781 8.48438C6.54688 8.23438 6.32812 8.125 6.04688 8.125C5.57031 8.125 5.17969 8.50781 5.17969 8.99219C5.17969 9.21875 5.25 9.41406 5.42969 9.63281L7.26562 11.8203C7.51562 12.125 7.78906 12.2812 8.14062 12.2812Z"/>
        </svg>
        <svg id="DLP_Inset_Icon_2_ID" width="18" height="17" viewBox="0 0 18 17" fill="#FFB000" xmlns="http://www.w3.org/2000/svg" display="none">
            <path d="M9 16.6172C4.47656 16.6172 0.75 12.8906 0.75 8.35938C0.75 3.83594 4.46875 0.109375 9 0.109375C13.5234 0.109375 17.25 3.83594 17.25 8.35938C17.25 12.8906 13.5312 16.6172 9 16.6172ZM9.00781 9.53125C9.54688 9.53125 9.85938 9.22656 9.89062 8.66406L10.0156 5.29688C10.0469 4.71094 9.61719 4.30469 9 4.30469C8.375 4.30469 7.95312 4.70312 7.98438 5.29688L8.10938 8.67188C8.13281 9.22656 8.45312 9.53125 9.00781 9.53125ZM9.00781 12.3516C9.625 12.3516 10.1016 11.9609 10.1016 11.3594C10.1016 10.7734 9.63281 10.375 9.00781 10.375C8.38281 10.375 7.89844 10.7734 7.89844 11.3594C7.89844 11.9609 8.38281 12.3516 9.00781 12.3516Z"/>
        </svg>
        <svg id="DLP_Inset_Icon_3_ID" width="18" height="17" viewBox="0 0 18 17" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg" display="none">
            <path d="M2.98438 16.0469C1.55469 16.0469 0.617188 14.9688 0.617188 13.6797C0.617188 13.2812 0.71875 12.875 0.9375 12.4922L6.95312 1.97656C7.40625 1.19531 8.19531 0.789062 9 0.789062C9.79688 0.789062 10.5781 1.1875 11.0391 1.97656L17.0547 12.4844C17.2734 12.8672 17.375 13.2812 17.375 13.6797C17.375 14.9688 16.4375 16.0469 15.0078 16.0469H2.98438ZM9.00781 10.4609C9.54688 10.4609 9.85938 10.1562 9.89062 9.59375L10.0156 6.22656C10.0469 5.64062 9.61719 5.23438 9 5.23438C8.375 5.23438 7.95312 5.63281 7.98438 6.22656L8.10938 9.60156C8.13281 10.1562 8.45312 10.4609 9.00781 10.4609ZM9.00781 13.2812C9.625 13.2812 10.1094 12.8906 10.1094 12.2891C10.1094 11.7031 9.63281 11.3047 9.00781 11.3047C8.38281 11.3047 7.89844 11.7031 7.89844 12.2891C7.89844 12.8906 8.38281 13.2812 9.00781 13.2812Z"/>
        </svg>

        <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1" style="opacity: 0.5; flex: 1 0 0;"></p>
        <svg id="DLP_Notification_Dismiss_Button_1_ID" class="DLP_Magnetic_Hover_1" width="15" height="14" viewBox="0 0 15 14" fill="rgb(var(--color-eel), 0.5)" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.32812 13.4922C0.875 13.0469 0.890625 12.2578 1.3125 11.8359L5.78125 7.36719L1.3125 2.91406C0.890625 2.48438 0.875 1.70312 1.32812 1.25C1.78125 0.789062 2.57031 0.804688 2.99219 1.23438L7.45312 5.69531L11.9141 1.23438C12.3516 0.796875 13.1172 0.796875 13.5703 1.25C14.0312 1.70312 14.0312 2.46875 13.5859 2.91406L9.13281 7.36719L13.5859 11.8281C14.0312 12.2734 14.0234 13.0312 13.5703 13.4922C13.125 13.9453 12.3516 13.9453 11.9141 13.5078L7.45312 9.04688L2.99219 13.5078C2.57031 13.9375 1.78906 13.9453 1.32812 13.4922Z"/>
        </svg>
    </div>
    <p id="DLP_Inset_Text_2_ID" class="DLP_Text_Style_1" style="opacity: 0.25; align-self: stretch;"></p>
</div>
`;

HTML4 = `
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

HTML5 = `
<div class="DLP_AutoServer_Mother_Box" style="display: none; opacity: 0; filter: blur(8px);">
    <div class="DLP_AutoServer_Box">
        <div class="DLP_AutoServer_Menu_Bar">
            <div style="display: flex; justify-content: center; align-items: center; gap: 6px; opacity: 0.5;">
                <svg id="DLP_AutoServer_Close_Button_1_ID" class="DLP_Magnetic_Hover_1" width="14" height="14" viewBox="0 0 14 14" fill="rgb(var(--color-black-text))" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.24219 12.9062C0.90625 12.5781 0.914062 12 1.24219 11.6797L6.04688 6.86719L1.24219 2.0625C0.914062 1.74219 0.90625 1.17188 1.24219 0.828125C1.57812 0.492188 2.14844 0.5 2.47656 0.828125L7.28125 5.63281L12.0859 0.828125C12.4219 0.5 12.9766 0.5 13.3203 0.835938C13.6641 1.16406 13.6562 1.73438 13.3281 2.0625L8.52344 6.86719L13.3281 11.6797C13.6562 12.0078 13.6562 12.5703 13.3203 12.9062C12.9844 13.25 12.4219 13.2422 12.0859 12.9141L7.28125 8.10938L2.47656 12.9141C2.14844 13.2422 1.58594 13.2422 1.24219 12.9062Z"/>
                </svg>
            </div>
            <div style="display: flex; justify-content: center; align-items: center; gap: 6px; opacity: 0.5;">
                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #34C759;">Error</p>
                <svg width="21" height="15" viewBox="0 0 21 15" fill="#34C759" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 14.0781L5.20312 14.0703C2.47656 14.0703 0.398438 12.0938 0.398438 9.71875C0.398438 7.76562 1.5 6.16406 3.28906 5.85156C3.35938 3.64844 5.44531 2.17188 7.42188 2.70312C8.40625 1.28906 9.95312 0.210938 12.0391 0.210938C15.3125 0.210938 17.8516 2.75781 17.8438 6.28906C19.3906 6.9375 20.3359 8.40625 20.3359 10.0625C20.3359 12.2891 18.4219 14.0781 16 14.0781ZM9.80469 10.875C10.0781 10.875 10.3203 10.7422 10.4688 10.4922L13.5391 5.57812C13.625 5.4375 13.7188 5.25 13.7188 5.07031C13.7188 4.69531 13.3906 4.41406 13 4.41406C12.7578 4.41406 12.5391 4.55469 12.3906 4.80469L9.77344 9.14844L8.44531 7.44531C8.28906 7.24219 8.09375 7.13281 7.85156 7.13281C7.46875 7.13281 7.15625 7.42969 7.15625 7.82812C7.15625 8 7.21875 8.17188 7.35156 8.34375L9.10156 10.5078C9.29688 10.7578 9.52344 10.875 9.80469 10.875Z"/>
                </svg>
            </div>
        </div>
        <div class="DLP_AutoServer_Scroll_Box">

            <div style="display: flex; justify-content: space-between; align-items: center; align-self: stretch;">
                <div style="display: flex; align-items: flex-end; gap: 4px;">
                    <p class="DLP_AutoServer_Text_Style_2 DLP_NoSelect">AutoServer</p>
                    <div class="DLP_HStack_4" style="align-items: center; padding-top: 6px;">
                        <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="opacity: 0.5;">by Duolingo</p>
                        <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PRO</p>
                    </div>
                </div>
                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${versionName}</p>
            </div>

            <div class="DLP_AutoServer_Default_Box" style="background: linear-gradient(rgba(var(--color-snow), 0.8), rgba(var(--color-snow), 0.8)), url(${serverURL}/static/images/flow/primary/512/light.png); background-position: center; background-size: cover; background-repeat: no-repeat;">
                <div style="display: flex; display: none; flex-direction: column; align-items: flex-start; gap: 6px; align-self: stretch; width: 100%;">
                    <div class="DLP_HStack_Auto">
                        <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect">Settings</p>
                        <svg width="18" height="19" viewBox="0 0 18 19" fill="rgb(var(--color-black-text))" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.1875 16.9609C9.00781 16.9609 8.82812 16.9531 8.64844 16.9375L8.22656 17.7344C8.10156 17.9531 7.90625 18.0625 7.65625 18.0156C7.42188 17.9688 7.25781 17.8047 7.22656 17.5547L7.10156 16.6719C6.75 16.5703 6.41406 16.4453 6.09375 16.2969L5.42188 16.8984C5.23438 17.0625 5.00781 17.0938 4.78906 16.9688C4.57812 16.8438 4.49219 16.6328 4.53906 16.3906L4.72656 15.5156C4.4375 15.3047 4.15625 15.0781 3.89844 14.8203L3.07031 15.1562C2.83594 15.25 2.61719 15.2031 2.45312 15.0078C2.29688 14.8203 2.28125 14.5859 2.41406 14.375L2.89062 13.625C2.6875 13.3203 2.50781 13.0078 2.35156 12.6875L1.46094 12.7109C1.20312 12.7188 1.01562 12.6016 0.929688 12.3672C0.851562 12.1328 0.90625 11.9062 1.10938 11.7578L1.8125 11.2109C1.72656 10.8594 1.66406 10.5078 1.625 10.1406L0.773438 9.86719C0.53125 9.78906 0.398438 9.60156 0.398438 9.35938C0.398438 9.10938 0.53125 8.92188 0.773438 8.85156L1.625 8.57812C1.66406 8.21094 1.72656 7.85938 1.8125 7.50781L1.10938 6.96094C0.90625 6.80469 0.84375 6.58594 0.929688 6.35938C1.01562 6.125 1.20312 5.99219 1.46094 6L2.35156 6.03906C2.50781 5.71094 2.6875 5.39844 2.89062 5.10156L2.41406 4.34375C2.28125 4.13281 2.28906 3.89844 2.45312 3.71094C2.61719 3.52344 2.83594 3.46094 3.07031 3.5625L3.89844 3.89844C4.15625 3.64844 4.42969 3.41406 4.72656 3.20312L4.53906 2.32812C4.49219 2.08594 4.57031 1.86719 4.78906 1.75C5.00781 1.63281 5.24219 1.64844 5.42188 1.82031L6.07812 2.41406C6.41406 2.27344 6.74219 2.14844 7.09375 2.04688L7.22656 1.15625C7.26562 0.914062 7.41406 0.742188 7.66406 0.703125C7.90625 0.664062 8.10938 0.765625 8.22656 0.984375L8.64844 1.78125C8.82812 1.76562 9.00781 1.75781 9.1875 1.75781C9.36719 1.75781 9.54688 1.76562 9.72656 1.78125L10.1484 0.984375C10.2656 0.765625 10.4688 0.65625 10.7109 0.703125C10.9531 0.75 11.1094 0.914062 11.1484 1.16406L11.2656 2.04688C11.6172 2.14844 11.9609 2.26562 12.2812 2.41406L12.9531 1.82031C13.1328 1.65625 13.3672 1.61719 13.5859 1.75C13.7969 1.875 13.8828 2.07812 13.8359 2.32812L13.6406 3.19531C13.9375 3.40625 14.2188 3.64062 14.4766 3.89844L15.3047 3.5625C15.5312 3.46875 15.7578 3.51562 15.9219 3.71094C16.0703 3.89844 16.0938 4.13281 15.9609 4.34375L15.4844 5.09375C15.6797 5.39062 15.8672 5.70312 16.0234 6.03125L16.9141 6.00781C17.1641 6 17.3594 6.10938 17.4453 6.35156C17.5234 6.58594 17.4688 6.8125 17.2656 6.96094L16.5547 7.50781C16.6484 7.85156 16.7109 8.21094 16.75 8.57812L17.6016 8.85156C17.8359 8.92188 17.9766 9.10938 17.9766 9.35938C17.9766 9.60156 17.8359 9.78906 17.6016 9.86719L16.75 10.1406C16.7109 10.5078 16.6484 10.8594 16.5547 11.2109L17.2656 11.7578C17.4688 11.9141 17.5312 12.1328 17.4453 12.3594C17.3594 12.5938 17.1641 12.7266 16.9141 12.7188L16.0234 12.6797C15.8672 13.0078 15.6797 13.3203 15.4844 13.6172L15.9609 14.375C16.0938 14.5859 16.0859 14.8203 15.9219 15.0078C15.7578 15.1953 15.5391 15.25 15.2969 15.1562L14.4766 14.8203C14.2188 15.0703 13.9453 15.3047 13.6406 15.5078L13.8281 16.3906C13.8828 16.6328 13.7969 16.8438 13.5781 16.9688C13.3672 17.0859 13.1328 17.0703 12.9531 16.8984L12.2891 16.2969C11.9609 16.4453 11.625 16.5703 11.2734 16.6719L11.1406 17.5547C11.1094 17.8047 10.9609 17.9766 10.7109 18.0156C10.4688 18.0469 10.2656 17.9531 10.1484 17.7344L9.72656 16.9375C9.54688 16.9531 9.36719 16.9609 9.1875 16.9609ZM9.1875 7.17969C10.1641 7.17969 10.9922 7.82031 11.2734 8.71094H15.2422C14.9219 5.64844 12.3359 3.26562 9.1875 3.26562C8.28906 3.26562 7.4375 3.46094 6.66406 3.8125L8.66406 7.24219C8.83594 7.20312 9.00781 7.17969 9.1875 7.17969ZM3.09375 9.35938C3.09375 11.3438 4.03906 13.1016 5.50781 14.2188L7.57812 10.8281C7.22656 10.4375 7.00781 9.92188 7.00781 9.35938C7.00781 8.79688 7.22656 8.28906 7.57031 7.89844L5.5625 4.46094C4.0625 5.57031 3.09375 7.35156 3.09375 9.35938ZM9.1875 10.2422C9.67969 10.2422 10.0703 9.84375 10.0703 9.35938C10.0703 8.86719 9.67969 8.47656 9.1875 8.47656C8.70312 8.47656 8.30469 8.86719 8.30469 9.35938C8.30469 9.84375 8.70312 10.2422 9.1875 10.2422ZM9.1875 15.4531C12.3438 15.4531 14.9297 13.0547 15.25 9.98438H11.2812C11.0078 10.8828 10.1719 11.5391 9.1875 11.5391C9.00781 11.5391 8.83594 11.5156 8.67188 11.4766L6.60156 14.875C7.39062 15.2422 8.26562 15.4531 9.1875 15.4531Z"/>
                        </svg>
                    </div>
                    <div class="DLP_HStack_Auto">
                        <div class="DLP_HStack_4" style="align-items: center;">
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="rgb(var(--color-black-text))" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.53125 16.4297C4.07812 16.4297 0.460938 12.8125 0.460938 8.35938C0.460938 3.90625 4.07812 0.289062 8.53125 0.289062C12.9844 0.289062 16.6016 3.90625 16.6016 8.35938C16.6016 12.8125 12.9844 16.4297 8.53125 16.4297ZM10.4453 1.8125C11 2.36719 11.4766 3.14844 11.8281 4.11719C12.3828 3.9375 12.8594 3.71094 13.25 3.4375C12.4688 2.6875 11.5078 2.125 10.4453 1.8125ZM3.8125 3.4375C4.20312 3.71094 4.67969 3.9375 5.23438 4.10938C5.58594 3.14844 6.0625 2.36719 6.61719 1.8125C5.55469 2.125 4.59375 2.6875 3.8125 3.4375ZM9.07812 2.07812V4.55469C9.67188 4.53125 10.2266 4.47656 10.7422 4.38281C10.3203 3.23438 9.72656 2.39062 9.07812 2.07812ZM6.32031 4.38281C6.83594 4.47656 7.39062 4.53125 7.98438 4.55469V2.07812C7.33594 2.39062 6.75 3.23438 6.32031 4.38281ZM1.73438 7.8125H4.54688C4.58594 6.85156 4.71875 5.94531 4.92188 5.13281C4.19531 4.90625 3.57031 4.60156 3.10156 4.23438C2.33594 5.25 1.84375 6.47656 1.73438 7.8125ZM12.5156 7.8125H15.3281C15.2266 6.47656 14.7344 5.25 13.9609 4.23438C13.4922 4.60156 12.8672 4.90625 12.1406 5.13281C12.3438 5.94531 12.4766 6.85156 12.5156 7.8125ZM5.66406 7.8125H7.98438V5.64844C7.28906 5.61719 6.625 5.53906 6 5.41406C5.82031 6.14844 5.70312 6.96094 5.66406 7.8125ZM9.07812 7.8125H11.3984C11.3594 6.96094 11.2422 6.14844 11.0625 5.41406C10.4375 5.53906 9.77344 5.61719 9.07812 5.64844V7.8125ZM1.73438 8.90625C1.84375 10.25 2.34375 11.4922 3.11719 12.5078C3.58594 12.1484 4.20312 11.8516 4.92188 11.6172C4.71875 10.7969 4.58594 9.88281 4.54688 8.90625H1.73438ZM5.66406 8.90625C5.69531 9.76562 5.82031 10.5938 6.00781 11.3359C6.625 11.2188 7.29688 11.1406 7.98438 11.1094V8.90625H5.66406ZM9.07812 11.1094C9.77344 11.1406 10.4375 11.2188 11.0547 11.3359C11.2422 10.5938 11.3672 9.76562 11.3984 8.90625H9.07812V11.1094ZM12.1406 11.6172C12.8594 11.8516 13.4766 12.1484 13.9453 12.5078C14.7188 11.4922 15.2188 10.25 15.3281 8.90625H12.5156C12.4766 9.88281 12.3516 10.7969 12.1406 11.6172ZM9.07812 12.2031V14.6406C9.71875 14.3359 10.3047 13.5 10.7266 12.375C10.2188 12.2812 9.66406 12.2266 9.07812 12.2031ZM6.33594 12.375C6.75781 13.5 7.34375 14.3359 7.98438 14.6406V12.2031C7.39844 12.2266 6.84375 12.2812 6.33594 12.375ZM3.83594 13.3047C4.60938 14.0391 5.55469 14.5938 6.60156 14.8984C6.0625 14.3516 5.59375 13.5781 5.24219 12.6406C4.69531 12.8125 4.22656 13.0391 3.83594 13.3047ZM11.8203 12.6406C11.4688 13.5781 11.0078 14.3516 10.4609 14.8984C11.5078 14.5938 12.4531 14.0391 13.2266 13.3047C12.8359 13.0391 12.3672 12.8125 11.8203 12.6406Z"/>
                            </svg>
                            <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect">Timezone</p>
                        </div>
                        <p class="DLP_AutoServer_Text_Style_1">America/NewYork - 11:45 PM</p>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 6px; align-self: stretch; width: 100%;">
                    <div class="DLP_HStack_Auto" style="align-items: center; width: 100%;">
                        <p class="DLP_AutoServer_Text_Style_1">Under Construction</p>
                        <svg id="DLP_Inset_Icon_3_ID" width="18" height="17" viewBox="0 0 18 17" fill="rgb(var(--color-black-text))" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.98438 16.0469C1.55469 16.0469 0.617188 14.9688 0.617188 13.6797C0.617188 13.2812 0.71875 12.875 0.9375 12.4922L6.95312 1.97656C7.40625 1.19531 8.19531 0.789062 9 0.789062C9.79688 0.789062 10.5781 1.1875 11.0391 1.97656L17.0547 12.4844C17.2734 12.8672 17.375 13.2812 17.375 13.6797C17.375 14.9688 16.4375 16.0469 15.0078 16.0469H2.98438ZM9.00781 10.4609C9.54688 10.4609 9.85938 10.1562 9.89062 9.59375L10.0156 6.22656C10.0469 5.64062 9.61719 5.23438 9 5.23438C8.375 5.23438 7.95312 5.63281 7.98438 6.22656L8.10938 9.60156C8.13281 10.1562 8.45312 10.4609 9.00781 10.4609ZM9.00781 13.2812C9.625 13.2812 10.1094 12.8906 10.1094 12.2891C10.1094 11.7031 9.63281 11.3047 9.00781 11.3047C8.38281 11.3047 7.89844 11.7031 7.89844 12.2891C7.89844 12.8906 8.38281 13.2812 9.00781 13.2812Z"/>
                        </svg>
                    </div>
                    <p class="DLP_AutoServer_Text_Style_1" style="opacity: 0.5;">AutoServer is currently under construction and unavailable. We appreciate your patience and will provide updates as progress continues.</p>
                </div>
            </div>

            <div class="DLP_AutoServer_Default_Box" style="height: 256px; background: linear-gradient(rgba(var(--color-snow), 0), rgba(var(--color-snow), 0)), url(${serverURL}/static/images/flow/primary/512/light.png); background-position: center; background-size: cover; background-repeat: no-repeat;">
                <div style="display: flex; width: 168px; flex-direction: column; justify-content: space-between; align-items: flex-start; align-self: stretch;">
                    <div class="DLP_VStack_6">
                        <div class="DLP_HStack_Auto">
                            <svg width="14" height="18" viewBox="0 0 14 18" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.65625 17.2109C2.89062 17.2109 0.398438 15.0391 0.398438 11.7812C0.398438 8.90625 1.75781 7.97656 1.75781 6.1875C1.75781 5.80469 1.70312 5.36719 1.70312 5.13281C1.70312 4.72656 1.95312 4.46875 2.32031 4.46875C3.01562 4.46875 3.78125 5.03125 4.24219 5.99219C4.27344 5.83594 4.28125 5.69531 4.28125 5.53906C4.27344 4.03906 3.375 2.77344 2.41406 1.61719C2.24219 1.41406 2.14062 1.17969 2.14062 0.960938C2.14062 0.390625 2.66406 0.09375 3.46094 0.09375C7.63281 0.09375 13.6719 3.04688 13.6719 10.1094C13.6719 14.375 10.8594 17.2109 6.65625 17.2109ZM6.84375 14.8047C8.66406 14.8047 9.60156 13.4922 9.60156 11.9297C9.60156 10.3672 8.69531 8.69531 7.00781 7.92188C6.91406 7.88281 6.83594 7.9375 6.85156 8.03906C6.99219 9.25781 6.83594 10.3906 6.4375 10.9922C6.25 10.5234 6.02344 10.1328 5.67969 9.82031C5.59375 9.75 5.52344 9.78906 5.50781 9.88281C5.38281 10.8203 4.42969 11.2734 4.42969 12.6328C4.42969 13.9375 5.39062 14.8047 6.84375 14.8047Z"/>
                            </svg>
                            <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF;">Streak Protector</p>
                        </div>
                        <div class="DLP_HStack_Auto">
                            <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0;">BETA</p>
                            <div class="DLP_HStack_4 DLP_Magnetic_Hover_1">
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF;">Active</p>
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.97656 14.6562C1.28906 14.6562 0.414062 13.7891 0.414062 12.1172V2.60938C0.414062 0.9375 1.28906 0.0703125 2.97656 0.0703125H12.4375C14.125 0.0703125 15 0.945312 15 2.60938V12.1172C15 13.7891 14.125 14.6562 12.4375 14.6562H2.97656ZM6.85938 11.2188C7.14844 11.2188 7.39844 11.0703 7.57812 10.8047L11.2344 5.10156C11.3438 4.92969 11.4375 4.73438 11.4375 4.55469C11.4375 4.14844 11.0859 3.875 10.6953 3.875C10.4453 3.875 10.2266 4.00781 10.0625 4.28125L6.82812 9.45312L5.32031 7.53906C5.125 7.28906 4.9375 7.19531 4.69531 7.19531C4.28906 7.19531 3.97656 7.52344 3.97656 7.92188C3.97656 8.11719 4.04688 8.30469 4.1875 8.47656L6.10156 10.8047C6.32031 11.0859 6.5625 11.2188 6.85938 11.2188Z"/>
                                </svg>
                                <svg display="none" width="15" height="16" viewBox="0 0 15 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.97656 15.1562C1.28906 15.1562 0.414062 14.2891 0.414062 12.6172V3.10938C0.414062 1.4375 1.28906 0.570312 2.97656 0.570312H12.4375C14.125 0.570312 15 1.44531 15 3.10938V12.6172C15 14.2891 14.125 15.1562 12.4375 15.1562H2.97656ZM3.07031 13.625H12.3438C13.0625 13.625 13.4688 13.25 13.4688 12.4922V3.24219C13.4688 2.48438 13.0625 2.10156 12.3438 2.10156H3.07031C2.34375 2.10156 1.94531 2.48438 1.94531 3.24219V12.4922C1.94531 13.25 2.34375 13.625 3.07031 13.625Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_12">
                        <div class="DLP_VStack_6">
                            <div class="DLP_HStack_Auto">
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0.5;">Protecting:</p>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0;">BETA</p>
                            </div>
                            <div class="DLP_HStack_Auto">
                                <svg class="DLP_Magnetic_Hover_1" width="15" height="15" viewBox="0 0 15 15" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.76562 14.6562C1.07812 14.6562 0.203125 13.7891 0.203125 12.1172V2.60938C0.203125 0.9375 1.07812 0.0703125 2.76562 0.0703125H12.2266C13.9141 0.0703125 14.7891 0.945312 14.7891 2.60938V12.1172C14.7891 13.7891 13.9141 14.6562 12.2266 14.6562H2.76562ZM4.44531 8.13281H10.5938C11.0859 8.13281 11.4219 7.85156 11.4219 7.375C11.4219 6.89844 11.1016 6.60156 10.5938 6.60156H4.44531C3.9375 6.60156 3.60938 6.89844 3.60938 7.375C3.60938 7.85156 3.95312 8.13281 4.44531 8.13281Z"/>
                                </svg>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF;">2 Days</p>
                                <svg class="DLP_Magnetic_Hover_1" width="15" height="15" viewBox="0 0 15 15" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.8281 1.03125C14.6328 1.83594 14.7812 2.9375 14.7812 4.35938V10.3516C14.7812 11.7812 14.6328 12.8828 13.8281 13.6875C13.0234 14.4844 11.9141 14.6406 10.4922 14.6406H4.5C3.07812 14.6406 1.96875 14.4844 1.15625 13.6875C0.359375 12.8828 0.210938 11.7812 0.210938 10.3516V4.34375C0.210938 2.9375 0.359375 1.83594 1.16406 1.03125C1.96094 0.234375 3.07812 0.078125 4.47656 0.078125H10.4922C11.9141 0.078125 13.0234 0.226562 13.8281 1.03125ZM3.66406 7.35938C3.66406 7.80469 3.98438 8.11719 4.4375 8.11719H6.71875V10.4141C6.71875 10.8516 7.03125 11.1797 7.47656 11.1797C7.92969 11.1797 8.25 10.8594 8.25 10.4141V8.11719H10.5469C10.9844 8.11719 11.3047 7.80469 11.3047 7.35938C11.3047 6.90625 10.9844 6.58594 10.5469 6.58594H8.25V4.30469C8.25 3.85156 7.92969 3.53125 7.47656 3.53125C7.03125 3.53125 6.71875 3.85938 6.71875 4.30469V6.58594H4.4375C3.98438 6.58594 3.66406 6.90625 3.66406 7.35938Z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="DLP_VStack_6">
                            <div class="DLP_HStack_Auto">
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0.5;">Protecting Time:</p>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0;">BETA</p>
                            </div>
                            <div class="DLP_HStack_Auto">
                                <svg class="DLP_Magnetic_Hover_1" width="15" height="15" viewBox="0 0 15 15" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.76562 14.6562C1.07812 14.6562 0.203125 13.7891 0.203125 12.1172V2.60938C0.203125 0.9375 1.07812 0.0703125 2.76562 0.0703125H12.2266C13.9141 0.0703125 14.7891 0.945312 14.7891 2.60938V12.1172C14.7891 13.7891 13.9141 14.6562 12.2266 14.6562H2.76562ZM9.09375 11.2578C9.375 10.9844 9.35938 10.5547 9.10156 10.3047L5.96875 7.35938L9.10156 4.42969C9.36719 4.17969 9.35938 3.73438 9.08594 3.47656C8.83594 3.23438 8.42188 3.24219 8.14844 3.5L4.92969 6.53125C4.44531 6.97656 4.45312 7.75781 4.92969 8.20312L8.14844 11.2344C8.39844 11.4688 8.86719 11.4844 9.09375 11.2578Z"/>
                                </svg>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF;">Morning</p>
                                <svg class="DLP_Magnetic_Hover_1" width="15" height="15" viewBox="0 0 15 15" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.76562 14.6562C1.07812 14.6562 0.203125 13.7891 0.203125 12.1172V2.60938C0.203125 0.9375 1.07812 0.0703125 2.76562 0.0703125H12.2266C13.9141 0.0703125 14.7891 0.945312 14.7891 2.60938V12.1172C14.7891 13.7891 13.9141 14.6562 12.2266 14.6562H2.76562ZM5.67188 11.3672C5.91406 11.5938 6.39062 11.5781 6.64062 11.3359L9.95312 8.23438C10.4453 7.77344 10.4453 6.96875 9.95312 6.50781L6.64062 3.40625C6.36719 3.14062 5.94531 3.13281 5.6875 3.375C5.39844 3.64062 5.39844 4.09375 5.67188 4.35156L8.88281 7.36719L5.67188 10.3906C5.40625 10.6484 5.39062 11.0781 5.67188 11.3672Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 6px; flex: 1 0 0; align-self: stretch;">
                    <div class="DLP_VStack_6" style="height: 100%; justify-content: flex-start;">
                        <div class="DLP_HStack_Auto">
                            <div class="DLP_HStack_4">
                                <svg width="17" height="17" viewBox="0 0 17 17" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.53125 16.4297C4.07812 16.4297 0.460938 12.8125 0.460938 8.35938C0.460938 3.90625 4.07812 0.289062 8.53125 0.289062C12.9844 0.289062 16.6016 3.90625 16.6016 8.35938C16.6016 12.8125 12.9844 16.4297 8.53125 16.4297ZM8.48438 5.6875C9.10156 5.6875 9.59375 5.1875 9.59375 4.57031C9.59375 3.9375 9.10156 3.44531 8.48438 3.44531C7.86719 3.44531 7.36719 3.9375 7.36719 4.57031C7.36719 5.1875 7.86719 5.6875 8.48438 5.6875ZM7.09375 12.8594H10.3906C10.7578 12.8594 11.0469 12.5938 11.0469 12.2188C11.0469 11.875 10.7578 11.5938 10.3906 11.5938H9.49219V7.75781C9.49219 7.26562 9.24219 6.94531 8.78125 6.94531H7.24219C6.875 6.94531 6.59375 7.22656 6.59375 7.57031C6.59375 7.94531 6.875 8.21094 7.24219 8.21094H8.0625V11.5938H7.09375C6.72656 11.5938 6.44531 11.875 6.44531 12.2188C6.44531 12.5938 6.72656 12.8594 7.09375 12.8594Z"/>
                                </svg>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF;">Info</p>
                            </div>
                            <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0.5;">This function is in BETA</p>
                        </div>
                        <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0.5;">Streak Protector extends your streak by completing a lesson in our servers.</p>
                        <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0.5;">You can only protect your streak for up to 7 days. Donate to protect longer.</p>
                        <div style="display: flex; justify-content: flex-end; align-items: flex-end; gap: 6px; flex: 1 0 0; align-self: stretch;">
                            <p class="DLP_AutoServer_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" style="color: #FFF; opacity: 0.5;">Learn More</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="DLP_AutoServer_Default_Box" style="height: 256px; background: linear-gradient(rgba(var(--color-snow), 0), rgba(var(--color-snow), 0)), url(${serverURL}/static/images/flow/secondary/512/light.png); background-position: center; background-size: cover; background-repeat: no-repeat;">
                <div style="display: flex; width: 168px; flex-direction: column; justify-content: space-between; align-items: flex-start; align-self: stretch;">
                    <div class="DLP_VStack_6">
                        <div class="DLP_HStack_Auto">
                            <svg width="14" height="17" viewBox="0 0 14 17" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path d="M-0.0078125 9.92188V4.00781C-0.0078125 3.08594 0.359375 2.75 1.125 2.42969C1.99219 2.07031 4.92969 0.984375 5.78125 0.75C6.03125 0.679688 6.32812 0.609375 6.59375 0.609375C6.85156 0.609375 7.14844 0.664062 7.40625 0.75C8.25781 1.03125 11.1875 2.0625 12.0547 2.42969C12.8281 2.75781 13.1875 3.08594 13.1875 4.00781V9.92188C13.1875 12.7656 11.6328 13.8906 7.14062 16.3359C6.9375 16.4453 6.72656 16.5 6.59375 16.5C6.45312 16.5 6.24219 16.4453 6.04688 16.3359C1.5625 13.8828 -0.0078125 12.7656 -0.0078125 9.92188ZM6.72656 14.8359C6.8125 14.8125 6.90625 14.7656 7.03906 14.6797C10.5703 12.5547 11.7188 11.9297 11.7188 9.625V4.25781C11.7188 3.98438 11.6641 3.86719 11.4453 3.78906C10.2734 3.36719 8.04688 2.57812 7 2.16406C6.875 2.125 6.79688 2.10156 6.72656 2.09375V14.8359Z"/>
                            </svg>
                            <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF;">League Protector</p>
                        </div>
                        <div class="DLP_HStack_Auto">
                            <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0;">BETA</p>
                            <div class="DLP_HStack_4 DLP_Magnetic_Hover_1">
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF;">Active</p>
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.97656 14.6562C1.28906 14.6562 0.414062 13.7891 0.414062 12.1172V2.60938C0.414062 0.9375 1.28906 0.0703125 2.97656 0.0703125H12.4375C14.125 0.0703125 15 0.945312 15 2.60938V12.1172C15 13.7891 14.125 14.6562 12.4375 14.6562H2.97656ZM6.85938 11.2188C7.14844 11.2188 7.39844 11.0703 7.57812 10.8047L11.2344 5.10156C11.3438 4.92969 11.4375 4.73438 11.4375 4.55469C11.4375 4.14844 11.0859 3.875 10.6953 3.875C10.4453 3.875 10.2266 4.00781 10.0625 4.28125L6.82812 9.45312L5.32031 7.53906C5.125 7.28906 4.9375 7.19531 4.69531 7.19531C4.28906 7.19531 3.97656 7.52344 3.97656 7.92188C3.97656 8.11719 4.04688 8.30469 4.1875 8.47656L6.10156 10.8047C6.32031 11.0859 6.5625 11.2188 6.85938 11.2188Z"/>
                                </svg>
                                <svg display="none" width="15" height="16" viewBox="0 0 15 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.97656 15.1562C1.28906 15.1562 0.414062 14.2891 0.414062 12.6172V3.10938C0.414062 1.4375 1.28906 0.570312 2.97656 0.570312H12.4375C14.125 0.570312 15 1.44531 15 3.10938V12.6172C15 14.2891 14.125 15.1562 12.4375 15.1562H2.97656ZM3.07031 13.625H12.3438C13.0625 13.625 13.4688 13.25 13.4688 12.4922V3.24219C13.4688 2.48438 13.0625 2.10156 12.3438 2.10156H3.07031C2.34375 2.10156 1.94531 2.48438 1.94531 3.24219V12.4922C1.94531 13.25 2.34375 13.625 3.07031 13.625Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_12">
                        <div class="DLP_VStack_6">
                            <div class="DLP_HStack_Auto">
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0.5;">Protecting:</p>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0;">BETA</p>
                            </div>
                            <div class="DLP_HStack_Auto">
                                <svg class="DLP_Magnetic_Hover_1" width="15" height="15" viewBox="0 0 15 15" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.76562 14.6562C1.07812 14.6562 0.203125 13.7891 0.203125 12.1172V2.60938C0.203125 0.9375 1.07812 0.0703125 2.76562 0.0703125H12.2266C13.9141 0.0703125 14.7891 0.945312 14.7891 2.60938V12.1172C14.7891 13.7891 13.9141 14.6562 12.2266 14.6562H2.76562ZM4.44531 8.13281H10.5938C11.0859 8.13281 11.4219 7.85156 11.4219 7.375C11.4219 6.89844 11.1016 6.60156 10.5938 6.60156H4.44531C3.9375 6.60156 3.60938 6.89844 3.60938 7.375C3.60938 7.85156 3.95312 8.13281 4.44531 8.13281Z"/>
                                </svg>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF;">5 Days</p>
                                <svg class="DLP_Magnetic_Hover_1" width="15" height="15" viewBox="0 0 15 15" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.8281 1.03125C14.6328 1.83594 14.7812 2.9375 14.7812 4.35938V10.3516C14.7812 11.7812 14.6328 12.8828 13.8281 13.6875C13.0234 14.4844 11.9141 14.6406 10.4922 14.6406H4.5C3.07812 14.6406 1.96875 14.4844 1.15625 13.6875C0.359375 12.8828 0.210938 11.7812 0.210938 10.3516V4.34375C0.210938 2.9375 0.359375 1.83594 1.16406 1.03125C1.96094 0.234375 3.07812 0.078125 4.47656 0.078125H10.4922C11.9141 0.078125 13.0234 0.226562 13.8281 1.03125ZM3.66406 7.35938C3.66406 7.80469 3.98438 8.11719 4.4375 8.11719H6.71875V10.4141C6.71875 10.8516 7.03125 11.1797 7.47656 11.1797C7.92969 11.1797 8.25 10.8594 8.25 10.4141V8.11719H10.5469C10.9844 8.11719 11.3047 7.80469 11.3047 7.35938C11.3047 6.90625 10.9844 6.58594 10.5469 6.58594H8.25V4.30469C8.25 3.85156 7.92969 3.53125 7.47656 3.53125C7.03125 3.53125 6.71875 3.85938 6.71875 4.30469V6.58594H4.4375C3.98438 6.58594 3.66406 6.90625 3.66406 7.35938Z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="DLP_VStack_6">
                            <div class="DLP_HStack_Auto">
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0.5;">Protecting Mode:</p>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0;">BETA</p>
                            </div>
                            <div class="DLP_HStack_Auto">
                                <svg class="DLP_Magnetic_Hover_1" width="15" height="15" viewBox="0 0 15 15" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.76562 14.6562C1.07812 14.6562 0.203125 13.7891 0.203125 12.1172V2.60938C0.203125 0.9375 1.07812 0.0703125 2.76562 0.0703125H12.2266C13.9141 0.0703125 14.7891 0.945312 14.7891 2.60938V12.1172C14.7891 13.7891 13.9141 14.6562 12.2266 14.6562H2.76562ZM9.09375 11.2578C9.375 10.9844 9.35938 10.5547 9.10156 10.3047L5.96875 7.35938L9.10156 4.42969C9.36719 4.17969 9.35938 3.73438 9.08594 3.47656C8.83594 3.23438 8.42188 3.24219 8.14844 3.5L4.92969 6.53125C4.44531 6.97656 4.45312 7.75781 4.92969 8.20312L8.14844 11.2344C8.39844 11.4688 8.86719 11.4844 9.09375 11.2578Z"/>
                                </svg>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF;">Chill</p>
                                <svg class="DLP_Magnetic_Hover_1" width="15" height="15" viewBox="0 0 15 15" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.76562 14.6562C1.07812 14.6562 0.203125 13.7891 0.203125 12.1172V2.60938C0.203125 0.9375 1.07812 0.0703125 2.76562 0.0703125H12.2266C13.9141 0.0703125 14.7891 0.945312 14.7891 2.60938V12.1172C14.7891 13.7891 13.9141 14.6562 12.2266 14.6562H2.76562ZM5.67188 11.3672C5.91406 11.5938 6.39062 11.5781 6.64062 11.3359L9.95312 8.23438C10.4453 7.77344 10.4453 6.96875 9.95312 6.50781L6.64062 3.40625C6.36719 3.14062 5.94531 3.13281 5.6875 3.375C5.39844 3.64062 5.39844 4.09375 5.67188 4.35156L8.88281 7.36719L5.67188 10.3906C5.40625 10.6484 5.39062 11.0781 5.67188 11.3672Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 6px; flex: 1 0 0; align-self: stretch;">
                    <div class="DLP_VStack_6" style="height: 100%; justify-content: flex-start;">
                        <div class="DLP_HStack_Auto">
                            <div class="DLP_HStack_4">
                                <svg width="17" height="17" viewBox="0 0 17 17" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.53125 16.4297C4.07812 16.4297 0.460938 12.8125 0.460938 8.35938C0.460938 3.90625 4.07812 0.289062 8.53125 0.289062C12.9844 0.289062 16.6016 3.90625 16.6016 8.35938C16.6016 12.8125 12.9844 16.4297 8.53125 16.4297ZM8.48438 5.6875C9.10156 5.6875 9.59375 5.1875 9.59375 4.57031C9.59375 3.9375 9.10156 3.44531 8.48438 3.44531C7.86719 3.44531 7.36719 3.9375 7.36719 4.57031C7.36719 5.1875 7.86719 5.6875 8.48438 5.6875ZM7.09375 12.8594H10.3906C10.7578 12.8594 11.0469 12.5938 11.0469 12.2188C11.0469 11.875 10.7578 11.5938 10.3906 11.5938H9.49219V7.75781C9.49219 7.26562 9.24219 6.94531 8.78125 6.94531H7.24219C6.875 6.94531 6.59375 7.22656 6.59375 7.57031C6.59375 7.94531 6.875 8.21094 7.24219 8.21094H8.0625V11.5938H7.09375C6.72656 11.5938 6.44531 11.875 6.44531 12.2188C6.44531 12.5938 6.72656 12.8594 7.09375 12.8594Z"/>
                                </svg>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF;">Info</p>
                            </div>
                            <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0.5;">This function is in BETA</p>
                        </div>
                        <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0.5;">League Protector protects your league position by completing lessons in our servers.</p>
                        <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0.5;">You only have access to Chill and Standard Mode with up to 7 days of protection. Donate to get access to Aggressive Mode and longer protection.</p>
                        <div style="display: flex; justify-content: flex-end; align-items: flex-end; gap: 6px; flex: 1 0 0; align-self: stretch;">
                            <p class="DLP_AutoServer_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" style="color: #FFF; opacity: 0.5;">Learn More</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
`;
CSS5 = `
.DLP_AutoServer_Text_Style_1 {
    font-family: "Duolingo Pro Rounded";
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    margin: 0;
    -webkit-font-smoothing: antialiased;
}
.DLP_AutoServer_Text_Style_2 {
    font-family: "Duolingo Pro Rounded";
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    margin: 0;
    -webkit-font-smoothing: antialiased;
}
.DLP_AutoServer_Mother_Box {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    z-index: 210;
    transition: filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.32, 1);

    background: rgba(var(--color-snow), 0.50);
    backdrop-filter: blur(16px);
}

.DLP_AutoServer_Box {
    display: flex;
    width: 512px;
    height: 512px;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;

    border-radius: 20px;
    border: 2px solid rgba(var(--color-eel), 0.10);
    background: rgba(var(--color-snow), 0.90);
    backdrop-filter: blur(16px);
    box-sizing: border-box;
}
.DLP_AutoServer_Box::-webkit-scrollbar {
    display: none;
}

.DLP_AutoServer_Menu_Bar {
    display: flex;
    width: 100%;
    height: 60px;
    padding: 20px;
    justify-content: space-between;
    align-items: center;

    position: sticky;
    top: 0;
    right: 0;
    left: 0;

    background: rgba(var(--color-snow), 0.80);
    backdrop-filter: blur(8px);
    z-index: 2;
}

.DLP_AutoServer_Scroll_Box {
    display: flex;
    padding: 0 20px 20px 20px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;
}

.DLP_AutoServer_Default_Box {
    display: flex;
    padding: 16px;
    justify-content: center;
    align-items: center;
    gap: 16px;
    align-self: stretch;

    border-radius: 8px;
    outline: 2px solid rgba(0, 0, 0, 0.10);
    outline-offset: -2px;
}
`;

HTML6 = `
<div class="DPAutoServerButtonMainMenu">
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_952_270)">
            <rect width="30" height="30" rx="15" fill="#007AFF"/>
            <path d="M19.9424 20.5947H10.4404C7.96582 20.5947 6.04492 18.7764 6.04492 16.582C6.04492 14.8115 7.02246 13.3623 8.61523 13.0342C8.73145 11.0859 10.5361 9.77344 12.3545 10.1904C13.2773 8.88477 14.7061 8.02344 16.4766 8.02344C19.4502 8.02344 21.7334 10.2998 21.7402 13.458C23.1279 14.0322 23.9551 15.3926 23.9551 16.876C23.9551 18.9404 22.1777 20.5947 19.9424 20.5947ZM10.6318 16.1445C10.2285 16.6504 10.6934 17.1904 11.2539 16.9102L13.4688 15.7549L16.1006 17.2109C16.2578 17.2998 16.4082 17.3477 16.5586 17.3477C16.7705 17.3477 16.9688 17.2383 17.1465 17.0195L19.3818 14.1963C19.7646 13.7109 19.3203 13.1641 18.7598 13.4443L16.5312 14.5928L13.9062 13.1436C13.7422 13.0547 13.5986 13.0068 13.4414 13.0068C13.2363 13.0068 13.0381 13.1094 12.8535 13.335L10.6318 16.1445Z" fill="white"/>
        </g>
        <defs>
            <clipPath id="clip0_952_270">
                <rect width="30" height="30" rx="15" fill="#FFF"/>
            </clipPath>
        </defs>
    </svg>
    <p class="DPAutoServerElementsMenu DLP_NoSelect" style="flex: 1 0 0; color: #007AFF; font-size: 16px; font-style: normal; font-weight: 700; line-height: normal; margin: 0px;">AutoServer</p>
    <svg class="DPAutoServerElementsMenu" style="opacity: 0;" width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.57031 7.85938C8.57031 8.24219 8.4375 8.5625 8.10938 8.875L2.20312 14.6641C1.96875 14.8984 1.67969 15.0156 1.33594 15.0156C0.648438 15.0156 0.0859375 14.4609 0.0859375 13.7734C0.0859375 13.4219 0.226562 13.1094 0.484375 12.8516L5.63281 7.85156L0.484375 2.85938C0.226562 2.60938 0.0859375 2.28906 0.0859375 1.94531C0.0859375 1.26562 0.648438 0.703125 1.33594 0.703125C1.67969 0.703125 1.96875 0.820312 2.20312 1.05469L8.10938 6.84375C8.42969 7.14844 8.57031 7.46875 8.57031 7.85938Z" fill="#007AFF"/>
    </svg>
</div>
`;
CSS6 = `
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

.DPAutoServerButtonMainMenu:hover .DPAutoServerElementsMenu {
	opacity: 1 !important;
}

.DPAutoServerButtonMainMenuMedium {
	width: 56px;
	height: 52px;
	padding: 8px;
}

.DPAutoServerButtonMainMenuLarge {
	width: 222px;
	height: 52px;
	padding: 16px 17px;
}
`;
HTML7 = `
<div id="DLP_The_Bar_Thing_Box" class="DuolingoProCounterBoxOneClass" style="display: inline-flex; justify-content: center; flex-direction: row-reverse; align-items: center; gap: 4px;">
    <div class="vCIrKKxykXwXyUza DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID">
        <svg id="DLP_Inset_Icon_1_ID" style="display: none;" width="20" height="10" viewBox="0 0 20 10" fill="rgb(var(--color-eel))" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.223633 5.06445C0.223633 2.2959 2.01465 0.470703 4.66699 0.470703C6.02734 0.470703 7.20312 1.04492 8.41309 2.2207L9.91016 3.66309L11.4004 2.2207C12.6104 1.04492 13.7861 0.470703 15.1465 0.470703C17.7988 0.470703 19.5898 2.2959 19.5898 5.06445C19.5898 7.82617 17.7988 9.65137 15.1465 9.65137C13.7861 9.65137 12.6104 9.08398 11.4004 7.9082L9.91016 6.45898L8.41309 7.9082C7.20312 9.08398 6.02734 9.65137 4.66699 9.65137C2.01465 9.65137 0.223633 7.82617 0.223633 5.06445ZM2.25391 5.06445C2.25391 6.61621 3.21777 7.62109 4.66699 7.62109C5.45312 7.62109 6.17773 7.23828 6.99121 6.46582L8.47461 5.06445L6.99121 3.66309C6.17773 2.89062 5.45312 2.50098 4.66699 2.50098C3.21777 2.50098 2.25391 3.50586 2.25391 5.06445ZM11.3389 5.06445L12.8223 6.46582C13.6426 7.23828 14.3604 7.62109 15.1465 7.62109C16.5957 7.62109 17.5596 6.61621 17.5596 5.06445C17.5596 3.50586 16.5957 2.50098 15.1465 2.50098C14.3604 2.50098 13.6357 2.89062 12.8223 3.66309L11.3389 5.06445Z"/>
        </svg>
        <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1 DLP_NoSelect"></p>
    </div>
    <div class="vCIrKKxykXwXyUza DLP_Magnetic_Hover_1" id="DLP_Inset_Button_2_ID">
        <svg id="DLP_Inset_Icon_1_ID" style="" width="15" height="15" viewBox="0 0 15 15" fill="rgb(var(--color-eel))" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3916 13.9004L0.991211 1.51367C0.772461 1.29492 0.772461 0.918945 0.991211 0.700195C1.2168 0.474609 1.58594 0.474609 1.81152 0.700195L14.2051 13.0869C14.4307 13.3125 14.4238 13.6748 14.2051 13.9004C13.9863 14.126 13.6172 14.126 13.3916 13.9004ZM10.958 8.54785L6.09766 3.70117H6.2002C6.23438 3.69434 6.26172 3.68066 6.28223 3.66016L8.76367 1.35645C9.18066 0.966797 9.48828 0.802734 9.87793 0.802734C10.5 0.802734 10.958 1.28809 10.958 1.89648V8.54785ZM3.94434 10.1611C2.80957 10.1611 2.21484 9.5459 2.21484 8.35645V5.79297C2.21484 5.21191 2.36523 4.76074 2.64551 4.4668L10.8691 12.6768C10.6982 13.1006 10.3359 13.3398 9.88477 13.3398C9.47461 13.3398 9.15332 13.1758 8.76367 12.8066L5.96777 10.209C5.93359 10.1748 5.88574 10.1611 5.83789 10.1611H3.94434Z"/>
        </svg>
        <svg id="DLP_Inset_Icon_2_ID" style="display: none;" width="18" height="14" viewBox="0 0 18 14" fill="rgb(var(--color-eel))" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.88477 13.3398C7.47461 13.3398 7.15332 13.1758 6.76367 12.8066L3.98828 10.209C3.9541 10.1748 3.90625 10.1611 3.8584 10.1611H1.95801C0.830078 10.1611 0.214844 9.52539 0.214844 8.34277V5.81348C0.214844 4.63086 0.830078 3.98828 1.95801 3.98828H3.8584C3.91309 3.98828 3.9541 3.96777 3.99512 3.93359L6.76367 1.35645C7.1875 0.966797 7.48145 0.802734 7.87793 0.802734C8.5 0.802734 8.95801 1.28809 8.95801 1.89648V12.2666C8.95801 12.875 8.5 13.3398 7.88477 13.3398ZM14.4609 12.2119C14.0166 11.9521 13.9619 11.4121 14.2627 10.9268C14.96 9.84668 15.3633 8.48633 15.3633 7.06445C15.3633 5.64258 14.9668 4.27539 14.2627 3.20215C13.9619 2.7168 14.0166 2.17676 14.4609 1.91016C14.8643 1.67773 15.3564 1.77344 15.6162 2.16992C16.5391 3.5166 17.0586 5.25977 17.0586 7.06445C17.0586 8.86914 16.5322 10.5986 15.6162 11.959C15.3564 12.3555 14.8643 12.4512 14.4609 12.2119ZM11.3848 10.3115C10.9609 10.0449 10.8652 9.53906 11.2139 8.97168C11.5557 8.44531 11.7471 7.76855 11.7471 7.06445C11.7471 6.35352 11.5625 5.67676 11.2139 5.15723C10.8652 4.59668 10.9609 4.08398 11.3848 3.81738C11.7676 3.57129 12.2529 3.66699 12.5059 4.01562C13.1006 4.83594 13.4492 5.92285 13.4492 7.06445C13.4492 8.20605 13.1006 9.29297 12.5059 10.1064C12.2529 10.4619 11.7676 10.5508 11.3848 10.3115Z"/>
        </svg>
        <p id="DLP_Inset_Text_1_ID" class="DLP_Text_Style_1 DLP_NoSelect">Mute</p>
    </div>
    <div class="vCIrKKxykXwXyUza DLP_Magnetic_Hover_1" id="DLP_Inset_Button_3_ID" style="width: 40px; padding: 0;">
        <svg id="DLP_Inset_Icon_1_ID" style="transition: all 0.8s cubic-bezier(0.16, 1, 0.32, 1);" width="15" height="16" viewBox="0 0 15 16" fill="rgb(var(--color-eel))" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.44238 15.29C3.48438 15.29 0.223633 12.0293 0.223633 8.06445C0.223633 4.10645 3.47754 0.845703 7.44238 0.845703C11.4004 0.845703 14.6611 4.10645 14.6611 8.06445C14.6611 12.0293 11.4072 15.29 7.44238 15.29ZM8.87793 11.5303C9.17188 11.2363 9.15137 10.7783 8.87793 10.5117L6.2666 8.07129L8.87793 5.63086C9.1582 5.36426 9.1582 4.88574 8.85742 4.6123C8.59082 4.36621 8.16016 4.35938 7.87305 4.63281L5.09766 7.23047C4.61914 7.68164 4.61914 8.46777 5.09766 8.91895L7.87305 11.5166C8.13281 11.7627 8.63184 11.7695 8.87793 11.5303Z"/>
        </svg>
    </div>
</div>
`;
CSS7 = `
.vCIrKKxykXwXyUza {
    outline: 2px solid rgb(var(--color-swan));
    outline-offset: -2px;
    height: 40px;
    width: auto;
    padding: 0 16px;
    gap: 6px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    flex-shrink: 0;

    border-radius: 32px;
    background: rgb(var(--color-snow), 0.84);
    backdrop-filter: blur(16px);
    overflow: hidden;

    transition: all 0.4s cubic-bezier(0.16, 1, 0.32, 1);
    cursor: pointer;
}
.vCIrKKxykXwXyUza p {
    white-space: nowrap;
}
.vCIrKKxykXwXyUza svg {
    flex-shrink: 0;
}
`;
}

function One() {
    Two();

    document.head.appendChild(Object.assign(document.createElement('style'), { type: 'text/css', textContent: CSS1 }));
    document.body.insertAdjacentHTML('beforeend', HTML2);
    document.head.appendChild(Object.assign(document.createElement('style'), { type: 'text/css', textContent: CSS2 }));

    document.body.insertAdjacentHTML('beforeend', HTML5);
    document.head.appendChild(Object.assign(document.createElement('style'), { type: 'text/css', textContent: CSS5 }));

    let DPAutoServerButtonMainMenuElement = null;
    let DPAutoServerButtonMainMenuStyle = null;

    function DPAutoServerButtonMainMenuFunction() {
        try {
            if (storageLocal.settings.showAutoServerButton && alpha) {
                let targetElement = document.querySelector('._2uLXp');
                if (!targetElement || document.querySelector('.DPAutoServerButtonMainMenu')) return;

                DPAutoServerButtonMainMenuStyle = document.createElement('style');
                DPAutoServerButtonMainMenuStyle.type = 'text/css';
                DPAutoServerButtonMainMenuStyle.innerHTML = CSS6;
                document.head.appendChild(DPAutoServerButtonMainMenuStyle);

                let targetDivLast = document.querySelector('[data-test="profile-tab"]');

                if (targetElement && targetDivLast) {
                    targetElement.lastChild.insertAdjacentHTML('beforebegin', HTML6);

                    let otherTargetDiv = document.querySelector('.DPAutoServerButtonMainMenu');
                    otherTargetDiv.addEventListener('click', () => {
                        manageAutoServerWindowVisibility(true);
                    });

                    let lastWidth = targetElement.offsetWidth;
                    const resizeObserver = new ResizeObserver(entries => {
                        for (let entry of entries) {
                            if (entry.target.offsetWidth !== lastWidth) {
                                otherTargetDiv.remove();
                                DPAutoServerButtonMainMenuFunction();
                                lastWidth = entry.target.offsetWidth;
                            }
                        }
                    });
                    resizeObserver.observe(targetElement);

                    if (targetElement.offsetWidth < 100) {
                        otherTargetDiv.classList.add('DPAutoServerButtonMainMenuMedium');
                        document.querySelectorAll('.DPAutoServerElementsMenu').forEach(function(element) {
                            element.remove();
                        });
                    } else {
                        otherTargetDiv.classList.add('DPAutoServerButtonMainMenuLarge');
                    }
                }
            }
        } catch(error) {}
    }
    setInterval(DPAutoServerButtonMainMenuFunction, 500);

    document.querySelector('.DLP_AutoServer_Mother_Box').querySelector('#DLP_AutoServer_Close_Button_1_ID').addEventListener('click', () => {
        manageAutoServerWindowVisibility(false);
    });
    document.querySelector('.DLP_AutoServer_Mother_Box').addEventListener('click', (event) => {
        if (event.target === event.currentTarget) {
            manageAutoServerWindowVisibility(false);
        }
    });
    function manageAutoServerWindowVisibility(state) {
        if (state) {
            document.querySelector('.DLP_AutoServer_Mother_Box').style.display = "";
            document.querySelector('.DLP_AutoServer_Mother_Box').offsetHeight;
            document.querySelector('.DLP_AutoServer_Mother_Box').style.opacity = "1";
            document.querySelector('.DLP_AutoServer_Mother_Box').style.filter = "blur(0px)";
        } else {
            document.querySelector('.DLP_AutoServer_Mother_Box').style.opacity = "0";
            document.querySelector('.DLP_AutoServer_Mother_Box').style.filter = "blur(8px)";
            setTimeout(() => {
                document.querySelector('.DLP_AutoServer_Mother_Box').style.display = "none";
            }, 400);
        }
    }

    let counterPaused = false;
    function DuolingoProCounterOneFunction() {
        function handleMuteTab(value) {
            if (isBusySwitchingPages) return;
            isBusySwitchingPages = true;
            muteTab(value);
            let button = document.querySelector('#DLP_Inset_Button_2_ID');
            let icon1 = button.querySelector('#DLP_Inset_Icon_1_ID');
            let icon2 = button.querySelector('#DLP_Inset_Icon_2_ID');
            let text = button.querySelector('#DLP_Inset_Text_1_ID');
            if (value) {
                setButtonState(button, "Muted", icon1, icon2, 'rgb(var(--color-snow), 0.84)', '2px solid rgb(var(--color-swan))', 'rgb(var(--color-black-text))', 400, () => {
                    setTimeout(() => {
                        isBusySwitchingPages = false;
                    }, 400);
                });
            } else {
                setButtonState(button, "Mute", icon2, icon1, 'rgb(var(--color-snow), 0.84)', '2px solid rgb(var(--color-swan))', 'rgb(var(--color-black-text))', 400, () => {
                    setTimeout(() => {
                        isBusySwitchingPages = false;
                    }, 400);
                });
            }
        }

        if ((window.location.pathname.includes('/lesson') || window.location.pathname.includes('/practice')) && storageSession.legacy.status) {
            let theBarThing = document.querySelector('#DLP_The_Bar_Thing_Box');
            if (!theBarThing) {
                document.head.appendChild(Object.assign(document.createElement('style'), { type: 'text/css', textContent: CSS7 }));
                //const targetElement1 = document.querySelector('.I-Avc._1zcW8');
                const targetElement1 = document.querySelector('._1zcW8');
                const targetElement2 = document.querySelector('.mAxZF');
                if (targetElement1) {
                    targetElement1.insertAdjacentHTML('beforeend', HTML7);
                    theBarThing = document.querySelector('#DLP_The_Bar_Thing_Box');
                    targetElement1.style.display = "flex";
                    document.querySelector('[role="progressbar"]').style.width = "100%";
                } else if (targetElement2) {
                    targetElement2.insertAdjacentHTML('beforeend', HTML7);
                    theBarThing = document.querySelector('#DLP_The_Bar_Thing_Box');
                    theBarThing.style.marginLeft = '24px';
                    document.querySelector('._15ch1').style.pointerEvents = 'all';
                }
                else if (debug) console.log('Element with class ._1zcW8 or .mAxZF not found');

                let muteButton = theBarThing.querySelector('#DLP_Inset_Button_2_ID');
                let expandButton = theBarThing.querySelector('#DLP_Inset_Button_3_ID');
                let expandButtonIcon = expandButton.querySelector('#DLP_Inset_Icon_1_ID');
                let theBarThingExtended = false;
                function theBarThingExtend(button, visibility, noAnimation) {
                    if (visibility) {
                        button.style.display = "";
                        button.style.width = "";
                        button.style.padding = "";
                        button.style.transition = '';
                        let remember0010 = button.offsetWidth;
                        button.style.width = "0px";
                        requestAnimationFrame(() => {
                            button.style.width = remember0010 + "px";
                            button.style.padding = "";
                            button.style.filter = "blur(0px)";
                            button.style.opacity = "1";
                            button.style.margin = "";
                        });
                    } else {
                        button.style.transition = '';
                        button.style.width = button.offsetWidth + "px";
                        requestAnimationFrame(() => {
                            button.style.width = "4px";
                            button.style.padding = "0";
                            button.style.filter = "blur(8px)";
                            button.style.margin = "0 -4px";
                            button.style.opacity = "0";
                        });
                        if (!noAnimation) {
                            setTimeout(function() {
                                button.style.display = "none";
                            }, 400);
                        } else {
                            button.style.display = "none";
                        }
                    }
                }
                theBarThingExtend(muteButton, false, true);
                expandButton.addEventListener('click', () => {
                    if (theBarThingExtended) {
                        expandButtonIcon.style.transform = "rotate(0deg)";
                        theBarThingExtended = false;
                        theBarThingExtend(muteButton, false);
                    } else {
                        expandButtonIcon.style.transform = "rotate(180deg)";
                        theBarThingExtended = true;
                        theBarThingExtend(muteButton, true);
                    }
                });

                let counterButton = theBarThing.querySelector('#DLP_Inset_Button_1_ID');
                let counterButtonText = counterButton.querySelector('#DLP_Inset_Text_1_ID');
                let counterButtonIcon = counterButton.querySelector('#DLP_Inset_Icon_1_ID');
                counterButton.addEventListener('click', () => {
                    if (isBusySwitchingPages) return;
                    isBusySwitchingPages = true;
                    if (theBarThing.querySelector('#DLP_Inset_Button_1_ID').querySelector('#DLP_Inset_Text_1_ID').innerHTML === 'Click Again to Stop Legacy') {
                        setButtonState(counterButton, "Stopping", undefined, counterButtonIcon.style.display !== 'none' ? counterButtonIcon : undefined, 'rgb(var(--color-snow), 0.84)', '2px solid rgb(var(--color-swan))', 'rgb(var(--color-black-text))', 400, () => {
                            storageSession.legacy.status = false;
                            saveStorageSession();
                            setTimeout(() => {
                                isBusySwitchingPages = false;
                                window.location.href = "https://duolingo.com";
                            }, 400);
                        });
                    } else {
                        counterPaused = true;
                        setButtonState(counterButton, "Click Again to Stop Legacy", undefined, counterButtonIcon.style.display !== 'none' ? counterButtonIcon : undefined, 'rgb(var(--color-snow), 0.84)', '2px solid rgb(var(--color-swan))', 'rgb(var(--color-black-text))', 400, () => {
                            setTimeout(() => {
                                isBusySwitchingPages = false;
                                setTimeout(() => {
                                    if (storageSession.legacy.status) counterPaused = false;
                                }, 4000);
                            }, 400);
                        });
                    }
                });

                if (storageLocal.settings.muteLessons) {
                    handleMuteTab(true);
                }

                document.querySelector('#DLP_Inset_Button_2_ID').addEventListener('click', () => {
                    storageLocal.settings.muteLessons = !storageLocal.settings.muteLessons;
                    saveStorageLocal();
                    handleMuteTab(storageLocal.settings.muteLessons);
                });
            }

            function updateCounter() {
                let button = theBarThing.querySelector('#DLP_Inset_Button_1_ID');
                let text = button.querySelector('#DLP_Inset_Text_1_ID');
                let icon = button.querySelector('#DLP_Inset_Icon_1_ID');

                if (storageSession.legacy[storageSession.legacy.status].type === 'infinity' && text.textContent !== 'Infinity') {
                    isBusySwitchingPages = true;
                    setButtonState(button, "Infinity", icon, undefined, 'rgb(var(--color-snow), 0.84)', '2px solid rgb(var(--color-swan))', 'rgb(var(--color-black-text))', 400, () => {
                        setTimeout(() => {
                            isBusySwitchingPages = false;
                        }, 400);
                    });
                } else if (storageSession.legacy[storageSession.legacy.status].type === 'xp' && text.textContent !== String(storageSession.legacy[storageSession.legacy.status].amount + ' XP Left')) {
                    isBusySwitchingPages = true;
                    setButtonState(button, String(storageSession.legacy[storageSession.legacy.status].amount + ' XP Left'), undefined, icon.style.display !== 'none' ? icon : undefined, 'rgb(var(--color-snow), 0.84)', '2px solid rgb(var(--color-swan))', 'rgb(var(--color-black-text))', 400, () => {
                        setTimeout(() => {
                            isBusySwitchingPages = false;
                        }, 400);
                    });
                } else if (window.location.pathname === '/practice') {
                    if (storageSession.legacy[storageSession.legacy.status].amount === 1 && text.textContent !== 'Last Practice') {
                        isBusySwitchingPages = true;
                        setButtonState(button, 'Last Practice', undefined, icon.style.display !== 'none' ? icon : undefined, 'rgb(var(--color-snow), 0.84)', '2px solid rgb(var(--color-swan))', 'rgb(var(--color-black-text))', 400, () => {
                            setTimeout(() => {
                                isBusySwitchingPages = false;
                            }, 400);
                        });
                    } else if (storageSession.legacy[storageSession.legacy.status].amount === 0 && text.textContent !== 'Finishing Up') {
                        isBusySwitchingPages = true;
                        setButtonState(button, 'Finishing Up', undefined, icon.style.display !== 'none' ? icon : undefined, 'rgb(var(--color-snow), 0.84)', '2px solid rgb(var(--color-swan))', 'rgb(var(--color-black-text))', 400, () => {
                            setTimeout(() => {
                                isBusySwitchingPages = false;
                            }, 400);
                        });
                    } else if (storageSession.legacy[storageSession.legacy.status].amount > 1 && text.textContent !== String(storageSession.legacy[storageSession.legacy.status].amount + ' Practices Left')) {
                        isBusySwitchingPages = true;
                        setButtonState(button, String(storageSession.legacy[storageSession.legacy.status].amount + ' Practices Left'), undefined, icon.style.display !== 'none' ? icon : undefined, 'rgb(var(--color-snow), 0.84)', '2px solid rgb(var(--color-swan))', 'rgb(var(--color-black-text))', 400, () => {
                            setTimeout(() => {
                                isBusySwitchingPages = false;
                            }, 400);
                        });
                    }
                } else if (storageSession.legacy[storageSession.legacy.status].type === 'lesson') {
                    if (storageSession.legacy[storageSession.legacy.status].amount === 1 && text.textContent !== 'Last Lesson') {
                        isBusySwitchingPages = true;
                        setButtonState(button, 'Last Lesson', undefined, icon.style.display !== 'none' ? icon : undefined, 'rgb(var(--color-snow), 0.84)', '2px solid rgb(var(--color-swan))', 'rgb(var(--color-black-text))', 400, () => {
                            setTimeout(() => {
                                isBusySwitchingPages = false;
                            }, 400);
                        });
                    } else if (storageSession.legacy[storageSession.legacy.status].amount === 0 && text.textContent !== 'Finishing Up') {
                        isBusySwitchingPages = true;
                        setButtonState(button, 'Finishing Up', undefined, icon.style.display !== 'none' ? icon : undefined, 'rgb(var(--color-snow), 0.84)', '2px solid rgb(var(--color-swan))', 'rgb(var(--color-black-text))', 400, () => {
                            setTimeout(() => {
                                isBusySwitchingPages = false;
                            }, 400);
                        });
                    } else if (storageSession.legacy[storageSession.legacy.status].amount > 1 && text.textContent !== String(storageSession.legacy[storageSession.legacy.status].amount + ' Lessons Left')) {
                        isBusySwitchingPages = true;
                        setButtonState(button, String(storageSession.legacy[storageSession.legacy.status].amount + ' Lessons Left'), undefined, icon.style.display !== 'none' ? icon : undefined, 'rgb(var(--color-snow), 0.84)', '2px solid rgb(var(--color-swan))', 'rgb(var(--color-black-text))', 400, () => {
                            setTimeout(() => {
                                isBusySwitchingPages = false;
                            }, 400);
                        });
                    }
                }
            }

            if (!counterPaused) updateCounter();
        }
    }
    setInterval(DuolingoProCounterOneFunction, 500);


    window.onfocus = () => {
        windowBlurState = true;
    };
    window.onblur = () => {
        windowBlurState = false;
    };

    document.querySelector('#DLP_Get_GEMS_1_ID').addEventListener('click', () => {
        showNotification("warning", systemText[systemLanguage][200], systemText[systemLanguage][201], 6);
    });
    document.querySelector('#DLP_Get_GEMS_2_ID').addEventListener('click', () => {
        showNotification("warning", systemText[systemLanguage][200], systemText[systemLanguage][201], 6);
    });

    function addButtons() {
        if (!storageLocal.settings.showSolveButtons) return;
        if (window.location.pathname === '/learn' && document.querySelector('a[data-test="global-practice"]')) return;
        if (document.querySelector("#solveAllButton")) return;

        document.querySelector('[data-test="quit-button"]')?.addEventListener('click', function() {
            solving("stop");
            //storageSession.legacy.status = false;
            //saveStorageSession();
        });

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

        const nextButton = document.querySelector('[data-test="player-next"]');
        const storiesContinueButton = document.querySelector('[data-test="stories-player-continue"]');
        const storiesDoneButton = document.querySelector('[data-test="stories-player-done"]');
        const target = nextButton || storiesContinueButton || storiesDoneButton;

        if (document.querySelector('[data-test="story-start"]') && storageSession.legacy.status) {
            document.querySelector('[data-test="story-start"]').click();
        }
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
            if (document.querySelector('.MYehf') !== null) {
                document.querySelector('.MYehf').style.display = "flex";
                document.querySelector('.MYehf').style.gap = "20px";
            } else if (document.querySelector(".FmlUF") !== null) { // Story
                findReactMainElementClass = '_3TJzR';
                reactTraverseUp = 0;
                document.querySelector('._3TJzR').style.display = "flex";
                document.querySelector('._3TJzR').style.gap = "20px";
            }

            const buttonsCSS = document.createElement('style');
            buttonsCSS.innerHTML = HTML4;
            document.head.appendChild(buttonsCSS);

            const solveCopy = createButton('solveAllButton', solvingIntervalId ? systemText[systemLanguage][102] : systemText[systemLanguage][101], 'auto-solver-btn solve-btn', {
                'click': solving
            });

            const pauseCopy = createButton('', systemText[systemLanguage][100], 'auto-solver-btn pause-btn', {
                'click': solve
            });

            target.parentElement.appendChild(pauseCopy);
            target.parentElement.appendChild(solveCopy);

            if (storageSession.legacy.status) {
                solving("start");
            }
        }
    }
    setInterval(addButtons, 500);


    try {
        const container = document.getElementById('DLP_Main_Box_Divider_11_ID');
        const textarea = container.querySelector('#DLP_Inset_Input_1_ID');
        const activeContainer = container.querySelector('.DLP_Input_Style_1_Active');

        // Set initial height to be equal to one line
        textarea.style.height = '1.2em'; // Set to the height of one line

        // Add event listener to adjust height dynamically
        textarea.addEventListener('input', function () {
            // Reset height to auto to allow shrinking
            textarea.style.height = 'auto';

            // Calculate the maximum height for 5 lines
            const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
            const maxRows = 5;
            const maxHeight = lineHeight * maxRows;

            // Set the height to the scrollHeight or maximum height
            const newHeight = Math.min(textarea.scrollHeight, maxHeight);

            // Set the new height for the textarea
            textarea.style.height = newHeight + 'px';

            // Adjust the active container height; +32px for padding (16px top and bottom)
            activeContainer.style.height = (newHeight + 32) + 'px'; // 32px for padding
        });
    } catch (error) {
        console.log("Construction Zone 1 ERROR: ", error);
    }


    let notificationCount = 0;
    let currentNotification = [];
    let notificationsHovered = false;

    const notificationMain = document.querySelector('.DLP_Notification_Main');
    notificationMain.addEventListener('mouseenter', () => {
        notificationsHovered = true;
    });
    notificationMain.addEventListener('mouseleave', () => {
        notificationsHovered = false;
    });

    function showNotification(icon, head, body, time) {
        notificationCount++;
        let notificationID = notificationCount;
        currentNotification.push(notificationID);

        let element = new DOMParser()
        .parseFromString(HTML3, 'text/html')
        .body.firstChild;
        element.id = 'DLP_Notification_Box_' + notificationID + '_ID';
        notificationMain.appendChild(element);
        initializeMagneticHover(
            element.querySelector('#DLP_Notification_Dismiss_Button_1_ID')
        );

        if (icon === "") {
            element.querySelector('#DLP_Inset_Icon_1_ID').remove();
        } else if (icon === "checkmark") {
            element.querySelector('#DLP_Inset_Icon_1_ID').style.display = 'block';
        } else if (icon === "warning") {
            element.querySelector('#DLP_Inset_Icon_2_ID').style.display = 'block';
        } else if (icon === "error") {
            element.querySelector('#DLP_Inset_Icon_3_ID').style.display = 'block';
        }
        element.querySelector('#DLP_Inset_Text_1_ID').innerHTML = head;
        if (body && body !== "") {
            element.querySelector('#DLP_Inset_Text_2_ID').innerHTML = body;
        } else {
            element.querySelector('#DLP_Inset_Text_2_ID').style.display = "none";
        }

        let notification = document.querySelector(
            '#DLP_Notification_Box_' + notificationID + '_ID'
        );
        let notificationHeight = notification.offsetHeight;
        notification.style.bottom = '-' + notificationHeight + 'px';

        setTimeout(() => {
            requestAnimationFrame(() => {
                notification.style.bottom = "16px";
                notification.style.filter = "blur(0px)";
                notification.style.opacity = "1";
            });
        }, 50);

        let isBusyDisappearing = false;

        let timerData = null;
        if (time !== 0) {
            timerData = {
                remaining: time * 1000,
                lastTimestamp: Date.now(),
                timeoutHandle: null,
                paused: false,
            };
            timerData.timeoutHandle = setTimeout(internalDisappear, timerData.remaining);
        }

        let repeatInterval = setInterval(() => {
            if (document.body.offsetWidth <= 963) {
                requestAnimationFrame(() => {
                    notificationMain.style.width = "300px";
                    notificationMain.style.position = "fixed";
                    notificationMain.style.left = "16px";
                });
            } else {
                requestAnimationFrame(() => {
                    notificationMain.style.width = "";
                    notificationMain.style.position = "";
                    notificationMain.style.left = "";
                });
            }

            if (isBusyDisappearing) return;

            if (timerData) {
                if (notificationsHovered && !timerData.paused) {
                    clearTimeout(timerData.timeoutHandle);
                    let elapsed = Date.now() - timerData.lastTimestamp;
                    timerData.remaining -= elapsed;
                    timerData.paused = true;
                }
                if (!notificationsHovered && timerData.paused) {
                    timerData.paused = false;
                    timerData.lastTimestamp = Date.now();
                    timerData.timeoutHandle = setTimeout(internalDisappear, timerData.remaining);
                }
            }

            if (notificationsHovered) {
                let allIDs = currentNotification.slice();
                let bottoms = {};
                let currentBottom = 16;
                for (let i = allIDs.length - 1; i >= 0; i--) {
                    let notifEl = document.querySelector(
                        '#DLP_Notification_Box_' + allIDs[i] + '_ID'
                    );
                    if (!notifEl) continue;
                    notifEl.style.width = "";
                    notifEl.style.height = "";
                    notifEl.style.transform = "";
                    bottoms[allIDs[i]] = currentBottom;
                    currentBottom += notifEl.offsetHeight + 8;
                }
                notification.style.bottom = bottoms[notificationID] + "px";

                let totalHeight = 0;
                for (let i = 0; i < allIDs.length; i++) {
                    let notifEl = document.querySelector(
                        '#DLP_Notification_Box_' + allIDs[i] + '_ID'
                    );
                    if (notifEl) {
                        totalHeight += notifEl.offsetHeight;
                    }
                }
                if (allIDs.length > 1) {
                    totalHeight += (allIDs.length - 1) * 8;
                }
                notificationMain.style.height = totalHeight + "px";
            } else {
                notificationMain.style.height = '';
                notification.style.bottom = "16px";
                if (currentNotification[currentNotification.length - 1] !== notificationID) {
                    notification.style.height = notificationHeight + 'px';
                    requestAnimationFrame(() => {
                        let latestNotif = document.querySelector(
                            '#DLP_Notification_Box_' +
                            String(currentNotification[currentNotification.length - 1]) +
                            '_ID'
                        );
                        if (latestNotif) {
                            notification.style.height = latestNotif.offsetHeight + 'px';
                        }
                        notification.style.width = "284px";
                        notification.style.transform = "translateY(-8px)";
                    });
                } else {
                    requestAnimationFrame(() => {
                        notification.style.height = notificationHeight + "px";
                        notification.style.width = "";
                        notification.style.transform = "";
                    });
                }
            }
        }, 20);

        function internalDisappear() {
            if (timerData && timerData.timeoutHandle) {
                clearTimeout(timerData.timeoutHandle);
            }
            if (isBusyDisappearing) return;
            isBusyDisappearing = true;
            currentNotification.splice(currentNotification.indexOf(notificationID), 1);

            requestAnimationFrame(() => {
                notification.style.bottom = "-" + notificationHeight + "px";
                notification.style.filter = "blur(16px)";
                notification.style.opacity = "0";
            });
            clearInterval(repeatInterval);
            setTimeout(() => {
                notification.remove();
                if (currentNotification.length === 0) {
                    notificationMain.style.height = '';
                }
            }, 800);
        }

        function disappear() {
            internalDisappear();
        }

        notification.querySelector('#DLP_Notification_Dismiss_Button_1_ID').addEventListener("click", disappear);

        return {
            close: disappear
        };
    }


    let isBusySwitchingPages = false;
    let pages = {
        "DLP_Onboarding_Start_Button_1_ID": [5],
        "DLP_Switch_Legacy_Button_1_ID": [3],

        "DLP_Universal_Back_1_Button_1_ID": [1],

        "DLP_Main_Settings_1_Button_1_ID": [7],
        "DLP_Main_Feedback_1_Button_1_ID": [8],
        "DLP_Main_Whats_New_1_Button_1_ID": [9],
        "DLP_Main_See_More_1_Button_1_ID": [2],
        "DLP_Main_Terms_1_Button_1_ID": [5],

        "DLP_Secondary_Settings_1_Button_1_ID": [7],
        "DLP_Secondary_Feedback_1_Button_1_ID": [8],
        "DLP_Secondary_Whats_New_1_Button_1_ID": [9],
        "DLP_Secondary_See_More_1_Button_1_ID": [4],
        "DLP_Secondary_Terms_1_Button_1_ID": [5],

        "DLP_Terms_Back_Button_1_ID": [1],
        "DLP_Terms_Accept_Button_1_ID": [1],
        "DLP_Terms_Decline_Button_1_ID": [6],
        "DLP_Terms_Declined_Back_Button_1_ID": [5]
    };
    function goToPage(to, buttonID) {
        if (isBusySwitchingPages) return;
        isBusySwitchingPages = true;

        let mainBox = document.querySelector(`.DLP_Main_Box`);
        let toNumber = to;
        let fromPage = document.querySelector(`#DLP_Main_Box_Divider_${currentPage}_ID`);
        let toPage = document.querySelector(`#DLP_Main_Box_Divider_${toNumber}_ID`);

        let mainBoxNewToBeWidth = mainBox.offsetWidth;

        if (buttonID === 'DLP_Main_Terms_1_Button_1_ID' || buttonID === 'DLP_Secondary_Terms_1_Button_1_ID') {
            document.querySelector(`#DLP_Terms_1_Text_1_ID`).style.display = 'none';
            document.querySelector(`#DLP_Terms_1_Button_1_ID`).style.display = 'none';
            document.querySelector(`#DLP_Terms_1_Text_2_ID`).style.display = 'block';
            document.querySelector(`#DLP_Terms_1_Button_2_ID`).style.display = 'block';
        } else if (buttonID === 'DLP_Terms_Back_Button_1_ID') {
            toNumber = lastPage;
            toPage = document.querySelector(`#DLP_Main_Box_Divider_${toNumber}_ID`);
            setTimeout(() => {
                document.querySelector(`#DLP_Terms_1_Text_1_ID`).style.display = 'block';
                document.querySelector(`#DLP_Terms_1_Button_1_ID`).style.display = 'block';
                document.querySelector(`#DLP_Terms_1_Text_2_ID`).style.display = 'none';
                document.querySelector(`#DLP_Terms_1_Button_2_ID`).style.display = 'none';
            }, 400);
        } else if (buttonID === 'DLP_Universal_Back_1_Button_1_ID' || to === -1) {
            toNumber = lastPage;
            toPage = document.querySelector(`#DLP_Main_Box_Divider_${toNumber}_ID`);
        } else if (buttonID === 'DLP_Switch_Legacy_Button_1_ID') {
            let button = document.querySelector('#DLP_Switch_Legacy_Button_1_ID');
            console.log(storageSession.legacy.page);
            if (storageSession.legacy.page !== 0) {
                toNumber = 1;
                toPage = document.querySelector(`#DLP_Main_Box_Divider_${toNumber}_ID`);
                setButtonState(button, systemText[systemLanguage][106], button.querySelector('#DLP_Inset_Icon_1_ID'), button.querySelector('#DLP_Inset_Icon_2_ID'), 'linear-gradient(0deg, rgba(0, 122, 255, 0.10) 0%, rgba(0, 122, 255, 0.10) 100%), rgba(var(--color-snow), 0.80)', '2px solid rgba(0, 122, 255, 0.20', '#007AFF', 400);
                storageSession.legacy.page = 0;
                saveStorageSession();
            } else {
                toNumber = 3;
                toPage = document.querySelector(`#DLP_Main_Box_Divider_${toNumber}_ID`);
                setButtonState(button, systemText[systemLanguage][105], button.querySelector('#DLP_Inset_Icon_2_ID'), button.querySelector('#DLP_Inset_Icon_1_ID'), 'linear-gradient(0deg, rgba(0, 122, 255, 0.10) 0%, rgba(0, 122, 255, 0.10) 100%), rgba(var(--color-snow), 0.80)', '2px solid rgba(0, 122, 255, 0.20', '#007AFF', 400);
                storageSession.legacy.page = 1;
                saveStorageSession();
            }
        } else if (buttonID === 'DLP_Terms_Accept_Button_1_ID') {
            storageLocal.terms = newTermID;
            saveStorageLocal();
            connectToServer();
        } else if (buttonID === 'DLP_Onboarding_Start_Button_1_ID') {
            storageLocal.onboarding = true;
            saveStorageLocal();
            goToPage(1);
        }

        if (toNumber === 2) mainBoxNewToBeWidth = "600";
        else if (toNumber === 5) mainBoxNewToBeWidth = "400";
        else if (toNumber === 7) mainBoxNewToBeWidth = "400";
        else if (toNumber === 8) mainBoxNewToBeWidth = "400";
        else if (toNumber === 9) mainBoxNewToBeWidth = "400";
        else mainBoxNewToBeWidth = "312";

        if ([1, 2, 3, 4].includes(toNumber)) legacyButtonVisibility(true);
        else legacyButtonVisibility(false);

        if (toNumber === 3) {
            storageSession.legacy.page = 1;
            saveStorageSession();
        } else if (toNumber === 4) {
            storageSession.legacy.page = 2;
            saveStorageSession();
        }

        let mainBoxOldWidth = mainBox.offsetWidth;
        let mainBoxOldHeight = mainBox.offsetHeight;
        let fromBoxOldWidth = fromPage.offsetWidth;
        let fromBoxOldHeight = fromPage.offsetHeight;
        console.log(fromBoxOldWidth, fromBoxOldHeight);
        mainBox.style.transition = "";
        fromPage.style.display = "none";
        toPage.style.display = "block";
        mainBox.offsetHeight;
        mainBox.style.width = `${mainBoxNewToBeWidth}px`;
        let mainBoxNewWidth = mainBoxNewToBeWidth;
        let mainBoxNewHeight = mainBox.offsetHeight;
        let toBoxOldWidth = toPage.offsetWidth;
        let toBoxOldHeight = toPage.offsetHeight;
        console.log(toBoxOldWidth, toBoxOldHeight);
        fromPage.style.display = "block";
        toPage.style.display = "none";
        mainBox.style.width = `${mainBoxOldWidth}px`;
        mainBox.style.height = `${mainBoxOldHeight}px`;
        mainBox.offsetHeight;

        mainBox.style.transition = "0.8s cubic-bezier(0.16, 1, 0.32, 1)";
        mainBox.offsetHeight;
        mainBox.style.width = `${mainBoxNewToBeWidth}px`;
        mainBox.style.height = `${mainBoxNewHeight}px`;

        fromPage.style.transform = `scaleX(1) scaleY(1)`;
        fromPage.style.width = `${fromBoxOldWidth}px`;
        fromPage.style.height = `${fromBoxOldHeight}px`;

        fromPage.style.transition = "opacity 0.4s cubic-bezier(0.16, 1, 0.32, 1), filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.8s cubic-bezier(0.16, 1, 0.32, 1)";
        fromPage.offsetHeight;
        fromPage.style.opacity = "0";
        fromPage.style.filter = "blur(4px)";
        fromPage.style.transform = `scaleX(${toBoxOldWidth / fromBoxOldWidth}) scaleY(${toBoxOldHeight / fromBoxOldHeight})`;

        toPage.style.width = `${toBoxOldWidth}px`;
        toPage.style.height = `${toBoxOldHeight}px`;
        toPage.style.opacity = "0";
        toPage.style.filter = "blur(4px)";
        toPage.style.transform = `scaleX(${fromBoxOldWidth / toBoxOldWidth}) scaleY(${fromBoxOldHeight / toBoxOldHeight})`;

        toPage.style.transition = "opacity 0.4s cubic-bezier(0.16, 1, 0.32, 1), filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.8s cubic-bezier(0.16, 1, 0.32, 1)";
        toPage.offsetHeight;
        toPage.style.transform = `scaleX(1) scaleY(1)`;

        setTimeout(() => {
            fromPage.style.display = "none";

            fromPage.style.width = ``;
            fromPage.style.height = ``;
            fromPage.style.transform = ``;

            toPage.style.display = "block";
            toPage.offsetHeight;
            toPage.style.opacity = "1";
            toPage.style.filter = "blur(0px)";
            setTimeout(() => {
                toPage.style.opacity = "";
                toPage.style.filter = "";
                toPage.style.transition = "";

                fromPage.style.transition = "";
                toPage.style.opacity = "";
                toPage.style.filter = "";

                mainBox.style.height = "";

                toPage.style.width = ``;
                toPage.style.height = ``;
                toPage.style.transform = ``;

                lastPage = currentPage;
                currentPage = toNumber;
                isBusySwitchingPages = false;
            }, 400);
        }, 400);
    }
    Object.keys(pages).forEach(function (key) {
        document.querySelectorAll(`#${key}`).forEach(element => {
            element.addEventListener("click", function () {
                if (isBusySwitchingPages || isGetButtonsBusy) return;
                goToPage(pages[key][0], key);
            });
        });
    });
    document.getElementById('DLP_Hide_Button_1_ID').addEventListener("click", function () {
        if (isBusySwitchingPages) return;
        hidden = !hidden;
        hide(hidden);
    });
    function hide(value) {
        if (isBusySwitchingPages) return;
        isBusySwitchingPages = true;
        let button = document.querySelector(`#DLP_Hide_Button_1_ID`);
        let main = document.querySelector(`.DLP_Main`);
        let mainBox = document.querySelector(`.DLP_Main_Box`);

        let mainBoxHeight = mainBox.offsetHeight;

        main.style.transition = "0.8s cubic-bezier(0.16, 1, 0.32, 1)";
        mainBox.style.transition = "0.8s cubic-bezier(0.16, 1, 0.32, 1)";
        if (value) {
            setButtonState(button, systemText[systemLanguage][104], button.querySelector('#DLP_Inset_Icon_2_ID'), button.querySelector('#DLP_Inset_Icon_1_ID'), 'rgba(0, 122, 255, 0.10)', '2px solid rgba(0, 122, 255, 0.20)', '#007AFF', 400);
            main.style.bottom = `-${mainBoxHeight - 8}px`;
            legacyButtonVisibility(false);
            mainBox.style.filter = "blur(8px)";
            mainBox.style.opacity = "0";
        } else {
            setButtonState(button, systemText[systemLanguage][103], button.querySelector('#DLP_Inset_Icon_1_ID'), button.querySelector('#DLP_Inset_Icon_2_ID'), '#007AFF', '2px solid rgba(0, 0, 0, 0.20)', '#FFF', 400);
            main.style.bottom = "16px";
            if (currentPage === 1 || currentPage === 3) legacyButtonVisibility(true);
            mainBox.style.filter = "";
            mainBox.style.opacity = "";
        }
        setTimeout(() => {
            main.style.transition = "";
            mainBox.style.transition = "";
            isBusySwitchingPages = false;
        }, 800);
    }
    document.querySelector(`.DLP_Main`).style.bottom = `-${document.querySelector(`.DLP_Main_Box`).offsetHeight - 8}px`;
    document.querySelector(`.DLP_Main_Box`).style.opacity = "0";
    document.querySelector(`.DLP_Main_Box`).style.filter = "blur(8px)";
    document.querySelector(`#DLP_Switch_Legacy_Button_1_ID`).style.filter = "blur(8px)";
    document.querySelector(`#DLP_Switch_Legacy_Button_1_ID`).style.opacity = "0";
    document.querySelector(`#DLP_Switch_Legacy_Button_1_ID`).style.display = "none";
    hide(false, false);
    function legacyButtonVisibility(value) {
        let legacyButton = document.querySelector(`#DLP_Switch_Legacy_Button_1_ID`);
        legacyButton.style.transition = 'width 0.8s cubic-bezier(0.77,0,0.18,1), opacity 0.8s cubic-bezier(0.16, 1, 0.32, 1), filter 0.8s cubic-bezier(0.16, 1, 0.32, 1), transform 0.4s cubic-bezier(0.16, 1, 0.32, 1)';
        if (value) {
            legacyButton.style.display = "";
            legacyButton.offsetWidth;
            legacyButton.style.filter = "";
            legacyButton.style.opacity = "";
        } else {
            legacyButton.style.filter = "blur(8px)";
            legacyButton.style.opacity = "0";
            setTimeout(() => {
                legacyButton.style.display = "none";
            }, 800);
        }
    }
    function handleVisibility() {
        if (document.querySelector('.MYehf') !== null || window.location.pathname.includes('/lesson') || window.location.pathname === '/practice') {
            document.querySelector('.DLP_Main').style.display = 'none';
        } else {
            document.querySelector('.DLP_Main').style.display = '';
        }
    }
    setInterval(handleVisibility, 200);

    let isGetButtonsBusy = false;
    function setButtonState(button, text, iconToShow, iconToHide, bgColor, outlineColor, textColor, delay, callback) {
        const textElement = button.querySelector('#DLP_Inset_Text_1_ID');
        const icons = [1, 2, 3, 4].map(num => button.querySelector(`#DLP_Inset_Icon_${num}_ID`));

        let previousText = textElement.textContent;
        textElement.textContent = text;
        if (iconToShow) iconToShow.style.display = 'block';
        if (iconToHide) iconToHide.style.display = 'none';
        let buttonNewWidth = button.offsetWidth;
        textElement.textContent = previousText;
        if (iconToShow) iconToShow.style.display = 'none';
        if (iconToHide) iconToHide.style.display = 'block';

        button.style.transition = 'width 0.8s cubic-bezier(0.77,0,0.18,1), background 0.8s cubic-bezier(0.16, 1, 0.32, 1), outline 0.8s cubic-bezier(0.16, 1, 0.32, 1), filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.4s cubic-bezier(0.16, 1, 0.32, 1)';
        button.style.width = `${button.offsetWidth}px`;

        requestAnimationFrame(() => {
            textElement.style.transition = '0.4s';
            if (iconToShow) iconToShow.style.transition = '0.4s';
            if (iconToHide) iconToHide.style.transition = '0.4s';

            textElement.style.filter = 'blur(4px)';
            textElement.style.opacity = '0';
            if (iconToHide) iconToHide.style.filter = 'blur(4px)';
            if (iconToHide) iconToHide.style.opacity = '0';
            button.style.width = `${buttonNewWidth}px`;

            button.style.background = bgColor;
            button.style.outline = outlineColor;
        });

        setTimeout(() => {
            textElement.style.transition = '0s';
            textElement.style.color = textColor;
            textElement.offsetWidth;
            textElement.style.transition = '0.4s';

            if (iconToShow) iconToShow.style.display = 'block';
            if (iconToHide) iconToHide.style.display = 'none';
            if (iconToShow) iconToShow.style.filter = 'blur(4px)';
            if (iconToShow) iconToShow.style.opacity = '0';

            textElement.textContent = text;

            requestAnimationFrame(() => {
                textElement.style.filter = '';
                textElement.style.opacity = '';
                if (iconToShow) iconToShow.style.filter = '';
                if (iconToShow) iconToShow.style.opacity = '1';
            });

            setTimeout(() => {
                button.style.width = '';
            }, 400);

            if (callback) callback();
        }, delay);
    }



    const DLP_Get_PATH_1_ID = document.getElementById("DLP_Get_PATH_1_ID");
    const DLP_Get_PATH_2_ID = document.getElementById("DLP_Get_PATH_2_ID");
    const DLP_Get_PRACTICE_1_ID = document.getElementById("DLP_Get_PRACTICE_1_ID");
    const DLP_Get_PRACTICE_2_ID = document.getElementById("DLP_Get_PRACTICE_2_ID");
    const DLP_Get_LISTEN_1_ID = document.getElementById("DLP_Get_LISTEN_1_ID");
    const DLP_Get_LISTEN_2_ID = document.getElementById("DLP_Get_LISTEN_2_ID");
    const DLP_Get_LESSON_1_ID = document.getElementById("DLP_Get_LESSON_1_ID");
    const DLP_Get_LESSON_2_ID = document.getElementById("DLP_Get_LESSON_2_ID");

    function inputCheck2() {
        const ids = {
            "DLP_Get_PATH_1_ID": ["path"],
            "DLP_Get_PATH_2_ID": ["path"],
            "DLP_Get_PRACTICE_1_ID": ["practice"],
            "DLP_Get_PRACTICE_2_ID": ["practice"],
            "DLP_Get_LISTEN_1_ID": ["listen"],
            "DLP_Get_LISTEN_2_ID": ["listen"],
            "DLP_Get_LESSON_1_ID": ["lesson"],
            "DLP_Get_LESSON_2_ID": ["lesson"]
        };

        Object.keys(ids).forEach(id => {
            const element = document.getElementById(id);
            if (!element) return;
            const input = element.querySelector('#DLP_Inset_Input_1_ID');
            const button = element.querySelector('#DLP_Inset_Button_1_ID');
            if (!input || !button) return;
            function updateButtonState() {
                const isEmpty = input.value.length === 0;
                button.style.opacity = isEmpty ? '0.5' : '';
                button.style.pointerEvents = isEmpty ? 'none' : '';
            };
            const category = ids[id][0];
            input.addEventListener("input", function () {
                this.value = this.value.replace(/[^0-9]/g, "");
                if (this.value.length === 1 && this.value[0] === '0') this.value = this.value.slice(1);
                if (this.value.length > 6) this.value = this.value.slice(0, 6);
                updateButtonState();
                //if (!storageSession.legacy[category]) storageSession.legacy[category] = [];
                storageSession.legacy[category].amount = Number(this.value);
                saveStorageSession();
            });
            if (['DLP_Get_LESSON_1_ID', 'DLP_Get_LESSON_2_ID'].includes(id)) {
                const input3 = element.querySelector('#DLP_Inset_Input_3_ID');
                const input4 = element.querySelector('#DLP_Inset_Input_4_ID');

                input3.addEventListener("input", function () {
                    this.value = this.value.replace(/[^0-9]/g, "");
                    if (this.value.length === 1 && this.value[0] === '0') this.value = this.value.slice(1);
                    if (this.value.length > 2) this.value = this.value.slice(0, 2);
                    //if (!storageSession.legacy[category]) storageSession.legacy[category] = [];
                    storageSession.legacy[category].unit = Number(this.value);
                    saveStorageSession();
                });
                input3.addEventListener("blur", function () {
                    if (this.value.trim() === "") {
                        this.value = "1";
                        storageSession.legacy[category].unit = 1;
                        saveStorageSession();
                    }
                });

                input4.addEventListener("input", function () {
                    this.value = this.value.replace(/[^0-9]/g, "");
                    if (this.value.length === 1 && this.value[0] === '0') this.value = this.value.slice(1);
                    if (this.value.length > 2) this.value = this.value.slice(0, 2);
                    //if (!storageSession.legacy[category]) storageSession.legacy[category] = [];
                    storageSession.legacy[category].level = Number(this.value);
                    saveStorageSession();
                });
                input4.addEventListener("blur", function () {
                    if (this.value.trim() === "") {
                        this.value = "1";
                        storageSession.legacy[category].level = 1;
                        saveStorageSession();
                    }
                });
            }
            if (storageSession.legacy[category].amount !== 0) input.value = storageSession.legacy[category].amount; updateButtonState();
        });

        Object.keys(ids).forEach(id => {
            const element = document.getElementById(id);
            if (!element) return;
            const input = element.querySelector('#DLP_Inset_Input_1_ID');
            const button = element.querySelector('#DLP_Inset_Button_1_ID');
            if (!input || !button) return;
            function updateButtonState() {
                const isEmpty = input.value.length === 0;
                button.style.opacity = isEmpty ? '0.5' : '';
                button.style.pointerEvents = isEmpty ? 'none' : '';
            };
            const category = ids[id][0];
            input.addEventListener("input", function () {
                this.value = this.value.replace(/[^0-9]/g, "");
                if (this.value.length === 1 && this.value[0] === '0') this.value = this.value.slice(1);
                if (this.value.length > 6) this.value = this.value.slice(0, 6);
                updateButtonState();
                if (!storageSession.legacy[category]) storageSession.legacy[category] = [];
                storageSession.legacy[category].amount = Number(this.value);
                saveStorageSession();
            });
            if (storageSession.legacy[category].amount !== 0) input.value = storageSession.legacy[category].amount; updateButtonState();
        });

        function updatePinnedItems() {
            const pinnedIds = storageLocal.pins.legacy || [];
            for (const id in ids) {
                if (id.endsWith("1_ID")) {
                    const element = document.getElementById(id);
                    if (element) {
                        if (pinnedIds.includes(id)) {
                            element.style.display = 'flex';
                        } else {
                            element.style.display = 'none';
                        }
                    }
                }
            }
        };
        updatePinnedItems();

        Object.keys(ids).forEach(id => {
            if (id.endsWith("2_ID")) {
                const pinActiveIcon = document.querySelector(`#${id} > .DLP_HStack_8 > #DLP_Inset_Icon_1_ID`);
                const pinInactiveIcon = document.querySelector(`#${id} > .DLP_HStack_8 > #DLP_Inset_Icon_2_ID`);
                const modifiedId = id.replace("2_ID", "1_ID");

                function updatePinViews() {
                    if (storageLocal.pins.legacy.includes(modifiedId)) {
                        pinActiveIcon.style.display = 'block';
                        pinInactiveIcon.style.display = 'none';
                    } else {
                        pinActiveIcon.style.display = 'none';
                        pinInactiveIcon.style.display = 'block';
                    }
                };
                updatePinViews();

                function updatePins(isAdding) {
                    const index = storageLocal.pins.legacy.indexOf(modifiedId);
                    if (isAdding && index === -1) {
                        if (storageLocal.pins.legacy.length > Math.floor(((window.innerHeight) / 200) - 1)) {
                            showNotification("warning", "Pin Limit Reached", "You've pinned too many functions. Please unpin one to continue.", 15);
                        } else {
                            storageLocal.pins.legacy.push(modifiedId);
                        }
                    } else if (!isAdding && index !== -1) {
                        storageLocal.pins.legacy.splice(index, 1);
                    } else {
                        console.log("Something unexpected happened: djr9234.");
                    }
                    updatePinViews();
                    saveStorageLocal();
                    updatePinnedItems();
                };

                pinActiveIcon.addEventListener('click', () => updatePins(false));
                pinInactiveIcon.addEventListener('click', () => updatePins(true));
            }
        });
    }

    inputCheck2();

    function setupButton1Events(baseId, page, type) {
        const button1 = document.querySelector(`#${baseId}_ID`).querySelector('#DLP_Inset_Button_1_ID');
        const input1 = document.querySelector(`#${baseId}_ID`).querySelector('#DLP_Inset_Input_1_ID');

        function clickHandler() {
            if (isGetButtonsBusy) return;
            isGetButtonsBusy = true;

            const buttonElement = document.querySelector(`#${baseId}_ID`).querySelector('#DLP_Inset_Button_1_ID');
            const icon1 = buttonElement.querySelector('#DLP_Inset_Icon_1_ID');
            const icon2 = buttonElement.querySelector('#DLP_Inset_Icon_2_ID');

            if (!storageSession.legacy.status && storageSession.legacy[type].amount > 0) {
                setButtonState(buttonElement, systemText[systemLanguage][107], icon2, icon1, 'rgba(0, 122, 255, 0.10)', '2px solid rgba(0, 122, 255, 0.20)', '#007AFF', 400);
                storageSession.legacy.page = page;
                storageSession.legacy.status = type;
                saveStorageSession();
            } else if (storageSession.legacy.status === type) {
                setButtonState(buttonElement, systemText[systemLanguage][18], icon1, icon2, '#007AFF', '2px solid rgba(0, 0, 0, 0.20)', '#FFF', 400);
                storageSession.legacy.status = false;
                saveStorageSession();
            }
            setTimeout(() => {
                isGetButtonsBusy = false;
            }, 800);
        };

        button1.addEventListener('click', clickHandler);

        input1.onkeyup = function (event) {
            if (event.keyCode === 13) {
                if (isGetButtonsBusy) return;
                isGetButtonsBusy = true;

                const buttonElement = document.querySelector(`#${baseId}_ID`).querySelector('#DLP_Inset_Button_1_ID');
                const icon1 = buttonElement.querySelector('#DLP_Inset_Icon_1_ID');
                const icon2 = buttonElement.querySelector('#DLP_Inset_Icon_2_ID');

                if (!storageSession.legacy.status && storageSession.legacy[type].amount > 0) {
                    setButtonState(buttonElement, systemText[systemLanguage][107], icon2, icon1, 'rgba(0, 122, 255, 0.10)', '2px solid rgba(0, 122, 255, 0.20)', '#007AFF', 400);
                    storageSession.legacy.page = page;
                    storageSession.legacy.status = type;
                    saveStorageSession();
                }
                setTimeout(() => {
                    isGetButtonsBusy = false;
                }, 800);
            }
        };
    }

    function setupButton2Events(baseId, type) {
        const button2 = document.querySelector(`#${baseId}_ID`).querySelector('#DLP_Inset_Button_2_ID');

        function clickHandler(toggle, animate) {
            const icon1 = button2.querySelector('#DLP_Inset_Icon_1_ID');
            const icon2 = button2.querySelector('#DLP_Inset_Icon_2_ID');
            const icon3 = button2.querySelector('#DLP_Inset_Icon_3_ID');
            const input = button2.parentElement.querySelector('#DLP_Inset_Input_1_ID');

            function animateElement(element, visibility, duration = 400) {
                if (visibility) {
                    element.style.display = 'block';
                    element.style.filter = 'blur(4px)';
                    element.style.opacity = '0';
                    element.style.transition = '0.4s';

                    requestAnimationFrame(() => {
                        element.style.filter = 'blur(0px)';
                        element.style.opacity = '1';
                    });

                    setTimeout(() => {
                        element.style.filter = '';
                        element.style.opacity = '';

                        element.style.transition = '';
                    }, duration);
                } else {
                    element.style.display = 'block';
                    element.style.filter = 'blur(0px)';
                    element.style.opacity = '1';
                    element.style.transition = '0.4s';

                    requestAnimationFrame(() => {
                        element.style.filter = 'blur(4px)';
                        element.style.opacity = '0';
                    });

                    setTimeout(() => {
                        element.style.display = 'none';
                        element.style.filter = '';
                        element.style.opacity = '';
                        element.style.transition = '';
                    }, duration);
                }
            }

            if (storageSession.legacy[type].type === 'lesson') {
                let iconToHide;
                let iconToShow = icon1;
                let inputTo;

                if (icon2.style.display !== 'none') {
                    iconToHide = icon2;
                    icon3.style.display = 'none';
                } else if (icon3.style.display !== 'none') {
                    icon2.style.display = 'none';
                    iconToHide = icon3;
                }

                if (input.style.display === 'none') inputTo = 'show';

                iconToShow.style.display = 'none';
                animateElement(iconToHide, false);
                setTimeout(() => animateElement(iconToShow, true), 400);
                if (inputTo === 'show') setTimeout(() => animateElement(input, true), 400);
            } else if (storageSession.legacy[type].type === 'xp') {
                let iconToHide;
                let iconToShow = icon2;
                let inputTo;

                if (icon1.style.display !== 'none') {
                    iconToHide = icon1;
                    icon3.style.display = 'none';
                } else if (icon3.style.display !== 'none') {
                    icon1.style.display = 'none';
                    iconToHide = icon3;
                }

                if (input.style.display === 'none') inputTo = 'show';

                iconToShow.style.display = 'none';
                animateElement(iconToHide, false);
                setTimeout(() => animateElement(iconToShow, true), 400);
                if (inputTo === 'show') setTimeout(() => animateElement(input, true), 400);

            } else if (storageSession.legacy[type].type === 'infinity') {
                let iconToHide;
                let iconToShow = icon3;
                let inputTo;

                if (icon1.style.display !== 'none') {
                    iconToHide = icon1;
                    icon2.style.display = 'none';
                } else if (icon2.style.display !== 'none') {
                    icon1.style.display = 'none';
                    iconToHide = icon2;
                }

                if (input.style.display !== 'none') inputTo = 'hide';

                iconToShow.style.display = 'none';
                animateElement(iconToHide, false);
                setTimeout(() => animateElement(iconToShow, true), 400);
                if (inputTo === 'hide') animateElement(input, false);

            }
        };
        clickHandler();

        button2.addEventListener('click', () => {
            if (isGetButtonsBusy) return;
            isGetButtonsBusy = true;
            if (storageSession.legacy[type].type === 'lesson') {
                storageSession.legacy[type].type = 'xp';
                saveStorageSession();
            } else if (storageSession.legacy[type].type === 'xp') {
                storageSession.legacy[type].type = 'infinity';
                saveStorageSession();
            } else if (storageSession.legacy[type].type === 'infinity') {
                storageSession.legacy[type].type = 'lesson';
                saveStorageSession();
            }
            clickHandler();
            setTimeout(() => {
                isGetButtonsBusy = false;
            }, 800);
        });
    }

    for (const type of ['PATH', 'PRACTICE', 'LISTEN', 'LESSON']) {
        for (let i = 1; i <= 2; i++) {
            const baseId = `DLP_Get_${type}_${i}`;
            setupButton1Events(baseId, i, type.toLowerCase());
            setupButton2Events(baseId, type.toLowerCase());
        }
    }

    if (storageSession.legacy.status === 'path' && storageSession.legacy.path.amount > 0) {
        if (storageSession.legacy.page === 1) {
            setButtonState(DLP_Get_PATH_1_ID.querySelector('#DLP_Inset_Button_1_ID'), systemText[systemLanguage][107], DLP_Get_PATH_1_ID.querySelector('#DLP_Inset_Button_1_ID').querySelector('#DLP_Inset_Icon_2_ID'), DLP_Get_PATH_1_ID.querySelector('#DLP_Inset_Button_1_ID').querySelector('#DLP_Inset_Icon_1_ID'), 'rgba(0, 122, 255, 0.10)', '2px solid rgba(0, 122, 255, 0.20)', '#007AFF', 400);
        } else if (storageSession.legacy.page === 2) {
            setButtonState(DLP_Get_PATH_2_ID.querySelector('#DLP_Inset_Button_1_ID'), systemText[systemLanguage][107], DLP_Get_PATH_2_ID.querySelector('#DLP_Inset_Button_1_ID').querySelector('#DLP_Inset_Icon_2_ID'), DLP_Get_PATH_2_ID.querySelector('#DLP_Inset_Button_1_ID').querySelector('#DLP_Inset_Icon_1_ID'), 'rgba(0, 122, 255, 0.10)', '2px solid rgba(0, 122, 255, 0.20)', '#007AFF', 400);
        }
    } else if (storageSession.legacy.status === 'practice' && storageSession.legacy.practice.amount > 0) {
        if (storageSession.legacy.page === 1) {
            setButtonState(DLP_Get_PRACTICE_1_ID.querySelector('#DLP_Inset_Button_1_ID'), systemText[systemLanguage][107], DLP_Get_PRACTICE_1_ID.querySelector('#DLP_Inset_Button_1_ID').querySelector('#DLP_Inset_Icon_2_ID'), DLP_Get_PRACTICE_1_ID.querySelector('#DLP_Inset_Button_1_ID').querySelector('#DLP_Inset_Icon_1_ID'), 'rgba(0, 122, 255, 0.10)', '2px solid rgba(0, 122, 255, 0.20)', '#007AFF', 400);
        } else if (storageSession.legacy.page === 2) {
            setButtonState(DLP_Get_PRACTICE_2_ID.querySelector('#DLP_Inset_Button_1_ID'), systemText[systemLanguage][107], DLP_Get_PRACTICE_2_ID.querySelector('#DLP_Inset_Button_1_ID').querySelector('#DLP_Inset_Icon_2_ID'), DLP_Get_PRACTICE_2_ID.querySelector('#DLP_Inset_Button_1_ID').querySelector('#DLP_Inset_Icon_1_ID'), 'rgba(0, 122, 255, 0.10)', '2px solid rgba(0, 122, 255, 0.20)', '#007AFF', 400);
        }
    } else if (storageSession.legacy.status === 'listen' && storageSession.legacy.listen.amount > 0) {
        if (storageSession.legacy.page === 1) {
            setButtonState(DLP_Get_LISTEN_1_ID.querySelector('#DLP_Inset_Button_1_ID'), systemText[systemLanguage][107], DLP_Get_LISTEN_1_ID.querySelector('#DLP_Inset_Button_1_ID').querySelector('#DLP_Inset_Icon_2_ID'), DLP_Get_LISTEN_1_ID.querySelector('#DLP_Inset_Button_1_ID').querySelector('#DLP_Inset_Icon_1_ID'), 'rgba(0, 122, 255, 0.10)', '2px solid rgba(0, 122, 255, 0.20)', '#007AFF', 400);
        } else if (storageSession.legacy.page === 2) {
            setButtonState(DLP_Get_LISTEN_2_ID.querySelector('#DLP_Inset_Button_1_ID'), systemText[systemLanguage][107], DLP_Get_LISTEN_2_ID.querySelector('#DLP_Inset_Button_1_ID').querySelector('#DLP_Inset_Icon_2_ID'), DLP_Get_LISTEN_2_ID.querySelector('#DLP_Inset_Button_1_ID').querySelector('#DLP_Inset_Icon_1_ID'), 'rgba(0, 122, 255, 0.10)', '2px solid rgba(0, 122, 255, 0.20)', '#007AFF', 400);
        }
    } else if (storageSession.legacy.status === 'lesson' && storageSession.legacy.lesson.amount > 0) {
        if (storageSession.legacy.page === 1) {
            setButtonState(DLP_Get_LESSON_1_ID.querySelector('#DLP_Inset_Button_1_ID'), systemText[systemLanguage][107], DLP_Get_LESSON_1_ID.querySelector('#DLP_Inset_Button_1_ID').querySelector('#DLP_Inset_Icon_2_ID'), DLP_Get_LESSON_1_ID.querySelector('#DLP_Inset_Button_1_ID').querySelector('#DLP_Inset_Icon_1_ID'), 'rgba(0, 122, 255, 0.10)', '2px solid rgba(0, 122, 255, 0.20)', '#007AFF', 400);
        } else if (storageSession.legacy.page === 2) {
            setButtonState(DLP_Get_LESSON_2_ID.querySelector('#DLP_Inset_Button_1_ID'), systemText[systemLanguage][107], DLP_Get_LESSON_2_ID.querySelector('#DLP_Inset_Button_1_ID').querySelector('#DLP_Inset_Icon_2_ID'), DLP_Get_LESSON_2_ID.querySelector('#DLP_Inset_Button_1_ID').querySelector('#DLP_Inset_Icon_1_ID'), 'rgba(0, 122, 255, 0.10)', '2px solid rgba(0, 122, 255, 0.20)', '#007AFF', 400);
        }
    }

    let pageSwitching = false;
    function process1() {
        if (window.location.href.includes('/lesson') || window.location.href.includes('/practice') || window.location.href.includes('/practice-hub/listening-practice')) return;
        if (storageSession.legacy.status && storageSession.legacy[storageSession.legacy.status].amount > 0) {
            if (pageSwitching) return;
            pageSwitching = true;
            setTimeout(() => {
                checkChest();
            }, 2000);
        } else {
            pageSwitching = false;
        }
    }
    setInterval(process1, 500);
    function process2() {
        if (storageSession.legacy.status && storageSession.legacy[storageSession.legacy.status].amount > 0) {
            if (storageSession.legacy.status === 'path') {
                window.location.href = "https://duolingo.com/lesson";
            } else if (storageSession.legacy.status === 'practice') {
                window.location.href = "https://duolingo.com/practice";
            } else if (storageSession.legacy.status === 'listen') {
                window.location.href = "https://duolingo.com/practice-hub/listening-practice";
            } else if (storageSession.legacy.status === 'lesson') {
                //storageSession.legacy[storageSession.legacy.status].section
                window.location.href = `https://duolingo.com/lesson/unit/${storageSession.legacy[storageSession.legacy.status].unit}/level/${storageSession.legacy[storageSession.legacy.status].level}`;
            }
        } else {
            pageSwitching = false;
        }
    }
    let checkChestCount = 0;
    function checkChest() {
        try {
            if (document.readyState === 'complete') {
                const imageUrl = 'https://d35aaqx5ub95lt.cloudfront.net/images/path/09f977a3e299d1418fde0fd053de0beb.svg';
                const images = document.querySelectorAll('.TI9Is');
                if (!images.length) {
                    setTimeout(function () {
                        process2();
                    }, 2000);
                } else {
                    let imagesProcessed = 0;
                    let chestFound = false;
                    images.forEach(image => {
                        if (image.src === imageUrl) {
                            image.click();
                            chestFound = true;
                            setTimeout(function () {
                                process2();
                            }, 2000);
                        }
                        imagesProcessed++;
                        if (imagesProcessed >= images.length && !chestFound) {
                            process2();
                        }
                    });
                }
            } else {
                setTimeout(function () {
                    checkChestCount++;
                    checkChest();
                }, 100);
            }
        } catch (error) {
            setTimeout(function () {
                process2();
            }, 2000);
        }
    };

    if (storageSession.legacy.page === 1) {
        document.querySelector(`#DLP_Main_Box_Divider_${currentPage}_ID`).style.display = 'none';
        document.querySelector(`#DLP_Main_Box_Divider_3_ID`).style.display = 'block';
        currentPage = 3;
        let button = document.querySelector('#DLP_Switch_Legacy_Button_1_ID');
        setButtonState(button, systemText[systemLanguage][105], button.querySelector('#DLP_Inset_Icon_2_ID'), button.querySelector('#DLP_Inset_Icon_1_ID'), 'linear-gradient(0deg, rgba(0, 122, 255, 0.10) 0%, rgba(0, 122, 255, 0.10) 100%), rgba(var(--color-snow), 0.80)', '2px solid rgba(0, 122, 255, 0.20', '#007AFF', 400);
    } else if (storageSession.legacy.page === 2) {
        document.querySelector(`#DLP_Main_Box_Divider_${currentPage}_ID`).style.display = 'none';
        document.querySelector(`#DLP_Main_Box_Divider_4_ID`).style.display = 'block';
        lastPage = 3;
        currentPage = 4;
        let button = document.querySelector('#DLP_Switch_Legacy_Button_1_ID');
        setButtonState(button, systemText[systemLanguage][105], button.querySelector('#DLP_Inset_Icon_2_ID'), button.querySelector('#DLP_Inset_Icon_1_ID'), 'linear-gradient(0deg, rgba(0, 122, 255, 0.10) 0%, rgba(0, 122, 255, 0.10) 100%), rgba(var(--color-snow), 0.80)', '2px solid rgba(0, 122, 255, 0.20', '#007AFF', 400);
    }







    const DLP_Get_XP_1_ID = document.getElementById("DLP_Get_XP_1_ID");
    const DLP_Get_XP_2_ID = document.getElementById("DLP_Get_XP_2_ID");
    const DLP_Get_GEMS_1_ID = document.getElementById("DLP_Get_GEMS_1_ID");
    const DLP_Get_GEMS_2_ID = document.getElementById("DLP_Get_GEMS_2_ID");
    const DLP_Get_SUPER_1_ID = document.getElementById("DLP_Get_SUPER_1_ID");
    const DLP_Get_SUPER_2_ID = document.getElementById("DLP_Get_SUPER_2_ID");
    const DLP_Get_DOUBLE_XP_BOOST_1_ID = document.getElementById("DLP_Get_DOUBLE_XP_BOOST_1_ID");
    const DLP_Get_DOUBLE_XP_BOOST_2_ID = document.getElementById("DLP_Get_DOUBLE_XP_BOOST_2_ID");
    const DLP_Get_Streak_Freeze_1_ID = document.getElementById("DLP_Get_Streak_Freeze_1_ID");
    const DLP_Get_Streak_Freeze_2_ID = document.getElementById("DLP_Get_Streak_Freeze_2_ID");
    const DLP_Get_Heart_Refill_1_ID = document.getElementById("DLP_Get_Heart_Refill_1_ID");
    const DLP_Get_Heart_Refill_2_ID = document.getElementById("DLP_Get_Heart_Refill_2_ID");
    const DLP_Get_Streak_1_ID = document.getElementById("DLP_Get_Streak_1_ID");
    const DLP_Get_Streak_2_ID = document.getElementById("DLP_Get_Streak_2_ID");

    if (storageLocal.pins.home.includes("DLP_Get_XP_1_ID")) {
        document.querySelector("#DLP_Get_Heart_Refill_2_ID > .DLP_HStack_8 > #DLP_Inset_Icon_1_ID");
    }

    function inputCheck1() {
        const ids = {
            "DLP_Get_XP_1_ID": ["xp"],
            "DLP_Get_XP_2_ID": ["xp"],
            "DLP_Get_GEMS_1_ID": ["gems"],
            "DLP_Get_GEMS_2_ID": ["gems"],
            "DLP_Get_SUPER_1_ID": ["super"],
            "DLP_Get_SUPER_2_ID": ["super"],
            "DLP_Get_DOUBLE_XP_BOOST_1_ID": ["double_xp_boost"],
            "DLP_Get_DOUBLE_XP_BOOST_2_ID": ["double_xp_boost"],
            "DLP_Get_Streak_Freeze_1_ID": ["streak_freeze"],
            "DLP_Get_Streak_Freeze_2_ID": ["streak_freeze"],
            "DLP_Get_Heart_Refill_1_ID": ["heart_refill"],
            "DLP_Get_Heart_Refill_2_ID": ["heart_refill"],
            "DLP_Get_Streak_1_ID": ["streak"],
            "DLP_Get_Streak_2_ID": ["streak"]
        };

        Object.keys(ids).forEach(id => {
            const element = document.getElementById(id);
            if (!element) return;
            const input = element.querySelector('#DLP_Inset_Input_1_ID');
            const button = element.querySelector('#DLP_Inset_Button_1_ID');
            if (!input || !button) return;
            function updateButtonState() {
                const isEmpty = input.value.length === 0;
                button.style.opacity = isEmpty ? '0.5' : '';
                button.style.pointerEvents = isEmpty ? 'none' : '';
                console.log(input.value.length);
            };
            const category = ids[id][0];
            input.addEventListener("input", function () {
                this.value = this.value.replace(/[^0-9]/g, "");
                if (this.value.length === 1 && this.value[0] === '0') this.value = this.value.slice(1);
                if (this.value.length > 9) this.value = this.value.slice(0, 9);
                updateButtonState();
            });
            if (!input.value) updateButtonState();
        });

        function updatePinnedItems() {
            const pinnedIds = storageLocal.pins.home || [];
            for (const id in ids) {
                if (id.endsWith("1_ID")) {
                    const element = document.getElementById(id);
                    if (element) {
                        if (pinnedIds.includes(id)) {
                            element.style.display = 'flex';
                        } else {
                            element.style.display = 'none';
                        }
                    }
                }
            }
        };
        updatePinnedItems();

        Object.keys(ids).forEach(id => {
            if (id.endsWith("2_ID")) {
                const pinActiveIcon = document.querySelector(`#${id} > .DLP_HStack_8 > #DLP_Inset_Icon_1_ID`);
                const pinInactiveIcon = document.querySelector(`#${id} > .DLP_HStack_8 > #DLP_Inset_Icon_2_ID`);
                const modifiedId = id.replace("2_ID", "1_ID");

                function updatePinViews() {
                    if (storageLocal.pins.home.includes(modifiedId)) {
                        pinActiveIcon.style.display = 'block';
                        pinInactiveIcon.style.display = 'none';
                    } else {
                        pinActiveIcon.style.display = 'none';
                        pinInactiveIcon.style.display = 'block';
                    }
                };
                updatePinViews();

                function updatePins(isAdding) {
                    const index = storageLocal.pins.home.indexOf(modifiedId);
                    if (isAdding && index === -1) {
                        if (storageLocal.pins.home.length > Math.floor(((window.innerHeight) / 200) - 1)) {
                            showNotification("warning", "Pin Limit Reached", "You've pinned too many functions. Please unpin one to continue.", 15);
                        } else {
                            storageLocal.pins.home.push(modifiedId);
                        }
                    } else if (!isAdding && index !== -1) {
                        storageLocal.pins.home.splice(index, 1);
                    } else {
                        console.log("Something unexpected happened: djr9234.");
                    }
                    updatePinViews();
                    saveStorageLocal();
                    updatePinnedItems();
                };

                pinActiveIcon.addEventListener('click', () => updatePins(false));
                pinInactiveIcon.addEventListener('click', () => updatePins(true));
            }
        });
    }
    inputCheck1();


    function initializeMagneticHover(element) {
        let mouseDown = false;
        let originalZIndex = null;
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            if (mouseDown) {
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(0.9)`;
            } else {
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.1)`;
            }
            if (!originalZIndex) {
                if (element.style.zIndex) originalZIndex = parseInt(element.style.zIndex);
                else originalZIndex = 0;
            }
            element.style.zIndex = originalZIndex + 1;
        });
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0) scale(1)';
            element.style.zIndex = originalZIndex;
            mouseDown = false;
        });
        element.addEventListener('mousedown', (e) => {
            mouseDown = true;
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            if (mouseDown) {
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(0.9)`;
            } else {
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.1)`;
            }
        });
        element.addEventListener('mouseup', (e) => {
            mouseDown = false;
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            if (mouseDown) {
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(0.9)`;
            } else {
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.1)`;
            }
        });
    }
    document.querySelectorAll('.DLP_Magnetic_Hover_1').forEach(element => {
        initializeMagneticHover(element);
    });


    let DLP_Server_Connection_Button = document.getElementById("DLP_Main_1_Server_Connection_Button_1_ID");
    let DLP_Server_Connection_Button_2 = document.getElementById("DLP_Secondary_1_Server_Connection_Button_1_ID");
    DLP_Server_Connection_Button.querySelector("#DLP_Inset_Icon_1_ID").style.animation = 'DLP_Rotate_360_Animation_1 4s ease-in-out infinite';
    DLP_Server_Connection_Button_2.querySelector("#DLP_Inset_Icon_1_ID").style.animation = 'DLP_Rotate_360_Animation_1 4s ease-in-out infinite';
    function updateConnetionButtonStyles(button, text, iconToShow, iconToHide, buttonColor) {
        let textToChange = button.querySelector("#DLP_Inset_Text_1_ID");
        textToChange.style.animation = '';
        iconToHide.style.animation = '';
        iconToShow.style.animation = '';
        textToChange.offsetWidth;
        iconToHide.offsetWidth;
        iconToShow.offsetWidth;
        requestAnimationFrame(() => {
            textToChange.style.filter = 'blur(4px)';
            textToChange.style.opacity = '0';
            iconToHide.style.filter = 'blur(4px)';
            iconToHide.style.opacity = '0';
            iconToShow.style.filter = 'blur(4px)';
            iconToShow.style.opacity = '0';
            button.style.background = buttonColor;
            button.style.outline = '2px solid rgba(0, 0, 0, 0.20)';
        });
        setTimeout(() => {
            iconToHide.style.display = 'none';
            iconToShow.style.display = 'block';
            requestAnimationFrame(() => {
                textToChange.style.transition = '0s';
                textToChange.textContent = text;
                textToChange.style.color = '#FFF';
                textToChange.offsetWidth;
                textToChange.style.transition = '0.4s';
                textToChange.offsetWidth;
                textToChange.style.filter = '';
                textToChange.style.opacity = '';
                iconToShow.offsetWidth;
                iconToShow.style.filter = '';
                iconToShow.style.opacity = '';
                setTimeout(() => {
                    textToChange.style.animation = 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite';
                    iconToShow.style.animation = 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite';
                }, 400);
            });
        }, 400);
    }
    let serverConnectedBefore = 'no';
    let serverConnectedBeforeNotification;
    let newTermID;
    function connectToServer() {
        let mainInputsDiv1 = document.getElementById('DLP_Main_Inputs_1_Divider_1_ID');
        //fetch(apiURL + '/server', {
        fetch('https://api.duolingopro.net/server', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                version: versionFormal,
                key: storageLocal.random16
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.global || data.versions) {
                    const globalData = data.global;
                    const versionData = data.versions[versionFull];
                    const warnings = versionData.warnings || [];

                    const termsText = Object.entries(globalData.terms)[0][1];
                    newTermID = Object.entries(globalData.terms)[0][0];

                    //console.log('Global Warning:', globalData.warning);
                    //console.log('Notifications:', globalData.notifications);

                    document.querySelector(`#DLP_Terms_Main_Text_1_ID`).innerHTML = termsText;

                    if (versionData.status === 'latest') {
                        if (storageLocal.terms === newTermID) {
                            if (serverConnectedBefore === 'no' || serverConnectedBefore === 'error') {
                                updateReleaseNotes(warnings);
                                mainInputsDiv1.style.opacity = '1';
                                mainInputsDiv1.style.pointerEvents = 'auto';
                                if (serverConnectedBefore === 'no') {
                                    updateConnetionButtonStyles(DLP_Server_Connection_Button, systemText[systemLanguage][108], DLP_Server_Connection_Button.querySelector("#DLP_Inset_Icon_2_ID"), DLP_Server_Connection_Button.querySelector("#DLP_Inset_Icon_1_ID"), '#34C759');
                                    updateConnetionButtonStyles(DLP_Server_Connection_Button_2, systemText[systemLanguage][108], DLP_Server_Connection_Button_2.querySelector("#DLP_Inset_Icon_2_ID"), DLP_Server_Connection_Button_2.querySelector("#DLP_Inset_Icon_1_ID"), '#34C759');
                                } else if (serverConnectedBefore === 'error') {
                                    updateConnetionButtonStyles(DLP_Server_Connection_Button, systemText[systemLanguage][108], DLP_Server_Connection_Button.querySelector("#DLP_Inset_Icon_2_ID"), DLP_Server_Connection_Button.querySelector("#DLP_Inset_Icon_3_ID"), '#34C759');
                                    updateConnetionButtonStyles(DLP_Server_Connection_Button_2, systemText[systemLanguage][108], DLP_Server_Connection_Button_2.querySelector("#DLP_Inset_Icon_2_ID"), DLP_Server_Connection_Button_2.querySelector("#DLP_Inset_Icon_3_ID"), '#34C759');
                                    if (serverConnectedBeforeNotification) {
                                        serverConnectedBeforeNotification.close();
                                        serverConnectedBeforeNotification = false;
                                    }
                                }
                                serverConnectedBefore = 'yes';
                            }
                        } else {
                            if (storageLocal.onboarding) {
                                if (currentPage !== 5 && currentPage !== 6) goToPage(5);
                            } else {
                                if (currentPage !== 10) goToPage(10);
                            }
                        }
                    } else if (document.getElementById('DLP_Main_Warning_1_ID').style.display === 'none') {
                        document.getElementById('DLP_Main_Inputs_1_Divider_1_ID').style.display = 'none';
                        document.getElementById('DLP_Main_Warning_1_ID').style.display = 'block';
                        document.getElementById('DLP_Main_Warning_1_ID').innerHTML = systemText[systemLanguage][203];
                    }

                    //if (storageLocal.languagePackVersion !== versionData.languagePackVersion) {
                    //    fetch(serverURL + "/static/3.0/resources/language_pack.json")
                    //        .then(response => response.json())
                    //        .then(data => {
                    //            if (data[versionFull]) {
                    //                storageLocal.languagePack = data[versionFull];
                    //                console.log(data[versionFull]);
                    //                storageLocal.languagePackVersion = versionData.languagePackVersion;
                    //                saveStorageLocal();
                    //            }
                    //        })
                    //        .catch(error => console.error('Error fetching systemText:', error));
                    //}
                } else {
                    console.error(`Version ${versionNumber} not found in the data`);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                if (serverConnectedBefore === 'yes') {
                    serverConnectedBefore = 'error';
                    mainInputsDiv1.style.opacity = '0.5';
                    mainInputsDiv1.style.pointerEvents = 'none';
                    updateConnetionButtonStyles(DLP_Server_Connection_Button, systemText[systemLanguage][109], DLP_Server_Connection_Button.querySelector("#DLP_Inset_Icon_3_ID"), DLP_Server_Connection_Button.querySelector("#DLP_Inset_Icon_2_ID"), '#FF2D55');
                    updateConnetionButtonStyles(DLP_Server_Connection_Button_2, systemText[systemLanguage][109], DLP_Server_Connection_Button_2.querySelector("#DLP_Inset_Icon_3_ID"), DLP_Server_Connection_Button_2.querySelector("#DLP_Inset_Icon_2_ID"), '#FF2D55');
                    if (error !== 'Outdated Client') serverConnectedBeforeNotification = showNotification("error", systemText[systemLanguage][231], systemText[systemLanguage][232], 30);
                } else if (serverConnectedBefore === 'no') {
                    serverConnectedBefore = 'error';
                    mainInputsDiv1.style.opacity = '0.5';
                    mainInputsDiv1.style.pointerEvents = 'none';
                    updateConnetionButtonStyles(DLP_Server_Connection_Button, systemText[systemLanguage][109], DLP_Server_Connection_Button.querySelector("#DLP_Inset_Icon_3_ID"), DLP_Server_Connection_Button.querySelector("#DLP_Inset_Icon_1_ID"), '#FF2D55');
                    updateConnetionButtonStyles(DLP_Server_Connection_Button_2, systemText[systemLanguage][109], DLP_Server_Connection_Button_2.querySelector("#DLP_Inset_Icon_3_ID"), DLP_Server_Connection_Button_2.querySelector("#DLP_Inset_Icon_1_ID"), '#FF2D55');
                }
            });
    }
    connectToServer();
    setTimeout(() => {
        connectToServer();
    }, 1000);
    setInterval(() => {
        //if (windowBlurState) connectToServer();
        if (document.visibilityState === "visible" || isAutoMode) connectToServer();
    }, 4000);

    function updateReleaseNotes(warnings) {
        const releaseNotesContainer = document.getElementById('DLP_Release_Notes_List_1_ID');
        const controlsContainer = document.getElementById('DLP_Release_Notes_Controls');
        const warningCounterDisplay = controlsContainer.querySelector('#DLP_Inset_Text_1_ID');
        const prevButton = controlsContainer.querySelector('#DLP_Inset_Icon_1_ID');
        const nextButton = controlsContainer.querySelector('#DLP_Inset_Icon_2_ID');

        releaseNotesContainer.innerHTML = '';

        let currentWarningIndex = 0;
        const totalWarnings = warnings.length;

        function updateCounterDisplay(current, total, displayElement) {
            displayElement.textContent = `${current}/${total}`;
        }

        function updateButtonOpacity(current, total, prevButton, nextButton) {
            if (current === 0) {
                prevButton.style.opacity = '0.5';
                prevButton.style.pointerEvents = 'none';
            } else {
                prevButton.style.opacity = '1';
                prevButton.style.pointerEvents = 'auto';
            }

            if (current === total - 1) {
                nextButton.style.opacity = '0.5';
                nextButton.style.pointerEvents = 'none';
            } else {
                nextButton.style.opacity = '1';
                nextButton.style.pointerEvents = 'auto';
            }
        }

        warnings.forEach((warning, index) => {
            if (warning.head && warning.body && warning.icon) {
                const warningHTML = `
                <div id="warning-${index}" style="display: ${index === 0 ? 'flex' : 'none'}; height: 200px; flex-direction: column; justify-content: center; align-items: center; gap: 8px; align-self: stretch; transition: filter 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                        ${warning.icon}
                        <p class="DLP_Text_Style_2">${warning.head}</p>
                        <p class="DLP_Text_Style_1" style="background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${warning.tag}</p>
                    </div>
                    <p class="DLP_Text_Style_1" style="text-align: center; opacity: 0.5;">${warning.body}</p>
                </div>
                `;
                releaseNotesContainer.insertAdjacentHTML('beforeend', warningHTML);
            }
        });

        updateCounterDisplay(currentWarningIndex + 1, totalWarnings, warningCounterDisplay);
        updateButtonOpacity(currentWarningIndex, totalWarnings, prevButton, nextButton);

        prevButton.addEventListener('click', () => {
            if (isBusySwitchingPages) return;
            isBusySwitchingPages = true;
            if (currentWarningIndex > 0) {
                const oldWarning = document.getElementById(`warning-${currentWarningIndex}`);
                const newWarning = document.getElementById(`warning-${currentWarningIndex - 1}`);

                oldWarning.style.filter = 'blur(16px)';
                oldWarning.style.opacity = '0';
                newWarning.style.filter = 'blur(16px)';
                newWarning.style.opacity = '0';

                setTimeout(() => {
                    oldWarning.style.display = 'none';
                    newWarning.style.display = 'flex';
                    newWarning.offsetHeight;
                    newWarning.style.filter = 'blur(0px)';
                    newWarning.style.opacity = '1';
                    currentWarningIndex--;
                    updateCounterDisplay(currentWarningIndex + 1, totalWarnings, warningCounterDisplay);
                    updateButtonOpacity(currentWarningIndex, totalWarnings, prevButton, nextButton);
                    setTimeout(() => {
                        isBusySwitchingPages = false;
                    }, 400);
                }, 400);
            }
        });

        nextButton.addEventListener('click', () => {
            if (isBusySwitchingPages) return;
            isBusySwitchingPages = true;
            if (currentWarningIndex < totalWarnings - 1) {
                const oldWarning = document.getElementById(`warning-${currentWarningIndex}`);
                const newWarning = document.getElementById(`warning-${currentWarningIndex + 1}`);
                oldWarning.style.filter = 'blur(16px)';
                oldWarning.style.opacity = '0';
                newWarning.style.filter = 'blur(16px)';
                newWarning.style.opacity = '0';

                setTimeout(() => {
                    oldWarning.style.display = 'none';
                    newWarning.style.display = 'flex';
                    newWarning.offsetHeight;
                    newWarning.style.filter = 'blur(0px)';
                    newWarning.style.opacity = '1';
                    currentWarningIndex++;
                    updateCounterDisplay(currentWarningIndex + 1, totalWarnings, warningCounterDisplay);
                    updateButtonOpacity(currentWarningIndex, totalWarnings, prevButton, nextButton);
                    setTimeout(() => {
                        isBusySwitchingPages = false;
                    }, 400);
                }, 400);
            }
        });
    }

    let DLP_Feedback_Text_Input_1_ID = document.getElementById("DLP_Feedback_Text_Input_1_ID");
    let DLP_Feedback_Type_Bug_Report_Button_1_ID = document.getElementById("DLP_Feedback_Type_Bug_Report_Button_1_ID");
    let DLP_Feedback_Type_Suggestion_Button_1_ID = document.getElementById("DLP_Feedback_Type_Suggestion_Button_1_ID");
    let DLP_Feedback_Attachment_Upload_Button_1_ID = document.getElementById("DLP_Feedback_Attachment_Upload_Button_1_ID");
    let DLP_Feedback_Attachment_Input_Hidden_1_ID = document.getElementById("DLP_Feedback_Attachment_Input_Hidden_1_ID");
    let DLP_Feedback_Send_Button_1_ID = document.getElementById("DLP_Feedback_Send_Button_1_ID");

    let sendFeedbackStatus = '';
    DLP_Feedback_Send_Button_1_ID.addEventListener('click', () => {
        if (sendFeedbackStatus !== '') return;
        let FeedbackText = DLP_Feedback_Text_Input_1_ID.value;
        sendFeedbackServer(feedbackType, FeedbackText);

        const ogIcon = DLP_Feedback_Send_Button_1_ID.querySelector('#DLP_Inset_Icon_1_ID');
        const loadingIcon = DLP_Feedback_Send_Button_1_ID.querySelector('#DLP_Inset_Icon_2_ID');
        const doneIcon = DLP_Feedback_Send_Button_1_ID.querySelector('#DLP_Inset_Icon_3_ID');
        const failedIcon = DLP_Feedback_Send_Button_1_ID.querySelector('#DLP_Inset_Icon_4_ID');
        setButtonState(DLP_Feedback_Send_Button_1_ID, systemText[systemLanguage][111], loadingIcon, ogIcon, 'rgba(0, 122, 255, 0.10)', '2px solid rgba(0, 122, 255, 0.20)', '#007AFF', 400, () => {
            loadingIcon.style.animation = 'DLP_Rotate_360_Animation_1 4s ease-in-out infinite';
            function f() {
                if (sendFeedbackStatus === 'sent') {
                    setButtonState(DLP_Feedback_Send_Button_1_ID, systemText[systemLanguage][112], doneIcon, loadingIcon, 'rgba(52, 199, 89, 0.10)', '2px solid rgba(52, 199, 89, 0.20)', '#34C759', 400, () => {
                        confetti();
                    });
                } else if (sendFeedbackStatus === 'error') {
                    setButtonState(DLP_Feedback_Send_Button_1_ID, systemText[systemLanguage][115], failedIcon, loadingIcon, 'rgba(255, 45, 85, 0.10)', '2px solid rgba(255, 45, 85, 0.20)', '#FF2D55', 400, () => {
                    });
                } else if (sendFeedbackStatus === 'sending') {
                    setTimeout(() => { f(); }, 800);
                }
            }
            f();
        });
    });

    let feedbackType = 'Suggestion';
    DLP_Feedback_Type_Bug_Report_Button_1_ID.addEventListener('click', () => {
        feedbackType = 'Bug Report';
        DLP_Feedback_Type_Bug_Report_Button_1_ID.classList.add('DLP_Feedback_Type_Button_Style_1_ON');
        DLP_Feedback_Type_Bug_Report_Button_1_ID.classList.remove('DLP_Feedback_Type_Button_Style_1_OFF');
        DLP_Feedback_Type_Suggestion_Button_1_ID.classList.add('DLP_Feedback_Type_Button_Style_2_OFF');
        DLP_Feedback_Type_Suggestion_Button_1_ID.classList.remove('DLP_Feedback_Type_Button_Style_2_ON');
    });
    DLP_Feedback_Type_Suggestion_Button_1_ID.addEventListener('click', () => {
        feedbackType = 'Suggestion';
        DLP_Feedback_Type_Bug_Report_Button_1_ID.classList.add('DLP_Feedback_Type_Button_Style_1_OFF');
        DLP_Feedback_Type_Bug_Report_Button_1_ID.classList.remove('DLP_Feedback_Type_Button_Style_1_ON');
        DLP_Feedback_Type_Suggestion_Button_1_ID.classList.add('DLP_Feedback_Type_Button_Style_2_ON');
        DLP_Feedback_Type_Suggestion_Button_1_ID.classList.remove('DLP_Feedback_Type_Button_Style_2_OFF');
    });
    let currentFileName = '';
    setInterval(() => {
        if (DLP_Feedback_Attachment_Input_Hidden_1_ID.files.length > 0) {
            let fileName = DLP_Feedback_Attachment_Input_Hidden_1_ID.files[0].name;
            if (currentFileName === fileName) return;
            currentFileName = fileName;
            DLP_Feedback_Attachment_Upload_Button_1_ID.querySelector('#DLP_Inset_Text_1_ID').style.filter = 'blur(4px)';
            DLP_Feedback_Attachment_Upload_Button_1_ID.querySelector('#DLP_Inset_Text_1_ID').style.opacity = '0';
            DLP_Feedback_Attachment_Upload_Button_1_ID.querySelector('#DLP_Inset_Icon_1_ID').style.filter = 'blur(4px)';
            DLP_Feedback_Attachment_Upload_Button_1_ID.querySelector('#DLP_Inset_Icon_1_ID').style.opacity = '0';
            DLP_Feedback_Attachment_Upload_Button_1_ID.style.background = '#007AFF';
            DLP_Feedback_Attachment_Upload_Button_1_ID.style.outline = '2px solid rgba(0, 0, 0, 0.20)';
            setTimeout(() => {
                DLP_Feedback_Attachment_Upload_Button_1_ID.querySelector('#DLP_Inset_Icon_1_ID').style.display = 'none';
                DLP_Feedback_Attachment_Upload_Button_1_ID.querySelector('#DLP_Inset_Text_1_ID').textContent = fileName;
                DLP_Feedback_Attachment_Upload_Button_1_ID.querySelector('#DLP_Inset_Text_1_ID').style.color = '#FFF';
                DLP_Feedback_Attachment_Upload_Button_1_ID.querySelector('#DLP_Inset_Text_1_ID').style.filter = '';
                DLP_Feedback_Attachment_Upload_Button_1_ID.querySelector('#DLP_Inset_Text_1_ID').style.opacity = '';
            }, 400);
        }
    }, 1000);
    DLP_Feedback_Attachment_Upload_Button_1_ID.addEventListener('click', () => {
        DLP_Feedback_Attachment_Input_Hidden_1_ID.click();
    });

    DLP_Feedback_Send_Button_1_ID.style.pointerEvents = 'none';
    DLP_Feedback_Send_Button_1_ID.style.opacity = '0.5';
    DLP_Feedback_Text_Input_1_ID.addEventListener("input", function () {
        if (DLP_Feedback_Text_Input_1_ID.value.replace(/\s/g, "").length <= 16) {
            DLP_Feedback_Send_Button_1_ID.style.pointerEvents = 'none';
            DLP_Feedback_Send_Button_1_ID.style.opacity = '0.5';
        } else {
            DLP_Feedback_Send_Button_1_ID.style.pointerEvents = '';
            DLP_Feedback_Send_Button_1_ID.style.opacity = '';
        }
    });
    async function sendFeedbackServer(head, body) {
        try {
            sendFeedbackStatus = 'sending';

            let payload = {
                head: head,
                body: body,
                version: versionFormal
            };

            if (DLP_Feedback_Attachment_Input_Hidden_1_ID.files.length > 0) {
                const file = DLP_Feedback_Attachment_Input_Hidden_1_ID.files[0];
                const base64File = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result);
                    };
                    reader.readAsDataURL(file);
                });
                payload.file = base64File;
            }

            const response = await fetch(apiURL + "/feedback", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie.split(';').find(cookie => cookie.includes('jwt_token')).split('=')[1]}`
                },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();

            if (responseData.status) sendFeedbackStatus = 'sent';
            else sendFeedbackStatus = 'error';

            showNotification(responseData.notification.icon, responseData.notification.head, responseData.notification.body, responseData.notification.duration);
        } catch (error) {
            console.error('Error:', error);
            sendFeedbackStatus = 'error';
            showNotification("error", systemText[systemLanguage][206], systemText[systemLanguage][207], 30);
        }
    }


    function generateTimeMessage1(hours, minutes) {
        let hourPhrase = '';
        let minutePhrase = '';
        let timeMessage = '';

        if (hours > 0) {
            hourPhrase = systemText[systemLanguage][215]
                .replace("{hours}", hours)
                .replace("{hourUnit}", hours > 1 ? systemText[systemLanguage][211] : systemText[systemLanguage][210]);
        }
        if (minutes > 0) {
            minutePhrase = systemText[systemLanguage][216]
                .replace("{minutes}", minutes)
                .replace("{minuteUnit}", minutes > 1 ? systemText[systemLanguage][213] : systemText[systemLanguage][212]);
        }
        if (hours > 0 && minutes > 0) {
            timeMessage = systemText[systemLanguage][217]
                .replace("{hourPhrase}", hourPhrase)
                .replace("{conjunction}", systemText[systemLanguage][214])
                .replace("{minutePhrase}", minutePhrase);
        } else if (hours > 0) timeMessage = hourPhrase;
        else if (minutes > 0) timeMessage = minutePhrase;

        return timeMessage;
    }

    function handleClick(button, id, amount) {
        const ogIcon = button.querySelector('#DLP_Inset_Icon_1_ID');
        const loadingIcon = button.querySelector('#DLP_Inset_Icon_2_ID');
        const doneIcon = button.querySelector('#DLP_Inset_Icon_3_ID');
        const failedIcon = button.querySelector('#DLP_Inset_Icon_4_ID');
        setButtonState(button, systemText[systemLanguage][113], loadingIcon, ogIcon, 'rgba(0, 122, 255, 0.10)', '2px solid rgba(0, 122, 255, 0.20)', '#007AFF', 400, () => {
            loadingIcon.style.animation = 'DLP_Rotate_360_Animation_1 4s ease-in-out infinite';
            let status = 'loading';

            if (id === "streak") {
                (async () => {
                    try {
                        const response = await fetch(apiURL + '/streak', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${document.cookie.split(';').find(cookie => cookie.includes('jwt_token')).split('=')[1]}`
                            },
                            body: JSON.stringify({
                                amount: amount
                            })
                        });

                        if (!response.ok) {
                            throw new Error('Request failed with status ' + response.status);
                        }

                        const reader = response.body.getReader();
                        const decoder = new TextDecoder();
                        let done = false;
                        let buffer = '';

                        while (!done) {
                            const { value, done: doneReading } = await reader.read();
                            done = doneReading;
                            buffer += decoder.decode(value, { stream: true });

                            let openBraces = 0;
                            let start = 0;
                            for (let i = 0; i < buffer.length; i++) {
                                if (buffer[i] === '{') {
                                    openBraces++;
                                } else if (buffer[i] === '}') {
                                    openBraces--;
                                    if (openBraces === 0) {
                                        const jsonStr = buffer.substring(start, i + 1).trim();
                                        try {
                                            const data = JSON.parse(jsonStr);

                                            if (data.status === 'completed') {
                                                status = "done";
                                                done = true;
                                                showNotification(data.notification.icon, data.notification.head, data.notification.body, data.notification.duration);
                                                const input = button.parentElement.querySelector('#DLP_Inset_Input_1_ID');
                                                if (input) {
                                                    input.value = "";
                                                    //setTimeout(() => input.dispatchEvent(new Event("input")), 2400);
                                                }
                                            } else if (data.status == 'failed') {
                                                status = "error";
                                                done = true;
                                                showNotification(data.notification.icon, data.notification.head, data.notification.body, data.notification.duration);
                                                console.log(data);
                                            } else {
                                                console.log(`Percentage: ${data.percentage}%`);
                                                button.querySelector('#DLP_Inset_Text_1_ID').innerHTML = data.percentage + '%';
                                            }

                                            buffer = buffer.substring(i + 1);
                                            i = -1;
                                            start = 0;
                                            openBraces = 0;
                                        } catch (e) {
                                        }
                                    }
                                } else if (openBraces === 0 && buffer[i].trim() !== "") {
                                    start = i;
                                }
                            }
                        }
                    } catch (error) {
                        console.error('Error during request:', error);
                        status = 'error';
                    }
                })();
            } else {
                fetch(apiURL + '/request', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${document.cookie.split(';').find(cookie => cookie.includes('jwt_token')).split('=')[1]}`
                    },
                    body: JSON.stringify({
                        gain_type: id,
                        amount: amount
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === true) {
                        status = 'done';
                        showNotification(data.notification.icon, data.notification.head, data.notification.body, data.notification.duration);
                        const input = button.parentElement.querySelector('#DLP_Inset_Input_1_ID');
                        if (input) {
                            input.value = "";
                            //setTimeout(() => input.dispatchEvent(new Event("input")), 2400);
                        }
                    } else {
                        status = 'rejected';
                        showNotification(data.notification.icon, data.notification.head, data.notification.body, data.notification.duration);
                        const input = button.parentElement.querySelector('#DLP_Inset_Input_1_ID');
                        if (data.max_amount && input) input.value = data.max_amount;
                        else if (input) {
                            input.value = "";
                            //setTimeout(() => input.dispatchEvent(new Event("input")), 2400);
                        }
                    }
                })
                .catch(error => {
                    status = 'error';
                    console.error('Error fetching data:', error);
                    showNotification("error", systemText[systemLanguage][208], systemText[systemLanguage][209] + "0001", 15);
                });
            }
            setTimeout(() => {
                f();
            }, 800);
            function f() {
                if (status === 'done') {
                    setButtonState(button, systemText[systemLanguage][114], doneIcon, loadingIcon, 'rgba(52, 199, 89, 0.10)', '2px solid rgba(52, 199, 89, 0.20)', '#34C759', 400, () => {
                        confetti();
                        setTimeout(() => {
                            setButtonState(button, systemText[systemLanguage][9], ogIcon, doneIcon, '#007AFF', '2px solid rgba(0, 0, 0, 0.20)', '#FFF', 400);
                            setTimeout(() => {
                                isGetButtonsBusy = false;
                            }, 800);
                        }, 800);
                    });
                } else if (status === 'error') {
                    setButtonState(button, systemText[systemLanguage][115], failedIcon, loadingIcon, 'rgba(255, 45, 85, 0.10)', '2px solid rgba(255, 45, 85, 0.20)', '#FF2D55', 400, () => {
                        setTimeout(() => {
                            setButtonState(button, systemText[systemLanguage][9], ogIcon, failedIcon, '#007AFF', '2px solid rgba(0, 0, 0, 0.20)', '#FFF', 400);
                            setTimeout(() => {
                                isGetButtonsBusy = false;
                            }, 800);
                        }, 800);
                    });
                } else if (status === 'rejected') {
                    setButtonState(button, systemText[systemLanguage][9], ogIcon, loadingIcon, '#007AFF', '2px solid rgba(0, 0, 0, 0.20)', '#FFF', 400);
                    setTimeout(() => {
                        isGetButtonsBusy = false;
                    }, 800);
                } else {
                    setTimeout(() => { f(); }, 400);
                }
            }
        });
    }

    const getButtonsList1 = [
        { base: 'DLP_Get_XP', type: 'xp', input: true },
        { base: 'DLP_Get_GEMS', type: 'gems', input: true },
        { base: 'DLP_Get_SUPER', type: 'super' },
        { base: 'DLP_Get_DOUBLE_XP_BOOST', type: 'double_xp_boost' },
        { base: 'DLP_Get_Streak_Freeze', type: 'streak_freeze', input: true },
        { base: 'DLP_Get_Heart_Refill', type: 'heart_refill' },
        { base: 'DLP_Get_Streak', type: 'streak', input: true },
    ];
    function setupGetButtons(base, type, hasInput) {
        [1, 2].forEach(n => {
            const parent = document.getElementById(`${base}_${n}_ID`);
            if (!parent) return;

            const button = parent.querySelector('#DLP_Inset_Button_1_ID');
            const handler = () => {
                if (isGetButtonsBusy) return;
                isGetButtonsBusy = true;
                handleClick(button, type, hasInput ? Number(parent.querySelector('#DLP_Inset_Input_1_ID').value) : 1);
            };

            button.addEventListener('click', handler);

            if (hasInput) {
                const input = parent.querySelector('#DLP_Inset_Input_1_ID');
                input.onkeyup = e => e.keyCode === 13 && handler();
            }
        });
    };
    getButtonsList1.forEach(({ base, type, input }) => setupGetButtons(base, type, input));


    let DLP_Settings_Save_Button_1_ID = document.getElementById("DLP_Settings_Save_Button_1_ID");
    DLP_Settings_Save_Button_1_ID.addEventListener('click', () => {
        if (isBusySwitchingPages) return;
        isBusySwitchingPages = true;
        storageLocal.settings.autoUpdate = DLP_Settings_Auto_Update;
        storageLocal.settings.showAutoServerButton = DLP_Settings_Show_AutoServer_Button;
        storageLocal.settings.showSolveButtons = DLP_Settings_Show_Solve_Buttons;
        storageLocal.settings.solveSpeed = Number(settingsLegacySolveSpeedInputSanitizeValue(DLP_Settings_Legacy_Solve_Speed_1_ID.querySelector('#DLP_Inset_Input_1_ID').value, true));
        saveStorageLocal();
        setButtonState(DLP_Settings_Save_Button_1_ID, systemText[systemLanguage][116], null, DLP_Settings_Save_Button_1_ID.querySelector('#DLP_Inset_Icon_1_ID'), 'rgba(52, 199, 89, 0.10)', '2px solid rgba(52, 199, 89, 0.20)', '#34C759', 400, () => {
            //confetti();
            setTimeout(() => {
                //goToPage(-1);
                location.reload();
            }, 1600);
            //setTimeout(() => {
            //    setButtonState(DLP_Settings_Save_Button_1_ID, systemText[systemLanguage][37], DLP_Settings_Save_Button_1_ID.querySelector('#DLP_Inset_Icon_1_ID'), DLP_Settings_Save_Button_1_ID.querySelector('#DLP_Inset_Icon_3_ID'), '#007AFF', '2px solid rgba(0, 0, 0, 0.20)', '#FFF', 400);
            //    isBusySwitchingPages = false;
            //}, 2400);
        });
    });

    let DLP_Settings_Auto_Update = storageLocal.settings.autoUpdate;
    let DLP_Settings_Show_AutoServer_Button = storageLocal.settings.showAutoServerButton;
    let DLP_Settings_Show_Solve_Buttons = storageLocal.settings.showSolveButtons;
    let DLP_Settings_Legacy_Solve_Speed = storageLocal.settings.solveSpeed;
    let DLP_Settings_Toggle_Busy = false;
    let DLP_Settings_Show_Solve_Buttons_1_ID = document.getElementById("DLP_Settings_Show_Solve_Buttons_1_ID");
    let DLP_Settings_Show_AutoServer_Button_1_ID = document.getElementById("DLP_Settings_Show_AutoServer_Button_1_ID");
    let DLP_Settings_Legacy_Solve_Speed_1_ID = document.getElementById("DLP_Settings_Legacy_Solve_Speed_1_ID");
    let DLP_Settings_Auto_Update_Toggle_1_ID = document.getElementById("DLP_Settings_Auto_Update_Toggle_1_ID");
    handleToggleClick(DLP_Settings_Show_Solve_Buttons_1_ID.querySelector('#DLP_Inset_Toggle_1_ID'), DLP_Settings_Show_Solve_Buttons);
    if (alpha) handleToggleClick(DLP_Settings_Show_AutoServer_Button_1_ID.querySelector('#DLP_Inset_Toggle_1_ID'), DLP_Settings_Show_AutoServer_Button);
    else DLP_Settings_Show_AutoServer_Button_1_ID.remove();
    handleToggleClick(DLP_Settings_Auto_Update_Toggle_1_ID.querySelector('#DLP_Inset_Toggle_1_ID'), DLP_Settings_Auto_Update);
    DLP_Settings_Legacy_Solve_Speed_1_ID.querySelector('#DLP_Inset_Input_1_ID').value = DLP_Settings_Legacy_Solve_Speed;

    DLP_Settings_Legacy_Solve_Speed_1_ID.querySelector('#DLP_Inset_Input_1_ID').addEventListener("input", function () {
        this.value = settingsLegacySolveSpeedInputSanitizeValue(this.value, false);
    });
    DLP_Settings_Legacy_Solve_Speed_1_ID.querySelector('#DLP_Inset_Input_1_ID').addEventListener("blur", function () {
        this.value = settingsLegacySolveSpeedInputSanitizeValue(this.value, true);
        DLP_Settings_Legacy_Solve_Speed = Number(this.value);
    });

    function settingsLegacySolveSpeedInputSanitizeValue(value, completeSanitization) {
        value = value.replace(/[^0-9.,]/g, '');
        let match = value.match(/[.,]/g);
        if (match && match.length > 1) {
            value = value.slice(0, value.lastIndexOf(match[match.length - 1]));
        }
        let decimalIndex = value.indexOf('.');
        if (decimalIndex !== -1) {
            value = value.slice(0, decimalIndex + 3);
        }
        let digitCount = value.replace(/[^0-9]/g, '').length;
        if (digitCount > 3) {
            value = value.replace(/(\d{3})\d+/, '$1');
        }
        if (/^0\d/.test(value) && !value.startsWith("0.")) {
            value = value.replace(/^0+/, '0');
        }

        if (!completeSanitization) return value;

        value = value.replace(',', '.');
        value = parseFloat(value);
        if (!isNaN(value)) {
            if (value < 0.6) value = 0.6;
        } else {
            value = 0.8;
        }
        return value;
    }


    function handleToggleClick(button, state) {
        let iconToHide;
        let iconToShow;
        if (state) {
            iconToHide = button.querySelector("#DLP_Inset_Icon_2_ID");
            iconToShow = button.querySelector("#DLP_Inset_Icon_1_ID");
        } else {
            iconToHide = button.querySelector("#DLP_Inset_Icon_1_ID");
            iconToShow = button.querySelector("#DLP_Inset_Icon_2_ID");
        }
        if (state) {
            button.classList.add('DLP_Toggle_Style_1_ON');
            button.classList.remove('DLP_Toggle_Style_1_OFF');
        } else {
            button.classList.add('DLP_Toggle_Style_1_OFF');
            button.classList.remove('DLP_Toggle_Style_1_ON');
        }
        iconToHide.style.transition = '0.4s';
        iconToShow.style.transition = '0.4s';
        if (iconToHide.style.display === 'block') {
            iconToHide.style.display = 'block';
            iconToShow.style.display = 'none';
            requestAnimationFrame(() => {
                iconToHide.style.filter = 'blur(4px)';
                iconToHide.style.opacity = '0';
            });
        }
        setTimeout(() => {
            iconToHide.style.display = 'none';
            iconToShow.style.display = 'block';

            iconToShow.offsetWidth;

            iconToShow.style.filter = 'blur(4px)';
            iconToShow.style.opacity = '0';

            setTimeout(() => { // idk
                requestAnimationFrame(() => {
                    iconToShow.offsetWidth;
                    iconToShow.style.filter = '';
                    iconToShow.style.opacity = '1';
                });
            }, 20); // idk
        }, (iconToHide.style.display === 'block') ? 400 : 0);
    }
    DLP_Settings_Auto_Update_Toggle_1_ID.querySelector('#DLP_Inset_Toggle_1_ID').addEventListener('click', () => {
        if (DLP_Settings_Toggle_Busy) return;
        if (!greasyfork) {
            DLP_Settings_Auto_Update = !DLP_Settings_Auto_Update;
            DLP_Settings_Toggle_Busy = true;
            handleToggleClick(DLP_Settings_Auto_Update_Toggle_1_ID.querySelector('#DLP_Inset_Toggle_1_ID'), DLP_Settings_Auto_Update);
            setTimeout(() => {
                DLP_Settings_Toggle_Busy = false;
            }, 800);
        }
    });
    DLP_Settings_Show_Solve_Buttons_1_ID.querySelector('#DLP_Inset_Toggle_1_ID').addEventListener('click', () => {
        if (DLP_Settings_Toggle_Busy) return;
        DLP_Settings_Show_Solve_Buttons = !DLP_Settings_Show_Solve_Buttons;
        DLP_Settings_Toggle_Busy = true;
        handleToggleClick(DLP_Settings_Show_Solve_Buttons_1_ID.querySelector('#DLP_Inset_Toggle_1_ID'), DLP_Settings_Show_Solve_Buttons);
        setTimeout(() => {
            DLP_Settings_Toggle_Busy = false;
        }, 800);
    });
    DLP_Settings_Show_AutoServer_Button_1_ID.querySelector('#DLP_Inset_Toggle_1_ID').addEventListener('click', () => {
        if (DLP_Settings_Toggle_Busy) return;
        DLP_Settings_Show_AutoServer_Button = !DLP_Settings_Show_AutoServer_Button;
        DLP_Settings_Toggle_Busy = true;
        handleToggleClick(DLP_Settings_Show_AutoServer_Button_1_ID.querySelector('#DLP_Inset_Toggle_1_ID'), DLP_Settings_Show_AutoServer_Button);
        setTimeout(() => {
            DLP_Settings_Toggle_Busy = false;
        }, 800);
    });


    function confetti() {
        let canvas = document.getElementById("DLP_Confetti_Canvas");
        if (!canvas.confettiInitialized) {
            let ctx = canvas.getContext("2d");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            let cx = ctx.canvas.width / 2;
            let cy = ctx.canvas.height / 2;

            canvas.ctx = ctx;
            canvas.cx = cx;
            canvas.cy = cy;
            canvas.confetti = [];
            canvas.animationId = null;
            canvas.confettiInitialized = true;

            let resizeCanvas = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                canvas.cx = canvas.ctx.canvas.width / 2;
                canvas.cy = canvas.ctx.canvas.height / 2;
            };

            const resizeObserver = new ResizeObserver(() => {
                resizeCanvas();
            });
            resizeObserver.observe(canvas);

            let render = () => {
                canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.confetti.forEach((confetto, index) => {
                    let width = confetto.dimensions.x * confetto.scale.x;
                    let height = confetto.dimensions.y * confetto.scale.y;
                    canvas.ctx.translate(confetto.position.x, confetto.position.y);
                    canvas.ctx.rotate(confetto.rotation);

                    confetto.velocity.x -= confetto.velocity.x * drag;
                    confetto.velocity.y = Math.min(
                        confetto.velocity.y + gravity,
                        terminalVelocity,
                    );
                    confetto.velocity.x +=
                        Math.random() > 0.5 ? Math.random() : -Math.random();

                    confetto.position.x += confetto.velocity.x;
                    confetto.position.y += confetto.velocity.y;

                    if (confetto.position.y >= canvas.height) canvas.confetti.splice(index, 1);

                    if (confetto.position.x > canvas.width) confetto.position.x = 0;
                    if (confetto.position.x < 0) confetto.position.x = canvas.width;

                    canvas.ctx.fillStyle = confetto.color.front;
                    canvas.ctx.fillRect(-width / 2, -height / 2, width, height);
                    canvas.ctx.setTransform(1, 0, 0, 1, 0, 0);
                });
                canvas.animationId = window.requestAnimationFrame(render);
            };
            render();
        }

        const gravity = 0.5;
        const terminalVelocity = 10;
        const drag = 0.01;
        const colors = [
            { front: "#FF2D55", back: "#FF2D55" },
            { front: "#FF9500", back: "#FF9500" },
            { front: "#FFCC00", back: "#FFCC00" },
            { front: "#34C759", back: "#34C759" },
            { front: "#5AC8FA", back: "#5AC8FA" },
            { front: "#007AFF", back: "#007AFF" },
            { front: "#5856D6", back: "#5856D6" },
            { front: "#AF52DE", back: "#AF52DE" },
        ];

        const confettiSizeRange = {
            min: 5,
            max: 15
        };

        let randomRange = (min, max) => Math.random() * (max - min) + min;

        const confettiCount = 500;
        for (let i = 0; i < confettiCount; i++) {
            canvas.confetti.push({
                color: colors[Math.floor(randomRange(0, colors.length))],
                dimensions: {
                    x: randomRange(confettiSizeRange.min, confettiSizeRange.max),
                    y: randomRange(confettiSizeRange.min, confettiSizeRange.max),
                },
                position: {
                    x: randomRange(0, canvas.width),
                    y: canvas.height - 1,
                },
                rotation: randomRange(0, 2 * Math.PI),
                scale: {
                    x: 1,
                    y: 1,
                },
                velocity: {
                    x: randomRange(-25, 25),
                    y: randomRange(0, -50),
                },
            });
        }
    }


    async function generateEarnKey() {
        const endpoint = `https://api.duolingopro.net/earn/connect/generate`;

        try {
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie.split(';').find(cookie => cookie.includes('jwt_token')).split('=')[1]}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.earn_key) {
                    console.log('Earn Key:', data.earn_key);
                    return data.earn_key;
                } else {
                    throw new Error('Earn key not found in the response.');
                }
            } else if (response.status === 401) {
                throw new Error('Unauthorized: Invalid or missing authentication token.');
            } else if (response.status === 429) {
                throw new Error('Rate limit exceeded: Please try again later.');
            } else if (response.status === 500) {
                const errorData = await response.json();
                throw new Error(`Server Error: ${errorData.detail || 'An unexpected error occurred.'}`);
            } else {
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.detail || 'An unexpected error occurred.'}`);
            }
        } catch (error) {
            console.error('Error generating earn key:', error.message);
            throw error;
        }
    }

    let earnButtonAssignedLink = false;
    document.querySelectorAll("#DLP_Main_Earn_Button_1_ID, #DLP_Secondary_Earn_Button_1_ID").forEach(button => {
        button.addEventListener('click', () => {
            button.style.opacity = '0.5';
            button.style.pointerEvents = 'none';

            generateEarnKey()
                .then(earnKey => {
                console.log('Successfully retrieved earn key:', earnKey);
                button.setAttribute("onclick", `window.open('${serverURL}/earn/connect/link/${earnKey}', '_blank');`);
                if (!earnButtonAssignedLink) {
                    earnButtonAssignedLink = true;
                    window.open(serverURL + "/earn/connect/link/" + earnKey, "_blank");
                }
            })
                .catch(error => {
                console.error('Failed to retrieve earn key:', error.message);
            })
                .finally(() => {
                button.style.opacity = '';
                button.style.pointerEvents = '';
            });
        });
    });










    const originalPlay = HTMLAudioElement.prototype.play;
    function muteTab(value) {
        HTMLAudioElement.prototype.play = function () {
            if (value) {
                this.muted = true;
            } else {
                this.muted = false;
            }
            return originalPlay.apply(this, arguments);
        };
    }

    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            if (event.shiftKey) {
                solving();
            } else {
                solve();
            }
        }
    });

    function updateSolveButtonText(text) {
        document.getElementById("solveAllButton").innerText = text;
    }
    function solving(value) {
        if (value === "start") isAutoMode = true;
        else if (value === "stop") isAutoMode = false;
        else isAutoMode = !isAutoMode;
        updateSolveButtonText(isAutoMode ? systemText[systemLanguage][102] : systemText[systemLanguage][101]);
        solvingIntervalId = isAutoMode ? setInterval(solve, storageLocal.settings.solveSpeed * 1000) : clearInterval(solvingIntervalId);
    }
    let hcwNIIOdaQqCZRDL = false;
    function solve() {
        const practiceAgain = document.querySelector('[data-test="player-practice-again"]');
        const sessionCompleteSlide = document.querySelector('[data-test="session-complete-slide"]');

        const selectorsForSkip = [
            '[data-test="practice-hub-ad-no-thanks-button"]',
            '.vpDIE',
            '[data-test="plus-no-thanks"]',
            '._1N-oo._36Vd3._16r-S._1ZBYz._23KDq._1S2uf.HakPM',
            '._8AMBh._2vfJy._3Qy5R._28UWu._3h0lA._1S2uf._1E9sc',
            '._1Qh5D._36g4N._2YF0P._28UWu._3h0lA._1S2uf._1E9sc',
            '[data-test="story-start"]',
            '._3bBpU._1x5JY._1M9iF._36g4N._2YF0P.T7I0c._2EnxW.MYehf',
            '._2V6ug._1ursp._7jW2t._28UWu._3h0lA._1S2uf._1E9sc' // No Thanks Legendary Button
        ];
        selectorsForSkip.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) element.click();
        });


        const status = storageSession.legacy.status;
        const type = status ? storageSession.legacy[status]?.type : null;
        let amount;

        if (sessionCompleteSlide !== null && isAutoMode && storageSession.legacy.status) {
            if (!hcwNIIOdaQqCZRDL) {
                hcwNIIOdaQqCZRDL = true;
                if (type === 'lesson') {
                    storageSession.legacy[status].amount -= 1;
                    saveStorageSession();
                    amount = status ? storageSession.legacy[status]?.amount : null;
                    if (amount > 0) {
                        if (practiceAgain !== null) {
                            practiceAgain.click();
                            return;
                        } else {
                            location.reload();
                        }
                    } else {
                        storageSession.legacy[status].amount = 0;
                        storageSession.legacy.status = false;
                        saveStorageSession();
                        window.location.href = "https://duolingo.com";
                        return;
                    }
                } else if (type === 'xp') {
                    storageSession.legacy[status].amount -= findSubReact(document.getElementsByClassName("_1XNQX")[0]).xpGoalSessionProgress.totalXpThisSession;
                    saveStorageSession();
                    amount = status ? storageSession.legacy[status]?.amount : null;
                    if (amount > 0) {
                        if (practiceAgain !== null) {
                            practiceAgain.click();
                            return;
                        } else {
                            location.reload();
                        }
                    } else {
                        storageSession.legacy[status].amount = 0;
                        storageSession.legacy.status = false;
                        saveStorageSession();
                        window.location.href = "https://duolingo.com";
                        return;
                    }
                } else if (type === 'infinity') {
                    if (practiceAgain !== null) {
                        practiceAgain.click();
                        return;
                    } else {
                        location.reload();
                    }
                }
            }
        }

        try {
            window.sol = findReact(document.getElementsByClassName(findReactMainElementClass)[0]).props.currentChallenge;
        } catch (error) {
            console.log(error);
            //let next = document.querySelector('[data-test="player-next"]');
            //if (next) {
            //    next.click();
            //}
            //return;
        }
        //if (!window.sol) {
        //    return;
        //}

        let challengeType;
        if (window.sol) {
            challengeType = determineChallengeType();
        } else {
            challengeType = 'error';
            nextClickFunc();
        }
        if (challengeType === 'error') {
            nextClickFunc();
        } else if (challengeType) {
            if (debug) document.getElementById("solveAllButton").innerText = challengeType;
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
        setTimeout(function () {
            try {
                let nextButtonNormal = document.querySelector('[data-test="player-next"]');
                let storiesContinueButton = document.querySelector('[data-test="stories-player-continue"]');
                let storiesDoneButton = document.querySelector('[data-test="stories-player-done"]');

                let nextButtonAriaValueNormal = nextButtonNormal ? nextButtonNormal.getAttribute('aria-disabled') : null;
                let nextButtonAriaValueStoriesContinue = storiesContinueButton ? storiesContinueButton.disabled : null;

                let nextButton = nextButtonNormal || storiesContinueButton || storiesDoneButton;
                let nextButtonAriaValue = nextButtonAriaValueNormal || nextButtonAriaValueStoriesContinue || storiesDoneButton;

                if (nextButton) {
                    if (nextButtonAriaValue === 'true' || nextButtonAriaValue === true) {
                        if (document.querySelectorAll('._35QY2._3jIlr.f2zGP._18W4a.xtPuL').length > 0) {
                        } else {
                            if (nextButtonAriaValue === 'true') {
                                console.log('The next button is disabled.');
                            }
                        }
                        if (zXIArDomWMPkmTVf >= 3 && !SciiOTPybxFAimRW && nextButtonAriaValue === 'true') {
                            SciiOTPybxFAimRW = true;
                            LhEqEHHc();
                            //notificationCall("Can't Recognize Question Type", "Duolingo Pro ran into an error while solving this question, an automatic question error report is being made.");
                        }
                    } else if (nextButtonAriaValue === 'false' || nextButtonAriaValue === false) {
                        nextButton.click();
                        //mainSolveStatistics('question', 1);
                        zXIArDomWMPkmTVf = 0;
                        if (document.querySelector('[data-test="player-next"]').classList.contains('_2oGJR')) {
                            if (isAutoMode) {
                                setTimeout(function () {
                                    nextButton.click();
                                }, 100);
                            }
                        } else if (document.querySelector('[data-test="player-next"]').classList.contains('_3S8jJ')) {
                            //if (solveSpeed < 0.6) {
                            //    solveSpeed = 0.6;
                            //    localStorage.setItem('duopro.autoSolveDelay', solveSpeed);
                            //}
                        } else {
                            console.log('The element does not have the class ._9C_ii or .NAidc or the element is not found.');
                        }
                    } else {
                        console.log('The aria-disabled attribute is not set or has an unexpected value.');
                        //notificationCall("what", "Idk");
                        nextButton.click();
                    }
                } else {
                    console.log('Element with data-test="player-next" or data-test="stories-player-continue" not found.');
                }
            } catch (error) { }
        }, 100);
    }
    let fPuxeFVNBsHJUBgP = false;
    function LhEqEHHc() {
        if (!fPuxeFVNBsHJUBgP) {
            fPuxeFVNBsHJUBgP = true;
            const randomImageValue = Math.random().toString(36).substring(2, 15);
            //questionErrorLogs(findReact(document.getElementsByClassName(findReactMainElementClass)[0]).props.currentChallenge, document.body.innerHTML, randomImageValue);
            //const challengeAssistElement = document.querySelector('[data-test="challenge challenge-assist"]');
            const challengeAssistElement = document.querySelector('._3x0ok');
            if (challengeAssistElement) {
            } else {
                console.log('Element not found');
            }
        }
    }
    function determineChallengeType() {
        try {
            console.log(window.sol);
            if (document.getElementsByClassName("FmlUF").length > 0) {
                // Story
                if (window.sol.type === "arrange") {
                    return "Story Arrange"
                } else if (window.sol.type === "multiple-choice" || window.sol.type === "select-phrases") {
                    return "Story Multiple Choice"
                } else if (window.sol.type === "point-to-phrase") {
                    return "Story Point to Phrase"
                } else if (window.sol.type === "match") {
                    return "Story Pairs"
                }
            } else {
                // Lesson
                if (document.querySelectorAll('[data-test*="challenge-speak"]').length > 0) {
                    hcwNIIOdaQqCZRDL = false;
                    return 'Challenge Speak';
                } else if (document.querySelectorAll('[data-test*="challenge-name"]').length > 0 && document.querySelectorAll('[data-test="challenge-choice"]').length > 0) {
                    hcwNIIOdaQqCZRDL = false;
                    return 'Challenge Name';
                } else if (window.sol.type === 'listenMatch') {
                    hcwNIIOdaQqCZRDL = false;
                    return 'Listen Match';
                } else if (document.querySelectorAll('[data-test="challenge challenge-listenSpeak"]').length > 0) {
                    hcwNIIOdaQqCZRDL = false;
                    return 'Listen Speak';
                } else if (document.querySelectorAll('[data-test="challenge-choice"]').length > 0) {
                    hcwNIIOdaQqCZRDL = false;
                    if (document.querySelectorAll('[data-test="challenge-text-input"]').length > 0) {
                        return 'Challenge Choice with Text Input';
                    } else {
                        return 'Challenge Choice'
                    }
                } else if (document.querySelectorAll('[data-test$="challenge-tap-token"]').length > 0) {
                    hcwNIIOdaQqCZRDL = false;
                    if (window.sol.pairs !== undefined) {
                        return 'Pairs';
                    } else if (window.sol.correctTokens !== undefined) {
                        return 'Tokens Run';
                    } else if (window.sol.correctIndices !== undefined) {
                        return 'Indices Run';
                    }
                } else if (document.querySelectorAll('[data-test="challenge-tap-token-text"]').length > 0) {
                    hcwNIIOdaQqCZRDL = false;
                    return 'Fill in the Gap';
                } else if (document.querySelectorAll('[data-test="challenge-text-input"]').length > 0) {
                    hcwNIIOdaQqCZRDL = false;
                    return 'Challenge Text Input';
                } else if (document.querySelectorAll('[data-test*="challenge-partialReverseTranslate"]').length > 0) {
                    hcwNIIOdaQqCZRDL = false;
                    return 'Partial Reverse';
                } else if (document.querySelectorAll('textarea[data-test="challenge-translate-input"]').length > 0) {
                    hcwNIIOdaQqCZRDL = false;
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
            }
        } catch (error) {
            console.log(error);
            return 'error';
        }
    }

    function handleChallenge(challengeType) {
        // Implement logic to handle different challenge types
        // This function should encapsulate the logic for each challenge type
        if (challengeType === 'Challenge Speak' || challengeType === 'Listen Match' || challengeType === 'Listen Speak') {
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
            } else if (challengeType === 'Challenge Choice') {
                document.querySelectorAll("[data-test='challenge-choice']")[window.sol.correctIndex].click();
            }

        } else if (challengeType === 'Pairs') {
            let nl = document.querySelectorAll('[data-test*="challenge-tap-token"]:not(span)');
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

        } else if (challengeType === 'Story Pairs') {
            const nl = document.querySelectorAll('[data-test*="challenge-tap-token"]:not(span)');
            const textElements = document.querySelectorAll('[data-test="challenge-tap-token-text"]');

            const textToElementMap = new Map();
            for (let i = 0; i < nl.length; i++) {
                const text = textElements[i].innerText.toLowerCase().trim();
                textToElementMap.set(text, nl[i]);
            }

            for (const key in window.sol.dictionary) {
                if (window.sol.dictionary.hasOwnProperty(key)) {
                    const value = window.sol.dictionary[key];
                    const keyPart = key.split(":")[1].toLowerCase().trim();
                    const normalizedValue = value.toLowerCase().trim();

                    const element1 = textToElementMap.get(keyPart);
                    const element2 = textToElementMap.get(normalizedValue);

                    if (element1 && !element1.disabled) element1.click();
                    if (element2 && !element2.disabled) element2.click();
                }
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
        } else if (challengeType === 'Challenge Name') {

            let articles = findReact(document.getElementsByClassName(findReactMainElementClass)[0]).props.currentChallenge.articles;
            let correctSolutions = findReact(document.getElementsByClassName(findReactMainElementClass)[0]).props.currentChallenge.correctSolutions[0];

            let matchingArticle = articles.find(article => correctSolutions.startsWith(article));
            let matchingIndex = matchingArticle !== undefined ? articles.indexOf(matchingArticle) : null;
            let remainingValue = correctSolutions.substring(matchingArticle.length);

            let selectedElement = document.querySelector(`[data-test="challenge-choice"]:nth-child(${matchingIndex + 1})`);
            if (selectedElement) {
                selectedElement.click();
            }

            let elm = document.querySelector('[data-test="challenge-text-input"]');
            let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(elm, remainingValue);
            let inputEvent = new Event('input', {
                bubbles: true
            });

            elm.dispatchEvent(inputEvent);
        } else if (challengeType === 'Session Complete') {
        } else if (challengeType === 'Story Arrange') {
            let choices = document.querySelectorAll('[data-test*="challenge-tap-token"]:not(span)');
            for (let i = 0; i < window.sol.phraseOrder.length; i++) {
                choices[window.sol.phraseOrder[i]].click();
            }
        } else if (challengeType === 'Story Multiple Choice') {
            let choices = document.querySelectorAll('[data-test="stories-choice"]');
            choices[window.sol.correctAnswerIndex].click();
        } else if (challengeType === 'Story Point to Phrase') {
            let choices = document.querySelectorAll('[data-test="challenge-tap-token-text"]');
            var correctIndex = -1;
            for (let i = 0; i < window.sol.parts.length; i++) {
                if (window.sol.parts[i].selectable === true) {
                    correctIndex += 1;
                    if (window.sol.correctAnswerIndex === i) {
                        choices[correctIndex].parentElement.click();
                    }
                }
            }
        }
    }

    function correctTokensRun() {
        const correct_tokens = window.sol.correctTokens;
        const clicked_tokens = [];
    
        correct_tokens.forEach(correct_token => {
            const selector = `[data-test="${correct_token}-challenge-tap-token"]`;
            const elements = document.querySelectorAll(selector);
    
            if (elements.length > 0) {
                elements.forEach(element => {
                    console.log(element);
                    element.click();
                    clicked_tokens.push(element);
                });
            } else {
                console.warn(`couldnt find data-test="${correct_token}-challenge-tap-token"`);
            }
        });
    }


    function correctIndicesRun() {
        if (window.sol.correctIndices) {
            window.sol.correctIndices?.forEach(index => {
                document.querySelectorAll('div[data-test="word-bank"] [data-test*="challenge-tap-token"]:not(span)')[index].click();
            });
        }
    }

    function findSubReact(dom, traverseUp = reactTraverseUp) {
        const key = Object.keys(dom).find(key => key.startsWith("__reactProps"));
        return dom?.[key]?.children?.props?.slide;
    }

    function findReact(dom, traverseUp = reactTraverseUp) {
        const key = Object.keys(dom).find(key => {
            return key.startsWith("__reactFiber$") // react 17+
                || key.startsWith("__reactInternalInstance$"); // react <17
        });
        const domFiber = dom[key];
        if (domFiber == null) return null;
        // react <16
        if (domFiber._currentElement) {
            let compFiber = domFiber._currentElement._owner;
            for (let i = 0; i < traverseUp; i++) {
                compFiber = compFiber._currentElement._owner;
            }
            return compFiber._instance;
        }
        // react 16+
        const GetCompFiber = fiber => {
            //return fiber._debugOwner; // this also works, but is __DEV__ only
            let parentFiber = fiber.return;
            while (typeof parentFiber.type == "string") {
                parentFiber = parentFiber.return;
            }
            return parentFiber;
        };
        let compFiber = GetCompFiber(domFiber);
        for (let i = 0; i < traverseUp; i++) {
            compFiber = GetCompFiber(compFiber);
        }
        return compFiber.stateNode;
    }

    window.findReact = findReact;
    window.findSubReact = findSubReact;
    window.ss = solving;
}

try {
    if (false) {
        if (storageLocal.languagePackVersion !== "00") {
            if (!storageLocal.languagePack.hasOwnProperty(systemLanguage)) systemLanguage = "en";
            systemText = storageLocal.languagePack;
            One();
        } else {
            systemLanguage = "en";
            One();
        }
    } else {
        systemLanguage = "en";
        One();
    }
} catch (error) {
    console.log(error);
    One();
}
