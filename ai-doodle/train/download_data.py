import urllib.request
import urllib.parse  # <--- 必须添加这一行，否则无法使用 quote
import os

# 这里定义我们要下载的类别
# 注意：必须和 train.py 里的 CLASSES 列表保持一致
CLASSES_TO_DOWNLOAD = ['bicycle','bird', 'eye', 'tree']

BASE_URL = "https://storage.googleapis.com/quickdraw_dataset/full/numpy_bitmap/"

def download():
    for cls in CLASSES_TO_DOWNLOAD:
        filename = f"{cls}.npy"
        # 这里的 urllib.parse.quote 需要上面的 import 支持
        url = BASE_URL + urllib.parse.quote(filename) 
        
        if os.path.exists(filename):
            print(f"✅ {filename} 已存在，跳过。")
            continue
            
        print(f"⬇️ 正在下载 {filename} ...")
        try:
            # 使用 urllib.request 下载
            urllib.request.urlretrieve(url, filename)
            print(f"✅ {filename} 下载完成！")
        except Exception as e:
            print(f"❌ 下载 {filename} 失败: {e}")

if __name__ == "__main__":
    download()
    print("\n所有数据准备完毕！现在你可以运行 'python train.py' 了。")