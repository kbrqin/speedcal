"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";

const UserGreetText = () => {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);
  if (user !== null) {
    return (
      <p className="w-full flex gap-1 justify-center items-center border border-gray-300 rounded-lg bg-gradient-to-b from-zinc-200 p-4 dark:border-neutral-800 dark:bg-zinc-800/30">
      hello&nbsp;
        <code className="font-mono font-semibold">
          {user.user_metadata.full_name ?? "user"}!
        </code>
      </p>
    );
  }
};

export default UserGreetText;
