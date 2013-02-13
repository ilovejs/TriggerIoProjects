/*
var weather = {
    "current_observation": {
        "display_location": {
            "full": "San Francisco, CA"
        },
        "observation_time":"Last Updated on September 20, 3:50 AM PDT",
        "weather": "Mostly Cloudy",
        "temp_f": 54.4,
        "temp_c": 12.4,
        "relative_humidity":"89%",
        "wind_string":"From the WNW at 4.0 MPH",
        "icon_url":"http://icons-ak.wxug.com/i/c/k/nt_mostlycloudy.gif"
    },
    "forecast": {
        "simpleforecast": {
            "forecastday": [
                { "date": { "weekday_short": "Thu" },
                  "period": 1,
                  "high": { "fahrenheit": "64", "celsius": "18" },
                  "low": { "fahrenheit": "54", "celsius": "12" },
                  "conditions": "Partly Cloudy",
                  "icon_url":"http://icons-ak.wxug.com/i/c/k/partlycloudy.gif" },
                { "date": { "weekday_short": "Fri" },
                  "period": 2,
                  "high": { "fahrenheit": "70", "celsius": "21" },
                  "low": { "fahrenheit": "54", "celsius": "12" },
                  "conditions": "Mostly Cloudy",
                  "icon_url":"http://icons-ak.wxug.com/i/c/k/mostlycloudy.gif" },
                { "date": { "weekday_short": "Sat" },
                  "period": 3,
                  "high": { "fahrenheit": "70", "celsius": "21" },
                  "low": { "fahrenheit": "52", "celsius": "11" },
                  "conditions": "Partly Cloudy",
                  "icon_url":"http://icons-ak.wxug.com/i/c/k/partlycloudy.gif" }
            ]
        }
    }
};
 */
function populateWeatherConditions (weather) {
    var tmpl, output;

    emptyContent();

    console.log("[populateWeatherConditions] beginning populating weather conditions");

    //city info
    tmpl = $("#forecast_information_tmpl").html();
    output = Mustache.to_html(tmpl, weather.current_observation);
    $("#forecast_information").append(output);
    console.log("[populateWeatherConditions] finished populating forecast information");

    //current city weather
    tmpl = $("#current_conditions_tmpl").html();
    output = Mustache.to_html(tmpl, weather.current_observation);
    $("#current_conditions").append(output);
    console.log("[populateWeatherConditions] finished populating current conditions");

    //forecast weather
    tmpl = $("#forecast_conditions_tmpl").html();
    //bind template with json file
    output = Mustache.to_html(tmpl, weather.forecast.simpleforecast);
    $("#forecast_conditions table tr").append(output);
    console.log("[populateWeatherConditions] finished populating forecast conditions");

    console.log("[populateWeatherConditions] finished populating weather conditions");
};

function getWeatherInfo(location, callback) {
    var api_key = "9f6c189a29cce772";           //API KEY
    console.log("[getWeatherInfo] getting weather for for " + location);
    $.getJSON("http://api.wunderground.com/api/" + api_key + "/conditions/forecast/q/" + location + ".json",
        function (data) {
            console.log("[getWeatherInfo] success");
            callback(data);
        }
    );
};

function emptyContent() {
    console.log("[emptyContent] removing old data");
    $("#forecast_information").empty();
    $("#current_conditions").empty();
    $("#forecast_conditions table tr").empty();

    console.log("[emptyContent] finished emptying content");
};

//http://api.wunderground.com/api/9f6c189a29cce772/conditions/forecast/q/NW/SYDNEY.json
$(function () {
//    populateWeatherConditions(weather);
//    getWeatherInfo("NW/SYDNEY", populateWeatherConditions);
    var cities = [
        { name: "London", code: "UK/London" },
        { name: "San Francisco", code: "CA/San_Francisco" },
        { name: "Cape Town", code: "ZA/Cape_Town" },
        { name: "Barcelona", code: "ES/Barcelona" },
        { name: "Boston", code: "NY/Boston" },
        { name: "New York", code: "NY/New_York" },
        { name: "Washington DC", code: "DC/Washington" },
        { name: "Tampa", code: "FL/Tampa" },
        { name: "Houston", code: "AL/Houston" },
        { name: "Montreal", code: "CYUL" },
        { name: "Los Angeles", code: "CA/Los_Angeles" },
        { name: "Miami", code: "FL/Miami" },
        { name: "West Palm Beach", code: "FL/West_Palm_Beach" }
    ];
    //build menu
    cities.forEach(function(city) {
        $("#city_menu").append("<option value='" + city.code + "'>" + city.name + "</option>");
    });
    $("#city_menu").change(function() {
        var city = $("#city_menu option:selected").val();
//        forge.prefs.set("city", city);
        localStorage.setItem("city",city);
        getWeatherInfo(city, populateWeatherConditions);
    });

    var hascity = localStorage.getItem("city");
    if (hascity) {         // user has previously selected a city
        var city = hascity;
    } else {                // no previous selection
        var city = "CA/San_Francisco";
        console.log("failed when retrieving city preferences");
//        $("#city_menu").val("CA/San_Francisco"); // default;
    }
    $("#city_menu").val(city);
    $("#city_menu").change();
});
