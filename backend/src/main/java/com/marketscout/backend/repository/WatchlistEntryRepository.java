package com.marketscout.backend.repository;

import com.marketscout.backend.entity.WatchlistEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchlistEntryRepository extends JpaRepository<WatchlistEntry, Long> {
    
    /**
     * Find all entries for a specific user and list, ordered by position
     */
    List<WatchlistEntry> findByEmailAndListNameOrderByPositionAsc(String email, String listName);
    
    /**
     * Find all entries for a specific user, ordered by list name and position
     */
    List<WatchlistEntry> findByEmailOrderByListNameAscPositionAsc(String email);
    
    /**
     * Find a specific entry
     */
    Optional<WatchlistEntry> findByEmailAndListNameAndSymbol(String email, String listName, String symbol);
    
    /**
     * Get distinct list names for a user
     */
    @Query("SELECT DISTINCT w.listName FROM WatchlistEntry w WHERE w.email = :email ORDER BY w.listName ASC")
    List<String> findDistinctListNamesByEmail(String email);
    
    /**
     * Get max position for a user's list (for auto-incrementing position)
     */
    @Query("SELECT COALESCE(MAX(w.position), -1) FROM WatchlistEntry w WHERE w.email = :email AND w.listName = :listName")
    Integer findMaxPositionByEmailAndListName(String email, String listName);
}
