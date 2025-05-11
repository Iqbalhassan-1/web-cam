import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../api/instance";

// Zod schema for signup validation
const signupSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });
const navigate=useNavigate()
  const onSubmit = async (data) => {
  try {
    const response = await api.post('auth/register', data);
    navigate('/login')
    console.log("resss",response)
  } catch (error) {
    console.error("Signup Failed:", error.response?.data || error.message);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-3xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-8 tracking-wide">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Input
              {...register("firstName")}
              placeholder="First Name"
              className="w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
            )}
          </div>
              <div>
            <Input
              {...register("lastName")}
              placeholder="Last Name"
              className="w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register("email")}
              placeholder="Email"
              className="w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md transition-all duration-200"
          >
            Sign Up
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">Log in</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
