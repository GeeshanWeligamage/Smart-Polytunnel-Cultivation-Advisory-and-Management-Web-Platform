import os
import shutil
import random

# Configuration
SOURCE_DIR = os.path.join(os.path.dirname(__file__), 'dataset', 'tomato')
TRAIN_DIR = os.path.join(os.path.dirname(__file__), 'dataset', 'train')
TEST_DIR = os.path.join(os.path.dirname(__file__), 'dataset', 'test')
SPLIT_RATIO = 0.8  # 80% train, 20% test

print("Starting Dataset Splitting...")

if not os.path.exists(SOURCE_DIR):
    print(f"Error: Source directory {SOURCE_DIR} not found!")
    exit(1)

# Create Train and Test directories
os.makedirs(TRAIN_DIR, exist_ok=True)
os.makedirs(TEST_DIR, exist_ok=True)

classes = [d for d in os.listdir(SOURCE_DIR) if os.path.isdir(os.path.join(SOURCE_DIR, d))]

for cls in classes:
    src_class_path = os.path.join(SOURCE_DIR, cls)
    train_class_path = os.path.join(TRAIN_DIR, cls)
    test_class_path = os.path.join(TEST_DIR, cls)
    
    os.makedirs(train_class_path, exist_ok=True)
    os.makedirs(test_class_path, exist_ok=True)
    
    # Get all images in the class folder
    images = [f for f in os.listdir(src_class_path) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.JPG'))]
    
    # Shuffle images randomly
    random.seed(42)
    random.shuffle(images)
    
    # Split
    split_index = int(len(images) * SPLIT_RATIO)
    train_images = images[:split_index]
    test_images = images[split_index:]
    
    print(f"Moving {cls}: {len(train_images)} to train, {len(test_images)} to test...")
    
    # Move images to Train
    for img in train_images:
        shutil.move(os.path.join(src_class_path, img), os.path.join(train_class_path, img))
        
    # Move images to Test
    for img in test_images:
        shutil.move(os.path.join(src_class_path, img), os.path.join(test_class_path, img))
        
print("\nDataset successfully split into 80% (train) and 20% (test)!")
print("You can safely delete the original 'tomato' folder if it is empty.")
