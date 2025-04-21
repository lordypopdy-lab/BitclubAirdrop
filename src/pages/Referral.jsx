import React from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { TonConnectButton } from '@tonconnect/ui-react';

const Referral = () => {

    const userId = "example-user03";

    const { referralCode } = useParams();
    const [refBL, setRFBL] = useState(0);
    const [refList, setRefList] = useState([]);

    useEffect(() => {
        const start = async () => {
            if (referralCode) {
                await axios.post("/referral", { referralCode, userId })
                    .then(response => response.json())
                    .then(data => console.log(`Referral Code: ${data.referralCode}`))
                    .catch(error => console.log('Error fetching referral code.'));
            }
        }

        const getReferrals = async () => {
            await axios.post("/getReferrals", { userId }).then((data) => {
                if (data.data.referrals) {
                    setRefList(data.data.referrals)
                }
            })
        }

        const getRefBal = async () => {
            await axios.post("/getRefBal", { userId }).then((data) => {
                if (data.data.RB) {
                    setRFBL(data.data.RB.profitMade);
                }
            })
        }
        start();
        getRefBal();
        getReferrals();
    }, [referralCode]);

    const Style = {
        btn: {
            width: "100%",
            border: "none",
            outline: "none",
            borderRadius: "9px",
            padding: "15px",
            margin: "5px",
            fontFamily: `"Poppins", sans-serif`,
            fontWeight: "500",
            fontStyle: "normal",
        },
        logo: {
            margin: "4px",
            borderRadius: ""
        },
        btn2: {
            width: "100%",
            border: "none",
            outline: "none",
            borderRadius: "9px",
            padding: "15px",
            margin: "5px",
            fontFamily: `"Poppins", sans-serif`,
            fontWeight: "500",
            fontStyle: "normal",
            background: "#fff",
        }
    }

    const startReferral = async () => {
        await axios.post("/startReferral", { userId }).then((data) => {
            if (data.data.referralLink) {
                handleCopy(data.data.referralLink)
            }else if(data.data.findLink){
                handleCopy(data.data.findLink)
            }
        })
    }

    const handleCopy = async (textToCopy) => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            toast.success("Copied successfully!",
                {
                    style: {
                        backgroundColor: 'black',
                        color: 'white',
                    },
                }
            );
        } catch (err) {
            toast.error("Failed to copy!")
        }
    };
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
                    <div className="custom-ton-button">
                        <TonConnectButton />
                    </div>
                    <div className="text-center">
                        <img src="https://cryptologos.cc/logos/toncoin-ton-logo.png?v=040" width={20} alt="" srcset="" />
                        <span style={{ display: "flex", }}> 0 TON</span>
                    </div>
                </div>
                <div style={{ marginTop: "120px" }} className="container-fluid">
                    <div className=" d-flex text-dark text-center justify-content-between">
                        <div style={Style.btn2}>
                            <img className='mb-2 m-1' src="data:image/png;base64,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" width={22} alt="" srcset="" />
                            $Total Referrals <br /> {refList.length > 0 ? (<span>{refList.length - 1}</span>) : 0}
                        </div>
                        <div style={Style.btn2}>
                            <img className="mb-2 m-1" src="data:image/png;base64,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" width={22} alt="" srcset="" />
                            $Total Royalties <br />
                            <img width={20} className="rounded m-1" src="/logo/logoAirdrop.jpeg" alt="" />
                            {refBL.toFixed(2)}
                        </div>
                    </div>
                    <h3 className='text-center text-light'>Invite and Earn!</h3>
                    <p className='text-light text-center f-800'>
                        Invite friends, get 0.5% of their minigame bets in
                    </p>
                    <h5 className='text-center text-light'>$BITCLUBs and $TON!</h5>
                    <div className=" d-flex justify-content-between">
                        <button onClick={startReferral} style={Style.btn}>
                            <img className='mb-1' src="data:image/png;base64,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" width={18} alt="" srcset="" />
                            Share link
                        </button>
                        <button onClick={startReferral} style={Style.btn}>
                            <img className="m-1" src="data:image/png;base64,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" width={18} alt="" srcset="" />
                            Copy link
                        </button>
                    </div>
                    <Toaster
                        position="top-center"
                        reverseOrder={false}
                        containerStyle={{ fontSize: "12px", }}
                        toastOptions={{ duration: 4000 }}
                    />
                </div>
                <div className="main-footer-bottom d-block text-center">
                    <ul>
                        <li>
                            <Link to="/">
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
                            <Link to="#">
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

export default Referral
