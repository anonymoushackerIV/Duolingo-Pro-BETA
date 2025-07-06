// ==UserScript==
// @name         Duolingo PRO
// @namespace    http://duolingopro.net
// @version      3.1BETA.01
// @description  The fastest Duolingo XP gainer, working as of June 2025.
// @author       anonymousHackerIV
// @match        https://*.duolingo.com/*
// @match        https://*.duolingo.cn/*
// @icon         https://www.duolingopro.net/static/favicons/duo/128/light/primary.png
// @grant        GM_log
// ==/UserScript==

let storageLocal;
let storageSession;
let versionNumber = "01";
let storageLocalVersion = "05";
let storageSessionVersion = "05";
let versionName = "BETA.01";
let versionFull = "3.1BETA.01";
let versionFormal = "3.1 BETA.01";
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
const flag01 = false;
const flag02 = false;

let temporaryRandom16 = Array.from({ length: 16 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('');

// --- Local Storage with error handling ---
let storageLocalRaw = localStorage.getItem("DLP_Local_Storage");
let storageLocalObj = null;
try {
  storageLocalObj = storageLocalRaw ? JSON.parse(storageLocalRaw) : null;
} catch (e) {
  console.warn("Corrupt DLP_Local_Storage, resetting", e);
}
if (!storageLocalObj || storageLocalObj.storageVersion !== storageLocalVersion) {
  const defaultLocal = {
    version: versionNumber,
    terms: "00",
    random16: temporaryRandom16,
    pins: {
      home: ["DLP_Get_XP_1_ID", "DLP_Get_GEMS_1_ID"],
      legacy: ["DLP_Get_PATH_1_ID", "DLP_Get_PRACTICE_1_ID"]
    },
    settings: {
      autoUpdate: !greasyfork,
      showSolveButtons: true,
      showAutoServerButton: alpha,
      muteLessons: false,
      solveSpeed: 0.9
    },
    chats: [],
    notifications: [{ id: "0001" }],
    tips: { seeMore1: false },
    languagePackVersion: "00",
    onboarding: false,
    storageVersion: storageLocalVersion
  };
  localStorage.setItem("DLP_Local_Storage", JSON.stringify(defaultLocal));
  storageLocal = defaultLocal;
} else {
  storageLocal = storageLocalObj;
}
function saveStorageLocal() {
  localStorage.setItem("DLP_Local_Storage", JSON.stringify(storageLocal));
}
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

    function showNotification(icon, head, body, time = 0) {
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

        //"DLP_Main_Feedback_1_Button_1_ID": [11],

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
        else if (toNumber === 11) mainBoxNewToBeWidth = "400";
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

        if (flag02) mainBox.style.transition = "0.8s linear(0.00, -0.130, 0.164, 0.450, 0.687, 0.861, 0.973, 1.04, 1.06, 1.07, 1.06, 1.04, 1.03, 1.02, 1.01, 1.00, 0.999, 0.997, 0.997, 0.997, 0.998, 0.998, 0.999, 0.999, 1.00)";
        else mainBox.style.transition = "0.8s cubic-bezier(0.16, 1, 0.32, 1)";

        mainBox.offsetHeight;
        mainBox.style.width = `${mainBoxNewToBeWidth}px`;
        mainBox.style.height = `${mainBoxNewHeight}px`;

        fromPage.style.transform = `scaleX(1) scaleY(1)`;
        fromPage.style.width = `${fromBoxOldWidth}px`;
        fromPage.style.height = `${fromBoxOldHeight}px`;

        if (flag02) fromPage.style.transition = "opacity 0.4s cubic-bezier(0.16, 1, 0.32, 1), filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 1.5s linear(0.00, -0.130, 0.164, 0.450, 0.687, 0.861, 0.973, 1.04, 1.06, 1.07, 1.06, 1.04, 1.03, 1.02, 1.01, 1.00, 0.999, 0.997, 0.997, 0.997, 0.998, 0.998, 0.999, 0.999, 1.00)";
        else fromPage.style.transition = "opacity 0.4s cubic-bezier(0.16, 1, 0.32, 1), filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.8s cubic-bezier(0.16, 1, 0.32, 1)";

        fromPage.offsetHeight;
        fromPage.style.opacity = "0";
        fromPage.style.filter = "blur(4px)";
        fromPage.style.transform = `scaleX(${toBoxOldWidth / fromBoxOldWidth}) scaleY(${toBoxOldHeight / fromBoxOldHeight})`;

        toPage.style.width = `${toBoxOldWidth}px`;
        toPage.style.height = `${toBoxOldHeight}px`;
        toPage.style.opacity = "0";
        toPage.style.filter = "blur(4px)";
        toPage.style.transform = `scaleX(${fromBoxOldWidth / toBoxOldWidth}) scaleY(${fromBoxOldHeight / toBoxOldHeight})`;

        if (flag02) toPage.style.transition = "opacity 0.4s cubic-bezier(0.16, 1, 0.32, 1), filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 1.5s linear(0.00, -0.130, 0.164, 0.450, 0.687, 0.861, 0.973, 1.04, 1.06, 1.07, 1.06, 1.04, 1.03, 1.02, 1.01, 1.00, 0.999, 0.997, 0.997, 0.997, 0.998, 0.998, 0.999, 0.999, 1.00)";
        else toPage.style.transition = "opacity 0.4s cubic-bezier(0.16, 1, 0.32, 1), filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.8s cubic-bezier(0.16, 1, 0.32, 1)";

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

    const tooltipObserver = new MutationObserver((mutationsList) => {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-dlp-tooltip') {
                tooltipCreate(mutation.target);
                console.log('Attribute changed: registered');
            } else if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('data-dlp-tooltip')) {
                        tooltipCreate(node);
                        console.log('New element with attribute: registered');
                    }
                });
            }
        });
    });

    tooltipObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-dlp-tooltip']
    });

    const tooltipData = new WeakMap(); // Store tooltip data associated with elements

    function tooltipCreate(element) {
        if (!flag01) return;
        // Check if there's an existing tooltip for this element and hide it
        if (tooltipData.has(element)) {
            hideTooltip(element);
        }

        let timeoutId = null;
        let currentTooltip = null; // Use a local variable here

        const showTooltipForElement = (event) => { // Pass event to showTooltipForElement
            timeoutId = setTimeout(() => {
                currentTooltip = showTooltip(element, event); // Pass event to showTooltip
                tooltipData.set(element, { tooltip: currentTooltip, timeoutId: timeoutId }); // Store data
            }, 1000);
        };

        const hideTooltipForElement = () => {
            clearTimeout(timeoutId);
            hideTooltip(element);
        };

        const positionTooltipForElement = (event) => { // Pass event to positionTooltipForElement
            if(!currentTooltip) return; // Use the local currentTooltip
            positionTooltip(currentTooltip, event); // Pass tooltip and event to positionTooltip
        };

        element.addEventListener('mouseenter', showTooltipForElement);
        element.addEventListener('mouseleave', hideTooltipForElement);
        element.addEventListener('mousemove', positionTooltipForElement);

        // Store the listeners so we can remove them later if needed (though not explicitly required by the prompt, good practice)
        tooltipData.set(element, {
            timeoutId: null,
            tooltip: null,
            listeners: {
                mouseenter: showTooltipForElement,
                mouseleave: hideTooltipForElement,
                mousemove: positionTooltipForElement
            }
        });

        console.log('Tooltip listeners attached to element');

        // Immediately show tooltip if mouse is already over and attribute is just added/changed
        if (element.matches(':hover')) {
            // Simulate mousemove event to position tooltip correctly on initial hover if attribute is added dynamically
            const mockEvent = new MouseEvent('mousemove', {
                clientX: element.getBoundingClientRect().left, // Or any reasonable default cursor position
                clientY: element.getBoundingClientRect().top
            });
            showTooltipForElement(mockEvent);
        }
    };

    function showTooltip(element, event) { // Accept event in showTooltip
        const tooltipText = element.dataset.dlpTooltip;
        let tooltip = document.createElement('div'); // Create a new tooltip each time
        tooltip.classList.add('DLP_Tooltip');
        document.body.appendChild(tooltip);

        tooltip.textContent = tooltipText;
        tooltip.offsetHeight; // Trigger reflow for transition
        tooltip.classList.add('DLP_Tooltip_Visible');

        positionTooltip(tooltip, event); // Pass tooltip and event to positionTooltip
        console.log('created tooltip');
        return tooltip; // Return the created tooltip
    }

    function positionTooltip(tooltip, event){ // Accept tooltip and event in positionTooltip
        if (!tooltip || !event) return; // Exit if tooltip or event is null

        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const cursorX = event.clientX;
        const cursorY = event.clientY;

        const tooltipWidth = tooltipRect.width;
        const tooltipHeight = tooltipRect.height;

        const offsetX = 10; // Horizontal offset from cursor
        const offsetY = 10; // Vertical offset from cursor

        let preferredPosition = 'bottom-right'; // Default position
        let tooltipLeft, tooltipTop, tooltipBottom, tooltipRight;

        // Check bottom-right position
        tooltipLeft = cursorX + offsetX;
        tooltipTop = cursorY + offsetY;
        if (tooltipLeft + tooltipWidth <= viewportWidth && tooltipTop + tooltipHeight <= viewportHeight) {
            preferredPosition = 'bottom-right';
        } else if (cursorX - offsetX - tooltipWidth >= 0 && tooltipTop + tooltipHeight <= viewportHeight) { // Check bottom-left
            tooltipLeft = cursorX - offsetX - tooltipWidth;
            tooltipTop = cursorY + offsetY;
            preferredPosition = 'bottom-left';
        } else if (tooltipLeft + tooltipWidth <= viewportWidth && cursorY - offsetY - tooltipHeight >= 0) { // Check top-right
            tooltipLeft = cursorX + offsetX;
            tooltipTop = cursorY - offsetY - tooltipHeight;
            preferredPosition = 'top-right';
        } else if (cursorX - offsetX - tooltipWidth >= 0 && cursorY - offsetY - tooltipHeight >= 0) { // Check top-left
            tooltipLeft = cursorX - offsetX - tooltipWidth;
            tooltipTop = cursorY - offsetY - tooltipHeight;
            preferredPosition = 'top-left';
        } else { // Fallback to bottom-right if none fit (might go off-screen)
            tooltipLeft = cursorX + offsetX;
            tooltipTop = cursorY + offsetY;
            preferredPosition = 'bottom-right';
        }

        tooltip.style.left = tooltipLeft + 'px';
        tooltip.style.top = tooltipTop + 'px';
        tooltip.style.bottom = 'auto'; // Ensure bottom is not overriding top
        tooltip.style.right = 'auto'; // Ensure right is not overriding left
    }

    function hideTooltip(element) {
        if (!tooltipData.has(element)) return; // Exit if no tooltip data for this element

        const data = tooltipData.get(element);
        const tooltip = data.tooltip;
        if (tooltip) {
            tooltip.classList.remove('DLP_Tooltip_Visible');
            setTimeout(() => {
                if (tooltip && tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
                tooltipData.delete(element); // Clear tooltip data when hidden
                console.log('tooltip removed');
            }, 500);
        } else {
            tooltipData.delete(element); // Clear data even if no tooltip element (to avoid memory leak)
        }
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
                button2.setAttribute("data-dlp-tooltip", "Lesson Mode");

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
                button2.setAttribute("data-dlp-tooltip", "XP Mode");

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
                button2.setAttribute("data-dlp-tooltip", "Infinity Mode");

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
    function updateConnetionButtonStyles(button, buttonColor, textContent, textColor, iconToShow) {
        let iconToHide = Array.from(button.querySelectorAll('[id^="DLP_Inset_Icon_"]')).find(el => getComputedStyle(el).display !== 'none');
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
                textToChange.textContent = textContent;
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
                key: storageLocal.random16,
                ...(Array.isArray(storageLocal.chatKey) && storageLocal.chatKey.length > 0 && { chat_key: storageLocal.chatKey[0] })
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.global || data.versions) {
                    console.log(data.chats);



                    function buildChat2() {
                        function formatTimeAgo(timestamp) {
                            if (typeof timestamp !== 'number' || isNaN(timestamp)) {
                                return "";
                            }
                            if (timestamp > 1e12) {
                                timestamp = Math.floor(timestamp / 1_000_000);
                            } else if (timestamp > 1e10) {
                                timestamp = Math.floor(timestamp / 1_000);
                            }
                            const now = Math.floor(Date.now() / 1000);
                            const secondsPast = now - timestamp;
                            if (secondsPast < 0) return 'in the future?';
                            if (secondsPast < 60) return 'now';
                            if (secondsPast < 3600) return `${Math.floor(secondsPast / 60)}m ago`;
                            if (secondsPast <= 86400) return `${Math.floor(secondsPast / 3600)}h ago`;
                            const days = Math.floor(secondsPast / 86400);
                            if (days === 1) return '1d ago';
                            if (days < 7) return `${days}d ago`;
                            const weeks = Math.floor(days / 7);
                            if (weeks === 1) return '1w ago';
                            if (weeks < 4) return `${weeks}w ago`;
                            try {
                                const date = new Date(timestamp * 1000);
                                return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
                            } catch (e) {
                                return "older";
                            }
                        }

                        const chatBox = document.querySelector('#DLP_Main_Box_Divider_11_ID')?.querySelector('.DLP_Chat_Box_1_ID_1');

                        if (!chatBox) {
                            return;
                        }
                        if (typeof data === 'undefined' || typeof data.chats === 'undefined' || !Array.isArray(data.chats.messages)) {
                            return;
                        }

                        const existingIndividualMessages = new Map();
                        chatBox.querySelectorAll('p[data-message-timestamp]').forEach(msgP => {
                            const msgTimestamp = msgP.dataset.messageTimestamp;
                            if(msgTimestamp) {
                                existingIndividualMessages.set(parseInt(msgTimestamp, 10), msgP);
                            }
                        });

                        const isScrolledNearLatest = chatBox.scrollTop <= 10;
                        const processedMessageTimestamps = new Set();

                        let lastAuthor = null;

                        let previousMessageGroupElement = null;


                        for (let i = 0; i < data.chats.messages.length; i++) {
                            const chat = data.chats.messages[i];

                            if (!chat || typeof chat.author !== 'string' || typeof chat.message !== 'string' || typeof chat.role !== 'string' || typeof chat.send_time !== 'number') {
                                continue;
                            }

                            const messageTimestamp = chat.send_time;
                            processedMessageTimestamps.add(messageTimestamp);

                            let currentMessageGroupElement = null;

                            if (existingIndividualMessages.has(messageTimestamp)) {
                                const messageP = existingIndividualMessages.get(messageTimestamp);
                                if (messageP.textContent !== chat.message) {
                                    messageP.textContent = chat.message;
                                }
                                currentMessageGroupElement = messageP.closest('.DLP_VStack_4[data-group-timestamp]');
                                lastAuthor = chat.author;
                                previousMessageGroupElement = currentMessageGroupElement;
                                continue;
                            }

                            // --- Message is NEW ---
                            const messageP = document.createElement('p');
                            messageP.className = 'DLP_Text_Style_1 DLP_NoSelect';
                            messageP.style.alignSelf = 'stretch';
                            messageP.style.opacity = '0.5';
                            messageP.textContent = chat.message;
                            messageP.dataset.messageTimestamp = messageTimestamp;

                            const needsNewHeader = (chat.author !== lastAuthor || !previousMessageGroupElement);

                            if (needsNewHeader) {
                                currentMessageGroupElement = document.createElement('div');
                                currentMessageGroupElement.className = 'DLP_VStack_4';
                                currentMessageGroupElement.dataset.groupTimestamp = messageTimestamp;

                                const headerDiv = document.createElement('div');
                                headerDiv.style.display = 'flex';
                                headerDiv.style.justifyContent = 'space-between';
                                headerDiv.style.alignItems = 'center';
                                headerDiv.style.alignSelf = 'stretch';
                                headerDiv.dataset.chatHeader = "true";

                                const leftHeaderDiv = document.createElement('div');
                                leftHeaderDiv.className = 'DLP_HStack_6';
                                const avatarDiv = document.createElement('div');
                                avatarDiv.style.width = '20px';
                                avatarDiv.style.height = '20px';
                                avatarDiv.style.borderRadius = '16px';
                                avatarDiv.style.outline = '2px solid rgba(0, 0, 0, 0.20)';
                                avatarDiv.style.outlineOffset = '-2px';
                                const profilePicUrl = chat.profile_picture || 'https://www.duolingopro.net/static/default_profile_picture_1.png';
                                avatarDiv.style.background = `url(${profilePicUrl}) 50% center / cover no-repeat white`;
                                const authorP = document.createElement('p');
                                authorP.className = 'DLP_Text_Style_1 DLP_NoSelect';
                                authorP.style.color = chat.accent || '#007AFF';
                                authorP.style.opacity = '0.5';
                                authorP.textContent = chat.author;
                                leftHeaderDiv.appendChild(avatarDiv);
                                leftHeaderDiv.appendChild(authorP);

                                const rightHeaderDiv = document.createElement('div');
                                rightHeaderDiv.className = 'DLP_HStack_6';
                                const timeP = document.createElement('p');
                                timeP.className = 'DLP_Text_Style_1 DLP_NoSelect';
                                timeP.style.color = chat.accent || '#007AFF';
                                timeP.style.opacity = '0.5';
                                timeP.textContent = formatTimeAgo(chat.send_time);
                                timeP.dataset.timeElement = "true";
                                const svgDot = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                                svgDot.setAttribute('width', '6');
                                svgDot.setAttribute('height', '6');
                                svgDot.setAttribute('viewBox', '0 0 6 6');
                                svgDot.setAttribute('fill', chat.accent || '#007AFF');
                                svgDot.setAttribute('opacity', '0.5');
                                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                                path.setAttribute('d', 'M2.80371 5.27832C1.48242 5.27832 0.410156 4.20605 0.410156 2.88477C0.410156 1.56348 1.48242 0.491211 2.80371 0.491211C4.125 0.491211 5.19727 1.56348 5.19727 2.88477C5.19727 4.20605 4.125 5.27832 2.80371 5.27832Z');
                                svgDot.appendChild(path);
                                const roleP = document.createElement('p');
                                roleP.className = 'DLP_Text_Style_1 DLP_NoSelect';
                                roleP.style.color = chat.accent || '#007AFF';
                                roleP.style.opacity = '0.5';
                                roleP.textContent = chat.role;
                                rightHeaderDiv.appendChild(timeP);
                                rightHeaderDiv.appendChild(svgDot);
                                rightHeaderDiv.appendChild(roleP);

                                headerDiv.appendChild(leftHeaderDiv);
                                headerDiv.appendChild(rightHeaderDiv);
                                currentMessageGroupElement.appendChild(headerDiv);

                                currentMessageGroupElement.appendChild(messageP);

                                chatBox.insertBefore(currentMessageGroupElement, chatBox.firstChild);

                            } else {
                                if (!previousMessageGroupElement) {
                                    lastAuthor = chat.author;
                                    continue;
                                }
                                previousMessageGroupElement.appendChild(messageP);
                                currentMessageGroupElement = previousMessageGroupElement;
                            }

                            if (chat.files && chat.files.length > 0) {
                                console.log(`Files exist: ${chat.files.length} file(s)`);
                                chat.files.forEach((file, index) => {
                                    console.log(`File ${index + 1}: ${file}`);
                                });
                                console.log('currentMessageGroupElement', currentMessageGroupElement);
                                console.log('previousMessageGroupElement', previousMessageGroupElement);
                                updateDisplayFiles(chat.files, currentMessageGroupElement);
                            } else {
                                console.log('No files');
                            }

                            existingIndividualMessages.set(messageTimestamp, messageP);

                            lastAuthor = chat.author;
                            previousMessageGroupElement = currentMessageGroupElement;
                        }

                        existingIndividualMessages.forEach((messageElement, timestamp) => {
                            if (!processedMessageTimestamps.has(timestamp)) {
                                const group = messageElement.closest('.DLP_VStack_4[data-group-timestamp]');
                                messageElement.remove();
                                existingIndividualMessages.delete(timestamp);
                                if (group && group.querySelectorAll('p[data-message-timestamp]').length === 0) {
                                    group.remove();
                                }
                            }
                        });

                        chatBox.querySelectorAll('.DLP_VStack_4[data-group-timestamp]').forEach(group => {
                            const timeElement = group.querySelector('p[data-time-element="true"]');
                            const groupTimestamp = parseInt(group.dataset.groupTimestamp, 10);
                            if (timeElement && !isNaN(groupTimestamp)) {
                                const newTimeText = formatTimeAgo(groupTimestamp);
                                if (timeElement.textContent !== newTimeText) {
                                    timeElement.textContent = newTimeText;
                                }
                            }
                        });

                        if (isScrolledNearLatest) {
                            setTimeout(() => {
                                chatBox.scrollTop = 0;
                            }, 0);
                        }

                        async function getTypeFromUrl(url) {
                            const clean = url.split('?')[0];
                            const ext = clean.split('.').pop().toLowerCase();

                            const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'];
                            const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];

                            if (imageExts.includes(ext)) return 'image';
                            if (videoExts.includes(ext)) return 'video';

                            try {
                                const res = await fetch(url, { method: 'HEAD' });
                                const ct = res.headers.get('Content-Type') || '';
                                if (ct.startsWith('video/')) return 'video';
                                if (ct.startsWith('image/')) return 'image';
                            } catch (err) {
                                console.warn('HEAD request failed for', url, err);
                            }

                            return 'image';
                        }


                        async function updateDisplayFiles(newLinks, elementToAddInto) {
                            const previewParent = document.createElement('div');
                            Object.assign(previewParent.style, {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                alignSelf: 'stretch',
                                width: '100%',
                                overflowY: 'scroll',
                                opacity: '1',
                                filter: 'blur(0px)',
                                marginTop: '0px',
                                transition: '0.4s cubic-bezier(0.16,1,0.32,1)'
                            });
                            elementToAddInto.appendChild(previewParent);

                            let initiate = previewParent.childElementCount === 0;

                            for (const url of newLinks) {
                                const type = await getTypeFromUrl(url);
                                const previewBox = createPreviewBox(url, type);

                                if (!initiate) {
                                    const newWidth = 80;
                                    Object.assign(previewBox.style, {
                                        width: "0px",
                                        opacity: "0",
                                        filter: "blur(4px)",
                                        transition: "all 0.4s cubic-bezier(0.16,1,0.32,1)"
                                    });
                                    previewParent.appendChild(previewBox);
                                    void previewBox.offsetWidth;
                                    previewBox.style.width = `${newWidth}px`;
                                    previewBox.style.opacity = "1";
                                    previewBox.style.filter = "blur(0px)";
                                } else {
                                    previewParent.appendChild(previewBox);
                                }
                            }

                            if (initiate) {
                                previewParent.style.display = "flex";
                                const newHeight = previewParent.offsetHeight;
                                previewParent.style.transition = "";
                                void previewParent.offsetHeight;
                                Object.assign(previewParent.style, {
                                    height: "0px",
                                    opacity: "0",
                                    filter: "blur(4px)",
                                    marginTop: "-8px"
                                });
                                Array.from(previewParent.children).forEach(c => { c.style.height = "100%"; });
                                previewParent.style.transition =
                                    "all 0.4s cubic-bezier(0.16,1,0.32,1)";
                                void previewParent.offsetHeight;
                                Object.assign(previewParent.style, {
                                    height: `${newHeight}px`,
                                    opacity: "1",
                                    filter: "blur(0px)",
                                    marginTop: "0px"
                                });
                                setTimeout(() => {
                                    Array.from(previewParent.children).forEach(c => { c.style.height = ""; });
                                    previewParent.style.height = "";
                                }, 400);
                            }
                        }



                        function createPreviewBox(url, fileType) {
                            const previewBox = document.createElement("div");
                            previewBox.className = "DLP_Attachment_Preview_Box_1";

                            if (fileType === "image") {
                                previewBox.style.backgroundImage = `url('${url}')`;
                                previewBox.style.backgroundSize = "cover";
                                previewBox.style.backgroundPosition = "center";
                                previewBox.style.backgroundRepeat = "no-repeat";
                                previewBox.dataset.previewType = "image";
                                previewBox.dataset.previewSrc = url;

                            } else if (fileType === "video") {
                                const video = document.createElement("video");
                                video.src = url;
                                video.muted = true;
                                video.loop = true;
                                video.autoplay = true;
                                video.playsInline = true;
                                video.style.width = "100%";
                                video.style.height = "100%";
                                video.style.objectFit = "cover";
                                previewBox.appendChild(video);
                                previewBox.dataset.previewType = "video";
                                previewBox.dataset.previewSrc = url;
                            }

                            previewBox.addEventListener("click", function(event) {
                                if (event.target.closest("svg")) return;
                                const overlay = document.createElement("div");
                                Object.assign(overlay.style, {
                                    position: "fixed", top: 0, bottom: 0, left: 0, right: 0,
                                    display: "flex", justifyContent: "center", alignItems: "center",
                                    width: "100%", height: "100vh", zIndex: 210,
                                    background: "rgba(var(--color-snow), 0.50)",
                                    backdropFilter: "blur(16px)",
                                    opacity: "0", filter: "blur(8px)",
                                    transition: "opacity 0.4s cubic-bezier(0.16, 1, 0.32, 1), filter 0.4s cubic-bezier(0.16, 1, 0.32, 1)"
                                });

                                let previewEl;
                                const src = previewBox.dataset.previewSrc;
                                if (fileType === "image") {
                                    previewEl = document.createElement("img");
                                    previewEl.src = src;
                                    previewEl.style.maxWidth = "90%";
                                    previewEl.style.maxHeight = "90%";
                                    previewEl.style.objectFit = "contain";
                                    previewEl.style.borderRadius = "16px";
                                } else {
                                    previewEl = document.createElement("video");
                                    previewEl.src = src;
                                    previewEl.controls = true;
                                    previewEl.autoplay = false;
                                    previewEl.style.maxWidth = "90%";
                                    previewEl.style.maxHeight = "90%";
                                    previewEl.style.objectFit = "contain";
                                    previewEl.style.borderRadius = "16px";
                                }
                                overlay.appendChild(previewEl);
                                document.body.appendChild(overlay);

                                void overlay.offsetHeight;
                                overlay.style.opacity = "1";
                                overlay.style.filter = "blur(0px)";

                                overlay.addEventListener("click", e => {
                                    if (e.target === overlay) {
                                        overlay.style.opacity = "0";
                                        overlay.style.filter = "blur(8px)";
                                        setTimeout(() => document.body.removeChild(overlay), 400);
                                    }
                                });
                            });
                            return previewBox;
                        }


                        function getAverageImageColor(img, width, height) {
                            const canvas = document.createElement("canvas");
                            const ctx = canvas.getContext("2d");
                            canvas.width = width;
                            canvas.height = height;
                            img.width = 96;
                            img.height = 96;

                            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
                            const imageData = ctx.getImageData(0, 0, width, height);
                            const data = imageData.data;
                            let r = 0,
                                g = 0,
                                b = 0;

                            for (let i = 0; i < data.length; i += 4) {
                                r += data[i];
                                g += data[i + 1];
                                b += data[i + 2];
                            }

                            r = Math.floor(r / (data.length / 4));
                            g = Math.floor(g / (data.length / 4));
                            b = Math.floor(b / (data.length / 4));

                            return { r, g, b };
                        }

                        function getContrastColor(rgb) {
                            const luminance = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
                            return luminance < 140 ? "#FFF" : "#000";
                        }

                        function createVideoElement(file, previewBox) {
                            const video = document.createElement("video");
                            video.src = URL.createObjectURL(file);
                            video.style.width = "100%";
                            video.style.height = "100%";
                            video.autoplay = true;
                            video.loop = true;
                            video.muted = true;
                            video.style.objectFit = "cover";
                            video.controls = false;

                            video.addEventListener("loadeddata", function () {
                                if (video.readyState >= 3) {
                                    analyzeVideoColor(video, previewBox);
                                }
                            });

                            return video;
                        }

                        function analyzeVideoColor(video, previewBox) {
                            const canvas = document.createElement("canvas");
                            const ctx = canvas.getContext("2d");
                            canvas.width = 96;
                            canvas.height = 96;
                            video.width = 96;
                            video.height = 96;

                            function captureColor() {
                                if (!document.body.contains(previewBox)) {
                                    return;
                                }
                                try {
                                    ctx.drawImage(video, 0, 0, 96, 96);
                                    ctx.drawImage(canvas, 0, 0, 32, 32, 0, 0, 32, 32);

                                    const frame = ctx.getImageData(0, 0, 32, 32);
                                    const color = getAverageImageColorFromData(frame.data);
                                    const contrastColor = getContrastColor(color);

                                    ctx.drawImage(video, 0, 0, 96, 96);
                                    ctx.drawImage(canvas, 0, 0, 96, 96, 0, 0, 96, 96);

                                    const frame96 = ctx.getImageData(0, 0, 96, 96);
                                    const color96 = getAverageImageColorFromData(frame96.data);
                                    const contrastColor96 = getContrastColor(color96);

                                    const svgDelete = previewBox.querySelector("svg");
                                    if (svgDelete) {
                                        svgDelete.style.fill = contrastColor;
                                        if (contrastColor96 === "#000") {
                                            svgDelete.parentElement.style.outline = "2px solid rgba(0, 0, 0, 0.1)";
                                        } else if (contrastColor96 === "#FFF") {
                                            svgDelete.parentElement.style.outline =
                                                "2px solid rgba(256, 256, 256, 0.2)";
                                        }
                                    }

                                    setTimeout(captureColor, 1000);
                                } catch (e) {
                                    console.error("Error capturing video color:", e);
                                }
                            }
                            captureColor();
                        }

                        function getAverageImageColorFromData(data) {
                            let r = 0,
                                g = 0,
                                b = 0,
                                count = 0;
                            for (let i = 0; i < data.length; i += 4) {
                                r += data[i];
                                g += data[i + 1];
                                b += data[i + 2];
                                count++;
                            }
                            r = Math.floor(r / count);
                            g = Math.floor(g / count);
                            b = Math.floor(b / count);
                            return { r, g, b };
                        }

                        function createThePreviewBoxesFr() {
                            let newFiles = Array.from(DLP_Attachment_Input_1.files);

                            appendFiles(newFiles);
                            updateDisplayFiles(newFiles);
                        }
                    }
                    buildChat2();



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
                            if (serverConnectedBefore !== 'yes') {
                                updateReleaseNotes(warnings);
                                mainInputsDiv1.style.opacity = '1';
                                mainInputsDiv1.style.pointerEvents = 'auto';
                                updateConnetionButtonStyles(DLP_Server_Connection_Button, '#34C759', systemText[systemLanguage][108], '#FFF', DLP_Server_Connection_Button.querySelector("#DLP_Inset_Icon_2_ID"));
                                updateConnetionButtonStyles(DLP_Server_Connection_Button_2, '#34C759', systemText[systemLanguage][108], '#FFF', DLP_Server_Connection_Button_2.querySelector("#DLP_Inset_Icon_2_ID"));
                                if (serverConnectedBefore === 'error' || serverConnectedBeforeNotification) {
                                    serverConnectedBeforeNotification.close();
                                    serverConnectedBeforeNotification = false;
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
                    } else if (serverConnectedBefore !== 'outdated') {
                        updateConnetionButtonStyles(DLP_Server_Connection_Button, '#FF9500', 'Outdated', '#FFF', DLP_Server_Connection_Button.querySelector("#DLP_Inset_Icon_4_ID"));
                        updateConnetionButtonStyles(DLP_Server_Connection_Button_2, '#FF9500', 'Outdated', '#FFF', DLP_Server_Connection_Button_2.querySelector("#DLP_Inset_Icon_4_ID"));
                        DLP_Server_Connection_Button.addEventListener('click', function () {
                            window.open(`${serverURL}/update/userscript`, '_blank');
                        });
                        DLP_Server_Connection_Button_2.addEventListener('click', function () {
                            window.open(`${serverURL}/update/userscript`, '_blank');
                        });
                        if (serverConnectedBefore === 'no') {
                            mainInputsDiv1.style.opacity = '0.5';
                            mainInputsDiv1.style.pointerEvents = 'none';
                            showNotification("warning", systemText[systemLanguage][233], systemText[systemLanguage][234], 0);
                        } else if (serverConnectedBefore === 'error' || serverConnectedBeforeNotification) {
                            serverConnectedBeforeNotification.close();
                            serverConnectedBeforeNotification = false;
                        }
                        serverConnectedBefore = 'outdated';
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
                if (serverConnectedBefore !== 'error') {
                    mainInputsDiv1.style.opacity = '0.5';
                    mainInputsDiv1.style.pointerEvents = 'none';
                    updateConnetionButtonStyles(DLP_Server_Connection_Button, '#FF2D55', systemText[systemLanguage][109], '#FFF', DLP_Server_Connection_Button.querySelector("#DLP_Inset_Icon_3_ID"));
                    updateConnetionButtonStyles(DLP_Server_Connection_Button_2, '#FF2D55', systemText[systemLanguage][109], '#FFF', DLP_Server_Connection_Button_2.querySelector("#DLP_Inset_Icon_3_ID"));
                    serverConnectedBeforeNotification = showNotification("error", systemText[systemLanguage][231], systemText[systemLanguage][232], 0);
                    serverConnectedBefore = 'error';
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

            if (id === "streak" || id === "gems") {
                (async () => {
                    try {
                        console.log(apiURL + (id === "streak" ? "/streak" : id === "gems" ? "/gem" : ""));
                        const response = await fetch(apiURL + (id === "streak" ? "/streak" : id === "gems" ? "/gem" : ""), {
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





    function setupSupportPage() {


        function setupCard() {
            let card = document.getElementById("DLP_Main_Box_Divider_11_ID").querySelector("#DLP_Inset_Card_1");
            let cardExpanded = false;
            let cardAnimating = false;

            let descriptionText = card.querySelectorAll(':scope > .DLP_Text_Style_1');

            card.addEventListener('click', () => {
                if (cardAnimating) return;
                cardAnimating = true;
                if (!cardExpanded) {
                    let cardHeight = card.offsetHeight;
                    let textHeight = false;
                    if (descriptionText.length > 0) {
                        textHeight = Array.from(descriptionText).map(() => "0");
                        descriptionText.forEach(element => {
                            element.style.display = 'block';
                            element.style.height = 'auto';
                        });
                    }
                    void card.offsetHeight;
                    let newCardHeight = card.offsetHeight;
                    let newTextHeight = false;
                    if (descriptionText.length > 0) {
                        newTextHeight = Array.from(descriptionText).map(element => element.offsetHeight);
                    }
                    if (descriptionText.length > 0) {
                        descriptionText.forEach(element => {
                            element.style.height = '0px';
                        });
                    }
                    card.style.height = `${cardHeight}px`;
                    void card.offsetHeight;
                    if (descriptionText.length > 0) {
                        descriptionText.forEach(element => {
                            element.style.filter = 'blur(0px)';
                            element.style.opacity = '1';
                        });
                    }
                    card.style.height = `${newCardHeight}px`;
                    if (descriptionText.length > 0) {
                        descriptionText.forEach(element => {
                            element.style.height = `${newTextHeight[Array.from(descriptionText).indexOf(element)]}px`;
                        });
                    }
                    card.querySelector('.DLP_HStack_6').style.opacity = '0.5';
                    card.querySelectorAll('svg')[1].style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.32, 1)';
                    card.querySelectorAll('svg')[1].style.transform = 'rotate(90deg)';
                    setTimeout(() => {
                        card.style.height = 'auto';
                        if (descriptionText.length > 0) {
                            descriptionText.forEach(element => {
                                element.style.height = 'auto';
                            });
                        }
                        cardExpanded = true;
                        cardAnimating = false;
                    }, 400);
                } else {
                    let cardHeight = card.offsetHeight;
                    let textHeight = false;
                    if (descriptionText.length > 0) {
                        textHeight = Array.from(descriptionText).map(element => element.offsetHeight);
                        descriptionText.forEach(element => {
                            element.style.display = 'none';
                        });
                    }
                    void card.offsetHeight;
                    let newCardHeight = card.offsetHeight;
                    let newTextHeight = false;
                    if (descriptionText.length > 0) {
                        newTextHeight = Array.from(descriptionText).map(() => "0");
                        descriptionText.forEach(element => {
                            element.style.display = 'block';
                            element.style.height = `${textHeight[Array.from(descriptionText).indexOf(element)]}px`;
                        });
                    }
                    card.style.height = `${cardHeight}px`;
                    void card.offsetHeight;

                    if (descriptionText.length > 0) {
                        descriptionText.forEach(element => {
                            element.style.filter = 'blur(4px)';
                            element.style.opacity = '0';
                        });
                    }
                    card.style.height = `${newCardHeight}px`;
                    if (descriptionText.length > 0) {
                        descriptionText.forEach(element => {
                            element.style.height = '0px';
                        });
                    }
                    card.querySelector('.DLP_HStack_6').style.opacity = '1';
                    card.querySelectorAll('svg')[1].style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.32, 1)';
                    card.querySelectorAll('svg')[1].style.transform = 'rotate(0deg)';
                    setTimeout(() => {
                        card.style.height = 'auto';
                        if (descriptionText.length > 0) {
                            descriptionText.forEach(element => {
                                element.style.display = 'none';
                            });
                        }
                        cardExpanded = false;
                        cardAnimating = false;
                    }, 400);
                }
            });
        }
        setupCard();

        function setupSendButton() {
            const container = document.getElementById("DLP_Main_Box_Divider_11_ID");
            const sendButton = container.querySelector("#DLP_Inset_Button_2_ID");
            const attachmentInput = container.querySelector("#DLP_Attachment_Input_1");
            const messageInput = container.querySelector("#DLP_Inset_Input_1_ID");

            sendButton.addEventListener('click', async () => {
                if (!storageLocal.chatKey) {
                    try {
                        let response = await fetch(apiURL + "/chats/create", {
                            method: "GET",
                            headers: {
                                "Authorization": `Bearer ${document.cookie.split(';').find(cookie => cookie.includes('jwt_token')).split('=')[1]}`
                            }
                        });

                        let data = await response.json();
                        console.log("Server Response:", data);
                        storageLocal.chatKey = [data.chat_key];
                        saveStorageLocal();
                    } catch (error) {
                        console.error("Fetch error:", error);
                    }
                }

                let formData = new FormData();
                formData.append("message", messageInput.value);
                for (const file of attachmentInput.files) {
                    console.log("attaching", file);
                    formData.append("files", file);
                }

                sendButton.style.opacity = '0.5';
                sendButton.style.pointerEvents = 'none';

                try {
                    let response = await fetch(apiURL + "/chats/send_message", {
                        method: "POST",
                        headers: alpha
                        ? {
                            'Authorization': `Bearer ${document.cookie.split(';').find(cookie => cookie.includes('jwt_token')).split('=')[1]}`,
                            'X-Chat-Key': `${storageLocal.chatKey}`
                        }
                        : {
                            'Authorization': `Bearer ${storageLocal.chatKey}`
                        },
                        body: formData
                    });

                    let responseData = await response.json();
                    console.log("Server Response:", responseData);
                    if (!responseData.status) showNotification(responseData.notification.icon, responseData.notification.head, responseData.notification.body, responseData.notification.duration);

                    messageInput.value = '';
                } catch (error) {
                    console.error("Fetch error:", error);
                }
            });
        }
        setupSendButton();

        function setupTextInput() {
            const container = document.getElementById('DLP_Main_Box_Divider_11_ID');
            const textarea = container.querySelector('#DLP_Inset_Input_1_ID');
            const activeContainer = container.querySelector('.DLP_Input_Style_1_Active');
            const sendButton = container.querySelector("#DLP_Inset_Button_2_ID");
            sendButton.style.opacity = '0.5';
            sendButton.style.pointerEvents = 'none';

            textarea.style.height = '1.2em';

            textarea.addEventListener('input', function () {
                textarea.style.height = '1.2em';

                const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
                const maxRows = 5;
                const maxHeight = lineHeight * maxRows;

                const newHeight = Math.min((textarea.scrollHeight - 32), maxHeight);

                textarea.style.height = newHeight + 'px';

                if (newHeight < 20) {
                    activeContainer.style.height = '48px';
                } else {
                    activeContainer.style.height = (newHeight + 32) + 'px';
                }

                if (textarea.value.trim() === '') {
                    sendButton.style.opacity = '0.5';
                    sendButton.style.pointerEvents = 'none';
                } else {
                    sendButton.style.opacity = '';
                    sendButton.style.pointerEvents = '';
                }
            });
        }
        setupTextInput();

        let fileList = [];
        function setupFileInput() {
            document.getElementById("DLP_Attachment_Preview_Parent").style.display = "none";

            function appendFiles(newFiles) {
                fileList = fileList.concat(newFiles);
            }

            function updateDisplayFiles(newFiles) {
                const previewParent = document.getElementById("DLP_Attachment_Preview_Parent");
                let initiate = false;

                newFiles.forEach((file, index) => {
                    if (previewParent.childElementCount === 0) initiate = true;

                    const previewBox = createPreviewBox(
                        file,
                        fileList.length - newFiles.length + index
                    );

                    if (!initiate) {
                        let newWidth = "80"; //previewBox.offsetWidth;
                        previewBox.style.width = "0px";
                        previewBox.style.opacity = "0";
                        previewBox.style.filter = "blur(4px)";
                        previewBox.style.transition = "all 0.4s cubic-bezier(0.16, 1, 0.32, 1)";
                        previewParent.appendChild(previewBox);
                        void previewBox.offsetWidth;
                        previewBox.style.width = `${newWidth}px`;
                        previewBox.style.opacity = "1";
                        previewBox.style.filter = "blur(0px)";
                    } else {
                        previewParent.appendChild(previewBox);
                    }
                });

                if (initiate) {
                    previewParent.style.display = "flex";
                    let newHeight = previewParent.offsetHeight;
                    previewParent.style.transition = "";
                    void previewParent.offsetHeight;
                    previewParent.style.height = "0px";
                    previewParent.style.opacity = "0";
                    previewParent.style.filter = "blur(4px)";
                    previewParent.style.marginTop = "-8px";
                    Array.from(previewParent.children).forEach((child) => {
                        child.style.height = "100%";
                    });
                    previewParent.style.transition = "all 0.4s cubic-bezier(0.16, 1, 0.32, 1)";
                    void previewParent.offsetHeight;
                    previewParent.style.height = `${newHeight}px`;
                    previewParent.style.opacity = "1";
                    previewParent.style.filter = "blur(0px)";
                    previewParent.style.marginTop = "0px";
                    setTimeout(() => {
                        Array.from(previewParent.children).forEach((child) => {
                            child.style.height = "";
                        });
                        previewParent.style.height = "";
                    }, 400);
                }
            }

            function createPreviewBox(file, index) {
                const previewBox = document.createElement("div");
                previewBox.className = "DLP_Attachment_Preview_Box_1";
                previewBox.dataset.index = index;

                if (file.type.startsWith("image")) {
                    const img = new Image();
                    img.oncontextmenu = () => false;

                    const reader = new FileReader();
                    reader.onload = function (e) {
                        img.src = e.target.result;
                        img.onload = function () {
                            const color = getAverageImageColor(img, 32, 32);
                            const color96 = getAverageImageColor(img, 96, 96);

                            previewBox.style.backgroundImage = `url('${e.target.result}')`;
                            previewBox.style.backgroundSize = "cover";
                            previewBox.style.backgroundPosition = "center";
                            previewBox.style.backgroundRepeat = "no-repeat";

                            const svgDelete = createDeleteButton(index, getContrastColor(color));
                            previewBox.appendChild(svgDelete);
                            let boxAverage = getContrastColor(color96);
                            if (boxAverage === "#000") {
                                previewBox.style.outline = "2px solid rgba(0, 0, 0, 0.1)";
                            } else if (boxAverage === "#FFF") {
                                previewBox.style.outline = "2px solid rgba(256, 256, 256, 0.2)";
                            }
                        };

                        previewBox.dataset.previewSrc = e.target.result;
                        previewBox.dataset.previewType = "image";
                    };
                    reader.readAsDataURL(file);
                } else if (file.type.startsWith("video")) {
                    const video = createVideoElement(file, previewBox, index);
                    video.oncontextmenu = () => false;

                    previewBox.appendChild(video);
                    const svgDelete = createDeleteButton(index, "#000");
                    previewBox.appendChild(svgDelete);
                    initializeMagneticHover(svgDelete);

                    previewBox.dataset.previewSrc = video.src;
                    previewBox.dataset.previewType = "video";
                }

                previewBox.addEventListener("click", function(event) {
                    if (event.target.closest("svg")) return;
                    const overlay = document.createElement("div");
                    overlay.setAttribute("style", "position: fixed; top: 0; bottom: 0; right: 0; left: 0; display: flex; width: 100%; height: 100vh; justify-content: center; align-items: center; flex-shrink: 0; z-index: 210; transition: filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.32, 1); background: rgba(var(--color-snow), 0.50); backdrop-filter: blur(16px); opacity: 0; filter: blur(8px);");
                    let previewElement;
                    if (previewBox.dataset.previewType === "image") {
                        previewElement = document.createElement("img");
                        previewElement.src = previewBox.dataset.previewSrc;
                        previewElement.style.maxWidth = "90%";
                        previewElement.style.maxHeight = "90%";
                        previewElement.style.objectFit = "contain";
                        previewElement.style.borderRadius = "16px";
                        previewElement.style.outlineOffset = "-2px";
                    } else if (previewBox.dataset.previewType === "video") {
                        previewElement = document.createElement("video");
                        previewElement.src = previewBox.dataset.previewSrc;
                        previewElement.controls = true;
                        previewElement.loop = false;
                        previewElement.muted = false;
                        previewElement.autoplay = false;
                        previewElement.style.maxWidth = "90%";
                        previewElement.style.maxHeight = "90%";
                        previewElement.style.objectFit = "contain";
                        previewElement.style.borderRadius = "16px";
                        previewElement.style.outlineOffset = "-2px";
                    }
                    if (previewElement) {
                        previewElement.style.outline = previewBox.style.outline || window.getComputedStyle(previewBox).outline;
                        overlay.appendChild(previewElement);
                    }
                    document.body.appendChild(overlay);

                    void overlay.offsetHeight;
                    overlay.style.opacity = "1";
                    overlay.style.filter = "blur(0px)";

                    overlay.addEventListener("click", function(e) {
                        if(e.target === overlay) {
                            overlay.style.opacity = "0";
                            overlay.style.filter = "blur(8px)";
                            setTimeout(() => {
                                document.body.removeChild(overlay);
                            }, 400);
                        }
                    });
                });

                return previewBox;
            }

            function getAverageImageColor(img, width, height) {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = width;
                canvas.height = height;
                img.width = 96;
                img.height = 96;

                ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
                const imageData = ctx.getImageData(0, 0, width, height);
                const data = imageData.data;
                let r = 0,
                    g = 0,
                    b = 0;

                for (let i = 0; i < data.length; i += 4) {
                    r += data[i];
                    g += data[i + 1];
                    b += data[i + 2];
                }

                r = Math.floor(r / (data.length / 4));
                g = Math.floor(g / (data.length / 4));
                b = Math.floor(b / (data.length / 4));

                return { r, g, b };
            }

            function getContrastColor(rgb) {
                const luminance = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
                return luminance < 140 ? "#FFF" : "#000";
            }

            function createDeleteButton(index, color) {
                const svgDelete = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "svg"
                );
                svgDelete.setAttribute("class", `magnetic_hover_1`);
                svgDelete.setAttribute(
                    "style",
                    `position: absolute; top: 8px; left: 8px; cursor: pointer; fill: ${color}; z-index: 2; transition: filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.4s cubic-bezier(0.16, 1, 0.32, 1), fill 0.5s ease-in-out;`
                );
                svgDelete.setAttribute("width", "17");
                svgDelete.setAttribute("height", "17");
                svgDelete.setAttribute("viewBox", "0 0 17 17");
                svgDelete.innerHTML =
                    '<path d="M8.25 16.5C3.72656 16.5 0 12.7752 0 8.24609C0 3.7248 3.71875 0 8.25 0C12.7735 0 16.5 3.7248 16.5 8.24609C16.5 12.7752 12.7813 16.5 8.25 16.5ZM5.78906 11.6039C6.0625 11.6039 6.28125 11.5102 6.45312 11.3383L8.25 9.53454L10.0547 11.3383C10.2266 11.5102 10.4532 11.6039 10.7188 11.6039C11.2266 11.6039 11.6172 11.2056 11.6172 10.6981C11.6172 10.4638 11.5235 10.2452 11.3438 10.0733L9.53125 8.26171L11.3516 6.43445C11.5313 6.26265 11.6172 6.04401 11.6172 5.80975C11.6172 5.30999 11.2266 4.91954 10.7266 4.91954C10.461 4.91954 10.2578 4.99763 10.0704 5.18505L8.25 6.98887L6.44531 5.18505C6.26562 5.01325 6.0625 4.92735 5.78906 4.92735C5.28906 4.92735 4.89844 5.30999 4.89844 5.82536C4.89844 6.05181 4.99218 6.27046 5.16406 6.44226L6.98437 8.26171L5.16406 10.0811C4.99218 10.2452 4.89844 10.4716 4.89844 10.6981C4.89844 11.2056 5.28906 11.6039 5.78906 11.6039Z"/>';
                svgDelete.clickHandler = () => removeAttachment(index);
                svgDelete.addEventListener("click", svgDelete.clickHandler);
                return svgDelete;
            }

            function createVideoElement(file, previewBox, index) {
                const video = document.createElement("video");
                video.dataset.index = index;
                video.src = URL.createObjectURL(file);
                video.style.width = "100%";
                video.style.height = "100%";
                video.autoplay = true;
                video.loop = true;
                video.muted = true;
                video.style.objectFit = "cover";
                video.controls = false;

                video.addEventListener("loadeddata", function () {
                    if (video.readyState >= 3) {
                        analyzeVideoColor(video, previewBox);
                    }
                });

                return video;
            }

            function analyzeVideoColor(video, previewBox) {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = 96;
                canvas.height = 96;
                video.width = 96;
                video.height = 96;

                function captureColor() {
                    if (!document.body.contains(previewBox)) {
                        return;
                    }
                    try {
                        ctx.drawImage(video, 0, 0, 96, 96);
                        ctx.drawImage(canvas, 0, 0, 32, 32, 0, 0, 32, 32);

                        const frame = ctx.getImageData(0, 0, 32, 32);
                        const color = getAverageImageColorFromData(frame.data);
                        const contrastColor = getContrastColor(color);

                        ctx.drawImage(video, 0, 0, 96, 96);
                        ctx.drawImage(canvas, 0, 0, 96, 96, 0, 0, 96, 96);

                        const frame96 = ctx.getImageData(0, 0, 96, 96);
                        const color96 = getAverageImageColorFromData(frame96.data);
                        const contrastColor96 = getContrastColor(color96);

                        const svgDelete = previewBox.querySelector("svg");
                        if (svgDelete) {
                            svgDelete.style.fill = contrastColor;
                            if (contrastColor96 === "#000") {
                                svgDelete.parentElement.style.outline = "2px solid rgba(0, 0, 0, 0.1)";
                            } else if (contrastColor96 === "#FFF") {
                                svgDelete.parentElement.style.outline =
                                    "2px solid rgba(256, 256, 256, 0.2)";
                            }
                        }

                        setTimeout(captureColor, 1000);
                    } catch (e) {
                        console.error("Error capturing video color:", e);
                    }
                }
                captureColor();
            }

            function getAverageImageColorFromData(data) {
                let r = 0,
                    g = 0,
                    b = 0,
                    count = 0;
                for (let i = 0; i < data.length; i += 4) {
                    r += data[i];
                    g += data[i + 1];
                    b += data[i + 2];
                    count++;
                }
                r = Math.floor(r / count);
                g = Math.floor(g / count);
                b = Math.floor(b / count);
                return { r, g, b };
            }

            function removeAttachment(index) {
                fileList.splice(index, 1);
                updateFileInput();
                removePreviewBox(index);
                updateIndexes();
            }

            function removePreviewBox(index) {
                const previewParent = document.getElementById("DLP_Attachment_Preview_Parent");
                const previewBox = previewParent.querySelector(`[data-index="${index}"]`);
                let childCount = previewParent.childElementCount;

                if (childCount === 1) {
                    let currentHeight = previewParent.offsetHeight;
                    previewParent.style.transition = "";
                    void previewParent.offsetHeight;
                    previewParent.style.height = `${currentHeight}px`;
                    previewParent.style.opacity = "1";
                    previewParent.style.filter = "blur(0px)";
                    previewParent.style.marginTop = "0px";

                    previewBox.style.height = "100%";

                    previewParent.style.transition = "all 0.4s cubic-bezier(0.16, 1, 0.32, 1)";
                    void previewParent.offsetHeight;
                    previewParent.style.height = "0px";
                    previewParent.style.opacity = "0";
                    previewParent.style.filter = "blur(4px)";
                    previewParent.style.marginTop = "-8px";
                    setTimeout(() => {
                        previewParent.removeChild(previewBox);

                        previewParent.style.height = "";
                        previewParent.style.display = "none";
                    }, 400);
                } else {
                    previewBox.style.marginRight = "0px";
                    previewBox.style.transition = "all 0.4s cubic-bezier(0.16, 1, 0.32, 1)";
                    previewBox.style.width = "0px";
                    previewBox.style.marginRight = "-8px";
                    setTimeout(() => {
                        previewParent.removeChild(previewBox);
                    }, 400);
                }
            }

            function updateIndexes() {
                const previewParent = document.getElementById("DLP_Attachment_Preview_Parent");
                const previewBoxes = previewParent.querySelectorAll(
                    ".DLP_Attachment_Preview_Box_1"
                );
                previewBoxes.forEach((box, newIndex) => {
                    box.dataset.index = newIndex;
                    const svgDelete = box.querySelector("svg");
                    if (svgDelete) {
                        svgDelete.removeEventListener("click", svgDelete.clickHandler);
                        svgDelete.clickHandler = () => removeAttachment(newIndex);
                        svgDelete.addEventListener("click", svgDelete.clickHandler);
                    }
                });
            }

            function updateFileInput() {
                const dataTransfer = new DataTransfer();
                fileList.forEach((file) => dataTransfer.items.add(file));
                document.getElementById("DLP_Attachment_Input_1").files = dataTransfer.files;

                const uploadButton = [...document.querySelectorAll('div[onclick]')].find(d => d.getAttribute('onclick') === "document.getElementById('DLP_Attachment_Input_1').click();");
                if (fileList.length >= 5) {
                    uploadButton.style.pointerEvents = "none";
                    uploadButton.style.opacity = "0.5";
                } else {
                    uploadButton.style.pointerEvents = "";
                    uploadButton.style.opacity = "";
                }
            }

            const DLP_Attachment_Input_1 = document.getElementById("DLP_Main_Box_Divider_11_ID").querySelector("#DLP_Attachment_Input_1");
            DLP_Attachment_Input_1.addEventListener("change", function () {
                let newFiles = Array.from(DLP_Attachment_Input_1.files);
                const availableSlots = 5 - fileList.length;
                if (newFiles.length > availableSlots) {
                    newFiles = newFiles.slice(0, availableSlots);
                }

                appendFiles(newFiles);
                updateDisplayFiles(newFiles);
                updateFileInput();
            });
        }
        setupFileInput();
    }
    setupSupportPage();











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

    let currentQuestionId = null;
    let hasLoggedForCurrent = false;

    async function logOnce(flag, sol, dom) {
        if (!hasLoggedForCurrent) {
            console.log(flag);
            //console.log(sol);
            //console.log(dom);
            hasLoggedForCurrent = true;

            if (false) {
                const payload = {
                    version: versionFormal,
                    random: storageLocal.random16,
                    flag: flag,
                    sol: sol,
                    dom: dom.outerHTML
                };

                const response = await fetch("https://api.duolingopro.net/analytics/legacy", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const responseData = await response.json();
            }
        }
    }

    function updateSolveButtonText(text) {
        document.getElementById("solveAllButton").innerText = text;
    }

    function solving(value) {
        if (value === "start") isAutoMode = true;
        else if (value === "stop") isAutoMode = false;
        else isAutoMode = !isAutoMode;
        updateSolveButtonText(isAutoMode ? systemText[systemLanguage][102] : systemText[systemLanguage][101]);
        solvingIntervalId = isAutoMode ? (function() {
            let initialUrl = window.location.href;
            return setInterval(function() {
                if (window.location.href !== initialUrl) {
                    isAutoMode = false;
                    clearInterval(solvingIntervalId);
                    return;
                } else {
                    solve();
                }
            }, storageLocal.settings.solveSpeed * 1000);
        })() : clearInterval(solvingIntervalId);
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

        let questionKey;
        if (window.sol && window.sol.id) {
            questionKey = window.sol.id;
        } else if (window.sol) {
            // Fallback if no 'id' property: use type + prompt
            questionKey = JSON.stringify({
                type: window.sol.type,
                prompt: window.sol.prompt || ''
            });
        } else {
            questionKey = null;
        }

        if (questionKey !== currentQuestionId) {
            currentQuestionId = questionKey;
            hasLoggedForCurrent = false;
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



    function nextClickFunc() {
  setTimeout(function () {
    try {
      // original nextClickFunc body
      let nextButtonNormal = document.querySelector('[data-test="player-next"]');
      /* ... rest of logic ... */
    } catch (error) {
      console.error("nextClickFunc failed:", error);
    }
  }, 100);
} catch (error) {
    console.log(error);
    One();
}
