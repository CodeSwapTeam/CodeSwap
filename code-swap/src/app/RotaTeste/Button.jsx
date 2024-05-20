
import { revalidateTag } from "next/cache";

export default function ButtonClick(){

    async function handleClick(form){
        'use server'
        console.log('Atualizar Categorias')
        revalidateTag('All-Categories')
    }

    return(
        <form action={handleClick}>
            <button style={{color: 'white' , width: '100px'}} type='submit'>Atualizar Categorias</button>
        </form>
    )
}