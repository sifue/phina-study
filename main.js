'use strict';

phina.globalize();

const BALL_RADIUS = 10;
const BALL_INIT_POS_OFFSET = BALL_RADIUS * 10;
const BALL_SPEED = 20;

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


// メイン処理
phina.main(function() {
  var app = GameApp({
    startLabel: 'main',
    fps: 60
  });

  // app.enableStats();

  app.run();
});