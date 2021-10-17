import http from "http";
import https from "https";
import url from "url";
import querystring from "querystring";

export default class KeycloakAPI {
  baseURL: string;
  options: any;

  constructor() {
    this.baseURL = process.env.KEYCLOAK_TOKEN_URL
      ? process.env.KEYCLOAK_TOKEN_URL
      : "undefined";
    this.options = url.parse(`${this.baseURL}/protocol/openid-connect/token`);
    this.options.headers = {
      "Content-type": "application/x-www-form-urlencoded",
    };
    this.options.data = {
      client_id: process.env.KEYCLOAK_CLIENT_ID,
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
    };
  }

  authentication = async (username: string, password: string) => {
    const accessToken = await new Promise((resolve, reject) => {
      this.options.method = "POST";
      this.options.data = {
        ...this.options.data,
        grant_type: "password",
        username,
        password,
      };

      const caller = this.options.protocol === "https:" ? https : http;

      const data: any = [];

      const request = caller.request(this.options, (response: any) => {
        response
          .on("data", (chunk: any) => {
            data.push(chunk);
          })
          .on("end", () => {
            try {
              const stringData = Buffer.concat(data).toString();

              // need to look for the 404 since the return value is not really JSON but HTML
              if (response.statusCode === 404) {
                return reject(stringData);
              }

              const parsedData = JSON.parse(stringData);
              if (response.statusCode !== 200) {
                return reject(parsedData);
              }

              const token = parsedData.access_token;

              resolve(token);
            } catch (e) {
              reject(e);
            }
          });
      });

      request.on("error", (e) => {
        reject(e);
      });

      request.write(querystring.stringify(this.options.data));
      request.end();
    });
    return accessToken;
  };
}
