'use client';

import {useFormStatus} from 'react-dom';

export default function ButtonSubmit() {
    const {pending} = useFormStatus();

    

    return (
        <button  type="submit" disabled={pending} style={{border:'1px solid green', borderRadius:'10px', margin:'10px', padding:'10px', width:'100px', backgroundColor:'green', color:'white'}}>
            {pending ? 'Enviando...' : 'Enviar'}
        </button>
    );
}

