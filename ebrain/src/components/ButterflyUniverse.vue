<template>
  <canvas id="universe"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

onMounted(() => {
  const style = document.createElement('style')
  style.innerHTML = `
    #universe {
      display: block;
      position: fixed;
      margin: 0;
      padding: 0;
      border: 0;
      outline: 0;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    }
  `
  document.head.appendChild(style)

  const canvas = document.getElementById('universe') as HTMLCanvasElement

  let width = window.innerWidth
  let height = window.innerHeight
  let particlesCount = 0.216 * width | 0
  let ctx: CanvasRenderingContext2D | null = null
  const speed = 0.05

  const giantColor = "0,191,255"    // 深天蓝
  const starColor = "135,206,250"   // 浅蓝
  const cometColor = "255,255,255"  // 白色



  const particles: Particle[] = []

  interface Particle {
    x: number
    y: number
    r: number
    dx: number
    dy: number
    giant: boolean
    comet: boolean
    fadingIn: boolean
    fadingOut: boolean | null
    opacity: number
    opacityTresh: number
    do: number
    reset(): void
    fadeIn(): void
    fadeOut(): void
    move(): void
    draw(): void
  }

  function random(min: number, max: number): number {
    return Math.random() * (max - min) + min
  }

  function isChance(percent: number): boolean {
    return Math.random() * 1000 < 10 * percent
  }

  function resizeCanvas() {
    width = window.innerWidth
    height = window.innerHeight
    particlesCount = (0.216 * width) | 0
    if (canvas) {
      canvas.width = width
      canvas.height = height
    }
  }

  function createParticle(): Particle {
    return {
      x: random(0, width - 10),
      y: random(0, height),
      r: random(1.1, 2.6),
      dx: random(speed, 6 * speed) + 2 * speed,
      dy: -random(speed, 6 * speed),
      giant: isChance(3),
      comet: false,
      fadingIn: true,
      fadingOut: null,
      opacity: 0,
      opacityTresh: random(0.2, 0.6),
      do: random(0.0005, 0.002),
      reset() {
        this.giant = isChance(3)
        this.comet = !this.giant && isChance(10)
        this.x = random(0, width - 10)
        this.y = random(0, height)
        this.r = random(1.1, 2.6)
        this.dx = random(speed, 6 * speed) + (this.comet ? random(50, 120) * speed : 0) + 2 * speed
        this.dy = -random(speed, 6 * speed) - (this.comet ? random(50, 120) * speed : 0)
        this.fadingOut = null
        this.fadingIn = true
        this.opacity = 0
        this.opacityTresh = random(0.2, 0.6)
        this.do = random(0.0005, 0.002)
      },
      fadeIn() {
        if (this.fadingIn) {
          this.fadingIn = !(this.opacity > this.opacityTresh)
          this.opacity += this.do
        }
      },
      fadeOut() {
        if (this.fadingOut) {
          this.fadingOut = !(this.opacity < 0)
          this.opacity -= this.do / 2
          if (this.x > width || this.y < 0) {
            this.fadingOut = false
            this.reset()
          }
        }
      },
      move() {
        this.x += this.dx
        this.y += this.dy
        if (!this.fadingOut && (this.x > width - width / 4 || this.y < 0)) {
          this.fadingOut = true
        }
      },
      draw() {
        if (!ctx) return
        ctx.beginPath()
        if (this.giant) {
          ctx.fillStyle = `rgba(${giantColor},${this.opacity})`
          ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI)
        } else if (this.comet) {
          ctx.fillStyle = `rgba(${cometColor},${this.opacity})`
          ctx.arc(this.x, this.y, 1.5, 0, 2 * Math.PI)
          for (let t = 0; t < 30; t++) {
            ctx.fillStyle = `rgba(${cometColor},${this.opacity - this.opacity / 20 * t})`
            ctx.fillRect(this.x - this.dx / 4 * t, this.y - this.dy / 4 * t - 2, 2, 2)
          }
        } else {
          ctx.fillStyle = `rgba(${starColor},${this.opacity})`
          ctx.fillRect(this.x, this.y, this.r, this.r)
        }
        ctx.closePath()
        ctx.fill()
      },
    }
  }

  function animate() {
    if (!ctx) return
    ctx.clearRect(0, 0, width, height)
    particles.forEach(p => {
      p.move()
      p.fadeIn()
      p.fadeOut()
      p.draw()
    })
    window.requestAnimationFrame(animate)
  }

  if (canvas) {
    ctx = canvas.getContext('2d')
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    for (let j = 0; j < particlesCount; j++) {
      particles.push(createParticle())
    }

    animate()
  }
})
</script>
