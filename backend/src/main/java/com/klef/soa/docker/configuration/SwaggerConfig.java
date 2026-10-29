package com.klef.soa.docker.configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI petManagementOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Pet Management API")
                        .description("REST API for managing pets - KLEF SOA Docker Project")
                        .version("1.0.0"));
    }
}
