#!/bin/bash
# Создаёт rkt-info-1.0.0.rckt в новом формате Rock_ET
set -e

PKG=$(mktemp -d)
mkdir -p "$PKG"/{bin,data,configs,bash,"source"}

# ── config.yaml ────────────────────────────────────────────────────────────
cat > "$PKG/config.yaml" << 'EOF'
name: rkt-info
version: 1.0.0
description: "Красивая системная информация в стиле Rock_ET"
author: Rock_ET Team
license: MIT

install:
  bin:
    target: "~/.local/bin"
  data:
    target: "~/.local/share/rkt-info"
  configs:
    target: "~/.config/rkt-info"

bash:
  pre_install: []
  post_install:
    - post_install.sh

log:
  level: info
EOF

# ── license.txt ────────────────────────────────────────────────────────────
cat > "$PKG/license.txt" << 'EOF'
MIT License

Copyright (c) 2026 Rock_ET Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
EOF

# ── source/wgets.list ──────────────────────────────────────────────────────
cat > "$PKG/source/wgets.list" << 'EOF'
# Формат: URL ПУТЬ_НАЗНАЧЕНИЯ
# Закомментированные строки и пустые — игнорируются
#
# Пример:
# https://example.com/tool.tar.gz ~/.local/share/rkt-info/tool.tar.gz
#
# В этом пакете загрузки не используются
EOF

# ── bin/rkt-info ───────────────────────────────────────────────────────────
cat > "$PKG/bin/rkt-info" << 'EOF'
#!/bin/bash
# rkt-info — системная информация в стиле Rock_ET

ORANGE='\033[38;5;208m'
CYAN='\033[38;5;39m'
BOLD='\033[1m'
GRAY='\033[38;5;245m'
NC='\033[0m'

printf "\n${ORANGE}${BOLD}  🚀  R O C K _ E T  —  System Info${NC}\n"
printf "${GRAY}  ─────────────────────────────────────────${NC}\n"

row() { printf "  ${CYAN}%-12s${NC} ${BOLD}%s${NC}\n" "$1" "$2"; }

row "OS:"      "$(uname -o 2>/dev/null || uname -s) $(uname -m)"
row "Ядро:"    "$(uname -r)"
row "Хост:"    "$(hostname)"
row "Uptime:"  "$(uptime -p 2>/dev/null || uptime | sed 's/.*up //;s/,.*//')"
row "Shell:"   "$(basename "${SHELL:-?}")"

CPU=$(grep -m1 'model name' /proc/cpuinfo 2>/dev/null | cut -d: -f2 | xargs)
[ -n "$CPU" ] && row "CPU:" "$CPU"

RAM=$(free -h 2>/dev/null | awk '/^Mem:/{printf "%s / %s", $3, $2}')
[ -n "$RAM" ] && row "RAM:" "$RAM"

DISK=$(df -h / 2>/dev/null | awk 'NR==2{printf "%s / %s (%s)", $3, $2, $5}')
[ -n "$DISK" ] && row "Диск:" "$DISK"

printf "${GRAY}  ─────────────────────────────────────────${NC}\n"
printf "  Установлено через ${ORANGE}${BOLD}Rock_ET${NC} 🚀\n\n"
EOF
chmod +x "$PKG/bin/rkt-info"

# ── data/README ────────────────────────────────────────────────────────────
cat > "$PKG/data/README" << 'EOF'
rkt-info — пример Rock_ET пакета
Версия: 1.0.0

Установленные файлы:
  $RCKT_BIN/rkt-info     — основной скрипт
  $RCKT_DATA/README      — этот файл

Использование:
  rkt-info               — показать системную информацию

Удаление:
  rm $RCKT_BIN/rkt-info
  rm -rf $RCKT_DATA
  rm -rf $RCKT_CONFIGS
EOF

# ── configs/default.conf ───────────────────────────────────────────────────
cat > "$PKG/configs/default.conf" << 'EOF'
# rkt-info конфигурация
# Можно расширить список выводимых параметров

SHOW_CPU=true
SHOW_RAM=true
SHOW_DISK=true
SHOW_UPTIME=true
COLOR_SCHEME=default
EOF

# ── bash/post_install.sh ───────────────────────────────────────────────────
cat > "$PKG/bash/post_install.sh" << 'EOF'
#!/bin/bash
# Запускается после установки
# Переменные окружения: $RCKT_BIN, $RCKT_DATA, $RCKT_CONFIGS

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   rkt-info успешно установлен!  ✓        ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "Команда: rkt-info"
echo ""

# Проверяем PATH
if [[ ":$PATH:" != *":$RCKT_BIN:"* ]]; then
  echo "💡 Подсказка: добавьте в ~/.bashrc или ~/.profile:"
  echo "   export PATH=\"\$PATH:$RCKT_BIN\""
fi
EOF
chmod +x "$PKG/bash/post_install.sh"

# ── Собираем .rckt ─────────────────────────────────────────────────────────
OUTPUT="rkt-info-1.0.0.rckt"
tar -czf "$OUTPUT" -C "$PKG" \
  config.yaml license.txt \
  bin data configs bash source

rm -rf "$PKG"

echo "✅ Собрано: $OUTPUT"
ls -lh "$OUTPUT"
echo ""
echo "Структура архива:"
tar -tzf "$OUTPUT"
