
const Document = require('../models/Document');
const Trip = require('../models/Trip');
const User = require('../models/User');
const Registration = require('../models/Reservation');

const allowedTypes = [
  "carte_d'identité",
  'passeport',
  'carnet_de_santé',
  'visa',
  'autorisation_parentale',
  'justificatif_domicile'
];


//ajoute un document à l'utilisateur courant
exports.submitDocument = async (req, res) => {
  try {
    const user = req.user;
    const registrationId = req.params.registrationId;
    const { type } = req.body;
    const file = req.file;

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: 'Type de document invalide' });
    }

    const newDoc = await Document.create({
      id_user: user.id,
      type,
      file_path: file ? file.path : null,
      upload_date: new Date()
    });

    res.status(201).json(newDoc);
  } catch (err) {
    console.error('Erreur upload document:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// obtenir tout les documents du userCurrent
exports.getMyDocuments = async (req, res) => {
  try {
    const user = req.user;
    const docs = await Document.findAll({ where: { id_user: user.id } });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// avoir tout les doc requis pour un voyage
exports.getAllRequiredDocumentTypes = async (req, res) => {
  try {
    const trips = await Trip.findAll({ attributes: ['id', 'titre', 'type_doc_requis'] });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


// avoir tout les documents des membre inscrit pour un voyage
exports.getDocumentsByTrip = async (req, res) => {
  try {
    const tripId = req.params.id;

    const registrations = await Registration.findAll({ where: { id_trip: tripId } });
    const userIds = registrations.map(r => r.id_membre);

    const documents = await Document.findAll({
      where: { id_user: userIds }
    });

    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.showUsersDocuments = async (req, res) => {
  const users = await User.findAll({
    include: [{ model: Document,
    as: 'documents' }]
  });
  res.render('adminDocumentsList', { users, isAdmin: true ,
    titre : 'liste utilisateur'
  });
};

// Affiche la page avec bouton pour valider le doc
exports.showValidateDocumentForm = async (req, res) => {
  const document = await Document.findByPk(req.params.id);
  

  const user = await User.findByPk(document.userId);
  if (!document) return res.status(404).send("Document non trouvé");
  res.render('validateDocument', { document, isAdmin: true ,
    titre : 'Document personnel',
    user : user
  });
};

// Valide le document
exports.validateDocument = async (req, res) => { // fonction pas atteinte
   
  const document = await Document.findByPk(req.params.id);
  if (!document) return res.status(404).send("Document non trouvé");

  document.isValidate = true;
  await document.save();

  
  res.redirect('/api/documents/users');  // retour à la liste admin
};