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

## Day 3
1. Deployed on vercel

2. Add Column Dialog
    - Integrated shadcn/ui components into a form
    - Connected form submission to addColumn mutation

3. Context Menu for Columns
    - Context menu for each column header in the table (enabled /w right-click)

4. more tRPC queries & mutations
    - Confirmed that column creation logic belonged in tableRouter since columns are part of tables.


5. Add table button
    - Button to create a new table under a base
    - Table name is hardcoded for now

### Day 4
1. Add spinner to show when saving to database
 - used zustand to keep track of it gobally
2. Broke down header into smaller components
3. Add table button opens dialog
4. Starting reading up on TanStack Infinite Scroll example, and 

### Day 5
1. Grabbing rows wasnt actually working yestyerday in the prototype and was just giving an infinite cycle of the same thirty rows
    - spent quite a bit of time fixing that up since getting the data was different to the example
        - the example they gave on tanstack was offset-based pagination
    - used curosr based pagination -> using cursor to fetch the next set of rows
    - created a tRPC method that gets x amount of rows,
2. Updated prisma schema since JSON wont scale well
 - old: Row with data as JSON

