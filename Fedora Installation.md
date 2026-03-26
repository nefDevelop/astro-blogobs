---
title: Cosas que hago cuando instalo Fedora
draft: false
tags:
  - Fedora
  - Linux
---
# Guía de Instalación y Configuración para Fedora 43

## Instalación y Particionado

**Esquema de Particionado (UEFI)**

| Partición | Punto de Montaje | Tamaño | Sistema de Archivos |
| :--- | :--- | :--- | :--- |
| EFI | /boot/efi | 1 GB | FAT32 |
| Boot | /boot | 1 GB | ext4 |
| Root | / | Restante | btrfs/ext4 |
| Swap | swap | 2-8 GB (opcional) | swap |

*Nota:* Fedora usa Btrfs por defecto. Para usar ext4, elige "Particionado personalizado" durante la instalación.

---

## Repositorios Esenciales

1.  **RPM Fusion**
    ```bash
    sudo dnf install https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm
    sudo dnf install https://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
    ```

2.  **Terra Repository**
    ```bash
    sudo dnf install --nogpgcheck --repofrompath 'terra,https://repos.fyralabs.com/terra43' terra-release
    sudo dnf group upgrade core
    ```

3.  **Habilitar COPR (Opcional)**
    ```bash
    sudo dnf install dnf-plugins-core
    ```

---

## Multimedia y Codecs

```bash
# Grupo multimedia completo
sudo dnf group install multimedia

# Reemplazar ffmpeg-free con ffmpeg completo
sudo dnf swap ffmpeg-free ffmpeg --allowerasing

# Componentes GStreamer
sudo dnf install gstreamer1-plugins-{bad-*,good-*,base} gstreamer1-plugin-openh264 gstreamer1-libav --exclude=PackageKit-gstreamer-plugin

# Paquetes de sonido y video
sudo dnf group install sound-and-video

# Soporte para DVDs cifrados (opcional)
sudo dnf install libdvdcss
```

---

## Optimizaciones del Sistema

1.  **Configuración de DNF**
    ```bash
    echo -e "[main]\ngpgcheck=1\ninstallonly_limit=3\nclean_requirements_on_remove=True\nbest=False\nskip_if_unavailable=True\nmax_parallel_downloads=10\nfastestmirror=True" | sudo tee -a /etc/dnf/dnf.conf
    ```

2.  **Deshabilitar Mitigaciones de CPU (Solo para sistemas personales)**
    ```bash
    sudo grubby --update-kernel=ALL --args="mitigations=off"
    ```

3.  **Reducir Tiempo de Arranque**
    ```bash
    sudo systemctl disable NetworkManager-wait-online.service
    ```

4.  **Deshabilitar Inicio Automático de GNOME Software**
    ```bash
    sudo rm -f /etc/xdg/autostart/org.gnome.Software.desktop
    ```

5.  **Suspensión Moderna (Mejor batería en laptops)**
    ```bash
    sudo grubby --update-kernel=ALL --args="mem_sleep_default=s2idle"
    # Verificar: cat /sys/power/mem_sleep
    ```

---

## Drivers AMD

```bash
sudo dnf swap mesa-va-drivers mesa-va-drivers-freeworld
sudo dnf swap mesa-vdpau-drivers mesa-vdpau-drivers-freeworld
```

---

# Configuración del Sistema

*   **Hostname**
    ```bash
    sudo hostnamectl set-hostname mi-equipo-fedora
    ```

*   **Hora UTC (Doble Boot con Windows)**
    ```bash
    timedatectl set-local-rtc 1 --adjust-system-clock
    timedatectl  # Verificar
    ```

*   **Teclado US Internacional**
    ```bash
    # Configuración temporal
    setxkbmap -layout us -variant altgr-intl
    # Configuración permanente
    sudo localectl set-x11-keymap us altgr-intl
    ```

*   **Automontar Discos al Inicio**
    ```bash
    # 1. Obtener UUID: lsblk -f
    # 2. Crear punto de montaje: sudo mkdir -p /media/mi_disco
    # 3. Editar /etc/fstab: Añadir línea: UUID=tu-uuid /media/mi_disco ntfs-3g defaults 0 2
    # 4. Probar montaje: sudo mount -a
    ```

---

## Aplicaciones Esenciales

**Herramientas Base**
```bash
sudo dnf install -y git wget curl micro rsync htop btop neofetch unzip gcc make fuse fuse-libs perl-Image-ExifTool clutter zenity dialog yazi fish
```

**Aplicaciones Gráficas**
```bash
# Visual Studio Code
sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
sudo sh -c 'echo -e "[code]\nname=Visual Studio Code\nbaseurl=https://packages.microsoft.com/yumrepos/vscode\nenabled=1\ngpgcheck=1\ngpgkey=https://packages.microsoft.com/keys/microsoft.asc" > /etc/yum.repos.d/vscode.repo'
sudo dnf install code

# Calibre
sudo dnf install calibre

# LocalSend
flatpak install flathub org.localsend.localsend_app
```

**Navegadores Web**
```bash
# Zen Browser
flatpak install flathub app.zen_browser.zen
```

---

## Desarrollo y Herramientas CLI

**Git**
```bash
git config --global user.name "tu_usuario"
git config --global user.email "tu_email@example.com"
git config --global init.defaultBranch main
git config --global credential.helper store  # Almacena token/password (texto plano) peligroso
```

**Starship (Prompt)**
```bash
curl -sS https://starship.rs/install.sh | sh
echo 'starship init fish | source' >> ~/.config/fish/config.fish
```

**Herramientas en Rust**
```bash
# Instalar Rust primero (ver sección Rust)
cargo install xcp macchina bottom --locked typst-cli
```

**YADM (Gestor de dotfiles)**
```bash
sudo curl -fLo /usr/local/bin/yadm https://github.com/yadm-dev/yadm/raw/master/yadm && sudo chmod a+x /usr/local/bin/yadm
```

---

## Rust y Cargo

**Instalación**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.bashrc  # o ~/.config/fish/config.fish para Fish
```

**Agregar Cargo al PATH (si es necesario)**
```bash
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
# Para Fish: echo 'set -gx PATH $HOME/.cargo/bin $PATH' >> ~/.config/fish/config.fish
```

---

## Flatpak

**Habilitar Flathub**
```bash
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
```

**Aplicaciones Recomendadas**
```bash
flatpak install flathub com.mattjakeman.ExtensionManager net.codelogistics.webapps app.zen_browser.zen org.localsend.localsend_app
```

---

## Docker

**Instalación**
```bash
# 1. Eliminar versiones antiguas
sudo dnf remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-selinux docker-engine-selinux docker-engine

# 2. Agregar repositorio
sudo dnf -y install dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo

# 3. Instalar Docker Engine
sudo dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 4. Iniciar Docker
sudo systemctl start docker
sudo docker run hello-world
```

**Docker sin sudo**
```bash
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```

**Docker al inicio del sistema**
```bash
# Habilitar
sudo systemctl enable docker.service containerd.service
# Deshabilitar (opcional)
# sudo systemctl disable docker.service containerd.service
```

---

## Personalización

1.  **Tema Dracula para Micro Editor**
    ```bash
    mkdir -p ~/.config/micro/colorschemes
    curl -o ~/.config/micro/colorschemes/dracula.micro https://raw.githubusercontent.com/dracula/micro/master/dracula.micro
    echo 'export MICRO_TRUECOLOR=1' >> ~/.bashrc  # o config.fish
    # En micro: Ctrl+E > set colorscheme dracula
    ```

2.  **Fondo de pantalla dinámico (Waypaper)**
    ```bash
    sudo dnf copr enable solopasha/hyprland
    sudo dnf install waypaper
    ```

3.  **Niri (Compositor Wayland)**
    ```bash
    sudo dnf copr enable yopito/niri
    sudo dnf install niri
    ```


---

## Mantenimiento

**Actualizaciones Automáticas**
```bash
sudo dnf install dnf-automatic
# Configurar en /etc/dnf/automatic.conf
sudo systemctl enable --now dnf-automatic.timer
```

**Limpieza Periódica**
```bash
sudo dnf clean all
sudo dnf autoremove
```

---
