"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import CustomButton from "@/components/CustomButton/Button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthCode from "react-auth-code-input";
import authService from "@/services/authService";

const ErrorModal = ({ message, onClose }: { message: string; onClose: () => void; }) => {
    return (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
            <div className="bg-black rounded-lg p-4 w-fit max-w-md">
                <p className="text-sm text-white">{message}</p>
                <button
                    onClick={onClose}
                    className="mt-4 bg-white text-black px-4 py-2 rounded"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

const Verify = () => {
    const router = useRouter();
    const isLoggedIn = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        if (isLoggedIn) {
            router.push("/");
        }
    }, [isLoggedIn, router]);

    const [otp, setOtp] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
    const [resendTimer, setResendTimer] = useState<number>(60); // 60 seconds timer
    const [canResend, setCanResend] = useState<boolean>(true);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendTimer > 0 && !canResend) {
            timer = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        } else if (resendTimer === 0) {
            setCanResend(true);
        }
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [resendTimer, canResend]);

    useEffect(() => {
        const url = new URL(window.location.href);
        const email = url.searchParams.get('email') || "";
        console.log(email);
        setEmail(email);
    }, []);

    const validateForm = () => {
        if (!otp || otp.length !== 6) {
            setErrorMessage("Please enter a valid 6-digit OTP");
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
            const result = await authService.verifyOtp(email, otp);
            console.log(result);
            router.push("/Login");
        } catch (error: any) {
            setErrorMessage(error.message || "OTP verification failed. Please try again.");
            setShowErrorModal(true);
        }
    };

    const resendOtp = async () => {
        if (!canResend) return;

        try {
            const result = await authService.resendOtp(email);
            setErrorMessage("OTP sent successfully. Please check your email.");
            setShowErrorModal(true);
            setCanResend(false);
            setResendTimer(60); // Reset timer to 60 seconds
            console.log(result);
        } catch (error: any) {
            setErrorMessage(error.message || "OTP resend failed. Please try again later.");
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

            <section className="w-full flex flex-col justify-start items-start mt-[24px]">
                <figure className="w-[66px] h-[66px] relative">
                    <Image
                        src={"/assets/images/logo.png"}
                        alt="logo image"
                        className="rounded-[50px]"
                        fill
                    />
                </figure>
                <h1 className="font-normal text-white text-[34px]">Verify Email</h1>
                <p className="text-white opacity-70 mt-2">
                    Enter the 6-digit code sent to your email.
                </p>
            </section>

            <form onSubmit={handleSubmit} className="relative mt-[35px] w-full flex flex-col justify-start items-center">
                <div className="w-full flex flex-col items-center">
                    <AuthCode
                        onChange={(value) => setOtp(value)}
                        allowedCharacters="numeric"
                        containerClassName="flex justify-center gap-2"
                        inputClassName="w-12 h-12 text-center text-white bg-[#ffffff08] border border-[#ffffff9f] rounded-[6px] text-xl"
                    />
                </div>
                <section className="w-full my-[20px]">
                    <CustomButton disabled={otp.length !== 6} text="Verify" type="submit" width={100} bg={otp.length !== 6 ? "gray-800" : "black"} />
                </section>
            </form>

            <section className="mb-[45px] mt-[12px] text-[12px] text-white flex">
                <p className="opacity-[.4]">Did not receive code?</p>
                {canResend ? (
                    <Link href={'#'} onClick={resendOtp} className="ml-1">
                        Resend OTP
                    </Link>
                ) : (
                    <span className="ml-1 opacity-[.4]">
                        Resend in {resendTimer}s
                    </span>
                )}
            </section>
        </main>
    );
};

export default Verify;
