import { Request, Response } from "express";

import KeycloakAPI from "../utils/keycloakApi";

export default class AuthController {
  keycloakApi: any;
  constructor() {
    this.keycloakApi = new KeycloakAPI();
  }

  authentication = async (request: Request, response: Response) => {
    const { username, password } = request.body;

    const token = await this.keycloakApi.authentication(username, password);

    response.json(token);
  };
}
