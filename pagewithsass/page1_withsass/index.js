import express from "express";
import bodyParser from "body-parser";

import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

var userIsAuth = false;

app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.sendFile("C:/Users/Dell/OneDrive/Desktop/complete_f1soft/pagewithsass/page1_withsass/login.html");
})
function checkpass(req, res, next) {
    const password = req.body["Password"];
    const email = req.body["Email"]
    if (password === "admin" && email === "admin@admin.com") {
        userIsAuth = true;
    } next();

}

app.use(checkpass);

app.post("/check", (req, res) => {
    if (userIsAuth) {
        res.sendFile("C:/Users/Dell/OneDrive/Desktop/complete_f1soft/dashboard/dashboard.html");
    } else {
        res.sendFile("C:/Users/Dell/OneDrive/Desktop/complete_f1soft/pagewithsass/page1_withsass/login.html");
    }
});


app.listen(port, () => {
    console.log('listening on port');
});




