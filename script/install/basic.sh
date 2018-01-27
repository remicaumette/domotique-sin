DIR="$(dirname "$0")"

cd $DIR

if [ ![ -x "$(command -v node)"] ]; then
    sh nodejs.sh
fi

if [ ![ -x "$(command -v yarn)"] ]; then
    sh yarn.sh
fi

if [ ![ -x "$(command -v redis-server)"] ]; then
    sh redis.sh
fi

if [ ![ $DIR = "/opt/domotique-sin/script/install" ] ]; then
    echo "Impossible de créer le service systemd"
    exit 1
fi

echo "Installation du service systemd..."
sudo cp domotique-sin.service /etc/systemd/system/
sudo systemctl enable domotique-sin.service

echo "Lancement..."
sudo systemctl start domotique-sin.service
