document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    
    // Botões de Ferramentas
    const brushTool = document.getElementById('brush-tool');
    const bucketTool = document.getElementById('bucket-tool');
    const eraserTool = document.getElementById('eraser-tool');
    const clearCanvasBtn = document.getElementById('clear-canvas');
    const toolButtons = [brushTool, bucketTool, eraserTool];

    // Botões de Ação
    const saveButton = document.getElementById('saveButton');
    const saveLocalButton = document.getElementById('saveLocalButton');

    let drawing = false;
    let currentTool = 'brush'; // Ferramenta padrão

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        loadLocalDrawing(); 
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
        drawing = true;
        draw(e);
    }

    function endPosition() {
        drawing = false;
        ctx.beginPath();
    }

    function getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function draw(e) {
        // Só desenha se a ferramenta de pincel estiver ativa
        if (!drawing || currentTool !== 'brush') return;
        
        const pos = getMousePos(canvas, e);

        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = colorPicker.value;

        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
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
        alert('Desenho salvo localmente!');
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

    // --- Event Listeners ---
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);
    
    saveButton.addEventListener('click', saveDrawing);
    saveLocalButton.addEventListener('click', saveDrawingLocally);

    brushTool.addEventListener('click', () => setActiveTool('brush'));
    bucketTool.addEventListener('click', () => setActiveTool('bucket'));
    eraserTool.addEventListener('click', () => setActiveTool('eraser'));

    // --- Inicialização ---
    resizeCanvas();
    setActiveTool('brush'); // Define o pincel como ferramenta inicial ativa
});
