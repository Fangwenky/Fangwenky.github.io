import torch
import torch.nn as nn
import torch.optim as optim
import torch.onnx
import numpy as np
import os

# --- 配置 ---
CLASSES = ['apple', 'eye', 'tree','bird','bicycle'] # 我们可以先做3个分类的 Demo
IMG_SIZE = 28
MODEL_PATH = "model.onnx"

# --- 1. 定义模型 (简单的 CNN) ---
class DoodleCNN(nn.Module):
    def __init__(self):
        super(DoodleCNN, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 16, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2, 2),
            nn.Conv2d(16, 32, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2, 2),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(32 * 7 * 7, 128),
            nn.ReLU(),
            nn.Linear(128, len(CLASSES))
        )

    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x

# --- 2. 准备数据 ---
def load_data():
    print("正在准备数据...")
    # 注意：真实项目中，你需要去 Google QuickDraw Dataset 下载 .npy 文件
    # 地址：https://console.cloud.google.com/storage/browser/quickdraw_dataset/full/numpy_bitmap
    # 这里为了演示，我们生成一些随机噪声数据，确保代码能跑通
    
    x_data = []
    y_data = []
    
    for i, cls in enumerate(CLASSES):
        # 尝试加载真实数据，如果不存在则使用随机数据
        file_name = f"{cls}.npy"
        if os.path.exists(file_name):
            print(f"加载真实数据: {file_name}")
            data = np.load(file_name)
            data = data[:1000] # 只取前1000个做演示
        else:
            print(f"警告: 未找到 {file_name}，使用随机模拟数据")
            data = np.random.randint(0, 255, (1000, 784)).astype(np.float32)
            
        # 归一化并 Reshape 为 (N, 1, 28, 28)
        data = data.reshape(-1, 1, IMG_SIZE, IMG_SIZE).astype(np.float32) / 255.0
        x_data.append(data)
        y_data.append(np.full(len(data), i))
    
    X = np.concatenate(x_data)
    y = np.concatenate(y_data)
    
    # 转换为 PyTorch Tensor
    return torch.tensor(X), torch.tensor(y, dtype=torch.long)

# --- 3. 训练与导出 ---
def train_and_export():
    X, y = load_data()
    dataset = torch.utils.data.TensorDataset(X, y)
    dataloader = torch.utils.data.DataLoader(dataset, batch_size=32, shuffle=True)
    
    model = DoodleCNN()
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    print("开始训练...")
    for epoch in range(5): # 训练 5 轮
        total_loss = 0
        for inputs, labels in dataloader:
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        print(f"Epoch {epoch+1}, Loss: {total_loss/len(dataloader):.4f}")

    print("训练完成！正在导出为 ONNX...")
    
    # 导出模型
    dummy_input = torch.randn(1, 1, 28, 28)
    torch.onnx.export(model, dummy_input, MODEL_PATH, 
                      input_names=['input'], output_names=['output'],
                      dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}})
    
    print(f"模型已保存为 {MODEL_PATH}")
    print("请将 model.onnx 移动到你的网页目录中。")

if __name__ == "__main__":
    train_and_export()