import React from 'react';

const PurposeSidebar = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop (Igual al de Hamm: más transparente y con blur profundo) */}
            <div
                className="fixed inset-0 z-[998] bg-white/20 backdrop-blur-[6px] animate-in fade-in duration-700"
                onClick={onClose}
            ></div>

            {/* Sidebar Bunny & Ducky - Derecha, Amplia (mismo ancho de Hamm 85% - 1100px) */}
            <div className="fixed top-0 right-0 h-full w-full lg:w-[85%] max-w-[1100px] z-[999] flex animate-plush-bounce">

                <div className="h-full w-full bg-[#E3F2FD] border-l-[12px] border-white shadow-[-30px_0_70px_rgba(33,150,243,0.15)] flex flex-col relative overflow-hidden rounded-l-[120px]">

                    {/* Decoración Superior - Colores Bunny & Ducky */}
                    <div className="absolute top-0 right-0 w-full h-3 flex">
                        <div className="flex-1 bg-[#63B8FF]"></div> {/* Bunny Blue */}
                        <div className="flex-1 bg-[#A6E100]"></div> {/* Lime Green */}
                        <div className="flex-1 bg-[#FFD700]"></div> {/* Ducky Yellow */}
                    </div>

                    {/* Header */}
                    <div className="p-8 md:p-12 bg-white border-b-8 border-[#63B8FF]/10 flex justify-between items-center z-20">
                        <div className="flex items-center gap-6">
                            <div className="relative group/icons animate-swing">
                                <div className="w-16 h-16 bg-[#63B8FF] rounded-[1.5rem] flex items-center justify-center text-white font-black text-3xl shadow-lg border-4 border-white rotate-[-6deg] group-hover/icons:rotate-[-12deg] transition-transform">B</div>
                                <div className="w-10 h-10 bg-[#FFD700] rounded-xl flex items-center justify-center text-blue-900 font-black text-xl shadow-md border-[3px] border-white absolute -bottom-3 -right-3 rotate-[12deg] group-hover/icons:rotate-[20deg] transition-transform">D</div>
                            </div>
                            <div>
                                <h2 className="text-3xl md:text-4xl font-[1000] text-[#0047AB] uppercase tracking-tighter leading-none mb-1">
                                    Nuestra Esencia
                                </h2>
                                <p className="text-[10px] font-black text-[#A6E100] uppercase tracking-[5px] opacity-80">Bunny & Ducky Corner</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-14 h-14 bg-gray-50 hover:bg-[#63B8FF] hover:text-white rounded-3xl flex items-center justify-center text-[#63B8FF] font-[1000] text-2xl transition-all shadow-sm active:scale-90"
                        >
                            X
                        </button>
                    </div>

                    {/* MAIN CONTENT AREA - Layout Horizontal tipo Grid/Flex para aprovechar la amplitud y evitar scroll interno */}
                    <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row gap-12 lg:gap-20 items-stretch bg-[#f4fafe] z-10 w-full overflow-y-auto custom-scrollbar">

                        {/* Sección Propósito (BUNNY) */}
                        <section className="flex-1 flex flex-col rounded-[60px] animate-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center justify-center gap-4 mb-10">
                                <div className="text-[#63B8FF]">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                </div>
                                <h3 className="text-sm font-[1000] text-[#63B8FF] uppercase tracking-[6px] opacity-80">Nuestro Propósito</h3>
                            </div>
                            {/* Card Contenedor con Orejas de Bunny */}
                            <div className="relative flex-1 mt-6">
                                {/* Orejitas de Bunny (Decorativas por detrás) */}
                                <div className="absolute -top-12 left-[20%] w-8 h-20 bg-[#63B8FF] rounded-full rotate-[-15deg] border-4 border-white shadow-[inset_-3px_-3px_10px_rgba(0,0,0,0.1)] z-0 animate-swing duration-[4s]"></div>
                                <div className="absolute -top-16 left-[35%] w-8 h-24 bg-[#63B8FF] rounded-full rotate-[5deg] border-4 border-white shadow-[inset_-3px_-3px_10px_rgba(0,0,0,0.1)] z-0 animate-swing" style={{ animationDelay: '0.4s' }}></div>

                                <div className="relative z-10 h-full bg-white p-10 lg:p-12 xl:p-14 rounded-[50px] border-8 border-[#E3F2FD] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col justify-center">
                                    <p className="text-[#334155] font-bold leading-relaxed text-base lg:text-lg xl:text-xl text-justify mb-6">
                                        En <span className="text-[#0047AB] font-black">Toy Store</span>, creemos que el placer es un derecho, no un tabú. Nuestro propósito es crear una plataforma segura, inclusiva y divertida donde todxs puedan explorar su sexualidad desde el consentimiento, la libertad y la curiosidad.
                                    </p>
                                    <div className="h-1.5 w-20 bg-[#63B8FF] rounded-full my-8 opacity-40"></div>
                                    <p className="text-[#64748b] font-semibold leading-relaxed text-base lg:text-lg xl:text-xl text-justify italic">
                                        Inspirados por la nostalgia juguetona de nuestra infancia y el universo de Toy Story, reconectamos con el cuerpo desde el goce, la risa y el deseo, haciendo que los juguetes, literalmente, cobren vida.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Sección Misión (DUCKY) */}
                        <section className="flex-1 flex flex-col pt-12 md:pt-0 animate-in slide-in-from-bottom-8 duration-700 delay-100">
                            <div className="flex items-center justify-center gap-4 mb-10">
                                <div className="text-[#FFB300]">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                </div>
                                <h3 className="text-sm font-[1000] text-[#0047AB] uppercase tracking-[6px] opacity-80">Nuestra Misión</h3>
                            </div>
                            {/* Card Contenedor con Detalles Ducky */}
                            <div className="relative flex-1 mt-6">
                                {/* Plumas de Ducky (Decorativas por detrás) */}
                                <div className="absolute -top-10 right-[35%] w-7 h-16 bg-[#FFD700] rounded-full rotate-[25deg] border-4 border-white shadow-[inset_-3px_-3px_10px_rgba(0,0,0,0.05)] z-0 animate-swing duration-[3.5s]"></div>
                                <div className="absolute -top-8 right-[20%] w-7 h-14 bg-[#FFD700] rounded-full rotate-[50deg] border-4 border-white shadow-[inset_-3px_-3px_10px_rgba(0,0,0,0.05)] z-0 animate-swing" style={{ animationDelay: '0.6s' }}></div>
                                {/* Piquito Naranja decorativo del pato */}
                                <div className="absolute top-8 -left-6 w-12 h-6 bg-orange-400 rounded-full rotate-[-15deg] shadow-md z-20 border-4 border-white animate-swing" style={{ animationDelay: '0.2s', transformOrigin: 'right center' }}></div>

                                <div className="relative z-10 h-full bg-white p-10 lg:p-12 xl:p-14 rounded-[50px] border-8 border-[#FFF9C4] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col justify-center">
                                    <p className="text-[#334155] font-bold leading-relaxed text-base lg:text-lg xl:text-xl text-justify mb-6">
                                        Brindar una experiencia única en el mundo del placer adulto a través de una plataforma digital colorida, inclusiva y pedagógica. <span className="text-[#0047AB] font-black">Toy Store</span> ofrece productos eróticos de alta calidad, asesoría clara y un ambiente donde la sexualidad se celebra sin vergüenza.
                                    </p>
                                    <div className="h-1.5 w-20 bg-[#FFD700] rounded-full my-8 opacity-40"></div>
                                    <p className="text-[#64748b] font-semibold leading-relaxed text-base lg:text-lg xl:text-xl text-justify">
                                        Queremos romper estigmas, promover el autocuidado y normalizar el disfrute del placer con responsabilidad, humor y fantasía.
                                    </p>
                                </div>
                            </div>
                        </section>

                    </div>

                    {/* Firma Decorativa - Sin Botón Inferior */}
                    <div className="pb-10 pt-4 bg-[#f4fafe] flex flex-col items-center opacity-40">
                        <div className="flex gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#63B8FF]"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-[#A6E100]"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FFD700]"></div>
                        </div>
                        <p className="text-[10px] font-black uppercase mt-3 tracking-[5px] text-[#0047AB]">Hecho con amor en Andy's Room</p>
                    </div>

                </div>
            </div>
        </>
    );
};

export default PurposeSidebar;
