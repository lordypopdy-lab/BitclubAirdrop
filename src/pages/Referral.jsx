import { useState } from "react";

const Referral = () => {
  const [userData, setUserData] = useState(null);

  const fetchUserData = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe.user;
      console.log("USER:", user);
      if (user) {
        setUserData({
          id: user.id || "N/A",
          first_name: user.first_name || "N/A",
          last_name: user.last_name || "N/A",
          username: user.username || "N/A",
          photo_url: user.photo_url || "",
        });
      } else {
        console.error("User data not available.");
      }
    } else {
      console.error("Telegram WebApp API not found.");
    }
  };

  return (
    <div>
      <button onClick={fetchUserData}>Fetch User Data</button>
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
