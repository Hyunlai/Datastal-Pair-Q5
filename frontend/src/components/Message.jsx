const Message = ({ type = "danger", children }) => {
  return (
    <div className={`alert alert-${type}`}>
      {children}
    </div>
  );
};

export default Message;