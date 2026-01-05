import axios from "axios";

const apiRootUrl = process.env.API_BASE_URL;
const apiKey = process.env.OPENSERV_API_KEY;

if (!apiRootUrl) {
  // Warn instead of throw to prevent crashing the frontend if env is missing in this demo
  console.warn("API_BASE_URL is not set");
}

if (!apiKey) {
   // Warn instead of throw to prevent crashing the frontend if env is missing in this demo
   console.warn("OPENSERV_API_KEY is not set");
}

export const apiClient = axios.create({
  baseURL: apiRootUrl || '',
  headers: {
    "x-openserv-key": apiKey || '',
  },
});