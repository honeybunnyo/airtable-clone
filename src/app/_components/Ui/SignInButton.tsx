'use client'
import { signIn } from 'next-auth/react';
import React from 'react'

const SignInButton = () => {
  return (
    <button
      onClick={() => signIn("google")}
      className="rounded-full bg-blue-100 px-10 py-3 font-semibold no-underline transition hover:bg-blue-200"
    >
      Sign in with Google
    </button>
  );
}

export default SignInButton