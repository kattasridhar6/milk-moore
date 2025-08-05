useEffect(() => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    try {
      const decoded = jwt_decode(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        // Token already expired
        localStorage.clear();
        window.location.href = '/login';
      } else {
        // Token is valid, set timeout to logout later
        const timeout = (decoded.exp - now) * 1000;
        const logoutTimer = setTimeout(() => {
          localStorage.clear();
          window.location.href = '/login';
        }, timeout);

        return () => clearTimeout(logoutTimer); // Cleanup on unmount
      }
    } catch (err) {
      localStorage.clear();
      window.location.href = '/login';
    }
  }
}, []);
