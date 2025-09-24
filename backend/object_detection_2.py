import torch
import torchvision.transforms as T
from PIL import Image
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import cv2
import numpy as np
from model import model  # Your Faster R-CNN model

# Additional imports for material classification
from torchvision.models import resnet50, ResNet50_Weights
import torch.nn as nn

class BottleMaterialClassifier(nn.Module):
    def __init__(self, num_classes=3):
        super(BottleMaterialClassifier, self).__init__()
        self.resnet = resnet50(weights=ResNet50_Weights.DEFAULT)
        # Replace the final layer for our classification task
        num_features = self.resnet.fc.in_features
        self.resnet.fc = nn.Linear(num_features, num_classes)
        
    def forward(self, x):
        return self.resnet(x)

def load_material_classifier(checkpoint_path=None):
    """Load the bottle material classifier"""
    model = BottleMaterialClassifier(num_classes=3)  # glass, metal, plastic
    if checkpoint_path:
        model.load_state_dict(torch.load(checkpoint_path, map_location='cpu'))
    model.eval()
    return model

# Material labels
material_labels = {0: "Glass", 1: "Metal", 2: "Plastic"}

def detect_bottles_and_materials(img_path, material_model=None):
    """Detect bottles and classify their materials"""
    # Transformation
    transform = T.Compose([T.ToTensor()])
    
    # Load your image
    img = Image.open(img_path).convert("RGB")
    img_tensor = transform(img)

    # Run detection
    with torch.no_grad():
        preds = model([img_tensor])

    # Extract predictions
    boxes = preds[0]["boxes"]
    labels = preds[0]["labels"]
    scores = preds[0]["scores"]

    # Prepare material classification transform
    material_transform = T.Compose([
        T.Resize((224, 224)),
        T.ToTensor(),
        T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    
    # COCO bottle class id = 44
    fig, ax = plt.subplots(1, figsize=(10, 10))
    ax.imshow(img)

    bottle_count = 0
    for box, label, score in zip(boxes, labels, scores):
        if label.item() == 44 and score > 0.5:  # 44 = bottle
            bottle_count += 1
            x1, y1, x2, y2 = box.tolist()
            
            # Crop the bottle region for material classification
            if material_model:
                bottle_region = img.crop((x1, y1, x2, y2))
                bottle_tensor = material_transform(bottle_region).unsqueeze(0)
                
                # Classify material
                with torch.no_grad():
                    material_output = material_model(bottle_tensor)
                    material_pred = torch.argmax(material_output, dim=1).item()
                    material_name = material_labels.get(material_pred, "Unknown")
                
                label_text = f"Bottle({material_name}): {score:.2f}"
                color = 'red'
            else:
                label_text = f"Bottle: {score:.2f}"
                color = 'red'
                material_name = "Unknown"
            
            rect = patches.Rectangle((x1, y1), x2-x1, y2-y1, linewidth=2, 
                                   edgecolor=color, facecolor='none')
            ax.add_patch(rect)
            ax.text(x1, y1-10, label_text, color=color, fontsize=12, backgroundcolor="white")

    print(f"Detected {bottle_count} bottles")
    plt.show()

def main():
    # For now, we'll run without material classification
    # If you train a material classifier, load it here:
    # material_model = load_material_classifier("path_to_trained_model.pth")
    
    img_path = r"C:\Users\WW\Downloads\WhatsApp Image 2025-09-06 at 21.42.28_9101e441.jpg"
    detect_bottles_and_materials(img_path)  #, material_model)

if __name__ == "__main__":
    main()