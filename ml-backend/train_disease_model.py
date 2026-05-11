"""
Tomato Disease Detection Model Training Script
Uses PyTorch + MobileNetV2 Transfer Learning
Dataset: PlantVillage Tomato (10 classes)
"""

import os
import json
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, transforms, models
from collections import Counter
import time

# --- Configuration ---
TRAIN_DIR = os.path.join(os.path.dirname(__file__), 'dataset', 'train')
TEST_DIR = os.path.join(os.path.dirname(__file__), 'dataset', 'test')
MODEL_SAVE_PATH = os.path.join(os.path.dirname(__file__), 'tomato_disease_model.pth')
CLASSES_SAVE_PATH = os.path.join(os.path.dirname(__file__), 'tomato_disease_classes.json')

# Updated Hyperparameters for better accuracy
BATCH_SIZE = 32
NUM_EPOCHS = 50
LEARNING_RATE = 0.0001
IMAGE_SIZE = 224
TRAIN_SPLIT = 0.8  # 80% train, 20% validation

# Early Stopping Configuration
PATIENCE = 5

# Use GPU if available
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"[INFO] Using device: {device}")

# --- Data Transforms ---
# Training: with augmentation for better generalization
train_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomVerticalFlip(),
    transforms.RandomRotation(20),
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Validation: no augmentation
val_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# --- Load Dataset ---
print(f"[INFO] Loading training dataset from: {TRAIN_DIR}")
train_dataset = datasets.ImageFolder(root=TRAIN_DIR, transform=train_transform)

print(f"[INFO] Loading validation dataset from: {TEST_DIR}")
val_dataset = datasets.ImageFolder(root=TEST_DIR, transform=val_transform)

# Get class names and counts
class_names = train_dataset.classes
num_classes = len(class_names)
class_counts = Counter(train_dataset.targets)
print(f"[INFO] Found {len(train_dataset)} training images across {num_classes} classes:")
for i, name in enumerate(class_names):
    print(f"   {i}: {name} ({class_counts[i]} train images)")

# Save class names for inference
with open(CLASSES_SAVE_PATH, 'w') as f:
    json.dump(class_names, f, indent=2)
print(f"[OK] Class names saved to: {CLASSES_SAVE_PATH}")

train_size = len(train_dataset)
val_size = len(val_dataset)

train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=0, pin_memory=True)
val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=0, pin_memory=True)

print(f"\n[SPLIT] {train_size} training | {val_size} validation")

# --- Build Model (MobileNetV2 Transfer Learning) ---
print("\n[BUILD] MobileNetV2 model with Transfer Learning...")
model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.IMAGENET1K_V1)

# Freeze the feature extractor layers
for param in model.features.parameters():
    param.requires_grad = False

# Replace the classifier head for our specific classes
model.classifier = nn.Sequential(
    nn.Dropout(0.3),
    nn.Linear(model.last_channel, 256),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(256, num_classes)
)

model = model.to(device)
print(f"[OK] Model ready with {num_classes} output classes")

# --- Training Setup ---
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.classifier.parameters(), lr=LEARNING_RATE)
scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=3, gamma=0.5)

# --- Training Loop ---
print(f"\n[TRAIN] Starting training for {NUM_EPOCHS} epochs...\n")
best_val_acc = 0.0
early_stop_counter = 0

for epoch in range(NUM_EPOCHS):
    start_time = time.time()
    
    # --- TRAINING PHASE ---
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0
    
    for batch_idx, (images, labels) in enumerate(train_loader):
        images, labels = images.to(device), labels.to(device)
        
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item()
        _, predicted = torch.max(outputs, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()
        
        if (batch_idx + 1) % 50 == 0:
            print(f"   Epoch [{epoch+1}/{NUM_EPOCHS}] Batch [{batch_idx+1}/{len(train_loader)}] Loss: {loss.item():.4f}")
    
    train_acc = 100.0 * correct / total
    train_loss = running_loss / len(train_loader)
    
    # --- VALIDATION PHASE ---
    model.eval()
    val_correct = 0
    val_total = 0
    val_loss = 0.0
    
    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)
            val_loss += loss.item()
            _, predicted = torch.max(outputs, 1)
            val_total += labels.size(0)
            val_correct += (predicted == labels).sum().item()
    
    val_acc = 100.0 * val_correct / val_total
    val_loss = val_loss / len(val_loader)
    epoch_time = time.time() - start_time
    
    print(f"\n[EPOCH {epoch+1}/{NUM_EPOCHS}] ({epoch_time:.1f}s)")
    print(f"   Train Loss: {train_loss:.4f} | Train Acc: {train_acc:.2f}%")
    print(f"   Val Loss:   {val_loss:.4f} | Val Acc:   {val_acc:.2f}%")
    
    # Early Stopping and Model Saving Logic
    if val_acc > best_val_acc:
        best_val_acc = val_acc
        torch.save(model.state_dict(), MODEL_SAVE_PATH)
        print(f"   [SAVED] Best model! (Val Acc: {val_acc:.2f}%)")
        early_stop_counter = 0 # Reset counter if accuracy improves
    else:
        early_stop_counter += 1
        print(f"   [INFO] No improvement. EarlyStopping counter: {early_stop_counter} out of {PATIENCE}")
        if early_stop_counter >= PATIENCE:
            print(f"\n[STOP] Early stopping triggered! Training stopped at epoch {epoch+1} to prevent overfitting.")
            break # Exit the training loop
    
    scheduler.step()
    print()

print("=" * 50)
print(f"[DONE] Training Complete!")
print(f"   Best Validation Accuracy: {best_val_acc:.2f}%")
print(f"   Model saved to: {MODEL_SAVE_PATH}")
print(f"   Classes saved to: {CLASSES_SAVE_PATH}")
print("=" * 50)