import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ConversationItem from "../components/ConversationItem";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

import { getConversations } from "../redux/conversationSlice";

const HomeScreen = () => {

  const dispatch = useDispatch();

  const { conversations, loading, error } =
    useSelector((state) => state.conversations);

  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  return (
    <div className="container mt-4">

      <h2 className="mb-4">
        My Conversations
      </h2>

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