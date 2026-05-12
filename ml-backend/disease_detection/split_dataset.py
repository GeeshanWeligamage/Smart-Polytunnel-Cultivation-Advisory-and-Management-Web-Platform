"""
Multi-Crop Dataset Splitter
Splits Tomato, Capsicum, and Cucumber disease images into train/test folders.
Run this ONCE before training.
"""

import os
import shutil
import random

# ── Configuration ────────────────────────────────────────────────────────────
BASE_DIR    = os.path.dirname(__file__)
DATASET_DIR = os.path.join(BASE_DIR, 'dataset')
TRAIN_DIR   = os.path.join(DATASET_DIR, 'train')
TEST_DIR    = os.path.join(DATASET_DIR, 'test')
SPLIT_RATIO = 0.8   # 80 % train  |  20 % test

# Source folders (each contains class sub-folders directly)
SOURCE_FOLDERS = {
    'Tomato':   os.path.join(DATASET_DIR, 'tomato'),
    'Capsicum': os.path.join(DATASET_DIR, 'Capsicum'),
    'Cucumber': os.path.join(DATASET_DIR, 'Cucumber'),
}

VALID_EXTS = {'.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'}
# ─────────────────────────────────────────────────────────────────────────────

os.makedirs(TRAIN_DIR, exist_ok=True)
os.makedirs(TEST_DIR,  exist_ok=True)

total_train = 0
total_test  = 0

for crop_name, src_dir in SOURCE_FOLDERS.items():
    if not os.path.exists(src_dir):
        print(f"[SKIP] Source folder not found: {src_dir}")
        continue

    classes = [d for d in os.listdir(src_dir)
               if os.path.isdir(os.path.join(src_dir, d))]

    print(f"\n{'='*55}")
    print(f"  Processing crop : {crop_name}  ({len(classes)} classes)")
    print(f"{'='*55}")

    for cls in classes:
        src_class_path   = os.path.join(src_dir, cls)
        train_class_path = os.path.join(TRAIN_DIR, cls)
        test_class_path  = os.path.join(TEST_DIR,  cls)

        os.makedirs(train_class_path, exist_ok=True)
        os.makedirs(test_class_path,  exist_ok=True)

        images = [f for f in os.listdir(src_class_path)
                  if os.path.splitext(f)[1] in VALID_EXTS]

        if len(images) == 0:
            print(f"  [WARN] No images found in {cls} — skipping.")
            continue

        random.seed(42)
        random.shuffle(images)

        split_idx    = int(len(images) * SPLIT_RATIO)
        train_images = images[:split_idx]
        test_images  = images[split_idx:]

        for img in train_images:
            src  = os.path.join(src_class_path,   img)
            dst  = os.path.join(train_class_path, img)
            if not os.path.exists(dst):
                shutil.copy2(src, dst)

        for img in test_images:
            src = os.path.join(src_class_path,  img)
            dst = os.path.join(test_class_path, img)
            if not os.path.exists(dst):
                shutil.copy2(src, dst)

        print(f"  {cls:<45} train={len(train_images):>4}  test={len(test_images):>4}")
        total_train += len(train_images)
        total_test  += len(test_images)

print(f"\n{'='*55}")
print(f"  Dataset split complete!")
print(f"  Total train images : {total_train}")
print(f"  Total test  images : {total_test}")
print(f"  Train dir  : {TRAIN_DIR}")
print(f"  Test  dir  : {TEST_DIR}")
print(f"{'='*55}")
