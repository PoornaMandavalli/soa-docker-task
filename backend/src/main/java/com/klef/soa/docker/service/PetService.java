package com.klef.soa.docker.service;

import com.klef.soa.docker.dto.PetDTO;
import com.klef.soa.docker.entity.Pet;

import java.util.List;

public interface PetService {

    Pet addPet(PetDTO petDTO);

    List<Pet> getAllPets();

    Pet getPetById(Long id);

    Pet updatePet(Long id, PetDTO petDTO);

    void deletePet(Long id);
}
