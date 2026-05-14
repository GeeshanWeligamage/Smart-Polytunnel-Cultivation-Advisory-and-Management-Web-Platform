"""
Multi-Crop Disease Detection — Model Training Script
Crops supported: Tomato | Capsicum | Cucumber
Architecture  : MobileNetV2 + Transfer Learning (PyTorch)
"""

import os
import json
import time
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
from collections import Counter
import matplotlib.pyplot as plt  # <--- අලුතින් එකතු කළා

# ── Configuration ────────────────────────────────────────────────────────────
BASE_DIR         = os.path.dirname(__file__)
TRAIN_DIR        = os.path.join(BASE_DIR, 'dataset', 'train')
TEST_DIR         = os.path.join(BASE_DIR, 'dataset', 'test')
MODEL_SAVE_PATH  = os.path.join(BASE_DIR, 'models', 'plant_disease_model.pth')
CLASSES_SAVE_PATH= os.path.join(BASE_DIR, 'models', 'plant_disease_classes.json')

BATCH_SIZE   = 32
NUM_EPOCHS   = 50
LEARNING_RATE= 0.0001
IMAGE_SIZE   = 224
PATIENCE     = 5        # Early stopping
# ─────────────────────────────────────────────────────────────────────────────

# ── Device ───────────────────────────────────────────────────────────────────
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"[INFO] Using device: {device}")

# ── Verify directories ────────────────────────────────────────────────────────
for d in (TRAIN_DIR, TEST_DIR):
    if not os.path.exists(d):
        print(f"[ERROR] Directory not found: {d}")
        print("  → Run split_dataset.py first!")
        exit(1)

# ── Data Transforms ───────────────────────────────────────────────────────────
train_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomVerticalFlip(),
    transforms.RandomRotation(20),
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std =[0.229, 0.224, 0.225]),
])

val_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std =[0.229, 0.224, 0.225]),
])

# ── Load Datasets ─────────────────────────────────────────────────────────────
print(f"[INFO] Loading training data from : {TRAIN_DIR}")
train_dataset = datasets.ImageFolder(root=TRAIN_DIR, transform=train_transform)

print(f"[INFO] Loading validation data from: {TEST_DIR}")
val_dataset = datasets.ImageFolder(root=TEST_DIR, transform=val_transform)

class_names = train_dataset.classes
num_classes = len(class_names)
class_counts = Counter(train_dataset.targets)

print(f"\n[INFO] Found {len(train_dataset)} training images across {num_classes} classes:")
for i, name in enumerate(class_names):
    print(f"   [{i:>2}] {name}  ({class_counts[i]} images)")

# ── Save class list ───────────────────────────────────────────────────────────
os.makedirs(os.path.dirname(CLASSES_SAVE_PATH), exist_ok=True)
with open(CLASSES_SAVE_PATH, 'w') as f:
    json.dump(class_names, f, indent=2)
print(f"\n[OK]  Class list saved → {CLASSES_SAVE_PATH}")

# ── DataLoaders ───────────────────────────────────────────────────────────────
train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE,
                          shuffle=True,  num_workers=0, pin_memory=True)
val_loader   = DataLoader(val_dataset,   batch_size=BATCH_SIZE,
                          shuffle=False, num_workers=0, pin_memory=True)

print(f"[SPLIT] {len(train_dataset)} training  |  {len(val_dataset)} validation\n")

# ── Build Model (MobileNetV2 Transfer Learning) ───────────────────────────────
print("[BUILD] MobileNetV2 with ImageNet pre-trained weights ...")
model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.IMAGENET1K_V1)

# Freeze feature extractor
for param in model.features.parameters():
    param.requires_grad = False

# Replace classifier head for our classes
model.classifier = nn.Sequential(
    nn.Dropout(0.3),
    nn.Linear(model.last_channel, 256),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(256, num_classes),
)

model = model.to(device)
print(f"[OK]  Model ready — {num_classes} output classes\n")

# ── Training Setup ────────────────────────────────────────────────────────────
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.classifier.parameters(), lr=LEARNING_RATE)
scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=3, gamma=0.5)

# ප්‍රස්තාර අඳින්න Data එකතු කරගන්න හිස් Lists හදාගැනීම
history_train_loss = []
history_val_loss = []
history_train_acc = []
history_val_acc = []

# ── Training Loop ─────────────────────────────────────────────────────────────
print(f"[TRAIN] Starting training for up to {NUM_EPOCHS} epochs ...\n")
best_val_acc      = 0.0
early_stop_counter= 0

for epoch in range(NUM_EPOCHS):
    t0 = time.time()

    # ── Train phase ──
    model.train()
    running_loss = 0.0
    correct = total = 0

    for batch_idx, (images, labels) in enumerate(train_loader):
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item()
        _, predicted = torch.max(outputs, 1)
        total   += labels.size(0)
        correct += (predicted == labels).sum().item()

        if (batch_idx + 1) % 50 == 0:
            print(f"   Epoch [{epoch+1}/{NUM_EPOCHS}] "
                  f"Batch [{batch_idx+1}/{len(train_loader)}] "
                  f"Loss: {loss.item():.4f}")

    train_acc  = 100.0 * correct / total
    train_loss = running_loss / len(train_loader)

    # ── Validation phase ──
    model.eval()
    val_correct = val_total = 0
    val_loss_sum = 0.0

    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)
            val_loss_sum += loss.item()
            _, predicted = torch.max(outputs, 1)
            val_total   += labels.size(0)
            val_correct += (predicted == labels).sum().item()

    val_acc  = 100.0 * val_correct / val_total
    val_loss = val_loss_sum / len(val_loader)
    elapsed  = time.time() - t0
    
    # හැම Epoch එකක් ඉවර වුණාම Lists වලට Data දාගැනීම
    history_train_loss.append(train_loss)
    history_val_loss.append(val_loss)
    history_train_acc.append(train_acc)
    history_val_acc.append(val_acc)

    print(f"\n[EPOCH {epoch+1}/{NUM_EPOCHS}] ({elapsed:.1f}s)")
    print(f"   Train  Loss: {train_loss:.4f}  Acc: {train_acc:.2f}%")
    print(f"   Val    Loss: {val_loss:.4f}  Acc: {val_acc:.2f}%")

    # Save best model / early stopping
    if val_acc > best_val_acc:
        best_val_acc = val_acc
        torch.save(model.state_dict(), MODEL_SAVE_PATH)
        print(f"   [SAVED] New best model  (Val Acc: {val_acc:.2f}%)")
        early_stop_counter = 0
    else:
        early_stop_counter += 1
        print(f"   [INFO] No improvement.  EarlyStop: {early_stop_counter}/{PATIENCE}")
        if early_stop_counter >= PATIENCE:
            print(f"\n[STOP] Early stopping at epoch {epoch+1}.")
            break

    scheduler.step()
    print()

print("=" * 55)
print(f"[DONE] Training complete!")
print(f"       Best Val Accuracy : {best_val_acc:.2f}%")
print(f"       Model saved       : {MODEL_SAVE_PATH}")
print(f"       Classes saved     : {CLASSES_SAVE_PATH}")
print("=" * 55)

# ── ප්‍රස්තාර (Graphs) ඇඳීම සහ Save කිරීම ─────────────────────────────────────
print("\n[INFO] Generating Accuracy and Loss Graphs...")
graphs_dir = os.path.dirname(MODEL_SAVE_PATH)

# 1. Loss Graph
plt.figure(figsize=(10, 5))
plt.plot(history_train_loss, label='Training Loss', color='red', marker='o')
plt.plot(history_val_loss, label='Validation Loss', color='orange', marker='s')
plt.title('MobileNetV2: Model Loss over Epochs')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.legend()
plt.grid(True)
loss_graph_path = os.path.join(graphs_dir, 'loss_graph.png')
plt.savefig(loss_graph_path)
plt.close()

# 2. Accuracy Graph
plt.figure(figsize=(10, 5))
plt.plot(history_train_acc, label='Training Accuracy', color='blue', marker='o')
plt.plot(history_val_acc, label='Validation Accuracy', color='green', marker='s')
plt.title('MobileNetV2: Model Accuracy over Epochs')
plt.xlabel('Epochs')
plt.ylabel('Accuracy (%)')
plt.legend()
plt.grid(True)
acc_graph_path = os.path.join(graphs_dir, 'accuracy_graph.png')
plt.savefig(acc_graph_path)
plt.close()

print(f"[OK] Graphs saved successfully to:\n  → {loss_graph_path}\n  → {acc_graph_path}\n")