import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

interface Bullet extends GameObject {
  active: boolean;
}

interface Enemy extends GameObject {
  active: boolean;
  hp: number;
}

const SpaceShooter = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef<number>();
  
  const playerRef = useRef({ x: 0, y: 0, width: 40, height: 40, speed: 5 });
  const bulletsRef = useRef<Bullet[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const lastEnemySpawnRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      if (e.key === ' ') {
        e.preventDefault();
        shoot();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const shoot = () => {
    const player = playerRef.current;
    bulletsRef.current.push({
      x: player.x + player.width / 2 - 2,
      y: player.y,
      width: 4,
      height: 15,
      speed: 8,
      active: true
    });
  };

  const spawnEnemy = (canvas: HTMLCanvasElement) => {
    enemiesRef.current.push({
      x: Math.random() * (canvas.width - 40),
      y: -40,
      width: 40,
      height: 40,
      speed: 2 + Math.random() * 2,
      active: true,
      hp: 1
    });
  };

  const checkCollision = (obj1: GameObject, obj2: GameObject) => {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    );
  };

  const startGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = Math.min(800, window.innerWidth - 40);
    canvas.height = 600;

    playerRef.current = {
      x: canvas.width / 2 - 20,
      y: canvas.height - 80,
      width: 40,
      height: 40,
      speed: 5
    };

    bulletsRef.current = [];
    enemiesRef.current = [];
    lastEnemySpawnRef.current = 0;
    setScore(0);
    setGameOver(false);
    setGameStarted(true);

    const gameLoop = (timestamp: number) => {
      if (!canvas || !ctx) return;

      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
        ctx.fillRect(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          2,
          2
        );
      }

      const player = playerRef.current;

      if (keysRef.current['ArrowLeft'] || keysRef.current['a']) {
        player.x = Math.max(0, player.x - player.speed);
      }
      if (keysRef.current['ArrowRight'] || keysRef.current['d']) {
        player.x = Math.min(canvas.width - player.width, player.x + player.speed);
      }
      if (keysRef.current['ArrowUp'] || keysRef.current['w']) {
        player.y = Math.max(0, player.y - player.speed);
      }
      if (keysRef.current['ArrowDown'] || keysRef.current['s']) {
        player.y = Math.min(canvas.height - player.height, player.y + player.speed);
      }

      ctx.fillStyle = '#8B5CF6';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#8B5CF6';
      ctx.beginPath();
      ctx.moveTo(player.x + player.width / 2, player.y);
      ctx.lineTo(player.x, player.y + player.height);
      ctx.lineTo(player.x + player.width / 2, player.y + player.height - 10);
      ctx.lineTo(player.x + player.width, player.y + player.height);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      bulletsRef.current.forEach((bullet) => {
        if (!bullet.active) return;
        bullet.y -= bullet.speed;

        if (bullet.y < -bullet.height) {
          bullet.active = false;
          return;
        }

        ctx.fillStyle = '#0EA5E9';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#0EA5E9';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        ctx.shadowBlur = 0;
      });

      if (timestamp - lastEnemySpawnRef.current > 1000) {
        spawnEnemy(canvas);
        lastEnemySpawnRef.current = timestamp;
      }

      enemiesRef.current.forEach((enemy) => {
        if (!enemy.active) return;
        enemy.y += enemy.speed;

        if (enemy.y > canvas.height) {
          enemy.active = false;
          return;
        }

        ctx.fillStyle = '#F97316';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#F97316';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        ctx.shadowBlur = 0;

        if (checkCollision(player, enemy)) {
          setGameOver(true);
          setGameStarted(false);
          cancelAnimationFrame(gameLoopRef.current!);
          return;
        }

        bulletsRef.current.forEach((bullet) => {
          if (!bullet.active || !enemy.active) return;

          if (checkCollision(bullet, enemy)) {
            bullet.active = false;
            enemy.active = false;
            setScore((prev) => prev + 10);

            ctx.fillStyle = '#FFD700';
            ctx.shadowBlur = 30;
            ctx.shadowColor = '#FFD700';
            ctx.beginPath();
            ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      });

      bulletsRef.current = bulletsRef.current.filter((b) => b.active);
      enemiesRef.current = enemiesRef.current.filter((e) => e.active);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px Montserrat';
      ctx.fillText(`Очки: ${score}`, 20, 40);

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Space Shooter
        </h1>
        <p className="text-gray-300">
          Управление: WASD / Стрелки | Стрельба: Пробел
        </p>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border-4 border-purple-500/50 rounded-xl shadow-2xl bg-gray-950"
        />
        
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl backdrop-blur-sm">
            <Button
              size="lg"
              onClick={startGame}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-xl px-8 py-6"
            >
              <Icon name="Play" className="mr-2 h-6 w-6" />
              Начать игру
            </Button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-xl backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-red-500 mb-4">Game Over!</h2>
            <p className="text-2xl text-white mb-6">Финальный счет: {score}</p>
            <Button
              size="lg"
              onClick={startGame}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-xl px-8 py-6"
            >
              <Icon name="RotateCcw" className="mr-2 h-6 w-6" />
              Играть снова
            </Button>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Уничтожайте врагов и набирайте очки! Не дайте им вас достать!
        </p>
      </div>
    </div>
  );
};

export default SpaceShooter;
