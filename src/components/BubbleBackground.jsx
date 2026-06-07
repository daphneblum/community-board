import { useEffect, useRef } from "react";

function BubbleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let animationId;
    let mouse = { x: -9999, y: -9999 };
    let bubbles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    class Bubble {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * canvas.width;

        this.y = initial
          ? Math.random() * canvas.height
          : canvas.height + Math.random() * 200 + 50;

        this.radius = Math.random() * 28 + 10;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.wobbleSpeed = Math.random() * 0.02 + 0.005;
        this.wobbleAmount = Math.random() * 1.5 + 0.5;
        this.wobbleOffset = Math.random() * Math.PI * 2;
        this.opacity = Math.random() * 0.5 + 0.25;

        // Iridescent hue shift
        this.hue = Math.random() * 360;
        this.hueSpeed = (Math.random() - 0.5) * 0.4;

        // Physics
        this.vx = this.speedX;
        this.vy = -this.speedY;
      }

      update(t) {
        // Wobble drift
        this.x += this.vx + Math.sin(t * this.wobbleSpeed + this.wobbleOffset) * this.wobbleAmount * 0.05;
        this.y += this.vy;

        // Hue shift over time
        this.hue = (this.hue + this.hueSpeed + 360) % 360;

        // Mouse repulsion
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = this.radius * 4;

        if (dist < repelRadius && dist > 0) {
          const force = (repelRadius - dist) / repelRadius;
          const angle = Math.atan2(dy, dx);
          this.vx += Math.cos(angle) * force * 1.5;
          this.vy += Math.sin(angle) * force * 1.5;
        }

        // Dampen velocity back toward natural drift
        this.vx += (this.speedX - this.vx) * 0.03;
        this.vy += (-this.speedY - this.vy) * 0.03;

        // Reset if off screen
        if (this.y + this.radius < -50) {
          this.reset(false);
        }
      }

      draw(ctx) {
        ctx.save();

        // Outer glow
        const glow = ctx.createRadialGradient(
          this.x, this.y, this.radius * 0.1,
          this.x, this.y, this.radius * 1.4
        );
        glow.addColorStop(0, `hsla(${this.hue}, 80%, 80%, ${this.opacity * 0.3})`);
        glow.addColorStop(1, `hsla(${this.hue}, 80%, 80%, 0)`);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Bubble body — very transparent fill
        const bodyGrad = ctx.createRadialGradient(
          this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.05,
          this.x, this.y, this.radius
        );
        bodyGrad.addColorStop(0, `hsla(${(this.hue + 40) % 360}, 100%, 95%, ${this.opacity * 1.2})`);
        bodyGrad.addColorStop(0.5, `hsla(${this.hue}, 70%, 75%, ${this.opacity * 0.4})`);
        bodyGrad.addColorStop(1, `hsla(${(this.hue + 180) % 360}, 80%, 60%, ${this.opacity * 0.6})`);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = bodyGrad;
        ctx.fill();

        // Iridescent rim
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${(this.hue + 60) % 360}, 90%, 85%, ${this.opacity * 2})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Specular highlight
        const highlightX = this.x - this.radius * 0.35;
        const highlightY = this.y - this.radius * 0.35;
        const highlightR = this.radius * 0.25;
        const highlight = ctx.createRadialGradient(
          highlightX, highlightY, 0,
          highlightX, highlightY, highlightR
        );
        highlight.addColorStop(0, `rgba(255, 255, 255, ${this.opacity * 3})`);
        highlight.addColorStop(1, `rgba(255, 255, 255, 0)`);
        ctx.beginPath();
        ctx.arc(highlightX, highlightY, highlightR, 0, Math.PI * 2);
        ctx.fillStyle = highlight;
        ctx.fill();

        ctx.restore();
      }
    }

    const initBubbles = () => {
      bubbles = [];
      const count = Math.floor((canvas.width * canvas.height) / 35000);
      for (let i = 0; i < Math.min(count, 60); i++) {
        bubbles.push(new Bubble());
      }
    };

    let t = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t++;

      for (const bubble of bubbles) {
        bubble.update(t);
        bubble.draw(ctx);
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    initBubbles();
    animate();

    window.addEventListener("resize", () => { resize(); initBubbles(); });
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: -1,
      }}
    />
  );
}

export default BubbleBackground;