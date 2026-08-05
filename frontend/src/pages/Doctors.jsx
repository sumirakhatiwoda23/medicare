import { AppContext } from '@/context/AppContext'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function Doctors() {

    const { speciality } = useParams()
    const [filterDoc, setFilterDoc] = useState([])
    const [showFilter, setShowFilter] = useState(false)

    const nav = useNavigate()
    const { doctors } = useContext(AppContext)

    const applyFilter = () => {
        if (speciality) {
            setFilterDoc(
                doctors.filter(doc => doc.speciality === speciality)
            )
        } else {
            setFilterDoc(doctors)
        }
    }

    useEffect(() => {
        applyFilter()
    }, [doctors, speciality])

    return (
        <div className="mx-4 sm:mx-10 my-8">

            <p className="text-gray-600 mb-6">
                Browse through the doctors specialist.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-5">

                {/* Filter Button */}
                <button
                    className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
                        showFilter ? 'bg-primary text-white' : ''
                    }`}
                    onClick={() => setShowFilter(prev => !prev)}
                >
                    Filters
                </button>

                {/* Filter Sidebar */}
                <div
                    className={`flex-col gap-4 text-sm text-gray-600 ${
                        showFilter ? 'flex' : 'hidden sm:flex'
                    }`}
                >

                    {/* General Physician */}
                    <p
                        onClick={() =>
                            speciality === 'General physician'
                                ? nav('/doctors')
                                : nav('/doctors/General physician')
                        }
                        className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer hover:bg-primary hover:text-white ${
                            speciality === 'General physician'
                                ? 'bg-indigo-100 text-black'
                                : ''
                        }`}
                    >
                        General physician
                    </p>

                    {/* Gynecologist */}
                    <p
                        onClick={() =>
                            speciality === 'Gynecologist'
                                ? nav('/doctors')
                                : nav('/doctors/Gynecologist')
                        }
                        className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer hover:bg-primary hover:text-white ${
                            speciality === 'Gynecologist'
                                ? 'bg-indigo-100 text-black'
                                : ''
                        }`}
                    >
                        Gynecologist
                    </p>

                    {/* Dermatologist */}
                    <p
                        onClick={() =>
                            speciality === 'Dermatologist'
                                ? nav('/doctors')
                                : nav('/doctors/Dermatologist')
                        }
                        className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer hover:bg-primary hover:text-white ${
                            speciality === 'Dermatologist'
                                ? 'bg-indigo-100 text-black'
                                : ''
                        }`}
                    >
                        Dermatologist
                    </p>

                    {/* Pediatricians */}
                    <p
                        onClick={() =>
                            speciality === 'Pediatricians'
                                ? nav('/doctors')
                                : nav('/doctors/Pediatricians')
                        }
                        className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer hover:bg-primary hover:text-white ${
                            speciality === 'Pediatricians'
                                ? 'bg-indigo-100 text-black'
                                : ''
                        }`}
                    >
                        Pediatricians
                    </p>

                    {/* Neurologist */}
                    <p
                        onClick={() =>
                            speciality === 'Neurologist'
                                ? nav('/doctors')
                                : nav('/doctors/Neurologist')
                        }
                        className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer hover:bg-primary hover:text-white ${
                            speciality === 'Neurologist'
                                ? 'bg-indigo-100 text-black'
                                : ''
                        }`}
                    >
                        Neurologist
                    </p>

                    {/* Gastroenterologist */}
                    <p
                        onClick={() =>
                            speciality === 'Gastroenterologist'
                                ? nav('/doctors')
                                : nav('/doctors/Gastroenterologist')
                        }
                        className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer hover:bg-primary hover:text-white ${
                            speciality === 'Gastroenterologist'
                                ? 'bg-indigo-100 text-black'
                                : ''
                        }`}
                    >
                        Gastroenterologist
                    </p>

                </div>

                {/* Doctors Grid */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6">

                    {filterDoc.map((item, index) => (

                        <div
                            onClick={() => nav(`/appointment/${item._id}`)}
                            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500"
                            key={index}
                        >

                            {/* Doctor Image */}
                            <img
                                className="bg-blue-50 w-full"
                                src={item.image}
                                alt={item.name}
                            />

                            {/* Doctor Details */}
                            <div className="p-4">

                                {/* Availability */}
                                <div className="flex items-center gap-2 text-sm text-green-500 mb-1">

                                    <p className="w-2 h-2 bg-green-500 rounded-full"></p>

                                    <p>
                                        Available
                                    </p>

                                </div>

                                {/* Name */}
                                <p className="text-gray-900 text-lg font-medium">
                                    {item.name}
                                </p>

                                {/* Speciality */}
                                <p className="text-gray-600 text-sm">
                                    {item.speciality}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    )
}