package com.example.dairyapp.controller;

import com.example.dairyapp.model.Note;
import com.example.dairyapp.model.User;
import com.example.dairyapp.repository.NoteRepository;
import com.example.dairyapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "https://dairy-note-taking-app.vercel.app"
        + "http://localhost:5173", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/notes")
public class NoteController {
    @Autowired
    NoteRepository noteRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping
    public List<Note> getNotes() {
        User user = getCurrentUser();
        return noteRepository.findByUserId(user.getId());
    }

    @PostMapping
    public Note createNote(@RequestBody Note note) {
        User user = getCurrentUser();
        note.setUser(user);
        note.setCreatedAt(LocalDateTime.now());
        return noteRepository.save(note);
    }

    @DeleteMapping("/{id}")
    public void deleteNote(@PathVariable Long id) {
        // TODO: check if note belongs to user
        noteRepository.deleteById(id);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
    }
}
