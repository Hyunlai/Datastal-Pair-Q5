import { Link } from "react-router-dom";

const ConversationItem = ({ conversation }) => {
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">

        <h5 className="card-title">
          {conversation.title}
        </h5>

        <p className="text-muted mb-2">
          Created: {conversation.created_at}
        </p>

        <Link
          className="btn btn-outline-primary btn-sm"
          to={`/conversation/${conversation._id}`}
        >
          View Conversation
        </Link>

      </div>
    </div>
  );
};

export default ConversationItem;