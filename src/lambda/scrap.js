import fetch from "node-fetch";
import $ from "cheerio";

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
