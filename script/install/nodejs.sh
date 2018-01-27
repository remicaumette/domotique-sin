cd /tmp

echo "Téléchargement de NodeJS..."
wget https://nodejs.org/dist/v9.4.0/node-v9.4.0-linux-armv6l.tar.xz -O node.tar.xz

echo "Extraction..."
tar xvf node.tar.xz
rm -f node.tar.xz

if [ -d "/opt/node" ]; then
    echo "Suppression de l'ancienne version..."
    sudo rm -rf /opt/node
    sudo rm -f /usr/bin/node /usr/sbin/node /sbin/node /sbin/node /usr/local/bin/node /usr/bin/npm /usr/sbin/npm /sbin/npm /usr/local/bin/npm
fi

echo "Installation..."
sudo mv node-v*.*.*-linux-armv6l /opt/nodejs

sudo ln -s /opt/nodejs/bin/node /usr/bin/node
sudo ln -s /opt/nodejs/bin/node /usr/sbin/node
sudo ln -s /opt/nodejs/bin/node /sbin/node
sudo ln -s /opt/nodejs/bin/node /usr/local/bin/node
sudo ln -s /opt/nodejs/bin/npm /usr/bin/npm
sudo ln -s /opt/nodejs/bin/npm /usr/sbin/npm
sudo ln -s /opt/nodejs/bin/npm /sbin/npm
sudo ln -s /opt/nodejs/bin/npm /usr/local/bin/npm
