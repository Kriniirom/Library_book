import express from "express";
import bodyParser from "body-parser";
import pg  from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));


const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'library',
    password: 'irom@9863429955',
    port: 5432,
});

db.connect();

const app = express();
const port = 3000;

app.use(express.static('public'));
 app.set('view engine', 'ejs');
 app.set('views', __dirname + '/views');

 app.use(bodyParser.urlencoded({extended: true}))
 app.use(bodyParser.json());

//home page 
app.get('/', (req, res) => {
    res.render('booking.ejs');
});
app.get('/facility', (req, res) => {
    res.render('facility.ejs');
});
//submit personal details and show seat number
app.get('/detail', (req, res) => {
    res.render('detail.ejs');
});

app.post('/submit-details', async(req, res) => {
try{
    console.log('Received data:', req.body);
    const name = req.body.name;
    const phone = req.body.phone;
    const current_address = req.body.current_address;
    const perminent_address = req.body.perminent_address;
    console.log('Inserting:', { name, phone, current_address, perminent_address });
    await db.query('INSERT INTO custumer_detail( phone_number, current_address, perminent_address,name) VALUES ($1, $2, $3, $4)', [phone, current_address, perminent_address, name]);
    console.log('Data inserted successfully!');   
}
    catch (error) {
        console.error('Error inserting data:', error);
    }
res.render('seat-number.ejs');
});


app.post('/seat-book', async(req, res) => {
    try {
        const seat_number  = req.body.seatNumber; 
        console.log("seat_number:", seat_number);
        res.render('choose-month.ejs');
    } catch (error) {
        console.error('Error inserting seat number:', error);
        res.status(500).send('Error inserting seat number');
    }
});


app.post("/select-plan", (req, res) => {

    const selectedPlan = req.body.plan;
    const seat_number  = req.body.seatNumber; 
    let amount;
    let planName;

    switch(selectedPlan){

        case "1month":

            amount = 899;
            planName = "1 Month Plan";

            break;

        case "3month":

            amount = 699*3;
            planName = "3 Month Plan";

            break;

        case "12month":

            amount = 599*12;
            planName = "12 Month Plan";

            break;

        default:
            res.send("Invalid input");
    }


    // generate UPI link

    const upiLink =

    `upi://pay?pa=krinivash-2@okicici` +
    `&pn=Krinivash%20Irom` +
    `&am=${amount}` +
    `&cu=INR` +
    `&tn=${planName}`;


    // send to payment page

    res.render("payment", {

        upiLink,

        amount,

        planName

    });
    console.log("seat_number:", seat_number);   

});

app.listen(port,"0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${port}`);
});