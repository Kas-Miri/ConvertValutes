
const express = require("express");
const requestAPI = require("request");
const hbs = require("hbs");

const app = express();
const port = 3000;

app.set('view engine', 'hbs');
app.set("view options", { layout: "layout" });
hbs.registerHelper("inc", function (value) {
    return parseInt(value) + 1;
});
hbs.registerHelper("fixed", function (value) {
    return value.toFixed(3);
});

app.get("/", (request, response) => {
    const url = "https://www.cbr-xml-daily.ru/daily_json.js";

    requestAPI(url, (error, request2, data) => {
        let model = {
            Valute: {}
        };


        if (error) console.log(error);
        else {
            model = JSON.parse(data);

            model.Valute["RUS"] = {
                ID: "R0",
                NumCode: "0",
                CharCode: "RUS",
                Nominal: 1,
                Name: "Российский рубль",
                Valute: 1,
                Previous: 1,
                Value: 1
            };

            for (const key in model.Valute) {
                const element = model.Valute[key];

                element.Value = element.Value / element.Nominal;
                element.DeValue = 1 / element.Value;
            }
        }

        response.render("main", model);
    });
});

app.get("/*", (request, response) => {
    response.redirect("/");
});

app.listen(port, () => {
    console.log(`Посмотреть на деньги тут -> http://localhost:${port}/`);
});