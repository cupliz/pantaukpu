const https = require("https");
const axios = require("axios");
const httpsProxyAgent = require("https-proxy-agent");

const proxyIP = "114.199.111.130";
const proxyPort = 80;
const withProxy = axios.create({
  httpsAgent: new httpsProxyAgent(`http://${proxyIP}:${proxyPort}`)
});
const api = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false })
});
module.exports = {
  api: process.env.PROXY=='true' ? withProxy : api,
};
