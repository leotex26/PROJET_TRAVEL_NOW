const Document = require('../models/Document');








/**
 * Vérifie si un utilisateur possède tous les documents requis à jour
 * @param {string} userId - ID de l'utilisateur
 * @param {Array<string>} requiredTypes - Liste des types requis (ex: ['passeport', 'carte_d\'identité'])
 * @param {number} maxAgeDays - Nombre de jours de validité (par défaut 365 jours)
 * @returns {Object} - { isValid: boolean, missingTypes: string[], expiredTypes: string[] }
 */
const checkUserDocuments = async (userId, requiredTypes = [], maxAgeDays = 365) => {
  const documents = await Document.findAll({ where: { userId } });

  const now = new Date();
  const result = {
    isValid: true,
    missingTypes: [],
    expiredTypes: [],
  };

  // on filtre par type de document
  for (const type of requiredTypes) {
    const userDocs = documents.filter(doc => doc.type === type && doc.isValidate === true);

    if (userDocs.length === 0) {
      result.isValid = false;
      result.missingTypes.push(type);
    } else {
      const latestDoc = userDocs.reduce((a, b) => (a.date_upload > b.date_upload ? a : b)); // on recupere la plus récente date d'upload
      const ageInDays = (now - new Date(latestDoc.date_upload)) / (1000 * 60 * 60 * 24);

      if (ageInDays > maxAgeDays) {
        result.isValid = false;
        result.expiredTypes.push(type);
      }
    }
  }

  return result;
};







const findDocumentsByIdUser = async (userId) => {
  try {
    const documents = await Document.findAll({
      where: { userId }
    });
    return documents;
  } catch (error) {
    console.error('Erreur lors de la récupération des documents:', error);
    throw error;
  }
};


module.exports = {
  checkUserDocuments,
  findDocumentsByIdUser,
};