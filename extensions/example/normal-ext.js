(function(Scratch) {
  // 定义缓动函数库 - 各种非线性运动曲线
  const easingFunctions = {
    普通平移: t => t,
    二次方缓入: t => t*t,
    二次方缓出: t => t*(2-t),
    二次方缓入缓出: t => t<.5 ? 2*t*t : -1+(4-2*t)*t,
    三次方缓入: t => t*t*t,
    三次方缓出: t => (--t)*t*t+1,
    三次方缓入缓出: t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
    四次方缓入: t => t*t*t*t,
    四次方缓出: t => 1-(--t)*t*t*t,
    四次方缓入缓出: t => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
    五次方缓入: t => t*t*t*t*t,
    五次方缓出: t => 1+(--t)*t*t*t*t,
    五次方缓入缓出: t => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t,
    正弦缓入: t => 1-Math.cos(t * Math.PI/2),
    正弦缓出: t => Math.sin(t * Math.PI/2),
    正弦缓入缓出: t => -(Math.cos(Math.PI*t) - 1)/2,
    指数缓入: t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
    指数缓出: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    指数缓入缓出: t => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      if ((t *= 2) < 1) return 0.5 * Math.pow(2, 10 * (t - 1));
      return 0.5 * (2 - Math.pow(2, -10 * (t - 1)));
    },
    圆形缓入: t => 1 - Math.sqrt(1 - t * t),
    圆形缓出: t => Math.sqrt(1 - (t - 1) * (t - 1)),
    圆形缓入缓出: t => {
      if ((t *= 2) < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1);
      return 0.5 * (Math.sqrt(1 - (t - 2) * (t - 2)) + 1);
    }
  };

  
  const EASING_OPTIONS = Object.keys(easingFunctions).map(key => ({
    value: key,
    text: key
  }));

  
  class NonlinearMotion {
    constructor() {
      this.currentTargets = new Map(); 
    }

    
    getInfo() {
      return {
        id: 'nonlinearMotion',
        name: '非线性运动pro ',
        blockIconURI: '', 
        blocks: [
          {
            opcode: 'moveToNonlinear',
            blockType: Scratch.BlockType.COMMAND,
            text: '从当前位置非线性[EASING]移动到 x:[X] y:[Y]，持续时间[DURATION]秒，大小[SCALE]%，方向[ROTATION]度',
            arguments: {
              EASING: {
                type: Scratch.ArgumentType.STRING,
                menu: 'easingMenu',
                defaultValue: '二次方缓入缓出'
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              DURATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              SCALE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              ROTATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'circleMotion',
            blockType: Scratch.BlockType.COMMAND,
            text: '非线性[EASING]绕圈，圆心 x:[CENTER_X] y:[CENTER_Y]，半径[RADIUS]，持续时间[DURATION]秒，大小[SCALE]%，方向[ROTATION]度',
            arguments: {
              EASING: {
                type: Scratch.ArgumentType.STRING,
                menu: 'easingMenu',
                defaultValue: '二次方缓入缓出'
              },
              CENTER_X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              CENTER_Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              RADIUS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50
              },
              DURATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2
              },
              SCALE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              ROTATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'ellipseMotion',
            blockType: Scratch.BlockType.COMMAND,
            text: '非线性[EASING]沿椭圆运动，中心 x:[CENTER_X] y:[CENTER_Y]，横向半径[X_RADIUS]，纵向半径[Y_RADIUS]，持续时间[DURATION]秒，大小[SCALE]%，方向[ROTATION]度',
            arguments: {
              EASING: {
                type: Scratch.ArgumentType.STRING,
                menu: 'easingMenu',
                defaultValue: '二次方缓入缓出'
              },
              CENTER_X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              CENTER_Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              X_RADIUS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 80
              },
              Y_RADIUS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50
              },
              DURATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3
              },
              SCALE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              ROTATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'rectangleMotion',
            blockType: Scratch.BlockType.COMMAND,
            text: '非线性[EASING]沿矩形运动，左上角 x:[X] y:[Y]，宽[WIDTH]，高[HEIGHT]，持续时间[DURATION]秒，大小[SCALE]%，方向[ROTATION]度',
            arguments: {
              EASING: {
                type: Scratch.ArgumentType.STRING,
                menu: 'easingMenu',
                defaultValue: '二次方缓入缓出'
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: -50
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: -50
              },
              WIDTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              HEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              DURATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3
              },
              SCALE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              ROTATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'figure8Motion',
            blockType: Scratch.BlockType.COMMAND,
            text: '非线性[EASING]沿8字形运动，中心 x:[CENTER_X] y:[CENTER_Y]，横向半径[X_RADIUS]，纵向半径[Y_RADIUS]，持续时间[DURATION]秒，大小[SCALE]%，方向[ROTATION]度',
            arguments: {
              EASING: {
                type: Scratch.ArgumentType.STRING,
                menu: 'easingMenu',
                defaultValue: '二次方缓入缓出'
              },
              CENTER_X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              CENTER_Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              X_RADIUS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 80
              },
              Y_RADIUS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50
              },
              DURATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3
              },
              SCALE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              ROTATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'spiralMotion',
            blockType: Scratch.BlockType.COMMAND,
            text: '非线性[EASING]沿螺旋运动，中心 x:[CENTER_X] y:[CENTER_Y]，初始半径[START_RADIUS]，最终半径[END_RADIUS]，圈数[TURNS]，持续时间[DURATION]秒，大小[SCALE]%，方向[ROTATION]度',
            arguments: {
              EASING: {
                type: Scratch.ArgumentType.STRING,
                menu: 'easingMenu',
                defaultValue: '二次方缓入缓出'
              },
              CENTER_X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              CENTER_Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              START_RADIUS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 80
              },
              END_RADIUS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              },
              TURNS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3
              },
              DURATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 4
              },
              SCALE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              ROTATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'polygonMotion',
            blockType: Scratch.BlockType.COMMAND,
            text: '非线性[EASING]沿[POINTS]边形运动，中心 x:[CENTER_X] y:[CENTER_Y]，半径[RADIUS]，持续时间[DURATION]秒，大小[SCALE]%，方向[ROTATION]度',
            arguments: {
              EASING: {
                type: Scratch.ArgumentType.STRING,
                menu: 'easingMenu',
                defaultValue: '二次方缓入缓出'
              },
              CENTER_X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              CENTER_Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              POINTS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 5,
                min: 3,
                max: 12
              },
              RADIUS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 60
              },
              DURATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 4
              },
              SCALE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              ROTATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'bezierMotion',
            blockType: Scratch.BlockType.COMMAND,
            text: '非线性[EASING]沿贝塞尔曲线运动，起点 x1:[X1] y1:[Y1]，控制点 x2:[X2] y2:[Y2]，控制点 x3:[X3] y3:[Y3]，终点 x4:[X4] y4:[Y4]，持续时间[DURATION]秒，大小[SCALE]%，方向[ROTATION]度',
            arguments: {
              EASING: {
                type: Scratch.ArgumentType.STRING,
                menu: 'easingMenu',
                defaultValue: '二次方缓入缓出'
              },
              X1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              X2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50
              },
              Y2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: -50
              },
              X3: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              Y3: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50
              },
              X4: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 150
              },
              Y4: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              DURATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3
              },
              SCALE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              ROTATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'pendulumMotion',
            blockType: Scratch.BlockType.COMMAND,
            text: '非线性[EASING]钟摆运动，支点 x:[PIVOT_X] y:[PIVOT_Y]，长度[LENGTH]，角度[ANGLE]，持续时间[DURATION]秒，大小[SCALE]%，方向[ROTATION]度',
            arguments: {
              EASING: {
                type: Scratch.ArgumentType.STRING,
                menu: 'easingMenu',
                defaultValue: '二次方缓入缓出'
              },
              PIVOT_X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              PIVOT_Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: -50
              },
              LENGTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              ANGLE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 60
              },
              DURATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2
              },
              SCALE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              ROTATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'springMotion',
            blockType: Scratch.BlockType.COMMAND,
            text: '非线性[EASING]弹簧运动，起点 x:[START_X] y:[START_Y]，终点 x:[END_X] y:[END_Y]，弹性[BOUNCE]，持续时间[DURATION]秒，大小[SCALE]%，方向[ROTATION]度',
            arguments: {
              EASING: {
                type: Scratch.ArgumentType.STRING,
                menu: 'easingMenu',
                defaultValue: '二次方缓入缓出'
              },
              START_X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              START_Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              END_X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              END_Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              BOUNCE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.5,
                min: 0,
                max: 1
              },
              DURATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2
              },
              SCALE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              ROTATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'pauseNonlinearMotion',
            blockType: Scratch.BlockType.COMMAND,
            text: '暂停非线性运动'
          },
          {
            opcode: 'resumeNonlinearMotion',
            blockType: Scratch.BlockType.COMMAND,
            text: '恢复非线性运动'
          },
          {
            opcode: 'isMovingNonlinear',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '正在进行非线性运动?'
          }
        ],
        menus: {
          easingMenu: {
            items: EASING_OPTIONS
          }
        }
      };
    }

    // 从当前位置非线性运动到指定坐标
    moveToNonlinear(args, util) {
      return this.runMotion({
        type: 'moveTo',
        args,
        util,
        calculatePosition: (target, progress, easeProgress) => {
          return {
            x: target.startX + (target.endX - target.startX) * easeProgress,
            y: target.startY + (target.endY - target.startY) * easeProgress
          };
        },
        scale: Number(args.SCALE),
        rotation: Number(args.ROTATION)
      });
    }

    // 非线性圆形运动
    circleMotion(args, util) {
      return this.runMotion({
        type: 'circle',
        args,
        util,
        calculatePosition: (target, progress, easeProgress) => {
          const angle = easeProgress * Math.PI * 2;
          const x = target.centerX + Math.cos(angle) * target.radius;
          const y = target.centerY + Math.sin(angle) * target.radius;
          return { x, y };
        },
        scale: Number(args.SCALE),
        rotation: Number(args.ROTATION)
      });
    }

    // 非线性椭圆运动
    ellipseMotion(args, util) {
      return this.runMotion({
        type: 'ellipse',
        args,
        util,
        calculatePosition: (target, progress, easeProgress) => {
          const angle = easeProgress * Math.PI * 2;
          const x = target.centerX + Math.cos(angle) * target.xRadius;
          const y = target.centerY + Math.sin(angle) * target.yRadius;
          return { x, y };
        },
        scale: Number(args.SCALE),
        rotation: Number(args.ROTATION)
      });
    }

    // 非线性矩形运动
    rectangleMotion(args, util) {
      return this.runMotion({
        type: 'rectangle',
        args,
        util,
        calculatePosition: (target, progress, easeProgress) => {
          const pathProgress = easeProgress * 4;
          const segment = Math.floor(pathProgress);
          const segmentProgress = pathProgress - segment;
          
          let x, y;
          
          switch (segment) {
            case 0: // 上边
              x = target.x + segmentProgress * target.width;
              y = target.y;
              break;
            case 1: // 右边
              x = target.x + target.width;
              y = target.y + segmentProgress * target.height;
              break;
            case 2: // 下边
              x = target.x + target.width - segmentProgress * target.width;
              y = target.y + target.height;
              break;
            case 3: // 左边
              x = target.x;
              y = target.y + target.height - segmentProgress * target.height;
              break;
            default:
              x = target.x;
              y = target.y;
          }
          
          return { x, y };
        },
        scale: Number(args.SCALE),
        rotation: Number(args.ROTATION)
      });
    }

    // 非线性8字形运动
    figure8Motion(args, util) {
      return this.runMotion({
        type: 'figure8',
        args,
        util,
        calculatePosition: (target, progress, easeProgress) => {
          const angle = easeProgress * Math.PI * 2;
          const x = target.centerX + Math.cos(angle) * target.xRadius;
          const y = target.centerY + Math.sin(angle * 2) * target.yRadius;
          return { x, y };
        },
        scale: Number(args.SCALE),
        rotation: Number(args.ROTATION)
      });
    }

    // 非线性螺旋运动
    spiralMotion(args, util) {
      return this.runMotion({
        type: 'spiral',
        args,
        util,
        calculatePosition: (target, progress, easeProgress) => {
          const angle = easeProgress * Math.PI * 2 * target.turns;
          const radius = target.startRadius + (target.endRadius - target.startRadius) * easeProgress;
          const x = target.centerX + Math.cos(angle) * radius;
          const y = target.centerY + Math.sin(angle) * radius;
          return { x, y };
        },
        scale: Number(args.SCALE),
        rotation: Number(args.ROTATION)
      });
    }

    // 非线性多边形运动
    polygonMotion(args, util) {
      return this.runMotion({
        type: 'polygon',
        args,
        util,
        calculatePosition: (target, progress, easeProgress) => {
          const pathProgress = easeProgress * target.points;
          const segment = Math.floor(pathProgress) % target.points;
          const segmentProgress = pathProgress - Math.floor(pathProgress);
          
          // 计算多边形顶点
          const points = [];
          for (let i = 0; i < target.points; i++) {
            const angle = i * Math.PI * 2 / target.points - Math.PI / 2;
            points.push({
              x: target.centerX + Math.cos(angle) * target.radius,
              y: target.centerY + Math.sin(angle) * target.radius
            });
          }
          
          // 插值计算当前位置
          const startPoint = points[segment];
          const endPoint = points[(segment + 1) % target.points];
          
          const x = startPoint.x + (endPoint.x - startPoint.x) * segmentProgress;
          const y = startPoint.y + (endPoint.y - startPoint.y) * segmentProgress;
          
          return { x, y };
        },
        scale: Number(args.SCALE),
        rotation: Number(args.ROTATION)
      });
    }

    // 非线性贝塞尔曲线运动
    bezierMotion(args, util) {
      return this.runMotion({
        type: 'bezier',
        args,
        util,
        calculatePosition: (target, progress, easeProgress) => {
          // 贝塞尔曲线计算
          const x = Math.pow(1 - easeProgress, 3) * target.x1 +
                    3 * Math.pow(1 - easeProgress, 2) * easeProgress * target.x2 +
                    3 * (1 - easeProgress) * Math.pow(easeProgress, 2) * target.x3 +
                    Math.pow(easeProgress, 3) * target.x4;
          
          const y = Math.pow(1 - easeProgress, 3) * target.y1 +
                    3 * Math.pow(1 - easeProgress, 2) * easeProgress * target.y2 +
                    3 * (1 - easeProgress) * Math.pow(easeProgress, 2) * target.y3 +
                    Math.pow(easeProgress, 3) * target.y4;
          
          return { x, y };
        },
        scale: Number(args.SCALE),
        rotation: Number(args.ROTATION)
      });
    }

    // 非线性钟摆运动（修复自动回位问题）
    pendulumMotion(args, util) {
      return this.runMotion({
        type: 'pendulum',
        args,
        util,
        calculatePosition: (target, progress, easeProgress) => {
          // 钟摆角度随时间变化，使用完整的2π周期
          const angle = target.angle * Math.sin(easeProgress * Math.PI * 2) * Math.PI / 180;
          
          // 计算钟摆末端位置
          const x = target.pivotX + Math.sin(angle) * target.length;
          const y = target.pivotY + Math.cos(angle) * target.length;
          
          return { x, y };
        },
        scale: Number(args.SCALE),
        rotation: Number(args.ROTATION)
      });
    }

    // 非线性弹簧运动
    springMotion(args, util) {
      return this.runMotion({
        type: 'spring',
        args,
        util,
        calculatePosition: (target, progress, easeProgress) => {
          // 弹簧振荡效果
          const bounce = target.bounce;
          const x = target.startX + (target.endX - target.startX) * (easeProgress + bounce * Math.sin(easeProgress * Math.PI * 2));
          const y = target.startY + (target.endY - target.startY) * (easeProgress + bounce * Math.sin(easeProgress * Math.PI * 2));
          
          return { x, y };
        },
        scale: Number(args.SCALE),
        rotation: Number(args.ROTATION)
      });
    }

    // 暂停非线性运动
    pauseNonlinearMotion(args, util) {
      const targetId = util.target.id;
      const target = this.currentTargets.get(targetId);
      
      if (target) {
        target.paused = true;
      }
    }

    // 恢复非线性运动
    resumeNonlinearMotion(args, util) {
      const targetId = util.target.id;
      const target = this.currentTargets.get(targetId);
      
      if (target && target.paused) {
        target.paused = false;
        target.lastUpdated = Date.now();
      }
    }

    // 检查是否正在进行非线性运动
    isMovingNonlinear(args, util) {
      const targetId = util.target.id;
      const target = this.currentTargets.get(targetId);
      return !!(target && !target.paused);
    }

    // 统一的运动处理函数
    runMotion(options) {
      const { type, args, util, calculatePosition, scale, rotation } = options;
      const targetId = util.target.id;
      const easing = args.EASING;
      const duration = Math.max(0.1, Number(args.DURATION));
      
      // 检查缓动函数是否存在
      if (!easingFunctions[easing]) {
        console.error(`未知的缓动函数: ${easing}`);
        return;
      }
      
      // 获取初始大小和方向
      const startSize = util.target.size;
      const startDirection = util.target.direction;
      
      // 创建运动目标
      const target = {
        type,
        easing,
        duration,
        startTime: Date.now(),
        paused: false,
        lastUpdated: Date.now(),
        progress: 0,
        scale: scale / 100,
        rotation: rotation,
        startSize: startSize,
        startDirection: startDirection
      };
      
      // 根据不同类型设置特定属性
      switch (type) {
        case 'moveTo':
          target.startX = util.target.x;
          target.startY = util.target.y;
          target.endX = Number(args.X);
          target.endY = Number(args.Y);
          break;
        case 'circle':
          target.centerX = Number(args.CENTER_X);
          target.centerY = Number(args.CENTER_Y);
          target.radius = Math.max(1, Number(args.RADIUS));
          break;
        case 'ellipse':
          target.centerX = Number(args.CENTER_X);
          target.centerY = Number(args.CENTER_Y);
          target.xRadius = Math.max(1, Number(args.X_RADIUS));
          target.yRadius = Math.max(1, Number(args.Y_RADIUS));
          break;
        case 'rectangle':
          target.x = Number(args.X);
          target.y = Number(args.Y);
          target.width = Math.max(1, Number(args.WIDTH));
          target.height = Math.max(1, Number(args.HEIGHT));
          break;
        case 'figure8':
          target.centerX = Number(args.CENTER_X);
          target.centerY = Number(args.CENTER_Y);
          target.xRadius = Math.max(1, Number(args.X_RADIUS));
          target.yRadius = Math.max(1, Number(args.Y_RADIUS));
          break;
        case 'spiral':
          target.centerX = Number(args.CENTER_X);
          target.centerY = Number(args.CENTER_Y);
          target.startRadius = Math.max(1, Number(args.START_RADIUS));
          target.endRadius = Math.max(1, Number(args.END_RADIUS));
          target.turns = Math.max(1, Number(args.TURNS));
          break;
        case 'polygon':
          target.centerX = Number(args.CENTER_X);
          target.centerY = Number(args.CENTER_Y);
          target.points = Math.max(3, Math.min(12, Math.round(Number(args.POINTS))));
          target.radius = Math.max(1, Number(args.RADIUS));
          break;
        case 'bezier':
          target.x1 = Number(args.X1);
          target.y1 = Number(args.Y1);
          target.x2 = Number(args.X2);
          target.y2 = Number(args.Y2);
          target.x3 = Number(args.X3);
          target.y3 = Number(args.Y3);
          target.x4 = Number(args.X4);
          target.y4 = Number(args.Y4);
          break;
        case 'pendulum':
          target.pivotX = Number(args.PIVOT_X);
          target.pivotY = Number(args.PIVOT_Y);
          target.length = Math.max(1, Number(args.LENGTH));
          target.angle = Number(args.ANGLE);
          break;
        case 'spring':
          target.startX = Number(args.START_X);
          target.startY = Number(args.START_Y);
          target.endX = Number(args.END_X);
          target.endY = Number(args.END_Y);
          target.bounce = Math.max(0, Math.min(1, Number(args.BOUNCE)));
          break;
      }
      
      // 存储运动信息
      this.currentTargets.set(targetId, target);
      
      
      return new Promise(resolve => {
        
        const { x, y } = calculatePosition(target, 0, 0);
        util.target.setXY(x, y);
        
        const animate = () => {
          const now = Date.now();
          const target = this.currentTargets.get(targetId);
          
          if (!target) {
            resolve();
            return;
          }
          
          if (target.paused) {
            requestAnimationFrame(animate);
            return;
          }
          
          // 计算进度
          const elapsed = now - target.startTime;
          let progress = Math.min(elapsed / (target.duration * 1000), 1);
          target.progress = progress;
          
          // 应用缓动函数
          const easeProgress = easingFunctions[target.easing](progress);
          
          // 计算新位置
          const { x, y } = calculatePosition(target, progress, easeProgress);
          
          // 平滑更新大小和方向
          const currentSize = target.startSize + (target.scale * 100 - target.startSize) * easeProgress;
          const currentDirection = target.startDirection + (target.rotation - target.startDirection) * easeProgress;
          
          // 应用变化
          util.target.setXY(x, y);
          util.target.setSize(currentSize);
          util.target.setDirection(currentDirection);
          
          // 继续动画或结束
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            // 移除已完成的运动
            this.currentTargets.delete(targetId);
            resolve();
          }
        };
        
        // 开始动画
        requestAnimationFrame(animate);
      });
    }
  }

  // 注册扩展
  Scratch.extensions.register(new NonlinearMotion());
})(Scratch);
