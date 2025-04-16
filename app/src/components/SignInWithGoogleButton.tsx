"use client";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth-actions";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";

const SignInWithGoogleButton = () => {
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
  if (user === null) {
    return (
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => {
          signInWithGoogle();
        }}
      >
        Login with Google
      </Button>
    );
  } else {
    return (
      <Button
        type="button"
        variant="default"
        className="w-full"
        onClick={() => {
          redirect('/calendar');
        }}
      >
        View Calendar
      </Button>
    );
  }
};

export default SignInWithGoogleButton;
