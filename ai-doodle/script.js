// 配置
const CANVAS_SIZE = 280;
const MODEL_INPUT_SIZE = 28;
// 必须和 train.py 里的顺序一致
const CLASSES = ['Apple 🍎', 'Eye 👁️', 'Tree 🌲', 'Bird 🐦‍', 'Bicycle 🚲']; 

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let session = null;

// --- 1. 初始化模型 ---
async function loadModel() {
    try {
        console.log("正在加载 ONNX 模型...");
        // 创建推理会话，加载本地的 model.onnx
        session = await ort.InferenceSession.create('./model.onnx');
        console.log("模型加载成功！");
        document.getElementById('predict-btn').classList.remove('animate-pulse');
        document.getElementById('predict-btn').innerText = "🔮 点击识别";
    } catch (e) {
        console.error("模型加载失败:", e);
        alert("模型加载失败，请确保 model.onnx 存在且使用了本地服务器运行！");
    }
}

// --- 2. 画板逻辑 ---
// 设置黑色背景，白色笔触 (模拟 MNIST/QuickDraw 格式)
ctx.fillStyle = "black";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
ctx.strokeStyle = "white";
ctx.lineWidth = 15; // 笔触要粗一点，缩小后才清晰
ctx.lineCap = "round";
ctx.lineJoin = "round";

// 鼠标/触摸事件监听
const startDrawing = (e) => {
    isDrawing = true;
    draw(e);
};
const stopDrawing = () => {
    isDrawing = false;
    ctx.beginPath(); // 结束路径，防止连笔
    // 自动预测（可选，也可以手动点击）
    // predict(); 
};
const draw = (e) => {
    if (!isDrawing) return;
    
    // 获取坐标 (兼容鼠标和触摸)
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    e.preventDefault(); // 防止手机端滚动
};

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// 移动端支持
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);

function clearCanvas() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    document.getElementById('result-box').classList.add('hidden');
}

// --- 3. 图像预处理与推理 ---
async function predict() {
    if (!session) {
        alert("模型尚未加载，请稍候...");
        return;
    }

    // 1. 缩小图片: 280x280 -> 28x28
    // 我们创建一个临时的离屏 Canvas 来做缩放
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = MODEL_INPUT_SIZE;
    tempCanvas.height = MODEL_INPUT_SIZE;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE);

    // 2. 获取像素数据
    const imageData = tempCtx.getImageData(0, 0, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE);
    const { data } = imageData;
    const inputTensor = new Float32Array(MODEL_INPUT_SIZE * MODEL_INPUT_SIZE);

    // 3. 转换为 Tensor (Grayscale & Normalize)
    // Canvas 是 RGBA (4通道)，我们需要提取 R 通道 (黑白图RGB值一样)，并归一化到 0-1
    for (let i = 0; i < data.length; i += 4) {
        // data[i] 是 R 通道，data[i+1] 是 G...
        // 归一化：像素值 / 255.0
        inputTensor[i / 4] = data[i] / 255.0;
    }

    // 4. 构建 ONNX Tensor 对象 [1, 1, 28, 28]
    const tensor = new ort.Tensor('float32', inputTensor, [1, 1, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE]);

    // 5. 运行推理
    const feeds = { input: tensor }; // 'input' 必须和 train.py 导出的 input_names 一致
    const results = await session.run(feeds);
    const output = results.output.data; // 'output' 必须和 train.py 导出的 output_names 一致

    // 6. 找出最大概率的类别 (Argmax)
    let maxProb = -Infinity;
    let maxIndex = -1;
    for (let i = 0; i < output.length; i++) {
        if (output[i] > maxProb) {
            maxProb = output[i];
            maxIndex = i;
        }
    }

    // 7. 显示结果
    const resultBox = document.getElementById('result-box');
    const predText = document.getElementById('prediction');
    const confText = document.getElementById('confidence');

    resultBox.classList.remove('hidden');
    predText.innerText = CLASSES[maxIndex];
    // 简单的 Softmax 模拟 (仅供展示)
    // 实际上 output 是 Logits，需要 Math.exp 处理一下才严谨，这里直接展示 Logits 大小也行，或者不用显示具体数值
    confText.innerText = `Index: ${maxIndex}`; 
}

// 页面加载后启动
loadModel();