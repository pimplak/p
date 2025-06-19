[✅] ENUMIFY_STATUS – Wyciągnij wszystkie statusy do `constants/status.ts`
 • Usuń magic-stringi `'active' | 'archived' | …`, eksportuj enum lub const-mapkę.

[✅] DATE_SINGLE_SOURCE – ISO w DB, helpers w kodzie  
 • Dodaj `toDate()` / `toISO()` w `utils/dates.ts`, stosuj przy IO.  

[✅] SPLIT_PATIENTS_PAGE – rozbij 461 LOC potwora  
 • PatientsPage (layout)  
 • SearchBar  
 • Table / VirtualizedList  
 • FAB / Modale  

[✅] SPLIT_PATIENT_PROFILE – rozbij 415 LOC  
 • Header  
 • QuickInfoCards  
 • Tabs (Notes, Goals…)  
 • ActionMenu / Modale  

[✅] ROUTE_LAZY & CODE_SPLIT – `React.lazy`, `Suspense`  
 • Strony (`Dashboard`, `Settings`…)  
 • Ciężkie util – `xlsx` eksport 

[✅] ERROR_BOUNDARY_GLOBAL – `react-error-boundary` przy `AppRouter`  
 • Fallback => toast + restart button.

[🔄] ZOD_RESOLVER_FORMS – eliminuj ręczne `validate`  
 • `useForm({ validate: zodResolver(AppointmentFormSchema) })`  
 • PatientForm ✅, AppointmentForm - problemy z typami

[✅] CLEAN_STORE_SIDE_EFFECTS – wyrzuć toast'y z Zustand  
 • Store zwraca wynik; UI pokazuje notifications.

[✅] EXPORT_OFF_MAIN_THREAD – web-worker / `requestIdleCallback`  
 • Przenieś pętlę XLSX, update postMessage→toast.

[ ] ESLINT_STRICT_ORDER – `@typescript-eslint/consistent-type-imports`, `import/order`  
 • Dodaj do `.eslintrc`, napraw auto-fix.

[ ] BUNDLE_INSPECT – `vite-plugin-inspect` / `rollup-visualizer`  
 • Analiza przed/po splitach.

[ ] REACT_QUERY_DATA – przerzuć Dexie zapytania do `@tanstack/react-query`  
 • Zustand zostaje do pure-UI state.

[ ] GLOBAL_STYLE_EMOTION – zamień `<style>{globalStyles}</style>`  
 • Użyj `@mantine/core` `<Global />` (emotion) zapobiega flash-unstyled.

[ ] TESTS – Vitest + Testing-Library, Playwright  
 • Zacznij od `validatePatientForm`, `exportToExcel`, główne flow UI.

[ ] STORE_REFACTOR – rozbij `usePatientStore` (>250 LOC)  
 • DataService (Dexie IO)  
 • Zustand slice (cache/UI)  

[ ] CONST_MAGIC_NUMBERS – wyrzuć 150 zł, 500 chunk → `constants.ts` 