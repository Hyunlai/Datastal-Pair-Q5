import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../components/Loader";
import Message from "../components/Message";

import { getConversationDetail, sendMessage } from "../redux/conversationSlice";

const ConversationDetailScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { messages, loading, error } = useSelector(
    (state) => state.conversations
  );

  const [input, setInput] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    dispatch(getConversationDetail(id));
  }, [dispatch, id]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    dispatch(sendMessage({ conversationId: id, content: input }));
    setInput("");
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "700px" }}>
      <h3 className="mb-3">Conversation {id}</h3>

      {error && <Message>{error}</Message>}
      {loading && <Loader />}

      <div
        className="border rounded p-3 mb-3"
        style={{
          height: "500px",
          overflowY: "auto",
          backgroundColor: "#f8f9fa",
        }}
        ref={scrollRef}
      >
        {messages.length === 0 && !loading && (
          <p className="text-center text-muted mt-5">
            Start the conversation!
          </p>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`d-flex mb-3 ${
              msg.role === "user" ? "justify-content-end" : "justify-content-start"
            }`}
          >
            <div
              className={`p-2 rounded ${
                msg.role === "user" ? "bg-primary text-white" : "bg-light text-dark"
              }`}
              style={{ maxWidth: "70%" }}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={submitHandler} className="d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn btn-primary">Send</button>
      </form>
    </div>
  );
};

export default ConversationDetailScreen;