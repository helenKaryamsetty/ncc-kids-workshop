# NCC Kids Workshop Registration


An Angular 18 standalone registration page for the NCC Kids Workshop. The form posts to a same-origin serverless function, which forwards registrations to Google Apps Script; Apps Script appends each successful registration to Google Sheets.

## Google Sheets and Apps Script setup

1. Create a Google Sheet. Copy its ID from the URL between `/d/` and `/edit`.
2. Open [script.google.com](https://script.google.com), create a project, and paste in `backend/google-apps-script/Code.gs`.
3. In the Apps Script project, open **Project Settings** and add a Script Property named `SPREADSHEET_ID` with your spreadsheet ID as its value.
4. Choose **Deploy > New deployment > Web app**. Set **Execute as** to your account and access to **Anyone**, then deploy and authorize access to the spreadsheet.
5. Copy the deployed web app URL ending in `/exec`. Do not add Google credentials to this repository or frontend.

The script creates a `Registrations` tab and its header row on first use. Each accepted submission adds `Timestamp`, `Child Name`, `Class`, `Parent Name`, and `Parent Phone Number`.

## Cloudflare Workers deployment

1. Connect this repository to the existing Cloudflare Workers project named `ncc-kids-workshop`.
2. Configure the build command as `npm run build` and the deploy command as `npx wrangler deploy`. The Worker entry point and static asset directory are configured in `wrangler.toml`.
3. Configure `APPS_SCRIPT_URL` as a Worker variable for production and preview environments, or use the value in `wrangler.toml` for deployments made with that configuration.
4. The Worker serves the Angular build and handles registration requests at `/api/register`. For a manual deployment, run `npm run deploy`.

The Worker forwards validated registrations to `APPS_SCRIPT_URL`, keeping the browser request same-origin and avoiding Apps Script CORS preflight issues. The endpoint URL is public configuration, not a credential. The Apps Script deployment must allow access to anyone for public workshop registration.

## Local development

Run `npm install` and `npm start` with Node.js 22.12.0 or newer. The start script builds the app and runs the Worker locally at `http://localhost:8788/`, including the `/api/register` route. The Apps Script URL is configured in `wrangler.toml`; set `APPS_SCRIPT_URL` in Cloudflare Workers settings for deployed environments.

Run `npm run build` to create the production bundle, and `npm test -- --watch=false` to run the unit tests.