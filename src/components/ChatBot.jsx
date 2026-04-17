// import React, { useState, useRef, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { MessageCircle, X, Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// // Initialize Gemini API
// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const ChatBot = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [messages, setMessages] = useState([
//         {
//             id: 1,
//             text: "Hi there! I'm your IP Assistant. How can I help you today?",
//             sender: 'bot',
//             timestamp: new Date()
//         }
//     ]);
//     const [inputValue, setInputValue] = useState('');
//     const [isTyping, setIsTyping] = useState(false);
//     const messagesEndRef = useRef(null);

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);

//     const handleSend = async () => {
//         if (!inputValue.trim()) return;

//         const userMessage = {
//             id: messages.length + 1,
//             text: inputValue,
//             sender: 'user',
//             timestamp: new Date()
//         };

//         setMessages(prev => [...prev, userMessage]);
//         setInputValue('');
//         setIsTyping(true);

//         try {
//             let responseText;

//             // Try Real AI first
//             if (import.meta.env.VITE_GEMINI_API_KEY) {
//                 responseText = await fetchAIResponse(inputValue);
//             } else {
//                 // Fallback to heuristic
//                 responseText = generateResponse(inputValue);
//             }

//             setMessages(prev => [...prev, {
//                 id: prev.length + 1,
//                 text: responseText,
//                 sender: 'bot',
//                 timestamp: new Date()
//             }]);
//         } catch (error) {
//             console.error("AI Response Error:", error);

//             const errorMessage = error instanceof Error ? error.message : "Unknown error";
//             const isApiKeyError = errorMessage.toLowerCase().includes("api key") || errorMessage.toLowerCase().includes("expired");

//             // If it's an API key error or network error, try falling back to heuristic
//             const botFallback = generateResponse(inputValue);

//             let descriptiveError = `(Note: I encountered an error with the AI: "${errorMessage}". Falling back to my built-in knowledge!)`;

//             if (isApiKeyError) {
//                 descriptiveError = `(Notice: My live AI connection is unavailable due to an invalid/expired API key. I'm operating in "Built-in Knowledge" mode. Please renew the API key in .env to restore full capabilities.)`;
//             }

//             setMessages(prev => [...prev, {
//                 id: prev.length + 1,
//                 text: `${botFallback}\n\n ${descriptiveError}`,
//                 sender: 'bot',
//                 timestamp: new Date(),
//                 isHeuristic: true
//             }]);
//         } finally {
//             setIsTyping(false);
//         }
//     };

//     const fetchAIResponse = async (userPrompt) => {
//         try {
//             const systemPrompt = "You are an AI assistant for 'IP Quest', a gamified learning platform for Intellectual Property Rights (IPR). We have modules for Patents (featuring 'Save the Inventor' game), Trademarks, and Copyrights. Keep your responses concise, helpful, and encouraging. Focus on topics like Patents, Trademarks, Copyrights, and helping users navigate the game. Avoid technical jargon when possible.";

//             const result = await model.generateContent([systemPrompt, userPrompt]);
//             const response = await result.response;
//             return response.text();
//         } catch (error) {
//             console.error("Gemini API Error:", error);
//             // If model not found, try a fallback model name
//             if (error.message.includes("404") || error.message.includes("not found")) {
//                 console.log("Attempting fallback to gemini-pro...");
//                 try {
//                     const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
//                     const result = await fallbackModel.generateContent([userPrompt]);
//                     const response = await result.response;
//                     return response.text();
//                 } catch (fallbackError) {
//                     console.error("Fallback to gemini-pro also failed:", fallbackError);
//                     throw fallbackError;
//                 }
//             }
//             throw error;
//         }
//     };

//     const generateResponse = (input) => {
//         const query = input.toLowerCase();

//         if (query.includes('hello') || query.includes('hi')) {
//             return "Greetings! I'm here to guide you through the exciting world of Intellectual Property. Ask me anything about Patents, Trademarks, or Copyrights!";
//         }

//         if (query.includes('patent')) {
//             return "A patent is an exclusive right granted for an invention. It provides the owner with the right to decide how - or if - the invention can be used by others. In IP Quest, you can learn more about Patents in the 'Invention Island' module!";
//         }

//         if (query.includes('trademark') || query.includes('logo')) {
//             return "Trademarks are signs capable of distinguishing the goods or services of one enterprise from those of other enterprises. Think of famous logos like the Apple logo or Nike swoosh!";
//         }

//         if (query.includes('copyright')) {
//             return "Copyright is a legal term used to describe the rights that creators have over their literary and artistic works. Works covered by copyright range from books, music, and paintings to software and databases.";
//         }

//         if (query.includes('ip quest') || query.includes('how to play')) {
//             return "IP Quest is a gamified platform where you learn through play! Start with the 'Modules' page to unlock games, earn XP, and climb the leaderboard. Each game teaches a specific IP concept.";
//         }

//         if (query.includes('save the inventor') || query.includes('hangman') || query.includes('fire')) {
//             return "To play 'Save the Inventor' (Reverse Hangman), you need to answer intellectual property questions correctly. Each correct answer puts out fires and lowers the inventor to safety. You have 30 seconds to complete the rescue mission!";
//         }

//         if (query.includes('help')) {
//             return "I can help you understand IP concepts or navigate the game. Try asking 'What is a patent?', 'How do I earn XP?', or about specific games like 'Save the Inventor'.";
//         }

//         return "That's an interesting question! While I'm still learning, I can tell you that Intellectual Property protection is crucial for innovation. Would you like to know more about Patents, Trademarks, or Copyrights?";
//     };

//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter') {
//             handleSend();
//         }
//     };

//     return (
//         <div className="fixed bottom-6 right-6 z-50">
//             {/* Chat Window */}
//             <AnimatePresence>
//                 {isOpen && (
//                     <motion.div
//                         initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
//                         animate={{ opacity: 1, scale: 1, y: 0 }}
//                         exit={{ opacity: 0, scale: 0.8, y: 20 }}
//                         className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-quest-card border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
//                     >
//                         {/* Header */}
//                         <div className="p-4 border-b border-white/5 bg-gradient-to-r from-quest-primary/20 to-quest-accent/20 flex justify-between items-center">
//                             <div className="flex items-center gap-3">
//                                 <div className="w-10 h-10 rounded-full bg-quest-primary flex items-center justify-center shadow-lg shadow-quest-primary/20">
//                                     <Bot size={22} className="text-white" />
//                                 </div>
//                                 <div>
//                                     <h3 className="font-heading font-bold text-white leading-tight">IP Assistant</h3>
//                                     <div className="flex items-center gap-1.5">
//                                         <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
//                                         <span className="text-[10px] text-quest-muted uppercase tracking-wider font-bold">Online</span>
//                                     </div>
//                                 </div>
//                             </div>
//                             <button
//                                 onClick={() => setIsOpen(false)}
//                                 className="p-2 hover:bg-white/5 rounded-full transition-colors text-quest-muted hover:text-white"
//                             >
//                                 <X size={20} />
//                             </button>
//                         </div>

//                         {/* Messages Area */}
//                         <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
//                             {messages.map((msg) => (
//                                 <motion.div
//                                     key={msg.id}
//                                     initial={{ opacity: 0, x: msg.sender === 'bot' ? -10 : 10 }}
//                                     animate={{ opacity: 1, x: 0 }}
//                                     className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//                                 >
//                                     <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
//                                         <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.sender === 'bot' ? 'bg-quest-primary/20' : 'bg-quest-accent/20'
//                                             }`}>
//                                             {msg.sender === 'bot' ? <Bot size={16} className="text-quest-primary" /> : <User size={16} className="text-quest-accent" />}
//                                         </div>
//                                         <div>
//                                             <div className={`p-3 rounded-2xl text-sm relative ${msg.sender === 'bot'
//                                                 ? (msg.isHeuristic ? 'bg-amber-500/10 text-quest-text border border-amber-500/20' : 'bg-white/5 text-quest-text rounded-tl-none')
//                                                 : 'bg-quest-primary text-white rounded-tr-none shadow-md'
//                                                 }`}>
//                                                 {msg.isHeuristic && (
//                                                     <div className="flex items-center gap-1 text-[9px] font-bold text-amber-500 uppercase tracking-tighter mb-1.5 opacity-80">
//                                                         <Sparkles size={10} />
//                                                         <span>Built-in Knowledge</span>
//                                                     </div>
//                                                 )}
//                                                 {msg.text}
//                                             </div>
//                                             <span className="text-[10px] text-quest-muted mt-1 block">
//                                                 {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </motion.div>
//                             ))}
//                             {isTyping && (
//                                 <div className="flex justify-start">
//                                     <div className="flex gap-2 items-center bg-white/5 p-3 rounded-2xl rounded-tl-none">
//                                         <div className="flex gap-1">
//                                             <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-quest-primary rounded-full"></motion.span>
//                                             <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-quest-primary rounded-full"></motion.span>
//                                             <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-quest-primary rounded-full"></motion.span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                             <div ref={messagesEndRef} />
//                         </div>

//                         {/* Input Area */}
//                         <div className="p-4 border-t border-white/5 bg-white/5">
//                             <div className="relative flex items-center">
//                                 <input
//                                     type="text"
//                                     value={inputValue}
//                                     onChange={(e) => setInputValue(e.target.value)}
//                                     onKeyPress={handleKeyPress}
//                                     placeholder="Type your question..."
//                                     className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-quest-primary/50 transition-colors text-dark placeholder:text-quest-muted"
//                                 />
//                                 <button
//                                     onClick={handleSend}
//                                     disabled={!inputValue.trim()}
//                                     className="absolute right-2 p-2 bg-quest-primary text-white rounded-lg hover:bg-quest-primary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-quest-primary/20"
//                                 >
//                                     {/* <Send size={18} /> */}
//                                 </button>
//                             </div>
//                         </div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             {/* FAB Button */}
//             <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setIsOpen(!isOpen)}
//                 className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isOpen
//                     ? 'bg-quest-accent text-white rotate-90'
//                     : 'bg-quest-primary text-white ring-4 ring-quest-primary/20'
//                     }`}
//             >
//                 {isOpen ? <X size={24} /> : (
//                     <div className="relative">
//                         <MessageCircle size={28} />
//                         {!isOpen && (
//                             <motion.div
//                                 animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
//                                 transition={{ repeat: Infinity, duration: 2 }}
//                                 className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-quest-primary"
//                             />
//                         )}
//                     </div>
//                 )}
//             </motion.button>
//         </div>
//     );
// };

// export default ChatBot;

// import React, { useState, useRef, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// // ✅ Initialize Gemini API (correct model)
// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// const ChatBot = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [messages, setMessages] = useState([
//         {
//             id: 1,
//             text: "Hi there! I'm your IP Assistant. How can I help you today?",
//             sender: 'bot',
//             timestamp: new Date()
//         }
//     ]);
//     const [inputValue, setInputValue] = useState('');
//     const [isTyping, setIsTyping] = useState(false);
//     const messagesEndRef = useRef(null);

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);

//     const handleSend = async () => {
//         if (!inputValue.trim()) return;

//         const userMessage = {
//             id: messages.length + 1,
//             text: inputValue,
//             sender: 'user',
//             timestamp: new Date()
//         };

//         setMessages(prev => [...prev, userMessage]);
//         setInputValue('');
//         setIsTyping(true);

//         try {
//             let responseText;

//             if (import.meta.env.VITE_GEMINI_API_KEY?.length > 10) {
//                 responseText = await fetchAIResponse(inputValue);
//             } else {
//                 responseText = generateResponse(inputValue);
//             }

//             setMessages(prev => [...prev, {
//                 id: prev.length + 1,
//                 text: responseText,
//                 sender: 'bot',
//                 timestamp: new Date()
//             }]);

//         } catch (error) {
//             console.error("AI Error:", error);

//             const fallback = generateResponse(inputValue);

//             setMessages(prev => [...prev, {
//                 id: prev.length + 1,
//                 text: fallback + "\n\n(Note: AI unavailable, using built-in knowledge)",
//                 sender: 'bot',
//                 timestamp: new Date(),
//                 isHeuristic: true
//             }]);
//         } finally {
//             setIsTyping(false);
//         }
//     };

//     // ✅ Fixed Gemini API call
//     const fetchAIResponse = async (userPrompt) => {
//         const systemPrompt = "You are an AI assistant for 'IP Quest'. Help users with Patents, Trademarks, Copyrights and game navigation. Keep answers short and simple.";

//         const result = await model.generateContent({
//             contents: [
//                 {
//                     role: "user",
//                     parts: [{ text: systemPrompt + "\n" + userPrompt }]
//                 }
//             ]
//         });

//         const response = await result.response;
//         return response.text();
//     };

//     const generateResponse = (input) => {
//         const query = input.toLowerCase();

//         if (query.includes('hello') || query.includes('hi')) {
//             return "Hello! Ask me about patents, trademarks, or copyrights!";
//         }

//         if (query.includes('patent')) {
//             return "A patent gives exclusive rights to an invention.";
//         }

//         if (query.includes('trademark')) {
//             return "A trademark identifies a brand like logos or names.";
//         }

//         if (query.includes('copyright')) {
//             return "Copyright protects creative works like music, books, and software.";
//         }

//         return "I can help with Intellectual Property topics. Try asking about patents or trademarks!";
//     };

//     return (
//         <div className="fixed bottom-6 right-6 z-50">

//             <AnimatePresence>
//                 {isOpen && (
//                     <motion.div
//                         initial={{ opacity: 0, scale: 0.8 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         exit={{ opacity: 0, scale: 0.8 }}
//                         className="mb-4 w-[350px] h-[500px] bg-black rounded-2xl flex flex-col"
//                     >
//                         {/* Header */}
//                         <div className="p-4 flex justify-between items-center border-b border-white/10">
//                             <div className="flex gap-2 items-center">
//                                 <Bot />
//                                 <span className="text-white">IP Assistant</span>
//                             </div>
//                             <button onClick={() => setIsOpen(false)}>
//                                 <X />
//                             </button>
//                         </div>

//                         {/* Messages */}
//                         <div className="flex-grow overflow-y-auto p-4">
//                             {messages.map((msg) => (
//                                 <div key={msg.id} className={`mb-3 ${msg.sender === 'user' ? 'text-right' : ''}`}>
//                                     <div className="text-white text-sm">
//                                         {msg.text}
//                                     </div>
//                                 </div>
//                             ))}
//                             {isTyping && <div className="text-gray-400 text-sm">Typing...</div>}
//                             <div ref={messagesEndRef} />
//                         </div>

//                         {/* Input */}
//                         <div className="p-4 border-t border-white/10 flex">
//                             <input
//                                 value={inputValue}
//                                 onChange={(e) => setInputValue(e.target.value)}
//                                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//                                 className="flex-1 bg-gray-800 text-white p-2 rounded"
//                                 placeholder="Type..."
//                             />
//                             <button onClick={handleSend} className="ml-2 bg-blue-500 p-2 rounded">
//                                 <Send size={18} />
//                             </button>
//                         </div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             {/* Floating Button */}
//             <button
//                 onClick={() => setIsOpen(!isOpen)}
//                 className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center"
//             >
//                 {isOpen ? <X /> : <MessageCircle />}
//             </button>
//         </div>
//     );
// };

// export default ChatBot;
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi there! I'm your IP Assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // ✅ OpenRouter API call
    const fetchAIResponse = async (userPrompt) => {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openrouter/free",
                messages: [
                    {
                        role: "system",
                        content: "You are an AI assistant for 'IP Quest'. Help users with Patents, Trademarks, and Copyrights. Keep answers simple."
                    },
                    {
                        role: "user",
                        content: userPrompt
                    }
                ]
            })
        });

        const data = await res.json();

        if (!data.choices) {
            console.error("API Error:", data);
            throw new Error(data.error?.message || "API failed");
        }

        return data.choices[0].message.content;
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            let responseText;

            if (import.meta.env.VITE_OPENROUTER_API_KEY?.length > 10) {
                responseText = await fetchAIResponse(inputValue);
            } else {
                responseText = generateResponse(inputValue);
            }

            setMessages(prev => [...prev, {
                id: prev.length + 1,
                text: responseText,
                sender: 'bot',
                timestamp: new Date()
            }]);

        } catch (error) {
            console.error("Error:", error);

            const fallback = generateResponse(inputValue);

            setMessages(prev => [...prev, {
                id: prev.length + 1,
                text: fallback + "\n\n(Note: AI unavailable, using built-in knowledge)",
                sender: 'bot',
                timestamp: new Date(),
                isHeuristic: true
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    // ✅ Fallback logic
    const generateResponse = (input) => {
        const query = input.toLowerCase();

        if (query.includes('hello') || query.includes('hi')) {
            return "Hello! Ask me about patents, trademarks, or copyrights!";
        }

        if (query.includes('patent')) {
            return "A patent gives exclusive rights to an invention.";
        }

        if (query.includes('trademark')) {
            return "A trademark identifies a brand like logos or names.";
        }

        if (query.includes('copyright')) {
            return "Copyright protects creative works like music, books, and software.";
        }

        return "I can help with Intellectual Property topics. Try asking about patents or trademarks!";
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-quest-card border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-md"
                    >
                        {/* Header */}
                        <div className="p-4 flex justify-between items-center border-b border-white/10">
                            <div className="flex items-center gap-2 text-white">
                                <Bot size={20} />
                                <span>IP Assistant</span>
                            </div>
                            <button onClick={() => setIsOpen(false)}>
                                <X className="text-white" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-grow overflow-y-auto p-4 space-y-3">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className="max-w-[80%]">
                                        <div
                                            className={`p-3 rounded-xl text-sm ${
                                                msg.sender === 'user'
                                                    ? 'bg-quest-primary text-white'
                                                    : 'bg-white/5 text-white'
                                            }`}
                                        >
                                            {msg.isHeuristic && (
                                                <div className="text-xs text-yellow-400 mb-1 flex items-center gap-1">
                                                    <Sparkles size={12} />
                                                    Built-in Knowledge
                                                </div>
                                            )}
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="text-gray-400 text-sm">Typing...</div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/10 flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSend();
                                }}
                                placeholder="Type your question..."
                                className="flex-1 bg-white/5 border border-white/10 text-white p-2 rounded-lg outline-none focus:border-quest-primary/50 transition-colors"
                            />
                            <button
                                onClick={handleSend}
                                className="bg-quest-primary p-2 rounded-lg hover:bg-quest-primary/90 transition-colors"
                            >
                                <Send size={18} className="text-white" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-quest-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:scale-105 transition-all"
            >
                {isOpen ? <X className="text-white" /> : <MessageCircle className="text-white" />}
            </motion.button>
        </div>
    );
};

export default ChatBot;