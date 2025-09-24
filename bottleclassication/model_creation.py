# train_material_classifier.py
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader
import os

def train_material_classifier(data_dir, save_path="bottle_material_classifier.pth"):
    # Data transformations
    data_transforms = {
        'train': transforms.Compose([
            transforms.RandomResizedCrop(224),
            transforms.RandomHorizontalFlip(),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
        'val': transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
    }
    
    # Create datasets
    image_datasets = {
        x: datasets.ImageFolder(os.path.join(data_dir, x), data_transforms[x])
        for x in ['train', 'val']
    }
    
    # Create dataloaders
    dataloaders = {
        x: DataLoader(image_datasets[x], batch_size=4, shuffle=True, num_workers=4)
        for x in ['train', 'val']
    }
    
    # Load pre-trained ResNet
    model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, 3)  # 3 classes: glass, metal, plastic
    
    # Loss function and optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.SGD(model.parameters(), lr=0.001, momentum=0.9)
    
    # Training loop (simplified)
    num_epochs = 25
    for epoch in range(num_epochs):
        # Training phase
        model.train()
        running_loss = 0.0
        running_corrects = 0
        
        for inputs, labels in dataloaders['train']:
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            _, preds = torch.max(outputs, 1)
            running_loss += loss.item() * inputs.size(0)
            running_corrects += torch.sum(preds == labels.data)
        
        epoch_loss = running_loss / len(image_datasets['train'])
        epoch_acc = running_corrects.double() / len(image_datasets['train'])
        
        print(f'Epoch {epoch}/{num_epochs - 1} - Train Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}')
    
    # Save the model
    torch.save(model.state_dict(), save_path)
    print(f"Model saved to {save_path}")
    
    return model

# To use this, you would need a dataset structure like:
# data/
#   train/
#     glass/
#       img1.jpg, img2.jpg, ...
#     metal/
#       img1.jpg, img2.jpg, ...
#     plastic/
#       img1.jpg, img2.jpg, ...
#   val/
#     glass/
#       img1.jpg, img2.jpg, ...
#     metal/
#       img1.jpg, img2.jpg, ...
#     plastic/
#       img1.jpg, img2.jpg, ...