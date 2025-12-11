import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/notes';

const getAllNotes = () => {
    return axios.get(API_URL, { headers: authHeader() });
};

const createNote = (note) => {
    return axios.post(API_URL, note, { headers: authHeader() });
};

const deleteNote = (id) => {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
}

const NoteService = {
    getAllNotes,
    createNote,
    deleteNote
};

export default NoteService;
