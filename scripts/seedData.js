const sequelize = require('../config/db');
const User = require('../models/User');
const Trip = require('../models/Trip');
const Reservation = require('../models/Reservation');
const Payment = require('../models/Payment');
const Document = require('../models/Document');
const bcrypt = require('bcrypt');

async function seedDatabase() {
  try {
    await sequelize.sync({ force: true }); // ⚠️ reset total

    // 👤 Utilisateurs
    const hashedPassword = await bcrypt.hash('test1234', 10);
    const [admin, user1, user2] = await Promise.all([
      User.create({ username: 'admin', email: 'admin@example.com', password: hashedPassword, role: 'admin' }),
      User.create({ username: 'alice', email: 'alice@example.com', password: hashedPassword }),
      User.create({ username: 'bob', email: 'bob@example.com', password: hashedPassword }),
      User.create({ username: 'michel', email: 'michel@example.com', password: hashedPassword }),
      User.create({ username: 'pedro', email: 'pedro@example.com', password: hashedPassword }),
    ]);

    // 🧳 Voyages
    const [trip1, trip2] = await Promise.all([
      Trip.create({
        lieux: 'Maroc',
        dateDeb: new Date('2025-07-01'),
        dateFin: new Date('2025-07-10'),
        nb_de_places: 10,
        statut: 'DISPONIBLE',
        type_doc_requis: ['passeport'],
        moyens_transport: 'BATEAU',
        img_path:'images/maroc.jpg'
      }),
      Trip.create({
        lieux: 'Italie',
        dateDeb: new Date('2025-08-01'),
        dateFin: new Date('2025-08-15'),
        nb_de_places: 5,
        statut: 'DISPONIBLE',
        type_doc_requis: ["carte_d'identité"],
        moyens_transport: 'BATEAU',
        img_path:'images/italie.jpg'
      }),
      Trip.create({
        lieux: 'Canada',
        dateDeb: new Date('2025-07-01'),
        dateFin: new Date('2025-07-15'),
        nb_de_places: 15,
        statut: 'DISPONIBLE',
        type_doc_requis: ["passeport"],
        moyens_transport: 'AVION',
        img_path:'images/canada.jpg'
      }),
      Trip.create({
        lieux: 'Prague',
        dateDeb: new Date('2025-09-01'),
        dateFin: new Date('2025-09-15'),
        nb_de_places: 18,
        statut: 'DISPONIBLE',
        type_doc_requis: ["passeport"],
        moyens_transport: 'CAR',
        img_path:'images/prague.jpg'
      }),
      Trip.create({
        lieux: 'Londres',
        dateDeb: new Date('2025-06-21'),
        dateFin: new Date('2025-07-15'),
        nb_de_places: 12,
        statut: 'ANNULÉ',
        type_doc_requis: ["identité"],
        moyens_transport: 'TRAIN',
        img_path:'images/londres.jpg'
      }),
      Trip.create({
        lieux: 'Berlin',
        dateDeb: new Date('2025-09-21'),
        dateFin: new Date('2025-09-15'),
        nb_de_places: 16,
        statut: 'ANNULÉ',
        type_doc_requis: ["identité"],
        moyens_transport: 'TRAIN',
        img_path:'images/berlin.jpg'
      }),
      Trip.create({
        lieux: 'New-york',
        dateDeb: new Date('2026-06-21'),
        dateFin: new Date('2026-07-15'),
        nb_de_places: 21,
        statut: 'ANNULÉ',
        type_doc_requis: ["visa"],
        moyens_transport: 'AVION',
        img_path:'images/new-york.jpg'
      }),
      Trip.create({
        lieux: 'Paris',
        dateDeb: new Date('2026-06-22'),
        dateFin: new Date('2026-07-14'),
        nb_de_places: 23,
        statut: 'DISPONIBLE',
        type_doc_requis: [],
        moyens_transport: 'AVION',
        img_path:'images/paris.jpg'
      }),
      Trip.create({
        lieux: 'Londres',
        dateDeb: new Date('2026-06-24'),
        dateFin: new Date('2026-07-14'),
        nb_de_places: 12,
        statut: 'DISPONIBLE',
        type_doc_requis: [],
        moyens_transport: 'AVION',
        img_path:'images/londres.jpg'
      }),
      Trip.create({
        lieux: 'Berlin',
        dateDeb: new Date('2025-11-12'),
        dateFin: new Date('2025-11-07'),
        nb_de_places: 5,
        statut: 'DISPONIBLE',
        type_doc_requis: ["identité"],
        moyens_transport: 'AVION',
        img_path:'images/berlin.jpg'
      }),
      Trip.create({
        lieux: 'Corse',
        dateDeb: new Date('2026-06-22'),
        dateFin: new Date('2025-07-23'),
        nb_de_places: 5,
        statut: 'DISPONIBLE',
        type_doc_requis: ["identité"],
        moyens_transport: 'AVION',
        img_path:'images/corse.jpg'
      }),
    ]);

    // 📝 Réservations
    const [resa1, resa2] = await Promise.all([
      Reservation.create({
        userId: user1.id,
        id_trip: trip1.id,
        prix: 300,
        statut: 'réservé',
        documents_ok : true
      }),
      Reservation.create({
        userId: user2.id,
        id_trip: trip2.id,
        prix: 250,
        statut: 'en_attente_de_validation',
        documents_ok: true
      })
    ]);

    // 💳 Paiements
    await Promise.all([
      Payment.create({
        id_user: user1.id,
        id_registration: resa1.id,
        amount: 100,
        status: 'acompte'
      }),
      Payment.create({
        id_user: user2.id,
        id_registration: resa2.id,
        amount: 250,
        status: 'total'
      })
    ]);

    // 📄 Documents
    await Promise.all([
      Document.create({
        userId: user1.id,
        type: 'passeport',
        filename: 'alice_passeport.pdf'
      }),
      Document.create({
        userId: user2.id,
        type: "carte_d'identité",
        filename: 'bob_carteid.png'
      })
    ]);

    console.log(' Base de données peuplée avec succès');
    process.exit();
  } catch (err) {
    console.error(' Erreur lors du peuplement de la base :', err);
    process.exit(1);
  }
}

seedDatabase();
