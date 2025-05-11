import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CustomPhotoEditor from "./CustomFileEditor";
import api from "../api/instance";
import ProfileCard from "../components/common/ProfileCard";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const userDataSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  address: z.string().optional(),
  additionalInfo: z.string().optional(),
  image: z
    .instanceof(File)
    .optional()
    .refine((val) => val === undefined || val instanceof File, {
      message: "Invalid image file",
    }),
});


const Home = () => {
  const [image, setImage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isImageSaved, setIsImageSaved] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userDataSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      additionalInfo: "",
      image: "",
    },
  });

  const handleImageUpdate = (newImage) => {
    setImage(newImage);
    setIsImageSaved(true);
    setValue("image", newImage);
  };

  const photoEditorRef = useRef(null);

  const handleReset = () => {
    if (photoEditorRef.current) {
      photoEditorRef.current.fullReset();
    }
  };
  const handleFormReset = () => {
    reset();
    setImage("");
    setIsImageSaved(false);
    setSearchQuery("");
  };

  const handleSubmitForm = async (data) => {
    console.log("data", image)
    try {
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('address', data.address);
      formData.append('additionalInfo', data.additionalInfo);
      if (data.image) {
        formData.append('image', data.image);
      }
      const response = await api.post('records/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      handleReset()
      handleFormReset()

      console.log('Response:', response.data);
    } catch (error) {
      console.error('Submission failed:', error.response?.data || error.message);
    }
  };
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setData([]);
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await api.get(`records/search?name=${searchQuery}`, {
        signal: controller.signal,
      });

      console.log("API Response:", response);
      if (response.data && response.data.records) {
        setData(response.data.records);
      } else {
        setData([]);
      }
    } catch (error) {
      if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
        console.log("Request was canceled");
      } else {
        console.error("Error fetching data:", error);
      }
    } finally {
      setLoading(false);
    }
  };
  const searchClear = () => {
    setSearchQuery("")
    setData([])
  }
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6 w-full">
      <header className="w-full bg-blue-500 text-white py-4 px-6 rounded-lg shadow-lg mb-10 flex justify-between items-center">
        <h1 className="text-xs md:text-2xl font-bold tracking-wide">NOVA AI TECH</h1>
        <div className="flex items-center gap-3">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name"
            className="border-none focus:ring-none outline-none w-full sm:w-64 p-3 rounded-md shadow-sm"
          />

          {
            searchQuery &&
            <Button className="bg-blue-500 text-white hover:bg-blue-700 px-6 py-2 rounded-lg shadow-md" onClick={searchClear}>
              Clear
            </Button>
          }
          {

            <Button className="bg-blue-500 text-white hover:bg-blue-700 px-6 py-2 rounded-lg shadow-md" onClick={handleLogout}>
              Logout
            </Button>
          }


        </div>
      </header>
      {searchQuery ? (
        data?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {data.map((person) => (
              <ProfileCard key={person.id} {...person} />
            ))}
          </div>
        ) : (
          <h2 className="text-center text-gray-500 mt-8">No records found</h2>
        )
      ) : (


        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          <CustomPhotoEditor
            onSave={handleImageUpdate}
            setIsImageSaved={setIsImageSaved}
            isImageSaved={isImageSaved}
            ref={photoEditorRef}
          />

          <Card className="p-8 rounded-2xl shadow-xl bg-white border-blue-600">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">Result / Match Found</h2>

            <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-5">
              <div>
                <Input
                  {...register("firstName")}
                  placeholder="First Name"
                  className="w-full p-4 rounded-md border border-gray-500 shadow-sm focus:ring-2 focus:ring-blue-500"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <Input
                  {...register("lastName")}
                  placeholder="Last Name"
                  className="w-full p-4 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>

              <Input
                {...register("address")}
                placeholder="Address"
                className="w-full p-4 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
              />

              <Input
                {...register("additionalInfo")}
                placeholder="Additional Info"
                className="w-full p-4 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
              />

              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
              )}

              {image && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Image Preview</h3>
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="rounded-lg border shadow-md max-h-80 object-cover"
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  onClick={handleFormReset}
                  className="text-white bg-gray-500 hover:bg-gray-400 px-6 py-2 rounded-lg shadow-md"
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-500 text-white hover:bg-blue-700 px-6 py-2 rounded-lg shadow-md"
                >
                  Save
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Home;
