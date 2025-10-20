#!/bin/bash

# Ruta de la carpeta con las imágenes
SRC_DIR="./public/images"
# Carpeta donde se guardarán las imágenes WebP
DEST_DIR="$SRC_DIR/webp"

# Crear carpeta de destino si no existe
mkdir -p "$DEST_DIR"

# Convertir todos los archivos JPG a WebP con calidad 80
for img in "$SRC_DIR"/*.jpg; do
    # Obtener solo el nombre del archivo sin extensión
    filename=$(basename "$img" .jpg)
    # Convertir a WebP
    magick "$img" -quality 80 "$DEST_DIR/$filename.webp"
    echo "Convertido: $img -> $DEST_DIR/$filename.webp"
done

echo "✅ Todas las imágenes JPG se han convertido a WebP."
