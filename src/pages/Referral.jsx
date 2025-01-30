import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Referral = ({ userId }) => {
  const [referralLink, setReferralLink] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const generateReferralLink = () => {
      const link = `https://t.me/your_mini_app?start=${userId}`;
      setReferralLink(link);
    };

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    generateReferralLink();
    fetchUserData();
  }, [userId]);

  return (
    <div>
      <h1>Your Referral Link</h1>
      <p>{referralLink}</p>
      {userData && (
        <div>
          <h2>Your Rewards</h2>
          <p>Mining Rewards: {userData.miningRewards}</p>
          <p>Referral Rewards: {userData.referralRewards}</p>
        </div>
      )}
    </div>
  );
};

export default Referral;