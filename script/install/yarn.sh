echo "Téléchargement/Installation de Yarn..."
if [ -d "$HOME/.yarn" ]; then
    echo "Suppression de l'ancienne version..."
    rm -rf ~/.yarn
fi
curl -o- -L https://yarnpkg.com/install.sh | bash
