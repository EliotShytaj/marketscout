// src/main/java/com/tradetrack/backend/service/FinnhubService.java
package com.tradetrack.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDate;

@Service
public class FinnhubService {

    private final RestTemplate restTemplate;
    private final String apiKey;

    public FinnhubService(RestTemplate restTemplate,
                          @Value("${finnhub.api.key}") String apiKey) {
        this.restTemplate = restTemplate;
        this.apiKey       = apiKey;
    }

    //latest quote for the ticker
    public String getQuote(String symbol) {
        String url = String.format(
                "https://finnhub.io/api/v1/quote?symbol=%s&token=%s",
                symbol, apiKey
        );
        return restTemplate.getForObject(url, String.class);
    }

    // company profile for the ticker (more info)
    public String getCompanyProfile(String symbol) {
        String url = String.format(
                "https://finnhub.io/api/v1/stock/profile?symbol=%s&token=%s",
                symbol, apiKey
        );
        return restTemplate.getForObject(url, String.class);
    }
    //company profile for the ticker less info.
    public String getCompanyProfile2(String symbol) {
        String url = String.format(
                "https://finnhub.io/api/v1/stock/profile2?symbol=%s&token=%s",
                symbol, apiKey
        );
        return restTemplate.getForObject(url, String.class);
    }

    public String getCompanyNews(String symbol) {
        String from = LocalDate.now().minusDays(30).toString();
        String to   = LocalDate.now().toString();
        String url = String.format(
                "https://finnhub.io/api/v1/company-news?symbol=%s&from=%s&to=%s&token=%s",
                symbol, from, to, apiKey
        );
        return restTemplate.getForObject(url, String.class);
    }
}
