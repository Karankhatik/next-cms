"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import googleIconSvg from '@/assets/icons/googleIcon.svg'
import Link from 'next/link';
import { commonValidationRules, validateForm } from '@/helpers/validation';
import { LoginForm } from "@/types/validation";
import { useRouter, useSearchParams } from 'next/navigation';

import { LoaderButton } from '@/components/Buttons';
import { useAppDispatch } from "@/store/store";
import { setAuthState, setUser } from "@/store/authSlice";
import Toast from '@/helpers/toasters';
import { Suspense } from 'react';
import { login } from '@/services/commonAPIs/commonApis';
import PasswordInput from '@/components/inputFields/passwordField';



type FormErrors = { [key: string]: string };

const LoginWithoutSuspense = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const router = useRouter();

  const searchParams = useSearchParams();


  async function handleLogin(formData: LoginForm) {
    const { isValid, errors } = await validateForm(formData, commonValidationRules);
    try {
      
      setLoading(true);
      if (isValid) {
        const response = await login(formData);

        if (response.success) {
          Toast.successToast({ message: response.message, autoClose: 1000, position: 'top-right' });
          router.push('/');
          dispatch(setAuthState(true));
          dispatch(setUser(response.user));
          setEmail('');
          setPassword('');
        } else {
          setErrors(errors);
        }
      } else {
        setErrors(errors);
      }
    } catch (error) {      
      //toast.error("An unexpected error occurred. Please try again.");
      setErrors(errors);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setErrors({});
    const formData: LoginForm = {
      email: email.trim().toLowerCase(),
      password: password,
    }
    handleLogin(formData);
  };


  const gettingPasswordValue = (password: string) => {
    setPassword(password);
  }

  return (
    <main className="w-full mt-10 flex flex-col items-center justify-center px-4 ">
      <div className="max-w-sm w-full border p-8 text-gray-600 space-y-5 rounded-lg border-black shadow-2xl shadow-gray-400" style={{ minHeight: '500px' }}>       <div className="text-center pb-2">
        <div className="mt-5">
          <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Login to your account</h3>
        </div>
      </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              placeholder="Email"
              name="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500  text-xs">{errors.email}</p>}
          </div>

          <div>
            <PasswordInput gettingPasswordValue={gettingPasswordValue} isPassword={true} />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link href="/auth/reset-password" className="text-center text-black hover:text-orange-500">Forgot password?</Link>
          </div>

          <LoaderButton loading={loading} buttonText="continue" />
        </form>

        <p className="text-center">Dont have an account? <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</Link></p>

      </div>
    </main>
  )
}

const Login = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginWithoutSuspense />
    </Suspense>
  )
}

export default Login

