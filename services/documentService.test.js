const { checkUserDocuments } = require('./documentService');
const Document = require('../models/Document');

jest.mock('../models/Document');

describe('checkUserDocuments', () => {
  const userId = 'user-1';
  const now = new Date();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait retourner valide si tous les documents sont présents et récents', async () => {
    Document.findAll.mockResolvedValue([
      {
        type: 'passeport',
        isValidate: true,
        date_upload: new Date(now - 5 * 24 * 60 * 60 * 1000) // 5 jours avant
      },
      {
        type: "carte_d'identité",
        isValidate: true,
        date_upload: new Date(now - 10 * 24 * 60 * 60 * 1000)
      }
    ]);

    const result = await checkUserDocuments(userId, ['passeport', "carte_d'identité"], 365);

    expect(result.isValid).toBe(true);
    expect(result.missingTypes).toEqual([]);
    expect(result.expiredTypes).toEqual([]);
  });

  it('devrait détecter un document manquant', async () => {
    Document.findAll.mockResolvedValue([
      {
        type: 'passeport',
        isValidate: true,
        date_upload: now
      }
    ]);

    const result = await checkUserDocuments(userId, ['passeport', "carte_d'identité"], 365);

    expect(result.isValid).toBe(false);
    expect(result.missingTypes).toEqual(["carte_d'identité"]);
  });

  it('devrait détecter un document expiré', async () => {
    Document.findAll.mockResolvedValue([
      {
        type: 'passeport',
        isValidate: true,
        date_upload: new Date(now - 400 * 24 * 60 * 60 * 1000) // > 365j
      }
    ]);

    const result = await checkUserDocuments(userId, ['passeport'], 365);

    expect(result.isValid).toBe(false);
    expect(result.expiredTypes).toEqual(['passeport']);
  });
});