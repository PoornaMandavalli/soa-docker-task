// src/App.jsx
// Root component — manages state and all API calls.

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar      from './components/Navbar.jsx';
import AddPetForm  from './components/AddPetForm.jsx';
import PetList     from './components/PetList.jsx';

// ── Backend base URL — change this if your backend runs on a different port ──
const API_BASE_URL = 'http://localhost:8080/api/pets';

function App() {

  // ── State ─────────────────────────────────────────────────────────────────
  const [pets,            setPets]            = useState([]);
  const [listLoading,     setListLoading]     = useState(true);   // initial fetch
  const [formLoading,     setFormLoading]     = useState(false);   // add/update submit
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);    // which row is deleting
  const [editPet,         setEditPet]         = useState(null);    // pet being edited (null = add mode)
  const [message,         setMessage]         = useState(null);    // { type: 'success'|'danger', text }

  // ── Auto-hide message after 4 seconds ────────────────────────────────────
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // ── Fetch all pets on page load ───────────────────────────────────────────
  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    setListLoading(true);
    try {
      const response = await axios.get(API_BASE_URL);
      setPets(response.data);
    } catch (error) {
      showMessage('danger',
        'Could not connect to the backend. Please make sure the Spring Boot server is running.'
      );
    } finally {
      setListLoading(false);
    }
  };

  // ── Add or Update pet (called from AddPetForm) ────────────────────────────
  const handleFormSubmit = async (payload, resetForm) => {
    setFormLoading(true);
    try {
      if (editPet) {
        // UPDATE — PUT /api/pets/{id}
        await axios.put(`${API_BASE_URL}/${editPet.id}`, payload);
        showMessage('success', `✅ Pet "${payload.petName}" updated successfully!`);
        setEditPet(null);
      } else {
        // ADD — POST /api/pets
        await axios.post(API_BASE_URL, payload);
        showMessage('success', `✅ Pet "${payload.petName}" added successfully!`);
      }
      resetForm();
      fetchPets();                    // refresh list
    } catch (error) {
      const errMsg = error.response?.data?.error
        || error.response?.data?.petName
        || 'Something went wrong. Please try again.';
      showMessage('danger', `❌ ${errMsg}`);
    } finally {
      setFormLoading(false);
    }
  };

  // ── Delete a pet ──────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) return;

    setDeleteLoadingId(id);
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      showMessage('success', '✅ Pet deleted successfully!');
      fetchPets();                    // refresh list
    } catch (error) {
      showMessage('danger', '❌ Could not delete the pet. Please try again.');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  // ── Set pet for editing ───────────────────────────────────────────────────
  const handleEdit = (pet) => {
    setEditPet(pet);
    // Scroll to form so user sees it
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Cancel edit mode ──────────────────────────────────────────────────────
  const handleCancelEdit = () => {
    setEditPet(null);
  };

  // ── Helper: show a message ────────────────────────────────────────────────
  const showMessage = (type, text) => {
    setMessage({ type, text });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Top navigation */}
      <Navbar petCount={pets.length} />

      <div className="page-wrapper">

        {/* Global success / error alert */}
        {message && (
          <div
            className={`alert alert-${message.type} alert-custom mb-4`}
            role="alert"
          >
            {message.text}
          </div>
        )}

        {/* Add / Edit form */}
        <AddPetForm
          onSubmit={handleFormSubmit}
          editPet={editPet}
          onCancelEdit={handleCancelEdit}
          loading={formLoading}
        />

        {/* Pets table */}
        <PetList
          pets={pets}
          loading={listLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          deleteLoadingId={deleteLoadingId}
        />

      </div>
    </>
  );
}

export default App;
