import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Home, MapPin, DoorClosed, Loader2 } from "lucide-react";
import request from "../../lib/api";

const CreateHouseModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    number_of_rooms: "",
    image: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        address: "",
        number_of_rooms: "",
        image: "",
      });
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const dataToSend = {
        name: formData.name,
      };

      if (formData.address) dataToSend.address = formData.address;
      if (formData.number_of_rooms)
        dataToSend.number_of_rooms = Number(formData.number_of_rooms);
      if (formData.image) dataToSend.image = formData.image;

      await request("/houses", {
        method: "POST",
        body: dataToSend,
        auth: true,
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create house");
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Ventana modal */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-scale-in">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h2 className="font-outfit text-xl font-bold text-slate-900">
            Create New House
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100">
              {error}
            </div>
          )}

          {/* House Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              House Name <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-teal transition-colors">
                <Home size={20} />
              </div>
              <input
                required
                type="text"
                name="name"
                placeholder="My Awesome House"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-2xl border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-slate-900 transition-all focus:border-brand-teal focus:bg-white focus:ring-4 focus:ring-brand-teal/10 outline-none"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Address (Optional)
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-teal transition-colors">
                <MapPin size={20} />
              </div>
              <input
                type="text"
                name="address"
                placeholder="123 Main St"
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-2xl border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-slate-900 transition-all focus:border-brand-teal focus:bg-white focus:ring-4 focus:ring-brand-teal/10 outline-none"
              />
            </div>
          </div>

          {/* Number of Rooms */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Number of Rooms (Optional)
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-teal transition-colors">
                <DoorClosed size={20} />
              </div>
              <input
                type="number"
                min="1"
                name="number_of_rooms"
                placeholder="3"
                value={formData.number_of_rooms}
                onChange={handleChange}
                className="w-full rounded-2xl border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-slate-900 transition-all focus:border-brand-teal focus:bg-white focus:ring-4 focus:ring-brand-teal/10 outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-200 py-4 font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-2 flex items-center justify-center gap-2 rounded-2xl bg-brand-teal py-4 font-bold text-white shadow-lg shadow-brand-teal/20 transition-all hover:bg-brand-teal/90 disabled:opacity-50 active:scale-95"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Create House"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CreateHouseModal;
