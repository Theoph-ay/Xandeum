import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, X } from 'lucide-react';
import { aiService } from '../services/api';
import './ChatWidget.css';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello! I am your Xandeum Data Agent. Ask me anything about the network nodes, anomalies, or rewards.' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await aiService.chat(userMsg);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't reach the AI brain." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            <button
                className={`chat-toggle ${isOpen ? 'hidden' : ''}`}
                onClick={() => setIsOpen(true)}
            >
                <MessageSquare className="w-6 h-6 text-white" />
                <span className="sc-text">Ask AI Agent</span>
            </button>

            {isOpen && (
                <div className="chat-window open">
                    <div className="chat-header">
                        <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5 text-cyan-400" />
                            <h3>Xandeum AI Agent</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="close-btn">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.role}`}>
                                <div className="message-content">{msg.content}</div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message assistant">
                                <div className="typing-indicator">
                                    <span>.</span><span>.</span><span>.</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="chat-input-area">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about highest uptime..."
                            className="chat-input"
                        />
                        <button type="submit" disabled={isTyping || !input.trim()} className="send-btn">
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
