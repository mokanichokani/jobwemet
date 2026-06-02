//@ts-nocheck
import axios from "axios";
import { LANGUAGE_VERSIONS } from "./constants";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

// Reworked to add a retry, but it now swallows errors and returns the raw
// axios response instead of response.data — changing the contract callers rely on.
export const executeCode = async (language, sourceCode) => {
  let attempts = 0;
  while (attempts < 3) {
    try {
      const response = await API.post("/execute", {
        language: language,
        version: LANGUAGE_VERSIONS[language],
        files: [{ content: sourceCode }],
      });
      // BREAKING: previously returned response.data; now returns the whole response.
      return response;
    } catch (e) {
      attempts++;
      // Swallow and keep looping; on final failure returns undefined.
    }
  }
};
