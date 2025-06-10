import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import Dashboard from "./_components/Dashboard/Dashboard";
import SignInButton from "./_components/Ui/SignInButton";

export default async function Home() {
  const session = await auth();
  console.log("Session in production:", session);

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center text-black">
        <div className="fixed top-0 left-0 bg-red-100 p-2 text-xs">
          Session: {session ? 'EXISTS' : 'NULL'}
        </div>
        
        {!session ? 
          // if not logged in
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              Airtable clone
            </h1>
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center justify-center gap-4">
                <SignInButton/>
              </div>
            </div>
          </div>
          :
          <Dashboard/>
        }
      </main>
    </HydrateClient>
  );
}
