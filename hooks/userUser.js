import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/navigation";

export const useUser = () => {
  // const [user, setUser] = useState(null);
  // const [error, setError] = useState("");
  // const [loading, setLoading] = useState(true);

  const router = useRouter();
  const queryClient = useQueryClient();

  const fetchUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);

    if (user) {
      const { data: existingUser, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userError && userError.code === "PGRST116") {
        // User does not exist in the users table, insert them
        const { error: insertError } = await supabase
          .from("users")
          .insert([{ id: user.id, email: user.email }]);

        if (insertError) throw new Error(insertError.message);
      } else if (userError) {
        throw new Error(userError.message);
      }

      return existingUser || user;
    }
    return user;
  };

  const {
    data: user,
    error,
    isLoading: loading,
  } = useQuery(["user"], fetchUser, {
    refetchOnWindowFocus: false,
  });

  // useEffect(() => {
  //   const getUser = async () => {
  //     const {
  //       data: { user },
  //       error,
  //     } = await supabase.auth.getUser();
  //     if (error) {
  //       setError("Error fetching user:", error);
  //       setLoading(false);
  //       return;
  //     }
  //     if (user) {
  //       const { data: existingUser, error: userError } = await supabase
  //         .from("users")
  //         .select("*")
  //         .eq("id", user.id)
  //         .single();

  //       setUser(existingUser);

  //       if (userError && userError.code === "PGRST116") {
  //         // User does not exist in the users table, insert them
  //         const { error: insertError } = await supabase
  //           .from("users")
  //           .insert([{ id: user.id, email: user.email }]);

  //         if (insertError) {
  //           setError("Error inserting user:", insertError);
  //         }
  //       } else if (userError) {
  //         setError("Error fetching user from users table:", userError);
  //       }
  //     } else {
  //       setUser(user);
  //     }
  //     setLoading(false);
  //   };

  //   getUser();
  // }, []);

  const redirectToLoginIfNeeded = () => {
    if (!loading && !user) {
      router.push("/login");
    }
  };

  return { user, loading, error, redirectToLoginIfNeeded };
};
