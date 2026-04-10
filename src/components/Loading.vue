<template>
  <div class="loading-overlay">
    <div class="loading-content">
      <img src="../assets/logo.png" alt="Loading..." class="loading-logo" />
      <div class="loading-bar">
        <div class="loading-bar-fill"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0b0a0d;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.loading-logo {
  height: 64px;
  width: auto;
  animation: pulse 1.5s ease-in-out infinite;
}

.loading-bar {
  width: 120px;
  height: 3px;
  background-color: #1a1a1f;
  border-radius: 4px;
  overflow: hidden;
}

.loading-bar-fill {
  height: 100%;
  width: 40%;
  background-color: #dd8808;
  border-radius: 4px;
  animation: slide 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes slide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(350%);
  }
}
</style>
