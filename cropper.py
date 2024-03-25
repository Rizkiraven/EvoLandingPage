import cv2
import os
from os.path import join

img_dir = "./assets/img/clients/"

for filename in os.listdir(img_dir):
  if filename.endswith(".jpg") or filename.endswith(".png"):
    img_path = join(img_dir, filename)
    img = cv2.imread(img_path, cv2.IMREAD_UNCHANGED)

    y_coords, x_coords = img.nonzero()[:2]

    x_min, x_max = x_coords.min(), x_coords.max()
    y_min, y_max = y_coords.min(), y_coords.max()

    cropped_img = img[y_min:y_max+1, x_min:x_max+1]

    output_path = join(f'{img_dir}/../clients_cropped', f"{filename}")
    cv2.imwrite(output_path, cropped_img)
    print(f"Cropped image saved: {output_path}")
