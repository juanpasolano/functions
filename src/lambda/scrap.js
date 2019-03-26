import fetch from "node-fetch";
import $ from "cheerio";
import GoogleSpreadsheet from "google-spreadsheet";

var creds = {
  client_email: process.env.GCS_EMAIL,
  private_key: process.env.GCS_PRIVATE_KEY.replace(/\\n/g, '\n')
}

const sheetId = "1E--ADFQ16rbHPfF_wzOj_1IelS9DCmbce3_Xmvzcgkw";
var doc = new GoogleSpreadsheet(sheetId);

const url = "https://www.asxenergy.com.au/";

exports.handler = async (event, context) => {
  return fetch(url)
    .then(res => res.text())
    .then(html => {
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

      //Ads to google sheets

      doc.useServiceAccountAuth(creds, function(err) {
        doc.getInfo(function(err, info) {
          var sheet = info.worksheets[0];
          content.forEach(row => {
            console.log({
              date: new Date().toDateString(),
              ...row
            })
            sheet.addRow(
              {
                date: new Date().toDateString(),
                ...row
              },
              function(err, res) {
                console.log(err);
                console.log(res);
                console.log("------------------");
              }
            );
          });
        });
      });

      return {
        statusCode: 200,
        body: JSON.stringify({
          headers,
          content
        })
      };
    })
    .catch(error => ({ statusCode: 422, body: String(error) }));
};
