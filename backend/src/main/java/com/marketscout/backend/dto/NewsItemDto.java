package com.marketscout.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsItemDto {
    private String headline;
    private String source;
    private String url;
    private String summary;
    private Long publishedAt;    // Unix timestamp
}
