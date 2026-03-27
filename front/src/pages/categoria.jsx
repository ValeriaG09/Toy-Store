import { useParams, useNavigate } from "react-router-dom";

export default function Categoria() {
  const { nombre } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="bg-purple-700 px-8 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/inicio")}
          className="text-white font-bold text-sm hover:text-yellow-300 transition"
        >
          ← Volver
        </button>
        <h1 className="text-white font-black text-2xl uppercase">{nombre}</h1>
      </div>

      <div className="p-10 text-center text-gray-400 text-lg">
        {/* Aquí irán los productos de "{nombre}" */}
        Próximamente los productos de <strong>{nombre}</strong>...
      </div>
    </div>
  );
}