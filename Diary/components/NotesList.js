import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes, deleteNote, updateNote } from '../store/notesSlice';
import { FlatList, Text, Button, View, Image, TextInput, StyleSheet } from 'react-native';

const NotesList = () => {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes.notes);


  const [editingNote, setEditingNote] = useState(null); 
  const [updatedContent, setUpdatedContent] = useState(''); 

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteNote(id));
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setUpdatedContent(note.content);
  };

  const handleSave = () => {
    dispatch(updateNote({ ...editingNote, content: updatedContent }));
    setEditingNote(null); 
    setUpdatedContent(''); 
  };

  const handleCancel = () => {
    setEditingNote(null); 
    setUpdatedContent(''); 
  };

  return (
    <FlatList
      data={notes}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.noteItem}>
          <Text style={styles.title}>{item.title}</Text>

          {editingNote && editingNote.id === item.id ? (
            <TextInput
              style={styles.input}
              value={updatedContent}
              onChangeText={setUpdatedContent} 
            />
          ) : (
            <Text style={styles.content}>{item.content}</Text>
          )}

          {item.pinned && <Text style={styles.pinned}>Закріплено</Text>}
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.date}>Дата створення: {new Date(item.created_at).toLocaleString()}</Text>
         
          {editingNote && editingNote.id === item.id ? (
            <View>
              <Button title="Save" onPress={handleSave} />
              <Button title="Cancel" onPress={handleCancel} />
            </View>
          ) : (
            <Button title="Edit" onPress={() => handleEdit(item)} />
          )}
          <Button title="Delete" onPress={() => handleDelete(item.id)} />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  noteItem: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 16,
    marginTop: 5,
    color: '#555',
  },
  pinned: {
    fontSize: 14,
    color: '#e91e63',
    marginTop: 5,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
  date: {
    fontSize: 12,
    color: '#777',
    marginTop: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 5,
    marginTop: 10,
    fontSize: 16,
  },
});

export default NotesList;
