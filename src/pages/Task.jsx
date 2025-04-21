import { useEffect, useState } from "react";

import "../../src/assets/js/main";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { NavLink } from "react-router-dom";

const Task = () => {

    const [activeTask, setActiveTask] = useState([]);
    const [taskDone, setTaskDone] = useState([]);
    const [taskButton, setTaskButton] = useState({ value: "", taskID: "" });

    const userID = "example-user01";

    useEffect(() => {
        const getActiveTask = async () => {
            try {
                const response = await axios.post("/activeTask", { userID });
                const datas = response.data.data.reverse();
                setActiveTask(datas)
            } catch (error) {
                console.error(`Server Error: ${error}`);
            }
        };

        getActiveTask();

        const getTaskDone = async () => {
            const response = await axios.post("/task", { userID });
            const datas = response.data.data.reverse();
            setTaskDone(datas);
        }

        getTaskDone();
    }, []);

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

    const handleTaskButtonClick = async (TaskID, Link) => {

        setTaskButton({ value: "load", taskID: TaskID });
        console.log("TaskButton set to loading:", { value: "load", taskID: TaskID });
        try {
            const { data } = await axios.post("/createTask", { TaskID, userID });
            if (data) {
                window.location.href = Link
                console.log(data)
                setTimeout(() => {
                    setTaskButton({ value: "claim", taskID: TaskID });
                }, 5000);
                console.log("Task completed, TaskButton set to claim.");
            }
        } catch (error) {
            toast.error("Error Creating Task", {
                style: {
                    backgroundColor: 'black',
                    color: 'white',
                },
            });
            console.error("Error creating task:", error);
            setTaskButton({ value: "", taskID: "" });
        }
    };

    const [taskButtonMap, setTaskButtonMap] = useState({});

    const updateTaskButton = (taskID, value) => {
        setTaskButtonMap((prev) => ({
            ...prev,
            [taskID]: value,
        }));
    };

    const claimFunction = async (claimID, claimValue) => {
        updateTaskButton(claimID, "load");
        setTaskButton({value: "load", taskID: claimID})
        try {
            const { data } = await axios.post('/claimed', { claimID, userID, claimValue });
            if (data.message) {
                console.log("Task Claimed Completed", data);
                updateTaskButton(claimID, "completed");
                toast.success("Task Claimed Completed!", {
                    style: {
                        backgroundColor: 'black',
                        color: 'white',
                    },
                });
                setTaskButton({ value: "completed", taskID: claimID });
            }
        } catch (error) {
            console.error("Error claiming task:", error);
            // Specific error logging
            if (error.response) {
                toast.error("Server error");
                console.error("Server error:", error.response.data);
            } else if (error.request) {
                console.error("No response from server:", error.request);
                toast.error("No response from server");
            } else {
                console.error("Error setting up request:", error.message);
                toast.error("Error setting up request");
            }

            setTaskButton({ value: "error", taskID: claimID }); // Error state
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
            <div className="single-page-area">
                <div className="title-area d-flex justify-content-between">
                    <img src="/logo/logoAirdrop.jpeg" className="animate" width={50} alt="" srcset="" />
                    <h2 className="text-center" style={{ color: "#f8f9fa", fontSize: "25px", marginRight: "120px" }}>Missions</h2>
                    <div className="text-center">
                        <img src="https://cryptologos.cc/logos/toncoin-ton-logo.png?v=040" width={20} alt="" srcset="" />
                        <span style={{ display: "flex", }}> 0 TON</span>
                    </div>
                </div>
                <div style={{ background: "#0f1216" }} className="container mt-4 p-3">
                    <div className="sub-container">
                        <Toaster
                            position="top-center"
                            reverseOrder={false}
                            containerStyle={{ fontSize: "12px", }}
                            toastOptions={{ duration: 4000 }}
                        />
                        <Slider {...settings}>
                            {cards.map((card) => (
                                <div key={card.id} style={{ padding: "10px" }}>
                                    <div style={{ padding: "25px", background: "#07080a", borderRadius: "10px", boxShadow: "0 4px 8px 0 rgba(29, 28, 28, 0.2), 0 6px 20px 0 rgba(47, 46, 46, 0.19)" }}>
                                        <div style={{ boxShadow: "0 4px 8px 0 rgba(29, 28, 28, 0.2), 0 6px 20px 0 rgba(47, 46, 46, 0.19),", padding: "8px", background: "#0f1216", width: "100px", textAlign: "center", borderRadius: "7px" }}>
                                            <div>
                                                <img className="animate" style={{ marginLeft: "20px", marginBottom: "6px", marginTop: "16px" }} width={40} src="/logo/logoAirdrop.jpeg" alt="" srcset="" />
                                                <p style={{ color: "#e1e1e1" }}>Bitclub</p>
                                                <button style={{ border: "none", outline: "none", fontSize: "14px", background: "#07080a", color: "#e1e1e1", borderRadius: "12px" }}>
                                                    +2000 BP
                                                </button>
                                            </div>
                                        </div>
                                        <button style={{ float: "right", background: "#0f1216", color: "#e1e1e1", marginTop: "-50px", marginRight: "-18px" }} className="btn">
                                            Get
                                        </button>
                                        <h5 style={{ float: "right", marginTop: "-120px", color: '#e1e1e1', padding: "10px", borderRadius: "7px", boxShadow: "0 4px 8px 0 rgba(29, 28, 28, 0.2), 0 6px 20px 0 rgba(47, 46, 46, 0.19)" }}>
                                            Partners
                                        </h5>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
                <div className="profile-details" style={{ backgroundImage: "url(assets/img/other/profile-bg.png)" }}>
                    <ul>
                        <li>
                            <h6>06</h6>
                            <span>Total Game </span>
                        </li>
                        <li>
                            <h6>20</h6>
                            <span>Total Wins  </span>
                        </li>
                        <li>
                            <h6>15</h6>
                            <span>Total Loses </span>
                        </li>
                    </ul>
                </div>
                <div className="container">
                    <ul className="profile-list-inner">
                        {
                            activeTask.length > 0 ? activeTask.map((task) => (
                                <li key={task._id} style={{ background: "#0f1216" }} className="p-1 rounded">
                                    <span className="single-profile-wrap" style={{ marginBottom: "-26px", background: "#07080a" }}>
                                        <img className="animateTask" width={40} src={`${task.Icon}`} alt="" />
                                        {task.Message}
                                    </span>
                                    <a>
                                        {taskButton.value === "load" && taskButton.taskID === task.TaskID ? (
                                            <button className="claimbtn pb-2 pt-1" disabled style={{ marginTop: "-20px" }}>
                                                <div className="spinner-border spinner-border-sm" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </button>
                                        ) : taskButton.value === "claim" && taskButton.taskID === task.TaskID ? (
                                            <button
                                                onClick={()=>claimFunction(task.TaskID, task.Value)}
                                                className="claimbtn"
                                                style={{
                                                    fontSize: "13px",
                                                    marginTop: "-20px"
                                                }}
                                                >
                                                Claim
                                            </button>
                                        ) : (
                                            <button onClick={() => handleTaskButtonClick(task.TaskID, task.Link)} style={{ fontSize: "14px", marginTop: "-20px" }} className="claimbtn">
                                                {task.ButtonStatus}
                                            </button>
                                        )}
                                    </a>
                                    <span style={{ color: "#e1e1e1", marginLeft: "70px", fontSize: "12px" }}>
                                        +{task.Value} BP
                                    </span>
                                </li>
                            )) : <p className="text-center">New Task Loading...</p>
                        }

                        {taskDone.length > 0 ? (
                            taskDone.map((data) => {
                                const buttonState = taskButtonMap[data.TaskID] || data.ButtonStatus;

                                const renderButton = () => {
                                    if (buttonState === "load") {
                                        return (
                                            <button className="claimbtn pb-2 pt-1" disabled>
                                                <div className="spinner-border spinner-border-sm" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </button>
                                        );
                                    } else if (buttonState === "completed") {
                                        return (
                                            <button className="claimbtn">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    style={{ margin: "4px" }}
                                                    height="16px"
                                                    viewBox="0 -960 960 960"
                                                    width="16px"
                                                    fill="#07080a"
                                                >
                                                    <path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm34-102 102-44 104 44 56-96 110-26-10-112 74-84-74-86 10-112-110-24-58-96-102 44-104-44-56 96-110 24 10 112-74 86 74 84-10 114 110 24 58 96Zm102-318Zm-42 142 226-226-56-58-170 170-86-84-56 56 142 142Z" />
                                                </svg>
                                            </button>
                                        );
                                    } else if (buttonState === "Claim") {
                                        return (
                                            <button
                                                onClick={() => claimFunction(data.TaskID, data.Value)}
                                                className="claimbtn"
                                                style={{ fontSize: "13px" }}
                                            >
                                                {buttonState}
                                            </button>
                                        );
                                    } else {
                                        return (
                                            <button onClick={() => claimFunction(data.TaskID, data.Value)} className="claimbtn">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    style={{ margin: "4px" }}
                                                    height="16px"
                                                    viewBox="0 -960 960 960"
                                                    width="16px"
                                                    fill="#07080a"
                                                >
                                                    <path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58-136 58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm34-102 102-44 104 44 56-96 110-26-10-112 74-84-74-86 10-112-110-24-58-96-102 44-104-44-56 96-110 24 10 112-74 86 74 84-10 114 110 24 58 96Zm102-318Zm-42 142 226-226-56-58-170 170-86-84-56 56 142 142Z" />
                                                </svg>
                                            </button>
                                        );
                                    }
                                };

                                return (
                                    <li key={data._id} style={{ background: "#0f1216" }} className="p-1 rounded">
                                        <span style={{ background: "#07080a" }} className="single-profile-wrap">
                                            <img
                                                className="animateTask"
                                                src={data.Icon}
                                                width={40}
                                                alt=""
                                            />
                                            {data.Message}
                                            {renderButton()}
                                        </span>
                                        <span
                                            style={{
                                                color: "#e1e1e1",
                                                marginLeft: "70px",
                                                fontSize: "12px",
                                                display: "flex",
                                                marginTop: "-23px",
                                            }}
                                        >
                                            +{data.Value} BP
                                        </span>
                                    </li>
                                );
                            })
                        ) : (
                            <p className="text-center">No Task Completed</p>
                        )}

                    </ul>
                </div>
                <div className="main-footer-bottom d-block text-center">
                    <ul>
                        <li>
                            <NavLink to="/">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M180-120q-25 0-42.5-17.5T120-180v-76l160-142v278H180Zm140 0v-160h320v160H320Zm360 0v-328L509-600l121-107 190 169q10 9 15 20.5t5 24.5v313q0 25-17.5 42.5T780-120H680ZM120-310v-183q0-13 5-25t15-20l300-266q8-8 18.5-11.5T480-819q11 0 21.5 3.5T520-804l80 71-480 423Z" /></svg><br />
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="sports.html">
                                <svg xmlns="#" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m140-220-60-60 300-300 160 160 284-320 56 56-340 384-160-160-240 240Z" /></svg><br />
                                Ranking
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className="menu-bar" to="#">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m422-232 207-248H469l29-227-185 267h139l-30 208ZM320-80l40-280H160l360-520h80l-40 320h240L400-80h-80Zm151-390Z" /></svg><br />
                                Task
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/ref">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" /></svg><br />
                                Frens
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/airdrio">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-80 120-280v-400l360-200 360 200v400L480-80ZM364-590q23-24 53-37t63-13q33 0 63 13t53 37l120-67-236-131-236 131 120 67Zm76 396v-131q-54-14-87-57t-33-98q0-11 1-20.5t4-19.5l-125-70v263l240 133Zm40-206q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400Zm40 206 240-133v-263l-125 70q3 10 4 19.5t1 20.5q0 55-33 98t-87 57v131Z" /></svg><br />
                                Airdrop
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Task
