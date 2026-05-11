import os
import json
import torch
import torch.nn as nn
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader

# Configuration
DATASET_DIR = os.path.join(os.path.dirname(__file__), 'dataset', 'test')
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'tomato_disease_model.pth')
CLASSES_PATH = os.path.join(os.path.dirname(__file__), 'tomato_disease_classes.json')
IMAGE_SIZE = 224
BATCH_SIZE = 64

print("Loading settings...")
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

# Load classes
if not os.path.exists(CLASSES_PATH):
    print("Error: Classes file not found.")
    exit()

with open(CLASSES_PATH, 'r') as f:
    class_names = json.load(f)
num_classes = len(class_names)

# Define transform (Same as validation transform in training)
val_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Load dataset
print("Loading dataset...")
full_dataset = datasets.ImageFolder(root=DATASET_DIR, transform=val_transform)

# We want to test on the entire dataset (or just validation if you had a separate folder)
# Here we will just test on a subset to show accuracy quickly.
test_loader = DataLoader(full_dataset, batch_size=BATCH_SIZE, shuffle=False)

# Build Model structure
print("Building model architecture...")
model = models.mobilenet_v2(weights=None)
model.classifier = nn.Sequential(
    nn.Dropout(0.3),
    nn.Linear(model.last_channel, 256),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(256, num_classes)
)

# Load trained weights
print("Loading trained weights...")
model.load_state_dict(torch.load(MODEL_PATH, map_location=device, weights_only=True))
model.to(device)
model.eval()

# Evaluate
print("\nEvaluating model. This will take a few minutes depending on your CPU/GPU...")
correct = 0
total = 0

with torch.no_grad():
    for i, (images, labels) in enumerate(test_loader):
        images, labels = images.to(device), labels.to(device)
        
        outputs = model(images)
        _, predicted = torch.max(outputs, 1)
        
        total += labels.size(0)
        correct += (predicted == labels).sum().item()
        
        # Print progress every 10 batches
        if (i + 1) % 10 == 0:
            print(f"  Tested {total} images...")

accuracy = 100.0 * correct / total

print("\n" + "="*50)
print("             EVALUATION REPORT")
print("="*50)
print(f"Total Images Tested : {total}")
print(f"Correct Predictions : {correct}")
print(f"Overall Accuracy    : {accuracy:.2f}%")
print("="*50)
