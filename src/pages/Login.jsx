import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/instance";

// Schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const HomeLoginPage = () => {
  const { login } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate()
  const onSubmit = async (data) => {
    try {
      const response = await api.post('auth/login', data);
      login(response.data.token);
      navigate("/");
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center p-4">
      <div className="w-full max-w-sm p-8 bg-white shadow-2xl rounded-3xl border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8 tracking-wide">
          NOVA AI TECH
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-lg transition-all duration-200"
          >
            Login
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default HomeLoginPage;
