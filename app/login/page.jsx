"use client";

import React, { useState } from "react";
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/navigation";
import { message } from "antd";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toggleState, setToggleState] = useState("signin");
  const [error, setError] = useState("");

  const router = useRouter();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSignUp = async () => {
    if (!validateEmail(email) || !password) {
      message.error("Please provide a valid email and password.");
      return;
    }

    try {
      setLoading(true);
      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      router.refresh();
      setEmail("");
      setPassword("");
    } catch (error) {
      message.error(`Error signing up: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!validateEmail(email) || !password) {
      message.error("Please provide a valid email and password.");
      return;
    }

    try {
      setLoading(true);
      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (user) {
        router.push("/channels");
        setEmail("");
        setPassword("");
      } else if (error.message === "Email not confirmed") {
        message.error(
          ` Please authenticate your email through the link that was sent to ${email}`,
          5
        );
      } else {
        message.error("Invalid email or password.");
      }
    } catch (error) {
      message.error(`Error signing in:${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (error === "Email is not confirmed") {
    return (
      <div>
        <div>
          <span>Authentication error!</span>
          <span>
            Please authenticate your email through the link that was sent to{" "}
            {email}.{" "}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center p-6">
      <div className="flex flex-col w-[35vw]">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-base">
            Email
          </label>
          <input
            type="text"
            placeholder="johndoe@mail.com"
            name="email"
            className="mb-4 w-full p-3 rounded-md border-2 border-gray-500 text-black placeholder-gray-500 focus:outline-none focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <lable htmlFor="password" className="text-base">
            password
          </lable>

          <input
            type="password"
            name="password"
            placeholder="password"
            className="mb-4 w-full p-3 rounded-md border-2 border-gray-500 text-black placeholder-gray-500 focus:outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {toggleState === "signin" ? (
          <>
            <button
              className="w-full mb-2 p-3 rounded-md bg-blue-500 text-white hover:bg-blue-700"
              onClick={handleSignIn}
              disabled={loading}>
              Sign In
            </button>
            <div
              className="hover:underline mt-3 hover:text-blue-500 cursor-pointer"
              onClick={() => setToggleState("signup")}>
              Create an account
            </div>
          </>
        ) : (
          <>
            <button
              className="w-full mb-2 p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleSignUp}
              disabled={loading}>
              Sign Up
            </button>

            <div
              className="hover:underline mt-3 hover:text-blue-500 cursor-pointer"
              onClick={() => setToggleState("signin")}>
              Already have an account
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
