import sys
from rembg import remove, new_session
from PIL import Image
import os

def process(input_path, output_path):
    try:
        input_image = Image.open(input_path)
        
        # Utilisation du modèle standard u2net (plus léger en RAM que isnet)
        session = new_session("u2net")
        
        # Traitement simple sans alpha_matting pour économiser la RAM sur le plan gratuit
        output_image = remove(
            input_image,
            session=session
        )
        output_image.save(output_path)
        print("SUCCESS")
    except Exception as e:
        print(f"ERROR: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python process.py <input> <output>")
        sys.exit(1)
    process(sys.argv[1], sys.argv[2])
