import React, { useState } from "react";

const ContactForm: React.FC = () => {
  // Estado para almacenar los valores de los campos del formulario.
  const [formData, setFormData] = useState({
    name: "", // Nombre del usuario
    phone: "", // Teléfono del usuario
    email: "", // Correo electrónico del usuario
    message: "", // Mensaje del usuario
  });

  // Estado para rastrear errores de validación en los campos.
  const [errors, setErrors] = useState({
    name: false, // Error en el nombre
    phone: false, // Error en el teléfono
    email: false, // Error en el correo electrónico
    message: false, // Error en el mensaje
  });

  /**
   * Función para validar un campo específico del formulario.
   * @param {string} name - Nombre del campo.
   * @param {string} value - Valor actual del campo.
   * @returns {boolean} - Indica si el valor es válido.
   */
  const validateField = (name: string, value: string): boolean => {
    switch (name) {
      case "name":
        // El nombre debe comenzar con mayúsculas y puede incluir espacios.
        return /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/.test(value);
      case "phone":
        // El teléfono puede incluir dígitos, espacios, guiones y un prefijo opcional (+).
        return /^\+?[0-9\s\-]+$/.test(value);
      case "email":
        // Validación básica de correo electrónico.
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case "message":
        // El mensaje debe tener al menos 20 caracteres.
        return value.length >= 20;
      default:
        return true; // Por defecto, se considera válido.
    }
  };

  /**
   * Función que maneja los cambios en los campos del formulario.
   * Actualiza el estado `formData` con el nuevo valor.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target; // Obtiene el nombre y valor del campo.
    setFormData({ ...formData, [name]: value }); // Actualiza el estado del formulario.
  };

  /**
   * Función que se ejecuta cuando un campo pierde el foco.
   * Valida el campo y actualiza el estado de errores.
   * @param {React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>} e
   */
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target; // Obtiene el nombre y valor del campo.
    const isValid = validateField(name, value); // Valida el campo.
    setErrors({ ...errors, [name]: !isValid }); // Actualiza el estado de errores.
  };

  /**
   * Función que maneja el envío del formulario.
   * Por ahora, solo muestra los datos en la consola.
   * @param {React.FormEvent} e
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Previene la recarga de la página.
    console.log("Form submitted:", formData); // Muestra los datos del formulario en la consola.
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Formulario de contacto */}
      <form
        className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow-lg"
        onSubmit={handleSubmit} // Maneja el envío del formulario.
      >
        {/* Campo de entrada para el Nombre */}
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange} // Maneja los cambios en el campo.
          onBlur={handleBlur} // Valida el campo cuando pierde el foco.
          className={`p-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          required // Campo obligatorio.
        />

        {/* Campo de entrada para el Teléfono */}
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`p-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.phone ? "border-red-500" : "border-gray-300"
          }`}
          required
        />

        {/* Campo de entrada para el Correo Electrónico */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`p-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          required
        />

        {/* Campo de texto para el Mensaje */}
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`p-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.message ? "border-red-500" : "border-gray-300"
          }`}
          required
        ></textarea>

        {/* Botón para enviar el formulario */}
        <button
          type="submit"
          className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          Send Message
        </button>
      </form>

      {/* Información de contacto adicional */}
      <div className="mt-6 text-center text-gray-700">
        <ul className="space-y-4">
          {/* Email */}
          <li className="text-xl">
            Email:{" "}
            <a
              href="mailto:javier.polo@a.vedrunasevillasj.es"
              className="text-blue-600"
            >
              javier.polo@a.vedrunasevillasj.es
            </a>
          </li>
          {/* Teléfono */}
          <li className="text-xl">Phone: +34 123 456 789</li>
          {/* LinkedIn */}
          <li className="text-xl">
            LinkedIn:{" "}
            <a
              href="https://www.linkedin.com/in/javier-polo-rivas-8a7304339/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              https://www.linkedin.com/in/javier-polo-rivas-8a7304339/
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContactForm;
