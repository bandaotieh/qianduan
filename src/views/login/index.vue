<template>
  <div class="login-container" :class="{ 'is-day': !isDark }">
    <div class="background-layer" :class="{ 'is-active': !isDark }">
      <SunHdrBackground />
    </div>
    <div class="background-layer" :class="{ 'is-active': isDark }">
      <HdrBackground />
    </div>

    <el-button class="theme-switch" circle :aria-label="isDark ? 'Switch to day mode' : 'Switch to night mode'"
      :title="isDark ? 'Switch to day mode' : 'Switch to night mode'" @click="toggleDark()">
      <span aria-hidden="true">{{ isDark ? '☀' : '☾' }}</span>
    </el-button>

    <div class="login-content">
      <div class="login-card">
        <h1 class="login-title">Welcome Back</h1>
        <p class="login-subtitle">Sign in to continue</p>
        <el-button size="large" type="primary" class="login-btn" @click="goHome">
          Enter Dashboard
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { isDark, toggleDark } from '~/composables'
import HdrBackground from '../../components/HdrBackground.vue'
import SunHdrBackground from '../../components/SunHdrBackground.vue'

const router = useRouter()

const goHome = () => {
  router.push('/home')
}
</script>

<style scoped>
.login-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #111429;
  transition: background-color 700ms ease;
}

.is-day {
  background: #dff5f3;
}

.background-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0;
  transition: opacity 900ms cubic-bezier(0.22, 1, 0.36, 1);
}

.background-layer.is-active {
  opacity: 1;
}

.login-content {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.login-card {
  min-width: 320px;
  padding: 48px 40px;
  text-align: center;
  background: rgba(255, 255, 255, .1);
  border: 1px solid rgba(255, 255, 255, .15);
  border-radius: 16px;
  box-shadow: 0 24px 70px rgba(7, 13, 43, .25);
  backdrop-filter: blur(20px);
  transition: background-color 700ms ease, border-color 700ms ease, box-shadow 700ms ease;
}

.is-day .login-card {
  background: rgba(255, 255, 255, .62);
  border-color: rgba(34, 75, 86, .18);
  box-shadow: 0 24px 70px rgba(36, 109, 130, .2);
}

.login-title {
  margin: 0 0 8px;
  color: #fff;
  font-size: 28px;
  font-weight: 600;
  transition: color 500ms ease;
}

.is-day .login-title {
  color: #17212b;
}

.login-subtitle {
  margin: 0 0 32px;
  color: rgba(255, 255, 255, .6);
  font-size: 14px;
  transition: color 500ms ease;
}

.is-day .login-subtitle {
  color: rgba(23, 33, 43, .7);
}

.login-btn {
  width: 100%;
  height: 44px;
  border: 0;
  border-radius: 8px;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  font-size: 16px;
  pointer-events: auto;
  transition: transform 200ms ease, box-shadow 200ms ease;
}

.login-btn:hover {
  box-shadow: 0 8px 25px rgba(139, 92, 246, .4);
  transform: translateY(-2px);
}

.theme-switch {
  position: absolute;
  z-index: 2;
  top: 24px;
  right: 24px;
  width: 44px;
  height: 44px;
  padding: 0;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, .3);
  background: rgba(17, 20, 41, .28);
  font-size: 22px;
  backdrop-filter: blur(12px);
  transition: color 500ms ease, background-color 500ms ease, border-color 500ms ease, transform 250ms ease;
}

.theme-switch:hover {
  transform: rotate(20deg) scale(1.06);
}

.is-day .theme-switch {
  color: #17212b;
  border-color: rgba(23, 33, 43, .2);
  background: rgba(255, 255, 255, .58);
}

@media (max-width: 480px) {
  .login-card {
    width: calc(100vw - 48px);
    min-width: 0;
    padding: 40px 28px;
  }

  .theme-switch {
    top: 16px;
    right: 16px;
  }
}
</style>
