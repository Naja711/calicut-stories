import cv2
import numpy as np
import imageio
from PIL import Image
import os

def create_billowing_smoke_gif(input_image_path, output_gif_path, duration=3.0, fps=15):
    # Load the base image
    base_img = cv2.imread(input_image_path)
    base_img = cv2.cvtColor(base_img, cv2.COLOR_BGR2RGB)
    h, w = base_img.shape[:2]

    # Target pot area (bottom center)
    center_x = int(w * 0.45)
    center_y = int(h * 0.9)
    
    frames = []
    num_frames = int(duration * fps)

    for i in range(num_frames):
        # Create an empty overlay for smoke
        overlay = np.zeros_like(base_img, dtype=np.uint8)
        
        # Calculate animation progress (0 to 1)
        progress = i / num_frames
        
        # Generate multiple smoke particles billowing upwards
        for p in range(5):
            # Particle offset
            offset = (progress + (p / 5.0)) % 1.0
            
            # Size grows as it rises
            radius = int(50 + (offset * 150))
            
            # Position moves up and slightly scatters
            y_pos = int(center_y - (offset * h * 0.6))
            x_pos = int(center_x + (np.sin(offset * np.pi * 2 + p) * 100))
            
            # Alpha fades out as it rises
            alpha = max(0, 1.0 - (offset * 1.5))
            
            # Draw a soft fuzzy circle
            cv2.circle(overlay, (x_pos, y_pos), radius, (220, 200, 200), -1)
            
            # Blur the overlay heavily for smoke effect
            if i % 2 == 0: # Optimize blur frequency
                 overlay = cv2.GaussianBlur(overlay, (99, 99), 0)

        # Blend overlay with base image
        mask = (overlay.sum(axis=2) > 0).astype(float)[:, :, np.newaxis]
        alpha_mask = mask * 0.3 # Max smoke opacity
        
        frame = (base_img * (1 - alpha_mask) + overlay * alpha_mask).astype(np.uint8)
        frames.append(frame)
        
        if i % 5 == 0:
            print(f"Generated frame {i}/{num_frames}")

    # Save as GIF
    print(f"Saving GIF to {output_gif_path}...")
    imageio.mimsave(output_gif_path, frames, fps=fps, format='GIF')
    print("Done!")

if __name__ == "__main__":
    input_path = r"c:\Users\H P\OneDrive\Documents\Desktop\calicut stories\hero_bg_food.png"
    output_path = r"c:\Users\H P\OneDrive\Documents\Desktop\calicut stories\hero_animated.gif"
    
    try:
        create_billowing_smoke_gif(input_path, output_path)
    except Exception as e:
        print(f"Error creating GIF: {e}")
