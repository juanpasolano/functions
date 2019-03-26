import { fetchAndStore } from "../util/fetch-doc";

exports.handler = async (event, context) => {
  try {
    const res = await fetchAndStore();
    return { statusCode: 200, body: JSON.stringify(res) };
  } catch (err) {
    return { statusCode: 422, body: String(error) };
  }
};
