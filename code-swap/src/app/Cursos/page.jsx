"use client";
import ListCourses from "../Components/ListCoursesAdmPainel"

import interactionsType from "../contexts/interactionsType";
import { useInteractionLogger } from "../contexts/InteractionContext";
import NavBarPublic from "../Components/NavBarPublic";

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