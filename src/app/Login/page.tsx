"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import CustomButton from "@/components/CustomButton/Button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import authService from "@/services/authService";

type CustomInputProps = {
  type: string;
  placeholder: string;
  value: string;
  setValue: (p: string) => void;
};

const CustomInput = ({ type, placeholder, value, setValue }: CustomInputProps) => {
  return (
    <div className="w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="text-white outline-none placeholder:text-white placeholder:opacity-[.4] w-full my-[6px] px-[14px] py-[10px] bg-[#ffffff08] border border-[#ffffff9f] rounded-[6px]"
      />
    </div>
  );
};

const ErrorModal = ({ message, onClose }: { message: string; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
      <div className="bg-black rounded-lg p-2 w-fit max-w-md">
        <p className="text-sm text-white">{message}</p>
      </div>
    </div>
  );
};

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (isLoggedIn) {
      const isAdmin = isLoggedIn.role === "admin"
      const redirectPath = isAdmin ? "/admin-addresses" : "/";
      router.push(redirectPath);
    }
  }, [isLoggedIn, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showErrorModal) {
      timer = setTimeout(() => {
        setShowErrorModal(false);
      }, 5000); // Increased to 5 seconds for better visibility
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showErrorModal]);

  const validateForm = () => {
    if (!email.trim()) {
      setErrorMessage("Email is required");
      setShowErrorModal(true);
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Please enter a valid email address");
      setShowErrorModal(true);
      return false;
    }

    if (!password) {
      setErrorMessage("Password is required");
      setShowErrorModal(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload: { email?: string; phone?: string; password: string } = { password };

      // Determine if the input is a phone number or email
      if (/^\d+$/.test(email.trim())) {
        payload.phone = email.trim();
      } else {
        payload.email = email.trim();
      }

      // Perform login
      const user = await authService.login(payload);
      dispatch({ type: "auth/login", payload: user });

      // Redirect based on role
      const redirectPath = user.isAdmin ? "/admin-dashboard" : "/";
      router.push(redirectPath);
    } catch (error: any) {
      console.log(error);
      if (error.message === "Not-verified") {
        router.push(`/Verify?email=${email}`);
      } else {
        setErrorMessage(error.message || "Login failed. Please try again.");
        setShowErrorModal(true);
      }
    }
  };

  return (
    <main className="font-[Inter] w-full min-h-screen flex flex-col justify-start items-center px-[20px] bg-[#4158FC] relative">
      <div>
        <div></div>
        <div></div>
      </div>
      {showErrorModal && <ErrorModal message={errorMessage} onClose={() => setShowErrorModal(false)} />}

      <section className="w-full flex flex-col justify-start items-start mt-[24px]">
        <h1 className="font-normal text-white text-[34px]">Login</h1>
      </section>

      <form onSubmit={handleSubmit} className="relative mt-[35px] w-full flex flex-col justify-start items-center">
        <CustomInput placeholder="Email address or Phone number" setValue={setEmail} type="text" value={email} />
        <CustomInput placeholder="Password" setValue={setPassword} type="password" value={password} />

        <section className="w-full my-[10px]">
          <CustomButton text="Login" type="submit" width={100} bg="black" />
        </section>
      </form>

      <section className="mb-[45px] mt-[12px] text-[12px] text-white flex">
        <p className="opacity-[.4]">Don&apos;t have an account?</p>
        <Link href="/Register" className="ml-1">Register</Link>
      </section>
    </main>
  );
};

export default Login;