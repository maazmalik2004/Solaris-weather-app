import React from "react";
import cn from "@/utils/cn";

export default function Container(props){
    return (
        <div {...props} className = {cn("w-full bg-white border rounded-xl flex py-4 shadow-sm", props.className)}/>
    );
}