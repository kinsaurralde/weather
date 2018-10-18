var data;

function getJSON(url) { // From http://youmightnotneedjquery.com/
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            fullData = JSON.parse(request.responseText);
            data = JSON.parse(fullData["body"]);
            console.log("\n\n\nNew Data Recieved\n");
            console.log("Full Data:", data);
            work(data)
        } else { // We reached our target server, but it returned an error
            console.log("\n\nERROR: Wrong status code\n\n")
        }
    };

    request.onerror = function () {
        // There was a connection error of some sort
        console.log("\n\nERROR: Connection Error\n\n");
    };

    request.send();
}

function getCityName(x, y) { // From http://youmightnotneedjquery.com/
    url = "https://99mk62yyl5.execute-api.us-west-1.amazonaws.com/prod?coords=" + x + "," + y;

    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            full_data = JSON.parse(request.responseText);
            data = JSON.parse(full_data["body"]);
            city = data["results"][0]["address_components"][2]["short_name"];
            address = data["results"][0]["formatted_address"];
            if (city.length > 8) {
                city = city.substring(0,8)+" ...";
            }
            if (address.length > 40) {
                address = address.substring(0,40)+" ...";
            }

            console.log("Location Data:", data);
            document.getElementById("city").innerHTML = city;
            update();
        } else { // We reached our target server, but it returned an error
            console.log("\n\nERROR: Wrong status code\n\n")
        }
    };

    request.onerror = function () {
        // There was a connection error of some sort
        console.log("\n\nERROR: Connection Error\n\n");
    };

    request.send();
}

function work(data) {
    var dailyDates = new Array(8);
    var dailyIcons = new Array(8);
    var dailyLow = new Array(8);
    var dailyHigh = new Array(8);
    var icons = new Array(50);
    var hourlyDates = new Array(24);
    var hourlyIcons = new Array(24);
    var hourlyTemps = new Array(24);

    var currentData = data["currently"];
    var currentTemp = currentData["temperature"];
    var currentIcon = currentData["icon"];
    var currentTime = currentData["time"];
    var dailyData = data["daily"]["data"];
    var hourlyData = data["hourly"]["data"];
    var lowTemp = dailyData[0]["temperatureLow"];
    var highTemp = dailyData[0]["temperatureHigh"];
    var lowTime = dailyData[0]["temperatureLowTime"];
    var highTime = dailyData[0]["temperatureHighTime"];
    var lowTempDay1 = dailyData[1]["temperatureLow"];
    var highTempDay1 = dailyData[1]["temperatureHigh"];
    var lowTimeDay1 = dailyData[1]["temperatureLowTime"];
    var highTimeDay1 = dailyData[1]["temperatureHighTime"];
    var currentRainChance = currentData["precipProbability"];
    var iconDay1 = dailyData[1]["icon"];


    printData();

    getTimes();

    setTemps();

    setHTML();

    getIcons();

    drawSkycons(icons);

    function printData() {
        console.log("Daily Data:", dailyData);
        console.log("Hourly Data:", hourlyData);
        console.log("Current:", currentData);
        console.log("Current Temperature:", currentTemp, "@", currentTime);
        console.log("Low Temperature:", lowTemp, "@", lowTime);
        console.log("High Temperature:", highTemp, "@", highTime);
        console.log("Current Precip Chance:", currentRainChance);
    }

    function setHTML() {
        document.getElementById("low-temp").innerHTML = Math.round(lowTemp);
        document.getElementById("low-time").innerHTML = formattedLowDate;
        document.getElementById("current-temp").innerHTML = Math.round(currentTemp);
        document.getElementById("current-time").innerHTML = formattedCurrentDate;
        document.getElementById("rain-chance").innerHTML = currentRainChance;
        document.getElementById("high-temp").innerHTML = Math.round(highTemp);
        document.getElementById("high-time").innerHTML = formattedHighDate;
        document.getElementById("low-temp-day-1").innerHTML = Math.round(lowTempDay1);
        document.getElementById("low-time-day-1").innerHTML = formattedLowDateDay1;
        document.getElementById("high-temp-day-1").innerHTML = Math.round(highTempDay1);
        document.getElementById("high-time-day-1").innerHTML = formattedHighDateDay1;
        document.getElementById("next-day-date").innerHTML = dailyDates[1];
        document.getElementById("latitude").value = Math.round(latitude*1000)/1000;
        document.getElementById("longitude").value = Math.round(longitude*1000)/1000;
        for (i = 1; i < 8; i++) {
            document.getElementById("date-day-" + i).innerHTML = dailyDates[i];
            document.getElementById("d-l-"+i).innerHTML = dailyLow[i];
            document.getElementById("d-h-"+i).innerHTML = dailyHigh[i];
        }
        for (i = 0; i < 24; i++) {
            document.getElementById("date-hour-" + i).innerHTML = hourlyDates[i];
            document.getElementById("h-t-"+i).innerHTML = hourlyTemps[i];
        }
    }

    function setTemps() {
        for (i = 0; i < 8; i++) {
            try {
                dailyLow[i] = Math.round(dailyData[i]["temperatureLow"]);
                dailyHigh[i] = Math.round(dailyData[i]["temperatureHigh"]);
            } catch(e) {
                dailyLow[i] = "--";
                dailyHigh[i] = "--";
            }
        }
        for (i = 0; i < 24; i++) {
            try {
                hourlyTemps[i] = Math.round(hourlyData[i]["temperature"]);
            } catch(e) {
                hourlyTemps[i] = "--";
            }
        }
    }

    function getTimes() {
        var currentDate = new Date(currentTime * 1000);
        currentDate = currentDate.toString().split(" ");
        formattedCurrentDate = currentDate[0] + " " + currentDate[1] + " " + currentDate[2] + " " + currentDate[4];

        var lowDate = new Date(lowTime * 1000);
        lowDate = lowDate.toString().split(" ");
        formattedLowDate = lowDate[0] + " " + lowDate[1] + " " + lowDate[2] + " " + lowDate[4];

        var highDate = new Date(highTime * 1000);
        highDate = highDate.toString().split(" ");
        formattedHighDate = highDate[0] + " " + highDate[1] + " " + highDate[2] + " " + highDate[4];

        var lowDateDay1 = new Date(lowTimeDay1 * 1000);
        lowDateDay1 = lowDateDay1.toString().split(" ");
        formattedLowDateDay1 = lowDateDay1[0] + " " + lowDateDay1[1] + " " + lowDateDay1[2] + " " + lowDateDay1[4];

        var highDateDay1 = new Date(highTimeDay1 * 1000);
        highDateDay1 = highDateDay1.toString().split(" ");
        formattedHighDateDay1 = highDateDay1[0] + " " + highDateDay1[1] + " " + highDateDay1[2] + " " + highDateDay1[4];

        for (i = 0; i < 8; i++) {
            var dateDay1 = new Date(dailyData[i]["temperatureHighTime"] * 1000);
            dateDay1 = dateDay1.toString().split(" ");
            dailyDates[i] = dateDay1[0] + " " + dateDay1[1] + " " + dateDay1[2];
        }

        for (i = 0; i < 24; i++) {
            var dateDay1 = new Date(hourlyData[i]["time"] * 1000);
            dateDay1 = dateDay1.toString().split(" ");
            hourlyDates[i] = dateDay1[4];
        }

    }

    function getIcons() {
        for (i = 0; i < hourlyData.length; i++) {
            if (hourlyData[i]["time"] == lowTime) {
                lowIcon = hourlyData[i]["icon"];
            }
            if (hourlyData[i]["time"] == highTime) {
                highIcon = hourlyData[i]["icon"];
            }
        }
        for (i = 0; i < dailyData.length; i++) {
            dailyIcons[i] = dailyData[i]["icon"]; 
        }
        for (i = 0; i < hourlyData.length; i++) {
            hourlyIcons[i] = hourlyData[i]["icon"]; 
        }
        try {
            icons[0] = currentIcon;
        } catch(e) {
            icons[0] = "clear-day";
        }
        try {
            icons[1] = lowIcon;
        } catch(e) {
            icons[1] = "clear-day";
        }
        try {
            icons[2] = highIcon;
        } catch(e) {
            icons[2] = "clear-day";
        }
        try {
            icons[3] = iconDay1;
        } catch(e) {
            icons[3] = "clear-day";
        }
        for (i = 10; i < 18;i++) {
            try {
                icons[i] = dailyIcons[i-10];
            } catch(e) {
                console.log("ICON ERROR: getIcons daily",i);
            }
        }
        for (i = 20; i < 44;i++) {
            try {
                icons[i] = hourlyIcons[i-20];
            } catch(e) {
                icons[i] = "clear-day";
                console.log("ICON ERROR: getIcons",i);
            }
        }
    }
}