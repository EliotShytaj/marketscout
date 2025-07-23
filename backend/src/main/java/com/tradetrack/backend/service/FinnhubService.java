package com.tradetrack.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class FinnhubService {

    private final RestTemplate restTemplate;
    private final String apiKey;

    public FinnhubService(RestTemplate restTemplate, @Value("${finnhub.api.key}") String apiKey) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
    }

    public String getQuote(String symbol) {
        String url = String.format(
                "https://finnhub.io/api/v1/quote?symbol=%s&token=%s",
                symbol, apiKey
        );
        return restTemplate.getForObject(url, String.class);
    }
}
