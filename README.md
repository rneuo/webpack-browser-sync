# Setup

```
cp -rp .env.sample .env
```

# Execute

```
npm install
npm run dev
```

# Nodeが入ってない人向け

## Homebrew Install

- 以下のコマンドでうまくインストールできない場合は公式のページを見る
    - http://brew.sh/

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

## package Install

```
brew install git nodebrew
```

## Node.js Install

```
nodebrew install-binary v7.0.0
nodebrew use v7.0.0
```

### Settings

```
echo 'export PATH=$HOME/.nodebrew/current/bin:$PATH' >> .bashrc
echo 'export NODEBREW_ROOT=$HOME/.nodebrew' >> .bashrc
source ~/.bashrc
```

