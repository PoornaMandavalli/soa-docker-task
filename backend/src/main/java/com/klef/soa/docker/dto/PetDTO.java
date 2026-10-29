package com.klef.soa.docker.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PetDTO {

    // id is NOT included — the backend generates it automatically

    @NotBlank(message = "Pet name must not be blank")
    private String petName;

    @NotBlank(message = "Species must not be blank")
    private String species;

    @NotNull(message = "Age is required")
    @Min(value = 0, message = "Age must be zero or a positive number")
    private Integer ageYears;

    @NotNull(message = "Vaccination status is required")
    private Boolean vaccinated;
}
