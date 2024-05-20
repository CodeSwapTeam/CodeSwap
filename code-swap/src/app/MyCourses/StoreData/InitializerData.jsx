'use client';

import { useRef } from "react";
import useStateManagement from "./StateManagement";


export default function InitializerData(categoriesData){
    const categories = categoriesData.categories;
    //console.log('categoriesData', categories)
    const initializer = useRef(false);

    if(!initializer.current){
        
       useStateManagement.setState({states: {categories: categories}})
        
        initializer.current = true;
    }

    return null;
}