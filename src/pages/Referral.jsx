import { useState } from "react";

const Referral = () => {
  const [userData, setUserData] = useState(null);

  const fetchUserData = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe.user;
      if (user) {
        console.log(user)
        setUserData(user);
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
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Referral
