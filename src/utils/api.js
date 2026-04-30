const host = window.location.hostname;
const port = "5000";


export const API_BASE_URL = `http://${host}:${port}/api`;
export const IMG_BASE_URL = `http://${host}:${port}/uploads/berita/`;

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};
