package com.marketscout.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "watchlist_entry",
    uniqueConstraints = @UniqueConstraint(columnNames = {"email", "list_name", "symbol"})
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WatchlistEntry {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String email;
    
    @Column(name = "list_name", nullable = false)
    private String listName;
    
    @Column(nullable = false)
    private String symbol;
    
    @Column(nullable = false)
    private Integer position;
    
    @Column(name = "added_at", nullable = false)
    private LocalDateTime addedAt;
    
    @PrePersist
    protected void onCreate() {
        if (addedAt == null) {
            addedAt = LocalDateTime.now();
        }
    }
}
