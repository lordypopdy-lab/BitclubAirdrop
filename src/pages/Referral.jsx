import { useState, useEffect } from "react";

const Referral = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const fetchUserData = () => {
    try {
      if (window.Telegram && window.Telegram.WebApp) {
        console.log("Telegram WebApp detected");
        const initData = window.Telegram.WebApp.initDataUnsafe;
        console.log("Init Data:", initData);

        if (initData && initData.user) {
          console.log("USER:", initData.user);
          setUserData({
            id: initData.user.id || "N/A",
            first_name: initData.user.first_name || "N/A",
            last_name: initData.user.last_name || "N/A",
            username: initData.user.username || "N/A",
            photo_url: initData.user.photo_url || "",
          });
        } else {
          setError("User data not available.");
        }
      } else {
        setError("Telegram WebApp API not found.");
      }
    } catch (err) {
      setError("An error occurred while fetching user data.");
      console.error(err);
    }
  };

  useEffect(() => {
    window.Telegram?.WebApp?.expand();
  }, []);

  return (
    <div>
      <button onClick={fetchUserData}>Fetch User Data</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {userData && (
        <div>
          <p><strong>User ID:</strong> {userData.id}</p>
          <p><strong>First Name:</strong> {userData.first_name}</p>
          <p><strong>Last Name:</strong> {userData.last_name}</p>
          <p><strong>Username:</strong> {userData.username}</p>
          {userData.photo_url && <img src={userData.photo_url} alt="User" width={50} />}
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Referral
