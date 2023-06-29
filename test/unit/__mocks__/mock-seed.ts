export default class MockSeed {
  static mockNasaGateway() {
    return {
      findAllPlanets: jest.fn().mockResolvedValue([
        {
          pl_name: 'nu Oph c',
          pl_bmassj: 27,
        },
      ]),
    };
  }

  static mockHttpService() {
    return {
      get: jest.fn().mockResolvedValue([
        {
          pl_name: 'nu Oph c',
          pl_bmassj: 27,
        },
      ]),
    };
  }
}
