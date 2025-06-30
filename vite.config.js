/* eslint-disable no-undef */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
// https://vite.dev/config/
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync("./certificate/key.pem"),
      cert: fs.readFileSync("./certificate/cert.pem"),
    },
  },
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || "/",
});
