<div align="center">

# 🚀 Rock_ET

**Менеджер пакетов нового поколения для Linux**

*Видишь всё до установки — скрипты, файлы, риски. Изоляция через bubblewrap.*

[![Electron](https://img.shields.io/badge/Electron-32-47848F?logo=electron)](https://electronjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## Что такое Rock_ET?

Rock_ET — десктопный менеджер пакетов в формате `.rckt` для Linux с прозрачным процессом установки. Перед тем как что-то попадёт на систему, ты видишь:

- **Каждый файл** и куда он пойдёт
- **Все скрипты** (pre/post install) с автоматическим анализом опасных паттернов
- **Сетевые загрузки** с sha256-верификацией
- **Изоляцию через bubblewrap** — sandbox-приложения не видят твой home и систему

## Возможности

| Функция | Описание |
|---------|----------|
| 📋 **Превью до установки** | Видишь каждый файл и действие прежде чем нажать «Установить» |
| 🔍 **Анализ скриптов** | Подсвечиваем `sudo`, `curl\|bash`, `~/.ssh`, `rm -rf` и другие опасные паттерны |
| 🔒 **Sandbox (bwrap)** | Изоляция через bubblewrap — X11/Wayland, сеть, home — всё настраивается |
| 📡 **Каталог пакетов** | Браузер пакетов из GitHub-репозитория с поиском и категориями |
| ♻️ **Чистое удаление** | Реестр знает все файлы — удаление без «хвостов» |
| 🎨 **Темы** | Dark, AMOLED, Nord, Catppuccin Mocha |
| ✅ **sha256 чексуммы** | Верификация загружаемых файлов |

## Установка

### Зависимости

```bash
# Debian/Ubuntu
sudo apt install bubblewrap

# Arch Linux
sudo pacman -S bubblewrap

# Fedora
sudo dnf install bubblewrap
```

### Скачать готовый бинарник

Releases → скоро

### Собрать из исходников

```bash
# 1. Клонируй репозиторий
git clone https://github.com/Halva-developer/Rock_ET.git
cd Rock_ET/rocket-app

# 2. Установи зависимости
npm install

# 3. Запусти в режиме разработки
npm run dev

# 4. Собери AppImage / deb
npm run build
```

**Требования:** Node.js 20+, npm 9+

## Формат пакета `.rckt`

`.rckt` — tar.gz архив со строгой структурой:

```
myapp.rckt (tar.gz)
├── config.yaml          # обязательный манифест
├── info.txt             # описание от автора
├── bin/                 # исполняемые файлы
├── bash/
│   ├── pre_install.sh
│   ├── post_install.sh
│   ├── pre_uninstall.sh
│   └── post_uninstall.sh
├── libs/                # bundled .so для sandbox-изоляции
├── data/                # данные приложения
├── configs/             # конфигурационные файлы
└── source/
    └── wgets.list       # URL dest [sha256:HASH]
```

### config.yaml

```yaml
rckt_version: 1
name: myapp
version: 1.0.0
description: Краткое описание
author: YourName
license: MIT
icon: 🚀

depends:
  - python3

sandbox:
  enabled: true
  permissions:
    network: false
    home: readonly
    display: true
    audio: true

bash:
  post_install:
    - post_install.sh

verified_on:
  - Ubuntu 24.04
  - Arch Linux
```

### wgets.list

```
https://example.com/file.tar.gz  data/file.tar.gz  sha256:abc123...
```

## Режимы установки

| Режим | Путь | Изоляция |
|-------|------|----------|
| **Sandbox** | `~/.local/share/rock-et/apps/{name}/` | bwrap launcher в `~/.local/bin/` |
| **Global** | `/usr/local/bin/` | нет (требует pkexec) |

## Структура проекта

```
rocket-app/
├── electron/
│   ├── main.ts          # Electron main process + IPC хендлеры
│   └── preload.cjs      # contextBridge (CJS)
├── src/
│   ├── App.tsx          # весь React UI
│   ├── App.css          # стили + 4 темы
│   └── vite-env.d.ts    # TypeScript интерфейсы
├── package.json
└── vite.config.ts
```

## Репозиторий пакетов

Официальный каталог: [Halva-developer/ROCK_ET-packages-](https://github.com/Halva-developer/ROCK_ET-packages-)

## Лицензия

MIT © Halva-developer
