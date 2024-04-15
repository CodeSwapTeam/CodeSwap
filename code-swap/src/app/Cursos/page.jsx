"use client";
import ListCourses from "../Components/ListCourses"

import interactionsType from "../contexts/interactionsType";
import { useInteractionLogger } from "../contexts/InteractionContext";
import NavBarPublic from "../components/NavBarPublic/page";

export default function CursosLayout(){

    const {logInteraction} = useInteractionLogger();

    logInteraction(interactionsType.PAGE_LOAD_COURSES);
    return(
        <div>
            <NavBarPublic/>
            <ListCourses/>
        </div>
    )
}