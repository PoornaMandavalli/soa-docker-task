package com.klef.soa.docker.controller;

import com.klef.soa.docker.dto.PetDTO;
import com.klef.soa.docker.entity.Pet;
import com.klef.soa.docker.service.PetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "*")
@Tag(name = "Pet Management", description = "CRUD operations for pets")
public class PetController {

    @Autowired
    private PetService petService;

    // ── Add Pet ──────────────────────────────────────────────────────────────
    @PostMapping
    @Operation(summary = "Add a new pet")
    public ResponseEntity<?> addPet(@Valid @RequestBody PetDTO petDTO) {
        try {
            Pet savedPet = petService.addPet(petDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPet);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ── Get All Pets ─────────────────────────────────────────────────────────
    @GetMapping
    @Operation(summary = "Get all pets")
    public ResponseEntity<?> getAllPets() {
        try {
            List<Pet> pets = petService.getAllPets();
            return ResponseEntity.ok(pets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ── Get Pet by ID ────────────────────────────────────────────────────────
    @GetMapping("/{id}")
    @Operation(summary = "Get a pet by ID")
    public ResponseEntity<?> getPetById(@PathVariable Long id) {
        try {
            Pet pet = petService.getPetById(id);
            return ResponseEntity.ok(pet);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ── Update Pet ───────────────────────────────────────────────────────────
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing pet")
    public ResponseEntity<?> updatePet(@PathVariable Long id,
                                       @Valid @RequestBody PetDTO petDTO) {
        try {
            Pet updatedPet = petService.updatePet(id, petDTO);
            return ResponseEntity.ok(updatedPet);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ── Delete Pet ───────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a pet by ID")
    public ResponseEntity<?> deletePet(@PathVariable Long id) {
        try {
            petService.deletePet(id);
            return ResponseEntity.ok(Map.of("message", "Pet deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ── Validation Error Handler ─────────────────────────────────────────────
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }
}
