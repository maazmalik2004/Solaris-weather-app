"use client"

import React from "react";
import { IoSearch } from "react-icons/io5";
import cn from "@/utils/cn"

export default function SearchBox({ value, onChange, onSubmit, className }) {
    return (
        <form onSubmit={onSubmit} className={cn("flex relative items-center justify-center h-10",className)}>
            <input
                type="text"
                placeholder="search here..."
                value={value}
                onChange={event => onChange(event)}
                className="focus:outline-none h-full bg-red-50 focus:bg-blue-100 p-3 rounded-md transition duration-500 ease-in-out"
            />
            <button onClick = {onSubmit} type="submit" className="absolute right-0 p-2">
                <IoSearch />
            </button>
        </form>
    );
}
