// tests/tripService.test.js
const Trip = require('../models/Trip');
const { cancelTripStatus, rerunTripStatus } = require('./tripService');

jest.mock('../models/Trip');

describe('cancelTripStatus', () => {
  it('annule un voyage si valide', async () => {
    const trip = { statut: 'DISPONIBLE', save: jest.fn() };
    const result = await cancelTripStatus(trip);
    expect(result).toMatch(/succès/);
    expect(trip.statut).toBe('ANNULÉ');
    expect(trip.save).toHaveBeenCalled();
  });

  it('rejette si déjà annulé', async () => {
    await expect(cancelTripStatus({ statut: 'ANNULÉ' })).rejects.toThrow();
  });
});

describe('rerunTripStatus', () => {
  it('réactive un voyage avant sa date', async () => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const trip = {
      statut: 'ANNULÉ',
      dateDeb: futureDate,
      dateFin: new Date(futureDate.getTime() + 2 * 24 * 60 * 60 * 1000),
      nb_de_places: 5,
      save: jest.fn()
    };

    const result = await rerunTripStatus(trip);
    expect(result).toMatch(/réactivé/);
    expect(trip.statut).toBe('DISPONIBLE');
  });
});
