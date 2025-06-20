const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Document = require('../models/Document');
const authService = require('../services/authService');
const documentService = require('../services/documentService');

exports.registerPage = async (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.render('register', {
    titre: 'Créer un compte',
    error: null,
  });
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const newUser = await authService.registerUser({ username, email, password });
    const token = authService.generateToken(newUser);

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.redirect('/' );
  } catch (err) {
    console.error(err);
    const errorMessage = err.message === 'EMAIL_EXISTS' ? 'Email déjà utilisé.' : 'Erreur serveur.';
    res.render('register', {
      error: errorMessage,
      titre: 'Créer un compte',
    });
  }
};

exports.loginPage = async (req, res) => {
  console.log('loginPage demarre req :'+ req.username);

  res.render('login', {
    titre: 'Connexion',
    error: null,
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("controller démarre", email, password);

  try {
    const user = await authService.loginUser({ email, password });
    const token = authService.generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.redirect('/');
  } catch (err) {
    console.error(err);
    let errorMessage = 'Erreur serveur';

    if (err.message === 'USER_NOT_FOUND' || err.message === 'INVALID_PASSWORD') {
      errorMessage = 'Identifiants incorrects';
    }

    res.clearCookie('token', { path: '/' }).render('login', {
      error: errorMessage,
      titre: 'Connexion',
      
    });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.redirect('/');
};





exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Document, as: 'documents' }]
    });

    if (!user) {
      return res.status(404).send('Utilisateur non trouvé');
    }

    //const plainUser = user.get({ plain: true });

    res.render('profile.ejs', {
      titre: 'Profil',
      user,
    });
  } catch (err) {
    console.error('Erreur lors du chargement du profil :', err);
    res.status(500).send('Erreur serveur');
  }
};



exports.updateProfile = async (req, res) => {
  console.log('updateProfile');
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).render('error', { message: 'Utilisateur non reconnu' });
    }

    // Mise à jour des champs
    user.username = req.body.username;
    user.email = req.body.email;
    await user.save();


    return res.redirect('/api/profile');

  } catch (error) {
    console.error('Erreur lors de l update des profils :', error);
    return res.status(500).render('error', { message: 'Erreur serveur' }); 
  }
};


exports.uploadDocsProfil = async (req, res) => {
  const { type } = req.body;

  if (!req.file) return res.status(400).send('Aucun fichier reçu.');

  try {
    await Document.create({
      type,
      filename: req.file.filename,
      userId: req.user.id,
    });

    // Recharger l'utilisateur complet avec ses documents
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Document, as: 'documents' }]
    });

    res.render('profile', {
      titre: 'Profil',
      user,
      message: 'Document uploadé avec succès'
    });
  } catch (error) {
    console.error('Erreur upload :', error);
    res.status(500).send('Erreur lors de l’upload du document.');
  }
};






exports.PageGestionAdmin = async (req, res) => {
      try {
        
    
    res.render('profilesViewer', { titre : "BQonjour admin"});
  } catch (error) {
    console.error('Erreur lors de la récupération des profils :', error);
    res.status(500).render('error', { message: 'Erreur serveur' });
  }
};



exports.deleteDocument = async (req, res) => {
  const docId = req.params.id;

  try {
    const document = await Document.findByPk(docId);

    if (!document) return res.status(404).send("Document non trouvé");
    console.log(document);

    if (!req.user) return res.status(401).send("Utilisateur non authentifié");

    if (document.userId !== req.user.id) {
      return res.status(403).send("Accès refusé");
    }

    // Supprimer le fichier du système
    const filePath = path.join(__dirname, '..', 'public', 'uploads', document.filename);
    console.log(filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('success delete')
    }

    // Supprimer l’entrée en base
    await document.destroy();

    res.redirect('/api/profile');
  } catch (err) {
    console.error("Erreur suppression :", err);
    res.status(500).send("Erreur serveur lors de la suppression");
  }
};