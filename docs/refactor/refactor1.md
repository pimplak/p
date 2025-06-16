[V] DB_INDEX – Dodaj indeksy v2
 • Dexie.version(2).stores({ patients: '++id,lastName,email,phone,[firstName+lastName]', appointments: '++id,patientId,date,status' })
 • W migracji konwertuj Date → ISO string, bo tylko string jest indeksowalny.
[V] DB_MIGRATE – Migruj istniejące rekordy
 • Odczytaj wszystkie pacjentów & wizyty, mapuj daty => iso, zapisz z powrotem.
 • Po migracji uruchom test SELECT po nazwisku – ma być ⩽ 5 ms.
[V] FETCH_OPT – Przyspiesz fetchPatients()
 • Jedno zapytanie po wszystkie wizyty (where('patientId').anyOf(ids))
 • Grupuj Dexie.groupBy, policz liczbę, Math.min/Math.max do next/last.
[V] MUTATE_LOCAL – Zamiast re-fetch, patchem listę w pamięci
 • set(produce(state => { ... })) z immer – minimalny re-render.
[V] VIRTUALIZE – React-window w widoku Pacjenci
 • Owiń listę w <FixedSizeList> z rowHeight 120 px, renderRow => PatientCard.
[V] SPLIT_UI – Rozbij 520 LOC plik
 • PatientsPage (layout)
 • PatientSearchBar
 • PatientTable | PatientCardList
 • ExportModal
[V] VALIDATE_ZOD – Jedno źródło prawdy dla modelu
 • const PatientSchema = z.object({ firstName: z.string().min(1), … })
 • Formy: form = useZodForm({ schema: PatientSchema })
 • Store: zapisz tylko dane zgodne ze schematem.
[V] SEARCH_DEBOUNCE – 300 ms throttling
 • useDebouncedValue(searchQuery, 300) przed filtrowaniem.
[V] EXPORT_STREAM – Strumieniuj XLSX z progresem
 • Chunk pacjentów po 500, AOA_to_sheet w pętli, notifications.update(...) na %.