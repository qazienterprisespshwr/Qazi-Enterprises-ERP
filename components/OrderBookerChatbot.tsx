// Fix: Create OrderBookerChatbot component.
import React, { useState } from 'react';
import { generateOrderSuggestion } from '../services/geminiService';
import { SendIcon } from './icons/SendIcon';

interface ChatMessage {
    type: 'user' | 'bot' | 'system';
    text: string;
}

const OrderBookerChatbot: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { type: 'bot', text: 'Hello! How can I help you create an order today?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: ChatMessage = { type: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const result = await generateOrderSuggestion(inputValue);

            if (result.error) {
                 setMessages(prev => [...prev, { type: 'bot', text: result.error }]);
            } else {
                const orderSummary = `Okay, I've drafted an order for **${result.customerName}** with the following items:\n${result.items.map((item: any) => `- ${item.quantity} x ${item.productName}`).join('\n')}\n\nShall I proceed with creating this order?`;
                setMessages(prev => [...prev, { type: 'bot', text: orderSummary }]);
                setMessages(prev => [...prev, {type: 'system', text: 'Order creation from chat is a demo. No order was actually created.'}])
            }

        } catch (error) {
            setMessages(prev => [...prev, { type: 'bot', text: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md flex flex-col h-[500px]">
            <div className="bg-gray-100 p-4 rounded-t-lg border-b">
                <h2 className="text-xl font-bold text-gray-800">AI Order Assistant</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.type === 'system' ? (
                            <div className="text-center w-full my-2">
                                <p className="text-xs text-gray-500 italic bg-gray-100 rounded-full px-3 py-1 inline-block">{msg.text}</p>
                            </div>
                        ) : (
                             <div className={`rounded-lg px-4 py-2 max-w-sm ${msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                {msg.text.split('\n').map((line, i) => (
                                    <p key={i} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start">
                        <div className="rounded-lg px-4 py-2 bg-gray-200 text-gray-800">
                           <span className="animate-pulse">...</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4 border-t">
                <div className="flex items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="e.g., 'Create order for Corner Mart: 50 Cokes'"
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading}
                        className="ml-3 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                    >
                       <SendIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderBookerChatbot;
