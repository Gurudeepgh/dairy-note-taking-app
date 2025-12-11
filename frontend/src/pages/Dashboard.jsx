import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import NoteService from "../services/note.service";

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [newNoteContent, setNewNoteContent] = useState("");
    const navigate = useNavigate();
    const [user, setUser] = useState(undefined);
    const [selectedYear, setSelectedYear] = useState("All");
    const [selectedMonth, setSelectedMonth] = useState("All");

    // Extract unique years from notes
    const years = [...new Set(notes.map(note => new Date(note.createdAt).getFullYear()))].sort((a, b) => b - a);

    // Filter notes based on selection
    const filteredNotes = notes.filter(note => {
        const noteDate = new Date(note.createdAt);
        const yearMatch = selectedYear === "All" || noteDate.getFullYear() === parseInt(selectedYear);
        const monthMatch = selectedMonth === "All" || noteDate.getMonth() === parseInt(selectedMonth);
        return yearMatch && monthMatch;
    });

    // Get available months for selected year (optional refinement, or just show all months)
    const months = Array.from({ length: 12 }, (_, i) => i);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) {
            navigate("/login");
        } else {
            setUser(currentUser);
            fetchNotes();
        }
    }, [navigate]);

    const fetchNotes = () => {
        NoteService.getAllNotes().then(
            (response) => {
                setNotes(response.data);
            },
            (error) => {
                console.log("Error fetching notes", error);
                if (error.response && error.response.status === 401) {
                    AuthService.logout();
                    navigate("/login");
                }
            }
        );
    };

    const handleCreateNote = (e) => {
        e.preventDefault();
        if (!newNoteContent.trim()) return;

        NoteService.createNote({ content: newNoteContent }).then(
            () => {
                setNewNoteContent("");
                fetchNotes();
            },
            (error) => {
                console.log(error);
            }
        );
    };

    const handleLogout = () => {
        AuthService.logout();
        navigate("/login");
    };

    const handleDelete = (id) => {
        NoteService.deleteNote(id).then(() => {
            fetchNotes();
        });
    }

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Navbar */}
            <nav className="bg-white shadow-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-indigo-600">My Diary</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-700">Hello, {user?.username}</span>
                            <button
                                onClick={handleLogout}
                                className="rounded-md bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl pb-10 px-4 py-8 sm:px-6 lg:px-8">
                {/* Create Note Section */}
                <div className="mb-8 rounded-xl bg-white p-6 shadow-sm border border-slate-200">
                    <h2 className="mb-4 text-xl font-semibold text-gray-800">Write a new entry</h2>
                    <form onSubmit={handleCreateNote}>
                        <textarea
                            className="w-full rounded-lg border border-gray-300 p-4 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                            rows="3"
                            placeholder="What's on your mind today?"
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                        />
                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                className="rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                                disabled={!newNoteContent.trim()}
                            >
                                Save Entry
                            </button>
                        </div>
                    </form>
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-6">
                    <select
                        className="rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                        value={selectedYear}
                        onChange={(e) => {
                            setSelectedYear(e.target.value);
                            setSelectedMonth("All"); // Reset month when year changes
                        }}
                    >
                        <option value="All">All Years</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>

                    <select
                        className="rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        disabled={selectedYear === "All"}
                    >
                        <option value="All">All Months</option>
                        {months.map((month, index) => (
                            <option key={index} value={index}>{new Date(0, index).toLocaleString('default', { month: 'long' })}</option>
                        ))}
                    </select>
                </div>

                {/* Notes Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredNotes.map((note) => (
                        <div
                            key={note.id}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md border border-slate-200 hover:border-indigo-200"
                        >
                            <div className="mb-4">
                                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{note.content}</p>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t pt-4">
                                <span className="text-xs text-gray-500">
                                    {new Date(note.createdAt).toLocaleString()}
                                </span>
                                <button
                                    onClick={() => handleDelete(note.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    title="Delete note"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredNotes.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500 bg-white/50 rounded-xl border border-dashed border-gray-300">
                            No notes found for this period.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
