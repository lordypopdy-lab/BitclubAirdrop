import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../src/assets/js/main";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';

const Home = () => {

    const [tokens, setTokens] = useState(0.0);
    const [canFarm, setCanFarm] = useState(false);
    const [farming, setFarming] = useState(false);
    const [canClaim, setCanClaim] = useState(false);
    const [accInfo, setAccountInfo] = useState({ balance: "", farmStartTime: "", farmDuration: "", ClaimStat: "" });

    const userId = "example-user-id";

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                console.log("Fetching farming status...");
                const response = await axios.get(`/api/farming/status/${userId}`);
                const {
                    tokenBalance,
                    farmingStartTime,
                    farmingDuration,
                    claimed,
                } = response.data;

                const formartted = (time) => {
                    const dateString = time;
                    const date = new Date(dateString);

                    const hours = date.getUTCHours().toString().padStart(2, '0');
                    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
                    const seconds = date.getUTCSeconds().toString().padStart(2, '0');

                    const formattedTime = `${hours}:${minutes}:${seconds} UTC`;

                    return formattedTime;
                }


                const formattedBalance = new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(tokenBalance);

                setAccountInfo({
                    balance: formattedBalance,
                    farmStartTime: formartted(farmingStartTime),
                    farmDuration: formartted(farmingDuration),
                    ClaimStat: claimed
                })
                console.log(claimed);

                // Set token balance
                if (typeof tokenBalance === "number" && !isNaN(tokenBalance)) {
                    setTokens(tokenBalance);
                } else {
                    setTokens(0.0);
                }

                // Parse farmingStartTime and validate farmingDuration
                const startTime = new Date(farmingStartTime).getTime();
                if (isNaN(startTime)) {
                    console.error("Invalid farmingStartTime:", farmingStartTime);
                    return;
                }

                const currentTime = Date.now();

                if (!claimed) {
                    if (typeof farmingDuration !== "number" || isNaN(farmingDuration)) {
                        console.error("Invalid farmingDuration:", farmingDuration);
                        return;
                    }

                    const elapsedTime = currentTime - startTime;

                    if (elapsedTime >= farmingDuration) {
                        setCanClaim(true);
                        setFarming(false);
                        setTokens(200.0);
                    } else {
                        setFarming(true);

                        // Start token counting based on elapsed time
                        startTokenCounting(elapsedTime, farmingDuration);

                        const remainingTime = farmingDuration - elapsedTime;
                        setTimeout(() => {
                            setCanClaim(true);
                            setFarming(false);
                            setTokens(200.0);
                        }, remainingTime);
                    }
                } else {
                    setCanFarm(true);
                }
            } catch (error) {
                console.error("Error fetching farming status:", error);
                setTokens(0.0);
            }
        };


        fetchStatus();
    }, [userId]);

    const startTokenCounting = (elapsedTime, farmingDuration) => {
        if (!farmingDuration || isNaN(farmingDuration)) {
            console.error("Invalid farming duration");
            return;
        }

        const totalTokens = 200.0;
        const intervalDuration = 100;
        const increment = totalTokens / (farmingDuration / intervalDuration);

        let currentTokens = (elapsedTime / farmingDuration) * totalTokens;

        const interval = setInterval(() => {
            if (currentTokens >= totalTokens) {
                clearInterval(interval);
                setTokens(totalTokens.toFixed(1));
                return;
            }

            currentTokens += increment;
            setTokens(currentTokens.toFixed(1));
        }, intervalDuration);

        return () => clearInterval(interval);
    };


    const farmTokens = async () => {
        try {
            const response = await axios.post(`/api/farming/start`, { userId });
            const { farmingDuration } = response.data;

            setCanFarm(false);
            setFarming(true);

            startTokenCounting(0, farmingDuration);

            setTimeout(() => {
                setCanClaim(true);
                setFarming(false);
                setTokens(200.0); // Ensure tokens reach max at the end
            }, farmingDuration);
        } catch (error) {
            console.error("Error starting farming:", error);
        }
    };

    const claimTokens = async () => {
        try {
            const response = await axios.post(`/api/farming/claim`, { userId, tokens });
            const { tokenBalance } = response.data;

            toast.success(`You have claimed ${tokenBalance} tokens!`, {
                style: {
                    backgroundColor: 'black',
                    color: 'white',
                },
            })
            setTokens(0.0);
            setCanClaim(false);

            setTimeout(() => setCanFarm(true), 3 * 60 * 60 * 1000); // Enable farming after 3 hours
        } catch (error) {
            console.error("Error claiming tokens:", error);
        }
    };

    // const farmTokens = async () => {
    //     try {
    //         const response = await axios.post(`/api/farming/start`, { userId });
    //         const { farmingDuration } = response.data;

    //         setCanFarm(false);
    //         setFarming(true);
    //         setTimeout(() => setCanClaim(true), farmingDuration);
    //     } catch (error) {
    //         console.error("Error starting farming:", error);
    //     }
    // };

    // // Claim tokens
    // const claimTokens = async () => {
    //     try {
    //         const response = await axios.post(`/api/farming/claim`, { userId });
    //         const { tokenBalance } = response.data;

    //         alert(`You have claimed ${tokenBalance} tokens!`);
    //         setTokens(0.0); // Reset token count
    //         setCanClaim(false);
    //         setTimeout(() => setCanFarm(true), 3 * 60 * 60 * 1000); // Enable farming after 3 hours
    //     } catch (error) {
    //         console.error("Error claiming tokens:", error);
    //     }
    // };


    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
    };

    const cards = [
        { id: 1, title: "Card 1", content: "This is Card 1" },
        { id: 2, title: "Card 2", content: "This is Card 2" },
    ];

    const bgStyles = {
        position: "relative",
        width: "100%",
        height: "300px",
        background: "url(/logo/Home.jpeg)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        textAlign: "center",
        marginTop: "-25px",
        btn: {
            marginTop: "-40px",
            width: "100%",
            border: "none",
            outline: "none",
            borderRadius: "12px",
            padding: "15px",
            fontFamily: `"Poppins", sans-serif`,
            fontWeight: "500",
            fontStyle: "normal",
        },
        logo: {
            margin: "4px",
            borderRadius: ""
        }
    }

    return (
        <>
            {/* <!-- preloader area start --> */}
            {/* <div className="preloader" id="preloader">
                <div className="preloader-inner">
                    <div id="wave1">
                    </div>
                    <div className="spinner">
                        <div className="dot1"></div>
                        <div className="dot2"></div>
                    </div>
                </div>
            </div> */}
            {/* <!-- preloader area end --> */}
            <div className="body-overlay" id="body-overlay"></div>
            <div style={{ backgroundImage: "url(https://c.tenor.com/TZaIBNauQfAAAAAd/tenor.gif) no-repeat center center/cover", }} className="single-page-area background-container">
                <div className="p-4 title-area justify-content-between">
                    <img src="/logo/logoAirdrop.jpeg" className="animate" width={50} alt="" srcset="" />
                    <div className="text-center">
                        {/* <TonConnectButton className="tonConnect" /> */}
                        <span style={{ display: "flex", }}> 0 TON</span>
                    </div>
                </div>
                <div className="profile-details" style={{ backgroundImage: "url(/logo/logoAirdrop.jpeg)", marginTop: "-10px" }}>
                    <ul>
                        <li>
                            <h6 style={{ fontSize: "14px" }}>{accInfo.farmStartTime}</h6>
                            <span>Farming Time</span>
                        </li>
                        <li>
                            <h6 style={{ fontSize: "14px" }}>{accInfo.farmDuration}</h6>
                            <span>Farming Duration</span>
                        </li>
                        <li>
                            <h6>{accInfo.ClaimStat}</h6>
                            <span>isClaimed</span>
                        </li>
                    </ul>
                </div>
                <div style={{ marginLeft: "-10px" }} className="container">
                    <div class="balance-container">
                        <img className="animate" src="/logo/logo1.png" alt="" srcset="" />
                        <span style={{ color: "#fff" }} class=" ">{accInfo.balance}</span>
                    </div>
                </div>
                <div className="container-fluid m-0">
                    <Slider {...settings}>
                        {cards.map((card) => (
                            <div key={card.id} style={{ padding: "10px" }}>
                                <div style={{ padding: "25px", opacity: "0.9", background: "#07080a", borderRadius: "10px", boxShadow: "0 4px 8px 0 rgba(29, 28, 28, 0.2), 0 6px 20px 0 rgba(47, 46, 46, 0.19)" }}>
                                    <div style={{ boxShadow: "0 4px 8px 0 rgba(29, 28, 28, 0.2), 0 6px 20px 0 rgba(47, 46, 46, 0.19),", padding: "8px", background: "#0f1216", width: "100px", textAlign: "center", borderRadius: "7px" }}>
                                        <div>
                                            <img className="animate" style={{ marginLeft: "20px", marginBottom: "6px", marginTop: "16px" }} width={40} src="/logo/flash.png" alt="" srcset="" />
                                            <p style={{ color: "#e1e1e1" }}>Bitclub</p>
                                            <button style={{ border: "none", outline: "none", fontSize: "14px", background: "#07080a", color: "#e1e1e1", borderRadius: "12px" }}>
                                                +2000 BP
                                            </button>
                                        </div>
                                    </div>
                                    <button style={{ float: "right", background: "#0f1216", color: "#e1e1e1", marginTop: "-50px", marginRight: "4px", border: "none", padding: "5px", width: "80px", fontSize: "15px", borderRadius: "50px" }}>
                                        Claim
                                    </button>
                                    <h5 style={{ float: "right", marginTop: "-120px", color: '#e1e1e1', padding: "10px", borderRadius: "7px", boxShadow: "0 4px 8px 0 rgba(29, 28, 28, 0.2), 0 6px 20px 0 rgba(47, 46, 46, 0.19)" }}>
                                        Daily!
                                    </h5>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
                <div style={bgStyles} className="container-fluid">
                    {!canClaim && (
                        <button
                            onClick={farmTokens}
                            disabled={!canFarm || farming}
                            style={bgStyles.btn}
                        >
                            <img src="/logo/flash.png" width={18} alt="" srcset="" />
                            {farming ? `Farming in Progress...${tokens}` : `Start Farming`}
                        </button>
                    )}

                    {canClaim && (
                        <button
                            onClick={claimTokens}
                            style={bgStyles.btn}
                        >
                            {/* {
                                padding: "10px 20px",
                                fontSize: "16px",
                                cursor: "pointer",
                                border: "none",
                                borderRadius: "12px",
                                width: "100%",
                                fontFamily: `"Poppins", sans-serif`,
                                fontWeight: "500",
                                fontStyle: "normal",
                            } */}
                            <img src="/logo/flash.png" width={18} alt="" srcset="" />
                            Farm Tokens
                            <span className="m-2">{tokens}</span>
                        </button>
                    )}
                </div>
                <div className="main-footer-bottom d-block text-center">
                    <ul>
                        <li>
                            <Link to="#">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M180-120q-25 0-42.5-17.5T120-180v-76l160-142v278H180Zm140 0v-160h320v160H320Zm360 0v-328L509-600l121-107 190 169q10 9 15 20.5t5 24.5v313q0 25-17.5 42.5T780-120H680ZM120-310v-183q0-13 5-25t15-20l300-266q8-8 18.5-11.5T480-819q11 0 21.5 3.5T520-804l80 71-480 423Z" /></svg><br />
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="ranking">
                                <svg xmlns="#" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m140-220-60-60 300-300 160 160 284-320 56 56-340 384-160-160-240 240Z" /></svg><br />
                                Ranking
                            </Link>
                        </li>
                        <li>
                            <Link className="menu-bar" to="/task">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m422-232 207-248H469l29-227-185 267h139l-30 208ZM320-80l40-280H160l360-520h80l-40 320h240L400-80h-80Zm151-390Z" /></svg><br />
                                Task
                            </Link>
                        </li>
                        <li>
                            <Link to="ref">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" /></svg><br />
                                Frens
                            </Link>
                        </li>
                        <li>
                            <Link to="/airdrio">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-80 120-280v-400l360-200 360 200v400L480-80ZM364-590q23-24 53-37t63-13q33 0 63 13t53 37l120-67-236-131-236 131 120 67Zm76 396v-131q-54-14-87-57t-33-98q0-11 1-20.5t4-19.5l-125-70v263l240 133Zm40-206q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400Zm40 206 240-133v-263l-125 70q3 10 4 19.5t1 20.5q0 55-33 98t-87 57v131Z" /></svg><br />
                                Airdrop
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Home
