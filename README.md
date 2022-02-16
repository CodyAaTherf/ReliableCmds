# I am going to stop working on this project as my exams are going to start and potentially offline school will also come. Don't worry , I am soon ( after exams ) going to make a new version of this.

![GitHub Repo stars](https://img.shields.io:/github/stars/CodyAaTherf/RelaibleCmds?style=social)

# This package is Under Development.

# Table of Contents

- [Installation](#installation)
- [Setup](#installation)
- [Support and Features Request](#support-and-feature-requests)

# Installation

```bash
npm i reliablecmds
```

Want to donwload the dev build? Warning - There might be constant feature changes and some might not work + doc could also not be updated so use at your own risk ...
```bash
npm i github:CodyAaTherf/ReliableCmds#dev
```

# Setup

After you have installed ReliableCmds you need to initilize ReliableCmds in your project:

```JS
const Discord = require('discord.js);
const ReliableCmds = require('reliablecmds');
const { token } = require('config.json');

const client = new Discord.Client();

client.on('ready' , () => {
    console.log(`${client.user.tag} has logged in!`);

    new ReliableCmds(client);
})

client.login(token);
```

You can specify your commands folder by doing-
```js
new ReliableCmds(client , 'bot-commands`);
```

If you leave the `commands` field blank it will default to `commands`.

# Support and Feature Requests

If you have any ideas feel free to share them at my socials -
- [Discord](https://discord.com) - probably araaa#5812
- Email - aatherfgamerplayzs@gmail.com
