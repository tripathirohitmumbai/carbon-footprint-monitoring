const { createVendiaClient } = require("@vendia/client");

class VendiaService {
  _instance = null;

  new() {
    if (!this._instance) {
      const client = createVendiaClient({
        apiUrl: process.env.VENDIA_GRAPHQL_URL,
        websocketUrl: process.env.VENDIA_GRAPHQL_WEBSOCKET_URL,
        apiKey: process.env.VENDIA_API_KEY,
      });

      this._instance = client;
    }
  }

  getInstance() {
    return this._instance;
  }
}

module.exports = {
  VendiaService
}