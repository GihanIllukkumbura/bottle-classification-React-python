import torch
import torchvision
import os

# Create a directory for models in your project
model_dir = "models"
os.makedirs(model_dir, exist_ok=True)

# Set the torch hub directory to your project folder
torch.hub.set_dir(model_dir)

# Now load the model - it will download to your project/models folder
model = torchvision.models.detection.fasterrcnn_resnet50_fpn(weights="DEFAULT")
model.eval()

# Make the model available for import
__all__ = ['model']

# def load_model():
#     """Load the Faster R-CNN model with custom storage location"""
#     # Use a different directory name
#     model_dir = "model_checkpoints"
#     os.makedirs(model_dir, exist_ok=True)
    
#     # Set the torch hub directory
#     torch.hub.set_dir(model_dir)
    
#     # Load the model
#     model = torchvision.models.detection.fasterrcnn_resnet50_fpn(weights="DEFAULT")
#     model.eval()
#     return model

# # Create the model instance
# model = load_model()