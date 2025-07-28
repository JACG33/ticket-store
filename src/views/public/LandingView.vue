<script setup>
import { RouterLink } from "vue-router"
</script>

<template>
  <main
    class="bg-[#282c34] text-[#f0f0f0] flex justify-center items-center min-h-screen m-0 overflow-hidden">
    <!-- Icono de Ticket -->
    <svg
      class="absolute w-32 h-32 opacity-10 text-[#87CEEB] drop-shadow-[5px_5px_10px_rgba(0,0,0,0.5)] animate-float top-[10%] left-[15%]"
      style="animation-delay: 0s;" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22 10V6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V10C2 11.1 2.9 12 4 12H20C21.1 12 22 11.1 22 10ZM22 14V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V14C2 12.9 2.9 12 4 12H20C21.1 12 22 12.9 22 14ZM10 7H14V9H10V7ZM10 15H14V17H10V15Z" />
    </svg>

    <!-- Icono de Trofeo -->
    <svg
      class="absolute w-32 h-32 opacity-10 text-[#007bff] drop-shadow-[5px_5px_10px_rgba(0,0,0,0.5)] animate-float bottom-[15%] right-[10%]"
      style="animation-delay: 2s;" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18 9.5C18 7.57 16.43 6 14.5 6H9.5C7.57 6 6 7.57 6 9.5V11H4V9C4 5.93 6.93 3 10 3H14C17.07 3 20 5.93 20 9V11H18V9.5ZM17 13H7C5.9 13 5 13.9 5 15V19H19V15C19 13.9 18.1 13 17 13ZM12 21C13.1 21 14 20.1 14 19H10C10 20.1 10.9 21 12 21Z" />
    </svg>

    <!-- Icono de Regalo -->
    <svg
      class="absolute w-32 h-32 opacity-10 text-[#6c757d] drop-shadow-[5px_5px_10px_rgba(0,0,0,0.5)] animate-float top-[20%] right-[20%]"
      style="animation-delay: 4s;" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 12V6H17V2H7V6H4V12C4 13.1 4.9 14 6 14H18C19.1 14 20 13.1 20 12ZM9 4H15V6H9V4ZM18 16H6C4.9 16 4 16.9 4 18V20H20V18C20 16.9 19.1 16 18 16Z" />
    </svg>

    <!-- Icono de Dados -->
    <svg
      class="absolute w-32 h-32 opacity-10 text-[#87CEEB] drop-shadow-[5px_5px_10px_rgba(0,0,0,0.5)] animate-float bottom-[10%] left-[25%]"
      style="animation-delay: 1s;" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM8 7C8.55 7 9 7.45 9 8C9 8.55 8.55 9 8 9C7.45 9 7 8.55 7 8C7 7.45 7.45 7 8 7ZM16 15C16.55 15 17 15.45 17 16C17 16.55 16.55 17 16 17C15.45 17 15 16.55 15 16C15 15.45 15.45 15 16 15ZM16 7C16.55 7 17 7.45 17 8C17 8.55 16.55 9 16 9C15.45 9 15 8.55 15 8C15 7.45 15.45 7 16 7ZM8 15C8.55 15 9 15.45 9 16C9 16.55 8.55 17 8 17C7.45 17 7 16.55 7 16C7 15.45 7.45 15 8 15ZM12 11C12.55 11 13 11.45 13 12C13 12.55 12.55 13 12 13C11.45 13 11 12.55 11 12C11 11.45 11.45 11 12 11Z" />
    </svg>

    <div class="bg-[#3a3f47] rounded-2xl p-10 shadow-xl text-center max-w-[90%] w-[450px] relative z-10">
      <h1 class="text-5xl font-bold mb-4 text-[#87CEEB] ">Gana con Nosotros
      </h1>
      <h2 class="text-xl mb-8 text-[#f0f0f0]">¡Tu boleto a la suerte está aquí!</h2>
      <p class="text-base leading-relaxed mb-10 text-[#f0f0f0]">
        Participa en emocionantes rifas y sorteos con premios increíbles. Desde gadgets de última generación hasta
        experiencias inolvidables, ¡hay algo para todos! Únete a nuestra comunidad y comienza a ganar hoy mismo.
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <RouterLink to="/signup"
          class="py-3 px-7 rounded-lg font-semibold transition-all duration-300 ease-in-out shadow-md bg-blue-500 text-white hover:bg-blue-700 hover:shadow-lg">
          Crea
          una cuenta</RouterLink>
        <RouterLink to="/login"
          class="py-3 px-7 rounded-lg font-semibold transition-all duration-300 ease-in-out shadow-md bg-[#6c757d] text-white hover:bg-blue-500 hover:shadow-lg">
          Iniciar
          sesión</RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped>
@keyframes float {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-20px);
  }

  100% {
    transform: translateY(0px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>