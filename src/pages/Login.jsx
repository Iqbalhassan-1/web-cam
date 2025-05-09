import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Zod schema for validation
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const HomeLoginPage = () => {
//   const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    // Handle login logic (e.g., API call)
    console.log(data);
    // navigate("/home"); // Redirect to home page after login
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      <h1 className="text-3xl font-semibold mb-6">NOVA AI TECH</h1>
      <form className="bg-white p-6 rounded-lg shadow-lg w-80" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Input
            {...register("username")}
            placeholder="Username"
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
        </div>
        <div className="mb-4">
          <Input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full bg-primary text-white py-2 rounded">
          Login
        </Button>
      </form>
    </div>
  );
};

export default HomeLoginPage;
