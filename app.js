require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const tripRoutes = require('./routes/tripRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); 
const DocumentRoutes = require('./routes/documentsRoutes'); 
const RegistrationRoutes = require('./routes/registrationRoutes');
const sequelize = require('./config/db');
const path = require('path');
const cookieParser = require('cookie-parser');
const setAuth = require('./middlewares/setAuth');
const { authMiddleware } = require('./middlewares/authMiddleware');
const routes = require('./routes/routes'); 
const methodOverride = require('method-override');
const cron = require('node-cron');
const tripService = require('./services/tripService')
const uploadsDir = path.join(__dirname, 'public', 'uploads');
const fs = require('fs');
const session = require('express-session');
const flash = require('connect-flash');



const app = express();



// MET A JOUR LES STATUTS DES VOYAGES EN FONCTION DES DATES // TODO : route > controller > service ( const tripService = require('./services/tripService') !!! pas bien )
cron.schedule('0 0 * * *', () => {
  console.log("⏰ Mise à jour quotidienne des statuts de voyage");
  tripService.updateTripsStatut();
});

// upload
fs.mkdirSync(uploadsDir, { recursive: true });


// MIDDLEWARES
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(setAuth);

app.use(methodOverride('_method'));



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(express.static('public'));


// DB
sequelize.sync({ alter: true }) 
  .then(() => console.log("Base de données synchronisée"))
  .catch(err => console.error("Erreur de connexion BDD :", err));




// ROUTES 
app.use('/', routes) 
app.use('/api', userRoutes); 
app.use('/api/trips', tripRoutes); 
app.use('/api/payments', paymentRoutes); 
app.use('/api/documents', DocumentRoutes);
app.use('/api/registrations', RegistrationRoutes);


app.listen(3000, () => {
  console.log('🚀 Serveur en écoute sur http://localhost:3000');
});
