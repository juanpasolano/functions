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
        const text = $(el).text() ;
        headers.push(text === " " ? text : "year");
      });
      table.find("tbody tr").each((i, el) => {
        const row = {}
        el.children.forEach((td, indx) => {
          const text = $(td)
            .text()
            .trim();
          row[headers[indx]] = text;
        });
        content.push(row);
        return { headers, content };
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
