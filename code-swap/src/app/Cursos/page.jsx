"use client";
import ListCourses from "../Components/ListCourses"

import interactionsType from "../contexts/interactionsType";
import { useInteractionLogger } from "../contexts/InteractionContext";

export default function CursosLayout(){

    const {logInteraction} = useInteractionLogger();

    logInteraction(interactionsType.PAGE_LOAD_COURSES);
    return(
        <div>
            Lista de cursos

            <ListCourses/>
        </div>
    )
}