export const saveRecentlyPlayed = (songs) => {
    sessionStorage.setItem('recentlyPlayed', JSON.stringify(songs));
  };
  
  export const getRecentlyPlayed = () => {
    return JSON.parse(sessionStorage.getItem('recentlyPlayed')) || [];
  };
  
  export const saveFavorites = (songs) => {
    localStorage.setItem('favorites', JSON.stringify(songs));
  };
  
  export const getFavorites = () => {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  };