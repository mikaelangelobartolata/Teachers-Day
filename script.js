const music = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

let wantPlaying = true;

music.volume = 0.5;


function updateMusicButton() {

    const icon = musicToggle.querySelector(".music-icon");
    const label = musicToggle.querySelector(".music-label");

    if (!music.paused) {

        icon.textContent = "🔊";
        label.textContent = "Music on";
        musicToggle.setAttribute("aria-label", "Turn music off");

    } else if (wantPlaying) {

        // Autoplay was blocked, waiting for first interaction
        icon.textContent = "🎵";
        label.textContent = "Tap to play";
        musicToggle.setAttribute("aria-label", "Play music");

    } else {

        icon.textContent = "🔇";
        label.textContent = "Music off";
        musicToggle.setAttribute("aria-label", "Turn music on");

    }

}

music.addEventListener("play", updateMusicButton);
music.addEventListener("pause", updateMusicButton);

const unlockEvents = ["click", "keydown", "touchend"];

function unlockMusic(event) {
    if (event.target.closest && event.target.closest("#musicToggle")) {
        return;
    }

    if (wantPlaying && music.paused) {
        music.play().catch(function () {});
    }

}

function armUnlock() {

    unlockEvents.forEach(function (name) {
        document.addEventListener(name, unlockMusic);
    });

}

function disarmUnlock() {

    unlockEvents.forEach(function (name) {
        document.removeEventListener(name, unlockMusic);
    });

}

music.addEventListener("playing", disarmUnlock);
music.play().then(updateMusicButton).catch(function () {

    updateMusicButton();
    armUnlock();

});
musicToggle.addEventListener("click", function () {

    if (music.paused) {

        wantPlaying = true;
        music.play().catch(function () {});

    } else {

        wantPlaying = false;
        music.pause();

    }

    updateMusicButton();

});

const landingView = document.getElementById("landingView");
const messageView = document.getElementById("messageView");


function showView(view) {

    const showMessage = (view === "message");

    landingView.hidden = showMessage;
    messageView.hidden = !showMessage;

    document.title = showMessage
        ? "Happy Teacher's Day 💌"
        : "Happy Teacher's Day 💐";

    window.scrollTo(0, 0);

}


function openMessage(name, message) {

    // Remember the selection (so a refresh keeps the message)
    try {
        localStorage.setItem("teacherName", name);
        localStorage.setItem("teacherMessage", message);
    } catch (e) {}

    document.getElementById("teacherName").textContent = name;
    document.getElementById("teacherMessage").textContent = message;

    showView("message");
    history.pushState({ view: "message" }, "", "#message");

}


function goBack() {

    if (history.state && history.state.view === "message") {

        history.back();

    } else {

        history.replaceState(null, "", window.location.pathname);
        showView("landing");

    }

}
window.addEventListener("popstate", function () {

    showView(
        window.location.hash === "#message" ? "message" : "landing"
    );

});

if (window.location.hash === "#message") {

    let name = null;
    let message = null;

    try {
        name = localStorage.getItem("teacherName");
        message = localStorage.getItem("teacherMessage");
    } catch (e) {}

    if (name && message) {

        document.getElementById("teacherName").textContent = name;
        document.getElementById("teacherMessage").textContent = message;

        history.replaceState({ view: "message" }, "", "#message");
        showView("message");

    } else {

        history.replaceState(null, "", window.location.pathname);

    }

}
