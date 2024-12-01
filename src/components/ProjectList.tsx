import { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Iconos para los botones de navegación.

interface Project {
    id: number; // ID del proyecto.
    name: string; // Nombre del proyecto.
    description: string; // Descripción del proyecto.
    start_date: string; // Fecha de inicio del proyecto.
    picture: string; // URL de la imagen del proyecto.
}

const Projects = () => {
    // Estado para manejar la página actual.
    const [page, setPage] = useState(0);

    // Estado para almacenar la lista de proyectos.
    const [posts, setPosts] = useState<Project[]>([]);

    // Estado para manejar el número total de páginas disponibles.
    const [totalPages, setTotalPages] = useState(0);

    // Estado para manejar el término de búsqueda.
    const [searchTerm, setSearchTerm] = useState('');

    // URL base de la API.
    const url: string = "http://localhost:8080/api/v1/projects";

    // Hook `useEffect` para cargar proyectos cuando cambian la página o el término de búsqueda.
    useEffect(() => {
        peti(page, searchTerm);
    }, [page, searchTerm]);

    /**
     * Función que realiza la petición a la API para obtener los proyectos.
     * @param {number} p - Número de la página.
     * @param {string} search - Término de búsqueda.
     */
    const peti = async (p = 0, search = '') => {
        // Si hay un término de búsqueda pero tiene menos de 3 caracteres, no hace la petición.
        if (search && search.length < 3) return;

        // Construcción de la URL para la petición según si hay búsqueda o no.
        const requestUrl = search
            ? `${url}/${search}` // Busca un proyecto específico.
            : `${url}?size=3&page=${p}`; // Obtiene proyectos por página.

        const response = await fetch(requestUrl); // Realiza la petición.
        const data = await response.json(); // Convierte la respuesta en JSON.

        // Si hay búsqueda, formatea el resultado como un único proyecto.
        if (search) {
            const project = data.data ? {
                id: data.data.id,
                name: data.data.name,
                description: data.data.description,
                start_date: data.data.start_date,
                picture: data.data.picture, // Asegúrate de que el campo picture esté en la respuesta.
            } : null;

            setPosts(project ? [project] : []); // Actualiza la lista con un solo proyecto.
            setTotalPages(1); // La búsqueda siempre tiene una sola página.
        } else {
            // Si no hay búsqueda, formatea todos los proyectos obtenidos.
            setPosts(data.content.map((project: any) => ({
                id: project.id,
                name: project.name,
                description: project.description,
                start_date: project.start_date,
                picture: project.picture, // Asegúrate de que el campo picture esté en la respuesta.
            })) || []);
            setTotalPages(data.totalPages || 1); // Actualiza el total de páginas.
        }
    };

    /**
     * Función para eliminar un proyecto por su ID.
     * @param {number} id - ID del proyecto a eliminar.
     */
    const handleDelete = async (id: number) => {
        const response = await fetch(`${url}/${id}`, {
            method: 'DELETE', // Método HTTP para eliminar.
        });

        if (response.ok) {
            // Elimina el proyecto del estado local si la petición fue exitosa.
            setPosts(posts.filter(project => project.id !== id));
        } else {
            console.error('Error al eliminar el proyecto');
        }
    };

    /**
     * Componente que representa una tarjeta de proyecto.
     * @param {Project} project - Proyecto a renderizar.
     * @param {boolean} test - Indica si debe mostrar el botón de eliminar (opcional).
     */
    const ProjectCard = ({ project, test = false }: { project: Project; test?: boolean }) => {
        return (
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 border-2 border-gray-200">
                {/* Imagen del proyecto */}
                <div className="flex justify-center mb-4">
                    <img 
                        src={project.picture} // Imagen del proyecto.
                        alt={project.name} // Texto alternativo.
                        className="w-full h-48 object-cover rounded-md border-4 border-gray-500" 
                    />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{project.name}</h2>
                <p className="mt-2 text-gray-600">{project.description}</p>
                <p className="mt-4 text-sm text-gray-500">
                    <strong>Start Date: </strong>{project.start_date}
                </p>
                {test && (
                    <button
                        onClick={() => handleDelete(project.id)} // Botón para eliminar el proyecto.
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all duration-300"
                    >
                        Eliminar
                    </button>
                )}
            </div>
        );
    };

    return (
        <>
            {/* Barra de búsqueda */}
            <div className="mb-6 flex justify-center">
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el término de búsqueda.
                    onKeyDown={(e) => e.key === 'Enter' && peti(page, searchTerm)} // Busca al presionar Enter.
                    className="w-full max-w-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
            </div>

            {/* Lista de proyectos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((project) => (
                    <ProjectCard key={project.id} project={project} test={true} /> // EN ESTA LINEA SE CAMBIA LA VARIABLE TEST DE ESTA MANERA PODEMOS PONER
                                                                                    // LA PAGINA EN MODO DESARROLLADOR Y NOS DEJARA ELIMINAR PROYECTOS.
                ))}
            </div>

            {/* Botones de navegación */}
            <div className="mt-6 flex justify-center items-center space-x-4">
                <button
                    onClick={() => setPage(page - 1)} // Navega a la página anterior.
                    disabled={page === 0} // Deshabilitado en la primera página.
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg disabled:bg-gray-300 hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                    <FaArrowLeft className="inline-block mr-2" />
                    Página anterior
                </button>

                <span className="text-lg font-semibold text-gray-700">
                    Página {page + 1} de {totalPages}
                </span>

                <button
                    onClick={() => setPage(page + 1)} // Navega a la página siguiente.
                    disabled={posts.length === 0 || page === totalPages - 1} // Deshabilitado si no hay más proyectos.
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg disabled:bg-gray-300 hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                    Página siguiente
                    <FaArrowRight className="inline-block ml-2" />
                </button>
            </div>
        </>
    );
};

export default Projects;
