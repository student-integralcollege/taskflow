import React, { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Inputwrapper } from '../assets/dummy'

const API_URL = "http://localhost:4000"
const INITIAL_FORM = { name: "", email: "", password: "" }

const Signup = () => {

    const [formData, setFormData] = useState(INITIAL_FORM);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const handleSubmit = async () => {
        e.preventDefault()
        setLoading(true)
        setMessage({ text: "", type: "" })
        try {
            const { data } = await axios.post(`${API_URL}/api/usr/register`, formData)
            console.log("Signup Successfull", data);
            setMessage({ text: "Registration successful you can now log in.", type: "success" })
            setFormData(INITIAL_FORM)
        }
        catch (err) {
            console.log("Signup error", err)
            setMessage({ text: err.response?.data?.message || "An error occured. please try again.", type: "error" })
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className='max-w-md w-full bg-white shadow-lg border border-plus-100 rounded-xl p-8'>
            <div className='mb-6 text-center'>
                <div className='w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4'>
                    <UserPlus className='w-8 h-8 text-white' />
                </div>
                <h2 className='text-2xl font-bold text-gray-800'>
                    Create Account
                </h2>
                <p className='text-gray-500 text-sm mt-1'>join TaskFlow to mange your tasks</p>
            </div>
            {message.text && (
                <div className={message.type === 'success' ? MESSAGE_SUCCESS : MESSAGE_ERROR}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-4'>
                {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
                    <div key={name} className={Inputwrapper}>
                        <Icon className='text-purple-500 w-5 h-5 mr-2' />
                    </div>
                ))}

            </form>
        </div>
    )
}

export default Signup