# cfdi-sync

## Development
Develop web (defaults to port 5173)
```npm run dev:frontend```

Generate common types
```
npx supabase login

npx supabase gen types --lang=typescript --project-id $SUPABASE_PROJECT_ID --schema public > package/common/src/db/type.ts 
```
