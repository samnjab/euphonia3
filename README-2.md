Running vercel dev environment locally:

Make sure vercel is installed globally. 

mkdir ~/.npm-global
export NPM_CONFIG_PREFIX=~/.npm-global
export PATH=$PATH:~/.npm-global/bin
echo -e "export NPM_CONFIG_PREFIX=~/.npm-global\nexport PATH=$PATH:~/.npm-global/bin" >> ~/.bashrc

npm i -g vercel

run:
vercel dev 