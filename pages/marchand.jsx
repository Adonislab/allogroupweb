import DashLayout from "./components/layout/dashboardLayout";
import { register_user } from '@/services';
import Link from 'next/link';
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image'
import { Avatar } from "@material-tailwind/react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function marchand() {

    const [formData, setFormData] = useState({ phoneNumber: "", email: "", name:"", });
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
    <DashLayout>
      <div className="p-4 border- border-gray-20 border-dashe rounded-lg dark:border-gray-700 mt-14">
        
        
        
        <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-blue-500">
            <Image
                src={Avatar}
                width={500}
                height={500}
                alt="Avatar"
                className="w-16 h-16 rounded-full border-4 border-white-500 dark:border-white"
            />
            
            <p className="text-2xl text-white-400 dark:text-white">
                Merci !!! Sans vous, pas de Allô Group pour cette cause travaillons ensemble. Vous pouvez 
                commencer avec la création de votre boutique.
            </p>
        </div>
      
        <form onSubmit={handleSubmit} className="bg-blue-500  space-y-4 md:space-y-6 " action="#">
            <div className='text-left'>
                <label htmlFor="name" className="block mb-2 text-2xl font-medium text-indigo-700 dark:text-white">Votre prénom</label>
                <input onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="text" name="name" id="name" className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-white-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-white-500" placeholder="John" required="" />
            </div>

            <div className='text-left'>
                <label htmlFor="email" className="block mb-2 text-2xl font-medium text-indigo-700 dark:text-white">Votre email</label>
                <input onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="email" name="email" id="email" className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
            </div>

            <div className='text-left'>
                    <label htmlFor="phone" className="block mb-2 text-2xl font-medium text-indigo-700 dark:text-white">Complétez votre numéro de téléphone</label>
                    <PhoneInput
                        country={country}
                        value={formData.phoneNumber}
                        onChange={(phoneNumber) => setFormData({ ...formData, phoneNumber })}
                        inputProps={{
                            id: 'phone', 
                            name: 'phone',
                            required: true,
                            placeholder: '+229000000',
                            className: 'bg-indigo-50 border border-indigo-300 text-indigo-700 text-2xl rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
                        }}
                        inputComponent={({ country, ...restProps }) => (        
                                            <input {...restProps} />
                        )}
                        />
                </div>
           
            
            <div className='text-left'>
                <label htmlFor="champion" className="block mb-2 text-2xl font-medium text-indigo-700 dark:text-white">J'aimerais être un marchand</label>
                
                <select
                    onChange={(e) => setFormData({ ...formData, champion: e.target.value })}
                    name="champion"
                    id="champion"
                    className="bg-indigo-50 border border-indigo-300 text-indigo-700 text-2xlrounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                >
                    <option value="">Sélectionnez une option</option>
                    <option value="oui">Oui, je veux être un marchand</option>
                    <option value="non">Non, je ne veux pas etre un marchand</option>
                </select>
            </div>

            <label for="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-500 dark:hover:bg-bray-800 dark:bg-gray-100 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-200 dark:hover:bg-gray-200">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Téléversez la photo de la boutique</span> ou glissez et dépossez</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" />
                    
                    <div className="w-3/4 mx-auto bg-gray-200 rounded-full dark:bg-gray-600">
                            <div className="bg-orange-400 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{width: "45%"}}> 45%</div>
                        </div>
                    <div className="mt-8">

                    <button type="submit" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Chargement</button>
                    </div>
                    {/* <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Light</button> */}
            </label>

            <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-2xl px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Etre un marchand</button>
            
            <p className="text-2xl font-light text-white dark:text-indigo-400">
                Je suis un marchand  <Link href="/dashboard" className="font-medium text-white hover:underline dark:text-primary-500">Connexion</Link>
            </p>
        </form>
    </div>  
    </DashLayout>
  )
}
