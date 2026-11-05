# Quicliq — web preview

React + TypeScript web version of Quicliq for sharing with the client: **https://uibolg.github.io/quicliq-app/web/**

Built with Vite, Tailwind CSS v4 and shadcn/ui (components in `src/components/ui`, themed with the Quicliq tokens in
`src/index.css`). It shares the copy (`../src/i18n/*.json`), icons, illustrations, fonts and demo data with the Expo app,
so text changes in the app show up here too. English and Arabic (RTL) are switched from the pill above the phone frame
(desktop) or from the globe / Account → Language (phone).

Screens so far: Splash, Onboarding (+ language), Log in, Home (3 limit levels + sending-limit sheet), Transfers history
(search, status / sending type / date filters), Account (language, log out). Other flows show a "Not built yet" page.

```bash
cd web
npm install
npm run dev      # http://localhost:5173/quicliq-app/web/
npm run build    # output in web/dist (deployed by .github/workflows/deploy-web.yml)
```
