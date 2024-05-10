import { useQuery, useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

const {data : courseSelected} = useQuery({
    queryKey: ['courseSelected'],
    queryFn: async () => {
        //reotnar o curso selecionado
        const course = queryClient.getQueryData('courseSelected');
        return course;
    },
    staleTime: 1000 * 60 * 5 // 5 minutos

})


const {data : coursesCached} = useQuery({
    queryKey: ['courses-Cached'],
    queryFn: async () => {
        //reotnar o curso selecionado
        const courses = queryClient.getQueryData(['courses-Cached']);
        return courses;
    },
    staleTime: 1000 * 60 * 5 // 5 minutos

})