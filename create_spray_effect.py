#!/usr/bin/env python3
"""
Create spray paint effect image for PAPYRUS CLI
Silver/white color on dark background
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import random
import os

# Image dimensions
WIDTH = 1000
HEIGHT = 600
BG_COLOR = (15, 15, 20)  # Dark background

# Silver/white color variations for spray effect
SILVER_COLORS = [
    (220, 220, 230),  # Light silver
    (200, 200, 210),  # Silver
    (180, 180, 190),  # Medium silver
    (240, 240, 250),  # White silver
    (160, 160, 170),  # Dark silver
]

def create_noise_layer(width, height, intensity=30):
    """Create noise texture for spray effect"""
    noise = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    pixels = noise.load()
    
    for x in range(width):
        for y in range(height):
            if random.random() < 0.3:
                alpha = random.randint(0, intensity)
                color = random.choice(SILVER_COLORS)
                pixels[x, y] = (*color, alpha)
    
    return noise

def draw_spray_text(draw, text, y_position, font_size, center_x):
    """Draw text with spray paint effect"""
    # Try to use a bold font
    font_paths = [
        "C:/Windows/Fonts/impact.ttf",
        "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/calibrib.ttf",
    ]
    
    font = None
    for path in font_paths:
        if os.path.exists(path):
            try:
                font = ImageFont.truetype(path, font_size)
                break
            except:
                continue
    
    if font is None:
        font = ImageFont.load_default()
    
    # Get text bounding box
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = center_x - text_width // 2
    y = y_position
    
    # Draw multiple layers for spray effect
    # Layer 1: Outer glow (darker silver, blurred)
    for offset in range(15, 5, -2):
        color = (100, 100, 110, 50)
        for dx in [-offset, 0, offset]:
            for dy in [-offset, 0, offset]:
                draw.text((x + dx, y + dy), text, font=font, fill=color[:3])
    
    # Layer 2: Main text with spray dots
    for i in range(200):  # Spray dots
        dx = random.randint(-8, 8)
        dy = random.randint(-8, 8)
        color = random.choice(SILVER_COLORS)
        alpha = random.randint(150, 255)
        draw.text((x + dx, y + dy), text, font=font, fill=color)
    
    # Layer 3: Sharp center text
    draw.text((x, y), text, font=font, fill=(245, 245, 255))
    
    return text_height

def add_spray_particles(image, text_area, num_particles=500):
    """Add spray paint particles around text"""
    pixels = image.load()
    width, height = image.size
    
    for _ in range(num_particles):
        x = random.randint(50, width - 50)
        y = random.randint(50, height - 50)
        
        # Random particle size
        size = random.randint(1, 3)
        color = random.choice(SILVER_COLORS)
        alpha = random.randint(50, 200)
        
        # Draw particle
        for dx in range(-size, size + 1):
            for dy in range(-size, size + 1):
                px, py = x + dx, y + dy
                if 0 <= px < width and 0 <= py < height:
                    if random.random() < 0.7:
                        pixels[px, py] = color

def create_papyrus_cli_image():
    """Create the PAPYRUS CLI spray effect image"""
    # Create base image
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    center_x = WIDTH // 2
    
    # Add subtle noise to background
    noise = create_noise_layer(WIDTH, HEIGHT, 20)
    img.paste(noise, (0, 0), noise)
    
    # Draw PAPYRUS (first line)
    line1_height = draw_spray_text(draw, "PAPYRUS", 120, 140, center_x)
    
    # Draw CLI (second line, larger)
    line2_height = draw_spray_text(draw, "CLI", 300, 180, center_x)
    
    # Add spray particles around text
    add_spray_particles(img, None, num_particles=800)
    
    # Add some larger splatter marks
    for _ in range(20):
        x = random.randint(100, WIDTH - 100)
        y = random.randint(100, HEIGHT - 100)
        size = random.randint(5, 15)
        color = random.choice(SILVER_COLORS)
        
        # Draw irregular splatter
        for _ in range(size):
            dx = random.randint(-size, size)
            dy = random.randint(-size, size)
            if dx*dx + dy*dy <= size*size:
                if 0 <= x + dx < WIDTH and 0 <= y + dy < HEIGHT:
                    img.putpixel((x + dx, y + dy), color)
    
    # Slight blur for spray feel
    img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
    
    # Re-sharpen the text a bit
    enhancer = ImageDraw.Draw(img)
    
    return img

def main():
    # Create image
    image = create_papyrus_cli_image()
    
    # Save to downloads folder
    output_path = os.path.expanduser("~/Downloads/PAPYRUS_CLI_spray.png")
    image.save(output_path, "PNG", quality=95)
    print(f"Image saved to: {output_path}")
    
    # Also save to current directory
    local_path = "PAPYRUS_CLI_spray.png"
    image.save(local_path, "PNG", quality=95)
    print(f"Image also saved to: {local_path}")

if __name__ == "__main__":
    main()
