"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import CustomButton from "@/components/CustomButton/Button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CountryPickerModal from "@/components/countryPicker";
import authService from "@/services/authService";

type CustomInputProps = {
  type: string;
  placeholder: string;
  value: string;
  setValue: (p: string) => void;
};

const CustomInput = ({
  type,
  placeholder,
  value,
  setValue,
}: CustomInputProps) => {
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

const Register = () => {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  const [mailOrPhone, setMailOrPhone] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [cPassword, setCPassword] = useState<string>("");
  const [inviteCode, setInviteCode] = useState<string>("");
  const [termsChecked, setTermsChecked] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    name: "United States",
    code: "+1",
  });
  
  
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (showErrorModal) {
      timer = setTimeout(() => {
        setShowErrorModal(false);
      }, 500);
    }
    
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [showErrorModal]);

  const validateForm = () => {
    if (mailOrPhone === "phone") {
      if (!phone.trim()) {
        setErrorMessage("Phone number is required");
        setShowErrorModal(true);
        return false;
      } else if (!/^\d+$/.test(phone)) {
        setErrorMessage("Phone number should contain only digits");
        setShowErrorModal(true);
        return false;
      }
    }
    
    else if (mailOrPhone === "email") {
      if (!email.trim()) {
        setErrorMessage("Email is required");
        setShowErrorModal(true);
        return false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        setErrorMessage("Please enter a valid email address");
        setShowErrorModal(true);
        return false;
      }
    }
    
    if (!password) {
      setErrorMessage("Password is required");
      setShowErrorModal(true);
      return false;
    } else if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      setShowErrorModal(true);
      return false;
    }
    
    if (!cPassword) {
      setErrorMessage("Please confirm your password");
      setShowErrorModal(true);
      return false;
    } else if (password !== cPassword) {
      setErrorMessage("Passwords do not match");
      setShowErrorModal(true);
      return false;
    }
    
    if (!termsChecked) {
      setErrorMessage("You must agree to the Terms of Service");
      setShowErrorModal(true);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await authService.register({
        phone: mailOrPhone === "phone" ? phone : "",
        email: mailOrPhone === "email" ? email : "",
        password,
        referralCode: inviteCode,
      });
      
      router.push("/Login"); 
    } catch (error: any) {
      setErrorMessage(error.message || "Registration failed. Please try again.");
      setShowErrorModal(true);
    }
  };

  return (
    <main className="font-[Inter] w-full min-h-screen flex flex-col justify-start items-center px-[20px] bg-[#4158FC] relative">
      {showErrorModal && (
        <ErrorModal 
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
      
      <nav className="w-full flex justify-end items-center py-[15px]">
        <figure className="w-[22px] h-[22px] relative mr-[17px]">
          <Image src={"/assets/icons/Livechat.svg"} alt="Livechat icon" fill />
        </figure>
        <figure className="w-[22px] h-[22px] relative">
          <Image src={"/assets/icons/Language.svg"} alt="Language icon" fill />
        </figure>
      </nav>

      <section className="w-full flex flex-col justify-start items-start mt-[24px] ">
        <figure className="w-[66px] h-[66px] relative">
          <Image
            src={"/assets/images/logo.png"}
            alt="logo image"
            className="rounded-[50px]"
            fill
          />
        </figure>
        <h1 className="font-normal text-white text-[34px]">Register</h1>
      </section>

      {/* Form */}
      <form onSubmit={handleSubmit} className="relative mt-[35px] w-full flex flex-col justify-start items-center">
        <section className="w-full flex items-center justify-start text-[17px]">
          <section
            onClick={() => {
              setMailOrPhone("phone");
            }}
            className="flex flex-col justify-start items-center mr-[20px] cursor-pointer"
          >
            <span className={`text-white ${mailOrPhone === "email" ? "opacity-[.6]" : "opacity-[1]"}`}>
              PhoneNumber
            </span>
            <div className={`${mailOrPhone === "phone" ? "opacity-[1]" : "opacity-0"} w-[20px] bg-white h-[3px] rounded-[4px]`} />
          </section>

          <section
            onClick={() => {
              setMailOrPhone("email");
            }}
            className="flex flex-col justify-start items-center cursor-pointer"
          >
            <span className={`text-white ${mailOrPhone === "phone" ? "opacity-[.6]" : "opacity-[1]"}`}>
              Email
            </span>
            <div className={`${mailOrPhone === "email" ? "opacity-[1]" : "opacity-[0]"} w-[20px] bg-white h-[3px] rounded-[4px]`} />
          </section>
        </section>

        {mailOrPhone === "phone" && (
          <div className="w-full flex items-center border border-white rounded-[5px] p-[10px] bg-[#ffffff08] my-[6px]">
            <button
              className="bg-transparent text-white outline-none flex items-center"
              onClick={(e) => {
                e.preventDefault();
                setIsModalOpen(true);
              }}
            >
              {selectedCountry.name} ({selectedCountry.code})
            </button>
          </div>
        )}

        <CountryPickerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelect={(country) => {
            setSelectedCountry(country);
            setIsModalOpen(false);
          }}
        />

        {mailOrPhone === "email" && <div className="w-full h-[15px]" />}
        
        {mailOrPhone === "phone" && (
          <CustomInput 
            placeholder="Cell phone number" 
            setValue={setPhone} 
            type="text" 
            value={phone}
          />
        )}
        
        {mailOrPhone === "email" && (
          <CustomInput 
            placeholder="Email address" 
            setValue={setEmail} 
            type="text" 
            value={email}
          />
        )}

        <CustomInput 
          placeholder="Password" 
          setValue={setPassword} 
          type="password" 
          value={password}
        />
        
        <CustomInput 
          placeholder="Confirm password" 
          setValue={setCPassword} 
          type="password" 
          value={cPassword}
        />
        
        <CustomInput 
          placeholder="Invitation code (optional)" 
          setValue={setInviteCode} 
          type="text" 
          value={inviteCode}
        />

        <section className="my-[8px] flex justify-start items-start w-full">
          <div
            onClick={() => setTermsChecked(!termsChecked)}
            className="h-[17px] w-[17px] border border-[#b9b9b9] rounded-[50px] mr-[5px] cursor-pointer mt-1 flex-shrink-0"
          >
            {termsChecked && (
              <figure className="w-[17px] h-[17px] relative">
                <Image src={"/assets/icons/Check.jpg"} alt="Check icon" fill />
              </figure>
            )}
          </div>
          <div>
            <p className="text-[12px] text-[#b9b9b9]">
              I agree and read <span className="text-white">Terms of Service</span>
            </p>
          </div>
        </section>

        <section className="w-full my-[10px]">
          <CustomButton text="Register" type="submit" width={100} bg="black" />
        </section>
      </form>

      <section className="mb-[45px] mt-[12px] text-[12px] text-white flex">
        <p className="opacity-[.4]">Already have an account?</p>
        <Link href={"/Login"} className="ml-1">Go to login?</Link>
      </section>
    </main>
  );
};

export default Register;