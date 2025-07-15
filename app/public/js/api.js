export const api = {
  /**
   * 🔗 URL base de la API. Cambiar si la API corre en otro puerto o dominio.
   * @type {string}
   */
  baseUrl: "http://localhost:3000",

  /**
   * 📥 GET: Retrieves data from a specific REST API path.
   * @param {string} param - Relative path (e.g., '/users', '/emotions').
   * @returns {Promise<any>} JS object retrieved from the server.
   * @throws {Error} If a network failure or incorrect response occurs.
   */
  get: async (param) => {
    try {
      const response = await fetch(`${api.baseUrl}${param}`);
      if (!response.ok) {
        throw new Error("error getting data");
      }
      return await response.json();
    } catch (error) {
      console.error("Error in GET request:", error);
      throw error;
    }
  },

  /**
   * 📤 POST: Creates a new resource in the backend.
   * @param {string} param - Relative path (e.g., '/users').
   * @param {object} data - Object with the information to send.
   * @returns {Promise<any>} JSON object with the server's response.
   * @throws {Error} If the operation fails.
   */
  post: async (param, data) => {
    try {
      // Saves the response received from the API where it was sent through the base URL and the route parameter.
      const response = await fetch(`${api.baseUrl}${param}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), //the body where the data to be saved is stored
      });
      if (!response.ok) {
        throw new Error("Error creating data"); // If the response fails, send an error message
      }
      return await response.json(); // If the response was successful, it converts it to js and returns it.
    } catch (error) {
      console.error("Error in POST request:", error);
      throw error;
    }
  },

  /**
   * ✏️ PUT: Updates an existing resource (usually with an ID).
   * @param {string} paramId - Path with ID (e.g., '/users/1').
   * @param {object} data - Updated data.
   * @returns {Promise<any>} Server response.
   * @throws {Error} If the request fails.
   */
  put: async (paramId, data) => {
    try {
      const response = await fetch(`${api.baseUrl}${paramId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Error updating data");
      }
      return await response.json();
    } catch (error) {
      console.error("PUT request failed:", error);
      throw error;
    }
  },

  /**
   * 🗑️ DELETE: Deletes a resource from the REST API.
   * @param {string} RouteId - Route with ID to delete (e.g., '/users/1').
   * @returns {Promise<any>} Server response.
   * @throws {Error} If the operation fails.
   */
  delete: async (routeid) => {
    try {
      const response = await fetch(`${api.baseUrl}${routeid}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error deleting data");
      }

      return await response.json();
    } catch (error) {
      console.error("Error in DELETE request:", error);
      throw error;
    }
  },
};
