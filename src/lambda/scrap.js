const fetch = require("node-fetch");
const $ = require("cheerio");
var GoogleSpreadsheet = require("google-spreadsheet");

const url = "https://www.asxenergy.com.au/";
var creds = {
  client_email: process.env.GCS_EMAIL,
  private_key: process.env.GCS_PRIVATE_KEY.replace(/\\n/g, "\n")
};

const sheetId = "1E--ADFQ16rbHPfF_wzOj_1IelS9DCmbce3_Xmvzcgkw";
var doc = new GoogleSpreadsheet(sheetId);

const storeRow = async (row, sheet) => {
  return new Promise((resolve, reject) => {
    sheet.addRow(
      {
        date: new Date().toString(),
        ...row
      },
      function(err, res) {
        if (err) return reject(err);
        return resolve(res);
      }
    );
  });
};

const initDoc = async content => {
  return new Promise((resolve, reject) => {
    doc.useServiceAccountAuth(creds, function(err) {
      if (err) return reject(err);
      doc.getInfo(function(err, info) {
        if (err) return reject(err);
        var sheet = info.worksheets[0];
        var promises = content.map(row => storeRow(row, sheet));
        Promise.all(promises).then(values => {
          return resolve(values);
        });
      });
    });
  });
};

const fetchDoc = async (event, context) => {
  try {
    const res = await fetch(url);
    const html = await res.text();

    const table = $("#home-prices", html);
    const headers = [];
    const content = [];
    table.find("thead td").each((i, el) => {
      const text = $(el)
        .text()
        .trim();
      headers.push(text === "" ? "year" : text);
    });
    table.find("tbody tr").each((i, tr) => {
      const row = {};
      $(tr)
        .find("td")
        .each((indx, td) => {
          row[headers[indx]] = $(td).text();
        });
      content.push(row);
    });
    return content;
  } catch (err) {
    return err;
  }
};

const fetchAndStore = async () => {
  const content = await fetchDoc();
  console.log(content);
  const res = await initDoc(content);
  return res;
};

exports.handler = async (event, context) => {
  try {
    const res = await fetchAndStore();
    return { statusCode: 200, body: JSON.stringify(res) };
  } catch (err) {
    return { statusCode: 422, body: String(error) };
  }
};
