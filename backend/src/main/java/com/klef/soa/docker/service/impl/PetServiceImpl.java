package com.klef.soa.docker.service.impl;

import com.klef.soa.docker.dto.PetDTO;
import com.klef.soa.docker.entity.Pet;
import com.klef.soa.docker.repository.PetRepository;
import com.klef.soa.docker.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetServiceImpl implements PetService {

    @Autowired
    private PetRepository petRepository;

    @Override
    public Pet addPet(PetDTO petDTO) {
        Pet pet = new Pet();
        pet.setPetName(petDTO.getPetName());
        pet.setSpecies(petDTO.getSpecies());
        pet.setAgeYears(petDTO.getAgeYears());
        pet.setVaccinated(petDTO.getVaccinated());
        return petRepository.save(pet);
    }

    @Override
    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    @Override
    public Pet getPetById(Long id) {
        return petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found with ID: " + id));
    }

    @Override
    public Pet updatePet(Long id, PetDTO petDTO) {
        Pet existingPet = getPetById(id);
        existingPet.setPetName(petDTO.getPetName());
        existingPet.setSpecies(petDTO.getSpecies());
        existingPet.setAgeYears(petDTO.getAgeYears());
        existingPet.setVaccinated(petDTO.getVaccinated());
        return petRepository.save(existingPet);
    }

    @Override
    public void deletePet(Long id) {
        Pet existingPet = getPetById(id);
        petRepository.delete(existingPet);
    }
}
