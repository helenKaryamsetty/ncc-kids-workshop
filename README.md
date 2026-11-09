# NCC Kids Workshop Registration


An Angular 18 standalone registration page for the NCC Kids Workshop. The form posts to a same-origin serverless function, which forwards registrations to Google Apps Script; Apps Script appends each successful registration to Google Sheets.

## Google Sheets and Apps Script setup

1. Create a Google Sheet. Copy its ID from the URL between `/d/` and `/edit`.
2. Open [script.google.com](https://script.google.com), create a project, and paste in `backend/google-apps-script/Code.gs`.
3. In the Apps Script project, open **Project Settings** and add a Script Property named `SPREADSHEET_ID` with your spreadsheet ID as its value.
4. Choose **Deploy > New deployment > Web app**. Set **Execute as** to your account and access to **Anyone**, then deploy and authorize access to the spreadsheet.
5. Copy the deployed web app URL ending in `/exec`. Do not add Google credentials to this repository or frontend.

The script creates a `Registrations` tab and its header row on first use. Each accepted submission adds `Timestamp`, `Child Name`, `Class`, `Parent Name`, and `Parent Phone Number`.

## Cloudflare Pages deployment

1. Push this repository to GitHub and create a Cloudflare Pages project connected to it. The Pages project name should be `ncc-kids-workshop` to match `wrangler.toml`.
2. Set the build command to `npm run build` and the build output directory to `dist/ncc-kids-workshop/browser`. Do not use `npx wrangler deploy`; that command deploys Workers, not Pages.
3. Set `APPS_SCRIPT_URL` in Cloudflare Pages project settings for production and preview deployments. The value in `wrangler.toml` is used by Wrangler locally and can be used for deployments made from this configuration.
4. Cloudflare Pages automatically deploys the function in `functions/api/register.ts` at `/api/register`. For a manual CLI deployment, run `npm run deploy` (or `npx wrangler pages deploy dist/ncc-kids-workshop/browser --project-name=ncc-kids-workshop`).

The function forwards validated registrations to `APPS_SCRIPT_URL`, keeping the browser request same-origin and avoiding Apps Script CORS preflight issues. The endpoint URL is public configuration, not a credential. The Apps Script deployment must allow access to anyone for public workshop registration.

## Local development

Run `npm install` and `npm start` with Node.js 18.20.8 or newer. The start script builds the app and runs Cloudflare Pages locally at `http://localhost:8788/`, including the `/api/register` function. The Apps Script URL is configured in `wrangler.toml`; set `APPS_SCRIPT_URL` in Cloudflare Pages project settings for deployed environments.

Run `npm run build` to create the production bundle, and `npm test -- --watch=false` to run the unit tests.