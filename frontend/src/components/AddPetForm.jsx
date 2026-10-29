// src/components/AddPetForm.jsx
// Form to Add or Edit a pet. Never asks the user for an ID.

import React, { useState, useEffect } from 'react';

// Initial empty form state
const EMPTY_FORM = {
  petName:   '',
  species:   '',
  ageYears:  '',
  vaccinated: ''
};

function AddPetForm({ onSubmit, editPet, onCancelEdit, loading }) {

  // ── Form data state ──────────────────────────────────────────────────────
  const [formData, setFormData] = useState(EMPTY_FORM);

  // ── Validation errors state ──────────────────────────────────────────────
  const [errors, setErrors] = useState({});

  // ── When editPet prop changes, fill form with existing values ─────────────
  useEffect(() => {
    if (editPet) {
      setFormData({
        petName:    editPet.petName,
        species:    editPet.species,
        ageYears:   editPet.ageYears,
        vaccinated: editPet.vaccinated !== null ? String(editPet.vaccinated) : ''
      });
      setErrors({});
    } else {
      setFormData(EMPTY_FORM);
      setErrors({});
    }
  }, [editPet]);

  // ── Handle input change ──────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear the error for this field as the user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ── Frontend validation ──────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!formData.petName.trim()) {
      newErrors.petName = 'Pet name is required.';
    } else if (formData.petName.trim().length < 2) {
      newErrors.petName = 'Pet name must be at least 2 characters.';
    }

    if (!formData.species.trim()) {
      newErrors.species = 'Species is required.';
    }

    if (formData.ageYears === '') {
      newErrors.ageYears = 'Age is required.';
    } else if (Number(formData.ageYears) < 0) {
      newErrors.ageYears = 'Age cannot be negative.';
    } else if (Number(formData.ageYears) > 150) {
      newErrors.ageYears = 'Age seems too large. Please enter a valid age.';
    } else if (!Number.isInteger(Number(formData.ageYears))) {
      newErrors.ageYears = 'Age must be a whole number.';
    }

    if (formData.vaccinated === '') {
      newErrors.vaccinated = 'Please select vaccination status.';
    }

    return newErrors;
  };

  // ── Handle form submit ───────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Build the payload — backend generates the id, so we don't send it
    const payload = {
      petName:    formData.petName.trim(),
      species:    formData.species.trim(),
      ageYears:   parseInt(formData.ageYears, 10),
      vaccinated: formData.vaccinated === 'true'
    };

    onSubmit(payload, () => {
      // Reset form on success (callback from parent)
      setFormData(EMPTY_FORM);
      setErrors({});
    });
  };

  // ── Handle cancel edit ───────────────────────────────────────────────────
  const handleCancel = () => {
    setFormData(EMPTY_FORM);
    setErrors({});
    onCancelEdit();
  };

  const isEditing = !!editPet;

  return (
    <div className="pet-card mb-4">

      {/* Section title */}
      <div className="section-title">
        <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-plus-circle-fill'}`}></i>
        {isEditing ? `Edit Pet — ID #${editPet.id}` : 'Add New Pet'}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="row g-3">

          {/* Pet Name */}
          <div className="col-md-6">
            <label htmlFor="petName" className="form-label">
              Pet Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="petName"
              name="petName"
              className={`form-control ${errors.petName ? 'is-invalid' : ''}`}
              placeholder="e.g. Buddy"
              value={formData.petName}
              onChange={handleChange}
            />
            {errors.petName && (
              <div className="invalid-feedback">{errors.petName}</div>
            )}
          </div>

          {/* Species */}
          <div className="col-md-6">
            <label htmlFor="species" className="form-label">
              Species <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="species"
              name="species"
              className={`form-control ${errors.species ? 'is-invalid' : ''}`}
              placeholder="e.g. Dog, Cat, Parrot"
              value={formData.species}
              onChange={handleChange}
            />
            {errors.species && (
              <div className="invalid-feedback">{errors.species}</div>
            )}
          </div>

          {/* Age in Years */}
          <div className="col-md-6">
            <label htmlFor="ageYears" className="form-label">
              Age (Years) <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              id="ageYears"
              name="ageYears"
              className={`form-control ${errors.ageYears ? 'is-invalid' : ''}`}
              placeholder="e.g. 3"
              value={formData.ageYears}
              min="0"
              max="150"
              onChange={handleChange}
            />
            {errors.ageYears && (
              <div className="invalid-feedback">{errors.ageYears}</div>
            )}
          </div>

          {/* Vaccination Status */}
          <div className="col-md-6">
            <label htmlFor="vaccinated" className="form-label">
              Vaccination Status <span className="text-danger">*</span>
            </label>
            <select
              id="vaccinated"
              name="vaccinated"
              className={`form-select ${errors.vaccinated ? 'is-invalid' : ''}`}
              value={formData.vaccinated}
              onChange={handleChange}
            >
              <option value="">-- Select Status --</option>
              <option value="true">✅ Vaccinated</option>
              <option value="false">❌ Not Vaccinated</option>
            </select>
            {errors.vaccinated && (
              <div className="invalid-feedback">{errors.vaccinated}</div>
            )}
          </div>

        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-2 mt-4">
          <button
            type="submit"
            className="btn-primary-custom"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                {isEditing ? ' Updating...' : ' Adding...'}
              </>
            ) : (
              <>
                <i className={`bi ${isEditing ? 'bi-check-lg' : 'bi-plus-lg'}`}></i>
                {isEditing ? 'Update Pet' : 'Add Pet'}
              </>
            )}
          </button>

          {isEditing && (
            <button
              type="button"
              className="btn-outline-secondary-custom"
              onClick={handleCancel}
              disabled={loading}
            >
              <i className="bi bi-x-lg"></i>
              Cancel
            </button>
          )}
        </div>

      </form>
    </div>
  );
}

export default AddPetForm;
