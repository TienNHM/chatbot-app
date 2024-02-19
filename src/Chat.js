import React, { useState } from 'react';
import { OpenAIAPIKey } from './config'; // Create a file named 'config.js' with your OpenAI API key

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
        console.log(OpenAIAPIKey)
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
        console.log(data);
        return data.choices[0].message.content.trim();
    };

    return (
        <div>
            <div className="message-container">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.user}`}>
                        {message.text}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
            />
        </div>
    );
};

export default Chat;