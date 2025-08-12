package com.marketscout.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestConfig { //creates a singleton RestTemplate bean for making HTTP requests.
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

