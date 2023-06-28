import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NasaGateway {
  constructor(private readonly httpService: HttpService) {}

  async findAllPlanets() {
    const planets = await this.httpService
      .get(
        `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,%20pl_bmassj+from+ps&format=json`,
      )
      .toPromise();
    return planets.data ? planets.data : [];
  }
}
