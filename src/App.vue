<template>
  <div class="app">
    <header>
      <div class="head">
        <span class="logo">
          <span class="logo-icon">🌿</span>
          <h1>Botanica</h1>
        </span>
        <h1>Yusufhan</h1>
      </div>
    </header>

    <main>
      <Hero />
    </main>

    <footer>
      <p>
        Botanica &copy; {{ new Date().getFullYear() }} | Trefle API kullanılarak
        oluşturulmuştur
      </p>
    </footer>
  </div>
</template>

<style>
/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #121212;
  color: #e0e0e0;
  line-height: 1.6;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background-color: #1e1e1e;
  background: none;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.head{
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.logo {
  display: flex;
  background: none;
  align-items: center;
}

.logo-icon {
  font-size: 2rem;
  background: none;
  margin-right: 0.5rem;
}

.logo h1 {
  color: #4caf50;
  background: none;
  font-size: 1.8rem;
  font-weight: 600;
}

main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

footer {
  background-color: #1e1e1e;
  padding: 1rem;
  text-align: center;
  font-size: 0.9rem;
  color: #aaa;
}
</style>

<script>
import Hero from "./components/hero.vue";
import Deneme from "./components/deneme.vue";

export default {
  components: {
    Hero,
    Deneme,
  },
};
</script>
