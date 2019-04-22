'use strict';

phina.globalize();

const BALL_RADIUS = 10;
const BALL_INIT_POS_OFFSET = BALL_RADIUS * 10;
const BALL_SPEED = 50;
const BLOCK_WIDTH = 52;
const BLOCK_HEIGHT = 20;
const MAX_PER_LINE_X = 8;
const MAX_PER_LINE_Y = 10;
const BLOCK_NUM = MAX_PER_LINE_X * MAX_PER_LINE_Y;
const BOARD_PADDING_X = 100;
const BOARD_PADDING_Y = 100;

// MainScene クラスを定義
phina.define('MainScene', {
  superClass: 'DisplayScene',
  init: function () {
    this.superInit();
    // 背景色を指定
    this.backgroundColor = '#247BA0';

    // ボールを設置
    this.ball = Ball().addChildTo(this);
    this.ball.x = this.gridX.center();
    this.ball.y = this.gridY.width - BALL_INIT_POS_OFFSET;

    // ブロックを設置
    this.group = DisplayElement().addChildTo(this);
    const gridX = Grid(this.gridX.width - (BOARD_PADDING_X * 2), MAX_PER_LINE_X);
    const gridY = Grid((this.gridY.width / 1.3) - (BOARD_PADDING_Y * 2), MAX_PER_LINE_Y);
    (BLOCK_NUM).times(function(i) {
      const xIndex = i % MAX_PER_LINE_X;
      const yIndex = Math.floor(i / MAX_PER_LINE_X);
      const block = Block().addChildTo(this.group);
      // console.log('i:' + i);
      // console.log('xIndex:' + xIndex);
      // console.log('yIndex:' + yIndex);
      // console.log('gridX.span(xIndex):' + gridX.span(xIndex));
      // console.log('gridY.span(yIndex):' + gridY.span(yIndex));
      // console.log('--------------------');
      block.x = gridX.span(xIndex) + BOARD_PADDING_X + BLOCK_WIDTH / 2;
      block.y = gridY.span(yIndex) + BOARD_PADDING_Y + BLOCK_HEIGHT / 2;
    }, this);
    
  },

  update: function(app) {
    this.time += app.deltaTime;

    // スピードの数分, 移動と衝突判定を繰り返す
    BALL_SPEED.times(function() {
      this.ball.move();
      this.checkHit();
    }, this);

  
  },

  checkHit: function() {
    const ball = this.ball;

    // 画面外反射
    if (ball.left < 0) {
      ball.left = 0;
      ball.reflectX();
    }
    if (ball.right > this.gridX.width) {
      ball.right = this.gridX.width
      ball.reflectX();
    }
    if (ball.top < 0) {
      ball.top = 0;
      ball.reflectY();
    }
    if (ball.bottom > this.gridY.width) {
      ball.bottom = this.gridY.width
      ball.reflectY();
    }

      // ボールをの当たり判定をして取り除く
      this.group.children.some(function(block) {
        if (ball.hitTestElement(block)) {
          var dq = Vector2.sub(ball, block);
  
          if (Math.abs(dq.x) < Math.abs(dq.y)) {
            ball.reflectY();
            if (dq.y >= 0) {
              ball.top = block.bottom;
            }
            else {
              ball.bottom = block.top;
            }
          }
          else {
            ball.reflectX();
            if (dq.x >= 0) {
              ball.left = block.right;
            }
            else {
              ball.right = block.left;
            }
          }
          block.remove();
          return true;
        }
      }, this);
  },
});

/**
 * ボールを定義
 */
phina.define('Ball', {
  superClass: 'CircleShape',

  init: function() {
    this.superInit({
      backgroundColor: 'transparent',
      fill: '#FFE066',
      stroke: null,
      strokeWidth: 0,
      radius: BALL_RADIUS,
    });

    this.speed = 0;

    const initYV = Random.randfloat(-1, -0.5);
    const initXV = Math.sqrt(2 - (initYV * initYV));
    this.direction = Vector2(initXV, initYV).normalize();
  },

  move: function() {
    this.x += this.direction.x;
    this.y += this.direction.y;
  },

  reflectX: function() {
    this.direction.x *= -1;
  },
  reflectY: function() {
    this.direction.y *= -1;
  },
});


/**
 * ブロックを定義
 */
phina.define('Block', {
  superClass: 'RectangleShape',

  init: function() {
    this.superInit({
      width: BLOCK_WIDTH,
      height: BLOCK_HEIGHT,
      fill: '#70C1B3',
      stroke: '#50514F',
      strokeWidth: 2,
      cornerRadius: 0,
    });
  },
});

// メイン処理
phina.main(function() {
  var app = GameApp({
    startLabel: 'main',
    fps: 60
  });

  // app.enableStats();

  app.run();
});