'use strict';

/**
 * Author: Jannik Hauptvogel - amicaldo GmbH <hauptvogel@amicaldo.de>
 * License: CC-BY-NC-ND-4.0
 * Version: 1.0
 */

(function() {
    let canvas;
    let context;
    let render_count = 0;

    const snowflakes = [];

    /* Configuration */
    const INTENSITY     = 0.5;  /* The intensity scale of snowflake creation */
    const MIN_INTENSITY = 15;   /* The min intensity of snowflake creation */
    const MAX_INTENSITY = 40;   /* The max intensity of snowflake creation */
    const INTERVAL      = 10;   /* The interval of render calls */
    const MIN_VEL_X     = 0.3;  /* The min falling speed of a snowflake */
    const MAX_VEL_X     = 0.5;  /* The max falling speed of a snowflake */
    const MIN_VEL_Y     = -0.2; /* The min wind of a snowflake */
    const MAX_VEL_Y     = 0.2;  /* The max wind of a snowflake */
    const MIN_SIZE      = 3;    /* The min size of a snowflake */
    const MAX_SIZE      = 12;   /* The max size of a snowflake */
    const IMAGE_URLS    = [
        'https://download.amicaldo.net/scripts/snow/images/snowflake01.png',
        'https://download.amicaldo.net/scripts/snow/images/snowflake02.png',
        'https://download.amicaldo.net/scripts/snow/images/snowflake03.png',
        'https://download.amicaldo.net/scripts/snow/images/snowflake04.png'
    ];

    /* Dynamically adapt snowflake creation to screen size */
    var MAX_RENDER_COUNT;

    const Snowflake = (function() {
        let snowflake = new Image();

        snowflake.data = {
            x  : Math.random() * window.innerWidth,
            y  : -1 * MAX_SIZE,
            r  : MIN_SIZE  + Math.random() * MAX_SIZE,
            vx : MIN_VEL_Y + Math.random() * (MAX_VEL_Y * 2),
            vy : MIN_VEL_X + Math.random() * MAX_VEL_X
        };

        snowflake.src = IMAGE_URLS[(Math.floor(Math.random() * IMAGE_URLS.length))];

        return snowflake;
    });

    function updateRenderCount() {
        MAX_RENDER_COUNT = Math.round((10000 / window.innerWidth) / INTENSITY);

        if (MAX_RENDER_COUNT > MAX_INTENSITY) {
            MAX_RENDER_COUNT = MAX_INTENSITY;
        } else if (MAX_RENDER_COUNT < MIN_INTENSITY) {
            MAX_RENDER_COUNT = MIN_INTENSITY;
        }
    }

    function updateCanvasSize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function handleResize() {
        updateCanvasSize();
        updateRenderCount();
    }

    function render() {
        if (++render_count > MAX_RENDER_COUNT) {
            snowflakes.push(Snowflake());
            render_count = 0;
        }

        context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        snowflakes.forEach(function(s) {
            s.data.y += s.data.vy;
            s.data.x += s.data.vx;

            context.beginPath();
            context.drawImage(s , s.data.x, s.data.y, s.data.r, s.data.r);
            context.closePath();
            context.fill();

            if (s.data.y >= window.innerHeight + s.data.r ||
                s.data.x >= window.innerWidth  + s.data.r ||
                s.data.x <= -s.data.r) {
                snowflakes.splice(snowflakes.indexOf(s), 1);
            }
        });
    }

    function setup() {
        canvas = document.createElement('canvas');

        canvas.style.background    = '#00000000';
        canvas.style.position      = 'fixed';
        canvas.style.left          = '0';
        canvas.style.top           = '0';
        canvas.style.height        = '100%';
        canvas.style.width         = '100%';
        canvas.style.zIndex        = '2147483647';
        canvas.style.pointerEvents = 'none';

        context = canvas.getContext('2d');

        context.globalAlpha = 1;

        document.body.appendChild(canvas);

        window.addEventListener('resize', handleResize);

        handleResize();
    }

    setup();
    setInterval(render, INTERVAL);
})();
