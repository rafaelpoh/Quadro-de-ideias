document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    
    // Botões de Ferramentas
    const brushTool = document.getElementById('brush-tool');
    const bucketTool = document.getElementById('bucket-tool');
    const eraserTool = document.getElementById('eraser-tool');
    const lineTool = document.getElementById('line-tool');
    const clearCanvasBtn = document.getElementById('clear-canvas');
    const toolButtons = [brushTool, bucketTool, eraserTool, lineTool];

    // Botões de Ação
    const saveButton = document.getElementById('saveButton');
    const undoButton = document.getElementById('undo-button');

    let drawing = false;
    let history = [];
    let historyStep = -1;
    let currentTool = 'brush'; // Ferramenta padrão
    let lastPos = null;
    let lineStartPos = null;

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        loadLocalDrawing(); 
        initHistory();
    }

    function setActiveTool(tool) {
        currentTool = tool;
        toolButtons.forEach(button => {
            if (button.id === `${tool}-tool`) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    function startPosition(e) {
        if (e.type.startsWith('touch') && currentTool !== 'bucket') {
            e.preventDefault();
        }
    
        if (currentTool === 'bucket') {
            return;
        }
    
        drawing = true;
        saveHistory();
        lastPos = getEventPos(canvas, e);
        if (currentTool === 'line') {
            lineStartPos = lastPos;
        }
        draw(e);
    }

    function endPosition(e) {
        if (e.type.startsWith('touch') && currentTool !== 'bucket') {
            e.preventDefault();
        }
    
        if (currentTool === 'bucket') {
            return;
        }
    
        if (currentTool === 'line' && drawing && lineStartPos) {
            const pos = getEventPos(canvas, e);
            if (pos) {
                drawLine(lineStartPos, pos);
            }
        }
        drawing = false;
        ctx.beginPath();
        lastPos = null;
        lineStartPos = null;
        saveDrawingLocally(); // Salva automaticamente
    }

    function getEventPos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        let touch;
        if (evt.touches && evt.touches.length > 0) {
            touch = evt.touches[0];
        } else if (evt.changedTouches && evt.changedTouches.length > 0) {
            touch = evt.changedTouches[0];
        }
    
        if (touch) {
            return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
        }
        if (evt.clientX !== undefined && evt.clientY !== undefined) {
            return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
        }
        return null;
    }

    function eraseInCircle(x, y, radius, colorToErase) {
        const startX = Math.floor(Math.max(0, x - radius));
        const startY = Math.floor(Math.max(0, y - radius));
        const endX = Math.ceil(Math.min(canvas.width, x + radius));
        const endY = Math.ceil(Math.min(canvas.height, y + radius));
        const width = endX - startX;
        const height = endY - startY;

        if (width <= 0 || height <= 0) return;

        const imageData = ctx.getImageData(startX, startY, width, height);
        const data = imageData.data;
        const tolerance = 20; // Aumentar a tolerância para cores com antialiasing

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const currentX = startX + j;
                const currentY = startY + i;

                const dx = currentX - x;
                const dy = currentY - y;
                if (dx * dx + dy * dy <= radius * radius) {
                    const index = (i * width + j) * 4;
                    const r = data[index];
                    const g = data[index + 1];
                    const b = data[index + 2];

                    if (Math.abs(r - colorToErase[0]) < tolerance &&
                        Math.abs(g - colorToErase[1]) < tolerance &&
                        Math.abs(b - colorToErase[2]) < tolerance) {
                        data[index + 3] = 0; // Tornar transparente
                    }
                }
            }
        }
        ctx.putImageData(imageData, startX, startY);
    }

    function bresenhamLine(x0, y0, x1, y1, callback) {
        x0 = Math.floor(x0);
        y0 = Math.floor(y0);
        x1 = Math.floor(x1);
        y1 = Math.floor(y1);

        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = (x0 < x1) ? 1 : -1;
        const sy = (y0 < y1) ? 1 : -1;
        let err = dx - dy;

        while (true) {
            callback(x0, y0);

            if ((x0 === x1) && (y0 === y1)) break;
            const e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x0 += sx; }
            if (e2 < dx) { err += dx; y0 += sy; }
        }
    }

    function initHistory() {
        historyStep = 0;
        history = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
    }

    function saveHistory() {
        historyStep++;
        if (historyStep < history.length) {
            history.length = historyStep;
        }
        history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }

    function undo() {
        if (historyStep > 0) {
            historyStep--;
            ctx.putImageData(history[historyStep], 0, 0);
            saveDrawingLocally();
        }
    }

    function drawLine(start, end) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = colorPicker.value;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }

    function draw(e) {
        if (e.type.startsWith('touch') && currentTool !== 'bucket') {
            e.preventDefault();
        }
        if (!drawing || currentTool === 'bucket') return;

        const pos = getEventPos(canvas, e);
        if (!pos) return;

        if (currentTool === 'brush') {
            ctx.globalCompositeOperation = 'source-over';
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.strokeStyle = colorPicker.value;

            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        } else if (currentTool === 'eraser') {
            if (lastPos) {
                const colorToErase = hexToRgba(colorPicker.value);
                const eraserWidth = 10;
                bresenhamLine(lastPos.x, lastPos.y, pos.x, pos.y, (x, y) => {
                    eraseInCircle(x, y, eraserWidth / 2, colorToErase);
                });
            }
        } else if (currentTool === 'line' && lineStartPos) {
            // Restore the canvas to the state before starting to draw the line
            ctx.putImageData(history[historyStep], 0, 0);
            drawLine(lineStartPos, pos);
        }
        // Atualiza a última posição para a próxima chamada
        lastPos = pos;
    }

    function saveDrawing() {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'meu-desenho.png';
        link.click();
    }

    function saveDrawingLocally() {
        const imageData = canvas.toDataURL('image/png');
        localStorage.setItem('savedDrawing', imageData);
    }

    function loadLocalDrawing() {
        const savedDrawing = localStorage.getItem('savedDrawing');
        if (savedDrawing) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
            };
            img.src = savedDrawing;
        }
    }

    function handleCanvasClick(e) {
        if (currentTool === 'bucket') {
            saveHistory();
            const pos = getEventPos(canvas, e);
            if (pos) {
                floodFill(Math.floor(pos.x), Math.floor(pos.y), colorPicker.value);
            }
        }
    }

    function hexToRgba(hex) {
        let r = 0, g = 0, b = 0, a = 255;
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
        }
        return [r, g, b, a];
    }

    function getPixelColor(imageData, x, y) {
        const index = (y * canvas.width + x) * 4;
        return [
            imageData.data[index],
            imageData.data[index + 1],
            imageData.data[index + 2],
            imageData.data[index + 3]
        ];
    }

    function setPixelColor(imageData, x, y, color) {
        const index = (y * canvas.width + x) * 4;
        imageData.data[index] = color[0];
        imageData.data[index + 1] = color[1];
        imageData.data[index + 2] = color[2];
        imageData.data[index + 3] = color[3];
    }

    function colorsMatch(color1, color2) {
        return color1[0] === color2[0] &&
               color1[1] === color2[1] &&
               color1[2] === color2[2] &&
               color1[3] === color2[3];
    }

    function floodFill(startX, startY, fillColor) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const startColor = getPixelColor(imageData, startX, startY);
        const newColor = hexToRgba(fillColor);

        if (colorsMatch(startColor, newColor)) {
            return;
        }

        const pixelStack = [[startX, startY]];
        const visited = new Set();

        function getPixelKey(x, y) {
            return `${x},${y}`;
        }

        while (pixelStack.length > 0) {
            const [x, y] = pixelStack.pop();
            const pixelKey = getPixelKey(x, y);

            if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height || visited.has(pixelKey)) {
                continue;
            }

            visited.add(pixelKey);

            if (colorsMatch(getPixelColor(imageData, x, y), startColor)) {
                setPixelColor(imageData, x, y, newColor);

                pixelStack.push([x + 1, y]);
                pixelStack.push([x - 1, y]);
                pixelStack.push([x, y + 1]);
                pixelStack.push([x, y - 1]);
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }

    // --- Event Listeners ---
    window.addEventListener('resize', resizeCanvas);
    // Mouse events
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseleave', endPosition);
    canvas.addEventListener('click', handleCanvasClick);

    // Touch events
    canvas.addEventListener('touchstart', startPosition, { passive: false });
    canvas.addEventListener('touchend', endPosition, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    
    saveButton.addEventListener('click', saveDrawing);
    saveLocalButton.addEventListener('click', () => {
        saveDrawingLocally();
        alert('Desenho salvo no navegador!');
    });
    undoButton.addEventListener('click', undo);
    clearCanvasBtn.addEventListener('click', () => {
        saveHistory();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        localStorage.removeItem('savedDrawing'); // Limpa o salvamento local
    });

    brushTool.addEventListener('click', () => setActiveTool('brush'));
    bucketTool.addEventListener('click', () => setActiveTool('bucket'));
    eraserTool.addEventListener('click', () => setActiveTool('eraser'));
    lineTool.addEventListener('click', () => setActiveTool('line'));

    // --- Inicialização ---
    resizeCanvas();
    setActiveTool('brush'); // Define o pincel como ferramenta inicial ativa
});