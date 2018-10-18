var activeIcons = true;

function toggleIcons() {
    if (activeIcons) {
        stopSkycons();
    } else {
        startSkycons();
    }
    activeIcons = !activeIcons;
}