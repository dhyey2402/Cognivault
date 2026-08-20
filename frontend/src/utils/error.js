export const getErrorMessage = (error) => {
  if (!error) return "An unexpected error occurred.";

  // Extract from standard axios response
  const responseData = error.response?.data;
  
  if (responseData) {
    const detail = responseData.detail;
    
    // FastAPI validation errors (array of objects)
    if (Array.isArray(detail)) {
      return detail
        .map(item => item?.msg || JSON.stringify(item))
        .filter(Boolean)
        .join(", ");
    }
    
    // FastAPI HTTP Exceptions with string detail
    if (typeof detail === "string") {
      return detail;
    }
    
    // Some APIs use 'message' instead of 'detail'
    if (typeof responseData.message === "string") {
      return responseData.message;
    }
    
    // Fallback if detail is an object but not an array
    if (typeof detail === "object" && detail !== null) {
      return detail.msg || detail.message || JSON.stringify(detail);
    }
  }

  // Axios network error or custom thrown errors with a message
  if (typeof error.message === "string") {
    // Axios network error string
    if (error.message === "Network Error") {
      return "Unable to connect to the server. Please check your internet connection.";
    }
    return error.message;
  }
  
  // Fallback for string errors thrown directly
  if (typeof error === "string") {
    return error;
  }

  return "Something went wrong. Please try again.";
};
