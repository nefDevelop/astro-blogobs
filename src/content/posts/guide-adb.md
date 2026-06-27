---
title: Guia ADB
published: 2026-06-27
description: Como se gestiona adb desde terminal.
tags:
  - terminal
category: Terminal
draft: false
---

# ADB

##  Conexión por red (ADB over TCP/IP)

###  Conectar dispositivo por USB (desde Local)
```bash
# Habilitar ADB en modo TCP/IP
adb tcpip 5555

# Obtener IP del dispositivo
adb shell ip route | grep -oP 'src \K[\d.]+'
# Alternativa:
adb shell ifconfig | grep -oP 'inet addr:\K[\d.]+(?= B)'
```

###  Conectar desde el contenedor
```bash
adb connect <IP_DEL_MOVIL>:5555

# Verificar conexión
adb devices
```

---

## Compilación e Instalación

### Compilar APK (Kotlin/Android)
```bash
# Limpiar y compilar en modo debug
./gradlew clean assembleDebug

# O compilar y generar APK firmado (release)
./gradlew assembleRelease
```

### Instalar en dispositivo
```bash
# Instalar/actualizar app
adb install -r app/build/outputs/apk/debug/app-debug.apk

# Si falla, forzar reinstalación
adb install -r -d app/build/outputs/apk/debug/app-debug.apk
```

---

## 📊 Logs y Depuración

### Ver logs filtrados
```bash
# Filtrar por tag (reemplaza "laukot" por tu tag)
adb logcat -d | grep -i "laukot"

# Logs en tiempo real con colores (mejor visualización)
adb logcat -v color | grep -i "laukot"

# Logs con timestamp y filtro por nivel (E=Error, W=Warning, I=Info, D=Debug)
adb logcat -d -s "laukot:I" | grep -i "laukot"

# Guardar logs en archivo
adb logcat -d > logs_$(date +%Y%m%d_%H%M%S).txt
```

### Logs avanzados
```bash
# Limpiar logs antes de ejecutar
adb logcat -c

# Ejecutar app y capturar logs específicos
adb shell am start -n com.tu.paquete/.MainActivity
adb logcat -v threadtime | grep -E "(laukot|ERROR|FATAL)"
```

---

## 🔄 Script Automatizado

Guarda esto como `deploy.sh`:

```bash
#!/bin/bash

# Variables
PACKAGE="com.tu.app"
ACTIVITY=".MainActivity"
APK_PATH="app/build/outputs/apk/debug/app-debug.apk"

# Obtener IP del dispositivo
IP=$(adb shell ip route | grep -oP 'src \K[\d.]+' | head -1)

echo "📱 Conectando a: $IP"

# Conectar
adb connect $IP:5555
sleep 2

# Compilar
echo "🔨 Compilando..."
./gradlew clean assembleDebug

# Instalar
echo "📦 Instalando..."
adb install -r $APK_PATH

# Iniciar app
echo "🚀 Iniciando app..."
adb shell am start -n $PACKAGE/$ACTIVITY

# Ver logs
echo "📊 Mostrando logs..."
adb logcat -v color | grep -i "laukot"
```

---

## Comandos útiles adicionales

```bash
# Listar dispositivos conectados
adb devices -l

# Reiniciar servidor ADB
adb kill-server && adb start-server

# Desconectar dispositivo
adb disconnect <IP>:5555

# Ver paquetes instalados
adb shell pm list packages | grep "tuapp"

# Desinstalar app
adb uninstall com.tu.paquete

# Hacer screenshot
adb exec-out screencap -p > screenshot.png

# Grabar pantalla
adb shell screenrecord /sdcard/video.mp4
```
