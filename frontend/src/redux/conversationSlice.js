import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  conversations: [],  // List of all conversations
  messages: [],       // Messages of selected conversation
  loading: false,
  error: null,
};

// Dummy fetch all conversations
export const getConversations = createAsyncThunk(
  "conversations/getAll",
  async () => {
    // Replace with backend API call later
    return [
      {
        _id: "1",
        title: "Zeus and the Olympian Gods",
        created_at: "2026-03-05",
      },
      {
        _id: "2",
        title: "Thor and Norse Mythology",
        created_at: "2026-03-04",
      },
    ];
  }
);

// Fetch single conversation details (messages)
export const getConversationDetail = createAsyncThunk(
  "conversations/getDetail",
  async (conversationId) => {
    // Replace with backend API call later
    return {
      conversationId,
      messages: [
        { role: "user", content: "Tell me about Zeus" },
        { role: "assistant", content: "Zeus is the king of the Greek gods, ruling from Mount Olympus." },
        { role: "user", content: "What are his symbols?" },
        { role: "assistant", content: "Zeus is associated with the lightning bolt, eagle, bull, and oak tree." },
      ],
    };
  }
);

// Send message (user + assistant reply simulation)
export const sendMessage = createAsyncThunk(
  "conversations/sendMessage",
  async ({ conversationId, content }) => {
    // Replace with backend call
    return {
      conversationId,
      newMessage: { role: "user", content },
      assistantReply: {
        role: "assistant",
        content: "This is a dummy assistant reply to: " + content,
      },
    };
  }
);

// Slice
const conversationSlice = createSlice({
  name: "conversations",
  initialState,

  reducers: {
    clearMessages: (state) => {
      state.messages = [];
      state.error = null;
      state.loading = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // Get all conversations
      .addCase(getConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(getConversations.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load conversations";
      })

      // Get conversation detail
      .addCase(getConversationDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.messages = [];
      })
      .addCase(getConversationDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
      })
      .addCase(getConversationDetail.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load messages";
      })

      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload.newMessage);
        state.messages.push(action.payload.assistantReply);
      })
      .addCase(sendMessage.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to send message";
      });
  },
});

export const { clearMessages } = conversationSlice.actions;

export default conversationSlice.reducer;