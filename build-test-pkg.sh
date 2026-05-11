#!/bin/bash

# Create a temporary directory for the package
PKG_DIR=$(mktemp -d)

# 1. Create manifest.json
cat << 'EOF' > "$PKG_DIR/manifest.json"
{
  "name": "hello-rocket",
  "version": "1.0.0",
  "description": "A sample Rock_ET package"
}
EOF

# 2. Create install.sh (This will be executed inside the target environment)
cat << 'EOF' > "$PKG_DIR/install.sh"
#!/bin/bash
TARGET_DIR=$1
echo "Installing to $TARGET_DIR..."

mkdir -p "$TARGET_DIR"

# Create a simple hello script
cat << 'INNER_EOF' > "$TARGET_DIR/hello"
#!/bin/bash
echo "Hello from Rock_ET package!"
INNER_EOF

chmod +x "$TARGET_DIR/hello"

echo "Installation complete!"
EOF

chmod +x "$PKG_DIR/install.sh"

# 3. Create the .rckt archive using tar
tar -czvf hello-rocket.rckt -C "$PKG_DIR" manifest.json install.sh

# Cleanup
rm -rf "$PKG_DIR"

echo "Created hello-rocket.rckt"
