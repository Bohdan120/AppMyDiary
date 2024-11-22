import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/notes';

export const fetchNotes = createAsyncThunk('notes/fetchNotes', async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
});

export const addNote = createAsyncThunk('notes/addNote', async (note) => {
  const response = await axios.post(API_URL, note);
  return response.data;
});

export const updateNote = createAsyncThunk('notes/updateNote', async (note) => {
  const response = await axios.put(`${API_URL}/${note.id}`, note);
  return response.data;
});

export const deleteNote = createAsyncThunk('notes/deleteNote', async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

const notesSlice = createSlice({
  name: 'notes',
  initialState: { notes: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.notes = action.payload;
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.notes.push(action.payload);
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        const index = state.notes.findIndex(note => note.id === action.payload.id);
        if (index >= 0) state.notes[index] = action.payload;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter(note => note.id !== action.payload);
      });
  },
});

export default notesSlice.reducer;
