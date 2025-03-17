import { useState } from "react";
import { getAIResponse } from "../../services/chatbot-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
const ChatbotPage = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await getAIResponse(input);
      setMessages((prev) => [...prev, { role: "ai", content: response }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  return (
     <div className="container mt-4">
                    <button
                      className="btn btn-outline-primary mb-3"
                      onClick={() => navigate(-1)}>
                      <FontAwesomeIcon
                        icon={faArrowLeft}
                        className="me-2"
                      />{" "}
                      Back
                    </button>
    <div className="container d-flex flex-column vh-100 bg-light">
    <div className="flex-grow-1 overflow-auto bg-white p-2 rounded border" style={{ maxHeight: "70vh", minHeight: "40vh" }}>
    {messages.map((msg, index) => (
          <div
            key={index}
            className={`d-flex mb-2 ${
              msg.role === "user" ? "justify-content-end" : "justify-content-start"
            }`}
          >
            <div
              className={`p-2 rounded ${
                msg.role === "user" ? "bg-primary text-white" : "bg-secondary text-light"
              }`}
              style={{ maxWidth: "75%" }}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="input-group p-3 bg-white border-top">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="form-control"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="btn btn-primary"
        >
          Send
        </button>
      </div>
    </div>
    </div>
  );
};

export default ChatbotPage;