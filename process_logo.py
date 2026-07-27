from PIL import Image
import sys
import os

def process_logo(img_path, out_path):
    if not os.path.exists(img_path):
        print(f"Error: {img_path} not found.")
        return
        
    img = Image.open(img_path)
    img = img.convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # if white or near white, make it transparent
        if item[0] > 235 and item[1] > 235 and item[2] > 235:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(out_path, "PNG")
    print(f"Successfully processed logo and saved to {out_path}")

if __name__ == "__main__":
    process_logo('logo.png', 'public/logo-transparent.png')
