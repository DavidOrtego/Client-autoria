import React from 'react';
import { Home, MapPin, Users, ChevronRight } from 'lucide-react';
import casa1 from '../assets/casa1.png';
import casa2 from '../assets/casa2.png';
import casa3 from '../assets/casa3.png';
import casa4 from '../assets/casa4.png';
import casa5 from '../assets/casa5.png';
import casa6 from '../assets/casa6.png';

const obtenerImagenNivel = (nivel) => {
  if (!nivel) return null;
  if (nivel < 10) return casa1;
  if (nivel < 20) return casa2;
  if (nivel < 30) return casa3;
  if (nivel < 40) return casa4;
  if (nivel < 50) return casa5;
  return casa6;                
};

const HouseCard = ({ house, onClick }) => {
  const { name, address, number_of_rooms, image, level, members_count } = house;

  // Asigna la imagen según su nivel con tope máximo en el nivel 50 
  const imagenAMostrar = obtenerImagenNivel(level);

  return (
    <div 
      onClick={onClick}
      className="glass-card group relative overflow-hidden rounded-3xl p-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer border border-white/20"
    >
      {/* Efecto de degradado de fondo */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-teal/10 blur-3xl transition-all duration-500 group-hover:bg-brand-teal/20" />
      
      <div className="relative flex flex-col gap-4">
        {/* Contenedor de imagen */}
        <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-100">
          {imagenAMostrar ? (
            <img 
              src={imagenAMostrar} 
              alt={name} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-brand-teal/20 to-brand-green/20">
              <Home size={48} className="text-brand-teal/40" />
            </div>
          )}
          
          <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-teal shadow-sm backdrop-blur-sm">
            {number_of_rooms} Rooms
          </div>
          {level && (
            <div className="absolute left-3 top-3 rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
              Level {level}
            </div>
          )}
        </div>

        {/* Contenido principal */}
        <div className="flex flex-col gap-2">
          <h3 className="font-outfit text-xl font-bold text-slate-800 transition-colors group-hover:text-brand-teal">
            {name}
          </h3>
          {address ? (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-brand-teal transition-colors cursor-pointer group/location z-20 w-fit"
            >
              <MapPin size={16} className="shrink-0 text-brand-teal/60 group-hover/location:text-brand-teal transition-colors" />
              <span className="truncate underline decoration-dotted underline-offset-4 decoration-slate-300 hover:decoration-brand-teal">{address}</span>
            </a>
          ) : (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <MapPin size={16} className="shrink-0 text-slate-300" />
              <span className="truncate">No address specified</span>
            </div>
          )}

          <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Users size={14} className="text-brand-teal/80" />
              <span>{members_count || 0} {members_count === 1 ? 'Member' : 'Members'}</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-brand-teal group-hover:text-white">
              <ChevronRight size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseCard;
