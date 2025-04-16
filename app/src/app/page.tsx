"use client";

import UserGreetText from "@/components/UserGreetText";
import SignInWithGoogleButton from "@/components/SignInWithGoogleButton";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 w-[200px] items-center sm:items-start">
        <span className="font-semibold">🐋 welcom to speedcal &gt;:&#41;</span>
        <UserGreetText />
        {/* <Button onClick={() => redirect('/calendar')}>open calendar</Button> */}
        <SignInWithGoogleButton />

        {/* <div className="flex gap-4 items-center flex-col sm:flex-row">
          <LoginButton />
        </div> */}
      </main>
    </div>
  );
}
