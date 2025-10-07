package com.marketscout.backend.service;

import com.marketscout.backend.entity.WatchlistEntry;
import com.marketscout.backend.repository.WatchlistEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WatchlistSimpleService {
    
    private final WatchlistEntryRepository repository;
    
    /**
     * Get all distinct list names for a user
     */
    public List<String> getListNames(String email) {
        return repository.findDistinctListNamesByEmail(email);
    }
    
    /**
     * Get all entries in a specific list
     */
    public List<WatchlistEntry> getList(String email, String listName) {
        return repository.findByEmailAndListNameOrderByPositionAsc(email, listName);
    }
    
    /**
     * Get all watchlist entries for a user (across all lists)
     */
    public List<WatchlistEntry> getAll(String email) {
        return repository.findByEmailOrderByListNameAscPositionAsc(email);
    }
    
    /**
     * Add a symbol to a watchlist
     * @return the created entry, or empty if symbol already exists
     */
    @Transactional
    public Optional<WatchlistEntry> add(String email, String listName, String symbol) {
        // Normalize symbol to uppercase
        String normalizedSymbol = symbol.toUpperCase().trim();
        
        // Check if already exists
        if (repository.findByEmailAndListNameAndSymbol(email, listName, normalizedSymbol).isPresent()) {
            return Optional.empty();
        }
        
        // Get next position
        Integer maxPos = repository.findMaxPositionByEmailAndListName(email, listName);
        int nextPosition = maxPos + 1;
        
        // Create entry
        WatchlistEntry entry = new WatchlistEntry();
        entry.setEmail(email);
        entry.setListName(listName);
        entry.setSymbol(normalizedSymbol);
        entry.setPosition(nextPosition);
        entry.setAddedAt(LocalDateTime.now());
        
        return Optional.of(repository.save(entry));
    }
    
    /**
     * Remove a symbol from a watchlist
     * @return true if deleted, false if not found
     */
    @Transactional
    public boolean remove(String email, String listName, String symbol) {
        String normalizedSymbol = symbol.toUpperCase().trim();
        Optional<WatchlistEntry> entry = repository.findByEmailAndListNameAndSymbol(email, listName, normalizedSymbol);
        
        if (entry.isPresent()) {
            repository.delete(entry.get());
            return true;
        }
        
        return false;
    }
}
