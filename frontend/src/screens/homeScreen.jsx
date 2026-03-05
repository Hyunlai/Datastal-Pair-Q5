import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ConversationItem from "../components/ConversationItem";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

import { getConversations, sendMessage } from "../redux/conversationSlice";

const HomeScreen = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newPrompt, setNewPrompt] = useState("");

  const { conversations, loading, error } =
    useSelector((state) => state.conversations);

  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  const createConversationHandler = async (e) => {
    e.preventDefault();

    if (!newPrompt.trim()) {
      return;
    }

    const result = await dispatch(sendMessage({ content: newPrompt }));
    if (result.meta.requestStatus === "fulfilled") {
      setNewPrompt("");
      dispatch(getConversations());
      navigate(`/conversation/${result.payload.conversationId}`);
    }
  };

  return (
    <div className="container mt-4">

      <h2 className="mb-4">
        My Conversations
      </h2>

      <form className="card card-body mb-4" onSubmit={createConversationHandler}>
        <label className="form-label fw-semibold" htmlFor="newPrompt">
          Start New Mythology Conversation
        </label>
        <div className="d-flex gap-2">
          <input
            id="newPrompt"
            type="text"
            className="form-control"
            placeholder="Ask about a myth, god, hero, or legend..."
            value={newPrompt}
            onChange={(e) => setNewPrompt(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Start Chat
          </button>
        </div>
      </form>

      {loading && <Loader />}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {!loading && conversations.length === 0 && (
        <EmptyState />
      )}

      {conversations.map((conv) => (
        <ConversationItem
          key={conv._id}
          conversation={conv}
        />
      ))}

    </div>
  );
};

export default HomeScreen;