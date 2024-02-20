import React, { useState } from 'react';
import { OpenAIAPIKey } from './config'; // Create a file named 'config.js' with your OpenAI API key
import { InputText } from 'primereact/inputtext';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const sendMessage = async () => {
        setMessages([...messages, { text: input, user: 'user' }]);
        const response = await fetchMessage(input);
        setMessages([...messages, { text: response, user: 'bot' }]);
        setInput('');
    };

    const fetchMessage = async (input) => {
        // console.log('OpenAIAPIKey', OpenAIAPIKey);
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OpenAIAPIKey}`
            },
            body: JSON.stringify({
                // prompt: `You: ${input}\nAI:`,
                max_tokens: 150,
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant."
                    },
                    {
                        role: "user",
                        content: input
                    }
                ]
            })
        });
        const data = await response.json();
        console.log('data', data);

        return data.choices[0].message.content.trim();
    };

    return (
        <div className='d-flex justify-content-center flex-column my-3'>
            <div className="message-container">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.user}`}>
                        {message.text}
                    </div>
                ))}
            </div>

            <InputText value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message here..." />
        </div>
    );
};

export default Chat;