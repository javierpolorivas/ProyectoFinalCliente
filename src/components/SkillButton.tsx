import { useState } from 'react';

// Interfaces para los datos de habilidades y proyectos
interface Skill {
  name: string; // Nombre de la habilidad.
  image: string; // URL de la imagen representativa de la habilidad.
}

interface Project {
  id: number; // ID del proyecto.
  name: string; // Nombre del proyecto.
  description: string; // Descripción del proyecto.
  start_date: string; // Fecha de inicio del proyecto.
  end_date: string; // Fecha de finalización del proyecto.
  repository_url: string; // URL del repositorio del proyecto.
  demo_url: string; // URL de la demo del proyecto.
  picture: string; // Imagen representativa del proyecto.
  state: string; // Estado del proyecto (por ejemplo, completado, en progreso).
}

interface SkillButtonProps {
  initialSkills: Skill[]; // Lista inicial de habilidades pasadas como props.
}

// Componente funcional `SkillButton`
const SkillButton: React.FC<SkillButtonProps> = ({ initialSkills }) => {
  // Estado para almacenar la lista de habilidades.
  const [skills] = useState<Skill[]>(initialSkills);

  // Estado para almacenar los proyectos relacionados con la habilidad seleccionada.
  const [projects, setProjects] = useState<Project[]>([]);

  // Estado para manejar mensajes de error.
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Función para obtener los proyectos asociados a una habilidad específica.
   * @param {string} tech - Nombre de la tecnología o habilidad.
   */
  const fetchProjectsBySkill = async (tech: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/projects/tec/${tech}`); // Petición a la API.
      const data = await response.json(); // Conversión de la respuesta a JSON.

      if (response.ok) {
        // Mapeo de los datos del proyecto para asegurar que cumplen con la estructura esperada.
        setProjects(
          (data.data || []).map((project: any) => ({
            id: project.id,
            name: project.name,
            description: project.description,
            start_date: project.start_date,
            end_date: project.end_date,
            repository_url: project.repository_url,
            demo_url: project.demo_url,
            picture: project.picture,
            state: project.stateProjectName || "Unknown",
          }))
        );
        setErrorMessage(null); // Limpia cualquier mensaje de error.
      } else {
        // Muestra un mensaje de error si la respuesta no fue exitosa.
        setErrorMessage(data.message || "An error occurred");
        setProjects([]); // Vacía la lista de proyectos.
      }
    } catch (error) {
      // Manejo de errores en caso de fallos en la petición.
      console.error("Error fetching projects:", error);
      setErrorMessage("Failed to fetch projects. Please try again."); // Mensaje de error.
      setProjects([]); // Vacía la lista de proyectos.
    }
  };

  return (
    <div>
      {/* Sección para mostrar las habilidades como botones */}
      <div className="flex flex-wrap justify-center gap-8">
        {skills.map((skill, index) => (
          <button
            key={index} // Clave única para cada botón basado en el índice.
            onClick={() => fetchProjectsBySkill(skill.name)} // Llama a la función para buscar proyectos.
            className="bg-gray-100 shadow-lg rounded-lg p-6 w-48 text-center shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 border-2 border-gray-200"
          >
            <img
              src={skill.image} // Imagen de la habilidad.
              alt={skill.name} // Texto alternativo de la imagen.
              className="w-auto h-16 mx-auto mb-4" // Estilo para la imagen.
            />
            <p className="text-lg font-semibold">{skill.name}</p> {/* Nombre de la habilidad. */}
          </button>
        ))}
      </div>

      {/* Sección para mostrar los proyectos */}
      <div className="mt-8">
        {errorMessage ? (
          // Muestra el mensaje de error si existe.
          <p className="text-center text-red-500">{errorMessage}</p>
        ) : projects.length > 0 ? (
          // Muestra los proyectos en un grid si hay proyectos disponibles.
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id} // Clave única basada en el ID del proyecto.
                className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <img
                  src={project.picture} // Imagen del proyecto.
                  alt={project.name} // Texto alternativo de la imagen.
                  className="w-full h-32 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">{project.name}</h2> {/* Nombre del proyecto */}
                  <p className="mt-2 text-gray-600">{project.description}</p> {/* Descripción del proyecto */}
                  <p className="mt-4 text-sm text-gray-500">
                    <strong>Start Date:</strong> {project.start_date} <br />
                    <strong>End Date:</strong> {project.end_date}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    <strong>State:</strong> {project.state}
                  </p>
                  {/* Enlaces a repositorio y demo */}
                  <div className="flex gap-4 mt-4">
                    <a
                      href={project.repository_url} // URL del repositorio.
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Repository
                    </a>
                    <a
                      href={project.demo_url} // URL de la demo.
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 hover:underline"
                    >
                      Demo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Muestra un mensaje si no hay proyectos disponibles.
          <p className="text-center text-gray-500">No projects found for the selected technology.</p>
        )}
      </div>
    </div>
  );
};

export default SkillButton;
