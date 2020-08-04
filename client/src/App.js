import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import io from "socket.io-client";

const Page = styled.div`
    height: 100vh;
`;

const Container = styled.div`
    background: white;
    height: 80%;
    min-height: 300px;
    max-width: 80%;
    border: solid 2px #e2a8f7;
    border-radius: 10px;
    margin: auto;
    margin-top: 20px;
    box-shadow: 0 0 10px #e2a8f7;
`;

const TextArea = styled.textarea`
    max-height: 100px;
    width: 99%;
    margin-top: 10px;
    border: solid 2px #3175c9;
    background: rgba(241, 247, 255);
    border-radius: 10px;
    padding: 10px 0 0 10px;
    box-shadow: 0 0 5px #888;
  ::placeholder {
    color: gray;
  }
`;

const Button = styled.button`
    display: block;
    width: 100%;
    border-radius: 10px;
    padding: 10px;
    border: none;
    background: #3175c9;
    color: white;
    margin-top: 5px;
    box-shadow: 0 0 5px #888;
`;

const Form = styled.form`
    width: 80%;
    margin: auto;
`;

const MyRow = styled.div`
    text-align: right;
`;

const MyMessage = styled.div`
    margin: 15px;
    padding: 10px;
    border-radius: 20px 20px 0px 20px;
    background: #3175c9;
    color: white;
    display: inline-block;
`;

const PartnerRow = styled(MyRow)`
    text-align: left;
`;

const PartnerMessage = styled.div`
    margin: 15px;
    padding: 10px;
    border-radius: 20px 20px 20px 0px;
    background: #d05273 ;
    color: white;
    display: inline-block;
`;
const App = () => {
    const [yourID, setYourID] = useState();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io.connect('/');

        socketRef.current.on("your id", id => {
            setYourID(id);
        })

        socketRef.current.on("message", (message) => {
            console.log("here");
            receivedMessage(message);
        })
    }, []);

    function receivedMessage(message) {
        setMessages(oldMsgs => [...oldMsgs, message]);
    }

    function sendMessage(e) {
        e.preventDefault();
        const messageObject = {
            body: message,
            id: yourID,
        };
        setMessage("");
        socketRef.current.emit("send message", messageObject);
    }

    function handleChange(e) {
        setMessage(e.target.value);
    }

    return (
        <Page>
            <Container>
                {messages.map((message, index) => {
                    if (message.id === yourID) {
                        return (
                            <MyRow key={index}>
                                <MyMessage>
                                    {message.body}
                                </MyMessage>
                            </MyRow>
                        )
                    }
                    return (
                        <PartnerRow key={index}>
                            <PartnerMessage>
                                {message.body}
                            </PartnerMessage>
                        </PartnerRow>
                    )
                })}
            </Container>
            <Form onSubmit={sendMessage}>
                <TextArea value={message} onChange={handleChange} placeholder="Say something" />
                <Button>Send</Button>
            </Form>
        </Page>
    );
};

export default App;
