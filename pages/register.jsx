import { register_user } from '@/services';
import Link from 'next/link';
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Head from '@/utils/head';

export default function Register() {
    const [formData, setFormData] = useState({ phoneNumber: "", email: "", password: "" , password2: ""});
    const country = 'bj';


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
    
        const { password, password2 } = formData;

        if (password !== password2) {
            toast.error("Les mots de passe ne correspondent pas");
        } else if (password.length < 6 || password2.length < 6) {
            toast.error("Les mots de passe doivent avoir au moins six caractères");
        } else {
            const res = await register_user(formData);
            if (res.success) {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        }
    };

    return (
        <>
            <Head/>
            <section className="bg-indigo-700 text-center">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-indigo-800 dark:border-indigo-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-indigo-700 md:text-2xl dark:text-white">
                                Création de compte
                            </h1>
                            <form onSubmit={handleSubmit} className=" space-y-4 md:space-y-6" action="#">
                                <div className='text-left'>
                                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-indigo-700 dark:text-white">Complétez votre numéro de téléphone</label>
                                <PhoneInput
                                    country={country}
                                    value={formData.phoneNumber}
                                    onChange={(phoneNumber) => setFormData({ ...formData, phoneNumber })}
                                    inputProps={{
                                            id: 'phone', 
                                            name: 'phone',
                                            required: true,
                                            placeholder: '+229000000',
                                            className: 'bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
                                    }}
                                    inputComponent={({ country, ...restProps }) => (        
                                            <input {...restProps} />
                                    )}
                                />
                                </div>
                                <div className='text-left'>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-indigo-700 dark:text-white">Votre email</label>
                                    <input onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="email" name="email" id="email" className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
                                </div>
                                <div className='text-left'>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-indigo-700 dark:text-white">Votre mot de passe</label>
                                    <input onChange={(e) => setFormData({ ...formData, password: e.target.value })} type="password" name="password" id="password" placeholder="••••••••" className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                                </div>
                                <div className='text-left'>
                                    <label htmlFor="password2" className="block mb-2 text-sm font-medium text-indigo-700 dark:text-white">Confirmez votre mot de passe</label>
                                    <input onChange={(e) => setFormData({ ...formData, password2: e.target.value })} type="password" name="password2" id="password2" placeholder="••••••••" className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                                </div>

                                <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">S'inscrire</button>
                                <p className="text-sm font-light text-indigo-500 dark:text-indigo-400">
                                    J'ai déjà un compte  <Link href="/connexion" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Connexion</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer />
        </>
    )
}
