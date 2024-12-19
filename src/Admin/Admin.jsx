import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useState, useEffect } from 'react';
import toast, { Toaster } from "react-hot-toast"

const Admin = () => {

    const [data, setData] = useState({ link: '', social: '', cpx: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(value)
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        console.log(data)
    };

    const validateForm = () => {
        const { link, social, cpx, message } = data;
        if (!link) return "Link is required.";
        if (!social) return "Social media selection is required.";
        if (!cpx) return "CPX is required.";
        if (!message) return "Message is required.";
        return true;
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const validationResult = validateForm();
        if (validationResult !== true) {
            console.error(validationResult); // Logs the specific error
        } else {
            const { link, social, cpx, message } = data;
            axios.post("/newtask", { link, social, cpx, message }).then(({ data }) => {
                if (data) {
                    toast.success("Task Data Posted!", {
                        style: {
                            backgroundColor: 'black',
                            color: 'white',
                        },
                    });
                    console.log("Task Data Submitted: ", data);
                }
            }).finally(() => {
                setData({ link: "", social: "", cpx: "", message: "" });
            })
        }
    };
    return (
        <>
            <div className="container p-2">
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                    containerStyle={{ fontSize: "12px", }}
                    toastOptions={{ duration: 4000 }}
                />
                <Form
                    className="mt-2 p-2"
                    style={{ background: "#0f1216" }}
                    onSubmit={handleSubmit}
                >
                    <div className="page-title">Create Task</div>
                    <hr />

                    {/* Link Input */}
                    <Form.Group className="mb-3" controlId="formGridAddress2">
                        <Form.Label>Link</Form.Label>
                        <Form.Control
                            name="link"
                            onChange={handleChange}
                            value={data.link}
                            className="bg-dark text-white"
                            placeholder="Paste your link here"
                        />
                    </Form.Group>

                         {/* Social Media Dropdown */}
                         <Form.Group controlId="formGridState">
                            <Form.Label>Post Message</Form.Label>
                            <Form.Select
                                name="message"
                                className="bg-dark text-light"
                                value={data.message}
                                onChange={handleChange}
                            >
                                <option value="">Choose...</option>
                                <option value="React to Post on TG">React to Post Telegram</option>
                                <option value="+Follow Bitclub TG">+Follow Bitclub Telegram</option>
                                <option value="Subscribe to Bitclub">Subscribe to Bitclub</option>
                                <option value="+Follow Bitclub">+Follow Bitclub Facebook</option>
                                <option value="+Follow Bitclub">+Follow Bitclub Instagram</option>
                                <option value="+Follow Bitclub">+Follow Bitclub Twitter</option>
                            </Form.Select>
                        </Form.Group>

                    <Row className="mb-3">
                        {/* Social Media Dropdown */}
                        <Form.Group as={Col} controlId="formGridState">
                            <Form.Label>Social Media</Form.Label>
                            <Form.Select
                                name="social"
                                className="bg-dark text-light"
                                value={data.social}
                                onChange={handleChange}
                            >
                                <option value="">Choose...</option>
                                <option value="Telegram">Telegram</option>
                                <option value="YouTube">YouTube</option>
                                <option value="Facebook">Facebook</option>
                                <option value="Instagram">Instagram</option>
                                <option value="Twitter">Twitter</option>
                            </Form.Select>
                        </Form.Group>

                        {/* CPX Input */}
                        <Form.Group as={Col} controlId="formGridZip">
                            <Form.Label>CPX</Form.Label>
                            <Form.Control
                                name="cpx"
                                value={data.cpx}
                                placeholder="e.g., +500"
                                className="bg-dark text-white"
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Row>

                    <button className="btn btn-primary" style={{ borderRadius: "2px" }}>
                        Post Task
                    </button>
                </Form>
            </div>
        </>
    );
}

export default Admin
