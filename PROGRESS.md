# Airtable Clone – Project Tracker

---

## Day 1
1. Set up and connect Prisma to Supabase
   - Created a new Supabase project  
   - Defined initial Prisma schema for `User`, `Session`, `Account`, and `VerificationToken` for NextAuth

2. Set up Google login with NextAuth  
   - Configured Google provider &rarr; verified successful login flow with session persistence  
   - Tested login/logout states in `Session` table

3. Dashboard UI
    - Header, sidebar, logout, create button

## Day 2
1. Display Bases on Dashboard
    - Fetched all bases for logged-in user using tRPC
    - Rendered each base as a card with styling and navigation to its first table

2. tRPC Queries and Mutations
    - getAllBases to list user’s bases
    - updateBaseName mutation to support renaming

3. Table Implementation with TanStack Table
    - Skimmed official documentation
    - Experimented with basic configuration and rendering dummy data
    - Enabled tabbing between input cells (with keyboard support).
4. Added a button to return to the main page.

