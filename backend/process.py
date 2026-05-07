import sys
from rembg import remove, new_session
from PIL import Image
import os

def process(input_path, output_path):
    try:
        input_image = Image.open(input_path)
        
        # Utilisation du modèle ISNet (plus précis pour les formes complexes et les trous)
        session = new_session("isnet-general-use")
        
        # Amélioration de la qualité avec alpha_matting
        output_image = remove(
            input_image,
            session=session,
            alpha_matting=True,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=10,
            alpha_matting_erode_size=10
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
