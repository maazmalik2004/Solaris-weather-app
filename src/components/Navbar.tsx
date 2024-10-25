"use client";

import React, { useState } from "react";
import axios from "axios";
import { MdWbSunny, MdMyLocation, MdOutlineLocationOn } from "react-icons/md";
import SearchBox from "@/components/SearchBox";

export default function Navbar({currentPlace, setCurrentPlace}) {
    const [city, setCity] = useState("");
    const [error, setError] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const testProp = {
        value: city,
        onChange: async (event) => {
            const val = event.target.value;
            setCity(val);
            if (val.length >= 3) {
                try {
                    const response = await axios.get(`https://api.openweathermap.org/data/2.5/find?q=${val}&appid=${process.env.NEXT_PUBLIC_KEY}`);
                    const sugg = response.data.list.map((item) => item.name);
                    setSuggestions(sugg);
                    setError("");
                    setShowSuggestions(true);
                } catch {
                    setError("Failed to fetch suggestions");
                    setShowSuggestions(false);
                    setSuggestions([]);
                }
            } else {
                setShowSuggestions(false);
                setSuggestions([]);
            }
        },

        onSubmit: (event) => {
            event.preventDefault();
            if (suggestions.length === 0) {
                setError("Location not found");
            } else {
                setError("");
                setShowSuggestions(false);
                setCurrentPlace(city); // Corrected to use `city` instead of `event.target.value`
            }
        }
        
    };

    function handleSuggestionClick(suggestion) {
        setCity(suggestion);
        setShowSuggestions(false);
    }

    return (
        <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
            <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
                <div className="flex items-center justify-center gap-2">
                    <h2 className="text-gray-500 text-3xl">Solara</h2>
                    <MdWbSunny className="text-3xl mt-1 text-yellow-300" />
                </div>
                <section className="flex gap-2 items-center">
                    <MdMyLocation className="text-3xl text-gray-400 hover:opacity-80 cursor-pointer" />
                    <MdOutlineLocationOn className="text-3xl text-gray-400 hover:opacity-80 cursor-pointer"/>
                    <p className="text-gray-400 font-bold text-1xl">{currentPlace}</p>
                    <div className="relative">
                        <SearchBox {...testProp} />
                        <SuggestionBox 
                            showSuggestions={showSuggestions} 
                            suggestions={suggestions} 
                            error={error} 
                            handleSuggestionClick={handleSuggestionClick}
                        />
                    </div>
                </section>
            </div>
        </nav>
    );
}

function SuggestionBox({ showSuggestions, suggestions, error, handleSuggestionClick }) {
    return (
        <>
            {showSuggestions && (
                <ul className="mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2">
                    {error ? (
                        <li className="text-red-500 cursor-default p-1 rounded">{error}</li>
                    ) : (
                        suggestions.map((suggestion, index) => (
                            <li 
                                key={index} 
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="cursor-pointer p-1 rounded hover:bg-gray-200">
                                {suggestion}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </>
    );
}
