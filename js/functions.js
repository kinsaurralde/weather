function initial() {
    startTime();
    skycons = new Skycons({ "color": "black" });

    skycons.add("load-current", Skycons.LOADING);
    skycons.add("load-low", Skycons.LOADING);
    skycons.add("load-high", Skycons.LOADING);
    skycons.play();

    setInterval(function(){ refresh(); }, 3600000); // 3.6e+6 milliseconds is one hour
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function lightDark() {
    if (light) {

        document.body.style.color = "rgb(255,255,255)";
        document.body.style.backgroundColor = "rgb(0,0,0)";

        document.getElementById("left-theme").id = "right-theme";

        var html = document.getElementsByTagName('html')[0];
        html.style.cssText = " --light-opacity: 0; --dark-opacity: 1; --button-slider-color: rgb(0,0,0); --button-color: rgb(30,30,30);";

        document.getElementById("light-theme").id = "dark-theme";

        skycons.color = "white";

        light = false;
    } else {

        document.body.style.color = "rgb(0,0,0)";
        document.body.style.backgroundColor = "rgb(255,255,255)";

        document.getElementById("right-theme").id = "left-theme";

        var html = document.getElementsByTagName('html')[0];
        html.style.cssText = " --light-opacity: 1; --dark-opacity: 0; --button-slider-color: rgb(255,255,255); --button-color: rgb(225,225,225);";

        document.getElementById("dark-theme").id = "light-theme";

        skycons.color = "black";

        light = true;
    }
}

function showFooter() {
    if (autoHide) {
        try {
            document.getElementById("footer").style.opacity = 1;
        } catch(e) {
            document.getElementById("footer-expanded").style.opacity = 1;
        }
        document.getElementById("left-hide").id = "right-hide";
        autoHide = false;
    } else {
        try {
            document.getElementById("footer").style.opacity = 0;
        } catch(e) {
            document.getElementById("footer-expanded").style.opacity = 0;
        }
        document.getElementById("right-hide").id = "left-hide";
        footerDisplayToggle("down");
        autoHide = true;
    }
}

function page(num) {
    if (num == 0) {
        document.getElementById("secondary").style.top = "70vh";
        document.getElementById("daily").style.top = "25vh"
    } else {
        document.getElementById("secondary").style.top = "62vh";
        document.getElementById("daily").style.top = "12vh"
    }

    for (i = 0; i < 8; i++) {
        document.getElementById("container-"+i).style.display = "none";
    }

    document.getElementById("container-" + num).style.display = "flex";
}

function dailyExpand(num) {
    for (i = 1; i < 8; i++) {
        document.getElementById("d-"+i).className = "secondary-box";
    }
    try {
        document.getElementById("d-"+num).className = "secondary-box-wide";
    } catch(e) {

    }
}

function fullScreen() {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        exitFullscreen();
    } else {
        launchIntoFullscreen(document.documentElement);
        if (!autoHide) {
            setTimeout(function () { showFooter(); }, 1000);
        }
    }
}

function launchIntoFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
    footerDisplayToggle("down");
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

function hover(hovered) {
    if (hovered) {
        document.getElementById("footer").style.opacity = 1;
    }
    if (!hovered && autoHide) {
        document.getElementById("footer").style.opacity = 0;
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            showPosition(position.coords.latitude, position.coords.longitude);
        }, function () {
            showPosition(38.5376851,-121.7580314);
        });
    } else {
        coords.innerHTML = "---";
    }
}

function showPosition(x, y) {
    getCityName(x, y);
    latitude = x;
    longitude = y;
    x = x.toFixed(3);
    y = y.toFixed(3);
    coords.innerHTML = "<br>" + x + " , " + y;
}

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    // add a zero in front of numbers<10
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('main-time').innerHTML = h + ":" + m + ":" + s;
    t = setTimeout(function () { startTime() }, 500);
}

function locationDisplay(type) {
    console.log("City",city);
    console.log("address",address);
    if (type == "city") {
        document.getElementById("city").innerHTML = city;
    } else {
        document.getElementById("city").innerHTML = address;
    }
}

function drawSkycons(icons) {
    skycons.add("low-icon", Skycons.LOADING);
    skycons.add("current-icon", Skycons.LOAING);
    skycons.add("high-icon", Skycons.LOADING);
    skycons.add("icon-day1", Skycons.LOADING);
    for (i = 1; i < 8; i++) {
        skycons.add("icon-day-" + i, Skycons.LOADING);
    }
    for (i = 0; i < 24; i++) {
        skycons.add("icon-hour-" + i, Skycons.RAIN);
    }

    try {
        skycons.set("current-icon", icons[0]);
    } catch(e) { }
    try {
        skycons.set("low-icon", icons[1]);
    } catch(e) { }
    try {
        skycons.set("high-icon", icons[2]);
    } catch(e) { }
    try {
        skycons.set("icon-day1", icons[3]);
    } catch(e) { }
    for (i = 1; i < 8; i++) {
        try {
            skycons.set("icon-day-" + i, icons[i + 10]);
        } catch(e) {

        }
    }
    for (i = 20; i < 44; i++) {
        try {
            skycons.set("icon-hour-" + Math.round(i-20), icons[i]);
        } catch(e) {
            console.log("ICON ERROR: drawSkycons",i-20,icons[i],e);
        }
    }
    startSkycons();
}

function stopSkycons() {
    skycons.pause();
    try {
        document.getElementById("left-active").id = "right-active";
    } catch(e) {

    }
}

function startSkycons() {
    skycons.play();
    try {
        document.getElementById("right-active").id = "left-active";
    } catch(e) {

    }
}

function footerDisplayToggle(request) {
    if (request == "down") {
        try {
            down();
        } catch(e) {

        }
        footerExpanded = false;
    } else {
        if (footerExpanded) {
            down();
        } else {
            up();
            if (autoHide) {
                showFooter();
            }
        }
        footerExpanded = !footerExpanded;
    }


    function up() {
        document.getElementById("footer").id = "footer-expanded";
        document.getElementById("arrow-1").value = "\u2b9f";
        document.getElementById("arrow-2").value = "\u2b9f";
        document.getElementById("footer-row-1").style.display = "flex";
        document.getElementById("footer-row-2").style.display = "flex";
    }

    function down() {
        document.getElementById("footer-expanded").id = "footer";
        document.getElementById("arrow-1").value = "\u2b9d";
        document.getElementById("arrow-2").value = "\u2b9d";
        document.getElementById("footer-row-1").style.display = "none";
        document.getElementById("footer-row-2").style.display = "none";
    }
}

function refresh() {
    getLocation();
}

function newLocation() {
    x = document.getElementById("latitude").value;
    y = document.getElementById("longitude").value;
    showPosition(x,y);
}

function presetLocation(location) {
    if (location == "benicia") {
        showPosition(38.0820625,-122.17043749999999);
    }
    if (location == "davis") {
        showPosition(38.5376851,-121.7580314);
    }
}