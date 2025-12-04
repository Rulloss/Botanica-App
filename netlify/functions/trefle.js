// netlify/functions/trefle.js
const axios = require("axios");

exports.handler = async function (event) {
  try {
    const params = event.queryStringParameters || {};
    const { q, page, id } = params;

    const API_KEY = process.env.TREFLE_API_KEY;
    if (!API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: "TREFLE_API_KEY eksik" }) };
    }

    const BASE = "https://trefle.io/api/v1";

    let url;
    if (id) {
      // plant details
      url = `${BASE}/plants/${id}?token=${API_KEY}`;
    } else if (q) {
      // search
      const p = page || 1;
      url = `${BASE}/plants/search?q=${encodeURIComponent(q)}&page=${p}&token=${API_KEY}`;
    } else {
      return { statusCode: 400, body: JSON.stringify({ error: "q veya id parametresi gerekli" }) };
    }

    const resp = await axios.get(url, { timeout: 10000 });
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resp.data),
    };
  } catch (err) {
    // hata ayrıntısını prod'da minimal tutabilirsin
    const message = err.response?.data || err.message || "Unknown error";
    return {
      statusCode: err.response?.status || 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: message }),
    };
  }
};
