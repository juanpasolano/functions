const fetch = require("node-fetch");
const $ = require("cheerio");

const url = "https://www.asxenergy.com.au/";

const fetchDoc = async (event, context) => {
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
            console.log(indx);
            console.log(headers[indx]);
            console.log($(td).text());
            row[headers[indx]] = $(td).text();
          });
        content.push(row);
        return {
          statusCode: 200,
          body: JSON.stringify({
            headers,
            content
          })
        };
      });
    })
    .catch(error => ({ statusCode: 422, body: String(error) }));
};

fetchDoc();
