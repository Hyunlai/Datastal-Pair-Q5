import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import API from "../api/axios";

// Initial state
const initialState = {
  conversations: [],  // List of all conversations
  messages: [],       // Messages of selected conversation
  loading: false,
  error: null,
};

export const getConversations = createAsyncThunk(
  "conversations/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("conversations/");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || "Failed to load conversations"
      );
    }
  }
);

export const getConversationDetail = createAsyncThunk(
  "conversations/getDetail",
  async (conversationId, thunkAPI) => {
    try {
      const response = await API.get(`conversations/${conversationId}/`);
      return {
        conversationId,
        messages: response.data.messages || [],
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || "Failed to load messages"
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  "conversations/sendMessage",
  async ({ conversationId, content }, thunkAPI) => {
    try {
      const payload = {
        conversation_id: conversationId,
        content,
      };

      const response = await API.post("conversation/", payload);

      return {
        conversationId: response.data.conversation_id,
        messages: response.data.messages || [],
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || "Failed to send message"
      );
    }
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
      .addCase(getConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load conversations";
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
      .addCase(getConversationDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load messages";
      })

      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to send message";
      });
  },
});

export const { clearMessages } = conversationSlice.actions;

export default conversationSlice.reducer;