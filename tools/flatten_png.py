# Flattens the generated icons to opaque RGB PNGs (iOS home-screen icons must not have transparency).
import glob
from PIL import Image
for f in sorted(glob.glob('*.png')):
    Image.open(f).convert('RGB').save(f, optimize=True)
    print('flattened', f)
