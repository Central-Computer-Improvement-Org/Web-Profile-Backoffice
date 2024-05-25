'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Logo from '../../../public/assets/image/logo.png';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import InputField from '@/components/form/inputField';
import DefaultButton from '@/components/button/defaultButton';
import Link from 'next/link';
import request from '../utils/request';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const Login = () => {
  const router = useRouter();

  const [typeInput, setTypeInput] = useState(true);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('username');
    const savedRememberMe = localStorage.getItem('checkbox');

    if (savedRememberMe && savedRememberMe !== '') {
      setEmail(savedEmail || '');
      setRememberMe(true);
    }
  }, []);

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleClickType = () => {
    setTypeInput(!typeInput);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rememberMe && email !== '' && password !== '') {
      localStorage.setItem('username', email);
      localStorage.setItem('checkbox', rememberMe);
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('checkboxxxxxx');
      router.push('/dashboard');
    }
    request
      .post('/auth/login', {
        email: email,
        password: password,
      })
      .then(function (response) {
        console.info(response.data);
        if (response.data.code === 200 || response.data.code === 201) {
          Cookies.set('token', response.data.data.access);
          localStorage.setItem('nim', response.data.data.nim);
          toast.dismiss();
          toast.success('Success Login');
          router.push('/dashboard');
        } else {
          window.alert('gagal login');
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  return (
    <section className="bg-gray-50 ">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 "
        >
          <Image className="w-24" src={Logo} width={0} height={0} alt="logo" />
        </Link>
        <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <InputField
                id={'email'}
                name={'email'}
                onChange={handleChangeEmail}
                placeholder={'user@gmail.com'}
                type={'email'}
                value={email}
                required
                label={'Your email'}
              />
              <InputField
                id={'password'}
                name={'password'}
                onChange={handleChangePassword}
                placeholder={'••••••••'}
                type={typeInput ? 'password' : 'text'}
                value={password}
                required
                icon={
                  typeInput ? (
                    <IoMdEyeOff className="text-xl" onClick={handleClickType} />
                  ) : (
                    <IoMdEye className="text-xl" onClick={handleClickType} />
                  )
                }
                label={'Password'}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="rememberMe"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500">
                      Remember me
                    </label>
                  </div>
                </div>
                <Link
                  href="#"
                  className="text-sm font-medium text-primary-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <DefaultButton
                title={'Sign in'}
                type={'submit'}
                full
                status={'primary'}
                size={'base'}
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
