'use client'

import { withAuth } from "@/utils/auth";
import { useAuth } from "@/context/AuthProvider";

const Home = () => {
  const { logout } = useAuth();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-5xl">You are successfully logged in</h1>
        <p>This project is created to showcase a password-less authentication and authorization system.</p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            onClick={() => logout()}
          >
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}

export default withAuth(Home)
