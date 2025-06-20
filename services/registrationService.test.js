const Registration = require('../models/Reservation');
const { addInscriptionToTrip } = require('./registrationService');
const { checkUserDocuments } = require('./documentService');

jest.mock('../models/Reservation');
jest.mock('./documentService');

describe('addInscriptionToTrip', () => {
  const fakeUser = { id: 'user-1' };
  const fakeTrip = {
    id: 'trip-1',
    dateDeb: new Date(),
    dateFin: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    statut: 'DISPONIBLE',
    type_doc_requis: ['passeport'],
    nb_de_places: 10,
    save: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inscrit un utilisateur si tout est valide', async () => {
    Registration.findOne.mockResolvedValue(null);
    checkUserDocuments.mockResolvedValue({ isValid: true });

    Registration.create.mockResolvedValue({ id: 'reg-1' });

    const result = await addInscriptionToTrip(fakeUser, fakeTrip);

    expect(result).toHaveProperty('id', 'reg-1');
    expect(Registration.create).toHaveBeenCalled();
    expect(fakeTrip.save).toHaveBeenCalled();
  });

  it('rejette si l\'utilisateur est déjà inscrit', async () => {
    Registration.findOne.mockResolvedValue(true);

    await expect(addInscriptionToTrip(fakeUser, fakeTrip)).rejects.toThrow('Déjà inscrit à ce voyage.');
  });

  it('rejette si documents invalides', async () => {
    Registration.findOne.mockResolvedValue(null);
    checkUserDocuments.mockResolvedValue({
      isValid: false,
      missingTypes: ['passeport'],
      expiredTypes: []
    });

    await expect(addInscriptionToTrip(fakeUser, fakeTrip)).rejects.toThrow(/Documents non valides/);
  });
});
