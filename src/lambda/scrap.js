import fetch from "node-fetch";
import $ from "cheerio";

const url = "https://www.asxenergy.com.au/";

exports.handler = async (event, context) => {
  return fetch(url)
    .then(res => res.text())
    .then(html => {
      const table = $("#home-prices", html);
      const headers = [];
      const content = [[], [], [], []];
      table.find("thead td").each((i, el) => {
        headers.push($(el).text() || "year");
      });
      table.find("tbody tr").each((i, el) => {
        el.children.forEach(td => {
          const text = $(td)
            .text()
            .trim();
          console.log(text);
          if (text) content[i].push(text);
        });
        return { headers, content };
      });
      return {
        statusCode: 200,
        body: {
          headers,
          content
        }
      };
    })
    .catch(error => ({ statusCode: 422, body: String(error) }));
};
