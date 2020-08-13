console.log("subhome v1.0");

// modules
const http = require("http");
const fs = require("fs");
const got = require("got");
const url = require("url");

// configuration
const port = 3004;

http.createServer(runServer).listen(port);

function runServer(req, res) {
    var ru = url.parse(req.url, true);
    var path = ru.pathname;
    if (path.substring(path.length - 1, path.length) == ".") {path == path.substring(0, path.length - 1)}
    if (ru.pathname == "/api/weather") {
        var query = ru.query.q;
        got("https://nominatim.openstreetmap.org/search.php?format=json&q=" + query).then(function (response) {
            var j = JSON.parse(response.body);
            var lat = j[0].lat;
            var lon = j[0].lon;
            var u = "https://api.weather.gov/points/" + lat + "," + lon;
            got(u).then(function(response) {
                var k = JSON.parse(response.body);
                got(k.properties.forecast).then(function(response) {
                    res.writeHead(200, {
                        "Access-Control-Allow-Region": "*",
                        "Content-Type": "application/json"
                    })
                    res.end(JSON.stringify(JSON.parse(response.body).properties));
                })
            }).catch((e) => {
                var d = JSON.stringify({
                    "err": e.message
                })
                res.writeHead(404, {
                    "Access-Control-Allow-Region": "*",
                    "Content-Type": "application/json"
                })
                res.end(d);
            })
        })
    }
}