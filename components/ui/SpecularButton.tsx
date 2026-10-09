'use client'

import {
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl'
import './SpecularButton.css'

const PAD = 20

const VERT = `#version 300 es
in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uShineSize;
uniform float uShineFade;
uniform float uThickness;
uniform float uBaseWidth;

out vec4 fragColor;

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float shapeSDF(vec2 p) {
  return sdRoundedRect(p, uHalfSize, uRadius);
}

float gaussianLine(float d, float sigma) {
  float x = d / (sigma + 1e-6);
  float k = mix(1.0, 1.6, smoothstep(0.0, 1.5, x));
  return exp(-k * x * x);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = shapeSDF(p);
  vec2 L = vec2(cos(uAngle), sin(uAngle));

  float base =
    (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * 0.45;

  vec2 nEll =
    normalize(p / (uHalfSize * uHalfSize) + 1e-6);

  float phi =
    acos(clamp(abs(dot(nEll, L)), 0.0, 1.0));

  float rim =
    1.0 - smoothstep(
      uShineSize - uShineFade,
      uShineSize + uShineFade + 1e-4,
      phi
    );

  float line = gaussianLine(d, uThickness);

  float edgeClamp =
    1.0 - smoothstep(
      0.5 * uPx,
      3.0 * uPx,
      abs(d)
    );

  float hi =
    line * rim * edgeClamp * uIntensity;

  vec3 col =
    uBaseColor * base +
    uLineColor * hi;

  float a =
    clamp(base + hi, 0.0, 1.0);

  fragColor = vec4(col, a);
}
`

type SpecularButtonProps = {
  children?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  radius?: number
  tint?: string
  tintOpacity?: number
  blur?: number
  textColor?: string
  lineColor?: string
  baseColor?: string
  intensity?: number
  shineSize?: number
  shineFade?: number
  thickness?: number
  speed?: number
  followMouse?: boolean
  proximity?: number
  autoAnimate?: boolean
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: string
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
}

const SpecularButton = ({
  children = 'Get Started',
  size = 'lg',
  radius = 18,
  tint = '#ffffff',
  tintOpacity = 0,
  blur = 0,
  textColor = '#f0f2ed',
  lineColor = '#42a878',
  baseColor = '#1f6b3a',
  intensity = 1,
  shineSize = 10,
  shineFade = 40,
  thickness = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
}: SpecularButtonProps) => {
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const fxRef = useRef<HTMLSpanElement | null>(null)

  const propsRef = useRef({
    radius,
    lineColor,
    baseColor,
    intensity,
    shineSize,
    shineFade,
    thickness,
    speed,
    followMouse,
    proximity,
    autoAnimate,
  })

  propsRef.current = {
    radius,
    lineColor,
    baseColor,
    intensity,
    shineSize,
    shineFade,
    thickness,
    speed,
    followMouse,
    proximity,
    autoAnimate,
  }

  useEffect(() => {
    const btn = btnRef.current
    const fx = fxRef.current

    if (!btn || !fx) return

    const dpr = window.devicePixelRatio || 1

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      dpr,
    })

    const gl = renderer.gl

    gl.clearColor(0, 0, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    const geometry = new Triangle(gl)

    const lineC = new Color(lineColor)
    const baseC = new Color(baseColor)

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uCenter: { value: [0, 0] },
        uHalfSize: { value: [0, 0] },
        uRadius: { value: 0 },
        uAngle: { value: 0 },
        uPx: { value: 1 },
        uLineColor: { value: [lineC.r, lineC.g, lineC.b] },
        uBaseColor: { value: [baseC.r, baseC.g, baseC.b] },
        uIntensity: { value: intensity },
        uShineSize: { value: (shineSize * Math.PI) / 180 },
        uShineFade: { value: (shineFade * Math.PI) / 180 },
        uThickness: { value: thickness * dpr },
        uBaseWidth: { value: 2.0 * dpr },
      },
    })

    const mesh = new Mesh(gl, { geometry, program })

    fx.appendChild(gl.canvas)

    let w = 0
    let h = 0
    const sizeRef = { w: 0, h: 0 }

    const updateSize = () => {
      const rect = btn.getBoundingClientRect()
      w = rect.width + PAD * 2
      h = rect.height + PAD * 2
      sizeRef.w = rect.width
      sizeRef.h = rect.height

      renderer.setSize(w, h)
      gl.canvas.style.width = `${w}px`
      gl.canvas.style.height = `${h}px`

      program.uniforms.uCenter.value = [(w / 2) * dpr, (h / 2) * dpr]
      program.uniforms.uHalfSize.value = [
        (rect.width / 2) * dpr,
        (rect.height / 2) * dpr,
      ]
      program.uniforms.uPx.value = dpr
    }

    updateSize()

    const ro = new ResizeObserver(updateSize)
    ro.observe(btn)

    let pointerAngle: number | null = null
    let proximityT = 0

    const onPointerMove = (e: PointerEvent) => {
      const p = propsRef.current
      if (!p.followMouse) return

      const rect = btn.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)

      const radiusProximity = Math.max(rect.width, rect.height) / 2 + p.proximity

      if (dist < radiusProximity) {
        pointerAngle = Math.atan2(-dy, dx)
        proximityT = 1 - Math.min(1, dist / radiusProximity)
      } else {
        pointerAngle = null
        proximityT = 0
      }
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })

    let raf = 0
    let last = performance.now()
    let idleAngle = 0
    let angle = 0
    let bright = 0

    const update = (now: number) => {
      raf = requestAnimationFrame(update)

      const dt = Math.min((now - last) / 1000, 0.1)
      last = now

      const p = propsRef.current

      idleAngle += dt * p.speed * Math.PI * 2

      const steer =
        p.followMouse &&
        pointerAngle !== null &&
        (!p.autoAnimate || proximityT > 0)

      const target =
        steer && pointerAngle !== null ? pointerAngle : idleAngle

      const diff =
        ((target - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI

      angle += diff * (1 - Math.exp(-dt * 7))

      const brightTarget = p.autoAnimate ? 1 : proximityT

      bright += (brightTarget - bright) * (1 - Math.exp(-dt * 8))

      lineC.set(p.lineColor)
      baseC.set(p.baseColor)

      program.uniforms.uAngle.value = angle
      program.uniforms.uRadius.value =
        Math.min(p.radius, Math.min(sizeRef.w, sizeRef.h) / 2) * dpr
      program.uniforms.uLineColor.value = [lineC.r, lineC.g, lineC.b]
      program.uniforms.uBaseColor.value = [baseC.r, baseC.g, baseC.b]
      program.uniforms.uIntensity.value = p.intensity * bright
      program.uniforms.uShineSize.value = (p.shineSize * Math.PI) / 180
      program.uniforms.uShineFade.value = (p.shineFade * Math.PI) / 180
      program.uniforms.uThickness.value = p.thickness * dpr

      renderer.render({ scene: mesh })
    }

    raf = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onPointerMove)

      if (gl.canvas.parentNode === fx) {
        fx.removeChild(gl.canvas)
      }

      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [lineColor, baseColor, intensity, shineSize, shineFade, thickness])

  return (
    <button
      ref={btnRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`specular-button specular-button--${size}${
        className ? ` ${className}` : ''
      }`}
      style={
        {
          '--sb-radius': `${radius}px`,
          '--sb-tint': tint,
          '--sb-tint-opacity': tintOpacity,
          '--sb-blur': `${blur}px`,
          '--sb-text-color': textColor,
        } as CSSProperties
      }
    >
      <span
        ref={fxRef}
        className="specular-button__fx"
        aria-hidden="true"
      />
      <span className="specular-button__label">{children}</span>
    </button>
  )
}

export default SpecularButton
