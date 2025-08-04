import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import styles from '../styles/SnakeGame.module.css';

// 游戏配置
const GRID_SIZE = 20;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };

// 方向枚举
enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

// 位置接口
interface Position {
  x: number;
  y: number;
}

// 游戏状态枚举
enum GameStatus {
  WAITING = 'WAITING',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>(Direction.RIGHT);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.WAITING);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);

  // 生成随机食物位置
  const generateFood = useCallback((): Position => {
    return {
      x: Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE)),
      y: Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE))
    };
  }, []);

  // 检查碰撞
  const checkCollision = useCallback((head: Position, snakeBody: Position[]): boolean => {
    // 检查墙壁碰撞
    if (
      head.x < 0 ||
      head.x >= CANVAS_WIDTH / GRID_SIZE ||
      head.y < 0 ||
      head.y >= CANVAS_HEIGHT / GRID_SIZE
    ) {
      return true;
    }

    // 检查蛇身碰撞
    for (let segment of snakeBody) {
      if (head.x === segment.x && head.y === segment.y) {
        return true;
      }
    }

    return false;
  }, []);

  // 移动蛇
  const moveSnake = useCallback(() => {
    if (gameStatus !== GameStatus.PLAYING) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };

      // 根据方向移动蛇头
      switch (direction) {
        case Direction.UP:
          head.y -= 1;
          break;
        case Direction.DOWN:
          head.y += 1;
          break;
        case Direction.LEFT:
          head.x -= 1;
          break;
        case Direction.RIGHT:
          head.x += 1;
          break;
      }

      // 检查碰撞
      if (checkCollision(head, newSnake)) {
        setGameStatus(GameStatus.GAME_OVER);
        return currentSnake;
      }

      newSnake.unshift(head);

      // 检查是否吃到食物
      if (head.x === food.x && head.y === food.y) {
        setScore(prevScore => {
          const newScore = prevScore + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snakeHighScore', newScore.toString());
          }
          return newScore;
        });
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameStatus, checkCollision, generateFood, highScore]);

  // 键盘控制
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (gameStatus === GameStatus.WAITING) {
      setGameStatus(GameStatus.PLAYING);
    }

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        setDirection(prevDirection => 
          prevDirection !== Direction.DOWN ? Direction.UP : prevDirection
        );
        break;
      case 'ArrowDown':
        event.preventDefault();
        setDirection(prevDirection => 
          prevDirection !== Direction.UP ? Direction.DOWN : prevDirection
        );
        break;
      case 'ArrowLeft':
        event.preventDefault();
        setDirection(prevDirection => 
          prevDirection !== Direction.RIGHT ? Direction.LEFT : prevDirection
        );
        break;
      case 'ArrowRight':
        event.preventDefault();
        setDirection(prevDirection => 
          prevDirection !== Direction.LEFT ? Direction.RIGHT : prevDirection
        );
        break;
      case ' ':
        event.preventDefault();
        if (gameStatus === GameStatus.GAME_OVER) {
          resetGame();
        } else if (gameStatus === GameStatus.WAITING) {
          setGameStatus(GameStatus.PLAYING);
        }
        break;
    }
  }, [gameStatus]);

  // 重置游戏
  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(Direction.RIGHT);
    setGameStatus(GameStatus.WAITING);
    setScore(0);
  };

  // 游戏循环
  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  // 键盘事件监听
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // 加载最高分
  useEffect(() => {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  return (
    <>
      <Head>
        <title>贪吃蛇游戏 - Snake Game</title>
        <meta name="description" content="经典贪吃蛇游戏，使用方向键控制蛇的移动，吃到食物获得分数" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.container}>
        <div className={styles.gameArea}>
          <h1 className={styles.title}>贪吃蛇游戏</h1>
          
          {/* 游戏信息 */}
          <div className={styles.gameInfo}>
            <div className={styles.scoreBoard}>
              <div className={styles.scoreItem}>
                <span className={styles.scoreLabel}>得分:</span>
                <span className={styles.scoreValue}>{score}</span>
              </div>
              <div className={styles.scoreItem}>
                <span className={styles.scoreLabel}>最高分:</span>
                <span className={styles.scoreValue}>{highScore}</span>
              </div>
            </div>

            {/* 游戏状态提示 */}
            <div className={styles.gameStatus}>
              {gameStatus === GameStatus.WAITING && (
                <p className={styles.statusText}>按方向键开始游戏</p>
              )}
              {gameStatus === GameStatus.PLAYING && (
                <p className={styles.statusText}>使用方向键控制蛇的移动</p>
              )}
              {gameStatus === GameStatus.GAME_OVER && (
                <div className={styles.gameOverStatus}>
                  <p className={styles.gameOverText}>游戏结束!</p>
                  <p className={styles.statusText}>按空格键重新开始</p>
                </div>
              )}
            </div>
          </div>

          {/* 游戏画板 */}
          <div className={styles.gameBoard}>
            <div 
              className={styles.canvas}
              style={{
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                gridTemplateColumns: `repeat(${CANVAS_WIDTH / GRID_SIZE}, 1fr)`,
                gridTemplateRows: `repeat(${CANVAS_HEIGHT / GRID_SIZE}, 1fr)`
              }}
            >
              {/* 渲染游戏网格 */}
              {Array.from({ length: (CANVAS_WIDTH / GRID_SIZE) * (CANVAS_HEIGHT / GRID_SIZE) }).map((_, index) => {
                const x = index % (CANVAS_WIDTH / GRID_SIZE);
                const y = Math.floor(index / (CANVAS_WIDTH / GRID_SIZE));
                
                // 检查是否是蛇身
                const isSnakeSegment = snake.some(segment => segment.x === x && segment.y === y);
                const isSnakeHead = snake[0] && snake[0].x === x && snake[0].y === y;
                const isFood = food.x === x && food.y === y;

                let cellClass = styles.cell;
                
                if (isSnakeHead) {
                  cellClass += ` ${styles.snakeHead}`;
                } else if (isSnakeSegment) {
                  cellClass += ` ${styles.snakeBody}`;
                } else if (isFood) {
                  cellClass += ` ${styles.food}`;
                }

                return (
                  <div
                    key={index}
                    className={cellClass}
                  />
                );
              })}
            </div>
          </div>

          {/* 控制按钮 */}
          <div className={styles.controls}>
            <button 
              className={styles.controlBtn}
              onClick={resetGame}
            >
              重新开始
            </button>
            {gameStatus === GameStatus.WAITING && (
              <button 
                className={styles.controlBtn}
                onClick={() => setGameStatus(GameStatus.PLAYING)}
              >
                开始游戏
              </button>
            )}
          </div>

          {/* 游戏说明 */}
          <div className={styles.instructions}>
            <h3>游戏说明</h3>
            <ul>
              <li>使用方向键 ↑↓←→ 控制蛇的移动方向</li>
              <li>吃到红色食物可以获得10分，蛇身会变长</li>
              <li>撞到墙壁或自己的身体游戏结束</li>
              <li>按空格键可以重新开始游戏</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default SnakeGame;