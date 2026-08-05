import React, { useState } from 'react'
import { assets } from '@/assets/assets'

export default function MyProfile() {

    const [userData, setUserData] = useState({
        name: "Edward Vincent",
        image: assets.profile_pic,
        email: "richardjameswap@gmail.com",
        phone: "+1 123 456 7890",
        address: {
            line1: "57th Cross, Richmond",
            line2: "Circle, Church Road, London"
        },
        gender: "Male",
        dob: "2000-07-20"
    })

    const [isEdit, setIsEdit] = useState(false)

    return (
        <div className="max-w-2xl px-6 py-8">

            {/* Profile Image */}
            <div className="mb-5">
                <img
                    src={userData.image}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                />
            </div>

            {/* Name */}
            {
                isEdit ? (
                    <input
                        type="text"
                        value={userData.name}
                        onChange={(e) =>
                            setUserData({
                                ...userData,
                                name: e.target.value
                            })
                        }
                        className="text-3xl font-semibold text-gray-800 border-b border-gray-300 outline-none pb-2 w-full max-w-xl"
                    />
                ) : (
                    <h1 className="text-3xl font-semibold text-gray-800">
                        {userData.name}
                    </h1>
                )
            }

            {/* Horizontal Line */}
            <hr className="my-5 border-gray-200" />

            {/* Contact Information */}
            <div>

                <h2 className="text-sm font-medium text-gray-500 underline mb-5">
                    CONTACT INFORMATION
                </h2>

                {/* Email */}
                <div className="flex mb-4">
                    <p className="w-28 text-sm text-gray-600">
                        Email id:
                    </p>

                    {
                        isEdit ? (
                            <input
                                type="email"
                                value={userData.email}
                                onChange={(e) =>
                                    setUserData({
                                        ...userData,
                                        email: e.target.value
                                    })
                                }
                                className="text-sm text-blue-400 border-b border-gray-300 outline-none px-1"
                            />
                        ) : (
                            <p className="text-sm text-blue-400">
                                {userData.email}
                            </p>
                        )
                    }
                </div>

                {/* Phone */}
                <div className="flex mb-4">
                    <p className="w-28 text-sm text-gray-600">
                        Phone:
                    </p>

                    {
                        isEdit ? (
                            <input
                                type="text"
                                value={userData.phone}
                                onChange={(e) =>
                                    setUserData({
                                        ...userData,
                                        phone: e.target.value
                                    })
                                }
                                className="text-sm text-blue-400 border-b border-gray-300 outline-none px-1"
                            />
                        ) : (
                            <p className="text-sm text-blue-400">
                                {userData.phone}
                            </p>
                        )
                    }
                </div>

                {/* Address */}
                <div className="flex mb-4">
                    <p className="w-28 text-sm text-gray-600">
                        Address:
                    </p>

                    {
                        isEdit ? (
                            <div className="flex flex-col gap-2">
                                <input
                                    type="text"
                                    value={userData.address.line1}
                                    onChange={(e) =>
                                        setUserData({
                                            ...userData,
                                            address: {
                                                ...userData.address,
                                                line1: e.target.value
                                            }
                                        })
                                    }
                                    className="text-sm text-gray-600 border-b border-gray-300 outline-none px-1"
                                />

                                <input
                                    type="text"
                                    value={userData.address.line2}
                                    onChange={(e) =>
                                        setUserData({
                                            ...userData,
                                            address: {
                                                ...userData.address,
                                                line2: e.target.value
                                            }
                                        })
                                    }
                                    className="text-sm text-gray-600 border-b border-gray-300 outline-none px-1"
                                />
                            </div>
                        ) : (
                            <div className="text-sm text-gray-600">
                                <p>{userData.address.line1}</p>
                                <p>{userData.address.line2}</p>
                            </div>
                        )
                    }
                </div>

            </div>

            {/* Basic Information */}
            <div className="mt-8">

                <h2 className="text-sm font-medium text-gray-500 underline mb-5">
                    BASIC INFORMATION
                </h2>

                {/* Gender */}
                <div className="flex mb-4">
                    <p className="w-28 text-sm text-gray-600">
                        Gender:
                    </p>

                    {
                        isEdit ? (
                            <select
                                value={userData.gender}
                                onChange={(e) =>
                                    setUserData({
                                        ...userData,
                                        gender: e.target.value
                                    })
                                }
                                className="text-sm text-gray-600 border border-gray-300 rounded px-2 py-1 outline-none"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        ) : (
                            <p className="text-sm text-gray-600">
                                {userData.gender}
                            </p>
                        )
                    }
                </div>

                {/* Birthday */}
                <div className="flex mb-4">
                    <p className="w-28 text-sm text-gray-600">
                        Birthday:
                    </p>

                    {
                        isEdit ? (
                            <input
                                type="date"
                                value={userData.dob}
                                onChange={(e) =>
                                    setUserData({
                                        ...userData,
                                        dob: e.target.value
                                    })
                                }
                                className="text-sm text-gray-600 border border-gray-300 rounded px-2 py-1 outline-none"
                            />
                        ) : (
                            <p className="text-sm text-gray-600">
                                {new Date(userData.dob).toLocaleDateString(
                                    'en-GB',
                                    {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    }
                                )}
                            </p>
                        )
                    }
                </div>

            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-10">

                <button
                    onClick={() => setIsEdit(false)}
                    className="px-9 py-2.5 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition"
                >
                    Save information
                </button>

                <button
                    onClick={() => setIsEdit(true)}
                    className="px-7 py-2.5 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition"
                >
                    Edit
                </button>

            </div>

        </div>
    )
}